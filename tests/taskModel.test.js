import { describe, expect, test } from 'vitest';
import { Task } from '../src/models/Task.js';

describe('Task model', () => {
  test('valid task passes validation', () => {
    const task = new Task({
      name: 'Finish assignment',
      description: 'Write tests',
      category: 'school',
      importance: 'high',
      status: 'unfinished',
    });

    expect(() => task.validate()).not.toThrow();
  });

  test('missing name throws error', () => {
    const task = new Task({
      category: 'school',
      importance: 'high',
      status: 'unfinished',
    });

    expect(() => task.validate()).toThrow('Task name is required.');
  });

  test('missing category throws error', () => {
    const task = new Task({
      name: 'Finish assignment',
      importance: 'high',
      status: 'unfinished',
    });

    expect(() => task.validate()).toThrow('Task category is required.');
  });

  test('invalid importance throws error', () => {
    const task = new Task({
      name: 'Finish assignment',
      category: 'school',
      importance: 'super-high',
      status: 'unfinished',
    });

    expect(() => task.validate()).toThrow('Invalid importance value.');
  });

  test('invalid status throws error', () => {
    const task = new Task({
      name: 'Finish assignment',
      category: 'school',
      importance: 'high',
      status: 'done',
    });

    expect(() => task.validate()).toThrow('Invalid status value.');
  });
});
