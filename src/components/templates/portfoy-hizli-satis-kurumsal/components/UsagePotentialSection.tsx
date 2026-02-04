import React from 'react';
import { DigitalMarketingTool } from '../types';

interface DigitalMarketingPowerSectionProps {
    tools: DigitalMarketingTool[];
}

export const DigitalMarketingPowerSection: React.FC<DigitalMarketingPowerSectionProps> = ({ tools }) => {
    return (
        <section id="digital-power" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 uppercase tracking-tight">
                        STRATEJİK SATIŞ PLANI
                    </h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                        Mülkünüzü sıradan bir ilan olmaktan çıkarıp, teknoloji ve veri kullanarak doğru alıcılara ulaştıran bir pazarlama makinesine dönüştürüyoruz.
                    </p>
                </div>
                
                <div className="max-w-4xl mx-auto space-y-6">
                    {tools.map((tool, index) => (
                        <div key={index} className="flex items-start gap-6 bg-slate-50 p-6 rounded-lg border border-slate-200 transition-all duration-300 hover:border-blue-300 hover:shadow-lg">
                            <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-lg bg-blue-100">
                                {React.cloneElement(tool.icon, { className: "w-8 h-8 text-blue-800" })}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{tool.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}