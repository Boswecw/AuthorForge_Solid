import { createSignal, For, Show } from "solid-js";
import ForgeShell from "~/components/ForgeShell";

type Project = {
  id: string;
  name: string;
  genres: string[];
  updatedAt: string;
  stats?: { chapters: number; tokens: number; indexed: boolean };
};

const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Faith in a FireStorm",
    genres: ["Christian Fiction"],
    updatedAt: "2025-11-10",
    stats: { chapters: 24, tokens: 82000, indexed: true },
  },
  {
    id: "p2",
    name: "Heart of the Storm",
    genres: ["Fantasy"],
    updatedAt: "2025-11-09",
    stats: { chapters: 11, tokens: 34000, indexed: false },
  },
];

export default function Foundry() {
  // Tabs: ingest | overview
  const [tab, setTab] = createSignal<"ingest" | "overview">("ingest");

  // Drag-drop state
  const [files, setFiles] = createSignal<File[]>([]);
  const [stage, setStage] = createSignal<"idle" | "parsing" | "indexing" | "ready">("idle");

  // Right rail content (context/help)
  const Right = (
    <div class="space-y-4">
      <section>
        <h4 class="font-semibold mb-1">Foundry flow</h4>
        <ol class="ml-5 list-decimal space-y-1 text-[0.925rem] opacity-90">
          <li>Drop DOCX/MD/PDF.</li>
          <li>Parse to chapters/sections.</li>
          <li>Build embeddings & index.</li>
          <li>Open in Smithy to write.</li>
        </ol>
      </section>
      <section>
        <h4 class="font-semibold mb-1">Tips</h4>
        <ul class="ml-5 list-disc space-y-1 text-[0.925rem] opacity-90">
          <li>Use headings (H1/H2) in MD to improve chunking.</li>
          <li>Keep PDFs text-based (no images-only scans).</li>
          <li>Re-index after big structural changes.</li>
        </ul>
      </section>
    </div>
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer?.files ?? []);
    if (dropped.length) {
      setFiles(dropped);
      setStage("parsing");
      setTimeout(() => setStage("indexing"), 600);
      setTimeout(() => setStage("ready"), 1600);
    }
  };

  const onBrowse = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const selected = Array.from(input.files ?? []);
    if (selected.length) {
      setFiles(selected);
      setStage("parsing");
      setTimeout(() => setStage("indexing"), 600);
      setTimeout(() => setStage("ready"), 1600);
    }
  };

  return (
    <ForgeShell title="Foundry" rightPanel={Right}>
      <header class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="font-display text-2xl tracking-wide">The Foundry</h1>
          <p class="text-sm opacity-80">Create projects, import manuscripts, and build your index.</p>
        </div>
        <div class="flex gap-2">
          <button
            class="rounded-md border border-[rgb(var(--forge-steel))/0.3] px-4 py-2 text-sm hover:bg-white/5"
            onClick={() => alert("New Project (modal placeholder)")}
          >
            New Project
          </button>
          <a
            href="/smithy"
            class="rounded-md border px-4 py-2 text-sm bg-gradient-to-b from-[rgb(var(--forge-ember))]/20 to-transparent shadow-ember"
          >
            Open Smithy
          </a>
        </div>
      </header>

      <div class="mb-4 flex items-center gap-2">
        <TabButton active={tab() === "ingest"} onClick={() => setTab("ingest")}>
          Ingest
        </TabButton>
        <TabButton active={tab() === "overview"} onClick={() => setTab("overview")}>
          Overview
        </TabButton>
      </div>

      <Show when={tab() === "ingest"}>
        <section
          class="rounded-xl2 border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 p-5
                 shadow-card"
        >
          <h2 class="text-lg font-semibold mb-2">Import files</h2>
          <p class="text-sm opacity-80 mb-4">Drop DOCX, MD, or PDF. We'll parse into chapters and index them.</p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop as any}
            class="group grid place-items-center rounded-xl2 border-2 border-dashed
                   border-[rgb(var(--forge-steel))/0.35] p-10 text-center
                   hover:border-[rgb(var(--forge-brass))]/45"
            aria-label="File dropzone"
          >
            <div>
              <div class="mb-2 text-sm opacity-80">
                Drag & drop files here or
              </div>
              <label class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-white/5">
                <input type="file" multiple class="hidden" onChange={onBrowse} />
                Browse…
              </label>
            </div>
          </div>
        </section>
      </Show>

      <Show when={tab() === "overview"}>
        <section class="rounded-xl2 border border-[rgb(var(--forge-steel))/0.3] p-5 bg-white/60 dark:bg-white/5 shadow-card">
          <h2 class="text-lg font-semibold mb-4">Projects</h2>
          <div class="grid grid-cols-2 gap-4">
            <For each={mockProjects}>
              {(p) => (
                <article class="rounded-xl2 border border-[rgb(var(--forge-steel))/0.25] p-4 hover:bg-white/5">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold">{p.name}</h3>
                    <span class="text-xs opacity-70">Updated {p.updatedAt}</span>
                  </div>
                  <p class="text-xs mt-1 opacity-80">{p.genres.join(", ")}</p>
                </article>
              )}
            </For>
          </div>
        </section>
      </Show>
    </ForgeShell>
  );
}

function TabButton(props: { active: boolean; onClick?: () => void; children: any }) {
  return (
    <button
      onClick={props.onClick}
      class={
        props.active
          ? "rounded-md px-3 py-2 text-sm border border-white/10 bg-gradient-to-b from-[rgb(var(--forge-ember))]/25 to-transparent shadow-ember"
          : "rounded-md px-3 py-2 text-sm border border-transparent hover:border-[rgb(var(--forge-brass))]/30 hover:bg-white/5"
      }
      aria-pressed={props.active}
    >
      {props.children}
    </button>
  );
}

