"use client";

import React from "react";
import { HeroBolum } from "./bolumler/HeroBolum";
import { MetriklerBolum } from "./bolumler/MetriklerBolum";
import { ListeBolum } from "./bolumler/ListeBolum";
import { ProfilBolum } from "./bolumler/ProfilBolum";
import { CtaBolum } from "./bolumler/CtaBolum";
import { AdimlarBolum } from "./bolumler/AdimlarBolum";
import { EmpatiBolum } from "./bolumler/EmpatiBolum";
import { OzellikGridBolum } from "./bolumler/OzellikGridBolum";

export interface BolumData {
  id: string;
  tip: string;
  baslik?: string;
  headline?: string;
  altBaslik?: string;
  [key: string]: any;
}

export interface BolumProps {
  data: BolumData;
  tema: string;
}

const BOLUM_MAP: Record<string, React.FC<BolumProps>> = {
  hero: HeroBolum,
  "kapak-detayli": HeroBolum,
  "premium-kapak": HeroBolum,
  hook: HeroBolum,
  metrikler: MetriklerBolum,
  "rakam-grid": MetriklerBolum,
  "neden-simdi": MetriklerBolum,
  liste: ListeBolum,
  "pazarlama-plani": ListeBolum,
  profil: ProfilBolum,
  "profil-detayli": ProfilBolum,
  referanslar: ProfilBolum,
  "referans-garanti": ProfilBolum,
  cta: CtaBolum,
  "cta-acil": CtaBolum,
  "cta-detayli": CtaBolum,
  "cta-premium": CtaBolum,
  "cta-guven": CtaBolum,
  adimlar: AdimlarBolum,
  "zaman-cizelgesi": AdimlarBolum,
  "seffaf-surec": AdimlarBolum,
  "guvenli-satin-alma": AdimlarBolum,
  empati: EmpatiBolum,
  "taahhut-listesi": EmpatiBolum,
  dogrulama: EmpatiBolum,
  "seffaf-rapor": EmpatiBolum,
  "ozellik-grid": OzellikGridBolum,
  "piyasa-analizi": MetriklerBolum,
  "deger-analizi": MetriklerBolum,
  degerleme: MetriklerBolum,
  "yatirim-analizi": MetriklerBolum,
  "finansal-tablo": MetriklerBolum,
  "yasam-kalitesi": ListeBolum,
  "ozel-pazarlama": ListeBolum,
  "premium-piyasa": MetriklerBolum,
  "yatirim-premium": MetriklerBolum,
  "mimari-detay": ListeBolum,
  "konum-ayricalik": ListeBolum,
};

export function BolumRenderer({ bolum, tema }: { bolum: BolumData; tema: string }) {
  const BolumComponent = BOLUM_MAP[bolum.tip] || HeroBolum;
  return <BolumComponent data={bolum} tema={tema} />;
}
