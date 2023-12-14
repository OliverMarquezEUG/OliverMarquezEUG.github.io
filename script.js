const nuevaTareaInput = document.getElementById('nuevaTareaInput');
const añadirBtn = document.getElementById('añadirBtn');
const filtrarInput = document.getElementById('filtrarInput');
const listaTareas = document.getElementById('listaTareas');
const template = document.getElementById('template');

nuevaTareaInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && nuevaTareaInput.value.trim() !== '') {
        añadirTarea(nuevaTareaInput.value.trim());
        nuevaTareaInput.value = '';
    }
});

añadirBtn.addEventListener('click', function () {
    if (nuevaTareaInput.value.trim() !== '') {
        añadirTarea(nuevaTareaInput.value.trim());
        nuevaTareaInput.value = '';
    }
});

filtrarInput.addEventListener('input', function () {
    filtrarTareas();
});

let count = 0;

function añadirTarea(text) {
    const clonedTemplate = template.content.cloneNode(true);

    let nuevaTarea = clonedTemplate.querySelector('.task');
    let text_task = clonedTemplate.querySelector('.task-text');
    let del_button = clonedTemplate.querySelector('.delete');
    let finalizar = clonedTemplate.querySelector('.finalizar');

    nuevaTarea.setAttribute('id', count);
    text_task.textContent = text;
    del_button.setAttribute('id', count);
    finalizar.setAttribute('id', count);

    listaTareas.appendChild(clonedTemplate);

    const tareaCheckbox = nuevaTarea.querySelector('.finalizar');
    const eliminarBtn = nuevaTarea.querySelector('.delete');

    tareaCheckbox.addEventListener('change', function () {
        if (tareaCheckbox.checked) {
            nuevaTarea.style.textDecoration = 'line-through';
            nuevaTarea.style.color = 'grey';
            eliminarBtn.classList.remove('hidden');
        } else {
            nuevaTarea.style.textDecoration = 'none';
            nuevaTarea.style.color = 'black';
            eliminarBtn.classList.add('hidden');
        }
    });

    eliminarBtn.addEventListener('click', function () {
        listaTareas.removeChild(nuevaTarea);
    });
    count += 1;
}

function filtrarTareas() {
    const filtre = filtrarInput.value.toLowerCase();
    const Tareas = listaTareas.getElementsByTagName('div');

    for (const tarea of Tareas) {
        const textTarea = tarea.querySelector('.task-text').innerText.toLowerCase();
        if (textTarea.includes(filtre)) {
            tarea.style.display = 'block';
        } else {
            tarea.style.display = 'none';
        }
    }
}
