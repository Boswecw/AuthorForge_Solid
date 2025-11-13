// src/routes/smithy/AiAssistPanel.tsx
import type { Component } from "solid-js";

interface AiAssistPanelProps {
  draft: string;
  activeTitle: string;
}

const AiAssistPanel: Component<AiAssistPanelProps> = (props) => {
  return (
    <aside class="w-80 border-l border-[rgb(var(--forge-steel))/0.35] bg-[rgb(var(--bg))]/0.98 px-4 py-4 text-xs">
      <h2 class="text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))]">
        AI Assistant
      </h2>

      <div class="mt-3 space-y-3">
        <p class="text-[0.7rem] text-[rgb(var(--muted))]">
          This is where the Smithy focus AI will live: grounded in your Anvil
          arcs, Lore, and project settings. It’ll suggest up to ~600 chars
          at a time that you can choose to insert or tweak.
        </p>

        <button
          type="button"
          class="w-full rounded-md border border-[rgb(var(--forge-steel))/0.35] px-3 py-2 text-[0.75rem] hover:bg-white/5"
          onClick={() => {
            console.log("TODO: call AI suggestion endpoint with current draft + context", {
              title: props.activeTitle,
              draft: props.draft,
            });
          }}
        >
          Ask for next beat
        </button>

        <div class="space-y-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] bg-black/10 px-3 py-2">
          <p class="text-[0.7rem] text-[rgb(var(--muted))]">
            Suggested continuation (preview area).
          </p>
          <p class="text-[0.75rem] text-[rgb(var(--fg))]/90">
            When the AI is wired in, you’ll see a 1–3 paragraph suggestion
            here, with options to &quot;Insert into draft&quot; or &quot;Try again&quot;.
          </p>
        </div>

        <div class="space-y-1">
          <label class="text-[0.7rem] font-medium text-[rgb(var(--muted))]">
            Guidance for the AI
          </label>
          <textarea
            class="h-20 w-full resize-none rounded-md border border-[rgb(var(--forge-steel))/0.3] bg-transparent p-2 text-[0.75rem] outline-none placeholder:text-[rgb(var(--muted))]"
            placeholder="Optional: tell the AI what you want next (tone, pacing, what must / must not happen)..."
          />
        </div>
      </div>
    </aside>
  );
};

export default AiAssistPanel;
