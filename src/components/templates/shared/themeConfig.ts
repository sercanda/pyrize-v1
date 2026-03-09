export interface ThemeConfig {
  id: 'modern' | 'kurumsal' | 'luks';
  // Background
  bgPrimary: string;
  bgSurface: string;
  bgCard: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  // Accents
  accentBg: string;
  borderColor: string;
  // Gradient
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  // Selection
  selectionBg: string;
  selectionText: string;
}

export const THEME_MODERN: ThemeConfig = {
  id: 'modern',
  bgPrimary: 'bg-slate-950',
  bgSurface: 'bg-white/5',
  bgCard: 'bg-slate-900/50',
  textPrimary: 'text-slate-200',
  textSecondary: 'text-slate-400',
  textAccent: 'text-indigo-400',
  accentBg: 'bg-indigo-500',
  borderColor: 'border-white/10',
  gradientFrom: 'from-slate-900',
  gradientVia: 'via-slate-950',
  gradientTo: 'to-slate-950',
  selectionBg: 'selection:bg-indigo-500',
  selectionText: 'selection:text-white',
};

export const THEME_KURUMSAL: ThemeConfig = {
  id: 'kurumsal',
  bgPrimary: 'bg-slate-950',
  bgSurface: 'bg-blue-900/10',
  bgCard: 'bg-slate-900/50',
  textPrimary: 'text-slate-200',
  textSecondary: 'text-slate-400',
  textAccent: 'text-blue-400',
  accentBg: 'bg-blue-600',
  borderColor: 'border-blue-500/10',
  gradientFrom: 'from-slate-900',
  gradientVia: 'via-blue-950',
  gradientTo: 'to-slate-950',
  selectionBg: 'selection:bg-blue-500',
  selectionText: 'selection:text-white',
};

export const THEME_LUKS: ThemeConfig = {
  id: 'luks',
  bgPrimary: 'bg-stone-950',
  bgSurface: 'bg-amber-900/10',
  bgCard: 'bg-stone-900/50',
  textPrimary: 'text-stone-200',
  textSecondary: 'text-stone-400',
  textAccent: 'text-amber-400',
  accentBg: 'bg-amber-500',
  borderColor: 'border-amber-500/10',
  gradientFrom: 'from-stone-900',
  gradientVia: 'via-stone-950',
  gradientTo: 'to-stone-950',
  selectionBg: 'selection:bg-amber-500',
  selectionText: 'selection:text-white',
};

export function getThemeConfig(tema?: string): ThemeConfig {
  switch (tema) {
    case 'kurumsal': return THEME_KURUMSAL;
    case 'luks': return THEME_LUKS;
    default: return THEME_MODERN;
  }
}
