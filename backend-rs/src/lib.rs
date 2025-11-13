#![deny(unsafe_code)]
use anyhow::Result;
use llm_context::{ContextSpec, build_prompt};
use lore_parser::{
    Calendar, EntityCandidate, Gazetteer, Linker, ParseRequest, ParseResponse, Parser, PatternSet,
    extract,
};
use std::collections::HashMap;
use std::sync::{Arc, RwLock};
use world_builder::WorldStore;

#[derive(Clone)]
pub struct Backend {
    wb: WorldStore,
    parser: Arc<Parser>,
    project_parsers: Arc<RwLock<HashMap<String, Arc<Parser>>>>,
}

impl Backend {
    pub async fn new(database_url: &str) -> Result<Self> {
        let wb = WorldStore::new(database_url).await?;

        // Initialize lore parser with YAML rules
        // Try multiple paths to handle different working directories
        let entities_path = Self::find_file(&[
            "backend-rs/lore/rules/entities.yaml",
            "lore/rules/entities.yaml",
            "../lore/rules/entities.yaml",
        ])?;
        let patterns_path = Self::find_file(&[
            "backend-rs/lore/rules/patterns.yaml",
            "lore/rules/patterns.yaml",
            "../lore/rules/patterns.yaml",
        ])?;

        let gz = Gazetteer::load(&entities_path)?;
        let mut pat = PatternSet::load(&patterns_path)?;

        // Add default calendar patterns
        let calendar = Calendar::default();
        let calendar_patterns = calendar.generate_patterns();
        pat = pat.with_extra(calendar_patterns)?;

        let parser = Arc::new(Parser::new(gz, pat));

        Ok(Self {
            wb,
            parser,
            project_parsers: Arc::new(RwLock::new(HashMap::new())),
        })
    }

    fn find_file(paths: &[&str]) -> Result<String> {
        for path in paths {
            if std::path::Path::new(path).exists() {
                return Ok(path.to_string());
            }
        }
        anyhow::bail!("Could not find YAML rules files in any of the expected locations")
    }

    // World Builder
    pub async fn create_location(&self, name: &str, kind: &str, summary: &str) -> Result<String> {
        let loc = self.wb.create_location(name, kind, summary).await?;
        Ok(serde_json::to_string(&loc)?)
    }

    pub async fn list_locations(&self) -> Result<String> {
        let v = self.wb.list_locations().await?;
        Ok(serde_json::to_string(&v)?)
    }

    pub async fn create_faction(&self, name: &str, alignment: &str, goal: &str) -> Result<String> {
        let fac = self.wb.create_faction(name, alignment, goal).await?;
        Ok(serde_json::to_string(&fac)?)
    }

    pub async fn list_factions(&self) -> Result<String> {
        let v = self.wb.list_factions().await?;
        Ok(serde_json::to_string(&v)?)
    }

    // Lore Parser (legacy)
    pub fn parse_entities(&self, text: &str) -> Vec<EntityCandidate> {
        extract(text)
    }

    /// Get or create a project-specific parser with overrides
    fn get_project_parser(&self, project_id: &str) -> Result<Arc<Parser>> {
        // Check cache first
        {
            let cache = self.project_parsers.read().unwrap();
            if let Some(parser) = cache.get(project_id) {
                return Ok(Arc::clone(parser));
            }
        }

        // Build project-specific parser
        let base_entities = Self::find_file(&[
            "backend-rs/lore/rules/entities.yaml",
            "lore/rules/entities.yaml",
            "../lore/rules/entities.yaml",
        ])?;
        let base_patterns = Self::find_file(&[
            "backend-rs/lore/rules/patterns.yaml",
            "lore/rules/patterns.yaml",
            "../lore/rules/patterns.yaml",
        ])?;

        // Try to find project-specific overrides
        let project_entities = format!("backend-rs/lore/rules/entities.{}.yaml", project_id);
        let project_patterns = format!("backend-rs/lore/rules/patterns.{}.yaml", project_id);
        let project_calendar = format!("backend-rs/lore/rules/calendar.{}.yaml", project_id);

        // Load gazetteer with overrides
        let gz = Gazetteer::load_many(&[&base_entities, &project_entities])?;

        // Load patterns with overrides
        let mut pat = PatternSet::load_many(&[&base_patterns, &project_patterns])?;

        // Add calendar patterns if available
        let calendar = if std::path::Path::new(&project_calendar).exists() {
            Calendar::load(&project_calendar)?
        } else {
            Calendar::default()
        };
        let calendar_patterns = calendar.generate_patterns();
        pat = pat.with_extra(calendar_patterns)?;

        let parser = Arc::new(Parser::new(gz, pat));

        // Cache it
        {
            let mut cache = self.project_parsers.write().unwrap();
            cache.insert(project_id.to_string(), Arc::clone(&parser));
        }

        Ok(parser)
    }

    // Lore Parser (new advanced parser)
    pub fn parse_lore(&self, req: &ParseRequest) -> Result<ParseResponse> {
        // Use project-specific parser if project_id is provided
        let parser = if let Some(project_id) = &req.project_id {
            self.get_project_parser(project_id)?
        } else {
            Arc::clone(&self.parser)
        };

        let mut response = parser.parse_request(req);

        // Link entities to database
        response.hits = Linker::link_entities(response.hits, |_kind, _text| {
            // Try to find matching entities in the database
            // For now, we'll just return None - this can be enhanced later
            // to query the WorldStore for matching locations/factions
            None
        });

        Ok(response)
    }

    pub fn parse_lore_text(&self, text: &str, fuzzy: bool) -> Result<ParseResponse> {
        let req = ParseRequest {
            text: text.to_string(),
            project_id: None,
            kinds: None,
            fuzzy: Some(fuzzy),
        };
        self.parse_lore(&req)
    }

    // LLM Context
    pub fn render_prompt(&self, spec: &ContextSpec, seed: &str) -> String {
        build_prompt(spec, seed)
    }
}
