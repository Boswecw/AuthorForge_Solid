/**
 * AuthorForge Tempering Module - Live Preview Panel
 *
 * Provides visual preview of formatted content with three modes:
 * - Cover: Title page with metadata
 * - First Page: Sample of formatted content
 * - Spread: Two-page view for print layout
 */

import { Show, Switch, Match, createSignal } from "solid-js";
import type { ExportProfile } from "~/lib/types/tempering";

// ============================================================================
// Types
// ============================================================================

type PreviewMode = "cover" | "first-page" | "spread";

interface LivePreviewPanelProps {
  profile: ExportProfile | null;
}

// ============================================================================
// Main Component
// ============================================================================

export function LivePreviewPanel(props: LivePreviewPanelProps) {
  const [previewMode, setPreviewMode] = createSignal<PreviewMode>("cover");
  const [zoom, setZoom] = createSignal(100);

  const zoomLevels = [50, 75, 100, 125, 150, 200];

  const handleZoomIn = () => {
    const currentIndex = zoomLevels.indexOf(zoom());
    if (currentIndex < zoomLevels.length - 1) {
      setZoom(zoomLevels[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomLevels.indexOf(zoom());
    if (currentIndex > 0) {
      setZoom(zoomLevels[currentIndex - 1]);
    }
  };

  const canZoomIn = () => zoom() < zoomLevels[zoomLevels.length - 1];
  const canZoomOut = () => zoom() > zoomLevels[0];

  return (
    <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-slate-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-green-400">👁️ Live Preview</h2>

          {/* Zoom Controls */}
          <div class="flex items-center gap-3">
            <button
              class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleZoomOut}
              disabled={!canZoomOut()}
            >
              🔍−
            </button>
            <span class="text-sm text-slate-300 min-w-[4rem] text-center">
              {zoom()}%
            </span>
            <button
              class="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleZoomIn}
              disabled={!canZoomIn()}
            >
              🔍+
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 space-y-6">
        {/* Mode Selector */}
        <div class="flex gap-2">
          <ModeButton
            mode="cover"
            label="Cover"
            icon="📕"
            isActive={previewMode() === "cover"}
            onClick={() => setPreviewMode("cover")}
          />
          <ModeButton
            mode="first-page"
            label="First Page"
            icon="📄"
            isActive={previewMode() === "first-page"}
            onClick={() => setPreviewMode("first-page")}
          />
          <ModeButton
            mode="spread"
            label="Spread"
            icon="📖"
            isActive={previewMode() === "spread"}
            onClick={() => setPreviewMode("spread")}
          />
        </div>

        {/* Preview Area */}
        <div class="bg-slate-900 rounded-lg p-8 min-h-[600px] flex items-center justify-center overflow-auto">
          <Show when={props.profile} fallback={<EmptyState />}>
            <div style={{ transform: `scale(${zoom() / 100})`, "transform-origin": "top center" }}>
              <Switch>
                <Match when={previewMode() === "cover"}>
                  <CoverPreview profile={props.profile!} />
                </Match>
                <Match when={previewMode() === "first-page"}>
                  <FirstPagePreview profile={props.profile!} />
                </Match>
                <Match when={previewMode() === "spread"}>
                  <SpreadPreview profile={props.profile!} />
                </Match>
              </Switch>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Mode Button Component
// ============================================================================

interface ModeButtonProps {
  mode: PreviewMode;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

function ModeButton(props: ModeButtonProps) {
  return (
    <button
      class={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        props.isActive
          ? "bg-green-500 text-white"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      }`}
      onClick={props.onClick}
    >
      <span>{props.icon}</span>
      <span class="text-sm font-medium">{props.label}</span>
    </button>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState() {
  return (
    <div class="text-center text-slate-400">
      <div class="text-6xl mb-4">📄</div>
      <div class="text-lg font-medium">No Profile Selected</div>
      <div class="text-sm mt-2">Select a profile to see a preview</div>
    </div>
  );
}

// ============================================================================
// Cover Preview Component
// ============================================================================

interface PreviewProps {
  profile: ExportProfile;
}

function CoverPreview(props: PreviewProps) {
  const coverImage = () => props.profile.imageBindings.find((img) => img.role === "cover");

  return (
    <div
      class="bg-white shadow-2xl"
      style={{
        width: getPageWidth(props.profile),
        height: getPageHeight(props.profile),
        padding: `${props.profile.layout.marginTop}in ${props.profile.layout.marginRight}in ${props.profile.layout.marginBottom}in ${props.profile.layout.marginLeft}in`,
      }}
    >
      <div class="h-full flex flex-col items-center justify-center text-center space-y-8">
        {/* Cover Image */}
        <Show when={coverImage()}>
          <img
            src={coverImage()!.filePath}
            alt={coverImage()!.altText || "Cover"}
            class="max-w-full max-h-48 object-contain"
          />
        </Show>

        {/* Title */}
        <div>
          <h1
            class="text-4xl font-bold mb-4"
            style={{
              "font-family": props.profile.formatting.fontFamily,
              color: "#000",
            }}
          >
            {props.profile.name}
          </h1>
          <Show when={props.profile.description}>
            <p
              class="text-lg text-gray-600"
              style={{
                "font-family": props.profile.formatting.fontFamily,
              }}
            >
              {props.profile.description}
            </p>
          </Show>
        </div>

        {/* Author Info (if manuscript) */}
        <Show when={props.profile.kindOptions.manuscriptHeader}>
          <div
            class="text-sm text-gray-700"
            style={{
              "font-family": props.profile.formatting.fontFamily,
            }}
          >
            <div class="font-semibold">
              {props.profile.kindOptions.manuscriptHeader!.authorName}
            </div>
            <div class="text-xs mt-1">
              {props.profile.kindOptions.manuscriptHeader!.contactInfo}
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

// ============================================================================
// First Page Preview Component
// ============================================================================

function FirstPagePreview(props: PreviewProps) {
  const sampleText = `Chapter 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.`;

  return (
    <div
      class="bg-white shadow-2xl"
      style={{
        width: getPageWidth(props.profile),
        height: getPageHeight(props.profile),
        padding: `${props.profile.layout.marginTop}in ${props.profile.layout.marginRight}in ${props.profile.layout.marginBottom}in ${props.profile.layout.marginLeft}in`,
      }}
    >
      {/* Header */}
      <Show when={props.profile.layout.headerEnabled}>
        <div
          class="text-xs text-gray-600 mb-4 pb-2 border-b border-gray-300"
          style={{
            "font-family": props.profile.formatting.fontFamily,
            "text-align": props.profile.layout.pageNumberPosition === "header"
              ? props.profile.layout.pageNumberAlignment
              : "center",
          }}
        >
          {props.profile.layout.headerContent || props.profile.name}
          <Show when={props.profile.layout.pageNumbers && props.profile.layout.pageNumberPosition === "header"}>
            {" • 1"}
          </Show>
        </div>
      </Show>

      {/* Content */}
      <div
        class="text-black whitespace-pre-wrap"
        style={{
          "font-family": props.profile.formatting.fontFamily,
          "font-size": `${props.profile.formatting.fontSize}pt`,
          "line-height": props.profile.formatting.lineSpacing,
          "text-align": props.profile.formatting.alignment,
          "text-indent": props.profile.formatting.firstLineIndent > 0
            ? `${props.profile.formatting.firstLineIndent}in`
            : "0",
        }}
      >
        {sampleText}
      </div>

      {/* Footer */}
      <Show when={props.profile.layout.footerEnabled || (props.profile.layout.pageNumbers && props.profile.layout.pageNumberPosition === "footer")}>
        <div
          class="text-xs text-gray-600 mt-4 pt-2 border-t border-gray-300"
          style={{
            "font-family": props.profile.formatting.fontFamily,
            "text-align": props.profile.layout.pageNumberAlignment,
          }}
        >
          <Show when={props.profile.layout.footerContent}>
            {props.profile.layout.footerContent}
          </Show>
          <Show when={props.profile.layout.pageNumbers && props.profile.layout.pageNumberPosition === "footer"}>
            1
          </Show>
        </div>
      </Show>
    </div>
  );
}

// ============================================================================
// Spread Preview Component
// ============================================================================

function SpreadPreview(props: PreviewProps) {
  return (
    <div class="flex gap-4">
      {/* Left Page */}
      <div
        class="bg-white shadow-2xl"
        style={{
          width: getPageWidth(props.profile),
          height: getPageHeight(props.profile),
          padding: `${props.profile.layout.marginTop}in ${props.profile.layout.marginRight}in ${props.profile.layout.marginBottom}in ${props.profile.layout.marginLeft}in`,
        }}
      >
        <div class="h-full flex items-center justify-center text-gray-400 text-sm">
          [Previous page content]
        </div>
      </div>

      {/* Right Page */}
      <FirstPagePreview profile={props.profile} />
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the page width based on profile settings.
 */
function getPageWidth(profile: ExportProfile): string {
  const { pageSize, customWidth } = profile.layout;

  if (pageSize === "custom" && customWidth) {
    return `${customWidth}in`;
  }

  const widths: Record<string, string> = {
    letter: "8.5in",
    a4: "8.27in",
    a5: "5.83in",
  };

  return widths[pageSize] || "8.5in";
}

/**
 * Gets the page height based on profile settings.
 */
function getPageHeight(profile: ExportProfile): string {
  const { pageSize, customHeight } = profile.layout;

  if (pageSize === "custom" && customHeight) {
    return `${customHeight}in`;
  }

  const heights: Record<string, string> = {
    letter: "11in",
    a4: "11.69in",
    a5: "8.27in",
  };

  return heights[pageSize] || "11in";
}




