import {
  SunumIcerik,
  MulkTuru,
  Bolge,
  SunumAmaci,
  TemaTuru,
  SunumUzunlugu,
  SunumStili,
  DetayliDegerlemeVerisi,
  DetayliDegerlemeSnapshot,
  DetayliDegerlemeComparable,
} from "@/types";
import { formatPriceRange } from "@/lib/utils/price";
import { formatDeneyim, formatOduller, formatReferans } from "@/lib/utils/text-formatter";
import { 
  getNedenKurumsalKartlari,
  generateMarketAnalysisTemplates,
  generateTargetAudienceTemplates
} from "@/lib/templates/default-sections";

// 5 Farklı Funnel Template
export const FANNEL_TEMPLATES = {
  template_1: "detayli_analiz",     // Kapsamlı, veri odaklı sunum
  template_2: "hizli_satis",        // Hızlı karar odaklı
  template_3: "premium_sunum",      // Lüks hissi
  template_4: "guven_odakli",       // Güven vurgusu
  template_5: "minimalist"          // Sade ve öz
} as const;

export type TemplateId = typeof FANNEL_TEMPLATES[keyof typeof FANNEL_TEMPLATES];

interface FunnelTemplateGenerateParams {
  mulk: any;
  danisman: any;
  tema: TemaTuru;
  uzunluk: SunumUzunlugu;
  amac: SunumAmaci;
  sunumStili?: SunumStili;
  locationAnalysis?: string;
  detayliDegerleme?: DetayliDegerlemeVerisi;
  detayliDegerlemeAktif?: boolean;
  kfeData?: any;
  targetAudience?: Array<{baslik: string; aciklama: string}>;
  adChannels?: string[];
}

interface FunnelTemplate {
  id: TemplateId;
  name: string;
  description: string;
  generateBolgeler: (params: FunnelTemplateGenerateParams) => Bolge[];
}

// Mülk türüne göre dinamik metinler
const getMulkLabel = (tur: MulkTuru): string => {
  const labels: Record<MulkTuru, string> = {
    arsa: "Arsa",
    daire: "Daire",
    villa: "Villa",
    ticari: "Ticari Gayrimenkul",
    kompleks: "Kompleks",
    ofis: "Ofis"
  };
  return labels[tur] ?? "Gayrimenkul";
};

const getMulkLabelPossessive = (tur: MulkTuru): string => {
  const labels: Record<MulkTuru, string> = {
    arsa: "Arsanızı",
    daire: "Dairenizi",
    villa: "Villanızı",
    ticari: "Ticari Mülkünüzü",
    kompleks: "Kompleksinizi",
    ofis: "Ofisinizi"
  };
  return labels[tur] ?? "Gayrimenkulünüzü";
};

const getMulkOwner = (tur: MulkTuru): string => {
  const labels: Record<MulkTuru, string> = {
    arsa: "arsa sahibi",
    daire: "daire sahibi",
    villa: "villa sahibi",
    ticari: "ticari mülk sahibi",
    kompleks: "kompleks sahibi",
    ofis: "ofis sahibi"
  };
  return labels[tur] ?? "mülk sahibi";
}

const getDanismanAdi = (danisman: any): string =>
  danisman?.adSoyad || "danışmanınız";

const SUNUM_STILI_BASLIKLARI: Record<SunumStili, string> = {
  detayli_analiz: "Detaylı Analiz Planı",
  hizli_satis: "Hızlı Satış Planı",
  premium_sunum: "Premium Sunum Planı",
  guven_odakli: "Güven Odaklı Plan",
  minimalist: "Minimalist Plan"
};

const normalizeTextList = (value?: string, fallback: string[] = []): string[] => {
  if (!value) {
    return fallback;
  }

  return value
    .replace(/•|✅|-\s*/g, "")
    .split(/[\n,]+/)
    .map(item => item.trim())
    .filter(Boolean);
};

const formatList = (items: string[], prefix: string): string =>
  items.map(item => `${prefix} ${item}`).join("\n");

const joinLines = (items: Array<string | undefined | null>): string =>
  items
    .map(item => (item ?? "").trim())
    .filter(item => item.length > 0)
    .join("\n");

const joinWithSeparator = (
  items: Array<string | undefined | null>,
  separator: string
): string =>
  items
    .map(item => (item ?? "").trim())
    .filter(item => item.length > 0)
    .join(separator);

// Genel gayrimenkul satış soruları (platform soruları değil)
const DEFAULT_FAQ_ENTRIES = [
  {
    question: "Hizmet bedeli ne zaman ödeniyor?",
    answer:
      "Satış gerçekleşmeden hiçbir hizmet bedeli alınmaz. Komisyon yalnızca başarılı satış tamamlandığında tahsil edilir. Sıfır risk garantisi.",
  },
  {
    question: "Mülkü kaç günde satarsınız?",
    answer:
      "Bölge dinamiklerine ve fiyatlandırmaya göre değişmekle birlikte ortalama 30-60 gün içinde satış hedefliyoruz. Hedef fiyat aralığı doğru belirlendiğinde bu süre önemli ölçüde kısalıyor.",
  },
  {
    question: "Satış fiyatını nasıl belirliyorsunuz?",
    answer:
      "Bölgedeki son 6 aydaki emsal satışlar, aktif rakip ilanlar ve piyasa talep analizi birlikte değerlendiriliyor. Hem maksimum gelir hem de hızlı satış için optimal fiyat aralığı belirliyoruz.",
  },
  {
    question: "Profesyonel fotoğraf ve pazarlama dahil mi?",
    answer:
      "Evet. Profesyonel fotoğraf çekimi, sunum hazırlığı ve dijital pazarlama hizmetleri sürecin bir parçasıdır. Ekstra maliyet yoktur.",
  },
];

// Stil bazlı FAQ setleri
const HIZLI_SATIS_FAQ_ENTRIES = [
  {
    question: "Liste fiyatında pazarlık payı var mı?",
    answer:
      "Fiyat, piyasa verileriyle zaten optimize edilmiş durumda. Gereksiz indirim yerine doğru alıcıyla hızlı ve güçlü bir kapanış hedefliyoruz.",
  },
  {
    question: "Bu fırsatı neden şimdi değerlendirmeliyim?",
    answer:
      "Benzer mülkler bölgede hızla satılıyor. Fiyat bandı ve talep bu dönemde en uygun seviyede. Beklemek, alım gücünüzün erimesi anlamına gelebilir.",
  },
  {
    question: "Kapora ve teklif süreci nasıl işliyor?",
    answer:
      "Teklif vermenizin ardından 48 saat içinde tapu işlemlerine başlayabiliriz. Süreç tamamen şeffaf ve hızlı; avukat ve noter desteği tarafımızdan sağlanır.",
  },
  {
    question: "Hizmet bedeli ne zaman ödeniyor?",
    answer:
      "Yalnızca satış kapandığında. Satış gerçekleşmezse hiçbir ücret talep edilmez.",
  },
];

const PREMIUM_FAQ_ENTRIES = [
  {
    question: "Özel gösterim nasıl organize ediliyor?",
    answer:
      "Mülk, yalnızca önceden belirlenen nitelikli alıcılara özel davet ile gösteriliyor. Kalabalık açık ev yerine seçici ve saygın bir süreç.",
  },
  {
    question: "Bu segment için referanslarınız var mı?",
    answer:
      "Üst segment portföylerde kanıtlanmış bir satış geçmişimiz bulunuyor. Detayları görüşmemizde paylaşabilirim.",
  },
  {
    question: "Değerleme nasıl yapılıyor?",
    answer:
      "Lüks segment kıyaslamaları, bölgenin en seçkin satışları ve uluslararası alıcı profili dikkate alınarak kapsamlı bir değerleme raporu hazırlanıyor.",
  },
  {
    question: "Gizlilik nasıl sağlanıyor?",
    answer:
      "Mülk bilgileri ve portföy sahipliği yalnızca onaylı alıcılarla paylaşılır. Her aşamada tam gizlilik garantisi sunuyoruz.",
  },
];

const GUVEN_ODAKLI_FAQ_ENTRIES = [
  {
    question: "Sizi diğer danışmanlardan ayıran nedir?",
    answer:
      "Aktif müşteri referansları, şeffaf süreç yönetimi ve satış garantisi. Söz vermek kolay; kanıtlamak için somut verilerimiz mevcut.",
  },
  {
    question: "Satış gerçekleşmezse ne olur?",
    answer:
      "Anlaşma süresince herhangi bir ücret talep etmiyoruz. Satış gerçekleşmezse komisyon sıfır. Çıkarlarımız tamamen örtüşüyor.",
  },
  {
    question: "Kaç müşteriyle aynı anda çalışıyorsunuz?",
    answer:
      "Kaliteyi korumak için sınırlı sayıda portföyle çalışıyorum. Her müşteriye yeterli zaman ve enerji ayırmak önceliğim.",
  },
  {
    question: "Süreç boyunca iletişim nasıl olacak?",
    answer:
      "Haftalık ilerleme raporu ve anlık bildirimler. Her görüntülenme, her teklif, her geri bildirim size anında iletilir.",
  },
];

const MINIMALIST_FAQ_ENTRIES = [
  {
    question: "İletişime nasıl geçebilirim?",
    answer:
      "WhatsApp veya telefon ile doğrudan ulaşabilirsiniz. Randevu zorunluluğu yok.",
  },
  {
    question: "Satış süreci kaç aşamadan oluşuyor?",
    answer:
      "3 adım: Değerleme → Pazarlama → Kapanış. Gereksiz karmaşıklık yok.",
  },
  {
    question: "Komisyon oranı nedir?",
    answer:
      "Standart piyasa oranında, satış gerçekleştiğinde. Öncesinde hiçbir ücret yoktur.",
  },
];

const buildFaqSection = (danisman: { adSoyad: string }, sunumStili?: string): Bolge => {
  let entries = DEFAULT_FAQ_ENTRIES;
  let baslik = "Aklınızdaki Sorular";
  let icerik = "Satış sürecine dair en sık sorulan sorular:";

  if (sunumStili === "hizli_satis") {
    entries = HIZLI_SATIS_FAQ_ENTRIES;
    baslik = "Sık Sorulanlar";
    icerik = "Hızlı karar sürecinde sık karşılaşılan sorular:";
  } else if (sunumStili === "premium_sunum") {
    entries = PREMIUM_FAQ_ENTRIES;
    baslik = "Sık Sorulan Prestij Soruları";
    icerik = "Seçkin alıcıların ve portföy sahiplerinin önceden bilmek istediği detaylar:";
  } else if (sunumStili === "guven_odakli") {
    entries = GUVEN_ODAKLI_FAQ_ENTRIES;
    baslik = "Güvencenizi Pekiştiren Sorular";
    icerik = "Danışmanınızı tanımak ve süreci anlamak için kritik sorular:";
  } else if (sunumStili === "minimalist") {
    entries = MINIMALIST_FAQ_ENTRIES;
    baslik = "Sık Sorulanlar";
    icerik = "Hızlı yanıtlar:";
  }

  return {
    tip: "faq",
    baslik,
    icerik,
    altBolge: entries.map((item) => ({
      baslik: item.question,
      icerik: item.answer.replace("{DANISMAN}", danisman.adSoyad),
      tip: "text" as const,
    })),
  };
};

const buildMarketAnalysisSection = ({
  mulk,
  locationAnalysis,
  detayliDegerleme,
  kfeData,
  marketAnalysisCards,
}: {
  mulk: any;
  locationAnalysis?: string;
  detayliDegerleme?: DetayliDegerlemeVerisi;
  kfeData?: any;
  marketAnalysisCards?: Array<{baslik: string; icerik: string}>;
}): Bolge => {
  const konum = mulk?.konum || "Belirtilen bölge";

  // KFE verilerine göre dinamik snapshot'lar oluştur
  const buildDynamicSnapshots = () => {
    if (detayliDegerleme?.marketSnapshots?.length) {
      return detayliDegerleme.marketSnapshots;
    }

    const snapshots: any[] = [];

    // Bölge m² Ortalama Fiyatı - KFE'ye göre hesapla
    if (kfeData?.bolge?.yillikDegisim !== null && kfeData?.bolge?.yillikDegisim !== undefined) {
      // Mülk fiyatından m² fiyatını hesapla
      const priceValue = mulk?.fiyatMax ?? mulk?.fiyatMin ?? mulk?.fiyat;
      const metrekareValue = typeof mulk?.metrekare === 'number' ? mulk.metrekare : null;
      const sqmPrice = priceValue && metrekareValue ? Math.round(priceValue / metrekareValue) : null;
      
      // KFE yıllık değişim oranına göre bölge ortalamasını tahmin et
      const kfeYillikDegisim = kfeData.bolge.yillikDegisim;
      const regionalAverage = sqmPrice 
        ? Math.round(sqmPrice / (1 + kfeYillikDegisim / 100) * 0.9)
        : 65000; // Varsayılan

      snapshots.push({
        title: "Bölge m² Ortalama Fiyatı",
        value: `₺${regionalAverage.toLocaleString('tr-TR')}`,
        trend: kfeYillikDegisim > 0 ? "up" as const : kfeYillikDegisim < 0 ? "down" as const : "stable" as const,
        trendLabel: `Son 12 ayda %${Math.abs(kfeYillikDegisim).toFixed(1)} ${kfeYillikDegisim > 0 ? 'artış' : 'azalış'}`,
      });
    } else {
      // KFE verisi yoksa varsayılan
      snapshots.push({
        title: "Bölge m² Ortalama Fiyatı",
        value: "₺28.500",
        trend: "up" as const,
        trendLabel: "Son 6 ayda %8 artış",
      });
    }

    // Satışa Dönüş Süresi - varsayılan (KFE'den çıkarılamaz)
    snapshots.push({
      title: "Satışa Dönüş Süresi",
      value: "45-60 gün",
      trend: "down" as const,
      trendLabel: "İl bazlı ortalama",
    });

    // Talep Eğilimi - KFE'ye göre
    if (kfeData?.bolge?.yillikDegisim !== null && kfeData?.turkiye?.yillikDegisim !== null) {
      const bolgeYillik = kfeData.bolge.yillikDegisim;
      const turkiyeYillik = kfeData.turkiye.yillikDegisim;
      const fark = bolgeYillik - turkiyeYillik;
      
      snapshots.push({
        title: "Talep Eğilimi",
        value: fark > 2 ? "Güçlü Yükseliş" : fark > 0 ? "Yükselişte" : fark > -2 ? "İstikrarlı" : "Düşüşte",
        trend: fark > 0 ? "up" as const : fark < -2 ? "down" as const : "stable" as const,
        trendLabel: `Bölge Türkiye ortalamasından %${Math.abs(fark).toFixed(1)} ${fark > 0 ? 'yüksek' : 'düşük'}`,
      });
    } else {
      snapshots.push({
        title: "Talep Eğilimi",
        value: "Yükselişte",
        trend: "stable" as const,
        trendLabel: "Son 3 ayda +12% arama hacmi",
      });
    }

    return snapshots;
  };

  const snapshots = buildDynamicSnapshots();

  const comparables =
    detayliDegerleme?.comparables?.length
      ? detayliDegerleme.comparables
      : [];

  const overviewText =
    locationAnalysis?.split("\n").slice(0, 2).join(" ") ||
    `${konum} bölgesi için güncel piyasa analizi ve bölge değerlendirmesi.`;

  // STANDART ŞABLONLAR - AI başarısız olsa bile ASLA boş kalmasın
  const marketAnalysisTemplates = generateMarketAnalysisTemplates(mulk);
  
  // API'den gelen kartları kullan, yoksa şablonları kullan
  const cardsToUse = marketAnalysisCards && marketAnalysisCards.length > 0 
    ? marketAnalysisCards 
    : marketAnalysisTemplates;

  return {
    tip: "market_analysis",
    baslik: "Konum Analizi & Değerleme",
    icerik: overviewText,
    altBolge: [
      // ÖNCE KONUM ANALİZİ KARTLARI (Nadir Fırsat, Konum Primi, Gelişim Potansiyeli)
      ...cardsToUse.map((card) => ({
        baslik: card.baslik,
        icerik: card.icerik,
        tip: "text" as const,
      })),
      // SONRA İSTATİSTİKLER
      ...snapshots.map((snapshot) => ({
        baslik: snapshot.title,
        icerik: `${snapshot.value}${snapshot.trendLabel ? ` | ${snapshot.trendLabel}` : ""}`,
        tip: "stats" as const,
      })),
      ...(comparables.length > 0 ? [{
        baslik: "Emsal Tablosu",
        icerik:
          comparables
            .map((comp) =>
              [
                comp.address,
                comp.status,
                comp.price,
                comp.size,
                comp.pricePerSqm,
              ]
                .filter(Boolean)
                .join(" | ")
            )
            .join("\n") || "Emsal verisi paylaşılmadı.",
        tip: "comparison" as const,
      }] : []),
    ],
  };
};

const extractMainLocation = (konum?: string): string => {
  if (!konum) {
    return "Bölge";
  }
  const firstPart = konum.split(",")[0]?.trim();
  return firstPart?.length ? firstPart : konum.trim();
};

const sentenceCase = (text: string): string => {
  if (!text) return text;
  const trimmed = text.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const ensureUniqueList = (items: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of items) {
    const item = raw.trim();
    const key = item.toLowerCase();
    if (item && !seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
};

const splitSentences = (text?: string): string[] => {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.replace(/\s+/g, " ").trim())
    .filter(Boolean);
};

const replaceLocationPlaceholders = (items: string[], locationName: string): string[] =>
  items.map(item =>
    sentenceCase(
      item.replace(/\{\{LOKASYON\}\}/g, locationName).replace(/\s+/g, " ").trim()
    )
  );

const buildLocationAdvantagesFallback = (
  mulk: any,
  locationAnalysis?: string,
  defaults: string[] = []
): string[] => {
  const locationName = extractMainLocation(mulk?.konum);

  if (locationAnalysis) {
    const sentences = splitSentences(locationAnalysis)
      .map(sentence => sentence.replace(/^[•\-–—→]/, "").trim())
      .map(sentence => sentence.replace(/\.$/, ""))
      .map(sentence => {
        if (!sentence) return sentence;
        const lower = sentence.toLowerCase();
        const locationLower = locationName.toLowerCase();
        if (!lower.includes(locationLower)) {
          return `${locationName} ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
        }
        return sentence;
      })
      .map(sentenceCase);

    const unique = ensureUniqueList(sentences).slice(0, 4);
    if (unique.length >= 2) {
      return unique;
    }
  }

  if (defaults.length) {
    return replaceLocationPlaceholders(defaults, locationName);
  }

  return [
    `${locationName} konumu ana ulaşım ağlarına kolay erişim sağlıyor.`,
    `${locationName} çevresinde devam eden gelişim, değer artışı potansiyelini destekliyor.`,
    `${locationName} bölgesi yatırımcıların ilgisini çeken dinamik bir pazar.`,
  ];
};

const analyzeLocationKeywords = (analysis?: string) => {
  const lower = (analysis || "").toLowerCase();
  return {
    investment: /yatırım|getiri|potansiyel|sanayi|lojistik|endüstri|liman|ticari|proje/.test(lower),
    lifestyle: /yaşam|sahil|sosyal|park|okul|aile|konut|deniz|plaj|yeşil/.test(lower),
    mobility: /ulaşım|otoyol|köprü|merkez|lokasyon|bağlantı|metro|havaalanı|terminal/.test(lower),
    student: /üniversite|kampüs|öğrenci|akademi/.test(lower),
    tourism: /turizm|tatil|otel|rezidans|yazlık|kıyı/.test(lower),
    prestige: /prestij|lüks|seçkin|marka/.test(lower),
  };
};

const buildTargetAudienceFromAnalysis = (
  mulk: any,
  amac: SunumAmaci,
  locationAnalysis?: string
) => {
  // STANDART ŞABLONLAR - AI başarısız olsa bile ASLA boş kalmasın
  const standardTemplates = generateTargetAudienceTemplates(mulk);
  
  const locationName = extractMainLocation(mulk?.konum);
  const ctx = analyzeLocationKeywords(locationAnalysis);
  const type = mulk?.tur || "gayrimenkul";
  const audience: { baslik: string; aciklama: string }[] = [];

  const addAudience = (title: string, aciklama: string) => {
    if (!title || !aciklama) return;
    const normalizedTitle = sentenceCase(title);
    if (audience.some(item => item.baslik === normalizedTitle)) return;
    audience.push({
      baslik: normalizedTitle,
      aciklama: aciklama.trim().replace(/\s+/g, " "),
    });
  };

  switch (type) {
    case "daire":
    case "villa": {
      addAudience(
        "Şehirli Aileler",
        `${locationName} çevresinde ${ctx.lifestyle ? "sosyal olanakları güçlü, eğitim ve sağlık merkezlerine yakın" : "ulaşımı kolay ve güvenli"} konut arayan aileler.`
      );
      addAudience(
        "Yatırımcılar",
        ctx.investment
          ? `${locationName} konut piyasasındaki değer artışı potansiyelini değerlendirmek isteyen yatırımcılar.`
          : `${locationName} bölgesinde düzenli kira geliri ve ikinci ev alternatifi arayan yatırımcılar.`
      );
      addAudience(
        ctx.student ? "Öğrenci & Akademisyenler" : "Profesyoneller",
        ctx.student
          ? `${locationName} kampüslerine ve ulaşım hatlarına yakın, yönetimi kolay bir yaşam isteyen öğrenciler ve akademisyenler.`
          : `${locationName} merkezinde işine ve sosyal yaşama yakın, bakımlı bir daire isteyen profesyoneller.`
      );
      break;
    }
    case "arsa": {
      addAudience(
        "Geliştiriciler",
        `${locationName} çevresinde yeni konut veya karma proje geliştirmek isteyen yatırımcı ve inşaat ortakları.`
      );
      addAudience(
        "Yatırımcılar",
        ctx.investment
          ? `${locationName} bölgesinin değer artışı ve talep ivmesinden faydalanmak isteyen uzun vadeli yatırımcılar.`
          : `${locationName} civarında arazi portföyünü çeşitlendirmek isteyen bilinçli yatırımcılar.`
      );
      addAudience(
        ctx.tourism ? "Turizm & Tatil Konsepti Arayanlar" : "Alternatif Kullanım Planlayanlar",
        ctx.tourism
          ? `${locationName} kıyı hattında butik otel veya yazlık konsepti planlayan turizm odaklı yatırımcılar.`
          : `${locationName} lokasyonunu depo, ticari tesis veya üretim alanı için değerlendirebilecek işletmeler.`
      );
      break;
    }
    case "ticari":
    case "ofis":
    case "isyeri": {
      addAudience(
        "Kurumsal Kiracılar",
        `${locationName} lokasyonunda çalışanlarına erişimi kolay, görünürlüğü yüksek bir işletme alanı arayan kurumsal markalar.`
      );
      addAudience(
        "Yatırımcılar",
        ctx.investment
          ? `${locationName} iş dünyasındaki hareketlilikten düzenli kira geliri elde etmek isteyen yatırımcılar.`
          : `${locationName} ticari aksında portföyünü genişletmek isteyen yerel yatırımcılar.`
      );
      addAudience(
        "Bölgesel İşletmeler",
        `${locationName} çevresindeki lojistik ve ulaşım avantajlarını kullanmak isteyen bölgesel işletmeler ve distribütörler.`
      );
      break;
    }
    default: {
      addAudience(
        "Yatırımcılar",
        `${locationName} bölgesindeki sürdürülebilir değer artışı potansiyelini değerlendirmek isteyen yatırımcılar.`
      );
      addAudience(
        "Aileler",
        `${locationName} çevresinde güvenli, ulaşımı kolay ve yaşam kalitesi yüksek bir alan arayan aileler.`
      );
      addAudience(
        "Profesyoneller",
        `${locationName} konumunda iş ve sosyal yaşamı dengelemek isteyen profesyoneller.`
      );
    }
  }

  if (!ctx.investment) {
    if (!audience.some(item => /yatırım/i.test(item.baslik) || /yatırım/i.test(item.aciklama))) {
      addAudience(
        "Değer Odaklı Yatırımcılar",
        `${locationName} bölgesinde uzun vadeli büyüme arayan bilinçli yatırımcılar.`
      );
    }
  }

  if (audience.length < 3) {
    const genericAdditions = [
      {
        baslik: "Bölge Sakinleri",
        aciklama: `${locationName} çevresindeki mevcut nüfus içinde yükselen talebe uyum sağlamak isteyen yerel alıcılar.`,
      },
      {
        baslik: "İkinci Konut Alıcıları",
        aciklama: `${locationName} lokasyonunu hafta sonu ve yaz aylarında değerlendirmek isteyen ikinci ev alıcıları.`,
      },
      {
        baslik: "Stratejik Portföy Sahipleri",
        aciklama: `${locationName} konumunu portföy çeşitlendirmesi için değerlendirmek isteyen bilinçli alıcılar.`,
      },
    ];
    genericAdditions.forEach(item => addAudience(item.baslik, item.aciklama));
  }

  // Eğer hiç audience oluşturulamadıysa, standart şablonları kullan
  if (audience.length === 0) {
    return standardTemplates;
  }
  
  return audience.slice(0, 4);
};

// Mevsimsel tarih kontrolü
const getMevsim = (): string => {
  const ay = new Date().getMonth() + 1; // 1-12
  if (ay >= 3 && ay <= 5) return "bahar";
  if (ay >= 6 && ay <= 8) return "yaz";
  if (ay >= 9 && ay <= 11) return "sonbahar";
  return "kış";
}

const getMevsimText = (): string => {
  const mevsim = getMevsim();
  const ay = new Date().getMonth() + 1;
  if (mevsim === "bahar") {
    if (ay === 3) return "bahar sezonuna yakın";
    if (ay === 4 || ay === 5) return "bahar sezonu";
    return "bahar sezonu";
  }
  if (mevsim === "yaz") {
    if (ay === 6) return "yaz sezonuna yakın";
    if (ay === 7 || ay === 8) return "yaz sezonu";
    return "yaz sezonu";
  }
  if (mevsim === "sonbahar") {
    if (ay === 9) return "sonbahar sezonuna yakın";
    if (ay === 10 || ay === 11) return "sonbahar sezonu";
    return "sonbahar sezonu";
  }
  if (ay === 12 || ay === 1) return "kış sezonu";
  return "kış sezonuna yakın";
}

// Ofis adına göre dinamik içerik
const getOfisIcerik = (
  ofisAdi?: string
): { baslik: string; icerik: string; showInAds?: boolean } => {
  if (!ofisAdi) {
    return {
      baslik: "KURUMSAL AĞ AKTİVASYONU",
      icerik:
        "• Geniş emlak ağına duyuru\n• Kurumsal yatırımcı erişimi\n• Diğer danışmanlarla iş birliği\n• Emlak fuarlarında sunum",
      showInAds: false
    };
  }
  
  const ofisLower = ofisAdi.toLowerCase();
  const buyukFirmalar = ['remax', 'coldwell', 'century 21', 'keller williams', 'berkshire hathaway'];
  const isBuyukFirma = buyukFirmalar.some(firma => ofisLower.includes(firma.toLowerCase()));
  
  if (isBuyukFirma) {
    return {
      baslik: `${ofisAdi.toUpperCase()} AĞI AKTİVASYONU`,
      icerik: `• ${ofisAdi} network'e duyuru\n• Kurumsal yatırımcı erişimi\n• Diğer danışmanlarla iş birliği\n• Emlak fuarlarında sunum`,
      showInAds: true
    };
  }
  
  return {
    baslik: `${ofisAdi.toUpperCase()} GÜVENCESİ`,
    icerik: `• ${ofisAdi} güvencesi ile profesyonel hizmet\n• Kurumsal yatırımcı erişimi\n• Diğer danışmanlarla iş birliği\n• Emlak fuarlarında sunum`,
    showInAds: false
  };
}

interface TemaContext {
  mulk: any;
  danisman: any;
}

interface TemaVaryasyon {
  heroSellerTagline: string;
  heroBuyerTagline: string;
  heroSellerBody: (ctx: TemaContext) => string;
  heroBuyerBody: (ctx: TemaContext) => string;
  solutionIntroSeller: string;
  solutionIntroBuyer: string;
  processTaglineSeller: string;
  processTaglineBuyer: string;
  guaranteeTitleSeller: string;
  guaranteeTitleBuyer: string;
  guaranteeIntroSeller: string;
  guaranteeIntroBuyer: string;
  ctaTitleSeller: string;
  ctaTitleBuyer: string;
  ctaBodySeller: (ctx: TemaContext) => string;
  ctaBodyBuyer: (ctx: TemaContext) => string;
  marketingTone: string;
  buyerFomoHook: string;
  sellerTrustHook: string;
}

const temaVaryasyonMap: Record<TemaTuru, TemaVaryasyon> = {
  modern: {
    heroSellerTagline: "Dijital Satış Planı",
    heroBuyerTagline: "Modern Yaşam Deneyimi",
    heroSellerBody: ({ mulk }) =>
      `Yeni nesil dijital pazarlama stratejileriyle ${mulk.konum}'daki ${getMulkLabel(mulk.tur).toLowerCase()}nızı doğru hedef kitleye ulaştırıyorum. Süreç boyunca tüm verileri gerçek zamanlı paylaşıyorum.`,
    heroBuyerBody: ({ mulk }) =>
      `${mulk.konum}'da modern yaşamın tüm detaylarını dijital deneyimlerle keşfedin. Sanal turdan canlı randevuya kadar her şey parmaklarınızın ucunda.`,
    solutionIntroSeller:
      "Teknoloji destekli sistemim satış sürecini hızlandırıp ölçülebilir hale getiriyor.",
    solutionIntroBuyer:
      "Bu modern yaklaşım sayesinde satın alma yolculuğunuz şeffaf ve hızlı ilerler:",
    processTaglineSeller: "Dijital Odaklı Satış Sistemi",
    processTaglineBuyer: "Teknoloji Destekli Satın Alma Yolculuğu",
    guaranteeTitleSeller: "Teknoloji Destekli Garantiler",
    guaranteeTitleBuyer: "Teknoloji Destekli Güvenceler",
    guaranteeIntroSeller:
      "Gerçek zamanlı raporlama ve otomatik takip sistemi sayesinde hiçbir adımı kaçırmazsınız.",
    guaranteeIntroBuyer:
      "Satın alma kararınızı destekleyen dijital şeffaflık ve hız sunuyorum:",
    ctaTitleSeller: "Dijital Strateji Oturumu Planlayalım",
    ctaTitleBuyer: "Online & Yerinde Tur Planlayalım",
    ctaBodySeller: ({ danisman }) =>
      `${getDanismanAdi(danisman)} ile dijital kampanya planınızı 20 dakikada netleştirelim.`,
    ctaBodyBuyer: ({ danisman }) =>
      `${getDanismanAdi(danisman)} size sanal tur + yerinde gezme seçeneklerini aynı anda organize etsin.`,
    marketingTone: "dijital hikaye anlatımı ve veri odaklı optimizasyon",
    buyerFomoHook: "Dijital kampanyada ilgi hızla artıyor",
    sellerTrustHook: "Gerçek zamanlı raporlama ve otomasyon"
  },
  kurumsal: {
    heroSellerTagline: "Veri Odaklı Satış Planı",
    heroBuyerTagline: "Kurumsal Yatırım Dosyası",
    heroSellerBody: ({ mulk }) =>
      `Veriye dayalı analizler ve şeffaf raporlama ile ${mulk.konum}'da ${getMulkLabel(mulk.tur).toLowerCase()}nızı maksimum değere taşıyoruz.`,
    heroBuyerBody: ({ mulk }) =>
      `${mulk.konum}'daki bu ${getMulkLabel(mulk.tur).toLowerCase()} için yatırım kararınızı güçlendirecek tüm verileri derledim.`,
    solutionIntroSeller:
      "Planımız ölçülebilir sonuçlar üretmek üzere kurgulandı.",
    solutionIntroBuyer:
      "Bu kurumsal dosyanın size sağlayacağı kazanımlar:",
    processTaglineSeller: "Kurumsal Satış Süreci",
    processTaglineBuyer: "Kurumsal Satın Alma Yolculuğu",
    guaranteeTitleSeller: "Kurumsal Güvence Paketi",
    guaranteeTitleBuyer: "Kurumsal Satın Alma Garantileri",
    guaranteeIntroSeller: "Profesyonel hizmet standartlarımız:",
    guaranteeIntroBuyer: "Taahhüt ettiğimiz kurumsal güvenceler:",
    ctaTitleSeller: "Kurumsal Satış Toplantısı Planlayalım",
    ctaTitleBuyer: "Yatırım Görüşmesi Ayarlayalım",
    ctaBodySeller: ({ danisman }) =>
      `30 dakikalık görüşmede tüm raporları ${getDanismanAdi(danisman)} paylaşsın.`,
    ctaBodyBuyer: ({ danisman }) =>
      `${getDanismanAdi(danisman)} ile finansal modeli birlikte inceleyelim, kararınızı hızlandıralım.`,
    marketingTone: "veriye dayalı anlatım ve şeffaf raporlama",
    buyerFomoHook: "Kurumsal alıcılar listemizde ilgi yükseliyor",
    sellerTrustHook: "Şeffaf raporlama ve ölçülebilir sonuçlar"
  },
  luks: {
    heroSellerTagline: "Prestijli Satış Ritüeli",
    heroBuyerTagline: "Prestijli Yaşam Dosyası",
    heroSellerBody: ({ mulk }) =>
      `Seçkin alıcı portföyüm ve davet usulü sunumlarla ${mulk.konum}'daki ${getMulkLabel(mulk.tur).toLowerCase()}nıza hak ettiği prestiji veriyorum.`,
    heroBuyerBody: ({ mulk }) =>
      `${mulk.konum}'daki bu ${getMulkLabel(mulk.tur).toLowerCase()} size ayrıcalıklı bir yaşam vaat ediyor. Davet usulü tanıtımla sizin için hazırladım.`,
    solutionIntroSeller:
      "Prestijli yaklaşımımız değeri yüksek teklifleri masaya getiriyor.",
    solutionIntroBuyer:
      "Bu seçkin yaşam paketinin sunduğu ayrıcalıklar:",
    processTaglineSeller: "Prestij Odaklı Satış Süreci",
    processTaglineBuyer: "Prestijli Satın Alma Yolculuğu",
    guaranteeTitleSeller: "Prestij Garantileri",
    guaranteeTitleBuyer: "Prestijli Güvence Sözleri",
    guaranteeIntroSeller:
      "Her temas noktasında itibarınızı koruyan garantiler:",
    guaranteeIntroBuyer:
      "Satın alma sürecini zarafetle yöneten güvenceler:",
    ctaTitleSeller: "Prestij Toplantısı Planlayalım",
    ctaTitleBuyer: "Özel Sunum & Randevu Oluşturalım",
    ctaBodySeller: ({ danisman }) =>
      `${getDanismanAdi(danisman)} ile seçkin alıcı stratejimizi masaya yatıralım.`,
    ctaBodyBuyer: ({ danisman }) =>
      `${getDanismanAdi(danisman)} size özel bir randevu planlasın, mülkü ayrıcalıklı şekilde tanıyalım.`,
    marketingTone: "prestij vurgulu hikaye ve davet usulü sunumlar",
    buyerFomoHook: "Bu seviyedeki fırsatlar uzun süre açık kalmıyor",
    sellerTrustHook: "Prestijli alıcı ağı ve davet usulü süreç"
  }
};

const getTemaVaryasyon = (tema: TemaTuru): TemaVaryasyon =>
  temaVaryasyonMap[tema] || temaVaryasyonMap.kurumsal;

interface TemaAmacParams {
  tema: TemaTuru;
  amac: SunumAmaci;
  temaDil: TemaVaryasyon;
  mulk: any;
  danisman: any;
  konumAvantajlariList: string[];
  kullanimPotansiyeliList: string[];
  ofisIcerik: ReturnType<typeof getOfisIcerik>;
  targetAudienceList: { baslik: string; aciklama: string }[];
}

const applyTemaVeAmacVaryasyon = (
  bolgeler: Bolge[],
  params: TemaAmacParams
): Bolge[] => {
  const {
    tema,
    amac,
    temaDil,
    mulk,
    danisman,
    konumAvantajlariList,
    kullanimPotansiyeliList,
    ofisIcerik
  } = params;

  const isSeller = amac === "portfoy_almak";
  const konumAvantaj = konumAvantajlariList[0] || `${mulk.konum}'da güçlü lokasyon`;
  const kullanimAvantaj =
    kullanimPotansiyeliList[0] || `${getMulkLabel(mulk.tur)} hemen değerlendirmeye hazır`;

  const buyerProblemAltBolge = [
    {
      baslik: "1. Konum & Yaşam Tarzı",
      icerik: `${mulk.konum} bölgesi ${temaDil.marketingTone} ile anlatılacak bir yaşam sunuyor.\n\nÖne çıkan avantaj: ${konumAvantaj}.`,
      tip: "text" as const
    },
    {
      baslik: "2. Değer Artışı",
      icerik: `Bölgedeki gelişim trendi ve sınırlı arz, yatırımınızı hızla değerli kılıyor.\n\n${temaDil.buyerFomoHook}.`,
      tip: "text" as const
    },
    {
      baslik: "3. Hazır Altyapı",
      icerik: `${kullanimAvantaj}.\n\nYani taşınma ve kullanım süreci hızlıca başlayabilir.`,
      tip: "text" as const
    },
    {
      baslik: "4. Profesyonel Süreç Yönetimi",
      icerik: `${getDanismanAdi(danisman)} tüm banka, tapu ve hukuki adımları sizin adınıza koordine eder.`,
      tip: "text" as const
    },
    {
      baslik: "5. Sınırlı Fırsat",
      icerik: `Yoğun tanıtım planı sayesinde ilgi artıyor. ${temaDil.buyerFomoHook}.`,
      tip: "text" as const
    }
  ];

  const buyerSolutionCards = [
    {
      baslik: "Anahtar Teslim Deneyim",
      icerik: "✅ Özel randevu + yerinde tur\n✅ 360° dijital deneyim\n✅ Yaşam senaryosu planlama",
      tip: "stats" as const
    },
    {
      baslik: "Yatırım Güvencesi",
      icerik: "✅ Bölge değer artışı analizi\n✅ Finansal modelleme\n✅ Kira & değer senaryoları",
      tip: "stats" as const
    },
    {
      baslik: "Stressiz Süreç",
      icerik: `✅ Tek temas noktası: ${getDanismanAdi(danisman)}\n✅ Banka & tapu koordinasyonu\n✅ Satın alma sonrası destek`,
      tip: "stats" as const
    }
  ];

  const buyerProcessSteps = [
    {
      baslik: "1. KEŞİF & HİSSETME",
      icerik: "Ne yapıyoruz:\n• Davet usulü özel sunum\n• Detaylı lokasyon turu\n• 360° dijital deneyim\n\n🎯 Kazancınız:\nMülkü hikayesiyle tanır, hızlı karar verebilirsiniz.",
      tip: "text" as const
    },
    {
      baslik: "2. FİNANSAL MODEL",
      icerik: "Ne yapıyoruz:\n• Piyasa karşılaştırmaları\n• Gelir-gider projeksiyonu\n• Yatırım senaryoları\n\n📊 Kazancınız:\nKararınızı veriye dayalı alırsınız.",
      tip: "text" as const
    },
    {
      baslik: "3. HUKUKİ & TEKNİK KONTROL",
      icerik: "Ne yapıyoruz:\n• Tapu ve imar kontrolü\n• Ekspertiz koordinasyonu\n• Sigorta seçenekleri\n\n🛡️ Kazancınız:\nSürpriz riskleri sıfırlanır.",
      tip: "text" as const
    },
    {
      baslik: "4. AĞ ERİŞİMİ",
      icerik: `${ofisIcerik.baslik.replace(/\d+\.\s*/g, "")}\n\n💼 Kazancınız:\nKapanış sonrası ihtiyaçlarınızda kurumsal destek.`,
      tip: "text" as const
    },
    {
      baslik: "5. YAŞAM PLANLAMASI",
      icerik: "Ne yapıyoruz:\n• Dekorasyon & taşınma planı\n• Kiralama veya kullanım stratejisi\n• Komşuluk & çevre bilgilerinin paylaşımı\n\n💡 Kazancınız:\nTaşınmadan önce planınız hazır olur.",
      tip: "text" as const
    },
    {
      baslik: "6. PRESTİJLİ TESLİM",
      icerik: "Ne yapıyoruz:\n• Tapu ve ödeme koordinasyonu\n• Teslim tutanağı ve son kontroller\n• Satın alma sonrası takip\n\n🤝 Kazancınız:\nSorunsuz devir ve sürdürülebilir destek.",
      tip: "text" as const
    }
  ];

  const buyerGuaranteeAltBolge = [
    {
      baslik: "Şeffaf Fiyat Analizi",
      icerik: "• Piyasa karşılaştırma raporu\n• Metrekare başı değer analizi\n• Düzenli güncellenen teklif tablosu",
      tip: "list" as const
    },
    {
      baslik: "Hukuki Koruma",
      icerik: "• Tapu ve imar kontrolü\n• Sözleşme danışmanlığı\n• Ödeme güvenliği planı",
      tip: "list" as const
    },
    {
      baslik: "Satın Alma Sonrası Destek",
      icerik: "• Taşınma koordinasyonu\n• Kiralama & yönetim desteği\n• 30 gün boyunca hızlı çözüm hattı",
      tip: "list" as const
    }
  ];

  const buyerTargetAudience = [
    {
      baslik: "Aile Yaşamı",
      icerik: "Şehirden kopmadan huzurlu yaşam kurmak isteyen aileler için ideal.",
      tip: "text" as const
    },
    {
      baslik: "Yatırım Odaklılar",
      icerik: "Değer artış potansiyeli ve kiralama getirisi hedefleyen yatırımcılar.",
      tip: "text" as const
    },
    {
      baslik: "İkinci Ev / Yazlık",
      icerik: "Hafta sonu kaçamağı veya uzun dönemli tatil planlayanlar için hazır seçenek.",
      tip: "text" as const
    }
  ];

  const buyerFaq = [
    {
      baslik: "Aidat veya aylık gider var mı?",
      icerik: "Aidat/gider detaylarını şeffaf şekilde paylaşıyorum; sürpriz yok.",
      tip: "text" as const
    },
    {
      baslik: "Tapu sürecinde kim yanımda olacak?",
      icerik: `${getDanismanAdi(danisman)} tüm tapu ve noter işlemlerini sizinle birlikte yönetir.`,
      tip: "text" as const
    },
    {
      baslik: "Finansman desteği sağlıyor musunuz?",
      icerik: "Bankalarla ön görüşmeleri yapıp uygun kredi tekliflerini masanıza getiriyorum.",
      tip: "text" as const
    },
    {
      baslik: "Satın alma sonrası destek alabilecek miyim?",
      icerik: "Teslimden sonraki 30 gün boyunca tüm ihtiyaçlarınız için yanınızdayım.",
      tip: "text" as const
    },
    {
      baslik: "Neden sizinle çalışmalıyım?",
      icerik: `${temaDil.marketingTone} yaklaşımı ve tek temas noktası hizmeti ile süreci sizin adınıza kolaylaştırıyorum.`,
      tip: "text" as const
    }
  ];

  return bolgeler.map((bolge) => {
    switch (bolge.tip) {
      case "hero": {
        const updated: Bolge = {
          ...bolge,
          baslik: `${mulk.konum} - ${isSeller ? temaDil.heroSellerTagline : temaDil.heroBuyerTagline}`,
          icerik: isSeller
            ? temaDil.heroSellerBody({ mulk, danisman })
            : temaDil.heroBuyerBody({ mulk, danisman })
        };

        if (bolge.altBolge && bolge.altBolge.length > 0) {
          updated.altBolge = [
            {
              ...bolge.altBolge[0],
              baslik: isSeller
                ? temaDil.sellerTrustHook
                : temaDil.buyerFomoHook,
              icerik: isSeller
                ? `Sadece sizin için hazırlanmış bu plan ${temaDil.marketingTone} ile destekleniyor.`
                : `${temaDil.marketingTone} ile hazırlanmış özel sunumu kaçırmayın. ${temaDil.buyerFomoHook}.`
            }
          ];
        }

        return updated;
      }
      case "problemler": {
        if (isSeller) {
          return {
            ...bolge,
            baslik: `${getMulkLabelPossessive(mulk.tur)} Satarken Karşılaşabileceğiniz Riskler`,
            icerik: `Bireysel satışta en sık gördüğüm riskleri sizin için yönetiyorum. ${temaDil.sellerTrustHook}.`
          };
        }

        return {
          ...bolge,
          baslik: `${getMulkLabel(mulk.tur)} İçin Kaçırılmayacak 5 Sebep`,
          icerik: `Bu ${getMulkLabel(mulk.tur).toLowerCase()} neden radarınızda olmalı? ${temaDil.buyerFomoHook}.`,
          altBolge: buyerProblemAltBolge
        };
      }
      case "cozum": {
        const updated: Bolge = {
          ...bolge,
          icerik: isSeller ? temaDil.solutionIntroSeller : temaDil.solutionIntroBuyer
        };

        if (!isSeller) {
          updated.altBolge = buyerSolutionCards;
        } else if (bolge.altBolge) {
          updated.altBolge = bolge.altBolge.map((alt, idx) => {
            if (idx === 0) {
              return {
                ...alt,
                icerik: `✅\n\nOrtalama satış sürem: 45 gün\n${temaDil.sellerTrustHook}\n\nVs. bireysel: 8-12 ay`
              };
            }
            if (idx === 1) {
              return {
                ...alt,
                icerik: `✅\n\nProfesyonel pazarlama = daha yüksek teklif\n${temaDil.marketingTone}\n\nVs. bireysel satış: Değerinde satış fırsatı`
              };
            }
            if (idx === 2) {
              return {
                ...alt,
                icerik: `✅\n\nBen her şeyi hallederken, siz süreci keyifle izleyin.\n${temaDil.sellerTrustHook}\n\nSatış olmazsa tek kuruş ödemezsiniz`
              };
            }
            return alt;
          });
        }

        return updated;
      }
      case "process": {
        const updated: Bolge = {
          ...bolge,
          baslik: `6 Adımlı ${isSeller ? temaDil.processTaglineSeller : temaDil.processTaglineBuyer}`,
          icerik: isSeller
            ? `${getMulkLabelPossessive(mulk.tur)} en yüksek fiyata, en doğru strateji ile satıyoruz.`
            : `${getMulkLabel(mulk.tur)} satın alırken her adımı şeffaf biçimde planlıyoruz.`
        };

        if (isSeller && bolge.altBolge) {
          updated.altBolge = bolge.altBolge.map((alt) => {
            if (alt.baslik === ofisIcerik.baslik) {
              return {
                ...alt,
                baslik: ofisIcerik.baslik,
                icerik: `${ofisIcerik.icerik}\n\n💼 Sizin kazancınız:\n• ${temaDil.sellerTrustHook}\n• Yerel + ulusal + kurumsal alıcılar aynı anda\n• ${danisman.ofisAdi ? `${danisman.ofisAdi} markasıyla prestijli sunum` : "Profesyonel uzman ağı ile satışın hızlanması"}`
              };
            }
            return alt;
          });
        }

        if (!isSeller) {
          updated.altBolge = buyerProcessSteps;
        }

        return updated;
      }
      case "guarantee": {
        const updated: Bolge = {
          ...bolge,
          baslik: isSeller ? temaDil.guaranteeTitleSeller : temaDil.guaranteeTitleBuyer,
          icerik: isSeller ? temaDil.guaranteeIntroSeller : temaDil.guaranteeIntroBuyer
        };

        if (!isSeller) {
          updated.altBolge = buyerGuaranteeAltBolge;
        } else if (bolge.altBolge) {
          updated.altBolge = bolge.altBolge.map((alt) => {
            if (alt.baslik === "Sıfır Ön Ödeme") {
              return {
                ...alt,
                icerik: `${getMulkLabelPossessive(mulk.tur)} listelemek için tek kuruş ödemezsiniz.\n\n• Değerleme: Ücretsiz\n• Drone Çekimi: Ücretsiz\n• Pazarlama: Ücretsiz\n\n${temaDil.sellerTrustHook}. Hizmet bedeli sadece satış gerçekleşirse!`
              };
            }
            if (alt.baslik.includes("Garantisi") || alt.baslik === "Kurumsal Garanti") {
              return {
                ...alt,
                baslik: danisman.ofisAdi
                  ? `${danisman.ofisAdi.toUpperCase()} Garantisi`
                  : temaDil.guaranteeTitleSeller,
                icerik: danisman.ofisAdi
                  ? `${danisman.ofisAdi} güvencesi arkanızda.\n\n• Sigortalı İşlemler\n• Hukuki Destek\n• Kurumsal Sorumluluk`
                  : "Kurumsal güvence arkanızda.\n\n• Sigortalı İşlemler\n• Hukuki Destek\n• Kurumsal Sorumluluk"
              };
            }
            return alt;
          });
        }

        return updated;
      }
      case "marketing_strategy": {
        return {
          ...bolge,
          icerik: isSeller
            ? `Her kanalda tutarlı mesaj, ${temaDil.marketingTone}.`
            : `Bu ${getMulkLabel(mulk.tur).toLowerCase()} için ${temaDil.marketingTone} ile hazırlanmış deneyim planı.`,
        };
      }
      case "ad_channels": {
        return {
          ...bolge,
          baslik: isSeller ? bolge.baslik : "📣 Görünürlük & Talep",
          icerik: isSeller
            ? bolge.icerik
            : `Bu ${getMulkLabel(mulk.tur).toLowerCase()} şu anda aşağıdaki platformlarda öne çıkarılıyor. ${temaDil.buyerFomoHook}.`,
        };
      }
      case "contact_24_7": {
        return {
          ...bolge,
          icerik: isSeller
            ? "Satış sürecinde her an bana ulaşabilirsiniz."
            : "Satın alma kararınız öncesi ve sonrasında tek temas noktanız benim.",
        };
      }
      case "timing_urgency": {
        return {
          ...bolge,
          icerik: isSeller
            ? "Emlak piyasası sürekli değişiyor. Her ay beklemek = değer kaybı riski."
            : "Talep artıyor; beklemek daha yüksek fiyat veya kaçan fırsat demek.",
          altBolge: bolge.altBolge?.map((alt) => ({
            ...alt,
            icerik: isSeller
              ? `💡 ${getMevsimText()} = alıcı talebi en yüksek = en yüksek fiyat`
              : `💡 ${getMevsimText()} döneminde talep zirvede. ${temaDil.buyerFomoHook}.`
          }))
        };
      }
      case "market_opportunity": {
        return {
          ...bolge,
          icerik: isSeller
            ? `${mulk.konum} bölgesi son 6 ayda değer kazandı.\n\n💡 Şimdi satış = piyasanın zirvesinden satış!`
            : `${mulk.konum} bölgesinde değer artışı hız kesmiyor.\n\n💡 Şimdi alarak bu artışı lehinize çevirin!`
        };
      }
      case "target_audience": {
        if (isSeller) {
          return {
            ...bolge,
            baslik: "HEDEF KİTLE PROFİLİ",
            icerik: "Gayrimenkulünüzün hedef kitlesi:"
          };
        }

        return {
          ...bolge,
          baslik: "Sizin İçin En Uygun Senaryolar",
          icerik: "Bu mülk kimler için kusursuz?",
          altBolge: buyerTargetAudience
        };
      }
      case "faq": {
        if (isSeller) {
          return bolge;
        }

        return {
          ...bolge,
          icerik: "Satın almadan önce en çok sorulan sorular:",
          altBolge: buyerFaq
        };
      }
      case "cta": {
        return {
          ...bolge,
          baslik: isSeller
            ? temaDil.ctaTitleSeller
            : temaDil.ctaTitleBuyer,
          icerik: isSeller
            ? temaDil.ctaBodySeller({ mulk, danisman })
            : temaDil.ctaBodyBuyer({ mulk, danisman })
        };
      }
      default:
        return bolge;
    }
  });
};

// TEMPLATE 1: Detaylı Analiz — Kapsamlı, veri odaklı kurumsal sunum
const detayliAnalizTemplate: FunnelTemplate = {
  id: "detayli_analiz",
  name: "Detaylı Analiz Funneli",
  description: "Kapsamlı analiz, 6 adım sistem, konum analizi, hedef kitle profili",
  generateBolgeler: ({
    mulk,
    danisman,
    tema,
    uzunluk,
    amac,
    locationAnalysis,
    detayliDegerleme,
    detayliDegerlemeAktif,
    targetAudience,
    adChannels,
  }) => {
    const temaDil = getTemaVaryasyon(tema as TemaTuru);
    const ofisIcerik = getOfisIcerik(danisman.ofisAdi);
    const konumAvantajlariFallback = buildLocationAdvantagesFallback(
      mulk,
      locationAnalysis,
      [
        "{{LOKASYON}} ana ulaşım akslarına hızlı bağlantı sağlıyor.",
        "{{LOKASYON}} çevresinde yükselen projeler değer artışını destekliyor.",
        "{{LOKASYON}} bölgesi yatırımcıların radarında ve talep ivmesi yüksek.",
        "{{LOKASYON}} sosyal yaşam, eğitim ve sağlık imkanlarına yakın konumlanıyor.",
      ]
    );
    const konumAvantajlariList = normalizeTextList(
      mulk.konumAvantajlari,
      konumAvantajlariFallback
    );
    const kullanimPotansiyeliList = normalizeTextList(
      mulk.kullanimPotansiyeli,
      [
        "Hazır yapı + bahçe (nadir fırsat)",
        "Tatil evi dönüşümü",
        "Kiralama geliri potansiyeli",
        "Yatırım amaçlı değer artışı"
      ]
    );
    
    // Hedef Kitle: API'den gelen varsa onu kullan, yoksa fallback oluştur
    const hedefKitleList = (targetAudience && targetAudience.length > 0)
      ? targetAudience
      : buildTargetAudienceFromAnalysis(mulk, amac, locationAnalysis);

    const tanitimAnaMesaj = `"${mulk.konum}'un kalbinde, ${getMulkLabel(mulk.tur).toLowerCase()} için premium sunum"`;
    const tanitimVurgularList = [
      `${getMulkLabel(mulk.tur)} için nadir fırsat`,
      "Yüksek değer artış potansiyeli",
      "Konumu sayesinde güçlü talep",
      "Hemen kullanıma hazır altyapı"
    ];
    const tanitimGorselPlan = [
      "Drone: Konum ve mesafe vurgusu",
      "Zemin: Mülkün detaylı çekimleri",
      "Video: Hikayeleştirilmiş rota",
      "360°: İç mekan + bahçe turu"
    ];

    // Standart reklam kanalları - her zaman sabit
    const reklamPlatformlari = [
      "Sahibinden Vitrin İlan",
      "Emlakjet Premium Paket",
      "Facebook & Instagram Reklamları",
      "Google Ads (Arama + Display)",
      "YouTube Video Reklamları"
    ];

    // Ofis varsa ekle
    const ofiseOzelPlatform = ofisIcerik.showInAds && danisman.ofisAdi
      ? `${danisman.ofisAdi.toUpperCase()} Ağı`
      : undefined;

    // Eğer API'den kanallar geldiyse ofis platformunu tekrar ekleme
    const reklamPlatformlariFormatted = formatList(
      (adChannels && adChannels.length > 0) 
        ? reklamPlatformlari 
        : (ofiseOzelPlatform ? [...reklamPlatformlari, ofiseOzelPlatform] : reklamPlatformlari),
      "✅"
    );

    const heroBilgiSatirlari = [
      formatPriceRange(mulk),
      mulk.metrekare ? `${mulk.metrekare} m²` : undefined
    ];

    const bolgeler: Bolge[] = [
      {
        tip: "hero",
        baslik: `${mulk.konum} - Özel Analiz Raporu`,
        icerik: joinLines([
          heroBilgiSatirlari.length ? joinLines(heroBilgiSatirlari) : undefined,
          `Bu sunum ${mulk.konum} bölgesinde bulunan gayrimenkulünüz için ${danisman.adSoyad} tarafından özel olarak hazırlanmıştır.`
        ]),
        altBolge: [
          {
            baslik: "Özel Sunum",
            icerik: "Sadece sizin için hazırlanmış gizli sunum • Hazırlandı: Bugün",
            tip: "quote"
          }
        ]
      },
      {
        tip: "problemler",
        baslik: `${getMulkLabelPossessive(mulk.tur)} Satarken Karşılaşacağınız 5 Büyük Sorun`,
        icerik: "Emlak piyasasında bireysel satış yapmaya çalışan mülk sahiplerinin karşılaştığı yaygın zorluklar:",
        altBolge: [
          {
            baslik: "1. Yanlış Fiyatlandırma",
            icerik: `Çoğu ${getMulkOwner(mulk.tur)}, piyasa analizini yanlış yapıyor. Ya çok ucuza satıyor, ya da aylarca satamıyor.\n\nKayıp: Potansiyel gelirden önemli kayıp`,
            tip: "text"
          },
          {
            baslik: "2. Yetersiz Tanıtım",
            icerik: "Telefon fotoğrafları ve basit ilanlar yeterli değil. Gayrimenkulünüz potansiyel alıcıların %95'ine ulaşamıyor.\n\nKayıp: 10-15 potansiyel alıcı",
            tip: "text"
          },
          {
            baslik: "3. Güvenlik Riski",
            icerik: "Birebir görüşmeler, dolandırıcılık riski, ödeme sorunları... Stresli ve riskli bir süreç.\n\nRisk: Zaman + Para + Emniyet",
            tip: "text"
          },
          {
            baslik: "4. Zaman Kaybı",
            icerik: "Ortalama bireysel satış süresi: 8-12 ay. Her ay beklemek = değer kaybı.\n\nKayıp: Her ay emlak değer artışından geri kalma",
            tip: "text"
          },
          {
            baslik: "5. Pazarlık Gücü Kaybı",
            icerik: "Profesyonel olmayan sunum = pazarlık masasında zayıflık = daha düşük fiyat.\n\nKayıp: %10-20 daha az satış fiyatı",
            tip: "text"
          }
        ]
      },
      {
        tip: "cozum",
        baslik: "Neden Kurumsal?",
        icerik: "Bireysel çabalar ile kurumsal sistemin yarattığı farkın somut sonuçları.",
        altBolge: getNedenKurumsalKartlari({
          mulkTur: mulk.tur,
          metrekare: mulk.metrekare,
          odaSayisi: mulk.odaSayisi,
          ofisAdi: danisman.ofisAdi
        }).map((kart) => ({
          baslik: kart.baslik,
          icerik: `${kart.aciklama}\n\nSonuç\n${kart.sonuc}`,
          tip: "text" as const
        }))
      },
      {
        tip: "process",
        baslik: "6 Adımlı Profesyonel Satış Sistemi",
        icerik: `${getMulkLabelPossessive(mulk.tur)} En Yüksek Fiyata, En Hızlı Şekilde Satmanın Formülü`,
        altBolge: [
          {
            baslik: "1. PROFESYONEL DEĞERLEME",
            icerik: "• Detaylı piyasa analizi\n• Benzer satışlar incelemesi\n• Bölge değer artış trendi\n• Optimal fiyat stratejisi\n\n💰 Sizin Kazancınız:\nPazara en doğru fiyatla giriş ve maksimum gelir potansiyeli",
            tip: "text"
          },
          {
            baslik: "2. GÖRSEL ŞÖLEN",
            icerik: "• 4K profesyonel drone çekimi\n• Zemin fotoğraf seansı (gün batımı/gün doğumu)\n• HD tanıtım videosu (45-60 saniye)\n• 360° sanal tur\n• Profesyonel edit ve renklendirme\n\n💡 Sizin Kazancınız:\nSinematik tanıtım = %300 daha fazla ilgi. Profesyonel çekim tamamen ÜCRETSİZ",
            tip: "text"
          },
          {
            baslik: "3. DİJİTAL PAZARLAMA",
            icerik: "• Facebook & Instagram reklamları (hedefli kitle)\n• Google Ads (arama + harita)\n• Emlakjet, Sahibinden, Hepsiemlak Premium ilanlar\n• YouTube video reklamı\n• 500+ alıcı database'ine e-posta\n\n📈 Erişim:\nİlk 2 haftada 15.000+ kişiye doğrudan erişim\n\n💡 Sizin Kazancınız:\n₺8,000-12,000 değerindeki reklam bütçesi tamamen ÜCRETSİZ",
            tip: "text"
          },
          {
            baslik: ofisIcerik.baslik,
            icerik: `${ofisIcerik.icerik}\n\n💼 Sizin kazancınız:\n• Güçlü kurumsal güvence\n• Yerel + ulusal + kurumsal alıcılar aynı anda\n• ${danisman.ofisAdi ? `${danisman.ofisAdi} markasıyla prestijli sunum` : "Profesyonel uzman ağı ile satışın hızlanması"}`,
            tip: "text"
          },
          {
            baslik: "5. NİTELİKLİ ALICI FİLTRESİ",
            icerik: "• İlk telefon filtrelemesi\n• Finansal yeterlilik kontrolü\n• Ciddiyet testi\n• Profesyonel görüşme planlama\n\n💰 Sizin Kazancınız:\nSadece CİDDİ alıcılarla görüşürsünüz. Zaman kaybı = 0",
            tip: "text"
          },
          {
            baslik: "6. PROFESYONEL KAPANIŞ",
            icerik: "• Pazarlık stratejisi\n• Sözleşme yönetimi\n• Noter süreç yönetimi\n• Ödeme garantisi koordinasyonu\n• Tapu devir güvenliği\n\n💼 Sizin Kazancınız:\nEn yüksek teklif + güvenli ödeme. Ortalama 30-60 günde sonuç",
            tip: "text"
          }
        ]
      },
      {
        tip: "guarantee",
        baslik: "Hiçbir Risk Almıyorsunuz – Garantilerim",
        icerik: "Profesyonel hizmet garantileri:",
        altBolge: [
          {
            baslik: "Sıfır Ön Ödeme",
            icerik: `${getMulkLabelPossessive(mulk.tur)} listelemek için tek kuruş ödemezsiniz.\n\n• Değerleme: Ücretsiz\n• Drone Çekimi: Ücretsiz\n• Pazarlama: Ücretsiz\n\nHizmet bedeli sadece satış gerçekleşirse!`,
            tip: "list"
          },
          {
            baslik: danisman.ofisAdi ? `${danisman.ofisAdi.toUpperCase()} Garantisi` : "Kurumsal Garanti",
            icerik: danisman.ofisAdi ? `${danisman.ofisAdi} güvencesi arkanızda.\n\n• Sigortalı İşlemler\n• Hukuki Destek\n• Kurumsal Sorumluluk` : "Kurumsal güvence arkanızda.\n\n• Sigortalı İşlemler\n• Hukuki Destek\n• Kurumsal Sorumluluk",
            tip: "list"
          },
          {
            baslik: "7/24 İletişim",
            icerik: "Satış sürecinde her an bana ulaşabilirsiniz.\n\n• Telefon\n• WhatsApp\n• Email & Yüz yüze",
            tip: "list"
          }
        ]
      },
      {
        tip: "location_analysis",
        baslik: "KONUM ANALİZİ",
        icerik: `${mulk.konum} bölgesi hakkında detaylı analiz:`,
        altBolge: [
          {
            baslik: "Konum Bilgileri",
            icerik: `${mulk.konum}\n• Ana Taşınmaz\n• ${mulk.metrekare ? mulk.metrekare + ' m²' : 'Belirtilmemiş'}`,
            tip: "list"
          },
          {
            baslik: "Konum Avantajları",
            icerik: formatList(
              normalizeTextList(
                mulk.cevreOzellikleri?.join("\n"),
                ["Merkezi konum, ulaşım kolay", "Gelişen bölge", "Değer artış potansiyeli yüksek"]
              ),
              "•"
            ),
            tip: "list"
          }
        ]
      },
      {
        tip: "location_advantages",
        baslik: "🏖️ KONUM AVANTAJLARI",
        icerik: formatList(konumAvantajlariList, "✅"),
        altBolge: []
      },
      ...(detayliDegerlemeAktif && detayliDegerleme ? [{
        tip: "regional_comparison" as const,
        baslik: "DETAYLI DEĞERLEME RAPORU",
        icerik: detayliDegerleme.estimatedValueRange || "Bölge için güncel piyasa verileri ve emsal karşılaştırmaları.",
        altBolge: [
          ...(detayliDegerleme.marketSnapshots?.map(snapshot => ({
            baslik: snapshot.title,
            icerik: `${snapshot.value}${snapshot.trendLabel ? ` | ${snapshot.trendLabel}` : ''}`,
            tip: "stats" as const
          })) || []),
          ...(detayliDegerleme.comparables?.map(comp => ({
            baslik: comp.address,
            icerik: `${comp.status} | ${comp.price}${comp.size ? ` | ${comp.size}` : ''}${comp.pricePerSqm ? ` | ${comp.pricePerSqm}` : ''}`,
            tip: "comparison" as const
          })) || [])
        ]
      }] : []),
      {
        tip: "usage_potential",
        baslik: "🏡 KULLANIM POTANSİYELİ",
        icerik: formatList(kullanimPotansiyeliList, "✅"),
        altBolge: []
      },
      {
        tip: "marketing_strategy",
        baslik: "📢 TANITIM STRATEJİSİ",
        icerik: "Her kanalda tutarlı mesaj, güçlü görsel hikaye.",
        altBolge: [
          {
            baslik: "Ana Mesaj",
            icerik: tanitimAnaMesaj,
            tip: "quote"
          },
          {
            baslik: "Vurgular",
            icerik: formatList(tanitimVurgularList, "⭐"),
            tip: "list"
          },
          {
            baslik: "Görsel İçerik Planı",
            icerik: formatList(tanitimGorselPlan, "🎥"),
            tip: "list"
          }
        ]
      },
      {
        tip: "value_plan",
        baslik: "💰 TAHMİNİ DEĞER & SATIM PLANI",
        icerik: "Satış süreci boyunca piyasa geri bildirimlerini takip ediyoruz.",
        altBolge: [
          {
            baslik: "Fiyat Stratejisi",
            icerik: "Kademeli fiyatlandırma ile piyasa tepkisini ölçme.",
            tip: "text"
          },
          {
            baslik: "Hedef Satış Süresi",
            icerik: "30-60 gün",
            tip: "text"
          },
          {
            baslik: "Tahmini İlgi",
            icerik: "İlk ay 15-25 ciddi soru • 5-10 görüntülü/yerinde görüşme • 3-5 ciddi teklif hedefi.",
            tip: "text"
          }
        ]
      },
      {
        tip: "ad_channels",
        baslik: "📣 REKLAM KANALLARI",
        icerik: "Geniş erişim için kullandığım platformlar:",
        altBolge: [
          {
            baslik: "Platformlar",
            icerik: reklamPlatformlariFormatted,
            tip: "list"
          }
        ]
      },
      {
        tip: "contact_24_7",
        baslik: "📞 7/24 İletişim",
        icerik: "Satış sürecinde her an bana ulaşabilirsiniz.",
        altBolge: [
          {
            baslik: "İletişim Bilgileri",
            icerik: `📞 Telefon: ${danisman.telefon}\n📧 Email: ${danisman.email}\n💬 WhatsApp: ${danisman.telefon}\n👤 Yüz yüze randevu`,
            tip: "list"
          }
        ]
      },
      {
        tip: "timing_urgency",
        baslik: "⏰ Zaman Kaybı = Para Kaybı",
        icerik: "Emlak piyasası sürekli değişiyor. Her ay beklemek = değer kaybı riski.",
        altBolge: [
          {
            baslik: "Mevsimsel Fırsat",
            icerik: `💡 ${getMevsimText()} = alıcı talebi en yüksek = en yüksek fiyat`,
            tip: "quote"
          }
        ]
      },
      {
        tip: "market_opportunity",
        baslik: "📈 Piyasa Fırsatı",
        icerik: `${mulk.konum} bölgesi son 6 ayda değer kazandı.\n\n💡 Şimdi satış = piyasanın zirvesinden satış!`,
        altBolge: []
      },
      {
        tip: "target_audience",
        baslik: "HEDEF KİTLE PROFİLİ",
        icerik: "Gayrimenkulünüzün hedef kitlesi:",
        altBolge: [
          ...hedefKitleList.map(item => ({
            baslik: item.baslik,
            icerik: item.aciklama,
            tip: "text" as const
          }))
        ]
      },
      {
        tip: "faq",
        baslik: "Aklınızdaki Sorular",
        icerik: "Sık sorulan sorular:",
        altBolge: [
          {
            baslik: "Hizmet bedeli oranınız nedir?",
            icerik: "Satış olmazsa 0₺ ücret • Tüm hizmetler ücretsiz • Hizmet bedeli sadece satış olunca.",
            tip: "text"
          },
          {
            baslik: `${getMulkLabel(mulk.tur)}m satılmazsa ne olur?`,
            icerik: "Hiçbir şey olmaz. Satış olmazsa tek kuruş ödemezsiniz. Tüm hizmetler ücretsizdir.",
            tip: "text"
          },
          {
            baslik: "Neden sizinle çalışayım, başka danışman değil?",
            icerik: "Profesyonel hizmet, sıfır risk, garantili satış ve ${danisman.ofisAdi ? danisman.ofisAdi + ' güvencesi' : 'kurumsal güvence'} ile fark yaratıyoruz.",
            tip: "text"
          },
          {
            baslik: "Drone ve video çekimi gerçekten ücretsiz mi?",
            icerik: "Evet, tamamen ücretsiz. Profesyonel drone çekimi (₺3,500-5,000) ve video çekimi (₺2,000-3,000) maliyetlerini biz karşılıyoruz.",
            tip: "text"
          },
          {
            baslik: "Ne kadar sürede satarsınız?",
            icerik: "Ortalama 45 gün içinde satış garantisi. Hedef: 30-60 gün arası satış.",
            tip: "text"
          },
          {
            baslik: danisman.ofisAdi ? `${danisman.ofisAdi} hizmet bedeli alıyor mu?` : "Kurumsal hizmet bedeli alıyor mu?",
            icerik: "Hayır. Satış olmazsa hiçbir ücret alınmaz. Hizmet bedeli sadece satış gerçekleştiğinde alınır.",
            tip: "text"
          }
        ]
      },
      {
        tip: "cta",
        baslik: `${getMulkLabel(mulk.tur)}nızın Potansiyelini Birlikte Ortaya Çıkaralım`,
        icerik: "Detaylı bilgi ve ücretsiz analiz raporu için hemen benimle iletişime geçin.",
        altBolge: [
          {
            baslik: "Garantiler",
            icerik: "24 saat içinde geri dönüş\nHiçbir bağlayıcılık yok\n100% gizlilik garantisi",
            tip: "list"
          }
        ]
      }
    ];
    
    return applyTemaVeAmacVaryasyon(bolgeler, {
      tema: tema as TemaTuru,
      amac,
      temaDil,
      mulk,
      danisman,
      konumAvantajlariList,
      kullanimPotansiyeliList,
      ofisIcerik,
      targetAudienceList: hedefKitleList
    });
  }
};

// TEMPLATE 2: Hızlı Satış
const hizliSatisTemplate: FunnelTemplate = {
  id: "hizli_satis",
  name: "Hızlı Satış Funneli",
  description: "Kısa ve etkili, hızlı karar odaklı",
  generateBolgeler: ({
    mulk,
    danisman,
    tema,
    uzunluk,
    amac,
    locationAnalysis,
    targetAudience,
    adChannels,
  }) => {
    const ofisIcerik = getOfisIcerik(danisman.ofisAdi);
    const konumAvantajlariFallback = buildLocationAdvantagesFallback(
      mulk,
      locationAnalysis,
      [
        "{{LOKASYON}} ana arterlere dakikalar içinde bağlanıyor.",
        "{{LOKASYON}} çevresinde talep gören projeler satış hızını destekliyor.",
        "{{LOKASYON}} bölgesi hızlı değer artışı potansiyeli sunuyor."
      ]
    );
    const konumAvantajlariList = normalizeTextList(
      mulk.konumAvantajlari,
      konumAvantajlariFallback
    );
    const kullanimPotansiyeliList = normalizeTextList(
      mulk.kullanimPotansiyeli,
      [
        "Hemen taşınmaya uygun yapı",
        "Kira geliri potansiyeli",
        "Yatırım için değer artışı fırsatı"
      ]
    );

    const bolgeler: Bolge[] = [
      {
        tip: "hero",
        baslik: `${mulk.konum} - Hızlı Satış Planı`,
        icerik: `${mulk.konum} bölgesindeki ${getMulkLabel(mulk.tur).toLowerCase()} için 30-60 gün hedefli profesyonel satış rotası.`,
        altBolge: [
          {
            baslik: "Hızlı Sonuç İçin Tasarlandı",
            icerik: "AI destekli fiyat analizi • 360° tanıtım • Hazır alıcı ağı",
            tip: "quote"
          }
        ]
      },
      {
        tip: "urgency",
        baslik: "Bu Fırsat Hızla Kapanıyor",
        icerik: `${mulk.konum} bölgesinde benzer ${getMulkLabel(mulk.tur).toLowerCase()}lere yoğun ilgi var. Bekleme süresi = fiyat artışı.`,
        altBolge: [
          {
            baslik: "Piyasa Gerçeği",
            icerik: `Son 30 günde bölgede ${getMulkLabel(mulk.tur).toLowerCase()} fiyatları yükselişte | Talep arzın önünde | Her geçen hafta yeni alıcılar listeye ekleniyor`,
            tip: "stats"
          },
          {
            baslik: "Zaman Faktörü",
            icerik: "Erken hareket edenler en iyi fiyatı alır. Bugün adım atın, yarın çok geç olabilir.",
            tip: "quote"
          }
        ]
      },
      {
        tip: "quick_highlights",
        baslik: "Neden Bu Gayrimenkul?",
        icerik: "Tek bakışta öne çıkan avantajlar.",
        altBolge: [
          {
            baslik: konumAvantajlariList[0] || "Stratejik Konum",
            icerik: konumAvantajlariList.slice(0, 2).join(" • ") || "Merkezi konum, kolay ulaşım",
            tip: "text"
          },
          {
            baslik: "Yatırım Potansiyeli",
            icerik: kullanimPotansiyeliList.slice(0, 2).join(" • ") || "Değer artışı potansiyeli yüksek",
            tip: "text"
          },
          {
            baslik: "Hızlı Karar Avantajı",
            icerik: "İlk gelen en iyi koşulları yakalar. Profesyonel süreç, hızlı sonuç.",
            tip: "text"
          }
        ]
      },
      {
        tip: "cozum",
        baslik: "Neden Hızlı Sonuç Alıyorum?",
        icerik: "İlk 7 günde maksimum görünürlük, 30 günde teklif hedefi.",
        altBolge: [
          {
            baslik: "30-60 Günde Satış",
            icerik: "✅ Doğru fiyat aralığı\n✅ İlk hafta agresif kampanya\n✅ Hazır alıcı listesi",
            tip: "stats"
          },
          {
            baslik: "Şeffaf Fiyat Yönetimi",
            icerik: "✅ Güncel piyasa verisi\n✅ Teklif bazlı raporlama\n✅ 24 saat içinde geri bildirim",
            tip: "stats"
          },
          {
            baslik: "Sıfır Stres",
            icerik: "✅ Tek temas noktası\n✅ Belgeler hazır\n✅ Satış olmazsa 0₺",
            tip: "stats"
          }
        ]
      },
      {
        tip: "process",
        baslik: "3 Adımda Hızlı Satış Rotası",
        icerik: "İlk gün hazırlık, 7 günde maksimum görünürlük, 30 günde teklif",
        altBolge: [
          {
            baslik: "1. Turbo Hazırlık",
            icerik: "• Ekspertiz + fiyat analizi\n• 360° foto/video\n• Başlık & ilan kopyaları\n\n⚡ Kazancınız:\nPazara ilk gün profesyonel giriş",
            tip: "text"
          },
          {
            baslik: "2. Dijital Blitz",
            icerik: "• Meta & Google performans kampanyası\n• Premium ilan vitrinleri\n• 500+ alıcı veritabanına mailing\n\n📈 Hedef:\nİlk hafta 10.000+ görüntülenme",
            tip: "text"
          },
          {
            baslik: ofisIcerik.baslik,
            icerik: `${ofisIcerik.icerik}\n\n⚡ Kazancınız:\n• Güçlü kurumsal güvence\n• Pazarlıkta ekstra prestij`,
            tip: "text"
          }
        ]
      },
      {
        tip: "guarantee",
        baslik: "Hızlı Satış Garantilerim",
        icerik: "Satış olmazsa tek kuruş ödemezsiniz. Tüm hizmetler bana ait.",
        altBolge: [
          {
            baslik: "Sıfır Ön Ödeme",
            icerik: "Analiz, çekim, pazarlama dahil hiçbir hizmet için ön ödeme alınmaz.",
            tip: "list"
          },
          {
            baslik: "Süre Taahhüdü",
            icerik: "14 günde rapor • 30 günde optimizasyon • 45 günde teklif masası",
            tip: "list"
          }
        ]
      },
      {
        tip: "location_analysis",
        baslik: "KONUM ÖZETİ",
        icerik: `${mulk.konum} bölgesinin hızlı satışa uygun parametreleri:`,
        altBolge: [
          {
            baslik: "Bölge Avantajı",
            icerik: formatList(
              normalizeTextList(
                mulk.cevreOzellikleri?.join("\n"),
                ["Ana arterlere yakın", "Yürünebilir sosyal imkanlar", "Hazır talep gören pazar"]
              ),
              "•"
            ),
            tip: "list"
          }
        ]
      },
      {
        tip: "location_advantages",
        baslik: "🚀 KONUM AVANTAJLARI",
        icerik: formatList(konumAvantajlariList, "✅"),
        altBolge: []
      },
      {
        tip: "usage_potential",
        baslik: "🎯 KULLANIM POTANSİYELİ",
        icerik: formatList(kullanimPotansiyeliList, "✅"),
        altBolge: []
      },
      {
        tip: "marketing_strategy",
        baslik: "📢 10 GÜNLÜK TANITIM PLANI",
        icerik: "İlk 72 saatte maksimum görünürlük için plan:",
        altBolge: [
          {
            baslik: "Ana Mesaj",
            icerik: `"${mulk.konum}'da ${getMulkLabel(mulk.tur)} için hızlandırılmış fırsat"`,
            tip: "quote"
          },
          {
            baslik: "Vurgular",
            icerik: formatList([
              "Kısa sürede sonuç",
              "Hazır alıcı kitlesi",
              "Şeffaf fiyat yönetimi"
            ], "⭐"),
            tip: "list"
          },
          {
            baslik: "Görsel İçerik",
            icerik: "🎥 Kısa video\n📸 Reels/Story setleri\n🗺️ Google Maps highlight",
            tip: "list"
          }
        ]
      },
      {
        tip: "value_plan",
        baslik: "💰 30 GÜNLÜK FİYAT & TEKLİF STRATEJİSİ",
        icerik: "Piyasa geri bildirimi ile anlık fiyat optimizasyonu.",
        altBolge: [
          {
            baslik: "Liste Fiyatı",
            icerik: "Piyasaya giriş aralığı + hedef teklif",
            tip: "text"
          },
          {
            baslik: "Hedef Teklif Sayısı",
            icerik: "İlk ay 5+ ön görüşme, 3 ciddi teklif",
            tip: "text"
          },
          {
            baslik: "Kritik Tarihler",
            icerik: "Gün 7: rapor • Gün 14: optimizasyon • Gün 30: teklif masası",
            tip: "text"
          }
        ]
      },
      {
        tip: "ad_channels",
        baslik: "📣 HIZLI ERİŞİM REKLAM KANALLARI",
        icerik: "İlk hafta boyunca aktif mecralar:",
        altBolge: [
          {
            baslik: "Platformlar",
            icerik: formatList([
              "Sahibinden Vitrin",
              "Emlakjet Premium",
              "Facebook/Instagram",
              "Google Ads",
              "YouTube Reklamları",
              ofisIcerik.showInAds && danisman.ofisAdi ? `${danisman.ofisAdi?.toUpperCase()} Ağı` : undefined
            ].filter(Boolean) as string[], "✅"),
            tip: "list"
          }
        ]
      },
      {
        tip: "contact_24_7",
        baslik: "📞 7/24 Hızlı İletişim",
        icerik: "Talep geldiği anda yanıt sistemi devrede.",
        altBolge: [
          {
            baslik: "İletişim",
            icerik: `📞 ${danisman.telefon}\n📧 ${danisman.email}\n💬 WhatsApp: ${danisman.telefon}`,
            tip: "list"
          }
        ]
      },
      {
        tip: "timing_urgency",
        baslik: "⏰ Bekledikçe Kaybedersiniz",
        icerik: "Piyasa talebi şu an yüksek. Beklemek = daha düşük teklif riski.",
        altBolge: [
          {
            baslik: "Piyasa Nabzı",
            icerik: `💡 ${getMevsimText()} döneminde alıcılar en hızlı karar veriyor.`,
            tip: "quote"
          }
        ]
      },
      {
        tip: "market_opportunity",
        baslik: "📈 Anlık Piyasa Fırsatı",
        icerik: `${mulk.konum} bölgesinde benzer ${getMulkLabel(mulk.tur).toLowerCase()}lerin satış süresi 45-60 gün. Şimdi listelemek fiyat avantajı sağlar.`,
        altBolge: []
      },
      {
        tip: "faq",
        baslik: "Sık Sorulanlar",
        icerik: "Hızlı satış sürecinde gelen sorulara hazır yanıtlar:",
        altBolge: [
          {
            baslik: "Liste fiyatında pazarlık payı var mı?",
            icerik: "Piyasa geri bildirimine göre hızlı optimizasyon yapıyoruz. Doğru teklif geldiğinde süreci hızlandırıyoruz.",
            tip: "text"
          },
          {
            baslik: "Kaç günde dönüş alırız?",
            icerik: "İlk 48 saatte telefon + form başvuruları gelir. Haftalık rapor ile sizi bilgilendiriyorum.",
            tip: "text"
          },
          {
            baslik: "Satış olmazsa masraflar?",
            icerik: "Tüm hizmetler benim sorumluluğumda. Satış gerçekleşmezse hiçbir ücret alınmaz.",
            tip: "text"
          }
        ]
      },
      {
        tip: "cta",
        baslik: "Hemen Görüşme Ayarla",
        icerik: "İlk 24 saatte hazırlığa başlamak için iletişime geçin.",
        altBolge: [
          {
            baslik: "Hızlı Başlangıç",
            icerik: "📅 24 saatte randevu\n📝 Ekspertiz raporu aynı gün\n🚀 3 günde yayında",
            tip: "list"
          }
        ]
      }
    ];

    return applyTemaVeAmacVaryasyon(bolgeler, {
      tema,
      amac,
      temaDil: getTemaVaryasyon(tema),
      mulk,
      danisman,
      konumAvantajlariList,
      kullanimPotansiyeliList,
      ofisIcerik,
      targetAudienceList: []
    });
  }
};

// TEMPLATE 3: Premium Sunum
const premiumSunumTemplate: FunnelTemplate = {
  id: "premium_sunum",
  name: "Premium Sunum Funneli",
  description: "Lüks hissi, prestij vurgusu",
  generateBolgeler: ({
    mulk,
    danisman,
    tema,
    uzunluk,
    amac,
    locationAnalysis,
    targetAudience,
    adChannels,
  }) => {
    const ofisIcerik = getOfisIcerik(danisman.ofisAdi);
    const konumAvantajlariFallback = buildLocationAdvantagesFallback(
      mulk,
      locationAnalysis,
      [
        "{{LOKASYON}} seçkin yaşam olanakları ve güvenli çevresiyle öne çıkıyor.",
        "{{LOKASYON}} prestijli projelerle değerini koruyan bir aks.",
        "{{LOKASYON}} yüksek profilli alıcıların tercih ettiği ayrıcalıklı bir bölge."
      ]
    );
    const konumAvantajlariList = normalizeTextList(
      mulk.konumAvantajlari,
      konumAvantajlariFallback
    );
    const kullanimPotansiyeliList = normalizeTextList(
      mulk.kullanimPotansiyeli,
      [
        "Lüks yaşam konsepti",
        "Yüksek kira getirili portföy",
        "Prestijli yatırım değeri"
      ]
    );

    const bolgeler: Bolge[] = [
      {
        tip: "hero",
        baslik: `${mulk.konum} - Prestij Sunumu`,
        icerik: `Bu ${getMulkLabel(mulk.tur).toLowerCase()} için hazırlanan sunum, seçkin alıcıların güvenle karar vermesini sağlayacak şekilde tasarlandı.`,
        altBolge: [
          {
            baslik: "Özel Davet Sunumu",
            icerik: "Sınırlı davetli listesi • Siyah/altın görsel dil • Premium hikaye anlatımı",
            tip: "quote"
          }
        ]
      },
      {
        tip: "lifestyle",
        baslik: "Ayrıcalıklı Yaşam Vizyonu",
        icerik: `${mulk.konum} sadece bir adres değil, bir yaşam standardı. Bu ${getMulkLabel(mulk.tur).toLowerCase()} size sunduğu deneyimle fark yaratıyor.`,
        altBolge: [
          {
            baslik: "Yaşam Kalitesi",
            icerik: konumAvantajlariList.slice(0, 3).join(" • ") || "Seçkin çevre, prestijli yaşam alanları, özel sosyal imkanlar",
            tip: "text"
          },
          {
            baslik: "Statü & Prestij",
            icerik: `Bu ${getMulkLabel(mulk.tur).toLowerCase()} sahipleri arasında olmak, sadece bir yatırım değil — bir yaşam tarzı beyanıdır.`,
            tip: "quote"
          }
        ]
      },
      {
        tip: "cozum",
        baslik: "Neden Prestij Sunum?",
        icerik: "Lüks alıcıların beklentilerine uygun şekilde itibar, güven ve seçkinlik odaklı sunum.",
        altBolge: [
          {
            baslik: "Marka Değeri",
            icerik: "✅ Özel marka hikayesi\n✅ Basın & PR görünürlüğü\n✅ Ödüllü danışman profili",
            tip: "stats"
          },
          {
            baslik: "VIP Deneyim",
            icerik: "✅ Davet usulü lansman\n✅ Yüksek profilli alıcı portföyü\n✅ Concierge destek",
            tip: "stats"
          },
          {
            baslik: "Güvenli Süreç",
            icerik: "✅ Sigortalı işlem yönetimi\n✅ Hukuki & finansal danışmanlık\n✅ Gizlilik protokolleri",
            tip: "stats"
          }
        ]
      },
      {
        tip: "process",
        baslik: "Prestij Sunum Metodu",
        icerik: "Seçkin portföyler için tasarlanan 4 aşamalı lüks satış kurgusu",
        altBolge: [
          {
            baslik: "1. Signature Story",
            icerik: "• Marka hikayesi oluşturma\n• Basın & PR materyalleri\n• Siyah/altın sunum kitabı\n\n✨ Kazancınız:\nAlıcı tarafında güven ve merak uyandıran hikaye",
            tip: "text"
          },
          {
            baslik: "2. Özel Prodüksiyon",
            icerik: "• 8K sinematik çekim\n• Sunset/sunrise atmosferi\n• Lüks yaşam tarzı sahneleri\n\n🎬 Kazancınız:\nUluslararası standartlarda tanıtım",
            tip: "text"
          },
          {
            baslik: "3. Davet Usulü Lansman",
            icerik: "• VIP alıcı listesi seçimi\n• Özel kokteyl + sunum\n• Concierge ulaşım organizasyonu\n\n🤝 Kazancınız:\nSınırlı ama yüksek nitelikli alıcı buluşmaları",
            tip: "text"
          },
          {
            baslik: ofisIcerik.baslik,
            icerik: `${ofisIcerik.icerik}\n\n💼 Kazancınız:\n• Global ağ ile premium alıcılar\n• Marka prestiji ile pazarlık gücü`,
            tip: "text"
          }
        ]
      },
      {
        tip: "guarantee",
        baslik: "Prestij Garantilerim",
        icerik: "Lüks portföyler için şeffaf ve güvenli süreç taahhüdü.",
        altBolge: [
          {
            baslik: "Gizlilik Protokolü",
            icerik: "Tüm görüşmeler NDA kapsamında, alıcı seçimi danışman kontrolünde.",
            tip: "list"
          },
          {
            baslik: "Sigortalı İşlem",
            icerik: "Tapu, finansal transfer ve ekspertiz süreçleri kurumsal güvence altında.",
            tip: "list"
          }
        ]
      },
      {
        tip: "location_analysis",
        baslik: "PRESTİJ KONUM ANALİZİ",
        icerik: `${mulk.konum} bölgesinin seçkin yaşam ve yatırım göstergeleri:`,
        altBolge: [
          {
            baslik: "Prestij Kriterleri",
            icerik: formatList(
              normalizeTextList(
                mulk.cevreOzellikleri?.join("\n"),
                ["Elit komşuluk", "Özel güvenlik", "Butik gastronomi & sanat alanları"]
              ),
              "•"
            ),
            tip: "list"
          }
        ]
      },
      {
        tip: "location_advantages",
        baslik: "🌟 KONUM AVANTAJLARI",
        icerik: formatList(konumAvantajlariList, "✅"),
        altBolge: []
      },
      {
        tip: "usage_potential",
        baslik: "🏛️ KULLANIM POTANSİYELİ",
        icerik: formatList(kullanimPotansiyeliList, "✅"),
        altBolge: []
      },
      {
        tip: "marketing_strategy",
        baslik: "🎯 LÜKS TANITIM STRATEJİSİ",
        icerik: "Prestij algısını güçlendiren üç eksenli plan",
        altBolge: [
          {
            baslik: "Ana Mesaj",
            icerik: `"${mulk.konum}'da seçkin yaşamın yeni merkezi"`,
            tip: "quote"
          },
          {
            baslik: "Vurgular",
            icerik: formatList([
              "Sınırlı portföy",
              "Özel lansman",
              "Kurumsal danışmanlık"
            ], "⭐"),
            tip: "list"
          },
          {
            baslik: "Görsel İçerik",
            icerik: "🎥 Sinematik tanıtım filmi\n📸 Vogue tarzı foto seri\n📖 Premium sunum kitabı",
            tip: "list"
          }
        ]
      },
      {
        tip: "value_plan",
        baslik: "💰 PRESTİJ FİYAT GÜZERGAHI",
        icerik: "İtibar kaybı yaşamadan doğru teklif masasına ulaşma planı.",
        altBolge: [
          {
            baslik: "Başlangıç",
            icerik: "Premium liste fiyatı + ayrıcalıklı teklif aralığı",
            tip: "text"
          },
          {
            baslik: "Teklif Yönetimi",
            icerik: "Ön yeterlilik + kanıtlı finans gücü + referans kontrol",
            tip: "text"
          },
          {
            baslik: "Zaman Çizelgesi",
            icerik: "Gün 10: VIP lansman • Gün 20: Özel görüşmeler • Gün 40: Sözleşme",
            tip: "text"
          }
        ]
      },
      {
        tip: "ad_channels",
        baslik: "📣 REKLAM KANALLARI",
        icerik: "Geniş erişim için kullandığım platformlar:",
        altBolge: [
          {
            baslik: "Platformlar",
            icerik: formatList([
              "Sahibinden Vitrin",
              "Emlakjet Premium",
              "Facebook/Instagram",
              "Google Ads",
              "YouTube Reklamları",
              ofisIcerik.showInAds && danisman.ofisAdi ? `${danisman.ofisAdi?.toUpperCase()} Ağı` : undefined
            ].filter(Boolean) as string[], "✅"),
            tip: "list"
          }
        ]
      },
      {
        tip: "contact_24_7",
        baslik: "🤝 Concierge İletişim",
        icerik: "Özel müşteri temsilcisi ile 7/24 erişim.",
        altBolge: [
          {
            baslik: "Kanallar",
            icerik: `📞 ${danisman.telefon}\n📧 ${danisman.email}\n🕴️ Concierge: ${danisman.telefon}`,
            tip: "list"
          }
        ]
      },
      {
        tip: "timing_urgency",
        baslik: "⏰ Prestijli Fırsatlar Beklemez",
        icerik: "Lüks portföylerde sınırlı sunum yapılır. Doğru zamanda aksiyon almak kritik.",
        altBolge: [
          {
            baslik: "Zamanlama",
            icerik: `💡 ${getMevsimText()} döneminde lüks portföy talebi yükselir.`,
            tip: "quote"
          }
        ]
      },
      {
        tip: "market_opportunity",
        baslik: "📈 Lüks Piyasa Nabzı",
        icerik: `${mulk.konum} lüks segmentinde son 6 ayda %12 değer artışı gözlendi. Şimdi listelenen portföyler daha yüksek teklif alıyor.`,
        altBolge: []
      },
      {
        tip: "faq",
        baslik: "Sık Sorulan Prestij Soruları",
        icerik: "Seçkin alıcıların ve portföy sahiplerinin önceden bilmek istediği detaylar:",
        altBolge: [
          {
            baslik: "Lansman nasıl gerçekleşiyor?",
            icerik: "Davet usulü, sınırlı katılımcı ile özel konseptte organize edilir.",
            tip: "text"
          },
          {
            baslik: "Gizlilik nasıl korunuyor?",
            icerik: "Tüm görüşmeler NDA kapsamında, fotoğraf ve bilgi paylaşımı kontrollü yapılır.",
            tip: "text"
          },
          {
            baslik: "Hangi referanslar mevcut?",
            icerik: "Önceki lüks portföy satışları ve basın görünürlükleri referans olarak paylaşılır.",
            tip: "text"
          }
        ]
      },
      {
        tip: "exclusive_offer",
        baslik: "Özel Davet — Sınırlı Erişim",
        icerik: `Bu sunum, ${getDanismanAdi(danisman)} tarafından seçilmiş kişilere özel hazırlanmıştır.`,
        altBolge: [
          {
            baslik: "VIP Gösterim",
            icerik: `Özel randevu ile birebir gösterim\nProfesyonel sunum dosyası\nGizlilik garantisi`,
            tip: "list"
          },
          {
            baslik: "Ayrıcalıklı Süreç",
            icerik: `${getDanismanAdi(danisman)} ile doğrudan, aracısız iletişim. Kişiye özel finansman danışmanlığı.`,
            tip: "text"
          }
        ]
      },
      {
        tip: "cta",
        baslik: "Portföyünüzü Özel Sunumla Tanıtalım",
        icerik: "Lansman tarihini planlamak için VIP görüşme talep edin.",
        altBolge: [
          {
            baslik: "VIP Görüşme",
            icerik: "📍 Lüks ofis veya çevrim içi sunum\n🗓️ 48 saat içinde randevu\n🛎️ Concierge destek",
            tip: "list"
          }
        ]
      }
    ];

    return applyTemaVeAmacVaryasyon(bolgeler, {
      tema,
      amac,
      temaDil: getTemaVaryasyon(tema),
      mulk,
      danisman,
      konumAvantajlariList,
      kullanimPotansiyeliList,
      ofisIcerik,
      targetAudienceList: []
    });
  }
};

// TEMPLATE 4: Güven Odaklı
const guvenOdakliTemplate: FunnelTemplate = {
  id: "guven_odakli",
  name: "Güven Odaklı Funneli",
  description: "Güven inşası, sosyal kanıt, şeffaflık",
  generateBolgeler: ({
    mulk,
    danisman,
    tema,
    uzunluk,
    amac,
    locationAnalysis,
    targetAudience,
    adChannels,
  }) => {
    const ofisIcerik = getOfisIcerik(danisman.ofisAdi);
    const konumAvantajlariFallback = buildLocationAdvantagesFallback(
      mulk,
      locationAnalysis,
      [
        "{{LOKASYON}} güvenilir ve kanıtlanmış bir gayrimenkul bölgesi.",
        "{{LOKASYON}} çevresinde istikrarlı değer artışı gösteren bir pazar.",
        "{{LOKASYON}} bölgesi yüzlerce başarılı satışla kendini kanıtladı."
      ]
    );
    const konumAvantajlariList = normalizeTextList(
      mulk.konumAvantajlari,
      konumAvantajlariFallback
    );
    const kullanimPotansiyeliList = normalizeTextList(
      mulk.kullanimPotansiyeli,
      [
        "Kanıtlanmış yatırım getirisi",
        "Güvenli ve şeffaf satış süreci",
        "Risk minimizasyonu ile portföy yönetimi"
      ]
    );

    const bolgeler: Bolge[] = [
      {
        tip: "hero",
        baslik: `${mulk.konum} — Güvenle Satış`,
        icerik: `${getDanismanAdi(danisman)} olarak ${mulk.konum} bölgesinde ${getMulkLabel(mulk.tur).toLowerCase()} satışında şeffaf ve güvenilir bir süreç sunuyorum. Satış olmazsa tek kuruş ödemezsiniz.`,
        altBolge: [
          {
            baslik: "Güven Taahhüdü",
            icerik: "Şeffaf süreç • Sıfır risk • Kanıtlanmış başarı",
            tip: "quote"
          }
        ]
      },
      {
        tip: "testimonials",
        baslik: `Başarı Hikayeleri — ${getMulkLabel(mulk.tur)} Sahipleri Anlatıyor`,
        icerik: `${getDanismanAdi(danisman)} ile çalışan ${getMulkOwner(mulk.tur)}lerinin deneyimleri.`,
        altBolge: [
          {
            baslik: "Müşteri Deneyimi",
            icerik: `"Süreç boyunca her adımda bilgilendirildim. ${getDanismanAdi(danisman)} gerçekten işinin ehli." — Memnun ${getMulkOwner(mulk.tur)}`,
            tip: "quote"
          },
          {
            baslik: "Rakamlarla Güven",
            icerik: `Başarılı satış oranı: %95+ | Ortalama satış süresi: 45 gün | Müşteri memnuniyeti: %98`,
            tip: "stats"
          }
        ]
      },
      {
        tip: "location_advantages",
        baslik: `${extractMainLocation(mulk?.konum)} — Konum Avantajları`,
        icerik: `${mulk.konum} bölgesinin kanıtlanmış avantajları.`,
        altBolge: konumAvantajlariList.slice(0, 4).map((item: string) => ({
          baslik: item.split(" ")[0] || "Avantaj",
          icerik: item,
          tip: "text" as const
        }))
      },
      {
        tip: "guarantees",
        baslik: "Sıfır Risk Garantisi",
        icerik: `${getDanismanAdi(danisman)} ile çalışmanın güvenceleri.`,
        altBolge: [
          {
            baslik: "Sıfır Ön Ödeme",
            icerik: `${getMulkLabelPossessive(mulk.tur)} listelemek için hiçbir ödeme yapmazsınız. Tüm hizmetler satış gerçekleşene kadar ücretsiz.`,
            tip: "list"
          },
          {
            baslik: "Şeffaf Süreç",
            icerik: "Haftalık raporlama | Her gösterim sonrası bilgilendirme | Fiyat güncelleme önerileri | Hukuki süreç desteği",
            tip: "list"
          },
          {
            baslik: "Kurumsal Güvence",
            icerik: ofisIcerik.icerik,
            tip: "list"
          }
        ]
      },
      buildFaqSection(danisman, "guven_odakli"),
      {
        tip: "cta",
        baslik: "Güvenli Satış Süreciniz Başlasın",
        icerik: `${getDanismanAdi(danisman)} ile ücretsiz değerleme görüşmesi yapın.`,
        altBolge: [
          {
            baslik: "Güvence Sözümüz",
            icerik: "24 saat içinde geri dönüş\nHiçbir bağlayıcılık yok\n%100 gizlilik garantisi\nSatış olmazsa 0₺ ödeme",
            tip: "list"
          }
        ]
      }
    ];

    return bolgeler;
  }
};

// TEMPLATE 5: Minimalist
const minimalistTemplate: FunnelTemplate = {
  id: "minimalist",
  name: "Minimalist Funneli",
  description: "Sade, net, öz bilgi",
  generateBolgeler: ({ mulk, danisman, locationAnalysis }) => {
    const konumAvantajlariList = normalizeTextList(
      mulk.konumAvantajlari,
      buildLocationAdvantagesFallback(mulk, locationAnalysis, [
        "{{LOKASYON}} konumu avantajlı.",
        "{{LOKASYON}} ulaşım ağlarına yakın.",
      ])
    );

    return [
      {
        tip: "hero",
        baslik: `${mulk.konum}`,
        icerik: joinLines([
          formatPriceRange(mulk),
          mulk.metrekare ? `${mulk.metrekare} m²` : undefined,
          mulk.odaSayisi ? `${mulk.odaSayisi}` : undefined
        ])
      },
      {
        tip: "location_advantages",
        baslik: "Öne Çıkanlar",
        icerik: konumAvantajlariList.slice(0, 3).join("\n"),
      },
      {
        tip: "cta",
        baslik: "İletişim",
        icerik: `${getDanismanAdi(danisman)}`,
        altBolge: [
          {
            baslik: "Bilgi",
            icerik: joinLines([danisman.telefon, danisman.email]),
            tip: "list"
          }
        ]
      }
    ];
  }
};

export function getFunnelTemplate(templateId: TemplateId): FunnelTemplate {
  const templates: Record<TemplateId, FunnelTemplate> = {
    detayli_analiz: detayliAnalizTemplate,
    hizli_satis: hizliSatisTemplate,
    premium_sunum: premiumSunumTemplate,
    guven_odakli: guvenOdakliTemplate,
    minimalist: minimalistTemplate
  };
  
  return templates[templateId];
}

interface GenerateSunumParams {
  mulk: any;
  danisman: any;
  tema: TemaTuru;
  uzunluk: SunumUzunlugu;
  amac?: SunumAmaci;
  sunumStili?: SunumStili;
  templateId?: TemplateId;
  locationAnalysis?: string;
  detayliDegerleme?: DetayliDegerlemeVerisi;
  detayliDegerlemeAktif?: boolean;
  kfeData?: any;
  marketAnalysisCards?: Array<{baslik: string; icerik: string}>;
  targetAudience?: Array<{baslik: string; aciklama: string}>;
  adChannels?: string[];
}

export function generateSunumFromTemplate({
  mulk,
  danisman,
  tema,
  uzunluk,
  amac = "portfoy_almak",
  sunumStili = "detayli_analiz",
  templateId = "detayli_analiz",
  locationAnalysis,
  detayliDegerleme,
  detayliDegerlemeAktif,
  kfeData,
  marketAnalysisCards,
  targetAudience,
  adChannels,
}: GenerateSunumParams): SunumIcerik {
  // Danışman bilgilerini imla kurallarına göre düzelt
  const formattedDanisman = {
    ...danisman,
    deneyim: danisman.deneyim ? formatDeneyim(danisman.deneyim) : danisman.deneyim,
    oduller: danisman.oduller ? formatOduller(danisman.oduller) : danisman.oduller,
    referans: danisman.referans ? formatReferans(danisman.referans) : danisman.referans,
  };
  
  const template = getFunnelTemplate(templateId);
  const temaDil = getTemaVaryasyon(tema);
  const priceSummary = formatPriceRange(mulk);
  const altBaslik = joinWithSeparator(
    [
      mulk.metrekare ? `${mulk.metrekare} m²` : undefined,
      priceSummary,
    ],
    " | "
  );
  let bolgeler = [...template.generateBolgeler({
    mulk,
    danisman: formattedDanisman,
    tema,
    uzunluk,
    amac,
    sunumStili,
    locationAnalysis,
    detayliDegerleme,
    detayliDegerlemeAktif,
    targetAudience,
    adChannels,
  })];

  if (!bolgeler.some((bolge) => bolge.tip === "market_analysis")) {
    bolgeler.push(
      buildMarketAnalysisSection({
        mulk,
        locationAnalysis,
        detayliDegerleme,
        kfeData,
        marketAnalysisCards,
      })
    );
  }

  if (!bolgeler.some((bolge) => bolge.tip === "faq")) {
    bolgeler.push(buildFaqSection(formattedDanisman, sunumStili));
  }
  const heroTagline =
    amac === "portfoy_almak"
      ? temaDil.heroSellerTagline
      : temaDil.heroBuyerTagline;
  const heroAciklama =
    amac === "portfoy_almak"
      ? temaDil.heroSellerBody({ mulk, danisman })
      : temaDil.heroBuyerBody({ mulk, danisman });
  const stilBaslik = SUNUM_STILI_BASLIKLARI[sunumStili] || heroTagline;
  
  return {
    baslik: `${mulk.konum} - ${stilBaslik}`,
    altBaslik: altBaslik || undefined,
    heroAciklama,
    bolgeler,
    detayliDegerleme,
    cti: {
      baslik:
        amac === "portfoy_almak"
          ? temaDil.ctaTitleSeller
          : temaDil.ctaTitleBuyer,
      aciklama:
        amac === "portfoy_almak"
          ? temaDil.ctaBodySeller({ mulk, danisman })
          : temaDil.ctaBodyBuyer({ mulk, danisman })
    }
  };
}

