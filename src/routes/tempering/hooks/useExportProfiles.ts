/**
 * AuthorForge Tempering Module - Export Profiles Hook
 *
 * Manages export profiles for a project, including CRUD operations
 * and profile selection state.
 */

import { createSignal, createResource, Accessor } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import {
  requireTauriEnvironment,
  isTauriEnvironment,
} from "~/lib/utils/tauriGuards";
import type {
  ExportProfile,
  ExportKind,
  ExportFormat,
  CreateProfileRequest,
  UpdateProfileRequest,
  createDefaultProfile,
} from "../types/tempering";

// ============================================================================
// Types
// ============================================================================

interface UseExportProfilesReturn {
  // State
  profiles: Accessor<ExportProfile[]>;
  selectedProfile: Accessor<ExportProfile | null>;
  loading: Accessor<boolean>;
  error: Accessor<Error | null>;

  // Actions
  createProfile: (
    profile: Omit<ExportProfile, "id" | "createdAt" | "updatedAt">
  ) => Promise<ExportProfile>;
  updateProfile: (
    id: string,
    updates: UpdateProfileRequest
  ) => Promise<ExportProfile>;
  deleteProfile: (id: string) => Promise<void>;
  selectProfile: (id: string | null) => void;
  duplicateProfile: (id: string, newName: string) => Promise<ExportProfile>;
  setDefaultProfile: (id: string) => Promise<void>;

  // Utilities
  refetch: () => void;
  getProfilesByKind: (kind: ExportKind) => ExportProfile[];
  getProfilesByFormat: (format: ExportFormat) => ExportProfile[];
  getDefaultProfile: (
    kind: ExportKind,
    format: ExportFormat
  ) => ExportProfile | undefined;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for managing export profiles for a project.
 *
 * @param projectId - The ID of the current project
 * @returns Profile management state and actions
 */
export function useExportProfiles(projectId: string): UseExportProfilesReturn {
  // Selected profile state
  const [selectedProfileId, setSelectedProfileId] = createSignal<string | null>(
    null
  );

  // Fetch profiles from backend
  const [profilesResource, { refetch }] = createResource(
    () => projectId,
    async (id) => {
      // Skip if not running in Tauri environment
      if (!isTauriEnvironment()) {
        console.warn("Tauri runtime not detected - using mock data");
        return [];
      }

      try {
        const profiles = await invoke<ExportProfile[]>("get_export_profiles", {
          projectId: id,
        });
        return profiles;
      } catch (error) {
        console.error("Failed to fetch export profiles:", error);
        throw error;
      }
    }
  );

  // Derived state
  const profiles = () => profilesResource() || [];
  const loading = () => profilesResource.loading;
  const error = () => profilesResource.error as Error | null;

  const selectedProfile = () => {
    const id = selectedProfileId();
    if (!id) return null;
    return profiles().find((p) => p.id === id) || null;
  };

  // ============================================================================
  // Actions
  // ============================================================================

  /**
   * Creates a new export profile.
   */
  const createProfile = async (
    profile: Omit<ExportProfile, "id" | "createdAt" | "updatedAt">
  ): Promise<ExportProfile> => {
    requireTauriEnvironment("create profile");

    try {
      const request: CreateProfileRequest = {
        projectId,
        name: profile.name,
        description: profile.description,
        kind: profile.kind,
        format: profile.format,
        formatting: profile.formatting,
        layout: profile.layout,
        structure: profile.structure,
        kindOptions: profile.kindOptions,
        isDefault: profile.isDefault,
      };

      const newProfile = await invoke<ExportProfile>("create_export_profile", {
        request,
      });

      // Refetch to update the list
      refetch();

      return newProfile;
    } catch (error) {
      console.error("Failed to create export profile:", error);
      throw error;
    }
  };

  /**
   * Updates an existing export profile.
   */
  const updateProfile = async (
    id: string,
    updates: UpdateProfileRequest
  ): Promise<ExportProfile> => {
    requireTauriEnvironment("update profile");

    try {
      const updatedProfile = await invoke<ExportProfile>(
        "update_export_profile",
        {
          profileId: id,
          updates,
        }
      );

      // Refetch to update the list
      refetch();

      return updatedProfile;
    } catch (error) {
      console.error("Failed to update export profile:", error);
      throw error;
    }
  };

  /**
   * Deletes an export profile.
   */
  const deleteProfile = async (id: string): Promise<void> => {
    requireTauriEnvironment("delete profile");

    try {
      await invoke("delete_export_profile", {
        profileId: id,
      });

      // Clear selection if deleted profile was selected
      if (selectedProfileId() === id) {
        setSelectedProfileId(null);
      }

      // Refetch to update the list
      refetch();
    } catch (error) {
      console.error("Failed to delete export profile:", error);
      throw error;
    }
  };

  /**
   * Selects a profile by ID.
   */
  const selectProfile = (id: string | null) => {
    setSelectedProfileId(id);
  };

  /**
   * Duplicates an existing profile with a new name.
   */
  const duplicateProfile = async (
    id: string,
    newName: string
  ): Promise<ExportProfile> => {
    requireTauriEnvironment("duplicate profile");

    try {
      const original = profiles().find((p) => p.id === id);
      if (!original) {
        throw new Error(`Profile with id ${id} not found`);
      }

      // Create a copy with the new name
      const duplicate: Omit<ExportProfile, "id" | "createdAt" | "updatedAt"> = {
        name: newName,
        description: original.description,
        kind: original.kind,
        format: original.format,
        formatting: { ...original.formatting },
        layout: { ...original.layout },
        structure: { ...original.structure },
        kindOptions: { ...original.kindOptions },
        isDefault: false, // Duplicates are never default
      };

      return await createProfile(duplicate);
    } catch (error) {
      console.error("Failed to duplicate export profile:", error);
      throw error;
    }
  };

  /**
   * Sets a profile as the default for its kind/format combination.
   */
  const setDefaultProfile = async (id: string): Promise<void> => {
    requireTauriEnvironment("set default profile");

    try {
      await invoke("set_default_export_profile", {
        profileId: id,
      });

      // Refetch to update the list
      refetch();
    } catch (error) {
      console.error("Failed to set default export profile:", error);
      throw error;
    }
  };

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Gets all profiles for a specific kind.
   */
  const getProfilesByKind = (kind: ExportKind): ExportProfile[] => {
    return profiles().filter((p) => p.kind === kind);
  };

  /**
   * Gets all profiles for a specific format.
   */
  const getProfilesByFormat = (format: ExportFormat): ExportProfile[] => {
    return profiles().filter((p) => p.format === format);
  };

  /**
   * Gets the default profile for a kind/format combination.
   */
  const getDefaultProfile = (
    kind: ExportKind,
    format: ExportFormat
  ): ExportProfile | undefined => {
    return profiles().find(
      (p) => p.kind === kind && p.format === format && p.isDefault
    );
  };

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    profiles,
    selectedProfile,
    loading,
    error,

    // Actions
    createProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
    duplicateProfile,
    setDefaultProfile,

    // Utilities
    refetch,
    getProfilesByKind,
    getProfilesByFormat,
    getDefaultProfile,
  };
}
