
import React from 'react';
import { Property, ValuationData } from '../types';

interface RegionalComparisonSectionProps {
  property: Property;
  valuationData: ValuationData;
}

export const RegionalComparisonSection: React.FC<RegionalComparisonSectionProps> = ({ property, valuationData }) => {
  return (
    <section className="print:pt-4 pb-0">
        <div className="flex flex-col md:flex-row items-end justify-between mb-6 print:mb-6 border-b border-white/5 print:border-slate-800 pb-4 print:pb-4">
             <h2 className="text-3xl font-bold text-white tracking-tight print:text-black print:text-2xl">Konum Analizi & <span className="text-slate-600 print:text-slate-800">Değerleme</span></h2>
             <p className="text-slate-400 text-right mt-2 md:mt-0 max-w-md text-xs print:text-black print:font-medium">
                Ayçil Tower özelinde, piyasa gerçekleri ve potansiyel değer tablosu.
             </p>
        </div>

        {/* Market Reality & Analysis Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-0 print:mb-0 print:gap-8">
            <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-xl print:bg-indigo-50 print:border-indigo-900 print:p-4">
                <h4 className="text-indigo-400 font-bold mb-1 text-xs uppercase tracking-wider print:text-indigo-900">Nadir Fırsat</h4>
                <p className="text-slate-300 text-xs leading-relaxed print:text-black print:font-medium">{property.marketAnalysis.marketRisk}</p>
            </div>
            <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl print:bg-emerald-50 print:border-emerald-900 print:p-4">
                 <h4 className="text-emerald-400 font-bold mb-1 text-xs uppercase tracking-wider print:text-emerald-900">Konum Primi</h4>
                 <p className="text-slate-300 text-xs leading-relaxed print:text-black print:font-medium">{property.marketAnalysis.seaProximityPremium}</p>
            </div>
            <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl print:bg-amber-50 print:border-amber-900 print:p-4">
                 <h4 className="text-amber-400 font-bold mb-1 text-xs uppercase tracking-wider print:text-amber-900">Gelişim Potansiyeli</h4>
                 <p className="text-slate-300 text-xs leading-relaxed print:text-black print:font-medium">{property.marketAnalysis.regionalTrend}</p>
            </div>
        </div>

        {/* Main Price Card */}
        <div className="flex justify-center mt-24 print:mt-16">
            <div className="w-full bg-gradient-to-br from-indigo-950 to-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between min-h-[250px] border border-indigo-500/20 relative overflow-hidden group shadow-xl print:bg-white print:from-white print:to-white print:text-black print:border-2 print:border-slate-800 print:shadow-none print:min-h-0 print:p-6">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 print:hidden"></div>
                
                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 mb-4 print:bg-indigo-50 print:border-indigo-900 print:mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse print:bg-indigo-900"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 print:text-indigo-900">Tahmini Satış Değeri</span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-white print:text-black">{valuationData.estimatedValueRange}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed border-t border-white/10 pt-2 max-w-lg mx-auto print:text-black print:border-slate-400">{valuationData.priceStrategyNote}</p>
                </div>
                
                <div className="relative z-10 grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10 print:border-slate-400 print:mt-6 print:pt-4">
                     {valuationData.marketSnapshots.map((stat, idx) => (
                         <div key={idx} className="text-center border-r last:border-0 border-white/10 print:border-slate-400">
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 print:text-slate-900 print:font-bold">{stat.title}</p>
                             <div className="flex items-center justify-center gap-1">
                                <p className="text-lg font-medium text-white print:text-black">{stat.value}</p>
                                {stat.trend === 'up' && <span className="text-[10px] text-emerald-400 print:text-emerald-900">▲</span>}
                             </div>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    </section>
  );
};
