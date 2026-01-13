import React from 'react';
import { FAQItem } from '../types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Sıkça Sorulan <span className="text-blue-800">Sorular</span>
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            Aklınızdaki sorulara hızlı yanıtlar.
          </p>
        </div>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-slate-200">
          <div className="space-y-8 divide-y divide-slate-200">
            {faqs.map((faq, index) => (
              <div key={index} className={index > 0 ? 'pt-8' : ''}>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};