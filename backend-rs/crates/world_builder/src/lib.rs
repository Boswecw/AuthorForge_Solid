#![deny(unsafe_code)]
pub mod character_arc;
pub mod models;

pub use character_arc::{ArcBeat, ArcRelation, ArcSection, CharacterArc};
use models::{Faction, Location};
use shared::{Id, Result, Timestamps};
use sqlx::{Row, SqlitePool};
use time::OffsetDateTime;

#[derive(Clone)]
pub struct WorldStore {
    pool: SqlitePool,
}

impl WorldStore {
    pub async fn new(database_url: &str) -> Result<Self> {
        let pool = SqlitePool::connect(database_url).await?;

        // Run migrations
        sqlx::migrate!("../../migrations").run(&pool).await?;

        Ok(Self { pool })
    }

    // --- Locations ---
    pub async fn create_location(&self, name: &str, kind: &str, summary: &str) -> Result<Location> {
        let loc = Location {
            id: Id::new(),
            name: name.to_string(),
            kind: kind.to_string(),
            summary: summary.to_string(),
            ts: Timestamps::new_now(),
        };

        sqlx::query(
            "INSERT INTO locations (id, name, kind, summary, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(loc.id.to_string())
        .bind(&loc.name)
        .bind(&loc.kind)
        .bind(&loc.summary)
        .bind(loc.ts.created_at)
        .bind(loc.ts.updated_at)
        .execute(&self.pool)
        .await?;

        Ok(loc)
    }

    pub async fn list_locations(&self) -> Result<Vec<Location>> {
        let rows =
            sqlx::query("SELECT id, name, kind, summary, created_at, updated_at FROM locations")
                .fetch_all(&self.pool)
                .await?;

        let mut locations = Vec::new();
        for row in rows {
            let id_str: String = row.get("id");
            let created_at: time::OffsetDateTime = row.get("created_at");
            let updated_at: time::OffsetDateTime = row.get("updated_at");

            locations.push(Location {
                id: Id::from_str(&id_str)?,
                name: row.get("name"),
                kind: row.get("kind"),
                summary: row.get("summary"),
                ts: Timestamps {
                    created_at,
                    updated_at,
                },
            });
        }

        Ok(locations)
    }

    // --- Factions ---
    pub async fn create_faction(&self, name: &str, alignment: &str, goal: &str) -> Result<Faction> {
        let fac = Faction {
            id: Id::new(),
            name: name.to_string(),
            alignment: alignment.to_string(),
            goal: goal.to_string(),
            ts: Timestamps::new_now(),
        };

        sqlx::query(
            "INSERT INTO factions (id, name, alignment, goal, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(fac.id.to_string())
        .bind(&fac.name)
        .bind(&fac.alignment)
        .bind(&fac.goal)
        .bind(fac.ts.created_at)
        .bind(fac.ts.updated_at)
        .execute(&self.pool)
        .await?;

        Ok(fac)
    }

    pub async fn list_factions(&self) -> Result<Vec<Faction>> {
        let rows =
            sqlx::query("SELECT id, name, alignment, goal, created_at, updated_at FROM factions")
                .fetch_all(&self.pool)
                .await?;

        let mut factions = Vec::new();
        for row in rows {
            let id_str: String = row.get("id");
            let created_at: OffsetDateTime = row.get("created_at");
            let updated_at: OffsetDateTime = row.get("updated_at");

            factions.push(Faction {
                id: Id::from_str(&id_str)?,
                name: row.get("name"),
                alignment: row.get("alignment"),
                goal: row.get("goal"),
                ts: Timestamps {
                    created_at,
                    updated_at,
                },
            });
        }

        Ok(factions)
    }

    // --- Character Arcs ---
    pub async fn get_character_arcs(&self, project_id: &str) -> Result<Vec<CharacterArc>> {
        let rows = sqlx::query(
            "SELECT id, project_id, name, alias, title, bio, species, age, faction, role, \
             pov_status, status, emotional_tags_json, portrait_path, internal_arc_json, \
             external_arc_json, spiritual_arc_json, beats_json, relationships_json, \
             created_at, updated_at FROM character_arcs WHERE project_id = ? ORDER BY name",
        )
        .bind(project_id)
        .fetch_all(&self.pool)
        .await?;

        let mut arcs = Vec::new();
        for row in rows {
            let arc_row = character_arc::CharacterArcRow {
                id: row.get("id"),
                project_id: row.get("project_id"),
                name: row.get("name"),
                alias: row.get("alias"),
                title: row.get("title"),
                bio: row.get("bio"),
                species: row.get("species"),
                age: row.get("age"),
                faction: row.get("faction"),
                role: row.get("role"),
                pov_status: row.get("pov_status"),
                status: row.get("status"),
                emotional_tags_json: row.get("emotional_tags_json"),
                portrait_path: row.get("portrait_path"),
                internal_arc_json: row.get("internal_arc_json"),
                external_arc_json: row.get("external_arc_json"),
                spiritual_arc_json: row.get("spiritual_arc_json"),
                beats_json: row.get("beats_json"),
                relationships_json: row.get("relationships_json"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            };
            arcs.push(arc_row.to_character_arc()?);
        }

        Ok(arcs)
    }

    pub async fn get_character_arc(&self, arc_id: &str) -> Result<Option<CharacterArc>> {
        let row = sqlx::query(
            "SELECT id, project_id, name, alias, title, bio, species, age, faction, role, \
             pov_status, status, emotional_tags_json, portrait_path, internal_arc_json, \
             external_arc_json, spiritual_arc_json, beats_json, relationships_json, \
             created_at, updated_at FROM character_arcs WHERE id = ?",
        )
        .bind(arc_id)
        .fetch_optional(&self.pool)
        .await?;

        match row {
            Some(row) => {
                let arc_row = character_arc::CharacterArcRow {
                    id: row.get("id"),
                    project_id: row.get("project_id"),
                    name: row.get("name"),
                    alias: row.get("alias"),
                    title: row.get("title"),
                    bio: row.get("bio"),
                    species: row.get("species"),
                    age: row.get("age"),
                    faction: row.get("faction"),
                    role: row.get("role"),
                    pov_status: row.get("pov_status"),
                    status: row.get("status"),
                    emotional_tags_json: row.get("emotional_tags_json"),
                    portrait_path: row.get("portrait_path"),
                    internal_arc_json: row.get("internal_arc_json"),
                    external_arc_json: row.get("external_arc_json"),
                    spiritual_arc_json: row.get("spiritual_arc_json"),
                    beats_json: row.get("beats_json"),
                    relationships_json: row.get("relationships_json"),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                };
                Ok(Some(arc_row.to_character_arc()?))
            }
            None => Ok(None),
        }
    }

    pub async fn save_character_arc(&self, arc: &CharacterArc) -> Result<CharacterArc> {
        let row = arc.to_row()?;

        // Check if exists
        let exists: bool =
            sqlx::query_scalar("SELECT COUNT(*) > 0 FROM character_arcs WHERE id = ?")
                .bind(&arc.id)
                .fetch_one(&self.pool)
                .await?;

        if exists {
            // Update
            sqlx::query(
                "UPDATE character_arcs SET project_id = ?, name = ?, alias = ?, title = ?, bio = ?, \
                 species = ?, age = ?, faction = ?, role = ?, pov_status = ?, status = ?, \
                 emotional_tags_json = ?, portrait_path = ?, internal_arc_json = ?, \
                 external_arc_json = ?, spiritual_arc_json = ?, beats_json = ?, \
                 relationships_json = ?, updated_at = ? WHERE id = ?"
            )
            .bind(&row.project_id)
            .bind(&row.name)
            .bind(&row.alias)
            .bind(&row.title)
            .bind(&row.bio)
            .bind(&row.species)
            .bind(&row.age)
            .bind(&row.faction)
            .bind(&row.role)
            .bind(&row.pov_status)
            .bind(&row.status)
            .bind(&row.emotional_tags_json)
            .bind(&row.portrait_path)
            .bind(&row.internal_arc_json)
            .bind(&row.external_arc_json)
            .bind(&row.spiritual_arc_json)
            .bind(&row.beats_json)
            .bind(&row.relationships_json)
            .bind(&row.updated_at)
            .bind(&row.id)
            .execute(&self.pool)
            .await?;
        } else {
            // Insert
            sqlx::query(
                "INSERT INTO character_arcs (id, project_id, name, alias, title, bio, species, age, \
                 faction, role, pov_status, status, emotional_tags_json, portrait_path, \
                 internal_arc_json, external_arc_json, spiritual_arc_json, beats_json, \
                 relationships_json, created_at, updated_at) \
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            )
            .bind(&row.id)
            .bind(&row.project_id)
            .bind(&row.name)
            .bind(&row.alias)
            .bind(&row.title)
            .bind(&row.bio)
            .bind(&row.species)
            .bind(&row.age)
            .bind(&row.faction)
            .bind(&row.role)
            .bind(&row.pov_status)
            .bind(&row.status)
            .bind(&row.emotional_tags_json)
            .bind(&row.portrait_path)
            .bind(&row.internal_arc_json)
            .bind(&row.external_arc_json)
            .bind(&row.spiritual_arc_json)
            .bind(&row.beats_json)
            .bind(&row.relationships_json)
            .bind(&row.created_at)
            .bind(&row.updated_at)
            .execute(&self.pool)
            .await?;
        }

        Ok(arc.clone())
    }

    pub async fn delete_character_arc(&self, arc_id: &str) -> Result<()> {
        sqlx::query("DELETE FROM character_arcs WHERE id = ?")
            .bind(arc_id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }
}
