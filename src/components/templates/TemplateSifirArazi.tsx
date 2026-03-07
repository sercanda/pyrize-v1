'use client';

import { OlusturulanSunum, Bolge } from '@/types';

interface Props { data: OlusturulanSunum; }

const findBolge = (bolgeler: Bolge[] | undefined, tip: string) =>
  bolgeler?.find((b) => b.tip === tip);

export default function TemplateSifirArazi({ data }: Props) {
  const { icerik, istek } = data;
  const { mulk, danisman } = istek;
  const bolgeler = icerik.bolgeler || [];
  const val = icerik.detayliDegerleme;
  const problems = findBolge(bolgeler, 'problemler')?.altBolge?.slice(0, 5) || [];
  const solutions = findBolge(bolgeler, 'cozum')?.altBolge?.slice(0, 3) || [];
  const location = findBolge(bolgeler, 'location_analysis');
  const targets = findBolge(bolgeler, 'target_audience')?.altBolge?.slice(0, 3) || [];
  const faqs = findBolge(bolgeler, 'faq')?.altBolge?.slice(0, 4) || [];
  const cta = findBolge(bolgeler, 'cta');

  const earth = '#8B6914';
  const earthDark = '#5C4A10';
  const earthLight = '#f5f0e5';

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#3d3520] font-sans">
      {/* Hero */}
      <section className="relative py-20 px-6" style={{ background: `linear-gradient(135deg, ${earthDark} 0%, #2d4a1c 100%)` }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-block bg-white/10 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            Arazi & Arsa Raporu
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{icerik.baslik || 'Arazi Degerleme Raporu'}</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">{icerik.heroAciklama}</p>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold mb-6" style={{ color: earthDark }}>Parsel Bilgileri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Konum', value: mulk.konum, icon: '📍' },
                { label: 'Arazi Tipi', value: mulk.tur === 'arsa' ? 'Arsa' : mulk.tur, icon: '🏗️' },
                ...(mulk.metrekare ? [{ label: 'Toplam Alan', value: `${mulk.metrekare} m²`, icon: '📐' }] : []),
                ...(val?.estimatedValueRange ? [{ label: 'Deger Araligi', value: val.estimatedValueRange, icon: '💰' }] : []),
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="text-xs text-gray-500 uppercase mb-1">{s.label}</div>
                  <div className="font-semibold text-sm">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Risks */}
      {problems.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8" style={{ color: earthDark }}>Arazi Yatiriminda Riskler</h2>
            <div className="space-y-3">
              {problems.map((p: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-5 flex gap-4 items-start shadow-sm">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: earth }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{p.baslik}</h3>
                    <p className="text-gray-600 text-sm">{p.icerik}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solutions */}
      {solutions.length > 0 && (
        <section className="py-12 px-6" style={{ backgroundColor: earthLight }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8" style={{ color: earthDark }}>Profesyonel Cozumlerimiz</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {solutions.map((s: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border-t-4" style={{ borderColor: earth }}>
                  <h3 className="font-bold mb-2">{s.baslik}</h3>
                  <p className="text-gray-600 text-sm">{s.icerik}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {location && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ color: earthDark }}>Imar & Konum Analizi</h2>
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <p className="text-gray-600 leading-relaxed">{location.icerik}</p>
              {targets.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4 mt-8">
                  {targets.map((t: any, i: number) => (
                    <div key={i} className="p-4 rounded-lg" style={{ backgroundColor: earthLight }}>
                      <h3 className="font-semibold text-sm mb-1" style={{ color: earth }}>{t.baslik || t.persona}</h3>
                      {t.icerik && <p className="text-gray-600 text-xs">{t.icerik}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Valuation */}
      {val && (
        <section className="py-12 px-6" style={{ backgroundColor: earthLight }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8" style={{ color: earthDark }}>Degerleme</h2>
            {(val.marketSnapshots && val.marketSnapshots.length > 0) && (
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {val.marketSnapshots?.filter((s: any) => s?.title).slice(0, 3).map((s: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="text-xs text-gray-500 uppercase">{s.title}</div>
                    <div className="text-xl font-bold mt-2" style={{ color: earth }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
            {val.estimatedValueRange && (
              <div className="rounded-xl p-6 text-center text-white" style={{ background: `linear-gradient(135deg, ${earthDark} 0%, #2d4a1c 100%)` }}>
                <div className="text-sm opacity-80 mb-2">Tahmini Arazi Degeri</div>
                <div className="text-3xl font-bold">{val.estimatedValueRange}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8" style={{ color: earthDark }}>Sik Sorulan Sorular</h2>
            <div className="space-y-4">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold mb-2">{f.baslik || f.question}</h3>
                  <p className="text-gray-600 text-sm">{f.icerik || f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 text-white" style={{ background: `linear-gradient(135deg, ${earthDark} 0%, #2d4a1c 100%)` }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{cta?.baslik || 'Arazi Danismanligi'}</h2>
          <p className="text-white/80 mb-8">{cta?.icerik || 'Profesyonel arazi degerleme ve satis danismanligi.'}</p>
          <div className="text-xl font-bold">{danisman.adSoyad}</div>
          <div className="text-white/70 mt-2">{danisman.telefon} • {danisman.email}</div>
        </div>
      </section>
    </div>
  );
}
