import { createSignal, For, Show } from "solid-js";
import ForgeShell from "~/components/ForgeShell";

type Arc = {
  id: string;
  name: string;
  color: string;
  beats: { id: string; title: string; summary: string; chapter?: string }[];
};

const mockArcs: Arc[] = [
  {
    id: "arc-1",
    name: "Faith and Fire",
    color: "forge-ember",
    beats: [
      { id: "b1", title: "Inciting Incident", summary: "Rawn is forced into exile." },
      { id: "b2", title: "First Challenge", summary: "Storm magic emerges uncontrollably." },
      { id: "b3", title: "Crisis of Faith", summary: "Rawn questions his purpose." },
    ],
  },
  {
    id: "arc-2",
    name: "Amicae’s Path",
    color: "forge-brass",
    beats: [
      { id: "b4", title: "Betrayal Revealed", summary: "Her clan aligns with the Ithek." },
      { id: "b5", title: "Forbidden Alliance", summary: "She aids Rawn despite taboo." },
    ],
  },
];

export default function Anvil() {
  const [selectedArc, setSelectedArc] = createSignal<Arc | null>(null);
  const [zoom, setZoom] = createSignal(1);

  const RightPanel = (
    <div class="space-y-5 text-sm">
      <section>
        <h4 class="font-semibold mb-1">The Anvil</h4>
        <p class="opacity-80">
          Visualize story arcs, connect chapters, and ensure emotional pacing. Each beat
          represents a pivotal scene or turning point.
        </p>
      </section>
      <Show when={selectedArc()}>
        {(arc) => (
          <section>
            <h4 class="font-semibold mb-1">Selected Arc</h4>
            <div class="rounded-md border border-[rgb(var(--forge-steel))/0.3] p-3">
              <div class="font-medium mb-1">{arc().name}</div>
              <ul class="text-xs list-disc ml-5 space-y-1">
                <For each={arc().beats}>
                  {(b) => <li>{b.title}</li>}
                </For>
              </ul>
            </div>
          </section>
        )}
      </Show>
      <section>
        <h4 class="font-semibold mb-1">Legend</h4>
        <ul class="space-y-1 text-xs opacity-80">
          <li><span class="text-[rgb(var(--forge-ember))]">●</span> Main conflict arc</li>
          <li><span class="text-[rgb(var(--forge-brass))]">●</span> Character arc</li>
        </ul>
      </section>
    </div>
  );

  return (
    <ForgeShell title="The Anvil" rightPanel={RightPanel}>
      {/* Header */}
      <header class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl tracking-wide">The Anvil</h1>
          <p class="text-sm opacity-80">
            Visualize arcs and structure your story.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-md border border-[rgb(var(--forge-steel))/0.3] px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
          >
            −
          </button>
          <button
            class="rounded-md border border-[rgb(var(--forge-steel))/0.3] px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
          >
            ＋
          </button>
        </div>
      </header>

      {/* Arc timeline */}
      <section class="rounded-xl2 border border-[rgb(var(--forge-steel))/0.3] bg-[rgb(var(--bg))]/0.9 shadow-card p-5 overflow-auto">
        <div
          class="relative"
          style={{
            transform: `scale(${zoom()})`,
            "transform-origin": "top left",
            transition: "transform 0.2s ease",
          }}
        >
          <For each={mockArcs}>
            {(arc) => (
              <div
                class="mb-8"
                onClick={() => setSelectedArc(arc)}
                classList={{
                  "cursor-pointer": true,
                  "opacity-100": selectedArc()?.id === arc.id,
                  "opacity-70 hover:opacity-100": selectedArc()?.id !== arc.id,
                }}
              >
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class={`h-3 w-3 rounded-full bg-[rgb(var(--${arc.color}))]`}
                  />
                  <h2 class="font-semibold tracking-wide">{arc.name}</h2>
                </div>

                {/* Beats timeline */}
                <div class="relative pl-6">
                  <div class="absolute left-1.5 top-1 bottom-0 w-px bg-[rgb(var(--forge-steel))/0.3]" />
                  <ul class="space-y-4">
                    <For each={arc.beats}>
                      {(b) => (
                        <li>
                          <div
                            class="ml-3 pl-4 border-l-4 rounded-l-md
                                   border-[rgb(var(--forge-brass))]/50
                                   hover:bg-[rgb(var(--forge-ash))]/20 p-2
                                   transition-colors duration-100"
                          >
                            <div class="font-medium text-sm">{b.title}</div>
                            <p class="text-xs opacity-80">{b.summary}</p>
                            <Show when={b.chapter}>
                              <p class="text-[10px] opacity-70 mt-1">
                                Linked to: {b.chapter}
                              </p>
                            </Show>
                          </div>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            )}
          </For>
        </div>
      </section>
    </ForgeShell>
  );
}

/* Utility: you can extract this into a future component if you like */
