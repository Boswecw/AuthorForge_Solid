/**
 * Character Arc Validation
 * 
 * Provides validation rules for character arc data to ensure data integrity
 */

import type { CharacterArc } from "~/routes/anvil/types";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a character arc before saving
 */
export function validateCharacterArc(arc: Partial<CharacterArc>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!arc.name || arc.name.trim() === "") {
    errors.push({ field: "name", message: "Character name is required" });
  }

  if (arc.name && arc.name.length > 100) {
    errors.push({ field: "name", message: "Character name must be 100 characters or less" });
  }

  if (!arc.bio) {
    errors.push({ field: "bio", message: "Character bio is required" });
  }

  if (!arc.species || arc.species.trim() === "") {
    errors.push({ field: "species", message: "Species is required" });
  }

  if (!arc.role) {
    errors.push({ field: "role", message: "Character role is required" });
  }

  if (!arc.povStatus) {
    errors.push({ field: "povStatus", message: "POV status is required" });
  }

  if (!arc.status) {
    errors.push({ field: "status", message: "Character status is required" });
  }

  // Age validation
  if (arc.age !== undefined && arc.age !== null) {
    if (arc.age < 0) {
      errors.push({ field: "age", message: "Age cannot be negative" });
    }
    if (arc.age > 10000) {
      errors.push({ field: "age", message: "Age seems unrealistic (max 10,000)" });
    }
  }

  // Alias validation
  if (arc.alias && arc.alias.length > 100) {
    errors.push({ field: "alias", message: "Alias must be 100 characters or less" });
  }

  // Title validation
  if (arc.title && arc.title.length > 100) {
    errors.push({ field: "title", message: "Title must be 100 characters or less" });
  }

  // Faction validation
  if (arc.faction && arc.faction.length > 100) {
    errors.push({ field: "faction", message: "Faction must be 100 characters or less" });
  }

  // Emotional tags validation
  if (arc.emotionalTags && arc.emotionalTags.length > 20) {
    errors.push({ field: "emotionalTags", message: "Maximum 20 emotional tags allowed" });
  }

  // Arc sections validation
  if (arc.internalArc) {
    if (arc.internalArc.summary && arc.internalArc.summary.length > 1000) {
      errors.push({ field: "internalArc.summary", message: "Internal arc summary too long (max 1000 chars)" });
    }
  }

  if (arc.externalArc) {
    if (arc.externalArc.summary && arc.externalArc.summary.length > 1000) {
      errors.push({ field: "externalArc.summary", message: "External arc summary too long (max 1000 chars)" });
    }
  }

  if (arc.spiritualArc) {
    if (arc.spiritualArc.summary && arc.spiritualArc.summary.length > 1000) {
      errors.push({ field: "spiritualArc.summary", message: "Spiritual arc summary too long (max 1000 chars)" });
    }
  }

  // Beats validation
  if (arc.beats && arc.beats.length > 100) {
    errors.push({ field: "beats", message: "Maximum 100 beats allowed per character" });
  }

  // Relationships validation
  if (arc.relationships && arc.relationships.length > 50) {
    errors.push({ field: "relationships", message: "Maximum 50 relationships allowed per character" });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get a user-friendly error message from validation errors
 */
export function getValidationErrorMessage(result: ValidationResult): string {
  if (result.valid) return "";
  
  if (result.errors.length === 1) {
    return result.errors[0].message;
  }
  
  return `${result.errors.length} validation errors: ${result.errors.map(e => e.message).join(", ")}`;
}

