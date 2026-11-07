import { NextResponse } from 'next/server';
import { getServicos } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await getServicos();
    return NextResponse.json(
      rows.map((r) => ({
        gargalo: r.gargalo,
        justificativa: r.justificativa,
        pergunta: r.pergunta,
      }))
    );
  } catch (error) {
    console.error('Error fetching servicos:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to fetch from Database' }, { status: 500 });
  }
}
