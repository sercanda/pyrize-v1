"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Share2, Download, ArrowLeft, Edit, Smartphone, Monitor } from "lucide-react";
import Link from "next/link";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

function SunumPageContent() {
  const params = useParams();

  const [sunumData, setSunumData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("desktop");
  const [mounted, setMounted] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Hydration için mount kontrolü
  useEffect(() => {
    setMounted(true);

    // CLEAN UP: Remove ALL sunum-related localStorage keys
    if (typeof window !== "undefined") {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sunum')) {
          keysToRemove.push(key);
        }
      }
      if (keysToRemove.length > 0) {
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('[Page Load] ✅ Cleared', keysToRemove.length, 'sunum cache keys');
      }
    }
  }, []);

  // Load sunum data from API
  useEffect(() => {
    setSunumData(null);
    setPageLoading(true);

    const loadSunumData = async () => {
      const routeParamId = params.id as string;
      if (!routeParamId) {
        console.error('[Page Load] ❌ Route param id is missing');
        setPageLoading(false);
        return;
      }

      console.log('[Page Load] Route param:', routeParamId);

      try {
        const response = await fetch(`/api/sunum/${routeParamId}`, { cache: 'no-store' });

        if (!response.ok) {
          console.error('[Page Load] ❌ API error:', response.status);
          setSunumData(null);
          setPageError('Sunum yüklenemedi');
          setPageLoading(false);
          return;
        }

        const supabaseData = await response.json();
        if (!supabaseData.success || !supabaseData.data) {
          console.error('[Page Load] ❌ Invalid API response');
          setSunumData(null);
          setPageError('Sunum bulunamadı');
          setPageLoading(false);
          return;
        }

        const apiData = supabaseData.data;
        const recordId = apiData.id;

        if (!recordId) {
          console.error('[Page Load] ❌ API response missing id');
          setSunumData(null);
          setPageError('Geçersiz sunum verisi');
          setPageLoading(false);
          return;
        }

        console.log('[Page Load] ✅ Data loaded from API:', {
          id: recordId,
          slug: apiData.slug,
          created_at: apiData.olusturmaTarihi || apiData.created_at,
          konum: apiData.istek?.mulk?.konum
        });

        setSunumData(apiData);
        setPageLoading(false);
      } catch (error) {
        console.error('[Page Load] ❌ Error fetching data:', error);
        setSunumData(null);
        setPageError('Sunum yüklenirken bir hata oluştu');
        setPageLoading(false);
      }
    };

    loadSunumData();
  }, [params.id]);

  // Hata ekranı
  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">Hata</h1>
          <p className="text-gray-300 mb-6">{pageError}</p>
          <a href="/dashboard" className="inline-block px-6 py-3 bg-[#57B6B2] text-white rounded-lg hover:bg-[#4a9e9a] transition">
            Dashboard'a Dön
          </a>
        </div>
      </div>
    );
  }

  // Yüklenme ekranı
  if (pageLoading || !sunumData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#57B6B2]" />
          <p className="mt-4 text-gray-300">Sunum yükleniyor...</p>
        </div>
      </div>
    );
  }

  const sunumIcerik = sunumData.icerik;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sunumIcerik.baslik,
          text: sunumIcerik.heroAciklama,
          url: window.location.href,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link kopyalandı!");
    }
  };

  const handleDownload = async () => {
    if (pdfLoading) {
      return;
    }

    const sunumId = sunumData?.id || params.id;
    if (!sunumId) {
      alert('Sunum ID\'si bulunamadı');
      return;
    }

    setPdfLoading(true);
    console.log('[PDF] Starting Gotenberg PDF export for:', sunumId);

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sunumId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Detailed error for Gotenberg unavailable
        if (response.status === 503) {
          throw new Error('PDF servisi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
        }

        throw new Error(errorData.error || `PDF oluşturulamadı (${response.status})`);
      }

      // Get PDF blob and trigger download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = `sunum-${sunumData?.slug || sunumId}.pdf`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('[PDF] ✅ Download triggered:', filename);
    } catch (error: any) {
      console.error('[PDF] Error:', error);
      alert(`PDF hatası: ${error?.message || 'Bilinmeyen hata'}`);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* DEBUG BANNER - Shows which presentation is loaded */}
      {sunumData && process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-xs font-mono no-print">
          <strong>DEBUG:</strong> ID: {sunumData.id?.slice(0, 8)}... |
          Slug: {sunumData.slug} |
          Oluşturulma: {sunumData.olusturmaTarihi || sunumData.created_at} |
          Konum: {sunumData.istek?.mulk?.konum || 'N/A'}
        </div>
      )}

      {/* Üst Cam Bar */}
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.15)] no-print">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-700 hover:text-[#57B6B2] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base font-medium">Geri</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobil / Desktop Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`p-2 rounded transition-colors ${viewMode === "mobile" ? "bg-[#57B6B2] text-white" : "text-gray-700"
                    }`}
                  title="Mobil Görünüm"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`p-2 rounded transition-colors ${viewMode === "desktop" ? "bg-[#57B6B2] text-white" : "text-gray-700"
                    }`}
                  title="Masaüstü Görünüm"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>

              <Link
                href={`/sunum/${params.id}/duzenle`}
                className="p-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                title="Düzenle"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </Link>

              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
                title="Paylaş"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>

              <button
                onClick={handleDownload}
                disabled={pdfLoading || !params.id}
                className="p-2 bg-[#57B6B2] rounded-lg hover:bg-[#4a9d99] transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title={params.id ? "PDF İndir" : "PDF indirme için sunum ID'si gerekli"}
              >
                {pdfLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline text-white text-sm font-medium">Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span className="hidden sm:inline text-white text-sm font-medium">PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sunum İçeriği */}
      {sunumData && mounted && (
        <div id="sunum-content">
          {viewMode === "mobile" ? (
            <div className="flex justify-center bg-gray-100 py-4 min-h-screen">
              <div
                id="sunum-icerik"
                className="mobile-viewport-simulator bg-white shadow-lg overflow-y-auto"
                style={{ width: "375px", maxHeight: "812px" }}
              >
                <TemplateRenderer data={sunumData} />
              </div>
            </div>
          ) : (
            <div id="sunum-icerik" className="w-full">
              <TemplateRenderer data={sunumData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SunumPage() {
  return <SunumPageContent />;
}
