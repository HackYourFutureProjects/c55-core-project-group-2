DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
    category TEXT NOT NULL,
    importance TEXT NOT NULL DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'unfinished' CHECK (status IN ('unfinished', 'finished')),
    date_finished TEXT DEFAULT NULL,
    deadline TEXT,
    created_at TEXT,
    updated_at TEXT
);
