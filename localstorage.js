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
