import React from 'react';
import { Property } from '../types';

interface UsagePotentialSectionProps {
  property: Property;
}

export const UsagePotentialSection: React.FC<UsagePotentialSectionProps> = ({ property }) => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Gelecek Vadeden <span className="text-indigo-400">Fırsatlar</span>
          </h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Mülkünüzün mevcut durumu ve konumuyla sunduğu yatırım ve yaşam fırsatları.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* FIX: Corrected property access to resolve TypeScript error. */}
          {property.kullanimPotensiyeli.map((potential, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-indigo-500/50">
                <div className="flex items-center mb-5">
                    <div className="p-3 bg-indigo-500/10 rounded-full mr-4 border border-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                    </div>
                    {/* FIX: Use the 'potential' string directly as it's not an object with 'baslik'. */}
                    <h3 className="text-2xl font-bold text-white">{potential}</h3>
                </div>
              {/* FIX: The 'potential' variable is a string, not an object with 'aciklama'. The description part is removed. */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};