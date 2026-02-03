import React from 'react';
import { Property, ValuationData, MarketSnapshot } from '../types';

interface RegionalComparisonSectionProps {
  property: Property;
  valuationData: ValuationData;
}

const SnapshotCard: React.FC<{ snapshot: MarketSnapshot }> = ({ snapshot }) => {
    const trendIsUp = snapshot.trend === 'up';
    const trendIsDown = snapshot.trend === 'down';
    const trendColor = trendIsUp ? 'text-emerald-600 bg-emerald-50' : trendIsDown ? 'text-rose-600 bg-rose-50' : 'text-slate-600 bg-slate-50';
    const trendIcon = trendIsUp ? '▲' : trendIsDown ? '▼' : '●';

    return (
        <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{snapshot.title}</h4>
                {snapshot.trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trendColor}`}>
                        {trendIcon} {snapshot.trendLabel}
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-slate-900">{snapshot.value}</p>
        </div>
    );
};

export const RegionalComparisonSection: React.FC<RegionalComparisonSectionProps> = ({ property, valuationData }) => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Piyasa Analizi</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                    Bölgesel Değerleme Raporu
                </h2>
                <p className="text-slate-600 mt-4 leading-relaxed">
                    {property.konumAnalizi.ilIlce} bölgesi için anlık veri tabanımızdan çekilen karşılaştırmalı pazar analizleri ve finansal öngörüler.
                </p>
            </div>
        </div>
        
        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {valuationData.marketSnapshots.map(snapshot => <SnapshotCard key={snapshot.title} snapshot={snapshot} />)}
        </div>

        <div className={`grid grid-cols-1 ${valuationData.estimatedValueRange ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
            {/* Table Section */}
            <div className={`${valuationData.estimatedValueRange ? 'lg:col-span-2' : ''} bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden`}>
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Emsal Mülk Karşılaştırması</h3>
                    <span className="text-xs text-slate-500 italic">Son 30 gün verileri</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Adres / Konum</th>
                                <th className="px-6 py-3 font-semibold">Durum</th>
                                <th className="px-6 py-3 font-semibold text-right">Fiyat</th>
                                <th className="px-6 py-3 font-semibold text-right">Alan</th>
                                <th className="px-6 py-3 font-semibold text-right">m² Birim</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {valuationData.comparables.map((comp, index) => (
                                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{comp.address}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            comp.status === 'Satıldı' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {comp.status === 'Satıldı' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                                            {comp.status === 'Satışta' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                                            {comp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-700">{comp.price}</td>
                                    <td className="px-6 py-4 text-right text-slate-500">{comp.size}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">{comp.pricePerSqm}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Valuation Result Card - Only show if estimatedValueRange exists */}
            {valuationData.estimatedValueRange && (
                <div className="bg-slate-900 rounded-xl p-8 text-white flex flex-col justify-center relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-blue-300 uppercase text-xs font-bold tracking-widest mb-2">Tahmini Piyasa Değeri</h3>
                        <div className="h-px w-12 bg-blue-500/50 mb-6"></div>
                        
                        <p className="text-3xl lg:text-4xl font-bold leading-tight mb-2">{valuationData.estimatedValueRange}</p>
                        <p className="text-slate-400 text-sm mb-8">
                            Emsal mülk analizleri ve mevcut ekonomik göstergeler ışığında belirlenen önerilen satış aralığıdır.
                        </p>

                        <button className="w-full py-3 px-4 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                            Detaylı Raporu İndir
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};