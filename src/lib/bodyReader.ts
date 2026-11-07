export type BodyReadResult<T = unknown> =
  | { ok: true; data: T; byteLength: number }
  | {
      ok: false;
      status: 400 | 413;
      code: 'PAYLOAD_TOO_LARGE' | 'INVALID_JSON' | 'EMPTY_BODY' | 'STREAM_ERROR';
      error: string;
    };

/**
 * Reads and parses a JSON request body enforcing a hard byte limit on the underlying stream.
 * Does NOT rely solely on the Content-Length header, preventing chunked/spoofed payload bypasses.
 */
export async function readJsonBodyWithLimit<T = unknown>(
  req: Request,
  maxBytes: number
): Promise<BodyReadResult<T>> {
  const declaredLengthHeader = req.headers.get('content-length');
  if (declaredLengthHeader !== null) {
    const declaredLength = Number(declaredLengthHeader);
    if (!Number.isNaN(declaredLength) && declaredLength > maxBytes) {
      return {
        ok: false,
        status: 413,
        code: 'PAYLOAD_TOO_LARGE',
        error: 'Payload excede o limite permitido.',
      };
    }
  }

  if (!req.body) {
    return {
      ok: false,
      status: 400,
      code: 'EMPTY_BODY',
      error: 'Corpo da requisição vazio.',
    };
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel().catch(() => {});
          return {
            ok: false,
            status: 413,
            code: 'PAYLOAD_TOO_LARGE',
            error: 'Payload excede o limite permitido.',
          };
        }
        chunks.push(value);
      }
    }
  } catch {
    return {
      ok: false,
      status: 400,
      code: 'STREAM_ERROR',
      error: 'Leitura da requisição interrompida ou inválida.',
    };
  }

  if (totalBytes === 0) {
    return {
      ok: false,
      status: 400,
      code: 'EMPTY_BODY',
      error: 'Corpo da requisição vazio.',
    };
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder('utf-8', { fatal: false }).decode(combined);
  try {
    const parsed = JSON.parse(text) as T;
    return { ok: true, data: parsed, byteLength: totalBytes };
  } catch {
    return {
      ok: false,
      status: 400,
      code: 'INVALID_JSON',
      error: 'JSON inválido.',
    };
  }
}

