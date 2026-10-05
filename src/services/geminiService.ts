/**
 * Gemini Service (Direct Native REST API & Server Proxy Integration)
 * Seamlessly handles browser preview environments and Node backend contexts.
 */

export const DEFAULT_EMBEDDING_MODEL = 'gemini-embedding-2-preview';
export const FALLBACK_EMBEDDING_MODEL = 'gemini-embedding-001';
export const EMBEDDING_DIMENSION = 768;

/**
 * Resolves the Gemini API Key from environment variables.
 */
export function getApiKey(): string {
  const apiKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    (typeof window !== 'undefined' && ((window as any).VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY)) ||
    (typeof process !== 'undefined' && (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY || process.env?.API_KEY)) ||
    '';

  return apiKey;
}

/**
 * Robust timeout wrapper around native promises
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 6000,
  operationName: string = 'REST API operation'
): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Timeout Error: ${operationName} did not respond within ${timeoutMs / 1000}s`));
    }, timeoutMs);
  });

  return Promise.race([
    promise.then(
      (res) => {
        clearTimeout(timer);
        return res;
      },
      (err) => {
        clearTimeout(timer);
        throw err;
      }
    ),
    timeoutPromise,
  ]);
}

/**
 * Generates vector embeddings for input text.
 * 1. Tries server proxy /api/gemini/embed if running in browser
 * 2. Tries direct Google REST fetch if key is present
 */
export async function generateEmbedding(text: string, _dimension?: number): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Text to embed cannot be empty.');
  }

  // Strategy 1: Server proxy (bypasses browser CORS & sandbox issues)
  if (typeof window !== 'undefined') {
    try {
      console.log(`[geminiService] Requesting embedding via server proxy (/api/gemini/embed)...`);
      const res = await withTimeout(
        fetch('/api/gemini/embed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
        }),
        6000,
        'Server proxy embed'
      );

      if (res.ok) {
        const data = await res.json();
        if (data.values && Array.isArray(data.values) && data.values.length > 0) {
          console.log(`[geminiService] Embedding received via server proxy (${data.values.length} dims)`);
          return data.values;
        }
      }
    } catch (proxyErr) {
      console.warn('[geminiService] Server proxy embed failed, trying direct REST fetch...', proxyErr);
    }
  }

  // Strategy 2: Direct Google REST API fetch
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Error: VITE_GEMINI_API_KEY is missing.');
  }

  const candidateModels = [DEFAULT_EMBEDDING_MODEL, FALLBACK_EMBEDDING_MODEL];
  let lastErrorMsg = '';

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
      const body = {
        model: `models/${model}`,
        content: {
          parts: [{ text: trimmed }],
        },
        outputDimensionality: EMBEDDING_DIMENSION,
      };

      console.log(`[geminiService] Requesting direct REST embedding from ${model}...`);
      const fetchPromise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const response = await withTimeout(fetchPromise, 6000, `${model} direct fetch`);

      if (response.ok) {
        const data = await response.json();
        const values = data?.embedding?.values || data?.embeddings?.[0]?.values;

        if (values && Array.isArray(values) && values.length > 0) {
          console.log(`[geminiService] Embedding received directly from ${model} (${values.length} dims)`);
          return values;
        }
      } else {
        const errorText = await response.text();
        let parsed: any;
        try {
          parsed = JSON.parse(errorText);
        } catch {
          parsed = null;
        }
        lastErrorMsg = parsed?.error?.message || `HTTP ${response.status}: ${errorText}`;
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || 'Direct fetch failed';
    }
  }

  throw new Error(`Embedding REST API Error: ${lastErrorMsg}`);
}

export interface GenerateContentParams {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  responseMimeType?: string;
}

/**
 * Generates structured or raw text content via Gemini.
 * 1. Tries server proxy /api/gemini/generate if running in browser
 * 2. Tries direct Google REST fetch if key is present
 */
export async function generateContentDirect(params: GenerateContentParams): Promise<string> {
  const modelName = params.model || 'gemini-3.5-flash-lite';

  // Strategy 1: Server proxy
  if (typeof window !== 'undefined') {
    try {
      console.log(`[geminiService] Requesting content generation via server proxy (/api/gemini/generate)...`);
      const res = await withTimeout(
        fetch('/api/gemini/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: params.prompt,
            systemInstruction: params.systemInstruction,
            model: modelName,
            responseMimeType: params.responseMimeType || 'application/json',
          }),
        }),
        10000,
        'Server proxy generate'
      );

      if (res.ok) {
        const data = await res.json();
        if (typeof data.text === 'string' && data.text.length > 0) {
          console.log(`[geminiService] Content generated via server proxy (${data.text.length} chars)`);
          return data.text;
        }
      }
    } catch (proxyErr) {
      console.warn('[geminiService] Server proxy generate failed, trying direct REST fetch...', proxyErr);
    }
  }

  // Strategy 2: Direct Google REST API fetch with candidate failover
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Error: VITE_GEMINI_API_KEY is missing.');
  }

  const candidateModels = Array.from(new Set([modelName, 'gemini-3.5-flash-lite', 'gemini-3.8-flash']));
  let lastErrorMsg = '';

  for (const currentModel of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
      const bodyPayload: any = {
        contents: [{ parts: [{ text: params.prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: params.responseMimeType || 'application/json',
        },
      };

      if (params.systemInstruction) {
        bodyPayload.systemInstruction = {
          parts: [{ text: params.systemInstruction }],
        };
      }

      console.log(`[geminiService] Sending direct REST request to ${currentModel}...`);
      const fetchPromise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const response = await withTimeout(fetchPromise, 10000, `${currentModel} direct fetch`);

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text === 'string' && text.length > 0) {
          console.log(`[geminiService] Content successfully generated from ${currentModel} (${text.length} chars)`);
          return text;
        }
      } else {
        const errorText = await response.text();
        let parsed: any;
        try {
          parsed = JSON.parse(errorText);
        } catch {
          parsed = null;
        }
        lastErrorMsg = parsed?.error?.message || `HTTP ${response.status}: ${errorText}`;
        console.warn(`[geminiService] Model ${currentModel} returned error: ${lastErrorMsg}, checking next candidate...`);
      }
    } catch (err: any) {
      lastErrorMsg = err?.message || 'Direct fetch failed';
      console.warn(`[geminiService] Model ${currentModel} exception: ${lastErrorMsg}, checking next candidate...`);
    }
  }

  throw new Error(`Gemini REST API Error: ${lastErrorMsg}`);
}
