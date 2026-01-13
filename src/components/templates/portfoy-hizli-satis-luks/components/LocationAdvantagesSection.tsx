import React from 'react';
import { Property } from '../types';

interface PropertyPlanSectionProps {
    property: Property;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
        <h4 className="font-bold text-xl text-amber-300 mb-4">{title}</h4>
        {children}
    </div>
);

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start text-gray-300">
        <svg className="w-5 h-5 mr-3 text-green-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
        <span>{children}</span>
    </li>
);

export const PropertyPlanSection: React.FC<PropertyPlanSectionProps> = ({ property }) => {
    return (
        <section className="py-24 bg-gradient-to-b from-[#0a0a1a] to-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                        {property.planBaslik}
                    </h2>
                    <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
                        {property.planAltBaslik}
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sol Sütun */}
                    <div className="space-y-8">
                        <SectionCard title="Konum & Potansiyel Analizi">
                             <ul className="space-y-3">
                                {property.konumAvantajlari.map((item, i) => <CheckListItem key={i}>{item}</CheckListItem>)}
                                {property.kullanimPotensiyeli.map((item, i) => <CheckListItem key={i}>{item}</CheckListItem>)}
                            </ul>
                        </SectionCard>
                        <SectionCard title="Hedef Kitle">
                            <div className="space-y-4">
                                {property.hedefKitle.map((hedef, i) => (
                                    <div key={i}>
                                        <h5 className="font-semibold text-white">{hedef.baslik}</h5>
                                        <p className="text-sm text-gray-400">{hedef.aciklama}</p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                    {/* Sağ Sütun */}
                    <div className="space-y-8">
                        <SectionCard title="Pazarlama & Satış Stratejisi">
                           <div>
                                <h5 className="font-semibold text-white">Ana Mesaj:</h5>
                                <p className="text-sm text-gray-400 mb-4 italic">"{property.tanitimStratejisi.anaMesaj}"</p>
                                <h5 className="font-semibold text-white">Vurgulanacak Noktalar:</h5>
                                <ul className="space-y-2 mt-2">
                                    {property.tanitimStratejisi.vurgular.map((item, i) => <CheckListItem key={i}>{item}</CheckListItem>)}
                                </ul>
                           </div>
                        </SectionCard>
                        <SectionCard title="Kullanılacak Reklam Kanalları">
                            <div className="flex flex-wrap gap-2">
                                {property.reklamKanallari.map((kanal, i) => (
                                    <span key={i} className="bg-gray-700 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full">{kanal}</span>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </section>
    );
};