
import React from 'react';
import { StrategicAdvantage } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

export type BenefitsVariant = 'default' | 'icon-row' | 'list' | 'numbered';

interface BenefitsSectionProps {
  benefits: StrategicAdvantage[];
  theme: ThemeConfig;
  variant?: BenefitsVariant;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits, theme, variant = 'default' }) => {
  switch (variant) {
    case 'icon-row': return <IconRowBenefits benefits={benefits} theme={theme} />;
    case 'list': return <ListBenefits benefits={benefits} theme={theme} />;
    case 'numbered': return <NumberedBenefits benefits={benefits} theme={theme} />;
    default: return <DefaultBenefits benefits={benefits} theme={theme} />;
  }
};

/* ═══════════ DEFAULT — 2-column card grid ═══════════ */
function DefaultBenefits({ benefits, theme }: { benefits: StrategicAdvantage[]; theme: ThemeConfig }) {
  return (
    <section className={`${theme.bgCard} rounded-[3rem] p-12 md:p-20 ${theme.isDark ? 'text-white' : 'text-slate-900'} relative overflow-hidden border ${theme.borderColor} print:bg-transparent print:border-none print:p-0 print:rounded-none`}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none print:hidden"></div>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 print:block">
        <div className="lg:col-span-4 print:mb-8">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${theme.isDark ? 'text-white' : 'text-slate-900'} print:text-black`}>
            Neden <br/> Kurumsal?
          </h2>
          <p className={`${theme.textSecondary} text-lg font-light leading-relaxed print:text-black`}>
            Bireysel çabalar ile kurumsal sistemin yarattığı farkın somut sonuçları.
          </p>
        </div>
        <div className="lg:col-span-8 grid md:grid-cols-2 gap-6 print:grid print:grid-cols-1 print:gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className={`${theme.bgPrimary} backdrop-blur-sm border ${theme.borderColor} p-8 rounded-2xl hover:bg-indigo-900/20 transition-all group print:bg-white print:border-slate-800 print:p-5 print:break-inside-avoid`}>
              <div className={`mb-6 ${theme.textAccent} print:text-indigo-900 print:mb-0`}>
                {React.cloneElement(benefit.icon as React.ReactElement<{ className?: string }>, { className: "w-8 h-8" })}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme.textPrimary} print:text-black`}>{benefit.title}</h3>
              <p className={`${theme.textSecondary} text-sm mb-6 leading-relaxed print:text-black`}>{benefit.description}</p>
              <div className={`inline-block border-l-2 ${theme.borderAccent} pl-3 print:border-indigo-900`}>
                <span className={`block text-xs ${theme.textAccent} font-bold uppercase tracking-wider`}>Sonuç</span>
                <span className={`text-sm font-medium ${theme.isDark ? 'text-white' : 'text-slate-900'} print:text-black`}>{benefit.comparison}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ ICON-ROW — Premium horizontal strips ═══════════ */
function IconRowBenefits({ benefits, theme }: { benefits: StrategicAdvantage[]; theme: ThemeConfig }) {
  return (
    <section className="space-y-3 max-w-4xl mx-auto">
      <div className="text-center mb-4">
        <div className={`h-px w-12 mx-auto mb-3 ${theme.accentBg}`}></div>
        <h2 className={`text-2xl font-light ${theme.isDark ? 'text-white' : 'text-slate-900'} font-serif italic`}>Kurumsal Avantajlar</h2>
      </div>
      {benefits.map((benefit, index) => (
        <div key={index} className={`flex items-center gap-5 p-4 rounded-xl border ${theme.borderColor} ${theme.bgCard} transition hover:${theme.borderAccent}`}>
          <div className={`${theme.textAccent} flex-shrink-0`}>
            {React.cloneElement(benefit.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{benefit.title}</h3>
            <p className={`text-xs ${theme.textSecondary} line-clamp-1`}>{benefit.description}</p>
          </div>
          <div className={`text-right flex-shrink-0 border-l ${theme.borderColor} pl-4`}>
            <span className={`text-xs font-semibold ${theme.textAccent}`}>{benefit.comparison}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ═══════════ LIST — Güven Odaklı checklist ═══════════ */
function ListBenefits({ benefits, theme }: { benefits: StrategicAdvantage[]; theme: ThemeConfig }) {
  return (
    <section>
      <h2 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6`}>Neden Bize Güvenmelisiniz?</h2>
      <div className="space-y-3">
        {benefits.map((benefit, index) => (
          <div key={index} className={`flex items-start gap-4 p-4 rounded-xl border ${theme.borderColor} ${theme.bgCard}`}>
            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${theme.isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <svg className={`w-3.5 h-3.5 ${theme.isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-1`}>{benefit.title}</h3>
              <p className={`text-xs ${theme.textSecondary} leading-relaxed`}>{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════ NUMBERED — Minimalist numbered items ═══════════ */
function NumberedBenefits({ benefits, theme }: { benefits: StrategicAdvantage[]; theme: ThemeConfig }) {
  return (
    <section className="max-w-2xl mx-auto space-y-4">
      {benefits.slice(0, 3).map((benefit, index) => (
        <div key={index} className={`flex items-start gap-4 py-3 border-b ${theme.borderColor}`}>
          <span className={`text-2xl font-light ${theme.textAccent} tabular-nums`}>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className={`text-sm font-semibold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{benefit.title}</h3>
            <p className={`text-xs ${theme.textSecondary} mt-0.5`}>{benefit.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
