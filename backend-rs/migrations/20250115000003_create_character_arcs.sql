-- Character Arcs Table
-- Stores character development tracking for the Anvil workspace

CREATE TABLE IF NOT EXISTS character_arcs (
    id TEXT PRIMARY KEY NOT NULL,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    alias TEXT,
    title TEXT,
    bio TEXT NOT NULL DEFAULT '',
    species TEXT,
    age INTEGER,
    faction TEXT,
    role TEXT NOT NULL DEFAULT 'Other',
    pov_status TEXT NOT NULL DEFAULT 'Non-POV',
    status TEXT NOT NULL DEFAULT 'Alive',
    emotional_tags_json TEXT NOT NULL DEFAULT '[]',
    portrait_path TEXT,
    
    -- Arc sections stored as JSON
    internal_arc_json TEXT NOT NULL DEFAULT '{"summary":"","notes":"","keyPoints":[]}',
    external_arc_json TEXT NOT NULL DEFAULT '{"summary":"","notes":"","keyPoints":[]}',
    spiritual_arc_json TEXT NOT NULL DEFAULT '{"summary":"","notes":"","keyPoints":[]}',
    
    -- Beats and relationships stored as JSON arrays
    beats_json TEXT NOT NULL DEFAULT '[]',
    relationships_json TEXT NOT NULL DEFAULT '[]',
    
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Index for fast project-based queries
CREATE INDEX IF NOT EXISTS idx_character_arcs_project_id ON character_arcs(project_id);

-- Index for name searches
CREATE INDEX IF NOT EXISTS idx_character_arcs_name ON character_arcs(name);

-- Index for role filtering
CREATE INDEX IF NOT EXISTS idx_character_arcs_role ON character_arcs(role);

-- Index for POV filtering
CREATE INDEX IF NOT EXISTS idx_character_arcs_pov ON character_arcs(pov_status);

