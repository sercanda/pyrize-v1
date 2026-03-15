"use client";

import { useState, useEffect } from "react";
import { Building2, Users2, BarChart3, Settings2, Globe, Save, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { OfisProfili } from "@/types/ofis";

const TABS = [
  { key: "bilgi", label: "Ofis Bilgileri", icon: Building2 },
  { key: "ekip", label: "Ekibim", icon: Users2 },
  { key: "portfoy", label: "Portföyüm", icon: Building2 },
  { key: "istatistik", label: "İstatistikler", icon: BarChart3 },
  { key: "yayin", label: "Yayın Ayarları", icon: Settings2 },
];

const UZMANLIK_SECENEKLERI = ["Konut", "Ticari", "Arsa", "Villa", "Rezidans", "Ofis", "Otel"];

export default function OfisimPage() {
  const [activeTab, setActiveTab] = useState("bilgi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profil, setProfil] = useState<Partial<OfisProfili>>({
    ofis_adi: "",
    danisan_adi: "",
    danisan_unvan: "",
    danisan_biyografi: "",
    telefon: "",
    email: "",
    whatsapp: "",
    website: "",
    instagram_url: "",
    linkedin_url: "",
    sehir: "",
    ilce: "",
    adres: "",
    deneyim_yili: undefined,
    uzmanlik_alanlari: [],
    calisma_bolgesi: [],
    toplam_satis: 0,
    bu_yil_satis: 0,
    mutlu_musteri: 0,
    ortalama_satis_suresi: undefined,
    toplam_portfoy_degeri: undefined,
    ekip_uyeleri: [],
    slug: "",
    yayinda: false,
  });

  const supabase = getSupabaseClient();

  useEffect(() => {
    loadProfil();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfil() {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("ofis_profilleri")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) setProfil(data);
    } catch { /* first time */ }
    finally { setLoading(false); }
  }

  async function handleSave() {
    if (!supabase) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const slug = profil.slug || (profil.danisan_adi || "profil").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36);
      const payload = { ...profil, slug, user_id: user.id, updated_at: new Date().toISOString() };
      if (profil.id) {
        await supabase.from("ofis_profilleri").update(payload).eq("id", profil.id);
      } else {
        const { data } = await supabase.from("ofis_profilleri").insert(payload).select().single();
        if (data) setProfil(data);
      }
    } catch (err) { console.error("Profil kaydedilemedi:", err); }
    finally { setSaving(false); }
  }

  function updateField(field: string, value: any) {
    setProfil(prev => ({ ...prev, [field]: value }));
  }

  function toggleUzmanlik(alan: string) {
    const current = profil.uzmanlik_alanlari || [];
    updateField("uzmanlik_alanlari", current.includes(alan) ? current.filter(a => a !== alan) : [...current, alan]);
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-[#DBE64C]" /></div>;
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20";
  const labelClass = "block text-xs uppercase tracking-[0.2em] text-slate-400 mb-1.5";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Globe className="h-8 w-8 text-[#DBE64C]" />Ofisim</h1>
          <p className="mt-2 text-slate-400">Dijital vitrin sayfanızı oluşturun ve yönetin.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#DBE64C] px-6 py-3 text-sm font-semibold text-[#001F3F] transition hover:opacity-90 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      <div className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-white/10">
        {TABS.map(tab => { const Icon = tab.icon; return (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeTab === tab.key ? "bg-[#DBE64C]/10 text-[#DBE64C] border border-[#DBE64C]/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
            <Icon className="h-4 w-4" />{tab.label}
          </button>
        ); })}
      </div>

      {activeTab === "bilgi" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div><label className={labelClass}>Ofis Adı *</label><input value={profil.ofis_adi || ""} onChange={e => updateField("ofis_adi", e.target.value)} className={inputClass} placeholder="RE/MAX Parla" /></div>
            <div><label className={labelClass}>Danışman Adı *</label><input value={profil.danisan_adi || ""} onChange={e => updateField("danisan_adi", e.target.value)} className={inputClass} placeholder="Sercan Dağdeviren" /></div>
            <div><label className={labelClass}>Ünvan</label><input value={profil.danisan_unvan || ""} onChange={e => updateField("danisan_unvan", e.target.value)} className={inputClass} placeholder="Kıdemli Emlak Danışmanı" /></div>
            <div><label className={labelClass}>Deneyim (Yıl)</label><input type="number" value={profil.deneyim_yili || ""} onChange={e => updateField("deneyim_yili", parseInt(e.target.value) || undefined)} className={inputClass} placeholder="12" /></div>
          </div>
          <div><label className={labelClass}>Biyografi ({(profil.danisan_biyografi || "").length}/400)</label><textarea value={profil.danisan_biyografi || ""} onChange={e => updateField("danisan_biyografi", e.target.value.slice(0, 400))} rows={4} className={inputClass + " resize-none"} placeholder="Kendinizi tanıtın..." /></div>
          <div>
            <label className={labelClass}>Uzmanlık Alanları</label>
            <div className="flex flex-wrap gap-2">
              {UZMANLIK_SECENEKLERI.map(alan => (
                <button key={alan} onClick={() => toggleUzmanlik(alan)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${(profil.uzmanlik_alanlari || []).includes(alan) ? "border-[#DBE64C]/40 bg-[#DBE64C]/10 text-[#DBE64C]" : "border-white/10 text-slate-400 hover:border-white/20"}`}>{alan}</button>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className={labelClass}>Telefon</label><input value={profil.telefon || ""} onChange={e => updateField("telefon", e.target.value)} className={inputClass} placeholder="0532 XXX XX XX" /></div>
              <div><label className={labelClass}>WhatsApp</label><input value={profil.whatsapp || ""} onChange={e => updateField("whatsapp", e.target.value)} className={inputClass} placeholder="905XXXXXXXXX" /></div>
              <div><label className={labelClass}>E-posta</label><input value={profil.email || ""} onChange={e => updateField("email", e.target.value)} className={inputClass} placeholder="info@ofis.com" /></div>
              <div><label className={labelClass}>Website</label><input value={profil.website || ""} onChange={e => updateField("website", e.target.value)} className={inputClass} placeholder="https://..." /></div>
              <div><label className={labelClass}>Instagram</label><input value={profil.instagram_url || ""} onChange={e => updateField("instagram_url", e.target.value)} className={inputClass} placeholder="https://instagram.com/..." /></div>
              <div><label className={labelClass}>LinkedIn</label><input value={profil.linkedin_url || ""} onChange={e => updateField("linkedin_url", e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/..." /></div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Adres</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div><label className={labelClass}>Şehir</label><input value={profil.sehir || ""} onChange={e => updateField("sehir", e.target.value)} className={inputClass} placeholder="Samsun" /></div>
              <div><label className={labelClass}>İlçe</label><input value={profil.ilce || ""} onChange={e => updateField("ilce", e.target.value)} className={inputClass} placeholder="Atakum" /></div>
              <div className="md:col-span-3"><label className={labelClass}>Açık Adres</label><textarea value={profil.adres || ""} onChange={e => updateField("adres", e.target.value)} rows={2} className={inputClass + " resize-none"} placeholder="Tam adres..." /></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "istatistik" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div><label className={labelClass}>Toplam Satış Sayısı</label><input type="number" value={profil.toplam_satis || ""} onChange={e => updateField("toplam_satis", parseInt(e.target.value) || 0)} className={inputClass} /></div>
            <div><label className={labelClass}>Bu Yıl Satış</label><input type="number" value={profil.bu_yil_satis || ""} onChange={e => updateField("bu_yil_satis", parseInt(e.target.value) || 0)} className={inputClass} /></div>
            <div><label className={labelClass}>Mutlu Müşteri Sayısı</label><input type="number" value={profil.mutlu_musteri || ""} onChange={e => updateField("mutlu_musteri", parseInt(e.target.value) || 0)} className={inputClass} /></div>
            <div><label className={labelClass}>Ortalama Satış Süresi (gün)</label><input type="number" value={profil.ortalama_satis_suresi || ""} onChange={e => updateField("ortalama_satis_suresi", parseInt(e.target.value) || undefined)} className={inputClass} /></div>
          </div>
        </div>
      )}

      {activeTab === "yayin" && (
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Profil URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">pyrize.com/ofis/</span>
              <input value={profil.slug || ""} onChange={e => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className={inputClass + " flex-1"} placeholder="sercan-dagdeviren" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div><p className="text-sm font-semibold text-white">Yayın Durumu</p><p className="text-xs text-slate-400">Yayında ise herkes görebilir</p></div>
            <button onClick={() => updateField("yayinda", !profil.yayinda)} className={`relative w-12 h-6 rounded-full transition ${profil.yayinda ? "bg-[#DBE64C]" : "bg-white/20"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${profil.yayinda ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
          {profil.slug && profil.yayinda && (
            <div className="p-4 rounded-xl border border-[#DBE64C]/20 bg-[#DBE64C]/5">
              <p className="text-sm text-[#DBE64C] font-semibold mb-1">Profiliniz yayında!</p>
              <a href={`/ofis/${profil.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white underline">pyrize.com/ofis/{profil.slug}</a>
            </div>
          )}
        </div>
      )}

      {activeTab === "ekip" && (
        <div className="text-center py-16 text-slate-500"><Users2 className="h-12 w-12 mx-auto mb-4 text-slate-600" /><p className="text-sm">Ekip üyesi ekleme yakında aktif olacak.</p></div>
      )}

      {activeTab === "portfoy" && (
        <div className="text-center py-16 text-slate-500"><Building2 className="h-12 w-12 mx-auto mb-4 text-slate-600" /><p className="text-sm">Portföy yönetimi yakında aktif olacak.</p></div>
      )}
    </div>
  );
}
