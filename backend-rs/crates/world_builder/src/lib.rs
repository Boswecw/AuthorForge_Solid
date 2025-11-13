#![deny(unsafe_code)]
pub mod models;

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
}
