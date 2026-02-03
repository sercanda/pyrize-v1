import React from 'react';
import { SalesSystemStep } from '../types';

interface SalesProcessSectionProps {
    steps: SalesSystemStep[];
}

const StepCard: React.FC<{ step: SalesSystemStep, isLast: boolean }> = ({ step, isLast }) => (
    <div className="relative pl-12 pb-12">
        {!isLast && <div className="absolute left-5 top-5 -ml-px w-0.5 h-full bg-slate-300"></div>}
        <div className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-800 text-white shadow-lg">
            {React.cloneElement(step.icon, { className: "w-5 h-5" })}
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-300 relative">
            <span className="absolute -top-3 left-4 bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full">{step.gun}</span>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-2">{step.baslik}</h3>
            <div className="mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Ne yapıyoruz:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {step.neYapiyorum.map((action, i) => <li key={i}>{action}</li>)}
                </ul>
            </div>
            <div className="bg-green-100/70 p-4 rounded-md border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 mb-1">💰 Sizin kazancınız:</h4>
                <p className="text-green-700">{step.sizinKazanciniz}</p>
            </div>
            {step.maliyetNotu && (
                 <div className="mt-4 text-sm text-slate-500 border-t border-slate-200 pt-4">
                    <p>{step.maliyetNotu}</p>
                    <p className="font-bold text-teal-600">{step.ucretNotu}</p>
                 </div>
            )}
            {step.ekstraIcerik?.type === 'table' && (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-blue-800 uppercase bg-slate-100">
                            <tr>
                                {step.ekstraIcerik.headers.map(header => <th key={header} scope="col" className="px-4 py-2">{header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {step.ekstraIcerik.rows.map((row, i) => (
                                <tr key={i} className="bg-white border-b border-slate-200">
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
        <section id="sales-process" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                     <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        5 Adımda <span className="text-blue-800">Kurumsal Satış Sistemimiz</span>
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Mülkünüzü en yüksek fiyata, en güvenli şekilde satmanın kanıtlanmış formülü.
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