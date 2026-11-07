import { getPool, sanitizeDbErrorMessage } from './db.ts';

export const MAX_COMMENT_DEPTH = 2;

export class CommentValidationError extends Error {
  public readonly code: 'PARENT_NOT_FOUND' | 'MAX_DEPTH_EXCEEDED' | 'SPAM_DETECTED' | 'DB_UNAVAILABLE';
  constructor(
    code: 'PARENT_NOT_FOUND' | 'MAX_DEPTH_EXCEEDED' | 'SPAM_DETECTED' | 'DB_UNAVAILABLE',
    message: string
  ) {
    super(message);
    this.code = code;
  }
}

export interface CommentRow {
  id: number;
  user_name: string;
  user_image: string | null;
  provider: string;
  content: string;
  parent_id: number | null;
  created_at: string;
}

export function isSpamCommentContent(content: string): boolean {
  const urlMatches = content.match(/https?:\/\/[^\s]+/gi);
  if (urlMatches && urlMatches.length > 2) {
    return true;
  }
  if (/(.)\1{14,}/.test(content)) {
    return true;
  }
  return false;
}

export async function getComments(): Promise<CommentRow[]> {
  const pool = getPool();
  if (!pool) return [];

  let client;
  try {
    client = await pool.connect();
    const res = await client.query<CommentRow>(
      'SELECT id, user_name, user_image, provider, content, parent_id, created_at FROM comentarios ORDER BY created_at DESC LIMIT 200'
    );
    return [...res.rows].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } catch (e) {
    console.error('DB Fetch Error (Comments):', sanitizeDbErrorMessage(e));
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
  if (isSpamCommentContent(content)) {
    throw new CommentValidationError(
      'SPAM_DETECTED',
      'Comentário bloqueado pela política anti-spam (excesso de links ou caracteres repetidos).'
    );
  }

  const pool = getPool();
  if (!pool) {
    throw new CommentValidationError(
      'DB_UNAVAILABLE',
      'Serviço de banco de dados temporariamente indisponível.'
    );
  }

  let client;
  try {
    client = await pool.connect();

    if (parentId !== null) {
      let currentParentId: number | null = parentId;
      let depth = 0;

      while (currentParentId !== null) {
        depth += 1;
        if (depth > MAX_COMMENT_DEPTH) {
          throw new CommentValidationError(
            'MAX_DEPTH_EXCEEDED',
            `Limite máximo de profundidade de respostas (${MAX_COMMENT_DEPTH} níveis) atingido.`
          );
        }

        const parentRes: { rows: { id: number; parent_id: number | null }[] } =
          await client.query<{ id: number; parent_id: number | null }>(
            'SELECT id, parent_id FROM comentarios WHERE id = $1',
            [currentParentId]
          );

        if (parentRes.rows.length === 0) {
          if (depth === 1) {
            throw new CommentValidationError(
              'PARENT_NOT_FOUND',
              'Comentário pai não encontrado.'
            );
          }
          break;
        }

        currentParentId = parentRes.rows[0].parent_id;
      }
    }

    const res = await client.query<CommentRow>(
      'INSERT INTO comentarios (user_name, user_email, user_image, provider, content, parent_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_name, user_image, provider, content, parent_id, created_at',
      [userName, userEmail, userImage, provider, content, parentId]
    );
    return res.rows[0] ?? null;
  } catch (e) {
    if (e instanceof CommentValidationError) {
      throw e;
    }
    console.error('DB Insert Error (Comments):', sanitizeDbErrorMessage(e));
    throw new CommentValidationError(
      'DB_UNAVAILABLE',
      'Erro ao persistir comentário no banco de dados.'
    );
  } finally {
    client?.release();
  }
}
