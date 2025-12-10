// Project Management App (Proof of Concept)
// Uses JSON as live "database"

// Starting JSON "database"
let projectData = {
  "projects": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Create and launch new company website.",
      "tasks": [
        {
          "id": 101,
          "title": "Design homepage layout",
          "status": "in-progress",
          "assignedTo": 1
        },
        {
          "id": 102,
          "title": "Build navigation menu",
          "status": "todo",
          "assignedTo": 2
        }
      ]
    }
  ],
  "users": [
    {
      "id": 1,
      "name": "Sarah Walker"
    },
    {
      "id": 2,
      "name": "Daryle Suggs"
    }
  ]
};

// Utility: generate a unique ID

function generateId() {
  return Math.floor(Math.random() * 100000);
}

// PROJECT FUNCTIONS

function createProject(name, description) {
  const newProject = {
    id: generateId(),
    name,
    description,
    tasks: []
  };
  projectData.projects.push(newProject);
  return newProject;
}

function getProjects() {
  return projectData.projects;
}

function getProjectById(projectId) {
  return projectData.projects.find(p => p.id === projectId) || null;
}

function deleteProject(projectId) {
  projectData.projects = projectData.projects.filter(p => p.id !== projectId);
  return "Project deleted";
}

// TASK FUNCTIONS

function addTask(projectId, title, assignedTo = null) {
  const project = getProjectById(projectId);
  if (!project) return "Project not found";

  const newTask = {
    id: generateId(),
    title,
    status: "todo",
    assignedTo
  };
  project.tasks.push(newTask);
  return newTask;
}

function getTasks(projectId) {
  const project = getProjectById(projectId);
  return project ? project.tasks : "Project not found";
}

function updateTask(projectId, taskId, updates) {
  const project = getProjectById(projectId);
  if (!project) return "Project not found";

  const task = project.tasks.find(t => t.id === taskId);
  if (!task) return "Task not found";

  Object.assign(task, updates);
  return task;
}

function deleteTask(projectId, taskId) {
  const project = getProjectById(projectId);
  if (!project) return "Project not found";

  project.tasks = project.tasks.filter(t => t.id !== taskId);
  return "Task deleted";
}

// USER FUNCTIONS

function addUser(name) {
  const newUser = {
    id: generateId(),
    name
  };
  projectData.users.push(newUser);
  return newUser;
}

function getUsers() {
  return projectData.users;
}

function getUserById(userId) {
  return projectData.users.find(u => u.id === userId) || null;
}

function deleteUser(userId) {
  projectData.users = projectData.users.filter(u => u.id !== userId);

  // Remove assignments from tasks
  projectData.projects.forEach(project => {
    project.tasks.forEach(task => {
      if (task.assignedTo === userId) task.assignedTo = null;
    });
  });

  return "User deleted";
}

/*
function demo() {
  console.log("Initial JSON:");
  console.log(JSON.stringify(projectData, null, 2));

  // Add a new project
  const newProj = createProject("Marketing Campaign", "Launch ad campaign");
  console.log("After adding project:");
  console.log(JSON.stringify(projectData, null, 2));

  // Add a task to existing project
  addTask(1, "Test homepage layout", 2);

  // Update a task
  updateTask(1, 101, { status: "done" });

  // Delete a task
  deleteTask(1, 102);

  // Add a new user
  addUser("New User");

  console.log("Final JSON after changes:");
  console.log(JSON.stringify(projectData, null, 2));
}
*/

//project notes
function addProjectNote(projectId, note) {
  const project = getProjectById(projectId);
  if (!project) return "Project not found";

  if (!project.notes) project.notes = [];
  project.notes.push(note);
  return note;
}

function getProjectNotes(projectId) {
  const project = getProjectById(projectId);
  return project ? project.notes || [] : "Project not found";
}
//task notes
function addTaskNote(projectId, taskId, note) {
  const project = getProjectById(projectId);
  if (!project) return "Project not found";

  const task = project.tasks.find(t => t.id === taskId);
  if (!task) return "Task not found";

  if (!task.notes) task.notes = [];
  task.notes.push(note);
  return note;
}

function getTaskNotes(projectId, taskId) {
  const project = getProjectById(projectId);
  if (!project) return "Project not found";

  const task = project.tasks.find(t => t.id === taskId);
  return task ? task.notes || [] : "Task not found";
}
