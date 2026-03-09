import { TemaTuru, SunumStili } from '@/types';

/** Tema tonu tanımları — derinleştirilmiş pazarlama psikolojisi ile */
export const temaTanimlari: Record<TemaTuru, string> = {
  modern:
    'Çağdaş, yenilikçi, dinamik bir dil. Teknolojik avantajlar, dijital süreçler ve hız vurgulanmalı. ' +
    'Jargon yerine anlaşılır inovasyon dili tercih et. "Akıllı", "hızlı", "dijital", "yeni nesil" kelimeleri sık kullan. ' +
    'Okuyucuda "geleceğe yatırım yapıyorum" hissi uyandır.',
  kurumsal:
    'Profesyonel, güvenilir, ciddi bir ton. Rakamsal veriler, analizler, yatırım hesaplamaları vurgulanmalı. ' +
    'Her iddiayı veriyle destekle. "Karşılaştırmalı analiz", "yatırım getirisi", "piyasa verileri" ifadelerini kullan. ' +
    'Okuyucuda "bu kişi işini biliyor, veriye dayanıyor" algısı oluştur.',
  luks:
    'Prestijli, seçkin ve yüksek standartlı bir ton. Özel konum, lüks hizmet deneyimi ve güven algısı ön planda olmalı. ' +
    '"Ayrıcalıklı", "benzersiz", "seçkin", "özel davet", "sınırlı" kelimelerini kullan. ' +
    'Okuyucuda "bu herkes için değil, ben özel bir segmentteyim" hissi uyandır.',
};

/** Sunum stili detayları — pazarlama çerçeveleri ve psikoloji ile zenginleştirilmiş */
export const sunumStiliBilgileri: Record<SunumStili, {
  ad: string;
  aciklama: string;
  odaklar: string[];
  gorevler: string[];
  pazarlamaCercevesi: string;
  psikoloji: string;
}> = {
  detayli_analiz: {
    ad: 'Portföy Almak - Detaylı Analiz',
    aciklama:
      'Satıcıya profesyonel güven vermek için kapsamlı analiz, fiyatlandırma önerileri ve stratejik yol haritası sun. ' +
      'AIDA (Attention-Interest-Desire-Action) çerçevesini uygula: Dikkat çekici piyasa verisiyle başla, ilgiyi karşılaştırmalı analizle pekiştir, ' +
      'istek oluşturmak için ROI projeksiyonları sun, aksiyon için net bir sonraki adım göster. ' +
      'Satıcı okuduktan sonra "Bu kişi piyasayı avucunun içi gibi biliyor" demeli.',
    odaklar: [
      'Konum analizi, fiyat trendleri ve benzer satış karşılaştırmaları — her veriyi kaynak göstererek sun',
      'Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerini ayrıntılı doldur; her bölüm bir "güven katmanı" olmalı',
      'Uzun form anlatım; grafiksel/veri odaklı içerik, güven veren CTA. İstatistiksel ifadeler kullan: "%23 üzerinde", "son 6 ayda X adet satış"',
      'Anchoring etkisi: Önce yüksek bir referans değer ver, ardından gerçekçi aralığı sun — satıcı mülkünün değerini daha iyi kavrasın',
      'Sistematik yaklaşım göster: Adım 1 → Adım 2 → Adım 3 formatında satış yol haritası çiz',
    ],
    gorevler: [
      'Detaylı analiz stilinde her bölümde veri ve mantıklı açıklamalar kullan. Her iddia en az bir rakamsal destekle sunulmalı.',
      'Fiyat tahmini ve satım planı bölümünde min-max aralıkları, tahmini satış süreleri (hafta/ay), fiyat revizyon önerileri ve zaman bazlı strateji mutlaka olsun.',
      'Reklam kanalları bölümünde hem dijital (sahibinden premium, sosyal medya reklamları, Google Ads) hem kurumsal ağları (emlak ofisi networkü, sektörel toplantılar) listele.',
      'AIDA akışını uygula: İlk bölümde dikkat çekici bir piyasa verisi, ortada karşılaştırmalı analiz, ardından satıcıya özel değer önerisi, son bölümde net aksiyon çağrısı.',
      'Authority (otorite) sinyalleri ekle: Danışmanın sektör deneyimi, bölgedeki satış sayısı, ortalama satış süresi gibi metrikler her fırsatta belirt.',
      'Bölge karşılaştırması ve piyasa analizi bölümlerinde emsal verileri tablo formatında, trend yönleriyle birlikte sun.',
    ],
    pazarlamaCercevesi:
      'AIDA (Attention-Interest-Desire-Action) + Veri Otoritesi (Data Authority). ' +
      'Dikkat: Bölgenin güncel piyasa verisiyle aç — "Bu bölgede son 3 ayda m² fiyatları %X arttı." ' +
      'İlgi: Karşılaştırmalı emsal tablosu sun — "Benzer 3 mülkün satış fiyatları ve süreleri." ' +
      'İstek: ROI projeksiyonu ve fiyat optimizasyonu öner — "Doğru fiyatlamayla X hafta içinde satış mümkün." ' +
      'Aksiyon: Net sonraki adım — "Ücretsiz değerleme görüşmesi için bugün arayın." ' +
      'Her aşamada satıcının "bu danışman piyasayı içeriden biliyor" hissetmesini sağla.',
    psikoloji:
      'Analitik ikna ve güven inşası. Satıcılar genellikle "mülküm değerinin altında satılır mı?" korkusu taşır. ' +
      'Bu korkuyu veriye dayalı güvenceyle bertaraf et. Anchoring Bias kullan: Önce bölge ortalamasının üstünde bir değer göster, ' +
      'sonra "gerçekçi piyasa aralığı" sun — satıcı mülkünün değerli olduğunu hisseder. ' +
      'Authority Principle (Cialdini): Danışmanın uzmanlık göstergeleri (satış sayısı, bölge deneyimi, sertifikalar) ' +
      'her bölüme serpiştirilmeli. Cognitive Ease: Karmaşık veriyi basit görseller ve kısa özetlerle sun. ' +
      'Satıcının iç sesi: "Bu kişi piyasayı avucunun içi gibi biliyor, mülküm emin ellerde."',
  },

  hizli_satis: {
    ad: 'Portföy Satmak - Hızlı Satış',
    aciklama:
      'Potansiyel alıcıya hızlı karar aldıracak şekilde net, vurucu ve avantaj odaklı sunum hazırla. ' +
      'FOMO (Fear of Missing Out) + Kayıp Kaçınması (Loss Aversion) + Kıtlık İlkesi (Scarcity Principle) uygula. ' +
      'Her cümle bir aksiyon tetikleyicisi olmalı. Alıcı okuduktan sonra "Hemen hareket etmeliyim, bu fırsatı kaçıramam" demeli.',
    odaklar: [
      'Hero, özellikler ve CTA bölümlerinde güçlü aksiyon çağrıları — her bölüm "şimdi" kelimesiyle bitsin',
      'Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerini madde madde, hızlı okunur formatta sun — her madde max 15 kelime',
      'Fiyat ve avantajlar bölümünde aciliyet / sınırlı fırsat vurgusu: "Bu fiyata son X gün", "Bölgede benzer mülk kalmadı"',
      'Sosyal kanıt hızı: "Son 1 haftada X kişi bu mülkü inceledi", "Y kişi randevu aldı" formatında sayılar kullan',
      'Kayıp çerçeveleme: Avantajları "kazanç" yerine "kaçırma" formatında sun — "Bu fırsatı kaçıranlar 6 ay sonra %Z daha fazla ödeyecek"',
    ],
    gorevler: [
      'Hızlı satış stilinde cümleleri kısa ve etkileyici tut (max 12-15 kelime), her bölümde aksiyon vurgusu olsun.',
      'Reklam kanallarında yoğun dijital erişim ve hızlı geri dönüş metrikleri belirt. "48 saat içinde Y kişiye ulaşım" gibi somut hız vurguları.',
      'Kullanım potansiyeli bölümünü yatırım + yaşam senaryoları ile hızlı okunur formatta yaz — bullet point, kısa paragraf.',
      'MUTLAKA "urgency" tipinde bir bölge üret: Aciliyet mesajı içermeli — "Bu bölgede fiyatlar son 3 ayda %X arttı, beklemenin maliyeti her gün artıyor", "Sınırlı stok", "Son fırsat" gibi FOMO tetikleyicileri.',
      'MUTLAKA "quick_highlights" tipinde bir bölge üret: Mülkün 5-7 vurucu avantajını tek cümlelik maddeler halinde sun — hızlı tarama için optimize.',
      'Countdown (geri sayım) mentalitesi oluştur: "Her geçen gün = kaçan fırsat" algısını her bölüme yerleştir.',
      'Loss Aversion uygula: "Beklemek = para kaybı" mesajını farklı şekillerde 2-3 kez tekrarla.',
    ],
    pazarlamaCercevesi:
      'FOMO (Fear of Missing Out) + Kayıp Kaçınması (Loss Aversion) + Kıtlık İlkesi (Scarcity). ' +
      'Açılış: Dikkat çekici bir aciliyet cümlesi — "Bu bölgede bu fiyata son mülk." ' +
      'Gövde: Her avantajı "kaçırma" çerçevesinde sun — "Havuzlu villa arayanların %80\'i 2 hafta içinde karar veriyor." ' +
      'Sosyal kanıt: Hız göstergeleri — "Bu hafta 12 kişi bu mülkü inceledi." ' +
      'Kapanış: Acil aksiyon — "Bugün arayın, yarın geç olabilir." ' +
      'Kısa, keskin cümleler. Her paragraf max 3 cümle. Okuma süresi 2 dakikayı geçmemeli.',
    psikoloji:
      'FOMO + Kayıp Kaçınması + Kıtlık İlkesi. İnsanlar kazanmaktan çok kaybetmekten korkar (Kahneman & Tversky). ' +
      'Bunu kullan: "Bu mülkü bugün almayan, 6 ay sonra %X daha fazla ödeyecek." ' +
      'Scarcity (Kıtlık): "Bölgede bu özelliklerde sadece 2 mülk kaldı" — sınırlılık algısı karar hızını artırır. ' +
      'Social Proof of Speed: "Geçen hafta benzer mülk 3 günde satıldı" — başkalarının hızlı davrandığını göster. ' +
      'Temporal Discounting: Uzak gelecekteki kazançları somutlaştır — "Bugünkü fiyatla alırsanız yıllık %X değer artışı." ' +
      'Alıcının iç sesi: "Hemen harekete geçmeliyim, bu fırsat bir daha gelmez."',
  },

  premium_sunum: {
    ad: 'Premium Sunum',
    aciklama:
      'Yüksek değerli portföyler için lüks algısı, sosyal kanıt ve elit hizmet yaklaşımını öne çıkar. ' +
      'Yaşam Tarzı Aspirasyonu (Lifestyle Aspiration) + Sosyal Kanıt (Social Proof) + Münhasırlık (Exclusivity) uygula. ' +
      'Kadife ip psikolojisi: "Bu herkes için değil" mesajı vererek statü sinyali oluştur. ' +
      'Okuyucu "Bu tamamen farklı bir seviye, ben bu seviyeye aitim" hissetmeli.',
    odaklar: [
      'Siyah/altın/beyaz kontrastlı lüks ton, seçkin dil — her kelime "özel" hissettirmeli',
      'Simetrik yapı: Hero, danışman profili, portföy görselleri, güven alanı, CTA — görsel mükemmellik',
      'Kullanım potansiyeli, tanıtım stratejisi, tahmini değer & satım planı ve reklam kanalları bölümlerinde premium ton kullan — sıradan kelimeler yasak',
      'Aspirasyonel yaşam tarzı tasviri: Mülkü değil, mülkün sunduğu yaşamı sat — "Sabah kahvenizi Boğaz manzarasına karşı içtiğinizi hayal edin"',
      'Kadife ip (Velvet Rope) stratejisi: Mülke "herkes ulaşamaz" algısı oluştur — "Özel gösterim için randevu" formatı',
    ],
    gorevler: [
      'Premium stilinde her bölümde seçkin müşterilere hitap eden dil kullan. "Satılık daire" değil, "Eşsiz yaşam alanı" de.',
      'Tanıtım stratejisinde davet usulü etkinlikler ve network vurguları olsun: "Özel davet usulü gösterim", "Seçkin alıcı portföyümüz".',
      'Reklam kanallarında lüks portföyler için uygun seçkin mecraları belirt: Lüks yaşam dergileri, özel etkinlikler, VIP emlak ağları, concierge servisleri.',
      'MUTLAKA "lifestyle" tipinde bir bölge üret: Mülkün sunduğu yaşam tarzını duygusal ve görsel bir dille anlat — mevsimler, günün saatleri, sosyal deneyimler üzerinden tasvir et.',
      'MUTLAKA "exclusive_offer" tipinde bir bölge üret: VIP gösterim daveti, sınırlı erişim, özel danışman hattı gibi münhasırlık unsurları içersin.',
      'Status signaling (statü sinyali) kullan: Komşu profili, bölgenin sosyal dokusu, elit yaşam standartları gibi detaylar ekle.',
      'Kelime seçiminde "sıradan" ifadelerden kaçın: "güzel" yerine "zarif", "büyük" yerine "ferah", "iyi" yerine "seçkin" kullan.',
    ],
    pazarlamaCercevesi:
      'Yaşam Tarzı Aspirasyonu (Lifestyle Aspiration) + Sosyal Kanıt (Social Proof) + Münhasırlık (Exclusivity). ' +
      'Açılış: Aspirasyonel bir yaşam tasviri — "Şehrin kalbinde, gökyüzüne en yakın yaşam alanı." ' +
      'Gövde: Mülkü değil deneyimi sat — "Her detayı sizin için tasarlanmış bir yaşam." ' +
      'Sosyal kanıt: Elit referanslar — "Bölgenin en prestijli projelerinden biri, sakinleri arasında iş dünyasının öncüleri." ' +
      'Münhasırlık: Kadife ip — "Özel gösterim için sınırlı randevu." ' +
      'Her kelime statü sinyali versin. Sıradan ifadeler premium algıyı yıkar.',
    psikoloji:
      'Yaşam Tarzı Aspirasyonu + Sosyal Kanıt + Münhasırlık. Maslow Piramidi\'nin en üst katmanı: ' +
      'Kendini gerçekleştirme ve saygınlık ihtiyacı. Premium alıcılar fiyat-performans değil, statü ve deneyim satın alır. ' +
      'Velvet Rope (Kadife İp) Psikolojisi: "Bu herkes için değil" mesajı paradoksal olarak talebi artırır — insanlar ulaşılmaz olana ulaşmak ister. ' +
      'Aspirational Identity: Alıcıya mülk değil, "o mülkte yaşayan kişi olma" hayalini sat. ' +
      'Social Proof of Status: "Bu bölgeyi tercih eden isimler..." ile elit sosyal çevre algısı oluştur. ' +
      'Sensory Marketing: Görsel, koku, ses gibi duyusal detaylarla yaşam tasviri yap — "Teras bahçesinden yükselen lavanta kokusu." ' +
      'Alıcı/satıcının iç sesi: "Bu tamamen farklı bir seviye. Ben bu seviyeye aitim."',
  },

  guven_odakli: {
    ad: 'Güven Odaklı',
    aciklama:
      'Danışman güvenini ve profesyonelliğini ön plana çıkaran, referans ve garanti odaklı sunum. ' +
      'Güven Piramidi (Trust Pyramid) + Risk Tersine Çevirme (Risk Reversal — Cialdini) uygula. ' +
      'Müşterinin tüm endişelerini önceden tespit et ve her birini somut bir güvenceyle karşıla. ' +
      'Satıcı okuduktan sonra "Bu kişiye kesinlikle güvenebilirim" demeli.',
    odaklar: [
      'Danışman profili ve başarı hikayesi erken gösterilmeli — ilk 30 saniyede güven tesis et',
      'Güven unsurları: garanti, referans, deneyim yılı, başarılı satış sayısı, müşteri memnuniyet oranı',
      'FAQ bölümünde müşteri endişelerini giderecek detaylı yanıtlar — her endişe = bir güvence',
      'Risk Reversal: "Memnun kalmazsanız..." türü garantiler, şeffaf süreç taahhüdü',
      'Sosyal kanıt katmanları: Rakamsal başarı → Yazılı referans → Spesifik başarı hikayesi sıralamasıyla güven inşa et',
    ],
    gorevler: [
      'Her bölümde danışmanın uzmanlığına ve güvenilirliğine atıf yap. "X yıldır bölgede", "Y başarılı satış" gibi somut veriler kullan.',
      'FAQ bölümünde müşterinin endişelerini giderecek detaylı yanıtlar ver: Komisyon, süreç, fiyatlama, gizlilik gibi hassas konularda şeffaf ol.',
      'CTA bölümünde kişisel iletişim ve güven vurgusu ön planda olsun: "Sizi dinlemek için buradayım", "İlk görüşme ücretsiz ve bağlayıcı değil".',
      'MUTLAKA "testimonials" tipinde bir bölge üret: En az 2-3 müşteri referansı formatında sosyal kanıt sun — isim, bölge, kısa yorum şeklinde.',
      'MUTLAKA "guarantees" tipinde bir bölge üret: Danışmanın sunduğu somut garantiler — "Haftalık raporlama", "Şeffaf süreç", "Memnuniyet garantisi" gibi risk sıfırlayıcı taahhütler.',
      'Güven Piramidi sırasını takip et: Önce profesyonel yetkinlik → Sonra kişisel bağ → Ardından kanıtlar → Son olarak garantiler.',
      'Zero-risk algısı oluştur: Müşterinin kaybedecek bir şeyi olmadığını hissettir — "Ücretsiz değerleme", "Bağlayıcı olmayan görüşme".',
    ],
    pazarlamaCercevesi:
      'Güven Piramidi (Trust Pyramid) + Risk Tersine Çevirme (Risk Reversal — Cialdini). ' +
      'Katman 1 — Yetkinlik: Danışmanın sektör deneyimi, satış sayısı, bölge uzmanlığı. ' +
      'Katman 2 — Kişisel Bağ: "Sizin yerinize düşünüyorum" empati dili. ' +
      'Katman 3 — Kanıtlar: Gerçek müşteri referansları, başarı hikayeleri, somut rakamlar. ' +
      'Katman 4 — Garantiler: Risk sıfırlama — "Memnun kalmazsanız sözleşmeyi istediğiniz zaman feshedebilirsiniz." ' +
      'Her katman bir öncekini güçlendirir. Güven adım adım inşa edilir, tek seferde değil.',
    psikoloji:
      'Güven Piramidi + Risk Tersine Çevirme (Cialdini\'nin 6 İkna İlkesinden). ' +
      'Satıcıların en büyük korkusu: "Yanlış danışmanla mülküm değerinin altında satılır." ' +
      'Bu korkuyu katmanlı güvenceyle bertaraf et. ' +
      'Risk Reversal: İnsanlar risk algısı sıfıra yaklaştığında karar verme hızı %300 artar. ' +
      '"Ücretsiz değerleme", "İlk ay bağlayıcı değil", "Haftalık şeffaf raporlama" gibi somut garantiler sun. ' +
      'Reciprocity (Karşılıklılık): Önce değer ver (ücretsiz analiz, piyasa raporu) — müşteri karşılık vermek ister. ' +
      'Social Proof (Sosyal Kanıt): "Son 1 yılda 47 mülk satışı gerçekleştirdim" gibi somut rakamlar. ' +
      'Consistency (Tutarlılık): Küçük bir evet aldıktan sonra (ücretsiz görüşme) büyük evet (sözleşme) daha kolay gelir. ' +
      'Satıcının iç sesi: "Bu kişiye kesinlikle güvenebilirim, mülküm emin ellerde."',
  },

  minimalist: {
    ad: 'Minimalist',
    aciklama:
      'Sade, temiz, sadece esansiyel bilgiyi sunan kısa format. ' +
      'Özellik-Fayda Eşleştirme (Feature-Benefit Mapping) + Temiz CTA (Hick Yasası) uygula. ' +
      'Seçenek sayısı arttıkça karar süresi uzar — bu yüzden az ama öz bilgi sun. ' +
      'Okuyucu "Bu net, dürüst ve anlaşılır" hissetmeli.',
    odaklar: [
      'Sadece temel bilgiler: fiyat, konum, özellikler, iletişim — gerisi gürültü',
      'Kısa cümleler (max 10 kelime), net mesajlar, dekoratif öğe yok',
      '3 bölüm yeterli: Hero + özet, avantajlar (max 3 madde), danışman + CTA',
      'Her özellik bir faydayla eşleşmeli: "3+1 = geniş aile yaşamı", "5. kat = kesintisiz manzara"',
      'Tek bir net CTA: "Arayın" veya "Randevu alın" — birden fazla aksiyon sunma (Hick Yasası)',
    ],
    gorevler: [
      'Minimalist stilinde cümleleri çok kısa tut (max 10 kelime), gereksiz detay ekleme. Her kelime bir iş yapmalı.',
      'Her bölümde en fazla 3 madde veya kısa paragraf kullan. 3\'ten fazla madde = karar yorgunluğu.',
      'Sadece en önemli avantajları ve iletişim bilgilerini sun. Gereksiz bölge tipi üretme — kompakt tut.',
      'Feature-Benefit Mapping uygula: Her özelliği bir faydayla eşle. "120 m²" değil, "120 m² — rahat 4 kişilik aile yaşamı" yaz.',
      'Hick Yasasını uygula: Tek bir net aksiyon çağrısı. "Detaylı bilgi ve randevu için arayın" — başka CTA ekleme.',
      'Beyaz alan = güven. Doldurmak zorunda değilsin. Boşluk bırakmak netlik sinyali verir.',
      'Ekstra bölge tipleri (urgency, lifestyle, testimonials, guarantees) ÜRETME — kompakt yapıyı koru.',
    ],
    pazarlamaCercevesi:
      'Özellik-Fayda Eşleştirme (Feature-Benefit Mapping) + Temiz CTA (Hick Yasası). ' +
      'İlke: Netlik güven yaratır, sadelik ikna eder. ' +
      'Her bilgi birimi test edilmeli: "Bu bilgi olmadan karar verilebilir mi?" Evet ise çıkar. ' +
      'Maksimum 3 anahtar nokta: Konum avantajı, fiyat avantajı, yaşam avantajı. ' +
      'Tek CTA: "Arayın" veya "Mesaj atın" — ikisini birden sunma. ' +
      'Okuma süresi 30 saniyeyi geçmemeli. Hızlı taranabilir yapı.',
    psikoloji:
      'Hick Yasası + Bilişsel Akıcılık (Cognitive Fluency) + Karar Yorgunluğu Azaltma. ' +
      'Hick Yasası: Seçenek sayısı arttıkça karar süresi logaritmik olarak uzar. 3 seçenek idealdir. ' +
      'Cognitive Fluency: Kolay okunan ve anlaşılan mesajlar daha güvenilir algılanır. ' +
      'Sadelik = dürüstlük algısı. Karmaşık sunumlar "bir şey gizleniyor" şüphesi uyandırır. ' +
      'Decision Fatigue: Çok bilgi = yorgunluk = karar erteleme. Az bilgi = netlik = hızlı aksiyon. ' +
      'Processing Fluency: Beyaz alan, kısa cümle, net yapı → beyin "bu kolay ve güvenilir" der. ' +
      'Alıcı/satıcının iç sesi: "Bu açık ve dürüst. Tam ihtiyacım olan bilgi var, ne eksik ne fazla."',
  },
};

/**
 * Stil + tema kombinasyonuna göre derinleştirilmiş yazım rehberi döndürür.
 * Pazarlama çerçevesi ve psikoloji bilgileri dahildir.
 */
export function getStyleGuide(stil: SunumStili, tema: TemaTuru): string {
  const stilInfo = sunumStiliBilgileri[stil];
  const temaInfo = temaTanimlari[tema];

  const kombinasyonRehberleri: Record<string, string> = {
    // ── detayli_analiz ──
    'detayli_analiz_modern':
      'Yenilikçi ve veri odaklı analitik sunum. Teknoloji + veri birleşimi. ' +
      '"Dijital pazarlama stratejimizle mülkünüz 72 saat içinde 5.000+ potansiyel alıcıya ulaşacak." ' +
      '"Akıllı fiyatlandırma algoritmamız bölgedeki 150+ satışı analiz ederek optimal fiyat aralığını belirledi." ' +
      'Ton: Güvenilir ama dinamik. Veriyi teknolojik bir çerçevede sun. Dijital araçları öne çıkar.',

    'detayli_analiz_kurumsal':
      'Formal ve analitik kurumsal rapor formatı. Her cümle bir veri noktasına dayanmalı. ' +
      '"Karşılaştırmalı piyasa verilerine göre mülkünüz bölge ortalamasının %12 üzerinde konumlanmaktadır." ' +
      '"2024 Q4 verileri ışığında yatırım getiri oranı yıllık %18-22 bandında öngörülmektedir." ' +
      'Ton: Resmi, ciddi, güven verici. Bankacılık/finans dilini andıran profesyonel ifadeler kullan.',

    'detayli_analiz_luks':
      'Elit ve detaylı, prestijli analiz yaklaşımı. Veriyi lüks bir çerçevede sun. ' +
      '"Seçkin konumuyla bölgenin en prestijli adreslerinden biri olarak değerlendirilen mülkünüz, eşsiz yaşam standartları sunmaktadır." ' +
      '"Exclusive bölge analizi: Benzer segmentteki 5 mülkün ortalama satış süresi 45 gün, talep yoğunluğu yüksek." ' +
      'Ton: Zarif ama analitik. Lüks kelimelerle veriyi birleştir. Her istatistik "özel" bir hikaye anlatsın.',

    // ── hizli_satis ──
    'hizli_satis_modern':
      'Dinamik ve aksiyon odaklı, dijital hız vurgusu. Kısa, keskin, acil. ' +
      '"Bu fırsat kaçmadan harekete geçin! Mülk 48 saat içinde 3.000+ kişiye ulaşacak." ' +
      '"Dijital reklamlarımız zaten yayında — ilk ilgilenen siz olun." ' +
      'Ton: Enerjik, hızlı, teknoloji destekli urgency. Emoji ve ünlem işareti ölçülü kullan.',

    'hizli_satis_kurumsal':
      'Profesyonel ama ikna edici, veriye dayalı aciliyet. Ciddi ton + FOMO. ' +
      '"Piyasa verileri gösteriyor ki bu bölgede fiyatlar son 90 günde %8 arttı. Beklemenin maliyeti net." ' +
      '"Doğru zamanda doğru yatırım — piyasa koşulları bu fiyatı uzun süre korumayacak." ' +
      'Ton: Mantıksal urgency. Duygusal değil, rasyonel FOMO. Rakamlarla ikna et.',

    'hizli_satis_luks':
      'Aciliyet + prestij kombinasyonu. Lüks kıtlık algısı. ' +
      '"Sınırlı sayıda üretilen bu rezidanslardan yalnızca 3 ünite kaldı — özel gösterim için son randevular dolmak üzere." ' +
      '"Ayrıcalıklı erişim penceresi kapanmadan yerinizi ayırtın." ' +
      'Ton: Zarif urgency. Bağırmadan aciliyet yarat. "Sınırlı", "son", "özel" kelimeleri ama lüks tonunda.',

    // ── premium_sunum ──
    'premium_sunum_modern':
      'Modern lüks yaşam vizyonu. Tasarım + teknoloji + yaşam tarzı. ' +
      '"Premium yaşam deneyimi — akıllı ev sistemleri, sürdürülebilir tasarım ve kesintisiz konfor bir arada." ' +
      '"Tasarım ve teknolojinin buluştuğu bu yaşam alanı, geleceğin standartlarını bugünden sunuyor." ' +
      'Ton: İlham verici, vizyoner, aspirasyonel. Yaşam tarzı tasviri ön planda.',

    'premium_sunum_kurumsal':
      'Kurumsal prestij ve yatırım değeri. A sınıfı portföy dili. ' +
      '"A sınıfı yatırım fırsatı — portföyünüzün taç mücevheri olacak bu varlık, uzun vadeli değer artışı vaat ediyor." ' +
      '"Kurumsal yatırımcıların tercihi: Lokasyon, altyapı ve değer artış potansiyeliyle öne çıkan eşsiz bir fırsat." ' +
      'Ton: Ağırbaşlı prestij. Yatırım ve statü dilini birleştir. "Portföy", "varlık", "değer" kelimeleri.',

    'premium_sunum_luks':
      'Ultra lüks, münhasır ve tartışmasız en üst segment. Kelimeler bile "özel" hissettirmeli. ' +
      '"Benzersiz. Ulaşılmaz. Sadece seçkinlere özel. Dünya standartlarında bir yaşam deneyimi." ' +
      '"Bu adres bir konut değil, bir yaşam felsefesi. Davet usulü gösterim için özel randevu alın." ' +
      'Ton: Sessiz lüks (quiet luxury). Bağırmadan etki yarat. Az kelime, derin anlam. Her cümle bir deneyim.',

    // ── guven_odakli ──
    'guven_odakli_modern':
      'Güvenilir ve modern danışman profili. Teknolojik şeffaflık + kişisel bağ. ' +
      '"Yanınızda güçlü bir danışman — dijital araçlarla şeffaf süreç, haftalık online raporlama garantisi." ' +
      '"Sürecin her adımını mobil uygulamadan takip edebilirsiniz. Gizli hiçbir şey yok." ' +
      'Ton: Samimi ama profesyonel. Teknoloji = şeffaflık. Açıklık = güven.',

    'guven_odakli_kurumsal':
      'Kurumsal güven ve kanıtlanmış performans. Rakamlarla güven inşası. ' +
      '"Profesyonel deneyimin gücü — 12 yılda 340+ başarılı satış, %97 müşteri memnuniyet oranı." ' +
      '"Kanıtlanmış başarı geçmişi ve kurumsal referanslarımız, güvenilirliğimizin en somut kanıtıdır." ' +
      'Ton: Resmi güven. Her güvence bir rakamla desteklensin. Kurumsal ciddiyet = güvenilirlik.',

    'guven_odakli_luks':
      'Elit güven ve kişiye özel hizmet taahhüdü. VIP müşteri deneyimi. ' +
      '"Seçkin müşterilerimizin tercihi — kişiye özel hizmet garantisi ve mutlak gizlilik taahhüdü." ' +
      '"Her müşterimiz bir VIP. Özel danışman hattı, 7/24 erişim, %100 gizlilik." ' +
      'Ton: Zarif güven. Gizlilik ve özel hizmet vurgusu. "Sadece size özel" hissi.',

    // ── minimalist ──
    'minimalist_modern':
      'Sade ve modern. Dijital minimalizm. Her kelime bir iş yapıyor. ' +
      '"120 m². 3+1. Kadıköy. Metro 2 dk. 4.200.000 ₺. Arayın." ' +
      'Ton: Ultra kısa, net, çağdaş. Gereksiz sıfat yok. Veri konuşsun.',

    'minimalist_kurumsal':
      'Sade ve profesyonel. Sadece veriler ve sonuçlar. Rapor formatı. ' +
      '"Mülk Özeti: 120 m², 3+1, 5. kat. Bölge ort: 35.000 ₺/m². Fiyat: Piyasa uyumlu. İletişim: 0532 XXX XX XX." ' +
      'Ton: İş odaklı sadelik. Tablo formatı tercih et. Cümle bile gereksizse kullanma.',

    'minimalist_luks':
      'Sade ama zarif. Minimal kelimeyle maksimum etki. Sessiz lüks (quiet luxury). ' +
      '"Bosphorus view. 280 m². Penthouse. Appointment only." (Türkçe versiyonu: "Boğaz manzarası. 280 m². Çatı katı. Randevuyla.") ' +
      'Ton: Az söyle, çok hissettir. Her kelime ağırlığını taşısın. Beyaz alan = lüks.',
  };

  const key = `${stil}_${tema}`;
  const kombinasyonNotu = kombinasyonRehberleri[key] || '';

  return `SUNUM STİLİ: ${stilInfo.ad}
${stilInfo.aciklama}

PAZARLAMA ÇERÇEVESİ:
${stilInfo.pazarlamaCercevesi}

PSİKOLOJİK YAKLAŞIM:
${stilInfo.psikoloji}

TEMA TONU: ${temaInfo}

ODAK NOKTALARI:
${stilInfo.odaklar.map((o) => `- ${o}`).join('\n')}

YAZIM GÖREVLERİ:
${stilInfo.gorevler.map((g) => `- ${g}`).join('\n')}

${kombinasyonNotu ? `KOMBİNASYON REHBERİ: ${kombinasyonNotu}` : ''}`;
}
