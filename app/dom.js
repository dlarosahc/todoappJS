//Expresion regular para que el usuario no cree una tarea con espacios en blanco
const INPUT_REGEX = /^[\S ]+[\S]$/;
//Variables del HTML
const form = document.querySelector('#formulario');
const inputTask = document.querySelector('#new-task');
const formBtn = document.querySelector('#add-task');
const list = document.querySelector('#milista');
const total = document.querySelector('#total-count');
const completed = document.querySelector('#completed-count');
const incompleted = document.querySelector('#incompleted-count')



//Validacion
let inputValidation = false;

//Array para las tareas
let tasks = [];


//Funcion
const validation = (input, validation) => {
    if (validation){
        formBtn.disabled = false;
    } else {
        formBtn.disabled = true;
    }
}

const renderCounters = () =>{
const totalTask = tasks.length;
total.innerHTML =`${totalTask}`;

const completedTask = document.querySelectorAll('.done-task').length;
completed.innerHTML = `${completedTask}`;

const incompletedTask =  totalTask - completedTask;
incompleted.innerHTML = `${incompletedTask}`;

} 

const renderTasks = () => {
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('tareas');
        li.id = task.id;
        li.innerHTML = `
        <button class="delete" type="reset"><i class="fa-solid fa-trash-can"></i></button>
        <p>${task.task}</p>
        <button class="check"><i class="fa-regular fa-circle"></i></button>
        `;
        li.children[1].classList.add('text-task');
        
        if (task.checked){
            li.classList.add('done-task');
            li.children[2].innerHTML = `<i class="fa-regular fa-circle-check"></i>`;
            }   
        list.append(li)
    });
    renderCounters();
    
}

inputTask.addEventListener('input', e => {
    inputValidation = INPUT_REGEX.test(inputTask.value);
    validation(inputTask, inputValidation);
});

form.addEventListener('submit', e =>{
    e.preventDefault();
    //Validar si las variables son verdaderas
    if (!inputValidation) return;
    const newTask = {
        id: crypto.randomUUID(),
        task: inputTask.value,
        checked: false,
    }

//Agregar Tarea al Array 
tasks = tasks.concat(newTask);

// Guardar en el navegador
localStorage.setItem('tasks', JSON.stringify(tasks));
renderCounters();
renderTasks();
form.reset();
inputValidation = false;
formBtn.disabled = true;


});


list.addEventListener('click', e => {
    const deleteBtn = e.target.closest('.delete');
    const checkBtn = e.target.closest('.check');

//Eliminar
if (deleteBtn) {
const id = deleteBtn.parentElement.id;
tasks = tasks.filter(task => {
if (task.id !== id) {
return task;
}
});
localStorage.setItem('tasks', JSON.stringify(tasks));
renderTasks();
renderCounters();
}

//Chequear Tarea
if (checkBtn){
    const li = checkBtn.parentElement;
    
    tasks = tasks.map (task =>{
        if (task.id === li.id){
            return{... task, checked: !task.checked};
        }else {
            return task;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    }
});

(() => {
    const tasksLocal = localStorage.getItem('tasks');
    if (tasksLocal) {
    const tasksArray = JSON.parse(tasksLocal);
    tasks = tasksArray;
    renderTasks();
    }
})();

