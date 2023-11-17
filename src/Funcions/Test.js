//Aquest fitxer ens permet fer probes.
//De moment compté el codi com a exemple per modificar elements.
//Funcionament:
//Permet crear y borrar elements en el localstorage
//Crea una llista

const ul = document.querySelector('ul');
const input = document.getElementById('item');
let itemsArray = localStorage.getItem('items') ?
JSON.parse(localStorage.getItem('items')) : [];

itemsArray.forEach(addTask);
function addTask(text){
  const li = document.createElement('li')
  li.textContent = text;
  ul.appendChild(li);
}

function add(){
  itemsArray.push(input.value);
  localStorage.setItem('items', JSON.stringify(itemsArray));
  addTask(input.value);
  input.value = '';
}
function del(){
  localStorage.clear();
  ul.innerHTML = '';
  itemsArray = [];
}

//Les seguents probes permeten arrastrar elements en DIV's

function dropHandler(ev) {
    console.log("Fichero(s) arrastrados");
  
    // Evitar el comportamiendo por defecto (Evitar que el fichero se abra/ejecute)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // Si los elementos arrastrados no son ficheros, rechazarlos
        if (ev.dataTransfer.items[i].kind === "file") {
          var file = ev.dataTransfer.items[i].getAsFile();
          console.log("... file[" + i + "].name = " + file.name);
        }
      }
    } else {
      // Usar la interfaz DataTransfer para acceder a el/los archivos
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log(
          "... file[" + i + "].name = " + ev.dataTransfer.files[i].name,
        );
      }
    }
  
    // Pasar el evento a removeDragData para limpiar
    removeDragData(ev);
  }