use crate::gazetteer::Gazetteer;
use crate::patterns::PatternSet;
use crate::types::{EntityHit, HitSource, Kind, Link, ParseRequest, ParseResponse, Span};
use crate::util;

/// Main lore parser
#[derive(Clone)]
pub struct Parser {
    gz: Gazetteer,
    pat: PatternSet,
}

impl Parser {
    /// Create a new parser with gazetteer and patterns
    pub fn new(gz: Gazetteer, pat: PatternSet) -> Self {
        Self { gz, pat }
    }

    /// Parse text and extract entities
    pub fn parse(&self, text: &str, fuzzy: bool) -> ParseResponse {
        // 1) Tokenize
        let tokens = util::tokenize(text);

        // 1.5) Find stop-zones (code, quotes)
        let stop = util::find_stop_zones(text);

        // 2) Gazetteer matches (dictionary lookup)
        let mut hits = Vec::<EntityHit>::new();

        for m in self.gz.ac.find_overlapping_iter(text) {
            // Skip if in stop-zone
            if util::in_zones(&stop, m.start(), m.end()) {
                continue;
            }

            let pattern_id = m.pattern().as_u32();
            if let Some((kind, _surface)) = self.gz.map.get(&pattern_id) {
                hits.push(EntityHit {
                    kind: kind.clone(),
                    span: Span {
                        start: m.start(),
                        end: m.end(),
                        text: text[m.start()..m.end()].to_string(),
                    },
                    source: HitSource::Gazetteer,
                    pattern_id: None,
                    score: 0.93,
                    link: None,
                });
            }
        }

        // 3) Pattern matches (regex-based)
        for rule in &self.pat.rules {
            for cap in rule.regex.captures_iter(text) {
                let m = cap.get(0).unwrap();

                // Skip if in stop-zone
                if util::in_zones(&stop, m.start(), m.end()) {
                    continue;
                }

                // Try to extract named groups (name, title) or use full match
                let span_text = cap
                    .name("name")
                    .or_else(|| cap.name("title"))
                    .unwrap_or(m)
                    .as_str()
                    .to_string();

                hits.push(EntityHit {
                    kind: rule.kind.clone(),
                    span: Span {
                        start: m.start(),
                        end: m.end(),
                        text: span_text,
                    },
                    source: HitSource::Pattern,
                    pattern_id: Some(rule.id.clone()),
                    score: rule.score,
                    link: None,
                });
            }
        }

        // 4) Merge overlapping hits (prefer higher score and longer span)
        hits = util::dedupe_merge(hits);

        // 5) Fuzzy candidates (optional)
        if fuzzy {
            hits.extend(util::fuzzy_candidates(text));
            hits = util::dedupe_merge(hits);
        }

        // 6) Contextual rescoring
        for h in &mut hits {
            h.score = util::context_score(text, h).clamp(0.0, 1.0);
        }

        // 7) Coreference resolution (pronouns + title mentions)
        let coref_extra = coref_link(text, &hits);
        hits.extend(coref_extra);

        // 8) Sort by start position, then by score (descending)
        hits.sort_by_key(|h| (h.span.start, std::cmp::Reverse((h.score * 1000.0) as i32)));

        ParseResponse { hits, tokens }
    }

    /// Parse from a ParseRequest
    pub fn parse_request(&self, req: &ParseRequest) -> ParseResponse {
        let fuzzy = req.fuzzy.unwrap_or(true);
        let mut response = self.parse(&req.text, fuzzy);

        // Filter by requested kinds if specified
        if let Some(kinds) = &req.kinds {
            response.hits.retain(|h| kinds.contains(&h.kind));
        }

        response
    }
}

/// Coreference resolution: link pronouns and title mentions to recent Person entities
fn coref_link(text: &str, hits: &[EntityHit]) -> Vec<EntityHit> {
    let mut extra: Vec<EntityHit> = Vec::new();
    if hits.is_empty() {
        return extra;
    }

    // Get all Person entities, sorted by start position
    let mut persons: Vec<&EntityHit> = hits
        .iter()
        .filter(|h| matches!(h.kind, Kind::Person))
        .collect();
    persons.sort_by_key(|h| h.span.start);

    let candidates = util::coref_candidates(text);

    'cand: for c in candidates {
        // Find last person with start < c.start
        let mut best: Option<&EntityHit> = None;
        for p in persons.iter().rev() {
            if p.span.start < c.start {
                best = Some(p);
                break;
            }
        }

        if let Some(ant) = best {
            // Avoid duplicating if overlapping an existing span
            for h in hits {
                let overlap = !(c.end <= h.span.start || c.start >= h.span.end);
                if overlap {
                    continue 'cand;
                }
            }

            // Build a linked hit
            extra.push(EntityHit {
                kind: Kind::Person,
                span: c.clone(),
                source: HitSource::Fuzzy,
                pattern_id: Some("coref".into()),
                score: (ant.score * 0.9).min(0.85),
                link: Some(Link {
                    id: ant.link.as_ref().and_then(|l| l.id.clone()),
                    slug: ant
                        .link
                        .as_ref()
                        .and_then(|l| l.slug.clone())
                        .or_else(|| Some(util::slugify(&ant.span.text))),
                    name: ant.span.text.clone(),
                    kind: Kind::Person,
                }),
            });
        }
    }

    extra
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::Kind;

    #[test]
    fn test_parser_empty() {
        let gz = Gazetteer::empty();
        let pat = PatternSet::empty();
        let parser = Parser::new(gz, pat);

        let response = parser.parse("Hello world", false);
        assert_eq!(response.hits.len(), 0);
        assert_eq!(response.tokens, vec!["Hello", "world"]);
    }

    #[test]
    fn test_parser_with_pattern() {
        let gz = Gazetteer::empty();
        let mut pat = PatternSet::empty();
        pat.add_pattern(
            "person_title".to_string(),
            Kind::Person,
            r"(?:Lord|Lady)\s+([A-Z][a-z]+)",
            0.9,
        )
        .unwrap();

        let parser = Parser::new(gz, pat);
        let response = parser.parse("Lord Rawn stood tall", false);

        assert_eq!(response.hits.len(), 1);
        assert_eq!(response.hits[0].kind, Kind::Person);
        assert!(response.hits[0].span.text.contains("Rawn"));
    }

    #[test]
    fn test_parser_fuzzy() {
        let gz = Gazetteer::empty();
        let pat = PatternSet::empty();
        let parser = Parser::new(gz, pat);

        let response = parser.parse("Queen Amicae of Eryndor", true);

        // Should find fuzzy candidates
        assert!(response.hits.len() > 0);
        let texts: Vec<_> = response.hits.iter().map(|h| h.span.text.as_str()).collect();
        assert!(texts.iter().any(|t| t.contains("Queen")));
    }

    #[test]
    fn test_parse_request_filter_kinds() {
        let gz = Gazetteer::empty();
        let mut pat = PatternSet::empty();
        pat.add_pattern(
            "person".to_string(),
            Kind::Person,
            r"Lord\s+([A-Z][a-z]+)",
            0.9,
        )
        .unwrap();
        pat.add_pattern("place".to_string(), Kind::Place, r"(Storm\s+Coast)", 0.9)
            .unwrap();

        let parser = Parser::new(gz, pat);
        let req = ParseRequest {
            text: "Lord Rawn at Storm Coast".to_string(),
            project_id: None,
            kinds: Some(vec![Kind::Person]),
            fuzzy: Some(false),
        };

        let response = parser.parse_request(&req);

        // Should only return Person entities
        assert_eq!(response.hits.len(), 1);
        assert_eq!(response.hits[0].kind, Kind::Person);
    }
}
