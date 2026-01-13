import React from 'react';
import { Consultant } from '../types';

interface ExpertAdvisorSectionProps {
  consultant: Consultant;
}

export const ExpertAdvisorSection: React.FC<ExpertAdvisorSectionProps> = ({ consultant }) => {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
                Size Özel <span className="gold-text">Danışmanınız</span>
            </h2>
            <p className="text-lg text-gray-400 mt-4">
                Bu yolculukta size rehberlik edecek olan uzmanlığımız ve kurumsal gücümüzle tanışın.
            </p>
        </div>
        <div className="bg-[#1a1a1a] max-w-5xl mx-auto p-8 md:p-12 rounded-lg border border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="flex flex-col items-center text-center">
              <img 
                  src={consultant.profilFotografiUrl}
                  alt={consultant.adSoyad}
                  className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-gray-700"
                />
              <h3 className="text-3xl font-semibold text-white mt-5">{consultant.adSoyad}</h3>
              <p className="gold-text font-medium text-lg">{consultant.unvan}</p>
              <img src={consultant.ofisLogosuUrl} alt={consultant.ofisAdi} className="h-16 w-auto mt-6 opacity-70" />
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-2xl font-semibold text-white mb-6">Uzmanlık Alanları</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {consultant.gucler.map((guc, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {guc.icon}
                    </div>
                    <p className="font-semibold text-base text-gray-300">{guc.text}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-2xl font-semibold text-white mb-5">Başarılar ve Ödüller</h4>
              <div className="flex flex-wrap gap-3">
                {consultant.oduller.map((odul, index) => (
                    <span key={index} className="bg-yellow-500/10 text-yellow-300 text-sm font-medium px-4 py-2 rounded-full">{odul}</span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};