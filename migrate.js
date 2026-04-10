/* this file will be deleted later on
 * its only for the testing phase of the project
 * to migrate the data from the json file to the database
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'data/data.json');
const DB_FILE = join(__dirname, 'data/tasks.db');
const SCHEMA_FILE = join(__dirname, 'setup.sql');

function normalizeImportance(rawImportance) {
  if (typeof rawImportance === 'string') {
    const normalized = rawImportance.trim().toLowerCase();
    if (['low', 'medium', 'high'].includes(normalized)) {
      return normalized;
    }
  }

  if (typeof rawImportance === 'boolean') {
    return rawImportance ? 'high' : 'low';
  }

  return 'medium';
}

let db;

try {
  const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  db = new Database(DB_FILE);
  db.exec(readFileSync(SCHEMA_FILE, 'utf-8'));

  const insertTask = db.prepare(
    'INSERT INTO tasks (id, name, description, category, importance, status, date_finished, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (const task of data.tasks) {
    insertTask.run(
      task.id,
      task.name,
      task.description,
      task.category,
      normalizeImportance(task.importance),
      task.status,
      task.date_finished,
      task.deadline
    );
  }

  console.log(`Migrated ${data.tasks.length} tasks`);
} catch (error) {
  console.error('Error during migration:', error);
  process.exit(1);
} finally {
  db?.close();
}
