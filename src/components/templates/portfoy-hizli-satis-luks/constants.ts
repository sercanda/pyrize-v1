import React from 'react';
import { Property, Consultant, SalesBenefit, SalesSystemStep, ConsultantStrength, DigitalMarketingTool, FAQItem } from './types';

export const PROPERTY_DATA: Property = {
    gorselUrl: "https://picsum.photos/1920/1080?random=1",
    planBaslik: "PORTFÖYE ÖZEL AKSİYON PLANI",
    planAltBaslik: "Güzelyalı Mahallesi | Sahile Yakın, Yüksek Potansiyelli Arsa",
    konumAnalizi: {
        ilIlce: "Samsun / Atakum",
        mahalle: "Güzelyalı Mahallesi",
        ozellik: "Ana Taşınmaz",
        mevcutYapi: "Arsa üzerinde tek katlı bina"
    },
    konumAvantajlari: [
        "Sahile sadece 130 metre mesafede",
        "Merkezi ve ulaşımı kolay bir lokasyonda",
        "Gelişen bölge, yüksek değer artışı potansiyeli",
        "Yatırımcılar için kanıtlanmış cazibe merkezi"
    ],
    kullanimPotensiyeli: [
        "Nadir bulunan hazır yapı ve bahçe avantajı",
        "Kısa/uzun dönemli kiralama için yüksek potansiyel",
        "Yatırım amaçlı hızlı değerlenme beklentisi"
    ],
    hedefKitle: [
        {
            baslik: "Nakit Yatırımcılar",
            aciklama: "Bölgenin potansiyelini bilen ve hızlı karar alabilen profesyonel alıcılar."
        },
        {
            baslik: "Fırsat Odaklı Aileler",
            aciklama: "Sahile yakın, tadilat gerektirmeyen, hemen taşınabilecek bir mülk arayanlar."
        }
    ],
    tanitimStratejisi: {
        anaMesaj: "Atakum'un kalbinde, sahile 130m mesafede, nadir bulunan bahçeli ve oturuma hazır ev. Yatırım ve yaşam için kaçırılmayacak fırsat!",
        vurgular: [
            "Stratejik Konum",
            "Yüksek Yatırım Getirisi",
            "Hemen Kullanıma Hazır Olması",
            "Bölgedeki Emsalsizliği"
        ],
        gorselIcerikPlani: "Drone ile sahil bandına ve çevresel özelliklere olan yakınlığı vurgulayan çekimler. Mülkün potansiyelini ve yaşam kalitesini anlatan profesyonel tanıtım filmi."
    },
    satisPlani: {
        fiyatStratejisi: "Piyasa verilerine dayalı, doğru alıcıyı hedefleyen rekabetçi fiyatlandırma.",
        hedefSatisSuresi: "Stratejik Pazarlama",
        tahminiIlgi: "İlk 72 saat içinde hedeflenen yatırımcı kitlesinden nitelikli geri dönüşler alınması."
    },
    reklamKanallari: ["Nitelikli Yatırımcı Veritabanı", "Hedef Kitleli Sosyal Medya Kampanyaları", "Sahibinden & Hepsiemlak 'Doping'", "Emlakjet Premium", "Google Ads (Yatırımcı Odaklı)", "RE/MAX Global Ağı"]
};

export const SALES_BENEFITS: SalesBenefit[] = [
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Stratejik & Hızlı Pazarlama",
        description: "Doğru alıcıya en hızlı şekilde ulaşma",
        comparison: "Vs. bireysel: Aylar süren belirsizlik"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" })),
        title: "Maksimum Fiyat Potansiyeli",
        description: "Veriye dayalı fiyatlama ve profesyonel pazarlık",
        comparison: "Vs. bireysel: Değerinin altında satma riski"
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-10 h-10 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        title: "Zahmetsiz Süreç",
        description: "Tüm operasyonel yükü ben üstleniyorum",
        comparison: "Satış olmazsa tek kuruş ödemezsiniz"
    }
];

export const SALES_SYSTEM_STEPS: SalesSystemStep[] = [
    {
        gun: "Aşama 1",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 17.25V4.125A2.25 2.25 0 016 1.875h12A2.25 2.25 0 0120.25 4.125v13.125m-16.5 0h16.5m-16.5 0l6.22-6.22m0 0l3.001 3.001M12 11.25l-3.001-3.001m0 0l-2.22 2.22" })),
        baslik: "Strateji & Planlama",
        neYapiyorum: ["Detaylı piyasa verisi analizi", "Hedef kitle belirleme ve fiyatlandırma", "Aksiyon odaklı pazarlama planı oluşturma"],
        sizinKazanciniz: "Rastgele değil, veriye dayalı güçlü bir başlangıç",
    },
    {
        gun: "Aşama 2",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" })),
        baslik: "Profesyonel Pazarlama Materyalleri",
        neYapiyorum: ["4K drone & profesyonel fotoğraflar", "Mülkün hikayesini anlatan video sunumu", "Dijital pazarlamaya hazır içerik üretimi"],
        sizinKazanciniz: "Alıcıların ilgisini çeken, mülkün değerini yansıtan profesyonel bir imaj",
        maliyetNotu: "Tüm profesyonel çekim ve prodüksiyon",
        ucretNotu: "Sizin için: TAMAMEN ÜCRETSİZ"
    },
    {
        gun: "Aşama 3",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
        baslik: "Maksimum Erişim Kampanyası",
        neYapiyorum: ["Yatırımcı veritabanına özel sunum", "Hedefli Sosyal Medya & Google reklamları", "Tüm portallarda 'Doping'li ilan yayını"],
        sizinKazanciniz: "Binlerce potansiyel alıcıya anında ve etkili ulaşım",
        maliyetNotu: "Tüm dijital reklam harcamaları",
        ucretNotu: "Sizin için: TAMAMEN ÜCRETSİZ",
    },
    {
        gun: "Aşama 4",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
        baslik: "Nitelikli Alıcı Filtreleme",
        neYapiyorum: ["Gelen talepleri analiz etme ve ön eleme", "Alıcıların finansal yeterliliğini kontrol etme", "Sadece en ciddi alıcılarla mülk gösterimi"],
        sizinKazanciniz: "Zaman kaybı olmadan, sadece sonuç odaklı görüşmeler",
    },
    {
        gun: "Aşama 5",
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" })),
        baslik: "Pazarlık ve Kapanış Yönetimi",
        neYapiyorum: ["Sizin adınıza profesyonel pazarlık yönetimi", "Sözleşme ve tapu süreçlerinin takibi", "Güvenli ve sorunsuz para transferi"],
        sizinKazanciniz: "Maksimum karla, stressiz ve güvenli bir tapu devri",
    }
];

export const CONSULTANT_DATA: Consultant = {
    adSoyad: "Ayşe Yılmaz",
    unvan: "Stratejik Gayrimenkul Danışmanı",
    telefon: "+90 555 123 45 67",
    email: "ayse.yilmaz@realestate.com",
    profilFotografiUrl: "https://picsum.photos/400/400?random=2",
    ofisLogosuUrl: "https://i.ibb.co/5hXwxX2r/e92f870139b241e9820965c4ac5167b3.webp",
    ofisAdi: "RE/MAX Parla",
    oduller: ["Yılın Danışmanı Ödülü 2023", "Müşteri Memnuniyeti Şampiyonu", "Platinum Club 2022"],
    gucler: [
        {
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" })),
            text: "Stratejik Pazarlama"
        },
        {
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" })),
            text: "Yüksek Müşteri Memnuniyeti"
        },
        {
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.768 11 12 11c-.768 0-1.536.21-2.121.621L9 12.42m3 6.363l.008.007a.375.375 0 01-.53 0l-.008-.007z" })),
            text: "Veriye Dayalı Fiyatlama"
        },
        {
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m-4.5-4.5a3 3 0 014.5 0v3m-4.5 0v-3m4.5 0a3 3 0 014.5 0v3m0-3V9m3 3.5a3 3 0 01-6 0v-3a3 3 0 016 0v3z" })),
            text: "Geniş Yatırımcı Ağı"
        }
    ]
};

export const DIGITAL_MARKETING_TOOLS: DigitalMarketingTool[] = [
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-10 h-10 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 21.75l-.648-1.178a3.375 3.375 0 00-2.456-2.456L12 17.25l1.178-.648a3.375 3.375 0 002.456-2.456L16.25 13.5l.648 1.178a3.375 3.375 0 002.456 2.456L20.25 18l-1.178.648a3.375 3.375 0 00-2.456 2.456z" })),
        title: "Hedefli Sosyal Medya",
        description: "Demografik ve konumsal verilerle mülkünüze en uygun alıcı profillerine Facebook ve Instagram üzerinden doğrudan ulaşıyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-10 h-10 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" })),
        title: "Global Ağ Erişimi",
        description: "Mülkünüzü sadece yerel değil, RE/MAX'in global ağı sayesinde yurt dışındaki potansiyel yatırımcılara da sunuyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-10 h-10 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })),
        title: "Premium Portal İlanları",
        description: "Sahibinden, Hepsiemlak gibi portallarda 'Doping' ve 'Anasayfa' gibi özelliklerle ilanınızı on binlerce ilan arasında öne çıkarıyoruz."
    }
];

export const SMART_AD_CAMPAIGNS: DigitalMarketingTool[] = [
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" })),
        title: "Hedefli Arama Reklamları",
        description: "Bölgenizde 'satılık ev', 'yatırımlık arsa' gibi anahtar kelimelerle arama yapan, satın alma potansiyeli en yüksek alıcılara anında ulaşıyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" })),
        title: "Görüntülü Reklam Ağı",
        description: "Profesyonel mülk fotoğraflarınızı ve videolarınızı, emlak ve yatırım konulu web sitelerini ziyaret eden potansiyel alıcıların karşısına çıkarıyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L7.98 12.01m0 0L2.985 6.975m4.996 0l6.044 6.043" })),
        title: "Yeniden Pazarlama (Remarketing)",
        description: "Mülkünüzün ilanını ziyaret eden ancak iletişime geçmeyen kişilere, farklı web sitelerinde ve sosyal medyada mülkünüzü tekrar hatırlatıyoruz."
    },
    {
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor", className: "w-8 h-8 text-amber-400" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" })),
        title: "YouTube Video Reklamları",
        description: "Mülkünüz için hazırlanan profesyonel tanıtım filmini, bölgenizdeki ve hedef kitlemizdeki YouTube kullanıcılarına reklam olarak gösteriyoruz."
    },
];

export const FAQ_DATA: FAQItem[] = [
    {
        question: "Hizmet bedeli oranı nedir ve ne zaman ödenir?",
        answer: "Hizmet bedelimiz, satış işlemi başarıyla tamamlandığında tapu devri sırasında alınır. Eğer mülkünüz satılmazsa, benden herhangi bir ücret talep edilmez. Tüm pazarlama ve tanıtım masrafları bana aittir."
    },
    {
        question: "Pazarlama sürecinde benim onayım gerekiyor mu?",
        answer: "Evet, tüm pazarlama stratejisini ve materyallerini (ilan metinleri, fotoğraflar, videolar) sizinle paylaşıp onayınızı aldıktan sonra yayına başlıyoruz. Süreç boyunca tamamen şeffaf bir iletişim içinde olacağız."
    },
    {
        question: "Mülkümün satışı ne kadar sürer?",
        answer: "Hedefimiz, stratejik pazarlama planımızla ilk 72 saat içinde nitelikli alıcılardan geri dönüş almaktır. Piyasa koşullarına ve mülkünüzün özelliklerine bağlı olarak bu süre değişebilir, ancak amacımız en hızlı ve en verimli şekilde sonuca ulaşmaktır."
    },
    {
        question: "Sözleşme süresi ne kadar? Sözleşmeden erken çıkabilir miyim?",
        answer: "Yetkilendirme sözleşmelerimiz genellikle 3 aylık bir süreyi kapsar. Bu süre, etkili bir pazarlama kampanyası yürütmek ve en iyi sonucu almak için idealdir. Sözleşme detaylarını ve koşullarını yüz yüze görüşmemizde netleştirebiliriz."
    }
];

export const GUARANTEES_DATA: string[] = [
    "Satılmadı mı? 0₺ Ödeme",
    "Profesyonel Pazarlama",
    "7/24 İletişim Desteği"
];