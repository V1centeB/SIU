const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const { handleVoiceCommand, handleGestureDetected } = require('./backend/handlers');
const phrasesPath = path.join(__dirname, 'data/voice_phrases.txt');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


// send logs
function logEvent(message) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${message}\n`;
    const logPath = path.join(__dirname, 'data/logs.txt');
    fs.appendFileSync(logPath, line);

    // Emitir a todos los clientes conectados (log en vivo)
    io.emit('newLog', `[${new Date().toLocaleTimeString()}] ${message}`);
}


// Servir archivos estáticos del directorio 'frontend'
app.use(express.static('frontend'));

// Servir archivos estáticos de la carpeta 'assets' para la imagen
app.use('/assets', express.static('assets'));

// Ruta para servir el archivo HTML principal
app.use(express.json());

//
app.get('/logs', (req, res) => {
    const logPath = path.join(__dirname, 'data/logs.txt');

    if (fs.existsSync(logPath)) {
        const contents = fs.readFileSync(logPath, 'utf-8');
        res.send(contents.replace(/\n/g, '<br>'));
    } else {
        res.send('No logs yet.');
    }
});

app.get('/frase-aleatoria', (req, res) => {
    if (!fs.existsSync(phrasesPath)) return res.status(500).send("No frases disponibles.");

    const contenido = fs.readFileSync(phrasesPath, 'utf-8');
    const frases = contenido.split('\n').map(f => f.trim().toLowerCase()).filter(Boolean);
    const aleatoria = frases[Math.floor(Math.random() * frases.length)];

    res.send(aleatoria);
});

// REGISTER endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).send('Missing fields');

    const filePath = path.join(__dirname, 'data/users.txt');
    const userLine = `${username}:${password}`;

    // Ensure file exists
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }

    const file = fs.readFileSync(filePath, 'utf-8');
    const exists = file.split('\n').some(line => line.startsWith(username + ':'));

    if (exists) {
        return res.status(409).send('User already exists');
    }

    fs.appendFileSync(filePath, userLine + '\n');
    logEvent(`User registered: ${username}`);
    res.status(201).send('User registered');
});

// LOGIN endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const filePath = path.join(__dirname, 'data/users.txt');
    if (!fs.existsSync(filePath)) {
        return res.status(401).send('No users registered');
    }

    const file = fs.readFileSync(filePath, 'utf-8');
    const lines = file.split('\n');

    const match = lines.find(line => line.trim() === `${username}:${password}`);
    if (match) {
        logEvent(`User logged in: ${username}`);
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.post('/log', (req, res) => {
    const { message } = req.body;
    if (message) {
        logEvent(message);
        res.status(200).send('Logged');
    } else {
        res.status(400).send('No message provided');
    }
});

io.on('connection', (socket) => {

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
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
