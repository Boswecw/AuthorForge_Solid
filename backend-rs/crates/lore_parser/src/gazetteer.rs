use aho_corasick::{AhoCorasick, AhoCorasickBuilder};
use anyhow::Result;
use serde::Deserialize;
use std::collections::{BTreeMap, HashMap};
use std::fs;

use crate::types::Kind;

#[derive(Debug, Deserialize)]
struct EntitiesRoot {
    kinds: BTreeMap<String, KindConfig>,
}

#[derive(Debug, Deserialize)]
struct KindConfig {
    #[serde(default)]
    _titles: Option<Vec<String>>,
    #[serde(default)]
    _honorifics: Option<Vec<String>>,
    #[serde(default)]
    gazetteer: Option<Vec<String>>,
}

/// Gazetteer for fast dictionary-based entity matching
#[derive(Clone)]
pub struct Gazetteer {
    pub ac: AhoCorasick,
    pub map: HashMap<u32, (Kind, String)>, // pattern_idx -> (Kind, surface)
}

impl Gazetteer {
    /// Load gazetteer from YAML file
    pub fn load(path: &str) -> Result<Self> {
        let raw = fs::read_to_string(path)?;
        let root: EntitiesRoot = serde_yaml::from_str(&raw)?;

        let mut patterns = Vec::new();
        let mut map = HashMap::new();

        for (kind_name, cfg) in root.kinds {
            let kind = Kind::from_str(&kind_name);

            if let Some(list) = cfg.gazetteer {
                for surface in list {
                    let idx = patterns.len() as u32;
                    patterns.push(surface.clone());
                    map.insert(idx, (kind.clone(), surface));
                }
            }
        }

        let ac = AhoCorasickBuilder::new()
            .ascii_case_insensitive(false)
            .build(&patterns)?;

        Ok(Self { ac, map })
    }

    /// Create an empty gazetteer (for testing)
    pub fn empty() -> Self {
        let patterns: Vec<String> = Vec::new();
        let ac = AhoCorasickBuilder::new().build(&patterns).unwrap();
        Self {
            ac,
            map: HashMap::new(),
        }
    }

    /// Add a single entry to the gazetteer (for testing/dynamic updates)
    pub fn add_entry(&mut self, kind: Kind, surface: String) {
        let idx = self.map.len() as u32;
        self.map.insert(idx, (kind, surface.clone()));
        // Note: This requires rebuilding the AC automaton in production
        // For now, this is just for testing
    }

    /// Load and merge multiple gazetteer files (for per-project overrides)
    pub fn load_many(paths: &[&str]) -> Result<Self> {
        let mut all_patterns = Vec::new();
        let mut map = HashMap::new();

        for path in paths {
            // Skip if file doesn't exist (optional overrides)
            if !std::path::Path::new(path).exists() {
                continue;
            }

            let raw = fs::read_to_string(path)?;
            let root: EntitiesRoot = serde_yaml::from_str(&raw)?;

            for (kind_name, cfg) in root.kinds {
                let kind = Kind::from_str(&kind_name);

                if let Some(list) = cfg.gazetteer {
                    for surface in list {
                        let idx = all_patterns.len() as u32;
                        all_patterns.push(surface.clone());
                        map.insert(idx, (kind.clone(), surface));
                    }
                }
            }
        }

        let ac = AhoCorasickBuilder::new()
            .ascii_case_insensitive(false)
            .build(&all_patterns)?;

        Ok(Self { ac, map })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_gazetteer() {
        let gz = Gazetteer::empty();
        assert_eq!(gz.map.len(), 0);
    }

    #[test]
    fn test_add_entry() {
        let mut gz = Gazetteer::empty();
        gz.add_entry(Kind::Person, "Amicae".to_string());
        assert_eq!(gz.map.len(), 1);
        assert_eq!(gz.map.get(&0).unwrap().0, Kind::Person);
    }
}
