// src/routes/smithy/index.tsx
import { A } from "@solidjs/router";
import {
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import ForgeShell from "~/components/ForgeShell";
import TipTapEditor from "~/components/editor/TipTapEditor";

type Chapter = { id: string; title: string; words: number };

const mockChapters: Chapter[] = [
  { id: "ch-01", title: "Prologue — Coals at Dawn", words: 1240 },
  { id: "ch-02", title: "Crosswind", words: 2120 },
  { id: "ch-03", title: "The Ember’s Vow", words: 1680 },
];

export default function Smithy() {
  // UI state
  const [focusMode, setFocusMode] = createSignal(false);
  const [activeId, setActiveId] = createSignal<Chapter["id"]>(mockChapters[0].id);
  const activeChapter = createMemo(
    () => mockChapters.find((c) => c.id === activeId())!
  );

  // Content state (HTML string for now; persisted via Tauri later)
  const [html, setHtml] = createSignal<string>(
    initialHtml(activeChapter().title)
  );

  // Derived stats
  const words = createMemo(() => countWords(html()));
  const readingTime = createMemo(() => Math.max(1, Math.round(words() / 225)));

  // Keyboard: F toggles Focus Mode
  const handleKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      setFocusMode((v) => !v);
    }
  };
  onMount(() => window.addEventListener("keydown", handleKey));
  onCleanup(() => window.removeEventListener("keydown", handleKey));

  // Right rail content (useful today; AI can hook in later)
  const RightPanel = (
    <div class="space-y-5 text-sm">
      <section>
        <h4 class="font-semibold mb-1">Chapter</h4>
        <div class="rounded-md border border-[rgb(var(--forge-steel))/0.3] p-3">
          <div class="flex items-center justify-between">
            <span class="font-medium">{activeChapter().title}</span>
            <span class="opacity-70">{words()} words</span>
          </div>
          <div class="mt-1 text-xs opacity-80">{readingTime()} min read</div>
        </div>
      </section>

      <section>
        <h4 class="font-semibold mb-1">Notes</h4>
        <ul class="rounded-md border border-[rgb(var(--forge-steel))/0.25] divide-y divide-[rgb(var(--forge-steel))/0.2]">
          <li class="px-3 py-2">Scene goal: establish motive without naming it.</li>
          <li class="px-3 py-2">Keep tense in past; POV = Rawn only.</li>
        </ul>
      </section>

      <section>
        <h4 class="font-semibold mb-1">References</h4>
        <div class="rounded-md border border-[rgb(var(--forge-steel))/0.3] p-3 space-y-2">
          <RefItem label="Character" value="Rawn Mortisimus — internal conflict escalates" />
          <RefItem label="Location" value="Storm Coast — night, wind ≥ 20 mph" />
          <RefItem label="Canon" value="No healing spells; storm magic only" />
        </div>
      </section>
    </div>
  );

  return (
    <ForgeShell title="The Smithy" rightPanel={focusMode() ? undefined : RightPanel}>
      {/* Header */}
      <header class="mb-4 flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl tracking-wide">The Smithy</h1>
          <p class="text-sm opacity-80">Quiet space to draft and revise.</p>
        </div>
        <div class="flex items-center gap-2">
          <A
            href={`/foundry?project=p1`}
            class="rounded-md border border-[rgb(var(--forge-steel))/0.3] px-3 py-2 text-sm hover:bg-white/5"
          >
            Back to Foundry
          </A>
          <button
            class="rounded-md border px-3 py-2 text-sm bg-gradient-to-b from-[rgb(var(--forge-ember))]/25 to-transparent shadow-ember"
            onClick={() => setFocusMode(!focusMode())}
            aria-pressed={focusMode()}
            title="Toggle Focus Mode (F)"
          >
            {focusMode() ? "Exit Focus" : "Focus Mode"}
          </button>
        </div>
      </header>

      <div class={`grid gap-4 ${focusMode() ? "grid-cols-1" : "grid-cols-[18rem,1fr]"}`}>
        {/* Left: Chapter navigator (hidden in Focus Mode) */}
        <Show when={!focusMode()}>
          <nav
            class="rounded-xl2 border border-[rgb(var(--forge-steel))/0.3] bg-[rgb(var(--bg))]/0.8 shadow-card p-3 h-[calc(100vh-12rem)] overflow-auto"
            aria-label="Chapters"
          >
            <div class="mb-2 text-xs uppercase tracking-wide opacity-70">Chapters</div>
            <ul class="space-y-1">
              <For each={mockChapters}>
                {(c) => (
                  <li>
                    <button
                      class={
                        c.id === activeId()
                          ? "w-full text-left px-3 py-2 rounded-md bg-gradient-to-b from-[rgb(var(--forge-ember))]/20 to-transparent shadow-ember"
                          : "w-full text-left px-3 py-2 rounded-md hover:bg-white/5"
                      }
                      onClick={() => {
                        setActiveId(c.id);
                        setHtml(initialHtml(c.title));
                      }}
                      aria-current={c.id === activeId() ? "true" : undefined}
                    >
                      <div class="flex items-center justify-between">
                        <span class="truncate">{c.title}</span>
                        <span class="text-xs opacity-70">{c.words} w</span>
                      </div>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </nav>
        </Show>

        {/* Center: TipTap editor */}
        <section
          class="rounded-xl2 border border-[rgb(var(--forge-steel))/0.3] bg-[rgb(var(--bg))]/0.9 shadow-card"
          aria-label="Editor"
        >
          {/* Minimal toolbar (TipTap commands live in SmithyEditor) */}
          <div class="flex items-center gap-2 border-b border-[rgb(var(--forge-steel))/0.25] p-2 text-xs">
            <span class="opacity-70">Word count: {words()} • {readingTime()} min</span>
            <span class="ml-auto opacity-60">Press <kbd class="px-1 border rounded">F</kbd> for Focus</span>
          </div>

          <TipTapEditor
            value={html()}
            onChange={(next: string) => {
              setHtml(next);
              // TODO: persist via Tauri invoke
              // await invoke("wb_save_chapter", { projectId, chapterId: activeId(), html: next });
            }}
          />
        </section>
      </div>
    </ForgeShell>
  );
}

/* ————— helpers ————— */

function RefItem(props: { label: string; value: string }) {
  return (
    <div class="flex items-start gap-2">
      <span class="text-[10px] px-1 py-[2px] rounded border border-[rgb(var(--forge-steel))/0.3]">
        {props.label}
      </span>
      <span>{props.value}</span>
    </div>
  );
}

function countWords(s: string) {
  return (s.replace(/<[^>]+>/g, " ").trim().match(/\b\w+\b/g) || []).length;
}

function initialHtml(title: string) {
  return `<h2>${escapeHtml(title)}</h2><p>[Write here…]</p>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!));
}
