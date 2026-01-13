import React from 'react';

export interface StrategicAdvantage {
  icon: React.ReactNode;
  title: string;
  description: string;
  comparison: string;
}

export interface SalesSystemStep {
  icon: React.ReactNode;
  gun: string;
  baslik: string;
  neYapiyoruz: string[];
  kazanciniz: string;
}

interface Gucler {
  icon: React.ReactNode;
  text: string;
}

export interface Consultant {
  adSoyad: string;
  unvan: string;
  profilFotografiUrl: string;
  ofisAdi: string;
  ofisLogosuUrl:string;
  gucler: Gucler[];
  oduller: string[];
  telefon: string;
  email: string;
}

export interface MarketingPlan {
  promotionStrategy: string;
  targetAudience: string;
  channels: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Property {
  address: string;
  price: number;
  sqm: number;
  type: string;
  locationHighlights: {
    icon: React.ReactNode;
    category: string;
    points: string[];
  }[];
  potential: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  marketingPlan: MarketingPlan;
}

export interface ValuationData {
  averagePricePerSqm: number;
  priceTrend: number; // percentage
  rentalYield: number; // percentage
  regionalCompetitors: {
    address: string;
    price: number;
    sqm: number;
    url: string;
  }[];
}