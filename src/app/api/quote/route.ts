import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Format the Q&A into the description so N8N can just use 'descricao' field as is.
    let formattedDescricao = data.descricao ? data.descricao.trim() : "";
    
    if (data.perguntas_respostas && Object.keys(data.perguntas_respostas).length > 0) {
      if (formattedDescricao) formattedDescricao += "\n\n";
      formattedDescricao += "Respostas aos questionamentos da IA:\n";
      for (const [dor, resposta] of Object.entries(data.perguntas_respostas)) {
         formattedDescricao += `- Referente a: "${dor}"\n  Resposta: ${resposta}\n\n`;
      }
    }
    
    const payloadToN8N = {
      ...data,
      descricao: formattedDescricao.trim()
    };
    
    // Webhook N8N URL will be fetched from environment variables.
    // If not set, it simulates a successful request for dev purposes.
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToN8N)
      });
      
      if (!response.ok) {
        throw new Error('N8N Webhook failed to respond correctly.');
      }
    } else {
      console.log("Mocking N8N Push. Webhook URL not set. Data:", data);
    }

    // Database logic
    if (data.email && data.doresArray && data.doresArray.length > 0) {
      const dbClient = new Client({ connectionString: process.env.DATABASE_URL });
      try {
        await dbClient.connect();
        
        // Find the ids of the services that match the "dores"
        const servicosRes = await dbClient.query(
          'SELECT id FROM servicos WHERE gargalo = ANY($1)',
          [data.doresArray]
        );
        const servicosIds = servicosRes.rows.map(row => row.id).join(', ');
        
        // Check if client exists
        const clientRes = await dbClient.query('SELECT id FROM clientes WHERE email = $1', [data.email]);
        
        if (clientRes.rows.length > 0) {
          // Client exists, update "proposta"
          await dbClient.query(
            'UPDATE clientes SET proposta = $1 WHERE email = $2',
            [servicosIds, data.email]
          );
        } else {
          // Client doesn't exist, insert
          await dbClient.query(
            'INSERT INTO clientes (email, whatsapp, proposta) VALUES ($1, $2, $3)',
            [data.email, data.telefone || null, servicosIds]
          );
        }
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        // We might not want to fail the whole request if only DB fails, 
        // since the webhook was already sent, but logging it is important.
      } finally {
        await dbClient.end();
      }
    }

    return NextResponse.json({ success: true, message: 'Proposta encaminhada via N8N.' });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ success: false, error: 'Erro interno ao encaminhar proposta.' }, { status: 500 });
  }
}
