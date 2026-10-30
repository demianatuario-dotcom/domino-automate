import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Anti-spam honeypot check
    if (data.b_website_check && String(data.b_website_check).trim() !== '') {
      return NextResponse.json({ success: true, message: 'Processado.' });
    }

    let formattedDescricao = "";
    if (data.vertical || data.origem) {
      formattedDescricao += `Vertical / Origem: ${data.vertical || data.origem}\n`;
    }
    if (data.tipo_organizacao) {
      formattedDescricao += `Tipo de Organização / Estúdio: ${data.tipo_organizacao}\n`;
    }
    if (data.demanda) {
      formattedDescricao += `Demanda Principal: ${data.demanda}\n`;
    }
    if (data.empresa) {
      formattedDescricao += `Empresa / Estúdio / Órgão: ${data.empresa}\n`;
    }
    if (formattedDescricao) {
      formattedDescricao += "\n";
    }

    if (data.descricao) {
      formattedDescricao += `Detalhamento da Demanda:\n${data.descricao.trim()}\n\n`;
    }

    if (data.perguntas_respostas && Object.keys(data.perguntas_respostas).length > 0) {
      formattedDescricao += "Respostas aos questionamentos específicos:\n";
      for (const [dor, resposta] of Object.entries(data.perguntas_respostas)) {
        formattedDescricao += `- Referente a: "${dor}"\n  Resposta: ${resposta}\n\n`;
      }
    }

    const payloadToN8N = {
      ...data,
      origem: data.origem || data.vertical || '/Atuária',
      descricao: formattedDescricao.trim(),
      created_at: new Date().toISOString()
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Source-Origin': 'domino-automate-web'
          },
          body: JSON.stringify(payloadToN8N)
        });

        if (!response.ok) {
          console.warn('N8N Webhook returned non-OK status:', response.status);
        }
      } catch (webhookErr) {
        console.warn('N8N Webhook dispatch warning:', webhookErr);
      }
    } else {
      console.log("Mocking N8N Push. Webhook URL not set. Data:", payloadToN8N);
    }

    // Database logic
    if (data.email) {
      const dbClient = new Client({ connectionString: process.env.DATABASE_URL });
      try {
        await dbClient.connect();

        let servicosIds = data.demanda || 'Diagnóstico';
        if (data.doresArray && data.doresArray.length > 0) {
          const servicosRes = await dbClient.query(
            'SELECT id FROM servicos WHERE gargalo = ANY($1)',
            [data.doresArray]
          );
          if (servicosRes.rows.length > 0) {
            servicosIds = servicosRes.rows.map(row => row.id).join(', ');
          } else {
            servicosIds = data.doresArray.join(', ').slice(0, 200);
          }
        }

        const clientRes = await dbClient.query('SELECT id FROM clientes WHERE email = $1', [data.email]);

        if (clientRes.rows.length > 0) {
          await dbClient.query(
            'UPDATE clientes SET proposta = $1 WHERE email = $2',
            [servicosIds, data.email]
          );
        } else {
          await dbClient.query(
            'INSERT INTO clientes (email, whatsapp, proposta) VALUES ($1, $2, $3)',
            [data.email, data.telefone || null, servicosIds]
          );
        }
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
      } finally {
        await dbClient.end();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Proposta encaminhada via N8N.'
    });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ success: false, error: 'Erro interno ao encaminhar proposta.' }, { status: 500 });
  }
}
