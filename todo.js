const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");
const modifyBtn = document.getElementById("modify-task-btn");
const deleteBtn = document.getElementById("delete-task-btn");
const addBtn = document.getElementById("add-task-btn");
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".close");
const saveTaskBtn = document.getElementById("save-task-btn");
const infoBtn = document.getElementById("info-task-btn")

// Color original de la tasca seleccionada
let selectedTaskColor = "";
let selectedTask = null;

// Funció per actualitzar el color de la tasca basat en la prioritat
function updateTaskColor(task, priority) {
  task.style.backgroundColor =
    priority === "verd" ? "green" : priority === "groc" ? "yellow" : "red";
}

// Esdeveniment al fer clic en qualsevol part del document
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("task")) {
    // Restaura el color original de la tasca prèviament seleccionada
    if (selectedTaskColor !== "" && selectedTask !== null) {
      selectedTask.style.backgroundColor = selectedTaskColor;
    }

    // Actualitza la tasca seleccionada i el seu color original
    selectedTask = e.target;
    selectedTaskColor = getComputedStyle(selectedTask).backgroundColor;

    // Estableix el color de la tasca com a blau
    selectedTask.style.backgroundColor = "blue";
  } else {
    // Si es fa clic fora d'una tasca, desselecciona la tasca
    if (selectedTaskColor !== "" && selectedTask !== null) {
      selectedTask.style.backgroundColor = selectedTaskColor;
      selectedTask = null;
      selectedTaskColor = "";
    }
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  const newTask = document.createElement("p");
  newTask.classList.add("task");
  newTask.setAttribute("draggable", "true");
  newTask.innerText = value;

  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  todoLane.appendChild(newTask);

  input.value = "";
});

addBtn.addEventListener("click", () => {
  // Implementa la lògica per afegir una nova tasca
  // Mostra una finestra/modal per introduir les dades de la nova tasca
  modal.style.display = "flex";
});

modifyBtn.addEventListener("click", () => {
  if (selectedTask) {
    // Omple el formulari amb les dades de la tasca seleccionada
    document.getElementById("task-code").value = selectedTask.dataset.code || "";
    document.getElementById("task-description").value = selectedTask.innerText || "";
    document.getElementById("task-creation-date").value =
      selectedTask.dataset.creationDate || "";
    document.getElementById("task-due-date").value = selectedTask.dataset.dueDate || "";
    document.getElementById("task-responsible").value =
      selectedTask.dataset.responsible || "";
    document.getElementById("task-priority").value = selectedTask.dataset.priority || "verd";

    modal.style.display = "flex";
  }
});

deleteBtn.addEventListener("click", () => {
  // Implementa la lògica per eliminar la tasca seleccionada
  // Utilitza la variable selectedTask per obtenir la tasca seleccionada
  // Mostra una finestra/modal de confirmació abans de eliminar
  if (selectedTask) {
    // Elimina la tarea seleccionada del local storage
    const taskId = selectedTask.dataset.code;
    deleteTaskFromLocalStorage(taskId);

    // Elimina la tarea seleccionada del DOM
    selectedTask.remove();
    selectedTask = null;
    selectedTaskColor = "";
  }
});

infoBtn.addEventListener("click", () => {
  if (selectedTask) {
    // Muestra la información de la tarea seleccionada en el modal de información
    document.getElementById("task-info-code").innerText = selectedTask.dataset.code || "";
    document.getElementById("task-info-description").innerText = selectedTask.innerText || "";
    document.getElementById("task-info-creation-date").innerText = selectedTask.dataset.creationDate || "";
    document.getElementById("task-info-due-date").innerText = selectedTask.dataset.dueDate || "";
    document.getElementById("task-info-responsible").innerText = selectedTask.dataset.responsible || "";
    document.getElementById("task-info-priority").innerText = selectedTask.dataset.priority || "";
    
    info.style.display = "flex";
  }
});

saveTaskBtn.addEventListener("click", () => {
  // Guarda les dades de la tasca i tanca el modal
  const code = document.getElementById("task-code").value;
  const description = document.getElementById("task-description").value;
  const creationDate = document.getElementById("task-creation-date").value;
  const dueDate = document.getElementById("task-due-date").value;
  const responsible = document.getElementById("task-responsible").value;
  const priority = document.getElementById("task-priority").value;

  // Crea una nova tasca amb les dades introduïdes
  const newTask = document.createElement("p");
  newTask.classList.add("task");
  newTask.setAttribute("draggable", "true");
  newTask.dataset.code = code;
  newTask.dataset.creationDate = creationDate;
  newTask.dataset.dueDate = dueDate;
  newTask.dataset.responsible = responsible;
  newTask.dataset.priority = priority;
  newTask.innerText = description;

  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  // Afegeix la nova tasca a la "TODO lane"
  todoLane.appendChild(newTask);

  // Tanca el modal
  modal.style.display = "none";

  // Update task color based on priority
  updateTaskColor(newTask, priority);

  // Save task to localStorage
  saveTaskToLocalStorage({
    code,
    description,
    creationDate,
    dueDate,
    responsible,
    priority,
  });
});

// Resta del codi (funcions loadTasks, getTasksFromLocalStorage, etc.)


// Function to load tasks from localStorage
function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((task) => {
    const { description, priority } = task;

    // Create a new task element
    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = description;

    // Set data attributes
    Object.keys(task).forEach((key) => {
      newTask.dataset[key] = task[key];
    });

    // Update task color based on priority
    updateTaskColor(newTask, priority);

    // Add drag event listeners
    newTask.addEventListener("dragstart", () => {
      newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
      newTask.classList.remove("is-dragging");
    });

    // Append the task to the TODO lane
    todoLane.appendChild(newTask);
  });
}

// Load tasks when the page is loaded
window.addEventListener("load", loadTasks);