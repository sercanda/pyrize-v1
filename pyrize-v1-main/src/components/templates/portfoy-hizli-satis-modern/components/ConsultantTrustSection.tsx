import React from 'react';
import { Consultant } from '../types';

interface ConsultantTrustSectionProps {
  consultant: Consultant;
}

export const ConsultantTrustSection: React.FC<ConsultantTrustSectionProps> = ({ consultant }) => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div id="ben-kimim" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Profesyonel <span className="text-indigo-400">Partneriniz</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row">

            {/* Left: Profile Image Area */}
            <div className="lg:w-1/3 relative min-h-[400px] lg:min-h-full">
              <img
                src={consultant.profilFotografiUrl}
                alt={consultant.adSoyad}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900/90"></div>

              <div className="absolute bottom-0 left-0 p-8 lg:hidden">
                <h3 className="text-3xl font-bold text-white">{consultant.adSoyad}</h3>
                <p className="text-indigo-400 font-medium">{consultant.unvan}</p>
              </div>
            </div>

            {/* Right: Content Area */}
            <div className="lg:w-2/3 p-8 md:p-12 flex flex-col justify-center">
              <div className="hidden lg:block mb-8">
                <h3 className="text-4xl font-bold text-white mb-2">{consultant.adSoyad}</h3>
                <div className="flex items-center gap-4">
                  <p className="text-indigo-400 text-xl font-medium">{consultant.unvan}</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  <p className="text-slate-400">{consultant.ofisAdi}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {consultant.gucler.map((guc, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                    <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg">
                      {React.cloneElement(guc.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                    </div>
                    <p className="font-medium text-slate-200 text-sm">{guc.text}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Başarılar & Ödüller</h4>
                <div className="flex flex-wrap gap-3">
                  {consultant.oduller.map((odul, index) => (
                    <span key={index} className="px-4 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                      {odul}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between">
                <img src={consultant.ofisLogosuUrl} alt={consultant.ofisAdi} className="h-10 w-auto opacity-80 grayscale hover:grayscale-0 transition-all" />
                <a href={`mailto:${consultant.email}`} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                  {consultant.email}
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};