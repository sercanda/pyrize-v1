import React from 'react';
import { Consultant } from '../types';

interface ConsultantTrustSectionProps {
  consultant: Consultant;
}

export const ConsultantTrustSection: React.FC<ConsultantTrustSectionProps> = ({ consultant }) => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div id="ben-kimim" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Neden <span className="text-amber-400">Ben?</span>
            </h2>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                Mülkünüzü, bölgeye hakim ve sonuç odaklı bir uzmana emanet edin.
            </p>
        </div>
        <div className="bg-gray-900 max-w-6xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-52 h-52 mb-4">
                <img 
                  src={consultant.profilFotografiUrl}
                  alt={consultant.adSoyad}
                  className="w-full h-full rounded-full object-cover shadow-lg border-4 border-gray-700"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-amber-500 ring-offset-4 ring-offset-gray-900 animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-white mt-6">{consultant.adSoyad}</h3>
              <p className="text-amber-400 font-semibold text-lg">{consultant.unvan}</p>
              {consultant.tagline && (
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
                  {consultant.tagline}
                </p>
              )}
              <img src={consultant.ofisLogosuUrl} alt={consultant.ofisAdi} className="mt-8 h-16 w-auto" />
            </div>
            <div className="lg:col-span-2">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {consultant.gucler.map((guc, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg text-center flex flex-col items-center justify-center border border-gray-700 hover:border-amber-600 transition-colors duration-300">
                    <div className="mb-2">
                      {guc.icon}
                    </div>
                    <p className="font-semibold text-sm text-gray-300">{guc.text}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-2xl font-bold text-white mb-4">Başarılarım</h4>
              <div className="flex flex-wrap gap-3">
                {consultant.oduller.map((odul, index) => (
                    <span key={index} className="bg-amber-500/10 text-amber-300 text-sm font-medium px-4 py-2 rounded-full border border-amber-500/20">{odul}</span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};