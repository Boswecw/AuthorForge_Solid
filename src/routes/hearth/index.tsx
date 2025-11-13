import { A } from "@solidjs/router";
import ForgeShell from "~/components/ForgeShell";
import { FontSizeControl } from "./FontSizeControl";

const recentProjects = [
  { id: "p1", name: "Faith in a FireStorm", progress: 0.62, updatedAt: "2025-11-10" },
  { id: "p2", name: "Heart of the Storm", progress: 0.31, updatedAt: "2025-11-09" },
];

export default function Hearth() {
  const Right = (
    <div class="space-y-4">
      <section>
        <h4 class="font-semibold mb-1">Tips</h4>
        <ul class="list-disc ml-5 space-y-1 text-neutral-600 dark:text-neutral-400">
          <li>Press <kbd class="px-1 border rounded">F</kbd> to toggle Focus Mode in Smithy.</li>
          <li>Drag files into Foundry to auto-parse chapters.</li>
          <li>Use the search bar to find lore while writing.</li>
        </ul>
      </section>
      <section>
        <h4 class="font-semibold mb-1">Shortcuts</h4>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="rounded-lg border p-2">New Project <span class="float-right">Ctrl+N</span></div>
          <div class="rounded-lg border p-2">Search <span class="float-right">Ctrl+/</span></div>
          <div class="rounded-lg border p-2">Open Smithy <span class="float-right">Ctrl+1</span></div>
          <div class="rounded-lg border p-2">Open Lore <span class="float-right">Ctrl+4</span></div>
        </div>
      </section>
    </div>
  );

  return (
    <ForgeShell title="Hearth" rightPanel={Right}>
      <div class="mx-auto max-w-6xl">
        {/* Welcome Header with Font Size Control */}
        <header class="mb-6 flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-display font-semibold text-[rgb(var(--fg))]">
              Welcome back to the Hearth
            </h1>
            <p class="text-sm text-[rgb(var(--fg))]/70 mt-1">
              Pick up where you left off, or jump into a new project.
            </p>
          </div>
          <div class="flex flex-col items-end gap-1.5">
            <FontSizeControl />
            <p class="text-xs text-[rgb(var(--fg))]/60 italic max-w-[16rem] text-right">
              Adjusts text size across all pages. Your preference is saved automatically.
            </p>
          </div>
        </header>

        {/* Continue Writing */}
        <section class="mb-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 p-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold">Continue writing</h2>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">“Chapter 7 — The Storm’s Return” in <span class="font-medium">Faith in a FireStorm</span></p>
            </div>
            <A href="/smithy?project=p1&chapter=7" class="rounded-xl px-4 py-2 border border-amber-300/60 hover:bg-amber-50 dark:hover:bg-amber-900/20">Open Smithy</A>
          </div>
        </section>

        {/* Quick Actions */}
        <section class="mb-8 grid grid-cols-3 gap-4">
          <A href="/foundry/new" class="rounded-2xl border p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 class="font-semibold">New Project</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Start fresh with title, genre, defaults.</p>
          </A>
          <A href="/foundry/import" class="rounded-2xl border p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 class="font-semibold">Import Files</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Drag in DOCX, MD, or PDF and parse.</p>
          </A>
          <A href="/foundry" class="rounded-2xl border p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <h3 class="font-semibold">Open Foundry</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Manage projects and indexing.</p>
          </A>
        </section>

        {/* Recent Projects */}
        <section class="mb-10">
          <h2 class="text-lg font-semibold mb-3">Recent Projects</h2>
          <div class="grid grid-cols-2 gap-4">
            {recentProjects.map((p) => (
              <A href={`/foundry?project=${p.id}`} class="rounded-2xl border p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium">{p.name}</h3>
                    <p class="text-xs text-neutral-600 dark:text-neutral-400">Last edited {p.updatedAt}</p>
                  </div>
                  <div class="w-28">
                    <div class="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-800">
                      <div class="h-2 rounded bg-amber-500" style={{ width: `${Math.round(p.progress * 100)}%` }} />
                    </div>
                    <div class="text-right text-xs mt-1">{Math.round(p.progress * 100)}%</div>
                  </div>
                </div>
              </A>
            ))}
          </div>
        </section>

        {/* Learning / Help */}
        <section class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl border p-4">
            <h3 class="font-semibold mb-1">Workflow: Draft → Revise → Validate</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Use Smithy for drafting, Anvil for structure, and Lore for canon checks.</p>
          </div>
          <div class="rounded-2xl border p-4">
            <h3 class="font-semibold mb-1">Customize your space</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Boundary lets you set providers, theme, and keyboard shortcuts.</p>
          </div>
        </section>
      </div>
    </ForgeShell>
  );
}