PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
    category TEXT,
    importance TEXT NOT NULL DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high')),
    status TEXT,
    date_finished TEXT,
    deadline TEXT
);
