// src/routes/lore/index.tsx
import { createMemo, createSignal, For, Show, onMount } from "solid-js";
import ForgeShell from "~/components/ForgeShell";
import LoreGraph from "~/components/LoreGraph";
import { kindTheme } from "~/lib/lore/colors";

type EntityHit = {
  kind: string;
  span: { text: string; start: number; end: number };
  score: number;
  link?: { id?: string; slug?: string; name: string; kind: string } | null;
};

// ---- Mock Tauri invoke (replace with real commands later) ----
const invoke = async (cmd: string, args: any) => {
  console.log("Mock invoke:", cmd, args);
  if (cmd === "wb_get_entity") {
    const mock: Record<string, any> = {
      "queen-amicae": {
        name: "Queen Amicae",
        kind: "Person",
        slug: "queen-amicae",
        summary: "The wise and powerful ruler of the northern kingdoms.",
      },
      "storm-coast": {
        name: "Storm Coast",
        kind: "Place",
        slug: "storm-coast",
        summary: "A treacherous coastline known for violent storms and shipwrecks.",
      },
      "mind-reaver": {
        name: "Mind Reaver",
        kind: "Creature",
        slug: "mind-reaver",
        summary: "An ancient creature that feeds on thoughts and memories.",
      },
      "tempest-canticle": {
        name: "Tempest Canticle",
        kind: "Magic",
        slug: "tempest-canticle",
        summary: "A powerful spell that summons storms and lightning.",
      },
      scorchblade: {
        name: "Scorchblade",
        kind: "Item",
        slug: "scorchblade",
        summary: "A legendary sword that burns with eternal flame.",
      },
    };
    return mock[args.slug] || null;
  }
  // default: mock parse
  return {
    hits: [
      {
        kind: "Person",
        span: { text: "Queen Amicae", start: 0, end: 12 },
        score: 0.95,
        link: { slug: "queen-amicae", name: "Queen Amicae", kind: "Person" },
      },
      {
        kind: "Place",
        span: { text: "Storm Coast", start: 24, end: 35 },
        score: 0.9,
        link: { slug: "storm-coast", name: "Storm Coast", kind: "Place" },
      },
      {
        kind: "Creature",
        span: { text: "Mind Reaver", start: 43, end: 54 },
        score: 0.88,
        link: { slug: "mind-reaver", name: "Mind Reaver", kind: "Creature" },
      },
      {
        kind: "Magic",
        span: { text: "Tempest Canticle", start: 78, end: 94 },
        score: 0.85,
        link: { slug: "tempest-canticle", name: "Tempest Canticle", kind: "Magic" },
      },
      {
        kind: "Item",
        span: { text: "Scorchblade", start: 110, end: 121 },
        score: 0.92,
        link: { slug: "scorchblade", name: "Scorchblade", kind: "Item" },
      },
    ],
  };
};

// ---- Entity Detail View ----
function EntityView(props: { slug: string; onBack: () => void }) {
  const [rec, setRec] = createSignal<any>(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const entity = await invoke("wb_get_entity", { projectId: null, slug: props.slug });
      setRec(entity);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="p-6">
      <button
        onClick={props.onBack}
        class="mb-4 px-3 py-1.5 rounded border border-[rgb(var(--forge-brass))]/20 hover:border-[rgb(var(--forge-brass))]"
      >
        ← Back to Lore
      </button>
      <Show when={!loading()} fallback={<p>Loading…</p>}>
        <Show when={rec()} fallback={<p>Not found.</p>}>
          {(r) => {
            const theme = kindTheme(r().kind);
            return (
              <>
                <div class={`inline-block px-2 py-1 rounded text-xs mb-2 ${theme.badge}`}>
                  {theme.icon} {r().kind}
                </div>
                <h1 class="text-3xl font-display mb-1">{r().name}</h1>
                <div class="text-sm opacity-70 mb-4">{r().slug}</div>
                {r().summary && <p class="mt-2 leading-7 text-lg">{r().summary}</p>}
              </>
            );
          }}
        </Show>
      </Show>
    </div>
  );
}

// ---- Main Page ----
export default function LorePage() {
  const [text, setText] = createSignal(
    "Queen Amicae stood at the Storm Coast as the Mind Reaver stirred. She whispered the Tempest Canticle and raised the Scorchblade."
  );
  const [hits, setHits] = createSignal<EntityHit[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [filter, setFilter] = createSignal("All");
  const [selected, setSelected] = createSignal<EntityHit | null>(null);
  const [activeTab, setActiveTab] = createSignal<"results" | "graph" | "yaml">("results");
  const [viewingEntity, setViewingEntity] = createSignal<string | null>(null);

  async function parseLore() {
    setLoading(true);
    setError(null);
    try {
      const res = await invoke("wb_parse_lore", {
        req: { text: text(), fuzzy: true },
      });
      setHits(res.hits || []);
      setSelected(null);
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }

  const kindCounts = createMemo(() => {
    const m = new Map<string, number>();
    for (const h of hits()) m.set(h.kind, (m.get(h.kind) || 0) + 1);
    return m;
  });

  const filteredHits = createMemo(() =>
    filter() === "All" ? hits() : hits().filter((h) => h.kind === filter())
  );

  const yamlSnippet = () => {
    const h = selected();
    if (!h) return "# Select an entity to edit its YAML entry";
    const key = h.span.text.replace(/\s+/g, " ");
    return `# Lore entry (edit and Save → TODO: wire to backend)
${h.kind}:
  - name: ${key}
    slug: ${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
    summary: ''
    aliases: []`;
  };

  function viewEntity(hit: EntityHit) {
    if (hit.link?.slug) setViewingEntity(hit.link.slug);
  }

  // If user opened an entity detail, show it inside ForgeShell too.
  if (viewingEntity()) {
    return (
      <ForgeShell title="Lore">
        <EntityView slug={viewingEntity()!} onBack={() => setViewingEntity(null)} />
      </ForgeShell>
    );
  }

  // ---- Right Panel (filters + tips + selected quick view) ----
  const RightPanel = (
    <div class="space-y-5 text-sm">
      <section>
        <h4 class="font-semibold mb-1">Filters</h4>
        <ul class="space-y-1">
          <li>
            <button
              class={`hover:text-[rgb(var(--forge-brass))] ${filter() === "All" ? "font-semibold" : ""}`}
              onClick={() => setFilter("All")}
            >
              All <span class="opacity-60">({hits().length})</span>
            </button>
          </li>
          <For each={[...kindCounts().keys()].sort()}>
            {(k) => (
              <li>
                <button
                  class={`hover:text-[rgb(var(--forge-brass))] ${filter() === k ? "font-semibold" : ""}`}
                  onClick={() => setFilter(k)}
                >
                  {k} <span class="opacity-60">({kindCounts().get(k)})</span>
                </button>
              </li>
            )}
          </For>
        </ul>
        <div class="mt-3">
          <button
            class="w-full rounded-md border border-[rgb(var(--forge-steel))/0.3] px-3 py-2 hover:bg-white/5 disabled:opacity-60"
            onClick={parseLore}
            disabled={loading()}
          >
            {loading() ? "Parsing…" : "Parse Lore"}
          </button>
        </div>
      </section>

      <section>
        <h4 class="font-semibold mb-1">Tips</h4>
        <ul class="list-disc ml-5 space-y-1 opacity-90">
          <li>Use consistent names to boost linking.</li>
          <li>Prefer MD headings for clean chunking.</li>
          <li>Link entities to chapters from Smithy.</li>
        </ul>
      </section>

      <Show when={selected()}>
        {(h) => {
          const theme = kindTheme(h().kind);
          return (
            <section>
              <h4 class="font-semibold mb-1">Selected</h4>
              <div class="rounded-md border border-[rgb(var(--forge-steel))/0.3] p-3">
                <div class={`inline-block px-2 py-1 rounded text-xs mb-2 ${theme.badge}`}>
                  {theme.icon} {h().kind}
                </div>
                <div class="font-semibold">{h().span.text}</div>
                <div class="text-xs opacity-70">[{h().span.start}–{h().span.end}]</div>
                <div class="text-xs opacity-70">Score {(h().score * 100).toFixed(0)}%</div>
                <Show when={h().link?.slug}>
                  <button
                    class="mt-2 px-2 py-1 text-xs rounded bg-[rgb(var(--forge-ember))]/20 hover:bg-[rgb(var(--forge-ember))]/30"
                    onClick={() => viewEntity(h())}
                  >
                    View Details →
                  </button>
                </Show>
              </div>
            </section>
          );
        }}
      </Show>
    </div>
  );

  // ---- Main content (editor + tabs + results/graph/yaml) ----
  return (
    <ForgeShell title="Lore" rightPanel={RightPanel}>
      {/* Input row */}
      <div class="border rounded-xl2 border-[rgb(var(--forge-steel))/0.3] bg-[rgb(var(--bg))]/0.8 shadow-card p-3 mb-4">
        <div class="flex items-center gap-3">
          <textarea
            value={text()}
            onInput={(e) => setText(e.currentTarget.value)}
            class="flex-1 h-24 p-3 rounded border border-[rgb(var(--forge-steel))/0.25] bg-transparent focus:outline-none"
            placeholder="Paste your lore snippet or chapter…"
          />
          <button
            class="rounded-md border px-3 py-2 text-sm bg-gradient-to-b from-[rgb(var(--forge-ember))]/20 to-transparent shadow-ember disabled:opacity-60"
            onClick={parseLore}
            disabled={loading()}
          >
            {loading() ? "Parsing…" : "Run"}
          </button>
        </div>
        <Show when={error()}><p class="text-red-500 mt-2 text-sm">{error()}</p></Show>
      </div>

      {/* Tabs */}
      <div class="px-1 pt-1 flex items-center gap-3 text-sm mb-2">
        <TabBtn active={activeTab() === "results"} onClick={() => setActiveTab("results")}>Results</TabBtn>
        <TabBtn active={activeTab() === "graph"} onClick={() => setActiveTab("graph")}>Graph</TabBtn>
        <TabBtn active={activeTab() === "yaml"} onClick={() => setActiveTab("yaml")}>YAML Editor</TabBtn>
      </div>

      <div class="rounded-xl2 border border-[rgb(var(--forge-steel))/0.3] bg-[rgb(var(--bg))]/0.8 shadow-card min-h-[24rem]">
        <Show when={activeTab() === "results"}>
          <div class="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
            <For each={filteredHits()}>
              {(hit) => {
                const theme = kindTheme(hit.kind);
                return (
                  <div class={`w-full p-2 rounded border border-[rgb(var(--forge-steel))]/25 ${theme.bg}`}>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class={`px-2 py-0.5 rounded text-xs ${theme.badge}`}>{theme.icon} {hit.kind}</span>
                        <span class="font-semibold">{hit.span.text}</span>
                        <span class="ml-2 text-xs opacity-60">[{hit.span.start}–{hit.span.end}]</span>
                      </div>
                      <span class="text-xs opacity-70">{(hit.score * 100).toFixed(0)}%</span>
                    </div>
                    <div class="mt-2 flex gap-2">
                      <button
                        onClick={() => setSelected(hit)}
                        class="px-2 py-1 text-xs rounded border border-[rgb(var(--forge-steel))/0.3] hover:bg-white/5"
                        title="Select for YAML editing"
                      >
                        Select
                      </button>
                      <Show when={hit.link?.slug}>
                        <button
                          onClick={() => viewEntity(hit)}
                          class="px-2 py-1 text-xs rounded bg-[rgb(var(--forge-ember))]/20 hover:bg-[rgb(var(--forge-ember))]/30"
                          title="View entity details"
                        >
                          View Details →
                        </button>
                      </Show>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>

        <Show when={activeTab() === "graph"}>
          <div class="h-[60vh] p-3">
            <LoreGraph text={text()} hits={hits() as any} />
          </div>
        </Show>

        <Show when={activeTab() === "yaml"}>
          <div class="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="flex flex-col">
              <h3 class="font-semibold mb-2">YAML Entry</h3>
              <textarea
                value={yamlSnippet()}
                class="flex-1 min-h-[300px] p-3 bg-transparent border border-[rgb(var(--forge-steel))/0.25] rounded font-mono text-sm"
              />
              <div class="mt-2">
                <button class="px-3 py-1.5 rounded border border-[rgb(var(--forge-steel))/0.3] hover:bg-white/5" disabled>
                  Save (wire to backend)
                </button>
              </div>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Selected Entity</h3>
              <div class="p-3 rounded border border-[rgb(var(--forge-steel))/0.25] min-h-[200px]">
                <Show when={selected()} fallback={<p class="opacity-70 text-sm">Select an entity from Results to edit.</p>}>
                  {(h) => (
                    <div class="space-y-2 text-sm">
                      <div class="opacity-70">Kind</div>
                      <div class="text-base">{h().kind}</div>
                      <div class="opacity-70">Name</div>
                      <div class="text-lg font-semibold">{h().span.text}</div>
                      <div class="opacity-70">Offsets</div>
                      <div>[{h().span.start}–{h().span.end}]</div>
                      <div class="opacity-70">Score</div>
                      <div>{(h().score * 100).toFixed(0)}%</div>
                    </div>
                  )}
                </Show>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </ForgeShell>
  );
}

// ---- UI bits ----
function TabBtn(props: { active: boolean; onClick: () => void; children: any }) {
  return (
    <button
      onClick={props.onClick}
      class={
        props.active
          ? "border-b border-[rgb(var(--forge-brass))] text-[rgb(var(--forge-brass))]"
          : "opacity-70 hover:opacity-100"
      }
    >
      {props.children}
    </button>
  );
}
