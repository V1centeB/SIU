function mostrarPantalla(pantalla) {
    // Oculta todas las secciones
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('pantalla-activa');
        card.classList.add('pantalla-oculta');
    });

    // Muestra la sección solicitada
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
    }
}

function iniciarSesion() {
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('password').value;

    if (user && pass) {
        mostrarPantalla('app');
    } else {
        alert('Por favor completa ambos campos');
    }
}
