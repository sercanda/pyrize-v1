import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import { CREDIT_COSTS } from "@/lib/constants/credits";

const DEFAULT_PROMPT = `Transform this empty room into a beautifully staged, modern living space for a real estate listing. Add realistic furniture, natural lighting, wall art, indoor plants, and soft shadows. Keep the room bright, inviting, and photorealistic. Maintain the same camera angle and proportions. Real estate interior design, ultra realistic, 4K, natural light.`;

type FurnishRequestBody = {
  imageUrl?: string;
  prompt?: string;
  stylePreset?: "modern" | "minimal" | "luxury" | "scandinavian" | "custom";
};

export async function POST(req: NextRequest) {
  const falKey = process.env.FAL_KEY;

  if (!falKey) {
    return NextResponse.json(
      { error: "Sunucu yapılandırmasında FAL_KEY eksik." },
      { status: 500 },
    );
  }

  fal.config({
    credentials: falKey,
  });

  const body = (await req.json()) as FurnishRequestBody;
  const { imageUrl, prompt, stylePreset } = body;

  if (!imageUrl) {
    return NextResponse.json(
      { error: "imageUrl parametresi zorunludur." },
      { status: 400 },
    );
  }

  const finalPrompt = buildPrompt({ userPrompt: prompt, stylePreset });

  try {
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: finalPrompt,
        image_urls: [imageUrl],
      },
      logs: true,
    });

    const images = result.data?.images ?? [];

    if (images.length === 0) {
      return NextResponse.json(
        {
          error: "Fal.ai isteği başarılı oldu ancak herhangi bir görsel dönmedi.",
          requestId: result.requestId,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        prompt: finalPrompt,
        requestId: result.requestId,
        images,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Fal.ai isteği sırasında beklenmeyen bir hata oluştu.",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    );
  }
}

type BuildPromptOptions = {
  userPrompt?: string;
  stylePreset?: FurnishRequestBody["stylePreset"];
};

function buildPrompt({ userPrompt, stylePreset }: BuildPromptOptions) {
  const styleSnippet = getStyleSnippet(stylePreset);

  const pieces = [DEFAULT_PROMPT];

  if (styleSnippet) {
    pieces.push(styleSnippet);
  }

  if (userPrompt) {
    pieces.push(`Ek kullanıcı isteği: ${userPrompt}`);
  }

  return pieces.join("\n\n");
}

function getStyleSnippet(
  stylePreset: FurnishRequestBody["stylePreset"],
): string | undefined {
  switch (stylePreset) {
    case "modern":
      return "Stil: modern, temiz hatlar, mat siyah ve doğal ahşap kombinasyonu, minimal aksesuar.";
    case "minimal":
      return "Stil: minimal, beyaz ve gri tonları, az sayıda eşya, açık alan hissi.";
    case "luxury":
      return "Stil: lüks, mermer yüzeyler, altın detaylar, kadife dokular, dramatik aydınlatma.";
    case "scandinavian":
      return "Stil: İskandinav, açık renk ahşap, pastel tonlar, doğal ışık vurgusu, rahat dokular.";
    default:
      return undefined;
  }
}


