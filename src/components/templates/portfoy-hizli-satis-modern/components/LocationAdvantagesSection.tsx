import React from 'react';
import { Property } from '../types';

interface PropertyPlanSectionProps {
    property: Property;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode; highlight?: boolean }> = ({ title, children, highlight }) => (
    <div className={`h-full p-8 rounded-2xl border ${highlight ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-indigo-500/30' : 'bg-slate-900/50 border-slate-800'} backdrop-blur-sm`}>
        <h4 className={`font-bold text-xl mb-6 ${highlight ? 'text-indigo-300' : 'text-white'}`}>{title}</h4>
        {children}
    </div>
);

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start text-slate-300 mb-3 last:mb-0 group">
        <div className="mt-1 mr-3 p-0.5 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <span className="text-sm md:text-base">{children}</span>
    </li>
);

export const PropertyPlanSection: React.FC<PropertyPlanSectionProps> = ({ property }) => {
    return (
        <section className="py-24 bg-slate-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 rounded-full border border-slate-700 bg-slate-900 text-slate-400 text-xs font-medium mb-4">
                        ÖZEL RAPOR
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {property.planBaslik}
                    </h2>
                    <p className="text-xl text-indigo-400 font-medium max-w-3xl mx-auto">
                        {property.planAltBaslik}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                    
                    {/* Main Analysis - Wide */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <SectionCard title="Konum & Potansiyel" highlight>
                                <ul className="space-y-1">
                                    {property.konumAvantajlari.map((item, i) => <CheckListItem key={`adv-${i}`}>{item}</CheckListItem>)}
                                    {property.kullanimPotensiyeli.map((item, i) => <CheckListItem key={`pot-${i}`}>{item}</CheckListItem>)}
                                </ul>
                            </SectionCard>
                            
                            <SectionCard title="Pazarlama Stratejisi">
                                <div className="mb-6">
                                    <p className="text-sm text-slate-400 mb-1 uppercase tracking-wider font-semibold">Ana Mesaj</p>
                                    <p className="text-white italic border-l-2 border-indigo-500 pl-4">"{property.tanitimStratejisi.anaMesaj}"</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider font-semibold">Vurgular</p>
                                    <ul className="space-y-1">
                                        {property.tanitimStratejisi.vurgular.map((item, i) => <CheckListItem key={`highlight-${i}`}>{item}</CheckListItem>)}
                                    </ul>
                                </div>
                            </SectionCard>
                        </div>

                        {/* Target Audience Bar */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                            <h4 className="font-bold text-xl text-white mb-6">Hedef Alıcı Profili</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {property.hedefKitle.map((hedef, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold border border-slate-700">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-white mb-1">{hedef.baslik}</h5>
                                            <p className="text-sm text-slate-400">{hedef.aciklama}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Channels */}
                    <div className="lg:col-span-4">
                         <SectionCard title="Kanal Stratejisi">
                             <p className="text-slate-400 text-sm mb-6">Maksimum görünürlük için seçilen premium kanallar:</p>
                            <div className="flex flex-wrap gap-2">
                                {property.reklamKanallari.map((kanal, i) => (
                                    <span key={i} className="bg-slate-800 text-indigo-200 border border-slate-700 text-xs font-semibold px-4 py-2 rounded-lg w-full flex items-center justify-between group hover:border-indigo-500 transition-colors cursor-default">
                                        {kanal}
                                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                    </span>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-slate-800">
                                <h5 className="text-white font-bold mb-2">Satış Beklentisi</h5>
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                                    <p className="text-emerald-400 font-medium text-sm">{property.satisPlani.tahminiIlgi}</p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                </div>
            </div>
        </section>
    );
};