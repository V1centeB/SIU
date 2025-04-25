// fill-the-gaps.js

const niveles = [
  {
    frases: [
      { texto: "She ___ to school every day.", respuesta: "goes" },
      { texto: "They ___ playing football now.", respuesta: "are" },
      { texto: "I ___ breakfast at 8 a.m.", respuesta: "have" },
      { texto: "He ___ a book when I called him.", respuesta: "was reading" }
    ],
    opciones: ["goes", "are", "have", "was reading"]
  },
  {
    frases: [
      { texto: "We ___ pizza last night.", respuesta: "ate" },
      { texto: "She ___ to music yesterday.", respuesta: "listened" },
      { texto: "They ___ in the park every weekend.", respuesta: "run" },
      { texto: "He ___ the guitar very well.", respuesta: "plays" }
    ],
    opciones: ["ate", "listened", "run", "plays"]
  },
  {
    frases: [
      { texto: "I ___ my homework now.", respuesta: "am doing" },
      { texto: "They ___ to go on vacation.", respuesta: "want" },
      { texto: "She ___ coffee every morning.", respuesta: "drinks" },
      { texto: "We ___ to the party last week.", respuesta: "went" }
    ],
    opciones: ["am doing", "want", "drinks", "went"]
  },
  {
    frases: [
      { texto: "He ___ TV when it started to rain.", respuesta: "was watching" },
      { texto: "They ___ already finished the test.", respuesta: "have" },
      { texto: "She ___ the truth yesterday.", respuesta: "told" },
      { texto: "I ___ reading a new book.", respuesta: "am" }
    ],
    opciones: ["was watching", "have", "told", "am"]
  }
];

let nivelActual = 0;
let respuestasUsuario = {};

// Iniciar un conjunto
function iniciarNivel(nivelIndex) {
  const { frases, opciones } = niveles[nivelIndex];
  respuestasUsuario = {};
  document.getElementById('next-btn').style.display = "none";
  document.getElementById("resultado-respuesta").textContent = "";

  const contenedorFrases = document.getElementById("frases-con-huecos");
  const contenedorOpciones = document.getElementById("opciones-tiempos");
  contenedorFrases.innerHTML = "";
  contenedorOpciones.innerHTML = "";

  frases.forEach((oracion, index) => {
    const parrafo = document.createElement("p");
    const partes = oracion.texto.split("___");
    parrafo.innerHTML = `${partes[0]}<span class="gap" data-index="${index}" ondrop="drop(event)" ondragover="allowDrop(event)"></span>${partes[1] || ''}`;
    contenedorFrases.appendChild(parrafo);
  });

  opciones.sort(() => Math.random() - 0.5); // Mezclar
  opciones.forEach(opcion => {
    const span = document.createElement("span");
    span.textContent = opcion;
    span.setAttribute("draggable", "true");
    span.classList.add("draggable");
    span.ondragstart = drag;
    contenedorOpciones.appendChild(span);
  });
}

// Drag & Drop
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.textContent);
}
function drop(ev) {
  ev.preventDefault();
  const texto = ev.dataTransfer.getData("text");
  ev.target.textContent = texto;
  respuestasUsuario[ev.target.dataset.index] = texto;
}

// Botón "Check"
document.getElementById("check-btn").addEventListener("click", () => {
  const { frases } = niveles[nivelActual];
  let correcto = true;
  frases.forEach((oracion, idx) => {
    if (respuestasUsuario[idx] !== oracion.respuesta) {
      correcto = false;
    }
  });

  const resultado = document.getElementById("resultado-respuesta");

  if (correcto) {
    resultado.textContent = "Everything is correct!";
    resultado.style.color = "green";
    document.getElementById("next-btn").style.display = "inline-block";
  } else {
    resultado.textContent = "There are errors. Try again.";
    resultado.style.color = "red";
  }
});

// Botón "Next"
document.getElementById("next-btn").addEventListener("click", () => {
  nivelActual = (nivelActual + 1) % niveles.length;
  iniciarNivel(nivelActual);
});

// Botón "Pause"
document.getElementById("pause-btn").addEventListener("click", () => {
  document.getElementById("modal-pausa").classList.remove("modal-oculto");
});

// Botones del modal de pausa
document.getElementById("btn-volver-juego").addEventListener("click", () => {
  document.getElementById("modal-pausa").classList.add("modal-oculto");
});
document.getElementById("btn-ir-menu").addEventListener("click", () => {
  document.getElementById("modal-pausa").classList.add("modal-oculto");
  mostrarPantalla("app");
});

// Al pulsar el botón en la pantalla principal
document.addEventListener("DOMContentLoaded", () => {
  const fillTheGapsBtn = document.querySelector("button[onclick=\"mostrarPantalla('fillTheGaps')\"]");
  if (fillTheGapsBtn) {
    fillTheGapsBtn.addEventListener("click", () => {
      nivelActual = 0;
      iniciarNivel(nivelActual);
    });
  }

  // Asegurarse de ocultar el modal si se recarga
  const modal = document.getElementById("modal-pausa");
  if (modal) {
    modal.classList.add("modal-oculto");
  }
});
