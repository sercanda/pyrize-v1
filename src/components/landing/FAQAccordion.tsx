'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <div
          key={i}
          className={`rounded-2xl border transition-all overflow-hidden ${
            openIndex === i
              ? 'border-[#DBE64C]/40 bg-[#DBE64C]/5'
              : 'border-[#1E488F]/30 bg-[#1E488F]/10 hover:border-[#1E488F]/50'
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <span className="font-medium text-[#F6F7ED] pr-4">{faq.q}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#DBE64C] shrink-0 transition-transform ${
                openIndex === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === i && (
            <div className="px-6 pb-5">
              <p className="text-[#F6F7ED]/70 leading-relaxed text-sm">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
