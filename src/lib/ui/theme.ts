// src/lib/ui/theme.ts

export type ThemeMode = 'light' | 'dark';

/**
 * Applies and persists theme preference.
 * Safe to call on both client and server (no-op on server).
 */
export function setTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return; // Skip on server

  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', mode);
}

/**
 * Loads the stored theme from localStorage or system preference.
 * Should run once on app startup (client-side only).
 */
export function initTheme() {
  if (typeof window === 'undefined') return; // Skip on server

  const saved = localStorage.getItem('theme') as ThemeMode | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = saved ?? (prefersDark ? 'dark' : 'light');
  setTheme(mode);
}
