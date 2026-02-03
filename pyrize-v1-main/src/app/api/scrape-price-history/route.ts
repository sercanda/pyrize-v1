import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ilanNo } = body;

    if (!ilanNo || typeof ilanNo !== 'string') {
      return NextResponse.json(
        { error: "İlan numarası gerekli" },
        { status: 400 }
      );
    }

    // Python scraper'ı çalıştır
    const scraperPath = path.join(process.cwd(), 'scrapers', 'gecmisi_scraper.py');
    
    console.log(`🔍 Fiyat geçmişi çekiliyor: ${ilanNo}`);
    
    const { stdout, stderr } = await execAsync(
      `python "${scraperPath}" "${ilanNo}"`,
      { timeout: 30000 } // 30 saniye timeout
    );

    if (stderr && !stderr.includes('WARNING')) {
      console.error("❌ Scraper stderr:", stderr);
    }

    // Python'dan JSON çıktısı bekliyoruz
    let result;
    try {
      result = JSON.parse(stdout.trim());
    } catch (e) {
      // Eğer JSON değilse, Python script'ini direkt çalıştır
      const { stdout: scriptOutput } = await execAsync(
        `python -c "from scrapers.gecmisi_scraper import scrape_price_history; import json; result = scrape_price_history('${ilanNo}'); print(json.dumps(result, indent=2, ensure_ascii=False) if result else 'null')"`,
        { timeout: 30000 }
      );
      
      const output = scriptOutput.trim();
      if (output === 'null' || !output) {
        return NextResponse.json(
          { error: "İlan bulunamadı veya fiyat geçmişi yok" },
          { status: 404 }
        );
      }
      
      result = JSON.parse(output);
    }

    if (!result || !result.price_history || result.price_history.length === 0) {
      return NextResponse.json(
        { error: "Fiyat geçmişi bulunamadı" },
        { status: 404 }
      );
    }

    console.log(`✅ Fiyat geçmişi çekildi: ${result.price_history.length} kayıt`);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error("❌ Scraper API hatası:", error);
    
    // Python bulunamadı hatası
    if (error.message?.includes('python') || error.message?.includes('Python')) {
      return NextResponse.json(
        { error: "Python bulunamadı. Lütfen Python'un kurulu olduğundan emin olun." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error?.message || "Fiyat geçmişi çekilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

