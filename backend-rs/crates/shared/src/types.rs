use serde::{Deserialize, Serialize};

/// Common types shared across the AuthorForge backend
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Character {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorldElement {
    pub id: String,
    pub name: String,
    pub element_type: String,
    pub content: String,
}

