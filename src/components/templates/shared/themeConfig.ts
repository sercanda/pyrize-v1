export interface ThemeConfig {
  id: 'modern' | 'kurumsal' | 'luks';
  isDark: boolean;
  // Background
  bgPrimary: string;
  bgSurface: string;
  bgCard: string;
  bgOverlay: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  accentText: string;
  // Accents
  accentBg: string;
  borderColor: string;
  borderAccent: string;
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
  isDark: true,
  bgPrimary: 'bg-slate-950',
  bgSurface: 'bg-white/5',
  bgCard: 'bg-slate-900/50',
  bgOverlay: 'bg-slate-900/50',
  textPrimary: 'text-slate-200',
  textSecondary: 'text-slate-400',
  textAccent: 'text-indigo-400',
  accentText: 'text-indigo-400',
  accentBg: 'bg-indigo-500',
  borderColor: 'border-white/10',
  borderAccent: 'border-indigo-500/20',
  gradientFrom: 'from-slate-900',
  gradientVia: 'via-slate-950',
  gradientTo: 'to-slate-950',
  selectionBg: 'selection:bg-indigo-500',
  selectionText: 'selection:text-white',
};

export const THEME_KURUMSAL: ThemeConfig = {
  id: 'kurumsal',
  isDark: false,
  bgPrimary: 'bg-white',
  bgSurface: 'bg-slate-50',
  bgCard: 'bg-white',
  bgOverlay: 'bg-slate-100/80',
  textPrimary: 'text-slate-900',
  textSecondary: 'text-slate-600',
  textAccent: 'text-blue-700',
  accentText: 'text-blue-600',
  accentBg: 'bg-blue-600',
  borderColor: 'border-slate-200',
  borderAccent: 'border-blue-200',
  gradientFrom: 'from-white',
  gradientVia: 'via-slate-50',
  gradientTo: 'to-white',
  selectionBg: 'selection:bg-blue-100',
  selectionText: 'selection:text-blue-900',
};

export const THEME_LUKS: ThemeConfig = {
  id: 'luks',
  isDark: true,
  bgPrimary: 'bg-stone-950',
  bgSurface: 'bg-amber-900/10',
  bgCard: 'bg-stone-900/50',
  bgOverlay: 'bg-stone-900/50',
  textPrimary: 'text-stone-200',
  textSecondary: 'text-stone-400',
  textAccent: 'text-amber-400',
  accentText: 'text-amber-400',
  accentBg: 'bg-amber-500',
  borderColor: 'border-amber-500/10',
  borderAccent: 'border-amber-500/20',
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
