'use client';

import { OlusturulanSunum } from '@/types';
import { ZIP_TEMPLATES } from './zipTemplateRegistry';
import WeeklyReportTemplate from './WeeklyReportTemplate';

// Legacy template imports (for old presentations that use template ID in switch-case)
import Template1DetailedAnalysis from './Template1DetailedAnalysis';
import TemplatePrestige from './TemplatePrestige';
import TemplateMetro from './TemplateMetro';
import TemplateYatirimci from './TemplateYatirimci';
import TemplateSifirArazi from './TemplateSifirArazi';
import TemplateDijitalNative from './TemplateDijitalNative';

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

  // Unified template registry — sunumStili'ne göre eşleşir
  const matchedZip = ZIP_TEMPLATES.find((definition) => definition.matches(data));
  if (matchedZip) {
    return <>{matchedZip.render(data)}</>;
  }

  // Legacy fallback — eski template ID'leri için (geriye dönük uyumluluk)
  const templateId = (data.istek as any)?.template || 'detayli_analiz';

  switch (templateId) {
    case 'detayli_analiz':
      return <Template1DetailedAnalysis data={data} />;

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
