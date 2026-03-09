import { fal } from "@fal-ai/client";

interface CallLLMOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface FalLLMOutput {
  output: string;
  reasoning?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost: number;
  };
}

/**
 * FAL AI OpenRouter Router üzerinden LLM çağrısı yapar.
 * Varsayılan model: google/gemini-2.5-flash
 */
export async function callLLM(opts: CallLLMOptions): Promise<string> {
  const falKey = process.env.FAL_KEY;
  if (!falKey || falKey === "your_fal_key_here") {
    console.warn("⚠️ FAL_KEY bulunamadı veya placeholder — LLM çağrısı yapılamıyor");
    return "";
  }

  fal.config({ credentials: falKey });

  try {
    const result = await fal.subscribe("openrouter/router", {
      input: {
        prompt: opts.prompt,
        system_prompt: opts.systemPrompt || undefined,
        model: opts.model || "google/gemini-2.5-flash",
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens,
      },
    });

    const data = result.data as FalLLMOutput;
    console.log("✅ FAL LLM yanıt alındı, uzunluk:", data.output?.length || 0, "karakter");
    if (data.usage) {
      console.log("📊 Token kullanımı:", data.usage.total_tokens, "token, maliyet:", data.usage.cost);
    }
    return data.output || "";
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ FAL LLM hatası:", err.message || error);
    return "";
  }
}

export function isLLMAvailable(): boolean {
  const falKey = process.env.FAL_KEY;
  return !!falKey && falKey !== "your_fal_key_here";
}
