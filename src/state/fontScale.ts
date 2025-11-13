// src/state/fontScale.ts
import { createSignal, createEffect, createRoot } from "solid-js";

export type FontScaleKey = "small" | "normal" | "large" | "xlarge";

const FONT_SCALE_VALUES: Record<FontScaleKey, number> = {
  small: 0.9,
  normal: 1.0,
  large: 1.2,
  xlarge: 1.4,
};

const STORAGE_KEY = "authorforge:fontScale";

// Initialize from localStorage if available
function getInitialScale(): FontScaleKey {
  if (typeof window === "undefined") return "normal";
  const stored = window.localStorage.getItem(
    STORAGE_KEY
  ) as FontScaleKey | null;
  return stored && FONT_SCALE_VALUES[stored] ? stored : "normal";
}

function applyScaleToDocument(key: FontScaleKey) {
  const factor = FONT_SCALE_VALUES[key];
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(
      "--font-scale",
      factor.toString()
    );
  }
}

// Create the signal and effect inside a reactive root to prevent memory leaks
const { fontScaleKey, setFontScaleKey } = createRoot(() => {
  const [fontScaleKey, setFontScaleKey] = createSignal<FontScaleKey>(
    getInitialScale()
  );

  // Apply scale on initialization and whenever it changes
  createEffect(() => {
    const key = fontScaleKey();
    applyScaleToDocument(key);
  });

  return { fontScaleKey, setFontScaleKey };
});

export function setGlobalFontScale(key: FontScaleKey) {
  setFontScaleKey(key);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, key);
  }
}

export function useFontScale() {
  return {
    fontScaleKey,
    setGlobalFontScale,
  };
}
