// localStorage.js

function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}
 

function deleteTaskFromLocalStorage(taskId) {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.filter(task => task.code !== taskId); // Utiliza "code" en lugar de "id" si es la propiedad correcta
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function updateTaskInLocalStorage(updatedTask) {
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.map(task => {
    if (task.code === updatedTask.code) {
      return updatedTask;
    }
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// localstorage.js

// Función para guardar responsables en el localStorage
function saveResponsiblesToLocalStorage(responsibles) {
  localStorage.setItem('responsibles', JSON.stringify(responsibles));
}

// Función para obtener responsables desde el localStorage
function getResponsiblesFromLocalStorage() {
  return JSON.parse(localStorage.getItem('responsibles')) || [];
}

// Función para agregar un responsable al localStorage
function addResponsibleToLocalStorage(responsible) {
  const responsibles = getResponsiblesFromLocalStorage();
  responsibles.push(responsible);
  saveResponsiblesToLocalStorage(responsibles);
}

// Función para eliminar un responsable del localStorage
function removeResponsibleFromLocalStorage(responsibleToRemove) {
  const responsibles = getResponsiblesFromLocalStorage();
  const updatedResponsibles = responsibles.filter(responsible => responsible !== responsibleToRemove);
  saveResponsiblesToLocalStorage(updatedResponsibles);
}

// localstorage.js

// Funciones para obtener y guardar prioridades en el localStorage
function getPrioritiesFromLocalStorage() {
  const priorities = JSON.parse(localStorage.getItem("priorities")) || [];
  return priorities;
}

function savePrioritiesToLocalStorage(priorities) {
  localStorage.setItem("priorities", JSON.stringify(priorities));
}

// Añade una nueva prioridad al localStorage
function addPriorityToLocalStorage(priority) {
  const priorities = getPrioritiesFromLocalStorage();
  priorities.push(priority);
  savePrioritiesToLocalStorage(priorities);
}

// Elimina una prioridad del localStorage
function removePriorityFromLocalStorage(priorityName) {
  const priorities = getPrioritiesFromLocalStorage();
  const updatedPriorities = priorities.filter(priority => priority.name !== priorityName);
  savePrioritiesToLocalStorage(updatedPriorities);
}
