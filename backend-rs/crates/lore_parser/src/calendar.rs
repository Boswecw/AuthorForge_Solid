use anyhow::Result;
use serde::Deserialize;
use std::fs;

use crate::types::Kind;

#[derive(Debug, Deserialize, Clone)]
pub struct CalendarConfig {
    #[serde(default)]
    pub months: Option<Vec<String>>,
    #[serde(default)]
    pub epochs: Option<Vec<String>>,
    #[serde(default)]
    pub seasons: Option<Vec<String>>,
    #[serde(default)]
    pub day_suffixes: Option<Vec<String>>,
}

impl Default for CalendarConfig {
    fn default() -> Self {
        Self {
            months: Some(vec![
                "January".into(),
                "February".into(),
                "March".into(),
                "April".into(),
                "May".into(),
                "June".into(),
                "July".into(),
                "August".into(),
                "September".into(),
                "October".into(),
                "November".into(),
                "December".into(),
            ]),
            epochs: Some(vec!["AD".into(), "BC".into(), "CE".into(), "BCE".into()]),
            seasons: Some(vec![
                "Spring".into(),
                "Summer".into(),
                "Autumn".into(),
                "Fall".into(),
                "Winter".into(),
            ]),
            day_suffixes: Some(vec!["st".into(), "nd".into(), "rd".into(), "th".into()]),
        }
    }
}

/// Calendar pattern generator
pub struct Calendar {
    config: CalendarConfig,
}

impl Calendar {
    /// Load calendar from YAML file
    pub fn load(path: &str) -> Result<Self> {
        let yaml = fs::read_to_string(path)?;
        let config: CalendarConfig = serde_yaml::from_str(&yaml)?;
        Ok(Self { config })
    }

    /// Create calendar with default config
    pub fn default() -> Self {
        Self {
            config: CalendarConfig::default(),
        }
    }

    /// Generate dynamic date patterns
    pub fn generate_patterns(&self) -> Vec<(String, Kind, String, f32)> {
        let mut patterns = Vec::new();

        // Month-based dates: "3rd of Stormtide", "15th Frostfall"
        if let Some(months) = &self.config.months {
            let month_list = months.join("|");
            patterns.push((
                "date_month".into(),
                Kind::Date,
                format!(
                    r"\b(\d{{1,2}}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:{}))\b",
                    month_list
                ),
                0.88,
            ));
        }

        // Epoch/Year patterns: "Year 412 AE", "3024 AD"
        if let Some(epochs) = &self.config.epochs {
            let epoch_list = epochs.join("|");
            patterns.push((
                "epoch_year".into(),
                Kind::Date,
                format!(r"\b(?:Year\s+)?(\d{{1,4}}\s+(?:{}))\b", epoch_list),
                0.90,
            ));
        }

        // Season-based dates: "Early Spring", "Late Winter"
        if let Some(seasons) = &self.config.seasons {
            let season_list = seasons.join("|");
            patterns.push((
                "season_date".into(),
                Kind::Date,
                format!(r"\b((?:Early|Mid|Late)\s+(?:{}))\b", season_list),
                0.85,
            ));
        }

        // Full date format: "3rd of Stormtide, Year 412 AE"
        if let Some(months) = &self.config.months {
            if let Some(epochs) = &self.config.epochs {
                let month_list = months.join("|");
                let epoch_list = epochs.join("|");
                patterns.push((
                    "full_date".into(),
                    Kind::Date,
                    format!(
                        r"\b(\d{{1,2}}(?:st|nd|rd|th)?\s+(?:of\s+)?(?:{}),?\s+(?:Year\s+)?\d{{1,4}}\s+(?:{}))\b",
                        month_list, epoch_list
                    ),
                    0.95,
                ));
            }
        }

        patterns
    }

    /// Merge with another calendar config (for per-project overrides)
    pub fn merge(mut self, other: CalendarConfig) -> Self {
        if let Some(months) = other.months {
            self.config.months = Some(
                self.config
                    .months
                    .unwrap_or_default()
                    .into_iter()
                    .chain(months)
                    .collect(),
            );
        }
        if let Some(epochs) = other.epochs {
            self.config.epochs = Some(
                self.config
                    .epochs
                    .unwrap_or_default()
                    .into_iter()
                    .chain(epochs)
                    .collect(),
            );
        }
        if let Some(seasons) = other.seasons {
            self.config.seasons = Some(
                self.config
                    .seasons
                    .unwrap_or_default()
                    .into_iter()
                    .chain(seasons)
                    .collect(),
            );
        }
        if let Some(day_suffixes) = other.day_suffixes {
            self.config.day_suffixes = Some(
                self.config
                    .day_suffixes
                    .unwrap_or_default()
                    .into_iter()
                    .chain(day_suffixes)
                    .collect(),
            );
        }
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use regex::Regex;

    #[test]
    fn test_default_calendar() {
        let cal = Calendar::default();
        let patterns = cal.generate_patterns();
        assert!(patterns.len() > 0);
    }

    #[test]
    fn test_generate_month_pattern() {
        let cal = Calendar::default();
        let patterns = cal.generate_patterns();

        // Find the month pattern
        let month_pattern = patterns
            .iter()
            .find(|(id, _, _, _)| id == "date_month")
            .unwrap();

        let regex = Regex::new(&month_pattern.2).unwrap();
        assert!(regex.is_match("3rd of January"));
        assert!(regex.is_match("15th December"));
    }

    #[test]
    fn test_generate_epoch_pattern() {
        let cal = Calendar::default();
        let patterns = cal.generate_patterns();

        // Find the epoch pattern
        let epoch_pattern = patterns
            .iter()
            .find(|(id, _, _, _)| id == "epoch_year")
            .unwrap();

        let regex = Regex::new(&epoch_pattern.2).unwrap();
        assert!(regex.is_match("Year 412 AD"));
        assert!(regex.is_match("3024 CE"));
    }

    #[test]
    fn test_merge_calendars() {
        let base = Calendar::default();
        let override_config = CalendarConfig {
            months: Some(vec!["Stormtide".into(), "Frostfall".into()]),
            epochs: Some(vec!["AE".into()]),
            seasons: None,
            day_suffixes: None,
        };

        let merged = base.merge(override_config);
        let patterns = merged.generate_patterns();

        // Should have both default and custom months
        let month_pattern = patterns
            .iter()
            .find(|(id, _, _, _)| id == "date_month")
            .unwrap();

        let regex = Regex::new(&month_pattern.2).unwrap();
        assert!(regex.is_match("3rd of January")); // default
        assert!(regex.is_match("15th Stormtide")); // custom
    }
}
