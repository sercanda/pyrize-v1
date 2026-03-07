'use client';

import { OlusturulanSunum, Bolge } from '@/types';

interface Props { data: OlusturulanSunum; }

const findBolge = (bolgeler: Bolge[] | undefined, tip: string) =>
  bolgeler?.find((b) => b.tip === tip);

export default function TemplateMetro({ data }: Props) {
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

  const accent = '#f97316'; // neon orange

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Hero */}
      <section className="relative py-20 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-sm font-mono uppercase tracking-wider text-gray-400">Istanbul Merkez</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            {icerik.baslik || 'Gayrimenkul Analizi'}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">{icerik.heroAciklama}</p>
          <div className="flex flex-wrap gap-4 mt-10">
            {[
              { label: 'Konum', value: mulk.konum },
              ...(mulk.metrekare ? [{ label: 'Alan', value: `${mulk.metrekare} m²` }] : []),
              ...(val?.estimatedValueRange ? [{ label: 'Deger', value: val.estimatedValueRange }] : []),
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 px-6 py-4 rounded-lg">
                <div className="text-xs font-mono text-gray-500 uppercase">{s.label}</div>
                <div className="text-lg font-bold mt-1">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Grid - Problems */}
      {problems.length > 0 && (
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="w-8 h-1 rounded" style={{ backgroundColor: accent }} />
              Piyasa Riskleri
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {problems.map((p: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg hover:border-orange-500/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold" style={{ color: accent }}>0{i + 1}</span>
                    <div>
                      <h3 className="font-bold mb-2">{p.baslik}</h3>
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
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="w-8 h-1 rounded" style={{ backgroundColor: accent }} />
              Cozum Plani
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {solutions.map((s: any, i: number) => (
                <div key={i} className="p-6 rounded-lg" style={{ backgroundColor: `${accent}15`, borderLeft: `3px solid ${accent}` }}>
                  <h3 className="font-bold mb-2">{s.baslik}</h3>
                  <p className="text-gray-400 text-sm">{s.icerik}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location & Targets */}
      {(location || targets.length > 0) && (
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="w-8 h-1 rounded" style={{ backgroundColor: accent }} />
              Bolge & Hedef Kitle
            </h2>
            {location?.icerik && <p className="text-gray-400 mb-8 max-w-3xl">{location.icerik}</p>}
            {targets.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {targets.map((t: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="font-bold mb-2" style={{ color: accent }}>{t.baslik || t.persona}</h3>
                    {t.icerik && <p className="text-gray-400 text-sm">{t.icerik}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Valuation Data */}
      {val && (
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="w-8 h-1 rounded" style={{ backgroundColor: accent }} />
              Veri Analizi
            </h2>
            {(val.marketSnapshots && val.marketSnapshots.length > 0) && (
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {val.marketSnapshots?.filter((s: any) => s?.title).slice(0, 3).map((s: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg text-center">
                    <div className="text-xs font-mono text-gray-500 uppercase">{s.title}</div>
                    <div className="text-2xl font-black mt-2" style={{ color: accent }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
            {(val.comparables && val.comparables.length > 0) && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 font-mono text-xs text-gray-500 uppercase">Adres</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-gray-500 uppercase">Durum</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-gray-500 uppercase">Fiyat</th>
                      <th className="text-left py-3 px-4 font-mono text-xs text-gray-500 uppercase">m²</th>
                    </tr>
                  </thead>
                  <tbody>
                    {val.comparables?.filter((c: any) => c?.address).slice(0, 5).map((c: any, i: number) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-3 px-4">{c.address}</td>
                        <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-xs ${c.status === 'Satildi' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>{c.status || 'Satista'}</span></td>
                        <td className="py-3 px-4 font-mono">{c.price}</td>
                        <td className="py-3 px-4 font-mono">{c.pricePerSqm || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black mb-8">SSS</h2>
            <div className="space-y-4">
              {faqs.map((f: any, i: number) => (
                <div key={i} className="bg-white/5 p-6 rounded-lg">
                  <h3 className="font-bold mb-2">{f.baslik || f.question}</h3>
                  <p className="text-gray-400 text-sm">{f.icerik || f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">{cta?.baslik || 'Hemen Iletisime Gecin'}</h2>
          <p className="text-gray-400 mb-10">{cta?.icerik || 'Detayli bilgi icin benimle iletisime gecin.'}</p>
          <div className="inline-block border-2 rounded-xl px-10 py-8" style={{ borderColor: accent }}>
            <div className="text-2xl font-black">{danisman.adSoyad}</div>
            <div className="text-gray-400 mt-2">Gayrimenkul Danismani</div>
            <div className="mt-4 font-mono" style={{ color: accent }}>{danisman.telefon}</div>
            <div className="text-gray-400 text-sm mt-1">{danisman.email}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
