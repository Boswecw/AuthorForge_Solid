import { createSignal, createEffect } from "solid-js";

/**
 * Provenance Store - Track sources and citations in AuthorForge
 * Supports tracking imported/AI-sourced passages with metadata
 */

// Types
export interface Contributor {
  role: string; // e.g., "author", "editor", "translator"
  name: string;
  affiliation?: string;
}

export interface SourceMeta {
  id: string; // unique identifier
  title: string;
  publisher?: string;
  license?: string; // e.g., "CC-BY-4.0", "MIT", "All Rights Reserved"
  contributors: Contributor[];
  domain: string; // e.g., "literature", "research", "code", "AI-generated"
  url?: string;
  dateAccessed?: string;
}

export interface TaggedPassage {
  blockId: string; // references block in editor
  sourceId: string; // references SourceMeta.id
  range?: { start: number; end: number }; // optional character range within block
  timestamp: string;
}

// Storage keys
const SOURCES_STORAGE_KEY = "authorforge-sources";
const PASSAGES_STORAGE_KEY = "authorforge-tagged-passages";

// Create reactive stores
const [sources, setSources] = createSignal<Map<string, SourceMeta>>(new Map());
const [taggedPassages, setTaggedPassages] = createSignal<TaggedPassage[]>([]);

// Load from localStorage on initialization
function loadFromStorage() {
  try {
    const savedSources = localStorage.getItem(SOURCES_STORAGE_KEY);
    if (savedSources) {
      const parsed = JSON.parse(savedSources);
      setSources(new Map(parsed));
    }

    const savedPassages = localStorage.getItem(PASSAGES_STORAGE_KEY);
    if (savedPassages) {
      setTaggedPassages(JSON.parse(savedPassages));
    }
  } catch (e) {
    console.error("Failed to load provenance data from localStorage", e);
  }
}

// Auto-save to localStorage
createEffect(() => {
  const currentSources = sources();
  localStorage.setItem(
    SOURCES_STORAGE_KEY,
    JSON.stringify(Array.from(currentSources.entries()))
  );
});

createEffect(() => {
  const currentPassages = taggedPassages();
  localStorage.setItem(PASSAGES_STORAGE_KEY, JSON.stringify(currentPassages));
});

// Initialize on import
loadFromStorage();

/**
 * Add or update a source in the provenance store
 */
export function addSource(source: SourceMeta): void {
  setSources((prev) => {
    const newMap = new Map(prev);
    newMap.set(source.id, source);
    return newMap;
  });
}

/**
 * Get a source by ID
 */
export function getSource(sourceId: string): SourceMeta | undefined {
  return sources().get(sourceId);
}

/**
 * Get all sources
 */
export function getAllSources(): SourceMeta[] {
  return Array.from(sources().values());
}

/**
 * Tag a passage with source metadata
 */
export function tagPassage(
  blockId: string,
  sourceId: string,
  range?: { start: number; end: number }
): void {
  const newPassage: TaggedPassage = {
    blockId,
    sourceId,
    range,
    timestamp: new Date().toISOString(),
  };

  setTaggedPassages((prev) => [...prev, newPassage]);
}

/**
 * Get all sources referenced in a document
 * @param docId - Currently unused, reserved for multi-document support
 */
export function sourcesForDoc(docId?: string): SourceMeta[] {
  const passages = taggedPassages();
  const sourceIds = new Set(passages.map((p) => p.sourceId));

  return Array.from(sourceIds)
    .map((id) => getSource(id))
    .filter((s): s is SourceMeta => s !== undefined);
}

/**
 * Get all tagged passages for a specific block
 */
export function getPassagesForBlock(blockId: string): TaggedPassage[] {
  return taggedPassages().filter((p) => p.blockId === blockId);
}

/**
 * Remove a tagged passage
 */
export function removePassage(blockId: string, sourceId: string): void {
  setTaggedPassages((prev) =>
    prev.filter((p) => !(p.blockId === blockId && p.sourceId === sourceId))
  );
}

/**
 * Remove all passages for a block (e.g., when block is deleted)
 */
export function removePassagesForBlock(blockId: string): void {
  setTaggedPassages((prev) => prev.filter((p) => p.blockId !== blockId));
}

/**
 * Get contributors from all sources used in document
 */
export function getAllContributors(): Contributor[] {
  const usedSources = sourcesForDoc();
  const contributors: Contributor[] = [];

  usedSources.forEach((source) => {
    contributors.push(...source.contributors);
  });

  return contributors;
}

/**
 * Export provenance data as JSON
 */
export function exportProvenanceData() {
  return {
    sources: Array.from(sources().entries()),
    passages: taggedPassages(),
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Clear all provenance data
 */
export function clearAllProvenance(): void {
  setSources(new Map());
  setTaggedPassages([]);
  localStorage.removeItem(SOURCES_STORAGE_KEY);
  localStorage.removeItem(PASSAGES_STORAGE_KEY);
}

// Export reactive signals for components
export { sources, taggedPassages };
