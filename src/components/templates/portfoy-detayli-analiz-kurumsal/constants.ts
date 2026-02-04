
import React from 'react';
import { Property, Consultant, StrategicAdvantage, SalesSystemStep, ValuationData, FAQItem } from './types';

export const PROPERTY_DATA: Property = {
  gorselUrl: "https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=1973&auto=format&fit=crop",
  planBaslik: "Mülk Analizi ve Pazar Konumlandırması",
  planAltBaslik: "Güzelyalı Mahallesi, 1547 Ada / 8 Parsel | Detaylı Stratejik Rapor",
  konumAnalizi: {
      ilIlce: "Samsun / Atakum",
      mahalle: "Güzelyalı Mahallesi",
      ozellik: "Ana Taşınmaz",
      mevcutYapi: "Arsa üzerinde tek katlı müstakil yapı"
  },
  konumAvantajlari: [
      "Atakum sahiline 130 metre yürüme mesafesi",
      "Ana arterlere ve sosyal donatılara yakınlık",
      "Gelişmekte olan ve değer kazanan bölge",
      "Yüksek yatırım geri dönüşü potansiyeli"
  ],
  kullanimPotensiyeli: [
      "Değer artışı odaklı yatırım",
      "Kentsel dönüşüm potansiyeli",
      "Kısa/uzun dönemli kiralama geliri",
      "Özel konut olarak kullanım"
  ],
  hedefKitle: [
      {
          baslik: "Yatırımcılar",
          aciklama: "Bölgenin değer artış potansiyelini ve kiralama gelirini hedefleyen profesyonel ve bireysel yatırımcılar."
      },
      {
          baslik: "Müteahhit Firmalar",
          aciklama: "Kentsel dönüşüm ve yeni proje geliştirme potansiyeli taşıyan arsalarla ilgilenen yerel ve ulusal inşaat firmaları."
      },
      {
          baslik: "Nihai Kullanıcılar",
          aciklama: "Sahile yakın, merkezi ve prestijli bir lokasyonda yaşamak isteyen aileler ve profesyoneller."
      }
  ],
  tanitimStratejisi: {
      anaMesaj: "Atakum'un en prestijli lokasyonunda, sahile 130m mesafede, yüksek potansiyelli yatırım fırsatı.",
      vurgular: [
          "Nadir Bulunan Lokasyon",
          "Yüksek Değer Artışı Potansiyeli",
          "Gelişime Açık",
          "Prestijli Konum"
      ],
      gorselIcerikPlani: "Profesyonel drone çekimleri ile lokasyon ve sahil mesafesi vurgusu. 3D sanal tur ile mülkün potansiyelinin görselleştirilmesi. Yüksek kaliteli fotoğraf ve video prodüksiyonu."
  },
  satisPlani: {
      fiyatStratejisi: "Karşılaştırmalı piyasa analizi (CMA) verilerine dayalı, rekabetçi ve değer odaklı fiyatlandırma.",
      hedefSatisSuresi: "45-75 gün",
      tahminiIlgi: "İlk 30 gün içerisinde nitelikli yatırımcı ve geliştiricilerden 5-7 arası ciddi teklif alınması hedeflenmektedir."
  },
  reklamKanallari: ["Sahibinden Vitrin İlan", "Emlakjet Premium Paket", "Facebook & Instagram Reklamları", "Google Ads (Arama + Display)", "YouTube Video Reklamları"]
};

export const SALES_BENEFITS: StrategicAdvantage[] = [
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-blue-600" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" })),
        title: "Maksimum Değer Gerçeklemesi",
        description: "Veriye dayalı fiyatlandırma ve profesyonel pazarlama ile mülkünüzün potansiyelini tam olarak realize ediyoruz.",
        comparison: "Piyasa ortalamasının üzerinde teklifler"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-blue-600" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Optimize Edilmiş Satış Süreci",
        description: "Kanıtlanmış sistemimizle, satış sürecini ortalama 45-75 gün aralığında tamamlamayı hedefliyoruz.",
        comparison: "Sektör ortalamasından %40 daha hızlı"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-blue-600" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Tam Kapsamlı Süreç Yönetimi",
        description: "Tüm hukuki, finansal ve operasyonel süreçleri sizin adınıza yöneterek sıfır risk ve minimum efor sağlıyoruz.",
        comparison: "Satış gerçekleşene kadar sıfır maliyet"
    }
];

export const SALES_SYSTEM_STEPS: SalesSystemStep[] = [
    {
        gun: "Aşama 1 (1-3 Gün)",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 6.75V15m6-6v8.25m.5-12v3.75m-16.5 0h16.5m-16.5 0H3.375c1.025 0 1.95.166 2.834.467m10.5 0c.884-.301 1.81-.467 2.834-.467h.825m-3.361 0c.087.015.171.03.254.045m-3.498 0c.087.015.171.03.254.045m-3.498 0a5.625 5.625 0 01-4.132 2.316m3.498 0a5.625 5.625 0 004.132 2.316m3.498 0a5.625 5.625 0 014.132-2.316m0 0a5.625 5.625 0 00-4.132-2.316" })),
        baslik: "1. Kapsamlı Değer Analizi",
        neYapiyoruz: ["Karşılaştırmalı Piyasa Analizi (CMA)", "Bölgesel Gelişim Raporu İncelemesi", "SWOT Analizi", "Fiyat Optimizasyon Stratejisi"],
        kazanciniz: "Mülkünüzün gerçek pazar değerinin tespiti ve maksimum kâr potansiyelinin belirlenmesi.",
    },
    {
        gun: "Aşama 2 (3-7 Gün)",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" })),
        baslik: "2. Profesyonel Medya Üretimi",
        neYapiyoruz: ["4K Drone ve Yer Çekimleri", "Profesyonel Fotoğraf Prodüksiyonu", "3D Sanal Tur ve Kat Planları", "Kurumsal Tanıtım Filmi"],
        kazanciniz: "Alıcıların ilgisini çeken, mülkün değerini öne çıkaran sinematik ve profesyonel sunum.",
        maliyetNotu: "Profesyonel medya prodüksiyon maliyeti: ₺5,000-7,500",
        ucretNotu: "Tarafımızca karşılanmaktadır."
    },
    {
        gun: "Aşama 3 (7-15 Gün)",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
        baslik: "3. Çok Kanallı Pazarlama Stratejisi",
        neYapiyoruz: ["Hedefli Dijital Reklam Kampanyaları (Google, Sosyal Medya)", "Premium Portal İlanları (Sahibinden, Emlakjet vb.)", "Yatırımcı Veritabanına Ulaşım", "Basın ve Medya İlişkileri"],
        kazanciniz: "İlk 2 hafta içerisinde on binlerce potansiyel alıcıya doğrudan ve etkili erişim.",
        maliyetNotu: "Aylık reklam bütçesi: ₺10,000+",
        ucretNotu: "Tarafımızca karşılanmaktadır."
    },
    {
        gun: "Sürekli",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
        baslik: "4. Global ve Yerel Ağ Aktivasyonu",
        neYapiyoruz: ["RE/MAX Türkiye Ağı (850+ ofis)", "RE/MAX Global Ağı (Uluslararası Yatırımcı)", "Kurumsal Müşteri Portföyü", "Diğer Ajanslarla İşbirliği (Paylaşımlı Portföy)"],
        kazanciniz: "Mülkünüzün yerel, ulusal ve uluslararası alıcıların dikkatine sunulması.",
    },
    {
        gun: "Aşama 4 (15-45 Gün)",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 4.5a.75.75 0 01.75-.75h.75c.31 0 .62.032.92.094a6.75 6.75 0 016.868 6.868.92.92 0 01.094.92V15a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-2.252a.38.38 0 00-.31-.364A3.375 3.375 0 016.375 9.375a.38.38 0 00-.364-.31H3.75a.75.75 0 01-.75-.75V4.5z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 13.5a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75V9.752a.38.38 0 00-.31-.364A3.375 3.375 0 0013.875 6.375a.38.38 0 00-.364.31H10.5a.75.75 0 01-.75-.75v-.75a.75.75 0 01.75-.75h3.375c.31 0 .62.032.92.094a6.75 6.75 0 016.868 6.868.92.92 0 01.094.92V13.5z" })),
        baslik: "5. Nitelikli Alıcı Yönetimi ve Raporlama",
        neYapiyoruz: ["Potansiyel alıcıların finansal ve yasal uygunluk kontrolü", "Profesyonel sunum ve müzakere yönetimi", "Haftalık detaylı aktivite raporlaması", "Strateji revizyon toplantıları"],
        kazanciniz: "Sadece ciddi ve alım gücü onaylanmış alıcılarla zaman harcamanız ve süreç hakkında tam şeffaflık.",
    },
    {
        gun: "Aşama 5 (45-75 Gün)",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" })),
        baslik: "6. Hukuki ve Finansal Kapanış",
        neYapiyoruz: ["Tekliflerin analizi ve karşılaştırmalı sunumu", "Sözleşme ve protokol hazırlık süreci danışmanlığı", "Noter ve tapu süreçlerinin koordinasyonu", "Ödeme ve devir işlemlerinin güvenli takibi"],
        kazanciniz: "En iyi teklifin seçilmesi ve tüm kapanış sürecinin hukuki güvence altında, sorunsuz tamamlanması.",
    }
];


export const CONSULTANT_DATA: Consultant = {
  adSoyad: "Ayşe Yılmaz",
  unvan: "Ticari Gayrimenkul ve Arsa Uzmanı",
  telefon: "+90 555 123 45 67",
  email: "ayse.yilmaz@remax.com.tr",
  profilFotografiUrl: "https://i.pravatar.cc/300?u=ayse",
  ofisLogosuUrl: "https://i.ibb.co/5hXwxX2r/e92f870139b241e9820965c4ac5167b3.webp",
  ofisAdi: "RE/MAX Parla",
  oduller: ["Yılın Ticari Gayrimenkul Danışmanı 2023", "Müşteri Memnuniyeti Lideri", "Platinum Club Üyesi 2022"],
  gucler: [
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-blue-600" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m.5-1.5h.5m2.25-3l-3-3m0 0l-3 3m3-3v12.75" })),
      text: "Piyasa Analizi Uzmanlığı"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-blue-600" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.766M11.42 15.17l-4.636 5.562a.606.606 0 01-.852 0l-.94-1.06c-.266-.301-.266-.769 0-1.07l4.636-5.562m0 0l2.496-3.03c.317-.384.74-.664 1.208-.766m0 0l-2.496-3.03c-.317-.384-.74-.664-1.208-.766L3 11.25" })),
      text: "Profesyonel Müzakere Yeteneği"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-blue-600" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" })),
      text: "Hukuki Süreç Yönetimi"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-blue-600" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" })),
      text: "Geniş Yatırımcı Ağı"
    }
  ]
};

export const VALUATION_DATA: ValuationData = {
    marketSnapshots: [
        { title: "Ort. m² Değeri (Bölge)", value: "₺28,500", trend: 'up', trendLabel: "Son 6 Ay" },
        { title: "Ort. Satış Süresi", value: "112 Gün", trend: 'down', trendLabel: "Sektör Ort." },
        { title: "Pazar Eğilimi", value: "Yükselişte", trend: 'stable', trendLabel: "Arz-Talep Dengesi" }
    ],
    comparables: [
        { address: "Güzelyalı Mah. 3015. Sk.", status: 'Satıldı', price: '₺7,850,000', size: '280 m²', pricePerSqm: '₺28,035' },
        { address: "Güzelyalı Mah. 3021. Sk.", status: 'Satıldı', price: '₺8,200,000', size: '295 m²', pricePerSqm: '₺27,796' },
        { address: "Cağaloğlu Blv. Yakını", status: 'Satışta', price: '₺9,100,000', size: '310 m²', pricePerSqm: '₺29,354' },
        { address: "Adnan Menderes Blv. Cepheli", status: 'Satışta', price: '₺9,500,000', size: '305 m²', pricePerSqm: '₺31,147' }
    ],
    estimatedValueRange: "₺8,600,000 - ₺9,250,000"
};

export const FAQ_DATA: FAQItem[] = [
    {
        question: "Neden yetkili danışmanlık (Tek Yetki) ile çalışmalıyım?",
        answer: "Tek yetkili çalışmak, mülkünüzün 'sahipsiz' veya 'herkesin sattığı' algısını ortadan kaldırır. Tüm pazarlama bütçesi (drone çekimi, ilanlar, reklamlar) tarafımızca %100 garanti altına alınır ve yönetilir. Alıcılar tek bir muhatap bulduğu için süreç ciddiyetle ve güvenle yürütülür."
    },
    {
        question: "Belirlenen satış fiyatı garantili midir?",
        answer: "Belirlenen fiyat, güncel piyasa verileri, emsal satışlar ve rekabet analizlerine dayanan 'en doğru pazar değeridir'. Piyasa koşulları dinamik olsa da, bu aralıkta çıkılan mülkler genellikle hedeflenen sürede satılmaktadır."
    },
    {
        question: "Hizmet bedeli oranı nedir ve ne zaman ödenir?",
        answer: "Hizmet bedeli, ilgili yönetmelik gereği satış bedelinin %2 + KDV'si olarak uygulanır. Bu bedel, satış işlemi tapuda resmen tamamlandığında ve bedel hesabınıza geçtiğinde ödenir. Satış gerçekleşmezse hiçbir ücret talep edilmez."
    },
    {
        question: "Süreci nasıl takip edeceğim?",
        answer: "Size her hafta Cuma günü, ilan görüntülenme sayıları, arayan kişi sayısı, alınan teklifler ve yapılan pazarlama aktivitelerini içeren detaylı bir dijital rapor sunulur."
    }
];
