
import React from 'react';
import { FAQItem } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

export type FAQVariant = 'default' | 'inline' | 'accordion';

interface FAQSectionProps {
    faqs: FAQItem[];
    theme: ThemeConfig;
    variant?: FAQVariant;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, theme, variant = 'default' }) => {
    switch (variant) {
        case 'inline': return <InlineFAQ faqs={faqs} theme={theme} />;
        case 'accordion': return <AccordionFAQ faqs={faqs} theme={theme} />;
        default: return <DefaultFAQ faqs={faqs} theme={theme} />;
    }
};

/* ═══════════ DEFAULT — Full list with sidebar header ═══════════ */
function DefaultFAQ({ faqs, theme }: { faqs: FAQItem[]; theme: ThemeConfig }) {
    return (
        <section className={`grid grid-cols-1 lg:grid-cols-12 gap-12 border-t ${theme.borderColor} pt-16 pb-16 px-6 md:px-12 lg:px-16 ${theme.bgPrimary} print:pt-8 print:pb-8 print:px-6 print:bg-transparent print:border-none print:gap-8`}>
            <div className="lg:col-span-4">
                <h2 className={`text-3xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} print:text-black`}>Kritik Sorular &<br/> <span className={`${theme.textSecondary}`}>Güvenceler</span></h2>
                <p className={`${theme.textSecondary} mt-4 text-sm leading-relaxed`}>
                    Mülk sahiplerinin aklındaki en önemli endişeleri şeffaflıkla yanıtlıyoruz.
                </p>
                <div className={`w-12 h-1 ${theme.accentBg} mt-6`}></div>
            </div>
            <div className="lg:col-span-8 space-y-8 print:space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className={`group ${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor} print:bg-white print:border-slate-800 print:p-8 print:border-2`}>
                        <h3 className={`text-lg font-bold ${theme.textPrimary} mb-3 flex items-start gap-3 print:text-black`}>
                            <span className={`${theme.textAccent} text-xl`}>Q.</span>
                            {faq.question}
                        </h3>
                        <p className={`${theme.textSecondary} text-sm leading-relaxed pl-8 border-l-2 ${theme.isDark ? 'border-slate-800' : 'border-slate-200'} print:text-black`}>
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ═══════════ INLINE — HizliSatis compact 3-column ═══════════ */
function InlineFAQ({ faqs, theme }: { faqs: FAQItem[]; theme: ThemeConfig }) {
    return (
        <section className="py-6">
            <h2 className={`text-lg font-black ${theme.isDark ? 'text-white' : 'text-slate-900'} uppercase mb-4`}>Sık Sorulanlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {faqs.slice(0, 3).map((faq, index) => (
                    <div key={index} className={`${theme.bgCard} p-4 rounded-xl border ${theme.borderColor}`}>
                        <h3 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-2`}>{faq.question}</h3>
                        <p className={`text-xs ${theme.textSecondary} leading-relaxed line-clamp-3`}>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ═══════════ ACCORDION — Premium elegant ═══════════ */
function AccordionFAQ({ faqs, theme }: { faqs: FAQItem[]; theme: ThemeConfig }) {
    return (
        <section className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-6">
                <div className={`h-px w-12 mx-auto mb-3 ${theme.accentBg}`}></div>
                <h2 className={`text-2xl font-light ${theme.isDark ? 'text-white' : 'text-slate-900'} font-serif italic`}>Sorular & Güvenceler</h2>
            </div>
            <div className="space-y-0">
                {faqs.map((faq, index) => (
                    <div key={index} className={`py-5 border-b ${theme.borderColor}`}>
                        <h3 className={`text-sm font-semibold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-2 flex items-center gap-2`}>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${theme.isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>{index + 1}</span>
                            {faq.question}
                        </h3>
                        <p className={`text-xs ${theme.textSecondary} leading-relaxed ml-7`}>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
