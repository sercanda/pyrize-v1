
import React from 'react';
import { Property } from '../types';

interface HeroSectionProps {
    property: Property;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ property }) => {
  const { presentation } = property;

  return (
    <section className="relative w-full min-h-[550px] flex flex-col justify-center bg-slate-950 border-b border-white/10 overflow-hidden print:bg-white print:border-b-2 print:border-black print:min-h-0 print:py-0 print:block">
      
      {/* 1. ARCHITECTURAL BACKGROUND (Screen Only) */}
      <div className="absolute inset-0 z-0 pointer-events-none print:hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-slate-950"></div>
        
        {/* Spotlight Effect (Top Center) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
        
        {/* Architectural Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"></div>
        
        {/* Decor Lines */}
        <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5 border-r border-dashed border-white/5"></div>
        <div className="absolute right-10 top-0 bottom-0 w-px bg-white/5 border-r border-dashed border-white/5"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-20 print:px-0">
        
        {/* 2. HEADER INFO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-12 print:border-black print:mb-8 print:pb-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse print:bg-black"></div>
                <span className="text-indigo-400 font-mono text-sm tracking-widest uppercase print:text-black">
                    {presentation.reportTitle}
                </span>
            </div>
            <div className="mt-2 md:mt-0">
                <span className="text-slate-500 font-mono text-sm tracking-widest uppercase print:text-slate-600">
                    {presentation.dateRef}
                </span>
            </div>
        </div>

        {/* 3. MASSIVE TYPOGRAPHY */}
        <div className="mb-12 print:mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tighter print:text-black uppercase">
                {presentation.mainTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700 print:text-slate-400">{presentation.mainTitleHighlight}</span>
            </h1>
            <div className="flex items-center gap-4 mt-4">
                <div className="h-1 w-24 bg-indigo-600 print:bg-black"></div>
                <h2 className="text-2xl md:text-3xl font-light text-slate-300 tracking-wide print:text-black">
                    {presentation.subTitle}
                </h2>
            </div>
        </div>

        {/* 4. DETAILS CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-tr-3xl border-l-4 border-l-indigo-500 print:bg-transparent print:border-none print:p-0 print:border-l-4 print:border-l-black print:pl-6">
                <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed print:text-black">
                    <span className="text-white font-semibold block mb-2 print:text-black">{presentation.description.location}</span>
                    {presentation.description.netArea} {presentation.description.text.split('lüks daire')[0]}
                    <strong className="text-white font-bold mx-1 print:text-black">{presentation.description.type}</strong> 
                    {presentation.description.text.split('lüks daire')[1]}
                </p>
            </div>
            
            {/* Abstract Stats (Visual Balance) */}
            <div className="hidden md:flex justify-end gap-12 text-right opacity-60 print:hidden">
                {presentation.stats.map((stat, idx) => (
                    <div key={idx}>
                        <span className="block text-3xl font-bold text-white">
                            {stat.value}<span className="text-sm align-top text-indigo-400">{stat.unit}</span>
                        </span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};
