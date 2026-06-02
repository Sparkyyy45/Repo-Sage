"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, Loader2 } from "lucide-react";
import { saveConfig, testConnection, DEFAULT_MODELS } from "@/lib/llm/provider";
import type { AIProvider, LLMConfig } from "@/lib/llm/provider";

const MODELS: Record<AIProvider, string[]> = {
  openrouter: [
    "deepseek/deepseek-chat",
    "qwen/qwen-2.5-coder-32b-instruct",
    "mistralai/mistral-7b-instruct",
    "google/gemini-2.0-flash-001",
    "anthropic/claude-3-haiku",
  ],
  groq: [
    "qwen-2.5-coder-32b",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
    "deepseek-r1-distill-qwen-32b",
  ],
};

export function AISettings() {
  const router = useRouter();
  const [provider, setProvider] = useState<AIProvider>(() => {
    try {
      const stored = localStorage.getItem("reposage-llm-config");
      if (stored) return (JSON.parse(stored) as LLMConfig).provider;
    } catch { /* ignore */ }
    return "openrouter";
  });

  const [apiKey, setApiKey] = useState(() => {
    try {
      const stored = localStorage.getItem("reposage-llm-config");
      if (stored) return (JSON.parse(stored) as LLMConfig).apiKey;
    } catch { /* ignore */ }
    return "";
  });

  const [model, setModel] = useState(() => {
    try {
      const stored = localStorage.getItem("reposage-llm-config");
      if (stored) return (JSON.parse(stored) as LLMConfig).model;
    } catch { /* ignore */ }
    return "";
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "fail" | null>(null);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    const config: LLMConfig = { provider, apiKey: apiKey.trim(), model: model || DEFAULT_MODELS[provider] };
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    const config: LLMConfig = { provider, apiKey: apiKey.trim(), model: model || DEFAULT_MODELS[provider] };
    const ok = await testConnection(config);
    setTestResult(ok ? "success" : "fail");
    setTesting(false);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🤖</span>
          <h1 className="text-lg font-semibold text-foreground">AI Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Configure an AI provider to unlock onboarding guides and issue analysis.
          Your key is stored in your browser only — never sent to our server.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Provider</label>
            <div className="flex gap-2">
              {(["openrouter", "groq"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setProvider(p); setModel(DEFAULT_MODELS[p]); }}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                    provider === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {p === "openrouter" ? "OpenRouter" : "Groq"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              {MODELS[provider].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : (
                "Save"
              )}
            </button>

            <button
              onClick={handleTest}
              disabled={!apiKey.trim() || testing}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              {testing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : testResult === "success" ? (
                <Check className="size-4 text-emerald-500" />
              ) : testResult === "fail" ? (
                <X className="size-4 text-destructive" />
              ) : null}
              Test Connection
            </button>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              🔒 Your API key is stored in <code className="text-xs text-foreground">localStorage</code> and sent directly
              from your browser to the AI provider. We never see, store, or transmit your key.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
