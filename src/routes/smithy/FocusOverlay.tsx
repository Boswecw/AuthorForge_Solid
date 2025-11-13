// src/routes/smithy/FocusOverlay.tsx
import type { Component } from "solid-js";
import EditorStats from "./EditorStats";
import AiAssistPanel from "./AiAssistPanel";

interface FocusOverlayProps {
  activeTitle: string;
  draft: string;
  onDraftChange: (value: string) => void;
  words: number;
  chars: number;
  paragraphs: number;
  readingMinutes: number;
  onExitFocus: () => void;
}

const FocusOverlay: Component<FocusOverlayProps> = (props) => {
  return (
    <div class="fixed inset-0 z-40 bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      {/* Top bar */}
      <div class="flex items-center justify-between border-b border-[rgb(var(--forge-steel))/0.3] px-6 py-3">
        <div class="space-y-1">
          <h1 class="font-display text-sm tracking-[0.25em] text-[rgb(var(--forge-brass))] uppercase">
            Focus Mode — The Smithy
          </h1>
          <p class="text-[0.7rem] text-[rgb(var(--muted))]">
            Full-screen drafting. Stats on the left, AI assistant on the right.
          </p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <button
            class="rounded-md border border-[rgb(var(--forge-steel))/0.4] px-3 py-1 hover:bg-white/5"
            type="button"
            onClick={props.onExitFocus}
          >
            Exit focus (Esc)
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div class="flex h-[calc(100vh-3.5rem)]">
        <EditorStats
          words={props.words}
          chars={props.chars}
          paragraphs={props.paragraphs}
          readingMinutes={props.readingMinutes}
        />

        <main class="flex-1 px-8 py-6">
          <div
            class="mx-auto flex h-full max-w-3xl flex-col rounded-2xl border border-[rgb(var(--forge-steel))/0.35]
                   bg-[rgb(var(--bg))]/0.98 shadow-af-soft"
          >
            {/* Title + autosave */}
            <div class="border-b border-[rgb(var(--forge-steel))/0.25] px-5 py-3 text-xs">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <div class="text-[0.7rem] uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))]/80">
                    Scene
                  </div>
                  <div class="text-sm font-medium">{props.activeTitle}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] text-emerald-400">
                    Autosaving
                  </span>
                </div>
              </div>
            </div>

            {/* Main text area */}
            <div class="flex-1 overflow-y-auto px-6 py-4">
              <textarea
                class="h-full w-full resize-none border-none bg-transparent
                       text-sm leading-relaxed outline-none placeholder:text-[rgb(var(--muted))]"
                placeholder="Write with just the essentials visible. The AI helper on the right will respond based on this scene, your arcs, and your lore."
                value={props.draft}
                onInput={(e) => props.onDraftChange(e.currentTarget.value)}
              />
            </div>

            <div class="flex items-center justify-between border-t border-[rgb(var(--forge-steel))/0.25] px-5 py-2 text-[0.7rem] text-[rgb(var(--muted))]">
              <span>Ln 1, Col 1</span>
              <span>{props.words} words • Draft v0</span>
            </div>
          </div>
        </main>

        <AiAssistPanel draft={props.draft} activeTitle={props.activeTitle} />
      </div>
    </div>
  );
};

export default FocusOverlay;
