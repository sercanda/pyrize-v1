
import React from 'react';
import { Property } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

interface PropertyPlanSectionProps {
    property: Property;
    theme: ThemeConfig;
}

export const PropertyPlanSection: React.FC<PropertyPlanSectionProps> = ({ property, theme }) => {
    const konumEtiketi =
        property.konumAnalizi.mahalle ||
        property.konumAnalizi.ilIlce ||
        'Bölge';
    const microLocationText =
        property.marketAnalysis.microLocationValue ||
        `${konumEtiketi} konumu stratejik avantajlar sunuyor.`;
    const mevcutYapiText = property.konumAnalizi.mevcutYapi
        ? `Mevcut yapı: ${property.konumAnalizi.mevcutYapi}.`
        : '';
    const projeEtiketi =
        property.planBaslik?.split(':')[0] ||
        konumEtiketi ||
        'Bu proje';

    return (
        <section className="space-y-12 print:space-y-10">
             {/* Main Strategy Text */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 print:gap-12">
                <div className="flex flex-col justify-center">
                    <span className={`${theme.textAccent} font-bold tracking-wider uppercase text-xs mb-4 block print:text-indigo-900`}>Potansiyel & Avantajlar</span>
                    <h2 className={`text-4xl md:text-5xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-8 leading-tight print:text-black`}>
                        {property.konumAnalizi.mahalle || property.konumAnalizi.ilIlce || 'Bölgede'}'da <br/> <span className={`${theme.textSecondary} italic font-serif print:text-slate-800`}>Lüks Yaşam.</span>
                    </h2>
                    <div className="space-y-6 mb-8">
                        <p className={`${theme.textSecondary} text-lg font-light leading-relaxed print:text-black`}>
                            {microLocationText} {mevcutYapiText}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {property.konumAvantajlari.map((av, i) => (
                            <div key={i} className={`flex items-start gap-3 group ${theme.bgCard} p-4 rounded-xl border ${theme.borderColor} hover:${theme.borderAccent} transition-colors print:bg-white print:border-slate-800`}>
                                <div className={`mt-1 w-1.5 h-1.5 rounded-full ${theme.accentBg} flex-shrink-0 group-hover:scale-150 transition-transform print:bg-indigo-900`}></div>
                                <p className={`text-sm font-medium ${theme.textSecondary} group-hover:${theme.isDark ? 'text-white' : 'text-slate-900'} transition-colors print:text-black`}>{av}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`${theme.bgSurface} p-8 rounded-[2rem] border ${theme.borderColor} relative overflow-hidden group hover:${theme.borderAccent} transition-all print:bg-white print:border-2 print:border-slate-800`}>
                    <div className={`absolute top-0 right-0 ${theme.isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'} w-32 h-32 rounded-bl-[4rem] print:bg-indigo-50`}></div>
                    <h3 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-8 relative z-10 print:text-black`}>Tanıtım Stratejisi</h3>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <p className={`text-xs ${theme.textAccent} uppercase font-bold mb-1 print:text-indigo-900`}>Ana Mesaj</p>
                            <p className={`text-xl ${theme.isDark ? 'text-white' : 'text-slate-900'} font-serif italic print:text-black`}>"{property.tanitimStratejisi.anaMesaj}"</p>
                        </div>
                         <div>
                            <p className={`text-xs ${theme.textSecondary} uppercase font-bold mb-2 print:text-black`}>Öne Çıkarılacak Vurgular</p>
                            <div className="flex flex-wrap gap-2">
                                {property.tanitimStratejisi.vurgular.map((v, i) => (
                                    <span key={i} className={`text-xs ${theme.isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} border ${theme.textSecondary} px-3 py-1 rounded-full print:bg-white print:border-slate-800 print:text-black`}>
                                        {v}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={`p-4 ${theme.isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'} rounded-xl border ${theme.borderAccent} print:bg-indigo-50 print:border-indigo-900`}>
                             <p className={`text-xs ${theme.textAccent} uppercase font-bold mb-1 print:text-indigo-900`}>Görsel İçerik Planı</p>
                             <p className={`text-sm ${theme.textSecondary} print:text-black`}>{property.tanitimStratejisi.gorselIcerikPlani}</p>
                        </div>
                    </div>
                </div>
             </div>

             {/* Cards Row: Audience & Channels + NEW CARDS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-6">
                 {/* 01 Target Audience */}
                 <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor} print:bg-white print:border-slate-800 print:border-2`}>
                    <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3 print:text-black`}>
                        <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} flex items-center justify-center text-indigo-400 text-sm print:bg-indigo-100 print:text-indigo-900`}>01</span>
                        Hedef Kitle Profili
                    </h3>
                    <div className="space-y-6">
                        {property.hedefKitle.map((kitle, idx) => (
                            <div key={idx} className={`border-l-2 ${theme.isDark ? 'border-slate-800' : 'border-slate-300'} pl-4 hover:border-indigo-500 transition-colors group print:border-slate-400`}>
                                <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} font-bold mb-1 group-hover:text-indigo-400 transition-colors print:text-black`}>{kitle.baslik}</h4>
                                <p className={`text-sm ${theme.textSecondary} print:text-black`}>{kitle.aciklama}</p>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* 02 Ad Channels */}
                 <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor} print:bg-white print:border-slate-800 print:border-2`}>
                    <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3 print:text-black`}>
                        <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex items-center justify-center text-emerald-400 text-sm print:bg-emerald-100 print:text-emerald-900`}>02</span>
                        Reklam Kanalları
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {property.reklamKanallari.map((kanal, i) => (
                            <div key={i} className={`flex items-center gap-2 p-3 ${theme.bgPrimary} rounded-lg border ${theme.borderColor} print:bg-slate-50 print:border-slate-400`}>
                                <svg className="w-4 h-4 text-emerald-500 print:text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className={`text-sm ${theme.textSecondary} print:text-black`}>{kanal}</span>
                            </div>
                        ))}
                    </div>
                    <div className={`mt-6 p-4 ${theme.isDark ? 'bg-slate-800/50' : 'bg-slate-100'} rounded-xl text-center border ${theme.borderColor} print:bg-emerald-50 print:border-emerald-900`}>
                        <p className={`text-xs ${theme.textSecondary} uppercase tracking-widest mb-1 print:text-slate-900`}>Hedef Erişim</p>
                        <p className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} print:text-black`}>15,000+ <span className={`text-sm font-normal ${theme.textSecondary} print:text-black`}>Kişi</span></p>
                    </div>
                 </div>

                 {/* 03 Investment Potential (NEW) */}
                 <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor} print:bg-white print:border-slate-800 print:border-2`}>
                    <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3 print:text-black`}>
                        <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-amber-500/20' : 'bg-amber-100'} flex items-center justify-center text-amber-400 text-sm print:bg-amber-100 print:text-amber-900`}>03</span>
                        Yatırım Potansiyeli
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-amber-500 print:text-amber-900">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <div>
                                <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-sm font-bold print:text-black`}>Kira Çarpanı Avantajı</h4>
                                <p className={`text-xs ${theme.textSecondary} mt-1 print:text-black`}>Site özellikleri ve m² büyüklüğü, bölgedeki standart dairelere göre %30 daha yüksek kira geliri potansiyeli sunar.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <div className="mt-1 text-amber-500 print:text-amber-900">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-sm font-bold print:text-black`}>Değer Koruma</h4>
                                <p className={`text-xs ${theme.textSecondary} mt-1 print:text-black`}>{projeEtiketi} gibi marka projeler, piyasa dalgalanmalarında değerini koruyan "Güvenli Liman" niteliğindedir.</p>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* 04 Social Life (NEW) */}
                 <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor} print:bg-white print:border-slate-800 print:border-2`}>
                    <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3 print:text-black`}>
                        <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-rose-500/20' : 'bg-rose-100'} flex items-center justify-center text-rose-400 text-sm print:bg-rose-100 print:text-rose-900`}>04</span>
                        Sosyal Yaşam
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                             <div className="mt-1 text-rose-500 print:text-rose-900">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <div>
                                <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-sm font-bold print:text-black`}>Seçkin Komşuluk</h4>
                                <p className={`text-xs ${theme.textSecondary} mt-1 print:text-black`}>Benzer sosyo-kültürel seviyedeki ailelerden oluşan, huzurlu ve saygın bir site ortamı.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                             <div className="mt-1 text-rose-500 print:text-rose-900">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <div>
                                <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-sm font-bold print:text-black`}>Güvenli Site</h4>
                                <p className={`text-xs ${theme.textSecondary} mt-1 print:text-black`}>7/24 kamera sistemi, şifreli giriş ve apartman görevlisi ile tam güvenlik.</p>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
        </section>
    );
};
