
import React from 'react';
import { Property, Consultant, StrategicAdvantage, SalesSystemStep, ValuationData, FAQItem } from './types';

export const PROPERTY_DATA: Property = {
  gorselUrl: "https://i.ibb.co/qF7JBr92/1014.jpg",
  planBaslik: "Ayçil Tower: Büyükkolpınar'ın Zirvesi",
  planAltBaslik: "215m² Brüt | 43m² Salon | Villa Konforunda Daire",
  konumAnalizi: {
      ilIlce: "Samsun / Atakum",
      mahalle: "Büyükkolpınar Mahallesi",
      ozellik: "Ayçil Tower",
      mevcutYapi: "4+1 Lüks Daire (32 Dairelik Butik Site)"
  },
  marketAnalysis: {
      microLocationValue: "Büyükkolpınar, Atakum'un zemin olarak en sağlam ve havası en temiz bölgelerinden biridir. Ayçil Tower, bölgenin en prestijli yapılarından biri olarak öne çıkıyor.",
      regionalTrend: "Bölgedeki yeni yapılaşmalar site konseptine dönmekte, geniş m²'li ve sosyal donatılı projelere olan talep, standart apartman dairelerine göre %40 daha hızlı artmaktadır.",
      seaProximityPremium: "Proje, şehir gürültüsünden uzak ancak ana arterlere yakın konumuyla 'Huzurlu Lüks' arayanların ilk tercihidir.",
      gardenValueRatio: "30 m²'lik devasa ana balkon (cam balkonlu) ve site içi peyzaj/havuz, müstakil ev konforunu daireye taşımaktadır.",
      marketRisk: "Bu m²'deki (195m² net) daireler doğru pazarlanmazsa, standart 3+1'ler ile kıyaslanıp 'pahalı' algısı oluşabilir. 'Net Kullanım Alanı' ve 'İnşaat Kalitesi' vurgulanmalıdır.",
      buyerBehavior: "Hedef kitle; geniş aileler, beyaz yakalı yöneticiler ve güvenlikli, sosyal donatılı site yaşamı arayan üst gelir grubudur.",
      seasonalEffect: "Okul sezonu öncesi ve yaz döneminde, site içi güvenli oyun alanları ve havuz sebebiyle ailelerin taşınma talebi zirve yapar."
  },
  konumAvantajlari: [
      "43m² Salon, 17m² Mutfak",
      "30m² Cam Balkonlu Ana Balkon",
      "Yerden Isıtma & Koridor Aydınlatma",
      "Havuz, Basketbol Sahası, Kamelya"
  ],
  kullanimPotensiyeli: [
      "Geniş Aile Yaşamı (4+1)",
      "Konfor Odaklı Oturum",
      "Prestijli Yatırım",
      "Yüksek Kira Getirisi"
  ],
  hedefKitle: [
      {
          baslik: "Geniş Aileler",
          aciklama: "Çocukları için güvenli oyun alanı, havuz ve ferah ev arayan, 3+1'e sığmayan aileler."
      },
      {
          baslik: "Konfor Arayanlar",
          aciklama: "Giyinme odası, ebeveyn banyosu, geniş balkon gibi lüks detaylara önem veren profesyoneller."
      },
      {
          baslik: "Yatırımcılar",
          aciklama: "Büyükkolpınar'ın değer artış potansiyelini bilen ve nitelikli mülk yatırımı yapmak isteyenler."
      }
  ],
  tanitimStratejisi: {
      anaMesaj: "Sadece bir daire değil, 195m² net kullanım alanıyla gökyüzünde bir villa.",
      vurgular: [
          "⭐ Her katta sadece 2 daire",
          "🔥 Yerden ısıtma konforu",
          "🏀 Tam donanımlı sosyal alan",
          "security 7/24 Apartman Görevlisi"
      ],
      gorselIcerikPlani: "Geniş salon ve balkonun ferahlığını gösteren 360° çekimler. Havuz ve sosyal alanların drone ile kuşbakışı sunumu. 'Akşam ışıklandırması' ile koridor ve dış cephe estetiği."
  },
  satisPlani: {
      fiyatStratejisi: "Şerefiyesi yüksek, emsallerinden donanımlı olduğu için 'Premium Fiyatlama' stratejisi.",
      hedefSatisSuresi: "30-45 Gün",
      tahminiIlgi: "Nitelikli ailelerden yoğun talep, ortalama 3 ciddi teklif."
  },
  reklamKanallari: ["Sahibinden Vitrin İlan", "Emlakjet Premium Paket", "Facebook & Instagram Reklamları", "Google Ads (Arama + Display)", "YouTube Video Reklamları"]
};

export const SALES_BENEFITS: StrategicAdvantage[] = [
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Doğru Fiyatlama",
        description: "Bu m²'de bir dairenin değeri standart m² fiyatlarıyla hesaplanamaz. Şerefiye analizi ile gerçek değerini buluyoruz.",
        comparison: "Maksimum Kazanç"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Nitelikli Alıcı",
        description: "Sadece fiyat soranları değil, bu yaşam standartını arayan ve alım gücü olan aileleri evinize getiriyoruz.",
        comparison: "Stressiz Satış"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" })),
        title: "Profesyonel Sunum",
        description: "4+1 dairenin ferahlığını amatör fotoğraflar gösteremez. Profesyonel çekim ve video ile mülkünüz parlar.",
        comparison: "Hızlı Sonuç"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Hukuki Güvence",
        description: "Satış sözleşmeleri, kaparo süreçleri ve tapu devri, kurumsal hukuk departmanımızın denetiminde, sıfır risk ile yönetilir.",
        comparison: "Tam Güvenlik"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
        title: "Global Ağ Gücü",
        description: "Sadece Samsun'daki değil, RE/MAX'in uluslararası ağı sayesinde döviz bazlı yatırım yapan yabancı alıcılara da erişim.",
        comparison: "Döviz Fırsatı"
    }
];

export const SALES_SYSTEM_STEPS: SalesSystemStep[] = [
    {
        gun: "Gün 1-2",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" })),
        baslik: "1. Profesyonel Değerleme",
        neYapiyoruz: ["Bölge m² analizi", "Şerefiye hesabı (Kat, Cephe)", "Rakip site analizi"],
        kazanciniz: "Doğru fiyat = Maksimum gelir potansiyeli",
    },
    {
        gun: "Gün 3-5",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" })),
        baslik: "2. Görsel Şölen",
        neYapiyoruz: ["İç mekan geniş açı çekim", "Drone ile havuz/site çekimi", "Tanıtım videosu"],
        kazanciniz: "Sinematik tanıtım = %300 daha fazla ilgi",
        maliyetNotu: "₺5,000",
        ucretNotu: "ÜCRETSİZ"
    },
    {
        gun: "Gün 5-10",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
        baslik: "3. Dijital Pazarlama",
        neYapiyoruz: ["Sosyal medya reklamları", "Portal Premium İlanlar", "Veritabanı mailing"],
        kazanciniz: "15,000+ kişiye doğrudan erişim.",
        maliyetNotu: "₺12,000",
        ucretNotu: "ÜCRETSİZ"
    },
    {
        gun: "Gün 1-30",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
        baslik: "4. RE/MAX Ağı Aktivasyonu",
        neYapiyoruz: ["850+ Ofise duyuru", "Yatırımcı erişimi", "Meslektaş iş birliği"],
        kazanciniz: "Yerel + ulusal alıcılar aynı anda hedeflenir.",
    },
     {
        gun: "Gün 10-45",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" })),
        baslik: "5. Nitelikli Alıcı Filtresi",
        neYapiyoruz: ["Finansal yeterlilik kontrolü", "Ciddiyet testi", "Görüşme planlama"],
        kazanciniz: "Sadece CİDDİ alıcılarla görüşürsünüz. Zaman kaybı = 0",
    },
    {
        gun: "Gün 30-60",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        baslik: "6. Profesyonel Kapanış",
        neYapiyoruz: ["Pazarlık stratejisi", "Sözleşme yönetimi", "Tapu devir güvenliği"],
        kazanciniz: "En yüksek teklif + güvenli ödeme.",
    }
];

export const CONSULTANT_DATA: Consultant = {
  adSoyad: "Dilay Baştekin",
  unvan: "Uzman Gayrimenkul & Yatırım Danışmanı",
  telefon: "0545 421 83 89",
  email: "dilay.bastekin@remax.com.tr",
  profilFotografiUrl: "https://i.ibb.co/0pv1tnZW/Whats-App-G-rsel-2025-11-21-saat-11-53-48-ae14de5f.jpg",
  ofisLogosuUrl: "https://i.ibb.co/5hXwxX2r/e92f870139b241e9820965c4ac5167b3.webp",
  ofisAdi: "RE/MAX Parla",
  oduller: [],
  gucler: []
};

export const VALUATION_DATA: ValuationData = {
    marketSnapshots: [
        { title: "Büyükkolpınar 4+1 Ort.", value: "Fiyat Sorunuz", trend: 'up', trendLabel: "Yüksek Talep" },
        { title: "Ort. Satış Süresi", value: "30-45 Gün", trend: 'stable', trendLabel: "Bölge Ort." },
        { title: "Konfor Primi", value: "+%25", trend: 'up', trendLabel: "Site + M² Farkı" }
    ],
    comparables: [
        { address: "Ayçil Tower Benzer", status: 'Satışta', price: 'Emsal Fiyat', size: '215 m²', pricePerSqm: '---' },
        { address: "Büyükkolpınar 4+1", status: 'Satıldı', price: 'Bölge Ort.', size: '180 m²', pricePerSqm: '---' },
        { address: "Atakum Lüks Site", status: 'Satışta', price: 'Bölge Ort.', size: '200 m²', pricePerSqm: '---' },
        { address: "Standart 3+1 Daire", status: 'Satıldı', price: 'Daha Düşük', size: '140 m²', pricePerSqm: '---' }
    ],
    estimatedValueRange: "Ücretsiz Ekspertiz İle Belirlenir",
    priceStrategyNote: "Dairenizin net 195m² olması, 43m² salonu ve site özellikleri, standart m² fiyatlarının üzerinde, 'Özel Fiyatlama' gerektirir."
};

export const FAQ_DATA: FAQItem[] = [
    {
        question: "Neden 'Tek Yetki' vermeliyim?",
        answer: "Bu kadar özellikli bir dairenin 'her emlakçıda' olması değerini düşürür. Tek yetki ile mülkünüz 'özel koleksiyon' gibi pazarlanır, tüm kontrol bende olur ve maksimum ciddiyet sağlanır."
    },
    {
        question: "Hizmet bedeli neden %2?",
        answer: "4+1 lüks bir daireyi satmak, profesyonel medya üretimi ve doğru hedefleme gerektirir. Biz %2 ile size zaman kazandırıyor, pazarlıkta elinizi güçlendiriyor ve en yüksek fiyata satılmasını sağlıyoruz."
    },
    {
        question: "Dairem neden henüz satılmadı?",
        answer: "Genellikle sebep ya 'yanlış fiyat' ya da 'yetersiz tanıtım'dır. Ayçil Tower gibi projelerde dairenin iç özelliklerini (yerden ısıtma, giyinme odası) doğru anlatmak satışın anahtarıdır."
    },
    {
        question: "Eşyalı mı satmak mantıklı?",
        answer: "Lüks segmentte bazen eşyalı satış avantaj yaratabilir. Sizin durumunuza özel bir analiz yaparak eşyalı/eşyasız fiyat opsiyonlarını belirleyebiliriz."
    },
    {
        question: "Yabancıya satışa uygun mu?",
        answer: "Atakum, yabancı yatırımcıların da radarında. Vatandaşlığa uygunluk durumunu ve ekspertiz değerini analiz ederek döviz bazlı satış fırsatlarını da değerlendiriyoruz."
    }
];
