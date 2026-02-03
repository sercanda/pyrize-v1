
import React from 'react';
import { FAQItem } from '../types';

interface FAQSectionProps {
    faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/5 pt-16 pb-16 px-6 md:px-12 lg:px-16 bg-slate-950/50 print:pt-8 print:pb-8 print:px-6 print:bg-transparent print:border-none print:gap-8 print:max-w-none print:w-full">
            <div className="lg:col-span-4 print:col-span-3">
                <h2 className="text-3xl font-bold text-white print:text-black">Kritik Sorular &<br/> <span className="text-slate-500 print:text-slate-800">Güvenceler</span></h2>
                <p className="text-slate-400 mt-4 text-sm leading-relaxed print:text-black">
                    Mülk sahiplerinin aklındaki en önemli endişeleri şeffaflıkla yanıtlıyoruz.
                </p>
                <div className="w-12 h-1 bg-indigo-500 mt-6 shadow-[0_0_10px_rgba(99,102,241,0.5)] print:shadow-none print:bg-indigo-900"></div>
            </div>
            
            <div className="lg:col-span-8 space-y-8 print:space-y-6 print:col-span-9">
                {faqs.map((faq, index) => (
                    <div key={index} className="group bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all print:bg-white print:border-slate-800 print:p-8 print:border-2">
                        <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-start gap-3 print:text-black">
                            <span className="text-indigo-500 text-xl print:text-indigo-900">Q.</span>
                            {faq.question}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed pl-8 border-l-2 border-slate-800 group-hover:border-indigo-500/50 transition-colors print:text-black print:border-slate-400">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
