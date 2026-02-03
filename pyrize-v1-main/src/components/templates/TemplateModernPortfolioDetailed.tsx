'use client';

import React, { useMemo } from 'react';
import { Bolge, OlusturulanSunum } from '@/types';
import { MarketAnalysisSection } from './shared/MarketAnalysisSection';
import { FaqSection } from './shared/FaqSection';
import { formatPriceRange } from '@/lib/utils/price';

type StepExtra = {
  title?: string;
  items: string[];
};

const cleanLine = (line: string) =>
  line
    .replace(
      /^[\s•\-–—→✅⭐🎯⚡💡📈📣🏡🏖️🌟🎥💼🤝📞📧💬👤📊🚀☑️🎬🛎️🕴️📍📌🎯📢💰🛡️🤝⚙️🎬📎🎗️📌🎗️🏛️🏙️🧭🎒🎗️]+/u,
      '',
    )
    .trim();

const parseList = (text?: string): string[] => {
  if (!text) {
    return [];
  }

  return text
    .split('\n')
    .map((line) => cleanLine(line))
    .filter(Boolean);
};

const splitParagraphs = (text?: string): string[] => {
  if (!text) {
    return [];
  }

  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
};

const findBolge = (bolgeler: Bolge[] | undefined, tip: Bolge['tip']) =>
  bolgeler?.find((bolge) => bolge.tip === tip);

const buildBenefits = (cozumBolge?: Bolge) => {
  if (!cozumBolge?.altBolge?.length) {
    return [];
  }

  return cozumBolge.altBolge.map((alt, index) => {
    const lines = parseList(alt.icerik);
    const description =
      lines.length > 1
        ? lines[0]
        : cleanLine(alt.icerik.replace(/\s+/g, ' ').trim());
    const comparison =
      lines.length > 1 ? lines.slice(1).join(' ') : lines[0] ?? '';

    const iconSet = ['🚀', '🎯', '🛡️'];

    return {
      id: `${index}`,
      title: cleanLine(alt.baslik),
      description,
      comparison,
      icon: iconSet[index % iconSet.length],
    };
  });
};

const buildProcessSteps = (processBolge?: Bolge) => {
  if (!processBolge?.altBolge?.length) {
    return [];
  }

  return processBolge.altBolge.map((alt, index) => {
    const segments = splitParagraphs(alt.icerik);
    const actions: string[] = [];
    let benefits: string[] = [];
    const extras: StepExtra[] = [];

    segments.forEach((segment) => {
      const lines = segment.split('\n').map((line) => line.trim()).filter(Boolean);
      if (!lines.length) {
        return;
      }

      const header = cleanLine(lines[0]);
      const body = lines.slice(1).join('\n');

      if (/ne yapıyorum/i.test(header)) {
        actions.push(...parseList(body));
        return;
      }

      if (/kazancınız/i.test(header) || /kazanç/i.test(header)) {
        const parsed = parseList(body);
        benefits = parsed.length ? parsed : [cleanLine(body)];
        return;
      }

      const parsed = parseList(body);
      if (parsed.length) {
        extras.push({
          title: header,
          items: parsed,
        });
      } else {
        extras.push({
          title: header,
          items: [cleanLine(segment)],
        });
      }
    });

    if (!benefits.length) {
      const fallback = parseList(alt.icerik);
      if (fallback.length) {
        benefits = [fallback[fallback.length - 1]];
      }
    }

    return {
      stepNumber: index + 1,
      title: cleanLine(alt.baslik),
      actions,
      benefits,
      extras,
    };
  });
};

const buildMarketing = (marketingBolge?: Bolge) => {
  if (!marketingBolge) {
    return null;
  }

  const anaMesaj = marketingBolge.altBolge?.find((alt) =>
    /ana mesaj/i.test(alt.baslik),
  );
  const vurgular = marketingBolge.altBolge?.find((alt) =>
    /vurgular/i.test(alt.baslik),
  );
  const gorsel = marketingBolge.altBolge?.find((alt) =>
    /görsel/i.test(alt.baslik),
  );

  return {
    message: anaMesaj?.icerik ? cleanLine(anaMesaj.icerik) : marketingBolge.icerik,
    highlights: parseList(vurgular?.icerik),
    visualPlan: parseList(gorsel?.icerik),
  };
};

const buildValuePlan = (valueBolge?: Bolge) => {
  if (!valueBolge?.altBolge?.length) {
    return [];
  }

  return valueBolge.altBolge.map((alt) => ({
    title: cleanLine(alt.baslik),
    detail: cleanLine(alt.icerik),
  }));
};

const buildTargetAudience = (targetBolge?: Bolge) => {
  if (targetBolge?.altBolge?.length) {
    return targetBolge.altBolge.map((alt) => ({
      title: cleanLine(alt.baslik),
      description: cleanLine(alt.icerik),
    }));
  }

  return parseList(targetBolge?.icerik).map((item) => ({
    title: item,
    description: '',
  }));
};

const buildConsultantHighlights = (guaranteeBolge?: Bolge) => {
  if (!guaranteeBolge?.altBolge?.length) {
    return [];
  }

  return guaranteeBolge.altBolge.map((alt) => ({
    title: cleanLine(alt.baslik),
    bulletItems: parseList(alt.icerik),
  }));
};

const TemplateModernPortfolioDetailed: React.FC<{ data: OlusturulanSunum }> = ({ data }) => {
  const { icerik, istek } = data;
  const bolgeler = icerik.bolgeler;

  const hero = useMemo(() => {
    const heroBolge = findBolge(bolgeler, 'hero');
    const stilBaslik = icerik.baslik;
    const heroTitle = heroBolge?.baslik || stilBaslik;
    const heroDescription = heroBolge?.icerik || icerik.heroAciklama;
    const heroHighlight = findBolge(bolgeler, 'cozum')?.icerik;
    const mulkFoto = (istek.mulk as any)?.fotograflar?.[0];

    const fallbackImage =
      'https://images.unsplash.com/photo-1505691723518-36a9798dc5ab?auto=format&fit=crop&w=1400&q=80';

    return {
      title: heroTitle,
      description: heroDescription,
      highlight: heroHighlight,
      image: mulkFoto || fallbackImage,
    };
  }, [bolgeler, icerik, istek.mulk]);

  const benefits = useMemo(() => buildBenefits(findBolge(bolgeler, 'cozum')), [bolgeler]);
  const processSteps = useMemo(() => buildProcessSteps(findBolge(bolgeler, 'process')), [bolgeler]);

  const locationAnalysisBolge = findBolge(bolgeler, 'location_analysis');
  const konumBilgileri = locationAnalysisBolge?.altBolge?.find((alt) =>
    /konum bilgileri/i.test(alt.baslik),
  );

  const konumAvantajlariBolge = findBolge(bolgeler, 'location_advantages');
  const kullanimBolge = findBolge(bolgeler, 'usage_potential');
  const marketingBolge = findBolge(bolgeler, 'marketing_strategy');
  const valueBolge = findBolge(bolgeler, 'value_plan');
  const reklamBolge = findBolge(bolgeler, 'ad_channels');
  const targetBolge = findBolge(bolgeler, 'target_audience');
  const consultantBolge = findBolge(bolgeler, 'guarantee');
  const contactBolge = findBolge(bolgeler, 'contact_24_7');
  const marketOpportunityBolge = findBolge(bolgeler, 'market_opportunity');
  const timingBolge = findBolge(bolgeler, 'timing_urgency');
  const marketAnalysisBolge = findBolge(bolgeler, 'market_analysis');
  const faqBolge = findBolge(bolgeler, 'faq');

  const marketing = useMemo(() => buildMarketing(marketingBolge), [marketingBolge]);
  const valuePlan = useMemo(() => buildValuePlan(valueBolge), [valueBolge]);
  const targetAudience = useMemo(() => buildTargetAudience(targetBolge), [targetBolge]);
  const consultantHighlights = useMemo(
    () => buildConsultantHighlights(consultantBolge),
    [consultantBolge],
  );

  const reklamList =
    reklamBolge?.altBolge && reklamBolge.altBolge.length > 0
      ? parseList(reklamBolge.altBolge[0].icerik)
      : parseList(reklamBolge?.icerik);

  const contactList = contactBolge?.altBolge && contactBolge.altBolge.length > 0
    ? parseList(contactBolge.altBolge[0].icerik)
    : parseList(contactBolge?.icerik);

  const marketNote = marketOpportunityBolge?.icerik || '';
  const timingNote = timingBolge?.altBolge?.[0]?.icerik || timingBolge?.icerik || '';

  const consultant = istek.danisman;
  const mulk = istek.mulk;

  const planTitle =
    konumAvantajlariBolge?.baslik?.replace(/^[^\wğüşöçıİĞÜŞÖÇ]+/i, '').toUpperCase() ||
    'SİZİN İÇİN HAZIRLADIĞIM ÖZEL PLAN';
  const priceSummary = formatPriceRange(mulk);
  const planSubtitle =
    icerik.altBaslik ||
    `${mulk.konum || ''}${mulk.metrekare ? ` • ${mulk.metrekare} m²` : ''}${
      priceSummary ? ` • ${priceSummary}` : ''
    }`;

  return (
    <div className="bg-gray-900 text-gray-100 font-sans">
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,11,25,0.85), rgba(6,11,25,0.85)), url(${hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-sm uppercase tracking-[0.3em] text-indigo-300">
            {SUNUM_STILI_BASLIK}
          </span>
          <h1 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            {hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-gray-300 leading-relaxed">
            {hero.description}
          </p>
          {hero.highlight && (
            <p className="mt-8 text-base md:text-lg font-semibold text-teal-300 bg-white/10 inline-block px-6 py-3 rounded-full shadow-lg border border-teal-400/30">
              {hero.highlight}
            </p>
          )}
        </div>
        <div className="absolute bottom-10 animate-bounce cursor-pointer hidden md:block">
          <button
            type="button"
            className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Benefits */}
      {!!benefits.length && (
        <section className="py-20 bg-black">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="bg-gray-800/60 p-8 rounded-3xl border border-gray-700 hover:border-indigo-400/60 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-md"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                  {benefit.comparison && (
                    <p className="mt-4 inline-block text-sm font-semibold text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                      {benefit.comparison}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {!!processSteps.length && (
        <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-gray-950">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                6 Adımlı <span className="text-indigo-400">Profesyonel Satış Sistemi</span>
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                {findBolge(bolgeler, 'process')?.icerik ||
                  `${mulk.konum} için satış sürecini uçtan uca yönetiyorum.`}
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-indigo-400/20 to-transparent" />
              <div className="space-y-10 relative">
                {processSteps.map((step) => (
                  <div key={step.stepNumber} className="relative pl-16 md:pl-20">
                    <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white font-bold shadow-lg">
                      {step.stepNumber}
                    </div>
                    <div className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl">
                      <h3 className="text-2xl font-extrabold text-white mb-4 uppercase tracking-wide">
                        {step.title}
                      </h3>
                      {!!step.actions.length && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold tracking-[0.3em] text-indigo-300 uppercase mb-3">
                            Ne Yapıyorum
                          </h4>
                          <ul className="space-y-2 text-gray-300 leading-relaxed">
                            {step.actions.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!!step.benefits.length && (
                        <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-5">
                          <h4 className="text-sm font-semibold tracking-[0.3em] text-green-300 uppercase mb-2">
                            Sizin Kazancınız
                          </h4>
                          <ul className="space-y-2 text-green-100 leading-relaxed">
                            {step.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-300 mt-1">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!!step.extras.length && (
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          {step.extras.map((extra, idx) => (
                            <div
                              key={`${step.stepNumber}-extra-${idx}`}
                              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200"
                            >
                              {extra.title && (
                                <p className="font-semibold text-indigo-200 mb-2 uppercase tracking-wide text-xs">
                                  {extra.title}
                                </p>
                              )}
                              <ul className="space-y-1">
                                {extra.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-start gap-2">
                                    <span className="text-indigo-300 mt-1">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 text-center">
              <p className="text-xl font-semibold text-white">
                ⏱️ Ortalama Süre: <span className="text-indigo-300">45 gün</span>
              </p>
              <p className="text-xl font-semibold text-white mt-2">
                💰 Hedef: <span className="text-indigo-300">Piyasa değerinde hızlı satış</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Property & Marketing Plan */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              {planTitle}
            </h2>
            {planSubtitle && (
              <p className="mt-4 text-lg text-gray-400">{planSubtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800/60 rounded-3xl border border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Konum Analizi</h3>
              <div className="space-y-2 text-gray-300">
                {parseList(konumBilgileri?.icerik).map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/60 rounded-3xl border border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Konum Avantajları</h3>
              <ul className="space-y-2 text-gray-300">
                {parseList(konumAvantajlariBolge?.icerik).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800/60 rounded-3xl border border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Kullanım Potansiyeli</h3>
              <ul className="space-y-2 text-gray-300">
                {parseList(kullanimBolge?.icerik).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-300 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {(marketing || targetAudience.length > 0) && (
            <div className="bg-gray-800/80 border border-gray-700 rounded-3xl p-8 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">🎯 Hedef Kitle Profili</h3>
                  <div className="space-y-4">
                    {targetAudience.map((audience, idx) => (
                      <div key={idx}>
                        <p className="font-semibold text-gray-100 text-lg">{audience.title}</p>
                        {audience.description && (
                          <p className="text-gray-400">{audience.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {marketing && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">📢 Tanıtım Stratejisi</h3>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-300 mb-3">
                      Ana Mesaj
                    </p>
                    <p className="italic text-gray-200 text-lg">"{marketing.message}"</p>
                    {!!marketing.highlights.length && (
                      <>
                        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-indigo-300">
                          Vurgular
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {marketing.highlights.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-sm"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                    {!!marketing.visualPlan.length && (
                      <>
                        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-indigo-300">
                          Görsel İçerik Planı
                        </p>
                        <ul className="mt-3 space-y-2 text-gray-300">
                          {marketing.visualPlan.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-indigo-200 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {!!valuePlan.length && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800/60 rounded-3xl border border-gray-700 p-6">
                <h3 className="text-2xl font-bold text-white mb-4">💰 Tahmini Değer & Satış Planı</h3>
                <ul className="space-y-3 text-gray-300">
                  {valuePlan.map((item, idx) => (
                    <li key={idx}>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p>{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              {!!reklamList.length && (
                <div className="bg-gray-800/60 rounded-3xl border border-gray-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">📣 Reklam Kanalları</h3>
                  <div className="flex flex-wrap gap-2">
                    {reklamList.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(marketNote || timingNote) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {marketNote && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-200">
                  <h3 className="text-lg font-semibold text-white mb-3">📈 Piyasa Fırsatı</h3>
                  <p>{marketNote}</p>
                </div>
              )}
              {timingNote && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-200">
                  <h3 className="text-lg font-semibold text-white mb-3">⏰ Zamanlama Avantajı</h3>
                  <p>{cleanLine(timingNote)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Consultant & Guarantees */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600/40 to-indigo-400/10 rounded-3xl border border-indigo-400/30 p-8 shadow-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-200 mb-4">
                Danışmanınız
              </p>
              <h3 className="text-3xl font-bold text-white">{consultant.adSoyad}</h3>
              {consultant.ofisAdi && (
                <p className="mt-2 text-indigo-200 font-semibold">{consultant.ofisAdi}</p>
              )}
              <div className="mt-6 space-y-3 text-gray-200">
                <p>📞 {consultant.telefon}</p>
                <p>📧 {consultant.email}</p>
                {contactList.map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-8">
              {!!consultantHighlights.length && (
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">
                    Güvence Paketi & Güçlü Yönler
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {consultantHighlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-900/70 border border-gray-700 rounded-3xl p-6 shadow-xl"
                      >
                        <h5 className="text-xl font-semibold text-indigo-200 mb-3">
                          {highlight.title}
                        </h5>
                        <ul className="space-y-2 text-gray-300">
                          {highlight.bulletItems.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2">
                              <span className="text-indigo-300 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#050b1d] py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
          <MarketAnalysisSection bolge={marketAnalysisBolge} theme="dark" />
          <FaqSection bolge={faqBolge} theme="dark" />
        </div>
      </div>

      {/* CTA */}
      {icerik.cti && (
        <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              {icerik.cti.baslik}
            </h2>
            <p className="text-lg md:text-xl text-indigo-100 leading-relaxed">
              {icerik.cti.aciklama}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${consultant.telefon}`}
                className="px-8 py-4 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Hemen Ara
              </a>
              <a
                href={`mailto:${consultant.email}`}
                className="px-8 py-4 rounded-full border border-white/50 font-semibold hover:bg-white/10 transition-colors"
              >
                Detaylı Bilgi Talep Et
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const SUNUM_STILI_BASLIK = 'Detaylı Analiz • Modern • Portföy Almak';

export default TemplateModernPortfolioDetailed;

