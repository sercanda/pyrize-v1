import React from 'react';

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
}

export interface SalesBenefit {
    icon: React.ReactElement;
    title: string;
    description: string;
    comparison: string;
}

export interface SalesSystemStep {
    gun: string;
    icon: React.ReactElement;
    baslik: string;
    neYapiyorum: string[];
    sizinKazanciniz: string;
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
  tagline?: string;
  telefon: string;
  email: string;
  profilFotografiUrl: string;
  ofisLogosuUrl: string;
  ofisAdi: string;
  oduller: string[];
  gucler: ConsultantStrength[];
}

export interface DigitalMarketingTool {
    icon: React.ReactElement;
    title: string;
    description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// FIX: Add missing RegionalData type definition
export interface RegionalData {
    comparisonData: {
        name: string;
        'Bölge Ortalaması': number;
        'Sizin Mülkünüz': number;
    }[];
    trendData: {
        name: string;
        'Fiyat Endeksi': number;
    }[];
    kfeMetrics?: {
        bolgeYillikDegisim: number;
        bolgeYtdDegisim: number | null;
        turkiyeYillikDegisim: number | null;
        regionCode: string;
    };
}