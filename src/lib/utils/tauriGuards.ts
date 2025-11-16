/**
 * AuthorForge - Tauri Environment Guards
 *
 * Reusable utilities for checking SSR and Tauri environment contexts.
 * Eliminates duplicated guard code across the codebase.
 */

import { isServer } from "solid-js/web";

// ============================================================================
// Custom Error Types
// ============================================================================

/**
 * Thrown when a Tauri-only operation is attempted in a non-Tauri environment.
 */
export class TauriEnvironmentError extends Error {
  constructor(operation: string) {
    super(`${operation} requires Tauri desktop environment`);
    this.name = "TauriEnvironmentError";
  }
}

/**
 * Thrown when a client-only operation is attempted during SSR.
 */
export class SSRError extends Error {
  constructor(operation: string) {
    super(`Cannot ${operation} during server-side rendering`);
    this.name = "SSRError";
  }
}

// ============================================================================
// Guard Functions
// ============================================================================

/**
 * Guards against SSR and non-Tauri environments.
 * Throws appropriate errors if checks fail.
 *
 * @param operation - Human-readable description of the operation being guarded
 * @throws {SSRError} If called during server-side rendering
 * @throws {TauriEnvironmentError} If called outside Tauri desktop environment
 *
 * @example
 * ```tsx
 * const createProfile = async (data: ProfileData) => {
 *   requireTauriEnvironment("create profile");
 *   return await invoke("create_export_profile", { data });
 * };
 * ```
 */
export function requireTauriEnvironment(operation: string): void {
  if (isServer) {
    throw new SSRError(operation);
  }

  if (typeof window === "undefined" || !("__TAURI__" in window)) {
    throw new TauriEnvironmentError(operation);
  }
}

/**
 * Checks if code is running in Tauri environment.
 * Returns false instead of throwing (for conditional logic).
 *
 * @returns {boolean} True if running in Tauri desktop app, false otherwise
 *
 * @example
 * ```tsx
 * const profiles = createResource(async () => {
 *   if (!isTauriEnvironment()) {
 *     console.warn("Using mock data");
 *     return MOCK_PROFILES;
 *   }
 *   return await invoke("get_export_profiles");
 * });
 * ```
 */
export function isTauriEnvironment(): boolean {
  if (isServer) return false;
  return typeof window !== "undefined" && "__TAURI__" in window;
}

/**
 * Checks if code is running on the client (not SSR).
 * Useful for client-only operations that don't require Tauri.
 *
 * @returns {boolean} True if running on client, false during SSR
 *
 * @example
 * ```tsx
 * createEffect(() => {
 *   if (!isClient()) return;
 *   localStorage.setItem("lastProfile", selectedId());
 * });
 * ```
 */
export function isClient(): boolean {
  return !isServer && typeof window !== "undefined";
}

/**
 * Guards against SSR for client-only operations.
 * Throws if called during server-side rendering.
 *
 * @param operation - Human-readable description of the operation being guarded
 * @throws {SSRError} If called during server-side rendering
 *
 * @example
 * ```tsx
 * const saveToLocalStorage = (key: string, value: string) => {
 *   requireClient("save to localStorage");
 *   localStorage.setItem(key, value);
 * };
 * ```
 */
export function requireClient(operation: string): void {
  if (isServer) {
    throw new SSRError(operation);
  }
}

