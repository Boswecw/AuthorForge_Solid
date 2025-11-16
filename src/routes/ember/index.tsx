// src/routes/ember/index.tsx
/**
 * The Ember - AuthorForge's settings and preferences workspace
 * 
 * PURPOSE:
 * - Theme customization (light/dark mode)
 * - Font scale adjustment
 * - UI preferences and layout options
 * - Keyboard shortcuts reference
 * - Account settings
 * - About and version information
 */

import { createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { 
  Palette, Sun, Moon, Type, Layout, Keyboard, 
  User, Info, ArrowLeft, Check 
} from "lucide-solid";
import ForgeShell from "~/components/ForgeShell";
import { useTheme } from "~/lib/useTheme";
import { useFontScale, setGlobalFontScale, type FontScaleKey } from "~/state/fontScale";

type SettingsTab = "appearance" | "preferences" | "shortcuts" | "account" | "about";

interface Tab {
  id: SettingsTab;
  label: string;
  icon: any;
  description: string;
}

export default function EmberPage() {
  const [activeTab, setActiveTab] = createSignal<SettingsTab>("appearance");
  const { theme, toggle } = useTheme();
  const { fontScaleKey } = useFontScale();

  const tabs: Tab[] = [
    { 
      id: "appearance", 
      label: "Appearance", 
      icon: Palette,
      description: "Customize theme and visual settings"
    },
    { 
      id: "preferences", 
      label: "Preferences", 
      icon: Layout,
      description: "UI layout and behavior options"
    },
    { 
      id: "shortcuts", 
      label: "Shortcuts", 
      icon: Keyboard,
      description: "Keyboard shortcuts reference"
    },
    { 
      id: "account", 
      label: "Account", 
      icon: User,
      description: "User profile and settings"
    },
    { 
      id: "about", 
      label: "About", 
      icon: Info,
      description: "Version and license information"
    },
  ];

  // Right panel content
  const RightPanel = (
    <div class="space-y-4">
      <section>
        <h4 class="font-semibold mb-2 text-[rgb(var(--forge-brass))]">The Ember</h4>
        <p class="text-sm opacity-90 mb-3">
          Your <strong>settings hearth</strong> — the warm place where you customize 
          your AuthorForge experience.
        </p>
      </section>
      
      <section>
        <h4 class="font-semibold mb-2">Quick Settings</h4>
        <div class="space-y-3">
          {/* Theme Toggle */}
          <div class="flex items-center justify-between">
            <span class="text-sm">Theme</span>
            <button
              onClick={toggle}
              class="px-3 py-1.5 rounded-md border border-[rgb(var(--forge-steel))/0.3]
                     hover:border-[rgb(var(--forge-brass))/0.5] transition-all
                     flex items-center gap-2 text-sm"
            >
              <Show when={theme() === "dark"} fallback={<Moon class="w-4 h-4" />}>
                <Sun class="w-4 h-4" />
              </Show>
              {theme() === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          {/* Font Scale */}
          <div class="flex items-center justify-between">
            <span class="text-sm">Font Size</span>
            <span class="text-xs text-[rgb(var(--forge-brass))]">
              {fontScaleKey()}
            </span>
          </div>
        </div>
      </section>

      <section>
        <h4 class="font-semibold mb-2">Tips</h4>
        <ul class="ml-5 list-disc space-y-1 text-sm opacity-90">
          <li>Changes save automatically</li>
          <li>Theme syncs across all workspaces</li>
          <li>Font scale affects all text</li>
        </ul>
      </section>
    </div>
  );

  return (
    <ForgeShell title="The Ember" rightPanel={RightPanel}>
      {/* Breadcrumb Navigation */}
      <div class="mb-4">
        <A 
          href="/" 
          class="inline-flex items-center gap-2 text-sm text-[rgb(var(--forge-brass))] hover:underline"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Hearth
        </A>
      </div>

      {/* Header */}
      <header class="mb-6">
        <h1 class="font-cinzel-decorative text-3xl tracking-wide text-[rgb(var(--fg))] mb-2">
          THE EMBER
        </h1>
        <p class="text-sm opacity-80">
          Customize your AuthorForge experience with themes, preferences, and settings.
        </p>
      </header>

      {/* Tab Navigation */}
      <div class="flex gap-2 mb-6 border-b border-[rgb(var(--forge-steel))/0.3] pb-2 overflow-x-auto">
        <For each={tabs}>
          {(tab) => {
            const Icon = tab.icon;
            const isActive = activeTab() === tab.id;
            return (
              <button
                onClick={() => setActiveTab(tab.id)}
                class={`px-4 py-2 rounded-t-lg border-b-2 transition-all flex items-center gap-2 whitespace-nowrap
                  ${isActive
                    ? "border-[rgb(var(--forge-ember))] text-[rgb(var(--forge-ember))] bg-[rgb(var(--forge-ember))/0.1]"
                    : "border-transparent text-[rgb(var(--fg))]/60 hover:text-[rgb(var(--fg))] hover:bg-white/5"
                  }`}
                title={tab.description}
              >
                <Icon class="w-4 h-4" />
                <span class="text-sm font-medium">{tab.label}</span>
              </button>
            );
          }}
        </For>
      </div>

      {/* Tab Content */}
      <div class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 p-6">
        <Show when={activeTab() === "appearance"}>
          <AppearanceTab theme={theme} toggle={toggle} fontScaleKey={fontScaleKey} />
        </Show>

        <Show when={activeTab() === "preferences"}>
          <PreferencesTab />
        </Show>

        <Show when={activeTab() === "shortcuts"}>
          <ShortcutsTab />
        </Show>

        <Show when={activeTab() === "account"}>
          <AccountTab />
        </Show>

        <Show when={activeTab() === "about"}>
          <AboutTab />
        </Show>
      </div>
    </ForgeShell>
  );
}

// ============================================================================
// Appearance Tab
// ============================================================================

interface AppearanceTabProps {
  theme: () => "light" | "dark";
  toggle: () => void;
  fontScaleKey: () => FontScaleKey;
}

function AppearanceTab(props: AppearanceTabProps) {
  const fontScales: { key: FontScaleKey; label: string; description: string }[] = [
    { key: "small", label: "Small", description: "Compact text (90%)" },
    { key: "normal", label: "Normal", description: "Default size (100%)" },
    { key: "large", label: "Large", description: "Comfortable reading (120%)" },
    { key: "xlarge", label: "Extra Large", description: "Maximum readability (140%)" },
  ];

  return (
    <div class="space-y-8">
      <section>
        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
          Appearance Settings
        </h3>
        <p class="text-sm text-[rgb(var(--fg))]/70 mb-6">
          Customize the visual appearance of AuthorForge to match your preferences.
        </p>

        {/* Theme Selection */}
        <div class="mb-8">
          <h4 class="font-semibold mb-3">Color Theme</h4>
          <div class="grid grid-cols-2 gap-4">
            {/* Light Theme */}
            <button
              onClick={() => props.theme() === "dark" && props.toggle()}
              class={`p-4 rounded-xl border-2 transition-all text-left
                ${props.theme() === "light"
                  ? "border-[rgb(var(--forge-ember))] bg-[rgb(var(--forge-ember))/0.1]"
                  : "border-[rgb(var(--forge-steel))/0.3] hover:border-[rgb(var(--forge-brass))/0.5]"
                }`}
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <Sun class="w-5 h-5" />
                  <span class="font-medium">Light Mode</span>
                </div>
                <Show when={props.theme() === "light"}>
                  <Check class="w-5 h-5 text-[rgb(var(--forge-ember))]" />
                </Show>
              </div>
              <p class="text-xs text-[rgb(var(--fg))]/60">
                Bright and clean interface for daytime work
              </p>
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => props.theme() === "light" && props.toggle()}
              class={`p-4 rounded-xl border-2 transition-all text-left
                ${props.theme() === "dark"
                  ? "border-[rgb(var(--forge-ember))] bg-[rgb(var(--forge-ember))/0.1]"
                  : "border-[rgb(var(--forge-steel))/0.3] hover:border-[rgb(var(--forge-brass))/0.5]"
                }`}
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <Moon class="w-5 h-5" />
                  <span class="font-medium">Dark Mode</span>
                </div>
                <Show when={props.theme() === "dark"}>
                  <Check class="w-5 h-5 text-[rgb(var(--forge-ember))]" />
                </Show>
              </div>
              <p class="text-xs text-[rgb(var(--fg))]/60">
                Easy on the eyes for extended writing sessions
              </p>
            </button>
          </div>
        </div>

        {/* Font Scale */}
        <div>
          <h4 class="font-semibold mb-3 flex items-center gap-2">
            <Type class="w-4 h-4" />
            Font Scale
          </h4>
          <p class="text-sm text-[rgb(var(--fg))]/70 mb-4">
            Adjust the base font size across the entire application.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <For each={fontScales}>
              {(scale) => (
                <button
                  onClick={() => setGlobalFontScale(scale.key)}
                  class={`p-3 rounded-lg border-2 transition-all text-left
                    ${props.fontScaleKey() === scale.key
                      ? "border-[rgb(var(--forge-ember))] bg-[rgb(var(--forge-ember))/0.1]"
                      : "border-[rgb(var(--forge-steel))/0.3] hover:border-[rgb(var(--forge-brass))/0.5]"
                    }`}
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium text-sm">{scale.label}</span>
                    <Show when={props.fontScaleKey() === scale.key}>
                      <Check class="w-4 h-4 text-[rgb(var(--forge-ember))]" />
                    </Show>
                  </div>
                  <p class="text-xs text-[rgb(var(--fg))]/60">
                    {scale.description}
                  </p>
                </button>
              )}
            </For>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// Preferences Tab
// ============================================================================

function PreferencesTab() {
  return (
    <div class="space-y-6">
      <section>
        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layout class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
          UI Preferences
        </h3>
        <p class="text-sm text-[rgb(var(--fg))]/70 mb-6">
          Configure layout and behavior options for your workspace.
        </p>

        <div class="space-y-4">
          {/* Panel Persistence */}
          <div class="p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <h4 class="font-semibold mb-2">Panel Persistence</h4>
            <p class="text-sm text-[rgb(var(--fg))]/70 mb-3">
              Left and right panels remember their open/closed state across sessions.
            </p>
            <div class="flex items-center gap-2">
              <span class="text-xs text-[rgb(var(--forge-brass))]">✓ Enabled by default</span>
            </div>
          </div>

          {/* Auto-save */}
          <div class="p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5">
            <h4 class="font-semibold mb-2">Auto-save</h4>
            <p class="text-sm text-[rgb(var(--fg))]/70 mb-3">
              Automatically save your work as you type.
            </p>
            <div class="flex items-center gap-2">
              <span class="text-xs text-[rgb(var(--forge-brass))]">✓ Enabled by default</span>
            </div>
          </div>

          {/* Coming Soon */}
          <div class="p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3] bg-white/40 dark:bg-white/5 opacity-60">
            <h4 class="font-semibold mb-2">More Preferences Coming Soon</h4>
            <p class="text-sm text-[rgb(var(--fg))]/70">
              Additional UI customization options will be added in future updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// Shortcuts Tab
// ============================================================================

function ShortcutsTab() {
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
        { keys: ["Ctrl/Cmd", "B"], description: "Bold" },
        { keys: ["Ctrl/Cmd", "I"], description: "Italic" },
        { keys: ["Ctrl/Cmd", "U"], description: "Underline" },
        { keys: ["Ctrl/Cmd", "K"], description: "Insert Link" },
        { keys: ["Ctrl/Cmd", "Shift", "F"], description: "Focus Mode" },
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
      ]
    },
  ];

  return (
    <div class="space-y-6">
      <section>
        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <Keyboard class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
          Keyboard Shortcuts
        </h3>
        <p class="text-sm text-[rgb(var(--fg))]/70 mb-6">
          Speed up your workflow with these keyboard shortcuts.
        </p>

        <div class="space-y-6">
          <For each={shortcuts}>
            {(section) => (
              <div>
                <h4 class="font-semibold mb-3 text-[rgb(var(--forge-brass))]">
                  {section.category}
                </h4>
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

        <div class="mt-6 p-4 rounded-lg border border-[rgb(var(--forge-brass))/0.3]
                    bg-[rgb(var(--forge-brass))/0.05]">
          <p class="text-sm text-[rgb(var(--fg))]/70">
            <strong>Note:</strong> Keyboard shortcuts are currently read-only.
            Customization will be available in a future update.
          </p>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// Account Tab
// ============================================================================

function AccountTab() {
  return (
    <div class="space-y-6">
      <section>
        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <User class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
          Account Settings
        </h3>
        <p class="text-sm text-[rgb(var(--fg))]/70 mb-6">
          Manage your AuthorForge account and profile.
        </p>

        {/* User Profile */}
        <div class="p-6 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(var(--forge-ember))]
                        to-[rgb(var(--forge-brass))] flex items-center justify-center">
              <User class="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-lg">Author</h4>
              <p class="text-sm text-[rgb(var(--fg))]/60">Local Account</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value="Author"
                class="w-full px-3 py-2 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                       bg-transparent focus:outline-none focus:border-[rgb(var(--forge-brass))]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Email (Optional)</label>
              <input
                type="email"
                class="w-full px-3 py-2 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                       bg-transparent focus:outline-none focus:border-[rgb(var(--forge-brass))]"
                placeholder="your.email@example.com"
              />
            </div>

            <button class="px-4 py-2 rounded-lg bg-gradient-to-b from-[rgb(var(--forge-ember))]/20
                           to-transparent border border-[rgb(var(--forge-ember))/0.3]
                           hover:from-[rgb(var(--forge-ember))]/30 transition-all">
              Save Changes
            </button>
          </div>
        </div>

        {/* Data & Privacy */}
        <div class="mt-6 p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5">
          <h4 class="font-semibold mb-2">Data & Privacy</h4>
          <p class="text-sm text-[rgb(var(--fg))]/70 mb-3">
            AuthorForge stores all data locally on your device. No cloud sync or external
            services are used by default.
          </p>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 rounded-md border border-[rgb(var(--forge-steel))/0.3]
                           hover:border-[rgb(var(--forge-brass))/0.5] text-sm">
              Export Data
            </button>
            <button class="px-3 py-1.5 rounded-md border border-[rgb(var(--forge-steel))/0.3]
                           hover:border-[rgb(var(--forge-brass))/0.5] text-sm">
              Clear Cache
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// About Tab
// ============================================================================

function AboutTab() {
  return (
    <div class="space-y-6">
      <section>
        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <Info class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
          About AuthorForge
        </h3>

        {/* App Info */}
        <div class="p-6 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5 text-center">
          <div class="mb-4">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[rgb(var(--forge-ember))]
                        to-[rgb(var(--forge-brass))] flex items-center justify-center mb-4">
              <span class="text-4xl">🔥</span>
            </div>
            <h4 class="font-cinzel-decorative text-2xl mb-2">AuthorForge</h4>
            <p class="text-sm text-[rgb(var(--fg))]/60">Version 0.1.0 (Alpha)</p>
          </div>

          <p class="text-sm text-[rgb(var(--fg))]/70 mb-4">
            A powerful desktop application for authors to craft, structure, and refine their stories.
          </p>

          <div class="flex justify-center gap-3">
            <A
              href="/about"
              class="px-4 py-2 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                     hover:border-[rgb(var(--forge-brass))/0.5] text-sm transition-all"
            >
              Learn More
            </A>
            <button class="px-4 py-2 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                           hover:border-[rgb(var(--forge-brass))/0.5] text-sm">
              Check for Updates
            </button>
          </div>
        </div>

        {/* Tech Stack */}
        <div class="p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5">
          <h4 class="font-semibold mb-3">Built With</h4>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-[rgb(var(--forge-brass))]">⚡</span>
              <span>SolidJS + SolidStart</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[rgb(var(--forge-brass))]">🎨</span>
              <span>TailwindCSS</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[rgb(var(--forge-brass))]">🦀</span>
              <span>Rust + Tauri</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[rgb(var(--forge-brass))]">📝</span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>

        {/* License */}
        <div class="p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5">
          <h4 class="font-semibold mb-2">License</h4>
          <p class="text-sm text-[rgb(var(--fg))]/70">
            AuthorForge is open-source software. See the LICENSE file for details.
          </p>
        </div>

        {/* Credits */}
        <div class="p-4 rounded-lg border border-[rgb(var(--forge-steel))/0.3]
                    bg-white/40 dark:bg-white/5">
          <h4 class="font-semibold mb-2">Credits</h4>
          <p class="text-sm text-[rgb(var(--fg))]/70">
            Icons by <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer"
                        class="text-[rgb(var(--forge-brass))] hover:underline">Lucide</a>
          </p>
        </div>
      </section>
    </div>
  );
}

