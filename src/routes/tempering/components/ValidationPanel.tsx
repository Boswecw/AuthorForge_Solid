/**
 * AuthorForge Tempering Module - Validation Panel
 *
 * Displays real-time statistics and validation messages for the export profile.
 * Shows word count, page count, chapter/scene counts, errors, warnings, and info messages.
 */

import { Show, For } from "solid-js";
import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ExportProfile,
} from "~/lib/types/tempering";

// ============================================================================
// Types
// ============================================================================

interface ContentStats {
  wordCount: number;
  pageCount: number;
  chapterCount: number;
  sceneCount: number;
}

interface ValidationPanelProps {
  profile: ExportProfile | null;
  validation: ValidationResult;
  stats?: ContentStats; // Optional - will be calculated from project content
}

// ============================================================================
// Main Component
// ============================================================================

export function ValidationPanel(props: ValidationPanelProps) {
  // Default stats if not provided
  const stats = () => props.stats || {
    wordCount: 0,
    pageCount: 0,
    chapterCount: 0,
    sceneCount: 0,
  };

  // Calculate estimated page count based on word count and formatting
  const estimatedPages = () => {
    if (!props.profile) return 0;
    const wordsPerPage = calculateWordsPerPage(props.profile);
    return Math.ceil(stats().wordCount / wordsPerPage);
  };

  return (
    <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div class="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700 px-6 py-4">
        <h2 class="text-xl font-semibold text-cyan-400">
          📊 Validation & Statistics
        </h2>
      </div>

      <div class="p-6 space-y-6">
        {/* Statistics Section */}
        <div>
          <h3 class="text-sm font-semibold text-slate-300 mb-3">Content Statistics</h3>
          <div class="grid grid-cols-2 gap-4">
            <StatCard
              icon="📝"
              label="Words"
              value={stats().wordCount.toLocaleString()}
              color="text-blue-400"
            />
            <StatCard
              icon="📄"
              label="Est. Pages"
              value={estimatedPages().toLocaleString()}
              color="text-cyan-400"
            />
            <StatCard
              icon="📚"
              label="Chapters"
              value={stats().chapterCount.toLocaleString()}
              color="text-purple-400"
            />
            <StatCard
              icon="🎬"
              label="Scenes"
              value={stats().sceneCount.toLocaleString()}
              color="text-pink-400"
            />
          </div>
        </div>

        {/* Validation Status */}
        <div>
          <h3 class="text-sm font-semibold text-slate-300 mb-3">Validation Status</h3>
          <div class="bg-slate-700/50 rounded-lg p-4">
            <Show
              when={props.validation.isValid}
              fallback={
                <div class="flex items-center gap-3">
                  <span class="text-2xl">⚠️</span>
                  <div>
                    <div class="text-sm font-semibold text-red-400">
                      Profile has validation errors
                    </div>
                    <div class="text-xs text-slate-400 mt-1">
                      Fix errors below before exporting
                    </div>
                  </div>
                </div>
              }
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">✅</span>
                <div>
                  <div class="text-sm font-semibold text-green-400">
                    Profile is valid
                  </div>
                  <div class="text-xs text-slate-400 mt-1">
                    Ready to export
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Errors */}
        <Show when={props.validation.errors.length > 0}>
          <div>
            <h3 class="text-sm font-semibold text-red-400 mb-3">
              ❌ Errors ({props.validation.errors.length})
            </h3>
            <div class="space-y-2">
              <For each={props.validation.errors}>
                {(error) => <MessageCard message={error} type="error" />}
              </For>
            </div>
          </div>
        </Show>

        {/* Warnings */}
        <Show when={props.validation.warnings.length > 0}>
          <div>
            <h3 class="text-sm font-semibold text-amber-400 mb-3">
              ⚠️ Warnings ({props.validation.warnings.length})
            </h3>
            <div class="space-y-2">
              <For each={props.validation.warnings}>
                {(warning) => <MessageCard message={warning} type="warning" />}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

// ============================================================================
// Stat Card Component
// ============================================================================

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

function StatCard(props: StatCardProps) {
  return (
    <div class="bg-slate-700/50 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">{props.icon}</span>
        <div class="flex-1">
          <div class="text-xs text-slate-400">{props.label}</div>
          <div class={`text-lg font-bold ${props.color}`}>{props.value}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Message Card Component
// ============================================================================

interface MessageCardProps {
  message: ValidationError | ValidationWarning;
  type: "error" | "warning";
}

function MessageCard(props: MessageCardProps) {
  const bgColor = props.type === "error" ? "bg-red-500/10" : "bg-amber-500/10";
  const borderColor = props.type === "error" ? "border-red-500/30" : "border-amber-500/30";
  const textColor = props.type === "error" ? "text-red-400" : "text-amber-400";
  const icon = props.type === "error" ? "❌" : "⚠️";

  return (
    <div class={`${bgColor} border ${borderColor} rounded-lg p-3`}>
      <div class="flex items-start gap-3">
        <span class="text-lg flex-shrink-0">{icon}</span>
        <div class="flex-1 min-w-0">
          <div class={`text-sm font-medium ${textColor}`}>
            {props.message.message}
          </div>
          <div class="text-xs text-slate-500 mt-1">
            Field: {props.message.field}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculates estimated words per page based on profile formatting settings.
 * This is a rough estimate based on standard publishing metrics.
 */
function calculateWordsPerPage(profile: ExportProfile): number {
  const { formatting, layout } = profile;

  // Base words per page for standard formatting
  let wordsPerPage = 250;

  // Adjust for font size
  if (formatting.fontSize < 11) {
    wordsPerPage = 300;
  } else if (formatting.fontSize > 13) {
    wordsPerPage = 200;
  }

  // Adjust for line spacing
  if (formatting.lineSpacing >= 2.0) {
    wordsPerPage *= 0.8; // Double-spaced reduces words per page
  } else if (formatting.lineSpacing <= 1.2) {
    wordsPerPage *= 1.2; // Single-spaced increases words per page
  }

  // Adjust for page size
  if (layout.pageSize === "a5") {
    wordsPerPage *= 0.6; // Smaller page
  } else if (layout.pageSize === "a4") {
    wordsPerPage *= 1.1; // Slightly larger than letter
  }

  // Adjust for margins (larger margins = fewer words)
  const avgMargin = (layout.marginTop + layout.marginBottom + layout.marginLeft + layout.marginRight) / 4;
  if (avgMargin > 1.25) {
    wordsPerPage *= 0.85;
  } else if (avgMargin < 0.75) {
    wordsPerPage *= 1.15;
  }

  return Math.round(wordsPerPage);
}

