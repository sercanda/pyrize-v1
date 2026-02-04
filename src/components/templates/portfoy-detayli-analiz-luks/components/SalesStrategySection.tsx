import React from 'react';
import { SalesSystemStep } from '../types';

interface BespokeJourneySectionProps {
    steps: SalesSystemStep[];
}

const StepCard: React.FC<{ step: SalesSystemStep, isLast: boolean }> = ({ step, isLast }) => (
    <div className="relative pl-12 pb-16">
        {!isLast && <div className="absolute left-5 top-5 -ml-px w-0.5 h-full bg-gray-700"></div>}
        <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border-2 gold-border text-white">
            {step.icon}
        </div>
        <div className="bg-transparent relative">
            <span className="text-sm font-semibold gold-text tracking-widest uppercase">{step.gun}</span>
            <h3 className="text-3xl font-semibold text-white mb-4 mt-1">{step.baslik}</h3>
            <div className="mb-4">
                <ul className="space-y-2 text-base text-gray-400">
                    {step.neYapiyoruz.map((action, i) => (
                        <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span>{action}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-md border-l-4 border-yellow-500/50 mt-5">
                <p className="text-gray-300"><strong className="text-white font-medium">Sizin İçin Anlamı:</strong> {step.kazanciniz}</p>
            </div>
        </div>
    </div>
);

export const BespokeJourneySection: React.FC<BespokeJourneySectionProps> = ({ steps }) => {
    return (
        <section className="py-24 bg-[#111111]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                     <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Size Özel <span className="gold-text">Yol Haritamız</span>
                    </h2>
                    <p className="text-lg text-gray-400 mt-4">
                        Portföyünüzün değerini en üst düzeye çıkarmak için tasarladığımız 4 aşamalı imza sürecimiz.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} isLast={index === steps.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
};