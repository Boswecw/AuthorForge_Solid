/**
 * AuthorForge Tempering Module - Profile Editor Panel
 *
 * Comprehensive tabbed interface for editing all export profile settings.
 * Provides four tabs: Basic, Formatting, Layout, and Structure.
 */

import { createSignal, Show, For } from "solid-js";
import type {
  ExportProfile,
  FormattingSettings,
  LayoutSettings,
  StructureSettings,
  UpdateProfileRequest,
} from "~/lib/types/tempering";

// ============================================================================
// Types
// ============================================================================

type TabId = "basic" | "formatting" | "layout" | "structure";

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

interface ProfileEditorPanelProps {
  profile: ExportProfile | null;
  onUpdateProfile: (id: string, updates: UpdateProfileRequest) => Promise<ExportProfile>;
}

// ============================================================================
// Main Component
// ============================================================================

export function ProfileEditorPanel(props: ProfileEditorPanelProps) {
  const [activeTab, setActiveTab] = createSignal<TabId>("basic");

  const tabs: Tab[] = [
    { id: "basic", label: "Basic", icon: "📝" },
    { id: "formatting", label: "Formatting", icon: "🎨" },
    { id: "layout", label: "Layout", icon: "📐" },
    { id: "structure", label: "Structure", icon: "🏗️" },
  ];

  // Update handlers for each section
  const updateBasic = async (name: string, description: string) => {
    if (!props.profile) return;
    await props.onUpdateProfile(props.profile.id, { name, description });
  };

  const updateFormatting = async (updates: Partial<FormattingSettings>) => {
    if (!props.profile) return;
    await props.onUpdateProfile(props.profile.id, { formatting: updates });
  };

  const updateLayout = async (updates: Partial<LayoutSettings>) => {
    if (!props.profile) return;
    await props.onUpdateProfile(props.profile.id, { layout: updates });
  };

  const updateStructure = async (updates: Partial<StructureSettings>) => {
    if (!props.profile) return;
    await props.onUpdateProfile(props.profile.id, { structure: updates });
  };

  return (
    <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div class="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-slate-700 px-6 py-4">
        <h2 class="text-xl font-semibold text-amber-400">
          🔧 Profile Editor
        </h2>
        <Show when={props.profile}>
          <p class="text-sm text-slate-400 mt-1">
            Editing: {props.profile?.name}
          </p>
        </Show>
      </div>

      <Show
        when={props.profile}
        fallback={
          <div class="text-slate-400 text-center py-12">
            Select a profile to edit
          </div>
        }
      >
        {/* Tab Navigation */}
        <div class="flex border-b border-slate-700 bg-slate-800/50">
          <For each={tabs}>
            {(tab) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                class={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab() === tab.id
                    ? "bg-slate-700 text-amber-400 border-b-2 border-amber-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <span class="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            )}
          </For>
        </div>

        {/* Tab Content */}
        <div class="p-6 max-h-[600px] overflow-y-auto">
          <Show when={activeTab() === "basic"}>
            <BasicTab profile={props.profile!} onUpdate={updateBasic} />
          </Show>
          <Show when={activeTab() === "formatting"}>
            <FormattingTab profile={props.profile!} onUpdate={updateFormatting} />
          </Show>
          <Show when={activeTab() === "layout"}>
            <LayoutTab profile={props.profile!} onUpdate={updateLayout} />
          </Show>
          <Show when={activeTab() === "structure"}>
            <StructureTab profile={props.profile!} onUpdate={updateStructure} />
          </Show>
        </div>
      </Show>
    </div>
  );
}

// ============================================================================
// Basic Tab
// ============================================================================

interface BasicTabProps {
  profile: ExportProfile;
  onUpdate: (name: string, description: string) => Promise<void>;
}

function BasicTab(props: BasicTabProps) {
  const [name, setName] = createSignal(props.profile.name);
  const [description, setDescription] = createSignal(props.profile.description || "");

  const handleSave = async () => {
    await props.onUpdate(name(), description());
  };

  return (
    <div class="space-y-6">
      {/* Profile Name */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Profile Name
        </label>
        <input
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          onBlur={handleSave}
          class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="e.g., Standard Manuscript"
        />
      </div>

      {/* Description */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <textarea
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
          onBlur={handleSave}
          rows={3}
          class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
          placeholder="Optional description of this profile..."
        />
      </div>

      {/* Profile Info (Read-only) */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-2">
        <h3 class="text-sm font-semibold text-amber-400 mb-3">Profile Information</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-slate-400">Kind:</span>
            <span class="ml-2 text-slate-200 font-medium">{props.profile.kind}</span>
          </div>
          <div>
            <span class="text-slate-400">Format:</span>
            <span class="ml-2 text-slate-200 font-medium">{props.profile.format.toUpperCase()}</span>
          </div>
          <div>
            <span class="text-slate-400">Created:</span>
            <span class="ml-2 text-slate-200">{new Date(props.profile.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span class="text-slate-400">Updated:</span>
            <span class="ml-2 text-slate-200">{new Date(props.profile.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Show when={props.profile.isDefault}>
          <div class="mt-3 pt-3 border-t border-slate-600">
            <span class="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
              ⭐ Default Profile
            </span>
          </div>
        </Show>
      </div>
    </div>
  );
}

// ============================================================================
// Formatting Tab
// ============================================================================

interface FormattingTabProps {
  profile: ExportProfile;
  onUpdate: (updates: Partial<FormattingSettings>) => Promise<void>;
}

function FormattingTab(props: FormattingTabProps) {
  const formatting = () => props.profile.formatting;

  const updateField = async <K extends keyof FormattingSettings>(
    field: K,
    value: FormattingSettings[K]
  ) => {
    await props.onUpdate({ [field]: value });
  };

  return (
    <div class="space-y-6">
      {/* Font Family */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Font Family
        </label>
        <select
          value={formatting().fontFamily}
          onChange={(e) => updateField("fontFamily", e.currentTarget.value)}
          class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Garamond">Garamond</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Font Size: {formatting().fontSize}pt
        </label>
        <input
          type="range"
          min="8"
          max="24"
          step="1"
          value={formatting().fontSize}
          onInput={(e) => updateField("fontSize", parseInt(e.currentTarget.value))}
          class="w-full"
        />
        <div class="flex justify-between text-xs text-slate-500 mt-1">
          <span>8pt</span>
          <span>24pt</span>
        </div>
      </div>

      {/* Line Spacing */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Line Spacing: {formatting().lineSpacing}
        </label>
        <input
          type="range"
          min="1.0"
          max="3.0"
          step="0.1"
          value={formatting().lineSpacing}
          onInput={(e) => updateField("lineSpacing", parseFloat(e.currentTarget.value))}
          class="w-full"
        />
        <div class="flex justify-between text-xs text-slate-500 mt-1">
          <span>Single</span>
          <span>Double</span>
          <span>Triple</span>
        </div>
      </div>

      {/* Paragraph Spacing */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Paragraph Spacing: {formatting().paragraphSpacing}pt
        </label>
        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={formatting().paragraphSpacing}
          onInput={(e) => updateField("paragraphSpacing", parseInt(e.currentTarget.value))}
          class="w-full"
        />
      </div>

      {/* Alignment */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Text Alignment
        </label>
        <div class="grid grid-cols-4 gap-2">
          <For each={["left", "center", "right", "justify"] as const}>
            {(align) => (
              <button
                onClick={() => updateField("alignment", align)}
                class={`px-4 py-2 rounded-lg border transition-all ${
                  formatting().alignment === align
                    ? "bg-amber-500 text-slate-900 border-amber-500 font-semibold"
                    : "bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500"
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* First Line Indent */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          First Line Indent: {formatting().firstLineIndent}"
        </label>
        <input
          type="range"
          min="0"
          max="1.0"
          step="0.1"
          value={formatting().firstLineIndent}
          onInput={(e) => updateField("firstLineIndent", parseFloat(e.currentTarget.value))}
          class="w-full"
        />
      </div>

      {/* Drop Caps */}
      <div class="flex items-center justify-between bg-slate-700/50 rounded-lg p-4">
        <div>
          <div class="text-sm font-medium text-slate-300">Drop Caps</div>
          <div class="text-xs text-slate-500 mt-1">Large first letter at chapter start</div>
        </div>
        <button
          onClick={() => updateField("dropCaps", !formatting().dropCaps)}
          class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            formatting().dropCaps ? "bg-amber-500" : "bg-slate-600"
          }`}
        >
          <span
            class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              formatting().dropCaps ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Layout Tab
// ============================================================================

interface LayoutTabProps {
  profile: ExportProfile;
  onUpdate: (updates: Partial<LayoutSettings>) => Promise<void>;
}

function LayoutTab(props: LayoutTabProps) {
  const layout = () => props.profile.layout;

  const updateField = async <K extends keyof LayoutSettings>(
    field: K,
    value: LayoutSettings[K]
  ) => {
    await props.onUpdate({ [field]: value });
  };

  return (
    <div class="space-y-6">
      {/* Page Size */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Page Size
        </label>
        <select
          value={layout().pageSize}
          onChange={(e) => updateField("pageSize", e.currentTarget.value as any)}
          class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
        >
          <option value="letter">Letter (8.5" × 11")</option>
          <option value="a4">A4 (210mm × 297mm)</option>
          <option value="a5">A5 (148mm × 210mm)</option>
          <option value="custom">Custom Size</option>
        </select>
      </div>

      {/* Custom Size (if selected) */}
      <Show when={layout().pageSize === "custom"}>
        <div class="grid grid-cols-2 gap-4 bg-slate-700/50 rounded-lg p-4">
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-2">
              Width (inches)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              step="0.1"
              value={layout().customWidth || 8.5}
              onInput={(e) => updateField("customWidth", parseFloat(e.currentTarget.value))}
              class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-2">
              Height (inches)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              step="0.1"
              value={layout().customHeight || 11}
              onInput={(e) => updateField("customHeight", parseFloat(e.currentTarget.value))}
              class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm"
            />
          </div>
        </div>
      </Show>

      {/* Margins */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-3">
          Margins (inches)
        </label>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Top</label>
            <input
              type="number"
              min="0.25"
              max="3"
              step="0.25"
              value={layout().marginTop}
              onInput={(e) => updateField("marginTop", parseFloat(e.currentTarget.value))}
              class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Bottom</label>
            <input
              type="number"
              min="0.25"
              max="3"
              step="0.25"
              value={layout().marginBottom}
              onInput={(e) => updateField("marginBottom", parseFloat(e.currentTarget.value))}
              class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Left</label>
            <input
              type="number"
              min="0.25"
              max="3"
              step="0.25"
              value={layout().marginLeft}
              onInput={(e) => updateField("marginLeft", parseFloat(e.currentTarget.value))}
              class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs text-slate-400 mb-1">Right</label>
            <input
              type="number"
              min="0.25"
              max="3"
              step="0.25"
              value={layout().marginRight}
              onInput={(e) => updateField("marginRight", parseFloat(e.currentTarget.value))}
              class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-slate-300">Header</div>
            <div class="text-xs text-slate-500 mt-1">Add header to each page</div>
          </div>
          <button
            onClick={() => updateField("headerEnabled", !layout().headerEnabled)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              layout().headerEnabled ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                layout().headerEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <Show when={layout().headerEnabled}>
          <input
            type="text"
            value={layout().headerContent || ""}
            onInput={(e) => updateField("headerContent", e.currentTarget.value)}
            placeholder="e.g., {author} - {title}"
            class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm"
          />
        </Show>
      </div>

      {/* Footer */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-slate-300">Footer</div>
            <div class="text-xs text-slate-500 mt-1">Add footer to each page</div>
          </div>
          <button
            onClick={() => updateField("footerEnabled", !layout().footerEnabled)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              layout().footerEnabled ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                layout().footerEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <Show when={layout().footerEnabled}>
          <input
            type="text"
            value={layout().footerContent || ""}
            onInput={(e) => updateField("footerContent", e.currentTarget.value)}
            placeholder="e.g., Copyright © {year}"
            class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm"
          />
        </Show>
      </div>

      {/* Page Numbers */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-slate-300">Page Numbers</div>
            <div class="text-xs text-slate-500 mt-1">Show page numbers</div>
          </div>
          <button
            onClick={() => updateField("pageNumbers", !layout().pageNumbers)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              layout().pageNumbers ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                layout().pageNumbers ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <Show when={layout().pageNumbers}>
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-slate-400 mb-2">Position</label>
              <select
                value={layout().pageNumberPosition}
                onChange={(e) => updateField("pageNumberPosition", e.currentTarget.value as any)}
                class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-2">Alignment</label>
              <div class="grid grid-cols-3 gap-2">
                <For each={["left", "center", "right"] as const}>
                  {(align) => (
                    <button
                      onClick={() => updateField("pageNumberAlignment", align)}
                      class={`px-3 py-2 rounded text-xs transition-all ${
                        layout().pageNumberAlignment === align
                          ? "bg-amber-500 text-slate-900 font-semibold"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

// ============================================================================
// Structure Tab
// ============================================================================

interface StructureTabProps {
  profile: ExportProfile;
  onUpdate: (updates: Partial<StructureSettings>) => Promise<void>;
}

function StructureTab(props: StructureTabProps) {
  const structure = () => props.profile.structure;

  const updateField = async <K extends keyof StructureSettings>(
    field: K,
    value: StructureSettings[K]
  ) => {
    await props.onUpdate({ [field]: value });
  };

  return (
    <div class="space-y-6">
      {/* Title Page */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-slate-300">Title Page</div>
            <div class="text-xs text-slate-500 mt-1">Include a title page at the beginning</div>
          </div>
          <button
            onClick={() => updateField("includeTitlePage", !structure().includeTitlePage)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              structure().includeTitlePage ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                structure().includeTitlePage ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <Show when={structure().includeTitlePage}>
          <input
            type="text"
            value={structure().titlePageTemplate || ""}
            onInput={(e) => updateField("titlePageTemplate", e.currentTarget.value)}
            placeholder="Custom template (optional)"
            class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm"
          />
        </Show>
      </div>

      {/* Table of Contents */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-slate-300">Table of Contents</div>
            <div class="text-xs text-slate-500 mt-1">Generate a table of contents</div>
          </div>
          <button
            onClick={() => updateField("includeTOC", !structure().includeTOC)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              structure().includeTOC ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                structure().includeTOC ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <Show when={structure().includeTOC}>
          <div>
            <label class="block text-xs text-slate-400 mb-2">
              TOC Depth: {structure().tocDepth} levels
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={structure().tocDepth}
              onInput={(e) => updateField("tocDepth", parseInt(e.currentTarget.value))}
              class="w-full"
            />
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>1</span>
              <span>6</span>
            </div>
          </div>
        </Show>
      </div>

      {/* Dedication */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-slate-300">Dedication</div>
            <div class="text-xs text-slate-500 mt-1">Include a dedication page</div>
          </div>
          <button
            onClick={() => updateField("includeDedication", !structure().includeDedication)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              structure().includeDedication ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                structure().includeDedication ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <Show when={structure().includeDedication}>
          <textarea
            value={structure().dedicationText || ""}
            onInput={(e) => updateField("dedicationText", e.currentTarget.value)}
            placeholder="For my family..."
            rows={3}
            class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm resize-none"
          />
        </Show>
      </div>

      {/* Acknowledgments */}
      <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-slate-300">Acknowledgments</div>
            <div class="text-xs text-slate-500 mt-1">Include an acknowledgments section</div>
          </div>
          <button
            onClick={() => updateField("includeAcknowledgments", !structure().includeAcknowledgments)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              structure().includeAcknowledgments ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                structure().includeAcknowledgments ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <Show when={structure().includeAcknowledgments}>
          <textarea
            value={structure().acknowledgmentsText || ""}
            onInput={(e) => updateField("acknowledgmentsText", e.currentTarget.value)}
            placeholder="I would like to thank..."
            rows={3}
            class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm resize-none"
          />
        </Show>
      </div>

      {/* Chapter Settings */}
      <div class="space-y-4">
        <h3 class="text-sm font-semibold text-amber-400">Chapter Settings</h3>

        {/* Chapter Break Style */}
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Chapter Break Style
          </label>
          <select
            value={structure().chapterBreakStyle}
            onChange={(e) => updateField("chapterBreakStyle", e.currentTarget.value as any)}
            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="page-break">Page Break</option>
            <option value="line-break">Line Break</option>
            <option value="decorative">Decorative Separator</option>
          </select>
        </div>

        {/* Chapter Numbering */}
        <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-slate-300">Chapter Numbering</div>
              <div class="text-xs text-slate-500 mt-1">Number chapters automatically</div>
            </div>
            <button
              onClick={() => updateField("chapterNumbering", !structure().chapterNumbering)}
              class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                structure().chapterNumbering ? "bg-amber-500" : "bg-slate-600"
              }`}
            >
              <span
                class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  structure().chapterNumbering ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <Show when={structure().chapterNumbering}>
            <div>
              <label class="block text-xs text-slate-400 mb-2">Number Format</label>
              <select
                value={structure().chapterNumberFormat}
                onChange={(e) => updateField("chapterNumberFormat", e.currentTarget.value as any)}
                class="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-slate-100 text-sm"
              >
                <option value="numeric">Numeric (1, 2, 3...)</option>
                <option value="roman">Roman (I, II, III...)</option>
                <option value="word">Word (One, Two, Three...)</option>
              </select>
            </div>
          </Show>
        </div>

        {/* Part Breaks */}
        <div class="flex items-center justify-between bg-slate-700/50 rounded-lg p-4">
          <div>
            <div class="text-sm font-medium text-slate-300">Part Breaks</div>
            <div class="text-xs text-slate-500 mt-1">For multi-part novels</div>
          </div>
          <button
            onClick={() => updateField("partBreaks", !structure().partBreaks)}
            class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              structure().partBreaks ? "bg-amber-500" : "bg-slate-600"
            }`}
          >
            <span
              class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                structure().partBreaks ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

