use regex::Regex;
use unicode_segmentation::UnicodeSegmentation;

use crate::types::{EntityHit, HitSource, Kind, Span};

/// Tokenize text into words
pub fn tokenize(s: &str) -> Vec<String> {
    s.unicode_words().map(|w| w.to_string()).collect()
}

/// Deduplicate and merge overlapping entity hits
/// Prefers higher score and longer spans
pub fn dedupe_merge(mut hits: Vec<EntityHit>) -> Vec<EntityHit> {
    // Sort by start position, then by span length (descending)
    hits.sort_by_key(|h| (h.span.start, std::cmp::Reverse(h.span.end - h.span.start)));

    let mut out: Vec<EntityHit> = Vec::new();

    'outer: for h in hits {
        for o in out.iter_mut() {
            let overlap = !(h.span.end <= o.span.start || h.span.start >= o.span.end);
            if overlap {
                // Keep higher score / longer span
                let h_len = h.span.end - h.span.start;
                let o_len = o.span.end - o.span.start;

                if h.score > o.score || (h.score == o.score && h_len > o_len) {
                    *o = h;
                }
                continue 'outer;
            }
        }
        out.push(h);
    }

    out
}

/// Calculate context-aware score for an entity hit
pub fn context_score(text: &str, h: &EntityHit) -> f32 {
    let left = text[..h.span.start]
        .rsplit_once(|c: char| c.is_whitespace())
        .map(|(_a, b)| b)
        .unwrap_or("");

    let _right = text[h.span.end..].split_whitespace().next().unwrap_or("");

    let mut s = h.score;

    // Title cue for Person
    if matches!(h.kind, Kind::Person) {
        if left.ends_with("Lord")
            || left.ends_with("Lady")
            || left.ends_with("Queen")
            || left.ends_with("Captain")
            || left.ends_with("Archmage")
        {
            s += 0.05;
        }
    }

    // Preposition cue for Place
    if matches!(h.kind, Kind::Place) {
        if left.ends_with("of") || left.ends_with("at") || left.ends_with("near") {
            s += 0.04;
        }
    }

    // "the" before entity
    if left.ends_with("the") {
        s += 0.02;
    }

    // Capitalization boost (already capitalized in text)
    if h.span
        .text
        .chars()
        .next()
        .map_or(false, |c| c.is_uppercase())
    {
        s += 0.01;
    }

    // Clamp to valid range
    s.min(0.99).max(0.0)
}

/// Find fuzzy candidates (Title-Case multi-word phrases)
pub fn fuzzy_candidates(text: &str) -> Vec<EntityHit> {
    let mut out = Vec::new();

    // Match 1-3 capitalized words in a row
    let re = Regex::new(r"\b([A-Z][\p{L}''-]+(?:\s+[A-Z][\p{L}''-]+){0,2})\b").unwrap();

    for m in re.find_iter(text) {
        out.push(EntityHit {
            kind: Kind::Custom("Unknown".into()),
            span: Span {
                start: m.start(),
                end: m.end(),
                text: m.as_str().to_string(),
            },
            source: HitSource::Fuzzy,
            pattern_id: None,
            score: 0.5,
            link: None,
        });
    }

    out
}

// --- Stop-zones (code/quotes) ------------------------------------------------

#[derive(Debug, Clone, Copy)]
pub struct Zone {
    pub start: usize,
    pub end: usize,
}

/// Find stop-zones where entity extraction should be skipped
/// (code fences, inline code, and quotes)
pub fn find_stop_zones(text: &str) -> Vec<Zone> {
    let mut zones: Vec<Zone> = Vec::new();

    // Triple backticks (code fences)
    let fence_re = Regex::new(r"(?s)```.*?```").unwrap();
    for m in fence_re.find_iter(text) {
        zones.push(Zone {
            start: m.start(),
            end: m.end(),
        });
    }

    // Inline code: `...`
    let inline_re = Regex::new(r"`[^`]*`").unwrap();
    for m in inline_re.find_iter(text) {
        zones.push(Zone {
            start: m.start(),
            end: m.end(),
        });
    }

    // Straight double quotes
    let dq_re = Regex::new(r#"(?s)"[^"]*""#).unwrap();
    for m in dq_re.find_iter(text) {
        zones.push(Zone {
            start: m.start(),
            end: m.end(),
        });
    }

    // Straight single quotes
    let sq_re = Regex::new(r"(?s)'[^']*'").unwrap();
    for m in sq_re.find_iter(text) {
        zones.push(Zone {
            start: m.start(),
            end: m.end(),
        });
    }

    // Smart quotes " … " (U+201C and U+201D)
    let smart_dq_re = Regex::new(r"(?s)\u{201C}[^\u{201D}]*\u{201D}").unwrap();
    for m in smart_dq_re.find_iter(text) {
        zones.push(Zone {
            start: m.start(),
            end: m.end(),
        });
    }

    // Smart quotes ' … ' (U+2018 and U+2019)
    let smart_sq_re = Regex::new(r"(?s)\u{2018}[^\u{2019}]*\u{2019}").unwrap();
    for m in smart_sq_re.find_iter(text) {
        zones.push(Zone {
            start: m.start(),
            end: m.end(),
        });
    }

    // Sort and merge overlapping/touching zones
    zones.sort_by_key(|z| z.start);
    let mut out: Vec<Zone> = Vec::new();
    for z in zones {
        if let Some(last) = out.last_mut() {
            if z.start <= last.end {
                last.end = last.end.max(z.end);
                continue;
            }
        }
        out.push(z);
    }
    out
}

/// Check if a span overlaps with any stop-zone
pub fn in_zones(zones: &[Zone], start: usize, end: usize) -> bool {
    // Binary search over sorted zones
    let mut lo = 0usize;
    let mut hi = zones.len();
    while lo < hi {
        let mid = (lo + hi) / 2;
        let z = zones[mid];
        if end <= z.start {
            hi = mid;
        } else if start >= z.end {
            lo = mid + 1;
        } else {
            return true;
        }
    }
    false
}

// --- Coreference Resolution --------------------------------------------------

/// Title words used for coreference resolution
pub fn title_words() -> &'static [&'static str] {
    &[
        "King",
        "Queen",
        "Lord",
        "Lady",
        "Captain",
        "Archmage",
        "Commander",
        "Priest",
        "Priestess",
        "Duke",
        "Duchess",
        "Prince",
        "Princess",
        "Sir",
        "Dame",
    ]
}

/// Find coref candidates: pronouns + "the <Title>"
pub fn coref_candidates(text: &str) -> Vec<Span> {
    let mut out = Vec::new();

    // Pronouns (lowercase)
    let pro = Regex::new(r"\b(she|her|hers|he|him|his|they|them|theirs)\b").unwrap();
    for m in pro.find_iter(text) {
        out.push(Span {
            start: m.start(),
            end: m.end(),
            text: m.as_str().to_string(),
        });
    }

    // "the Queen", "the archmage" (case-insensitive)
    let titles = title_words().join("|");
    let re_title = Regex::new(&format!(r"(?i)\bthe\s+({})\b", titles)).unwrap();
    for m in re_title.find_iter(text) {
        out.push(Span {
            start: m.start(),
            end: m.end(),
            text: m.as_str().to_string(),
        });
    }

    out
}

/// Convert text to slug format
pub fn slugify(s: &str) -> String {
    s.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|p| !p.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tokenize() {
        let tokens = tokenize("Hello, world! This is a test.");
        assert_eq!(tokens, vec!["Hello", "world", "This", "is", "a", "test"]);
    }

    #[test]
    fn test_tokenize_unicode() {
        let tokens = tokenize("Café résumé naïve");
        assert_eq!(tokens, vec!["Café", "résumé", "naïve"]);
    }

    #[test]
    fn test_dedupe_merge_no_overlap() {
        let hits = vec![
            EntityHit {
                kind: Kind::Person,
                span: Span {
                    start: 0,
                    end: 5,
                    text: "Alice".to_string(),
                },
                source: HitSource::Gazetteer,
                pattern_id: None,
                score: 0.9,
                link: None,
            },
            EntityHit {
                kind: Kind::Place,
                span: Span {
                    start: 10,
                    end: 15,
                    text: "Paris".to_string(),
                },
                source: HitSource::Gazetteer,
                pattern_id: None,
                score: 0.8,
                link: None,
            },
        ];

        let result = dedupe_merge(hits);
        assert_eq!(result.len(), 2);
    }

    #[test]
    fn test_dedupe_merge_overlap_higher_score() {
        let hits = vec![
            EntityHit {
                kind: Kind::Person,
                span: Span {
                    start: 0,
                    end: 10,
                    text: "Lord Rawn".to_string(),
                },
                source: HitSource::Pattern,
                pattern_id: Some("person_title".to_string()),
                score: 0.95,
                link: None,
            },
            EntityHit {
                kind: Kind::Person,
                span: Span {
                    start: 5,
                    end: 10,
                    text: "Rawn".to_string(),
                },
                source: HitSource::Gazetteer,
                pattern_id: None,
                score: 0.8,
                link: None,
            },
        ];

        let result = dedupe_merge(hits);
        assert_eq!(result.len(), 1);
        assert_eq!(result[0].span.text, "Lord Rawn");
        assert_eq!(result[0].score, 0.95);
    }

    #[test]
    fn test_context_score_person_title() {
        let hit = EntityHit {
            kind: Kind::Person,
            span: Span {
                start: 5,
                end: 10,
                text: "Rawn".to_string(),
            },
            source: HitSource::Gazetteer,
            pattern_id: None,
            score: 0.8,
            link: None,
        };

        let text = "Lord Rawn stood tall";
        let score = context_score(text, &hit);
        assert!(score > 0.8); // Should be boosted
    }

    #[test]
    fn test_fuzzy_candidates() {
        let text = "Queen Amicae of Eryndor met Lord Rawn at the Storm Coast.";
        let candidates = fuzzy_candidates(text);

        assert!(candidates.len() >= 3);
        let texts: Vec<_> = candidates.iter().map(|c| c.span.text.as_str()).collect();
        assert!(texts.contains(&"Queen Amicae"));
        assert!(texts.contains(&"Lord Rawn"));
        assert!(texts.contains(&"Storm Coast"));
    }
}
