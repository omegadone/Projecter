// Get DOM elements
const projectsContainer = document.getElementById("projects-container");
const addProjectBtn = document.getElementById("add-project-btn");
const newProjectName = document.getElementById("new-project-name");
const newProjectDesc = document.getElementById("new-project-desc");

// Render projects

function renderProjects() {
  projectsContainer.innerHTML = "";
  const projects = getProjects();

  projects.forEach(project => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    
    const projectNotes = project.notes || [];
    const projectNotesHtml = projectNotes.map(n => `<li>${n}</li>`).join("");

    projectCard.innerHTML = `
      <h2>${project.name}</h2>
      <p>${project.description}</p>

      <div class="tasks" id="tasks-${project.id}">
        <!-- Tasks will be rendered here -->
      </div>

      <div class="add-task-section">
        <input type="text" placeholder="New Task" id="task-input-${project.id}">
        <button onclick="handleAddTask(${project.id})">Add Task</button>
      </div>

      <div class="project-notes">
        <strong>Project Notes:</strong>
        <ul id="project-notes-${project.id}">${projectNotesHtml}</ul>
        <input type="text" placeholder="Add note" id="project-note-input-${project.id}">
        <button onclick="handleAddProjectNote(${project.id})">Add Note</button>
      </div>

      <button onclick="handleDeleteProject(${project.id})" style="margin-top:0.5rem;">Delete Project</button>
    `;

    projectsContainer.appendChild(projectCard);
    renderTasks(project.id);
  });
}


// Render tasks

function renderTasks(projectId) {
  const tasksDiv = document.getElementById(`tasks-${projectId}`);
  const tasks = getTasks(projectId);
  tasksDiv.innerHTML = "";

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");
    if (task.status === "done") taskDiv.classList.add("done");

    const taskNotes = task.notes || [];
    const taskNotesHtml = taskNotes.map(n => `<li>${n}</li>`).join("");

    taskDiv.innerHTML = `
      <div>
        <div style="display:flex; justify-content: space-between; align-items:center;">
          <span>${task.title}</span>
          <div>
            <button onclick="toggleTaskStatus(${projectId}, ${task.id})">${task.status === "done" ? "Undo" : "Done"}</button>
            <button onclick="handleDeleteTask(${projectId}, ${task.id})">Delete</button>
          </div>
        </div>

        <ul id="task-notes-${task.id}">${taskNotesHtml}</ul>
        <input type="text" placeholder="Add note" id="task-note-input-${task.id}">
        <button onclick="handleAddTaskNote(${projectId}, ${task.id})">Add Note</button>
      </div>
    `;

    tasksDiv.appendChild(taskDiv);
  });
}


// Event Handlers


// Add new project
addProjectBtn.addEventListener("click", () => {
  const name = newProjectName.value.trim();
  const desc = newProjectDesc.value.trim();
  if (!name) return alert("Project name required!");

  createProject(name, desc);
  newProjectName.value = "";
  newProjectDesc.value = "";
  renderProjects();
});

// Add task to a project
function handleAddTask(projectId) {
  const input = document.getElementById(`task-input-${projectId}`);
  const title = input.value.trim();
  if (!title) return;
  addTask(projectId, title);
  input.value = "";
  renderTasks(projectId);
}

// Toggle task status
function toggleTaskStatus(projectId, taskId) {
  const task = getTasks(projectId).find(t => t.id === taskId);
  const newStatus = task.status === "done" ? "todo" : "done";
  updateTask(projectId, taskId, { status: newStatus });
  renderTasks(projectId);
}

// Delete a task
function handleDeleteTask(projectId, taskId) {
  deleteTask(projectId, taskId);
  renderTasks(projectId);
}

// Delete a project
function handleDeleteProject(projectId) {
  if (!confirm("Are you sure you want to delete this project?")) return;
  deleteProject(projectId);
  renderProjects();
}

// Add project note
function handleAddProjectNote(projectId) {
  const input = document.getElementById(`project-note-input-${projectId}`);
  const note = input.value.trim();
  if (!note) return;
  addProjectNote(projectId, note);
  input.value = "";
  renderProjects();
}

// Add task note
function handleAddTaskNote(projectId, taskId) {
  const input = document.getElementById(`task-note-input-${taskId}`);
  const note = input.value.trim();
  if (!note) return;
  addTaskNote(projectId, taskId, note);
  input.value = "";
  renderTasks(projectId);
}

renderProjects();
