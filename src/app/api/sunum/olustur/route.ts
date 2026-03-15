import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sunumOlustur } from "@/lib/ai/gemini-service";
import { generateWeeklyReportAI } from "@/lib/ai/weekly-report-service";
import { SunumOlusturmaIstegi, HaftalikRaporVerisi } from "@/types";
import { withSecurity } from "@/lib/security/withSecurity";
import { securityConfig } from "@/lib/security/config";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { syncCrmWithPresentation } from "@/lib/crm/integration";
import { marketAnalysisService } from "@/lib/services/market-analysis/market-analysis-service";
import { CREDIT_COSTS } from "@/lib/constants/credits";
import { getKFEForProperty, getKFEData, getNUTS2RegionCode } from "@/lib/utils/kfe";

// Next.js API route timeout'unu 60 saniyeye çıkar (OpenRouter için)
export const maxDuration = 60;

type SunumOlusturBody = SunumOlusturmaIstegi & {
  template?: string;
  baslik?: string;
  sunumTuru?: 'normal_sunum' | 'haftalik_rapor';
  haftalikRapor?: HaftalikRaporVerisi;
};

const estimateCost = (body: Partial<SunumOlusturBody> | null | undefined) => {
  // TODO: Credit check will be implemented here
  // For now, return minimal cost to bypass budget limit
  // Credit system will handle actual payment checks
  return 0.01; // Minimal cost (budget check is effectively disabled)
};

export async function POST(request: NextRequest) {
  return withSecurity<SunumOlusturBody>(
    request,
    async ({ body, registerActualCost, userId }) => {
      console.log("📨 Sunum oluşturma isteği alındı, userId:", userId);
      try {
        if (!body?.danisman?.adSoyad || !body.danisman.telefon) {
          return NextResponse.json(
            { error: "Danışman bilgileri eksik (Ad Soyad ve Telefon zorunludur)" },
            { status: 400 }
          );
        }

        // Haftalık rapor kontrolü
        if (body.sunumTuru === 'haftalik_rapor') {
          const haftalikRapor = body.haftalikRapor;
          if (!haftalikRapor) {
            return NextResponse.json(
              { error: "Haftalık rapor verileri eksik" },
              { status: 400 }
            );
          }
          console.log("📊 Haftalık rapor oluşturuluyor...");
          
          // AI destekli içerik oluştur
          console.log("🤖 AI performans analizi oluşturuluyor...");
          const aiOutput = await generateWeeklyReportAI(haftalikRapor);
          console.log("✅ AI analizi tamamlandı");
          
          // AI çıktılarını rapor verisine ekle
          haftalikRapor.aiPerformansYorumu = aiOutput.aiPerformansYorumu;
          haftalikRapor.aiStratejiOnerisi = aiOutput.aiStratejiOnerisi;
          haftalikRapor.aiHaftalikOzet = aiOutput.aiHaftalikOzet;
          
          // Haftalık rapor için içerik
          const haftaBaslangic = haftalikRapor.haftaBaslangic 
            ? (typeof haftalikRapor.haftaBaslangic === 'string' ? new Date(haftalikRapor.haftaBaslangic) : haftalikRapor.haftaBaslangic)
            : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const haftaBitis = haftalikRapor.haftaBitis
            ? (typeof haftalikRapor.haftaBitis === 'string' ? new Date(haftalikRapor.haftaBitis) : haftalikRapor.haftaBitis)
            : new Date();
          
          const icerik = {
            baslik: body.baslik || haftalikRapor.raporBasligi || `Haftalık Performans Raporu - ${new Date().toLocaleDateString('tr-TR')}`,
            altBaslik: `${haftaBaslangic.toLocaleDateString('tr-TR')} - ${haftaBitis.toLocaleDateString('tr-TR')}`,
            heroAciklama: aiOutput.aiHaftalikOzet || `Bu hafta ${haftalikRapor.toplamGoruntulenme || 0} görüntülenme, ${haftalikRapor.tiklanmaSayisi || 0} tıklama ve ${haftalikRapor.erisimReach || 0} erişim kaydedildi.`,
            bolgeler: []
          };

          // Generate UUID for haftalik_rapor as well
          const haftalikRaporId = randomUUID();
          const haftalikRaporSlug = `haftalik-rapor-${Date.now()}`;
          console.log("📝 ID (UUID) oluşturuldu:", haftalikRaporId);
          console.log("📝 Slug oluşturuldu:", haftalikRaporSlug);

          // TASK A: getSupabaseServiceClient must not fail or return null
          let supabaseServer;
          try {
            supabaseServer = getSupabaseServiceClient();
            if (!supabaseServer) {
              throw new Error('Supabase client is null/undefined');
            }
          } catch (error: any) {
            console.error("❌ Supabase client oluşturulamadı:", error?.message);
            return NextResponse.json(
              { error: `Veritabanı bağlantısı başarısız: ${error?.message || 'Bilinmeyen hata'}` },
              { status: 500 }
            );
          }

          const createdAtIso = new Date().toISOString();
          let customerId: string | null = null;

          // CRM sync (non-critical, can fail silently)
          try {
            const syncResult = await syncCrmWithPresentation({
              supabase: supabaseServer,
              slug: haftalikRaporSlug,
              sunum: body,
              presentationTitle: icerik.baslik,
              createdAt: createdAtIso,
            });
            customerId = syncResult.customerId || null;
          } catch (error) {
            console.warn("CRM entegrasyonu başarısız:", error);
          }

          // TASK A: DB upsert - MUST succeed (throws if fails)
          const { error: dbError } = await supabaseServer.from("sunumlar").upsert({
            id: haftalikRaporId,
            slug: haftalikRaporSlug,
            baslik: icerik.baslik,
            durum: "aktif",
            mulk_turu: null,
            fiyat: null,
            customer_id: customerId,
            user_id: userId || null,
            istek: body,
            icerik,
            sunum_turu: 'haftalik_rapor',
            created_at: createdAtIso,
            updated_at: createdAtIso,
          });

          if (dbError) {
            console.error("❌ Haftalık rapor kaydedilemedi:", {
              id: haftalikRaporId,
              slug: haftalikRaporSlug,
              error: dbError.message,
              code: dbError.code,
              details: dbError.details,
            });
            return NextResponse.json(
              { error: `Haftalık rapor veritabanına kaydedilemedi: ${dbError.message}` },
              { status: 500 }
            );
          }
          console.log("✅ Sunum veritabanına kaydedildi:", { id: haftalikRaporId, slug: haftalikRaporSlug });

          // TASK A: Immediately read back the row by id to verify it exists
          const { data: verifiedRecord, error: verifyError } = await supabaseServer
            .from("sunumlar")
            .select("*")
            .eq("id", haftalikRaporId)
            .single();

          if (verifyError || !verifiedRecord) {
            console.error("❌ Haftalık rapor doğrulanamadı:", {
              id: haftalikRaporId,
              error: verifyError?.message || "Record not found after insert",
            });
            return NextResponse.json(
              { error: `Haftalık rapor kaydedildi ancak doğrulanamadı: ${verifyError?.message || "Record not found"}` },
              { status: 500 }
            );
          }
          console.log("✅ Sunum DB readback ok:", { id: haftalikRaporId });
          
          return NextResponse.json({
            success: true,
            data: {
              id: haftalikRaporId, // UUID (canonical identifier - ONLY identifier for DB lookups)
              slug: haftalikRaporSlug, // Display-only slug
              updated_at: createdAtIso,
              icerik,
              istek: body,
              publicUrl: `/sunum/${haftalikRaporId}`, // Use UUID in URL
            },
          });
        }

        // Normal sunum için validasyonlar
        if (!body.mulk?.tur || !body.mulk.konum) {
          return NextResponse.json(
            { error: "Gayrimenkul bilgileri eksik" },
            { status: 400 }
          );
        }

        if (!body.amac || !body.uzunluk || !body.tema) {
          return NextResponse.json(
            { error: "Sunum parametreleri eksik" },
            { status: 400 }
          );
        }

        console.log("🤖 AI içerik oluşturuluyor...");
        console.log("📍 Konum Analizi:", body.locationAnalysis ? "Mevcut" : "Yok");
        console.log("📝 Ek Açıklama:", body.mulk?.aciklama ? "Mevcut" : "Yok");
        console.log("🎯 Amaç:", body.amac);

        // Fetch market analysis data if location is provided
        let marketData = null;
        if (body.mulk?.konum) {
          try {
            console.log("📊 Market analizi çekiliyor:", body.mulk.konum);
            marketData = await marketAnalysisService.getMarketAnalysis({
              location: body.mulk.konum,
              forceRefresh: false, // Use cache if available
            });
            console.log("✅ Market analizi hazır:", marketData ? "Var" : "Yok");
          } catch (error) {
            console.warn("⚠️ Market analizi alınamadı (sunum devam ediyor):", error);
          }
        }

        const icerik = await sunumOlustur(body, body.template, marketData);
        console.log("✅ AI içerik oluşturuldu");

        // Fotoğrafları ve ilan no'yu icerik'e ekle
        if (body.mulk?.fotograflar && body.mulk.fotograflar.length > 0) {
          (icerik as any).fotograflar = body.mulk.fotograflar;
          console.log("✅ Fotoğraflar eklendi:", body.mulk.fotograflar.length, "adet");
        }
        if (body.mulk?.ilanNo) {
          (icerik as any).ilanNo = body.mulk.ilanNo;
          console.log("✅ İlan No eklendi:", body.mulk.ilanNo);
        }

        // KFE verilerini hesapla ve icerik'e ekle
        try {
          const kfeData = getKFEForProperty(body.mulk);
          const regionCode = getNUTS2RegionCode(body.mulk.konum);
          // Son 6 ay trend verisi
          const kfeTrendData = getKFEData(regionCode, '').slice(-6);
          
          // KFE verilerini icerik'e metadata olarak ekle
          (icerik as any).kfeData = {
            ...kfeData,
            trendData: kfeTrendData,
          };
          console.log("✅ KFE verileri eklendi:", kfeData.bolge.regionCode, `(${kfeTrendData.length} trend kaydı)`);
        } catch (error) {
          console.warn("⚠️ KFE verileri hesaplanamadı (sunum devam ediyor):", error);
        }

        // Generate UUID as canonical identifier and slug for human-readable URL
        const id = randomUUID();
        const slug = `${body.mulk.konum
          .toLowerCase()
          .replace(/ı/g, "i")
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}-${Date.now()}`;
        console.log("📝 ID (UUID) oluşturuldu:", id);
        console.log("📝 Slug oluşturuldu:", slug);

        // TASK A: getSupabaseServiceClient must not fail or return null
        let supabaseServer;
        try {
          supabaseServer = getSupabaseServiceClient();
          if (!supabaseServer) {
            throw new Error('Supabase client is null/undefined');
          }
        } catch (error: any) {
          console.error("❌ Supabase client oluşturulamadı:", error?.message);
          return NextResponse.json(
            { error: `Veritabanı bağlantısı başarısız: ${error?.message || 'Bilinmeyen hata'}` },
            { status: 500 }
          );
        }

        const createdAtIso = new Date().toISOString();
        let customerId: string | null = null;

        // CRM sync (non-critical, can fail silently)
        try {
          const syncResult = await syncCrmWithPresentation({
            supabase: supabaseServer,
            slug,
            sunum: body,
            presentationTitle: body.baslik || body?.mulk?.konum || "Sunum",
            createdAt: createdAtIso,
          });
          customerId = syncResult.customerId || null;
        } catch (error) {
          console.warn("CRM entegrasyonu başarısız:", error);
        }

        // TASK A: DB upsert - MUST succeed (throws if fails)
        const { error: dbError } = await supabaseServer.from("sunumlar").upsert({
          id: id,
          slug,
          baslik: body.baslik || body?.mulk?.konum || "Sunum",
          durum: "aktif",
          mulk_turu: body.mulk?.tur || null,
          fiyat:
            body.mulk?.fiyatMax ??
            body.mulk?.fiyatMin ??
            body.mulk?.fiyat ??
            null,
          customer_id: customerId,
          user_id: userId || null,
          istek: body,
          icerik,
          created_at: createdAtIso,
          updated_at: createdAtIso,
        });

        if (dbError) {
          console.error("❌ Supabase sunum kaydı oluşturulamadı:", {
            id,
            slug,
            error: dbError.message,
            code: dbError.code,
            details: dbError.details,
          });
          return NextResponse.json(
            { error: `Sunum veritabanına kaydedilemedi: ${dbError.message}` },
            { status: 500 }
          );
        }
        console.log("✅ Sunum veritabanına kaydedildi:", { id, slug });

        // TASK A: Immediately read back the row by id to verify it exists
        const { data: verifiedRecord, error: verifyError } = await supabaseServer
          .from("sunumlar")
          .select("*")
          .eq("id", id)
          .single();

        if (verifyError || !verifiedRecord) {
          console.error("❌ Sunum doğrulanamadı:", {
            id,
            slug,
            error: verifyError?.message || "Record not found after insert",
          });
          return NextResponse.json(
            { error: `Sunum kaydedildi ancak doğrulanamadı: ${verifyError?.message || "Record not found"}` },
            { status: 500 }
          );
        }
        console.log("✅ Sunum DB readback ok:", { id });

        registerActualCost(estimateCost(body));

        const responseData = {
          success: true,
          data: {
            id, // UUID (canonical identifier - ONLY identifier for DB lookups)
            slug, // Human-readable slug (display-only, never used for DB lookups)
            updated_at: createdAtIso, // ISO timestamp for cache validation
            olusturmaTarihi: createdAtIso, // Keep for backward compatibility
            customerId,
            istek: {
              ...body,
              template: body.template || "detayli_analiz",
            },
            icerik,
            publicUrl: `/sunum/${id}`, // Use UUID in URL (canonical identifier)
          },
        };

        // Log id for consistency tracking
        console.log("🎉 Sunum başarıyla oluşturuldu ve gönderiliyor");
        console.log("📋 Created sunum ID (UUID):", id);
        return NextResponse.json(responseData);
      } catch (error: any) {
        console.error("Sunum oluşturma hatası:", error);
        return NextResponse.json(
          { error: error.message || "Sunum oluşturulamadı" },
          { status: 500 }
        );
      }
    },
    {
      identifyUser: ({ body, ip }) =>
        body?.danisman?.email || body?.danisman?.telefon || ip,
      estimateCost: ({ body }) => estimateCost(body),
      configOverride: {
        payload: {
          maxBytes: 900_000,
        },
      },
    }
  );
}

