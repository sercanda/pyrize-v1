'use client';

import { OlusturulanSunum, Bolge } from '@/types';

interface Props { data: OlusturulanSunum; }

const findBolge = (bolgeler: Bolge[] | undefined, tip: string) =>
  bolgeler?.find((b) => b.tip === tip);

export default function TemplateYatirimci({ data }: Props) {
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-800 to-blue-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            YATIRIM RAPORU
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{icerik.baslik || 'Yatirim Analiz Raporu'}</h1>
          <p className="text-gray-300 max-w-2xl">{icerik.heroAciklama}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Konum', value: mulk.konum },
              { label: 'Tip', value: mulk.tur === 'ticari' ? 'Ticari' : mulk.tur === 'arsa' ? 'Arsa' : mulk.tur },
              ...(mulk.metrekare ? [{ label: 'Alan', value: `${mulk.metrekare} m²` }] : []),
              ...(val?.estimatedValueRange ? [{ label: 'Deger Araligi', value: val.estimatedValueRange }] : []),
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur p-4 rounded-lg">
                <div className="text-xs text-gray-400 uppercase">{s.label}</div>
                <div className="text-sm font-semibold mt-1">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Analysis */}
      {problems.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Risk Analizi</h2>
            <p className="text-gray-500 mb-8">Yatirim oncesi dikkat edilmesi gereken riskler</p>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Risk Faktoru</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Aciklama</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((p: any, i: number) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-3 px-4 font-mono text-red-500">{i + 1}</td>
                      <td className="py-3 px-4 font-semibold">{p.baslik}</td>
                      <td className="py-3 px-4 text-gray-600">{p.icerik}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ROI Solutions */}
      {solutions.length > 0 && (
        <section className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Yatirim Getirisi Optimizasyonu</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {solutions.map((s: any, i: number) => (
                <div key={i} className="border-2 border-blue-100 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold mb-4">{i + 1}</div>
                  <h3 className="font-bold mb-2">{s.baslik}</h3>
                  <p className="text-gray-600 text-sm">{s.icerik}</p>
                  {s.karsilastirma && <p className="text-blue-600 text-sm font-medium mt-3">{s.karsilastirma}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Market Data */}
      {val && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Piyasa Verileri</h2>
            {(val.marketSnapshots && val.marketSnapshots.length > 0) && (
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {val.marketSnapshots?.filter((s: any) => s?.title).slice(0, 3).map((s: any, i: number) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-xs text-gray-500 uppercase">{s.title}</div>
                    <div className="text-2xl font-bold text-blue-700 mt-2">{s.value}</div>
                    {s.trendLabel && <div className={`text-xs mt-1 ${s.trend === 'up' ? 'text-green-600' : s.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>{s.trendLabel}</div>}
                  </div>
                ))}
              </div>
            )}
            {(val.comparables && val.comparables.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-800 text-white font-semibold text-sm">Karsilastirmali Piyasa Analizi</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 text-gray-600">Adres</th>
                      <th className="text-left py-3 px-4 text-gray-600">Durum</th>
                      <th className="text-left py-3 px-4 text-gray-600">Fiyat</th>
                      <th className="text-left py-3 px-4 text-gray-600">m² Fiyati</th>
                    </tr>
                  </thead>
                  <tbody>
                    {val.comparables?.filter((c: any) => c?.address).slice(0, 5).map((c: any, i: number) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="py-3 px-4">{c.address}</td>
                        <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'Satildi' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{c.status || 'Satista'}</span></td>
                        <td className="py-3 px-4 font-semibold">{c.price}</td>
                        <td className="py-3 px-4">{c.pricePerSqm || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Location + Target */}
      {(location || targets.length > 0) && (
        <section className="py-12 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Bolge & Hedef Analizi</h2>
            {location?.icerik && <p className="text-gray-600 mb-8">{location.icerik}</p>}
            {targets.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {targets.map((t: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-blue-700 mb-2">{t.baslik || t.persona}</h3>
                    {t.icerik && <p className="text-gray-600 text-sm">{t.icerik}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">SSS</h2>
            <div className="grid md:grid-cols-2 gap-4">
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
      <section className="py-16 px-6 bg-gradient-to-r from-gray-800 to-blue-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{cta?.baslik || 'Yatirim Danismanligi'}</h2>
          <p className="text-gray-300 mb-8">{cta?.icerik || 'Profesyonel gayrimenkul yatirim danismanligi.'}</p>
          <div className="inline-block bg-white/10 backdrop-blur rounded-xl px-10 py-6">
            <div className="text-xl font-bold">{danisman.adSoyad}</div>
            <div className="text-gray-300 text-sm mt-1">Gayrimenkul Yatirim Danismani</div>
            <div className="text-blue-300 font-semibold mt-3">{danisman.telefon}</div>
            <div className="text-gray-400 text-sm">{danisman.email}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
