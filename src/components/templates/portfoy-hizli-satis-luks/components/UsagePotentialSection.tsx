import React from 'react';
import { DigitalMarketingTool } from '../types';
import { SMART_AD_CAMPAIGNS } from '../constants'; // Import new constant

interface DigitalMarketingPowerSectionProps {
    tools: DigitalMarketingTool[];
}

const ToolCard: React.FC<{ tool: DigitalMarketingTool }> = ({ tool }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm h-full flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-5 border-2 border-amber-500/30">
            {tool.icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
            <p className="text-gray-400 text-sm">{tool.description}</p>
        </div>
    </div>
);

const SmartAdCampaignItem: React.FC<{ item: DigitalMarketingTool }> = ({ item }) => (
    <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-700/50 border border-gray-600">
            <div className="w-5 h-5 md:w-6 md:h-6">
                {item.icon}
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base md:text-lg text-white break-words">{item.title}</h4>
            <p className="text-gray-400 text-xs md:text-sm mt-1 break-words">{item.description}</p>
        </div>
    </div>
);


export const DigitalMarketingPowerSection: React.FC<DigitalMarketingPowerSectionProps> = ({ tools }) => {
    return (
        <section id="digital-power" className="py-24 bg-gradient-to-b from-black to-[#0a0a1a]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                       360° Dijital <span className="text-amber-400">Pazarlama Stratejisi</span>
                    </h2>
                    <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">
                        Mülkünüzü sıradan bir ilan olmaktan çıkarıp, teknoloji ve veriyle doğru alıcılara ulaşan bir pazarlama makinesine dönüştürüyoruz.
                    </p>
                </div>
                
                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} />
                    ))}
                </div>

                <div className="max-w-6xl mx-auto mt-12 md:mt-20 bg-gray-900/70 p-4 md:p-8 rounded-2xl border border-gray-800 backdrop-blur-md">
                    <div className="text-center mb-6 md:mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">Akıllı Reklam Kampanyaları</h3>
                        <p className="text-gray-400 mt-2 text-sm md:text-base px-2">Satın almaya en yakın potansiyel müşterilere, doğru zamanda ve doğru yerde ulaşıyoruz.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-6">
                        {SMART_AD_CAMPAIGNS.map((item, index) => (
                            <SmartAdCampaignItem key={index} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}