
import React from 'react';
import type { Property, Consultant } from '../types';

interface HeroSectionProps {
    property?: Property;
    consultant?: Consultant;
    heroDescription?: string;
    heroHighlight?: string;
    reportDate?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = (_props) => {
    return (
        <header className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900 print:min-h-auto print:py-12 print:bg-white">
            {/* Background Image with Darker Corporate Overlay - Hidden on Print to save ink */}
            <div className="absolute inset-0 z-0 print:hidden">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-10 pb-12">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-7 space-y-6 text-white print:text-slate-900">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-50 text-xs font-semibold uppercase tracking-widest print:border-slate-200 print:bg-slate-100 print:text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 print:bg-emerald-600"></span>
                            Gizli ve Kişiye Özel Rapor
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight font-[Poppins]">
                            Stratejik Mülk <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400 print:text-blue-700 print:bg-none">Değerleme Analizi</span>
                        </h1>

                        <p className="text-xl text-slate-300 max-w-2xl font-light leading-relaxed print:text-slate-600">
                            Güzelyalı Mahallesi 1547 Ada / 8 Parsel için hazırlanmış, detaylı piyasa verileri ve satış projeksiyonu içeren kurumsal yetki sunumu.
                        </p>

                        {/* Buttons Removed as requested */}
                    </div>

                    {/* Summary Card / Key Metrics */}
                    <div className="lg:col-span-5">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden print:bg-white print:border-slate-200 print:shadow-none print:border">
                            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2 print:text-slate-900">
                                <svg className="w-5 h-5 text-yellow-400 print:text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                Özet Göstergeler
                            </h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4 print:border-slate-100">
                                    <span className="text-slate-400 text-sm print:text-slate-500">Tahmini Değer Aralığı</span>
                                    <span className="text-2xl font-bold text-white print:text-slate-900">₺8.6M - ₺9.25M</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-4 print:border-slate-100">
                                    <span className="text-slate-400 text-sm print:text-slate-500">Hedef Satış Süresi</span>
                                    <span className="text-xl font-semibold text-emerald-400 print:text-emerald-700">45 - 75 Gün</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm print:text-slate-500">Pazar Eğilimi</span>
                                    <span className="flex items-center gap-2 text-white font-medium print:text-slate-900">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Yükselişte
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-500 flex justify-between items-center print:border-slate-100">
                                <span>REF: GZL-1547-8</span>
                                <span>{new Date().toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};