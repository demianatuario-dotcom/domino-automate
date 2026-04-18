import { NextResponse } from 'next/server';

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

    return NextResponse.json({ success: true, message: 'Proposta encaminhada via N8N.' });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ success: false, error: 'Erro interno ao encaminhar proposta.' }, { status: 500 });
  }
}
