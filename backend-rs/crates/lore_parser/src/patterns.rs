use anyhow::Result;
use regex::Regex;
use serde::Deserialize;
use std::fs;

use crate::types::Kind;

#[derive(Debug, Deserialize)]
pub struct PatternRule {
    pub id: String,
    pub kind: String,
    pub regex: String,
    pub score: f32,
    #[serde(default)]
    pub constraints: Option<Constraints>,
    #[serde(default)]
    pub hints: Option<Hints>,
}

#[derive(Debug, Deserialize, Default, Clone)]
pub struct Constraints {
    pub min_len: Option<usize>,
    pub max_tokens: Option<usize>,
    pub disallow: Option<Vec<String>>,
}

#[derive(Debug, Deserialize, Default, Clone)]
pub struct Hints {
    pub left: Option<Vec<String>>,
    pub right: Option<Vec<String>>,
}

/// Compiled pattern rule
#[derive(Clone)]
pub struct CompiledPattern {
    pub id: String,
    pub kind: Kind,
    pub regex: Regex,
    pub score: f32,
    pub constraints: Constraints,
    pub hints: Hints,
}

/// Pattern set for regex-based entity matching
#[derive(Clone)]
pub struct PatternSet {
    pub rules: Vec<CompiledPattern>,
}

impl PatternSet {
    /// Load patterns from YAML file
    pub fn load(path: &str) -> Result<Self> {
        #[derive(Deserialize)]
        struct Root {
            patterns: Vec<PatternRule>,
        }

        let raw = fs::read_to_string(path)?;
        let root: Root = serde_yaml::from_str(&raw)?;

        let mut rules = Vec::new();
        for r in root.patterns {
            let kind = Kind::from_str(&r.kind);
            let regex = Regex::new(&r.regex)?;

            rules.push(CompiledPattern {
                id: r.id,
                kind,
                regex,
                score: r.score,
                constraints: r.constraints.unwrap_or_default(),
                hints: r.hints.unwrap_or_default(),
            });
        }

        Ok(Self { rules })
    }

    /// Create an empty pattern set (for testing)
    pub fn empty() -> Self {
        Self { rules: Vec::new() }
    }

    /// Load and merge multiple pattern files (for per-project overrides)
    pub fn load_many(paths: &[&str]) -> Result<Self> {
        #[derive(Deserialize)]
        struct Root {
            patterns: Vec<PatternRule>,
        }

        let mut all_rules = Vec::new();

        for path in paths {
            // Skip if file doesn't exist (optional overrides)
            if !std::path::Path::new(path).exists() {
                continue;
            }

            let raw = fs::read_to_string(path)?;
            let root: Root = serde_yaml::from_str(&raw)?;

            for r in root.patterns {
                let kind = Kind::from_str(&r.kind);
                let regex = Regex::new(&r.regex)?;

                all_rules.push(CompiledPattern {
                    id: r.id,
                    kind,
                    regex,
                    score: r.score,
                    constraints: r.constraints.unwrap_or_default(),
                    hints: r.hints.unwrap_or_default(),
                });
            }
        }

        Ok(Self { rules: all_rules })
    }

    /// Add a pattern (for testing)
    pub fn add_pattern(
        &mut self,
        id: String,
        kind: Kind,
        regex_str: &str,
        score: f32,
    ) -> Result<()> {
        let regex = Regex::new(regex_str)?;
        self.rules.push(CompiledPattern {
            id,
            kind,
            regex,
            score,
            constraints: Constraints::default(),
            hints: Hints::default(),
        });
        Ok(())
    }

    /// Add extra dynamic patterns (e.g., from calendar)
    pub fn with_extra(mut self, extra: Vec<(String, Kind, String, f32)>) -> Result<Self> {
        for (id, kind, regex_src, score) in extra {
            let regex = Regex::new(&regex_src)?;
            self.rules.push(CompiledPattern {
                id,
                kind,
                regex,
                score,
                constraints: Constraints::default(),
                hints: Hints::default(),
            });
        }
        Ok(self)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_pattern_set() {
        let ps = PatternSet::empty();
        assert_eq!(ps.rules.len(), 0);
    }

    #[test]
    fn test_add_pattern() {
        let mut ps = PatternSet::empty();
        ps.add_pattern("test".to_string(), Kind::Person, r"\b[A-Z][a-z]+\b", 0.8)
            .unwrap();
        assert_eq!(ps.rules.len(), 1);
        assert_eq!(ps.rules[0].id, "test");
    }

    #[test]
    fn test_pattern_matching() {
        let mut ps = PatternSet::empty();
        ps.add_pattern(
            "person_title".to_string(),
            Kind::Person,
            r"(?:Lord|Lady)\s+([A-Z][a-z]+)",
            0.9,
        )
        .unwrap();

        let text = "Lord Rawn stood tall";
        let matches: Vec<_> = ps.rules[0].regex.find_iter(text).collect();
        assert_eq!(matches.len(), 1);
        assert_eq!(matches[0].as_str(), "Lord Rawn");
    }
}
