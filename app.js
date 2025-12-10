// -------------------- app.js --------------------

// Store loaded data
let projectData = { projects: [], users: [] };

// -------------------- Load JSON --------------------
async function loadProjectData() {
  try {
    const response = await fetch("projectData.json");
    if (!response.ok) throw new Error("Failed to load projectData.json");
    projectData = await response.json();
    renderProjects(); // render after loading
  } catch (err) {
    console.error("Error loading project data:", err);
  }
}

// -------------------- Utilities --------------------
function generateId() {
  return Math.floor(Math.random() * 100000);
}

// -------------------- PROJECT FUNCTIONS --------------------
function createProject(name, description) {
  const newProject = {
    id: generateId(),
    name,
    description,
    tasks: [],
    notes: []
  };
  projectData.projects.push(newProject);
  renderProjects();
  return newProject;
}

function getProjects() {
  return projectData.projects || [];
}

function getProjectById(projectId) {
  return projectData.projects.find(p => Number(p.id) === Number(projectId)) || null;
}

function deleteProject(projectId) {
  projectData.projects = projectData.projects.filter(p => Number(p.id) !== Number(projectId));
  renderProjects();
}

// -------------------- TASK FUNCTIONS --------------------
function addTask(projectId, title, assignedTo = null) {
  const project = getProjectById(projectId);
  if (!project) return;

  const newTask = {
    id: generateId(),
    title,
    status: "todo",
    assignedTo,
    notes: []
  };
  project.tasks.push(newTask);
  renderTasks(projectId);
}

function getTasks(projectId) {
  const project = getProjectById(projectId);
  return project ? project.tasks || [] : [];
}

function updateTask(projectId, taskId, updates) {
  const project = getProjectById(projectId);
  if (!project) return;

  const task = project.tasks.find(t => Number(t.id) === Number(taskId));
  if (!task) return;

  Object.assign(task, updates);
  renderTasks(projectId);
}

function deleteTask(projectId, taskId) {
  const project = getProjectById(projectId);
  if (!project) return;

  project.tasks = project.tasks.filter(t => Number(t.id) !== Number(taskId));
  renderTasks(projectId);
}

// -------------------- USER FUNCTIONS --------------------
function addUser(name) {
  const newUser = {
    id: generateId(),
    name
  };
  projectData.users.push(newUser);
  return newUser;
}

function getUsers() {
  return projectData.users || [];
}

function getUserById(userId) {
  return projectData.users.find(u => Number(u.id) === Number(userId)) || null;
}

function deleteUser(userId) {
  projectData.users = projectData.users.filter(u => Number(u.id) !== Number(userId));
  projectData.projects.forEach(project => {
    project.tasks.forEach(task => {
      if (task.assignedTo === Number(userId)) task.assignedTo = null;
    });
  });
  renderProjects();
}

// -------------------- NOTES --------------------
function addProjectNote(projectId, note) {
  const project = getProjectById(projectId);
  if (!project) return;
  if (!project.notes) project.notes = [];
  project.notes.push(note);
  renderProjects();
}

function addTaskNote(projectId, taskId, note) {
  const project = getProjectById(projectId);
  if (!project) return;

  const task = project.tasks.find(t => Number(t.id) === Number(taskId));
  if (!task) return;

  if (!task.notes) task.notes = [];
  task.notes.push(note);
  renderTasks(projectId);
}

// -------------------- INITIALIZE --------------------
window.addEventListener("DOMContentLoaded", () => {
  loadProjectData();
});
