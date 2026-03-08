"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Building2, Save } from "lucide-react";

const STORAGE_KEY = "pyrize.consultantProfiles.v1";

interface ProfileData {
  adSoyad: string;
  email: string;
  telefon: string;
  ofisAdi: string;
  unvan: string;
}

export default function ProfilPage() {
  const [profile, setProfile] = useState<ProfileData>({
    adSoyad: "",
    email: "",
    telefon: "",
    ofisAdi: "",
    unvan: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const profiles = JSON.parse(stored);
        if (Array.isArray(profiles) && profiles.length > 0) {
          const p = profiles[0];
          setProfile({
            adSoyad: p.adSoyad || "",
            email: p.email || "",
            telefon: p.telefon || "",
            ofisAdi: p.ofisAdi || "",
            unvan: p.unvan || "",
          });
        }
      } catch {}
    }
  }, []);

  const handleSave = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let profiles = [];
    try {
      profiles = stored ? JSON.parse(stored) : [];
    } catch {}

    if (profiles.length > 0) {
      profiles[0] = { ...profiles[0], ...profile };
    } else {
      profiles.push({ id: crypto.randomUUID(), label: "Ana Profil", ...profile });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none transition";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-lg font-semibold text-white mb-6">Profil Ayarları</h1>

      <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
            <User className="h-3.5 w-3.5" /> Ad Soyad
          </label>
          <input
            type="text"
            value={profile.adSoyad}
            onChange={(e) => setProfile((p) => ({ ...p, adSoyad: e.target.value }))}
            placeholder="Ad Soyad"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
              <Mail className="h-3.5 w-3.5" /> Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              placeholder="email@ornek.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
              <Phone className="h-3.5 w-3.5" /> Telefon
            </label>
            <input
              type="tel"
              value={profile.telefon}
              onChange={(e) => setProfile((p) => ({ ...p, telefon: e.target.value }))}
              placeholder="0555 123 4567"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
              <Building2 className="h-3.5 w-3.5" /> Ofis / Şirket
            </label>
            <input
              type="text"
              value={profile.ofisAdi}
              onChange={(e) => setProfile((p) => ({ ...p, ofisAdi: e.target.value }))}
              placeholder="Ofis adı"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-400">
              Unvan
            </label>
            <input
              type="text"
              value={profile.unvan}
              onChange={(e) => setProfile((p) => ({ ...p, unvan: e.target.value }))}
              placeholder="Emlak Danışmanı"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-emerald-400">Kaydedildi</span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/30"
          >
            <Save className="h-4 w-4" />
            Kaydet
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Profil bilgileri tarayıcınızda saklanır. Auth sistemi aktif olduğunda Supabase&apos;e taşınacaktır.
      </p>
    </div>
  );
}
