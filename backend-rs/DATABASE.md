# Database Setup

## Overview

AuthorForge uses SQLite for persistent storage of world-building data. The database layer is implemented using SQLx with async/await support.

## Database Schema

### Locations Table
```sql
CREATE TABLE locations (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    kind TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### Factions Table
```sql
CREATE TABLE factions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    alignment TEXT NOT NULL,
    goal TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

## Migrations

Migrations are located in `backend-rs/migrations/` and are automatically run when the `WorldStore` is initialized.

Current migrations:
- `20250111000001_create_locations.sql` - Creates the locations table
- `20250111000002_create_factions.sql` - Creates the factions table

## Usage

### In-Memory Database (for testing)
```rust
let backend = Backend::new("sqlite::memory:").await?;
```

### File-Based Database (for production)
```rust
let backend = Backend::new("sqlite:authorforge.db").await?;
```

### With Full Path
```rust
let backend = Backend::new("sqlite:/path/to/authorforge.db").await?;
```

## Running Tests

```bash
# Run all tests
cargo test

# Run only backend tests
cargo test -p backend-rs

# Run with output
cargo test -- --nocapture
```

## Example Usage

```rust
use backend_rs::Backend;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize backend with database
    let backend = Backend::new("sqlite:authorforge.db").await?;
    
    // Create a location
    let location_json = backend
        .create_location("Ironforge", "city", "A dwarven stronghold")
        .await?;
    
    // List all locations
    let locations_json = backend.list_locations().await?;
    println!("Locations: {}", locations_json);
    
    // Create a faction
    let faction_json = backend
        .create_faction("Stormwind Guard", "lawful good", "Protect the realm")
        .await?;
    
    // List all factions
    let factions_json = backend.list_factions().await?;
    println!("Factions: {}", factions_json);
    
    Ok(())
}
```

## Data Types

### Id
UUIDs are used for all entity IDs and are stored as TEXT in the database.

### Timestamps
Timestamps use the `time` crate's `OffsetDateTime` type and are stored as TEXT in ISO 8601 format.

## Future Enhancements

- [ ] Add database connection pooling configuration
- [ ] Implement soft deletes
- [ ] Add full-text search for locations and factions
- [ ] Add database backup/restore functionality
- [ ] Implement database versioning and rollback support

