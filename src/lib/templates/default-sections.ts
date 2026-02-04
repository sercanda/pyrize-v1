/**
 * Varsayılan bölüm şablonları - Formdan gelen bilgilere göre dinamik olarak doldurulur
 */

export interface LocationBasedTemplate {
  nadirFirsat: string;
  konumPrimi: string;
  gelisimPotansiyeli: string;
}

export interface TargetAudienceTemplate {
  baslik: string;
  aciklama: string;
}

// Mülk türüne ve özelliklerine göre Nadir Fırsat şablonları
export const getNadirFirsatTemplate = (params: {
  mulkTur: string;
  metrekare?: number;
  odaSayisi?: string;
  konum: string;
  fiyat?: number;
}): string => {
  const { mulkTur, metrekare, odaSayisi, konum, fiyat } = params;
  const locationName = konum.split(',')[0].trim();

  const templates: Record<string, string[]> = {
    daire: [
      `${locationName} bölgesinde ${metrekare ? `${metrekare}m²` : ''} ${odaSayisi || ''} daire nadir bulunur. ${metrekare && metrekare > 150 ? 'Net kullanım alanı ve kalite vurgulanmalı.' : 'Benzer alternatifler sınırlı.'}`,
      `Bu özelliklerde daire piyasada az sayıda. ${metrekare && metrekare > 140 ? 'Geniş m² talep %35 daha hızlı artıyor.' : 'Erken yatırım avantajlı.'}`,
      `${locationName} konumunda ${metrekare ? `${metrekare}m²` : ''} daire sayısı çok az. Nadir bir yatırım fırsatı sunuyor.`
    ],
    villa: [
      `${locationName} bölgesinde ${metrekare ? `${metrekare}m²` : ''} villa bulmak zor. Lüks villalar piyasada nadiren bulunur.`,
      `Bu villa, ${metrekare ? `${metrekare}m² alanı` : 'geniş yaşam alanı'} ile öne çıkıyor. Benzer villa sayısı sınırlı.`,
      `${locationName} çevresinde lüks villa seçenekleri kısıtlı. Özel tasarım ve konfor bir arada nadir.`
    ],
    arsa: [
      `${locationName} bölgesinde ${metrekare ? `${metrekare}m²` : 'bu büyüklükte'} imar durumu net arsa bulmak oldukça zordur. Bölgenin gelişim potansiyeli göz önüne alındığında, bu arsa nadir bir yatırım fırsatıdır.`,
      `${metrekare ? `${metrekare}m²` : 'Bu büyüklükte'} arsa, ${locationName} lokasyonunda nadiren satışa çıkmaktadır. İmar durumu net ve yatırıma hazır arsalar piyasada çok azdır.`,
      `${locationName} çevresinde ${fiyat ? 'bu fiyat aralığında' : ''} yatırıma uygun arsa seçenekleri oldukça sınırlıdır. Bölgenin gelişim ivmesi ile erken yatırım yapanlar için önemli kazanç fırsatı sunmaktadır.`
    ],
    ticari: [
      `${locationName} merkezinde ${metrekare ? `${metrekare}m²` : 'bu büyüklükte'} ticari alan bulmak oldukça zordur. Yüksek görünürlük, kolay erişim ve yoğun insan trafiği bir arada nadiren bulunur.`,
      `Bu ticari alan, ${locationName} lokasyonunda stratejik bir konuma sahiptir. Benzer özelliklere sahip ticari alanların sayısı çok azdır ve talep sürekli yüksektir.`,
      `${locationName} bölgesinde ${fiyat ? 'bu fiyat aralığında' : ''} yatırıma uygun ticari alan seçenekleri oldukça sınırlıdır. Yüksek kira getirisi potansiyeli olan lokasyonlar nadiren satışa çıkar.`
    ],
    ofis: [
      `${locationName} merkezinde ${metrekare ? `${metrekare}m²` : 'bu büyüklükte'} prestijli ofis alanı bulmak oldukça zordur. Modern altyapı, kolay ulaşım ve profesyonel çevre bir arada nadiren bulunur.`,
      `Bu ofis, ${locationName} lokasyonunda A+ sınıf özelliklere sahiptir. Benzer kalitede ofis alanlarının sayısı çok azdır ve kurumsal firmalar tarafından tercih edilir.`,
      `${locationName} bölgesinde ${fiyat ? 'bu fiyat aralığında' : ''} yatırıma uygun ofis seçenekleri oldukça sınırlıdır. Yüksek kira getirisi ve prestij bir arada nadir fırsattır.`
    ],
    kompleks: [
      `${locationName} bölgesinde ${metrekare ? `${metrekare}m²` : 'bu büyüklükte'} sosyal tesisli kompleks dairesi bulmak oldukça zordur. Havuz, spor salonu, güvenlik ve geniş m² bir arada nadiren bulunur.`,
      `Bu kompleks, ${locationName} lokasyonunda ${odaSayisi || 'geniş'} daire ile öne çıkmaktadır. Sosyal donatılı projelere olan talep, standart apartman dairelerine göre %40 daha hızlı artmaktadır.`,
      `${locationName} çevresinde ${fiyat ? 'bu fiyat aralığında' : ''} lüks kompleks seçenekleri oldukça sınırlıdır. Kapalı site avantajı ve sosyal tesisler bir arada nadir fırsattır.`
    ]
  };

  const mulkTemplates = templates[mulkTur] || templates.daire;
  return mulkTemplates[Math.floor(Math.random() * mulkTemplates.length)];
};

// Konum Primi şablonları
export const getKonumPrimiTemplate = (params: {
  mulkTur: string;
  konum: string;
  locationAnalysis?: string;
}): string => {
  const { mulkTur, konum, locationAnalysis } = params;
  const locationName = konum.split(',')[0].trim();

  const templates: Record<string, string[]> = {
    daire: [
      `${locationName} lokasyonu, ana arterlere yakınlığı ile konum primi sağlıyor. Ulaşım ve sosyal tesislere erişim avantajlı.`,
      `${locationName} konumu, merkezi lokasyonu ile piyasa üstü konum primi sunuyor. Gelişim potansiyeli değeri artırıyor.`,
      `Bölgenin stratejik konumu, AVM, okul ve hastanelere yakınlık ile konum primi kazandırıyor.`
    ],
    villa: [
      `${locationName} lokasyonu, doğa ile iç içe ancak merkeze yakın konumuyla konum primi sağlıyor.`,
      `Bölgenin prestijli konumu ve güvenli çevre ile konum primi kazandırıyor. Villa değerleri artıyor.`,
      `${locationName}, özel villa bölgesi ve elit komşuluk avantajı ile piyasa üstü konum primi sunuyor.`
    ],
    arsa: [
      `${locationName} bölgesi, hızlı gelişim ile konum primi sağlıyor. Altyapı projeleri değeri artırıyor.`,
      `Bölgenin stratejik konumu, ${locationName} çevresindeki yeni yatırımlar ve kentsel dönüşüm projeleri ile önemli bir konum primi kazandırmaktadır. Erken yatırım avantajı sunmaktadır.`,
      `${locationName} lokasyonu, ana yollara yakınlığı ve gelişim potansiyeli ile piyasa ortalamasının üzerinde bir konum primi sunmaktadır. Yatırım değeri yüksektir.`
    ],
    ticari: [
      `${locationName} merkezindeki konumu, yüksek insan trafiği ve görünürlük ile önemli bir konum primi sağlamaktadır. Ticari başarı için ideal lokasyon avantajı sunmaktadır.`,
      `Bölgenin ticari merkez olması, ${locationName} çevresindeki alışveriş alışkanlıkları ve kolay erişim ile önemli bir konum primi kazandırmaktadır. Yüksek kira getirisi potansiyeli vardır.`,
      `${locationName} lokasyonu, ana cadde üzerinde olması ve yoğun araç-yaya trafiği ile piyasa ortalamasının üzerinde bir konum primi sunmaktadır. Ticari yatırım için idealdir.`
    ],
    ofis: [
      `${locationName} merkezindeki konumu, prestijli iş merkezi olması ve kolay ulaşım ile önemli bir konum primi sağlamaktadır. Kurumsal firmalar için ideal lokasyon avantajı sunmaktadır.`,
      `Bölgenin iş merkezi olması, ${locationName} çevresindeki diğer kurumsal ofisler ve sosyal tesisler ile önemli bir konum primi kazandırmaktadır. Profesyonel çevre avantajı vardır.`,
      `${locationName} lokasyonu, metro/tramvay istasyonuna yakınlığı ve merkezi konumu ile piyasa ortalamasının üzerinde bir konum primi sunmaktadır. Çalışan memnuniyeti yüksektir.`
    ],
    kompleks: [
      `Proje, şehir gürültüsünden uzak ancak ana arterlere yakın konumuyla 'Huzurlu Lüks' arayanların ilk tercihidir. ${locationName} lokasyonu, kapalı site avantajı ile önemli bir konum primi sağlamaktadır.`,
      `${locationName} konumu, sosyal tesisleri bol kompleks olması ve güvenli çevre ile piyasa ortalamasının üzerinde bir konum primi sunmaktadır. Aile yaşamı için idealdir.`,
      `Bölgenin stratejik konumu, ${locationName} çevresindeki okullar, alışveriş merkezleri ve parklar ile önemli bir konum primi kazandırmaktadır. Yaşam kalitesi yüksektir.`,
      `${locationName}, merkezi konumu ile şehir merkezine yakın ancak yeşil alanlarla çevrili olması sayesinde hem ulaşım hem huzur sunan nadir bölgelerden biridir. Sosyal tesisler ve güvenlik ile konum primi kazandırır.`
    ]
  };

  // Eğer daire veya kompleks ise ve "site" veya "kompleks" kelimelerini içeriyorsa özel şablon kullan
  if ((mulkTur === 'daire' || mulkTur === 'kompleks') && konum.toLowerCase().includes('site')) {
    const mulkTemplates = templates[mulkTur] || templates.daire;
    // Site konsepti vurgusu için son şablonu tercih et
    return mulkTemplates[mulkTemplates.length - 1];
  }

  const mulkTemplates = templates[mulkTur] || templates.daire;
  return mulkTemplates[Math.floor(Math.random() * mulkTemplates.length)];
};

// Gelişim Potansiyeli şablonları - TÜİK verileriyle zenginleştirilmiş
export const getGelisimPotansiyeliTemplate = (params: {
  mulkTur: string;
  konum: string;
  locationAnalysis?: string;
}): string => {
  const { mulkTur, konum, locationAnalysis } = params;
  const locationName = konum.split(',')[0].trim();

  const templates: Record<string, string[]> = {
    daire: [
      `${locationName} bölgesinde yeni yapılaşmalar artıyor. Geniş m² talep %40 daha hızlı artıyor. 3-5 yılda önemli değer artışı bekleniyor.`,
      `${locationName} hızlı gelişim gösteriyor. Altyapı projeleri ve ticari yatırımlar değeri artırıyor. Erken yatırım avantajlı.`,
      `Bölgede kentsel dönüşüm ve yeni yatırımlar değeri artırıyor. Modern daire talebi yükseliyor.`
    ],
    villa: [
      `${locationName} bölgesi lüks villa projelerinin yoğunlaştığı lokasyon. 3-5 yılda önemli değer artışı bekleniyor.`,
      `Bölgedeki yeni marina ve sosyal tesisler değeri artırıyor. Lüks villa talebi yükseliyor.`,
      `${locationName} elit yaşam konseptinin geliştiği lokasyon. Yeni projeler potansiyeli artırıyor.`
    ],
    arsa: [
      `${locationName} bölgesi hızlı bir gelişim göstermektedir. Yeni imar planları, altyapı projeleri ve ticari yatırımlar, arsa değerlerini önümüzdeki 3-5 yıl içinde 2-3 kat artırma potansiyeline sahiptir.`,
      `Bölgede planlanan kentsel dönüşüm projeleri ve yeni yatırımlar, ${locationName} çevresinin değerini sürekli artırmaktadır. Erken arsa yatırımı yapanlar için önemli kazanç fırsatı sunmaktadır.`,
      `${locationName} bölgesi, yeni yapılaşmaların yoğunlaştığı bir lokasyondur. İmar durumu net arsaların değeri, bölgenin gelişim ivmesi ile birlikte hızla artmaktadır.`
    ],
    ticari: [
      `${locationName} bölgesi, ticari yatırımların yoğunlaştığı bir lokasyondur. Yeni alışveriş merkezleri, ofis binaları ve sosyal tesisler, ticari alan değerlerini önümüzdeki 3-5 yıl içinde önemli oranda artıracaktır.`,
      `Bölgede planlanan yeni projeler ve artan nüfus, ${locationName} çevresinin ticari değerini sürekli artırmaktadır. Ticari yatırım yapanlar için önemli kazanç fırsatı sunmaktadır.`,
      `${locationName} bölgesi, ticari merkez olma yolunda hızla ilerlemektedir. Yeni yatırımlar ve artan talep, ticari alanların değer artış potansiyelini yükseltmektedir.`
    ],
    ofis: [
      `${locationName} bölgesi, iş merkezi olma yolunda hızla ilerlemektedir. Yeni plaza projeleri, kurumsal firmaların bölgeye ilgisi ve altyapı yatırımları, ofis değerlerini önümüzdeki 3-5 yıl içinde önemli oranda artıracaktır.`,
      `Bölgede planlanan yeni iş merkezleri ve artan kurumsal talep, ${locationName} çevresinin ofis değerini sürekli artırmaktadır. Ofis yatırımı yapanlar için önemli kazanç fırsatı sunmaktadır.`,
      `${locationName} bölgesi, prestijli iş merkezi olma yolunda hızla ilerlemektedir. Yeni yatırımlar ve artan talep, ofis alanlarının değer artış potansiyelini yükseltmektedir.`
    ],
    kompleks: [
      `Bölgedeki yeni yapılaşmalar site konseptine dönmekte, geniş m²'li ve sosyal donatılı projelere olan talep, standart apartman dairelerine göre %40 daha hızlı artmaktadır. ${locationName} bölgesi önümüzdeki 3-5 yıl içinde önemli değer artışı gösterecektir.`,
      `${locationName} bölgesi, kapalı site projelerinin yoğunlaştığı bir lokasyondur. Sosyal tesisli komplekslere olan talep, önümümdeki dönemde daha da yükselecektir.`,
      `Bölgede planlanan yeni kompleks projeleri ve artan talep, ${locationName} çevresinin değerini sürekli artırmaktadır. Güvenli ve sosyal tesisli yaşam alanlarına ilgi artmaktadır.`,
      `${locationName} çevresinde kapalı site konseptli projelere yönelik talep, piyasa verilerine göre apartman dairelerine kıyasla belirgin şekilde yüksektir. Sosyal tesisler (havuz, spor salonu, çocuk parkı) olan projelerin değer kazanma hızı, TÜİK verilerine göre %40 daha fazla olduğu gözlemlenmektedir.`
    ]
  };

  // Kompleks veya site konsepti için özel şablon seçimi
  if ((mulkTur === 'kompleks' || mulkTur === 'daire') && (konum.toLowerCase().includes('site') || konum.toLowerCase().includes('kompleks'))) {
    const mulkTemplates = templates[mulkTur === 'kompleks' ? 'kompleks' : 'daire'] || templates.daire;
    // Site/kompleks konsepti için son şablonu tercih et (TÜİK referanslı)
    return mulkTemplates[mulkTemplates.length - 1];
  }

  const mulkTemplates = templates[mulkTur] || templates.daire;
  return mulkTemplates[Math.floor(Math.random() * mulkTemplates.length)];
};

// Hedef Kitle şablonları
export const getHedefKitleTemplates = (params: {
  mulkTur: string;
  konum: string;
  metrekare?: number;
  odaSayisi?: string;
  fiyat?: number;
}): TargetAudienceTemplate[] => {
  const { mulkTur, konum, metrekare, odaSayisi, fiyat } = params;
  const locationName = konum.split(',')[0].trim();

  const templates: Record<string, TargetAudienceTemplate[]> = {
    daire: [
      {
        baslik: "Geniş Aileler",
        aciklama: `Çocukları için güvenli oyun alanı${metrekare && metrekare > 140 ? ', havuz ve ferah ev' : ' ve konforlu yaşam alanı'} arayan, ${odaSayisi === '3+1' ? '3+1\'e sığmayan' : odaSayisi === '4+1' || odaSayisi === '5+1' ? 'geniş ve konforlu yaşam alanına ihtiyaç duyan' : 'geniş alana ihtiyaç duyan'} aileler.`
      },
      {
        baslik: "Konfor Arayanlar",
        aciklama: `${metrekare && metrekare > 150 ? 'Giyinme odası, ebeveyn banyosu, geniş balkon gibi lüks detaylara' : metrekare && metrekare > 120 ? 'Ferah yaşam alanları, kaliteli işçilik ve konfor detaylarına' : 'Modern tasarım, kaliteli malzeme ve konfor detaylarına'} önem veren profesyoneller.`
      },
      {
        baslik: "Yatırımcılar",
        aciklama: `${locationName}'ın değer artış potansiyelini bilen ve ${fiyat && fiyat > 5000000 ? 'yüksek değerli' : 'nitelikli'} mülk yatırımı yapmak isteyenler. ${metrekare && metrekare > 160 ? 'Geniş metrekarenin kira getirisini ve değer artışını öngören bilinçli yatırımcılar.' : ''}`
      }
    ],
    villa: [
      {
        baslik: "Lüks Yaşam Arayanlar",
        aciklama: `${locationName} bölgesinde ${metrekare ? `${metrekare}m²` : 'geniş'} bahçeli, özel havuzlu ve prestijli bir yaşam alanı arayan üst gelir grubu aileler.`
      },
      {
        baslik: "Geniş Aileler",
        aciklama: `Çocukları için güvenli, ferah ve özel yaşam alanı arayan, apartman dairelerinin sınırlılıklarından kurtulmak isteyen 4+ kişilik aileler.`
      },
      {
        baslik: "Tatil Evi Yatırımcıları",
        aciklama: `${locationName} lokasyonunda hem tatil hem yatırım amaçlı kullanılabilecek, kira getirisi yüksek villa arayan yatırımcılar.`
      }
    ],
    arsa: [
      {
        baslik: "Geliştiriciler",
        aciklama: `${locationName} bölgesinde ${metrekare ? `${metrekare}m²` : 'büyük'} arsa üzerine yeni proje geliştirmek isteyen inşaat firmaları ve gayrimenkul geliştiricileri.`
      },
      {
        baslik: "Villa İnşa Etmek İsteyenler",
        aciklama: `${locationName} lokasyonunda kendi hayalindeki villayı inşa etmek isteyen, özel tasarım ve konfor arayanlar.`
      },
      {
        baslik: "Uzun Vadeli Yatırımcılar",
        aciklama: `${locationName} çevresinin gelişim potansiyelini değerlendirerek ${fiyat && fiyat > 2000000 ? 'yüksek değerli' : ''} arsa yatırımı yapmak isteyen bilinçli yatırımcılar.`
      }
    ],
    ticari: [
      {
        baslik: "İşletme Sahipleri",
        aciklama: `${locationName} merkezinde ${metrekare ? `${metrekare}m²` : ''} yüksek görünürlüğe sahip, müşteri erişimi kolay ticari alan arayan işletme sahipleri.`
      },
      {
        baslik: "Franchise Zincirleri",
        aciklama: `${locationName} çevresinde yeni şube açmak isteyen, yüksek insan trafiği olan lokasyon arayan ulusal ve uluslararası franchise zincirleri.`
      },
      {
        baslik: "Kurumsal Yatırımcılar",
        aciklama: `${locationName} bölgesinde ticari kira geliri elde etmek isteyen, ${fiyat && fiyat > 3000000 ? 'yüksek değerli' : ''} yatırım yapan kurumsal yatırımcılar.`
      }
    ],
    ofis: [
      {
        baslik: "Kurumsal Şirketler",
        aciklama: `${locationName} merkezinde ${metrekare ? `${metrekare}m²` : ''} prestijli, modern ve ulaşımı kolay ofis arayan, çalışan memnuniyetine önem veren şirketler.`
      },
      {
        baslik: "Serbest Meslek Sahipleri",
        aciklama: `${locationName} çevresinde müşteri erişimi kolay, profesyonel görünümlü ve uygun maliyetli ofis arayan avukat, doktor, danışman gibi serbest meslek sahipleri.`
      },
      {
        baslik: "Ofis Yatırımcıları",
        aciklama: `${locationName} bölgesinde ticari kira geliri elde etmek isteyen, ${fiyat && fiyat > 2000000 ? 'yüksek değerli' : ''} ofis yatırımı yapan yatırımcılar.`
      }
    ],
    kompleks: [
      {
        baslik: "Geniş Aileler",
        aciklama: `Çocukları için güvenli oyun alanı, havuz ve ferah ev arayan, ${odaSayisi === '3+1' ? '3+1\'e sığmayan' : odaSayisi === '4+1' ? 'standart 3+1\'lerden daha geniş alana ihtiyaç duyan' : 'geniş alana ihtiyaç duyan'} aileler. ${metrekare && metrekare > 180 ? `${metrekare}m² gibi geniş metrekare ile konforlu yaşam arayanlar.` : ''}`
      },
      {
        baslik: "Güvenlik Odaklı Aileler",
        aciklama: `${locationName} kompleksinde 7/24 güvenlik, kapalı site avantajı ve sosyal tesisler arayan, güvenli yaşam önceliği olan aileler. Site içi sosyal donatılar ile hem güvenlik hem sosyal yaşam arayanlar.`
      },
      {
        baslik: "Konfor Arayanlar",
        aciklama: `${metrekare && metrekare > 150 ? 'Giyinme odası, ebeveyn banyosu, geniş balkon gibi lüks detaylara' : 'Modern tasarım, kaliteli malzeme ve konfor detaylarına'} önem veren profesyoneller. Site içi sosyal tesislerin (havuz, spor salonu, park) yaşam kalitesini artırdığını düşünenler.`
      },
      {
        baslik: "Yatırımcılar",
        aciklama: `${locationName} bölgesinde kompleks içi sosyal tesislerin kira getirisini artıracağını düşünen, ${fiyat && fiyat > 4000000 ? 'yüksek değerli' : ''} mülk yatırımı yapan yatırımcılar. ${metrekare && metrekare > 160 ? 'Geniş metrekareli dairelerin değer artış potansiyelini bilen bilinçli yatırımcılar.' : ''}`
      }
    ]
  };

  return templates[mulkTur] || templates.daire;
};

// Reklam Kanalları şablonu - Mülk türüne ve özelliklerine göre dinamik
export const getReklamKanallariTemplate = (
  ofisAdi?: string,
  mulkTur?: string,
  fiyat?: number
): string[] => {
  const baseChannels = [
    "Sahibinden Vitrin",
    "Emlakjet Premium",
    "Facebook/Instagram (Aile Hedefli)",
    "Google Ads"
  ];

  // Mülk türüne göre özel kanallar
  if (mulkTur === 'daire' || mulkTur === 'kompleks') {
    baseChannels.push("YouTube Reklamları");
    if (fiyat && fiyat > 5000000) {
      baseChannels.push("LinkedIn (Yüksek Gelir Grubu)");
    }
  } else if (mulkTur === 'villa') {
    baseChannels.push("Instagram (Lüks Yaşam Hedefli)");
    baseChannels.push("Dijital Pazarlama (Villa Siteleri)");
  } else if (mulkTur === 'ticari' || mulkTur === 'ofis') {
    baseChannels.push("LinkedIn (Kurumsal Hedefli)");
    baseChannels.push("Yerel Ticaret Odası Ağı");
  } else if (mulkTur === 'arsa') {
    baseChannels.push("LinkedIn (Yatırımcı Hedefli)");
    baseChannels.push("İnşaat Sektörü Ağları");
  }

  if (ofisAdi) {
    // Büyük ofis ağları için özel kanal ekle
    const bigNetworks = ['RE/MAX', 'Coldwell Banker', 'Century 21', 'Keller Williams'];
    const isBigNetwork = bigNetworks.some(network => ofisAdi.toUpperCase().includes(network.toUpperCase()));

    if (isBigNetwork) {
      baseChannels.push(`${ofisAdi} Ağı`);
    } else {
      baseChannels.push(`${ofisAdi} Veritabanı`);
    }
  }

  return baseChannels;
};

// Görsel İçerik Planı şablonu
export const getGorselIcerikPlaniTemplate = (params: {
  mulkTur: string;
  metrekare?: number;
  odaSayisi?: string;
}): string => {
  const { mulkTur, metrekare, odaSayisi } = params;

  const templates: Record<string, string> = {
    daire: `📸 İç mekan geniş açı çekim (${odaSayisi || 'tüm odalar'}, salon, mutfak, banyolar)\n🚁 Drone ile ${metrekare && metrekare > 140 ? 'site/kompleks genel görünüm' : 'bina ve çevre çekimi'}\n🎬 Tanıtım videosu (60-90 saniye, sinematik)\n📱 360° Sanal Tur (tüm odalar)\n🌅 Gün ışığı ve gece çekimleri\n📐 Kat planı ve 3D görselleştirme`,
    villa: `📸 İç mekan geniş açı çekim (tüm odalar, salon, mutfak, özel alanlar)\n🚁 Drone ile bahçe, havuz ve villa genel görünüm\n🎬 Tanıtım videosu (90-120 saniye, lüks yaşam vurgusu)\n📱 360° Sanal Tur (villa içi ve bahçe)\n🌅 Gün batımı ve gece aydınlatma çekimleri\n🏊 Havuz ve sosyal alanların özel çekimi\n📐 Villa planı ve 3D görselleştirme`,
    arsa: `📸 Arsa genel görünüm (tüm açılardan)\n🚁 Drone ile arsa ve çevre çekimi (yüksek çözünürlük)\n🎬 Tanıtım videosu (60 saniye, konum avantajları vurgusu)\n🗺️ Uydu görüntüsü ve konum haritası\n📐 İmar durumu ve proje görselleri\n🌅 Farklı saatlerde çekim (gün ışığı, gün batımı)`,
    ticari: `📸 İç mekan geniş açı çekim (tüm alanlar, vitrin, depo)\n🚁 Drone ile bina ve çevre çekimi (yüksek trafik vurgusu)\n🎬 Tanıtım videosu (60-90 saniye, ticari potansiyel vurgusu)\n📱 360° Sanal Tur (tüm alanlar)\n🚶 Sokak görünümü ve insan trafiği çekimi\n📐 Kat planı ve alan kullanım önerileri`,
    ofis: `📸 İç mekan geniş açı çekim (ofis alanları, toplantı odaları, ortak alanlar)\n🚁 Drone ile bina ve çevre çekimi (iş merkezi vurgusu)\n🎬 Tanıtım videosu (60-90 saniye, profesyonel çevre vurgusu)\n📱 360° Sanal Tur (tüm ofis alanları)\n🏢 Bina girişi ve ortak alanların özel çekimi\n📐 Kat planı ve ofis düzenleme önerileri`,
    kompleks: `📸 İç mekan geniş açı çekim (${odaSayisi || 'tüm odalar'}, salon, mutfak, banyolar)\n🚁 Drone ile site/kompleks genel görünüm (havuz, spor alanları, sosyal tesisler)\n🎬 Tanıtım videosu (90-120 saniye, sosyal tesisler vurgusu)\n📱 360° Sanal Tur (daire içi ve sosyal alanlar)\n🏊 Havuz, spor salonu ve sosyal tesislerin özel çekimi\n🌅 Gün ışığı ve gece aydınlatma çekimleri\n📐 Kat planı ve site yerleşim planı`
  };

  return templates[mulkTur] || templates.daire;
};

// Neden Kurumsal kartları
export interface KurumsalKart {
  baslik: string;
  aciklama: string;
  sonuc: string;
}

/**
 * Konum Analizi & Değerleme için tüm şablonları birleştiren wrapper fonksiyon
 */
export const generateMarketAnalysisTemplates = (mulk: any): { baslik: string; icerik: string }[] => {
  return [
    {
      baslik: "Nadir Fırsat", icerik: getNadirFirsatTemplate({
        mulkTur: mulk.tur || 'daire',
        metrekare: mulk.metrekare,
        odaSayisi: mulk.odaSayisi,
        konum: mulk.konum || 'Bölge',
        fiyat: mulk.fiyatMax
      })
    },
    {
      baslik: "Konum Primi", icerik: getKonumPrimiTemplate({
        mulkTur: mulk.tur || 'daire',
        konum: mulk.konum || 'Bölge'
      })
    },
    {
      baslik: "Gelişim Potansiyeli", icerik: getGelisimPotansiyeliTemplate({
        mulkTur: mulk.tur || 'daire',
        konum: mulk.konum || 'Bölge'
      })
    }
  ];
};

/**
 * Hedef Kitle Profili için tüm şablonları birleştiren wrapper fonksiyon
 */
export const generateTargetAudienceTemplates = (mulk: any): { baslik: string; aciklama: string }[] => {
  return getHedefKitleTemplates({
    mulkTur: mulk.tur || 'daire',
    metrekare: mulk.metrekare,
    odaSayisi: mulk.odaSayisi,
    konum: mulk.konum || 'Bölge',
    fiyat: mulk.fiyatMax
  });
};

export const getNedenKurumsalKartlari = (params: {
  mulkTur: string;
  metrekare?: number;
  odaSayisi?: string;
  ofisAdi?: string;
}): KurumsalKart[] => {
  const { mulkTur, metrekare, odaSayisi, ofisAdi } = params;

  return [
    {
      baslik: "Doğru Fiyatlama",
      aciklama: `${metrekare && metrekare > 150 ? `Bu m²'de (${metrekare}m² net) bir ${mulkTur === 'daire' ? 'dairenin' : 'mülkün'} değeri standart m² fiyatlarıyla hesaplanamaz.` : `${mulkTur === 'daire' ? 'Dairenizin' : 'Mülkünüzün'} gerçek değerini belirlemek için profesyonel analiz gereklidir.`} Şerefiye analizi ile gerçek değerini buluyoruz.`,
      sonuc: "Maksimum Kazanç"
    },
    {
      baslik: "Nitelikli Alıcı",
      aciklama: `Sadece fiyat soranları değil, ${metrekare && metrekare > 150 ? 'bu yaşam standartını arayan ve alım gücü olan' : 'gerçekten almaya hazır ve finansal gücü olan'} ${mulkTur === 'daire' || mulkTur === 'villa' ? 'aileleri' : 'alıcıları'} ${mulkTur === 'daire' ? 'evinize' : 'mülkünüze'} getiriyoruz.`,
      sonuc: "Stressiz Satış"
    },
    {
      baslik: "Profesyonel Sunum",
      aciklama: `${odaSayisi || mulkTur === 'daire' ? 'Dairenin' : 'Mülkün'} ferahlığını amatör fotoğraflar gösteremez. Profesyonel çekim ve video ile ${mulkTur === 'daire' ? 'mülkünüz' : 'yatırımınız'} parlar.`,
      sonuc: "Hızlı Sonuç"
    },
    {
      baslik: "Hukuki Güvence",
      aciklama: `Satış sözleşmeleri, kaparo süreçleri ve tapu devri, ${ofisAdi ? `${ofisAdi} hukuk departmanının` : 'kurumsal hukuk departmanımızın'} denetiminde, sıfır risk ile yönetilir.`,
      sonuc: "Tam Güvenlik"
    },
    {
      baslik: ofisAdi && (ofisAdi.toUpperCase().includes('RE/MAX') || ofisAdi.toUpperCase().includes('COLDWELL') || ofisAdi.toUpperCase().includes('CENTURY')) ? "Global Ağ Gücü" : "Geniş Ağ Gücü",
      aciklama: ofisAdi && (ofisAdi.toUpperCase().includes('RE/MAX') || ofisAdi.toUpperCase().includes('COLDWELL') || ofisAdi.toUpperCase().includes('CENTURY'))
        ? `Sadece yerel değil, ${ofisAdi}'in uluslararası ağı sayesinde döviz bazlı yatırım yapan yabancı alıcılara da erişim.`
        : `${ofisAdi ? `${ofisAdi}'in` : 'Kurumsal'} geniş ağı sayesinde yerel ve bölgesel alıcılara hızlı erişim.`,
      sonuc: ofisAdi && (ofisAdi.toUpperCase().includes('RE/MAX') || ofisAdi.toUpperCase().includes('COLDWELL') || ofisAdi.toUpperCase().includes('CENTURY')) ? "Döviz Fırsatı" : "Geniş Erişim"
    }
  ];
};

