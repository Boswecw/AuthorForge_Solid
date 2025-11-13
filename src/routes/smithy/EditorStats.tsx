// src/routes/smithy/EditorStats.tsx
import type { Component } from "solid-js";

interface EditorStatsProps {
  words: number;
  chars: number;
  paragraphs: number;
  readingMinutes: number;
}

const EditorStats: Component<EditorStatsProps> = (props) => {
  return (
    <aside class="w-64 border-r border-[rgb(var(--forge-steel))/0.35] bg-[rgb(var(--bg))]/0.98 px-4 py-4 text-xs">
      <h2 class="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))]">
        Stats
      </h2>
      <div class="mt-3 space-y-2">
        <div class="flex items-center justify-between">
          <span>Words</span>
          <span class="font-mono text-[0.8rem]">{props.words}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Characters</span>
          <span class="font-mono text-[0.8rem]">{props.chars}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Paragraphs</span>
          <span class="font-mono text-[0.8rem]">{props.paragraphs}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Read time</span>
          <span class="font-mono text-[0.8rem]">{props.readingMinutes} min</span>
        </div>
      </div>

      <div class="mt-4 border-t border-[rgb(var(--forge-steel))/0.3] pt-3 space-y-2">
        <p class="text-[0.7rem] text-[rgb(var(--muted))]">
          Focus mode will eventually sync with Anvil/Bloom to show pacing,
          POV balance, and scene length targets.
        </p>
      </div>
    </aside>
  );
};

export default EditorStats;
