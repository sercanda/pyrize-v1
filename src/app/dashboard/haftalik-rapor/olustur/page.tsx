/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  Copy,
  FileText,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Heart,
  Search,
  DollarSign,
  MousePointerClick,
  Target,
  Phone,
  Building,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { HaftalikRaporVerisi, ReklamPlatformu, DanismanBilgileri } from '@/types';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { getUserAccessInfo } from '@/lib/utils/user-access';

interface HaftalikRaporFormState {
  // Genel Bilgiler
  raporBasligi: string;
  mulkAdi: string;
  portfoyAdi: string;
  haftaBaslangic: string; // YYYY-MM-DD formatında
  haftaBitis: string;
  danismanAdi: string;
  musteriAdi: string;

  // Sahibinden / İlan Performans
  sahibindenIlanUrl: string;
  toplamGoruntulenme: string;
  haftalikGoruntulenme: string;
  toplamFavoriSayisi: string;
  haftalikFavoriArtisi: string;
  toplamMesajSayisi: string;
  toplamAramaSayisi: string;

  // Reklam Performansı
  reklamPlatformu: ReklamPlatformu | '';
  harcananButce: string;
  goruntulenmeImpressions: string;
  tiklanmaSayisi: string;
  erisimReach: string;
  tiklanmaOraniCTR: string;
  tiklanmaBasiMaliyetCPC: string;
  formDolduranKisiSayisi: string;
  whatsappTiklamaSayisi: string;
  arayanKisiSayisi: string;
  realMusteriDonusu: string;

  // Fiziksel Geri Dönüşler
  yerindeGosterimSayisi: string;
  demoZiyaretSayisi: string;
  yapilanTeklifSayisi: string;
  ciddiAliciSayisi: string;
  redOlanTeklifSayisi: string;

  // Geri Bildirimler
  saticiYorumu: string;
  potansiyelAliciGeriBildirimleri: string;
  gorulenAnaProblemler: string;

  // API Entegrasyonu
  googleAdsCampaignId: string;
  metaAdsCampaignId: string;
}

const DEFAULT_FORM_STATE: HaftalikRaporFormState = {
  raporBasligi: '',
  mulkAdi: '',
  portfoyAdi: '',
  haftaBaslangic: '',
  haftaBitis: '',
  danismanAdi: '',
  musteriAdi: '',
  sahibindenIlanUrl: '',
  toplamGoruntulenme: '',
  haftalikGoruntulenme: '',
  toplamFavoriSayisi: '',
  haftalikFavoriArtisi: '',
  toplamMesajSayisi: '',
  toplamAramaSayisi: '',
  reklamPlatformu: '',
  harcananButce: '',
  goruntulenmeImpressions: '',
  tiklanmaSayisi: '',
  erisimReach: '',
  tiklanmaOraniCTR: '',
  tiklanmaBasiMaliyetCPC: '',
  formDolduranKisiSayisi: '',
  whatsappTiklamaSayisi: '',
  arayanKisiSayisi: '',
  realMusteriDonusu: '',
  yerindeGosterimSayisi: '',
  demoZiyaretSayisi: '',
  yapilanTeklifSayisi: '',
  ciddiAliciSayisi: '',
  redOlanTeklifSayisi: '',
  saticiYorumu: '',
  potansiyelAliciGeriBildirimleri: '',
  gorulenAnaProblemler: '',
  googleAdsCampaignId: '',
  metaAdsCampaignId: '',
};

export default function HaftalikRaporOlusturPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [formData, setFormData] = useState<HaftalikRaporFormState>(DEFAULT_FORM_STATE);
  const [userAccess, setUserAccess] = useState<{ canAccessWeeklyReport: boolean; loading: boolean }>({
    canAccessWeeklyReport: false,
    loading: true
  });
  const [oncekiRaporlar, setOncekiRaporlar] = useState<any[]>([]);
  const [raporKopyalamaModal, setRaporKopyalamaModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Kullanıcı erişim kontrolü
  useEffect(() => {
    (async () => {
      try {
        const accessInfo = await getUserAccessInfo();
        setUserAccess({
          canAccessWeeklyReport: accessInfo.canAccessWeeklyReport,
          loading: false
        });
        if (!accessInfo.canAccessWeeklyReport) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Kullanıcı erişim bilgisi alınamadı:', error);
        setUserAccess({ canAccessWeeklyReport: false, loading: false });
      }
    })();
  }, [router]);

  // Önceki haftalık raporları yükle
  useEffect(() => {
    if (!supabase) return;
    
    (async () => {
      try {
        const { data, error } = await supabase
          .from('sunumlar')
          .select('*')
          .eq('sunum_turu', 'haftalik_rapor')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.warn('Önceki raporlar yüklenemedi:', error);
          return;
        }
        
        if (data) {
          setOncekiRaporlar(data);
        }
      } catch (error) {
        console.error('Önceki raporlar yüklenirken hata:', error);
      }
    })();
  }, [supabase]);

  // Hafta tarihlerini otomatik doldur (bu hafta)
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Pazartesi
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    setFormData(prev => ({
      ...prev,
      haftaBaslangic: monday.toISOString().split('T')[0],
      haftaBitis: sunday.toISOString().split('T')[0],
    }));
  }, []);

  const handleInputChange = (field: keyof HaftalikRaporFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKopyala = (rapor: any) => {
    const raporVerisi = rapor.istek?.haftalikRapor || {};
    if (raporVerisi) {
      setFormData({
        raporBasligi: rapor.baslik || '',
        mulkAdi: raporVerisi.mulkAdi || '',
        portfoyAdi: raporVerisi.portfoyAdi || '',
        haftaBaslangic: raporVerisi.haftaBaslangic 
          ? (typeof raporVerisi.haftaBaslangic === 'string' 
              ? raporVerisi.haftaBaslangic.split('T')[0]
              : new Date(raporVerisi.haftaBaslangic).toISOString().split('T')[0])
          : '',
        haftaBitis: raporVerisi.haftaBitis
          ? (typeof raporVerisi.haftaBitis === 'string'
              ? raporVerisi.haftaBitis.split('T')[0]
              : new Date(raporVerisi.haftaBitis).toISOString().split('T')[0])
          : '',
        danismanAdi: raporVerisi.danismanAdi || '',
        musteriAdi: raporVerisi.musteriAdi || '',
        sahibindenIlanUrl: raporVerisi.sahibindenIlanUrl || '',
        toplamGoruntulenme: String(raporVerisi.toplamGoruntulenme || 0),
        haftalikGoruntulenme: String(raporVerisi.haftalikGoruntulenme || 0),
        toplamFavoriSayisi: String(raporVerisi.toplamFavoriSayisi || 0),
        haftalikFavoriArtisi: String(raporVerisi.haftalikFavoriArtisi || 0),
        toplamMesajSayisi: String(raporVerisi.toplamMesajSayisi || 0),
        toplamAramaSayisi: String(raporVerisi.toplamAramaSayisi || 0),
        reklamPlatformu: raporVerisi.reklamPlatformu || '',
        harcananButce: String(raporVerisi.harcananButce || 0),
        goruntulenmeImpressions: String(raporVerisi.goruntulenmeImpressions || 0),
        tiklanmaSayisi: String(raporVerisi.tiklanmaSayisi || 0),
        erisimReach: String(raporVerisi.erisimReach || 0),
        tiklanmaOraniCTR: String(raporVerisi.tiklanmaOraniCTR || 0),
        tiklanmaBasiMaliyetCPC: String(raporVerisi.tiklanmaBasiMaliyetCPC || 0),
        formDolduranKisiSayisi: String(raporVerisi.formDolduranKisiSayisi || 0),
        whatsappTiklamaSayisi: String(raporVerisi.whatsappTiklamaSayisi || 0),
        arayanKisiSayisi: String(raporVerisi.arayanKisiSayisi || 0),
        realMusteriDonusu: String(raporVerisi.realMusteriDonusu || 0),
        yerindeGosterimSayisi: String(raporVerisi.yerindeGosterimSayisi || 0),
        demoZiyaretSayisi: String(raporVerisi.demoZiyaretSayisi || 0),
        yapilanTeklifSayisi: String(raporVerisi.yapilanTeklifSayisi || 0),
        ciddiAliciSayisi: String(raporVerisi.ciddiAliciSayisi || 0),
        redOlanTeklifSayisi: String(raporVerisi.redOlanTeklifSayisi || 0),
        saticiYorumu: raporVerisi.saticiYorumu || '',
        potansiyelAliciGeriBildirimleri: raporVerisi.potansiyelAliciGeriBildirimleri || '',
        gorulenAnaProblemler: raporVerisi.gorulenAnaProblemler || '',
        googleAdsCampaignId: raporVerisi.googleAdsCampaignId || '',
        metaAdsCampaignId: raporVerisi.metaAdsCampaignId || '',
      });
      setRaporKopyalamaModal(false);
      alert('Rapor verileri kopyalandı!');
    }
  };

  const buildHaftalikRaporPayload = (): HaftalikRaporVerisi => {
    return {
      raporBasligi: formData.raporBasligi,
      mulkAdi: formData.mulkAdi || undefined,
      portfoyAdi: formData.portfoyAdi || undefined,
      haftaBaslangic: new Date(formData.haftaBaslangic),
      haftaBitis: new Date(formData.haftaBitis),
      danismanAdi: formData.danismanAdi,
      musteriAdi: formData.musteriAdi || undefined,
      sahibindenIlanUrl: formData.sahibindenIlanUrl || undefined,
      toplamGoruntulenme: parseInt(formData.toplamGoruntulenme) || 0,
      haftalikGoruntulenme: parseInt(formData.haftalikGoruntulenme) || 0,
      toplamFavoriSayisi: parseInt(formData.toplamFavoriSayisi) || 0,
      haftalikFavoriArtisi: parseInt(formData.haftalikFavoriArtisi) || 0,
      toplamMesajSayisi: parseInt(formData.toplamMesajSayisi) || 0,
      toplamAramaSayisi: parseInt(formData.toplamAramaSayisi) || 0,
      reklamPlatformu: formData.reklamPlatformu || undefined,
      harcananButce: parseFloat(formData.harcananButce) || 0,
      goruntulenmeImpressions: parseInt(formData.goruntulenmeImpressions) || 0,
      tiklanmaSayisi: parseInt(formData.tiklanmaSayisi) || 0,
      erisimReach: parseInt(formData.erisimReach) || 0,
      tiklanmaOraniCTR: parseFloat(formData.tiklanmaOraniCTR) || 0,
      tiklanmaBasiMaliyetCPC: parseFloat(formData.tiklanmaBasiMaliyetCPC) || 0,
      formDolduranKisiSayisi: parseInt(formData.formDolduranKisiSayisi) || 0,
      whatsappTiklamaSayisi: parseInt(formData.whatsappTiklamaSayisi) || 0,
      arayanKisiSayisi: parseInt(formData.arayanKisiSayisi) || 0,
      realMusteriDonusu: parseInt(formData.realMusteriDonusu) || 0,
      yerindeGosterimSayisi: parseInt(formData.yerindeGosterimSayisi) || 0,
      demoZiyaretSayisi: parseInt(formData.demoZiyaretSayisi) || 0,
      yapilanTeklifSayisi: parseInt(formData.yapilanTeklifSayisi) || 0,
      ciddiAliciSayisi: parseInt(formData.ciddiAliciSayisi) || 0,
      redOlanTeklifSayisi: parseInt(formData.redOlanTeklifSayisi) || 0,
      saticiYorumu: formData.saticiYorumu || undefined,
      potansiyelAliciGeriBildirimleri: formData.potansiyelAliciGeriBildirimleri || undefined,
      gorulenAnaProblemler: formData.gorulenAnaProblemler || undefined,
      googleAdsCampaignId: formData.googleAdsCampaignId || undefined,
      metaAdsCampaignId: formData.metaAdsCampaignId || undefined,
    };
  };

  const canProceedToStep2 = useMemo(() => {
    return !!(
      formData.raporBasligi &&
      formData.danismanAdi &&
      formData.haftaBaslangic &&
      formData.haftaBitis
    );
  }, [formData]);

  const canProceedToStep3 = useMemo(() => {
    return canProceedToStep2 && (
      parseInt(formData.toplamGoruntulenme) > 0 ||
      parseInt(formData.haftalikGoruntulenme) > 0 ||
      parseInt(formData.tiklanmaSayisi) > 0
    );
  }, [formData, canProceedToStep2]);

  const canSubmit = useMemo(() => {
    return canProceedToStep3;
  }, [canProceedToStep3]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsGenerating(true);
    try {
      const haftalikRapor = buildHaftalikRaporPayload();
      
      const requestBody = {
        sunumTuru: 'haftalik_rapor' as const,
        danisman: {
          adSoyad: formData.danismanAdi,
          telefon: '',
          email: '',
        } as DanismanBilgileri,
        mulk: {
          tur: 'daire' as const,
          konum: formData.mulkAdi || formData.portfoyAdi || 'Genel'
        },
        haftalikRapor,
        baslik: formData.raporBasligi,
      };

      const response = await fetch('/api/sunum/olustur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Haftalık rapor oluşturulamadı');
      }

      const created = data?.data;
      if (created?.slug && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`sunum_${created.slug}`, JSON.stringify(created));
        } catch (error) {
          console.warn('Rapor verisi kaydedilirken hata:', error);
        }
      }

      router.push(created?.publicUrl || '/dashboard');
    } catch (error) {
      console.error(error);
      alert('Rapor oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (userAccess.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040813]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!userAccess.canAccessWeeklyReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040813] px-4">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Erişim Kısıtlı</h2>
          <p className="text-slate-300 mb-6">
            Haftalık rapor özelliği sadece abonelere ve kredisi olan kullanıcılara açıktır.
          </p>
          <button
            onClick={() => router.push('/dashboard/krediler')}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-white font-semibold hover:bg-cyan-600 transition-colors"
          >
            Kredi Paketleri
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040813] pb-24 text-slate-100">
      <div className="relative mx-auto max-w-5xl space-y-10 px-6 pt-16 md:pt-20">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">
                Haftalık Performans Raporu
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Haftalık Rapor Hazırla
              </h1>
            </div>
            {oncekiRaporlar.length > 0 && (
              <button
                onClick={() => setRaporKopyalamaModal(true)}
                className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-500/20 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Önceki Raporu Kopyala
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`rounded-2xl border px-5 py-4 transition ${
                  step === item
                    ? 'border-cyan-400/60 bg-cyan-500/10 text-white shadow-[0_15px_45px_rgba(56,189,248,0.2)]'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-200/70">
                  Adım {item}
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {item === 1 && 'Genel Bilgiler'}
                  {item === 2 && 'Performans Verileri'}
                  {item === 3 && 'Geri Bildirimler'}
                </p>
              </div>
            ))}
          </div>
        </header>

        <div className="space-y-8">
          {/* Step 1: Genel Bilgiler */}
          {step === 1 && (
            <section className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(4,10,28,0.35)]">
              <header className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">Genel Bilgiler</h2>
                <p className="text-sm text-slate-300">
                  Raporun temel bilgilerini girin
                </p>
              </header>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Rapor Başlığı *
                  </label>
                  <input
                    type="text"
                    value={formData.raporBasligi}
                    onChange={(e) => handleInputChange('raporBasligi', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Örn: Kasım 2025 - Haftalık Performans Raporu"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Mülk Adı
                  </label>
                  <input
                    type="text"
                    value={formData.mulkAdi}
                    onChange={(e) => handleInputChange('mulkAdi', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Örn: Ataköy Daire"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Portföy Adı
                  </label>
                  <input
                    type="text"
                    value={formData.portfoyAdi}
                    onChange={(e) => handleInputChange('portfoyAdi', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Örn: Lüks Portföy 2025"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Hafta Başlangıç Tarihi *
                  </label>
                  <input
                    type="date"
                    value={formData.haftaBaslangic}
                    onChange={(e) => handleInputChange('haftaBaslangic', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Hafta Bitiş Tarihi *
                  </label>
                  <input
                    type="date"
                    value={formData.haftaBitis}
                    onChange={(e) => handleInputChange('haftaBitis', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Danışman Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.danismanAdi}
                    onChange={(e) => handleInputChange('danismanAdi', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Örn: Mehmet Yılmaz"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Müşteri Adı (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.musteriAdi}
                    onChange={(e) => handleInputChange('musteriAdi', e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Örn: Ahmet Demir"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_45px_rgba(56,189,248,0.35)] transition hover:shadow-[0_18px_55px_rgba(56,189,248,0.5)] disabled:opacity-40"
                >
                  2. Adıma Geç
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {/* Step 2: Performans Verileri - Devam edecek... */}
          {step === 2 && (
            <section className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(4,10,28,0.35)]">
              <header className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">Performans Verileri</h2>
                <p className="text-sm text-slate-300">
                  Sahibinden.com ve reklam performans metriklerinizi girin
                </p>
              </header>

              {/* Sahibinden / İlan Performans */}
              <div className="space-y-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-400" />
                  Sahibinden.com / İlan Performansı
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Sahibinden İlan URL
                    </label>
                    <input
                      type="url"
                      value={formData.sahibindenIlanUrl}
                      onChange={(e) => handleInputChange('sahibindenIlanUrl', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="https://www.sahibinden.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Toplam Görüntülenme
                    </label>
                    <input
                      type="number"
                      value={formData.toplamGoruntulenme}
                      onChange={(e) => handleInputChange('toplamGoruntulenme', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Haftalık Görüntülenme
                    </label>
                    <input
                      type="number"
                      value={formData.haftalikGoruntulenme}
                      onChange={(e) => handleInputChange('haftalikGoruntulenme', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Toplam Favori Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.toplamFavoriSayisi}
                      onChange={(e) => handleInputChange('toplamFavoriSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Haftalık Favori Artışı
                    </label>
                    <input
                      type="number"
                      value={formData.haftalikFavoriArtisi}
                      onChange={(e) => handleInputChange('haftalikFavoriArtisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Toplam Mesaj Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.toplamMesajSayisi}
                      onChange={(e) => handleInputChange('toplamMesajSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Toplam Arama Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.toplamAramaSayisi}
                      onChange={(e) => handleInputChange('toplamAramaSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Reklam Performansı */}
              <div className="space-y-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  Reklam Performansı (Meta / Google)
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Reklam Platformu
                    </label>
                    <select
                      value={formData.reklamPlatformu}
                      onChange={(e) => handleInputChange('reklamPlatformu', e.target.value as ReklamPlatformu)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="">Seçiniz</option>
                      <option value="google">Google</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="tiktok">TikTok</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Harcanan Bütçe (₺)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.harcananButce}
                      onChange={(e) => handleInputChange('harcananButce', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Görüntülenme (Impressions)
                    </label>
                    <input
                      type="number"
                      value={formData.goruntulenmeImpressions}
                      onChange={(e) => handleInputChange('goruntulenmeImpressions', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Tıklama Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.tiklanmaSayisi}
                      onChange={(e) => handleInputChange('tiklanmaSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Erişim (Reach)
                    </label>
                    <input
                      type="number"
                      value={formData.erisimReach}
                      onChange={(e) => handleInputChange('erisimReach', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Tıklama Oranı (CTR) %
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tiklanmaOraniCTR}
                      onChange={(e) => handleInputChange('tiklanmaOraniCTR', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Tıklama Başına Maliyet (CPC) ₺
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tiklanmaBasiMaliyetCPC}
                      onChange={(e) => handleInputChange('tiklanmaBasiMaliyetCPC', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Form Dolduran Kişi Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.formDolduranKisiSayisi}
                      onChange={(e) => handleInputChange('formDolduranKisiSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      WhatsApp Tıklama Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.whatsappTiklamaSayisi}
                      onChange={(e) => handleInputChange('whatsappTiklamaSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Arayan Kişi Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.arayanKisiSayisi}
                      onChange={(e) => handleInputChange('arayanKisiSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Real Müşteri Dönüşü (Sıcak Lead)
                    </label>
                    <input
                      type="number"
                      value={formData.realMusteriDonusu}
                      onChange={(e) => handleInputChange('realMusteriDonusu', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Fiziksel Geri Dönüşler */}
              <div className="space-y-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Building className="h-5 w-5 text-emerald-400" />
                  Fiziksel Geri Dönüşler
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Yerinde Gösterim Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.yerindeGosterimSayisi}
                      onChange={(e) => handleInputChange('yerindeGosterimSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Demo / Ziyaret Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.demoZiyaretSayisi}
                      onChange={(e) => handleInputChange('demoZiyaretSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Yapılan Teklif Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.yapilanTeklifSayisi}
                      onChange={(e) => handleInputChange('yapilanTeklifSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Ciddi Alıcı Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.ciddiAliciSayisi}
                      onChange={(e) => handleInputChange('ciddiAliciSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Red Olan Teklif Sayısı
                    </label>
                    <input
                      type="number"
                      value={formData.redOlanTeklifSayisi}
                      onChange={(e) => handleInputChange('redOlanTeklifSayisi', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_45px_rgba(56,189,248,0.35)] transition hover:shadow-[0_18px_55px_rgba(56,189,248,0.5)] disabled:opacity-40"
                >
                  3. Adıma Geç
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {/* Step 3: Geri Bildirimler */}
          {step === 3 && (
            <section className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_40px_rgba(4,10,28,0.35)]">
              <header className="space-y-3">
                <h2 className="text-2xl font-semibold text-white">Geri Bildirimler</h2>
                <p className="text-sm text-slate-300">
                  Satıcı ve potansiyel alıcı geri bildirimlerini girin
                </p>
              </header>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Satıcının Yorumu
                  </label>
                  <textarea
                    value={formData.saticiYorumu}
                    onChange={(e) => handleInputChange('saticiYorumu', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Satıcının bu hafta hakkındaki görüşleri ve yorumları..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Potansiyel Alıcıların Geri Bildirimleri
                  </label>
                  <textarea
                    value={formData.potansiyelAliciGeriBildirimleri}
                    onChange={(e) => handleInputChange('potansiyelAliciGeriBildirimleri', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Potansiyel alıcıların geri bildirimleri ve görüşleri..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Görülen Ana Problemler
                  </label>
                  <textarea
                    value={formData.gorulenAnaProblemler}
                    onChange={(e) => handleInputChange('gorulenAnaProblemler', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Bu hafta görülen ana problemler ve çözüm önerileri..."
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Geri
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || isGenerating}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-8 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(56,189,248,0.4)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(56,189,248,0.6)] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Oluşturuluyor
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Raporu Oluştur
                    </>
                  )}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Önceki Rapor Kopyalama Modalı */}
      {raporKopyalamaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040813]/90 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#050915] via-[#07162a] to-[#0a203c] p-8 shadow-[0_45px_100px_rgba(8,25,48,0.75)]">
            <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">Önceki Raporu Kopyala</h3>
                <button
                  onClick={() => setRaporKopyalamaModal(false)}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>
              
              <p className="text-sm text-slate-300">
                Aşağıdaki raporlardan birini seçerek verilerini yeni rapora kopyalayabilirsiniz.
              </p>

              <div className="max-h-96 space-y-3 overflow-y-auto">
                {oncekiRaporlar.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">
                    Henüz önceki rapor bulunmuyor.
                  </p>
                ) : (
                  oncekiRaporlar.map((rapor) => {
                    const raporVerisi = rapor.istek?.haftalikRapor || {};
                    const raporTarihi = rapor.created_at 
                      ? new Date(rapor.created_at).toLocaleDateString('tr-TR')
                      : 'Tarih bilinmiyor';
                    
                    return (
                      <button
                        key={rapor.id}
                        type="button"
                        onClick={() => handleKopyala(rapor)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-500/50 hover:bg-cyan-500/10"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {rapor.baslik || 'Haftalık Rapor'}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {raporTarihi}
                            </p>
                          </div>
                          <Copy className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                          <div>Görüntülenme: {raporVerisi.toplamGoruntulenme || raporVerisi.goruntulenmeSayisi || 0}</div>
                          <div>Tıklama: {raporVerisi.tiklanmaSayisi || 0}</div>
                          <div>Erişim: {raporVerisi.erisimReach || raporVerisi.erisim || 0}</div>
                          <div>CTR: %{raporVerisi.tiklanmaOraniCTR || raporVerisi.ilgiOrani || 0}</div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

