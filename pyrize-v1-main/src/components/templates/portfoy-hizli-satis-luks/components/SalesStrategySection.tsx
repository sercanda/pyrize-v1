import React from 'react';
import { SalesSystemStep } from '../types';

interface SalesProcessSectionProps {
    steps: SalesSystemStep[];
}

const StepCard: React.FC<{ step: SalesSystemStep, isLast: boolean }> = ({ step, isLast }) => (
    <div className="relative pl-12 pb-12">
        {!isLast && <div className="absolute left-5 top-5 -ml-px w-0.5 h-full bg-gray-700"></div>}
        <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-yellow-600 text-white shadow-lg">
            {step.icon}
        </div>
        <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 hover:border-amber-600 transition-colors duration-300 relative">
            <span className="absolute -top-3 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">{step.gun}</span>
            <h3 className="text-2xl font-bold text-white mb-4 mt-2">{step.baslik}</h3>
            <div className="mb-6">
                <h4 className="font-semibold text-amber-300 mb-2">Ne yapıyorum:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {step.neYapiyorum.map((action, i) => <li key={i}>{action}</li>)}
                </ul>
            </div>
            <div className="bg-green-500/10 p-4 rounded-md border-l-4 border-green-400">
                <h4 className="font-semibold text-green-300 mb-1">💰 Sizin kazancınız:</h4>
                <p className="text-green-200">{step.sizinKazanciniz}</p>
            </div>
            {step.maliyetNotu && (
                 <div className="mt-4 text-sm text-gray-400 border-t border-gray-700 pt-4">
                    <p>{step.maliyetNotu}</p>
                    <p className="font-bold text-teal-400">{step.ucretNotu}</p>
                 </div>
            )}
            {step.ekstraIcerik?.type === 'table' && (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-amber-300 uppercase bg-gray-700/50">
                            <tr>
                                {step.ekstraIcerik.headers.map(header => <th key={header} scope="col" className="px-4 py-2">{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {step.ekstraIcerik.rows.map((row, i) => (
                                <tr key={i} className="bg-gray-800 border-b border-gray-700">
                                    {row.map((cell, j) => <td key={j} className={`px-4 py-2 ${j > 0 ? 'font-medium' : ''}`}>{cell}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
);

export const SalesProcessSection: React.FC<SalesProcessSectionProps> = ({ steps }) => {
    return (
        <section id="sales-process" className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                     <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                        5 Aşamalı <span className="text-amber-400">Aksiyon Odaklı Satış Süreci</span>
                    </h2>
                    <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                        Mülkünüzü en yüksek fiyata, en etkili şekilde satmanın kanıtlanmış formülü.
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