export type AIProvider = "openrouter" | "groq";

export interface LLMConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  fallbackProvider?: AIProvider;
  fallbackApiKey?: string;
  fallbackModel?: string;
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

function getBaseHeaders(config: LLMConfig, apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (config.provider === "openrouter") {
    headers["HTTP-Referer"] = window.location.origin;
    headers["X-Title"] = "RepoSage";
  }
  return headers;
}

function shouldUseFallback(res: Response | null, error: unknown): boolean {
  // Fallback on timeout/abort errors (even if res is null)
  if (error instanceof Error && error.name === 'AbortError') return true;
  
  // If we have a response, check status codes
  if (res) {
    // Only fallback on rate limit (429) or server errors (5xx)
    // Do NOT fallback on client errors (4xx except 429)
    if (res.status === 429) return true;
    if (res.status >= 500) return true;
  }
  
  return false;
}

function logProvider(provider: AIProvider, isFallback: boolean): void {
  const prefix = isFallback ? "[FALLBACK]" : "[PRIMARY]";
  console.log(`${prefix} Using LLM provider: ${provider}`);
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function makeLLMRequest(
  provider: AIProvider,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  stream: boolean = false
): Promise<Response> {
  const config = { provider, apiKey, model } as LLMConfig;
  const headers = {
    ...getBaseHeaders(config, apiKey),
    ...(stream ? { Accept: "text/event-stream" } : {}),
  };

  return fetchWithTimeout(API_BASES[provider], {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 4096,
      stream,
    }),
  });
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

  let lastError: Error | null = null;
  let primaryRes: Response | null = null;

  // Try primary provider
  try {
    logProvider(config.provider, false);
    primaryRes = await makeLLMRequest(config.provider, config.apiKey, config.model, messages);
    if (primaryRes.ok) {
      const data = (await primaryRes.json()) as ChatCompletionResponse;
      return (data.choices?.[0]?.message?.content ?? "").trim();
    }
    lastError = new Error(`LLM request failed (${primaryRes.status}): ${await primaryRes.text().catch(() => "")}`);
  } catch (error) {
    lastError = error instanceof Error ? error : new Error(String(error));
  }

  // Try fallback provider if configured and error warrants fallback
  if (config.fallbackProvider && config.fallbackApiKey && config.fallbackModel) {
    if (shouldUseFallback(primaryRes, lastError)) {
      try {
        logProvider(config.fallbackProvider, true);
        const fallbackRes = await makeLLMRequest(
          config.fallbackProvider,
          config.fallbackApiKey,
          config.fallbackModel,
          messages
        );
        if (fallbackRes.ok) {
          const data = (await fallbackRes.json()) as ChatCompletionResponse;
          return (data.choices?.[0]?.message?.content ?? "").trim();
        }
      } catch (fallbackError) {
        console.error("Fallback provider also failed:", fallbackError);
      }
    }
  }

  throw lastError || new Error("LLM request failed");
}

async function processStream(
  res: Response,
  onToken?: (token: string) => void
): Promise<string> {
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

  let lastError: Error | null = null;
  let primaryRes: Response | null = null;

  // Try primary provider
  try {
    logProvider(config.provider, false);
    primaryRes = await makeLLMRequest(config.provider, config.apiKey, config.model, messages, true);
    if (primaryRes.ok) {
      return await processStream(primaryRes, onToken);
    }
    lastError = new Error(`LLM streaming request failed (${primaryRes.status}): ${await primaryRes.text().catch(() => "")}`);
  } catch (error) {
    lastError = error instanceof Error ? error : new Error(String(error));
  }

  // Try fallback provider if configured and error warrants fallback
  if (config.fallbackProvider && config.fallbackApiKey && config.fallbackModel) {
    if (shouldUseFallback(primaryRes, lastError)) {
      try {
        logProvider(config.fallbackProvider, true);
        const fallbackRes = await makeLLMRequest(
          config.fallbackProvider,
          config.fallbackApiKey,
          config.fallbackModel,
          messages,
          true
        );
        if (fallbackRes.ok) {
          return await processStream(fallbackRes, onToken);
        }
      } catch (fallbackError) {
        console.error("Fallback provider also failed:", fallbackError);
      }
    }
  }

  throw lastError || new Error("LLM streaming request failed");
}

export async function testConnection(config: LLMConfig): Promise<boolean> {
  try {
    const res = await makeLLMRequest(
      config.provider,
      config.apiKey,
      config.model,
      [{ role: "user", content: "Reply with only the word: ok" }]
    );

    if (!res.ok) return false;
    const data = (await res.json()) as ChatCompletionResponse;
    return !!data.choices?.[0]?.message?.content;
  } catch {
    return false;
  }
}
