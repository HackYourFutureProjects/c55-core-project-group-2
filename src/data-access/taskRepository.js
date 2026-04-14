import db from './database.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const JSON_FILE = join(__dirname, '../../data/data.json');

// normalize values
function normalizeImportance(value) {
  const v = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return ['low', 'medium', 'high'].includes(v) ? v : 'medium';
}

function normalizeStatus(value) {
  const v = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return v === 'finished' ? 'finished' : 'unfinished';
}

// keep status/date consistent
function syncStatus(task) {
  const status = normalizeStatus(task.status);
  const dateFinished =
    status === 'finished'
      ? task.date_finished || new Date().toISOString()
      : null;

  return { ...task, status, date_finished: dateFinished };
}

// basic validation
function validate(task) {
  if (!task.name || task.name.trim() === '') {
    throw new Error('Task name is required');
  }
  if (!task.category || task.category.trim() === '') {
    throw new Error('Task category is required');
  }
}

// sync DB → JSON
function writeTasksToJson() {
  const tasks = getAllTasks();
  const dir = dirname(JSON_FILE);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(JSON_FILE, JSON.stringify({ tasks }, null, 2), 'utf-8');
}

// --- CRUD ---

export function getAllTasks() {
  return db.prepare('SELECT * FROM tasks ORDER BY id ASC').all();
}

export function getTaskById(id) {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) ?? null;
}

export function createTask(data) {
  const task = syncStatus({
    ...data,
    importance: normalizeImportance(data.importance),
  });

  validate(task);

  const result = db
    .prepare(
      `
      INSERT INTO tasks (name, description, category, importance, status, date_finished, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    )
    .run(
      task.name.trim(),
      task.description || null,
      task.category.trim(),
      task.importance,
      task.status,
      task.date_finished,
      task.deadline || null
    );

  const created = getTaskById(result.lastInsertRowid);
  writeTasksToJson();
  return created;
}

export function updateTask(id, updates) {
  const existing = getTaskById(id);
  if (!existing) return null;

  const merged = syncStatus({
    ...existing,
    ...updates,
    importance: normalizeImportance(updates.importance ?? existing.importance),
  });

  validate(merged);

  db.prepare(
    `
    UPDATE tasks
    SET name = ?, description = ?, category = ?, importance = ?, status = ?, date_finished = ?, deadline = ?
    WHERE id = ?
  `
  ).run(
    merged.name.trim(),
    merged.description || null,
    merged.category.trim(),
    merged.importance,
    merged.status,
    merged.date_finished,
    merged.deadline || null,
    id
  );

  const updated = getTaskById(id);
  writeTasksToJson();
  return updated;
}

export function deleteTask(id) {
  const existing = getTaskById(id);
  if (!existing) return null;

  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  writeTasksToJson();

  return existing;
}
