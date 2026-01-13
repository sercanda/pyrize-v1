import React from 'react';
import { Consultant } from '../types';

interface CTASectionProps {
  consultant: Consultant;
  guarantees: string[];
}

export const CTASection: React.FC<CTASectionProps> = ({ consultant, guarantees }) => {
  const phoneNumber = consultant.telefon?.replace(/\s+/g, '');

  return (
    <section id="cta" className="bg-black py-24">
      <div className="container mx-auto px-6 text-center">
        <div className="rounded-2xl bg-gradient-to-br from-amber-800 via-yellow-700 to-amber-800 p-10 shadow-2xl shadow-amber-500/30 md:p-16">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg md:text-6xl">
            Mülkünüz İçin Aksiyon Planını Başlatalım
          </h2>
          <p className="mt-4 text-xl text-yellow-100">
            {consultant.adSoyad} ile mülkünüze özel hazırlanan detaylı pazarlama stratejisini hemen başlatın.
          </p>
          <div className="mt-8 space-y-3">
            <p className="text-xl text-yellow-100">Doğrudan bana ulaşın:</p>
            {consultant.telefon && (
              <a
                href={phoneNumber ? `tel:${phoneNumber}` : undefined}
                className="inline-block text-4xl font-bold text-white tracking-wider drop-shadow-md hover:underline"
              >
                {consultant.telefon}
              </a>
            )}
            {consultant.email && (
              <p className="text-sm text-yellow-100/80">
                veya{' '}
                <a href={`mailto:${consultant.email}`} className="font-semibold text-white hover:underline">
                  {consultant.email}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className="flex items-center rounded-full border border-gray-800 bg-gray-900/50 px-5 py-3 text-lg font-semibold text-gray-400"
            >
              <svg className="mr-3 h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{guarantee}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};