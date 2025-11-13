-- Create factions table
CREATE TABLE IF NOT EXISTS factions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    alignment TEXT NOT NULL,
    goal TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Index for faster lookups by name
CREATE INDEX IF NOT EXISTS idx_factions_name ON factions(name);

