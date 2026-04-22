# Check Mate

A simple task manager web app built by HackYourFuture Group 2 as the final project for the Core program.

## Features

- Create tasks with a name, optional description, and importance (low / medium / high)
- Mark tasks as finished or unfinished
- Edit a task's name, description, or importance after creation
- Delete tasks
- Filter the list by Inbox (all), Unfinished, or Completed
- Task data is persisted in a local SQLite database

## Tech stack

- **Backend**: Node.js, Express, better-sqlite3
- **Frontend**: HTML, CSS, vanilla JavaScript (Fetch API, DOM)
- **Database**: SQLite (single file at `data/tasks.db`)
- **Tooling**: ESLint, Prettier, Vitest

## Getting started

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
data/
  tasks.db              SQLite database file
public/                 Static frontend served by Express
  index.html
  app.js
  styles.css
  assets/               Icons and images
src/
  index.js              App entry point — starts the Express server
  models/Task.js        Task class + validation
  data-access/
    database.js         SQLite connection
    taskRepository.js   All SQL queries for tasks
server.js               Express app + HTTP routes
tests/                  Vitest tests
setup.sql               Database schema
```

## API

All routes return JSON.

| Method | Route         | Description                    |
|--------|---------------|--------------------------------|
| GET    | `/tasks`      | List all tasks                 |
| GET    | `/tasks/:id`  | Get a single task by id        |
| POST   | `/tasks`      | Create a new task              |
| PUT    | `/tasks/:id`  | Update an existing task        |
| DELETE | `/tasks/:id`  | Delete a task                  |

A task has the following fields:

```json
{
  "id": 1,
  "name": "Buy groceries",
  "description": "Milk, bread, eggs",
  "category": "general",
  "importance": "medium",
  "status": "unfinished",
  "date_finished": null,
  "deadline": null
}
```

## Scripts

| Command              | What it does                         |
|----------------------|--------------------------------------|
| `npm start`          | Run the app on port 3000             |
| `npm test`           | Run the Vitest test suite            |
| `npm run lint`       | Check for lint errors                |
| `npm run lint:fix`   | Auto-fix lint errors                 |
| `npm run format`     | Format all files with Prettier       |
| `npm run format:check` | Check formatting without writing   |
