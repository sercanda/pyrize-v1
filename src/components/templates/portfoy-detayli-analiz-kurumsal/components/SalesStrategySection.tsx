import React from 'react';
import { SalesSystemStep } from '../types';

interface SalesProcessSectionProps {
    steps: SalesSystemStep[];
}

const StepCard: React.FC<{ step: SalesSystemStep, isLast: boolean }> = ({ step, isLast }) => (
    <div className="flex gap-6 pb-12 relative">
        {/* Timeline Connector */}
        {!isLast && <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-200"></div>}
        
        {/* Icon Node */}
        <div className="flex-shrink-0 z-10">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-4 border-white">
                {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
            </div>
        </div>

        {/* Content Card */}
        <div className="flex-grow">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{step.baslik}</h3>
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{step.gun}</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Operasyonel Süreç</h4>
                        <ul className="space-y-2">
                            {step.neYapiyoruz.map((action, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-600">
                                    <svg className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    {action}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Yatırımcı Kazanımı</h4>
                        <p className="text-slate-800 font-medium text-sm leading-relaxed">{step.kazanciniz}</p>
                        
                        {step.maliyetNotu && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500">{step.maliyetNotu}</span>
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{step.ucretNotu}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const SalesProcessSection: React.FC<SalesProcessSectionProps> = ({ steps }) => {
    return (
        <section id="sales-process" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                     <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Yol Haritası</span>
                     <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                        5 Aşamalı Satış ve Pazarlama Planı
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Mülkünüzün pazara çıkışından kapanış işlemine kadar sürecek profesyonel ve şeffaf yönetim süreci.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} isLast={index === steps.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
};