
import React from 'react';
import { Consultant } from '../types';

interface ConsultantTrustSectionProps {
  consultant: Consultant;
}

const normalizeAwards = (value: Consultant['oduller']): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v) => !!v && v.trim().length > 0);
  return value
    .split(/\r?\n/)
    .map((item) => item.replace(/^[•\-–—→✅\u2022\s]+/, '').trim())
    .filter(Boolean);
};

export const ConsultantTrustSection: React.FC<ConsultantTrustSectionProps> = ({ consultant }) => {
  const awards = normalizeAwards(consultant.oduller);

  return (
    <section className="max-w-4xl mx-auto print:w-full">
        <div className="border-t-4 border-slate-800 pt-12 print:border-slate-400">
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start print:gap-8">
                
                <div className="w-full md:w-1/3 print:w-1/4">
                    <div className="aspect-[3/4] relative rounded-sm overflow-hidden bg-slate-800 transition-all duration-500 ring-1 ring-white/10 print:ring-slate-400">
                        <img 
                            src={consultant.profilFotografiUrl} 
                            alt={consultant.adSoyad}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                         <span className="text-xs font-bold border border-slate-700 px-2 py-1 rounded uppercase text-slate-500 print:border-slate-600 print:text-black">Lisanslı</span>
                    </div>
                </div>

                <div className="w-full md:w-2/3 text-center md:text-left print:w-3/4">
                    <h2 className="text-5xl font-bold text-white mb-2 tracking-tighter print:text-black">{consultant.adSoyad}</h2>
                    <p className="text-xl text-slate-500 font-light mb-6 print:text-black">{consultant.unvan}</p>

                    {/* Deneyim & Ödüller */}
                    {(consultant.deneyim || awards.length > 0) && (
                      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                        {consultant.deneyim && (
                          <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-5 print:bg-white print:border-slate-800 print:border-2">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 print:text-indigo-900">
                              Deneyim & Uzmanlık
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed print:text-black">
                              {consultant.deneyim}
                            </p>
                          </div>
                        )}
                        {awards.length > 0 && (
                          <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-5 print:bg-white print:border-slate-800 print:border-2">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 print:text-indigo-900">
                              Ödüller & Başarılar
                            </p>
                            <ul className="space-y-2">
                              {awards.map((odul, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400 flex-shrink-0 print:bg-indigo-900" />
                                  <span className="text-sm text-slate-300 print:text-black">{odul}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 bg-slate-900/50 p-8 rounded-2xl border border-white/5 print:bg-white print:border-slate-800 print:border-2">
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 print:text-indigo-900">Doğrudan İletişim</p>
                            <p className="text-xl font-medium text-white border-b border-white/10 pb-2 mb-2 print:text-black print:border-slate-400">{consultant.telefon}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 print:text-indigo-900">Ofis Lokasyonu</p>
                            <p className="text-xl font-medium text-white print:text-black">{consultant.ofisAdi}</p>
                            <p className="text-sm text-slate-400 mt-1 print:text-black">Samsun / Atakum</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
  );
};
