# Data Layer Usage

## Overview

The project uses **SQLite** for persistent storage and a repository pattern for all task operations.

All data access must go through the repository:


src/data-access/taskRepository.js

---

## Database

* File: `data/tasks.db`
* Table: `tasks`

### Task Fields

* `id`
* `name` (required)
* `description`
* `category` (required)
* `importance` (`low`, `medium`, `high`)
* `status` (`unfinished`, `finished`)
* `date_finished`
* `deadline`
* `created_at`
* `updated_at`

---

## Data Rules

* `name` and `category` are required
* `importance` is normalized to valid values
* `status` is normalized to:

  * `unfinished`
  * `finished`
* When a task is marked `finished`, `date_finished` is set automatically
* When a task is `unfinished`, `date_finished` is cleared (`null`)

---

## Repository API

### CRUD

* `createTask(data)`
* `getAllTasks()`
* `getTaskById(id)` → returns `null` if not found
* `updateTask(id, updates)` → returns `null` if not found
* `deleteTask(id)` → returns deleted task or `null`

### Filters

* `getUnfinishedTasks()`
* `getTasksByCategory(category)`
* `getTodayTasks()`
* `getPastTasks()`
* `getUpcomingTasks(limit)`

---

## Example Usage

```js
createTask({
  name: 'Finish assignment',
  category: 'school',
  importance: 'high',
  status: 'unfinished',
  deadline: '2026-04-20'
});
```

---

## Testing

* Tests run against the real SQLite database
* Each test is isolated
* The `tasks` table is reset before every test to ensure consistent results
