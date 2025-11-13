use crate::types::{EntityHit, Kind, Link};

/// Link parsed entities to database records
pub struct Linker;

impl Linker {
    /// Link entities using a lookup function
    /// The lookup function takes (kind, text) and returns an optional Link
    pub fn link_entities<F>(mut hits: Vec<EntityHit>, lookup: F) -> Vec<EntityHit>
    where
        F: Fn(&Kind, &str) -> Option<Link>,
    {
        for hit in hits.iter_mut() {
            if let Some(link) = lookup(&hit.kind, &hit.span.text) {
                hit.link = Some(link);
            }
        }
        hits
    }

    /// Link entities using a slug-based lookup
    /// Converts entity text to slug format (lowercase, spaces to hyphens)
    pub fn link_with_slug<F>(mut hits: Vec<EntityHit>, lookup: F) -> Vec<EntityHit>
    where
        F: Fn(&str) -> Option<Link>,
    {
        for hit in hits.iter_mut() {
            let slug = Self::to_slug(&hit.span.text);
            if let Some(link) = lookup(&slug) {
                hit.link = Some(link);
            }
        }
        hits
    }

    /// Convert text to slug format
    pub fn to_slug(text: &str) -> String {
        text.replace(' ', "-").to_lowercase()
    }

    /// Link entities by exact name match (case-insensitive)
    pub fn link_by_name<F>(mut hits: Vec<EntityHit>, lookup: F) -> Vec<EntityHit>
    where
        F: Fn(&Kind, &str) -> Option<Link>,
    {
        for hit in hits.iter_mut() {
            let normalized = hit.span.text.to_lowercase();
            if let Some(link) = lookup(&hit.kind, &normalized) {
                hit.link = Some(link);
            }
        }
        hits
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::{HitSource, Span};

    #[test]
    fn test_to_slug() {
        assert_eq!(Linker::to_slug("Storm Coast"), "storm-coast");
        assert_eq!(Linker::to_slug("Queen Amicae"), "queen-amicae");
        assert_eq!(Linker::to_slug("Ironforge"), "ironforge");
    }

    #[test]
    fn test_link_with_slug() {
        let hits = vec![EntityHit {
            kind: Kind::Place,
            span: Span {
                start: 0,
                end: 11,
                text: "Storm Coast".to_string(),
            },
            source: HitSource::Gazetteer,
            pattern_id: None,
            score: 0.9,
            link: None,
        }];

        let lookup = |slug: &str| -> Option<Link> {
            if slug == "storm-coast" {
                Some(Link {
                    id: Some("123".to_string()),
                    slug: Some(slug.to_string()),
                    name: "Storm Coast".to_string(),
                    kind: Kind::Place,
                })
            } else {
                None
            }
        };

        let linked = Linker::link_with_slug(hits, lookup);
        assert_eq!(linked.len(), 1);
        assert!(linked[0].link.is_some());
        assert_eq!(linked[0].link.as_ref().unwrap().id, Some("123".to_string()));
    }

    #[test]
    fn test_link_entities() {
        let hits = vec![
            EntityHit {
                kind: Kind::Person,
                span: Span {
                    start: 0,
                    end: 6,
                    text: "Amicae".to_string(),
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
                    end: 18,
                    text: "Eryndor".to_string(),
                },
                source: HitSource::Gazetteer,
                pattern_id: None,
                score: 0.9,
                link: None,
            },
        ];

        let lookup = |kind: &Kind, text: &str| -> Option<Link> {
            match (kind, text) {
                (Kind::Person, "Amicae") => Some(Link {
                    id: Some("p1".to_string()),
                    slug: Some("amicae".to_string()),
                    name: "Queen Amicae".to_string(),
                    kind: Kind::Person,
                }),
                (Kind::Place, "Eryndor") => Some(Link {
                    id: Some("pl1".to_string()),
                    slug: Some("eryndor".to_string()),
                    name: "Eryndor".to_string(),
                    kind: Kind::Place,
                }),
                _ => None,
            }
        };

        let linked = Linker::link_entities(hits, lookup);
        assert_eq!(linked.len(), 2);
        assert!(linked[0].link.is_some());
        assert!(linked[1].link.is_some());
        assert_eq!(linked[0].link.as_ref().unwrap().name, "Queen Amicae");
        assert_eq!(linked[1].link.as_ref().unwrap().name, "Eryndor");
    }
}

