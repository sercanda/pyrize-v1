'use client';

import React, { ReactNode, CSSProperties } from 'react';
import { useInView } from '@/lib/hooks/useInView';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
  breakAfter?: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  className = '',
  id,
  style,
  breakAfter,
}) => {
  // ⬇️ BURASI DÜZELTİLDİ
  const [ref, isInView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id={id}
      ref={ref}
      data-pdf-section="true"
      style={{
        ...style,
        maxWidth: '100%',
        overflowX: 'hidden',
        width: '100%',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        pageBreakAfter: breakAfter ? 'always' : undefined,
        breakAfter: breakAfter ? 'page' : undefined,
      }}
      className={`pdf-page py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-24 transition-opacity duration-1000 pdf-avoid-break ${
        isInView ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      <div
        className="pdf-page__content max-w-7xl mx-auto"
        style={{ maxWidth: '100%', width: '100%' }}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;