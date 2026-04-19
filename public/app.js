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

loadTasks();
