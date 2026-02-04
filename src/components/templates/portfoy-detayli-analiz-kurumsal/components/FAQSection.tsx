
import React from 'react';
import { FAQItem } from '../types';

interface FAQSectionProps {
    faqs: FAQItem[];
}

const FAQCard: React.FC<{ item: FAQItem }> = ({ item }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm break-inside-avoid">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">?</span>
                {item.question}
            </h3>
            <div className="pl-9">
                <p className="text-slate-600 text-sm leading-relaxed">
                    {item.answer}
                </p>
            </div>
        </div>
    );
};

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
    return (
        <section className="py-24 bg-slate-50 print:bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">Bilgilendirme</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                        Sıkça Sorulan Sorular
                    </h2>
                    <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
                        Satış süreci ve yetkilendirme ile ilgili kritik detaylar.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {faqs.map((faq, index) => (
                        <FAQCard key={index} item={faq} />
                    ))}
                </div>
            </div>
        </section>
    );
};