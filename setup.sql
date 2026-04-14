DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,

    importance TEXT NOT NULL DEFAULT 'medium'
        CHECK (importance IN ('low', 'medium', 'high')),

    status TEXT NOT NULL DEFAULT 'unfinished'
        CHECK (status IN ('unfinished', 'finished')),

    date_finished TEXT DEFAULT NULL,
    deadline TEXT,
   
    -- auto set on insert
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
    -- auto set on insert + updated via trigger
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- auto-update on every update

CREATE TRIGGER update_tasks_updated_at
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;