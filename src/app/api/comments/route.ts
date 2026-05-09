import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getComments, insertComment } from '@/lib/commentsDb';

export async function GET() {
  try {
    const comments = await getComments();
    return NextResponse.json({ comments });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'O comentário não pode ser vazio' }, { status: 400 });
    }

    const userName = session.user.name || 'Usuário Anônimo';
    const userEmail = session.user.email || null;
    const userImage = session.user.image || null;
    const provider = 'unknown'; // NextAuth server session doesn't easily expose the provider without custom callbacks. We'll use a placeholder or get it if we customized callbacks.

    const newComment = await insertComment(userName, userEmail, userImage, provider, content, parentId || null);

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar o comentário' }, { status: 500 });
  }
}
