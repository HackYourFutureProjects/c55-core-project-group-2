const taskList = document.querySelector('.task-list');
const filterButtons = document.querySelectorAll('.filter');

let allTasks = [];
let currentFilter = 'all';

// Load tasks
async function loadTasks() {
  const response = await fetch('/tasks');
  if (!response.ok) {
    console.error('Failed to load tasks', response.status);
    return;
  }
  const { tasks } = await response.json();
  allTasks = tasks;
  renderTasks();
}

// Render tasks as HTML elements in web interface
function renderTasks() {
  const visible = allTasks.filter((task) => {
    if (currentFilter === 'unfinished') return task.status !== 'finished';
    if (currentFilter === 'finished') return task.status === 'finished';
    return true;
  });

  taskList.innerHTML = '';
  for (const task of visible) {
    taskList.appendChild(createTaskElement(task));
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle('active', b === button));
    renderTasks();
  });
});

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task';
  li.dataset.id = task.id;

  li.innerHTML = `
    <div class="task-left">
      <input type="checkbox" ${task.status === 'finished' ? 'checked' : ''} />
      <div class="task-meta">
        <div class="task-title">${escapeHtml(task.name)}</div>
        ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-due">${task.deadline ? `Due: ${task.deadline}` : ''}</div>
      </div>
    </div>
    <div class="task-right">
      <button class="icon edit" title="edit">
        <i class="nf nf-oct-pencil"></i>
      </button>
      <button class="icon delete" title="delete">
        <i class="nf nf-fa-trash_can"></i>
      </button>
      <span class="priority ${task.importance}"></span>
    </div>
  `;

  li.querySelector('.edit').addEventListener('click', () => {
    enterEditMode(li, task);
  });

  li.querySelector('input[type="checkbox"]').addEventListener(
    'change',
    async (e) => {
      const status = e.target.checked ? 'finished' : 'unfinished';
      const response = await fetch(`/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        e.target.checked = !e.target.checked;
        alert('Could not update task status');
        return;
      }
      await loadTasks();
    }
  );

  li.querySelector('.delete').addEventListener('click', async () => {
    const response = await fetch(`/tasks/${task.id}`, { method: 'DELETE' });
    if (response.ok) {
      await loadTasks();
    } else {
      alert('Could not delete task');
    }
  });

  return li;
}

function enterEditMode(li, task) {
  li.classList.add('editing');
  li.innerHTML = `
    <div class="task-edit">
      <input class="edit-name" type="text" value="${escapeHtml(task.name)}" placeholder="Task name" />
      <input class="edit-desc" type="text" value="${escapeHtml(task.description || '')}" placeholder="Description (optional)" />
      <select class="edit-importance">
        <option value="low">Low priority</option>
        <option value="medium">Medium priority</option>
        <option value="high">High priority</option>
      </select>
      <div class="edit-actions">
        <button class="edit-save" type="button">Save</button>
        <button class="edit-cancel" type="button">Cancel</button>
      </div>
    </div>
  `;

  li.querySelector('.edit-importance').value = task.importance;

  li.querySelector('.edit-cancel').addEventListener('click', () => {
    renderTasks();
  });

  li.querySelector('.edit-save').addEventListener('click', async () => {
    const name = li.querySelector('.edit-name').value.trim();
    if (!name) {
      alert('Task name cannot be empty');
      return;
    }
    const response = await fetch(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description: li.querySelector('.edit-desc').value.trim(),
        importance: li.querySelector('.edit-importance').value,
      }),
    });
    if (!response.ok) {
      alert('Could not save changes');
      return;
    }
    await loadTasks();
  });
}

// Prevents HTML code from being run by user input
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Create tasks
const input = document.getElementById('new-task-input');
const descInput = document.getElementById('new-task-desc');
const importanceSelect = document.getElementById('new-task-importance');
const addButton = document.getElementById('new-task-btn');

async function addTask() {
  const name = input.value.trim();
  if (!name) return;

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description: descInput.value.trim(),
      category: 'general',
      importance: importanceSelect.value,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Could not add task: ${error.error}`);
    return;
  }

  input.value = '';
  descInput.value = '';
  importanceSelect.value = 'medium';
  await loadTasks();
}

addButton.addEventListener('click', addTask);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTask();
});

loadTasks();
