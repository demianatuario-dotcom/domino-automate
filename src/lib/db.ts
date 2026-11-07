import { Pool } from 'pg';

declare global {
  var __dominoPgPool: Pool | undefined;
}

export function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!global.__dominoPgPool) {
    global.__dominoPgPool = new Pool({
      connectionString,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      max: 5,
    });
  }

  return global.__dominoPgPool;
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
    const res = await client.query<VideoRow>('SELECT * FROM videos ORDER BY id ASC');
    return res.rows;
  } catch (e) {
    console.error('DB Fetch Error (videos):', (e as Error).message);
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
    console.error('DB Fetch Error (servicos):', (e as Error).message);
    return [];
  } finally {
    client?.release();
  }
}
