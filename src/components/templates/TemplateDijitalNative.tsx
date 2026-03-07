'use client';

import { OlusturulanSunum, Bolge } from '@/types';

interface Props { data: OlusturulanSunum; }

const findBolge = (bolgeler: Bolge[] | undefined, tip: string) =>
  bolgeler?.find((b) => b.tip === tip);

export default function TemplateDijitalNative({ data }: Props) {
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

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white font-sans">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)' }}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-sm font-medium px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Canli Analiz
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            {icerik.baslik || 'Dijital Gayrimenkul Sunumu'}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{icerik.heroAciklama}</p>

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              mulk.konum,
              ...(mulk.metrekare ? [`${mulk.metrekare} m²`] : []),
              mulk.tur === 'daire' ? 'Daire' : mulk.tur === 'villa' ? 'Villa' : mulk.tur,
              ...(val?.estimatedValueRange ? [val.estimatedValueRange] : []),
            ].map((tag, i) => (
              <span key={i} className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {[
            { value: '500+', label: 'Basarili Satis' },
            { value: '45', label: 'Ort. Satis Gunu' },
            { value: '%98', label: 'Musteri Memnuniyeti' },
          ].map((s, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problems */}
      {problems.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-2">Dikkat Edilmesi Gerekenler</h2>
            <p className="text-gray-400 mb-8">Emlak piyasasinda en sik karsilasilan sorunlar</p>
            <div className="space-y-3">
              {problems.map((p: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{p.baslik}</h3>
                      <p className="text-gray-400 text-sm">{p.icerik}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solutions */}
      {solutions.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-8">Bizim Farkimiz</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {solutions.map((s: any, i: number) => (
                <div key={i} className="rounded-2xl p-6" style={{ background: i === 0 ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : i === 1 ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'linear-gradient(135deg, #f97316, #ea580c)' }}>
                  <h3 className="font-bold text-lg mb-2">{s.baslik}</h3>
                  <p className="text-white/80 text-sm">{s.icerik}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location & Targets */}
      {(location || targets.length > 0) && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-6">Bolge Bilgisi</h2>
            {location?.icerik && <p className="text-gray-400 mb-8">{location.icerik}</p>}
            {targets.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {targets.map((t: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.baslik || t.persona}</h3>
                    {t.icerik && <p className="text-gray-400 text-sm">{t.icerik}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Valuation */}
      {val && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-8">Degerleme</h2>
            {(val.marketSnapshots && val.marketSnapshots.length > 0) && (
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {val.marketSnapshots?.filter((s: any) => s?.title).slice(0, 3).map((s: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <div className="text-xs text-gray-500 uppercase">{s.title}</div>
                    <div className="text-2xl font-extrabold mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{s.value}</div>
                  </div>
                ))}
              </div>
            )}
            {val.estimatedValueRange && (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' }}>
                <div className="text-sm text-white/80 mb-2">Tahmini Deger</div>
                <div className="text-3xl font-extrabold">{val.estimatedValueRange}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold mb-8">SSS</h2>
            <div className="space-y-3">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="font-bold mb-1">{f.baslik || f.question}</h3>
                  <p className="text-gray-400 text-sm">{f.icerik || f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-4">{cta?.baslik || 'Hemen Basvurun'}</h2>
          <p className="text-white/80 mb-10">{cta?.icerik || 'Ucretsiz degerleme icin simdi iletisime gecin.'}</p>
          <div className="inline-block bg-white/20 backdrop-blur rounded-2xl px-10 py-8">
            <div className="text-2xl font-extrabold">{danisman.adSoyad}</div>
            <div className="text-white/70 mt-1">Gayrimenkul Danismani</div>
            <div className="text-xl font-bold mt-4">{danisman.telefon}</div>
            <div className="text-white/70 text-sm mt-1">{danisman.email}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
