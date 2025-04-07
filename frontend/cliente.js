// cliente.js
const socket = io();

// Verificar que la conexión se estableció
socket.on('connect', () => {
    console.log('Conectado al servidor con ID:', socket.id);
});

// Emitir comando de voz al servidor
function emitVoiceCommand(command) {
    socket.emit('voiceCommand', command);
}

// Emitir gesto al servidor
function emitGesture(gesture) {
    socket.emit('gestureDetected', gesture);
}

// Actualizar feedback en la interfaz
function showFeedback(message) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = message;
    } else {
        console.warn("Elemento 'feedback' no encontrado.");
    }
}

// Eventos recibidos del servidor
socket.on('voiceCommand', (cmd) => {
    console.log('Comando por voz recibido:', cmd);
    showFeedback(`Comando por voz recibido: ${cmd}`);
});

socket.on('gestureDetected', (gesture) => {
    console.log('Gesto recibido:', gesture);
    showFeedback(`Gesto detectado: ${gesture}`);
});

socket.on('analysisResult', (result) => {
    console.log('Resultado del análisis:', result);
    showFeedback(`Análisis del comando: ${result}`);
});
