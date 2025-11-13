#![deny(unsafe_code)]
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContextSpec {
    pub work_type: String,        // novel, novella, newsletter, blog, synopsis…
    pub tone: String,             // epic, intimate, gritty, hopeful…
    pub audience: String,         // YA, adult fantasy, Christian, etc.
    pub style_guidelines: Vec<String>,
}

pub fn build_prompt(spec: &ContextSpec, seed: &str) -> String {
    let guidelines = spec.style_guidelines.iter()
        .map(|g| format!("- {}", g))
        .collect::<Vec<_>>()
        .join("\n");

    format!(
r#"You are a writing assistant.

WORK TYPE: {work_type}
TONE: {tone}
AUDIENCE: {audience}

GUIDELINES:
{guidelines}

SEED MATERIAL:
{seed}

TASK:
Draft a cohesive passage (300–600 words) aligned with the work type and tone.
Preserve voice consistency, rhythm, and clear scene beats.
Return only the prose."#,
        work_type = spec.work_type,
        tone = spec.tone,
        audience = spec.audience,
        guidelines = guidelines,
        seed = seed
    )
}
