// Esta función debe mostrarse cuando el usuario selecciona "Have a conversation"
function iniciarConversacion() {
    mostrarPantalla('conversacion');  // Muestra la pantalla de conversación
    activarMicrofono();  // Activar micrófono solo cuando entramos en esta pantalla
}

// Función para mostrar las pantallas
function mostrarPantalla(pantalla) {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('pantalla-activa');
        card.classList.add('pantalla-oculta');
    });

    if (pantalla === 'login') {
        document.getElementById('pantalla-login').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-login').classList.add('pantalla-activa');
    } else if (pantalla === 'registro') {
        alert('Funcionalidad de registro aún no implementada.');
        document.getElementById('pantalla-inicio').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-inicio').classList.add('pantalla-activa');
    } else if (pantalla === 'app') {
        document.getElementById('pantalla-app').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-app').classList.add('pantalla-activa');
    } else if (pantalla === 'addVocabulary') {
        document.getElementById('pantalla-add-vocabulary').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-add-vocabulary').classList.add('pantalla-activa');
    } else if (pantalla === 'learnVocabulary') {
        document.getElementById('pantalla-learnVocabulary').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-learnVocabulary').classList.add('pantalla-activa');
    } else if (pantalla === 'conversacion') {
        document.getElementById('pantalla-conversacion').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-conversacion').classList.add('pantalla-activa');
    }
}

// Llamar esta función cuando se selecciona "Have a conversation"
document.getElementById('haveConversation').addEventListener('click', iniciarConversacion);

function iniciarSesion() {
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('password').value;

    if (user && pass) {
        mostrarPantalla('app');
    } else {
        alert('Por favor completa ambos campos');
    }
}
