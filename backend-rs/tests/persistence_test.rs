use backend_rs::Backend;

#[tokio::test]
async fn test_create_and_list_locations() {
    let backend = Backend::new("sqlite::memory:")
        .await
        .expect("Failed to create backend");

    // Create multiple locations
    backend
        .create_location("Ironforge", "city", "A dwarven stronghold")
        .await
        .expect("Failed to create location");

    backend
        .create_location("Stormwind", "city", "Human capital")
        .await
        .expect("Failed to create location");

    // List and verify
    let locations_json = backend
        .list_locations()
        .await
        .expect("Failed to list locations");

    assert!(locations_json.contains("Ironforge"));
    assert!(locations_json.contains("dwarven stronghold"));
    assert!(locations_json.contains("Stormwind"));
    assert!(locations_json.contains("Human capital"));
}

#[tokio::test]
async fn test_create_and_list_factions() {
    let backend = Backend::new("sqlite::memory:")
        .await
        .expect("Failed to create backend");

    // Create multiple factions
    backend
        .create_faction("Stormwind Guard", "lawful good", "Protect the realm")
        .await
        .expect("Failed to create faction");

    backend
        .create_faction(
            "Defias Brotherhood",
            "chaotic evil",
            "Overthrow the kingdom",
        )
        .await
        .expect("Failed to create faction");

    // List and verify
    let factions_json = backend
        .list_factions()
        .await
        .expect("Failed to list factions");

    assert!(factions_json.contains("Stormwind Guard"));
    assert!(factions_json.contains("Protect the realm"));
    assert!(factions_json.contains("Defias Brotherhood"));
    assert!(factions_json.contains("Overthrow the kingdom"));
}

#[tokio::test]
async fn test_in_memory_database() {
    let backend = Backend::new("sqlite::memory:")
        .await
        .expect("Failed to create backend");

    backend
        .create_location("Shadowfang Keep", "dungeon", "A haunted fortress")
        .await
        .expect("Failed to create location");

    let locations_json = backend
        .list_locations()
        .await
        .expect("Failed to list locations");

    assert!(locations_json.contains("Shadowfang Keep"));
    assert!(locations_json.contains("haunted fortress"));
}
