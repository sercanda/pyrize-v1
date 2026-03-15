"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Users2,
  BarChart3,
  Settings2,
  Globe,
  Save,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Copy,
  Check,
  Star,
  Phone,
  Mail,
  MapPin,
  Home,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { OfisProfili, EkipUyesi, OfisPortfoy } from "@/types/ofis";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: "bilgi", label: "Ofis Bilgileri", icon: Building2 },
  { key: "ekip", label: "Ekibim", icon: Users2 },
  { key: "portfoy", label: "Portföyüm", icon: Home },
  { key: "istatistik", label: "İstatistikler", icon: BarChart3 },
  { key: "yayin", label: "Yayın Ayarları", icon: Settings2 },
];

const UZMANLIK_SECENEKLERI = [
  "Konut",
  "Ticari",
  "Arsa",
  "Villa",
  "Rezidans",
  "Ofis",
  "Otel",
];

const MULK_TIPLERI = [
  "Daire",
  "Villa",
  "Arsa",
  "Ticari",
  "Ofis",
  "Rezidans",
  "Müstakil Ev",
  "Dükkan",
];

const DURUM_SECENEKLERI: { value: OfisPortfoy["durum"]; label: string }[] = [
  { value: "satilik", label: "Satılık" },
  { value: "kiralik", label: "Kiralık" },
  { value: "satildi", label: "Satıldı" },
];

const DURUM_RENKLERI: Record<string, string> = {
  satilik: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  kiralik: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  satildi: "bg-red-500/20 text-red-400 border-red-500/30",
};

const DURUM_LABEL: Record<string, string> = {
  satilik: "Satılık",
  kiralik: "Kiralık",
  satildi: "Satıldı",
};

const INPUT_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#DBE64C]/30 focus:outline-none focus:ring-1 focus:ring-[#DBE64C]/20";
const LABEL_CLASS = "block text-xs uppercase tracking-[0.2em] text-slate-400 mb-1.5";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(price: number | undefined): string {
  if (!price) return "";
  return new Intl.NumberFormat("tr-TR").format(price);
}

/* ------------------------------------------------------------------ */
/*  Empty states for new records                                       */
/* ------------------------------------------------------------------ */

function emptyEkipUyesi(): EkipUyesi {
  return {
    id: crypto.randomUUID(),
    ad: "",
    unvan: "",
    foto_url: "",
    telefon: "",
    email: "",
    uzmanlik: "",
  };
}

function emptyPortfoy(): Omit<OfisPortfoy, "id" | "ofis_id" | "created_at"> {
  return {
    baslik: "",
    aciklama: "",
    mulk_tipi: "Daire",
    durum: "satilik",
    fiyat: undefined,
    fiyat_birimi: "TL",
    adres: "",
    ilce: "",
    sehir: "",
    alan_m2: undefined,
    oda_sayisi: "",
    kat: undefined,
    bina_yasi: undefined,
    kapak_foto_url: "",
    foto_urls: [],
    one_cikar: false,
    aktif: true,
  };
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function OfisimPage() {
  const [activeTab, setActiveTab] = useState("bilgi");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Profile state
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
    ofis_slug: "",
    danisan_slug: "",
    slug: "",
    yayinda: false,
  });

  // Ekip modal state
  const [ekipModalOpen, setEkipModalOpen] = useState(false);
  const [ekipEditing, setEkipEditing] = useState<EkipUyesi | null>(null);
  const [ekipForm, setEkipForm] = useState<EkipUyesi>(emptyEkipUyesi());

  // Portfoy state
  const [portfoyler, setPortfoyler] = useState<OfisPortfoy[]>([]);
  const [portfoyLoading, setPortfoyLoading] = useState(false);
  const [portfoyModalOpen, setPortfoyModalOpen] = useState(false);
  const [portfoyEditing, setPortfoyEditing] = useState<OfisPortfoy | null>(null);
  const [portfoyForm, setPortfoyForm] = useState<
    Omit<OfisPortfoy, "id" | "ofis_id" | "created_at">
  >(emptyPortfoy());
  const [portfoySaving, setPortfoySaving] = useState(false);

  const supabase = getSupabaseClient();

  /* ---- Load profile ---- */
  useEffect(() => {
    loadProfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfil() {
    if (!supabase) return;
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("ofis_profilleri")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setProfil(data);
      }
    } catch {
      /* first time user - no profile yet */
    } finally {
      setLoading(false);
    }
  }

  /* ---- Load portfolio items (after profile loaded) ---- */
  const loadPortfoyler = useCallback(async () => {
    if (!supabase || !profil.id) return;
    setPortfoyLoading(true);
    try {
      const { data } = await supabase
        .from("ofis_portfoyleri")
        .select("*")
        .eq("ofis_id", profil.id)
        .order("created_at", { ascending: false });
      if (data) setPortfoyler(data);
    } catch {
      /* ignore */
    } finally {
      setPortfoyLoading(false);
    }
  }, [supabase, profil.id]);

  useEffect(() => {
    if (profil.id && activeTab === "portfoy") {
      loadPortfoyler();
    }
  }, [profil.id, activeTab, loadPortfoyler]);

  /* ---- Save profile (includes ekip_uyeleri) ---- */
  async function handleSave() {
    if (!supabase) return;
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const ofisSlug =
        profil.ofis_slug || slugify(profil.ofis_adi || "ofis");
      const danisanSlug =
        profil.danisan_slug || slugify(profil.danisan_adi || "danisan");
      const legacySlug = profil.slug || `${ofisSlug}--${danisanSlug}`;

      const payload = {
        ...profil,
        ofis_slug: ofisSlug,
        danisan_slug: danisanSlug,
        slug: legacySlug,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (profil.id) {
        await supabase
          .from("ofis_profilleri")
          .update(payload)
          .eq("id", profil.id);
        setProfil((prev) => ({ ...prev, ofis_slug: ofisSlug, danisan_slug: danisanSlug, slug: legacySlug }));
      } else {
        const { data } = await supabase
          .from("ofis_profilleri")
          .insert(payload)
          .select()
          .single();
        if (data) setProfil(data);
      }
    } catch (err) {
      console.error("Profil kaydedilemedi:", err);
    } finally {
      setSaving(false);
    }
  }

  /* ---- Generic field updater ---- */
  function updateField(field: string, value: unknown) {
    setProfil((prev) => ({ ...prev, [field]: value }));
  }

  function toggleUzmanlik(alan: string) {
    const current = profil.uzmanlik_alanlari || [];
    updateField(
      "uzmanlik_alanlari",
      current.includes(alan)
        ? current.filter((a) => a !== alan)
        : [...current, alan]
    );
  }

  /* ================================================================ */
  /*  Ekip CRUD (stored in profil.ekip_uyeleri JSONB)                  */
  /* ================================================================ */

  function openEkipAdd() {
    setEkipEditing(null);
    setEkipForm(emptyEkipUyesi());
    setEkipModalOpen(true);
  }

  function openEkipEdit(uye: EkipUyesi) {
    setEkipEditing(uye);
    setEkipForm({ ...uye });
    setEkipModalOpen(true);
  }

  function handleEkipSave() {
    const ekip = profil.ekip_uyeleri || [];
    if (ekipEditing) {
      // update existing
      const updated = ekip.map((u) =>
        u.id === ekipEditing.id ? { ...ekipForm } : u
      );
      updateField("ekip_uyeleri", updated);
    } else {
      // add new
      updateField("ekip_uyeleri", [...ekip, { ...ekipForm }]);
    }
    setEkipModalOpen(false);
  }

  function handleEkipDelete(id: string) {
    const ekip = profil.ekip_uyeleri || [];
    updateField(
      "ekip_uyeleri",
      ekip.filter((u) => u.id !== id)
    );
  }

  /* ================================================================ */
  /*  Portfoy CRUD (separate Supabase table)                           */
  /* ================================================================ */

  function openPortfoyAdd() {
    setPortfoyEditing(null);
    setPortfoyForm(emptyPortfoy());
    setPortfoyModalOpen(true);
  }

  function openPortfoyEdit(p: OfisPortfoy) {
    setPortfoyEditing(p);
    setPortfoyForm({
      baslik: p.baslik,
      aciklama: p.aciklama,
      mulk_tipi: p.mulk_tipi,
      durum: p.durum,
      fiyat: p.fiyat,
      fiyat_birimi: p.fiyat_birimi,
      adres: p.adres,
      ilce: p.ilce,
      sehir: p.sehir,
      alan_m2: p.alan_m2,
      oda_sayisi: p.oda_sayisi,
      kat: p.kat,
      bina_yasi: p.bina_yasi,
      kapak_foto_url: p.kapak_foto_url,
      foto_urls: p.foto_urls,
      one_cikar: p.one_cikar,
      aktif: p.aktif,
    });
    setPortfoyModalOpen(true);
  }

  async function handlePortfoySave() {
    if (!supabase || !profil.id) return;
    setPortfoySaving(true);
    try {
      if (portfoyEditing) {
        // update
        const { error } = await supabase
          .from("ofis_portfoyleri")
          .update({ ...portfoyForm })
          .eq("id", portfoyEditing.id);
        if (!error) {
          setPortfoyler((prev) =>
            prev.map((p) =>
              p.id === portfoyEditing.id ? { ...p, ...portfoyForm } : p
            )
          );
        }
      } else {
        // insert
        const { data, error } = await supabase
          .from("ofis_portfoyleri")
          .insert({ ...portfoyForm, ofis_id: profil.id })
          .select()
          .single();
        if (!error && data) {
          setPortfoyler((prev) => [data, ...prev]);
        }
      }
      setPortfoyModalOpen(false);
    } catch (err) {
      console.error("Portföy kaydedilemedi:", err);
    } finally {
      setPortfoySaving(false);
    }
  }

  async function handlePortfoyDelete(id: string) {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from("ofis_portfoyleri")
        .delete()
        .eq("id", id);
      if (!error) {
        setPortfoyler((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      /* ignore */
    }
  }

  /* ---- Copy URL to clipboard ---- */
  function copyUrl() {
    const url = `pyrize.com/ofis/${profil.ofis_slug || "ofis-slug"}/${profil.danisan_slug || "danisan-slug"}`;
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#DBE64C]" />
      </div>
    );
  }

  const fullUrl = `pyrize.com/ofis/${profil.ofis_slug || "ofis-slug"}/${profil.danisan_slug || "danisan-slug"}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Globe className="h-8 w-8 text-[#DBE64C]" />
            Ofisim
          </h1>
          <p className="mt-2 text-slate-400">
            Dijital vitrin sayfanızı oluşturun ve yönetin.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#DBE64C] px-6 py-3 text-sm font-semibold text-[#001F3F] transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2 border-b border-white/10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.key
                  ? "bg-[#DBE64C]/10 text-[#DBE64C] border border-[#DBE64C]/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/*  TAB 1: Ofis Bilgileri                                        */}
      {/* ============================================================ */}
      {activeTab === "bilgi" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Ofis Adı *</label>
              <input
                value={profil.ofis_adi || ""}
                onChange={(e) => updateField("ofis_adi", e.target.value)}
                className={INPUT_CLASS}
                placeholder="RE/MAX Parla"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Danışman Adı *</label>
              <input
                value={profil.danisan_adi || ""}
                onChange={(e) => updateField("danisan_adi", e.target.value)}
                className={INPUT_CLASS}
                placeholder="Sercan Dağdeviren"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Ünvan</label>
              <input
                value={profil.danisan_unvan || ""}
                onChange={(e) => updateField("danisan_unvan", e.target.value)}
                className={INPUT_CLASS}
                placeholder="Kıdemli Emlak Danışmanı"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Deneyim (Yıl)</label>
              <input
                type="number"
                value={profil.deneyim_yili ?? ""}
                onChange={(e) =>
                  updateField(
                    "deneyim_yili",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className={INPUT_CLASS}
                placeholder="12"
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>
              Biyografi ({(profil.danisan_biyografi || "").length}/400)
            </label>
            <textarea
              value={profil.danisan_biyografi || ""}
              onChange={(e) =>
                updateField("danisan_biyografi", e.target.value.slice(0, 400))
              }
              rows={4}
              className={INPUT_CLASS + " resize-none"}
              placeholder="Kendinizi tanıtın..."
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Uzmanlık Alanları</label>
            <div className="flex flex-wrap gap-2">
              {UZMANLIK_SECENEKLERI.map((alan) => (
                <button
                  key={alan}
                  onClick={() => toggleUzmanlik(alan)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    (profil.uzmanlik_alanlari || []).includes(alan)
                      ? "border-[#DBE64C]/40 bg-[#DBE64C]/10 text-[#DBE64C]"
                      : "border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  {alan}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={LABEL_CLASS}>Telefon</label>
                <input
                  value={profil.telefon || ""}
                  onChange={(e) => updateField("telefon", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="0532 XXX XX XX"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>WhatsApp</label>
                <input
                  value={profil.whatsapp || ""}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="905XXXXXXXXX"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>E-posta</label>
                <input
                  value={profil.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="info@ofis.com"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Website</label>
                <input
                  value={profil.website || ""}
                  onChange={(e) => updateField("website", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Instagram</label>
                <input
                  value={profil.instagram_url || ""}
                  onChange={(e) => updateField("instagram_url", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>LinkedIn</label>
                <input
                  value={profil.linkedin_url || ""}
                  onChange={(e) => updateField("linkedin_url", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Adres</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={LABEL_CLASS}>Şehir</label>
                <input
                  value={profil.sehir || ""}
                  onChange={(e) => updateField("sehir", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Samsun"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>İlçe</label>
                <input
                  value={profil.ilce || ""}
                  onChange={(e) => updateField("ilce", e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="Atakum"
                />
              </div>
              <div className="md:col-span-3">
                <label className={LABEL_CLASS}>Açık Adres</label>
                <textarea
                  value={profil.adres || ""}
                  onChange={(e) => updateField("adres", e.target.value)}
                  rows={2}
                  className={INPUT_CLASS + " resize-none"}
                  placeholder="Tam adres..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB 2: Ekibim                                                */}
      {/* ============================================================ */}
      {activeTab === "ekip" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Ekip Üyeleri</h3>
              <p className="text-sm text-slate-400 mt-1">
                Ekibinizdeki kişileri ekleyin. Kaydet butonuyla profille birlikte kaydedilir.
              </p>
            </div>
            <button
              onClick={openEkipAdd}
              className="flex items-center gap-2 rounded-xl bg-[#DBE64C] px-4 py-2.5 text-sm font-semibold text-[#001F3F] transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Üye Ekle
            </button>
          </div>

          {(profil.ekip_uyeleri || []).length === 0 ? (
            <div className="text-center py-16">
              <Users2 className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">
                Henüz ekip üyesi eklenmemiş.
              </p>
              <button
                onClick={openEkipAdd}
                className="mt-4 text-sm text-[#DBE64C] hover:underline"
              >
                İlk üyeyi ekle
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(profil.ekip_uyeleri || []).map((uye) => (
                <div
                  key={uye.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {uye.foto_url ? (
                      <img
                        src={uye.foto_url}
                        alt={uye.ad}
                        className="h-14 w-14 rounded-xl object-cover border border-white/10"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center text-white/40 text-xl font-bold">
                        {uye.ad?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {uye.ad}
                      </p>
                      {uye.unvan && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {uye.unvan}
                        </p>
                      )}
                      {uye.uzmanlik && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border border-[#DBE64C]/30 bg-[#DBE64C]/10 text-[#DBE64C]">
                          {uye.uzmanlik}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 flex-1">
                    {uye.telefon && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="truncate">{uye.telefon}</span>
                      </div>
                    )}
                    {uye.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{uye.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                    <button
                      onClick={() => openEkipEdit(uye)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 transition"
                    >
                      <Pencil className="h-3 w-3" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleEkipDelete(uye.id)}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB 3: Portföyüm                                            */}
      {/* ============================================================ */}
      {activeTab === "portfoy" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Portföy Mülkleri</h3>
              <p className="text-sm text-slate-400 mt-1">
                Vitrin sayfanızda gösterilecek mülkleri yönetin.
              </p>
            </div>
            <button
              onClick={openPortfoyAdd}
              disabled={!profil.id}
              className="flex items-center gap-2 rounded-xl bg-[#DBE64C] px-4 py-2.5 text-sm font-semibold text-[#001F3F] transition hover:opacity-90 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Mülk Ekle
            </button>
          </div>

          {!profil.id && (
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <p className="text-sm text-yellow-400">
                Portföy ekleyebilmek için önce profili kaydedin.
              </p>
            </div>
          )}

          {portfoyLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#DBE64C]" />
            </div>
          ) : portfoyler.length === 0 && profil.id ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">
                Henüz portföyünüzde mülk yok.
              </p>
              <button
                onClick={openPortfoyAdd}
                className="mt-4 text-sm text-[#DBE64C] hover:underline"
              >
                İlk mülkü ekle
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {portfoyler.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col"
                >
                  {/* Cover image */}
                  <div className="relative h-40 bg-white/5">
                    {p.kapak_foto_url ? (
                      <img
                        src={p.kapak_foto_url}
                        alt={p.baslik}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-slate-700" />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          DURUM_RENKLERI[p.durum] || ""
                        }`}
                      >
                        {DURUM_LABEL[p.durum] || p.durum}
                      </span>
                      {p.one_cikar && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold border border-[#DBE64C]/40 bg-[#DBE64C]/20 text-[#DBE64C] flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5" />
                          Vitrin
                        </span>
                      )}
                    </div>
                    {p.mulk_tipi && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 text-white/80 backdrop-blur-sm">
                        {p.mulk_tipi}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {p.baslik || "Başlıksız Mülk"}
                    </h4>
                    {(p.sehir || p.ilce) && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {[p.ilce, p.sehir].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                      {p.alan_m2 && <span>{p.alan_m2} m²</span>}
                      {p.oda_sayisi && <span>{p.oda_sayisi}</span>}
                      {p.kat !== undefined && p.kat !== null && (
                        <span>Kat {p.kat}</span>
                      )}
                    </div>

                    {p.fiyat && (
                      <p className="mt-2 text-base font-bold text-[#DBE64C]">
                        {formatPrice(p.fiyat)} {p.fiyat_birimi || "TL"}
                      </p>
                    )}

                    <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
                      <button
                        onClick={() => openPortfoyEdit(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 transition"
                      >
                        <Pencil className="h-3 w-3" />
                        Düzenle
                      </button>
                      <button
                        onClick={() => handlePortfoyDelete(p.id)}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB 4: İstatistikler                                         */}
      {/* ============================================================ */}
      {activeTab === "istatistik" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Performans İstatistikleri
            </h3>
            <p className="text-sm text-slate-400">
              Bu veriler vitrin sayfanızda görüntülenir.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Toplam Satış Sayısı</label>
              <input
                type="number"
                value={profil.toplam_satis ?? ""}
                onChange={(e) =>
                  updateField("toplam_satis", parseInt(e.target.value) || 0)
                }
                className={INPUT_CLASS}
                placeholder="0"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Bu Yıl Satış</label>
              <input
                type="number"
                value={profil.bu_yil_satis ?? ""}
                onChange={(e) =>
                  updateField("bu_yil_satis", parseInt(e.target.value) || 0)
                }
                className={INPUT_CLASS}
                placeholder="0"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Mutlu Müşteri Sayısı</label>
              <input
                type="number"
                value={profil.mutlu_musteri ?? ""}
                onChange={(e) =>
                  updateField("mutlu_musteri", parseInt(e.target.value) || 0)
                }
                className={INPUT_CLASS}
                placeholder="0"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>
                Ortalama Satış Süresi (gün)
              </label>
              <input
                type="number"
                value={profil.ortalama_satis_suresi ?? ""}
                onChange={(e) =>
                  updateField(
                    "ortalama_satis_suresi",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className={INPUT_CLASS}
                placeholder="30"
              />
            </div>
            <div className="md:col-span-2">
              <label className={LABEL_CLASS}>
                Toplam Portföy Değeri (TL)
              </label>
              <input
                type="number"
                value={profil.toplam_portfoy_degeri ?? ""}
                onChange={(e) =>
                  updateField(
                    "toplam_portfoy_degeri",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className={INPUT_CLASS}
                placeholder="50000000"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  TAB 5: Yayın Ayarları                                        */}
      {/* ============================================================ */}
      {activeTab === "yayin" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              URL ve Yayın Ayarları
            </h3>
            <p className="text-sm text-slate-400">
              Vitrin sayfanızın adresini ve yayın durumunu ayarlayın.
            </p>
          </div>

          {/* Ofis Slug */}
          <div>
            <label className={LABEL_CLASS}>Ofis Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 whitespace-nowrap">
                pyrize.com/ofis/
              </span>
              <input
                value={profil.ofis_slug || ""}
                onChange={(e) =>
                  updateField(
                    "ofis_slug",
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "")
                  )
                }
                className={INPUT_CLASS + " flex-1"}
                placeholder="remax-parla"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ofis adınızdan otomatik oluşturulur. Sadece küçük harf, rakam ve
              tire kullanın.
            </p>
          </div>

          {/* Danisan Slug */}
          <div>
            <label className={LABEL_CLASS}>Danışman Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 whitespace-nowrap">
                .../{profil.ofis_slug || "ofis-slug"}/
              </span>
              <input
                value={profil.danisan_slug || ""}
                onChange={(e) =>
                  updateField(
                    "danisan_slug",
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "")
                  )
                }
                className={INPUT_CLASS + " flex-1"}
                placeholder="sercan-dagdeviren"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Danışman adınızdan otomatik oluşturulur.
            </p>
          </div>

          {/* Full URL preview */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <label className={LABEL_CLASS}>Tam URL Önizleme</label>
            <div className="flex items-center gap-3 mt-2">
              <code className="flex-1 rounded-lg bg-black/30 px-4 py-2.5 text-sm text-[#DBE64C] font-mono truncate">
                https://{fullUrl}
              </code>
              <button
                onClick={copyUrl}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2.5 text-xs text-white hover:bg-white/20 transition whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Kopyala
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <div>
              <p className="text-sm font-semibold text-white">Yayın Durumu</p>
              <p className="text-xs text-slate-400">
                Yayında ise herkes görebilir
              </p>
            </div>
            <button
              onClick={() => updateField("yayinda", !profil.yayinda)}
              className={`relative w-12 h-6 rounded-full transition ${
                profil.yayinda ? "bg-[#DBE64C]" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  profil.yayinda ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Status info */}
          {profil.ofis_slug && profil.danisan_slug && profil.yayinda && (
            <div className="p-4 rounded-2xl border border-[#DBE64C]/20 bg-[#DBE64C]/5">
              <p className="text-sm text-[#DBE64C] font-semibold mb-1">
                Profiliniz yayında!
              </p>
              <a
                href={`/ofis/${profil.ofis_slug}/${profil.danisan_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white underline"
              >
                https://{fullUrl}
              </a>
            </div>
          )}

          {!profil.yayinda && (
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
              <p className="text-sm text-slate-400">
                Profiliniz taslak durumunda. Yayına almak için toggle&apos;ı
                açın ve kaydedin.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/*  MODAL: Ekip Üyesi Ekle/Düzenle                              */}
      {/* ============================================================ */}
      {ekipModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEkipModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-[#0a0f1a] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {ekipEditing ? "Üye Düzenle" : "Yeni Ekip Üyesi"}
              </h3>
              <button
                onClick={() => setEkipModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={LABEL_CLASS}>Ad Soyad *</label>
                <input
                  value={ekipForm.ad}
                  onChange={(e) =>
                    setEkipForm((f) => ({ ...f, ad: e.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Ünvan</label>
                <input
                  value={ekipForm.unvan}
                  onChange={(e) =>
                    setEkipForm((f) => ({ ...f, unvan: e.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="Emlak Danışmanı"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Fotoğraf URL</label>
                <input
                  value={ekipForm.foto_url || ""}
                  onChange={(e) =>
                    setEkipForm((f) => ({ ...f, foto_url: e.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="https://..."
                />
              </div>
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Telefon</label>
                  <input
                    value={ekipForm.telefon || ""}
                    onChange={(e) =>
                      setEkipForm((f) => ({ ...f, telefon: e.target.value }))
                    }
                    className={INPUT_CLASS}
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>E-posta</label>
                  <input
                    value={ekipForm.email || ""}
                    onChange={(e) =>
                      setEkipForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className={INPUT_CLASS}
                    placeholder="ad@ofis.com"
                  />
                </div>
              </div>
              <div>
                <label className={LABEL_CLASS}>Uzmanlık Alanı</label>
                <input
                  value={ekipForm.uzmanlik || ""}
                  onChange={(e) =>
                    setEkipForm((f) => ({ ...f, uzmanlik: e.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="Konut, Villa, Arsa..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEkipModalOpen(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition"
              >
                İptal
              </button>
              <button
                onClick={handleEkipSave}
                disabled={!ekipForm.ad.trim()}
                className="flex-1 rounded-xl bg-[#DBE64C] px-4 py-2.5 text-sm font-semibold text-[#001F3F] transition hover:opacity-90 disabled:opacity-50"
              >
                {ekipEditing ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  MODAL: Portföy Mülk Ekle/Düzenle                            */}
      {/* ============================================================ */}
      {portfoyModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setPortfoyModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-white/10 bg-[#0a0f1a] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {portfoyEditing ? "Mülk Düzenle" : "Yeni Mülk Ekle"}
              </h3>
              <button
                onClick={() => setPortfoyModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Row 1: Title */}
              <div>
                <label className={LABEL_CLASS}>Başlık *</label>
                <input
                  value={portfoyForm.baslik}
                  onChange={(e) =>
                    setPortfoyForm((f) => ({ ...f, baslik: e.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="Deniz Manzaralı 3+1 Daire"
                />
              </div>

              {/* Row 2: Type & Status */}
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Mülk Tipi</label>
                  <select
                    value={portfoyForm.mulk_tipi || "Daire"}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({
                        ...f,
                        mulk_tipi: e.target.value,
                      }))
                    }
                    className={INPUT_CLASS}
                  >
                    {MULK_TIPLERI.map((t) => (
                      <option key={t} value={t} className="bg-[#0a0f1a]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Durum</label>
                  <select
                    value={portfoyForm.durum}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({
                        ...f,
                        durum: e.target.value as OfisPortfoy["durum"],
                      }))
                    }
                    className={INPUT_CLASS}
                  >
                    {DURUM_SECENEKLERI.map((d) => (
                      <option key={d.value} value={d.value} className="bg-[#0a0f1a]">
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Price & Area */}
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Fiyat (TL)</label>
                  <input
                    type="number"
                    value={portfoyForm.fiyat ?? ""}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({
                        ...f,
                        fiyat: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    className={INPUT_CLASS}
                    placeholder="3500000"
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Alan (m²)</label>
                  <input
                    type="number"
                    value={portfoyForm.alan_m2 ?? ""}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({
                        ...f,
                        alan_m2: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    className={INPUT_CLASS}
                    placeholder="120"
                  />
                </div>
              </div>

              {/* Row 4: Rooms & Floor */}
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Oda Sayısı</label>
                  <input
                    value={portfoyForm.oda_sayisi || ""}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({
                        ...f,
                        oda_sayisi: e.target.value,
                      }))
                    }
                    className={INPUT_CLASS}
                    placeholder="3+1"
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Kat</label>
                  <input
                    type="number"
                    value={portfoyForm.kat ?? ""}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({
                        ...f,
                        kat: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    className={INPUT_CLASS}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Row 5: City & District */}
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className={LABEL_CLASS}>Şehir</label>
                  <input
                    value={portfoyForm.sehir || ""}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({ ...f, sehir: e.target.value }))
                    }
                    className={INPUT_CLASS}
                    placeholder="Samsun"
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>İlçe</label>
                  <input
                    value={portfoyForm.ilce || ""}
                    onChange={(e) =>
                      setPortfoyForm((f) => ({ ...f, ilce: e.target.value }))
                    }
                    className={INPUT_CLASS}
                    placeholder="Atakum"
                  />
                </div>
              </div>

              {/* Row 6: Address */}
              <div>
                <label className={LABEL_CLASS}>Adres</label>
                <input
                  value={portfoyForm.adres || ""}
                  onChange={(e) =>
                    setPortfoyForm((f) => ({ ...f, adres: e.target.value }))
                  }
                  className={INPUT_CLASS}
                  placeholder="Mahalle, sokak bilgisi..."
                />
              </div>

              {/* Row 7: Cover photo */}
              <div>
                <label className={LABEL_CLASS}>Kapak Fotoğraf URL</label>
                <input
                  value={portfoyForm.kapak_foto_url || ""}
                  onChange={(e) =>
                    setPortfoyForm((f) => ({
                      ...f,
                      kapak_foto_url: e.target.value,
                    }))
                  }
                  className={INPUT_CLASS}
                  placeholder="https://..."
                />
              </div>

              {/* Row 8: Featured toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Vitrinde Öne Çıkar
                  </p>
                  <p className="text-xs text-slate-400">
                    Bu mülk vitrin sayfasında öncelikli gösterilir
                  </p>
                </div>
                <button
                  onClick={() =>
                    setPortfoyForm((f) => ({ ...f, one_cikar: !f.one_cikar }))
                  }
                  className={`relative w-12 h-6 rounded-full transition ${
                    portfoyForm.one_cikar ? "bg-[#DBE64C]" : "bg-white/20"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      portfoyForm.one_cikar
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setPortfoyModalOpen(false)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 transition"
              >
                İptal
              </button>
              <button
                onClick={handlePortfoySave}
                disabled={!portfoyForm.baslik.trim() || portfoySaving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#DBE64C] px-4 py-2.5 text-sm font-semibold text-[#001F3F] transition hover:opacity-90 disabled:opacity-50"
              >
                {portfoySaving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {portfoyEditing ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
