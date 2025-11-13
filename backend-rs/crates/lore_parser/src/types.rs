use serde::{Deserialize, Serialize};

/// A text span with start/end byte offsets
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Span {
    pub start: usize,
    pub end: usize,
    pub text: String,
}

/// Entity kind/type
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "camelCase")]
pub enum Kind {
    Person,
    Place,
    Faction,
    Item,
    Creature,
    Magic,
    Date,
    Custom(String),
}

impl Kind {
    pub fn from_str(s: &str) -> Self {
        match s {
            "Person" => Kind::Person,
            "Place" => Kind::Place,
            "Faction" => Kind::Faction,
            "Item" => Kind::Item,
            "Creature" => Kind::Creature,
            "Magic" => Kind::Magic,
            "Date" => Kind::Date,
            other => Kind::Custom(other.to_string()),
        }
    }
}

/// Source of an entity hit
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum HitSource {
    Gazetteer,
    Pattern,
    Fuzzy,
}

/// Link to a resolved entity in the database
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Link {
    pub id: Option<String>,
    pub slug: Option<String>,
    pub name: String,
    pub kind: Kind,
}

/// A detected entity in text
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EntityHit {
    pub kind: Kind,
    pub span: Span,
    pub source: HitSource,
    pub pattern_id: Option<String>,
    pub score: f32,
    pub link: Option<Link>,
}

/// Request to parse text for entities
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseRequest {
    pub text: String,
    pub project_id: Option<String>,
    pub kinds: Option<Vec<Kind>>,
    pub fuzzy: Option<bool>,
}

/// Response from parsing
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseResponse {
    pub hits: Vec<EntityHit>,
    pub tokens: Vec<String>,
}

