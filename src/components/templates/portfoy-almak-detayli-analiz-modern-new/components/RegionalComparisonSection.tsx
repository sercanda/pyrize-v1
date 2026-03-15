
import React from 'react';
import { Property, ValuationData } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

export type RegionalVariant = 'default' | 'table' | 'compact';

interface RegionalComparisonSectionProps {
  property: Property;
  valuationData: ValuationData;
  theme: ThemeConfig;
  variant?: RegionalVariant;
}

export const RegionalComparisonSection: React.FC<RegionalComparisonSectionProps> = ({ property, valuationData, theme, variant = 'default' }) => {
  switch (variant) {
    case 'table': return <TableRegional property={property} valuationData={valuationData} theme={theme} />;
    case 'compact': return <CompactRegional property={property} valuationData={valuationData} theme={theme} />;
    default: return <DefaultRegional property={property} valuationData={valuationData} theme={theme} />;
  }
};

/* ═══════════ DEFAULT — 3-card + price box ═══════════ */
function DefaultRegional({ property, valuationData, theme }: { property: Property; valuationData: ValuationData; theme: ThemeConfig }) {
  return (
    <section className="print:pt-4 pb-0">
      <div className={`flex flex-col md:flex-row items-end justify-between mb-6 border-b ${theme.borderColor} pb-4`}>
        <h2 className={`text-3xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>Konum Analizi & <span className={`${theme.textSecondary}`}>Değerleme</span></h2>
        <p className={`${theme.textSecondary} text-right mt-2 md:mt-0 max-w-md text-xs`}>
          Piyasa gerçekleri ve potansiyel değer tablosu.
        </p>
      </div>
      <AnalysisCards property={property} theme={theme} />
      <PriceCard valuationData={valuationData} theme={theme} />
    </section>
  );
}

/* ═══════════ TABLE — DetayliAnaliz data table ═══════════ */
function TableRegional({ property, valuationData, theme }: { property: Property; valuationData: ValuationData; theme: ThemeConfig }) {
  return (
    <section className="pb-0">
      <div className={`flex items-end justify-between mb-4 border-b ${theme.borderColor} pb-3`}>
        <h2 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>Piyasa Analizi & Değerleme</h2>
      </div>

      {/* Data table layout */}
      <div className={`border ${theme.borderColor} rounded-xl overflow-hidden mb-6`}>
        <table className="w-full">
          <thead>
            <tr className={`${theme.bgSurface} border-b ${theme.borderColor}`}>
              <th className={`text-left text-[10px] ${theme.textSecondary} uppercase tracking-wider font-bold px-4 py-2.5`}>Gösterge</th>
              <th className={`text-left text-[10px] ${theme.textSecondary} uppercase tracking-wider font-bold px-4 py-2.5`}>Analiz</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Nadir Fırsat', value: property.marketAnalysis.marketRisk, color: 'text-indigo-400' },
              { label: 'Konum Primi', value: property.marketAnalysis.seaProximityPremium, color: 'text-emerald-400' },
              { label: 'Gelişim Potansiyeli', value: property.marketAnalysis.regionalTrend, color: 'text-amber-400' },
            ].map((row, i) => (
              <tr key={i} className={`border-b ${theme.borderColor} last:border-0`}>
                <td className={`px-4 py-3 ${row.color} text-xs font-bold uppercase tracking-wider w-1/4`}>{row.label}</td>
                <td className={`px-4 py-3 text-xs ${theme.textSecondary} leading-relaxed`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Snapshots as horizontal stat row */}
      <div className={`grid grid-cols-${Math.min(valuationData.marketSnapshots.length, 4)} gap-3 mb-4`}>
        {valuationData.marketSnapshots.map((stat, idx) => (
          <div key={idx} className={`text-center ${theme.bgCard} p-3 rounded-lg border ${theme.borderColor}`}>
            <p className={`text-[10px] ${theme.textSecondary} uppercase tracking-wider mb-1`}>{stat.title}</p>
            <p className={`text-lg font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              {stat.value}
              {stat.trend === 'up' && <span className="text-[10px] text-emerald-400 ml-1">▲</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Estimated value highlight */}
      <div className={`text-center p-4 rounded-xl border ${theme.borderAccent} ${theme.isDark ? 'bg-indigo-950/30' : 'bg-indigo-50'}`}>
        <p className={`text-[10px] ${theme.textAccent} uppercase tracking-wider font-bold mb-1`}>Tahmini Satış Değeri</p>
        <p className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{valuationData.estimatedValueRange}</p>
        <p className={`text-xs ${theme.textSecondary} mt-1`}>{valuationData.priceStrategyNote}</p>
      </div>
    </section>
  );
}

/* ═══════════ COMPACT — HizliSatis single price focus ═══════════ */
function CompactRegional({ property, valuationData, theme }: { property: Property; valuationData: ValuationData; theme: ThemeConfig }) {
  return (
    <section className="pb-0">
      {/* Big price highlight */}
      <div className={`text-center p-6 rounded-2xl border ${theme.borderAccent} ${theme.isDark ? 'bg-indigo-950/30' : 'bg-indigo-50'} mb-4`}>
        <p className={`text-[10px] ${theme.textAccent} uppercase tracking-[0.3em] font-bold mb-2`}>Satış Değeri</p>
        <p className={`text-4xl font-black ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{valuationData.estimatedValueRange}</p>
        <p className={`text-xs ${theme.textSecondary} mt-2`}>{valuationData.priceStrategyNote}</p>
      </div>

      {/* Mini snapshot row */}
      <div className="flex flex-wrap gap-3 justify-center">
        {valuationData.marketSnapshots.slice(0, 3).map((stat, idx) => (
          <div key={idx} className={`${theme.bgCard} px-4 py-2 rounded-lg border ${theme.borderColor} text-center`}>
            <p className={`text-[10px] ${theme.textSecondary} uppercase`}>{stat.title}</p>
            <p className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>
              {stat.value} {stat.trend === 'up' && <span className="text-emerald-400 text-[10px]">▲</span>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════ SHARED: Analysis Cards ═══════════ */
function AnalysisCards({ property, theme }: { property: Property; theme: ThemeConfig }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-0 print:gap-8">
      <div className={`${theme.isDark ? 'bg-indigo-900/10' : 'bg-indigo-50'} border ${theme.isDark ? 'border-indigo-500/20' : 'border-indigo-200'} p-4 rounded-xl`}>
        <h4 className="text-indigo-400 font-bold mb-1 text-xs uppercase tracking-wider">Nadir Fırsat</h4>
        <p className={`${theme.textSecondary} text-xs leading-relaxed`}>{property.marketAnalysis.marketRisk}</p>
      </div>
      <div className={`${theme.isDark ? 'bg-emerald-900/10' : 'bg-emerald-50'} border ${theme.isDark ? 'border-emerald-500/20' : 'border-emerald-200'} p-4 rounded-xl`}>
        <h4 className="text-emerald-400 font-bold mb-1 text-xs uppercase tracking-wider">Konum Primi</h4>
        <p className={`${theme.textSecondary} text-xs leading-relaxed`}>{property.marketAnalysis.seaProximityPremium}</p>
      </div>
      <div className={`${theme.isDark ? 'bg-amber-900/10' : 'bg-amber-50'} border ${theme.isDark ? 'border-amber-500/20' : 'border-amber-200'} p-4 rounded-xl`}>
        <h4 className="text-amber-400 font-bold mb-1 text-xs uppercase tracking-wider">Gelişim Potansiyeli</h4>
        <p className={`${theme.textSecondary} text-xs leading-relaxed`}>{property.marketAnalysis.regionalTrend}</p>
      </div>
    </div>
  );
}

/* ═══════════ SHARED: Price Card ═══════════ */
function PriceCard({ valuationData, theme }: { valuationData: ValuationData; theme: ThemeConfig }) {
  return (
    <div className="flex justify-center mt-24 print:mt-16">
      <div className={`w-full bg-gradient-to-br ${theme.isDark ? 'from-indigo-950 to-slate-950' : 'from-blue-50 to-white'} rounded-2xl p-6 flex flex-col justify-between min-h-[250px] border ${theme.borderAccent} relative overflow-hidden shadow-xl print:bg-white print:shadow-none print:min-h-0 print:p-6`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 print:hidden"></div>
        <div className="relative z-10 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${theme.borderAccent} ${theme.isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'} mb-4`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBg} animate-pulse`}></span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textAccent}`}>Tahmini Satış Değeri</span>
          </div>
          <h3 className={`text-3xl lg:text-4xl font-bold tracking-tight mb-2 ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{valuationData.estimatedValueRange}</h3>
          <p className={`${theme.textSecondary} text-xs mt-1 leading-relaxed border-t ${theme.borderColor} pt-2 max-w-lg mx-auto`}>{valuationData.priceStrategyNote}</p>
        </div>
        <div className={`relative z-10 grid grid-cols-3 gap-4 mt-6 pt-4 border-t ${theme.borderColor}`}>
          {valuationData.marketSnapshots.map((stat, idx) => (
            <div key={idx} className={`text-center border-r last:border-0 ${theme.borderColor}`}>
              <p className={`text-[10px] ${theme.textSecondary} uppercase tracking-widest mb-1`}>{stat.title}</p>
              <div className="flex items-center justify-center gap-1">
                <p className={`text-lg font-medium ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                {stat.trend === 'up' && <span className="text-[10px] text-emerald-400">▲</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
