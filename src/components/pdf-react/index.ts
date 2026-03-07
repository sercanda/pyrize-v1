export { default as ReactPdfDocument } from './PdfDocument';
export { default as CorporatePdf } from './templates/corporate';
export { default as LuxuryPdf } from './templates/luxury';
export { default as QuickSalePdf } from './templates/quick-sale';
export { default as PrestigePdf } from './templates/prestige';

import React from 'react';
import ReactPdfDocument from './PdfDocument';
import CorporatePdf from './templates/corporate';
import LuxuryPdf from './templates/luxury';
import QuickSalePdf from './templates/quick-sale';
import PrestigePdf from './templates/prestige';

/**
 * Factory: sunumStili + tema -> PDF template component
 */
export function getPdfTemplate(istek: any, icerik: any): React.ReactElement {
  const sunumStili = istek?.sunumStili || 'detayli_analiz';
  const tema = istek?.tema || 'modern';

  // Quick sale -> compact 4-page PDF
  if (sunumStili === 'hizli_satis') {
    return React.createElement(QuickSalePdf, { istek, icerik });
  }

  // Prestige presentation
  if (sunumStili === 'prestij_sunum') {
    return React.createElement(PrestigePdf, { istek, icerik });
  }

  // Theme-based selection for detayli_analiz
  switch (tema) {
    case 'kurumsal':
      return React.createElement(CorporatePdf, { istek, icerik });
    case 'luks':
      return React.createElement(LuxuryPdf, { istek, icerik });
    case 'modern':
    default:
      return React.createElement(ReactPdfDocument, { istek, icerik });
  }
}
