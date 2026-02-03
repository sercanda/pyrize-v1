import React from 'react';
import { Property } from '../types';

interface PropertyPlanSectionProps {
    property: Property;
}

const SectionTitle: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
    <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {title}
        </h2>
        <p className="text-lg text-slate-600 mt-3 max-w-3xl mx-auto">
            {subtitle}
        </p>
    </div>
);

const InfoCard: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className = "" }) => (
    <div className={`bg-white p-8 rounded-xl border border-slate-200 shadow-sm ${className}`}>
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
            {title}
        </h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-start p-2 rounded hover:bg-slate-50 transition-colors">
        <div className="flex-shrink-0 mt-1 mr-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </div>
        </div>
        <span className="text-slate-700 text-sm leading-relaxed">{children}</span>
    </div>
);

export const PropertyPlanSection: React.FC<PropertyPlanSectionProps> = ({ property }) => {
    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6">
                <SectionTitle title={property.planBaslik} subtitle={property.planAltBaslik} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* Column 1 */}
                    <InfoCard title="Mülk Kimlik Kartı">
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 text-sm">İl / İlçe</span>
                                <span className="font-semibold text-slate-900 text-sm">{property.konumAnalizi.ilIlce}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 text-sm">Mahalle</span>
                                <span className="font-semibold text-slate-900 text-sm">{property.konumAnalizi.mahalle}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-500 text-sm">Nitelik</span>
                                <span className="font-semibold text-slate-900 text-sm">{property.konumAnalizi.ozellik}</span>
                            </div>
                            <div className="mt-4 p-3 bg-slate-50 rounded text-sm text-slate-600">
                                {property.konumAnalizi.mevcutYapi}
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Lokasyon Avantajları">
                        {property.konumAvantajlari.map((item, i) => <CheckListItem key={i}>{item}</CheckListItem>)}
                    </InfoCard>

                    <InfoCard title="Kullanım Potansiyeli">
                        {property.kullanimPotensiyeli.map((item, i) => <CheckListItem key={i}>{item}</CheckListItem>)}
                    </InfoCard>

                    {/* Full Width or Large Columns */}
                    <div className="md:col-span-2 lg:col-span-2 bg-slate-900 rounded-xl p-8 text-white shadow-lg">
                         <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-4 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                            Pazarlama İletişim Stratejisi
                        </h3>
                        
                        <div className="mb-6">
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Ana İletişim Mesajı</p>
                            <p className="text-lg font-medium italic text-blue-100 border-l-4 border-blue-500 pl-4">"{property.tanitimStratejisi.anaMesaj}"</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Vurgu Noktaları</p>
                                <div className="flex flex-wrap gap-2">
                                    {property.tanitimStratejisi.vurgular.map((v, i) => (
                                        <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full">{v}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Satış Hedefi</p>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-bold text-white">{property.satisPlani.hedefSatisSuresi}</div>
                                    <span className="text-xs text-slate-400 max-w-[120px]">Pazar ortalamasının altında süre hedefi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                     <InfoCard title="Hedef Kitle">
                        {property.hedefKitle.map((k, i) => (
                            <div key={i} className="mb-4 last:mb-0">
                                <p className="font-bold text-slate-800 text-sm mb-1">{k.baslik}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{k.aciklama}</p>
                            </div>
                        ))}
                    </InfoCard>
                </div>
            </div>
        </section>
    );
};