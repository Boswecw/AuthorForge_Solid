use serde::{Deserialize, Serialize};
use shared::{Id, Timestamps};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Location {
    pub id: Id,
    pub name: String,
    pub kind: String,      // city, forest, realm…
    pub summary: String,   // short blurb
    pub ts: Timestamps,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Faction {
    pub id: Id,
    pub name: String,
    pub alignment: String, // lawful good, neutral, etc.
    pub goal: String,
    pub ts: Timestamps,
}
