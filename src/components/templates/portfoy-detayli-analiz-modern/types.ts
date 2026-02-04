
import React from 'react';

export interface MarketAnalysis {
    microLocationValue: string;
    regionalTrend: string;
    seaProximityPremium: string;
    gardenValueRatio: string;
    marketRisk: string;
    buyerBehavior: string;
    seasonalEffect: string;
}

export interface Property {
    gorselUrl: string;
    planBaslik: string;
    planAltBaslik: string;
    konumAnalizi: {
        ilIlce: string;
        mahalle: string;
        ozellik: string;
        mevcutYapi: string;
    };
    konumAvantajlari: string[];
    kullanimPotensiyeli: string[];
    hedefKitle: {
        baslik: string;
        aciklama: string;
    }[];
    tanitimStratejisi: {
        anaMesaj: string;
        vurgular: string[];
        gorselIcerikPlani: string;
    };
    satisPlani: {
        fiyatStratejisi: string;
        hedefSatisSuresi: string;
        tahminiIlgi: string;
    };
    reklamKanallari: string[];
    marketAnalysis: MarketAnalysis;
}

export interface StrategicAdvantage {
    icon: React.ReactElement;
    title: string;
    description: string;
    comparison: string;
}

export interface SalesSystemStep {
    gun: string;
    icon: React.ReactElement;
    baslik: string;
    neYapiyoruz: string[];
    kazanciniz: string;
    maliyetNotu?: string;
    ucretNotu?: string;
    ekstraIcerik?: {
        type: 'table';
        headers: string[];
        rows: (string | number)[][];
    }
}

export interface ConsultantStrength {
    icon: React.ReactElement;
    text: string;
}

export interface Consultant {
  adSoyad: string;
  unvan: string;
  telefon: string;
  email: string;
  profilFotografiUrl: string;
  ofisLogosuUrl: string;
  ofisAdi: string;
  oduller: string[];
  gucler: ConsultantStrength[];
}

export interface MarketSnapshot {
    title: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
    trendLabel?: string;
}

export interface ComparableProperty {
    address: string;
    status: 'Satıldı' | 'Satışta';
    price: string;
    size: string;
    pricePerSqm: string;
}

export interface ValuationData {
    marketSnapshots: MarketSnapshot[];
    comparables: ComparableProperty[];
    estimatedValueRange: string;
    priceStrategyNote: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}
