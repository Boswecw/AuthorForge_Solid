/**
 * The Hearth - AuthorForge Dashboard
 * 
 * Main landing page for authors. Provides quick access to:
 * - Continue Writing (hero action)
 * - Recent projects
 * - Quick actions (New Project, Import, Foundry)
 * - Workflow guidance
 */

import { For } from "solid-js";
import { A } from "@solidjs/router";
import { Plus, Upload, FolderOpen, Flame, ArrowRight, Hammer, BookOpen, Sparkles, Settings, Palette } from "lucide-solid";
import ForgeShell from "~/components/ForgeShell";
import { FontSizeControl } from "./FontSizeControl";

// ============================================================================
// Mock Data
// ============================================================================

const recentProjects = [
  { 
    id: "p1", 
    name: "Faith in a FireStorm", 
    progress: 0.62, 
    wordCount: 82000,
    targetWordCount: 120000,
    genre: "Christian Fiction",
    updatedAt: "2025-11-10" 
  },
  { 
    id: "p2", 
    name: "Heart of the Storm", 
    progress: 0.31,
    wordCount: 34000,
    targetWordCount: 110000,
    genre: "Fantasy",
    updatedAt: "2025-11-09" 
  },
  { 
    id: "p3", 
    name: "The Shadow Chronicles", 
    progress: 0.15,
    wordCount: 18000,
    targetWordCount: 100000,
    genre: "Sci-Fi",
    updatedAt: "2025-11-08" 
  },
];

// ============================================================================
// Utility Functions
// ============================================================================

function formatWordCount(count: number): string {
  return count.toLocaleString();
}

// ============================================================================
// Main Component
// ============================================================================

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
        {/* 
          TOP AREA: Page Header
          Purpose: Welcome message and global controls
          UX Rationale: Establishes context and provides font size control
        */}
        <header class="mb-8 flex items-start justify-between">
          <div>
            <h1 class="font-cinzel-decorative text-4xl text-[rgb(var(--fg))] mb-2">
              THE HEARTH
            </h1>
            <p class="text-lg text-[rgb(var(--fg))]/70">
              Welcome back, ready to forge your story?
            </p>
          </div>
          <div class="flex flex-col items-end gap-1.5">
            <FontSizeControl />
            <p class="text-xs text-[rgb(var(--fg))]/60 italic max-w-[16rem] text-right">
              Adjusts text size across all pages. Your preference is saved automatically.
            </p>
          </div>
        </header>

        {/* 
          HERO SECTION: Continue Writing
          Purpose: Get authors back to writing immediately
          UX Rationale: Most prominent card, shows last edited scene
          Data: Fetched from project history, sorted by lastEdited DESC
        */}
        <section class="mb-8 rounded-2xl border-2 border-[rgb(var(--forge-ember))/0.4] 
                        bg-gradient-to-br from-[rgb(var(--forge-ember))/0.1] to-transparent
                        shadow-[0_0_20px_rgba(255,107,0,0.3)] p-8">
          <div class="flex items-center gap-3 mb-4">
            <Flame class="w-8 h-8 text-[rgb(var(--forge-ember))]" />
            <h2 class="text-2xl font-cinzel-decorative text-[rgb(var(--forge-ember))]">
              Continue Writing
            </h2>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-medium mb-1">Chapter 7 - The Storm's Return</p>
              <p class="text-sm text-[rgb(var(--fg))]/70">
                in <span class="font-semibold">Faith in a FireStorm</span>
              </p>
              <p class="text-xs text-[rgb(var(--fg))]/50 mt-2">Last edited 2 hours ago</p>
            </div>
            <A 
              href="/smithy?project=p1&chapter=7" 
              class="px-6 py-3 rounded-xl bg-gradient-to-b from-[rgb(var(--forge-ember))] to-[rgb(var(--forge-ember))/0.8]
                     text-white font-semibold shadow-ember hover:scale-105 transition-transform"
            >
              Open Smithy →
            </A>
          </div>
        </section>

        {/*
          PRIMARY ACTION ROW: Quick Actions
          Purpose: Provide quick access to common Foundry tasks
          UX Rationale: Three equal-width tiles with icons for visual clarity
          Navigation: All tiles navigate to Foundry workspace with specific intents
        */}
        <section class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-cinzel-decorative text-[rgb(var(--fg))]">
              Quick Actions
            </h2>
            <A
              href="/foundry"
              class="text-sm text-[rgb(var(--forge-brass))] hover:underline flex items-center gap-1"
            >
              View all in Foundry
              <ArrowRight class="w-4 h-4" />
            </A>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <A
              href="/foundry/new"
              class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6
                     hover:border-[rgb(var(--forge-brass))/0.5] hover:shadow-card
                     transition-all bg-white/60 dark:bg-white/5 group relative"
            >
              <div class="flex items-center gap-3 mb-3">
                <Plus class="w-6 h-6 text-[rgb(var(--forge-brass))] group-hover:scale-110 transition-transform" />
                <h3 class="font-semibold text-lg">New Project</h3>
              </div>
              <p class="text-sm text-[rgb(var(--fg))]/70 mb-2">
                Start fresh with title, genre, and defaults.
              </p>
              <div class="flex items-center gap-1 text-xs text-[rgb(var(--forge-brass))]/70">
                <span>Opens in Foundry</span>
                <ArrowRight class="w-3 h-3" />
              </div>
            </A>

            <A
              href="/foundry?tab=ingest"
              class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6
                     hover:border-[rgb(var(--forge-brass))/0.5] hover:shadow-card
                     transition-all bg-white/60 dark:bg-white/5 group relative"
            >
              <div class="flex items-center gap-3 mb-3">
                <Upload class="w-6 h-6 text-[rgb(var(--forge-brass))] group-hover:scale-110 transition-transform" />
                <h3 class="font-semibold text-lg">Import Files</h3>
              </div>
              <p class="text-sm text-[rgb(var(--fg))]/70 mb-2">
                Drag in DOCX, MD, or PDF to parse and index.
              </p>
              <div class="flex items-center gap-1 text-xs text-[rgb(var(--forge-brass))]/70">
                <span>Opens in Foundry</span>
                <ArrowRight class="w-3 h-3" />
              </div>
            </A>

            <A
              href="/foundry?tab=overview"
              class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6
                     hover:border-[rgb(var(--forge-brass))/0.5] hover:shadow-card
                     transition-all bg-white/60 dark:bg-white/5 group relative"
            >
              <div class="flex items-center gap-3 mb-3">
                <FolderOpen class="w-6 h-6 text-[rgb(var(--forge-brass))] group-hover:scale-110 transition-transform" />
                <h3 class="font-semibold text-lg">Manage Projects</h3>
              </div>
              <p class="text-sm text-[rgb(var(--fg))]/70 mb-2">
                View all projects, check indexing status, and configure settings.
              </p>
              <div class="flex items-center gap-1 text-xs text-[rgb(var(--forge-brass))]/70">
                <span>Opens in Foundry</span>
                <ArrowRight class="w-3 h-3" />
              </div>
            </A>
          </div>
        </section>

        {/*
          RECENT PROJECTS SECTION: Project Grid
          Purpose: Quick access to recent work
          UX Rationale: Grid layout with progress bars, word counts, and genre tags
          Data: Fetched from project database, sorted by updatedAt DESC, limit 6
          Navigation: Clicking a project opens it in Foundry for management
        */}
        <section class="mb-10">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-cinzel-decorative text-[rgb(var(--fg))]">
              Recent Projects
            </h2>
            <A
              href="/foundry?tab=overview"
              class="text-sm text-[rgb(var(--forge-brass))] hover:underline flex items-center gap-1"
            >
              View all projects
              <ArrowRight class="w-4 h-4" />
            </A>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={recentProjects}>
              {(p) => (
                <div class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6
                            hover:border-[rgb(var(--forge-brass))/0.5] hover:shadow-card
                            transition-all bg-white/60 dark:bg-white/5 group"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <h3 class="font-semibold text-lg mb-1">{p.name}</h3>
                      <p class="text-xs text-[rgb(var(--fg))]/60">
                        Last edited {p.updatedAt}
                      </p>
                    </div>
                    <span class="px-2 py-1 rounded-md bg-[rgb(var(--forge-brass))/0.2]
                                 text-xs text-[rgb(var(--forge-brass))]">
                      {p.genre}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div class="mb-4">
                    <div class="flex justify-between text-xs mb-1">
                      <span>{formatWordCount(p.wordCount)} words</span>
                      <span>{Math.round(p.progress * 100)}%</span>
                    </div>
                    <div class="h-2 w-full rounded-full bg-[rgb(var(--forge-steel))/0.2]">
                      <div
                        class="h-2 rounded-full bg-gradient-to-r from-[rgb(var(--forge-ember))] to-[rgb(var(--forge-brass))]"
                        style={{ width: `${Math.round(p.progress * 100)}%` }}
                      />
                    </div>
                    <p class="text-xs text-[rgb(var(--fg))]/50 mt-1">
                      Target: {formatWordCount(p.targetWordCount)} words
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div class="flex gap-2 pt-3 border-t border-[rgb(var(--forge-steel))/0.2]">
                    <A
                      href={`/foundry?project=${p.id}`}
                      class="flex-1 px-3 py-2 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                             hover:border-[rgb(var(--forge-brass))/0.5] hover:bg-white/5
                             text-sm text-center transition-all flex items-center justify-center gap-1"
                    >
                      <FolderOpen class="w-4 h-4" />
                      Manage
                    </A>
                    <A
                      href={`/smithy?project=${p.id}`}
                      class="flex-1 px-3 py-2 rounded-lg bg-gradient-to-b from-[rgb(var(--forge-ember))]/20 to-transparent
                             border border-[rgb(var(--forge-ember))/0.3] hover:from-[rgb(var(--forge-ember))]/30
                             text-sm text-center transition-all flex items-center justify-center gap-1
                             text-[rgb(var(--forge-ember))] font-medium"
                    >
                      <Flame class="w-4 h-4" />
                      Write
                    </A>
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>

        {/*
          WORKSPACE NAVIGATION GUIDE
          Purpose: Help users understand all workspaces in the Forge
          UX Rationale: Complete overview of the creative workflow
        */}
        <section class="mb-8 rounded-2xl border-2 border-[rgb(var(--forge-brass))/0.3]
                        bg-gradient-to-br from-[rgb(var(--forge-brass))/0.05] to-transparent p-6">
          <h3 class="font-semibold text-xl mb-4 flex items-center gap-2">
            <span class="text-[rgb(var(--forge-brass))]">💡</span>
            Understanding Your Workspaces
          </h3>
          <p class="text-sm text-[rgb(var(--fg))]/60 mb-6">
            AuthorForge is organized like a blacksmith's forge. Each workspace serves a specific purpose in your creative process.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {/* Hearth - Dashboard */}
            <div class="rounded-lg border border-[rgb(var(--forge-ember))/0.3] bg-[rgb(var(--forge-ember))/0.05] p-4">
              <h4 class="font-semibold text-[rgb(var(--forge-ember))] mb-2 flex items-center gap-2">
                <Flame class="w-4 h-4" />
                The Hearth
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed mb-2">
                Your <strong>dashboard</strong> and home base. Quick access to continue writing and view recent projects.
              </p>
              <span class="text-xs text-[rgb(var(--forge-ember))] font-medium">You are here</span>
            </div>

            {/* Foundry - Project Management */}
            <A
              href="/foundry"
              class="rounded-lg border border-[rgb(var(--forge-brass))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--forge-brass))] mb-2 flex items-center gap-2">
                <FolderOpen class="w-4 h-4" />
                The Foundry
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>project workshop</strong>. Create projects, import manuscripts, manage indexing.
              </p>
            </A>

            {/* Smithy - Writing */}
            <A
              href="/smithy"
              class="rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <Hammer class="w-4 h-4" />
                The Smithy
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>writing anvil</strong>. Draft, edit, and forge your prose with AI assistance.
              </p>
            </A>

            {/* Anvil - Story Structure */}
            <A
              href="/anvil"
              class="rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                The Anvil
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>story shaper</strong>. Track character arcs, plot beats, and narrative structure.
              </p>
            </A>

            {/* Lore - Worldbuilding */}
            <A
              href="/lore"
              class="rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <BookOpen class="w-4 h-4" />
                Lore
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>reference library</strong>. Build your world with characters, places, and canon.
              </p>
            </A>

            {/* Bloom - Timeline & Visualization */}
            <A
              href="/bloom"
              class="rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <Sparkles class="w-4 h-4" />
                The Bloom
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>visualization garden</strong>. View timeline, beat sequences, and story flow.
              </p>
            </A>

            {/* Tempering - Export Refinement */}
            <A
              href="/tempering/p1"
              class="rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <Flame class="w-4 h-4 text-[rgb(var(--forge-ember))]" />
                Tempering
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>export forge</strong>. Refine formatting, configure profiles, and export to EPUB, PDF, DOCX.
              </p>
            </A>

            {/* Boundary - AI Settings */}
            <A
              href="/boundary"
              class="rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <Settings class="w-4 h-4" />
                Boundary
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>control panel</strong>. Configure AI providers and contextual settings.
              </p>
            </A>

            {/* Ember - Themes & Preferences */}
            <A
              href="/ember"
              class="rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 p-4
                     hover:border-[rgb(var(--forge-brass))/0.6] hover:bg-[rgb(var(--forge-brass))/0.05] transition-all"
            >
              <h4 class="font-semibold text-[rgb(var(--fg))] mb-2 flex items-center gap-2">
                <Palette class="w-4 h-4" />
                Ember
              </h4>
              <p class="text-xs text-[rgb(var(--fg))]/70 leading-relaxed">
                Your <strong>settings hearth</strong>. Customize themes, preferences, and account settings.
              </p>
            </A>
          </div>
        </section>

        {/*
          WORKFLOW GUIDANCE SECTION: Quick Tips
          Purpose: Provide actionable workflow suggestions
          UX Rationale: Simple, informational, reinforces the workspace metaphor
        */}
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6 bg-white/60 dark:bg-white/5">
            <h3 class="font-semibold text-lg mb-2 flex items-center gap-2">
              <Flame class="w-5 h-5 text-[rgb(var(--forge-ember))]" />
              Start Writing
            </h3>
            <p class="text-sm text-[rgb(var(--fg))]/70 leading-relaxed">
              Jump into <strong>Smithy</strong> to draft your chapters. Use AI assistance for brainstorming and editing.
            </p>
          </div>
          <div class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6 bg-white/60 dark:bg-white/5">
            <h3 class="font-semibold text-lg mb-2 flex items-center gap-2">
              <Sparkles class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
              Plan Structure
            </h3>
            <p class="text-sm text-[rgb(var(--fg))]/70 leading-relaxed">
              Use <strong>Anvil</strong> to map character arcs and plot beats. Track internal, external, and spiritual journeys.
            </p>
          </div>
          <div class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6 bg-white/60 dark:bg-white/5">
            <h3 class="font-semibold text-lg mb-2 flex items-center gap-2">
              <BookOpen class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
              Build Your World
            </h3>
            <p class="text-sm text-[rgb(var(--fg))]/70 leading-relaxed">
              Organize characters, places, and lore in <strong>Lore</strong>. Keep your canon consistent and searchable.
            </p>
          </div>
        </section>
      </div>
    </ForgeShell>
  );
}

