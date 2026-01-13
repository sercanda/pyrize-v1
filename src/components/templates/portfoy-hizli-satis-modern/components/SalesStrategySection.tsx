import React from 'react';
import { SalesSystemStep } from '../types';

interface SalesProcessSectionProps {
    steps: SalesSystemStep[];
}

const StepCard: React.FC<{ step: SalesSystemStep, index: number, isLast: boolean }> = ({ step, index, isLast }) => (
    <div className="relative pl-8 md:pl-0">
        {/* Desktop Center Line Layout */}
        <div className="hidden md:flex justify-between items-start group">
             {/* Left Side (Even Index: Content, Odd Index: Date/Title) */}
            <div className={`w-[45%] ${index % 2 === 0 ? 'text-right pr-12' : 'pl-12 order-last'}`}>
                <div className={`bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 justify-between">
                        {step.baslik}
                        <span className="text-indigo-500 text-xs border border-indigo-500/30 px-2 py-1 rounded bg-indigo-500/10">{step.gun}</span>
                    </h3>
                    <ul className={`space-y-2 text-sm text-slate-400 ${index % 2 === 0 ? 'items-end' : ''}`}>
                         {step.neYapiyorum.map((action, i) => (
                             <li key={i} className="flex items-center gap-2 text-slate-300">
                                {index % 2 !== 0 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>}
                                {action}
                                {index % 2 === 0 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 ml-auto"></span>}
                             </li>
                         ))}
                    </ul>
                    
                    {step.ekstraIcerik?.type === 'table' && (
                        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-700">
                            <table className="w-full text-xs text-left text-slate-300">
                                <thead className="text-xs text-indigo-300 uppercase bg-slate-800">
                                    <tr>
                                        {step.ekstraIcerik.headers.map(header => <th key={header} scope="col" className="px-3 py-2">{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {step.ekstraIcerik.rows.map((row, i) => (
                                        <tr key={i} className="bg-slate-900 border-b border-slate-800 last:border-0">
                                            {row.map((cell, j) => <td key={j} className="px-3 py-2">{cell}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Center Icon/Dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center h-full">
                <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-800 text-indigo-400 flex items-center justify-center z-10 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-300 group-hover:border-indigo-500">
                    {step.icon}
                </div>
                {!isLast && <div className="w-0.5 flex-grow bg-gradient-to-b from-slate-800 via-indigo-900 to-slate-800 my-2"></div>}
            </div>

            {/* Right Side (Opposite of Left) - Used for "Gain" info */}
            <div className={`w-[45%] pt-4 ${index % 2 === 0 ? 'pl-12' : 'text-right pr-12 order-first'}`}>
                 <div className="text-emerald-400 font-medium mb-1 text-sm flex items-center gap-2">
                    {index % 2 === 0 ? 'Sizin Kazancınız:' : ':Sizin Kazancınız'}
                 </div>
                 <p className="text-slate-300 font-light italic text-lg">"{step.sizinKazanciniz}"</p>
                 
                 {step.maliyetNotu && (
                     <div className={`mt-4 text-xs text-slate-500 border-t border-slate-800/50 pt-2 ${index % 2 !== 0 ? 'ml-auto' : ''} max-w-xs`}>
                        <p>{step.maliyetNotu}</p>
                        <p className="font-bold text-emerald-400">{step.ucretNotu}</p>
                     </div>
                 )}
            </div>
        </div>

        {/* Mobile Layout (Vertical Stack) */}
        <div className="md:hidden pb-12 relative border-l-2 border-slate-800 ml-4">
             <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-slate-900 border-2 border-indigo-600 text-white flex items-center justify-center shadow-lg">
                <div className="scale-75">{step.icon}</div>
             </div>
             <div className="pl-8">
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1 block">{step.gun}</span>
                <h3 className="text-xl font-bold text-white mb-3">{step.baslik}</h3>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 mb-4">
                    <ul className="space-y-2 mb-4">
                         {step.neYapiyorum.map((action, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-indigo-500 mt-1">•</span> {action}
                             </li>
                         ))}
                    </ul>
                     <div className="bg-emerald-900/10 p-3 rounded border border-emerald-900/30">
                         <p className="text-emerald-400 text-sm font-medium">Kazancınız: {step.sizinKazanciniz}</p>
                     </div>
                </div>
             </div>
        </div>
    </div>
);

export const SalesProcessSection: React.FC<SalesProcessSectionProps> = ({ steps }) => {
    return (
        <section id="sales-process" className="py-24 bg-slate-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                     <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        5 Adımda <span className="text-gradient">Satış Yolculuğu</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Karmaşık emlak sürecini sizin için şeffaf, planlı ve sonuç odaklı bir yol haritasına dönüştürdük.
                    </p>
                </div>
                
                <div className="max-w-5xl mx-auto relative">
                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} index={index} isLast={index === steps.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
};