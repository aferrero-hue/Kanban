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

//Cambiar en el CSS [PENDENT]
document.getElementById("camp-buit").style.textAlign = "center";
document.getElementById("camp-buit").style.fontWeight = "bold";

// Color original de la tarea seleccionada
let selectedTaskColor = "";
let selectedTask = null;

let currentTask = null;

//Distingir crear i editar
let editing = false;

// Funció per generar una ID unica.
function generateid(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
  
  //Funció per generar una Data actual en el moment
function createstartdate(){
  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1;
  month = month.toString();
  if(month.length == 1){
    month = 0 + month;
  }
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  var newdate = day + "-" + month + "-" + year;
  return newdate;
}

// Función para actualizar el color de la tarea basado en la prioridad
function updateTaskColor(task, priority) {
  task.style.backgroundColor =
    priority === "normal" ? "green" : priority === "urgent" ? "yellow" : "red";
}

// Funció per cambiar la info mostrada per pantalla:
function updateDesc(task, desc) {
  task.innerText = desc;
}
//Funció per cambiar l'ordre de la data quan es mostra en informació [PENDENT]
function FixDate(due){
  let dueY = due.substring(0, 4);
  let dueM = due.substring(5,7);
  let dueD = due.substring(8,10);
  let result = dueD + "-" + dueM + "-" + dueY;
  return result;
}
// Funció per determinar si la data introduida no es correcte: [PENDENT]
function CheckDate(dat, due){
  //DATE: DAY-MONTH-YEAR
  //DUE: MONTH-YEAR-DAY
  let dateposD = dat.substring(0, 2);
  let dateposM = dat.substring(3,5);
  let dateposY = dat.substring(6,10);
  let dueposY = due.substring(0, 4);
  let dueposM = due.substring(5,7);
  let dueposD = due.substring(8,10);
  let validation = false;
  if(parseInt(dateposY) <= parseInt(dueposY)){
    if(parseInt(dateposM) <= parseInt(dueposM)){
      if(parseInt(dateposD) <= parseInt(dueposD)){
        validation = true;
      }
    }
  }
  return validation;
}

//Funcio per fer desapareicer el missatge de camp buit despes
function TimeGone(){
  document.getElementById("camp-buit").innerHTML = "";
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

document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("task") && selectedTask !== e.target) {
    e.target.style.backgroundColor = selectedTaskColor;
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
  document.getElementById("task-code").innerHTML = generateid();  
  document.getElementById("task-description").value = "";
  document.getElementById("task-creation-date").innerHTML = createstartdate();
  document.getElementById("task-due-date").value = "";
  document.getElementById("task-responsible").value = "";
  document.getElementById("task-priority").value = "normal";
  document.getElementById("camp-buit").innerHTML = "";

  //Creant tasca no editant:
  editing = false;

  // Muestra el modal de agregar
  modal.style.display = "flex";
});

// Botón para modificar tarea
modifyBtn.addEventListener("click", () => {
  if (selectedTask) {
    // Rellena el formulario con los datos de la tarea seleccionada
    document.getElementById("task-code").innerHTML = selectedTask.dataset.code || "";
    document.getElementById("task-description").value = selectedTask.dataset.description || "";
    document.getElementById("task-creation-date").innerHTML =
      selectedTask.dataset.creationDate || "";
    document.getElementById("task-due-date").value = selectedTask.dataset.dueDate || "";
    document.getElementById("task-responsible").value =
      selectedTask.dataset.responsible || "";
    document.getElementById("task-priority").value = selectedTask.dataset.priority || "normal";
    document.getElementById("camp-buit").innerHTML = "";

    //Creant tasca no editant:
    editing = true;
    currentTask = selectedTask;

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
    //Dades a mostrar:
    document.getElementById("task-info-code").innerText = selectedTask.dataset.code || "";
    document.getElementById("task-info-description").innerText = selectedTask.dataset.description || "";
    document.getElementById("task-info-creation-date").innerText = selectedTask.dataset.creationDate || "";
    document.getElementById("task-info-due-date").innerText = FixDate(selectedTask.dataset.dueDate) || "";
    document.getElementById("task-info-responsible").innerText = selectedTask.dataset.responsible || "";
    document.getElementById("task-info-priority").innerText = selectedTask.dataset.priority || "";

    infoModal.style.display = "flex";
  }
});

saveTaskBtn.addEventListener("click", () => {
  const code = document.getElementById("task-code").innerHTML;
  const description = document.getElementById("task-description").value;
  const creationDate = document.getElementById("task-creation-date").innerHTML;
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

  if(description == "" || dueDate == "" || responsible ==""){
    //Missatge de camps buits
    document.getElementById("camp-buit").innerHTML = "Completa tots els camps";
    setTimeout(TimeGone, 2800);
  }
  else if(CheckDate(creationDate, dueDate) != true){
    document.getElementById("camp-buit").innerHTML = "La data de finalització es menor a la de creació";
    setTimeout(TimeGone, 2800);
  }
  else{
    //Es guarda el codi en el Local Storage:
    if(editing){
      // Modifica la tarea existente con los nuevos datos
      currentTask.dataset.code = code;
      currentTask.dataset.description = description;
      currentTask.dataset.creationDate = creationDate;
      currentTask.dataset.dueDate = dueDate;
      currentTask.dataset.responsible = responsible;
      currentTask.dataset.priority = priority;
  
      // Actualiza el color de la tarea basado en la prioridad
      updateTaskColor(currentTask, priority);

      updateDesc(currentTask, description);
  
      // Asume que tienes una función updateTaskInLocalStorage
      updateTaskInLocalStorage(updatedTask);

      // Load tasks when the page is loaded
      window.addEventListener("load", loadTasks);
      
    } else {
      // Crea una nueva tarea con los datos ingresados
      const newTask = document.createElement("p");
      newTask.classList.add("task");
      newTask.setAttribute("draggable", "true");
      newTask.dataset.code = code;
      newTask.dataset.description = description;
      newTask.dataset.creationDate = creationDate;
      newTask.dataset.dueDate = dueDate;
      newTask.dataset.responsible = responsible;
      newTask.dataset.priority = priority;
  
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

      updateDesc(newTask, description);

      // Asume que tienes una función saveTaskToLocalStorage
      saveTaskToLocalStorage(updatedTask);
    }
    // Cierra el modal
    modal.style.display = "none";
  }
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
  else if(e.target === infoModal){
    infoModal.style.display = "none";
  }
});

// Evento de clic para cerrar el modal de información
document.querySelector("#info .close").addEventListener("click", () => {
  infoModal.style.display = "none";
});

// Load tasks when the page is loaded
window.addEventListener("load", loadTasks);