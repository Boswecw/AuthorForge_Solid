/**
 * AuthorForge Tempering Module - Validation Hook
 *
 * Provides real-time validation for export profiles.
 * Validates settings and provides helpful error messages and warnings.
 */

import { createSignal, createEffect, Accessor, onCleanup } from "solid-js";
import type {
  ExportProfile,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  FormattingSettings,
  LayoutSettings,
  StructureSettings,
} from "~/lib/types/tempering";

// ============================================================================
// Debounce Utility
// ============================================================================

/**
 * Creates a debounced version of a function.
 * The function will only be called after the specified delay has passed
 * since the last invocation.
 */
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

// ============================================================================
// Types
// ============================================================================

interface UseValidationOptions {
  /**
   * Debounce delay in milliseconds.
   * Set to 0 to disable debouncing.
   * @default 300
   */
  debounceMs?: number;
}

interface UseValidationReturn {
  validation: Accessor<ValidationResult>;
  isValid: Accessor<boolean>;
  hasWarnings: Accessor<boolean>;
  errors: Accessor<ValidationError[]>;
  warnings: Accessor<ValidationWarning[]>;
  revalidate: () => void;
  /**
   * Immediately validates without debouncing.
   * Useful for explicit user actions like "Validate Now" button.
   */
  validateNow: () => void;
}

// ============================================================================
// Validation Rules
// ============================================================================

/**
 * Validates formatting settings.
 */
function validateFormatting(formatting: FormattingSettings): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Font size validation
  if (formatting.fontSize < 6 || formatting.fontSize > 72) {
    errors.push({
      field: "formatting.fontSize",
      message: "Font size must be between 6 and 72 points",
      severity: "error",
    });
  } else if (formatting.fontSize < 10 || formatting.fontSize > 14) {
    warnings.push({
      field: "formatting.fontSize",
      message: "Unusual font size. Standard sizes are 10-14 points",
      severity: "warning",
    });
  }

  // Line spacing validation
  if (formatting.lineSpacing < 0.5 || formatting.lineSpacing > 3.0) {
    errors.push({
      field: "formatting.lineSpacing",
      message: "Line spacing must be between 0.5 and 3.0",
      severity: "error",
    });
  }

  // Paragraph spacing validation
  if (formatting.paragraphSpacing < 0 || formatting.paragraphSpacing > 72) {
    errors.push({
      field: "formatting.paragraphSpacing",
      message: "Paragraph spacing must be between 0 and 72 points",
      severity: "error",
    });
  }

  // First line indent validation
  if (formatting.firstLineIndent < 0 || formatting.firstLineIndent > 2) {
    errors.push({
      field: "formatting.firstLineIndent",
      message: "First line indent must be between 0 and 2 inches",
      severity: "error",
    });
  }

  // Font family validation (basic check)
  if (!formatting.fontFamily || formatting.fontFamily.trim().length === 0) {
    errors.push({
      field: "formatting.fontFamily",
      message: "Font family is required",
      severity: "error",
    });
  }

  return { errors, warnings };
}

/**
 * Validates layout settings.
 */
function validateLayout(layout: LayoutSettings): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Custom page size validation
  if (layout.pageSize === "custom") {
    if (!layout.customWidth || layout.customWidth <= 0) {
      errors.push({
        field: "layout.customWidth",
        message: "Custom page width is required and must be positive",
        severity: "error",
      });
    }
    if (!layout.customHeight || layout.customHeight <= 0) {
      errors.push({
        field: "layout.customHeight",
        message: "Custom page height is required and must be positive",
        severity: "error",
      });
    }
  }

  // Margin validation
  const margins = [
    { value: layout.marginTop, name: "top" },
    { value: layout.marginBottom, name: "bottom" },
    { value: layout.marginLeft, name: "left" },
    { value: layout.marginRight, name: "right" },
  ];

  for (const margin of margins) {
    if (margin.value < 0 || margin.value > 3) {
      errors.push({
        field: `layout.margin${
          margin.name.charAt(0).toUpperCase() + margin.name.slice(1)
        }`,
        message: `${
          margin.name.charAt(0).toUpperCase() + margin.name.slice(1)
        } margin must be between 0 and 3 inches`,
        severity: "error",
      });
    } else if (margin.value < 0.5) {
      warnings.push({
        field: `layout.margin${
          margin.name.charAt(0).toUpperCase() + margin.name.slice(1)
        }`,
        message: `${
          margin.name.charAt(0).toUpperCase() + margin.name.slice(1)
        } margin is very small. Consider at least 0.5 inches`,
        severity: "warning",
      });
    }
  }

  // Page number validation
  if (layout.pageNumbers && layout.pageNumberPosition === "none") {
    warnings.push({
      field: "layout.pageNumberPosition",
      message: "Page numbers are enabled but position is set to 'none'",
      severity: "warning",
    });
  }

  // Header/footer validation
  if (layout.headerEnabled && !layout.headerContent) {
    warnings.push({
      field: "layout.headerContent",
      message: "Header is enabled but no content is specified",
      severity: "warning",
    });
  }

  if (layout.footerEnabled && !layout.footerContent) {
    warnings.push({
      field: "layout.footerContent",
      message: "Footer is enabled but no content is specified",
      severity: "warning",
    });
  }

  return { errors, warnings };
}

/**
 * Validates structure settings.
 */
function validateStructure(structure: StructureSettings): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // TOC depth validation
  if (structure.includeTOC) {
    if (structure.tocDepth < 1 || structure.tocDepth > 6) {
      errors.push({
        field: "structure.tocDepth",
        message: "Table of contents depth must be between 1 and 6",
        severity: "error",
      });
    }
  }

  // Dedication validation
  if (structure.includeDedication && !structure.dedicationText) {
    warnings.push({
      field: "structure.dedicationText",
      message: "Dedication is enabled but no text is provided",
      severity: "warning",
    });
  }

  // Acknowledgments validation
  if (structure.includeAcknowledgments && !structure.acknowledgmentsText) {
    warnings.push({
      field: "structure.acknowledgmentsText",
      message: "Acknowledgments are enabled but no text is provided",
      severity: "warning",
    });
  }

  // Title page validation
  if (structure.includeTitlePage && structure.titlePageTemplate) {
    // Could add template syntax validation here
  }

  return { errors, warnings };
}

/**
 * Validates an entire export profile.
 */
function validateProfile(profile: ExportProfile | null): ValidationResult {
  if (!profile) {
    return {
      isValid: false,
      errors: [
        {
          field: "profile",
          message: "No profile selected",
          severity: "error",
        },
      ],
      warnings: [],
    };
  }

  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  // Validate profile name
  if (!profile.name || profile.name.trim().length === 0) {
    allErrors.push({
      field: "name",
      message: "Profile name is required",
      severity: "error",
    });
  }

  // Validate formatting
  const formattingValidation = validateFormatting(profile.formatting);
  allErrors.push(...formattingValidation.errors);
  allWarnings.push(...formattingValidation.warnings);

  // Validate layout
  const layoutValidation = validateLayout(profile.layout);
  allErrors.push(...layoutValidation.errors);
  allWarnings.push(...layoutValidation.warnings);

  // Validate structure
  const structureValidation = validateStructure(profile.structure);
  allErrors.push(...structureValidation.errors);
  allWarnings.push(...structureValidation.warnings);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for validating export profiles.
 *
 * Automatically revalidates when the profile changes, with optional debouncing
 * to reduce unnecessary validation runs during rapid changes.
 *
 * @param profileGetter - Function that returns the current profile to validate
 * @param options - Configuration options
 * @returns Validation state and utilities
 *
 * @example
 * ```tsx
 * // With default 300ms debounce
 * const validation = useValidation(() => selectedProfile());
 *
 * // With custom debounce
 * const validation = useValidation(() => selectedProfile(), { debounceMs: 500 });
 *
 * // Without debounce (immediate validation)
 * const validation = useValidation(() => selectedProfile(), { debounceMs: 0 });
 * ```
 */
export function useValidation(
  profileGetter: () => ExportProfile | null,
  options: UseValidationOptions = {}
): UseValidationReturn {
  const { debounceMs = 300 } = options;

  const [validation, setValidation] = createSignal<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: [],
  });

  /**
   * Performs validation on the current profile (immediate, no debounce).
   */
  const validateNow = () => {
    const profile = profileGetter();
    const result = validateProfile(profile);
    setValidation(result);
  };

  /**
   * Debounced validation function.
   */
  const debouncedValidate =
    debounceMs > 0 ? debounce(validateNow, debounceMs) : validateNow;

  /**
   * Public revalidate function (uses debouncing if enabled).
   */
  const revalidate = debouncedValidate;

  // Auto-revalidate when profile changes
  createEffect(() => {
    profileGetter(); // Track dependency
    debouncedValidate();
  });

  // Cleanup on unmount
  onCleanup(() => {
    // No cleanup needed for debounce as it's handled by timeout
  });

  // Derived state
  const isValid = () => validation().isValid;
  const hasWarnings = () => validation().warnings.length > 0;
  const errors = () => validation().errors;
  const warnings = () => validation().warnings;

  return {
    validation,
    isValid,
    hasWarnings,
    errors,
    warnings,
    revalidate,
    validateNow,
  };
}

// ============================================================================
// Standalone Validation Functions
// ============================================================================

/**
 * Validates a profile without using the hook.
 * Useful for one-off validation checks.
 *
 * @param profile - The profile to validate
 * @returns Validation result
 */
export function validateProfileSync(
  profile: ExportProfile | null
): ValidationResult {
  return validateProfile(profile);
}

/**
 * Checks if a profile is valid for export.
 *
 * @param profile - The profile to check
 * @returns True if the profile is valid
 */
export function isProfileValid(profile: ExportProfile | null): boolean {
  return validateProfile(profile).isValid;
}

/**
 * Gets only the errors from a validation result.
 *
 * @param profile - The profile to validate
 * @returns Array of validation errors
 */
export function getProfileErrors(
  profile: ExportProfile | null
): ValidationError[] {
  return validateProfile(profile).errors;
}

/**
 * Gets only the warnings from a validation result.
 *
 * @param profile - The profile to validate
 * @returns Array of validation warnings
 */
export function getProfileWarnings(
  profile: ExportProfile | null
): ValidationWarning[] {
  return validateProfile(profile).warnings;
}
