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

function renderTasks(tasks) {
  taskList.innerHTML = '';
  for (const task of tasks) {
    taskList.appendChild(createTaskElement(task));
  }
}
loadTasks();
