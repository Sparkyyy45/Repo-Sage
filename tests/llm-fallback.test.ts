import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateText, streamText, saveConfig, clearConfig } from "@/lib/llm/provider";
import type { LLMConfig } from "@/lib/llm/provider";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// Mock window.location
Object.defineProperty(global, "window", {
  value: {
    location: {
      origin: "http://localhost:3000",
    },
  },
});

describe("LLM Fallback Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    clearConfig();
  });

  it("should use primary provider when it succeeds", async () => {
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
      fallbackProvider: "groq",
      fallbackApiKey: "test-fallback-key",
      fallbackModel: "qwen-2.5-coder-32b",
    };
    saveConfig(config);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Primary response" } }],
      }),
    });

    const result = await generateText("test prompt");
    expect(result).toBe("Primary response");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.any(Object)
    );
  });

  it("should fallback to secondary provider on 429 rate limit", async () => {
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
      fallbackProvider: "groq",
      fallbackApiKey: "test-fallback-key",
      fallbackModel: "qwen-2.5-coder-32b",
    };
    saveConfig(config);

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limited",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "Fallback response" } }],
        }),
      });

    const result = await generateText("test prompt");
    expect(result).toBe("Fallback response");
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "https://openrouter.ai/api/v1/chat/completions",
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "https://api.groq.com/openai/v1/chat/completions",
      expect.any(Object)
    );
  });

  it("should fallback on timeout (AbortError)", async () => {
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
      fallbackProvider: "groq",
      fallbackApiKey: "test-fallback-key",
      fallbackModel: "qwen-2.5-coder-32b",
    };
    saveConfig(config);

    const abortError = new DOMException("Request timeout", "AbortError");

    mockFetch
      .mockRejectedValueOnce(abortError)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "Fallback response" } }],
        }),
      });

    const result = await generateText("test prompt");
    expect(result).toBe("Fallback response");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should fallback on 5xx server errors", async () => {
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
      fallbackProvider: "groq",
      fallbackApiKey: "test-fallback-key",
      fallbackModel: "qwen-2.5-coder-32b",
    };
    saveConfig(config);

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => "Service unavailable",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "Fallback response" } }],
        }),
      });

    const result = await generateText("test prompt");
    expect(result).toBe("Fallback response");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should not fallback on 4xx client errors (except 429)", async () => {
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
      fallbackProvider: "groq",
      fallbackApiKey: "test-fallback-key",
      fallbackModel: "qwen-2.5-coder-32b",
    };
    saveConfig(config);

    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad request",
    });

    await expect(generateText("test prompt")).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should not fallback when fallback is not configured", async () => {
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
    };
    saveConfig(config);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => "Rate limited",
    });

    await expect(generateText("test prompt")).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should throw when both primary and fallback fail", async () => {
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
      fallbackProvider: "groq",
      fallbackApiKey: "test-fallback-key",
      fallbackModel: "qwen-2.5-coder-32b",
    };
    saveConfig(config);

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limited",
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => "Fallback also failed",
      });

    await expect(generateText("test prompt")).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should log which provider is being used", async () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    const config: LLMConfig = {
      provider: "openrouter",
      apiKey: "test-primary-key",
      model: "deepseek/deepseek-chat",
      fallbackProvider: "groq",
      fallbackApiKey: "test-fallback-key",
      fallbackModel: "qwen-2.5-coder-32b",
    };
    saveConfig(config);

    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limited",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "Fallback response" } }],
        }),
      });

    const result = await generateText("test prompt");
    expect(result).toBe("Fallback response");
    expect(consoleLogSpy).toHaveBeenCalledWith("[PRIMARY] Using LLM provider: openrouter");
    expect(consoleLogSpy).toHaveBeenCalledWith("[FALLBACK] Using LLM provider: groq");
    consoleLogSpy.mockRestore();
  });
});
