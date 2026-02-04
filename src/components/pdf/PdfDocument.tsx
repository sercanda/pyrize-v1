/**
 * PdfDocument Component
 * 
 * Orchestrates presentation content into fixed A4 pages with deterministic page plan.
 * This is the main PDF layout component that maps sections to specific pages.
 * 
 * Page Plan (DetailedAnalysis = 6 pages max):
 * - Page 1: Hero + Property Summary + Key Stats
 * - Page 2: Problems Section
 * - Page 3: Solutions + Process Overview
 * - Page 4: Location Analysis + Target Audience + Marketing
 * - Page 5: Valuation + FAQ
 * - Page 6 (LAST): Critical Questions + Guarantees + Agent Info (ALWAYS)
 */
import React from 'react';
import { OlusturulanSunum } from '@/types';
import PdfPage from './PdfPage';
import { formatPriceRange } from '@/lib/utils/price';

interface PdfDocumentProps {
    data: OlusturulanSunum;
    condensed?: boolean;
}

export default function PdfDocument({ data, condensed = false }: PdfDocumentProps) {
    const { icerik, istek } = data;
    const { mulk, danisman } = istek;

    // Extract sections
    const heroBolge = icerik.bolgeler?.find((b: any) => b.tip === 'hero');
    const problemBolge = icerik.bolgeler?.find((b: any) => b.tip === 'problemler');
    const cozumBolge = icerik.bolgeler?.find((b: any) => b.tip === 'cozum');
    const processBolge = icerik.bolgeler?.find((b: any) => b.tip === 'process');
    const locationBolge = icerik.bolgeler?.find((b: any) => b.tip === 'location_analysis');
    const targetBolge = icerik.bolgeler?.find((b: any) => b.tip === 'target_audience');
    const marketingBolge = icerik.bolgeler?.find((b: any) => b.tip === 'marketing');
    const faqBolge = icerik.bolgeler?.find((b: any) => b.tip === 'faq');
    const guaranteeBolge = icerik.bolgeler?.find((b: any) => b.tip === 'guarantee');
    const ctaBolge = icerik.bolgeler?.find((b: any) => b.tip === 'cta');
    const valuationData = icerik.detayliDegerleme;

    // Get label for property type
    const mulkTurLabel = mulk.tur === "arsa" ? "Arsa" : mulk.tur === "daire" ? "Daire" : mulk.tur === "villa" ? "Villa" : mulk.tur === "ticari" ? "Ticari Gayrimenkul" : mulk.tur === "ofis" ? "Ofis" : "Mülk";

    // Brand colors
    const markaRenkleri = (istek as any).markaRenkleri;
    const colors = {
        primary: markaRenkleri?.primary || '#57B6B2',
        secondary: markaRenkleri?.secondary || '#223BA1'
    };

    // Calculate page count based on content
    const pages: React.ReactNode[] = [];
    const totalPages = 6; // Fixed at 6 for DetailedAnalysis

    // ─────────────────────────────────────────────────────────────
    // PAGE 1: Hero + Summary
    // ─────────────────────────────────────────────────────────────
    pages.push(
        <PdfPage key={1} pageNumber={1} totalPages={totalPages} showPageNumber condensed={condensed}>
            {/* Hero Header */}
            <div className="pdf-hero" style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)` }}>
                <div className="pdf-hero-content">
                    <div className="pdf-badge">🔒 Gizli • Sadece Sizin İçin Hazırlandı</div>
                    <h1 className="pdf-hero-title">
                        {mulkTurLabel === "Arsa" ? "Arsanızın" : mulkTurLabel === "Daire" ? "Dairenizin" : `${mulkTurLabel}ünüzün`} Gerçek Değerini Biliyor musunuz?
                    </h1>
                    <p className="pdf-hero-subtitle">
                        Bu sunum, {mulk.konum} bölgesindeki gayrimenkulünüzün nasıl 30-60 gün içinde <strong>hak ettiği en yüksek fiyata</strong> satılabileceğini gösteriyor.
                    </p>
                </div>
            </div>

            {/* Property Summary */}
            <div className="pdf-summary-grid">
                <div className="pdf-summary-card">
                    <div className="pdf-summary-icon">📍</div>
                    <div className="pdf-summary-label">Konum</div>
                    <div className="pdf-summary-value">{mulk.konum}</div>
                </div>
                <div className="pdf-summary-card">
                    <div className="pdf-summary-icon">🏠</div>
                    <div className="pdf-summary-label">Mülk Tipi</div>
                    <div className="pdf-summary-value">{mulkTurLabel}</div>
                </div>
                {mulk.metrekare && (
                    <div className="pdf-summary-card">
                        <div className="pdf-summary-icon">📐</div>
                        <div className="pdf-summary-label">Alan</div>
                        <div className="pdf-summary-value">{mulk.metrekare} m²</div>
                    </div>
                )}
                {formatPriceRange(mulk) && (
                    <div className="pdf-summary-card">
                        <div className="pdf-summary-icon">💰</div>
                        <div className="pdf-summary-label">Tahmini Değer</div>
                        <div className="pdf-summary-value">{formatPriceRange(mulk)}</div>
                    </div>
                )}
            </div>

            {/* Valuation Highlight if exists */}
            {valuationData?.estimatedValueRange && (
                <div className="pdf-valuation-highlight">
                    <span className="pdf-valuation-label">Profesyonel Değerleme Aralığı</span>
                    <span className="pdf-valuation-value">{valuationData.estimatedValueRange}</span>
                </div>
            )}

            {/* Agent intro */}
            <div className="pdf-agent-intro">
                <div className="pdf-agent-name">{danisman.adSoyad}</div>
                <div className="pdf-agent-title">Gayrimenkul Danışmanı</div>
                <div className="pdf-agent-contact">
                    📞 {danisman.telefon} • 📧 {danisman.email}
                </div>
            </div>
        </PdfPage>
    );

    // ─────────────────────────────────────────────────────────────
    // PAGE 2: Problems
    // ─────────────────────────────────────────────────────────────
    const problemCards = problemBolge?.altBolge?.slice(0, 5) || [];
    const defaultProblems = [
        { baslik: "Yanlış Fiyatlandırma", icerik: "Çoğu mülk sahibi piyasa analizini yanlış yapıyor. Ya çok ucuza satıyor, ya da aylarca satamıyor.", kayip: "Potansiyel gelirden önemli kayıp" },
        { baslik: "Yetersiz Tanıtım", icerik: "Telefon fotoğrafları ve temel ilan yeterli değil. Mülkünüz potansiyel alıcıların %95'ine ulaşamıyor.", kayip: "10-15 potansiyel alıcı kaybı" },
        { baslik: "Güvenlik Riski", icerik: "Birebir görüşmeler, dolandırıcılık riski, ödeme sorunları. Stresli ve riskli bir süreç.", kayip: "Zaman + Para + Güvenlik" },
        { baslik: "Zaman Kaybı", icerik: "Ortalama bireysel satış süresi: 8-12 ay. Her ay beklemek = değer kaybı.", kayip: "Piyasa değer artışından geri kalma" },
        { baslik: "Pazarlık Gücü Kaybı", icerik: "Profesyonel olmayan sunum = pazarlık masasında zayıflık = daha düşük fiyat.", kayip: "%10-20 daha az satış fiyatı" }
    ];

    const problems = problemCards.length > 0 ? problemCards : defaultProblems;

    pages.push(
        <PdfPage key={2} pageNumber={2} totalPages={totalPages} showPageNumber condensed={condensed}>
            <h2 className="pdf-section-heading pdf-problems-heading">
                {mulkTurLabel}ünüzü Satarken Karşılaşacağınız <span className="text-red">5 Büyük Sorun</span>
            </h2>
            <div className="pdf-problems-grid">
                {problems.map((p: any, idx: number) => (
                    <div key={idx} className="pdf-problem-card">
                        <div className="pdf-problem-number">❌</div>
                        <h3 className="pdf-problem-title">{idx + 1}. {p.baslik}</h3>
                        <p className="pdf-problem-text">{p.icerik}</p>
                        <p className="pdf-problem-loss">📉 {p.kayip}</p>
                    </div>
                ))}
            </div>
            <div className="pdf-warning-box">
                ⚠️ Bu sorunların her biri sizi <strong>yüz binlerce lira zarara</strong> uğratabilir.
            </div>
        </PdfPage>
    );

    // ─────────────────────────────────────────────────────────────
    // PAGE 3: Solutions + Process Overview
    // ─────────────────────────────────────────────────────────────
    const solutionCards = cozumBolge?.altBolge?.slice(0, 3) || [];
    const defaultSolutions = [
        { baslik: "30-60 Günde Satış", icerik: "Ortalama satış sürem: 45 gün", karsilastirma: "Vs. bireysel: 8-12 ay" },
        { baslik: "Doğru Fiyatla Satış", icerik: "Profesyonel pazarlama = daha yüksek teklif", karsilastirma: "Değerinde satış fırsatı" },
        { baslik: "Sıfır Stres & Risk", icerik: "Ben her şeyi hallederken, siz arkanıza yaslanın", karsilastirma: "Satış olmazsa tek kuruş ödemezsiniz" }
    ];

    const solutions = solutionCards.length > 0 ? solutionCards : defaultSolutions;

    pages.push(
        <PdfPage key={3} pageNumber={3} totalPages={totalPages} showPageNumber condensed={condensed}>
            <h2 className="pdf-section-heading">Peki Ya Bu Sorunların Hiçbiri Olmasaydı?</h2>
            <p className="pdf-section-subheading">Size özel hazırladığım profesyonel satış sistemi ile...</p>

            <div className="pdf-solutions-grid">
                {solutions.map((s: any, idx: number) => (
                    <div key={idx} className="pdf-solution-card">
                        <div className="pdf-solution-icon">✅</div>
                        <h3 className="pdf-solution-title">{s.baslik}</h3>
                        <p className="pdf-solution-text">{s.icerik}</p>
                        <p className="pdf-solution-comparison">{s.karsilastirma}</p>
                    </div>
                ))}
            </div>

            {/* Process overview */}
            <div className="pdf-process-overview">
                <h3 className="pdf-process-title">6 Adımlı Profesyonel Satış Sistemi</h3>
                <div className="pdf-process-steps">
                    <div className="pdf-process-step">
                        <span className="pdf-step-icon">📊</span>
                        <span className="pdf-step-label">Değerleme</span>
                    </div>
                    <div className="pdf-process-arrow">→</div>
                    <div className="pdf-process-step">
                        <span className="pdf-step-icon">📹</span>
                        <span className="pdf-step-label">Görsel</span>
                    </div>
                    <div className="pdf-process-arrow">→</div>
                    <div className="pdf-process-step">
                        <span className="pdf-step-icon">📱</span>
                        <span className="pdf-step-label">Pazarlama</span>
                    </div>
                    <div className="pdf-process-arrow">→</div>
                    <div className="pdf-process-step">
                        <span className="pdf-step-icon">🌍</span>
                        <span className="pdf-step-label">Ağ</span>
                    </div>
                    <div className="pdf-process-arrow">→</div>
                    <div className="pdf-process-step">
                        <span className="pdf-step-icon">🔍</span>
                        <span className="pdf-step-label">Filtre</span>
                    </div>
                    <div className="pdf-process-arrow">→</div>
                    <div className="pdf-process-step">
                        <span className="pdf-step-icon">🤝</span>
                        <span className="pdf-step-label">Kapanış</span>
                    </div>
                </div>
                <p className="pdf-process-footer">⏱️ Toplam süreç: Ortalama 45 gün • 💰 Hedef: Piyasa değerinde hızlı satış</p>
            </div>
        </PdfPage>
    );

    // ─────────────────────────────────────────────────────────────
    // PAGE 4: Location + Target + Marketing
    // ─────────────────────────────────────────────────────────────
    const locationAdvantages = locationBolge?.altBolge?.slice(0, 4) || [];
    const targetPersonas = targetBolge?.altBolge?.slice(0, 3) || [];
    const marketingChannels = marketingBolge?.altBolge?.slice(0, 6) || [];

    pages.push(
        <PdfPage key={4} pageNumber={4} totalPages={totalPages} showPageNumber condensed={condensed}>
            <div className="pdf-special-plan-header" style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)` }}>
                <div className="pdf-special-badge">🎯 SİZİN {mulkTurLabel.toUpperCase()}INIZ İÇİN HAZIRLADIĞIM ÖZEL PLAN</div>
                <h2 className="pdf-special-title">{mulk.konum}</h2>
                {mulk.metrekare && <p className="pdf-special-subtitle">{mulk.metrekare} m²</p>}
            </div>

            <div className="pdf-plan-grid">
                {/* Location Analysis */}
                <div className="pdf-plan-card">
                    <h3 className="pdf-plan-card-title">📍 KONUM ANALİZİ</h3>
                    <ul className="pdf-plan-list">
                        <li><strong>Konum:</strong> {mulk.konum}</li>
                        <li><strong>Mülk Türü:</strong> {mulkTurLabel}</li>
                        {formatPriceRange(mulk) && <li><strong>Fiyat:</strong> {formatPriceRange(mulk)}</li>}
                        {mulk.metrekare && <li><strong>Metrekare:</strong> {mulk.metrekare} m²</li>}
                    </ul>
                    {locationAdvantages.length > 0 && (
                        <div className="pdf-advantages">
                            <strong>Avantajlar:</strong>
                            <ul>
                                {locationAdvantages.map((adv: any, idx: number) => (
                                    <li key={idx}>✅ {adv.baslik || adv.icerik}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Target Audience */}
                <div className="pdf-plan-card">
                    <h3 className="pdf-plan-card-title">🎯 HEDEF KİTLE</h3>
                    {targetPersonas.length > 0 ? (
                        <ul className="pdf-plan-list">
                            {targetPersonas.map((persona: any, idx: number) => (
                                <li key={idx}>
                                    <strong>{idx + 1}. {persona.baslik || persona.persona}</strong>
                                    {persona.icerik && <p className="pdf-persona-desc">{persona.icerik}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="pdf-plan-text">{targetBolge?.icerik || 'Bölgeye özel hedef kitle analizi yapılacaktır.'}</p>
                    )}
                </div>

                {/* Marketing Strategy */}
                <div className="pdf-plan-card pdf-plan-card-full">
                    <h3 className="pdf-plan-card-title">📢 PAZARLAMA STRATEJİSİ</h3>
                    <p className="pdf-plan-text">{marketingBolge?.icerik || 'Profesyonel pazarlama stratejisi'}</p>
                    {marketingChannels.length > 0 && (
                        <div className="pdf-marketing-channels">
                            {marketingChannels.map((ch: any, idx: number) => (
                                <span key={idx} className="pdf-channel-tag">✅ {ch.baslik || ch}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="pdf-guarantee-banner">
                ✅ Satış olmazsa <strong>0₺</strong> ücret • ✅ Tüm hizmetler <strong>ücretsiz</strong> • ✅ Hizmet bedeli sadece satış olunca
            </div>
        </PdfPage>
    );

    // ─────────────────────────────────────────────────────────────
    // PAGE 5: Valuation + FAQ
    // ─────────────────────────────────────────────────────────────
    const valuationSnapshots = valuationData?.marketSnapshots?.filter((item: any) => item && (item.title || item.value)).slice(0, 3) || [];
    const valuationComparables = valuationData?.comparables?.filter((item: any) => item && (item.address || item.price)).slice(0, 4) || [];
    const faqItems = faqBolge?.altBolge?.slice(0, 4) || [];

    pages.push(
        <PdfPage key={5} pageNumber={5} totalPages={totalPages} showPageNumber condensed={condensed}>
            {/* Valuation Section */}
            <h2 className="pdf-section-heading">Detaylı Değerleme Raporu</h2>

            {valuationSnapshots.length > 0 && (
                <div className="pdf-valuation-grid">
                    {valuationSnapshots.map((snapshot: any, idx: number) => (
                        <div key={idx} className="pdf-valuation-card">
                            <div className="pdf-valuation-card-label">{snapshot.title}</div>
                            <div className="pdf-valuation-card-value">{snapshot.value}</div>
                        </div>
                    ))}
                </div>
            )}

            {valuationComparables.length > 0 && (
                <div className="pdf-comparables">
                    <h4 className="pdf-comparables-title">Karşılaştırmalı Piyasa Analizi</h4>
                    <table className="pdf-comparables-table">
                        <thead>
                            <tr>
                                <th>Adres</th>
                                <th>Durum</th>
                                <th>Fiyat</th>
                                <th>m² Fiyatı</th>
                            </tr>
                        </thead>
                        <tbody>
                            {valuationComparables.map((comp: any, idx: number) => (
                                <tr key={idx}>
                                    <td>{comp.address}</td>
                                    <td><span className={`pdf-status ${comp.status === 'Satıldı' ? 'sold' : 'active'}`}>{comp.status || 'Satışta'}</span></td>
                                    <td>{comp.price}</td>
                                    <td>{comp.pricePerSqm || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {valuationData?.estimatedValueRange && (
                <div className="pdf-value-range">
                    <span className="pdf-value-range-label">Tahmini Piyasa Değer Aralığı</span>
                    <span className="pdf-value-range-value">{valuationData.estimatedValueRange}</span>
                </div>
            )}

            {/* FAQ Section */}
            {faqItems.length > 0 && (
                <div className="pdf-faq-section">
                    <h3 className="pdf-faq-title">Sık Sorulan Sorular</h3>
                    <div className="pdf-faq-list">
                        {faqItems.map((faq: any, idx: number) => (
                            <div key={idx} className="pdf-faq-item">
                                <div className="pdf-faq-q">❓ {faq.baslik || faq.question}</div>
                                <div className="pdf-faq-a">{faq.icerik || faq.answer}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PdfPage>
    );

    // ─────────────────────────────────────────────────────────────
    // PAGE 6 (LAST): Critical Questions + Guarantees + Agent Info
    // ─────────────────────────────────────────────────────────────
    const guarantees = guaranteeBolge?.altBolge?.slice(0, 3) || [];
    const defaultGuarantees = [
        { baslik: "Sıfır Ön Ödeme", icerik: "Mülkünüzü listelemek için tek kuruş ödemezsiniz.", icon: "💸" },
        { baslik: "Güvenilir Hizmet Garantisi", icerik: "Profesyonel ve güvenilir emlak danışmanlığı hizmeti.", icon: "🔒" },
        { baslik: "7/24 İletişim", icerik: "Satış sürecinde her an bana ulaşabilirsiniz.", icon: "📞" }
    ];

    const guaranteeItems = guarantees.length > 0 ? guarantees : defaultGuarantees;

    pages.push(
        <PdfPage key={6} pageNumber={6} totalPages={totalPages} showPageNumber condensed={condensed} className="pdf-last-page">
            {/* Critical Questions */}
            <div className="pdf-critical-section">
                <h2 className="pdf-critical-title">🤔 Kritik Sorular</h2>
                <div className="pdf-critical-questions">
                    <div className="pdf-critical-q">
                        <span className="pdf-q-icon">❓</span>
                        <span className="pdf-q-text">Mülkümü en yüksek fiyata nasıl satarım?</span>
                    </div>
                    <div className="pdf-critical-q">
                        <span className="pdf-q-icon">❓</span>
                        <span className="pdf-q-text">Hızlı satış sürecinde nelere dikkat etmeliyim?</span>
                    </div>
                    <div className="pdf-critical-q">
                        <span className="pdf-q-icon">❓</span>
                        <span className="pdf-q-text">Profesyonel danışmanlık bana ne kazandırır?</span>
                    </div>
                </div>
                <p className="pdf-critical-answer">
                    → Tüm bu soruların cevabı, <strong>profesyonel danışmanlık hizmeti</strong> ile bulunur. Ben her adımda yanınızdayım.
                </p>
            </div>

            {/* Guarantees */}
            <div className="pdf-guarantees-section">
                <h3 className="pdf-guarantees-title">🛡️ Garantilerim</h3>
                <div className="pdf-guarantees-grid">
                    {guaranteeItems.map((g: any, idx: number) => (
                        <div key={idx} className="pdf-guarantee-card">
                            <span className="pdf-guarantee-icon">{g.icon || ['💸', '🔒', '📞'][idx]}</span>
                            <h4 className="pdf-guarantee-title">{g.baslik}</h4>
                            <p className="pdf-guarantee-text">{g.icerik}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Agent Info */}
            <div className="pdf-agent-section" style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)` }}>
                <div className="pdf-agent-info">
                    <h3 className="pdf-agent-cta">{ctaBolge?.baslik || `${mulkTurLabel}ünüzün Potansiyelini Birlikte Ortaya Çıkaralım`}</h3>
                    <p className="pdf-agent-desc">{ctaBolge?.icerik || 'Detaylı bilgi ve ücretsiz analiz için benimle iletişime geçin.'}</p>

                    <div className="pdf-agent-details">
                        <div className="pdf-agent-name-large">{danisman.adSoyad}</div>
                        <div className="pdf-agent-role">Gayrimenkul Danışmanı</div>
                        <div className="pdf-agent-contacts">
                            <span>📞 {danisman.telefon}</span>
                            <span>📧 {danisman.email}</span>
                        </div>
                    </div>

                    <div className="pdf-agent-badges">
                        <span className="pdf-agent-badge">✅ 24 saat içinde geri dönüş</span>
                        <span className="pdf-agent-badge">✅ Hiçbir bağlayıcılık yok</span>
                        <span className="pdf-agent-badge">✅ 100% gizlilik garantisi</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pdf-document-footer">
                <p>© {new Date().getFullYear()} {danisman.adSoyad}. Tüm hakları saklıdır.</p>
                <p>Bu sunum {mulk.konum} bölgesindeki {mulkTurLabel.toLowerCase()}ınız için özel olarak hazırlanmıştır.</p>
            </div>
        </PdfPage>
    );

    return (
        <div className="pdf-document">
            {pages}
        </div>
    );
}
