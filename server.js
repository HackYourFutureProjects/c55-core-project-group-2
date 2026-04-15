/* 
## this comment can be deleted after adding the html/css server later ##

- the server now runs on port 3000 and serves the API routes under /tasks.
- the root route (/) currently returns a JSON message but can be changed to serve an HTML file for the frontend.
- i added short comments in the right spots of the server setup so you can later plug in static CSS and HTML serving
  without changing route logic.
*/
import express from 'express';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from './src/data-access/taskRepository.js';
import { Task } from './src/models/Task.js';

function isValidIsoDate(dateString) {
  if (typeof dateString !== 'string') {
    return false;
  }
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/; // regex to check for YYYY-MM-DD format
  if (!isoDatePattern.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateString
  );
}

function validateOptionalIsoDate(value, fieldName, res) {
  if (value !== undefined && value !== null && !isValidIsoDate(value)) {
    res
      .status(400)
      .json({ error: `${fieldName} must be in YYYY-MM-DD format` });
    return false;
  }
  return true;
}

export function createApp() {
  const app = express();
  // Keep JSON middleware for API requests.
  app.use(express.json());
  // Frontend hook: add express.static(...) here when you want to serve CSS/JS files.
  app.get('/', (req, res) => {
    // Frontend hook: replace this JSON response with res.sendFile(...) for index.html.
    res.json({ message: 'Task API is running' });
  });

  app.get('/tasks', (req, res) => {
    try {
      const tasks = getAllTasks();
      res.json({ tasks });
    } catch {
      res.status(500).json({ error: 'Failed to read tasks data' });
    }
  });

  app.get('/tasks/:id', (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task id' });
      }
      const task = getTaskById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ task });
    } catch {
      res.status(500).json({ error: 'Failed to read task' });
    }
  });

  app.post('/tasks', (req, res) => {
    try {
      const {
        name,
        description,
        category,
        importance,
        status,
        date_finished,
        deadline,
      } = req.body;

      const candidateTask = new Task({
        name,
        description,
        category,
        importance,
        status,
        date_finished,
        deadline,
      });
      candidateTask.validate();
      if (!validateOptionalIsoDate(deadline, 'deadline', res)) {
        return;
      }
      if (!validateOptionalIsoDate(date_finished, 'date_finished', res)) {
        return;
      }
      const newTask = createTask({
        name,
        description: description ?? '',
        category,
        importance,
        status,
        date_finished: date_finished ?? null,
        deadline: deadline ?? null,
      });
      return res.status(201).json({ task: newTask });
    } catch (error) {
      console.error('Failed to read tasks data:', error);
      return res
        .status(400)
        .json({ error: error.message || 'Failed to create task' });
    }
  });

  app.put('/tasks/:id', (req, res) => {
    try {
      const { deadline, date_finished } = req.body;
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task id' });
      }
      const existingTask = getTaskById(id);
      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      if (!validateOptionalIsoDate(deadline, 'deadline', res)) {
        return;
      }
      if (!validateOptionalIsoDate(date_finished, 'date_finished', res)) {
        return;
      }
      const candidateTask = new Task({
        ...existingTask,
        ...req.body,
      });
      candidateTask.validate();
      const updatedTask = updateTask(id, req.body);
      return res.json({ task: updatedTask });
    } catch (error) {
      console.error('Failed to read tasks data:', error);
      return res
        .status(400)
        .json({ error: error.message || 'Failed to update task' });
    }
  });

  app.delete('/tasks/:id', (req, res) => {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task id' });
      }
      const deletedTask = deleteTask(id);
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json({ message: 'Task deleted', task: deletedTask });
    } catch {
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  return app;
}
