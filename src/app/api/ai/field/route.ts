import { NextRequest, NextResponse } from "next/server";
import { generateFieldContent } from "@/lib/ai/gemini-service";
import { MulkBilgileri, SunumAmaci, SunumStili, TemaTuru } from "@/types";
import { withSecurity } from "@/lib/security/withSecurity";
import { securityConfig } from "@/lib/security/config";

type FieldRequestBody = {
  field: "konum_avantajlari" | "kullanim_potansiyeli" | "aciklama";
  seed?: string;
  mulk: Partial<MulkBilgileri> & { tur: MulkBilgileri["tur"]; konum: string };
  tema?: TemaTuru;
  amac?: SunumAmaci;
  sunumStili?: SunumStili;
  locationAnalysis?: string;
};

const estimateCost = (body: FieldRequestBody | null | undefined) => {
  if (!body) return securityConfig.defaultRequestCost * 0.3;
  let cost = securityConfig.defaultRequestCost * 0.25;
  if (body.locationAnalysis) cost += 0.05;
  return Math.min(cost, securityConfig.budget.dailyLimit);
};

export async function POST(request: NextRequest) {
  return withSecurity<FieldRequestBody>(
    request,
    async ({ body, registerActualCost }) => {
      console.log("📨 /api/ai/field isteği alındı");
      console.log("📦 Request body:", JSON.stringify(body, null, 2));
      
      try {
        if (!body?.field) {
          console.error("❌ field parametresi eksik");
          return NextResponse.json(
            { success: false, error: "field parametresi gerekli." },
            { status: 400 }
          );
        }

        if (!body?.mulk?.tur || !body?.mulk?.konum) {
          console.error("❌ Mülk bilgileri eksik:", { tur: body?.mulk?.tur, konum: body?.mulk?.konum });
          return NextResponse.json(
            { success: false, error: "Mülk türü ve konum bilgisi gerekli." },
            { status: 400 }
          );
        }

        console.log("🚀 generateFieldContent çağrılıyor...");
        const values = await generateFieldContent({
          field: body.field,
          seed: body.seed || "",
          mulk: body.mulk,
          tema: body.tema,
          amac: body.amac,
          sunumStili: body.sunumStili,
          locationAnalysis: body.locationAnalysis,
        });

        console.log("✅ generateFieldContent tamamlandı:", { valuesCount: values.length, values });

        registerActualCost(estimateCost(body));

        return NextResponse.json({
          success: true,
          field: body.field,
          values,
        });
      } catch (error: any) {
        console.error("❌ Alan içeriği API hatası:", error);
        console.error("❌ Error stack:", error?.stack);
        console.error("❌ Error details:", {
          message: error?.message,
          name: error?.name,
          cause: error?.cause
        });
        return NextResponse.json(
          {
            success: false,
            error:
              error?.message ||
              "AI ile içerik oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.",
          },
          { status: 500 }
        );
      }
    },
    {
      identifyUser: ({ body, ip }) =>
        body?.mulk?.konum || body?.seed || ip,
      estimateCost: ({ body }) => estimateCost(body),
    }
  );
}

