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
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

//Exemple 2: