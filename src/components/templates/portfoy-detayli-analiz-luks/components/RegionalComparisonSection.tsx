import React from 'react';
import { ValuationData, Property } from '../types';

interface MarketIntelligenceReportProps {
  valuationData: ValuationData;
  property: Property;
}

const StatCard: React.FC<{ title: string; value: string; trend?: number }> = ({ title, value, trend }) => (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 text-center">
        <h4 className="text-lg text-gray-400 mb-2">{title}</h4>
        <p className="text-4xl font-bold text-white">{value}</p>
        {trend !== undefined && (
            <p className={`text-sm font-semibold mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% (Yıllık)
            </p>
        )}
    </div>
);


export const MarketIntelligenceReport: React.FC<MarketIntelligenceReportProps> = ({ valuationData, property }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(amount);
  
  return (
    <section id="market-intelligence" className="py-24 bg-[#111111]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
                Piyasa Analiz Raporu
            </h2>
            <p className="text-lg text-gray-400 mt-4">
                Mülkünüzün mevcut piyasa koşullarındaki yerini ve potansiyelini objektif verilerle değerlendiriyoruz.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <StatCard 
                title="Ort. Bölge m² Fiyatı"
                value={`${formatCurrency(valuationData.averagePricePerSqm)}`}
            />
            <StatCard 
                title="Bölgesel Değer Artışı"
                value={`${valuationData.priceTrend}%`}
                trend={valuationData.priceTrend}
            />
            <StatCard 
                title="Tahmini Kira Getirisi"
                value={`${valuationData.rentalYield}%`}
            />
        </div>

        <div className="bg-black p-8 md:p-10 rounded-lg border border-gray-800 max-w-5xl mx-auto">
            <h3 className="text-3xl font-semibold text-white mb-6">Rekabet Analizi</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Mülk</th>
                            <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Fiyat</th>
                            <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">m²</th>
                            <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">m² Fiyatı</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-yellow-500/5 border-b border-yellow-500/20">
                            <td className="p-4 font-semibold text-yellow-300">{property.address} (Sizin Mülkünüz)</td>
                            <td className="p-4 font-semibold text-yellow-300 text-right">{formatCurrency(property.price)}</td>
                            <td className="p-4 font-semibold text-yellow-300 text-right">{property.sqm} m²</td>
                            <td className="p-4 font-semibold text-yellow-300 text-right">{formatCurrency(property.price / property.sqm)}</td>
                        </tr>
                        {valuationData.regionalCompetitors.map((competitor, index) => (
                             <tr key={index} className="border-b border-gray-800">
                                <td className="p-4 text-gray-300">{competitor.address}</td>
                                <td className="p-4 text-gray-300 text-right">{formatCurrency(competitor.price)}</td>
                                <td className="p-4 text-gray-300 text-right">{competitor.sqm} m²</td>
                                <td className="p-4 text-gray-300 text-right">{formatCurrency(competitor.price / competitor.sqm)}</td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </section>
  );
};
