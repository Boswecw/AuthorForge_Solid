import { createSignal, onMount } from "solid-js";

/**
 * Persistent theme controller.
 * - Reads saved theme from localStorage
 * - Falls back to prefers-color-scheme
 * - Applies/removes .dark on <html> and sets data-theme="forge-light" | "forge-dark"
 */
type Theme = "light" | "dark";

const storageKey = "theme";
const prefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "forge-dark");
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "forge-light");
  }
  localStorage.setItem(storageKey, t);
}

export function useTheme() {
  const [theme, setTheme] = createSignal<Theme>("dark");

  onMount(() => {
    const saved = (localStorage.getItem(storageKey) as Theme | null);
    const next = saved ?? (prefersDark() ? "dark" : "light");
    setTheme(next);
    applyTheme(next);
  });

  const toggle = () => {
    const next: Theme = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return { theme, toggle };
}
