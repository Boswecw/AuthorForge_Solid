import { A, useLocation } from "@solidjs/router";
import { createMemo, createSignal, For, Show, onMount, onCleanup } from "solid-js";
import { useTheme } from "~/lib/useTheme";
import logoIcon from "~/assets/icons/AnvilBadge.webp?url";
import {
  Home,
  FolderOpen,
  PenTool,
  Hammer,
  BookOpen,
  Sparkles,
  Flame,
  Globe,
  HelpCircle,
  Sun,
  Moon,
  Menu,
  Wrench,
  ChevronDown,
  Palette,
} from "lucide-solid";
import type { Component } from "solid-js";

type Item = {
  name: string;
  href: string;
  key: string;
  icon: Component;
  tooltip: string;
};

// Primary workspace navigation items
const primaryItems: Item[] = [
  { name: "The Hearth", href: "/hearth", key: "hearth", icon: Home, tooltip: "Dashboard & Home" },
  { name: "The Foundry", href: "/foundry", key: "foundry", icon: FolderOpen, tooltip: "Project & Asset Management" },
  { name: "The Smithy", href: "/smithy", key: "smithy", icon: PenTool, tooltip: "Writing & Editing Workspace" },
  { name: "The Anvil", href: "/anvil", key: "anvil", icon: Hammer, tooltip: "Story Structure & Arcs" },
  { name: "Lore", href: "/lore", key: "lore", icon: BookOpen, tooltip: "Worldbuilding Database" },
  { name: "The Bloom", href: "/bloom", key: "bloom", icon: Sparkles, tooltip: "Timeline & Beat Visualization" },
];

// Secondary utility items (shown in hamburger menu)
const utilityItems: Item[] = [
  { name: "Ember", href: "/ember", key: "ember", icon: Palette, tooltip: "Settings & Preferences" },
  { name: "Tempering", href: "/tempering/p1", key: "tempering", icon: Flame, tooltip: "Export Refinement & Formatting" },
  { name: "Boundary", href: "/boundary", key: "boundary", icon: Globe, tooltip: "AI Context Management" },
  { name: "Help", href: "/help", key: "help", icon: HelpCircle, tooltip: "Documentation & Support" },
];

export default function Nav() {
  const loc = useLocation();
  const { theme, toggle } = useTheme();

  const path = createMemo(() => loc.pathname);
  const isActive = (href: string) =>
    path() === href || path().startsWith(href + "/");

  // Mobile menu
  const [menuOpen, setMenuOpen] = createSignal(false);

  // Desktop toolbox (hamburger) menu
  const [toolboxOpen, setToolboxOpen] = createSignal(false);

  // Check if any utility item is active
  const isUtilityActive = createMemo(() =>
    utilityItems.some(item => isActive(item.href))
  );

  // Close toolbox when clicking outside
  let toolboxRef: HTMLDivElement | undefined;

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolboxRef && !toolboxRef.contains(event.target as Node)) {
        setToolboxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  return (
    <header
      class="sticky top-0 z-40 border-b border-[rgb(var(--forge-steel))/0.3]
             bg-[rgb(var(--bg))/0.8] dark:bg-[rgb(var(--forge-ink))/0.7] backdrop-blur"
    >
      {/* Skip link for accessibility */}
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2
               rounded-md px-3 py-2 text-sm bg-white/90 dark:bg-black/60"
      >
        Skip to content
      </a>

      <nav class="w-full h-14 flex items-center" aria-label="Primary">
        <div class="w-full flex items-center gap-3">
          {/* LEFT: Logo + Wordmark (flush-left) */}
          <A href="/hearth" class="flex items-center gap-2 pl-2 no-underline">
            <img
              src={logoIcon}
              alt="AuthorForge logo"
              class="h-8 w-8 shrink-0 object-contain"
              draggable={false}
            />
            <span
              class="font-display uppercase tracking-wider text-[1.25rem] md:text-[1.5rem]
                     bg-gradient-to-r from-forge-brass to-forge-ember bg-clip-text text-transparent"
            >
              AUTHORFORGE
            </span>
          </A>

          {/* RIGHT: Nav links + Theme toggle */}
          <div class="ml-auto flex items-center gap-2 pr-4 sm:pr-6 lg:pr-8">

            {/* Desktop nav - Primary workspaces */}
            <ul class="hidden md:flex items-center gap-2">
              <For each={primaryItems}>
                {(item) => (
                  <li>
                    <A
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      title={item.tooltip}
                      class={
                        isActive(item.href)
                          ? [
                              "px-3 h-9 inline-flex items-center gap-2 rounded-md border text-xs uppercase tracking-wider font-semibold transition",
                              "text-white border-white/10",
                              // Ember glow for active state
                              "bg-gradient-to-b from-[rgb(var(--forge-ember))]/25 to-transparent shadow-ember"
                            ].join(" ")
                          : [
                              "px-3 h-9 inline-flex items-center gap-2 rounded-md border text-xs uppercase tracking-wider font-semibold transition",
                              "text-[rgb(var(--fg))]/0.85 dark:text-[rgb(var(--fg))]/0.85",
                              "border-transparent hover:border-[rgb(var(--forge-brass))]/30",
                              "hover:bg-white/5 dark:hover:bg-white/5",
                              "hover:underline hover:underline-offset-4 hover:decoration-[rgb(var(--forge-brass))]/40",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
                            ].join(" ")
                      }
                    >
                      <item.icon class="w-4 h-4" />
                      {item.name}
                    </A>
                  </li>
                )}
              </For>
            </ul>

            {/* Desktop Toolbox (Hamburger) Menu */}
            <div class="hidden md:block relative" ref={toolboxRef}>
              <button
                type="button"
                onClick={() => setToolboxOpen(!toolboxOpen())}
                class={
                  isUtilityActive()
                    ? [
                        "px-3 h-9 inline-flex items-center gap-2 rounded-md border text-xs uppercase tracking-wider font-semibold transition",
                        "text-white border-white/10",
                        "bg-gradient-to-b from-[rgb(var(--forge-ember))]/25 to-transparent shadow-ember"
                      ].join(" ")
                    : [
                        "px-3 h-9 inline-flex items-center gap-2 rounded-md border text-xs uppercase tracking-wider font-semibold transition",
                        "text-[rgb(var(--fg))]/0.85 dark:text-[rgb(var(--fg))]/0.85",
                        "border-transparent hover:border-[rgb(var(--forge-brass))]/30",
                        "hover:bg-white/5 dark:hover:bg-white/5",
                        "hover:underline hover:underline-offset-4 hover:decoration-[rgb(var(--forge-brass))]/40",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
                      ].join(" ")
                }
                aria-label="Open toolbox menu"
                aria-expanded={toolboxOpen()}
                aria-haspopup="true"
                title="Utilities & Tools"
              >
                <Wrench class="w-4 h-4" />
                <span>Toolbox</span>
                <ChevronDown
                  class="w-3 h-3 transition-transform duration-200"
                  classList={{ "rotate-180": toolboxOpen() }}
                />
              </button>

              {/* Toolbox Dropdown */}
              <Show when={toolboxOpen()}>
                <div
                  class="absolute right-0 top-full mt-2 w-56 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                         bg-[rgb(var(--bg))]/95 dark:bg-[rgb(var(--forge-ink))]/95 backdrop-blur-lg
                         shadow-lg shadow-black/20 dark:shadow-black/40 z-50"
                  role="menu"
                >
                  <ul class="py-2">
                    <For each={utilityItems}>
                      {(item) => (
                        <li role="none">
                          <A
                            href={item.href}
                            role="menuitem"
                            title={item.tooltip}
                            onClick={() => setToolboxOpen(false)}
                            class={
                              isActive(item.href)
                                ? [
                                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition",
                                    "text-white bg-gradient-to-r from-[rgb(var(--forge-ember))]/20 to-transparent",
                                    "border-l-2 border-[rgb(var(--forge-ember))]"
                                  ].join(" ")
                                : [
                                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition",
                                    "text-[rgb(var(--fg))]/0.85 hover:text-[rgb(var(--fg))]",
                                    "hover:bg-white/5 dark:hover:bg-white/5",
                                    "border-l-2 border-transparent hover:border-[rgb(var(--forge-brass))]/40"
                                  ].join(" ")
                            }
                          >
                            <item.icon class="w-4 h-4 shrink-0" />
                            <div class="flex-1">
                              <div class="font-semibold">{item.name}</div>
                              <div class="text-xs text-[rgb(var(--muted))] mt-0.5">
                                {item.tooltip}
                              </div>
                            </div>
                          </A>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </Show>
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggle}
              class="h-9 px-3 inline-flex items-center gap-2 rounded-md border
                     border-[rgb(var(--forge-steel))/0.3]
                     bg-white/60 dark:bg-white/5
                     hover:bg-white/80 dark:hover:bg-white/10 text-sm
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
              aria-label="Toggle color theme"
              aria-pressed={theme() === "dark"}
            >
              <Show when={theme() === "dark"} fallback={<Moon class="h-4 w-4" />}>
                <Sun class="h-4 w-4" />
              </Show>
              <span>{theme() === "dark" ? "Light" : "Dark"}</span>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen())}
              class="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md
                     border border-[rgb(var(--forge-steel))/0.3]
                     bg-white/60 dark:bg-white/5
                     hover:bg-white/80 dark:hover:bg-white/10
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
              aria-label="Open menu"
              aria-expanded={menuOpen()}
              aria-controls="primary-menu"
            >
              <Menu class="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu container */}
      <Show when={menuOpen()}>
        <div id="primary-menu" class="md:hidden px-3 pb-3 border-t border-[rgb(var(--forge-steel))/0.2]">
          {/* Primary workspaces */}
          <div class="pt-3">
            <div class="px-3 pb-2 text-xs uppercase tracking-wider text-[rgb(var(--forge-brass))]/70 font-semibold">
              Workspaces
            </div>
            <ul class="flex flex-col gap-1">
              <For each={primaryItems}>
                {(item) => (
                  <li>
                    <A
                      href={item.href}
                      title={item.tooltip}
                      class={
                        isActive(item.href)
                          ? [
                              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition",
                              "text-white bg-gradient-to-r from-[rgb(var(--forge-ember))]/20 to-transparent",
                              "border-l-2 border-[rgb(var(--forge-ember))]"
                            ].join(" ")
                          : [
                              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition",
                              "text-[rgb(var(--fg))]/0.85 hover:text-[rgb(var(--fg))]",
                              "hover:bg-white/5 border-l-2 border-transparent"
                            ].join(" ")
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      <item.icon class="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </div>

          {/* Utility items */}
          <div class="pt-4 mt-4 border-t border-[rgb(var(--forge-steel))/0.2]">
            <div class="px-3 pb-2 text-xs uppercase tracking-wider text-[rgb(var(--forge-brass))]/70 font-semibold">
              Utilities
            </div>
            <ul class="flex flex-col gap-1">
              <For each={utilityItems}>
                {(item) => (
                  <li>
                    <A
                      href={item.href}
                      title={item.tooltip}
                      class={
                        isActive(item.href)
                          ? [
                              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition",
                              "text-white bg-gradient-to-r from-[rgb(var(--forge-ember))]/20 to-transparent",
                              "border-l-2 border-[rgb(var(--forge-ember))]"
                            ].join(" ")
                          : [
                              "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition",
                              "text-[rgb(var(--fg))]/0.85 hover:text-[rgb(var(--fg))]",
                              "hover:bg-white/5 border-l-2 border-transparent"
                            ].join(" ")
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      <item.icon class="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </A>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </Show>
    </header>
  );
}
