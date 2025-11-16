// src/routes/hearth/FontSizeControl.tsx
import { For } from "solid-js";
import { useFontScale, type FontScaleKey } from "~/state/fontScale";

const OPTIONS: { key: FontScaleKey; label: string }[] = [
  { key: "small", label: "A−" },
  { key: "normal", label: "Default" },
  { key: "large", label: "A+" },
  { key: "xlarge", label: "A++" },
];

export function FontSizeControl() {
  const { fontScaleKey, setGlobalFontScale } = useFontScale();

  return (
    <div class="flex items-center gap-3">
      <span class="text-sm opacity-80 font-medium">Text Size</span>
      <div class="inline-flex rounded-lg border border-[rgb(var(--forge-steel))]/30 bg-[rgb(var(--bg))]/60 p-0.5">
        <For each={OPTIONS}>
          {(opt) => (
            <button
              type="button"
              class={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                fontScaleKey() === opt.key
                  ? "bg-gradient-to-b from-[rgb(var(--forge-ember))]/25 to-transparent shadow-ember border border-white/10"
                  : "text-[rgb(var(--fg))]/70 hover:bg-white/5 border border-transparent"
              }`}
              onClick={() => setGlobalFontScale(opt.key)}
              aria-pressed={fontScaleKey() === opt.key}
              aria-label={`Set text size to ${opt.label}`}
            >
              {opt.label}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

