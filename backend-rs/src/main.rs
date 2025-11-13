#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Use in-memory SQLite database for testing
    let be = backend_rs::Backend::new("sqlite::memory:").await?;

    // Create a location
    let _ = be
        .create_location("Storm Coast", "coastline", "Wind-scoured shore")
        .await?;
    println!("Locations: {}", be.list_locations().await?);

    // Create a faction
    let _ = be
        .create_faction("The Iron Legion", "lawful neutral", "Maintain order")
        .await?;
    println!("Factions: {}", be.list_factions().await?);

    // Test the new lore parser
    println!("\n--- Lore Parser Test (Default) ---");
    let test_text = "Queen Amicae stood at the Storm Coast as the Mind Reaver stirred. \
                     She whispered the Tempest Canticle and raised the Scorchblade.";

    let parse_result = be.parse_lore_text(test_text, true)?;
    println!("Found {} entities:", parse_result.hits.len());
    for hit in &parse_result.hits {
        println!(
            "  - {:?}: '{}' (score: {:.2})",
            hit.kind, hit.span.text, hit.score
        );
    }

    // Test stop-zones (code and quotes should be ignored)
    println!("\n--- Stop-zones Test ---");
    let code_text = "The Queen said `Mind Reaver` in code. Also \"Scorchblade\" in quotes.";
    let code_result = be.parse_lore_text(code_text, false)?;
    println!(
        "Found {} entities (should skip code/quotes):",
        code_result.hits.len()
    );
    for hit in &code_result.hits {
        println!("  - {:?}: '{}'", hit.kind, hit.span.text);
    }

    // Test coref resolution
    println!("\n--- Coref Test ---");
    let coref_text = "Lord Rawn entered the hall. He drew his sword. The Lord commanded silence.";
    let coref_result = be.parse_lore_text(coref_text, false)?;
    println!(
        "Found {} entities (including coref):",
        coref_result.hits.len()
    );
    for hit in &coref_result.hits {
        println!(
            "  - {:?}: '{}' (score: {:.2}, pattern: {:?})",
            hit.kind, hit.span.text, hit.score, hit.pattern_id
        );
    }

    // Test calendar patterns
    println!("\n--- Calendar Test ---");
    let date_text = "On the 3rd of January, Year 412 AD, the battle began in Early Spring.";
    let date_result = be.parse_lore_text(date_text, false)?;
    println!(
        "Found {} entities (including dates):",
        date_result.hits.len()
    );
    for hit in &date_result.hits {
        println!("  - {:?}: '{}'", hit.kind, hit.span.text);
    }

    // Test per-project overrides
    println!("\n--- Per-Project Test (mythos) ---");
    use lore_parser::ParseRequest;
    let project_text = "Theron Blackwood visited the Crystal Spire on 15th Stormtide, Year 412 AE.";
    let project_req = ParseRequest {
        text: project_text.to_string(),
        project_id: Some("mythos".to_string()),
        kinds: None,
        fuzzy: Some(false),
    };
    let project_result = be.parse_lore(&project_req)?;
    println!(
        "Found {} entities (with mythos overrides):",
        project_result.hits.len()
    );
    for hit in &project_result.hits {
        println!("  - {:?}: '{}'", hit.kind, hit.span.text);
    }

    Ok(())
}
