import { Pool, type PoolClient } from 'pg';

declare global {
  var __dominoPgPool: Pool | undefined;
}

/**
 * Sanitizes database error messages to ensure connection strings, passwords,
 * or PII never leak into application logs.
 */
export function sanitizeDbErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  return raw
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[REDACTED_DB_URL]')
    .replace(/password=\S+/gi, 'password=[REDACTED]');
}

/**
 * Connection Budget Calculation for Coolify / Multi-Container Deployments:
 * Total Connections = REPLICAS * DB_POOL_MAX
 * Default: 2 replicas * 5 max connections = 10 connections (well below PostgreSQL default max_connections=100).
 */
export function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!global.__dominoPgPool) {
    const maxConnections = Math.max(
      1,
      Math.min(25, parseInt(process.env.DB_POOL_MAX || '5', 10) || 5)
    );
    const pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      statement_timeout: 10000,
      max: maxConnections,
      allowExitOnIdle: true,
    });
    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error:', sanitizeDbErrorMessage(err));
    });
    global.__dominoPgPool = pool;
  }

  return global.__dominoPgPool;
}

/**
 * Executes a callback inside an explicit PostgreSQL transaction,
 * guaranteeing COMMIT on success and ROLLBACK on any error.
 */
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  if (!pool) {
    throw new Error('PostgreSQL pool unavailable');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export interface VideoRow {
  id: number;
  titulo?: string;
  link: string;
}

export interface ServicoRow {
  id?: number;
  gargalo: string;
  justificativa: string;
  atividades?: string;
  pergunta?: string;
  implantacao?: string | number;
  manutencao?: string | number;
}

export async function getVideos(): Promise<VideoRow[]> {
  const pool = getPool();
  if (!pool) return [];

  let client;
  try {
    client = await pool.connect();
    const res = await client.query<VideoRow>('SELECT id, titulo, link FROM videos ORDER BY id ASC');
    return res.rows;
  } catch (e) {
    console.error('DB Fetch Error (videos):', sanitizeDbErrorMessage(e));
    return [];
  } finally {
    client?.release();
  }
}

export async function getServicos(): Promise<ServicoRow[]> {
  const pool = getPool();
  if (!pool) return [];

  let client;
  try {
    client = await pool.connect();
    const res = await client.query<ServicoRow>(
      'SELECT id, gargalo, justificativa, atividades, pergunta, implantacao, manutencao FROM servicos ORDER BY id ASC'
    );
    return res.rows;
  } catch (e) {
    console.error('DB Fetch Error (servicos):', sanitizeDbErrorMessage(e));
    return [];
  } finally {
    client?.release();
  }
}
