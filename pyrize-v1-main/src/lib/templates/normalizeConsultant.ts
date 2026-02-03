/**
 * Centralized Consultant Normalization Utility
 * 
 * Transforms DanismanBilgileri from API/forms into the template-ready Consultant type.
 * Provides defensive defaults for all fields to prevent undefined access in templates.
 */

import React from 'react';
import type { DanismanBilgileri } from '@/types';

/**
 * Template-ready Consultant interface
 * This is the authoritative type that all templates should consume.
 */
export interface NormalizedConsultant {
    adSoyad: string;
    unvan: string;
    tagline?: string;
    telefon: string;
    email: string;
    profilFotografiUrl: string;
    ofisLogosuUrl: string;
    ofisAdi: string;
    oduller: string[];
    gucler: { icon: React.ReactElement; text: string }[];
    deneyim?: string;
    referans?: string;
}

const DEFAULT_PROFILE_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400';
const DEFAULT_OFFICE_LOGO = 'https://i.ibb.co/1yynDd7/e92f870139b241e9820965c4ac5167b3-removebg-preview.png';
const DEFAULT_TITLE = 'Gayrimenkul Danışmanı';
const DEFAULT_OFFICE = 'RE/MAX';

/**
 * Safely splits a string into an array of non-empty lines
 */
const splitLines = (value?: string | null): string[] =>
    (value || '')
        .split(/\r?\n/)
        .map((item) => item.replace(/^[•\-–—→✅\u2022\s]+/, '').trim())
        .filter(Boolean);

/**
 * Creates a simple placeholder icon element
 */
const createPlaceholderIcon = (): React.ReactElement =>
    React.createElement('div', { className: 'w-6 h-6' });

/**
 * Normalizes DanismanBilgileri into a template-ready Consultant object.
 * 
 * Key transformations:
 * - profilFotografi → profilFotografiUrl
 * - ofisLogosu → ofisLogosuUrl
 * - unvan fallback chain: unvan → deneyim → DEFAULT_TITLE
 * - oduller (string) → oduller (string[])
 * - Generates gucler from deneyim if available
 * 
 * @param danisman - Raw consultant data from API/forms
 * @returns Fully populated Consultant object with no undefined required fields
 */
export function normalizeConsultant(danisman?: DanismanBilgileri | null): NormalizedConsultant {
    // Handle completely missing data
    if (!danisman) {
        return {
            adSoyad: 'Danışman Bilgisi Eksik',
            unvan: DEFAULT_TITLE,
            telefon: '',
            email: '',
            profilFotografiUrl: DEFAULT_PROFILE_PHOTO,
            ofisLogosuUrl: DEFAULT_OFFICE_LOGO,
            ofisAdi: DEFAULT_OFFICE,
            oduller: [],
            gucler: [],
        };
    }

    // Parse awards from string to array
    const odulList = splitLines(danisman.oduller);

    // Build strengths array from deneyim if available
    const gucler: NormalizedConsultant['gucler'] = [];
    if (danisman.deneyim) {
        gucler.push({
            icon: createPlaceholderIcon(),
            text: danisman.deneyim,
        });
    }

    return {
        adSoyad: danisman.adSoyad || 'Danışman Bilgisi Eksik',
        // Priority: explicit unvan > deneyim > default
        unvan: danisman.unvan || danisman.deneyim || DEFAULT_TITLE,
        telefon: danisman.telefon || '',
        email: danisman.email || '',
        // Handle both old and new field names for photos
        profilFotografiUrl: danisman.profilFotografi || DEFAULT_PROFILE_PHOTO,
        ofisLogosuUrl: danisman.ofisLogosu || DEFAULT_OFFICE_LOGO,
        ofisAdi: danisman.ofisAdi || DEFAULT_OFFICE,
        oduller: odulList,
        gucler,
        deneyim: danisman.deneyim,
        referans: danisman.referans,
    };
}

/**
 * Type guard to check if a value is a valid DanismanBilgileri
 */
export function isDanismanBilgileri(value: unknown): value is DanismanBilgileri {
    if (!value || typeof value !== 'object') return false;
    const obj = value as Record<string, unknown>;
    return typeof obj.adSoyad === 'string' &&
        typeof obj.telefon === 'string' &&
        typeof obj.email === 'string';
}
