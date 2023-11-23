//Aquest fitxer ens permet fer probes.
//De moment compté el codi com a exemple per modificar elements.
//Funcionament:
//Permet crear y borrar elements en el localstorage
//Crea una llista

//Dades que s'han de agafar:
/*
Codi identificador unic.
Descripció.
Data automatica de la creació?
Data prevista per la finalització
Responsable
Prioritat
*/
//-------------------------

//Agafar informació 
const ul = document.querySelector('ul');
const input = document.getElementById('item');


//Agafar informació del Local Storage
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
//Funció que borra pero tot.
function del(){
  localStorage.clear();
  ul.innerHTML = '';
  itemsArray = [];
  //alert(typeof(itemsArray));
}

function delsingle(){
  
}

//Elements cap a futur:
//Si volem borrar, s'hauria de assignar una ID a la tasca.
//Exemple: La ID assignada que correspongui a la mateixa que es mostra.
ul.setAttribute("id", "IDEXEMPLE");
//Utilitzarem un array per desar les dades.
//Per borrar un element individual REF: https://codepen.io/szymongabrek/pen/QMmeyQ


