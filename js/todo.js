// Clase Task
class Task {
  constructor(description, priority) {
    this.description = description;
    this.priority = priority;
  }

  // Método para crear el elemento de tarea en el DOM
  createDOMElement() {
    const taskElement = document.createElement("p");
    taskElement.classList.add("task");
    taskElement.setAttribute("draggable", "true");
    taskElement.innerText = this.description;

    // Agregar datos attributes
    taskElement.dataset.description = this.description;
    taskElement.dataset.priority = this.priority;

    // Agregar eventos de arrastrar
    taskElement.addEventListener("dragstart", () => {
      taskElement.classList.add("is-dragging");
    });

    taskElement.addEventListener("dragend", () => {
      taskElement.classList.remove("is-dragging");
    });

    // Actualizar color basado en prioridad
    updateTaskColor(taskElement, this.priority);

    return taskElement;
  }
}

// Clase TodoApp
class TodoApp {
  constructor() {
    this.form = document.getElementById("todo-form");
    this.input = document.getElementById("todo-input");
    this.todoLane = document.getElementById("todo-lane");
    this.modifyBtn = document.getElementById("modify-task-btn");
    this.deleteBtn = document.getElementById("delete-task-btn");
    this.addBtn = document.getElementById("add-task-btn");
    this.modal = document.getElementById("modal");
    this.closeModalBtn = document.querySelector(".close");
    this.saveTaskBtn = document.getElementById("save-task-btn");
    this.infoBtn = document.getElementById("info-task-btn");
    this.infoModal = document.getElementById("info");

    // Color original de la tarea seleccionada
    this.selectedTaskColor = "";
    this.selectedTask = null;

    // Cargar tareas al iniciar la aplicación
    window.addEventListener("load", () => this.loadTasks());

    // Evento de submit del formulario
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));

    // Evento al hacer clic en cualquier parte del documento
    document.addEventListener("click", (e) => this.handleDocumentClick(e));

    // Evento al hacer clic en cualquier parte del documento
    document.addEventListener("mouseover", (e) => this.handleMouseOver(e));

    // Evento al hacer clic en cualquier parte del documento
    document.addEventListener("mouseout", (e) => this.handleMouseOut(e));

    // Eventos de botones
    this.addBtn.addEventListener("click", () => this.handleAddTaskClick());
    this.modifyBtn.addEventListener("click", () => this.handleModifyTaskClick());
    this.deleteBtn.addEventListener("click", () => this.handleDeleteTaskClick());
    this.infoBtn.addEventListener("click", () => this.handleInfoTaskClick());

    // Evento de clic para cerrar el modal de agregar/modificar
    this.closeModalBtn.addEventListener("click", () => this.closeModal());

    // Evento de clic fuera del contenido del modal para cerrar el modal
    window.addEventListener("click", (e) => this.handleWindowClick(e));

    // Evento de clic para cerrar el modal de información
    document.querySelector("#info .close").addEventListener("click", () => this.closeInfoModal());
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const value = this.input.value;

    if (!value) return;

    const newTask = new Task(value, "verd");
    const taskElement = newTask.createDOMElement();

    taskElement.addEventListener("click", () => this.handleTaskClick(taskElement));

    this.todoLane.appendChild(taskElement);
    this.input.value = "";
  }

  handleTaskClick(taskElement) {
    if (this.selectedTask) {
      // Restaura el color original de la tarea previamente seleccionada
      this.selectedTask.style.backgroundColor = this.selectedTaskColor;
    }

    // Actualiza la tarea seleccionada y su color original
    this.selectedTask = taskElement;
    this.selectedTaskColor = getComputedStyle(this.selectedTask).backgroundColor;

    // Establece el color de la tarea como azul
    this.selectedTask.style.backgroundColor = "blue";
  }

  handleDocumentClick(event) {
    if (event.target.classList.contains("task")) {
      this.handleTaskClick(event.target);
    } else {
      this.deselectTask();
    }
  }

  handleMouseOver(event) {
    if (event.target.classList.contains("task")) {
      this.handleTaskMouseOver(event.target);
    }
  }

  handleMouseOut(event) {
    if (event.target.classList.contains("task") && this.selectedTask !== event.target) {
      event.target.style.backgroundColor = this.selectedTaskColor;
    }
  }

  deselectTask() {
    if (this.selectedTaskColor !== "" && this.selectedTask !== null) {
      this.selectedTask.style.backgroundColor = this.selectedTaskColor;
      this.selectedTask = null;
      this.selectedTaskColor = "";
    }
  }

  handleAddTaskClick() {
    // Limpia el formulario antes de agregar una nueva tarea
    document.getElementById("task-code").value = "";
    document.getElementById("task-description").value = "";
    document.getElementById("task-creation-date").value = "";
    document.getElementById("task-due-date").value = "";
    document.getElementById("task-responsible").value = "";
    document.getElementById("task-priority").value = "verd";

    // Muestra el modal de agregar
    this.modal.style.display = "flex";
  }

  handleModifyTaskClick() {
    if (this.selectedTask) {
      // Rellena el formulario con los datos de la tarea seleccionada
      document.getElementById("task-code").value = this.selectedTask.dataset.code || "";
      document.getElementById("task-description").value = this.selectedTask.innerText || "";
      document.getElementById("task-creation-date").value =
        this.selectedTask.dataset.creationDate || "";
      document.getElementById("task-due-date").value = this.selectedTask.dataset.dueDate || "";
      document.getElementById("task-responsible").value =
        this.selectedTask.dataset.responsible || "";
      document.getElementById("task-priority").value = this.selectedTask.dataset.priority || "verd";

      // Muestra el modal de modificación
      this.modal.style.display = "flex";
    }
  }

  handleDeleteTaskClick() {
    if (this.selectedTask) {
      const taskId = this.selectedTask.dataset.code;
      // Asumiendo que tienes una función deleteTaskFromLocalStorage
      this.deleteTaskFromLocalStorage(taskId);

      this.selectedTask.remove();
      this.selectedTask = null;
      this.selectedTaskColor = "";
    }
  }

  handleInfoTaskClick() {
    if (this.selectedTask) {
      document.getElementById("task-info-code").innerText = this.selectedTask.dataset.code || "";
      document.getElementById("task-info-description").innerText = this.selectedTask.innerText || "";
      document.getElementById("task-info-creation-date").innerText = this.selectedTask.dataset.creationDate || "";
      document.getElementById("task-info-due-date").innerText = this.selectedTask.dataset.dueDate || "";
      document.getElementById("task-info-responsible").innerText = this.selectedTask.dataset.responsible || "";
      document.getElementById("task-info-priority").innerText = this.selectedTask.dataset.priority || "";

      this.infoModal.style.display = "flex";
    }
  }

  handleWindowClick(event) {
    if (event.target === this.modal) {
      this.closeModal();
    }
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  closeInfoModal() {
    this.infoModal.style.display = "none";
  }

  // Método para cargar tareas desde el almacenamiento local
  loadTasks() {
    const tasks = this.getTasksFromLocalStorage();
    tasks.forEach((task) => {
      const { description, priority } = task;

      // Crear un nuevo elemento de tarea
      const newTask = new Task(description, priority);
      const taskElement = newTask.createDOMElement();

      // Establecer atributos de datos
      Object.keys(task).forEach((key) => {
        taskElement.dataset[key] = task[key];
      });

      // Añadir eventos de arrastrar
      taskElement.addEventListener("dragstart", () => {
        taskElement.classList.add("is-dragging");
      });

      taskElement.addEventListener("dragend", () => {
        taskElement.classList.remove("is-dragging");
      });

      // Agregar la tarea a la "TODO lane"
      this.todoLane.appendChild(taskElement);
    });
  }

  // Otras funciones que pueden requerir implementación
  deleteTaskFromLocalStorage(taskId) {
    // Implementa la lógica para eliminar la tarea del almacenamiento local
  }

  getTasksFromLocalStorage() {
    // Implementa la lógica para obtener las tareas desde el almacenamiento local
    // Devuelve un array de objetos de tarea
    return [];
  }
}

// Instanciar la aplicación
const todoApp = new TodoApp();