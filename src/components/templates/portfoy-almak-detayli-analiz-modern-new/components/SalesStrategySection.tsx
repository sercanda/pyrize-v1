
import React from 'react';
import { SalesSystemStep } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

export type SalesProcessVariant = 'default' | 'compact' | 'timeline' | 'numbered';

interface SalesProcessSectionProps {
    steps: SalesSystemStep[];
    theme: ThemeConfig;
    variant?: SalesProcessVariant;
}

const cleanBenefit = (text?: string): string => {
    if (!text) return '';
    return text
        .replace(/^[\s\n]*[💡💰🛡️⚡️•-]*\s*/i, '')
        .replace(/sizin\s+kazancınız[:\-]?\s*/i, '')
        .replace(/kazancınız[:\-]?\s*/i, '')
        .trim();
};

/** variant="default" — standard card grid (GuvenOdakli) */
const DefaultLayout: React.FC<{ steps: SalesSystemStep[]; theme: ThemeConfig }> = ({ steps, theme }) => (
    <section className="h-full flex flex-col justify-center">
        <div className="text-center mb-16 print:mb-10 max-w-3xl mx-auto">
            <h2 className={`text-4xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-4 print:text-3xl print:text-black`}>Profesyonel Satış Sistemi</h2>
            <p className={`${theme.textSecondary} print:text-black print:font-medium`}>
                Mülkünüzü en yüksek fiyata, en hızlı şekilde satmak için tasarlanmış özel formül.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-2 gap-6 print:gap-8">
            {steps.map((step, index) => (
                <div key={index} className={`${theme.bgCard} border ${theme.borderColor} p-8 print:p-6 rounded-2xl hover:bg-slate-900/80 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden print:bg-white print:border-slate-800 print:shadow-none print:break-inside-avoid print:border-2`}>
                    <div className={`absolute top-4 right-4 text-xs font-bold ${theme.textSecondary} border ${theme.isDark ? 'border-slate-800' : 'border-slate-200'} px-2 py-1 rounded uppercase tracking-wider print:border-slate-600 print:text-black`}>
                        {step.gun}
                    </div>
                    <div className={`mb-6 w-12 h-12 ${theme.bgPrimary} rounded-xl border ${theme.borderColor} flex items-center justify-center ${theme.textAccent} group-hover:scale-110 transition-transform shadow-lg print:bg-white print:border-slate-400 print:text-indigo-900`}>
                        {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                    </div>
                    <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-4 print:text-black`}>{step.baslik}</h3>
                    <div className="space-y-3 mb-6 flex-grow">
                        {step.neYapiyoruz.map((item, i) => (
                            <div key={i} className={`flex items-start gap-2 text-sm ${theme.textSecondary} print:text-black`}>
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme.accentBg} flex-shrink-0 print:bg-indigo-900`}></span>
                                {item}
                            </div>
                        ))}
                    </div>
                    {cleanBenefit(step.kazanciniz) && (
                        <div className={`mt-auto pt-4 border-t ${theme.borderColor} print:border-slate-400`}>
                            <p className={`text-sm ${theme.textPrimary} font-medium print:text-black`}>{cleanBenefit(step.kazanciniz)}</p>
                        </div>
                    )}
                    {step.ucretNotu && (
                        <div className="mt-4 bg-[#DBE64C]/10 border border-[#DBE64C]/20 p-3 rounded-lg print:bg-yellow-50 print:border-yellow-900/30">
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className={`${theme.textSecondary} print:text-black`}>Piyasa Değeri:</span>
                                <span className={`${theme.textSecondary} line-through print:text-slate-800`}>{step.maliyetNotu}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold">
                                <span className={`${theme.isDark ? 'text-[#DBE64C]' : 'text-[#8a8f00]'} print:text-slate-900`}>Sizin İçin:</span>
                                <span className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-sm print:text-black`}>{step.ucretNotu}</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </section>
);

/** variant="numbered" — numbered table rows, dense/corporate (DetayliAnaliz) */
const NumberedLayout: React.FC<{ steps: SalesSystemStep[]; theme: ThemeConfig }> = ({ steps, theme }) => (
    <section className="h-full flex flex-col">
        <h2 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-8 print:text-xl print:text-black`}>
            Satış Sistemi & Süreç Haritası
        </h2>
        <div className={`border ${theme.borderColor} rounded-xl overflow-hidden print:border-slate-300`}>
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={`flex gap-5 p-5 border-b last:border-b-0 ${theme.borderColor} ${index % 2 === 0 ? theme.bgCard : theme.bgPrimary} print:bg-white print:border-slate-200 print:break-inside-avoid`}
                >
                    {/* Step number */}
                    <div
                        className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-black print:border print:border-slate-400"
                        style={{
                            background: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                            color: theme.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                        }}
                    >
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} print:text-black`}>{step.baslik}</h3>
                            {step.gun && (
                                <span className={`text-[10px] uppercase tracking-widest ${theme.textSecondary} print:text-slate-500`}>{step.gun}</span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {step.neYapiyoruz.slice(0, 2).map((item, i) => (
                                <span key={i} className={`text-xs ${theme.textSecondary} print:text-slate-600`}>{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

/** variant="compact" — 3 steps max, horizontal row (HizliSatis) */
const CompactLayout: React.FC<{ steps: SalesSystemStep[]; theme: ThemeConfig }> = ({ steps, theme }) => {
    const displaySteps = steps.slice(0, 3);
    return (
        <section className="h-full flex flex-col">
            <h2 className={`text-xl font-black uppercase tracking-widest ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-8 print:text-lg print:text-black`}>
                Satış Planı
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-6">
                {displaySteps.map((step, index) => (
                    <div
                        key={index}
                        className={`${theme.bgCard} border-2 p-6 rounded-xl print:bg-white print:break-inside-avoid`}
                        style={{ borderColor: index === 0 ? '#dc2626' : theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                    >
                        <div className="text-3xl font-black mb-3 print:text-2xl" style={{ color: '#dc2626' }}>
                            {String(index + 1).padStart(2, '0')}
                        </div>
                        <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-3 print:text-black`}>{step.baslik}</h3>
                        <div className="space-y-1.5">
                            {step.neYapiyoruz.slice(0, 3).map((item, i) => (
                                <p key={i} className={`text-xs ${theme.textSecondary} print:text-slate-700`}>{item}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

/** variant="timeline" — vertical timeline with gold dots (Premium) */
const TimelineLayout: React.FC<{ steps: SalesSystemStep[]; theme: ThemeConfig }> = ({ steps, theme }) => {
    const GOLD = '#d4a84b';
    return (
        <section className="h-full flex flex-col">
            <div className="mb-10 print:mb-6">
                <div className="w-10 h-px mb-3" style={{ background: GOLD }} />
                <h2 className={`text-xl font-semibold ${theme.isDark ? 'text-white' : 'text-slate-900'} print:text-black`}>
                    Satış Süreci
                </h2>
            </div>
            <div className="relative pl-8 space-y-8 print:space-y-6">
                {/* Vertical line */}
                <div
                    className="absolute left-[7px] top-2 bottom-2 w-px print:bg-slate-200"
                    style={{ background: `${GOLD}30` }}
                />
                {steps.map((step, index) => (
                    <div key={index} className="relative print:break-inside-avoid">
                        {/* Dot */}
                        <div
                            className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full border-2 print:border-slate-400"
                            style={{ background: index === 0 ? GOLD : 'transparent', borderColor: GOLD }}
                        />
                        <h3 className={`text-sm font-semibold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-1 print:text-black`}>{step.baslik}</h3>
                        <p className={`text-xs ${theme.textSecondary} leading-relaxed print:text-slate-600`}>
                            {step.neYapiyoruz[0]}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const SalesProcessSection: React.FC<SalesProcessSectionProps> = ({ steps, theme, variant = 'default' }) => {
    if (variant === 'numbered') return <NumberedLayout steps={steps} theme={theme} />;
    if (variant === 'compact') return <CompactLayout steps={steps} theme={theme} />;
    if (variant === 'timeline') return <TimelineLayout steps={steps} theme={theme} />;
    return <DefaultLayout steps={steps} theme={theme} />;
};
