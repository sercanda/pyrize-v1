'use client';

import { OlusturulanSunum } from '@/types';

import TemplateCorporateFromZip from './TemplateCorporateFromZip';
import TemplateModernFromZip from './TemplateModernFromZip';
import TemplateLuxuryFromZip from './TemplateLuxuryFromZip';
import TemplateQuickSaleModernFromZip from './TemplateQuickSaleModernFromZip';
import TemplateQuickSaleLuxuryFromZip from './TemplateQuickSaleLuxuryFromZip';
import TemplateModernDetailedAnalysisWithPhotos from './TemplateModernDetailedAnalysisWithPhotos';
import TemplateModernDetailedAnalysisNoPhotos from './TemplateModernDetailedAnalysisNoPhotos';

export interface ZipTemplateDefinition {
  id: string;
  matches: (data: OlusturulanSunum) => boolean;
  render: (data: OlusturulanSunum) => React.ReactNode;
}

const matchCombination = (
  data: OlusturulanSunum,
  {
    templateId = 'detayli_analiz',
    amac,
    sunumStili,
    tema,
  }: { templateId?: string; amac: string; sunumStili: string; tema: string }
) => {
  const istek: any = data.istek || {};
  return (
    (istek.template || 'detayli_analiz') === templateId &&
    istek.amac === amac &&
    istek.sunumStili === sunumStili &&
    istek.tema === tema
  );
};

// Placeholder component - ZIP yüklendiğinde gerçek component ile değiştirilecek
const PlaceholderTemplate: React.FC<{ data: OlusturulanSunum; combination: string }> = ({ data, combination }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Template Yükleniyor</h1>
        <p className="text-gray-600 mb-2">
          <strong>{combination}</strong> kombinasyonu için template henüz yüklenmedi.
        </p>
        <p className="text-sm text-gray-500">
          Lütfen ilgili ZIP dosyasını <code className="bg-gray-200 px-2 py-1 rounded">src/components/templates</code> klasörüne yükleyin.
        </p>
      </div>
    </div>
  );
};

/**
 * ZIP Template Registry
 * 
 * 18 kombinasyon için template tanımları:
 * - 2 amaç (portfoy_almak, portfoy_satmak)
 * - 3 stil (detayli_analiz, hizli_satis, prestij_sunum)
 * - 3 tema (modern, kurumsal, luks)
 */
export const ZIP_TEMPLATES: ZipTemplateDefinition[] = [
  // ========== PORTFÖY ALMAK - DETAYLI ANALİZ ==========
  {
    id: 'portfoy-almak-detayli-analiz-kurumsal',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'detayli_analiz',
        tema: 'kurumsal',
      }),
    render: (data) => <TemplateCorporateFromZip data={data} />,
  },
  {
    id: 'portfoy-almak-detayli-analiz-modern',
    matches: (data) => {
      const matches = matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'detayli_analiz',
        tema: 'modern',
      });
      if (!matches) return false;
      
      // Fotoğraf kontrolü
      const fotograflar = (data.istek?.mulk as any)?.fotograflar || [];
      const hasPhotos = fotograflar && fotograflar.length > 0;
      
      return hasPhotos; // Fotoğraf varsa bu template
    },
    render: (data) => <TemplateModernDetailedAnalysisWithPhotos data={data} />,
  },
  {
    id: 'portfoy-almak-detayli-analiz-modern-no-photo',
    matches: (data) => {
      const matches = matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'detayli_analiz',
        tema: 'modern',
      });
      if (!matches) return false;
      
      // Fotoğraf kontrolü
      const fotograflar = (data.istek?.mulk as any)?.fotograflar || [];
      const hasPhotos = fotograflar && fotograflar.length > 0;
      
      return !hasPhotos; // Fotoğraf yoksa bu template
    },
    render: (data) => <TemplateModernDetailedAnalysisNoPhotos data={data} />,
  },
  {
    id: 'portfoy-almak-detayli-analiz-luks',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'detayli_analiz',
        tema: 'luks',
      }),
    render: (data) => <TemplateLuxuryFromZip data={data} />,
  },

  // ========== PORTFÖY ALMAK - HIZLI SATIŞ ==========
  {
    id: 'portfoy-almak-hizli-satis-kurumsal',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'hizli_satis',
        tema: 'kurumsal',
      }),
    render: (data) => <TemplateQuickSaleModernFromZip data={data} />, // Geçici olarak modern kullanılıyor
  },
  {
    id: 'portfoy-almak-hizli-satis-modern',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'hizli_satis',
        tema: 'modern',
      }),
    render: (data) => <TemplateQuickSaleModernFromZip data={data} />,
  },
  {
    id: 'portfoy-almak-hizli-satis-luks',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'hizli_satis',
        tema: 'luks',
      }),
    render: (data) => <TemplateQuickSaleLuxuryFromZip data={data} />,
  },

  // ========== PORTFÖY ALMAK - PRESTİJ SUNUM ==========
  {
    id: 'portfoy-almak-prestij-sunum-kurumsal',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'prestij_sunum',
        tema: 'kurumsal',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Almak + Prestij Sunum + Kurumsal" />,
  },
  {
    id: 'portfoy-almak-prestij-sunum-modern',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'prestij_sunum',
        tema: 'modern',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Almak + Prestij Sunum + Modern" />,
  },
  {
    id: 'portfoy-almak-prestij-sunum-luks',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_almak',
        sunumStili: 'prestij_sunum',
        tema: 'luks',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Almak + Prestij Sunum + Lüks" />,
  },

  // ========== PORTFÖY SATMAK - DETAYLI ANALİZ ==========
  {
    id: 'portfoy-satmak-detayli-analiz-kurumsal',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'detayli_analiz',
        tema: 'kurumsal',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Detaylı Analiz + Kurumsal" />,
  },
  {
    id: 'portfoy-satmak-detayli-analiz-modern',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'detayli_analiz',
        tema: 'modern',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Detaylı Analiz + Modern" />,
  },
  {
    id: 'portfoy-satmak-detayli-analiz-luks',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'detayli_analiz',
        tema: 'luks',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Detaylı Analiz + Lüks" />,
  },

  // ========== PORTFÖY SATMAK - HIZLI SATIŞ ==========
  {
    id: 'portfoy-satmak-hizli-satis-kurumsal',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'hizli_satis',
        tema: 'kurumsal',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Hızlı Satış + Kurumsal" />,
  },
  {
    id: 'portfoy-satmak-hizli-satis-modern',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'hizli_satis',
        tema: 'modern',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Hızlı Satış + Modern" />,
  },
  {
    id: 'portfoy-satmak-hizli-satis-luks',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'hizli_satis',
        tema: 'luks',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Hızlı Satış + Lüks" />,
  },

  // ========== PORTFÖY SATMAK - PRESTİJ SUNUM ==========
  {
    id: 'portfoy-satmak-prestij-sunum-kurumsal',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'prestij_sunum',
        tema: 'kurumsal',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Prestij Sunum + Kurumsal" />,
  },
  {
    id: 'portfoy-satmak-prestij-sunum-modern',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'prestij_sunum',
        tema: 'modern',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Prestij Sunum + Modern" />,
  },
  {
    id: 'portfoy-satmak-prestij-sunum-luks',
    matches: (data) =>
      matchCombination(data, {
        amac: 'portfoy_satmak',
        sunumStili: 'prestij_sunum',
        tema: 'luks',
      }),
    render: (data) => <PlaceholderTemplate data={data} combination="Portföy Satmak + Prestij Sunum + Lüks" />,
  },
];

/**
 * Template'i bulur
 */
export function findTemplate(data: OlusturulanSunum): ZipTemplateDefinition | undefined {
  return ZIP_TEMPLATES.find((template) => template.matches(data));
}
