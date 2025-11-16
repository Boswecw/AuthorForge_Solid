/**
 * Character Arc Data Layer
 *
 * Provides persistent storage for character arc data using IndexedDB.
 * This implementation provides real browser-based persistence with
 * proper indexing and transaction support.
 */

import { characterArcDB } from "~/lib/db/characterArcDB";
import type { CharacterArc, ArcBeat, AIBeatContext } from "../types";

// Initial mock data for seeding
const INITIAL_MOCK_ARCS: CharacterArc[] = [
  {
    id: "char-1",
    name: "Rawn Mortisimus",
    alias: "The Ember Knight",
    title: "Captain",
    bio: "A battle-hardened warrior struggling with the weight of past failures and seeking redemption through faith.",
    species: "Human",
    age: 34,
    faction: "Order of the Flame",
    role: "Protagonist",
    povStatus: "POV",
    status: "Alive",
    emotionalTags: ["brooding", "determined", "conflicted", "protective"],
    internalArc: {
      summary:
        "Guilt over past failure → Belief in unworthiness → Acceptance of grace and forgiveness",
      notes:
        "Rawn's internal journey centers on his inability to forgive himself for the death of his squad. He believes he's unworthy of redemption.",
      keyPoints: [
        "Haunted by memories of fallen comrades",
        "Pushes away those who care about him",
        "Discovers that grace isn't earned but given",
        "Learns to forgive himself through faith",
      ],
    },
    externalArc: {
      summary:
        "Protect the kingdom → Face overwhelming enemy forces → Become a true leader",
      notes:
        "Externally, Rawn must lead a desperate defense against an invading army while learning to trust his new squad.",
      keyPoints: [
        "Reluctant to take command",
        "Builds trust with new squad members",
        "Makes tactical sacrifices for greater good",
        "Becomes the leader his people need",
      ],
    },
    spiritualArc: {
      summary: "Anger at God → Wrestling with faith → Surrender and renewal",
      notes:
        "Rawn's faith journey involves moving from anger at God for 'allowing' his squad to die to understanding divine sovereignty and grace.",
      keyPoints: [
        "Questions why God didn't save his friends",
        "Encounters a chaplain who challenges his theology",
        "Witnesses miraculous provision in battle",
        "Surrenders his guilt and accepts God's forgiveness",
      ],
    },
    beats: [
      {
        id: "beat-1",
        actNumber: 1,
        title: "Want vs Need",
        description:
          "Rawn wants to prove he's still a capable warrior. He needs to learn to forgive himself and trust others.",
        chapterLinks: ["ch-1", "ch-2"],
      },
      {
        id: "beat-2",
        actNumber: 1,
        title: "Inciting Wound Reactivation",
        description:
          "A new recruit reminds Rawn of his fallen friend, triggering painful memories and defensive behavior.",
        chapterLinks: ["ch-3"],
      },
      {
        id: "beat-3",
        actNumber: 2,
        title: "Midpoint Clarity",
        description:
          "During a desperate battle, Rawn realizes his isolation is hurting his squad. He begins to open up.",
        chapterLinks: ["ch-12"],
      },
      {
        id: "beat-4",
        actNumber: 3,
        title: "Truth Acceptance",
        description:
          "Rawn finally accepts that he can't save everyone, but he can honor the fallen by protecting the living.",
        chapterLinks: ["ch-22"],
      },
    ],
    relationships: [
      {
        characterId: "char-2",
        relationshipType: "Mentor",
        description:
          "Father Aldric serves as Rawn's spiritual guide, challenging his anger and helping him find peace.",
      },
    ],
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-15T14:30:00Z",
  },
  {
    id: "char-2",
    name: "Father Aldric",
    title: "Chaplain",
    bio: "A wise and compassionate chaplain who serves the Order of the Flame, offering spiritual guidance to warriors.",
    species: "Human",
    age: 58,
    faction: "Order of the Flame",
    role: "Mentor",
    povStatus: "Non-POV",
    status: "Alive",
    emotionalTags: ["wise", "compassionate", "patient", "faithful"],
    internalArc: {
      summary:
        "Comfortable faith → Tested by war's horrors → Deepened trust in God's sovereignty",
      notes:
        "Aldric's faith is tested as he witnesses the brutality of war and must minister to broken soldiers.",
      keyPoints: [],
    },
    externalArc: {
      summary:
        "Minister to soldiers → Face his own doubts → Become a beacon of hope",
      notes:
        "Aldric must balance his role as spiritual guide with the harsh realities of military life.",
      keyPoints: [],
    },
    spiritualArc: {
      summary:
        "Theoretical faith → Practical faith under fire → Unshakeable trust",
      notes:
        "Aldric's journey involves moving from academic theology to lived faith in the trenches.",
      keyPoints: [],
    },
    beats: [],
    relationships: [],
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
];

// Initialize database with mock data if empty
let dbInitialized = false;

async function ensureInitialized(projectId: string = "default-project") {
  if (dbInitialized) return;

  const count = await characterArcDB.count(projectId);
  if (count === 0) {
    // Seed with initial data
    for (const arc of INITIAL_MOCK_ARCS) {
      await characterArcDB.save({ ...arc, projectId });
    }
  }

  dbInitialized = true;
}

/**
 * Get all character arcs
 */
export async function getCharacterArcs(
  projectId: string = "default-project"
): Promise<CharacterArc[]> {
  await ensureInitialized(projectId);

  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 100));

  return await characterArcDB.getAll(projectId);
}

/**
 * Get a single character arc by ID
 */
export async function getCharacterArc(
  id: string
): Promise<CharacterArc | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return await characterArcDB.get(id);
}

/**
 * Save or update a character arc
 */
export async function saveCharacterArc(
  arc: CharacterArc
): Promise<CharacterArc> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Ensure timestamps
  const existing = await characterArcDB.get(arc.id);
  const arcToSave = {
    ...arc,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectId: arc.projectId || "default-project",
  };

  return await characterArcDB.save(arcToSave);
}

/**
 * Delete a character arc
 */
export async function deleteCharacterArc(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    await characterArcDB.delete(id);
    return true;
  } catch (error) {
    console.error("Failed to delete character arc:", error);
    return false;
  }
}

/**
 * Generate AI beat suggestion
 */
export async function generateAIBeatSuggestion(
  context: AIBeatContext
): Promise<{
  suggestion: string;
  prompts: string[];
}> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock AI response
  return {
    suggestion: `For the "${context.beat.title}" beat in Act ${
      context.beat.actNumber
    }, consider showing ${
      context.character.name
    }'s internal struggle through action. This moment should reveal their core flaw while setting up the transformation to come. The emotional tone should be ${
      context.character.emotionalTags[0] || "intense"
    } with undertones of ${context.character.emotionalTags[1] || "conflict"}.`,
    prompts: [
      `Show ${context.character.name} making a choice that reveals their flaw`,
      `Introduce a relationship that challenges their belief`,
      `Create a moment of vulnerability that hints at their need`,
      `Establish the stakes of their external mission`,
      `Plant a seed of their spiritual journey`,
    ],
  };
}
