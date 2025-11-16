/**
 * AuthorForge Tempering Module - Export Job Hook
 *
 * Manages export job execution, monitoring, and progress tracking.
 * Handles real-time updates via Tauri events.
 */

import { createSignal, createEffect, onCleanup, Accessor } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import {
  requireTauriEnvironment,
  isTauriEnvironment,
} from "~/lib/utils/tauriGuards";
import type {
  ExportJob,
  ExportPhase,
  ExportLogEntry,
  StartExportRequest,
  StartExportResponse,
} from "../types/tempering";

// ============================================================================
// Types
// ============================================================================

interface UseExportJobReturn {
  // State
  currentJob: Accessor<ExportJob | null>;
  isRunning: Accessor<boolean>;
  canCancel: Accessor<boolean>;

  // Actions
  startExport: (
    projectId: string,
    profileId: string,
    outputPath?: string
  ) => Promise<string>;
  cancelExport: () => Promise<void>;
  clearJob: () => void;

  // Utilities
  getProgress: () => number;
  getPhase: () => ExportPhase | null;
  getLogs: () => ExportLogEntry[];
  isComplete: () => boolean;
  isFailed: () => boolean;
}

// Event payload types for Tauri events
interface ExportProgressEvent {
  jobId: string;
  phase: ExportPhase;
  progress: number;
  message?: string;
}

interface ExportLogEvent {
  jobId: string;
  log: ExportLogEntry;
}

interface ExportCompleteEvent {
  jobId: string;
  success: boolean;
  outputPath?: string;
  errorMessage?: string;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for managing export job execution and monitoring.
 *
 * Automatically subscribes to export progress events and updates state.
 * Cleans up event listeners on unmount.
 *
 * @returns Export job state and actions
 */
export function useExportJob(): UseExportJobReturn {
  // Current job state
  const [currentJob, setCurrentJob] = createSignal<ExportJob | null>(null);
  const [isRunning, setIsRunning] = createSignal(false);

  // Event listener cleanup functions
  let unlistenProgress: UnlistenFn | null = null;
  let unlistenLog: UnlistenFn | null = null;
  let unlistenComplete: UnlistenFn | null = null;

  // ============================================================================
  // Event Listeners
  // ============================================================================

  /**
   * Sets up event listeners for export progress updates.
   */
  const setupEventListeners = async () => {
    // Skip if not running in Tauri environment
    if (!isTauriEnvironment()) {
      console.warn(
        "Tauri runtime not detected - export functionality will be limited"
      );
      return;
    }

    try {
      // Listen for progress updates
      unlistenProgress = await listen<ExportProgressEvent>(
        "export-progress",
        (event) => {
          const job = currentJob();
          if (job && job.id === event.payload.jobId) {
            setCurrentJob({
              ...job,
              phase: event.payload.phase,
              progress: event.payload.progress,
            });
          }
        }
      );

      // Listen for log entries
      unlistenLog = await listen<ExportLogEvent>("export-log", (event) => {
        const job = currentJob();
        if (job && job.id === event.payload.jobId) {
          setCurrentJob({
            ...job,
            logs: [...job.logs, event.payload.log],
          });
        }
      });

      // Listen for completion
      unlistenComplete = await listen<ExportCompleteEvent>(
        "export-complete",
        (event) => {
          const job = currentJob();
          if (job && job.id === event.payload.jobId) {
            const now = new Date().toISOString();
            setCurrentJob({
              ...job,
              phase: event.payload.success ? "cooled" : "cracked",
              progress: event.payload.success ? 100 : job.progress,
              completedAt: now,
              outputPath: event.payload.outputPath,
              errorMessage: event.payload.errorMessage,
            });
            setIsRunning(false);
          }
        }
      );
    } catch (error) {
      console.error("Failed to setup export event listeners:", error);
    }
  };

  /**
   * Cleans up event listeners.
   */
  const cleanupEventListeners = () => {
    if (unlistenProgress) {
      unlistenProgress();
      unlistenProgress = null;
    }
    if (unlistenLog) {
      unlistenLog();
      unlistenLog = null;
    }
    if (unlistenComplete) {
      unlistenComplete();
      unlistenComplete = null;
    }
  };

  // Setup listeners on mount
  createEffect(() => {
    setupEventListeners();
  });

  // Cleanup on unmount
  onCleanup(() => {
    cleanupEventListeners();
  });

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Starts a new export job.
   *
   * @param projectId - The project to export
   * @param profileId - The export profile to use
   * @param outputPath - Optional custom output path
   * @returns The job ID
   */
  const startExport = async (
    projectId: string,
    profileId: string,
    outputPath?: string
  ): Promise<string> => {
    requireTauriEnvironment("start export");

    try {
      // Cancel any running job first
      if (isRunning()) {
        await cancelExport();
      }

      const request: StartExportRequest = {
        projectId,
        profileId,
        outputPath,
      };

      const response = await invoke<StartExportResponse>("start_export", {
        request,
      });

      // Initialize job state
      const now = new Date().toISOString();
      const newJob: ExportJob = {
        id: response.jobId,
        projectId,
        profileId,
        phase: "cold",
        progress: 0,
        startedAt: now,
        logs: [
          {
            timestamp: now,
            phase: "cold",
            message: "Export job initialized",
            level: "info",
          },
        ],
      };

      setCurrentJob(newJob);
      setIsRunning(true);

      return response.jobId;
    } catch (error) {
      console.error("Failed to start export:", error);
      setIsRunning(false);
      throw error;
    }
  };

  /**
   * Cancels the current export job.
   */
  const cancelExport = async (): Promise<void> => {
    requireTauriEnvironment("cancel export");

    const job = currentJob();
    if (!job || !isRunning()) {
      return;
    }

    try {
      await invoke("cancel_export", {
        jobId: job.id,
      });

      const now = new Date().toISOString();
      setCurrentJob({
        ...job,
        phase: "cracked",
        completedAt: now,
        errorMessage: "Export cancelled by user",
        logs: [
          ...job.logs,
          {
            timestamp: now,
            phase: "cracked",
            message: "Export cancelled by user",
            level: "warning",
          },
        ],
      });

      setIsRunning(false);
    } catch (error) {
      console.error("Failed to cancel export:", error);
      throw error;
    }
  };

  /**
   * Clears the current job state.
   */
  const clearJob = () => {
    setCurrentJob(null);
    setIsRunning(false);
  };

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Gets the current progress percentage (0-100).
   */
  const getProgress = (): number => {
    return currentJob()?.progress ?? 0;
  };

  /**
   * Gets the current export phase.
   */
  const getPhase = (): ExportPhase | null => {
    return currentJob()?.phase ?? null;
  };

  /**
   * Gets all log entries for the current job.
   */
  const getLogs = (): ExportLogEntry[] => {
    return currentJob()?.logs ?? [];
  };

  /**
   * Checks if the current job is complete (successfully).
   */
  const isComplete = (): boolean => {
    const job = currentJob();
    return job?.phase === "cooled";
  };

  /**
   * Checks if the current job has failed.
   */
  const isFailed = (): boolean => {
    const job = currentJob();
    return job?.phase === "cracked";
  };

  /**
   * Determines if the current job can be cancelled.
   */
  const canCancel = (): boolean => {
    return isRunning() && !isComplete() && !isFailed();
  };

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    currentJob,
    isRunning,
    canCancel,

    // Actions
    startExport,
    cancelExport,
    clearJob,

    // Utilities
    getProgress,
    getPhase,
    getLogs,
    isComplete,
    isFailed,
  };
}

// ============================================================================
// Standalone Job Query
// ============================================================================

/**
 * Fetches a specific export job by ID.
 * Useful for checking job status without subscribing to events.
 *
 * @param jobId - The job ID to fetch
 * @returns The export job
 */
export async function getExportJob(jobId: string): Promise<ExportJob> {
  try {
    return await invoke<ExportJob>("get_export_job", { jobId });
  } catch (error) {
    console.error("Failed to fetch export job:", error);
    throw error;
  }
}

/**
 * Fetches all export jobs for a project.
 *
 * @param projectId - The project ID
 * @returns Array of export jobs
 */
export async function getProjectExportJobs(
  projectId: string
): Promise<ExportJob[]> {
  try {
    return await invoke<ExportJob[]>("get_project_export_jobs", { projectId });
  } catch (error) {
    console.error("Failed to fetch project export jobs:", error);
    throw error;
  }
}
