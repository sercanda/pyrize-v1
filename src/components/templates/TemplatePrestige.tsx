'use client';

import { OlusturulanSunum, Bolge } from '@/types';

interface Props { data: OlusturulanSunum; }

const findBolge = (bolgeler: Bolge[] | undefined, tip: string) =>
  bolgeler?.find((b) => b.tip === tip);

export default function TemplatePrestige({ data }: Props) {
  const { icerik, istek } = data;
  const { mulk, danisman } = istek;
  const bolgeler = icerik.bolgeler || [];
  const val = icerik.detayliDegerleme;
  const problems = findBolge(bolgeler, 'problemler')?.altBolge?.slice(0, 5) || [];
  const solutions = findBolge(bolgeler, 'cozum')?.altBolge?.slice(0, 3) || [];
  const location = findBolge(bolgeler, 'location_analysis');
  const targets = findBolge(bolgeler, 'target_audience')?.altBolge?.slice(0, 3) || [];
  const faqs = findBolge(bolgeler, 'faq')?.altBolge?.slice(0, 4) || [];
  const guarantees = findBolge(bolgeler, 'guarantee')?.altBolge?.slice(0, 3) || [];
  const cta = findBolge(bolgeler, 'cta');

  return (
    <div className="min-h-screen bg-[#fdf8f0] text-[#1a1a2e]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Hero */}
      <section className="relative bg-[#1a1a4e] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-[2px] bg-[#d4af37] mx-auto mb-8" />
          <p className="text-[#d4af37] text-sm tracking-[4px] uppercase mb-4">Ozel Hazirlanmis Sunum</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: '#d4af37' }}>
            {icerik.baslik || 'Prestij Gayrimenkul Sunumu'}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{icerik.heroAciklama}</p>
          <div className="w-20 h-[2px] bg-[#d4af37] mx-auto mt-8" />
        </div>
      </section>

      {/* Property Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Konum', value: mulk.konum },
            { label: 'Tip', value: mulk.tur === 'arsa' ? 'Arsa' : mulk.tur === 'daire' ? 'Daire' : mulk.tur === 'villa' ? 'Villa' : 'Mulk' },
            ...(mulk.metrekare ? [{ label: 'Alan', value: `${mulk.metrekare} m²` }] : []),
            ...(val?.estimatedValueRange ? [{ label: 'Degerleme', value: val.estimatedValueRange }] : []),
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 text-center border-t-2 border-[#d4af37]">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{s.label}</div>
              <div className="text-lg font-semibold">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problems */}
      {problems.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a4e]">Piyasa Degerlendirmesi</h2>
            <div className="space-y-4">
              {problems.map((p: any, i: number) => (
                <div key={i} className="p-6 bg-[#fdf8f0] border-l-4 border-[#d4af37]">
                  <h3 className="font-semibold text-lg mb-2">{p.baslik}</h3>
                  <p className="text-gray-600">{p.icerik}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solutions */}
      {solutions.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a4e]">Ozel Hizmet Paketimiz</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {solutions.map((s: any, i: number) => (
                <div key={i} className="bg-white p-8 text-center border-t-2 border-[#d4af37]">
                  <h3 className="font-semibold text-lg mb-3">{s.baslik}</h3>
                  <p className="text-gray-600 text-sm">{s.icerik}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {location && (
        <section className="py-16 px-6 bg-[#1a1a4e] text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8" style={{ color: '#d4af37' }}>Bolge Analizi</h2>
            <p className="text-white/80 text-center max-w-2xl mx-auto">{location.icerik}</p>
            {targets.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {targets.map((t: any, i: number) => (
                  <div key={i} className="bg-white/10 p-6 rounded">
                    <h3 className="font-semibold mb-2" style={{ color: '#d4af37' }}>{t.baslik || t.persona}</h3>
                    {t.icerik && <p className="text-white/70 text-sm">{t.icerik}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Valuation */}
      {val && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a4e]">Degerleme Raporu</h2>
            {(val.marketSnapshots && val.marketSnapshots.length > 0) && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {val.marketSnapshots?.filter((s: any) => s?.title).slice(0, 3).map((s: any, i: number) => (
                  <div key={i} className="bg-white p-6 text-center border-t-2 border-[#d4af37]">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{s.title}</div>
                    <div className="text-xl font-bold">{s.value}</div>
                  </div>
                ))}
              </div>
            )}
            {val.estimatedValueRange && (
              <div className="bg-[#1a1a4e] text-white p-8 text-center rounded">
                <div className="text-sm opacity-80 mb-2">Tahmini Piyasa Degeri</div>
                <div className="text-2xl font-bold" style={{ color: '#d4af37' }}>{val.estimatedValueRange}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a4e]">Sik Sorulan Sorular</h2>
            <div className="space-y-6">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="border-b border-gray-200 pb-6">
                  <h3 className="font-semibold mb-2">{f.baslik || f.question}</h3>
                  <p className="text-gray-600 text-sm">{f.icerik || f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guarantees + CTA */}
      <section className="py-16 px-6 bg-[#1a1a4e] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12" style={{ color: '#d4af37' }}>Taahhutlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {(guarantees.length > 0 ? guarantees : [
              { baslik: 'Sifir On Odeme', icerik: 'Listeleme icin ucret yok.' },
              { baslik: 'Ozel Hizmet', icerik: 'Bire bir danismanlik.' },
              { baslik: '7/24 Iletisim', icerik: 'Her an ulasim.' },
            ]).map((g: any, i: number) => (
              <div key={i} className="bg-white/10 p-6 rounded">
                <h3 className="font-semibold mb-2" style={{ color: '#d4af37' }}>{g.baslik}</h3>
                <p className="text-white/70 text-sm">{g.icerik}</p>
              </div>
            ))}
          </div>

          <div className="w-20 h-[2px] bg-[#d4af37] mx-auto mb-8" />
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#d4af37' }}>{cta?.baslik || 'Iletisime Gecin'}</h3>
          <p className="text-white/80 mb-8">{cta?.icerik || 'Detayli bilgi icin benimle iletisime gecin.'}</p>
          <div className="text-xl font-bold">{danisman.adSoyad}</div>
          <div className="text-white/70 mt-2">{danisman.telefon} • {danisman.email}</div>
        </div>
      </section>
    </div>
  );
}
