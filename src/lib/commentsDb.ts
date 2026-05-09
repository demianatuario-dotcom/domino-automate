import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:domini_secret_pg_pwd@76.13.234.225:5437/db_Domini',
  connectionTimeoutMillis: 5000,
  max: 3
});

export async function getComments() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM comentarios ORDER BY created_at ASC');
    return res.rows;
  } catch(e) {
    console.error("DB Fetch Error (Comments): ", e);
    return [];
  } finally {
    client.release();
  }
}

export async function insertComment(userName: string, userEmail: string | null, userImage: string | null, provider: string, content: string, parentId: number | null = null) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'INSERT INTO comentarios (user_name, user_email, user_image, provider, content, parent_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userName, userEmail, userImage, provider, content, parentId]
    );
    return res.rows[0];
  } catch(e) {
    console.error("DB Insert Error (Comments): ", e);
    throw e;
  } finally {
    client.release();
  }
}
