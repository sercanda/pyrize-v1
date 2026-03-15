import { notFound } from "next/navigation";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { OfisProfili, OfisPortfoy } from "@/types/ofis";
import { PyrizeLogo } from "@/components/ui/PyrizeLogo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { title: "Profil Bulunamadı" };
  const { data } = await supabase
    .from("ofis_profilleri")
    .select("danisan_adi, ofis_adi, danisan_biyografi, danisan_foto_url")
    .eq("slug", params.slug)
    .eq("yayinda", true)
    .single();
  if (!data) return { title: "Profil Bulunamadı" };
  return {
    title: `${data.danisan_adi} - ${data.ofis_adi} | Pyrize`,
    description: data.danisan_biyografi || `${data.danisan_adi} - ${data.ofis_adi} emlak danışmanı profili`,
    openGraph: { images: data.danisan_foto_url ? [data.danisan_foto_url] : [] },
  };
}

export default async function OfisPublicPage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return notFound();

  const { data: profil } = await supabase
    .from("ofis_profilleri")
    .select("*")
    .eq("slug", params.slug)
    .eq("yayinda", true)
    .single();

  if (!profil) return notFound();

  let portfoyler: OfisPortfoy[] = [];
  try {
    const { data } = await supabase
      .from("ofis_portfoyleri")
      .select("*")
      .eq("ofis_id", profil.id)
      .eq("aktif", true)
      .eq("one_cikar", true)
      .limit(6);
    portfoyler = data || [];
  } catch { /* no portfolio yet */ }

  const p = profil as OfisProfili;
  const fmt = (n: number) => new Intl.NumberFormat("tr-TR").format(n);
  const whatsappLink = p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <main className="min-h-screen bg-[#040813] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#DBE64C]/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-16 relative z-10">
          {/* Logo */}
          <div className="flex items-center justify-between mb-12">
            {p.ofis_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.ofis_logo_url} alt={p.ofis_adi} className="h-10 object-contain" />
            ) : (
              <span className="text-lg font-bold text-white">{p.ofis_adi}</span>
            )}
            <PyrizeLogo variant="dark" className="h-5 opacity-40" />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Photo */}
            {p.danisan_foto_url && (
              <div className="w-40 h-52 md:w-48 md:h-60 rounded-2xl overflow-hidden border-2 border-[#DBE64C]/20 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.danisan_foto_url} alt={p.danisan_adi} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{p.danisan_adi}</h1>
              {p.danisan_unvan && <p className="text-lg text-slate-300 mb-4">{p.danisan_unvan}</p>}
              {p.deneyim_yili && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DBE64C] bg-[#DBE64C]/10 border border-[#DBE64C]/20 rounded-full px-3 py-1 mb-4">
                  ⭐ {p.deneyim_yili} yıl deneyim
                </span>
              )}
              {p.sehir && <p className="text-sm text-slate-400 mb-4">📍 {p.ilce ? `${p.ilce}, ` : ""}{p.sehir}</p>}

              {/* Contact buttons */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                {p.telefon && (
                  <a href={`tel:${p.telefon}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/15 transition">
                    📞 {p.telefon}
                  </a>
                )}
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm hover:bg-emerald-500/20 transition">
                    💬 WhatsApp
                  </a>
                )}
                {p.email && (
                  <a href={`mailto:${p.email}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/15 transition">
                    📧 E-posta
                  </a>
                )}
              </div>

              {/* Specialization chips */}
              {p.uzmanlik_alanlari?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {p.uzmanlik_alanlari.map((alan, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">{alan}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* İSTATİSTİKLER */}
      {(p.toplam_satis > 0 || p.bu_yil_satis > 0 || p.mutlu_musteri > 0) && (
        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {p.toplam_satis > 0 && (
              <div>
                <p className="text-3xl md:text-4xl font-bold text-[#DBE64C] tabular-nums">{fmt(p.toplam_satis)}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Toplam Satış</p>
              </div>
            )}
            {p.bu_yil_satis > 0 && (
              <div>
                <p className="text-3xl md:text-4xl font-bold text-white tabular-nums">{fmt(p.bu_yil_satis)}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Bu Yıl</p>
              </div>
            )}
            {p.mutlu_musteri > 0 && (
              <div>
                <p className="text-3xl md:text-4xl font-bold text-white tabular-nums">{fmt(p.mutlu_musteri)}+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Mutlu Müşteri</p>
              </div>
            )}
            {p.ortalama_satis_suresi && (
              <div>
                <p className="text-3xl md:text-4xl font-bold text-white tabular-nums">{p.ortalama_satis_suresi} <span className="text-lg">gün</span></p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Ort. Satış Süresi</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* HAKKIMDA */}
      {p.danisan_biyografi && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-6">Merhaba, Ben {p.danisan_adi.split(" ")[0]}</h2>
          <p className="text-slate-300 leading-relaxed max-w-3xl">{p.danisan_biyografi}</p>
          {p.calisma_bolgesi?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Çalışma Bölgeleri</p>
              <div className="flex flex-wrap gap-2">
                {p.calisma_bolgesi.map((bolge, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">{bolge}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* PORTFÖY */}
      {portfoyler.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-2">Güncel Portföy</h2>
          <p className="text-sm text-slate-400 mb-8">Seçili mülklerimden bazıları</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfoyler.map((mulk) => (
              <div key={mulk.id} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition group">
                {mulk.kapak_foto_url && (
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mulk.kapak_foto_url} alt={mulk.baslik} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      mulk.durum === "satildi" ? "bg-red-500/80 text-white" : mulk.durum === "kiralik" ? "bg-blue-500/80 text-white" : "bg-emerald-500/80 text-white"
                    }`}>
                      {mulk.durum === "satildi" ? "Satıldı" : mulk.durum === "kiralik" ? "Kiralık" : "Satılık"}
                    </span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    {mulk.mulk_tipi && <span>{mulk.mulk_tipi}</span>}
                    {mulk.alan_m2 && <span>• {mulk.alan_m2}m²</span>}
                    {mulk.oda_sayisi && <span>• {mulk.oda_sayisi}</span>}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{mulk.baslik}</h3>
                  {mulk.sehir && <p className="text-xs text-slate-500">{mulk.ilce ? `${mulk.ilce}, ` : ""}{mulk.sehir}</p>}
                  {mulk.fiyat && (
                    <p className="text-lg font-bold text-[#DBE64C] mt-2">{fmt(mulk.fiyat)} ₺</p>
                  )}
                  {whatsappLink && mulk.durum !== "satildi" && (
                    <a
                      href={`${whatsappLink}?text=${encodeURIComponent(`Merhaba, "${mulk.baslik}" hakkında bilgi almak istiyorum.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 block text-center text-xs font-semibold py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition"
                    >
                      Detay İste
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EKİP */}
      {p.ekip_uyeleri?.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-8">Ekibimiz</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {p.ekip_uyeleri.map((uye, i) => (
              <div key={i} className="text-center">
                {uye.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={uye.foto_url} alt={uye.ad} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border border-white/10" />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-white/10 flex items-center justify-center text-2xl text-slate-400">
                    {uye.ad[0]}
                  </div>
                )}
                <p className="text-sm font-semibold">{uye.ad}</p>
                <p className="text-xs text-slate-400">{uye.unvan}</p>
                {uye.telefon && (
                  <a href={`tel:${uye.telefon}`} className="text-xs text-[#DBE64C] hover:underline mt-1 block">📞 Ara</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* İLETİŞİM */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">İletişim</h2>
            <div className="space-y-4">
              <p className="text-lg font-semibold text-white">{p.ofis_adi}</p>
              {p.adres && <p className="text-sm text-slate-400">{p.adres}{p.ilce ? `, ${p.ilce}` : ""}{p.sehir ? `, ${p.sehir}` : ""}</p>}
              {p.telefon && <a href={`tel:${p.telefon}`} className="block text-sm text-white hover:text-[#DBE64C] transition">📞 {p.telefon}</a>}
              {p.email && <a href={`mailto:${p.email}`} className="block text-sm text-white hover:text-[#DBE64C] transition">📧 {p.email}</a>}
              {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="block text-sm text-white hover:text-[#DBE64C] transition">🌐 {p.website}</a>}
              <div className="flex gap-3 mt-4">
                {p.instagram_url && <a href={p.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-white/20 transition">📷</a>}
                {p.linkedin_url && <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-white/20 transition">💼</a>}
              </div>
            </div>
          </div>
          {p.calisma_bolgesi?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Çalışma Bölgeleri</h3>
              <div className="flex flex-wrap gap-2">
                {p.calisma_bolgesi.map((b, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="border-t border-white/10 bg-gradient-to-t from-[#DBE64C]/5 to-transparent">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Mülk almak veya satmak mı istiyorsunuz?</h2>
          <p className="text-slate-400 mb-8">Profesyonel emlak danışmanlığı için bugün iletişime geçin.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition">
                WhatsApp'tan Ulaş
              </a>
            )}
            {p.telefon && (
              <a href={`tel:${p.telefon}`} className="px-8 py-3 rounded-xl bg-[#DBE64C] text-[#001F3F] font-semibold hover:opacity-90 transition">
                Ara: {p.telefon}
              </a>
            )}
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-xs text-slate-600">
            <PyrizeLogo variant="dark" className="h-3.5 opacity-30" />
            <span>ile oluşturuldu</span>
          </div>
        </div>
      </section>
    </main>
  );
}
