// localStorage.js

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }  