import { NextResponse } from 'next/server';
import { Client } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const result = await client.query('SELECT gargalo, justificativa FROM servicos ORDER BY id ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching servicos:', error);
    return NextResponse.json({ error: 'Failed to fetch from Database' }, { status: 500 });
  } finally {
    await client.end();
  }
}
