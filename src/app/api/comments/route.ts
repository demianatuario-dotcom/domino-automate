import { NextResponse } from 'next/server';
import { getComments, insertComment } from '@/lib/commentsDb';
import { CommentRequestSchema } from '@/lib/schemas';
import {
  checkRateLimit,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from '@/lib/rateLimit';

export async function GET() {
  try {
    const comments = await getComments();
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const clientId = extractClientIdentifier(request);
  const { result: rlResult, releaseConcurrency } = await checkRateLimit(clientId, {
    namespace: 'comments',
    windowMs: 5 * 60_000,
    maxRequests: 5,
    maxConcurrent: 2,
  });

  const rlHeaders = buildRateLimitHeaders(rlResult);

  if (!rlResult.allowed) {
    releaseConcurrency();
    return NextResponse.json(
      { error: 'Limite de comentários atingido. Aguarde alguns minutos.' },
      { status: 429, headers: rlHeaders }
    );
  }

  try {
    const rawBody: unknown = await request.json();
    const parsed = CommentRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados do comentário inválidos.' },
        { status: 400, headers: rlHeaders }
      );
    }

    const { content, parentId, userName, userEmail, userImage, provider } = parsed.data;
    const sanitizedContent = content.replace(/<[^>]*>?/gm, '').trim();

    const newComment = await insertComment(
      userName,
      userEmail || null,
      userImage || null,
      provider || 'firebase',
      sanitizedContent,
      parentId ?? null
    );

    return NextResponse.json({ comment: newComment }, { headers: rlHeaders });
  } catch {
    return NextResponse.json(
      { error: 'Erro ao salvar o comentário' },
      { status: 500, headers: rlHeaders }
    );
  } finally {
    releaseConcurrency();
  }
}
