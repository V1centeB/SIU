// voice.js

const socket = io(); // Asegúrate de que esto solo se ejecute una vez

export function activarMicrofono() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Tu navegador no soporta reconocimiento de voz.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();

    recognition.onstart = () => {
        console.log("🎙 Micrófono activado. Puedes hablar...");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("🗣 Texto reconocido:", transcript);

        // Emitir el comando por voz al servidor
        socket.emit("voiceCommand", transcript);

        // Mostrar en pantalla si existe un div con id="feedback"
        const feedback = document.getElementById("feedback");
        if (feedback) {
            feedback.textContent = `Comando de voz: ${transcript}`;
        }
    };

    recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error);
    };

    recognition.onend = () => {
        console.log("Reconocimiento finalizado.");
    };
}
