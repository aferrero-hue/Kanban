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

let isSelected = false;
let correctDate = false;

// Color original de la tarea seleccionada
let selectedTaskColor = "";

let currentTask = null;

//Distingir crear i editar
let editing = false;

// Funció per generar una ID unica.
function generateid() {
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

//Funció per cambiar l'ordre de la data quan es mostra en informació
function FixDate(due){
  let dueY = due.substring(0, 4);
  let dueM = due.substring(5,7);
  let dueD = due.substring(8,10);
  let result = dueD + "-" + dueM + "-" + dueY;
  return result;
}

function ValidateDate(actualD, novaD){
  correctDate = false;
  //Dades data actual
  let datY = actualD.substring(6, 10);
  let datM = actualD.substring(3,5);
  let datD = actualD.substring(0,2);
  //Dades data nova
  let dueY = novaD.substring(0, 4);
  let dueM = novaD.substring(5,7);
  let dueD = novaD.substring(8,10);
  //Comprovació
  if(dueY >= datY){
    if(dueM == datM){
      if(dueD > datD){
        correctDate = true;
      }
    }
    if(dueM > datM){
      correctDate = true;
    }
  }
}

// Función para actualizar el color de la tarea basado en la prioridad
function updateTaskColor(task, priority) {
  task.style.backgroundColor = priority;
}

// Funció per cambiar la info mostrada per pantalla:
function updateDesc(task, desc) {
  task.innerText = desc;
}

//Funcio per fer desapareixer el missatge de camp buit despes
function TimeGone(){
  document.getElementById("camp-buit").innerHTML = "";
  document.getElementById("camp-buit-del").innerHTML = "";
  document.getElementById("camp-buit-afegir").innerHTML = "";
  document.getElementById("camp-buit-mod").innerHTML = "";
  document.getElementById("camp-buit-prio").innerHTML = "";
  document.getElementById("camp-buit-del-res").innerHTML = "";
  document.getElementById("camp-buit-prio-del").innerHTML = "";
  document.getElementById("camp-buit-rem").innerHTML = "";
}

// Evento al hacer clic en cualquier parte del documento
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("task")) {
    isSelected = true;

    // Restaura el color original de la tarea previamente seleccionada
    if (selectedTaskColor !== "" && selectedTask !== null) {
      selectedTask.style.backgroundColor = selectedTaskColor;
    }

    // Actualiza la tarea seleccionada y su color original
    selectedTask = e.target;
    selectedTaskColor = getComputedStyle(selectedTask).backgroundColor;

    // Establece el color de la tarea como azul
    selectedTask.style.backgroundColor = "grey";
  } else {
    isSelected = false;

    // Si se hace clic fuera de una tarea, desselecciona la tarea
    if (selectedTaskColor !== "" && selectedTask !== null) {
      selectedTask.style.backgroundColor = selectedTaskColor;
      selectedTask = null;
      selectedTaskColor = "";
    }
  }
});

document.addEventListener("dragend", (e) => {
  if (e.target.classList.contains("task")) {
    const updatedTask = {
      code: e.target.dataset.code || "",
      description: e.target.dataset.description || "",
      creationDate: e.target.dataset.creationDate || "",
      dueDate: e.target.dataset.dueDate || "",
      responsible: e.target.dataset.responsible || "",
      priority: e.target.dataset.priority || "",
      estado: e.target.parentElement.id || "todo-lane", // Guarda el estado actual de la tarea
    };

    updateTaskInLocalStorage(updatedTask);
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

// Botón para agregar tarea
addBtn.addEventListener("click", () => {
  // Limpiar el formulario antes de agregar una nueva tarea
  document.getElementById("task-code").innerHTML = generateid();
  document.getElementById("task-code").style.display = "none"
  document.getElementById("task-description").value = "";
  document.getElementById("task-creation-date").innerHTML = createstartdate();
  document.getElementById("task-creation-date").style.display = "none";
  document.getElementById("task-due-date").value = "";
  document.getElementById("camp-buit").innerHTML = "";

  // Recuperar los responsables y prioridades del localStorage
  const responsibles = getResponsiblesFromLocalStorage();
  const priorities = getPrioritiesFromLocalStorage();

  // Obtener el campo de responsable y eliminar el valor anterior
  const responsibleField = document.getElementById("task-responsible");
  responsibleField.value = "";

  // Eliminar los elementos anteriores del desplegable de responsables
  responsibleField.innerHTML = "";

  // Crear un nuevo desplegable con los responsables
  responsibles.forEach((responsible) => {
    const option = document.createElement("option");
    option.value = responsible;
    option.innerText = responsible;
    responsibleField.appendChild(option);
  });

  // Obtener el campo de prioridad y eliminar el valor anterior
  const priorityField = document.getElementById("task-priority");
  priorityField.value = "";

  // Eliminar los elementos anteriores del desplegable de prioridades
  priorityField.innerHTML = "";

  // Crear un nuevo desplegable con las prioridades
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.name;
    option.innerText = priority.name;
    priorityField.appendChild(option);
  });

  // Mostrar el modal de agregar
  modal.style.display = "flex";

  // Creando tarea, no editando
  editing = false;
});

// Botón para modificar tarea
modifyBtn.addEventListener("click", () => {
  if (isSelected) {
    // Rellenar el formulario con los datos de la tarea seleccionada
    document.getElementById("task-code").innerHTML = selectedTask.dataset.code || "";
    document.getElementById("task-code").style.display = "none"
    document.getElementById("task-description").value = selectedTask.dataset.description || "";
    document.getElementById("task-creation-date").innerHTML = selectedTask.dataset.creationDate || "";
    document.getElementById("task-creation-date").style.display = "none"
    document.getElementById("task-due-date").value = selectedTask.dataset.dueDate || "";
    document.getElementById("task-responsible").value = selectedTask.dataset.responsible || "";
    document.getElementById("camp-buit").innerHTML = "";

    // Rellenar opciones del desplegable de responsables
    const responsibleField = document.getElementById("task-responsible");
    responsibleField.innerHTML = "";
    const responsibles = getResponsiblesFromLocalStorage();
    responsibles.forEach((responsible) => {
      const option = document.createElement("option");
      option.value = responsible;
      option.innerText = responsible;
      responsibleField.appendChild(option);
    });

    // Rellenar opciones del desplegable de prioridades
    const priorityField = document.getElementById("task-priority");
    priorityField.innerHTML = "";
    const priorities = getPrioritiesFromLocalStorage();
    priorities.forEach((priority) => {
      const option = document.createElement("option");
      option.value = priority.name;
      option.innerText = priority.name;
      priorityField.appendChild(option);
    });

    document.getElementById("task-priority").value = selectedTask.dataset.priority || "";

    // Creando tarea, editando
    editing = true;
    currentTask = selectedTask;

    // Mostrar el modal de modificación
    modal.style.display = "flex";
  }
});


deleteBtn.addEventListener("click", () => {
  if (isSelected) {
    const taskId = selectedTask.dataset.code;
    // Asumiendo que tienes una función deleteTaskFromLocalStorage
    deleteTaskFromLocalStorage(taskId);

    selectedTask.remove();
    selectedTask = null;
    selectedTaskColor = "";
  }
});

infoBtn.addEventListener("click", () => {
  if (isSelected) {
    document.getElementById("task-info-code").innerText = selectedTask.dataset.code || "";
    document.getElementById("task-info-description").innerText = selectedTask.dataset.description || "";
    document.getElementById("task-info-creation-date").innerText = selectedTask.dataset.creationDate || "";
    document.getElementById("task-info-due-date").innerText =  FixDate(selectedTask.dataset.dueDate) || "";
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

  // Establecer el estado predeterminado como "todo-lane"
  const estado = "todo-lane";

  const updatedTask = {
    code,
    description,
    creationDate,
    dueDate,
    responsible,
    priority,
    estado, // Agregar el estado al objeto de tarea
  };
  if(description.match(/^ *$/) || dueDate == ""){
    document.getElementById("camp-buit").innerHTML = "Completa tots els camps";
    setTimeout(TimeGone, 2800);
  }
  else {
    ValidateDate(creationDate, dueDate);
    if(correctDate){
      if (editing) {
        // Modifica la tarea existente con los nuevos datos
        currentTask.dataset.code = code;
        currentTask.dataset.description = description;
        currentTask.dataset.creationDate = creationDate;
        currentTask.dataset.dueDate = dueDate;
        currentTask.dataset.responsible = responsible;
        currentTask.dataset.priority = priority;
        currentTask.dataset.estado = estado; // Actualizar el estado
        const priorities = getPrioritiesFromLocalStorage();
        priorities.forEach((prior) => {
          if(prior.name == priority){
                // Actualizar el color de la tarea basado en la prioridad
                updateTaskColor(currentTask, prior.color);
          }
        });
        updateDesc(currentTask, description);
        updateTaskInLocalStorage(updatedTask);
          // Cierra el modal
          modal.style.display = "none";
  
      } else {
        // Crear una nueva tarea con los datos ingresados
        const newTask = document.createElement("p");
        newTask.classList.add("task");
        newTask.setAttribute("draggable", "true");
        newTask.dataset.code = code;
        newTask.dataset.description = description;
        newTask.dataset.creationDate = creationDate;
        newTask.dataset.dueDate = dueDate;
        newTask.dataset.responsible = responsible;
        newTask.dataset.priority = priority;
        newTask.dataset.estado = estado; // Establecer el estado
        newTask.innerText = description;
  
        newTask.addEventListener("dragstart", () => {
          newTask.classList.add("is-dragging");
        });
  
        newTask.addEventListener("dragend", () => {
          newTask.classList.remove("is-dragging");
        });
  
        // Añade la nueva tarea a la "TODO lane"
        todoLane.appendChild(newTask);
  
        const priorities = getPrioritiesFromLocalStorage();
        priorities.forEach((prior) => {
          if(prior.name == priority){
                // Actualizar el color de la tarea basado en la prioridad
                updateTaskColor(newTask, prior.color);
          }
        });
  
        updateDesc(newTask, description);
  
        // Asume que tienes una función saveTaskToLocalStorage
        saveTaskToLocalStorage(updatedTask);
        
        // Cierra el modal
        modal.style.display = "none";
      }
    }else{
      document.getElementById("camp-buit").innerHTML = "La data introduida no es correcte";
      setTimeout(TimeGone, 4000);
    }
  }
});


function loadTasks() {
  const tasks = getTasksFromLocalStorage();

  // Obtener referencias a las columnas
  const todoLane = document.getElementById("todo-lane");
  const doingLane = document.getElementById("doing-lane");
  const doneLane = document.getElementById("done-lane");

  // Limpiar las columnas antes de agregar tareas
  todoLane.innerHTML = "";
  doingLane.innerHTML = "";
  doneLane.innerHTML = "";

  // Crear y agregar títulos a las columnas si no existen
  if (!todoLane.querySelector("h3")) {
    const todoTitle = document.createElement("h3");
    todoTitle.classList.add("heading");
    todoTitle.innerText = "TODO";
    todoLane.appendChild(todoTitle);
  }

  if (!doingLane.querySelector("h3")) {
    const doingTitle = document.createElement("h3");
    doingTitle.classList.add("heading");
    doingTitle.innerText = "Doing";
    doingLane.appendChild(doingTitle);
  }

  if (!doneLane.querySelector("h3")) {
    const doneTitle = document.createElement("h3");
    doneTitle.classList.add("heading");
    doneTitle.innerText = "Done";
    doneLane.appendChild(doneTitle);
  }

  tasks.forEach((task) => {
    const { description, priority, estado } = task;

    // Crear un nuevo elemento de tarea
    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = description;

    // Configurar atributos de datos
    Object.keys(task).forEach((key) => {
      newTask.dataset[key] = task[key];
    });

    const priorities = getPrioritiesFromLocalStorage();
    priorities.forEach((prior) => {
      if(prior.name == priority){
            // Actualizar el color de la tarea basado en la prioridad
            updateTaskColor(newTask, prior.color);
      }
    });


    // Agregar eventos de arrastrar y soltar
    newTask.addEventListener("dragstart", () => {
      newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
      newTask.classList.remove("is-dragging");
    });

    // Agregar la tarea a la columna correspondiente
    const targetLane = document.getElementById(estado);
    targetLane.appendChild(newTask);
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
  else if(e.target === themeModal){
    themeModal.style.display = "none";
  }
  else if(e.target === responsibleModal){
    responsibleModal.style.display = "none";
  }
  else if(e.target === prioritiesModal){
    prioritiesModal.style.display = "none";
  }

});

// Evento de clic para cerrar el modal de información
document.querySelector("#info .close").addEventListener("click", () => {
  infoModal.style.display = "none";
});

// Load tasks when the page is loaded
window.addEventListener("load", loadTasks);
//-------------------------------------------------------------------------------------------
// Código JavaScript para gestionar responsables
const manageResponsibleBtn = document.getElementById("manage-responsible-btn");
const responsibleModal = document.getElementById("responsible-modal");
const addResponsibleBtn = document.getElementById("add-responsible-btn");
const newResponsibleInput = document.getElementById("new-responsible");
const removeResponsibleDropdown = document.getElementById("remove-responsible");
const removeResponsibleBtn = document.getElementById("remove-responsible-btn");
const responsiblesList = document.getElementById("responsibles-list");
const responsibleModalDel = document.getElementById("responsible-modal-delete");
const confirmRemoveResponsibleBtn = document.getElementById("confirm-remove-responsible-btn");
const modifiedResponsibleInput = document.getElementById("modified-responsible");
const confirmModifyBtn = document.getElementById("confirm-modify-btn");
const modifyResponsibleLabel = document.getElementById("modified-label");
const delResponsibleLabel = document.getElementById("camp-buit-rem");


// Evento para abrir el modal de responsables
manageResponsibleBtn.addEventListener("click", () => {
  populateResponsiblesList();
  fillRemoveResponsibleDropdown();
  newResponsibleInput.value = "";
  modifiedResponsibleInput.value = "";
  Check4Responsibles();
  responsibleModal.style.display = "flex";
});

// Evento para cerrar el modal de responsables
document.querySelector("#responsible-modal .close").addEventListener("click", () => {
  document.getElementById("del-responsible").value = "";
  responsibleModal.style.display = "none";
});
// Evento para cerrar el modal de responsables (menu error)
document.querySelector("#responsible-modal-delete .close").addEventListener("click", () => {
  document.getElementById("del-responsible").value = "";
  responsibleModalDel.style.display = "none";
});

function Check4Responsibles(){
  if(removeResponsibleDropdown.value.match(/^ *$/)){
    modifiedResponsibleInput.style.display = "none";
    confirmModifyBtn.style.display = "none";
    modifyResponsibleLabel.style.display = "none";
  }else{
    modifiedResponsibleInput.style.display = "block";
    confirmModifyBtn.style.display = "block";
    modifyResponsibleLabel.style.display = "block";
  }
}

// Evento para agregar responsable
addResponsibleBtn.addEventListener("click", () => {
  let validateRes = true;
  const newResponsible = newResponsibleInput.value.trim();
  if (newResponsible != "") {
    //Validació LS
    const responsibles = getResponsiblesFromLocalStorage();
    responsibles.forEach((res) => {
      if(res == newResponsible){
        validateRes = false;
      }
    });
    if(validateRes){
      addResponsibleToLocalStorage(newResponsible); // Guardar en localStorage
      populateResponsiblesList();
      fillRemoveResponsibleDropdown();
      newResponsibleInput.value = "";
      document.getElementById("camp-buit-afegir").innerHTML = "S'ha afegit el nou responsable";
      setTimeout(TimeGone, 2800);
    }else{
      document.getElementById("camp-buit-afegir").innerHTML = "El nom introduit ja existeix";
      setTimeout(TimeGone, 2800);
    }
  } else{
      document.getElementById("camp-buit-afegir").innerHTML = "Completa el camp amb el nom del responsable";
      setTimeout(TimeGone, 2800);
  }
  Check4Responsibles();

});

// Evento para eliminar responsable
removeResponsibleBtn.addEventListener("click", () => {
  if(!document.getElementById("remove-responsible").value.match(/^ *$/)){
    //Validació
    let foundResponsible = false;
    const allTasks = getTasksFromLocalStorage();
    allTasks.forEach((task) => {
      if(task.responsible == removeResponsibleDropdown.value){
        foundResponsible = true;
      }
    });
    if(!foundResponsible){
      document.getElementById("del-responsible").value = "";
      responsibleModalDel.style.display = "flex";
    }else{
      delResponsibleLabel.innerHTML = "No es pot eliminar aquest responsable degut a que una tasca està utilitzant aquest responsable.";
      setTimeout(TimeGone, 2800);
    }
  }
  Check4Responsibles(); 
});

confirmRemoveResponsibleBtn.addEventListener("click", () => {
  const selectedResponsible = removeResponsibleDropdown.value;
  const responsibleName = document.getElementById("del-responsible").value;
  if(selectedResponsible == responsibleName){
    removeResponsibleFromLocalStorage(selectedResponsible);
    populateResponsiblesList();
    fillRemoveResponsibleDropdown();
    document.getElementById("del-responsible").value = "";
    responsibleModalDel.style.display = "none";
  }else{
    document.getElementById("camp-buit-del").innerHTML = "El nom introduit no es correcte";
    setTimeout(TimeGone, 2800);
  }
  Check4Responsibles();
});

// Función para poblar la lista de responsables
function populateResponsiblesList() {
  removeResponsibleDropdown.innerHTML = "";
  const responsibles = getResponsiblesFromLocalStorage();
  responsibles.forEach((responsible) => {
    const option = document.createElement("option");
    option.value = responsible;
    option.innerText = responsible;
    removeResponsibleDropdown.appendChild(option);
  });
}

// Función para llenar el menú desplegable de eliminación con los responsables actuales
function fillRemoveResponsibleDropdown() {
  removeResponsibleDropdown.innerHTML = "";
  const responsibles = getResponsiblesFromLocalStorage();
  responsibles.forEach((responsible) => {
    const option = document.createElement("option");
    option.value = responsible;
    option.innerText = responsible;
    removeResponsibleDropdown.appendChild(option);
  });
}

confirmModifyBtn.addEventListener("click", () => {
  const selectedResponsible = removeResponsibleDropdown.value;
  const newResponsibleName = modifiedResponsibleInput.value.trim();
  let comptador = 0;
  if (newResponsibleName !== "") {
    //Validació LS
    const responsibles = getResponsiblesFromLocalStorage();
     responsibles.forEach((res) => {
      if(res == newResponsibleName){
        comptador++;
      }
    });
    if(comptador < 1){
      modifyResponsibleInLocalStorage(selectedResponsible, newResponsibleName);
      populateResponsiblesList();
      fillRemoveResponsibleDropdown();
      modifiedResponsibleInput.value = "";
      document.getElementById("camp-buit-mod").innerHTML = "S'ha modificat el nom del responsable";
      setTimeout(TimeGone, 2800);
    }
  }
});

// Función para modificar un responsable en el localStorage
function modifyResponsibleInLocalStorage(oldName, newName) {
  const responsibles = getResponsiblesFromLocalStorage();
  const updatedResponsibles = responsibles.map(responsible => {
    if (responsible === oldName) {
      return newName;
    }
    return responsible;
  });
  saveResponsiblesToLocalStorage(updatedResponsibles);
}

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

const themeBtn = document.getElementById("theme-btn");
const themeModal = document.getElementById("themeModal");
const closeThemeModalBtn = document.querySelector("#themeModal .close");
const saveThemeBtn = document.getElementById("save-theme-btn");

// Evento para abrir el modal de cambio de tema
themeBtn.addEventListener("click", () => {
  themeModal.style.display = "flex";

  // Agrega la clase clicked para activar la animación
  themeBtn.classList.add("clicked");

  // Después de un tiempo, quita la clase clicked para reiniciar la animación
  setTimeout(() => {
    themeBtn.classList.remove("clicked");
  }, 300);
});

// Evento para cerrar el modal de cambio de tema
closeThemeModalBtn.addEventListener("click", () => {
  themeModal.style.display = "none";
});

// Evento para guardar el tema seleccionado en el localStorage
saveThemeBtn.addEventListener("click", () => {
  const themeSelect = document.getElementById("theme-select");
  const selectedTheme = themeSelect.value;
  localStorage.setItem("selectedTheme", selectedTheme);

  // Aplica el tema seleccionado al cuerpo del documento y a los elementos específicos
  //document.body.style.backgroundImage = `url(images/${selectedTheme}.jpg)`;
  document.querySelector('.board').style.backgroundImage = `url(images/${selectedTheme}.jpg)`;
  document.querySelector('.menu').style.backgroundImage = `url(images/${selectedTheme}.jpg)`;

  // Cierra el modal
  themeModal.style.display = "none";
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const managePrioritiesBtn = document.getElementById("manage-priorities-btn");
const prioritiesModal = document.getElementById("priorities-modal");
const addPriorityBtn = document.getElementById("add-priority-btn");
const priorityNameInput = document.getElementById("priority-name");
const priorityColorInput = document.getElementById("priority-color");
const prioritiesList = document.getElementById("priorities-list");
const removePriorityBtn = document.getElementById("remove-priority-btn");
const removePrioritySel = document.getElementById("remove-priority");
const prioritiesModalDel = document.getElementById("priorities-modal-delete");
const prioriyDelInput = document.getElementById("del-priority");
const removePriorityBtnConfirm = document.getElementById("confirm-remove-priority-btn");
const removePriorityLab = document.getElementById("camp-buit-prio-del");


// Evento para abrir el modal de gestión de prioridades
managePrioritiesBtn.addEventListener("click", () => {
  populatePrioritiesList();
  fillRemovePriorityDropdown(); // Agrega esta línea
  priorityNameInput.value = "";
  prioritiesModal.style.display = "flex";
});

// Evento para cerrar el modal de gestión de prioridades
document.querySelector("#priorities-modal .close").addEventListener("click", () => {
  prioritiesModal.style.display = "none";
});

// Evento para cerrar el modal de gestión de prioridades
document.querySelector("#priorities-modal-delete .close").addEventListener("click", () => {
  prioritiesModalDel.style.display = "none";
});

// Evento para agregar una nueva prioridad
addPriorityBtn.addEventListener("click", () => {
  const priorityName = priorityNameInput.value.trim();
  const priorityColor = priorityColorInput.value.trim();

  if (priorityName !== "" && priorityColor !== "") {
    //Validació LS
    let validatePrior = true;
    const newPriority = priorityNameInput.value.trim();
    const priorities = getPrioritiesFromLocalStorage();
    priorities.forEach((prio) => {
      if(prio.name == newPriority){
        validatePrior = false;
      }
    });
    if(validatePrior){
      addPriorityToLocalStorage({ name: priorityName, color: priorityColor });
      populatePrioritiesList();
      fillRemovePriorityDropdown(); // Agrega esta línea
      priorityNameInput.value = "";
      document.getElementById("camp-buit-prio").innerHTML = "S'ha afegit una nova prioritat";
      setTimeout(TimeGone, 2800);
    }else{
      document.getElementById("camp-buit-prio").innerHTML = "Ja existeix una prioritat amb aquest nom";
      setTimeout(TimeGone, 2800);
    }

  }
});

removePriorityBtn.addEventListener("click", () => {
  if(!document.getElementById("remove-priority").value.match(/^ *$/)){
    //Validació
    let foundPriority = false;
    const priorities = getTasksFromLocalStorage();
    priorities.forEach((task) => {
      if(task.priority == removePrioritySel.value){
        foundPriority = true;
      }
    });
    if(!foundPriority){
      document.getElementById("del-priority").value = "";
      prioritiesModalDel.style.display = "flex";
    }else{
      removePriorityLab.innerHTML = "No es pot eliminar aquesta prioritat degut a que una tasca està utilitzant aquesta prioritat.";
      setTimeout(TimeGone, 2800);
    }
  }
});

//Confirmar eliminar prioritat
removePriorityBtnConfirm.addEventListener("click", () => {
  const selectedPriority = removePrioritySel.value;
  const PriorityName = document.getElementById("del-priority").value;
  if(selectedPriority == PriorityName){
    removePriorityFromLocalStorage(selectedPriority);
    populatePrioritiesList();
    fillRemovePriorityDropdown();
    document.getElementById("del-responsible").value = "";
    prioritiesModalDel.style.display = "none";
  }else{
    document.getElementById("camp-buit-del-res").innerHTML = "El nom introduit no es correcte";
    setTimeout(TimeGone, 2800);
  }
});


// Función para llenar el menú desplegable de eliminación con las prioridades actuales
function fillRemovePriorityDropdown() {
  const removePriorityDropdown = document.getElementById("remove-priority");
  removePriorityDropdown.innerHTML = "";
  const priorities = getPrioritiesFromLocalStorage();
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.name;
    option.innerText = priority.name;
    removePriorityDropdown.appendChild(option);
  });
}

//[PENDENT] borrar
// Función para poblar la lista de prioridades
function populatePrioritiesList() {
  prioritiesList.innerHTML = "";
  const priorities = getPrioritiesFromLocalStorage();
  priorities.forEach((priority) => {
  });
}


// Evento para aplicar el tema guardado al cargar la página
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    //document.body.style.backgroundImage = `url(images/${savedTheme}.jpg)`;
    document.querySelector('.board').style.backgroundImage = `url(images/${savedTheme}.jpg)`;
    document.querySelector('.menu').style.backgroundImage = `url(images/${savedTheme}.jpg)`;    
  }
});
