
import React from 'react';
import { Consultant } from '../types';

interface ConsultantTrustSectionProps {
  consultant: Consultant;
}

export const ConsultantTrustSection: React.FC<ConsultantTrustSectionProps> = ({ consultant }) => {
  return (
    <section className="py-24 bg-white border-t border-slate-100 print:break-inside-avoid">
      <div className="container mx-auto px-6">
        <div id="ben-kimim" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Yetkili Danışman Profili
            </h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto border border-slate-200 flex flex-col md:flex-row print:shadow-none print:border-slate-300">
          
          {/* Left Profile Section */}
          <div className="md:w-1/3 bg-slate-900 p-10 flex flex-col items-center text-center text-white relative overflow-hidden print:bg-slate-100 print:text-slate-900 print:border-r print:border-slate-200">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-900/20 z-0 print:hidden"></div>
            <div className="relative z-10 w-full">
                <div className="flex justify-center mb-8">
                     <img src={consultant.ofisLogosuUrl} alt={consultant.ofisAdi} className="h-12 w-auto opacity-90 invert print:filter-none" />
                </div>
                
                <div className="relative mx-auto w-40 mb-6">
                     <img 
                        src={consultant.profilFotografiUrl}
                        alt={consultant.adSoyad}
                        className="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-slate-700 print:border-slate-300"
                      />
                </div>
               
                <h3 className="text-2xl font-bold mt-2">{consultant.adSoyad}</h3>
                <p className="text-blue-300 font-medium text-sm mt-1 print:text-blue-700">{consultant.unvan}</p>
                
                <div className="mt-8 space-y-3 pt-6 border-t border-slate-700 print:border-slate-300 text-left">
                    <div className="flex items-center gap-3 text-sm text-slate-300 print:text-slate-600">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                         {consultant.telefon}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300 print:text-slate-600">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                         {consultant.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300 print:text-slate-600">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                         {consultant.ofisAdi}
                    </div>
                </div>
            </div>
          </div>

          {/* Right Details Section */}
          <div className="md:w-2/3 p-10 flex flex-col justify-center">
            <div className="mb-8">
                <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-700 p-1.5 rounded mr-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </span>
                    Neden Biz?
                </h4>
                <div className="grid sm:grid-cols-2 gap-6">
                    {consultant.gucler.map((guc, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mr-3 text-slate-400">
                             {React.cloneElement(guc.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                        </div>
                        <p className="font-medium text-slate-700 text-sm">{guc.text}</p>
                    </div>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Başarılar</h4>
                <div className="flex flex-wrap gap-3">
                    {consultant.oduller.map((odul, index) => (
                        <span key={index} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-2">
                            <span className="text-yellow-500">★</span>
                            {odul}
                        </span>
                    ))}
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};