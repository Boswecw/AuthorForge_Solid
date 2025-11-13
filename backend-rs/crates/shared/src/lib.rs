#![deny(unsafe_code)]
pub use anyhow::Result;
use serde::{Deserialize, Serialize};
use time::OffsetDateTime;
use uuid::Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Id(Uuid);

impl Id {
    pub fn new() -> Self {
        Self(Uuid::new_v4())
    }

    pub fn from_str(s: &str) -> Result<Self> {
        Ok(Self(Uuid::parse_str(s)?))
    }

    pub fn as_str(&self) -> String {
        self.0.to_string()
    }
}

impl std::fmt::Display for Id {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Timestamps {
    pub created_at: OffsetDateTime,
    pub updated_at: OffsetDateTime,
}

impl Timestamps {
    pub fn new_now() -> Self {
        let now = OffsetDateTime::now_utc();
        Self {
            created_at: now,
            updated_at: now,
        }
    }
    pub fn touch(&mut self) {
        self.updated_at = OffsetDateTime::now_utc();
    }
}
