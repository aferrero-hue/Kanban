const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");
const modifyBtn = document.getElementById("modify-task-btn");
const deleteBtn = document.getElementById("delete-task-btn");
const addBtn = document.getElementById("add-task-btn");
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".close");
const saveTaskBtn = document.getElementById("save-task-btn");
const infoBtn = document.getElementById("info-task-btn");
const infoModal = document.getElementById("info");

// Color original de la tarea seleccionada
let selectedTaskColor = "";
let selectedTask = null;

// Función para actualizar el color de la tarea basado en la prioridad
function updateTaskColor(task, priority) {
  task.style.backgroundColor =
    priority === "verd" ? "green" : priority === "groc" ? "yellow" : "red";
}

// Funció per generar una ID unica.
function generateid(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Evento al hacer clic en cualquier parte del documento
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("task")) {
    // Restaura el color original de la tarea previamente seleccionada
    if (selectedTaskColor !== "" && selectedTask !== null) {
      selectedTask.style.backgroundColor = selectedTaskColor;
    }

    // Actualiza la tarea seleccionada y su color original
    selectedTask = e.target;
    selectedTaskColor = getComputedStyle(selectedTask).backgroundColor;

    // Establece el color de la tarea como azul
    selectedTask.style.backgroundColor = "blue";
  } else {
    // Si se hace clic fuera de una tarea, desselecciona la tarea
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

// ... (Código anterior)

// Botón para agregar nueva tarea
addBtn.addEventListener("click", () => {
  // Limpia el formulario antes de agregar una nueva tarea
  document.getElementById("task-code").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-creation-date").value = "";
  document.getElementById("task-due-date").value = "";
  document.getElementById("task-responsible").value = "";
  document.getElementById("task-priority").value = "verd";

  // Muestra el modal de agregar
  modal.style.display = "flex";
});

// Botón para modificar tarea
modifyBtn.addEventListener("click", () => {
  if (selectedTask) {
    // Rellena el formulario con los datos de la tarea seleccionada
    document.getElementById("task-code").value = selectedTask.dataset.code || "";
    document.getElementById("task-description").value = selectedTask.innerText || "";
    document.getElementById("task-creation-date").value =
      selectedTask.dataset.creationDate || "";
    document.getElementById("task-due-date").value = selectedTask.dataset.dueDate || "";
    document.getElementById("task-responsible").value =
      selectedTask.dataset.responsible || "";
    document.getElementById("task-priority").value = selectedTask.dataset.priority || "verd";

    // Muestra el modal de modificación
    modal.style.display = "flex";
  }
});

deleteBtn.addEventListener("click", () => {
  if (selectedTask) {
    const taskId = selectedTask.dataset.code;
    // Asumiendo que tienes una función deleteTaskFromLocalStorage
    deleteTaskFromLocalStorage(taskId);

    selectedTask.remove();
    selectedTask = null;
    selectedTaskColor = "";
  }
});

infoBtn.addEventListener("click", () => {
  if (selectedTask) {
    document.getElementById("task-info-code").innerText = selectedTask.dataset.code || "";
    document.getElementById("task-info-description").innerText = selectedTask.innerText || "";
    document.getElementById("task-info-creation-date").innerText = selectedTask.dataset.creationDate || "";
    document.getElementById("task-info-due-date").innerText = selectedTask.dataset.dueDate || "";
    document.getElementById("task-info-responsible").innerText = selectedTask.dataset.responsible || "";
    document.getElementById("task-info-priority").innerText = selectedTask.dataset.priority || "";

    infoModal.style.display = "flex";
  }
});

saveTaskBtn.addEventListener("click", () => {
  const code = document.getElementById("task-code").value;
  const description = document.getElementById("task-description").value;
  const creationDate = document.getElementById("task-creation-date").value;
  const dueDate = document.getElementById("task-due-date").value;
  const responsible = document.getElementById("task-responsible").value;
  const priority = document.getElementById("task-priority").value;

  const updatedTask = {
    code,
    description,
    creationDate,
    dueDate,
    responsible,
    priority,
  };

  if (selectedTask) {
    // Modifica la tarea existente con los nuevos datos
    selectedTask.dataset.code = code;
    selectedTask.dataset.creationDate = creationDate;
    selectedTask.dataset.dueDate = dueDate;
    selectedTask.dataset.responsible = responsible;
    selectedTask.dataset.priority = priority;
    selectedTask.innerText = description;

    // Actualiza el color de la tarea basado en la prioridad
    updateTaskColor(selectedTask, priority);

    // Asume que tienes una función updateTaskInLocalStorage
    updateTaskInLocalStorage(updatedTask);
  } else {
    // Crea una nueva tarea con los datos ingresados
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

    // Añade la nueva tarea a la "TODO lane"
    todoLane.appendChild(newTask);

    // Actualiza el color de la tarea basado en la prioridad
    updateTaskColor(newTask, priority);

    // Asume que tienes una función saveTaskToLocalStorage
    saveTaskToLocalStorage(updatedTask);
  }

  // Cierra el modal
  modal.style.display = "none";
});

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

// Evento de clic para cerrar el modal de agregar/modificar
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Evento de clic fuera del contenido del modal para cerrar el modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Evento de clic para cerrar el modal de información
document.querySelector("#info .close").addEventListener("click", () => {
  infoModal.style.display = "none";
});

// Load tasks when the page is loaded
window.addEventListener("load", loadTasks);