import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Property, RegionalData } from '../types';

interface RegionalComparisonSectionProps {
  property: Property;
  regionalData: RegionalData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-gray-600">
        <p className="label text-amber-400 font-bold">{`${label}`}</p>
        {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.dataKey}: ${typeof pld.value === 'number' ? pld.value.toLocaleString('tr-TR') : pld.value}`}
            </p>
        ))}
      </div>
    );
  }

  return null;
};


export const RegionalComparisonSection: React.FC<RegionalComparisonSectionProps> = ({ property, regionalData }) => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Veriye Dayalı <span className="text-amber-400">Piyasa Analizi</span>
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
            {property.konumAnalizi.ilIlce} bölgesindeki piyasa verileriyle mülkünüzün konumunu net bir şekilde görelim.
          </p>
          {regionalData.kfeMetrics && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
                <span className="text-amber-300 font-semibold">Bölge Yıllık Artış: </span>
                <span className="text-white">%{regionalData.kfeMetrics.bolgeYillikDegisim.toFixed(1)}</span>
              </div>
              {regionalData.kfeMetrics.turkiyeYillikDegisim !== null && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2">
                  <span className="text-gray-400">Türkiye Ortalaması: </span>
                  <span className="text-white">%{regionalData.kfeMetrics.turkiyeYillikDegisim.toFixed(1)}</span>
                </div>
              )}
              {regionalData.kfeMetrics.bolgeYtdDegisim !== null && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                  <span className="text-emerald-300 font-semibold">YTD Artış: </span>
                  <span className="text-white">%{regionalData.kfeMetrics.bolgeYtdDegisim.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch">
          <div className="bg-gray-900 p-4 md:p-6 rounded-xl shadow-lg border border-gray-800 min-h-[350px] md:min-h-[450px] flex flex-col">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 text-white">Metrekare Fiyat Karşılaştırması (₺)</h3>
            <div className="flex-1 w-full min-h-[280px] md:min-h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData.comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(217, 119, 6, 0.1)'}} />
                  <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                  <Bar dataKey="Bölge Ortalaması" fill="#D97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sizin Mülkünüz" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-gray-900 p-4 md:p-6 rounded-xl shadow-lg border border-gray-800 min-h-[350px] md:min-h-[450px] flex flex-col">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 text-white">Bölgesel Fiyat Trendi (Son 6 Ay)</h3>
            <div className="flex-1 w-full min-h-[280px] md:min-h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regionalData.trendData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)"/>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}/>
                  <Line type="monotone" dataKey="Fiyat Endeksi" stroke="#D97706" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 4, fill: '#D97706'}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};