import React from 'react';

export const CTASection: React.FC = () => {
    const guarantees = [
        "Sonuç Yoksa, Masraf Yok",
        "Tüm Pazarlama Ücretsiz",
        "Hizmet Bedeli Sadece Satışta"
    ];

  return (
    <section id="cta" className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        
        <div className="bg-blue-800 p-10 md:p-16 rounded-lg shadow-xl shadow-blue-800/20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">
                Mülkünüzün Değerini Öğrenin & Hızlı Satış Planı Alın
            </h2>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto mt-4">
              Mülkünüze özel hazırlayacağımız ücretsiz kurumsal değerleme raporu ve satış stratejisi için bizimle iletişime geçin.
            </p>
            <div className="mt-8 text-blue-100 text-xl">
              <p>Kurumsal Satış Hattı:</p>
              <a href="tel:+905320000000" className="font-bold text-3xl text-white hover:underline mt-2 inline-block tracking-wider">+90 532 000 00 00</a>
            </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-16">
            {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center text-lg font-semibold text-slate-600">
                    <svg className="w-6 h-6 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {guarantee}
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};