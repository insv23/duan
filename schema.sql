-- schema.sql
DROP TABLE IF EXISTS links;
CREATE TABLE links (
    short_code TEXT PRIMARY KEY,
    original_url TEXT NOT NULL,
    description TEXT,                   -- Optional description
    is_enabled INTEGER DEFAULT 1,       -- 0 for false, 1 for true
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, -- ISO8601 format
    last_visited_at TEXT,              -- NULL initially
    visit_count INTEGER DEFAULT 0      -- Default 0 visits
);
