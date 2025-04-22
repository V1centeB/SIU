const socket = io(); // Asegúrate de que esto solo se ejecute una vez

export function activarMicrofono() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        log('⚠️ Tu navegador no soporta reconocimiento de voz.');
        alert("Tu navegador no soporta reconocimiento de voz.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Inglés americano
    recognition.interimResults = false;
    recognition.continuous = false;

    const fraseObjetivo = document.getElementById('frase-a-decir')?.textContent.trim().toLowerCase();

    recognition.start();

    recognition.onstart = () => {
        log("Microphone Enabled...");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        log(`Recognized text: "${transcript}"`);

        const resultadoDiv = document.getElementById('resultado-pronunciacion');

        if (!fraseObjetivo) {
            resultadoDiv.textContent = "⚠️ No hay frase objetivo definida.";
            log("⚠️ No hay frase objetivo definida.");
            return;
        }

        if (compararFrases(transcript, fraseObjetivo)) {
            resultadoDiv.textContent = "✅ ¡Pronunciación correcta!";
            resultadoDiv.style.color = "green";
        } else {
            resultadoDiv.textContent = `❌ Te entendí: "${transcript}". Intenta pronunciar mejor.`;
            resultadoDiv.style.color = "red";
        }

        // Emitir al servidor vía Socket.IO (ya estaba)
        socket.emit('voiceCommand', transcript);
    };

    recognition.onerror = (event) => {
        log(`❌ Error de reconocimiento: ${event.error}`);
    };

    recognition.onend = () => {
        log("Microphone Disabled");
    };
}

// Comparación básica: puede mejorarse con NLP/fuzzy matching
function compararFrases(recibida, esperada) {
    return recibida === esperada;
}

// Nueva función para enviar logs al servidor
function log(message) {
    console.log(message); // (opcional) también mostrar en consola
    fetch('/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    }).catch(err => {
        console.warn('⚠️ No se pudo enviar el log al servidor:', err);
    });
}

export function cargarFraseAleatoria() {
    fetch('/frase-aleatoria')
        .then(res => res.text())
        .then(frase => {
            const contenedor = document.getElementById('frase-a-decir');
            if (contenedor) contenedor.textContent = frase;
        })
        .catch(err => {
            console.error("❌ Error al cargar frase:", err);
        });
}


