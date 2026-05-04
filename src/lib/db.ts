import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:domini_secret_pg_pwd@76.13.234.225:5437/db_Domini',
  connectionTimeoutMillis: 5000,
  max: 3
});

export async function getVideos() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM videos ORDER BY id ASC');
    return res.rows;
  } catch(e) {
    console.error("DB Fetch Error: ", e);
    return [];
  } finally {
    client.release();
  }
}

export async function getServicos() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT gargalo, justificativa, atividades, implantacao, manutencao FROM servicos');
    return res.rows;
  } catch(e) {
    console.error("DB Fetch Error: ", e);
    return [];
  } finally {
    client.release();
  }
}
