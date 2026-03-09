
import React from 'react';
import { FAQItem } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

interface FAQSectionProps {
    faqs: FAQItem[];
    theme: ThemeConfig;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, theme }) => {
    return (
        <section className={`grid grid-cols-1 lg:grid-cols-12 gap-12 border-t ${theme.borderColor} pt-16 pb-16 px-6 md:px-12 lg:px-16 ${theme.bgPrimary} print:pt-8 print:pb-8 print:px-6 print:bg-transparent print:border-none print:gap-8 print:max-w-none print:w-full`}>
            <div className="lg:col-span-4 print:col-span-3">
                <h2 className={`text-3xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} print:text-black`}>Kritik Sorular &<br/> <span className={`${theme.textSecondary} print:text-slate-800`}>Güvenceler</span></h2>
                <p className={`${theme.textSecondary} mt-4 text-sm leading-relaxed print:text-black`}>
                    Mülk sahiplerinin aklındaki en önemli endişeleri şeffaflıkla yanıtlıyoruz.
                </p>
                <div className={`w-12 h-1 ${theme.accentBg} mt-6 shadow-[0_0_10px_rgba(99,102,241,0.5)] print:shadow-none print:bg-indigo-900`}></div>
            </div>

            <div className="lg:col-span-8 space-y-8 print:space-y-6 print:col-span-9">
                {faqs.map((faq, index) => (
                    <div key={index} className={`group ${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor} hover:border-indigo-500/30 transition-all print:bg-white print:border-slate-800 print:p-8 print:border-2`}>
                        <h3 className={`text-lg font-bold ${theme.textPrimary} mb-3 flex items-start gap-3 print:text-black`}>
                            <span className={`${theme.textAccent} text-xl print:text-indigo-900`}>Q.</span>
                            {faq.question}
                        </h3>
                        <p className={`${theme.textSecondary} text-sm leading-relaxed pl-8 border-l-2 ${theme.isDark ? 'border-slate-800' : 'border-slate-200'} group-hover:border-indigo-500/50 transition-colors print:text-black print:border-slate-400`}>
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};
