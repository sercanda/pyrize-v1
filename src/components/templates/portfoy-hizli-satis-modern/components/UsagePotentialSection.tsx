import React from 'react';
import { DigitalMarketingTool } from '../types';

interface DigitalMarketingPowerSectionProps {
    tools: DigitalMarketingTool[];
}

const ToolCard: React.FC<{ tool: DigitalMarketingTool; index: number }> = ({ tool, index }) => (
    <div className="relative group bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-indigo-500 transition-colors duration-300 overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
        
        <div className="relative z-10">
            <div className="mb-6 inline-flex p-3 rounded-xl bg-slate-800/50 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300">
                {tool.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                {tool.description}
            </p>
        </div>
    </div>
);

export const DigitalMarketingPowerSection: React.FC<DigitalMarketingPowerSectionProps> = ({ tools }) => {
    return (
        <section id="digital-power" className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                         <span className="text-indigo-500 font-semibold tracking-wider text-sm uppercase mb-2 block">Teknoloji Odaklı Yaklaşım</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            <span className="text-white">Dijital Pazarlama</span> Gücümüz
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Mülkünüzü sadece listelemiyoruz; veri, hedefleme ve premium içerikle doğru alıcıya ulaştırıyoruz.
                        </p>
                    </div>
                    <div className="hidden lg:block">
                        <button onClick={() => document.getElementById('sales-process')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-white font-semibold hover:text-indigo-400 transition-colors">
                            Satış Sürecini Gör
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}