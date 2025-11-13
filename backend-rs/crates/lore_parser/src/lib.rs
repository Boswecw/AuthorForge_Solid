#![deny(unsafe_code)]

pub mod calendar;
pub mod gazetteer;
pub mod linker;
pub mod parser;
pub mod patterns;
pub mod types;
pub mod util;

// Re-export main types for convenience
pub use calendar::Calendar;
pub use gazetteer::Gazetteer;
pub use linker::Linker;
pub use parser::Parser;
pub use patterns::PatternSet;
pub use types::{EntityHit, HitSource, Kind, Link, ParseRequest, ParseResponse, Span};

// Legacy compatibility - keep old API working

use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum EntityKind {
    Person,
    Place,
    Item,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityCandidate {
    pub text: String,
    pub kind: EntityKind,
}

pub fn extract(text: &str) -> Vec<EntityCandidate> {
    // Naive starters (we’ll swap for a better NLP/LLM flow later).
    let mut out = Vec::new();

    // People: Title + Capitalized Surname (e.g., Lady Amicae)
    let re_person =
        Regex::new(r"\b(?:Lord|Lady|Sir|Dame|Prince|Princess)\s+[A-Z][a-zA-Z']+\b").unwrap();
    for m in re_person.find_iter(text) {
        out.push(EntityCandidate {
            text: m.as_str().to_string(),
            kind: EntityKind::Person,
        });
    }

    // Places: Capitalized two-word sequences (e.g., Storm Coast)
    let re_place = Regex::new(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b").unwrap();
    for caps in re_place.captures_iter(text) {
        let s = caps.get(1).unwrap().as_str();
        if s.split_whitespace().count() >= 2 {
            out.push(EntityCandidate {
                text: s.to_string(),
                kind: EntityKind::Place,
            });
        }
    }

    // Items: “The <Capitalized>” (e.g., The Aegis)
    let re_item = Regex::new(r"\bThe\s+[A-Z][a-zA-Z']+\b").unwrap();
    for m in re_item.find_iter(text) {
        out.push(EntityCandidate {
            text: m.as_str().to_string(),
            kind: EntityKind::Item,
        });
    }

    out
}
