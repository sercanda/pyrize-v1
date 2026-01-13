import React from 'react';
import { Consultant } from '../types';

interface NextChapterSectionProps {
  consultant: Consultant;
}

const NextStepItem: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 flex items-center justify-center border-2 gold-border rounded-full gold-text font-bold text-3xl">
                {number}
            </div>
        </div>
        <div>
            <h4 className="text-2xl font-semibold text-white">{title}</h4>
            <p className="text-gray-400 mt-1 text-base">{description}</p>
        </div>
    </div>
);

export const NextChapterSection: React.FC<NextChapterSectionProps> = ({ consultant }) => {
  return (
    <section className="py-24 bg-[#111111]">
      <div className="container mx-auto px-6">
         <div className="text-center mb-16 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-bold text-white">
                Yeni Bir <span className="gold-text">Başlangıç</span>
            </h2>
            <p className="text-lg text-gray-400 mt-4">
                Portföyünüzün hikayesinde yeni bir sayfa açmak için sonraki adımlar.
            </p>
        </div>
        <div className="max-w-4xl mx-auto bg-[#1a1a1a] p-8 md:p-12 rounded-lg border border-gray-800">
            <div className="space-y-12">
                <NextStepItem 
                    number={"1"} 
                    title="Analiz Değerlendirmesi" 
                    description="Sunduğumuz analizi ve öngörüleri inceleyin. Potansiyel üzerine düşünmek için zaman ayırın."
                />
                 <NextStepItem 
                    number={"2"} 
                    title="Strateji Oturumu" 
                    description="Size özel danışmanınızla birebir bir oturum planlayarak vizyonumuzu ve beklentilerinizi konuşun."
                />
                 <NextStepItem 
                    number={"3"} 
                    title="Yolculuğun Başlaması" 
                    description="Stratejimiz üzerinde hemfikir olduğumuzda, portföyünüzün pazarlama yolculuğunu başlatmak için özel yetkilendirmeyi tamamlayın."
                />
            </div>
            <div className="mt-16 border-t border-gray-700 pt-10">
                <div className="bg-black border border-gray-800 rounded-lg p-8 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-white">İletişime Geçin</h3>
                        <p className="text-gray-400 mt-1">Danışmanınız bir telefon uzağınızda.</p>
                        <div className="mt-6 space-y-3">
                             <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 006.18 6.18l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <a href={`tel:${consultant.telefon}`} className="text-gray-300 hover:gold-text font-medium text-base">
                                    {consultant.telefon}
                                </a>
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <a href={`mailto:${consultant.email}`} className="text-gray-300 hover:gold-text font-medium text-base">
                                    {consultant.email}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right flex-shrink-0">
                         <img 
                            src={consultant.profilFotografiUrl} 
                            alt={consultant.adSoyad} 
                            className="w-20 h-20 rounded-full mr-0 md:mr-4 border-2 border-gray-700 shadow-sm mx-auto"
                        />
                        <div className="mt-4">
                            <p className="font-bold text-white text-lg">{consultant.adSoyad}</p>
                            <p className="text-sm gold-text">{consultant.unvan}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};