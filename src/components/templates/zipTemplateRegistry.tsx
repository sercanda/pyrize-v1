'use client';

import { OlusturulanSunum } from '@/types';

import TemplateDetayliAnaliz from './unified/TemplateDetayliAnaliz';
import TemplateHizliSatis from './unified/TemplateHizliSatis';
import TemplatePremium from './unified/TemplatePremium';
import TemplateGuvenOdakli from './unified/TemplateGuvenOdakli';
import TemplateMinimalist from './unified/TemplateMinimalist';

export interface ZipTemplateDefinition {
  id: string;
  matches: (data: OlusturulanSunum) => boolean;
  render: (data: OlusturulanSunum) => React.ReactNode;
}

/**
 * sunumStili değerini çıkar (istek objesinden)
 */
function getStyle(data: OlusturulanSunum): string {
  const istek: any = data.istek || {};
  return istek.sunumStili || istek.template || 'detayli_analiz';
}

/**
 * ZIP Template Registry
 *
 * 5 sunum stili — tema ve amaç (almak/satmak) template içinde handle edilir.
 */
export const ZIP_TEMPLATES: ZipTemplateDefinition[] = [
  {
    id: 'detayli-analiz',
    matches: (data) => getStyle(data) === 'detayli_analiz',
    render: (data) => <TemplateDetayliAnaliz data={data} />,
  },
  {
    id: 'hizli-satis',
    matches: (data) => getStyle(data) === 'hizli_satis',
    render: (data) => <TemplateHizliSatis data={data} />,
  },
  {
    id: 'premium-sunum',
    matches: (data) => getStyle(data) === 'premium_sunum',
    render: (data) => <TemplatePremium data={data} />,
  },
  {
    id: 'guven-odakli',
    matches: (data) => getStyle(data) === 'guven_odakli',
    render: (data) => <TemplateGuvenOdakli data={data} />,
  },
  {
    id: 'minimalist',
    matches: (data) => getStyle(data) === 'minimalist',
    render: (data) => <TemplateMinimalist data={data} />,
  },
];

/**
 * Template'i bulur
 */
export function findTemplate(data: OlusturulanSunum): ZipTemplateDefinition | undefined {
  return ZIP_TEMPLATES.find((template) => template.matches(data));
}
