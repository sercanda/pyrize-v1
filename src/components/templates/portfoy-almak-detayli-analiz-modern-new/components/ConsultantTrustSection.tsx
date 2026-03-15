
import React from 'react';
import { Consultant } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

export type ConsultantVariant = 'default' | 'card' | 'hero' | 'minimal';

interface ConsultantTrustSectionProps {
  consultant: Consultant;
  theme: ThemeConfig;
  variant?: ConsultantVariant;
}

const normalizeAwards = (value: Consultant['oduller']): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v) => !!v && v.trim().length > 0);
  return value
    .split(/\r?\n/)
    .map((item) => item.replace(/^[•\-–—→✅\u2022\s]+/, '').trim())
    .filter(Boolean);
};

export const ConsultantTrustSection: React.FC<ConsultantTrustSectionProps> = ({ consultant, theme, variant = 'default' }) => {
  switch (variant) {
    case 'card': return <CardConsultant consultant={consultant} theme={theme} />;
    case 'hero': return <HeroConsultant consultant={consultant} theme={theme} />;
    case 'minimal': return <MinimalConsultant consultant={consultant} theme={theme} />;
    default: return <DefaultConsultant consultant={consultant} theme={theme} />;
  }
};

/* ═══════════ DEFAULT — Full profile layout ═══════════ */
function DefaultConsultant({ consultant, theme }: { consultant: Consultant; theme: ThemeConfig }) {
  const awards = normalizeAwards(consultant.oduller);
  return (
    <section className="max-w-4xl mx-auto print:w-full">
      <div className={`border-t-4 ${theme.isDark ? 'border-slate-800' : 'border-slate-200'} pt-12 print:border-slate-400`}>
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start print:gap-8">
          <div className="w-full md:w-1/3 print:w-1/4">
            <div className={`aspect-[3/4] relative rounded-sm overflow-hidden ${theme.isDark ? 'bg-slate-800' : 'bg-slate-200'} ring-1 ${theme.borderColor}`}>
              <img src={consultant.profilFotografiUrl} alt={consultant.adSoyad} className="w-full h-full object-cover" />
            </div>
            <div className="mt-6">
              <span className={`text-xs font-bold border ${theme.isDark ? 'border-slate-700' : 'border-slate-300'} px-2 py-1 rounded uppercase ${theme.textSecondary}`}>Lisanslı</span>
            </div>
          </div>
          <div className="w-full md:w-2/3 text-center md:text-left print:w-3/4">
            <h2 className={`text-5xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-2 tracking-tighter print:text-black`}>{consultant.adSoyad}</h2>
            <p className={`text-xl ${theme.textSecondary} font-light mb-6`}>{consultant.unvan}</p>
            {(consultant.deneyim || awards.length > 0) && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                {consultant.deneyim && (
                  <div className={`${theme.bgCard} rounded-2xl border ${theme.borderColor} p-5`}>
                    <p className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-2`}>Deneyim & Uzmanlık</p>
                    <p className={`text-sm ${theme.textSecondary} leading-relaxed`}>{consultant.deneyim}</p>
                  </div>
                )}
                {awards.length > 0 && (
                  <div className={`${theme.bgCard} rounded-2xl border ${theme.borderColor} p-5`}>
                    <p className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-2`}>Ödüller & Başarılar</p>
                    <ul className="space-y-2">
                      {awards.map((odul, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`mt-1 h-1.5 w-1.5 rounded-full ${theme.accentBg} flex-shrink-0`} />
                          <span className={`text-sm ${theme.textSecondary}`}>{odul}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <ContactGrid consultant={consultant} theme={theme} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ CARD — HizliSatis compact ═══════════ */
function CardConsultant({ consultant, theme }: { consultant: Consultant; theme: ThemeConfig }) {
  return (
    <section className={`${theme.bgCard} p-6 rounded-2xl border ${theme.borderColor}`}>
      <div className="flex items-center gap-4 mb-4">
        {consultant.profilFotografiUrl && (
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-red-400/30">
            <img src={consultant.profilFotografiUrl} alt={consultant.adSoyad} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <h3 className={`text-lg font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{consultant.adSoyad}</h3>
          <p className={`text-xs ${theme.textSecondary}`}>{consultant.unvan}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={`tel:${consultant.telefon}`} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.isDark ? 'bg-white/10' : 'bg-black/5'} text-sm font-medium ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
          {consultant.telefon}
        </a>
        {consultant.ofisAdi && (
          <span className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.isDark ? 'bg-white/5' : 'bg-black/5'} text-sm ${theme.textSecondary}`}>
            {consultant.ofisAdi}
          </span>
        )}
      </div>
    </section>
  );
}

/* ═══════════ HERO — Premium/GuvenOdakli large profile ═══════════ */
function HeroConsultant({ consultant, theme }: { consultant: Consultant; theme: ThemeConfig }) {
  const awards = normalizeAwards(consultant.oduller);
  return (
    <section className="max-w-4xl mx-auto">
      <div className={`h-px w-12 mx-auto mb-6 ${theme.accentBg}`}></div>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {consultant.profilFotografiUrl && (
          <div className={`w-48 h-60 rounded-xl overflow-hidden flex-shrink-0 border-2 ${theme.borderAccent}`}>
            <img src={consultant.profilFotografiUrl} alt={consultant.adSoyad} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 text-center md:text-left">
          <h2 className={`text-4xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-1`}>{consultant.adSoyad}</h2>
          <p className={`text-sm ${theme.textAccent} font-semibold mb-4`}>{consultant.unvan}</p>
          {consultant.deneyim && (
            <p className={`text-sm ${theme.textSecondary} leading-relaxed mb-4`}>{consultant.deneyim}</p>
          )}
          {awards.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {awards.slice(0, 3).map((a, i) => (
                <span key={i} className={`text-[10px] ${theme.isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border ${theme.textSecondary} px-2.5 py-1 rounded-full`}>{a}</span>
              ))}
            </div>
          )}
          <ContactGrid consultant={consultant} theme={theme} compact />
        </div>
      </div>
    </section>
  );
}

/* ═══════════ MINIMAL — Minimalist single line ═══════════ */
function MinimalConsultant({ consultant, theme }: { consultant: Consultant; theme: ThemeConfig }) {
  return (
    <section className="max-w-2xl mx-auto text-center py-6">
      <div className={`h-px w-8 mx-auto mb-3 ${theme.borderAccent}`}></div>
      <p className={`text-sm font-semibold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{consultant.adSoyad}</p>
      <p className={`text-xs ${theme.textSecondary} mb-2`}>{consultant.unvan}</p>
      <div className="flex items-center justify-center gap-4">
        <span className={`text-xs ${theme.textSecondary}`}>{consultant.telefon}</span>
        {consultant.email && <span className={`text-xs ${theme.textSecondary}`}>{consultant.email}</span>}
        {consultant.ofisAdi && <span className={`text-xs ${theme.textSecondary}`}>{consultant.ofisAdi}</span>}
      </div>
    </section>
  );
}

/* ═══════════ SHARED: Contact Grid ═══════════ */
function ContactGrid({ consultant, theme, compact }: { consultant: Consultant; theme: ThemeConfig; compact?: boolean }) {
  const cls = compact ? 'grid grid-cols-2 gap-3' : `grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 ${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor}`;
  return (
    <div className={cls}>
      <div>
        <p className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-1`}>İletişim</p>
        <p className={`${compact ? 'text-sm' : 'text-xl'} font-medium ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{consultant.telefon}</p>
      </div>
      {consultant.ofisAdi && (
        <div>
          <p className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-1`}>Ofis</p>
          <p className={`${compact ? 'text-sm' : 'text-xl'} font-medium ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{consultant.ofisAdi}</p>
        </div>
      )}
    </div>
  );
}
