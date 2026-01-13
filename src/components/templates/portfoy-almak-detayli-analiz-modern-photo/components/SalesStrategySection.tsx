
import React from 'react';
import { SalesSystemStep } from '../types';

interface SalesProcessSectionProps {
    steps: SalesSystemStep[];
}

export const SalesProcessSection: React.FC<SalesProcessSectionProps> = ({ steps }) => {
    return (
        <section className="h-full flex flex-col justify-center">
            <div className="text-center mb-16 print:mb-10 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-4 print:text-3xl print:text-black">6 Adımlı Profesyonel Satış Sistemi</h2>
                <p className="text-slate-500 print:text-black print:font-medium">
                    Mülkünüzü en yüksek fiyata, en hızlı şekilde satmak için tasarlanmış özel formül.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-2 gap-6 print:gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="bg-slate-900/40 border border-white/5 p-8 print:p-6 rounded-2xl hover:bg-slate-900/80 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden print:bg-white print:border-slate-800 print:shadow-none print:break-inside-avoid print:border-2">
                        
                        {/* Day Badge */}
                        <div className="absolute top-4 right-4 text-xs font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded uppercase tracking-wider print:border-slate-600 print:text-black">
                            {step.gun}
                        </div>

                        {/* Icon */}
                        <div className="mb-6 w-12 h-12 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform shadow-lg print:bg-white print:border-slate-400 print:text-indigo-900">
                            {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-white mb-4 print:text-black">{step.baslik}</h3>
                        
                        <div className="space-y-3 mb-6 flex-grow">
                            {step.neYapiyoruz.map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-slate-400 print:text-black">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 print:bg-indigo-900"></span>
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Benefit Highlight */}
                        {step.kazanciniz && (
                            <div className="mt-auto pt-4 border-t border-white/5 print:border-slate-400">
                                <p className="text-sm text-slate-200 font-medium print:text-black">{step.kazanciniz}</p>
                            </div>
                        )}

                        {/* Cost Highlight (if exists) */}
                        {step.ucretNotu && (
                            <div className="mt-4 bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg print:bg-emerald-50 print:border-emerald-900">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-slate-400 print:text-black">Piyasa Değeri:</span>
                                    <span className="text-slate-400 line-through print:text-slate-800">{step.maliyetNotu}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold">
                                    <span className="text-emerald-400 print:text-emerald-900">Sizin İçin:</span>
                                    <span className="text-white text-sm print:text-black">{step.ucretNotu}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
