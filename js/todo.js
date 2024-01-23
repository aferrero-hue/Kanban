// Variables generals:
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

// Variables Responsables:
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

//Variables Prioritats:
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
const removePriorityLbl = document.getElementById("remove-priority-lbl");


// Variables Temas:
const themeBtn = document.getElementById("theme-btn");
const themeModal = document.getElementById("themeModal");
const closeThemeModalBtn = document.querySelector("#themeModal .close");
const saveThemeBtn = document.getElementById("save-theme-btn");

// Altres variables
let isSelected = false;
let correctDate = false;
let lastSelectedTask = "";
let currentTask = null;

// Color original de la tasca seleccionada
let selectedTaskColor = "";

// Distingir crear i editar
let editing = false;
//-----------------------------------------------------------------------------------------
// Funció per generar una ID unica
function generateid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Funció per generar una Data actual en el moment
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

// Funció per cambiar l'ordre de la data quan es mostra en informació
function FixDate(due){
  let dueY = due.substring(0, 4);
  let dueM = due.substring(5,7);
  let dueD = due.substring(8,10);
  let result = dueD + "-" + dueM + "-" + dueY;
  return result;
}

// Validar si la data introduida es major a la de creació
function ValidateDate(actualD, novaD){
  correctDate = false;
  //Dades data actual
  let datY = actualD.substring(6, 10);
  let datM = actualD.substring(3,5);
  let datD = actualD.substring(0,2);
  //Dades data introduida
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

// Funció per actualitzar el color de la tasca basat en la prioritat
function updateTaskColor(task, priority) {
  task.style.backgroundColor = priority;
}

// Funció per cambiar la info mostrada per pantalla
function updateDesc(task, desc) {
  task.innerText = desc;
}

// Funcio per fer desapareixer missatges
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

// Esdeveniment en fer clic a qualsevol part del document
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("task")) {
    isSelected = true;

    // Restaura el color original de la tasca prèviament seleccionada
    if (selectedTaskColor !== "" && selectedTask !== null) {
      selectedTask.style.backgroundColor = selectedTaskColor;
    }
    // Actualitza la tasca seleccionada i el color original
    selectedTask = e.target;
    if(selectedTask.innerHTML == lastSelectedTask.innerHTML){
      isSelected = false;
      lastSelectedTask = "";
    }else{
      selectedTaskColor = getComputedStyle(selectedTask).backgroundColor;
      selectedTask.style.backgroundColor = "grey";
      lastSelectedTask = e.target;
    }
  } else {
    isSelected = false;
    lastSelectedTask = "";

    // Si feu clic fora d'una tasca
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
      estado: e.target.parentElement.id || "todo-lane", // Deseu l'estat actual de la tasca
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

// Botó per afegir tasca
addBtn.addEventListener("click", () => {
// Netejar el formulari abans d'afegir una tasca nova
  document.getElementById("task-code").innerHTML = generateid();
  document.getElementById("task-code").style.display = "none"
  document.getElementById("task-description").value = "";
  document.getElementById("task-creation-date").innerHTML = createstartdate();
  document.getElementById("task-creation-date").style.display = "none";
  document.getElementById("task-due-date").value = "";
  document.getElementById("camp-buit").innerHTML = "";

  // Recuperar els responsables i prioritats del localStorage
  const responsibles = getResponsiblesFromLocalStorage();
  const priorities = getPrioritiesFromLocalStorage();

  // Obtenir el camp de responsable i eliminar el valor anterior
  const responsibleField = document.getElementById("task-responsible");
  responsibleField.value = "";

  // Eliminar els elements anteriors del desplegable de responsables
  responsibleField.innerHTML = "";

  // Crear un nou desplegable amb els responsables
  responsibles.forEach((responsible) => {
    const option = document.createElement("option");
    option.value = responsible;
    option.innerText = responsible;
    responsibleField.appendChild(option);
  });

  // Obtenir el camp de prioritat i eliminar el valor anterior
  const priorityField = document.getElementById("task-priority");
  priorityField.value = "";

  // Eliminar els elements anteriors del desplegable de prioritats
  priorityField.innerHTML = "";

  // Crear un nou desplegable amb les prioritats
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.name;
    option.innerText = priority.name;
    priorityField.appendChild(option);
  });

  // Mostrar el modal d'afegir
  modal.style.display = "flex";

  // Creant tasca, no editant
  editing = false;
});

// Botó per modificar tasca
modifyBtn.addEventListener("click", () => {
  if (isSelected) {
    // Emplenar el formulari amb les dades de la tasca seleccionada
    document.getElementById("task-code").innerHTML = selectedTask.dataset.code || "";
    document.getElementById("task-code").style.display = "none"
    document.getElementById("task-description").value = selectedTask.dataset.description || "";
    document.getElementById("task-creation-date").innerHTML = selectedTask.dataset.creationDate || "";
    document.getElementById("task-creation-date").style.display = "none"
    document.getElementById("task-due-date").value = selectedTask.dataset.dueDate || "";
    document.getElementById("task-responsible").value = selectedTask.dataset.responsible || "";
    document.getElementById("camp-buit").innerHTML = "";

    // Emplenar opcions del desplegable de responsables
    const responsibleField = document.getElementById("task-responsible");
    responsibleField.innerHTML = "";
    const responsibles = getResponsiblesFromLocalStorage();
    responsibles.forEach((responsible) => {
      const option = document.createElement("option");
      option.value = responsible;
      option.innerText = responsible;
      responsibleField.appendChild(option);
    });

    // Emplenar opcions del desplegable de prioritats
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

    // Creant tasca, editant
    editing = true;
    currentTask = selectedTask;

    // Mostrar el modal de modificació
    modal.style.display = "flex";
  }
});

// Botó per eliminar tasca
deleteBtn.addEventListener("click", () => {
  if (isSelected) {
    const taskId = selectedTask.dataset.code;
    // Assumint que tens una funció delete Task From Local Storage
    deleteTaskFromLocalStorage(taskId);

    selectedTask.remove();
    selectedTask = null;
    selectedTaskColor = "";
  }
});

// Botó per mostrar la informació de la tasca seleccionada
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

// Botó per guardar les dades d'una tasca
saveTaskBtn.addEventListener("click", () => {
  const code = document.getElementById("task-code").innerHTML;
  const description = document.getElementById("task-description").value;
  const creationDate = document.getElementById("task-creation-date").innerHTML;
  const dueDate = document.getElementById("task-due-date").value;
  const responsible = document.getElementById("task-responsible").value;
  const priority = document.getElementById("task-priority").value;

  // Establir l'estat predeterminat com a "tot-lane"
  const estado = "todo-lane";

  const updatedTask = {
    code,
    description,
    creationDate,
    dueDate,
    responsible,
    priority,
    estado, 
  };
  if(description.match(/^ *$/) || dueDate == ""){
    document.getElementById("camp-buit").innerHTML = "Completa tots els camps";
    setTimeout(TimeGone, 2800);
  }
  else {
    //Valida les dates introduides
    ValidateDate(creationDate, dueDate);
    if(correctDate){
      if (editing) {  //Si està modificant la Tasca
        // Modifica la tasca existent amb les noves dades
        currentTask.dataset.code = code;
        currentTask.dataset.description = description;
        currentTask.dataset.creationDate = creationDate;
        currentTask.dataset.dueDate = dueDate;
        currentTask.dataset.responsible = responsible;
        currentTask.dataset.priority = priority;
        currentTask.dataset.estado = estado;
        const priorities = getPrioritiesFromLocalStorage();
        priorities.forEach((prior) => {
          if(prior.name == priority){
            // Actualitzar el color de la tasca basat en la prioritat
            updateTaskColor(currentTask, prior.color);
          }
        });
        updateDesc(currentTask, description);
        updateTaskInLocalStorage(updatedTask);
          // Tanca el modal
          modal.style.display = "none";
  
      } else { //Si està creant la tasca
        // Crear una nova tasca amb les dades ingressades
        const newTask = document.createElement("p");
        newTask.classList.add("task");
        newTask.setAttribute("draggable", "true");
        newTask.dataset.code = code;
        newTask.dataset.description = description;
        newTask.dataset.creationDate = creationDate;
        newTask.dataset.dueDate = dueDate;
        newTask.dataset.responsible = responsible;
        newTask.dataset.priority = priority;
        newTask.dataset.estado = estado;
        newTask.innerText = description;
  
        newTask.addEventListener("dragstart", () => {
          newTask.classList.add("is-dragging");
        });
  
        newTask.addEventListener("dragend", () => {
          newTask.classList.remove("is-dragging");
        });
  
        // Afegeix la nova tasca a la "TODO lane"
        todoLane.appendChild(newTask);
  
        const priorities = getPrioritiesFromLocalStorage();
        priorities.forEach((prior) => {
          if(prior.name == priority){
            // Actualitzar el color de la tasca basat en la prioritat
            updateTaskColor(newTask, prior.color);
          }
        });
  
        updateDesc(newTask, description);
  
        // Assumeix que tenen una funció save Task LocalStorage
        saveTaskToLocalStorage(updatedTask);
        
        // Tanca el modal
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

  // Obtenir referències a les columnes
  const todoLane = document.getElementById("todo-lane");
  const doingLane = document.getElementById("doing-lane");
  const doneLane = document.getElementById("done-lane");

  // Netejar les columnes abans d'afegir tasques
  todoLane.innerHTML = "";
  doingLane.innerHTML = "";
  doneLane.innerHTML = "";

  // Crear i afegir títols a les columnes si no existeixen
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

    // Crear un nou element de tasca
    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = description;

    // Configurar atributs de dades
    Object.keys(task).forEach((key) => {
      newTask.dataset[key] = task[key];
    });

    const priorities = getPrioritiesFromLocalStorage();
    priorities.forEach((prior) => {
      if(prior.name == priority){
        // Actualizar el color de la tasca
        updateTaskColor(newTask, prior.color);
      }
    });

    // Afegir esdeveniments d'arrossegar i deixar anar
    newTask.addEventListener("dragstart", () => {
      newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
      newTask.classList.remove("is-dragging");
    });

    // Afegeix la tasca a la columna corresponent
    const targetLane = document.getElementById(estado);
    targetLane.appendChild(newTask);
  });
}

// Evento de clic para cerrar el modal de agregar/modificar
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Esdeveniment de clic per tancar el modal d'afegir/modificar
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

// Esdeveniment de clic per tancar el modal d'informació
document.querySelector("#info .close").addEventListener("click", () => {
  infoModal.style.display = "none";
});

// Load tasks when the page is loaded
window.addEventListener("load", loadTasks);
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// Esdeveniment per obrir el modal de responsables
manageResponsibleBtn.addEventListener("click", () => {
  populateResponsiblesList();
  fillRemoveResponsibleDropdown();
  newResponsibleInput.value = "";
  modifiedResponsibleInput.value = "";
  Check4Responsibles();
  responsibleModal.style.display = "flex";
});

// Esdeveniment per tancar el modal de responsables
document.querySelector("#responsible-modal .close").addEventListener("click", () => {
  document.getElementById("del-responsible").value = "";
  responsibleModal.style.display = "none";
});
// Esdeveniment per tancar el modal de responsables (confirmar)
document.querySelector("#responsible-modal-delete .close").addEventListener("click", () => {
  document.getElementById("del-responsible").value = "";
  responsibleModalDel.style.display = "none";
});

// Comprovació si hi han responsables
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

// Esdeveniment per afegir responsable
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

// Esdeveniment per eliminar responsable
removeResponsibleBtn.addEventListener("click", () => {
  if(!document.getElementById("remove-responsible").value.match(/^ *$/)){
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

// Esdeveniment per eliminar responsable (Confirmar borrat)
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

// Funció per poblar la llista de responsables
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

// Funció per omplir el menú desplegable d'eliminació amb els actuals responsables
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

// Funció per modificar un responsable al localStorage
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
// Esdeveniment per obrir el modal de canvi de tema
themeBtn.addEventListener("click", () => {
  themeModal.style.display = "flex";

  // Afegeix la classe clicked per activar l'animació
  themeBtn.classList.add("clicked");

  // Després d'un temps, treu la classe clicked per reiniciar l'animació
  setTimeout(() => {
    themeBtn.classList.remove("clicked");
  }, 300);
});

// Esdeveniment per tancar el modal de canvi de tema
closeThemeModalBtn.addEventListener("click", () => {
  themeModal.style.display = "none";
});

// Esdeveniment per desar el tema seleccionat al localStorage
saveThemeBtn.addEventListener("click", () => {
  const themeSelect = document.getElementById("theme-select");
  const selectedTheme = themeSelect.value;
  localStorage.setItem("selectedTheme", selectedTheme);

  // Aplica el tema seleccionat al cos del document i als elements específics  document.querySelector('.board').style.backgroundImage = `url(images/${selectedTheme}.jpg)`;
  document.querySelector('.menu').style.backgroundImage = `url(images/${selectedTheme}.jpg)`;
  document.querySelector('.board').style.backgroundImage = `url(images/${selectedTheme}.jpg)`;

  // Tanca el modal
  themeModal.style.display = "none";
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// Esdeveniment per obrir el modal de gestió de prioritats
managePrioritiesBtn.addEventListener("click", () => {
  populatePrioritiesList();
  fillRemovePriorityDropdown(); // Agrega esta línea
  priorityNameInput.value = "";
  Check4Priorities();
  prioritiesModal.style.display = "flex";
});

// Esdeveniment per tancar el modal de gestió de prioritats
document.querySelector("#priorities-modal .close").addEventListener("click", () => {
  prioritiesModal.style.display = "none";
});

// Esdeveniment per tancar el modal de gestió de prioritats (confirmar)
document.querySelector("#priorities-modal-delete .close").addEventListener("click", () => {
  prioritiesModalDel.style.display = "none";
});

// Esdeveniment per afegir una nova prioritat
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
      fillRemovePriorityDropdown();
      priorityNameInput.value = "";
      document.getElementById("camp-buit-prio").innerHTML = "S'ha afegit una nova prioritat";
      setTimeout(TimeGone, 2800);
    }else{
      document.getElementById("camp-buit-prio").innerHTML = "Ja existeix una prioritat amb aquest nom";
      setTimeout(TimeGone, 2800);
    }
    Check4Priorities();
  }
});

removePriorityBtn.addEventListener("click", () => {
  if(!removePrioritySel.value.match(/^ *$/)){
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
  Check4Priorities();
});

// Funció per omplir el menú desplegable d'eliminació amb les prioritats actuals
function fillRemovePriorityDropdown() {
  removePrioritySel.innerHTML = "";
  const priorities = getPrioritiesFromLocalStorage();
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.name;
    option.innerText = priority.name;
    removePrioritySel.appendChild(option);
  });
}

function Check4Priorities(){
  if(removePrioritySel.value.match(/^ *$/)){
    removePrioritySel.style.display = "none";
    removePriorityLbl.style.display = "none";
    removePriorityBtn.style.display = "none";
  }else{
    removePrioritySel.style.display = "block";
    removePriorityLbl.style.display = "block";
    removePriorityBtn.style.display = "block";
  }
}

// Esdeveniment per aplicar el tema desat en carregar la pàgina
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    document.querySelector('.board').style.backgroundImage = `url(images/${savedTheme}.jpg)`;
    document.querySelector('.menu').style.backgroundImage = `url(images/${savedTheme}.jpg)`;    
  }
});

// Función para poblar la lista de prioridades
function populatePrioritiesList() {
  prioritiesList.innerHTML = "";
  const priorities = getPrioritiesFromLocalStorage();
  priorities.forEach((priority) => {
  });
}