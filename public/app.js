const taskList = document.querySelector('.task-list');

// Load tasks
async function loadTasks() {
  const response = await fetch('/tasks');
  if (!response.ok) {
    console.error('Failed to load tasks', response.status);
    return;
  }
  const { tasks } = await response.json();
  renderTasks(tasks);
}

// Render tasks as HTML elements in web interface
function renderTasks(tasks) {
  taskList.innerHTML = '';
  for (const task of tasks) {
    taskList.appendChild(createTaskElement(task));
  }
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task';
  li.dataset.id = task.id;

  li.innerHTML = `
    <div class="task-left">
      <input type="checkbox" ${task.status === 'finished' ? 'checked' : ''} />
      <div class="task-meta">
        <div class="task-title">${escapeHtml(task.name)}</div>
        <div class="task-due">${task.deadline ? `Due: ${task.deadline}` : ''}</div>
      </div>
    </div>
    <div class="task-right">
      <button class="icon delete" title="delete">
        <i class="nf nf-fa-trash"></i>
      </button>
      <span class="priority ${task.importance}"></span>
    </div>
  `;

  return li;
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
const addButton = document.getElementById('new-task-btn');

async function addTask() {
  const name = input.value.trim();
  if (!name) return;

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      category: 'general',
      importance: 'medium',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    alert(`Could not add task: ${error.error}`);
    return;
  }

  input.value = '';
  await loadTasks();
}

addButton.addEventListener('click', addTask);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTask();
});

loadTasks();
