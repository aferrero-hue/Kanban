// localStorage.js

// Funció per guardar tascas al localStorage
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
  const updatedTasks = tasks.filter(task => task.code !== taskId); // Utilitza "code" en lloc de "id" si és la propietat correcta
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

// Funció per guardar responsables al localStorage
function saveResponsiblesToLocalStorage(responsibles) {
  localStorage.setItem('responsibles', JSON.stringify(responsibles));
}

// Función para obtener responsables desde el localStorage
function getResponsiblesFromLocalStorage() {
  return JSON.parse(localStorage.getItem('responsibles')) || [];
}

// Funció per afegir un responsable al localStorage
function addResponsibleToLocalStorage(responsible) {
  const responsibles = getResponsiblesFromLocalStorage();
  responsibles.push(responsible);
  saveResponsiblesToLocalStorage(responsibles);
}

// Funció per eliminar un responsable del localStorage
function removeResponsibleFromLocalStorage(responsibleToRemove) {
  const responsibles = getResponsiblesFromLocalStorage();
  const updatedResponsibles = responsibles.filter(responsible => responsible !== responsibleToRemove);
  saveResponsiblesToLocalStorage(updatedResponsibles);
}

// Funcions per obtenir i guardar prioritats al localStorage
function getPrioritiesFromLocalStorage() {
  const priorities = JSON.parse(localStorage.getItem("priorities")) || [];
  return priorities;
}

function savePrioritiesToLocalStorage(priorities) {
  localStorage.setItem("priorities", JSON.stringify(priorities));
}

// Afegeix una nova prioritat al localStorage
function addPriorityToLocalStorage(priority) {
  const priorities = getPrioritiesFromLocalStorage();
  priorities.push(priority);
  savePrioritiesToLocalStorage(priorities);
}

// Elimina una prioritat del localStorage
function removePriorityFromLocalStorage(priorityName) {
  const priorities = getPrioritiesFromLocalStorage();
  const updatedPriorities = priorities.filter(priority => priority.name !== priorityName);
  savePrioritiesToLocalStorage(updatedPriorities);
}
