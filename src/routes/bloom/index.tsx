// src/routes/bloom/index.tsx
import { createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import ForgeShell from "~/components/ForgeShell";

import {
  Calendar,
  List,
  LayoutGrid,
  ChevronRight,
} from "lucide-solid";

// ---------------------------------------------
// Placeholder mock data (replace with DataForge later)
// ---------------------------------------------

type BloomBeat = {
  id: string;
  chapter: string;
  title: string;
  summary: string;
  date: string | null;
};

const MOCK_BEATS: BloomBeat[] = [
  {
    id: "1",
    chapter: "Chapter 1",
    title: "The Storm Breaks",
    summary:
      "Rawn faces the sudden resurgence of corrupted Essence near the Western Ridge.",
    date: "Year 142, Summer 4",
  },
  {
    id: "2",
    chapter: "Chapter 2",
    title: "Rowetha’s Escape",
    summary:
      "The young Tiefling flees the tainted village under the cloak of night.",
    date: "Year 142, Summer 6",
  },
  {
    id: "3",
    chapter: "Chapter 3",
    title: "Amicae’s Vow",
    summary:
      "Amicae swears vengeance as the Ithek corruption spreads across the Vale.",
    date: null,
  },
];

// ---------------------------------------------
// Component
// ---------------------------------------------

export default function BloomPage() {
  const [viewMode, setViewMode] = createSignal<"list" | "grid">("list");

  // Right panel with timeline filters and metadata
  const RightPanel = (
    <div class="space-y-4">
      <section>
        <h4 class="font-semibold mb-2 text-sm text-[rgb(var(--fg))]">Timeline View</h4>
        <p class="text-xs text-[rgb(var(--fg))]/70 mb-3">
          Visualize your story's narrative beats and plot progression.
        </p>
        <div class="space-y-2">
          <div class="rounded-lg border border-[rgb(var(--forge-steel))]/30 p-2 bg-[rgb(var(--bg))]/40">
            <div class="text-xs font-medium text-forge-ember">Total Beats</div>
            <div class="text-lg font-semibold">{MOCK_BEATS.length}</div>
          </div>
          <div class="rounded-lg border border-[rgb(var(--forge-steel))]/30 p-2 bg-[rgb(var(--bg))]/40">
            <div class="text-xs font-medium text-forge-brass">Chapters</div>
            <div class="text-lg font-semibold">3</div>
          </div>
        </div>
      </section>

      <section>
        <h4 class="font-semibold mb-2 text-sm text-[rgb(var(--fg))]">Quick Actions</h4>
        <div class="space-y-2">
          <button class="w-full text-left px-3 py-2 rounded-lg border border-[rgb(var(--forge-steel))]/30 hover:bg-white/5 transition text-sm">
            + Add New Beat
          </button>
          <button class="w-full text-left px-3 py-2 rounded-lg border border-[rgb(var(--forge-steel))]/30 hover:bg-white/5 transition text-sm">
            Export Timeline
          </button>
          <button class="w-full text-left px-3 py-2 rounded-lg border border-[rgb(var(--forge-steel))]/30 hover:bg-white/5 transition text-sm">
            View Analytics
          </button>
        </div>
      </section>

      <section>
        <h4 class="font-semibold mb-2 text-sm text-[rgb(var(--fg))]">Filters</h4>
        <div class="space-y-2 text-xs">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="rounded" checked={true} />
            <span>Show dated beats</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="rounded" checked={true} />
            <span>Show undated beats</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="rounded" checked={true} />
            <span>Group by chapter</span>
          </label>
        </div>
      </section>
    </div>
  );

  return (
    <ForgeShell title="Bloom" rightPanel={RightPanel}>
      <div class="px-8 py-6 max-w-screen-xl mx-auto">
        {/* Header */}
        <header class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-display tracking-wide text-forge-brass">
              The Bloom
            </h1>
            <p class="text-sm text-[rgb(var(--fg))]/70 mt-1">
              Visualize your story's timeline and narrative structure
            </p>
          </div>

          <div class="flex gap-3">
            <button
              class="px-3 py-2 rounded-lg border border-forge-ember/40 bg-surface-300 hover:bg-surface-200 transition flex items-center gap-2"
              aria-pressed={viewMode() === "list"}
              onClick={() => setViewMode("list")}
            >
              <List class="w-4 h-4" />
              <span class="text-sm">List</span>
            </button>

            <button
              class="px-3 py-2 rounded-lg border border-forge-ember/40 bg-surface-300 hover:bg-surface-200 transition flex items-center gap-2"
              aria-pressed={viewMode() === "grid"}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid class="w-4 h-4" />
              <span class="text-sm">Grid</span>
            </button>
          </div>
        </header>

        {/* Main Section */}
        <section>
          <Show
            when={viewMode() === "list"}
            fallback={<BloomGridView beats={MOCK_BEATS} />}
          >
            <BloomListView beats={MOCK_BEATS} />
          </Show>
        </section>
      </div>
    </ForgeShell>
  );
}

// -------------------------------------------------------
// List View Component
// -------------------------------------------------------

function BloomListView(props: { beats: BloomBeat[] }) {
  return (
    <div class="space-y-4">
      <For each={props.beats}>
        {(beat) => (
          <div class="bg-surface-200 border border-surface-400/30 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-lg font-display text-forge-brass flex items-center gap-2">
                  {beat.chapter}
                </h2>
                <h3 class="text-base font-semibold text-forge-gold mt-1">
                  {beat.title}
                </h3>

                <p class="text-sm text-foreground/80 mt-2 leading-snug">
                  {beat.summary}
                </p>

                <Show when={beat.date}>
                  <p class="text-xs mt-2 text-forge-ember flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {beat.date}
                  </p>
                </Show>
              </div>

              <A
                href={`/bloom/${beat.id}`}
                class="text-forge-ember hover:text-forge-gold transition p-1"
              >
                <ChevronRight class="w-5 h-5" />
              </A>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

// -------------------------------------------------------
// Grid View Component
// -------------------------------------------------------

function BloomGridView(props: { beats: BloomBeat[] }) {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <For each={props.beats}>
        {(beat) => (
          <A
            href={`/bloom/${beat.id}`}
            class="block bg-surface-200 border border-surface-400/30 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-surface-100 transition"
          >
            <h3 class="font-display text-lg text-forge-brass">
              {beat.chapter}
            </h3>
            <p class="font-semibold text-forge-gold mt-1">{beat.title}</p>

            <p class="text-sm text-foreground/80 mt-2 line-clamp-3">
              {beat.summary}
            </p>

            <Show when={beat.date}>
              <p class="text-xs mt-3 text-forge-ember flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                {beat.date}
              </p>
            </Show>
          </A>
        )}
      </For>
    </div>
  );
}
