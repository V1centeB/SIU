// voice.js

// Comprobar si el navegador soporta reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Tu navegador no soporta reconocimiento de voz. Prueba con Google Chrome.");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // Idioma en español
    recognition.interimResults = false;
    recognition.continuous = false; // Se reinicia tras cada frase

    // Iniciar automáticamente al cargar la página
    window.addEventListener('load', () => {
        recognition.start();
    });

    // Reiniciar después de cada reconocimiento
    recognition.addEventListener('end', () => {
        recognition.start();
    });

    // Procesar el resultado del reconocimiento
    recognition.addEventListener('result', (event) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        console.log('Comando por voz detectado:', transcript);

        // Enviar el comando por Socket.IO
        socket.emit('voiceCommand', transcript);
    });

    recognition.addEventListener('error', (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
    });
}
