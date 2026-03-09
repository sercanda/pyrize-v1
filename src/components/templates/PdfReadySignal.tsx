'use client';

import { useEffect } from 'react';

export default function PdfReadySignal() {
  useEffect(() => {
    Promise.all([
      document.fonts?.ready || Promise.resolve(),
      new Promise<void>((resolve) => {
        const images = document.querySelectorAll('img');
        if (images.length === 0) return resolve();
        let loaded = 0;
        images.forEach((img) => {
          if (img.complete) {
            loaded++;
            if (loaded === images.length) resolve();
          } else {
            img.onload = img.onerror = () => {
              loaded++;
              if (loaded === images.length) resolve();
            };
          }
        });
      }),
    ]).then(() => {
      (window as any).pdfReady = true;
    });
    setTimeout(() => {
      (window as any).pdfReady = true;
    }, 5000);
  }, []);

  return null;
}
