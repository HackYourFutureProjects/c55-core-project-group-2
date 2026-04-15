import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, '../../data/tasks.db');
const SCHEMA_FILE = join(__dirname, '../../setup.sql');

export const db = new Database(DB_FILE);
export default db;
const schemaSqlText = readFileSync(SCHEMA_FILE, 'utf-8');

// remove any DROP TABLE statements to prevent accidental data loss.
function isDropTableStatement(statement) {
  return statement.toUpperCase().startsWith('DROP TABLE');
}

// make CREATE TABLE statements safe to run multiple times
function makeCreateTableSafe(statement) {
  const createTablePrefix = 'CREATE TABLE ';
  if (statement.toUpperCase().startsWith(createTablePrefix)) {
    return `CREATE TABLE IF NOT EXISTS ${statement.slice(createTablePrefix.length)}`;
  }
  return statement;
}

// make CREATE TRIGGER statements safe to run multiple times
function makeCreateTriggerSafe(statement) {
  const createTriggerPrefix = 'CREATE TRIGGER ';
  const createTriggerIndex = statement
    .toUpperCase()
    .indexOf(createTriggerPrefix);
  if (createTriggerIndex !== -1) {
    return (
      statement.slice(0, createTriggerIndex) +
      'CREATE TRIGGER IF NOT EXISTS ' +
      statement.slice(createTriggerIndex + createTriggerPrefix.length)
    );
  }
  return statement;
}

function buildSafeSchemaSql(sqlText) {
  return sqlText
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement && !isDropTableStatement(statement))
    .map(makeCreateTableSafe)
    .map(makeCreateTriggerSafe)
    .join(';\n');
}

const safeSchemaSql = buildSafeSchemaSql(schemaSqlText);
if (safeSchemaSql) {
  db.exec(`${safeSchemaSql};`);
}
