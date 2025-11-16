// src/routes/help/index.tsx
/**
 * Help Workspace - AuthorForge Documentation & Support
 *
 * PURPOSE:
 * - Provide comprehensive documentation for all workspaces
 * - Display keyboard shortcuts reference
 * - Offer getting started guides
 * - Show FAQ and troubleshooting tips
 * - Provide support contact information
 */

import { createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import {
  HelpCircle, BookOpen, Keyboard, Rocket, MessageCircle,
  Home, FolderOpen, PenTool, Hammer, Sparkles, Flame,
  Globe, Palette, ChevronRight, ExternalLink, Info
} from "lucide-solid";
import ForgeShell from "~/components/ForgeShell";

type HelpSection = "getting-started" | "workspaces" | "shortcuts" | "faq" | "support";

interface Section {
  id: HelpSection;
  label: string;
  icon: any;
  description: string;
}

export default function HelpPage() {
  const [activeSection, setActiveSection] = createSignal<HelpSection>("getting-started");

  const sections: Section[] = [
    {
      id: "getting-started",
      label: "Getting Started",
      icon: Rocket,
      description: "Quick start guide for new users"
    },
    {
      id: "workspaces",
      label: "Workspace Guide",
      icon: BookOpen,
      description: "Learn about each workspace"
    },
    {
      id: "shortcuts",
      label: "Keyboard Shortcuts",
      icon: Keyboard,
      description: "Speed up your workflow"
    },
    {
      id: "faq",
      label: "FAQ",
      icon: HelpCircle,
      description: "Frequently asked questions"
    },
    {
      id: "support",
      label: "Support",
      icon: MessageCircle,
      description: "Get help and contact us"
    },
  ];

  // Right panel content
  const RightPanel = (
    <div class="space-y-4">
      <section>
        <h4 class="font-semibold mb-2 text-[rgb(var(--forge-brass))]">Help & Documentation</h4>
        <p class="text-sm opacity-90 mb-3">
          Your <strong>guide to AuthorForge</strong> — learn how to use each workspace
          and master your creative workflow.
        </p>
      </section>

      <section>
        <h4 class="font-semibold mb-2">Quick Links</h4>
        <ul class="space-y-2 text-sm">
          <li>
            <button
              onClick={() => setActiveSection("getting-started")}
              class="text-[rgb(var(--forge-brass))] hover:underline"
            >
              → Getting Started
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("shortcuts")}
              class="text-[rgb(var(--forge-brass))] hover:underline"
            >
              → Keyboard Shortcuts
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("faq")}
              class="text-[rgb(var(--forge-brass))] hover:underline"
            >
              → FAQ
            </button>
          </li>
        </ul>
      </section>

      <section>
        <h4 class="font-semibold mb-2">Need More Help?</h4>
        <p class="text-sm opacity-90">
          Visit the <button
            onClick={() => setActiveSection("support")}
            class="text-[rgb(var(--forge-brass))] hover:underline"
          >
            Support section
          </button> for contact information and additional resources.
        </p>
      </section>
    </div>
  );

  return (
    <ForgeShell title="Help & Documentation" rightPanel={RightPanel}>
      <div class="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <header class="mb-8">
          <h1 class="text-4xl font-bold mb-3 flex items-center gap-3 font-cinzel-decorative">
            <HelpCircle class="w-10 h-10 text-[rgb(var(--forge-brass))]" />
            Help & Documentation
          </h1>
          <p class="text-lg text-[rgb(var(--fg))]/70">
            Everything you need to know about using AuthorForge
          </p>
        </header>

        {/* Section Navigation */}
        <nav class="mb-8">
          <div class="flex flex-wrap gap-3">
            <For each={sections}>
              {(section) => (
                <button
                  onClick={() => setActiveSection(section.id)}
                  class={
                    activeSection() === section.id
                      ? [
                          "px-4 py-2.5 rounded-lg border text-sm font-medium transition-all",
                          "bg-gradient-to-b from-[rgb(var(--forge-brass))]/25 to-transparent",
                          "border-[rgb(var(--forge-brass))]/50 text-[rgb(var(--fg))]",
                          "shadow-md"
                        ].join(" ")
                      : [
                          "px-4 py-2.5 rounded-lg border text-sm font-medium transition-all",
                          "border-[rgb(var(--forge-steel))]/30 text-[rgb(var(--fg))]/70",
                          "hover:border-[rgb(var(--forge-brass))]/40 hover:bg-white/5"
                        ].join(" ")
                  }
                  title={section.description}
                >
                  <div class="flex items-center gap-2">
                    <section.icon class="w-4 h-4" />
                    {section.label}
                  </div>
                </button>
              )}
            </For>
          </div>
        </nav>

        {/* Content Area */}
        <div class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/60 dark:bg-white/5 p-8">
          <Show when={activeSection() === "getting-started"}>
            <GettingStartedSection />
          </Show>
          <Show when={activeSection() === "workspaces"}>
            <WorkspacesSection />
          </Show>
          <Show when={activeSection() === "shortcuts"}>
            <ShortcutsSection />
          </Show>
          <Show when={activeSection() === "faq"}>
            <FAQSection />
          </Show>
          <Show when={activeSection() === "support"}>
            <SupportSection />
          </Show>
        </div>
      </div>
    </ForgeShell>
  );
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function GettingStartedSection() {
  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <Rocket class="w-6 h-6 text-[rgb(var(--forge-brass))]" />
        Getting Started with AuthorForge
      </h2>

      <section>
        <h3 class="text-xl font-semibold mb-3">Welcome to the Forge!</h3>
        <p class="text-[rgb(var(--fg))]/80 leading-relaxed mb-4">
          AuthorForge is organized like a blacksmith's forge, where each workspace serves
          a specific purpose in your creative process. Think of it as a journey from raw
          ideas to polished, published work.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold mb-3">The Creative Workflow</h3>
        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--forge-brass))]/20
                        flex items-center justify-center font-bold text-[rgb(var(--forge-brass))]">
              1
            </div>
            <div>
              <h4 class="font-semibold mb-1">Start at The Hearth</h4>
              <p class="text-sm text-[rgb(var(--fg))]/70">
                Your dashboard and home base. View recent projects, access quick actions,
                and understand the workspace layout.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--forge-brass))]/20
                        flex items-center justify-center font-bold text-[rgb(var(--forge-brass))]">
              2
            </div>
            <div>
              <h4 class="font-semibold mb-1">Create a Project in The Foundry</h4>
              <p class="text-sm text-[rgb(var(--fg))]/70">
                Import existing work or start fresh. Upload DOCX, PDF, or Markdown files
                to auto-parse chapters and build your project structure.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--forge-brass))]/20
                        flex items-center justify-center font-bold text-[rgb(var(--forge-brass))]">
              3
            </div>
            <div>
              <h4 class="font-semibold mb-1">Write in The Smithy</h4>
              <p class="text-sm text-[rgb(var(--fg))]/70">
                Your primary writing workspace with rich text editing, AI assistance,
                and focus mode. Press <kbd class="px-2 py-1 rounded bg-[rgb(var(--forge-steel))/0.2]
                border border-[rgb(var(--forge-steel))/0.3] text-xs font-mono">F</kbd> for distraction-free writing.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--forge-brass))]/20
                        flex items-center justify-center font-bold text-[rgb(var(--forge-brass))]">
              4
            </div>
            <div>
              <h4 class="font-semibold mb-1">Structure Your Story in The Anvil</h4>
              <p class="text-sm text-[rgb(var(--fg))]/70">
                Build character arcs, track emotional beats, and visualize your story's
                structure with interactive graphs and timelines.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--forge-brass))]/20
                        flex items-center justify-center font-bold text-[rgb(var(--forge-brass))]">
              5
            </div>
            <div>
              <h4 class="font-semibold mb-1">Build Your World in Lore</h4>
              <p class="text-sm text-[rgb(var(--fg))]/70">
                Create and manage characters, locations, factions, and worldbuilding
                details. Search and reference while writing.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--forge-brass))]/20
                        flex items-center justify-center font-bold text-[rgb(var(--forge-brass))]">
              6
            </div>
            <div>
              <h4 class="font-semibold mb-1">Export with Tempering</h4>
              <p class="text-sm text-[rgb(var(--fg))]/70">
                Polish and publish your work. Export to EPUB, PDF, DOCX, Markdown, or HTML
                with customizable formatting profiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-6 p-4 rounded-lg bg-[rgb(var(--forge-brass))]/10 border border-[rgb(var(--forge-brass))]/30">
        <h3 class="text-lg font-semibold mb-2 text-[rgb(var(--forge-brass))]">💡 Pro Tip</h3>
        <p class="text-sm text-[rgb(var(--fg))]/80">
          You don't have to follow this workflow linearly! Jump between workspaces as needed.
          Many writers prefer to build characters in Lore first, then outline in The Anvil,
          and finally draft in The Smithy.
        </p>
      </section>
    </div>
  );
}

function WorkspacesSection() {
  const workspaces = [
    {
      name: "The Hearth",
      icon: Home,
      route: "/hearth",
      description: "Your dashboard and home base. View recent projects, quick actions, and workspace guides.",
      features: [
        "Recent projects overview",
        "Quick access to continue writing",
        "Workspace navigation guide",
        "Tips and shortcuts"
      ]
    },
    {
      name: "The Foundry",
      icon: FolderOpen,
      route: "/foundry",
      description: "Project and asset management workspace. Create, import, and organize your writing projects.",
      features: [
        "Create new projects",
        "Import DOCX, PDF, Markdown files",
        "Auto-parse chapters and sections",
        "Build embeddings and search index"
      ]
    },
    {
      name: "The Smithy",
      icon: PenTool,
      route: "/smithy",
      description: "Your primary writing workspace with rich text editing and AI assistance.",
      features: [
        "Rich text editor with formatting",
        "Focus mode (press F)",
        "AI writing assistance",
        "Word count and reading time",
        "Auto-save functionality"
      ]
    },
    {
      name: "The Anvil",
      icon: Hammer,
      route: "/anvil",
      description: "Story structure and character arc workspace. Build and visualize your narrative.",
      features: [
        "Character arc tracking",
        "Story beat visualization",
        "Interactive arc graphs",
        "Emotional intensity mapping",
        "POV character management"
      ]
    },
    {
      name: "Lore",
      icon: BookOpen,
      route: "/lore",
      description: "Worldbuilding and reference database. Create and manage all your story elements.",
      features: [
        "Character profiles",
        "Location database",
        "Faction management",
        "Search and filter",
        "Quick reference while writing"
      ]
    },
    {
      name: "The Bloom",
      icon: Sparkles,
      route: "/bloom",
      description: "Timeline and beat visualization workspace. See your story's flow and structure.",
      features: [
        "Timeline visualization",
        "Beat sequence view",
        "Story flow analysis",
        "Chapter progression"
      ]
    },
    {
      name: "Tempering",
      icon: Flame,
      route: "/tempering/p1",
      description: "Export refinement and formatting workspace. Polish and publish your work.",
      features: [
        "Export to EPUB, PDF, DOCX, Markdown, HTML",
        "Customizable formatting profiles",
        "Asset binding (covers, images)",
        "Validation and preview",
        "Progress tracking"
      ]
    },
    {
      name: "Boundary",
      icon: Globe,
      route: "/boundary",
      description: "AI context management workspace. Control what the AI knows about your story.",
      features: [
        "Context window management",
        "Story knowledge base",
        "AI prompt customization",
        "Context injection rules"
      ]
    },
    {
      name: "Ember",
      icon: Palette,
      route: "/ember",
      description: "Settings and preferences workspace. Customize your AuthorForge experience.",
      features: [
        "Theme selection (Light/Dark)",
        "Font scale adjustment",
        "Keyboard shortcuts reference",
        "Account settings",
        "About and version info"
      ]
    }
  ];

  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <BookOpen class="w-6 h-6 text-[rgb(var(--forge-brass))]" />
        Workspace Guide
      </h2>

      <p class="text-[rgb(var(--fg))]/80 leading-relaxed mb-6">
        AuthorForge is organized into specialized workspaces, each designed for a specific
        part of your creative process. Click any workspace name to visit it.
      </p>

      <div class="space-y-4">
        <For each={workspaces}>
          {(workspace) => (
            <div class="rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                        bg-white/40 dark:bg-white/5 p-5 hover:border-[rgb(var(--forge-brass))]/40
                        transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <workspace.icon class="w-6 h-6 text-[rgb(var(--forge-brass))]" />
                  <A
                    href={workspace.route}
                    class="text-xl font-semibold hover:text-[rgb(var(--forge-brass))]
                           transition-colors flex items-center gap-2"
                  >
                    {workspace.name}
                    <ChevronRight class="w-4 h-4" />
                  </A>
                </div>
              </div>
              <p class="text-[rgb(var(--fg))]/70 mb-3 leading-relaxed">
                {workspace.description}
              </p>
              <div class="mt-3">
                <h4 class="text-sm font-semibold mb-2 text-[rgb(var(--forge-brass))]">Key Features:</h4>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <For each={workspace.features}>
                    {(feature) => (
                      <li class="text-sm text-[rgb(var(--fg))]/70 flex items-start gap-2">
                        <span class="text-[rgb(var(--forge-brass))] mt-0.5">•</span>
                        {feature}
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function ShortcutsSection() {
  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["Ctrl/Cmd", "H"], description: "Go to Hearth (Dashboard)" },
        { keys: ["Ctrl/Cmd", "F"], description: "Go to Foundry (Projects)" },
        { keys: ["Ctrl/Cmd", "S"], description: "Go to Smithy (Writing)" },
        { keys: ["Ctrl/Cmd", "A"], description: "Go to Anvil (Story Structure)" },
        { keys: ["Ctrl/Cmd", "L"], description: "Go to Lore (Worldbuilding)" },
      ]
    },
    {
      category: "Editor (Smithy)",
      items: [
        { keys: ["F"], description: "Toggle Focus Mode" },
        { keys: ["Esc"], description: "Exit Focus Mode" },
        { keys: ["Ctrl/Cmd", "B"], description: "Bold" },
        { keys: ["Ctrl/Cmd", "I"], description: "Italic" },
        { keys: ["Ctrl/Cmd", "U"], description: "Underline" },
        { keys: ["Ctrl/Cmd", "K"], description: "Insert Link" },
        { keys: ["Ctrl/Cmd", "Shift", "F"], description: "Find in Document" },
      ]
    },
    {
      category: "General",
      items: [
        { keys: ["Ctrl/Cmd", "S"], description: "Save" },
        { keys: ["Ctrl/Cmd", "Z"], description: "Undo" },
        { keys: ["Ctrl/Cmd", "Shift", "Z"], description: "Redo" },
        { keys: ["Ctrl/Cmd", "/"], description: "Search" },
        { keys: ["Esc"], description: "Close Modal/Panel" },
        { keys: ["Ctrl/Cmd", "N"], description: "New Project" },
      ]
    },
  ];

  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <Keyboard class="w-6 h-6 text-[rgb(var(--forge-brass))]" />
        Keyboard Shortcuts
      </h2>

      <p class="text-[rgb(var(--fg))]/80 leading-relaxed mb-6">
        Speed up your workflow with these keyboard shortcuts. Most shortcuts use
        <kbd class="px-2 py-1 rounded bg-[rgb(var(--forge-steel))/0.2] border border-[rgb(var(--forge-steel))/0.3] text-xs font-mono">Ctrl</kbd> on Windows/Linux
        or <kbd class="px-2 py-1 rounded bg-[rgb(var(--forge-steel))/0.2] border border-[rgb(var(--forge-steel))/0.3] text-xs font-mono">Cmd</kbd> on macOS.
      </p>

      <div class="space-y-6">
        <For each={shortcuts}>
          {(section) => (
            <div>
              <h3 class="text-lg font-semibold mb-3 text-[rgb(var(--forge-brass))]">
                {section.category}
              </h3>
              <div class="space-y-2">
                <For each={section.items}>
                  {(shortcut) => (
                    <div class="flex items-center justify-between p-3 rounded-lg
                                border border-[rgb(var(--forge-steel))/0.3]
                                bg-white/40 dark:bg-white/5">
                      <span class="text-sm">{shortcut.description}</span>
                      <div class="flex items-center gap-1">
                        <For each={shortcut.keys}>
                          {(key) => (
                            <kbd class="px-2 py-1 rounded bg-[rgb(var(--forge-steel))/0.2]
                                       border border-[rgb(var(--forge-steel))/0.3]
                                       text-xs font-mono">
                              {key}
                            </kbd>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      <section class="mt-6 p-4 rounded-lg bg-[rgb(var(--forge-brass))]/10 border border-[rgb(var(--forge-brass))]/30">
        <h3 class="text-lg font-semibold mb-2 text-[rgb(var(--forge-brass))]">📝 Note</h3>
        <p class="text-sm text-[rgb(var(--fg))]/80">
          Keyboard shortcut customization is coming in a future update. For now, these
          shortcuts are fixed but cover the most common actions.
        </p>
      </section>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "How do I create a new project?",
      answer: "Go to The Foundry workspace and click 'New Project'. You can start from scratch or import existing files (DOCX, PDF, Markdown)."
    },
    {
      question: "Where is my work saved?",
      answer: "AuthorForge automatically saves your work locally on your computer. All data is stored in your local database and never sent to external servers unless you explicitly export or sync."
    },
    {
      question: "How do I enable Focus Mode in The Smithy?",
      answer: "Press the 'F' key while in The Smithy workspace to enter Focus Mode. This provides a distraction-free writing environment. Press 'Esc' to exit."
    },
    {
      question: "Can I export my work to different formats?",
      answer: "Yes! Use the Tempering workspace to export your project to EPUB, PDF, DOCX, Markdown, or HTML. You can customize formatting with export profiles."
    },
    {
      question: "How do I switch between light and dark themes?",
      answer: "Go to The Ember workspace (Settings) and select the Appearance tab. Click the theme toggle to switch between light and dark modes."
    },
    {
      question: "What is the difference between The Anvil and Lore?",
      answer: "The Anvil focuses on story structure and character arcs (narrative flow, beats, emotional intensity). Lore is your worldbuilding database (characters, locations, factions, reference material)."
    },
    {
      question: "How do I adjust text size?",
      answer: "You can adjust the global font scale in The Ember workspace (Settings > Appearance tab) or use the text size controls on The Hearth dashboard."
    },
    {
      question: "Can I import an existing manuscript?",
      answer: "Yes! In The Foundry, use the 'Import Project' option and upload your DOCX, PDF, or Markdown file. AuthorForge will auto-parse chapters and sections."
    },
    {
      question: "How does AI assistance work?",
      answer: "AI features are integrated throughout AuthorForge. In The Smithy, you can use AI for writing suggestions. The Boundary workspace lets you manage what context the AI has about your story."
    },
    {
      question: "Is my data private?",
      answer: "Yes! AuthorForge is a desktop application. All your data is stored locally on your computer. No cloud sync or external servers are involved unless you explicitly choose to export or share your work."
    }
  ];

  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <HelpCircle class="w-6 h-6 text-[rgb(var(--forge-brass))]" />
        Frequently Asked Questions
      </h2>

      <p class="text-[rgb(var(--fg))]/80 leading-relaxed mb-6">
        Common questions and answers about using AuthorForge.
      </p>

      <div class="space-y-4">
        <For each={faqs}>
          {(faq) => (
            <details class="group rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                           bg-white/40 dark:bg-white/5 overflow-hidden">
              <summary class="p-4 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5
                             transition-colors list-none flex items-center justify-between">
                <span class="font-semibold text-[rgb(var(--fg))]">{faq.question}</span>
                <ChevronRight class="w-5 h-5 text-[rgb(var(--forge-brass))] transition-transform
                                     group-open:rotate-90" />
              </summary>
              <div class="px-4 pb-4 pt-2 text-[rgb(var(--fg))]/70 leading-relaxed border-t
                          border-[rgb(var(--forge-steel))/0.2]">
                {faq.answer}
              </div>
            </details>
          )}
        </For>
      </div>

      <section class="mt-6 p-4 rounded-lg bg-[rgb(var(--forge-brass))]/10 border border-[rgb(var(--forge-brass))]/30">
        <h3 class="text-lg font-semibold mb-2 text-[rgb(var(--forge-brass))]">Still have questions?</h3>
        <p class="text-sm text-[rgb(var(--fg))]/80">
          Check the <A href="#" class="text-[rgb(var(--forge-brass))] hover:underline">Support section</A> for
          additional resources and contact information.
        </p>
      </section>
    </div>
  );
}

function SupportSection() {
  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle class="w-6 h-6 text-[rgb(var(--forge-brass))]" />
        Support & Resources
      </h2>

      <p class="text-[rgb(var(--fg))]/80 leading-relaxed mb-6">
        Need help? Here are the resources available to you.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5 p-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
            Documentation
          </h3>
          <p class="text-sm text-[rgb(var(--fg))]/70 mb-4">
            Comprehensive guides and tutorials for all AuthorForge features.
          </p>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <ChevronRight class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
              <span>Getting Started Guide</span>
            </li>
            <li class="flex items-center gap-2">
              <ChevronRight class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
              <span>Workspace Tutorials</span>
            </li>
            <li class="flex items-center gap-2">
              <ChevronRight class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
              <span>Export Guide</span>
            </li>
          </ul>
        </div>

        <div class="rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5 p-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageCircle class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
            Community
          </h3>
          <p class="text-sm text-[rgb(var(--fg))]/70 mb-4">
            Connect with other AuthorForge users and share tips.
          </p>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <ExternalLink class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
              <a href="#" class="text-[rgb(var(--forge-brass))] hover:underline">Discord Community</a>
            </li>
            <li class="flex items-center gap-2">
              <ExternalLink class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
              <a href="#" class="text-[rgb(var(--forge-brass))] hover:underline">GitHub Discussions</a>
            </li>
            <li class="flex items-center gap-2">
              <ExternalLink class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
              <a href="#" class="text-[rgb(var(--forge-brass))] hover:underline">User Forums</a>
            </li>
          </ul>
        </div>

        <div class="rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5 p-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <Keyboard class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
            Keyboard Shortcuts
          </h3>
          <p class="text-sm text-[rgb(var(--fg))]/70 mb-4">
            Quick reference for all keyboard shortcuts.
          </p>
          <p class="text-sm">
            <A href="#" class="text-[rgb(var(--forge-brass))] hover:underline">
              View Shortcuts Reference →
            </A>
          </p>
        </div>

        <div class="rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5 p-6">
          <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
            <Info class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
            About AuthorForge
          </h3>
          <p class="text-sm text-[rgb(var(--fg))]/70 mb-4">
            Version information and license details.
          </p>
          <p class="text-sm">
            <A href="/ember" class="text-[rgb(var(--forge-brass))] hover:underline">
              Go to Ember (Settings) →
            </A>
          </p>
        </div>
      </div>

      <section class="mt-6 p-6 rounded-lg bg-gradient-to-br from-[rgb(var(--forge-brass))]/10
                      to-transparent border border-[rgb(var(--forge-brass))]/30">
        <h3 class="text-xl font-semibold mb-3 text-[rgb(var(--forge-brass))]">
          📧 Contact Support
        </h3>
        <p class="text-[rgb(var(--fg))]/80 mb-4">
          For technical issues, bug reports, or feature requests, please reach out through
          one of these channels:
        </p>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2">
            <ExternalLink class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
            <span>Email: <a href="mailto:support@authorforge.app" class="text-[rgb(var(--forge-brass))] hover:underline">support@authorforge.app</a></span>
          </li>
          <li class="flex items-center gap-2">
            <ExternalLink class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
            <span>GitHub Issues: <a href="#" class="text-[rgb(var(--forge-brass))] hover:underline">Report a bug</a></span>
          </li>
          <li class="flex items-center gap-2">
            <ExternalLink class="w-4 h-4 text-[rgb(var(--forge-brass))]" />
            <span>Feature Requests: <a href="#" class="text-[rgb(var(--forge-brass))] hover:underline">Submit an idea</a></span>
          </li>
        </ul>
      </section>

      <section class="mt-6 p-4 rounded-lg bg-[rgb(var(--forge-brass))]/10 border border-[rgb(var(--forge-brass))]/30">
        <h3 class="text-lg font-semibold mb-2 text-[rgb(var(--forge-brass))]">🔥 Thank You!</h3>
        <p class="text-sm text-[rgb(var(--fg))]/80">
          Thank you for using AuthorForge! We're constantly improving the app based on user
          feedback. Your input helps make AuthorForge better for everyone.
        </p>
      </section>
    </div>
  );
}
