'use client';

import { OlusturulanSunum } from '@/types';
import Template1DetailedAnalysis from './Template1DetailedAnalysis';
import Template2QuickSale from './Template2QuickSale';
import Template3Premium from './Template3Premium';
import Template4Trust from './Template4Trust';
import Template5Minimal from './Template5Minimal';
import TemplatePrestige from './TemplatePrestige';
import TemplateMetro from './TemplateMetro';
import TemplateYatirimci from './TemplateYatirimci';
import TemplateSifirArazi from './TemplateSifirArazi';
import TemplateDijitalNative from './TemplateDijitalNative';
import WeeklyReportTemplate from './WeeklyReportTemplate';
import { ZIP_TEMPLATES } from './zipTemplateRegistry';

interface Props {
  data: OlusturulanSunum;
}

export default function TemplateRenderer({ data }: Props) {
  // Haftalık rapor kontrolü
  const sunumTuru = (data.istek as any)?.sunumTuru;
  if (sunumTuru === 'haftalik_rapor') {
    const haftalikRapor = (data.istek as any)?.haftalikRapor;
    if (haftalikRapor) {
      return (
        <WeeklyReportTemplate
          haftalikRapor={haftalikRapor}
          danisman={data.istek.danisman}
          baslik={data.icerik.baslik}
        />
      );
    }
  }

  // Template ID'yi bul
  const templateId = (data.istek as any)?.template || 'detayli_analiz';
  const matchedZip = ZIP_TEMPLATES.find((definition) => definition.matches(data));
  if (matchedZip) {
    return <>{matchedZip.render(data)}</>;
  }

  switch (templateId) {
    case 'detayli_analiz':
      return <Template1DetailedAnalysis data={data} />;
    
    case 'hizli_satis':
      return <Template2QuickSale data={data} />;
    
    case 'premium_sunum':
      return <Template3Premium data={data} />;
    
    case 'guven_odakli':
      return <Template4Trust data={data} />;
    
    case 'minimalist':
      return <Template5Minimal data={data} />;

    case 'prestij':
      return <TemplatePrestige data={data} />;

    case 'metro':
      return <TemplateMetro data={data} />;

    case 'yatirimci':
      return <TemplateYatirimci data={data} />;

    case 'sifir_arazi':
      return <TemplateSifirArazi data={data} />;

    case 'dijital_native':
      return <TemplateDijitalNative data={data} />;

    default:
      return <Template1DetailedAnalysis data={data} />;
  }
}
