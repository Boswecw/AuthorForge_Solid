/**
 * AuthorForge - Toast Notification Hook
 *
 * Provides a simple toast notification system for user feedback.
 */

import { createSignal, createRoot, onCleanup } from "solid-js";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Global toast state (created in a root to persist across components)
const createToastStore = () => {
  const [toasts, setToasts] = createSignal<Toast[]>([]);

  const addToast = (
    message: string,
    type: ToastType = "info",
    duration = 5000
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };
};

// Create global store
const toastStore = createRoot(createToastStore);

/**
 * Hook for using toast notifications
 *
 * Usage:
 * ```tsx
 * const toast = useToast();
 *
 * toast.success("Profile saved!");
 * toast.error("Failed to export");
 * toast.warning("Large file detected");
 * toast.info("Processing...");
 * ```
 */
export function useToast() {
  return {
    toasts: toastStore.toasts,
    success: (message: string, duration?: number) =>
      toastStore.addToast(message, "success", duration),
    error: (message: string, duration?: number) =>
      toastStore.addToast(message, "error", duration),
    warning: (message: string, duration?: number) =>
      toastStore.addToast(message, "warning", duration),
    info: (message: string, duration?: number) =>
      toastStore.addToast(message, "info", duration),
    remove: toastStore.removeToast,
    clear: toastStore.clearAll,
  };
}

/**
 * Hook for catching and displaying errors as toasts
 *
 * Usage:
 * ```tsx
 * const handleError = useErrorToast();
 *
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   handleError(error, "Failed to complete operation");
 * }
 * ```
 */
export function useErrorToast() {
  const toast = useToast();

  return (error: unknown, fallbackMessage = "An error occurred") => {
    const message =
      error instanceof Error ? error.message : fallbackMessage;
    toast.error(message);
    console.error(error);
  };
}

/**
 * Hook for async operations with toast feedback
 *
 * Usage:
 * ```tsx
 * const withToast = useAsyncToast();
 *
 * await withToast(
 *   async () => await saveProfile(),
 *   "Saving profile...",
 *   "Profile saved!",
 *   "Failed to save profile"
 * );
 * ```
 */
export function useAsyncToast() {
  const toast = useToast();

  return async <T,>(
    operation: () => Promise<T>,
    loadingMessage?: string,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    let loadingId: string | undefined;

    if (loadingMessage) {
      loadingId = toast.info(loadingMessage, 0); // 0 = don't auto-dismiss
    }

    try {
      const result = await operation();

      if (loadingId) toast.remove(loadingId);
      if (successMessage) toast.success(successMessage);

      return result;
    } catch (error) {
      if (loadingId) toast.remove(loadingId);

      const message =
        error instanceof Error
          ? error.message
          : errorMessage || "Operation failed";
      toast.error(message);

      throw error;
    }
  };
}

