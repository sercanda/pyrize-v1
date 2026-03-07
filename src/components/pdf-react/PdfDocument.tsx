import React from 'react';
import { Document } from '@react-pdf/renderer';
import { colors as defaultColors } from './styles';
import HeroPage from './sections/HeroPage';
import ProblemsPage from './sections/ProblemsPage';
import SolutionsPage from './sections/SolutionsPage';
import AnalysisPage from './sections/AnalysisPage';
import ValuationPage from './sections/ValuationPage';
import ClosingPage from './sections/ClosingPage';

interface PdfDocumentProps {
  istek: any;
  icerik: any;
}

const defaultProblems = [
  { baslik: "Yanlis Fiyatlandirma", icerik: "Cogu mulk sahibi piyasa analizini yanlis yapiyor.", kayip: "Potansiyel gelirden onemli kayip" },
  { baslik: "Yetersiz Tanitim", icerik: "Telefon fotograflari ve temel ilan yeterli degil.", kayip: "10-15 potansiyel alici kaybi" },
  { baslik: "Guvenlik Riski", icerik: "Birebir gorusmeler, dolandiricilik riski, odeme sorunlari.", kayip: "Zaman + Para + Guvenlik" },
  { baslik: "Zaman Kaybi", icerik: "Ortalama bireysel satis suresi: 8-12 ay.", kayip: "Piyasa deger artisindan geri kalma" },
  { baslik: "Pazarlik Gucu Kaybi", icerik: "Profesyonel olmayan sunum = pazarlik masasinda zayflik.", kayip: "%10-20 daha az satis fiyati" },
];

const defaultSolutions = [
  { baslik: "30-60 Gunde Satis", icerik: "Ortalama satis surem: 45 gun", karsilastirma: "Vs. bireysel: 8-12 ay" },
  { baslik: "Dogru Fiyatla Satis", icerik: "Profesyonel pazarlama = daha yuksek teklif", karsilastirma: "Degerinde satis firsati" },
  { baslik: "Sifir Stres & Risk", icerik: "Ben her seyi hallederken, siz arkaniza yaslanin", karsilastirma: "Satis olmazsa tek kurus odemezsiniz" },
];

const defaultGuarantees = [
  { baslik: "Sifir On Odeme", icerik: "Mulkunuzu listelemek icin tek kurus odemezsiniz.", icon: "💸" },
  { baslik: "Guvenilir Hizmet Garantisi", icerik: "Profesyonel ve guvenilir emlak danismanligi hizmeti.", icon: "🔒" },
  { baslik: "7/24 Iletisim", icerik: "Satis surecinde her an bana ulasabilirsiniz.", icon: "📞" },
];

function getMulkTurLabel(tur: string): string {
  switch (tur) {
    case 'arsa': return 'Arsa';
    case 'daire': return 'Daire';
    case 'villa': return 'Villa';
    case 'ticari': return 'Ticari Gayrimenkul';
    case 'ofis': return 'Ofis';
    default: return 'Mulk';
  }
}

export default function ReactPdfDocument({ istek, icerik }: PdfDocumentProps) {
  const { mulk, danisman } = istek;
  const markaRenkleri = istek.markaRenkleri;
  const primaryColor = markaRenkleri?.primary || defaultColors.primary;
  const secondaryColor = markaRenkleri?.secondary || defaultColors.secondary;
  const mulkTurLabel = getMulkTurLabel(mulk.tur);
  const totalPages = 6;

  // Extract sections from icerik
  const bolgeler = icerik.bolgeler || [];
  const findBolge = (tip: string) => bolgeler.find((b: any) => b.tip === tip);

  const problemBolge = findBolge('problemler');
  const cozumBolge = findBolge('cozum');
  const locationBolge = findBolge('location_analysis');
  const targetBolge = findBolge('target_audience');
  const marketingBolge = findBolge('marketing');
  const faqBolge = findBolge('faq');
  const guaranteeBolge = findBolge('guarantee');
  const ctaBolge = findBolge('cta');
  const valuationData = icerik.detayliDegerleme;

  const problems = problemBolge?.altBolge?.slice(0, 5) || defaultProblems;
  const solutions = cozumBolge?.altBolge?.slice(0, 3) || defaultSolutions;
  const guarantees = guaranteeBolge?.altBolge?.slice(0, 3) || defaultGuarantees;

  // Format price range
  let priceRange: string | undefined;
  if (mulk.fiyatAlt && mulk.fiyatUst) {
    priceRange = `${mulk.fiyatAlt.toLocaleString('tr-TR')} - ${mulk.fiyatUst.toLocaleString('tr-TR')} TL`;
  } else if (mulk.fiyat) {
    priceRange = `${mulk.fiyat.toLocaleString('tr-TR')} TL`;
  }

  return (
    <Document>
      <HeroPage
        mulkTurLabel={mulkTurLabel}
        konum={mulk.konum}
        metrekare={mulk.metrekare}
        priceRange={priceRange}
        estimatedValueRange={valuationData?.estimatedValueRange}
        danismanAd={danisman.adSoyad}
        danismanTelefon={danisman.telefon}
        danismanEmail={danisman.email}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        pageNumber={1}
        totalPages={totalPages}
      />

      <ProblemsPage
        mulkTurLabel={mulkTurLabel}
        problems={problems}
        pageNumber={2}
        totalPages={totalPages}
      />

      <SolutionsPage
        solutions={solutions}
        pageNumber={3}
        totalPages={totalPages}
      />

      <AnalysisPage
        mulkTurLabel={mulkTurLabel}
        konum={mulk.konum}
        metrekare={mulk.metrekare}
        priceRange={priceRange}
        locationAdvantages={locationBolge?.altBolge?.slice(0, 4) || []}
        targetPersonas={targetBolge?.altBolge?.slice(0, 3) || []}
        marketingContent={marketingBolge?.icerik}
        marketingChannels={marketingBolge?.altBolge?.slice(0, 6) || []}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        pageNumber={4}
        totalPages={totalPages}
      />

      <ValuationPage
        snapshots={valuationData?.marketSnapshots?.filter((s: any) => s?.title || s?.value).slice(0, 3) || []}
        comparables={valuationData?.comparables?.filter((c: any) => c?.address || c?.price).slice(0, 4) || []}
        estimatedValueRange={valuationData?.estimatedValueRange}
        faqItems={faqBolge?.altBolge?.slice(0, 4) || []}
        pageNumber={5}
        totalPages={totalPages}
      />

      <ClosingPage
        mulkTurLabel={mulkTurLabel}
        konum={mulk.konum}
        danismanAd={danisman.adSoyad}
        danismanTelefon={danisman.telefon}
        danismanEmail={danisman.email}
        ctaBaslik={ctaBolge?.baslik}
        ctaIcerik={ctaBolge?.icerik}
        guarantees={guarantees}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        pageNumber={6}
        totalPages={totalPages}
      />
    </Document>
  );
}
