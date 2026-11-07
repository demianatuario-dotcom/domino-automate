import { SEGMENTS_CONFIG, type SegmentConfig } from '../config/segmentsConfig.ts';

export const INJECTION_PATTERNS: RegExp[] = [
  /api[_\s-]?key/i,
  /gemini[_\s-]?api/i,
  /system[_\s-]?prompt/i,
  /ignore (all )?(previous|above|prior) instructions/i,
  /disregard (all )?(previous|above|prior) instructions/i,
  /esqueça (todas )?(as )?instruções/i,
  /ignore (todas )?(as )?regras/i,
  /mostre (o )?(seu )?prompt/i,
  /reveal (the )?(system )?prompt/i,
  /qual (é )?(a )?sua chave/i,
  /vari[aá]ve(l|is) de ambiente/i,
  /process\.env/i,
  /database_url/i,
  /n8n_webhook/i,
  /firebase_service_account/i,
  /jailbreak/i,
  /developer mode/i,
  /<\s*system\s*>/i,
  /\[system\s*instruction\]/i,
];

export function sanitizeIncomingPII(text: string): { sanitized: string; hadSensitivePII: boolean } {
  const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;
  const cnpjRegex = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g;
  const cardRegex = /\b(?:\d[ -]*?){13,16}\b/g;

  const hadCpf = cpfRegex.test(text);
  const hadCard = cardRegex.test(text);
  const hadSensitivePII = hadCpf || hadCard;

  const sanitized = text
    .replace(cpfRegex, '[CPF_OMITIDO_POR_LGPD]')
    .replace(cnpjRegex, '[CNPJ_REGISTRADO]')
    .replace(cardRegex, '[DADO_SENSIVEL_OMITIDO]');

  return { sanitized, hadSensitivePII };
}

/**
 * Sanitizes history turns and maps 'user' | 'assistant' to Gemini's 'user' | 'model' roles,
 * ensuring the sequence starts with 'user' and never accepts privileged/system directives.
 */
export function buildControlledConversationContents(
  history: { role: 'user' | 'assistant'; content: string }[],
  currentCleanMessage: string
): { role: 'user' | 'model'; parts: { text: string }[] }[] {
  const recent = history.slice(-10);
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  for (const turn of recent) {
    const cleanTurn = sanitizeIncomingPII(turn.content)
      .sanitized.replace(/\[\[AUTOMATE:.*?\]\]/g, '')
      .replace(/<\s*\/?\s*(?:system|instruction|prompt)[^>]*>/gi, '')
      .trim()
      .slice(0, 1500);

    if (!cleanTurn) continue;
    const geminiRole: 'user' | 'model' = turn.role === 'assistant' ? 'model' : 'user';

    // Gemini requires the first turn in contents to be 'user'
    if (contents.length === 0 && geminiRole === 'model') {
      continue;
    }

    // Merge consecutive turns of the same role to maintain strict alternation
    const prev = contents[contents.length - 1];
    if (prev && prev.role === geminiRole) {
      prev.parts[0].text = `${prev.parts[0].text}\n${cleanTurn}`.slice(0, 1500);
    } else {
      contents.push({
        role: geminiRole,
        parts: [{ text: cleanTurn }],
      });
    }
  }

  const prev = contents[contents.length - 1];
  if (prev && prev.role === 'user') {
    prev.parts[0].text = `${prev.parts[0].text}\n${currentCleanMessage}`.slice(0, 2000);
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: currentCleanMessage }],
    });
  }

  return contents;
}

