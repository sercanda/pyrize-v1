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
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-slate-300 shadow-lg">
        <p className="label text-blue-800 font-bold">{`${label}`}</p>
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
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Veriye Dayalı <span className="text-blue-800">Piyasa Analizi</span>
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            {property.konumAnalizi.ilIlce} bölgesindeki piyasa verileriyle mülkünüzün konumunu net bir şekilde görelim.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-slate-200 min-h-[350px] md:min-h-[450px] flex flex-col">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 text-slate-900">Metrekare Fiyat Karşılaştırması (₺)</h3>
            <div className="flex-1 w-full min-h-[280px] md:min-h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData.comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#475569', fontSize: 12 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(30, 64, 175, 0.1)'}} />
                  <Legend wrapperStyle={{ color: '#475569', fontSize: '12px' }} />
                  <Bar dataKey="Bölge Ortalaması" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sizin Mülkünüz" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-slate-200 min-h-[350px] md:min-h-[450px] flex flex-col">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6 text-slate-900">Bölgesel Fiyat Trendi (Son 6 Ay)</h3>
            <div className="flex-1 w-full min-h-[280px] md:min-h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regionalData.trendData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#475569', fontSize: 12 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#475569', fontSize: '12px' }}/>
                  <Line type="monotone" dataKey="Fiyat Endeksi" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 4, fill: '#4f46e5'}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};