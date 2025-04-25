// cliente.js

// Verificar que la conexión se estableció
socket.on('connect', () => {
    console.log('Connected to the server with ID:', socket.id);
});

// Actualizar feedback en la interfaz
function showFeedback(message) {
    const feedback = document.getElementById('feedback');
    if (feedback) {
        feedback.textContent = message;
    } else {
        console.warn("Element 'feedback' not found.");
    }
}

// Eventos recibidos del servidor
socket.on('voiceCommand', (cmd) => {
    console.log('Recognized text::', cmd);
});

socket.on('gestureDetected', (gesture) => {
    console.log('Gesture received:', gesture);
    showFeedback(`Gesture detected: ${gesture}`);
});

socket.on('analysisResult', (result) => {
    console.log('Analysis result:', result);
    showFeedback(`Command analysis: ${result}`);
});
