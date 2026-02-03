/**
 * Haftalık Rapor Template Component
 * 
 * Bu component haftalık performans raporlarını render eder.
 * ZIP şablonu daha sonra yüklenecek, şimdilik placeholder bir tasarım.
 */

import React from 'react';
import { HaftalikRaporVerisi, DanismanBilgileri } from '@/types';
import { BarChart3, Eye, MousePointerClick, Users, TrendingUp, Phone } from 'lucide-react';

interface WeeklyReportTemplateProps {
  haftalikRapor: HaftalikRaporVerisi;
  danisman: DanismanBilgileri;
  baslik?: string;
}

export default function WeeklyReportTemplate({
  haftalikRapor,
  danisman,
  baslik = 'Haftalık Performans Raporu'
}: WeeklyReportTemplateProps) {
  const {
    // Genel
    raporBasligi,
    mulkAdi,
    portfoyAdi,
    haftaBaslangic,
    haftaBitis,
    danismanAdi,
    musteriAdi,
    // Sahibinden
    toplamGoruntulenme,
    haftalikGoruntulenme,
    toplamFavoriSayisi,
    haftalikFavoriArtisi,
    toplamMesajSayisi,
    toplamAramaSayisi,
    // Reklam
    reklamPlatformu,
    harcananButce,
    goruntulenmeImpressions,
    tiklanmaSayisi,
    erisimReach,
    tiklanmaOraniCTR,
    tiklanmaBasiMaliyetCPC,
    formDolduranKisiSayisi,
    whatsappTiklamaSayisi,
    arayanKisiSayisi,
    realMusteriDonusu,
    // Fiziksel
    yerindeGosterimSayisi,
    demoZiyaretSayisi,
    yapilanTeklifSayisi,
    ciddiAliciSayisi,
    redOlanTeklifSayisi,
    // AI
    aiPerformansYorumu,
    aiStratejiOnerisi,
    aiHaftalikOzet,
    // Geriye dönük uyumluluk
    goruntulenmeSayisi,
    erisim,
    reklamGeriDonusleri,
    ilgiOrani
  } = haftalikRapor;

  const formatDate = (date?: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const haftaAraligi = haftaBaslangic && haftaBitis
    ? `${formatDate(haftaBaslangic)} - ${formatDate(haftaBitis)}`
    : 'Tarih belirtilmemiş';

  // Geriye dönük uyumluluk için değerleri birleştir
  const toplamGoruntulenmeFinal = toplamGoruntulenme || goruntulenmeSayisi || 0;
  const erisimFinal = erisimReach || erisim || 0;
  const realMusteriDonusuFinal = realMusteriDonusu || reklamGeriDonusleri || 0;
  const ctrFinal = tiklanmaOraniCTR || ilgiOrani || 0;
  
  // CTR hesaplama (tıklama / görüntülenme * 100)
  const hesaplananCTR = toplamGoruntulenmeFinal > 0
    ? ((tiklanmaSayisi / toplamGoruntulenmeFinal) * 100).toFixed(2)
    : '0.00';
  
  const finalCTR = ctrFinal > 0 ? ctrFinal : parseFloat(hesaplananCTR);
  
  // Dönüşüm oranı
  const donusumOrani = erisimFinal > 0
    ? ((realMusteriDonusuFinal / erisimFinal) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{baslik || raporBasligi}</h1>
              <p className="mt-2 text-slate-600">{haftaAraligi}</p>
              {(mulkAdi || portfoyAdi) && (
                <p className="mt-1 text-sm text-slate-500">
                  {mulkAdi || portfoyAdi}
                  {musteriAdi && ` • ${musteriAdi}`}
                </p>
              )}
            </div>
            <div className="text-right">
              {danisman.ofisLogosu && (
                <img
                  src={danisman.ofisLogosu}
                  alt={danisman.ofisAdi || 'Ofis Logosu'}
                  className="h-16 w-auto"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="container mx-auto px-6 py-12">
        {/* Özet Metrikler */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Performans Özeti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Eye className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {toplamGoruntulenmeFinal.toLocaleString('tr-TR')}
                </span>
              </div>
              <p className="text-sm text-slate-600">Toplam Görüntülenme</p>
              {haftalikGoruntulenme > 0 && (
                <p className="text-xs text-slate-500 mt-1">Haftalık: {haftalikGoruntulenme.toLocaleString('tr-TR')}</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <MousePointerClick className="h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {tiklanmaSayisi.toLocaleString('tr-TR')}
                </span>
              </div>
              <p className="text-sm text-slate-600">Tıklama</p>
              {finalCTR > 0 && (
                <p className="text-xs text-slate-500 mt-1">CTR: %{finalCTR.toFixed(2)}</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {erisimFinal.toLocaleString('tr-TR')}
                </span>
              </div>
              <p className="text-sm text-slate-600">Erişim</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {realMusteriDonusuFinal.toLocaleString('tr-TR')}
                </span>
              </div>
              <p className="text-sm text-slate-600">Real Müşteri Dönüşü</p>
              {donusumOrani !== '0.00' && (
                <p className="text-xs text-slate-500 mt-1">Dönüşüm: %{donusumOrani}</p>
              )}
            </div>
          </div>
        </section>

        {/* AI Performans Yorumu */}
        {aiPerformansYorumu && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">AI Performans Yorumu</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line">{aiPerformansYorumu}</p>
              </div>
            </div>
          </section>
        )}

        {/* Detaylı Metrikler */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Detaylı Metrikler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Sahibinden Performans */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Sahibinden.com Performansı</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Toplam Görüntülenme</span>
                  <span className="font-semibold text-slate-900">{toplamGoruntulenmeFinal.toLocaleString('tr-TR')}</span>
                </div>
                {haftalikGoruntulenme > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Haftalık Görüntülenme</span>
                    <span className="font-semibold text-slate-900">{haftalikGoruntulenme.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {toplamFavoriSayisi > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Toplam Favori</span>
                    <span className="font-semibold text-slate-900">{toplamFavoriSayisi.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {haftalikFavoriArtisi > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Haftalık Favori Artışı</span>
                    <span className="font-semibold text-emerald-600">+{haftalikFavoriArtisi.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {toplamMesajSayisi > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Toplam Mesaj</span>
                    <span className="font-semibold text-slate-900">{toplamMesajSayisi.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {toplamAramaSayisi > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Toplam Arama</span>
                    <span className="font-semibold text-slate-900">{toplamAramaSayisi.toLocaleString('tr-TR')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reklam Performansı */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Reklam Performansı
                {reklamPlatformu && (
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({reklamPlatformu === 'google' ? 'Google' : reklamPlatformu === 'instagram' ? 'Instagram' : reklamPlatformu === 'facebook' ? 'Facebook' : 'TikTok'})
                  </span>
                )}
              </h3>
              <div className="space-y-3">
                {harcananButce > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Harcanan Bütçe</span>
                    <span className="font-semibold text-slate-900">₺{harcananButce.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                {goruntulenmeImpressions > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Impressions</span>
                    <span className="font-semibold text-slate-900">{goruntulenmeImpressions.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Tıklama</span>
                  <span className="font-semibold text-slate-900">{tiklanmaSayisi.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">Erişim (Reach)</span>
                  <span className="font-semibold text-slate-900">{erisimFinal.toLocaleString('tr-TR')}</span>
                </div>
                {finalCTR > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">CTR</span>
                    <span className="font-semibold text-slate-900">%{finalCTR.toFixed(2)}</span>
                  </div>
                )}
                {tiklanmaBasiMaliyetCPC > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">CPC</span>
                    <span className="font-semibold text-slate-900">₺{tiklanmaBasiMaliyetCPC.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                {formDolduranKisiSayisi > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Form Dolduran</span>
                    <span className="font-semibold text-slate-900">{formDolduranKisiSayisi.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {whatsappTiklamaSayisi > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">WhatsApp Tıklama</span>
                    <span className="font-semibold text-slate-900">{whatsappTiklamaSayisi.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {arayanKisiSayisi > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Arayan Kişi</span>
                    <span className="font-semibold text-slate-900">{arayanKisiSayisi.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Real Müşteri Dönüşü</span>
                  <span className="font-semibold text-emerald-600">{realMusteriDonusuFinal.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fiziksel Geri Dönüşler */}
          {(yerindeGosterimSayisi > 0 || demoZiyaretSayisi > 0 || yapilanTeklifSayisi > 0) && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Fiziksel Geri Dönüşler</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {yerindeGosterimSayisi > 0 && (
                  <div>
                    <p className="text-sm text-slate-600">Yerinde Gösterim</p>
                    <p className="text-xl font-bold text-slate-900">{yerindeGosterimSayisi.toLocaleString('tr-TR')}</p>
                  </div>
                )}
                {demoZiyaretSayisi > 0 && (
                  <div>
                    <p className="text-sm text-slate-600">Demo/Ziyaret</p>
                    <p className="text-xl font-bold text-slate-900">{demoZiyaretSayisi.toLocaleString('tr-TR')}</p>
                  </div>
                )}
                {yapilanTeklifSayisi > 0 && (
                  <div>
                    <p className="text-sm text-slate-600">Yapılan Teklif</p>
                    <p className="text-xl font-bold text-slate-900">{yapilanTeklifSayisi.toLocaleString('tr-TR')}</p>
                  </div>
                )}
                {ciddiAliciSayisi > 0 && (
                  <div>
                    <p className="text-sm text-slate-600">Ciddi Alıcı</p>
                    <p className="text-xl font-bold text-emerald-600">{ciddiAliciSayisi.toLocaleString('tr-TR')}</p>
                  </div>
                )}
                {redOlanTeklifSayisi > 0 && (
                  <div>
                    <p className="text-sm text-slate-600">Red Olan Teklif</p>
                    <p className="text-xl font-bold text-red-600">{redOlanTeklifSayisi.toLocaleString('tr-TR')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* AI Strateji Önerisi */}
        {aiStratejiOnerisi && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">AI Strateji Önerisi</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line">{aiStratejiOnerisi}</p>
              </div>
            </div>
          </section>
        )}

        {/* Geri Bildirimler */}
        {(haftalikRapor.saticiYorumu || haftalikRapor.potansiyelAliciGeriBildirimleri || haftalikRapor.gorulenAnaProblemler) && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Geri Bildirimler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {haftalikRapor.saticiYorumu && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Satıcı Yorumu</h3>
                  <p className="text-slate-700 text-sm whitespace-pre-line">{haftalikRapor.saticiYorumu}</p>
                </div>
              )}
              {haftalikRapor.potansiyelAliciGeriBildirimleri && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Potansiyel Alıcı Geri Bildirimleri</h3>
                  <p className="text-slate-700 text-sm whitespace-pre-line">{haftalikRapor.potansiyelAliciGeriBildirimleri}</p>
                </div>
              )}
              {haftalikRapor.gorulenAnaProblemler && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Görülen Ana Problemler</h3>
                  <p className="text-slate-700 text-sm whitespace-pre-line">{haftalikRapor.gorulenAnaProblemler}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* İletişim Bilgileri */}
        <section className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">İletişim</h3>
              <p className="text-blue-100">{danismanAdi || danisman.adSoyad}</p>
              {danisman.ofisAdi && (
                <p className="text-blue-100 text-sm mt-1">{danisman.ofisAdi}</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-5 w-5" />
                <a href={`tel:${danisman.telefon}`} className="text-white hover:underline">
                  {danisman.telefon}
                </a>
              </div>
              {danisman.email && (
                <a
                  href={`mailto:${danisman.email}`}
                  className="text-blue-100 hover:text-white text-sm"
                >
                  {danisman.email}
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

