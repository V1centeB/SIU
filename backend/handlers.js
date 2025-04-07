// handlers.js
const { execFile } = require('child_process');

/**
 * Valida que el input sea un string no vacío.
 * @param {any} input
 * @returns {boolean}
 */
function isValidString(input) {
    return typeof input === 'string' && input.trim().length > 0;
}

/**
 * Maneja el evento de comando de voz.
 * Valida el comando recibido, lo emite a todos los clientes y ejecuta el script de análisis.
 * @param {object} socket - Socket del cliente
 * @param {object} io - Instancia de Socket.IO para emitir a todos
 * @param {string} command - Comando de voz recibido
 */
function handleVoiceCommand(socket, io, command) {
    if (!isValidString(command)) {
        socket.emit('analysisResult', { error: 'Comando no válido.' });
        return;
    }

    const sanitizedCommand = command.trim();
    console.log(`Comando de voz recibido: ${sanitizedCommand}`);

    // Emite el comando a todos los clientes conectados
    io.emit('voiceCommand', sanitizedCommand);

    // Ejecuta el script de Python de forma segura utilizando execFile
    execFile('python3', ['scripts/analizar_comando.py', sanitizedCommand], (error, stdout, stderr) => {
        if (error) {
            console.error('Error al analizar comando:', error.message);
            socket.emit('analysisResult', { error: error.message });
            return;
        }
        console.log('Análisis:', stdout);
        socket.emit('analysisResult', stdout.trim());
    });
}

/**
 * Maneja el evento de gesto detectado.
 * Valida y emite el gesto a todos los clientes.
 * @param {object} socket - Socket del cliente
 * @param {object} io - Instancia de Socket.IO para emitir a todos
 * @param {string} gesture - Gesto detectado
 */
function handleGestureDetected(socket, io, gesture) {
    if (!isValidString(gesture)) {
        console.error('Gesto inválido recibido');
        return;
    }

    const sanitizedGesture = gesture.trim();
    console.log(`Gesto detectado: ${sanitizedGesture}`);
    io.emit('gestureDetected', sanitizedGesture);
}

module.exports = {
    handleVoiceCommand,
    handleGestureDetected
};
