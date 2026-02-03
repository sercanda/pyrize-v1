'use client';

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2, X, MessageSquare, Download } from "lucide-react";
import Link from "next/link";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { OlusturulanSunum } from "@/types";

export default function DuzenlePage() {
  const params = useParams();
  const router = useRouter();
  const [sunumData, setSunumData] = useState<OlusturulanSunum | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showChat, setShowChat] = useState(false); // Mobilde chat toggle
  const [pdfLoading, setPdfLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sunum verisini yükle - API'den çek (localStorage yerine)
  useEffect(() => {
    const loadSunumData = async () => {
      try {
        const sunumId = params.id as string;
        if (!sunumId) {
          console.error('[Duzenle] ❌ ID missing');
          setPageLoading(false);
          return;
        }

        console.log('[Duzenle] 📋 Loading sunum with ID:', sunumId);

        // API'den veri çek (UUID veya slug ile çalışır)
        const response = await fetch(`/api/sunum/${sunumId}`, { cache: 'no-store' });

        if (!response.ok) {
          console.error('[Duzenle] ❌ API error:', response.status);
          setPageLoading(false);
          return;
        }

        const result = await response.json();
        if (!result.success || !result.data) {
          console.error('[Duzenle] ❌ Invalid API response');
          setPageLoading(false);
          return;
        }

        const apiData = result.data;
        console.log('[Duzenle] ✅ Data loaded:', { id: apiData.id, slug: apiData.slug });

        // OlusturulanSunum formatına dönüştür (API verisi zaten doğru formatta)
        const sunumFormatted = {
          id: apiData.id,
          slug: apiData.slug,
          icerik: apiData.icerik,
          istek: apiData.istek,
          publicUrl: `/sunum/${apiData.id}`
        } as OlusturulanSunum;

        setSunumData(sunumFormatted);

        // Hoş geldin mesajı
        setChatMessages([{
          role: 'assistant',
          content: `Merhaba! Sunumunuzu düzenlemek için bana ne yapmak istediğinizi söyleyin. Örneğin:\n\n📝 İçerik Değişiklikleri:\n• "Hero başlığını daha etkileyici yap"\n• "Problem bölümündeki ilk kartın içeriğini değiştir"\n• "Daha kurumsal bir dil kullan"\n\n🎨 Renk Değişiklikleri:\n• "Ana rengi #FF5733 yap"\n• "Marka renklerini değiştir"`
        }]);

        setPageLoading(false);
      } catch (error) {
        console.error('[Duzenle] ❌ Error:', error);
        setPageLoading(false);
      }
    };

    loadSunumData();
  }, [params.id]);

  // Chat'i aşağı kaydır
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);




  const handleDownload = async () => {
    if (pdfLoading || !sunumData?.id) {
      alert("Sunum verisi yüklenemedi");
      return;
    }

    setPdfLoading(true);
    console.log("[PDF] Starting Gotenberg PDF export for:", sunumData.id);

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sunumData.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 503) {
          throw new Error('PDF servisi şu an kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
        }

        throw new Error(errorData.error || `PDF oluşturulamadı (${response.status})`);
      }

      // Get PDF blob and trigger download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const filename = `sunum-${sunumData.slug || sunumData.id}.pdf`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("[PDF] ✅ Download triggered:", filename);
    } catch (error: any) {
      console.error("[PDF] Error:", error);
      alert(`PDF hatası: ${error?.message || 'Bilinmeyen hata'}`);
    } finally {
      setPdfLoading(false);
    }
  };

  // AI ile içerik düzenle
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sunumData || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Kullanıcı mesajını ekle
    const newMessages = [...chatMessages, { role: 'user' as const, content: userMessage }];
    setChatMessages(newMessages);
    setIsLoading(true);

    try {
      // AI API'ye gönder
      const response = await fetch('/api/sunum/duzenle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sunumData,
          komut: userMessage
        })
      });

      if (!response.ok) {
        throw new Error('Düzenleme yapılamadı');
      }

      const result = await response.json();

      // Güncellenmiş sunum verisini kaydet
      let updatedSunum: OlusturulanSunum;
      if (result.isColorChange) {
        // Renk değişikliği - tüm datayı güncelle
        updatedSunum = result.data;
      } else {
        // İçerik değişikliği - sadece içeriği güncelle
        updatedSunum = {
          ...sunumData,
          icerik: result.data.icerik || result.data
        };
      }

      setSunumData(updatedSunum);

      // localStorage'a kaydet
      const slug = params.id as string;
      localStorage.setItem(`sunum_${slug}`, JSON.stringify(updatedSunum));

      // AI yanıtını ekle
      setChatMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: result.message || '✅ Sunumunuz başarıyla güncellendi! Değişiklikleri sağdaki önizlemede görebilirsiniz.'
        }
      ]);
    } catch (error) {
      console.error('Düzenleme hatası:', error);
      setChatMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '❌ Bir hata oluştu. Lütfen tekrar deneyin veya komutunuzu daha açık bir şekilde ifade edin.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading || !sunumData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020612]">
        <div className="text-center text-gray-200">
          <Loader2 className="w-9 h-9 animate-spin mx-auto text-cyan-400" />
          <p className="mt-4 text-sm text-gray-400">Sunum verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020610] via-[#0b1528] to-[#0d1b33] text-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/sunum/${params.id}`}
            className="flex items-center gap-2 text-gray-100 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Geri</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">Sunum Düzenle</h1>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={pdfLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-red-400 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF İndir
            </button>
            <button
              onClick={() => router.push(`/sunum/${params.id}`)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:via-teal-400 hover:to-emerald-400 transition-all"
            >
              Önizle
            </button>
          </div>
        </div>
      </div>

      {/* Ana İçerik - Chat + Preview */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Mobil Chat Toggle Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-gradient-to-br from-cyan-500 to-teal-500 text-white p-4 rounded-full shadow-xl shadow-cyan-500/30 hover:from-cyan-400 hover:to-teal-400 transition-all"
        >
          {showChat ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>

        {/* Mobil Backdrop */}
        {showChat && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setShowChat(false)}
          />
        )}

        {/* Sol: Chat Paneli */}
        <div className={`${showChat ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40 md:z-auto w-[85%] sm:w-96 md:w-96 lg:w-[400px] bg-white/[0.04] backdrop-blur-2xl border-r border-white/10 flex flex-col h-full transition-transform duration-300 ease-in-out shadow-[0_18px_48px_rgba(0,0,0,0.35)] md:shadow-none`}>
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-white/10 bg-white/[0.08] backdrop-blur-xl text-white flex-shrink-0 flex items-center justify-between">
            <h2 className="font-semibold text-sm sm:text-base tracking-wide">AI Asistan</h2>
            <span className="text-[11px] px-2 py-1 rounded-full border border-white/15 bg-white/5 text-cyan-100/90">
              Canlı
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0 bg-gradient-to-b from-white/[0.04] to-white/[0.01]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-2 sm:p-3 ${msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-[#152540] text-gray-100 border border-white/5'
                    }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#152540] rounded-lg p-3 border border-white/5">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-cyan-400" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 sm:p-4 border-t border-white/10 flex-shrink-0 bg-white/[0.05] backdrop-blur-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ne değiştirmek istersiniz?"
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-white/10 bg-[#0b1527] text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 hidden sm:block">
              Örnek: "Başlığı daha etkileyici yap", "Daha kısa hale getir"
            </p>
          </div>
        </div>

        {/* Sağ: Sunum Önizlemesi */}
        <div className="flex-1 overflow-y-auto bg-[#050b18] min-h-0">
          <div id="sunum-preview" className="min-h-full w-full">
            {sunumData && (
              <TemplateRenderer
                key={JSON.stringify(sunumData.istek.markaRenkleri || {})}
                data={sunumData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
