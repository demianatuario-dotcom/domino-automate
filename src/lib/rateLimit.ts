import crypto from 'node:crypto';
import net from 'node:net';
import { getPool, sanitizeDbErrorMessage } from './db.ts';

export interface RateLimitPolicy {
  namespace: 'chat' | 'quote' | 'comments';
  windowMs: number;
  maxRequests: number;
  maxConcurrent?: number;
  vertical?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAtMs: number;
  retryAfterSec: number;
  source?: 'redis-lua' | 'postgres-advisory-lock' | 'local-emergency' | 'local-memory';
}

interface SlidingWindowEntry {
  timestamps: number[];
  activeConcurrent: number;
}

export interface FinOpsMetricsSnapshot {
  chatConsumptionByVertical: Record<string, number>;
  blockedByNamespace: Record<string, number>;
  degradedFallbacks: number;
}

const MAX_LOCAL_STORE_SIZE = 5000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_CHAT_GLOBAL_DAILY_LIMIT = 1500;
const CHAT_EMERGENCY_DAILY_LIMIT = 100;

/**
 * Atomic Lua script for Redis sliding window rate limiting:
 * KEYS[1] = rate limit key
 * ARGV[1] = now (ms)
 * ARGV[2] = windowMs
 * ARGV[3] = maxRequests
 * ARGV[4] = unique request member ID
 * Returns: { allowed (1|0), currentCount, oldestTimestampMs }
 */
export const REDIS_SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local maxReq = tonumber(ARGV[3])
local member = ARGV[4]
local windowStart = now - windowMs

redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)
local currentCount = redis.call('ZCARD', key)

if currentCount >= maxReq then
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local oldestTs = now
  if oldest and oldest[2] then
    oldestTs = tonumber(oldest[2])
  end
  return {0, currentCount, oldestTs}
end

redis.call('ZADD', key, now, member)
redis.call('PEXPIRE', key, windowMs)
return {1, currentCount + 1, now}
`;

declare global {
  var __dominoRateLimitStore: Map<string, SlidingWindowEntry> | undefined;
  var __dominoPgRateTableInitialized: boolean | undefined;
  var __dominoKeyMutexes: Map<string, Promise<void>> | undefined;
  var __dominoFinOpsMetrics: FinOpsMetricsSnapshot | undefined;
  var __dominoCircuitBreakers: Map<
    string,
    { failures: number; openedAt: number | null }
  > | undefined;
}

function getLocalStore(): Map<string, SlidingWindowEntry> {
  if (!global.__dominoRateLimitStore) {
    global.__dominoRateLimitStore = new Map();
  }
  return global.__dominoRateLimitStore;
}

function getFinOpsStore(): FinOpsMetricsSnapshot {
  if (!global.__dominoFinOpsMetrics) {
    global.__dominoFinOpsMetrics = {
      chatConsumptionByVertical: {},
      blockedByNamespace: { chat: 0, quote: 0, comments: 0 },
      degradedFallbacks: 0,
    };
  }
  return global.__dominoFinOpsMetrics;
}

export function recordVerticalChatConsumption(vertical: string): void {
  const store = getFinOpsStore();
  const key = vertical || 'unknown';
  store.chatConsumptionByVertical[key] = (store.chatConsumptionByVertical[key] ?? 0) + 1;
}

export function recordBlockedRequest(namespace: string): void {
  const store = getFinOpsStore();
  store.blockedByNamespace[namespace] = (store.blockedByNamespace[namespace] ?? 0) + 1;
}

export function getFinOpsMetrics(): FinOpsMetricsSnapshot {
  const store = getFinOpsStore();
  return {
    chatConsumptionByVertical: { ...store.chatConsumptionByVertical },
    blockedByNamespace: { ...store.blockedByNamespace },
    degradedFallbacks: store.degradedFallbacks,
  };
}

/**
 * Serializes concurrent operations for the same key within a Node.js worker
 * so that 100 simultaneous requests in the same process never interleave check-and-insert.
 */
async function withKeySerialization<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!global.__dominoKeyMutexes) {
    global.__dominoKeyMutexes = new Map();
  }
  const mutexMap = global.__dominoKeyMutexes;
  const prev = mutexMap.get(key) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((resolve) => {
    release = resolve;
  });
  mutexMap.set(key, prev.then(() => next));

  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (mutexMap.get(key) === next) {
      mutexMap.delete(key);
    }
  }
}

function pruneLocalStore(store: Map<string, SlidingWindowEntry>, now: number, maxWindowMs: number): void {
  for (const [k, v] of store.entries()) {
    const cutoff = k.includes('__global_daily__') ? now - DAY_MS : now - maxWindowMs;
    v.timestamps = v.timestamps.filter((ts) => ts > cutoff);
    if (v.timestamps.length === 0 && v.activeConcurrent <= 0) {
      store.delete(k);
    }
  }

  while (store.size >= MAX_LOCAL_STORE_SIZE) {
    const oldestKey = store.keys().next().value;
    if (!oldestKey) break;
    store.delete(oldestKey);
  }
}

export function isValidIpAddress(candidate: string): boolean {
  if (!candidate || candidate.length > 64) return false;
  const cleaned = candidate.replace(/^\[|\]$/g, '').split('%')[0];
  return net.isIP(cleaned) !== 0;
}

/**
 * Extracts the client IP address safely according to Coolify / Traefik reverse proxy topology:
 * Topology: Visitor -> [Optional Cloudflare] -> Coolify Traefik Proxy -> Next.js Container.
 *
 * Rules:
 * 1. If TRUST_PROXY === 'false' or TRUSTED_PROXY_HOPS === '0', forwarded headers are NOT trusted.
 * 2. Otherwise, walks `TRUSTED_PROXY_HOPS` (default 1, clamped 1..5) from the right of `x-forwarded-for`
 *    filtering only syntactically valid IPv4/IPv6 addresses so spoofed non-IP tokens are ignored.
 * 3. Falls back to `x-real-ip` / `cf-connecting-ip` (if valid IP) or '127.0.0.1'.
 */
export function extractClientIdentifier(req: Request): string {
  const trustProxyEnv = process.env.TRUST_PROXY;
  const rawHops = process.env.TRUSTED_PROXY_HOPS;
  const parsedHops = rawHops !== undefined ? parseInt(rawHops, 10) : 1;

  if (trustProxyEnv === 'false' || parsedHops === 0) {
    return '127.0.0.1';
  }

  const hops = Number.isNaN(parsedHops) ? 1 : Math.min(5, Math.max(1, parsedHops));

  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const validIps = forwarded
      .split(',')
      .map((ip) => ip.trim())
      .filter((ip) => isValidIpAddress(ip));

    if (validIps.length > 0) {
      const idx = Math.max(0, validIps.length - hops);
      return validIps[idx];
    }
  }

  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp && isValidIpAddress(realIp)) {
    return realIp;
  }

  const cfIp = req.headers.get('cf-connecting-ip')?.trim();
  if (cfIp && isValidIpAddress(cfIp)) {
    return cfIp;
  }

  return '127.0.0.1';
}

async function checkUpstashAtomicLua(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const now = Date.now();
  const member = `${now}-${crypto.randomUUID()}`;

  try {
    const command = [
      'EVAL',
      REDIS_SLIDING_WINDOW_LUA,
      '1',
      key,
      String(now),
      String(windowMs),
      String(maxRequests),
      member,
    ];

    const res = await fetch(url.replace(/\/$/, ''), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(1500),
    });

    if (!res.ok) return null;
    const payload = (await res.json()) as { result?: [number, number, number] };
    const tuple = payload?.result;
    if (!Array.isArray(tuple) || tuple.length < 3) return null;

    const allowed = Number(tuple[0]) === 1;
    const count = Number(tuple[1]);
    const oldestTs = Number(tuple[2]) || now;
    const resetAtMs = allowed ? now + windowMs : oldestTs + windowMs;
    const retryAfterSec = allowed
      ? 0
      : Math.max(1, Math.ceil((resetAtMs - now) / 1000));

    return {
      allowed,
      limit: maxRequests,
      remaining: allowed ? Math.max(0, maxRequests - count) : 0,
      resetAtMs,
      retryAfterSec,
      source: 'redis-lua',
    };
  } catch {
    return null;
  }
}

async function recordPgSerializedSlidingWindow(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult | null> {
  const pool = getPool();
  if (!pool) return null;

  let client;
  try {
    client = await pool.connect();
    if (!global.__dominoPgRateTableInitialized) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS domino_rate_limits (
          id BIGSERIAL PRIMARY KEY,
          rate_key VARCHAR(180) NOT NULL,
          hit_at BIGINT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_domino_rate_limits_key_hit ON domino_rate_limits (rate_key, hit_at);
      `);
      global.__dominoPgRateTableInitialized = true;
    }

    const now = Date.now();
    const windowStart = now - windowMs;

    await client.query('BEGIN');
    // Per-key transaction-scoped advisory lock serializes concurrent checks across all containers
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [key]);

    // 1% probabilistic cleanup of expired rows
    if (Math.random() < 0.01) {
      await client.query('DELETE FROM domino_rate_limits WHERE hit_at < $1', [now - DAY_MS]);
    }

    const countRes = await client.query<{ cnt: number; oldest_hit: string | null }>(
      `SELECT COUNT(*)::int AS cnt, MIN(hit_at)::text AS oldest_hit
       FROM domino_rate_limits
       WHERE rate_key = $1 AND hit_at >= $2`,
      [key, windowStart]
    );

    const currentCount = Number(countRes.rows[0]?.cnt ?? 0);
    const oldestHit = countRes.rows[0]?.oldest_hit
      ? Number(countRes.rows[0].oldest_hit)
      : now;

    if (currentCount >= maxRequests) {
      await client.query('COMMIT');
      const resetAtMs = oldestHit + windowMs;
      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetAtMs,
        retryAfterSec: Math.max(1, Math.ceil((resetAtMs - now) / 1000)),
        source: 'postgres-advisory-lock',
      };
    }

    await client.query(
      'INSERT INTO domino_rate_limits (rate_key, hit_at) VALUES ($1, $2)',
      [key, now]
    );
    await client.query('COMMIT');

    return {
      allowed: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - (currentCount + 1)),
      resetAtMs: now + windowMs,
      retryAfterSec: 0,
      source: 'postgres-advisory-lock',
    };
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    console.warn('PostgreSQL rateLimit fallback warning:', sanitizeDbErrorMessage(err));
    return null;
  } finally {
    client?.release();
  }
}

export async function checkRateLimit(
  identifier: string,
  policy: RateLimitPolicy
): Promise<{ result: RateLimitResult; releaseConcurrency: () => void }> {
  const key = `rl:${policy.namespace}:${identifier}`;

  return withKeySerialization(key, async () => {
    const store = getLocalStore();
    const now = Date.now();
    const windowStart = now - policy.windowMs;

    if (store.size >= MAX_LOCAL_STORE_SIZE) {
      pruneLocalStore(store, now, Math.max(policy.windowMs, 5 * 60_000));
    }

    const entry = store.get(key) ?? { timestamps: [], activeConcurrent: 0 };
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

    // Worker-local concurrency guard (protects against slowloris / parallel socket flooding per worker)
    if (policy.maxConcurrent && entry.activeConcurrent >= policy.maxConcurrent) {
      if (entry.timestamps.length === 0 && entry.activeConcurrent <= 0) {
        store.delete(key);
      } else {
        store.set(key, entry);
      }
      recordBlockedRequest(policy.namespace);
      return {
        result: {
          allowed: false,
          limit: policy.maxRequests,
          remaining: 0,
          resetAtMs: now + 5000,
          retryAfterSec: 5,
          source: 'local-memory',
        },
        releaseConcurrency: () => {},
      };
    }

    // Global daily FinOps cap for 'chat' namespace
    if (policy.namespace === 'chat') {
      const configuredDailyCap =
        parseInt(
          process.env.CHAT_GLOBAL_DAILY_LIMIT || String(DEFAULT_CHAT_GLOBAL_DAILY_LIMIT),
          10
        ) || DEFAULT_CHAT_GLOBAL_DAILY_LIMIT;
      const globalKey = 'rl:chat:__global_daily__';
      const dayStart = now - DAY_MS;

      // Check distributed stores first so daily budget survives restarts and works across containers
      const globalRedis = await checkUpstashAtomicLua(globalKey, DAY_MS, configuredDailyCap);
      const globalPg = !globalRedis
        ? await recordPgSerializedSlidingWindow(globalKey, DAY_MS, configuredDailyCap)
        : null;

      const distributedGlobal = globalRedis ?? globalPg;
      if (distributedGlobal && !distributedGlobal.allowed) {
        recordBlockedRequest('chat');
        return { result: distributedGlobal, releaseConcurrency: () => {} };
      }

      // If distributed stores are unavailable (or not configured), enforce strict local daily cap
      const effectiveLocalDailyCap = distributedGlobal
        ? configuredDailyCap
        : process.env.DATABASE_URL || process.env.UPSTASH_REDIS_REST_URL
          ? Math.min(configuredDailyCap, CHAT_EMERGENCY_DAILY_LIMIT)
          : configuredDailyCap;

      const globalEntry = store.get(globalKey) ?? { timestamps: [], activeConcurrent: 0 };
      globalEntry.timestamps = globalEntry.timestamps.filter((ts) => ts > dayStart);

      if (globalEntry.timestamps.length >= effectiveLocalDailyCap) {
        const oldestGlobal = globalEntry.timestamps[0] ?? now;
        const resetAtMs = oldestGlobal + DAY_MS;
        store.set(globalKey, globalEntry);
        recordBlockedRequest('chat');
        return {
          result: {
            allowed: false,
            limit: effectiveLocalDailyCap,
            remaining: 0,
            resetAtMs,
            retryAfterSec: Math.max(1, Math.ceil((resetAtMs - now) / 1000)),
            source: 'local-emergency',
          },
          releaseConcurrency: () => {},
        };
      }

      globalEntry.timestamps.push(now);
      store.set(globalKey, globalEntry);
    }

    entry.activeConcurrent += 1;
    store.set(key, entry);

    const releaseConcurrency = () => {
      const current = store.get(key);
      if (current) {
        current.activeConcurrent = Math.max(0, current.activeConcurrent - 1);
        const cutoff = Date.now() - policy.windowMs;
        current.timestamps = current.timestamps.filter((ts) => ts > cutoff);
        if (current.timestamps.length === 0 && current.activeConcurrent <= 0) {
          store.delete(key);
        } else {
          store.set(key, current);
        }
      }
    };

    // Distributed L2 check: Atomic Redis Lua -> Serialized PostgreSQL Advisory Lock
    const upstashRes = await checkUpstashAtomicLua(key, policy.windowMs, policy.maxRequests);
    if (upstashRes) {
      if (!upstashRes.allowed) {
        recordBlockedRequest(policy.namespace);
      } else if (policy.namespace === 'chat') {
        recordVerticalChatConsumption(policy.vertical || 'unknown');
      }
      return { result: upstashRes, releaseConcurrency };
    }

    const pgRes = await recordPgSerializedSlidingWindow(key, policy.windowMs, policy.maxRequests);
    if (pgRes) {
      if (!pgRes.allowed) {
        recordBlockedRequest(policy.namespace);
      } else if (policy.namespace === 'chat') {
        recordVerticalChatConsumption(policy.vertical || 'unknown');
      }
      return { result: pgRes, releaseConcurrency };
    }

    // FinOps Fail-Closed / Emergency Throttling when distributed stores fail in production
    const hadDistributedConfig = Boolean(
      process.env.DATABASE_URL || process.env.UPSTASH_REDIS_REST_URL
    );
    if (hadDistributedConfig) {
      getFinOpsStore().degradedFallbacks += 1;
      if (policy.namespace === 'chat' && process.env.RATE_LIMIT_FAIL_CLOSED === 'strict') {
        recordBlockedRequest('chat');
        return {
          result: {
            allowed: false,
            limit: policy.maxRequests,
            remaining: 0,
            resetAtMs: now + 30_000,
            retryAfterSec: 30,
            source: 'local-emergency',
          },
          releaseConcurrency,
        };
      }
    }

    const effectiveMaxRequests =
      hadDistributedConfig && policy.namespace === 'chat'
        ? Math.min(policy.maxRequests, 3)
        : policy.maxRequests;

    if (entry.timestamps.length >= effectiveMaxRequests) {
      const oldest = entry.timestamps[0] ?? now;
      const resetAtMs = oldest + policy.windowMs;
      recordBlockedRequest(policy.namespace);
      return {
        result: {
          allowed: false,
          limit: effectiveMaxRequests,
          remaining: 0,
          resetAtMs,
          retryAfterSec: Math.max(1, Math.ceil((resetAtMs - now) / 1000)),
          source: hadDistributedConfig ? 'local-emergency' : 'local-memory',
        },
        releaseConcurrency,
      };
    }

    entry.timestamps.push(now);
    store.set(key, entry);

    if (policy.namespace === 'chat') {
      recordVerticalChatConsumption(policy.vertical || 'unknown');
    }

    return {
      result: {
        allowed: true,
        limit: effectiveMaxRequests,
        remaining: Math.max(0, effectiveMaxRequests - entry.timestamps.length),
        resetAtMs: now + policy.windowMs,
        retryAfterSec: 0,
        source: hadDistributedConfig ? 'local-emergency' : 'local-memory',
      },
      releaseConcurrency,
    };
  });
}

export function buildRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAtMs / 1000)),
    ...(result.retryAfterSec > 0 ? { 'Retry-After': String(result.retryAfterSec) } : {}),
  };
}

/**
 * Simple Circuit Breaker for external services (Gemini API, N8N Webhook)
 */
export async function withCircuitBreaker<T>(
  serviceName: string,
  fn: () => Promise<T>,
  options: { failureThreshold?: number; cooldownMs?: number } = {}
): Promise<T> {
  const failureThreshold = options.failureThreshold ?? 4;
  const cooldownMs = options.cooldownMs ?? 30_000;

  if (!global.__dominoCircuitBreakers) {
    global.__dominoCircuitBreakers = new Map();
  }

  const state = global.__dominoCircuitBreakers.get(serviceName) ?? {
    failures: 0,
    openedAt: null,
  };

  if (state.openedAt !== null) {
    const elapsed = Date.now() - state.openedAt;
    if (elapsed < cooldownMs) {
      throw new Error(`Circuit breaker open for ${serviceName}`);
    }
    state.openedAt = null;
  }

  try {
    const result = await fn();
    state.failures = 0;
    state.openedAt = null;
    global.__dominoCircuitBreakers.set(serviceName, state);
    return result;
  } catch (err) {
    state.failures += 1;
    if (state.failures >= failureThreshold) {
      state.openedAt = Date.now();
    }
    global.__dominoCircuitBreakers.set(serviceName, state);
    throw err;
  }
}
