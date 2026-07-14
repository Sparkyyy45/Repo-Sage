export type AIProvider = "openrouter" | "groq";

export interface LLMConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

const STORAGE_KEY = "reposage-llm-config";

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openrouter: "deepseek/deepseek-chat",
  groq: "qwen-2.5-coder-32b",
};

export function getStoredConfig(): LLMConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LLMConfig;
  } catch {
    return null;
  }
}

export function saveConfig(config: LLMConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function generateText(
  prompt: string,
  system?: string
): Promise<string> {
  const config = getStoredConfig();
  if (!config) throw new Error("No AI provider configured");

  const messages: { role: string; content: string }[] = [];
  messages.push({ role: "user", content: prompt });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: config.apiKey,
      provider: config.provider,
      model: config.model,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${text}`);
  }

  // /api/chat streams by default, so we can just read the stream or collect it
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let full = "";
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith('0:')) {
          try {
            full += JSON.parse(line.slice(2));
          } catch {}
        }
      }
    }
  } finally {
    try { reader.releaseLock(); } catch {}
  }
  
  return full;
}

export async function streamText(
  prompt: string,
  system?: string,
  onToken?: (token: string) => void
): Promise<string> {
  const config = getStoredConfig();
  if (!config) throw new Error("No AI provider configured");

  const messages: { role: string; content: string }[] = [];
  messages.push({ role: "user", content: prompt });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey: config.apiKey,
      provider: config.provider,
      model: config.model,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM streaming request failed (${res.status}): ${text}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body for streaming");

  const decoder = new TextDecoder();
  let full = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith('0:')) {
          try {
            const token = JSON.parse(line.slice(2));
            full += token;
            onToken?.(token);
          } catch {
            // skip malformed JSON chunks
          }
        }
      }
    }
  } finally {
    try { reader.releaseLock(); } catch { console.warn("Failed to release reader lock"); }
  }

  return full;
}

export async function testConnection(config: LLMConfig): Promise<boolean> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: config.apiKey,
        provider: config.provider,
        model: config.model,
        messages: [{ role: "user", content: "Reply with only the word: ok" }],
      }),
    });

    if (!res.ok) return false;
    // we can just read the whole stream as string
    const reader = res.body?.getReader();
    if (!reader) return false;

    const decoder = new TextDecoder();
    let full = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith('0:')) {
          try {
            full += JSON.parse(line.slice(2));
          } catch {}
        }
      }
    }
    return full.length > 0;
  } catch {
    return false;
  }
}
