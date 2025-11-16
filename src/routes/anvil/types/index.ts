/**
 * Character Arc Type Definitions
 *
 * Core data models for the Anvil workspace character arc tracking system.
 * These types define the structure for character development across internal,
 * external, and spiritual arcs with beat-level timeline tracking.
 */

export type ArcRole =
  | "Protagonist"
  | "Antagonist"
  | "Support"
  | "Mentor"
  | "Foil"
  | "Love Interest"
  | "Comic Relief"
  | "Other";

export type ActNumber = 1 | 2 | 3;

export type CharacterStatus = "Alive" | "Dead" | "Unknown" | "Undead";

export type POVStatus = "POV" | "Non-POV" | "Occasional POV";

/**
 * Arc Section - Represents one of the three arc types
 * (Internal, External, or Spiritual)
 */
export interface ArcSection {
  /** High-level summary of this arc (e.g., "Flaw → Belief → Transformation") */
  summary: string;

  /** Detailed notes and development thoughts */
  notes: string;

  /** Key transformation points or milestones */
  keyPoints: string[];
}

/**
 * Arc Beat - A specific moment in the character's journey
 * tied to a particular act and potentially linked to chapters
 */
export interface ArcBeat {
  id: string;

  /** Which act this beat belongs to (1, 2, or 3) */
  actNumber: ActNumber;

  /** Beat title (e.g., "Want vs Need", "Midpoint Clarity") */
  title: string;

  /** Detailed description of what happens in this beat */
  description: string;

  /** Chapter IDs where this beat appears */
  chapterLinks: string[];

  /** AI-generated suggestions for this beat (optional) */
  aiSuggestions?: string;

  /** Short directional prompts from AI (optional) */
  aiPrompts?: string[];
}

/**
 * Arc Relation - Relationship between this character and another
 */
export interface ArcRelation {
  /** ID of the related character */
  characterId: string;

  /** Type of relationship (e.g., "Mentor", "Enemy", "Love Interest") */
  relationshipType: string;

  /** Description of the relationship and how it evolves */
  description: string;

  /** How this relationship changes across the story */
  evolution?: string;
}

/**
 * Character Arc - Complete character development tracking
 */
export interface CharacterArc {
  id: string;

  /** Project ID this character belongs to */
  projectId?: string;

  /** Character name */
  name: string;

  /** Alias or nickname */
  alias?: string;

  /** Title (e.g., "King", "Captain", "Doctor") */
  title?: string;

  /** Character biography/backstory */
  bio: string;

  /** Species (e.g., "Human", "Elf", "Dragon") */
  species: string;

  /** Age (optional) */
  age?: number;

  /** Faction or group affiliation */
  faction?: string;

  /** Character's role in the story */
  role: ArcRole;

  /** POV status */
  povStatus: POVStatus;

  /** Current status (alive, dead, etc.) */
  status: CharacterStatus;

  /** Emotional keywords for AI tone guidance */
  emotionalTags: string[];

  /** Portrait image URL (optional) */
  portraitUrl?: string;

  /** Internal arc (flaw → belief → transformation) */
  internalArc: ArcSection;

  /** External arc (mission → obstacles → growth) */
  externalArc: ArcSection;

  /** Spiritual/faith arc (journey, moral tension, redemption) */
  spiritualArc: ArcSection;

  /** Timeline beats across all acts */
  beats: ArcBeat[];

  /** Relationships with other characters */
  relationships: ArcRelation[];

  /** Timestamp of last update */
  updatedAt?: string;

  /** Timestamp of creation */
  createdAt?: string;
}

/**
 * Filter options for character list
 */
export interface CharacterFilter {
  role?: ArcRole;
  povStatus?: POVStatus;
  status?: CharacterStatus;
  species?: string;
  faction?: string;
  searchQuery?: string;
}

/**
 * AI Context for beat suggestions
 */
export interface AIBeatContext {
  beat: ArcBeat;
  character: CharacterArc;
  previousBeats?: ArcBeat[];
  genre?: string;
}
