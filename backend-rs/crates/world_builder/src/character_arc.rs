use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CharacterArc {
    pub id: String,
    pub project_id: String,
    pub name: String,
    pub alias: Option<String>,
    pub title: Option<String>,
    pub bio: String,
    pub species: Option<String>,
    pub age: Option<i32>,
    pub faction: Option<String>,
    pub role: String,       // ArcRole
    pub pov_status: String, // POVStatus
    pub status: String,     // CharacterStatus
    pub emotional_tags: Vec<String>,
    pub portrait_path: Option<String>,

    // Arc sections (stored as JSON)
    pub internal_arc: ArcSection,
    pub external_arc: ArcSection,
    pub spiritual_arc: ArcSection,

    // Beats and relationships (stored separately)
    pub beats: Vec<ArcBeat>,
    pub relationships: Vec<ArcRelation>,

    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArcSection {
    pub summary: String,
    pub notes: String,
    pub key_points: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArcBeat {
    pub id: String,
    pub act_number: i32, // 1, 2, or 3
    pub title: String,
    pub description: String,
    pub chapter_links: Vec<String>,
    pub ai_suggestions: Option<String>,
    pub ai_prompts: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArcRelation {
    pub character_id: String,
    pub relationship_type: String,
    pub description: String,
    pub evolution: Option<String>,
}

// Database row representation (for SQLite)
#[derive(Debug)]
pub(crate) struct CharacterArcRow {
    pub id: String,
    pub project_id: String,
    pub name: String,
    pub alias: Option<String>,
    pub title: Option<String>,
    pub bio: String,
    pub species: Option<String>,
    pub age: Option<i32>,
    pub faction: Option<String>,
    pub role: String,
    pub pov_status: String,
    pub status: String,
    pub emotional_tags_json: String, // JSON array
    pub portrait_path: Option<String>,
    pub internal_arc_json: String,  // JSON object
    pub external_arc_json: String,  // JSON object
    pub spiritual_arc_json: String, // JSON object
    pub beats_json: String,         // JSON array
    pub relationships_json: String, // JSON array
    pub created_at: String,
    pub updated_at: String,
}

impl CharacterArcRow {
    pub fn to_character_arc(self) -> shared::Result<CharacterArc> {
        Ok(CharacterArc {
            id: self.id,
            project_id: self.project_id,
            name: self.name,
            alias: self.alias,
            title: self.title,
            bio: self.bio,
            species: self.species,
            age: self.age,
            faction: self.faction,
            role: self.role,
            pov_status: self.pov_status,
            status: self.status,
            emotional_tags: serde_json::from_str(&self.emotional_tags_json)?,
            portrait_path: self.portrait_path,
            internal_arc: serde_json::from_str(&self.internal_arc_json)?,
            external_arc: serde_json::from_str(&self.external_arc_json)?,
            spiritual_arc: serde_json::from_str(&self.spiritual_arc_json)?,
            beats: serde_json::from_str(&self.beats_json)?,
            relationships: serde_json::from_str(&self.relationships_json)?,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}

impl CharacterArc {
    pub(crate) fn to_row(&self) -> shared::Result<CharacterArcRow> {
        Ok(CharacterArcRow {
            id: self.id.clone(),
            project_id: self.project_id.clone(),
            name: self.name.clone(),
            alias: self.alias.clone(),
            title: self.title.clone(),
            bio: self.bio.clone(),
            species: self.species.clone(),
            age: self.age,
            faction: self.faction.clone(),
            role: self.role.clone(),
            pov_status: self.pov_status.clone(),
            status: self.status.clone(),
            emotional_tags_json: serde_json::to_string(&self.emotional_tags)?,
            portrait_path: self.portrait_path.clone(),
            internal_arc_json: serde_json::to_string(&self.internal_arc)?,
            external_arc_json: serde_json::to_string(&self.external_arc)?,
            spiritual_arc_json: serde_json::to_string(&self.spiritual_arc)?,
            beats_json: serde_json::to_string(&self.beats)?,
            relationships_json: serde_json::to_string(&self.relationships)?,
            created_at: self.created_at.clone(),
            updated_at: self.updated_at.clone(),
        })
    }
}
