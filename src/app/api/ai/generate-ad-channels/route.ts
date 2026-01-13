import { NextRequest, NextResponse } from "next/server";
import { MulkBilgileri } from "@/types";
import { withSecurity } from "@/lib/security/withSecurity";
import { securityConfig } from "@/lib/security/config";

// Standart reklam kanalları (her zaman döner)
function getStandardAdChannels(mulkTur: string, fiyat?: number, danismanOfisi?: string): string[] {
  const baseChannels = [
    "Sahibinden Vitrin İlan",
    "Emlakjet Premium Paket",
    "Facebook & Instagram Reklamları",
    "Google Ads (Arama + Display)",
    "YouTube Video Reklamları"
  ];

  // Lüks segmente ek kanallar
  if (fiyat && fiyat > 3000000) {
    baseChannels.push("LinkedIn Profesyonel Ağ");
  }

  // Ofis ağı varsa
  if (danismanOfisi && !danismanOfisi.toLowerCase().includes('bağımsız')) {
    baseChannels.push(`${danismanOfisi} CRM Ağı`);
  }

  // Ticari gayrimenkul için özel
  if (mulkTur === 'isyeri' || mulkTur === 'ticari') {
    baseChannels.push("Ticari Gayrimenkul Platformları");
  }

  return baseChannels;
}

type AdChannelsRequestBody = {
  mulk: Partial<MulkBilgileri> & { tur: MulkBilgileri["tur"]; konum: string };
  danismanOfisAdi?: string;
};

export async function POST(request: NextRequest) {
  return withSecurity<AdChannelsRequestBody>(
    request,
    async ({ body, registerActualCost }) => {
      try {
        if (!body?.mulk?.tur || !body?.mulk?.konum) {
          return NextResponse.json(
            { error: "Mülk türü ve konum bilgisi gerekli." },
            { status: 400 }
          );
        }

        // Her zaman standart fallback kullan (kullanıcı isteği)
        const standardChannels = getStandardAdChannels(body.mulk.tur, body.mulk.fiyatMax || body.mulk.fiyat, body.danismanOfisAdi);
        
        registerActualCost(securityConfig.defaultRequestCost * 0.05); // Çok düşük cost (AI kullanmıyoruz)
        
        return NextResponse.json({
          success: true,
          data: standardChannels
        });
      } catch (error: any) {
        console.error("❌ Reklam kanalları API hatası:", error);
        return NextResponse.json(
          {
            success: false,
            error: error?.message || "Reklam kanalları oluşturulamadı",
          },
          { status: 500 }
        );
      }
    },
    {
      identifyUser: ({ body, ip }) => body?.mulk?.konum || ip,
      estimateCost: () => securityConfig.defaultRequestCost * 0.15,
    }
  );
}

