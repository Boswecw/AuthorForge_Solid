/**
 * AuthorForge Tempering Module - Main Page
 *
 * The Tempering page is the export/publishing interface for AuthorForge.
 * It provides two modes:
 * - Quick: Rapid exports with saved profiles
 * - Detailed: Full control over all export settings
 *
 * NOTE: This page uses Tauri APIs which are client-only.
 * The hooks handle SSR gracefully with isServer checks.
 */

import { createSignal, Show, For, createMemo, lazy, Suspense } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { useExportProfiles } from "./hooks/useExportProfiles";
import { useExportJob } from "./hooks/useExportJob";
import { useValidation } from "./hooks/useValidation";
import {
  PHASE_DISPLAY,
  type ExportProfile,
  type ExportJob,
  type ExportPhase,
  type UpdateProfileRequest,
  type ValidationResult,
} from "~/lib/types/tempering";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { useToast, useErrorToast } from "~/lib/hooks/useToast";

// Lazy load heavy panel components for better initial load performance
const ProfileEditorPanel = lazy(() =>
  import("./components/ProfileEditorPanel").then((m) => ({
    default: m.ProfileEditorPanel,
  }))
);
const ValidationPanel = lazy(() =>
  import("./components/ValidationPanel").then((m) => ({
    default: m.ValidationPanel,
  }))
);
const AssetBindingPanel = lazy(() =>
  import("./components/AssetBindingPanel").then((m) => ({
    default: m.AssetBindingPanel,
  }))
);
const LivePreviewPanel = lazy(() =>
  import("./components/LivePreviewPanel").then((m) => ({
    default: m.LivePreviewPanel,
  }))
);

// ============================================================================
// Main Component
// ============================================================================

export default function TemperingPage() {
  const params = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const handleError = useErrorToast();

  // View mode: quick or detailed
  const [viewMode, setViewMode] = createSignal<"quick" | "detailed">("quick");

  // Selected profile ID
  const [selectedProfileId, setSelectedProfileId] = createSignal<string | null>(null);

  // Export profiles hook
  const {
    profiles,
    selectedProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
    duplicateProfile,
    loading: profilesLoading,
    error: profilesError,
  } = useExportProfiles(params.projectId);

  // Export job hook
  const {
    currentJob,
    isRunning,
    canCancel,
    startExport,
    cancelExport,
    clearJob,
    getProgress,
    getPhase,
    isComplete,
    isFailed,
  } = useExportJob();

  // Validation hook with debouncing (300ms default)
  const { validation, isValid } = useValidation(() => selectedProfile());
  
  // Sync selected profile ID with hook
  const handleSelectProfile = (id: string | null) => {
    setSelectedProfileId(id);
    selectProfile(id);
  };

  // Wrapper for updateProfile that returns void
  const handleUpdateProfile = async (
    id: string,
    updates: UpdateProfileRequest
  ) => {
    try {
      await updateProfile(id, updates);
      toast.success("Profile updated successfully");
    } catch (error) {
      handleError(error, "Failed to update profile");
    }
  };

  // Start export handler
  const handleStartExport = async () => {
    const profile = selectedProfile();
    if (!profile) {
      toast.warning("Please select a profile first");
      return;
    }
    if (!isValid()) {
      toast.error("Profile has validation errors. Please fix them before exporting.");
      return;
    }

    try {
      await startExport(params.projectId, profile.id);
      toast.success("Export started successfully");
    } catch (error) {
      handleError(error, "Failed to start export");
    }
  };

  // Cancel export handler
  const handleCancelExport = async () => {
    try {
      await cancelExport();
      toast.info("Export cancelled");
    } catch (error) {
      handleError(error, "Failed to cancel export");
    }
  };
  
  // Get current phase display info
  const currentPhaseDisplay = createMemo(() => {
    const phase = getPhase();
    return phase ? PHASE_DISPLAY[phase] : null;
  });
  
  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <header class="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                class="text-slate-400 hover:text-slate-200 transition-colors"
              >
                ← Back
              </button>
              <h1 class="text-2xl font-bold text-amber-400">
                🔥 Tempering Forge
              </h1>
              <p class="text-slate-400">Export & Publishing</p>
            </div>
            
            {/* View Mode Toggle */}
            <div class="flex gap-2 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("quick")}
                class={`px-4 py-2 rounded-md transition-all ${
                  viewMode() === "quick"
                    ? "bg-amber-500 text-slate-900 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚡ Quick Export
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                class={`px-4 py-2 rounded-md transition-all ${
                  viewMode() === "detailed"
                    ? "bg-amber-500 text-slate-900 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                🔧 Detailed Settings
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main class="container mx-auto px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Profile Selection */}
          <div class="lg:col-span-1">
            <ProfileSelector
              profiles={profiles()}
              selectedProfileId={selectedProfileId()}
              onSelectProfile={handleSelectProfile}
              loading={profilesLoading()}
            />
          </div>
          
          {/* Middle Panel: Settings or Quick Export */}
          <div class="lg:col-span-1">
            <Show
              when={viewMode() === "quick"}
              fallback={
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
                        <div class="flex items-center gap-3 text-slate-400">
                          <div class="animate-spin">⚙️</div>
                          <span>Loading editor...</span>
                        </div>
                      </div>
                    }
                  >
                    <ProfileEditorPanel
                      profile={selectedProfile()}
                      onUpdateProfile={updateProfile}
                    />
                  </Suspense>
                </ErrorBoundary>
              }
            >
              <QuickExport
                profile={selectedProfile()}
                validation={validation()}
                onStartExport={handleStartExport}
                disabled={!isValid() || isRunning()}
              />
            </Show>
          </div>
          
          {/* Right Panel: Export Progress */}
          <div class="lg:col-span-1">
            <ExportProgress
              job={currentJob()}
              isRunning={isRunning()}
              canCancel={canCancel()}
              progress={getProgress()}
              phaseDisplay={currentPhaseDisplay()}
              onCancel={handleCancelExport}
              onClear={clearJob}
              isComplete={isComplete()}
              isFailed={isFailed()}
            />
          </div>
        </div>

        {/* Validation, Asset Binding, and Live Preview Panels */}
        <Show when={selectedProfile()}>
          {(profile) => (
            <ErrorBoundary
              onError={(error) => {
                console.error("[Tempering] Panel error:", error);
                toast.error("A panel encountered an error. Please refresh the page.");
              }}
            >
              <Suspense
                fallback={
                  <div class="mt-6 bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <div class="flex items-center gap-3 text-slate-400">
                      <div class="animate-spin">⚙️</div>
                      <span>Loading panels...</span>
                    </div>
                  </div>
                }
              >
                {/* Validation Panel */}
                <div class="mt-6">
                  <ValidationPanel
                    profile={profile()}
                    validation={validation()}
                  />
                </div>

                {/* Asset Binding Panel */}
                <div class="mt-6">
                  <AssetBindingPanel
                    profile={profile()}
                    onUpdateProfile={handleUpdateProfile}
                  />
                </div>

                {/* Live Preview Panel */}
                <div class="mt-6">
                  <LivePreviewPanel profile={profile()} />
                </div>
              </Suspense>
            </ErrorBoundary>
          )}
        </Show>
      </main>
    </div>
  );
}

// ============================================================================
// Profile Selector Component
// ============================================================================

interface ProfileSelectorProps {
  profiles: ExportProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string | null) => void;
  loading: boolean;
}

function ProfileSelector(props: ProfileSelectorProps) {
  return (
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 class="text-xl font-semibold text-amber-400 mb-4">
        📋 Export Profiles
      </h2>
      
      <Show when={props.loading}>
        <div class="text-slate-400 text-center py-8">Loading profiles...</div>
      </Show>
      
      <Show when={!props.loading && props.profiles.length === 0}>
        <div class="text-slate-400 text-center py-8">
          No profiles yet. Create your first profile!
        </div>
      </Show>
      
      <Show when={!props.loading && props.profiles.length > 0}>
        <div class="space-y-2">
          <For each={props.profiles}>
            {(profile) => (
              <button
                onClick={() => props.onSelectProfile(profile.id)}
                class={`w-full text-left p-4 rounded-lg border transition-all ${
                  props.selectedProfileId === profile.id
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-slate-600 hover:border-slate-500 bg-slate-700/50"
                }`}
              >
                <div class="font-semibold text-slate-100">{profile.name}</div>
                <div class="text-sm text-slate-400 mt-1">
                  {profile.kind} → {profile.format.toUpperCase()}
                </div>
                <Show when={profile.isDefault}>
                  <span class="inline-block mt-2 px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded">
                    Default
                  </span>
                </Show>
              </button>
            )}
          </For>
        </div>
      </Show>
      
      <button
        class="w-full mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
      >
        + New Profile
      </button>
    </div>
  );
}

// ============================================================================
// Quick Export Component
// ============================================================================

interface QuickExportProps {
  profile: ExportProfile | null;
  validation: ValidationResult;
  onStartExport: () => void;
  disabled: boolean;
}

function QuickExport(props: QuickExportProps) {
  return (
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 class="text-xl font-semibold text-amber-400 mb-4">
        ⚡ Quick Export
      </h2>
      
      <Show
        when={props.profile}
        fallback={
          <div class="text-slate-400 text-center py-8">
            Select a profile to begin
          </div>
        }
      >
        <div class="space-y-4">
          {/* Profile Summary */}
          <div class="bg-slate-700/50 rounded-lg p-4">
            <h3 class="font-semibold text-slate-100 mb-2">
              {props.profile?.name}
            </h3>
            <div class="text-sm text-slate-400 space-y-1">
              <div>Format: {props.profile?.format.toUpperCase()}</div>
              <div>Kind: {props.profile?.kind}</div>
              <div>Font: {props.profile?.formatting.fontFamily}</div>
              <div>Size: {props.profile?.formatting.fontSize}pt</div>
            </div>
          </div>
          
          {/* Export Button */}
          <button
            onClick={props.onStartExport}
            disabled={props.disabled}
            class={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
              props.disabled
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 shadow-lg hover:shadow-xl"
            }`}
          >
            🔥 Start Export
          </button>
          
          {/* Validation Status */}
          <Show when={!props.validation.isValid}>
            <div class="text-sm text-red-400 text-center">
              ⚠️ Profile has validation errors
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

// ============================================================================
// Export Progress Component
// ============================================================================

interface ExportProgressProps {
  job: ExportJob | null;
  isRunning: boolean;
  canCancel: boolean;
  progress: number;
  phaseDisplay: (typeof PHASE_DISPLAY)[ExportPhase] | null;
  onCancel: () => void;
  onClear: () => void;
  isComplete: boolean;
  isFailed: boolean;
}

function ExportProgress(props: ExportProgressProps) {
  return (
    <div class="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h2 class="text-xl font-semibold text-amber-400 mb-4">
        📊 Export Progress
      </h2>
      
      <Show
        when={props.job}
        fallback={
          <div class="text-slate-400 text-center py-8">
            No active export
          </div>
        }
      >
        <div class="space-y-4">
          {/* Phase Display */}
          <Show when={props.phaseDisplay}>
            <div class="text-center">
              <div class="text-4xl mb-2">{props.phaseDisplay?.icon}</div>
              <div class={`text-lg font-semibold ${props.phaseDisplay?.color}`}>
                {props.phaseDisplay?.label}
              </div>
            </div>
          </Show>
          
          {/* Progress Bar */}
          <div class="bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${props.progress}%` }}
            />
          </div>
          
          <div class="text-center text-slate-400">
            {props.progress}%
          </div>
          
          {/* Action Buttons */}
          <div class="space-y-2">
            <Show when={props.canCancel}>
              <button
                onClick={props.onCancel}
                class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel Export
              </button>
            </Show>
            
            <Show when={props.isComplete || props.isFailed}>
              <button
                onClick={props.onClear}
                class="w-full px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-lg transition-colors"
              >
                Clear
              </button>
            </Show>
          </div>
          
          {/* Error Message */}
          <Show when={props.isFailed && props.job?.errorMessage}>
            <div class="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <div class="text-red-400 font-semibold mb-1">Export Failed</div>
              <div class="text-sm text-red-300">{props.job?.errorMessage}</div>
            </div>
          </Show>
          
          {/* Success Message */}
          <Show when={props.isComplete && props.job?.outputPath}>
            <div class="bg-green-500/10 border border-green-500 rounded-lg p-4">
              <div class="text-green-400 font-semibold mb-1">Export Complete!</div>
              <div class="text-sm text-green-300">
                Saved to: {props.job?.outputPath}
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}


