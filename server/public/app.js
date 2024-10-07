const input = document.querySelector("input");
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector("ul");
const empty = document.querySelector(".empty");

// Función para cargar las tareas desde el backend
const loadTasks = async () => {
  try {
    const response = await fetch('http://localhost:3000/tareas');
    const data = await response.json();

    if (data.tareas.length > 0) {
      empty.style.display = "none";
      data.tareas.forEach(tarea => {
        addTaskToList(tarea.descripcion, tarea.completada);
      });
    } else {
      console.log("Lista vacía");
      empty.style.display = "flex";
    }
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
};

// Cargar tareas al inicio o cuando se carga la página
document.addEventListener("DOMContentLoaded", loadTasks);

//agregar tarea al DOM
addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const text = input.value;

  if (text !== "") {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = text;

    li.appendChild(addCheckBtn(p));
    li.appendChild(p);
    li.appendChild(addDeleteBtn());
    ul.appendChild(li);

    input.value = "";
    empty.style.display = "none";

    // Despues llamar la función para agregar la tarea a la base de datos
    agregarTarea(text);
  } else {
    alert("Ingrese una tarea para agregar!");
  }
});

// Función para hacer una solicitud POST y agregar la tarea a la base de datos
const agregarTarea = async (descripcion) => {
  const response = await fetch('http://localhost:3000/tareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion }),
  });
};

// Función para agregar la tarea cargada al DOM, marcando si está completada o no
function addTaskToList(text, isChecked) {
  const li = document.createElement("li");
  const p = document.createElement("p");
  let isClicked = false;
  p.textContent = text;

  // Si la tarea está marcada como completada
  if (isChecked) {
    p.classList.add("checked");
    isClicked = true
  }

  li.appendChild(addCheckBtn(p, isClicked));
  li.appendChild(p);
  li.appendChild(addDeleteBtn());
  ul.appendChild(li);
}

// Función para crear el botón de check
function addCheckBtn(p, isClicked) {
  const checkBtn = document.createElement("button");

  checkBtn.className = "btn-check";

  // Revisar si la tarea estaba marcada para aplicarle el estilo al botón
  if (isClicked) {
    checkBtn.classList.add("clicked");
  }

  checkBtn.addEventListener("click", (e) => {
    p.classList.toggle("checked");
    checkBtn.classList.toggle("clicked");

    // Actualizar el estado de la tarea en la base de datos (completada/no completada)
    updateTaskInDB(p.textContent, p.classList.contains("checked"));
  });

  return checkBtn;
}

// Función para actualizar la tarea en la base de datos cuando se marca/desmarca como completada
const updateTaskInDB = async (descripcion, completada) => {
  try {
    await fetch('http://localhost:3000/tareas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descripcion, completada: completada ? 1 : 0 }),
    });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
  }
};

// Función para crear el botón de eliminar
function addDeleteBtn() {
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "X";
  deleteBtn.className = "btn-delete";

  deleteBtn.addEventListener("click", (e) => {
    const item = e.target.parentElement;
    ul.removeChild(item);

    const items = document.querySelectorAll("li");
    if (items.length === 0) {
      empty.style.display = "flex";
    }

    // Eliminar tarea de la base de datos
    eliminarTarea(item.querySelector("p").textContent);
  });

  return deleteBtn;
}

// Función para eliminar la tarea de la base de datos
const eliminarTarea = async (descripcion) => {
  try {
    await fetch('http://localhost:3000/tareas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descripcion }),
    });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};
