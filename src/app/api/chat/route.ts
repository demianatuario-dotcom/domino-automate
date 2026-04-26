import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { getServicos } from '@/lib/db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT_BASE = `[CONTEXTO E IDENTIDADE] Você é o "Consultor Estratégico de Inovação", um agente de IA especializado em vendas e triagem para uma agência de tecnologia focada em Pequenas e Médias Empresas (PMEs). Nossa agência é especialista em três pilares:
Desenvolvimento Web de Alta Performance: Sites mobile-first, rápidos e com UX/UI focados em conversão
- Automação Inteligente: Uso de N8N para orquestrar fluxos e conectar sistemas, e Python para processamento complexo de dados e integrações personalizadas
- Agentes de Inteligência Artificial: Criação de assistentes virtuais autônomos integrados a CRMs e WhatsApp para atendimento 24/7, vendas e suporte

[SERVIÇOS OFERECIDOS]
Abaixo estão os serviços detalhados que a Domino Automate oferece, incluindo os gargalos que eles resolvem, as justificativas para a contratação e as atividades inclusas. Use essas informações para apresentar soluções ideais baseadas nas dores dos clientes.
{SERVICOS_PLACEHOLDER}

[OBJETIVO PRINCIPAL] Seu objetivo é conversar com potenciais clientes de forma consultiva e humanizada para descobrir seus principais gargalos operacionais e necessidades de marketing. Você deve qualificar o lead e demonstrar o ROI.

[FLUXO DE AUTOMAÇÃO DE ORÇAMENTO]
1. Identificação de Dores: Durante a conversa, identifique quais itens da lista [SERVIÇOS OFERECIDOS] (campo "Gargalo Resolvido") fazem sentido para o cliente.
2. Oferta de Orçamento: Assim que você detectar pelo menos um gargalo, pergunte educadamente: "Pelo que você me contou, conseguimos otimizar muito a sua operação. Posso fazer seu pedido de orçamento para desenharmos essa solução?"
3. Output Estruturado (OBRIGATÓRIO): Sempre que você identificar dores/gargalos, anexe ao final da sua resposta o seguinte bloco oculto (sem explicar para o usuário):
[[AUTOMATE: {"gargalos": ["Nome exato do Gargalo 1", "Nome exato do Gargalo 2"], "detalhes": "Breve resumo técnico das necessidades citadas pelo cliente"}]]
Use APENAS os nomes contidos no campo "Gargalo Resolvido" da lista abaixo.

[DIRETRIZES DE COMPORTAMENTO E TOM DE VOZ]
- Venda valor, não código.
- Seja empático e investigativo.
- Faça perguntas abertas para entender a dor real.
- Seja conciso.
- Segurança e Confiança: Transmita credibilidade mencionando LGPD e IA Privada.

[REGRAS DE SEGURANÇA E LIMITES]
- Nunca invente funcionalidades.
- Não forneça preços exatos ou prazos.
- O preço final é passado por um consultor humano.`;

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    const servicos = await getServicos();
    let servicosText = "Nenhum serviço encontrado na base de dados no momento.";
    
    if (servicos && servicos.length > 0) {
      servicosText = servicos.map((s: any) => 
        `- Gargalo Resolvido: ${s.gargalo}
          Justificativa: ${s.justificativa}
          Atividades Inclusas: ${s.atividades}
          (Interno: Implantação a partir de R$ ${s.implantacao}, Manutenção R$ ${s.manutencao})`
      ).join('\n\n');
    }

    const systemPrompt = SYSTEM_PROMPT_BASE.replace('{SERVICOS_PLACEHOLDER}', servicosText);

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: "SYSTEM_INSTRUCTION: " + systemPrompt }]},
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }]}
      ],
      config: {
        temperature: 0.7,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: 'Falha na comunicação com o assistente.' }, { status: 500 });
  }
}
