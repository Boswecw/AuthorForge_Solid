/**
 * AuthorForge Tempering Module - Core Type Definitions
 *
 * The Tempering module is the export/publishing engine for AuthorForge.
 * It handles the transformation of written content into various publication formats.
 */

// ============================================================================
// Export Types
// ============================================================================

/**
 * Defines the kind of content being exported.
 * Each kind may have specific formatting requirements and options.
 */
export type ExportKind =
  | "manuscript" // Traditional manuscript format for submissions
  | "novel" // Novel format with chapters and parts
  | "scientific_paper" // Academic paper with citations and references
  | "blog_post" // Web-optimized blog content
  | "newsletter"; // Email newsletter format

/**
 * Supported export formats.
 * Each format has its own export engine and capabilities.
 */
export type ExportFormat =
  | "epub" // E-book format
  | "docx" // Microsoft Word document
  | "pdf" // Portable Document Format
  | "markdown" // Plain markdown
  | "html"; // Web-ready HTML

/**
 * Export process phases using forge-themed terminology.
 * Represents the current state of an export job.
 */
export type ExportPhase =
  | "cold" // Not started - ready to begin
  | "heating" // Gathering content from the project
  | "hammering" // Applying formatting and transformations
  | "quenching" // Finalizing and writing output
  | "cooled" // Complete - export successful
  | "cracked"; // Failed - export encountered an error

/**
 * Display metadata for each export phase.
 * Used for UI representation with forge-themed icons and colors.
 */
export const PHASE_DISPLAY = {
  cold: { icon: "❄️", label: "Ready", color: "text-blue-400" },
  heating: { icon: "🔥", label: "Gathering", color: "text-orange-400" },
  hammering: { icon: "🔨", label: "Forging", color: "text-amber-400" },
  quenching: { icon: "💧", label: "Tempering", color: "text-cyan-400" },
  cooled: { icon: "✓", label: "Complete", color: "text-green-400" },
  cracked: { icon: "⚠️", label: "Failed", color: "text-red-400" },
} as const;

// ============================================================================
// Profile Structure
// ============================================================================

/**
 * Formatting settings control text appearance.
 */
export interface FormattingSettings {
  fontFamily: string; // e.g., "Times New Roman", "Courier New"
  fontSize: number; // In points
  lineSpacing: number; // Line height multiplier (e.g., 1.5, 2.0)
  paragraphSpacing: number; // Space between paragraphs in points
  alignment: "left" | "right" | "center" | "justify";
  firstLineIndent: number; // First line indent in inches
  dropCaps: boolean; // Enable drop caps for chapters
}

/**
 * Layout settings define page structure.
 */
export interface LayoutSettings {
  pageSize: "letter" | "a4" | "a5" | "custom";
  customWidth?: number; // In inches (if pageSize is "custom")
  customHeight?: number; // In inches (if pageSize is "custom")
  marginTop: number; // In inches
  marginBottom: number; // In inches
  marginLeft: number; // In inches
  marginRight: number; // In inches
  headerEnabled: boolean;
  headerContent?: string; // Template string for header
  footerEnabled: boolean;
  footerContent?: string; // Template string for footer
  pageNumbers: boolean;
  pageNumberPosition: "header" | "footer" | "none";
  pageNumberAlignment: "left" | "center" | "right";
}

/**
 * Structure settings define document sections and organization.
 */
export interface StructureSettings {
  includeTitlePage: boolean;
  titlePageTemplate?: string; // Custom title page layout
  includeDedication: boolean;
  dedicationText?: string;
  includeTOC: boolean; // Table of Contents
  tocDepth: number; // How many heading levels to include
  includeAcknowledgments: boolean;
  acknowledgmentsText?: string;
  chapterBreakStyle: "page-break" | "line-break" | "decorative";
  chapterNumbering: boolean;
  chapterNumberFormat: "numeric" | "roman" | "word";
  partBreaks: boolean; // For multi-part novels
}

/**
 * Kind-specific options that vary by export type.
 */
export interface KindOptions {
  // Manuscript-specific
  manuscriptHeader?: {
    authorName: string;
    contactInfo: string;
    wordCount: boolean;
  };

  // Novel-specific
  novelOptions?: {
    includeEpigraphs: boolean;
    sceneBreakSymbol: string;
    dropCapFirstChapter: boolean;
  };

  // Scientific paper-specific
  paperOptions?: {
    citationStyle: "apa" | "mla" | "chicago" | "ieee";
    includeAbstract: boolean;
    includeKeywords: boolean;
    includeReferences: boolean;
    columnLayout: "single" | "double";
  };

  // Blog post-specific
  blogOptions?: {
    includeFeaturedImage: boolean;
    seoMetadata: boolean;
    socialShareButtons: boolean;
    readingTime: boolean;
  };

  // Newsletter-specific
  newsletterOptions?: {
    headerImage?: string;
    footerText?: string;
    unsubscribeLink: boolean;
    previewText?: string;
  };
}

/**
 * Complete export profile containing all settings.
 * Profiles can be saved, reused, and shared.
 */
export interface ExportProfile {
  id: string;
  name: string;
  description?: string;
  kind: ExportKind;
  format: ExportFormat;
  formatting: FormattingSettings;
  layout: LayoutSettings;
  structure: StructureSettings;
  kindOptions: KindOptions;
  imageBindings: ImageBinding[]; // Bound images for this profile
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  isDefault: boolean; // Is this the default profile for this kind/format?
}

// ============================================================================
// Image Bindings & Assets
// ============================================================================

/**
 * Role that an image plays in the export.
 */
export type ImageRole =
  | "cover" // Cover image for the book
  | "figure" // Interior illustration or figure
  | "hero" // Hero/header image for blog posts
  | "author-photo" // Author photo for back matter
  | "map" // Map or diagram
  | "decorative"; // Decorative element

/**
 * Binding of an image to a specific location in the document.
 */
export interface ImageBinding {
  id: string;
  filePath: string; // Path to the image file
  fileName: string; // Original file name
  fileSize: number; // Size in bytes
  mimeType: string; // e.g., "image/png", "image/jpeg"
  role: ImageRole;
  altText?: string; // Accessibility text
  caption?: string; // Optional caption
  chapterBinding?: string; // Chapter ID if bound to a specific chapter
  pageBinding?: number; // Page number if bound to a specific page
  width?: number; // Original width in pixels
  height?: number; // Original height in pixels
  uploadedAt: string; // ISO timestamp
}

// ============================================================================
// Export Job
// ============================================================================

/**
 * Represents an active or completed export job.
 */
export interface ExportJob {
  id: string;
  projectId: string;
  profileId: string;
  phase: ExportPhase;
  progress: number; // 0-100
  startedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  outputPath?: string; // Path to generated file
  errorMessage?: string; // Error details if phase is "cracked"
  logs: ExportLogEntry[]; // Detailed progress logs
}

/**
 * Individual log entry for an export job.
 */
export interface ExportLogEntry {
  timestamp: string; // ISO timestamp
  phase: ExportPhase;
  message: string;
  level: "info" | "warning" | "error";
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validation result for an export profile.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error that prevents export.
 */
export interface ValidationError {
  field: string;
  message: string;
  severity: "error";
}

/**
 * Validation warning that doesn't prevent export but should be noted.
 */
export interface ValidationWarning {
  field: string;
  message: string;
  severity: "warning";
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request to create a new export profile.
 */
export interface CreateProfileRequest {
  projectId: string;
  name: string;
  description?: string;
  kind: ExportKind;
  format: ExportFormat;
  formatting: FormattingSettings;
  layout: LayoutSettings;
  structure: StructureSettings;
  kindOptions: KindOptions;
  isDefault?: boolean;
}

/**
 * Request to update an existing export profile.
 */
export interface UpdateProfileRequest {
  name?: string;
  description?: string;
  formatting?: Partial<FormattingSettings>;
  layout?: Partial<LayoutSettings>;
  structure?: Partial<StructureSettings>;
  kindOptions?: Partial<KindOptions>;
  imageBindings?: ImageBinding[];
  isDefault?: boolean;
}

/**
 * Request to start an export job.
 */
export interface StartExportRequest {
  projectId: string;
  profileId: string;
  outputPath?: string; // Optional custom output path
}

/**
 * Response from starting an export job.
 */
export interface StartExportResponse {
  jobId: string;
  status: "started" | "queued";
}

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default formatting settings.
 */
export const DEFAULT_FORMATTING: FormattingSettings = {
  fontFamily: "Times New Roman",
  fontSize: 12,
  lineSpacing: 2.0,
  paragraphSpacing: 0,
  alignment: "left",
  firstLineIndent: 0.5,
  dropCaps: false,
};

/**
 * Default layout settings.
 */
export const DEFAULT_LAYOUT: LayoutSettings = {
  pageSize: "letter",
  marginTop: 1.0,
  marginBottom: 1.0,
  marginLeft: 1.0,
  marginRight: 1.0,
  headerEnabled: false,
  footerEnabled: false,
  pageNumbers: true,
  pageNumberPosition: "footer",
  pageNumberAlignment: "center",
};

/**
 * Default structure settings.
 */
export const DEFAULT_STRUCTURE: StructureSettings = {
  includeTitlePage: true,
  includeDedication: false,
  includeTOC: true,
  tocDepth: 2,
  includeAcknowledgments: false,
  chapterBreakStyle: "page-break",
  chapterNumbering: true,
  chapterNumberFormat: "numeric",
  partBreaks: false,
};

/**
 * Default kind options (empty).
 */
export const DEFAULT_KIND_OPTIONS: KindOptions = {};

/**
 * Creates a new profile with default settings.
 */
export function createDefaultProfile(
  kind: ExportKind,
  format: ExportFormat,
  name?: string
): Omit<ExportProfile, "id" | "createdAt" | "updatedAt"> {
  return {
    name: name || `${kind} - ${format}`,
    description: `Default ${format} export for ${kind}`,
    kind,
    format,
    formatting: { ...DEFAULT_FORMATTING },
    layout: { ...DEFAULT_LAYOUT },
    structure: { ...DEFAULT_STRUCTURE },
    kindOptions: { ...DEFAULT_KIND_OPTIONS },
    imageBindings: [],
    isDefault: false,
  };
}

/**
 * Type guard to check if a phase is terminal (complete or failed).
 */
export function isTerminalPhase(phase: ExportPhase): boolean {
  return phase === "cooled" || phase === "cracked";
}

/**
 * Type guard to check if a phase is active (in progress).
 */
export function isActivePhase(phase: ExportPhase): boolean {
  return phase === "heating" || phase === "hammering" || phase === "quenching";
}

/**
 * Gets the progress percentage for a given phase.
 */
export function getPhaseProgress(phase: ExportPhase): number {
  const progressMap: Record<ExportPhase, number> = {
    cold: 0,
    heating: 25,
    hammering: 50,
    quenching: 75,
    cooled: 100,
    cracked: 0,
  };
  return progressMap[phase];
}
