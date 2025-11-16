/**
 * Story Arc Graph Types
 * 
 * Defines the data structures for the Story Arc Graph visualization
 * in the Anvil workspace.
 */

export interface StoryArcPoint {
  chapter: number;
  act: 1 | 2 | 3;
  wordCountPercent: number; // 0-100
  
  // Intensity layers (0-100 scale)
  emotional: number;
  stakes: number;
  worldPressure: number;
  internalConflict: number;
  themeResonance: number;
  spiritualIntensity: number;
  actionCrisis: number;
  
  // Metadata
  povCharacterId?: string;
  chapterTitle?: string;
  arcBeatIds: string[]; // References to ArcBeat IDs
  notes?: string;
}

export interface PlotBeat {
  id: string;
  type: 'inciting-incident' | 'first-plot-point' | 'midpoint' | 'dark-night' | 'climax' | 'resolution';
  chapter: number;
  wordCountPercent: number;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface StoryArcGraph {
  id: string;
  projectId: string;
  points: StoryArcPoint[];
  plotBeats: PlotBeat[];
  createdAt: string;
  updatedAt: string;
}

export type IntensityLayer = 
  | 'emotional'
  | 'stakes'
  | 'worldPressure'
  | 'internalConflict'
  | 'themeResonance'
  | 'spiritualIntensity'
  | 'actionCrisis';

export type ViewMode = 'chapters' | 'acts' | 'wordCount';
export type SmoothingMode = 'linear' | 'curved' | 'stepped';

export interface LayerConfig {
  key: IntensityLayer;
  label: string;
  color: string;
  enabled: boolean;
}

export interface GraphFilters {
  povCharacterId?: string;
  actFilter?: 1 | 2 | 3;
  arcType?: 'internal' | 'external' | 'spiritual';
}

export interface AIArcAnalysis {
  flatArcs: {
    layer: IntensityLayer;
    chapters: number[];
    suggestion: string;
  }[];
  lowStakes: {
    chapters: number[];
    suggestion: string;
  }[];
  pacingIssues: {
    type: 'too-early' | 'too-late' | 'too-flat';
    chapter: number;
    suggestion: string;
  }[];
  emotionalDisconnects: {
    chapter: number;
    characterId: string;
    issue: string;
    suggestion: string;
  }[];
  canonViolations: {
    chapter: number;
    issue: string;
    conflictsWith: number;
  }[];
  overallScore: number; // 0-100
  summary: string;
}

