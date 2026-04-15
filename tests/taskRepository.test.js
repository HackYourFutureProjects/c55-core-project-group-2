import { beforeEach, describe, expect, test } from 'vitest';
import { db } from '../src/data-access/database.js';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getPastTasks,
  getTaskById,
  getTasksByCategory,
  getTodayTasks,
  getUpcomingTasks,
  getUnfinishedTasks,
  updateTask,
} from '../src/data-access/taskRepository.js';

function resetTasksTable() {
  db.prepare('DELETE FROM tasks').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tasks'").run();
}

describe('taskRepository', () => {
  beforeEach(() => {
    resetTasksTable();
  });

  test('createTask creates a task', () => {
    const task = createTask({
      name: 'Finish assignment',
      description: 'Complete repository tests',
      category: 'school',
      importance: 'high',
      status: 'unfinished',
      deadline: '2026-04-20',
    });

    expect(task).not.toBeNull();
    expect(task.id).toBe(1);
    expect(task.name).toBe('Finish assignment');
    expect(task.description).toBe('Complete repository tests');
    expect(task.category).toBe('school');
    expect(task.importance).toBe('high');
    expect(task.status).toBe('unfinished');
    expect(task.date_finished).toBeNull();
    expect(task.deadline).toBe('2026-04-20');
  });

  test('createTask trims name and category', () => {
    const task = createTask({
      name: '  Clean room  ',
      category: '  home  ',
      importance: 'medium',
    });

    expect(task.name).toBe('Clean room');
    expect(task.category).toBe('home');
  });

  test('createTask normalizes invalid importance to medium', () => {
    const task = createTask({
      name: 'Task with weird importance',
      category: 'home',
      importance: 'SUPER',
    });

    expect(task.importance).toBe('medium');
  });

  test('createTask sets date_finished when status is finished', () => {
    const task = createTask({
      name: 'Submit report',
      category: 'school',
      importance: 'high',
      status: 'finished',
    });

    expect(task.status).toBe('finished');
    expect(task.date_finished).not.toBeNull();
  });

  test('createTask clears date_finished when status is unfinished', () => {
    const task = createTask({
      name: 'Read chapter',
      category: 'school',
      importance: 'medium',
      status: 'unfinished',
      date_finished: '2026-04-10',
    });

    expect(task.status).toBe('unfinished');
    expect(task.date_finished).toBeNull();
  });

  test('createTask throws if name is missing', () => {
    expect(() =>
      createTask({
        category: 'home',
        importance: 'medium',
      })
    ).toThrow('Task name is required');
  });

  test('createTask throws if category is missing', () => {
    expect(() =>
      createTask({
        name: 'Missing category',
        importance: 'medium',
      })
    ).toThrow('Task category is required');
  });

  test('getAllTasks returns all tasks', () => {
    createTask({
      name: 'Task 1',
      category: 'home',
      importance: 'low',
    });

    createTask({
      name: 'Task 2',
      category: 'school',
      importance: 'medium',
    });

    const tasks = getAllTasks();

    expect(tasks).toHaveLength(2);
    expect(tasks[0].name).toBe('Task 1');
    expect(tasks[1].name).toBe('Task 2');
  });

  test('getTaskById returns a task', () => {
    const created = createTask({
      name: 'Read book',
      category: 'personal',
      importance: 'medium',
    });

    const task = getTaskById(created.id);

    expect(task).not.toBeNull();
    expect(task.id).toBe(created.id);
    expect(task.name).toBe('Read book');
  });

  test('getTaskById returns null for missing task', () => {
    expect(getTaskById(999)).toBeNull();
  });

  test('updateTask updates an existing task', () => {
    const created = createTask({
      name: 'Do homework',
      category: 'school',
      importance: 'high',
      status: 'unfinished',
    });

    const updated = updateTask(created.id, {
      name: 'Do math homework',
      importance: 'low',
      category: 'study',
    });

    expect(updated).not.toBeNull();
    expect(updated.name).toBe('Do math homework');
    expect(updated.importance).toBe('low');
    expect(updated.category).toBe('study');
    expect(updated.id).toBe(created.id);
  });

  test('updateTask returns null for missing task', () => {
    const updated = updateTask(999, {
      name: 'Missing task',
    });

    expect(updated).toBeNull();
  });

  test('updateTask sets date_finished when status becomes finished', () => {
    const created = createTask({
      name: 'Gym',
      category: 'health',
      importance: 'medium',
      status: 'unfinished',
    });

    const updated = updateTask(created.id, {
      status: 'finished',
    });

    expect(updated.status).toBe('finished');
    expect(updated.date_finished).not.toBeNull();
  });

  test('updateTask clears date_finished when status becomes unfinished', () => {
    const created = createTask({
      name: 'Project',
      category: 'work',
      importance: 'high',
      status: 'finished',
    });

    const updated = updateTask(created.id, {
      status: 'unfinished',
    });

    expect(updated.status).toBe('unfinished');
    expect(updated.date_finished).toBeNull();
  });

  test('deleteTask deletes an existing task', () => {
    const created = createTask({
      name: 'Clean room',
      category: 'home',
      importance: 'medium',
    });

    const deleted = deleteTask(created.id);

    expect(deleted).not.toBeNull();
    expect(deleted.id).toBe(created.id);
    expect(getTaskById(created.id)).toBeNull();
  });

  test('deleteTask returns null for missing task', () => {
    expect(deleteTask(999)).toBeNull();
  });

  test('getUnfinishedTasks returns only unfinished tasks', () => {
    createTask({
      name: 'Task A',
      category: 'home',
      importance: 'low',
      status: 'unfinished',
    });

    createTask({
      name: 'Task B',
      category: 'school',
      importance: 'high',
      status: 'finished',
    });

    const tasks = getUnfinishedTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('Task A');
  });

  test('getTasksByCategory returns matching tasks', () => {
    createTask({
      name: 'Wash dishes',
      category: 'home',
      importance: 'medium',
    });

    createTask({
      name: 'Study English',
      category: 'school',
      importance: 'high',
    });

    const tasks = getTasksByCategory('home');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('Wash dishes');
  });

  test('getTasksByCategory ignores case and spaces', () => {
    createTask({
      name: 'Mop floor',
      category: 'home',
      importance: 'medium',
    });

    const tasks = getTasksByCategory('  HOME  ');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('Mop floor');
  });

  test('getTodayTasks returns tasks due today', () => {
    const today = new Date().toISOString().slice(0, 10);

    createTask({
      name: 'Today task',
      category: 'school',
      importance: 'medium',
      deadline: today,
    });

    createTask({
      name: 'Future task',
      category: 'school',
      importance: 'medium',
      deadline: '2099-12-31',
    });

    const tasks = getTodayTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('Today task');
  });

  test('getPastTasks returns past deadline tasks', () => {
    createTask({
      name: 'Past task',
      category: 'home',
      importance: 'low',
      deadline: '2020-01-01',
    });

    createTask({
      name: 'Future task',
      category: 'home',
      importance: 'low',
      deadline: '2099-01-01',
    });

    const tasks = getPastTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('Past task');
  });

  test('getUpcomingTasks returns future tasks with limit', () => {
    createTask({
      name: 'Future 1',
      category: 'work',
      importance: 'medium',
      deadline: '2099-01-01',
    });

    createTask({
      name: 'Future 2',
      category: 'work',
      importance: 'medium',
      deadline: '2099-01-02',
    });

    const tasks = getUpcomingTasks(1);

    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('Future 1');
  });

  test('database resets before each test', () => {
    const tasks = getAllTasks();
    expect(tasks).toHaveLength(0);
  });
});
