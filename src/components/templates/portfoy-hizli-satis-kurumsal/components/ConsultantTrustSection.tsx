import React from 'react';
import { Consultant } from '../types';

interface ConsultantTrustSectionProps {
  consultant: Consultant;
}

export const ConsultantTrustSection: React.FC<ConsultantTrustSectionProps> = ({ consultant }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div id="ben-kimim" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Neden <span className="text-blue-800">Biz?</span>
            </h2>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                Mülkünüzü, bölgeye hakim, kurumsal ve sonuç odaklı bir ekibe emanet edin.
            </p>
        </div>
        <div className="bg-slate-50 max-w-6xl mx-auto p-8 md:p-12 rounded-lg shadow-lg border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-48 h-48 mb-4">
                <img 
                  src={consultant.profilFotografiUrl}
                  alt={consultant.adSoyad}
                  className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white"
                />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mt-4">{consultant.adSoyad}</h3>
              <p className="text-blue-800 font-semibold text-lg">{consultant.unvan}</p>
              <img src={consultant.ofisLogosuUrl} alt={consultant.ofisAdi} className="mt-8 h-16 w-auto" />
            </div>
            <div className="lg:col-span-2">
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-10">
                {consultant.gucler.map((guc, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg flex items-center gap-4 border border-slate-200">
                    <div className="flex-shrink-0 text-blue-700">
                      {React.cloneElement(guc.icon, { className: "w-8 h-8" })}
                    </div>
                    <p className="font-semibold text-md text-slate-700">{guc.text}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-2xl font-bold text-slate-900 mb-4">Başarılarımız</h4>
              <div className="flex flex-wrap gap-3">
                {consultant.oduller.map((odul, index) => (
                    <span key={index} className="bg-blue-100/70 text-blue-800 text-sm font-medium px-4 py-2 rounded-full border border-blue-200">{odul}</span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};