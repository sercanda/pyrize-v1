import React from 'react';
import { Property, ValuationData, StrategicAdvantage, SalesSystemStep, Consultant, FaqItem } from './types';

// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const ChartIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }));
// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const CameraIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" }));
// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const GlobeIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.881 15.394A3.003 3.003 0 0012 18c1.657 0 3-1.343 3-3V8a3 3 0 00-3-3M16.119 15.394A3.003 3.003 0 0112 18c-1.657 0-3-1.343-3-3V8a3 3 0 013-3" }));
// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const BriefcaseIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }));
// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const LightbulbIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }));
// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const ScaleIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" }));
// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const ShieldCheckIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.362.65-1.003.834-1.635l-1.64-1.64m-1.64-1.64A11.933 11.933 0 0112 10.944a11.933 11.933 0 01-2.18 6.364m-1.64-1.64L9 14.364" }));

// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const HomeIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }));
// Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
const TrendingUpIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-yellow-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }));


export const PROPERTY_DATA: Property = {
  address: "İstanbul, Beşiktaş, Lüks Rezidans Dairesi",
  price: 25000000,
  sqm: 180,
  type: "Rezidans Dairesi",
  locationHighlights: [
    {
      // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
      icon: React.createElement(BriefcaseIcon),
      category: "İş ve Finans Merkezleri",
      points: ["Levent & Maslak'a 10 dakika", "Zorlu Center'a yürüme mesafesi", "Ana ulaşım arterlerine kolay erişim"]
    },
    {
      // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
      icon: React.createElement(LightbulbIcon),
      category: "Sosyal ve Kültürel Yaşam",
      points: ["Akmerkez, Kanyon AVM'lere yakın", "Popüler restoran ve kafelere komşu", "Sanat galerileri ve konser alanlarına yakın"]
    }
  ],
  potential: [
    {
      title: "Prestijli Yaşam Alanı",
      description: "Şehrin kalbinde, modern mimarisi ve sunduğu birinci sınıf sosyal olanaklarla size ve ailenize seçkin bir yaşam vaat ediyor.",
      // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
      icon: React.createElement(HomeIcon)
    },
    {
      title: "Yüksek Getirili Yatırım",
      description: "Bölgedeki sürekli değer artışı, yüksek kira potansiyeli ve döviz bazlı getiri imkanı ile yatırımınız için akıllı ve güvenilir bir seçimdir.",
      // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
      icon: React.createElement(TrendingUpIcon)
    }
  ],
  marketingPlan: {
    promotionStrategy: "Elit ve niş bir kitleye yönelik, dijital ve geleneksel kanalları birleştiren prestij odaklı bir tanıtım yapılacaktır.",
    targetAudience: "Üst düzey yöneticiler, yatırımcılar, yabancı profesyoneller ve şehrin merkezinde prestijli bir yaşam arayan aileler.",
    channels: [
      "Sahibinden Vitrin",
      "Emlakjet Premium",
      "Facebook/Instagram",
      "Google Ads",
      "YouTube Reklamları"
    ]
  }
};

export const VALUATION_DATA: ValuationData = {
  averagePricePerSqm: 130000,
  priceTrend: 15,
  rentalYield: 4.5,
  regionalCompetitors: [
    { address: "Rakip 1, Beşiktaş", price: 23500000, sqm: 175, url: "#" },
    { address: "Rakip 2, Şişli", price: 26000000, sqm: 190, url: "#" },
    { address: "Rakip 3, Beşiktaş", price: 24500000, sqm: 185, url: "#" },
  ]
};

export const SALES_BENEFITS: StrategicAdvantage[] = [
  {
    // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
    icon: React.createElement(ChartIcon),
    title: "Veri Odaklı Fiyatlandırma",
    description: "En güncel piyasa verileri ve rakip analizleriyle mülkünüzün değerini doğru ve rekabetçi bir şekilde belirliyoruz.",
    comparison: "Geleneksel yöntemlere göre %10 daha hızlı satış."
  },
  {
    // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
    icon: React.createElement(CameraIcon),
    title: "Profesyonel Pazarlama",
    description: "Yüksek kaliteli fotoğraf ve video çekimleri, sanal turlar ve hedefli dijital reklamlarla mülkünüzü en iyi şekilde sunuyoruz.",
    comparison: "Potansiyel alıcı erişiminde 3 kat artış."
  },
  {
    // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
    icon: React.createElement(GlobeIcon),
    title: "Geniş Alıcı Ağı",
    description: "Hem yerel hem de uluslararası alıcı veri tabanımız ve güçlü network'ümüz ile mülkünüzü doğru kitleye ulaştırıyoruz.",
    comparison: "Nitelikli alıcılarla daha hızlı buluşma."
  }
];

export const SALES_SYSTEM_STEPS: SalesSystemStep[] = [
    {
        gun: "1-7. Günler",
        baslik: "Stratejik Hazırlık ve Pazar Analizi",
        neYapiyoruz: [
            "Detaylı mülk analizi ve değerleme.",
            "Profesyonel fotoğraf ve video çekimi.",
            "Pazarlama materyallerinin hazırlanması."
        ],
        kazanciniz: "Mülkünüzün pazara en güçlü şekilde çıkmasını sağlayarak ilk izlenimde fark yaratıyoruz.",
        // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
        icon: React.createElement('span', { className: "text-xl" }, "1")
    },
    {
        gun: "8-21. Günler",
        baslik: "Maksimum Erişim ve Tanıtım",
        neYapiyoruz: [
            "Tüm büyük emlak portallarında listeleme.",
            "Sosyal medya ve dijital reklam kampanyaları.",
            "Hedefli alıcı veritabanına özel sunum."
        ],
        kazanciniz: "Mülkünüzün potansiyel alıcılar tarafından en yüksek görünürlüğe ulaşmasını sağlıyoruz.",
        // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
        icon: React.createElement('span', { className: "text-xl" }, "2")
    },
    {
        gun: "22-30. Günler",
        baslik: "Müzakere ve Teklif Yönetimi",
        neYapiyoruz: [
            "Gelen tekliflerin filtrelenmesi ve analizi.",
            "Sizin adınıza profesyonel müzakerelerin yürütülmesi.",
            "En iyi teklifi almanızı sağlayacak stratejiler."
        ],
        kazanciniz: "Müzakere sürecindeki uzmanlığımızla mülkünüzden maksimum kazancı elde etmenizi sağlıyoruz.",
        // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
        icon: React.createElement('span', { className: "text-xl" }, "3")
    },
     {
        gun: "30. Gün ve Sonrası",
        baslik: "Kapanış ve Sonuçlandırma",
        neYapiyoruz: [
            "Satış sözleşmesinin hazırlanması ve kontrolü.",
            "Tapu işlemleri sürecinde tam destek.",
            "Sorunsuz bir devir teslim süreci."
        ],
        kazanciniz: "Sürecin son aşamasında hukuki ve idari işlemleri sizin için yöneterek stresi ortadan kaldırıyoruz.",
        // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
        icon: React.createElement('span', { className: "text-xl" }, "4")
    }
];

export const CONSULTANT_DATA: Consultant = {
  adSoyad: "Ahmet Yılmaz",
  unvan: "Lüks Konut Uzmanı",
  profilFotografiUrl: "https://via.placeholder.com/160",
  ofisAdi: "Premium Gayrimenkul",
  ofisLogosuUrl: "https://via.placeholder.com/150x50?text=Premium",
  gucler: [
    // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
    { icon: React.createElement(BriefcaseIcon), text: "15+ Yıl Sektör Tecrübesi" },
    // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
    { icon: React.createElement(ScaleIcon), text: "Stratejik Müzakere Becerisi" },
    // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
    { icon: React.createElement(LightbulbIcon), text: "Yaratıcı Pazarlama Çözümleri" },
    // Fix: Rewrote JSX to React.createElement because .ts files do not support JSX syntax.
    { icon: React.createElement(ShieldCheckIcon), text: "Hukuki Süreçlere Hakimiyet" }
  ],
  oduller: ["Yılın Danışmanı 2023", "En Yüksek Ciro Ödülü", "Müşteri Memnuniyeti Lideri"],
  telefon: "+90 555 123 45 67",
  email: "ahmet.yilmaz@premium.com"
};

export const FAQ_DATA: FaqItem[] = [
  {
    question: "Hizmet bedeli oranınız nedir?",
    answer: "Hizmet bedelimiz, satış işlemi başarıyla sonuçlandığında, satış bedeli üzerinden yasal olarak belirlenen orandır. Bu bedel, sunduğumuz kapsamlı pazarlama, hukuki danışmanlık ve sonuç odaklı profesyonel hizmetin karşılığıdır."
  },
    {
    question: "Mülk satılmazsa ne olur?",
    answer: "Belirlenen yetkilendirme süresi içinde hedefe ulaşamazsak, herhangi bir ücret talep etmiyoruz. Stratejimizi birlikte gözden geçirir, yeni bir yol haritası belirler veya iş birliğimizi karşılıklı anlaşarak sonlandırabiliriz. Önceliğimiz sizin memnuniyetinizdir."
  },
  {
    question: "Neden sizinle çalışayım, başka danışman değil?",
    answer: "Biz sadece bir mülk satmıyoruz; size özel bir deneyim, stratejik bir ortaklık ve kanıtlanmış sonuçlar sunuyoruz. Veri odaklı yaklaşımımız, geniş alıcı ağımız ve mülkünüze özel hazırladığımız proaktif pazarlama tekniklerimizle fark yaratıyoruz."
  },
  {
    question: "Drone ve video çekimi gerçekten ücretsiz mi?",
    answer: "Evet. Pazarlama planımızın bir parçası olarak sunduğumuz profesyonel fotoğraf, video ve drone çekimleri için sizden hiçbir ek ücret talep etmiyoruz. Bu, mülkünüzü en iyi şekilde sunma taahhüdümüzün bir parçasıdır."
  },
  {
    question: "Ne kadar sürede satarsınız?",
    answer: "Piyasa koşulları ve mülkün özelliklerine göre süre değişmekle birlikte, 4 aşamalı satış sistemimiz ve proaktif pazarlama stratejilerimizle sürecin ortalama 30-60 gün içinde sonuçlanmasını hedefliyoruz."
  },
   {
    question: "Danışmanlık hizmet bedeli ne zaman alınır?",
    answer: "Hizmet bedeli, yalnızca satış işlemi başarıyla sonuçlandığında, tapu devri sırasında alınır. Süreç boyunca yaptığımız hiçbir çalışma için ön ödeme veya ek ücret talep edilmez. Başarı odaklı çalışırız."
  }
];