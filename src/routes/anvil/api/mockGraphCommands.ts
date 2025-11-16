/**
 * Mock Tauri Commands for Story Arc Graph
 *
 * Simulates backend API calls for development.
 * Replace with real Tauri commands when backend is ready.
 */

import type {
  StoryArcGraph,
  StoryArcPoint,
  PlotBeat,
  AIArcAnalysis,
} from "../types/graph";
import type { CharacterArc } from "../types";
import { storyArcGraphDB } from "~/lib/db/storyArcGraphDB";

let dbInitialized = false;

/**
 * Generate realistic mock data for a 30-chapter novel
 */
function generateMockGraph(projectId: string): StoryArcGraph {
  const points: StoryArcPoint[] = [];

  // Generate 30 chapters with varying intensity
  for (let i = 1; i <= 30; i++) {
    const act: 1 | 2 | 3 = i <= 7 ? 1 : i <= 22 ? 2 : 3;
    const wordCountPercent = (i / 30) * 100;

    // Create realistic arc curves
    // Act I: Rising tension
    // Act II: High stakes, peaks at midpoint, dips at dark night
    // Act III: Climax and resolution

    let emotional = 30;
    let stakes = 20;
    let worldPressure = 15;
    let internalConflict = 25;
    let themeResonance = 20;
    let spiritualIntensity = 15;
    let actionCrisis = 10;

    if (act === 1) {
      // Act I: Setup - gradual rise
      emotional = 30 + i * 5;
      stakes = 20 + i * 3;
      worldPressure = 15 + i * 2;
      internalConflict = 25 + i * 4;
      themeResonance = 20 + i * 2;
      spiritualIntensity = 15 + i * 3;
      actionCrisis = 10 + i * 2;
    } else if (act === 2) {
      // Act II: Struggle - high tension, peaks at midpoint (ch 15), dips at dark night (ch 20)
      const chapterInAct = i - 7;
      if (chapterInAct <= 8) {
        // Rising to midpoint
        emotional = 60 + chapterInAct * 4;
        stakes = 50 + chapterInAct * 5;
        worldPressure = 40 + chapterInAct * 6;
        internalConflict = 55 + chapterInAct * 4;
        themeResonance = 45 + chapterInAct * 5;
        spiritualIntensity = 50 + chapterInAct * 4;
        actionCrisis = 35 + chapterInAct * 5;
      } else {
        // Falling to dark night
        const fallProgress = chapterInAct - 8;
        emotional = 92 - fallProgress * 8;
        stakes = 90 - fallProgress * 7;
        worldPressure = 88 - fallProgress * 6;
        internalConflict = 87 - fallProgress * 8;
        themeResonance = 85 - fallProgress * 5;
        spiritualIntensity = 86 - fallProgress * 9;
        actionCrisis = 75 - fallProgress * 7;
      }
    } else {
      // Act III: Resolution - climax then falling action
      const chapterInAct = i - 22;
      if (chapterInAct <= 4) {
        // Rising to climax
        emotional = 40 + chapterInAct * 15;
        stakes = 35 + chapterInAct * 16;
        worldPressure = 30 + chapterInAct * 17;
        internalConflict = 32 + chapterInAct * 17;
        themeResonance = 40 + chapterInAct * 15;
        spiritualIntensity = 28 + chapterInAct * 18;
        actionCrisis = 25 + chapterInAct * 19;
      } else {
        // Falling action and resolution
        const fallProgress = chapterInAct - 4;
        emotional = 100 - fallProgress * 15;
        stakes = 99 - fallProgress * 20;
        worldPressure = 98 - fallProgress * 20;
        internalConflict = 100 - fallProgress * 18;
        themeResonance = 100 - fallProgress * 12;
        spiritualIntensity = 100 - fallProgress * 15;
        actionCrisis = 100 - fallProgress * 22;
      }
    }

    // Clamp values to 0-100
    const clamp = (val: number) => Math.max(0, Math.min(100, val));

    points.push({
      chapter: i,
      act,
      wordCountPercent,
      emotional: clamp(emotional),
      stakes: clamp(stakes),
      worldPressure: clamp(worldPressure),
      internalConflict: clamp(internalConflict),
      themeResonance: clamp(themeResonance),
      spiritualIntensity: clamp(spiritualIntensity),
      actionCrisis: clamp(actionCrisis),
      povCharacterId: i % 3 === 0 ? "char-2" : "char-1", // Alternate POVs
      chapterTitle: `Chapter ${i}`,
      arcBeatIds: [],
      notes: "",
    });
  }

  // Define standard plot beats
  const plotBeats: PlotBeat[] = [
    {
      id: "beat-1",
      type: "inciting-incident",
      chapter: 3,
      wordCountPercent: 10,
      title: "Inciting Incident",
      description: "The event that sets the story in motion",
      icon: "zap",
    },
    {
      id: "beat-2",
      type: "first-plot-point",
      chapter: 7,
      wordCountPercent: 25,
      title: "First Plot Point",
      description: "End of Act I - Point of no return",
      icon: "arrow-right",
    },
    {
      id: "beat-3",
      type: "midpoint",
      chapter: 15,
      wordCountPercent: 50,
      title: "Midpoint Shift",
      description: "Major revelation or reversal",
      icon: "rotate-cw",
    },
    {
      id: "beat-4",
      type: "dark-night",
      chapter: 20,
      wordCountPercent: 75,
      title: "Dark Night of the Soul",
      description: "All seems lost",
      icon: "moon",
    },
    {
      id: "beat-5",
      type: "climax",
      chapter: 26,
      wordCountPercent: 90,
      title: "Final Confrontation",
      description: "The ultimate showdown",
      icon: "flame",
    },
    {
      id: "beat-6",
      type: "resolution",
      chapter: 29,
      wordCountPercent: 97,
      title: "Resolution",
      description: "Tying up loose ends",
      icon: "check-circle",
    },
  ];

  return {
    id: "graph-1",
    projectId,
    points,
    plotBeats,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Initialize database with mock data if empty
 */
async function ensureInitialized(projectId: string): Promise<void> {
  if (dbInitialized) return;

  const existing = await storyArcGraphDB.get(projectId);
  if (!existing) {
    const mockGraph = generateMockGraph(projectId);
    await storyArcGraphDB.save(mockGraph);
  }

  dbInitialized = true;
}

/**
 * Get story arc graph for a project
 */
export async function getStoryArcGraph(
  projectId: string = "default-project"
): Promise<StoryArcGraph> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  await ensureInitialized(projectId);
  const graph = await storyArcGraphDB.get(projectId);

  if (!graph) {
    // Fallback: create new graph
    const newGraph = generateMockGraph(projectId);
    await storyArcGraphDB.save(newGraph);
    return newGraph;
  }

  return graph;
}

/**
 * Save story arc graph
 */
export async function saveStoryArcGraph(graph: StoryArcGraph): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const updatedGraph = {
    ...graph,
    updatedAt: new Date().toISOString(),
  };

  await storyArcGraphDB.save(updatedGraph);
}

/**
 * Update a specific arc point
 */
export async function updateArcPoint(
  projectId: string,
  chapter: number,
  updates: Partial<StoryArcPoint>
): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150));

  await storyArcGraphDB.updatePoint(projectId, chapter, updates);
}

/**
 * Update a plot beat
 */
export async function updatePlotBeat(
  projectId: string,
  beatId: string,
  updates: Partial<PlotBeat>
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  await storyArcGraphDB.updatePlotBeat(projectId, beatId, updates);
}

/**
 * Add a new plot beat
 */
export async function addPlotBeat(
  projectId: string,
  beat: PlotBeat
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  await storyArcGraphDB.addPlotBeat(projectId, beat);
}

/**
 * Delete a plot beat
 */
export async function deletePlotBeat(
  projectId: string,
  beatId: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  await storyArcGraphDB.deletePlotBeat(projectId, beatId);
}

/**
 * Integrate character arc beats into graph points
 */
export async function integrateCharacterBeats(
  projectId: string,
  characterArcs: CharacterArc[]
): Promise<void> {
  const graph = await storyArcGraphDB.get(projectId);
  if (!graph) return;

  // Map character beats to chapters
  const beatsByChapter = new Map<number, string[]>();

  for (const character of characterArcs) {
    for (const beat of character.beats) {
      // Extract chapter number from beat.chapter (could be "Chapter 5" or just "5")
      const chapterMatch = beat.chapter?.match(/\d+/);
      if (!chapterMatch) continue;

      const chapterNum = parseInt(chapterMatch[0], 10);
      if (!beatsByChapter.has(chapterNum)) {
        beatsByChapter.set(chapterNum, []);
      }
      beatsByChapter.get(chapterNum)!.push(beat.id);
    }
  }

  // Update graph points with beat IDs
  for (const point of graph.points) {
    const beatIds = beatsByChapter.get(point.chapter) || [];
    point.arcBeatIds = beatIds;
  }

  await storyArcGraphDB.save(graph);
}

/**
 * Analyze arc graph with AI
 */
export async function analyzeArcGraph(
  projectId: string,
  graph?: StoryArcGraph
): Promise<AIArcAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!graph) {
    graph = (await storyArcGraphDB.get(projectId)) || undefined;
  }

  // Simple heuristic-based analysis
  const flatArcs: AIArcAnalysis["flatArcs"] = [];
  const lowStakes: AIArcAnalysis["lowStakes"] = [];
  const pacingIssues: AIArcAnalysis["pacingIssues"] = [];

  if (graph) {
    // Detect flat emotional sections (variance < 10 over 5+ chapters)
    for (let i = 0; i < graph.points.length - 4; i++) {
      const slice = graph.points.slice(i, i + 5);
      const emotionalValues = slice.map((p) => p.emotional);
      const variance =
        Math.max(...emotionalValues) - Math.min(...emotionalValues);

      if (variance < 10) {
        flatArcs.push({
          layer: "emotional",
          chapters: slice.map((p) => p.chapter),
          suggestion: `Emotional intensity is relatively flat in chapters ${slice[0].chapter}-${slice[4].chapter}. Consider adding a character conflict or revelation to increase tension.`,
        });
        i += 4; // Skip ahead to avoid overlapping detections
      }
    }

    // Detect low stakes sections (stakes < 40 for 3+ consecutive chapters)
    for (let i = 0; i < graph.points.length - 2; i++) {
      const slice = graph.points.slice(i, i + 3);
      if (slice.every((p) => p.stakes < 40)) {
        lowStakes.push({
          chapters: slice.map((p) => p.chapter),
          suggestion: `Stakes are low in chapters ${slice[0].chapter}-${slice[2].chapter}. Consider raising what's at risk.`,
        });
        i += 2;
      }
    }

    // Detect early action spikes (action > 70 in Act 1)
    const act1Points = graph.points.filter((p) => p.act === 1);
    for (const point of act1Points) {
      if (point.actionCrisis > 70) {
        pacingIssues.push({
          type: "too-early",
          chapter: point.chapter,
          suggestion: `Action intensity spikes early in chapter ${point.chapter}. Consider building more gradually to preserve impact for later climaxes.`,
        });
      }
    }
  }

  // Calculate overall score based on structure
  let score = 70; // Base score
  if (flatArcs.length === 0) score += 10;
  if (lowStakes.length === 0) score += 10;
  if (pacingIssues.length === 0) score += 10;

  return {
    flatArcs,
    lowStakes,
    pacingIssues,
    emotionalDisconnects: [],
    canonViolations: [],
    overallScore: Math.min(100, score),
    summary:
      flatArcs.length === 0 &&
      lowStakes.length === 0 &&
      pacingIssues.length === 0
        ? "Your story arc shows excellent structure with clear three-act progression and well-paced intensity throughout."
        : `Your story arc shows good structure overall. ${
            flatArcs.length > 0
              ? "Some sections could use more emotional variation. "
              : ""
          }${
            lowStakes.length > 0
              ? "Consider raising stakes in identified sections. "
              : ""
          }${
            pacingIssues.length > 0 ? "Watch pacing in early chapters. " : ""
          }`,
  };
}
