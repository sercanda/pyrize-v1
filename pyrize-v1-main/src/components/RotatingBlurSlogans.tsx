"use client";

import { useState, useEffect } from 'react';
import BlurText from './BlurText';

const slogans = [
  "Onay Süresi Kısalır. Toplantı Verimi Artar.",
  "Aynı Günde Daha Fazla Sunum. Aynı Ayda Daha Fazla Portföy.",
  "Sunum Hazırlamak Değil, Portföy Yönetmek İçin Çalış."
];

const displayDurationMs = 15000;

interface RotatingBlurSlogansProps {
  className?: string;
  supportingText?: string;
}

export default function RotatingBlurSlogans({ 
  className = "",
  supportingText = "AI destekli emlak sunum platformu."
}: RotatingBlurSlogansProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slogans.length);
    }, displayDurationMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      <div className="min-h-[120px] md:min-h-[180px] flex items-center">
        <BlurText
          key={activeIndex}
          text={slogans[activeIndex]}
          animateBy="words"
          direction="top"
          delay={160}
          stepDuration={0.55}
          className="text-[28px] md:text-[44px] font-semibold leading-tight tracking-tight text-white"
        />
      </div>
      {supportingText && (
        <p className="mt-4 text-sm md:text-base text-slate-400 opacity-80">
          {supportingText}
        </p>
      )}
    </div>
  );
}

