
import React from 'react';
import { Property } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

export type LocationVariant = 'default' | 'compact' | 'editorial' | 'inline' | 'minimal';

interface PropertyPlanSectionProps {
    property: Property;
    theme: ThemeConfig;
    variant?: LocationVariant;
}

export const PropertyPlanSection: React.FC<PropertyPlanSectionProps> = ({ property, theme, variant = 'default' }) => {
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

    // Yatirim & Sosyal data - prefer AI data, fallback to hardcoded
    const yatirimItems = (property as any).yatirimPotansiyeli?.length > 0
        ? (property as any).yatirimPotansiyeli
        : [
            { baslik: 'Kira Çarpanı Avantajı', aciklama: `Site özellikleri ve m² büyüklüğü, bölgedeki standart dairelere göre %30 daha yüksek kira geliri potansiyeli sunar.` },
            { baslik: 'Değer Koruma', aciklama: `${projeEtiketi} gibi marka projeler, piyasa dalgalanmalarında değerini koruyan "Güvenli Liman" niteliğindedir.` },
          ];

    const sosyalItems = (property as any).sosyalYasam?.length > 0
        ? (property as any).sosyalYasam
        : [
            { baslik: 'Seçkin Komşuluk', aciklama: 'Benzer sosyo-kültürel seviyedeki ailelerden oluşan, huzurlu ve saygın bir site ortamı.' },
            { baslik: 'Güvenli Site', aciklama: '7/24 kamera sistemi, şifreli giriş ve apartman görevlisi ile tam güvenlik.' },
          ];

    if (variant === 'minimal') return <MinimalLayout property={property} theme={theme} konumEtiketi={konumEtiketi} microLocationText={microLocationText} />;
    if (variant === 'inline') return <InlineLayout property={property} theme={theme} konumEtiketi={konumEtiketi} microLocationText={microLocationText} mevcutYapiText={mevcutYapiText} yatirimItems={yatirimItems} />;
    if (variant === 'editorial') return <EditorialLayout property={property} theme={theme} konumEtiketi={konumEtiketi} microLocationText={microLocationText} mevcutYapiText={mevcutYapiText} yatirimItems={yatirimItems} sosyalItems={sosyalItems} />;
    if (variant === 'compact') return <CompactLayout property={property} theme={theme} konumEtiketi={konumEtiketi} microLocationText={microLocationText} mevcutYapiText={mevcutYapiText} yatirimItems={yatirimItems} sosyalItems={sosyalItems} />;

    // DEFAULT variant — original layout
    return (
        <section className="space-y-12 print:space-y-10" data-section="location-advantages">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 print:gap-12">
                <div className="flex flex-col justify-center">
                    <span className={`${theme.textAccent} font-bold tracking-wider uppercase text-xs mb-4 block print:text-indigo-900`}>Potansiyel & Avantajlar</span>
                    <h2 className={`text-4xl md:text-5xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-8 leading-tight print:text-black`}>
                        {konumEtiketi}'da <br/> <span className={`${theme.textSecondary} italic font-serif print:text-slate-800`}>Lüks Yaşam.</span>
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
                                <p className={`text-sm font-medium ${theme.textSecondary} print:text-black`}>{av}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <StrategyCard property={property} theme={theme} />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-6">
                 <HedefKitleCard property={property} theme={theme} />
                 <ReklamKanallariCard property={property} theme={theme} />
                 <YatirimCard items={yatirimItems} theme={theme} />
                 <SosyalCard items={sosyalItems} theme={theme} />
             </div>
        </section>
    );
};

/* ═══════════════════════════════════════════
   COMPACT VARIANT — fits A4, reduced spacing
   ═══════════════════════════════════════════ */
function CompactLayout({ property, theme, konumEtiketi, microLocationText, mevcutYapiText, yatirimItems, sosyalItems }: any) {
    return (
        <section className="space-y-4" data-section="location-advantages">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col justify-center">
                    <span className={`${theme.textAccent} font-bold tracking-wider uppercase text-[10px] mb-2 block`}>Potansiyel & Avantajlar</span>
                    <h2 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-3 leading-tight`}>
                        {konumEtiketi}'da <span className={`${theme.textSecondary} italic font-serif`}>Lüks Yaşam.</span>
                    </h2>
                    <p className={`${theme.textSecondary} text-sm leading-relaxed mb-3`}>
                        {microLocationText} {mevcutYapiText}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {property.konumAvantajlari.slice(0, 4).map((av: string, i: number) => (
                            <div key={i} className={`flex items-start gap-2 ${theme.bgCard} p-2.5 rounded-lg border ${theme.borderColor}`}>
                                <div className={`mt-1 w-1 h-1 rounded-full ${theme.accentBg} flex-shrink-0`}></div>
                                <p className={`text-xs ${theme.textSecondary}`}>{av}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <StrategyCardCompact property={property} theme={theme} />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <HedefKitleCompact property={property} theme={theme} />
                <ReklamKanallariCompact property={property} theme={theme} />
                <YatirimCompact items={yatirimItems} theme={theme} />
                <SosyalCompact items={sosyalItems} theme={theme} />
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════
   EDITORIAL VARIANT — Premium luxury layout
   ═══════════════════════════════════════════ */
function EditorialLayout({ property, theme, konumEtiketi, microLocationText, mevcutYapiText, yatirimItems, sosyalItems }: any) {
    return (
        <section className="space-y-6 max-w-4xl mx-auto" data-section="location-advantages">
            <div className="text-center mb-4">
                <div className={`h-px w-16 mx-auto mb-4 ${theme.accentBg}`}></div>
                <span className={`${theme.textAccent} font-semibold tracking-[0.3em] uppercase text-[10px]`}>Konum Analizi</span>
                <h2 className={`text-3xl font-light ${theme.isDark ? 'text-white' : 'text-slate-900'} mt-2 font-serif italic`}>
                    {konumEtiketi}'da Yaşam
                </h2>
                <p className={`${theme.textSecondary} text-sm mt-3 max-w-lg mx-auto`}>
                    {microLocationText} {mevcutYapiText}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {property.konumAvantajlari.slice(0, 3).map((av: string, i: number) => (
                    <div key={i} className={`text-center p-3 border-t ${theme.borderAccent}`}>
                        <p className={`text-xs ${theme.textSecondary}`}>{av}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-xl border ${theme.borderColor} ${theme.bgCard}`}>
                    <p className={`text-[10px] ${theme.textAccent} uppercase tracking-wider font-bold mb-2`}>Tanıtım Stratejisi</p>
                    <p className={`text-sm ${theme.isDark ? 'text-white' : 'text-slate-900'} font-serif italic mb-3`}>"{property.tanitimStratejisi.anaMesaj}"</p>
                    <div className="flex flex-wrap gap-1.5">
                        {property.tanitimStratejisi.vurgular.slice(0, 4).map((v: string, i: number) => (
                            <span key={i} className={`text-[10px] ${theme.isDark ? 'bg-white/5' : 'bg-black/5'} ${theme.textSecondary} px-2 py-0.5 rounded-full`}>{v}</span>
                        ))}
                    </div>
                </div>
                <HedefKitleCompact property={property} theme={theme} />
            </div>

            <div className="grid grid-cols-3 gap-3">
                <ReklamKanallariCompact property={property} theme={theme} />
                <YatirimCompact items={yatirimItems} theme={theme} />
                <SosyalCompact items={sosyalItems} theme={theme} />
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════
   INLINE VARIANT — HizliSatis horizontal
   ═══════════════════════════════════════════ */
function InlineLayout({ property, theme, konumEtiketi, microLocationText, mevcutYapiText, yatirimItems }: any) {
    return (
        <section className="space-y-4" data-section="location-advantages">
            <div>
                <span className={`${theme.textAccent} font-bold tracking-wider uppercase text-[10px] mb-1 block`}>Konum & Strateji</span>
                <h2 className={`text-xl font-black ${theme.isDark ? 'text-white' : 'text-slate-900'} uppercase mb-2`}>
                    {konumEtiketi} — Hızlı Aksiyon Planı
                </h2>
                <p className={`${theme.textSecondary} text-sm mb-4`}>{microLocationText} {mevcutYapiText}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
                {property.konumAvantajlari.slice(0, 3).map((av: string, i: number) => (
                    <span key={i} className={`text-xs ${theme.isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border ${theme.textSecondary} px-3 py-1.5 rounded-lg`}>{av}</span>
                ))}
            </div>

            <div className={`${theme.bgSurface} p-4 rounded-xl border ${theme.borderColor}`}>
                <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-1`}>Ana Mesaj</p>
                <p className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>"{property.tanitimStratejisi.anaMesaj}"</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className={`${theme.bgCard} p-3 rounded-lg border ${theme.borderColor}`}>
                    <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-1`}>Hedef Kitle</p>
                    {property.hedefKitle.slice(0, 2).map((k: any, i: number) => (
                        <p key={i} className={`text-xs ${theme.textSecondary} mb-0.5`}>{k.baslik}</p>
                    ))}
                </div>
                <div className={`${theme.bgCard} p-3 rounded-lg border ${theme.borderColor}`}>
                    <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-1`}>Reklam</p>
                    {property.reklamKanallari.slice(0, 3).map((k: string, i: number) => (
                        <p key={i} className={`text-xs ${theme.textSecondary} mb-0.5`}>{k}</p>
                    ))}
                </div>
                <div className={`${theme.bgCard} p-3 rounded-lg border ${theme.borderColor}`}>
                    <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-1`}>Yatırım</p>
                    {yatirimItems.slice(0, 2).map((y: any, i: number) => (
                        <p key={i} className={`text-xs ${theme.textSecondary} mb-0.5`}>{y.baslik}</p>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════
   MINIMAL VARIANT — ultra-clean for Minimalist
   ═══════════════════════════════════════════ */
function MinimalLayout({ property, theme, konumEtiketi, microLocationText }: any) {
    return (
        <section className="max-w-2xl mx-auto space-y-4" data-section="location-advantages">
            <div className={`text-center py-2 border-t border-b ${theme.borderColor}`}>
                <p className={`text-[10px] ${theme.textSecondary} uppercase tracking-[0.3em]`}>Konum Analizi</p>
            </div>
            <p className={`${theme.textSecondary} text-sm text-center`}>{microLocationText}</p>
            <ul className="space-y-1.5">
                {property.konumAvantajlari.slice(0, 3).map((av: string, i: number) => (
                    <li key={i} className={`text-sm ${theme.textSecondary} pl-4 border-l-2 ${theme.borderAccent}`}>{av}</li>
                ))}
            </ul>
        </section>
    );
}

/* ═══════════════════════════════════════════
   SHARED CARD COMPONENTS (Default size)
   ═══════════════════════════════════════════ */
function StrategyCard({ property, theme }: { property: Property; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgSurface} p-8 rounded-[2rem] border ${theme.borderColor} relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 ${theme.isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'} w-32 h-32 rounded-bl-[4rem]`}></div>
            <h3 className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-8 relative z-10`}>Tanıtım Stratejisi</h3>
            <div className="space-y-6 relative z-10">
                <div>
                    <p className={`text-xs ${theme.textAccent} uppercase font-bold mb-1`}>Ana Mesaj</p>
                    <p className={`text-xl ${theme.isDark ? 'text-white' : 'text-slate-900'} font-serif italic`}>"{property.tanitimStratejisi.anaMesaj}"</p>
                </div>
                <div>
                    <p className={`text-xs ${theme.textSecondary} uppercase font-bold mb-2`}>Öne Çıkarılacak Vurgular</p>
                    <div className="flex flex-wrap gap-2">
                        {property.tanitimStratejisi.vurgular.map((v, i) => (
                            <span key={i} className={`text-xs ${theme.isDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} border ${theme.textSecondary} px-3 py-1 rounded-full`}>{v}</span>
                        ))}
                    </div>
                </div>
                <div className={`p-4 ${theme.isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'} rounded-xl border ${theme.borderAccent}`}>
                    <p className={`text-xs ${theme.textAccent} uppercase font-bold mb-1`}>Görsel İçerik Planı</p>
                    <p className={`text-sm ${theme.textSecondary}`}>{property.tanitimStratejisi.gorselIcerikPlani}</p>
                </div>
            </div>
        </div>
    );
}

function StrategyCardCompact({ property, theme }: { property: Property; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgSurface} p-4 rounded-xl border ${theme.borderColor} relative overflow-hidden`}>
            <h3 className={`text-base font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-3`}>Tanıtım Stratejisi</h3>
            <div className="space-y-3">
                <div>
                    <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-0.5`}>Ana Mesaj</p>
                    <p className={`text-sm ${theme.isDark ? 'text-white' : 'text-slate-900'} font-serif italic`}>"{property.tanitimStratejisi.anaMesaj}"</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {property.tanitimStratejisi.vurgular.slice(0, 4).map((v, i) => (
                        <span key={i} className={`text-[10px] ${theme.isDark ? 'bg-white/5' : 'bg-black/5'} ${theme.textSecondary} px-2 py-0.5 rounded-full`}>{v}</span>
                    ))}
                </div>
                <div className={`p-2.5 ${theme.isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'} rounded-lg border ${theme.borderAccent}`}>
                    <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-0.5`}>Görsel İçerik</p>
                    <p className={`text-xs ${theme.textSecondary}`}>{property.tanitimStratejisi.gorselIcerikPlani}</p>
                </div>
            </div>
        </div>
    );
}

function HedefKitleCard({ property, theme }: { property: Property; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor}`}>
            <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3`}>
                <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} flex items-center justify-center text-indigo-400 text-sm`}>01</span>
                Hedef Kitle Profili
            </h3>
            <div className="space-y-6">
                {property.hedefKitle.map((kitle, idx) => (
                    <div key={idx} className={`border-l-2 ${theme.isDark ? 'border-slate-800' : 'border-slate-300'} pl-4`}>
                        <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} font-bold mb-1`}>{kitle.baslik}</h4>
                        <p className={`text-sm ${theme.textSecondary}`}>{kitle.aciklama}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HedefKitleCompact({ property, theme }: { property: Property; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-3 rounded-xl border ${theme.borderColor}`}>
            <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-2`}>Hedef Kitle</p>
            <div className="space-y-1.5">
                {property.hedefKitle.slice(0, 3).map((kitle, idx) => (
                    <div key={idx} className={`border-l-2 ${theme.borderAccent} pl-2`}>
                        <p className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-xs font-bold`}>{kitle.baslik}</p>
                        <p className={`text-[10px] ${theme.textSecondary} line-clamp-1`}>{kitle.aciklama}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReklamKanallariCard({ property, theme }: { property: Property; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor}`}>
            <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3`}>
                <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} flex items-center justify-center text-emerald-400 text-sm`}>02</span>
                Reklam Kanalları
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {property.reklamKanallari.map((kanal, i) => (
                    <div key={i} className={`flex items-center gap-2 p-3 ${theme.bgPrimary} rounded-lg border ${theme.borderColor}`}>
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className={`text-sm ${theme.textSecondary}`}>{kanal}</span>
                    </div>
                ))}
            </div>
            <div className={`mt-6 p-4 ${theme.isDark ? 'bg-slate-800/50' : 'bg-slate-100'} rounded-xl text-center border ${theme.borderColor}`}>
                <p className={`text-xs ${theme.textSecondary} uppercase tracking-widest mb-1`}>Hedef Erişim</p>
                <p className={`text-2xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'}`}>15,000+ <span className={`text-sm font-normal ${theme.textSecondary}`}>Kişi</span></p>
            </div>
        </div>
    );
}

function ReklamKanallariCompact({ property, theme }: { property: Property; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-3 rounded-xl border ${theme.borderColor}`}>
            <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-2`}>Reklam Kanalları</p>
            <div className="flex flex-wrap gap-1.5">
                {property.reklamKanallari.slice(0, 5).map((kanal, i) => (
                    <span key={i} className={`flex items-center gap-1 text-[10px] ${theme.isDark ? 'bg-white/5' : 'bg-black/5'} ${theme.textSecondary} px-2 py-1 rounded`}>
                        <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {kanal}
                    </span>
                ))}
            </div>
        </div>
    );
}

function YatirimCard({ items, theme }: { items: { baslik: string; aciklama: string }[]; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor}`}>
            <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3`}>
                <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-amber-500/20' : 'bg-amber-100'} flex items-center justify-center text-amber-400 text-sm`}>03</span>
                Yatırım Potansiyeli
            </h3>
            <div className="space-y-4">
                {items.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 text-amber-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <div>
                            <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-sm font-bold`}>{item.baslik}</h4>
                            <p className={`text-xs ${theme.textSecondary} mt-1`}>{item.aciklama}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function YatirimCompact({ items, theme }: { items: { baslik: string; aciklama: string }[]; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-3 rounded-xl border ${theme.borderColor}`}>
            <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-2`}>Yatırım Potansiyeli</p>
            <div className="space-y-1.5">
                {items.slice(0, 2).map((item: any, i: number) => (
                    <div key={i}>
                        <p className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-xs font-bold`}>{item.baslik}</p>
                        <p className={`text-[10px] ${theme.textSecondary} line-clamp-2`}>{item.aciklama}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SosyalCard({ items, theme }: { items: { baslik: string; aciklama: string }[]; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-8 rounded-2xl border ${theme.borderColor}`}>
            <h3 className={`text-xl font-bold ${theme.isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-3`}>
                <span className={`w-8 h-8 rounded-full ${theme.isDark ? 'bg-rose-500/20' : 'bg-rose-100'} flex items-center justify-center text-rose-400 text-sm`}>04</span>
                Sosyal Yaşam
            </h3>
            <div className="space-y-4">
                {items.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 text-rose-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <h4 className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-sm font-bold`}>{item.baslik}</h4>
                            <p className={`text-xs ${theme.textSecondary} mt-1`}>{item.aciklama}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SosyalCompact({ items, theme }: { items: { baslik: string; aciklama: string }[]; theme: ThemeConfig }) {
    return (
        <div className={`${theme.bgCard} p-3 rounded-xl border ${theme.borderColor}`}>
            <p className={`text-[10px] ${theme.textAccent} uppercase font-bold mb-2`}>Sosyal Yaşam</p>
            <div className="space-y-1.5">
                {items.slice(0, 2).map((item: any, i: number) => (
                    <div key={i}>
                        <p className={`${theme.isDark ? 'text-white' : 'text-slate-900'} text-xs font-bold`}>{item.baslik}</p>
                        <p className={`text-[10px] ${theme.textSecondary} line-clamp-2`}>{item.aciklama}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
