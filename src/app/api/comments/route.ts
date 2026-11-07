import type { App } from 'firebase-admin/app';
import type { Auth, DecodedIdToken } from 'firebase-admin/auth';
import {
  getComments,
  insertComment,
  CommentValidationError,
  isSpamCommentContent,
} from '../../../lib/commentsDb.ts';
import { CommentRequestSchema } from '../../../lib/schemas.ts';
import {
  checkRateLimit,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from '../../../lib/rateLimit.ts';
import { readJsonBodyWithLimit } from '../../../lib/bodyReader.ts';

const MAX_COMMENT_PAYLOAD_BYTES = 8_192; // 8 KB

interface ServiceAccountJson {
  project_id?: string;
  projectId?: string;
  client_email?: string;
  clientEmail?: string;
  private_key?: string;
  privateKey?: string;
}

function parseServiceAccountKey(rawKey: string): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} | null {
  try {
    const trimmed = rawKey.trim();
    const jsonStr = trimmed.startsWith('{')
      ? trimmed
      : Buffer.from(trimmed, 'base64').toString('utf8');
    const parsed = JSON.parse(jsonStr) as ServiceAccountJson;
    const projectId = parsed.project_id || parsed.projectId || '';
    const clientEmail = parsed.client_email || parsed.clientEmail || '';
    const privateKey = (parsed.private_key || parsed.privateKey || '').replace(/\\n/g, '\n');

    if (projectId && clientEmail && privateKey) {
      return { projectId, clientEmail, privateKey };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Initializes and returns the singleton Firebase Admin Auth instance.
 * Dynamically imports firebase-admin at runtime to avoid bundling issues
 * during static page data collection in Next.js/Webpack/Nixpacks.
 * Supports:
 * 1. FIREBASE_SERVICE_ACCOUNT_KEY (JSON or Base64 JSON)
 * 2. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 * 3. GOOGLE_APPLICATION_CREDENTIALS (ADC file/workload identity)
 *
 * Never treats projectId alone as a valid credential in production.
 */
async function getFirebaseAdminAuth(): Promise<Auth> {
  const { getApps, initializeApp, cert, applicationDefault } = await import('firebase-admin/app');
  const { getAuth } = await import('firebase-admin/auth');

  const existingApps = getApps();
  if (existingApps.length > 0) {
    return getAuth(existingApps[0]);
  }

  const envProjectId = (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    ''
  ).trim();

  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (rawServiceAccount) {
    const parsedSa = parseServiceAccountKey(rawServiceAccount);
    if (!parsedSa) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY malformada.');
    }
    const app: App = initializeApp({
      credential: cert(parsedSa),
      projectId: envProjectId || parsedSa.projectId,
    });
    return getAuth(app);
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (envProjectId && clientEmail && privateKey) {
    const app: App = initializeApp({
      credential: cert({ projectId: envProjectId, clientEmail, privateKey }),
      projectId: envProjectId,
    });
    return getAuth(app);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    if (!envProjectId) {
      throw new Error('FIREBASE_PROJECT_ID obrigatório ao usar GOOGLE_APPLICATION_CREDENTIALS.');
    }
    const app: App = initializeApp({
      credential: applicationDefault(),
      projectId: envProjectId,
    });
    return getAuth(app);
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Credenciais do Firebase Admin ausentes em produção. Configure FIREBASE_SERVICE_ACCOUNT_KEY ou FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY.'
    );
  }

  // Non-production test/dev fallback only when explicitly allowed outside production
  const app: App = initializeApp({
    projectId: envProjectId || 'domino-automate-test',
  });
  return getAuth(app);
}

export async function GET() {
  try {
    const comments = await getComments();
    return Response.json({ comments });
  } catch {
    return Response.json(
      { error: 'Serviço de comentários temporariamente indisponível.' },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  // 1. Preliminary rate limit by trusted IP BEFORE verifyIdToken
  const clientId = extractClientIdentifier(request);
  const { result: ipRlResult, releaseConcurrency: releaseIpConcurrency } = await checkRateLimit(
    `ip:${clientId}`,
    {
      namespace: 'comments',
      windowMs: 5 * 60_000,
      maxRequests: 10,
      maxConcurrent: 2,
    }
  );

  const rlHeaders = buildRateLimitHeaders(ipRlResult);

  if (!ipRlResult.allowed) {
    releaseIpConcurrency();
    return Response.json(
      { error: 'Limite de requisições atingido. Aguarde alguns minutos.' },
      { status: 429, headers: rlHeaders }
    );
  }

  try {
    // 2. Enforce stream byte limit before token verification or DB queries
    const bodyRead = await readJsonBodyWithLimit(request, MAX_COMMENT_PAYLOAD_BYTES);
    if (!bodyRead.ok) {
      return Response.json(
        { error: bodyRead.error },
        { status: bodyRead.status, headers: rlHeaders }
      );
    }

    // 3. Require and verify Firebase ID Token (with revocation check enabled by default)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Não autorizado. Token de autenticação ausente.' },
        { status: 401, headers: rlHeaders }
      );
    }

    const idToken = authHeader.slice(7).trim();
    if (!idToken || idToken.length > 4096) {
      return Response.json(
        { error: 'Não autorizado. Token inválido.' },
        { status: 401, headers: rlHeaders }
      );
    }

    const checkRevoked = process.env.FIREBASE_CHECK_REVOKED !== 'false';
    let decodedToken: DecodedIdToken;
    try {
      const adminAuth = await getFirebaseAdminAuth();
      decodedToken = await adminAuth.verifyIdToken(idToken, checkRevoked);
    } catch {
      return Response.json(
        { error: 'Não autorizado. Falha ao validar o token.' },
        { status: 401, headers: rlHeaders }
      );
    }

    // 4. Secondary rate limit per authenticated user UID
    const uid = decodedToken.uid || clientId;
    const { result: userRlResult, releaseConcurrency: releaseUserConcurrency } =
      await checkRateLimit(`uid:${uid}`, {
        namespace: 'comments',
        windowMs: 5 * 60_000,
        maxRequests: 5,
        maxConcurrent: 1,
      });

    releaseUserConcurrency();
    if (!userRlResult.allowed) {
      const userHeaders = buildRateLimitHeaders(userRlResult);
      return Response.json(
        { error: 'Limite de comentários por usuário atingido. Aguarde alguns minutos.' },
        { status: 429, headers: userHeaders }
      );
    }

    // 5. Strict Zod payload validation (client cannot pass identity fields)
    const parsed = CommentRequestSchema.safeParse(bodyRead.data);
    if (!parsed.success) {
      return Response.json(
        { error: 'Dados do comentário inválidos.' },
        { status: 400, headers: rlHeaders }
      );
    }

    const { content, parentId } = parsed.data;
    const sanitizedContent = content.replace(/<[^>]*>?/gm, '').trim();

    if (sanitizedContent.length < 2) {
      return Response.json(
        { error: 'O comentário não pode conter apenas tags ou espaços.' },
        { status: 400, headers: rlHeaders }
      );
    }

    if (isSpamCommentContent(sanitizedContent)) {
      return Response.json(
        { error: 'Comentário bloqueado pela política de prevenção de spam.' },
        { status: 400, headers: rlHeaders }
      );
    }

    const userEmail = typeof decodedToken.email === 'string' ? decodedToken.email : null;
    const userName =
      typeof decodedToken.name === 'string' && decodedToken.name.trim()
        ? decodedToken.name.trim().slice(0, 80)
        : userEmail
          ? userEmail.split('@')[0].slice(0, 80)
          : 'Usuário';
    const userImage = typeof decodedToken.picture === 'string' ? decodedToken.picture : null;
    const provider = decodedToken.firebase?.sign_in_provider || 'firebase';

    const newComment = await insertComment(
      userName,
      userEmail,
      userImage,
      provider,
      sanitizedContent,
      parentId ?? null
    );

    return Response.json({ comment: newComment }, { headers: rlHeaders });
  } catch (err) {
    if (err instanceof CommentValidationError) {
      if (err.code === 'PARENT_NOT_FOUND') {
        return Response.json({ error: err.message }, { status: 404, headers: rlHeaders });
      }
      if (err.code === 'MAX_DEPTH_EXCEEDED' || err.code === 'SPAM_DETECTED') {
        return Response.json({ error: err.message }, { status: 400, headers: rlHeaders });
      }
      if (err.code === 'DB_UNAVAILABLE') {
        return Response.json({ error: err.message }, { status: 503, headers: rlHeaders });
      }
    }
    return Response.json(
      { error: 'Erro ao salvar o comentário.' },
      { status: 500, headers: rlHeaders }
    );
  } finally {
    releaseIpConcurrency();
  }
}
