import React from 'react';
import { Property, Consultant, SalesBenefit, SalesSystemStep, ConsultantStrength, DigitalMarketingTool, FAQItem, RegionalData } from './types';

export const PROPERTY_DATA: Property = {
  gorselUrl: "https://picsum.photos/1920/1080?random=1",
  planBaslik: "STRATEJİK SATIŞ PLANI",
  planAltBaslik: "Mülkünüze Özel, Veriye Dayalı Yol Haritası",
  konumAnalizi: {
      ilIlce: "Samsun / Atakum",
      mahalle: "Güzelyalı Mahallesi",
      ozellik: "Ana Taşınmaz",
      mevcutYapi: "Arsa üzerinde tek katlı bina"
  },
  konumAvantajlari: [
      "Bölgesel Fiyat Endeksi Analizi",
      "Rakip Portföy Karşılaştırması",
      "Demografik Alıcı Profili Belirleme",
      "Değer Artış Potansiyeli Raporu"
  ],
  kullanimPotensiyeli: [
      "Nakit Yatırımcılar İçin Cazibe",
      "Kısa/Uzun Dönemli Kiralama Potansiyeli",
      "Gelişim Alanlarına Yakınlık"
  ],
  hedefKitle: [
      {
          baslik: "Nakit ve Profesyonel Yatırımcılar",
          aciklama: "Bölgenin potansiyelini bilen, hızlı karar alabilen ve kurumsal muhatap arayan alıcılar."
      },
      {
          baslik: "Değer Odaklı Aileler",
          aciklama: "Doğru fiyata, güvenilir bir süreçle, sorunsuz bir mülk edinmek isteyenler."
      }
  ],
  tanitimStratejisi: {
      anaMesaj: "Atakum'un kalbinde, sahile 130m, kurumsal güvenceyle satışta. Değerini bilen yatırımcılar ve aileler için stratejik fırsat.",
      vurgular: [
          "Stratejik Konum & Yüksek Getiri",
          "Kurumsal ve Şeffaf Süreç",
          "Hızlı Satış Odaklı Fiyatlama",
          "Geniş Yatırımcı Ağına Sunum"
      ],
      gorselIcerikPlani: "Mülkün değerini ve potansiyelini öne çıkaran, kurumsal kimliğe uygun profesyonel fotoğraf ve video prodüksiyonu. Drone ile çevresel avantajların vurgulanması."
  },
  satisPlani: {
      fiyatStratejisi: "Güncel piyasa verileri ve karşılaştırmalı analizlerle belirlenmiş, rekabetçi ve sonuç odaklı fiyatlandırma.",
      hedefSatisSuresi: "21-45 Gün",
      tahminiIlgi: "İlk 72 saat içinde nitelikli yatırımcı veritabanından ve dijital kampanyalardan yoğun geri dönüş alınması."
  },
  reklamKanallari: ["Sahibinden.com & Hepsiemlak (Premium)", "Meta Ads (Facebook & Instagram)", "Google Ads (Arama & Görüntülü Reklam Ağı)", "Kurumsal Yatırımcı Veritabanı", "RE/MAX Türkiye & Global Ağ"]
};

export const SALES_BENEFITS: SalesBenefit[] = [
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" })),
        title: "Maksimum Değer Garantisi",
        description: "Veriye dayalı fiyatlama ve profesyonel pazarlık",
        comparison: "Vs. Bireysel: Değerinin altında satma riski"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Hızlı Nakit Akışı",
        description: "Ortalama 21-45 günde kanıtlanmış satış hızı",
        comparison: "Vs. Bireysel: Aylar süren belirsizlik"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Sıfır Risk & Masraf",
        description: "Tüm pazarlama ve operasyon maliyetleri bize ait",
        comparison: "Satış olmazsa hiçbir ücret ödemezsiniz"
    }
];

export const SALES_SYSTEM_STEPS: SalesSystemStep[] = [
    {
        gun: "Adım 1",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 17.25V4.125A2.25 2.25 0 016 1.875h12A2.25 2.25 0 0120.25 4.125v13.125m-16.5 0h16.5m-16.5 0l6.22-6.22m0 0l3.001 3.001M12 11.25l-3.001-3.001m0 0l-2.22 2.22" })),
        baslik: "Kurumsal Değerleme & Strateji",
        neYapiyorum: ["Detaylı piyasa analizi ve değerleme raporu", "Hedef kitle analizi ve fiyat stratejisi oluşturma", "Hukuki durum tespiti ve satışa hazırlık"],
        sizinKazanciniz: "Rastgele değil, veriye dayalı, güvenli ve güçlü bir başlangıç.",
    },
    {
        gun: "Adım 2",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" })),
        baslik: "Profesyonel Pazarlama Prodüksiyonu",
        neYapiyorum: ["Kurumsal kimliğe uygun fotoğraf ve video çekimleri", "Mülkün değerini anlatan profesyonel sunum dosyası", "Dijital pazarlama için tüm materyallerin hazırlanması"],
        sizinKazanciniz: "Alıcıların güvenini kazanan, mülkün değerini doğru yansıtan kurumsal bir imaj.",
        maliyetNotu: "Tüm profesyonel çekim ve prodüksiyon maliyetleri",
        ucretNotu: "Sizin için: TAMAMEN ÜCRETSİZ"
    },
    {
        gun: "Adım 3",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
        baslik: "Maksimum Erişim Kampanyası",
        neYapiyorum: ["Kurumsal yatırımcı veritabanına özel sunum", "Hedefli Sosyal Medya & Google reklamları", "Tüm portallarda 'Doping'li ve kurumsal ilan yayını"],
        sizinKazanciniz: "Binlerce potansiyel alıcıya anında ve güven veren bir şekilde ulaşım.",
        maliyetNotu: "Tüm dijital reklam ve portal harcamaları",
        ucretNotu: "Sizin için: TAMAMEN ÜCRETSİZ",
    },
    {
        gun: "Adım 4",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        baslik: "Nitelikli Alıcı Filtreleme & Raporlama",
        neYapiyorum: ["Gelen taleplerin finansal ve ciddiyet analizinin yapılması", "Sadece en ciddi ve uygun alıcılarla mülk gösterimi", "Haftalık aktivite ve talep raporu sunumu"],
        sizinKazanciniz: "Zaman kaybı olmadan, şeffaf ve sonuç odaklı görüşmeler.",
    },
    {
        gun: "Adım 5",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" })),
        baslik: "Profesyonel Pazarlık ve Kapanış",
        neYapiyorum: ["Sizin adınıza profesyonel ve stratejik pazarlık yönetimi", "Resmi sözleşme ve tapu süreçlerinin takibi", "Hukuki güvence altında, sorunsuz para transferi"],
        sizinKazanciniz: "Maksimum karla, stressiz ve hukuki güvenceyle tapu devri.",
    }
];

export const CONSULTANT_DATA: Consultant = {
  adSoyad: "RE/MAX Kurumsal Ekibi",
  unvan: "Portföy Yönetimi & Hızlı Satış Departmanı",
  telefon: "+90 532 000 00 00",
  email: "kurumsal@remax.com.tr",
  profilFotografiUrl: "https://picsum.photos/400/400?random=3",
  ofisLogosuUrl: "https://i.ibb.co/5hXwxX2r/e92f870139b241e9820965c4ac5167b3.webp",
  ofisAdi: "RE/MAX Kurumsal",
  oduller: ["Türkiye Ciro Şampiyonu (Kurumsal)", "En Hızlı Satış Ödülü 2023", "Maksimum Müşteri Memnuniyeti"],
  gucler: [
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" })),
      text: "Kurumsal Pazarlama Gücü"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m-4.5-4.5a3 3 0 014.5 0v3m-4.5 0v-3m4.5 0a3 3 0 014.5 0v3m0-3V9m3 3.5a3 3 0 01-6 0v-3a3 3 0 016 0v3z" })),
      text: "Geniş Yatırımcı Ağı"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.768 11 12 11c-.768 0-1.536.21-2.121.621L9 12.42m3 6.363l.008.007a.375.375 0 01-.53 0l-.008-.007z" })),
      text: "Veriye Dayalı Fiyatlama"
    },
    {
      icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className:"w-8 h-8 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" })),
      text: "Hukuki Süreç Yönetimi"
    }
  ]
};

export const DIGITAL_MARKETING_TOOLS: DigitalMarketingTool[] = [
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-10 h-10 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 21.75l-.648-1.178a3.375 3.375 0 00-2.456-2.456L12 17.25l1.178-.648a3.375 3.375 0 002.456-2.456L16.25 13.5l.648 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.648a3.375 3.375 0 00-2.456 2.456z" })),
        title: "Hedefli Sosyal Medya",
        description: "Demografik ve konumsal verilerle mülkünüze en uygun alıcı profillerine Facebook ve Instagram üzerinden doğrudan ulaşıyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-10 h-10 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
        title: "Global Ağ Erişimi",
        description: "Mülkünüzü sadece yerel değil, RE/MAX'in global ağı sayesinde yurt dışındaki potensiyel yatırımcılara da sunuyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-10 h-10 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
        title: "Premium Portal İlanları",
        description: "Sahibinden, Hepsiemlak gibi portallarda 'Doping' ve kurumsal sunumlarla ilanınızı on binlerce ilan arasında öne çıkarıyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-10 h-10 text-indigo-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" })),
        title: "Stratejik Google Reklamları",
        description: "Bölgenizde aktif olarak 'satılık ev', 'yatırımlık arsa' gibi aramalar yapan potansiyel alıcıların karşısına doğrudan çıkıyoruz."
    }
];

export const FAQ_DATA: FAQItem[] = [
    {
        question: "Kurumsal hizmet bedeliniz nedir ve süreç nasıl işler?",
        answer: "Hizmet bedelimiz, yalnızca satış işlemi başarıyla tamamlandığında tapu devri sırasında alınır. Bu bedel, mülkünüz için yapılan tüm pazarlama, prodüksiyon ve reklam yatırımlarını kapsar. Satış olmazsa, bize hiçbir ücret borçlu olmazsınız. Süreç tamamen 'Sıfır Risk' prensibiyle işler."
    },
    {
        question: "Süreç boyunca bilgilendirme ve onay mekanizması nasıl?",
        answer: "Tamamen şeffaf bir iletişim sağlıyoruz. Size özel atanan portföy yöneticiniz, haftalık olarak tüm pazarlama aktiviteleri, gelen talepler ve alıcı geri bildirimleri hakkında detaylı bir rapor sunar. Tüm önemli kararlar (örn. nihai pazarlık) sizin onayınızla alınır."
    },
    {
        question: "Gerçekten ne kadar 'hızlı' satış yapıyorsunuz?",
        answer: "Hedefimiz, doğru fiyatlandırılmış bir mülkü 21 ila 45 gün içinde satmaktır. Kanıtlanmış kurumsal satış sistemimiz, geniş yatırımcı ağımız ve yoğun pazarlama kampanyalarımız bu süreyi mümkün kılmaktadır. Amacımız sadece hızlı değil, aynı zamanda en doğru fiyata satmaktır."
    },
    {
        question: "Neden tek yetkili olarak sizinle çalışmalıyım?",
        answer: "Tek yetkili bir kurumsal firmayla çalışmak, mülkünüze olan yatırımın maksimize edilmesini sağlar. Pazarlama bütçemizin tamamını, hukuki güvenceyi ve ekibimizin tüm odağını sizin mülkünüze yönlendiririz. Bu, piyasada fiyat karmaşasını önler ve alıcı nezdinde mülkün değerini ve güvenilirliğini artırır."
    }
];

export const REGIONAL_DATA: RegionalData = {
    comparisonData: [
      {
        name: 'Genel Bölge Ort.',
        'Bölge Ortalaması': 25000,
        'Sizin Mülkünüz': 32000,
      },
      {
        name: 'Benzer Mülkler',
        'Bölge Ortalaması': 28500,
        'Sizin Mülkünüz': 32000,
      },
    ],
    trendData: [
        { name: '6 Ay Önce', 'Fiyat Endeksi': 100 },
        { name: '5 Ay Önce', 'Fiyat Endeksi': 103 },
        { name: '4 Ay Önce', 'Fiyat Endeksi': 107 },
        { name: '3 Ay Önce', 'Fiyat Endeksi': 110 },
        { name: '2 Ay Önce', 'Fiyat Endeksi': 115 },
        { name: 'Şimdi', 'Fiyat Endeksi': 118 },
    ],
};