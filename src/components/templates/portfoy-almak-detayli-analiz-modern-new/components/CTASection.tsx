
import React from 'react';
import { Consultant } from '../types';
import { ThemeConfig } from '../../shared/themeConfig';

interface CTASectionProps {
  consultant: Consultant;
  theme: ThemeConfig;
}

export const CTASection: React.FC<CTASectionProps> = ({ consultant, theme }) => {
  return (
    <section id="cta" className={`py-24 ${theme.bgSurface} border-t ${theme.isDark ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="container mx-auto px-6 max-w-5xl">

        <div className={`${theme.bgPrimary} rounded-3xl p-8 md:p-16 text-center ${theme.isDark ? 'text-white' : 'text-slate-900'} shadow-2xl shadow-slate-900/20 relative overflow-hidden`}>
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    Süreci Başlatmaya Hazır mısınız?
                </h2>
                <p className={`${theme.textSecondary} mb-12 max-w-2xl mx-auto text-lg leading-relaxed`}>
                    Mülkünüzün gerçek değerini bulması ve profesyonel süreç yönetimi için ilk adımı atın. Size özel stratejimizi yüz yüze konuşalım.
                </p>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Primary Action: Call */}
                    <a href={`tel:${consultant.telefon}`} className="group relative bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col items-center justify-center text-center">
                        <div className="mb-3 p-3 bg-white/10 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <span className="text-xl font-bold mb-1">Hemen Ara</span>
                        <span className="text-blue-100 text-sm font-medium">{consultant.telefon}</span>
                        <span className="mt-4 text-xs bg-blue-800/50 px-3 py-1 rounded-full text-blue-200">7/24 Ulaşılabilir</span>
                    </a>

                    {/* Secondary Action: WhatsApp / Schedule */}
                    <a href={`https://wa.me/${consultant.telefon.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="group relative bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col items-center justify-center text-center">
                         <div className="mb-3 p-3 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </div>
                        <span className="text-xl font-bold mb-1">WhatsApp</span>
                        <span className="text-slate-500 text-sm font-medium">Hızlı mesaj gönder</span>
                        <span className="mt-4 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Ort. Yanıt: 5 dk</span>
                    </a>
                </div>

                <div className={`mt-12 pt-8 border-t ${theme.borderColor}`}>
                    <p className={`text-sm ${theme.textSecondary}`}>
                        © {new Date().getFullYear()} {consultant.ofisAdi}. Tüm süreç KVKK ve etik kurallar çerçevesinde yürütülür.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
