// Get DOM elements
const projectsContainer = document.getElementById("projects-container");
const addProjectBtn = document.getElementById("add-project-btn");
const newProjectName = document.getElementById("new-project-name");
const newProjectDesc = document.getElementById("new-project-desc");

//Render Users
function renderUsers() {
    usersContainer.innerHTML = "";
    const users = getUsers();

    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.classList.add("user-item");

        userItem.innerHTML = `
            <span>${user.name} (ID: ${user.id})</span>
            <button onclick="handleDeleteUser(${user.id})">Remove</button>
        `;

        usersContainer.appendChild(userItem);
    });
}

//Render Projects
function renderProjects() {
  projectsContainer.innerHTML = "";
  const projects = getProjects();

  projects.forEach(project => {
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    const projectNotesHtml = (project.notes || []).map(n => `<li>${n}</li>`).join("");

    projectCard.innerHTML = `
      <h2>${project.name}</h2>
      <p>${project.description}</p>

      <div class="tasks" id="tasks-${project.id}"></div>

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

//Render Tasks
function renderTasks(projectId) {
  const tasksDiv = document.getElementById(`tasks-${projectId}`);
  if (!tasksDiv) return;

  tasksDiv.innerHTML = "";
  const tasks = getTasks(projectId);
  const users = getUsers();

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");
    if (task.status === "done") taskDiv.classList.add("done");

    const taskNotesHtml = (task.notes || []).map(n => `<li>${n}</li>`).join("");

    const userOptions = users.map(u => {
      const selected = task.assignedTo === u.id ? "selected" : "";
      return `<option value="${u.id}" ${selected}>${u.name}</option>`;
    }).join("");

    const assignedUser = task.assignedTo
      ? (users.find(u => u.id === task.assignedTo)?.name || "Unknown User")
      : "Unassigned";

    taskDiv.innerHTML = `
      <div>
        <div style="display:flex; justify-content: space-between; align-items:center; gap:0.5rem;">
          <span>${task.title}</span>
          <select onchange="handleAssignTask(${projectId}, ${task.id}, this.value)">
            <option value="">Unassigned</option>
            ${userOptions}
          </select>
          <div>
            <button onclick="toggleTaskStatus(${projectId}, ${task.id})">${task.status === "done" ? "Undo" : "Done"}</button>
            <button onclick="handleDeleteTask(${projectId}, ${task.id})">Delete</button>
          </div>
        </div>

        <em style="font-size:0.85rem; color:#555;">Assigned: ${assignedUser}</em>

        <ul id="task-notes-${task.id}">${taskNotesHtml}</ul>
        <input type="text" placeholder="Add note" id="task-note-input-${task.id}">
        <button onclick="handleAddTaskNote(${projectId}, ${task.id})">Add Note</button>
      </div>
    `;

    tasksDiv.appendChild(taskDiv);
  });
}

//Event Handlers

addUserBtn.addEventListener("click", () => {
    const name = newUserNameInput.value.trim();
    if (!name) return alert("User name required!");
    addUser(name);
    newUserNameInput.value = "";
    
});

function handleDeleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user? All their assigned tasks will become unassigned.")) return;
    deleteUser(userId);
}

addProjectBtn.addEventListener("click", () => {
  const name = newProjectName.value.trim();
  const desc = newProjectDesc.value.trim();
  if (!name) return alert("Project name required!");
  createProject(name, desc);
  newProjectName.value = "";
  newProjectDesc.value = "";
});

function handleAddTask(projectId) {
  const input = document.getElementById(`task-input-${projectId}`);
  const title = input.value.trim();
  if (!title) return;
  addTask(projectId, title);
  input.value = "";
}

function toggleTaskStatus(projectId, taskId) {
  const task = getTasks(projectId).find(t => t.id === taskId);
  if (!task) return;
  const newStatus = task.status === "done" ? "todo" : "done";
  updateTask(projectId, taskId, { status: newStatus });
}

function handleDeleteTask(projectId, taskId) {
  deleteTask(projectId, taskId);
}

function handleDeleteProject(projectId) {
  if (!confirm("Are you sure you want to delete this project?")) return;
  deleteProject(projectId);
}

function handleAddProjectNote(projectId) {
  const input = document.getElementById(`project-note-input-${projectId}`);
  const note = input.value.trim();
  if (!note) return;
  addProjectNote(projectId, note);
  input.value = "";
}

function handleAddTaskNote(projectId, taskId) {
  const input = document.getElementById(`task-note-input-${taskId}`);
  const note = input.value.trim();
  if (!note) return;
  addTaskNote(projectId, taskId, note);
  input.value = "";
}

function handleAssignTask(projectId, taskId, userId) {
  const assignedId = userId ? Number(userId) : null;
  updateTask(projectId, taskId, { assignedTo: assignedId });
}
