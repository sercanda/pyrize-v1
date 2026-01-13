import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-slate-900 tracking-tight">
            Mülkünüz İçin <span className="text-blue-800">Kurumsal Çözüm</span>. Hızlı Sonuç.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto md:mx-0 mt-6">
            Profesyonel ekibimiz, kanıtlanmış sistemimiz ve geniş yatırımcı ağımızla mülkünüzü en doğru fiyata, en hızlı şekilde satıyoruz.
          </p>
          <div className="mt-12">
            <a href="#benefits" className="text-slate-600 font-semibold inline-flex items-center gap-2 group">
                <span>Stratejimizi Keşfedin</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-y-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
            </a>
          </div>
        </div>
        <div className="hidden md:block">
            <img 
                src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Modern corporate real estate" 
                className="rounded-lg shadow-2xl object-cover w-full h-full"
            />
        </div>
      </div>
    </section>
  );
};