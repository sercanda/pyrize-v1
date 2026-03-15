import { notFound } from "next/navigation";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import type { OfisProfili, OfisPortfoy } from "@/types/ofis";
import { PyrizeLogo } from "@/components/ui/PyrizeLogo";

export async function generateMetadata({ params }: { params: { ofisSlug: string; danisanSlug: string } }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { title: "Profil Bulunamadı" };
  const { data } = await supabase
    .from("ofis_profilleri")
    .select("danisan_adi, ofis_adi, danisan_biyografi, danisan_foto_url")
    .eq("ofis_slug", params.ofisSlug)
    .eq("danisan_slug", params.danisanSlug)
    .eq("yayinda", true)
    .single();
  if (!data) return { title: "Profil Bulunamadı" };
  return {
    title: `${data.danisan_adi} - ${data.ofis_adi} | Pyrize`,
    description: data.danisan_biyografi || `${data.danisan_adi} - ${data.ofis_adi}`,
    openGraph: { images: data.danisan_foto_url ? [data.danisan_foto_url] : [] },
  };
}

export default async function DanisanPublicPage({ params }: { params: { ofisSlug: string; danisanSlug: string } }) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return notFound();

  const { data: profil } = await supabase
    .from("ofis_profilleri")
    .select("*")
    .eq("ofis_slug", params.ofisSlug)
    .eq("danisan_slug", params.danisanSlug)
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
  } catch { /* no portfolio */ }

  const p = profil as OfisProfili;
  const fmt = (n: number) => new Intl.NumberFormat("tr-TR").format(n);
  const wa = p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <main className="min-h-screen bg-[#040813] text-white">
      {/* HERO — Full screen funnel section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#DBE64C]/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-16">
            {p.ofis_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.ofis_logo_url} alt={p.ofis_adi} className="h-10 object-contain" />
            ) : (
              <span className="text-lg font-bold">{p.ofis_adi}</span>
            )}
            <PyrizeLogo variant="dark" className="h-5 opacity-40" />
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            {p.danisan_foto_url && (
              <div className="w-44 h-56 md:w-52 md:h-64 rounded-2xl overflow-hidden border-2 border-[#DBE64C]/20 flex-shrink-0 shadow-[0_0_40px_rgba(219,230,76,0.1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.danisan_foto_url} alt={p.danisan_adi} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">{p.danisan_adi}</h1>
              {p.danisan_unvan && <p className="text-xl text-slate-300 mb-4">{p.danisan_unvan}</p>}
              {p.deneyim_yili && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#DBE64C] bg-[#DBE64C]/10 border border-[#DBE64C]/20 rounded-full px-4 py-1.5 mb-6">
                  {p.deneyim_yili} Yıl Deneyim
                </span>
              )}
              {p.sehir && <p className="text-base text-slate-400 mb-6">📍 {p.ilce ? `${p.ilce}, ` : ""}{p.sehir}</p>}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                {p.telefon && <a href={`tel:${p.telefon}`} className="px-5 py-2.5 rounded-xl bg-[#DBE64C] text-[#001F3F] font-semibold text-sm hover:opacity-90 transition">📞 {p.telefon}</a>}
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-sm hover:bg-emerald-500/20 transition">💬 WhatsApp</a>}
                {p.email && <a href={`mailto:${p.email}`} className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/15 transition">📧 E-posta</a>}
              </div>
              {p.uzmanlik_alanlari?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {p.uzmanlik_alanlari.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">{a}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/40"></div>
          </div>
        </div>
      </section>

      {/* İSTATİSTİKLER — Full screen */}
      {(p.toplam_satis > 0 || p.bu_yil_satis > 0 || p.mutlu_musteri > 0) && (
        <section className="min-h-[60vh] flex items-center border-y border-white/10 bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-6 py-16 w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {p.toplam_satis > 0 && <StatCard value={fmt(p.toplam_satis)} label="Toplam Satış" accent />}
            {p.bu_yil_satis > 0 && <StatCard value={fmt(p.bu_yil_satis)} label="Bu Yıl Satış" />}
            {p.mutlu_musteri > 0 && <StatCard value={`${fmt(p.mutlu_musteri)}+`} label="Mutlu Müşteri" />}
            {p.ortalama_satis_suresi && <StatCard value={`${p.ortalama_satis_suresi}`} suffix="gün" label="Ort. Satış Süresi" />}
          </div>
        </section>
      )}

      {/* HAKKIMDA — Full screen */}
      {p.danisan_biyografi && (
        <section className="min-h-[70vh] flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold mb-8">Merhaba, Ben {p.danisan_adi.split(" ")[0]}</h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mb-8">{p.danisan_biyografi}</p>
            {p.calisma_bolgesi?.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-[0.3em] mb-3">Çalışma Bölgeleri</p>
                <div className="flex flex-wrap gap-2">
                  {p.calisma_bolgesi.map((b, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PORTFÖY — Full screen */}
      {portfoyler.length > 0 && (
        <section className="min-h-screen flex items-center border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-16 w-full">
            <h2 className="text-3xl font-bold mb-2">Güncel Portföy</h2>
            <p className="text-sm text-slate-400 mb-10">Seçili mülklerimden bazıları</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfoyler.map((m) => (
                <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition group">
                  {m.kapak_foto_url && (
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.kapak_foto_url} alt={m.baslik} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${m.durum === "satildi" ? "bg-red-500/80" : m.durum === "kiralik" ? "bg-blue-500/80" : "bg-emerald-500/80"} text-white`}>
                        {m.durum === "satildi" ? "Satıldı" : m.durum === "kiralik" ? "Kiralık" : "Satılık"}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      {m.mulk_tipi && <span>{m.mulk_tipi}</span>}
                      {m.alan_m2 && <span>• {m.alan_m2}m²</span>}
                      {m.oda_sayisi && <span>• {m.oda_sayisi}</span>}
                    </div>
                    <h3 className="font-semibold text-white mb-1">{m.baslik}</h3>
                    {m.sehir && <p className="text-xs text-slate-500">{m.ilce ? `${m.ilce}, ` : ""}{m.sehir}</p>}
                    {m.fiyat && <p className="text-xl font-bold text-[#DBE64C] mt-3">{fmt(m.fiyat)} ₺</p>}
                    {wa && m.durum !== "satildi" && (
                      <a href={`${wa}?text=${encodeURIComponent(`Merhaba, "${m.baslik}" hakkında bilgi almak istiyorum.`)}`} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center text-xs font-semibold py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 transition">
                        Detay İste →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EKİP */}
      {p.ekip_uyeleri?.length > 0 && (
        <section className="min-h-[60vh] flex items-center border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-16 w-full">
            <h2 className="text-3xl font-bold mb-10">Ekibimiz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {p.ekip_uyeleri.map((u, i) => (
                <div key={i} className="text-center group">
                  {u.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.foto_url} alt={u.ad} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-white/10 group-hover:border-[#DBE64C]/30 transition" />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/10 flex items-center justify-center text-3xl text-slate-400">{u.ad[0]}</div>
                  )}
                  <p className="font-semibold">{u.ad}</p>
                  <p className="text-xs text-slate-400 mb-2">{u.unvan}</p>
                  {u.telefon && <a href={`tel:${u.telefon}`} className="text-xs text-[#DBE64C] hover:underline">📞 Ara</a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FOOTER — Full screen */}
      <section className="min-h-[60vh] flex items-center border-t border-white/10 bg-gradient-to-t from-[#DBE64C]/5 to-transparent">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center w-full">
          <h2 className="text-4xl font-bold mb-6">Mülk almak veya satmak mı istiyorsunuz?</h2>
          <p className="text-lg text-slate-400 mb-10">Profesyonel emlak danışmanlığı için bugün iletişime geçin.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="px-10 py-4 rounded-xl bg-emerald-500 text-white text-lg font-semibold hover:bg-emerald-400 transition shadow-[0_0_30px_rgba(16,185,129,0.3)]">WhatsApp&apos;tan Ulaş</a>}
            {p.telefon && <a href={`tel:${p.telefon}`} className="px-10 py-4 rounded-xl bg-[#DBE64C] text-[#001F3F] text-lg font-semibold hover:opacity-90 transition shadow-[0_0_30px_rgba(219,230,76,0.3)]">Ara: {p.telefon}</a>}
          </div>
          <div className="mt-16 flex items-center justify-center gap-2 text-xs text-slate-600">
            <PyrizeLogo variant="dark" className="h-3.5 opacity-30" />
            <span>ile oluşturuldu</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ value, label, suffix, accent }: { value: string; label: string; suffix?: string; accent?: boolean }) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
      <p className={`text-4xl md:text-5xl font-bold tabular-nums ${accent ? "text-[#DBE64C]" : "text-white"}`}>
        {value}{suffix && <span className="text-lg ml-1">{suffix}</span>}
      </p>
      <p className="text-xs text-slate-400 uppercase tracking-wider mt-2">{label}</p>
    </div>
  );
}
