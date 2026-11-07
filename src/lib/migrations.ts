import fs from 'node:fs';
import path from 'node:path';
import { getPool } from './db.ts';

export interface MigrationRecord {
  version: string;
  description: string;
  sqlPath: string;
}

export const MIGRATIONS: MigrationRecord[] = [
  {
    version: '001_domino_v2_2_schema',
    description: 'Core tables, constraints, indexes, quote_idempotency and quote_outbox',
    sqlPath: path.resolve(process.cwd(), 'migrations', '001_domino_v2_2_schema.sql'),
  },
];

let migrationsAppliedInProcess = false;

/**
 * Runs versioned SQL migrations safely using a PostgreSQL transaction and advisory lock.
 * Can be called from CLI deployment hooks or lazily once per process startup.
 */
export async function ensureMigrationsApplied(): Promise<boolean> {
  if (migrationsAppliedInProcess) return true;

  const pool = getPool();
  if (!pool) return false;

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    // Global advisory lock for schema migrations
    await client.query("SELECT pg_advisory_xact_lock(hashtext('domino_schema_migrations_lock'))");

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(64) PRIMARY KEY,
        description TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    for (const migration of MIGRATIONS) {
      const existing = await client.query<{ version: string }>(
        'SELECT version FROM schema_migrations WHERE version = $1',
        [migration.version]
      );
      if (existing.rows.length === 0 && fs.existsSync(migration.sqlPath)) {
        const sql = fs.readFileSync(migration.sqlPath, 'utf8');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, description) VALUES ($1, $2) ON CONFLICT (version) DO NOTHING',
          [migration.version, migration.description]
        );
      }
    }

    await client.query('COMMIT');
    migrationsAppliedInProcess = true;
    return true;
  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    console.error('Migration execution warning:', (err as Error).message);
    return false;
  } finally {
    client?.release();
  }
}

