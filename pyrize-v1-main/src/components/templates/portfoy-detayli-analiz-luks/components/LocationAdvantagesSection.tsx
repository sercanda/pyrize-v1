import React, { useState } from 'react';
import { Property, FaqItem } from '../types';

interface PortfolioAnalysisSectionProps {
  property: Property;
  faq: FaqItem[];
}

const FaqAccordion: React.FC<{ item: FaqItem, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-800">
            <button
                onClick={onClick}
                className="w-full text-left py-6 flex justify-between items-center"
                aria-expanded={isOpen}
            >
                <h4 className="text-xl font-medium text-white">{item.question}</h4>
                <svg
                    className={`w-6 h-6 text-yellow-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="pb-6 pr-10">
                    <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                </div>
            </div>
        </div>
    );
};


export const PortfolioAnalysisSection: React.FC<PortfolioAnalysisSectionProps> = ({ property, faq }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleFaqClick = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Portföy Analizi: <span className="gold-text">Değer Yaratan Faktörler</span>
          </h2>
          <p className="text-lg text-gray-400 mt-4">
            {property.address} adresindeki mülkünüzün, çevresindeki olanaklarla ve gelecek potansiyeliyle nasıl değer kazandığını keşfedin.
          </p>
        </div>
        
        {/* Konum Avantajları */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-semibold text-white mb-8 text-center">Konum Avantajları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {property.locationHighlights.map((highlight, index) => (
              <div key={index} className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800">
                <div className="flex items-center mb-5">
                  <div className="p-3 rounded-full bg-yellow-500/10 mr-4">
                      {highlight.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{highlight.category}</h3>
                </div>
                <ul className="space-y-3">
                  {highlight.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      <span className="text-gray-400">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Konum Analizi */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-white">
              Konum Analizi
            </h3>
            <p className="text-lg text-gray-400 mt-3 max-w-3xl mx-auto">
              Mülkünüzün yatırım ve yaşam alanı olarak sunduğu fırsatları inceliyoruz.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {property.potential.map((item, index) => (
              <div key={index} className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start space-x-6">
                    <div className="p-3 rounded-full bg-yellow-500/10 flex-shrink-0 mt-1">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{item.description}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sizin Mülkünüz İçin Özel Planımız */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-white">
              Sizin Mülkünüz İçin <span className="gold-text">Özel Planımız</span>
            </h3>
            <p className="text-lg text-gray-400 mt-3 max-w-3xl mx-auto">
              {property.address} adresindeki mülkünüz için hazırladığımız özel tanıtım ve pazarlama yol haritası.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tanıtım Stratejisi */}
            <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 flex flex-col">
              <h4 className="text-2xl font-semibold text-white mb-3">Tanıtım Stratejisi</h4>
              <p className="text-gray-400 leading-relaxed flex-grow">{property.marketingPlan.promotionStrategy}</p>
            </div>
            
            {/* Hedef Kitle Profili */}
            <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 flex flex-col">
              <h4 className="text-2xl font-semibold text-white mb-3">Hedef Kitle Profili</h4>
              <p className="text-gray-400 leading-relaxed flex-grow">{property.marketingPlan.targetAudience}</p>
            </div>
            
            {/* Reklam Kanalları */}
            <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800 flex flex-col">
              <h4 className="text-2xl font-semibold text-white mb-4">Reklam Kanalları</h4>
              <ul className="space-y-3">
                {property.marketingPlan.channels.map((channel, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-400 mr-3 text-xl">✅</span>
                    <span className="text-gray-300 font-medium">{channel}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Aklınızdaki Sorular (SSS) */}
        <div className="mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-semibold text-white">
                    Aklınızdaki <span className="gold-text">Sorular</span>
                </h3>
                <p className="text-lg text-gray-400 mt-3 max-w-3xl mx-auto">
                    Süreçle ilgili en çok merak edilen konular ve yanıtları.
                </p>
            </div>
            <div>
              {faq.map((item, index) => (
                <FaqAccordion
                  key={index}
                  item={item}
                  isOpen={openFaqIndex === index}
                  onClick={() => handleFaqClick(index)}
                />
              ))}
            </div>
        </div>

      </div>
    </section>
  );
};