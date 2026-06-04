export type AIProvider = "openrouter" | "groq";

export interface LLMConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

interface ChatCompletionChoice {
  message?: { content?: string };
  delta?: { content?: string };
}

interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[];
}

const STORAGE_KEY = "reposage-llm-config";

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openrouter: "deepseek/deepseek-chat",
  groq: "qwen-2.5-coder-32b",
};

const API_BASES: Record<AIProvider, string> = {
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
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

function getBaseHeaders(config: LLMConfig): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
  };
  if (config.provider === "openrouter") {
    headers["HTTP-Referer"] = window.location.origin;
    headers["X-Title"] = "RepoSage";
  }
  return headers;
}

export async function generateText(
  prompt: string,
  system?: string
): Promise<string> {
  const config = getStoredConfig();
  if (!config) throw new Error("No AI provider configured");

  const messages: { role: string; content: string }[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const res = await fetch(API_BASES[config.provider], {
    method: "POST",
    headers: getBaseHeaders(config),
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as ChatCompletionResponse;
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

export async function streamText(
  prompt: string,
  system?: string,
  onToken?: (token: string) => void
): Promise<string> {
  const config = getStoredConfig();
  if (!config) throw new Error("No AI provider configured");

  const messages: { role: string; content: string }[] = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: prompt });

  const res = await fetch(API_BASES[config.provider], {
    method: "POST",
    headers: {
      ...getBaseHeaders(config),
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: 4096,
      stream: true,
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
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6);
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data) as ChatCompletionResponse;
          const token = parsed.choices?.[0]?.delta?.content ?? "";
          if (token) {
            full += token;
            onToken?.(token);
          }
        } catch {
          // skip malformed JSON chunks
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
    const res = await fetch(API_BASES[config.provider], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        ...(config.provider === "openrouter"
          ? {
              "HTTP-Referer": window.location.origin,
              "X-Title": "RepoSage",
            }
          : {}),
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: "Reply with only the word: ok" }],
        max_tokens: 10,
      }),
    });

    if (!res.ok) return false;
    const data = (await res.json()) as ChatCompletionResponse;
    return !!data.choices?.[0]?.message?.content;
  } catch {
    return false;
  }
}
