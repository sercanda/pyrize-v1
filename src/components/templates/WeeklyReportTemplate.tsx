/**
 * Haftalık Rapor Template Component
 * Dark tema, Spring (#DBE64C) accent, 2×3 metrik grid + geri bildirim sayfası.
 */
'use client';

import React from 'react';
import { HaftalikRaporVerisi, DanismanBilgileri } from '@/types';
import { Eye, Heart, MessageCircle, DollarSign, BarChart3, FileText, Phone, Mail } from 'lucide-react';

interface WeeklyReportTemplateProps {
  haftalikRapor: HaftalikRaporVerisi;
  danisman: DanismanBilgileri;
  baslik?: string;
}

const SPRING = '#DBE64C';
const MIDNIGHT = '#001F3F';

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex flex-col gap-3 print:border-slate-200 print:bg-slate-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${SPRING}20` }}>
          <Icon className="w-4 h-4" style={{ color: SPRING }} />
        </div>
        <span className="text-xs text-slate-400 uppercase tracking-wider print:text-slate-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white tabular-nums print:text-slate-900">
        {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
      </p>
      {sub && (
        <p className="text-xs text-slate-500 print:text-slate-500">{sub}</p>
      )}
    </div>
  );
}

export default function WeeklyReportTemplate({
  haftalikRapor,
  danisman,
  baslik = 'Haftalık Performans Raporu',
}: WeeklyReportTemplateProps) {
  const {
    raporBasligi,
    mulkAdi,
    portfoyAdi,
    haftaBaslangic,
    haftaBitis,
    danismanAdi,
    musteriAdi,
    toplamGoruntulenme = 0,
    haftalikGoruntulenme = 0,
    toplamFavoriSayisi = 0,
    haftalikFavoriArtisi = 0,
    toplamMesajSayisi = 0,
    toplamAramaSayisi = 0,
    harcananButce = 0,
    goruntulenmeImpressions = 0,
    yapilanTeklifSayisi = 0,
    yerindeGosterimSayisi = 0,
    ciddiAliciSayisi = 0,
    redOlanTeklifSayisi = 0,
    saticiYorumu,
    potansiyelAliciGeriBildirimleri,
    gorulenAnaProblemler,
    // legacy
    goruntulenmeSayisi = 0,
  } = haftalikRapor;

  const toplamGoruntulenmeVal = toplamGoruntulenme || goruntulenmeSayisi || 0;

  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const haftaAraligi = haftaBaslangic && haftaBitis
    ? `${formatDate(haftaBaslangic)} — ${formatDate(haftaBitis)}`
    : '';

  const hasFeedback = !!(saticiYorumu || potansiyelAliciGeriBildirimleri || gorulenAnaProblemler);
  const hasPhysical = yerindeGosterimSayisi > 0 || ciddiAliciSayisi > 0 || redOlanTeklifSayisi > 0;

  const displayName = danismanAdi || danisman?.adSoyad || '';
  const officeName = danisman?.ofisAdi || '';
  const propertyName = mulkAdi || portfoyAdi || raporBasligi || baslik;

  return (
    <div
      data-konsept="haftalik-rapor"
      className="min-h-screen bg-slate-950 text-white antialiased relative overflow-x-hidden print:bg-white print:text-black"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
      </div>

      {/* Top accent bar */}
      <div
        className="relative z-20 w-full py-2.5 px-6 flex items-center justify-between print:hidden"
        style={{ background: `${SPRING}18`, borderBottom: `1px solid ${SPRING}30` }}
      >
        <span className="text-[9px] uppercase tracking-[0.5em] font-semibold" style={{ color: SPRING }}>
          Haftalık Performans Raporu
        </span>
        {officeName && (
          <span className="text-[9px] uppercase tracking-[0.4em] font-semibold" style={{ color: SPRING }}>
            {officeName}
          </span>
        )}
      </div>

      {/* PAGE 1 — Metrics */}
      <div
        data-pdf-page="1"
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-12 print:px-8 print:py-10 print:break-after-page"
      >
        {/* Print-only header bar */}
        <div
          className="hidden print:flex items-center justify-between mb-8 pb-4"
          style={{ borderBottom: `2px solid ${SPRING}` }}
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] font-semibold" style={{ color: SPRING }}>
              Haftalık Performans Raporu
            </p>
            {officeName && <p className="text-xs text-slate-500 mt-0.5">{officeName}</p>}
          </div>
          {haftaAraligi && <p className="text-xs text-slate-500">{haftaAraligi}</p>}
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 print:text-slate-900">{propertyName}</h1>
              {musteriAdi && (
                <p className="text-slate-400 text-sm mb-1 print:text-slate-600">Müşteri: {musteriAdi}</p>
              )}
              {displayName && (
                <p className="text-slate-400 text-sm print:text-slate-600">Danışman: {displayName}</p>
              )}
            </div>
            {haftaAraligi && (
              <div
                className="rounded-xl px-4 py-2.5 text-sm font-semibold print:border print:border-slate-200 print:rounded-lg"
                style={{ background: `${SPRING}18`, color: SPRING }}
              >
                {haftaAraligi}
              </div>
            )}
          </div>
        </div>

        {/* Metric Grid 2×3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Eye}
            label="Görüntülenme"
            value={toplamGoruntulenmeVal}
            sub={haftalikGoruntulenme > 0 ? `Bu hafta: +${haftalikGoruntulenme.toLocaleString('tr-TR')}` : undefined}
          />
          <StatCard
            icon={Heart}
            label="Favori"
            value={toplamFavoriSayisi}
            sub={haftalikFavoriArtisi > 0 ? `Bu hafta: +${haftalikFavoriArtisi.toLocaleString('tr-TR')}` : undefined}
          />
          <StatCard
            icon={MessageCircle}
            label="Mesaj + Arama"
            value={toplamMesajSayisi + toplamAramaSayisi}
            sub={
              toplamMesajSayisi > 0 && toplamAramaSayisi > 0
                ? `${toplamMesajSayisi} mesaj · ${toplamAramaSayisi} arama`
                : undefined
            }
          />
          <StatCard
            icon={DollarSign}
            label="Reklam Bütçesi"
            value={harcananButce > 0 ? `₺${harcananButce.toLocaleString('tr-TR')}` : '—'}
          />
          <StatCard
            icon={BarChart3}
            label="Gösterim (Reklam)"
            value={goruntulenmeImpressions || '—'}
          />
          <StatCard
            icon={FileText}
            label="Teklif Sayısı"
            value={yapilanTeklifSayisi}
          />
        </div>

        {/* Performans Özeti */}
        {hasPhysical && (
          <div
            className="rounded-2xl border p-6 print:border-slate-200 print:bg-slate-50"
            style={{ borderColor: `${SPRING}25`, background: `${SPRING}08` }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 print:text-slate-700" style={{ color: SPRING }}>
              Performans Özeti
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {yerindeGosterimSayisi > 0 && (
                <div>
                  <p className="text-2xl font-bold text-white print:text-slate-900">{yerindeGosterimSayisi}</p>
                  <p className="text-xs text-slate-400 mt-1 print:text-slate-500">Yerinde Gösterim</p>
                </div>
              )}
              {ciddiAliciSayisi > 0 && (
                <div>
                  <p className="text-2xl font-bold print:text-slate-900" style={{ color: SPRING }}>{ciddiAliciSayisi}</p>
                  <p className="text-xs text-slate-400 mt-1 print:text-slate-500">Ciddi Alıcı</p>
                </div>
              )}
              {redOlanTeklifSayisi > 0 && (
                <div>
                  <p className="text-2xl font-bold text-red-400 print:text-red-600">{redOlanTeklifSayisi}</p>
                  <p className="text-xs text-slate-400 mt-1 print:text-slate-500">Red Olan Teklif</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer — page 1 */}
        <footer className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between print:border-slate-200 print:mt-8">
          <div className="flex items-center gap-4">
            {danisman?.telefon && (
              <a href={`tel:${danisman.telefon}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white print:text-slate-600">
                <Phone className="w-3.5 h-3.5" />
                {danisman.telefon}
              </a>
            )}
            {danisman?.email && (
              <a href={`mailto:${danisman.email}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white print:text-slate-600">
                <Mail className="w-3.5 h-3.5" />
                {danisman.email}
              </a>
            )}
          </div>
          <p className="text-[10px] text-slate-600 print:text-slate-400">
            powered by pyrize.com
          </p>
        </footer>
      </div>

      {/* PAGE 2 — Feedback (conditional) */}
      {hasFeedback && (
        <div
          data-pdf-page="2"
          className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-12 print:px-8 print:py-10 print:break-after-page"
        >
          {/* Print-only header */}
          <div
            className="hidden print:flex items-center justify-between mb-8 pb-4"
            style={{ borderBottom: `2px solid ${SPRING}` }}
          >
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] font-semibold" style={{ color: SPRING }}>
                Geri Bildirimler
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{propertyName}</p>
            </div>
            {haftaAraligi && <p className="text-xs text-slate-500">{haftaAraligi}</p>}
          </div>

          <div
            className="mb-8 pb-4 border-b print:border-slate-200"
            style={{ borderColor: `${SPRING}30` }}
          >
            <p className="text-[9px] uppercase tracking-[0.5em] font-semibold print:hidden" style={{ color: SPRING }}>
              Geri Bildirimler
            </p>
            <h2 className="text-2xl font-bold text-white mt-2 print:text-slate-900">Satıcı & Alıcı Geri Bildirimleri</h2>
          </div>

          <div className="space-y-6">
            {saticiYorumu && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 print:border-slate-200 print:bg-slate-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 print:text-slate-700" style={{ color: SPRING }}>
                  Satıcı Yorumu
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line print:text-slate-700">{saticiYorumu}</p>
              </div>
            )}

            {potansiyelAliciGeriBildirimleri && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 print:border-slate-200 print:bg-slate-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 print:text-slate-700" style={{ color: SPRING }}>
                  Potansiyel Alıcı Geri Bildirimleri
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line print:text-slate-700">{potansiyelAliciGeriBildirimleri}</p>
              </div>
            )}

            {gorulenAnaProblemler && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 print:border-red-200 print:bg-red-50">
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 text-red-400 print:text-red-600">
                  Görülen Ana Problemler
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line print:text-slate-700">{gorulenAnaProblemler}</p>
              </div>
            )}
          </div>

          <footer className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between print:border-slate-200 print:mt-8">
            <p className="text-xs text-slate-400 print:text-slate-600">{displayName}{officeName && ` · ${officeName}`}</p>
            <p className="text-[10px] text-slate-600 print:text-slate-400">powered by pyrize.com</p>
          </footer>
        </div>
      )}
    </div>
  );
}
