import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API Client - Google Search grounding ile gerçek veri çekecek
const getAIClient = () => {
  const geminiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 API Key kontrolü:', {
    exists: !!geminiKey,
    length: geminiKey?.length || 0,
    prefix: geminiKey?.substring(0, 10) || 'YOK'
  });
  
  if (geminiKey && geminiKey !== "your_gemini_api_key_here" && geminiKey.length > 20) {
    console.log('✅ Gemini API Client başlatıldı');
    return { type: 'gemini', client: new GoogleGenerativeAI(geminiKey) };
  }
  
  console.warn('⚠️ Gemini API Key bulunamadı, mock mode aktif');
  return { type: 'mock', client: null };
};

type LocationAnalysisBody = {
  city?: string;
  district?: string;
  neighborhood?: string;
  fullAddress?: string;
  propertyType?: string;
  field: 'konumAvantajlari' | 'kullanimPotansiyeli' | 'aciklama';
  mapUrl?: string;
};

// Prompt fonksiyonu - Google Maps Grounding için optimize edilmiş
const buildPrompt = (field: string, address: string, propertyType: string) => {
  const prompts: Record<string, string> = {
    location_advantages: `You are a real estate location analyst in Turkey. Analyze ${address} for ${propertyType}.

TASK: Find REAL location advantages using Google Maps data.

Search for:
- Public transport: metro, tram, bus stops near "${address}"
- Education: schools, universities near "${address}"
- Shopping: malls, supermarkets near "${address}"
- Healthcare: hospitals near "${address}"
- Important landmarks near "${address}"

OUTPUT FORMAT (in Turkish):
• [Real place name] [distance in meters or walking time]
• [Real transport stop] [distance/time]
• [Real facility] [distance/time]

EXAMPLE:
• Bostanlı Metro İstasyonu 400 metre mesafede
• Optimum AVM 1.2 km, yürüyerek 12 dakika
• İzmir Ekonomi Üniversitesi 3 km

IMPORTANT:
- Use REAL place names from Google Maps
- Include approximate distances
- Write 3-5 bullet points
- Write in Turkish (Türkçe)

Analyze ${address} now:`,

    usage_potential: `You are a real estate analyst in Turkey. Analyze usage potential for ${propertyType} in ${address}.

TASK: Determine who would use this property and why, using Google Maps data.

Consider:
- Nearby universities → student rental potential
- Business districts → professional housing demand
- Family facilities → schools, parks for families
- Tourism areas → short-term rental potential

Search Google Maps for universities, offices, schools near "${address}"

OUTPUT FORMAT (in Turkish):
• [Usage type]: [Reason with real nearby places]

EXAMPLE:
• Yüksek kira geliri potansiyeli: İzmir Ekonomi Üniversitesi 3 km mesafede, öğrenci talebi yüksek
• Aile yaşamı için ideal: 5 okul 1 km çapında, parklar mevcut
• İş bölgesine yakınlık: Folkart Towers 4 km mesafede

IMPORTANT:
- Reference REAL places from Google Maps
- 3-5 bullet points
- Write in Turkish (Türkçe)

Analyze ${address} now:`,

    description: `You are a real estate copywriter in Turkey. Write a professional description for ${propertyType} in ${address}.

TASK: Write 2-4 sentences describing the location, using REAL place names from Google Maps.

Search Google Maps for:
- Character of "${address}" neighborhood
- Important nearby landmarks
- Transportation options
- Who lives there (families/students/professionals)

OUTPUT FORMAT (Turkish paragraph):
1. Neighborhood character
2. Nearby important places (REAL NAMES)
3. Suitable for whom
4. Investment value (optional)

EXAMPLE:
"Mavişehir, Karşıyaka'nın modern ve gelişmekte olan mahallelerinden biridir. Bostanlı Metro İstasyonu'na 5 dakika yürüme mesafesinde olup, Optimum AVM ve Kipa AVM'ye kolay erişim sağlar. Hem aile yaşamı hem de genç profesyoneller için idealdir. İzmir Ekonomi Üniversitesi'ne yakınlığı nedeniyle değer artış potansiyeli yüksektir."

IMPORTANT:
- Use REAL place names from Google Maps
- Professional but natural Turkish language
- 2-4 sentences

Write for ${address} now:`
  };

  return prompts[field] || prompts.description;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LocationAnalysisBody;
    const { city, district, neighborhood, fullAddress, propertyType, field, mapUrl } = body;

    if (!field) {
      return NextResponse.json({ error: "Field parameter is required" }, { status: 400 });
    }

    // Adresi oluştur
    const locationParts = [
      fullAddress,
      neighborhood,
      district,
      city
    ].filter(Boolean);
    
    const addressString = locationParts.length > 0 
      ? locationParts.join(", ") 
      : "Türkiye geneli";

    // Field mapping (Frontend key -> Prompt key)
    const fieldMap: Record<string, string> = {
      'konumAvantajlari': 'location_advantages',
      'kullanimPotansiyeli': 'usage_potential',
      'aciklama': 'description'
    };

    const requestedField = fieldMap[field] || 'description';

    // Prompt'u hazırla
    const prompt = buildPrompt(requestedField, addressString, propertyType || "Gayrimenkul");

    // AI Servisini Çağır
    const aiService = getAIClient();
    let resultText = "";

    if (aiService.type === 'gemini' && aiService.client) {
      try {
        console.log(`🔍 Gemini API ile Google Maps Grounding başlatılıyor...`);
        console.log(`📍 Konum: ${addressString}`);
        console.log(`🏠 Mülk Tipi: ${propertyType}`);
        console.log(`📝 Alan: ${field}`);
        
        // Gemini 2.5 Flash - Google Maps Grounding destekliyor
        const model = aiService.client.getGenerativeModel({ 
          model: "gemini-2.5-flash",
        });

        console.log(`📤 Prompt gönderiliyor (${prompt.length} karakter)...`);

        // Google Maps Grounding ile gerçek konum verisi çekimi
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
            topP: 0.95,
            topK: 40,
          },
          // Google Maps Grounding aktif - Gerçek mekan verileri için
          tools: [{ googleMaps: {} }] as any,
          // Opsiyonel: Koordinat verisi (şimdilik genel analiz)
          // toolConfig eklenebilir
        });

        const response = result.response;
        resultText = response.text() || "";
        
        console.log(`✅ Gemini yanıt alındı: ${resultText.length} karakter`);
        console.log(`📄 İlk 200 karakter: ${resultText.substring(0, 200)}...`);
        
        // Google Maps grounding metadata kontrolü
        if (result.response?.candidates?.[0]?.groundingMetadata) {
          const grounding = result.response.candidates[0].groundingMetadata;
          console.log(`🗺️ Google Maps Grounding Aktif!`);
          console.log(`   - Kaynak sayısı: ${grounding.groundingChunks?.length || 0}`);
          console.log(`   - Arama sorguları: ${grounding.webSearchQueries?.join(', ') || 'yok'}`);
          
          if (grounding.groundingChunks && grounding.groundingChunks.length > 0) {
            console.log(`   - İlk kaynak: ${(grounding.groundingChunks[0] as any)?.maps?.title || 'N/A'}`);
          }
        } else {
          console.log(`⚠️ Google Maps grounding metadata bulunamadı`);
        }
        
        // Eğer yanıt çok kısa ise (gerçek analiz yapılmamış olabilir)
        if (resultText.length < 50) {
          console.warn("⚠️ Gemini yanıtı çok kısa, fallback kullanılıyor");
          throw new Error("Yanıt çok kısa");
        }
        
      } catch (apiError: any) {
         console.error("❌ Gemini API Call Error:", apiError);
         console.error("❌ Error details:", {
           name: apiError?.name,
           message: apiError?.message,
           status: apiError?.status,
           statusText: apiError?.statusText
         });
         console.log("⚠️ API hatası, fallback data kullanılıyor");
         
         // API hatası durumunda fallback data kullan
         if (field === 'konumAvantajlari') {
           resultText = `• ${district || city || 'Bölge'} merkezine yakın stratejik konum\n• Toplu taşıma ve ana arterlere kolay erişim\n• Gelişen bölge altyapısı ile değer artış potansiyeli`;
         } else if (field === 'kullanimPotansiyeli') {
           resultText = `• Aile yaşamı için uygun sosyal olanaklar\n• Yatırım amaçlı kira geliri potansiyeli\n• Merkezi konumdan dolayı yüksek talep`;
         } else {
           resultText = `${addressString} konumunda bulunan bu mülk, bölgenin yükselen değerleri arasında yer almaktadır. Hem oturum hem de yatırım amaçlı değerlendirilebilecek, sosyal olanaklara ve ulaşım ağlarına entegre bir yaşam alanıdır.`;
         }
      }
    } else {
      // Fallback / Mock Data (API key yoksa)
      console.warn("⚠️ Gemini API Key eksik veya geçersiz, mock data kullanılıyor");
      if (field === 'konumAvantajlari') {
        resultText = `• ${district || city || 'Bölge'} merkezine yakın stratejik konum\n• Toplu taşıma ve ana arterlere kolay erişim\n• Gelişen bölge altyapısı ile değer artış potansiyeli`;
      } else if (field === 'kullanimPotansiyeli') {
        resultText = `• Aile yaşamı için uygun sosyal olanaklar\n• Yatırım amaçlı kira geliri potansiyeli\n• Merkezi konumdan dolayı yüksek talep`;
      } else {
        resultText = `${addressString} konumunda bulunan bu mülk, bölgenin yükselen değerleri arasında yer almaktadır. Hem oturum hem de yatırım amaçlı değerlendirilebilecek, sosyal olanaklara ve ulaşım ağlarına entegre bir yaşam alanıdır.`;
      }
    }

    // Temizlik
    resultText = resultText.trim();

    return NextResponse.json({
      success: true,
      data: resultText
    });

  } catch (error: any) {
    console.error("Location Analysis AI Error:", error);
    return NextResponse.json(
      { error: `Analiz oluşturulurken bir hata oluştu: ${error.message || error}` },
      { status: 500 }
    );
  }
}
