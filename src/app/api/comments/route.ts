import { NextResponse } from 'next/server';
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
    const body = await request.json();
    const { content, parentId, userName, userEmail, userImage, provider } = body;

    // We rely on the client Firebase Auth to only send if authenticated.
    // In a production app, we would verify the Firebase token here via Firebase Admin.
    // For now, to keep it similar to the Lana project setup, we accept the payload.

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'O comentário não pode ser vazio' }, { status: 400 });
    }

    if (!userName) {
      return NextResponse.json({ error: 'Nome de usuário não fornecido' }, { status: 400 });
    }

    const newComment = await insertComment(
      userName, 
      userEmail || null, 
      userImage || null, 
      provider || 'firebase', 
      content, 
      parentId || null
    );

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar o comentário' }, { status: 500 });
  }
}
