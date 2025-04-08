const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { handleVoiceCommand, handleGestureDetected } = require('./backend/handlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos del directorio 'frontend'
app.use(express.static('frontend'));

// Servir archivos estáticos de la carpeta 'assets' para la imagen
app.use('/assets', express.static('assets'));

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Evento para comando de voz
    socket.on('voiceCommand', (command) => {
        handleVoiceCommand(socket, io, command);
    });

    // Evento para gesto detectado
    socket.on('gestureDetected', (gesture) => {
        handleGestureDetected(socket, io, gesture);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
