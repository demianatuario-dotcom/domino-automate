import { getPool } from './db';

export interface CommentRow {
  id: number;
  user_name: string;
  user_email: string | null;
  user_image: string | null;
  provider: string;
  content: string;
  parent_id: number | null;
  created_at: string;
}

export async function getComments(): Promise<CommentRow[]> {
  const pool = getPool();
  if (!pool) return [];

  let client;
  try {
    client = await pool.connect();
    const res = await client.query<CommentRow>('SELECT * FROM comentarios ORDER BY created_at ASC LIMIT 200');
    return res.rows;
  } catch (e) {
    console.error('DB Fetch Error (Comments):', (e as Error).message);
    return [];
  } finally {
    client?.release();
  }
}

export async function insertComment(
  userName: string,
  userEmail: string | null,
  userImage: string | null,
  provider: string,
  content: string,
  parentId: number | null = null
): Promise<CommentRow | null> {
  const pool = getPool();
  if (!pool) {
    throw new Error('Database pool unavailable');
  }

  let client;
  try {
    client = await pool.connect();
    const res = await client.query<CommentRow>(
      'INSERT INTO comentarios (user_name, user_email, user_image, provider, content, parent_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userName, userEmail, userImage, provider, content, parentId]
    );
    return res.rows[0] ?? null;
  } catch (e) {
    console.error('DB Insert Error (Comments):', (e as Error).message);
    throw e;
  } finally {
    client?.release();
  }
}
