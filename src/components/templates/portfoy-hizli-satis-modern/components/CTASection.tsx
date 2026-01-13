import React from 'react';
import type { Consultant } from '../types';

interface CTASectionProps {
    consultant?: Consultant;
    guarantees?: string[];
}

export const CTASection: React.FC<CTASectionProps> = ({ consultant, guarantees: propGuarantees }) => {
    const guarantees = propGuarantees && propGuarantees.length > 0 ? propGuarantees : [
        "Sonuç Yoksa, Masraf Yok",
        "Ücretsiz Ekspertiz",
        "Yetki Belgeli Hizmet"
    ];

    const phoneNumber = consultant?.telefon || '+90 555 123 45 67';
    const displayPhone = phoneNumber.startsWith('+') ? phoneNumber : `+90 ${phoneNumber}`;

    return (
        <section id="cta" className="py-24 bg-slate-950 relative">
            <div className="container mx-auto px-6">

                <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                    {/* Background Gradient Mesh */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <svg className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-indigo-500/30 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]" aria-hidden="true">
                            <defs>
                                <pattern id="e813992c-7d03-4cc4-a2bd-151760b470a0" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
                                    <path d="M100 200V.5M.5 .5H200" fill="none" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" strokeWidth="0" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-800 opacity-90"></div>
                    </div>

                    <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Satış Sürecini Başlatın.<br />
                            <span className="text-indigo-200">Profesyonel Farkı Yaşayın.</span>
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-indigo-100">
                            Mülkünüz için en doğru fiyat analizi ve pazarlama stratejisini görüşmek üzere hemen arayın.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                            <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all hover:scale-105">
                                Hemen Arayın: {displayPhone}
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                            {guarantees.map((guarantee, index) => (
                                <div key={index} className="flex items-center text-xs font-medium text-indigo-200 bg-white/10 px-3 py-1 rounded-full">
                                    <svg className="w-4 h-4 mr-1.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {guarantee}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Element on Right */}
                    <div className="relative mt-16 h-80 lg:mt-8 lg:h-[600px] w-full max-w-none md:mx-auto lg:mx-0">
                        {/* Abstract shapes or phone mockup could go here, keeping it clean for now with abstract composition */}
                        <div className="absolute left-10 top-10 w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-3xl"></div>
                        <div className="absolute right-10 bottom-10 w-[300px] h-[300px] rounded-full bg-indigo-400/30 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};