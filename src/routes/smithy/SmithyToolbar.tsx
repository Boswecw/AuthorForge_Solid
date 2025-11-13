// src/routes/smithy/SmithyToolbar.tsx
import type { SmithyTextFormat } from "./SmithyTextFormat";

// Re-export the type for convenience
export type { SmithyTextFormat } from "./SmithyTextFormat";

interface SmithyToolbarProps {
  format: SmithyTextFormat;
  onFormatChange: (next: SmithyTextFormat) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function SmithyToolbar(props: SmithyToolbarProps) {
  // 🔸 Important: use props.format directly so Solid can track it.
  const update = (partial: Partial<SmithyTextFormat>) => {
    props.onFormatChange({ ...props.format, ...partial });
  };

  const changeIndent = (delta: -1 | 1) => {
    const next = Math.min(3, Math.max(0, props.format.indentLevel + delta));
    update({ indentLevel: next as SmithyTextFormat["indentLevel"] });
  };

  const toggleWeight = () =>
    update({
      weight: props.format.weight === "bold" ? "normal" : "bold",
    });

  const toggleItalic = () => update({ italic: !props.format.italic });

  const toggleUnderline = () => update({ underline: !props.format.underline });

  // 🔹 Shared select styling – fixes “white box” in dark mode
  const selectClass =
    "rounded bg-[rgb(var(--bg))] text-[rgb(var(--fg))] " +
    "px-2 py-1 text-xs outline-none " +
    "border border-[rgb(var(--forge-steel))/0.6] " +
    "hover:border-[rgb(var(--forge-ember))/0.7] " +
    "focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-ember))/0.7] " +
    "focus-visible:border-[rgb(var(--forge-ember))/0.9] " +
    "transition-colors";

  return (
    <div
      class="flex flex-wrap items-center justify-between gap-3 border-b
             border-[rgb(var(--forge-steel))/0.4] bg-[rgb(var(--bg))]/0.96
             px-4 py-2 text-xs"
    >
      {/* LEFT SIDE: font + paragraph controls */}
      <div class="flex flex-wrap items-center gap-3">
        {/* Font controls */}
        <div class="flex items-center gap-2 rounded-lg border border-[rgb(var(--forge-steel))/0.4] bg-black/20 px-2 py-1">
          <span class="text-[0.65rem] uppercase tracking-[0.18em] text-[rgb(var(--subtle))]">
            Text
          </span>

          {/* FONT FAMILY DROPDOWN */}
          <select
            class={selectClass}
            value={props.format.fontFamily}
            onInput={(e) =>
              update({
                fontFamily: e.currentTarget
                  .value as SmithyTextFormat["fontFamily"],
              })
            }
          >
            <option value="body">EB Garamond</option>
            <option value="bodyAlt">Cormorant Garamond</option>
            <option value="heading">Cinzel</option>
            <option value="decor">Cinzel Decorative</option>
            <option value="ui">Inter (UI)</option>
            <option value="system">System UI</option>
            <option value="mono">Monospace</option>
          </select>

          {/* FONT SIZE */}
          <select
            class={selectClass}
            value={props.format.fontSize}
            onInput={(e) =>
              update({
                fontSize: e.currentTarget.value as SmithyTextFormat["fontSize"],
              })
            }
          >
            <option value="12">12</option>
            <option value="14">14</option>
            <option value="16">16</option>
            <option value="18">18</option>
          </select>

          {/* HEADING LEVEL */}
          <select
            class={selectClass}
            value={props.format.heading}
            onInput={(e) =>
              update({
                heading: e.currentTarget.value as SmithyTextFormat["heading"],
              })
            }
          >
            <option value="normal">Normal</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
          </select>
        </div>

        {/* Paragraph / spacing controls */}
        <div class="flex items-center gap-2 rounded-lg border border-[rgb(var(--forge-steel))/0.4] bg-black/20 px-2 py-1">
          <span class="text-[0.65rem] uppercase tracking-[0.18em] text-[rgb(var(--subtle))]">
            Paragraph
          </span>

          {/* LINE HEIGHT */}
          <select
            class={selectClass}
            value={props.format.lineHeight}
            onInput={(e) =>
              update({
                lineHeight: e.currentTarget
                  .value as SmithyTextFormat["lineHeight"],
              })
            }
          >
            <option value="single">Single</option>
            <option value="oneHalf">1.5</option>
            <option value="double">Double</option>
          </select>

          {/* INDENT */}
          <div class="inline-flex items-center gap-[1px] rounded bg-black/30">
            <button
              type="button"
              class="px-2 py-1 text-[0.7rem] hover:bg-white/5"
              onClick={() => changeIndent(-1)}
            >
              ⟵
            </button>
            <button
              type="button"
              class="px-2 py-1 text-[0.7rem] hover:bg-white/5"
              onClick={() => changeIndent(1)}
            >
              ⟶
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: style controls */}
      <div class="flex items-center gap-1 rounded-lg border border-[rgb(var(--forge-steel))/0.4] bg-black/20 px-2 py-1">
        <span class="mr-1 text-[0.65rem] uppercase tracking-[0.18em] text-[rgb(var(--subtle))]">
          Style
        </span>
        <button
          type="button"
          class={`rounded px-2 py-1 font-semibold ${
            props.format.weight === "bold"
              ? "bg-[rgb(var(--forge-ember))/0.25] text-[rgb(var(--forge-ember))]"
              : "hover:bg-white/5"
          }`}
          onClick={toggleWeight}
        >
          B
        </button>
        <button
          type="button"
          class={`rounded px-2 py-1 italic ${
            props.format.italic
              ? "bg-[rgb(var(--forge-ember))/0.25] text-[rgb(var(--forge-ember))]"
              : "hover:bg-white/5"
          }`}
          onClick={toggleItalic}
        >
          I
        </button>
        <button
          type="button"
          class={`rounded px-2 py-1 underline ${
            props.format.underline
              ? "bg-[rgb(var(--forge-ember))/0.25] text-[rgb(var(--forge-ember))]"
              : "hover:bg-white/5"
          }`}
          onClick={toggleUnderline}
        >
          U
        </button>
      </div>

      {/* Undo/Redo controls */}
      {(props.onUndo || props.onRedo) && (
        <div class="flex items-center gap-1 rounded-lg border border-[rgb(var(--forge-steel))/0.4] bg-black/20 dark:bg-[rgb(var(--forge-steel))/0.15] px-2 py-1">
          <button
            type="button"
            class="rounded px-2 py-1 text-[rgb(var(--fg))] hover:bg-white/5 dark:hover:bg-white/10 disabled:opacity-30"
            onClick={props.onUndo}
            disabled={!props.onUndo}
            title="Undo (Cmd+Z)"
          >
            ↶
          </button>
          <button
            type="button"
            class="rounded px-2 py-1 text-[rgb(var(--fg))] hover:bg-white/5 dark:hover:bg-white/10 disabled:opacity-30"
            onClick={props.onRedo}
            disabled={!props.onRedo}
            title="Redo (Cmd+Shift+Z)"
          >
            ↷
          </button>
        </div>
      )}
    </div>
  );
}
