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
    } else if (pantalla === 'inicio') {
        document.getElementById('pantalla-inicio').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-inicio').classList.add('pantalla-activa');
    } else if (pantalla === 'registro') {
        document.getElementById('pantalla-registro').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-registro').classList.add('pantalla-activa');
    } else if (pantalla === 'app') {
        document.getElementById('pantalla-app').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-app').classList.add('pantalla-activa');
    } else if (pantalla === 'learnGrammar') {
        document.getElementById('pantalla-learn-grammar').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-learn-grammar').classList.add('pantalla-activa');
        iniciarSesionGramatica();
    } else if (pantalla === 'learnVocabulary') {
        document.getElementById('pantalla-learnVocabulary').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-learnVocabulary').classList.add('pantalla-activa');
    } else if (pantalla === 'conversacion') {
        document.getElementById('pantalla-conversacion').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-conversacion').classList.add('pantalla-activa');
    }
    else if (pantalla === 'fillTheGaps') {
        document.getElementById('pantalla-fill-the-gaps').classList.remove('pantalla-oculta');
        document.getElementById('pantalla-fill-the-gaps').classList.add('pantalla-activa');
    }

    // MOSTRAR / OCULTAR la cámara en función de la pantalla activa
    const camara = document.getElementById('camara-container');
    if (camara) {
        if (pantalla === 'learnVocabulary') {
            camara.classList.remove('pantalla-oculta');
        } else {
            camara.classList.add('pantalla-oculta');
        }
    }
}

// Llamar esta función cuando se selecciona "Have a conversation"
document.getElementById('haveConversation').addEventListener('click', iniciarConversacion);



function iniciarSesion() {
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('password').value;

    if (!user || !pass) {
        alert('Por favor completa ambos campos');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(res => {
        if (res.ok) {
            mostrarPantalla('app');
        } else {
            alert('Credenciales incorrectas');
        }
    });
}

function registrarse() {
    const user = document.getElementById('registro-usuario').value;
    const pass = document.getElementById('registro-password').value;

    if (!user || !pass) {
        alert('Por favor completa ambos campos');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(res => {
        if (res.status === 201) {
            alert('✅ Usuario registrado. Ahora puedes iniciar sesión.');
            mostrarPantalla('login');
        } else if (res.status === 409) {
            alert('Ese nombre de usuario ya existe.');
        } else {
            alert('Error registrando usuario.');
        }
    });
}



// funciones para el juego de aprender gramatica
let timerInterval;
let lives = 3;
let timeLeft = 300; // 5 minutes in seconds
let shuffledQuestions = [];
let currentQuestionIndex = 0;

function shuffleQuestions() {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}


function iniciarSesionGramatica() {

    fetch('/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'User started Learn Grammar' })
      });
      

    // Reset lives and time
    lives = 3;
    timeLeft = 300;
    score = 0;


    // Update UI
    document.getElementById('lives-display').textContent = `Lives: ${lives}`;
    updateTimerUI();

    // Clear any previous interval
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerUI();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGrammarSession("Time's up!");
        } else if (lives <= 0) {
            clearInterval(timerInterval);
            endGrammarSession("You ran out of lives!");
        }
    }, 1000);

    shuffledQuestions = shuffleQuestions();
    currentQuestionIndex = 0;
    mostrarSiguientePregunta();


}

function mostrarSiguientePregunta() {
    if (currentQuestionIndex >= shuffledQuestions.length) {
        endGrammarSession("You completed all the questions!");
        return;
    }

    const pregunta = shuffledQuestions[currentQuestionIndex++];
    const { question, options, answer, difficulty } = pregunta;

    let puntos = 0;
    if (difficulty === "easy") puntos = 100;
    else if (difficulty === "medium") puntos = 200;
    else if (difficulty === "hard") puntos = 300;

    const html = `
        <h2>${question}</h2>
        ${options.map(opt => `
            <button onclick="verificarRespuesta('${opt.replace(/'/g, "\\'")}', '${answer.replace(/'/g, "\\'")}', ${puntos})">${opt}</button>
        `).join("<br><br>")}
    `;

    document.getElementById('grammar-content').innerHTML = html;
}



function verificarRespuesta(seleccion, correcta, puntos) {
    if (seleccion === correcta) {
        score += puntos;
        mostrarSiguientePregunta();
    } else {
        lives--;
        document.getElementById('lives-display').textContent = `Lives: ${lives}`;
        if (lives <= 0) {
            clearInterval(timerInterval);
            endGrammarSession("You ran out of lives!");
        } else {
            mostrarSiguientePregunta();
        }
    }
}

function endGrammarSession(reason) {
    document.getElementById('grammar-content').innerHTML = `
        <h2 style="font-size: 2rem;">Game Over: You scored ${score} points</h2>
        ${reason ? `<p style="font-size: 1.2rem;">${reason}</p>` : ''}
        <button class="replay-button" onclick="iniciarSesionGramatica()">Play Again</button>
    `;
}




function updateTimerUI() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.getElementById('timer-display').textContent = `Time: ${minutes}:${seconds}`;
}





const questions = [
    //  EASY (1–20)
    {
        question: "She ___ to the gym every morning.",
        options: ["go", "goes", "going"],
        answer: "goes",
        difficulty: "easy"
    },
    {
        question: "They ___ playing soccer.",
        options: ["is", "are", "am"],
        answer: "are",
        difficulty: "easy"
    },
    {
        question: "We ___ a new car last week.",
        options: ["buyed", "bought", "buys"],
        answer: "bought",
        difficulty: "easy"
    },
    {
        question: "Choose the correct article: ___ apple",
        options: ["a", "an", "the"],
        answer: "an",
        difficulty: "easy"
    },
    {
        question: "She has ___ friends in class.",
        options: ["much", "many", "very"],
        answer: "many",
        difficulty: "easy"
    },
    {
        question: "What is the plural of 'child'?",
        options: ["childs", "children", "childes"],
        answer: "children",
        difficulty: "easy"
    },
    {
        question: "He ___ to school by bus.",
        options: ["go", "goes", "going"],
        answer: "goes",
        difficulty: "easy"
    },
    {
        question: "Which one is a noun?",
        options: ["run", "book", "quickly"],
        answer: "book",
        difficulty: "easy"
    },
    {
        question: "Select the correct past tense: I ___ a movie.",
        options: ["watch", "watched", "watches"],
        answer: "watched",
        difficulty: "easy"
    },
    {
        question: "She ___ her homework already.",
        options: ["did", "do", "does"],
        answer: "did",
        difficulty: "easy"
    },
    {
        question: "Which sentence is correct?",
        options: ["He eat breakfast.", "He eats breakfast.", "He eating breakfast."],
        answer: "He eats breakfast.",
        difficulty: "easy"
    },
    {
        question: "___ you like ice cream?",
        options: ["Do", "Does", "Is"],
        answer: "Do",
        difficulty: "easy"
    },
    {
        question: "Select the question word: ___ is your name?",
        options: ["What", "Where", "That"],
        answer: "What",
        difficulty: "easy"
    },
    {
        question: "Choose the correct possessive: This is ___ book.",
        options: ["hers", "her", "she"],
        answer: "her",
        difficulty: "easy"
    },
    {
        question: "How ___ people are coming?",
        options: ["much", "many", "some"],
        answer: "many",
        difficulty: "easy"
    },
    {
        question: "Identify the verb: He runs every morning.",
        options: ["He", "runs", "morning"],
        answer: "runs",
        difficulty: "easy"
    },
    {
        question: "We ___ at home yesterday.",
        options: ["was", "were", "are"],
        answer: "were",
        difficulty: "easy"
    },
    {
        question: "She ___ going to the party.",
        options: ["is", "are", "am"],
        answer: "is",
        difficulty: "easy"
    },
    {
        question: "Choose the correct negative: I ___ like onions.",
        options: ["don't", "doesn't", "not"],
        answer: "don't",
        difficulty: "easy"
    },
    {
        question: "Select the correct spelling:",
        options: ["definately", "definitely", "definatly"],
        answer: "definitely",
        difficulty: "easy"
    },

    // MEDIUM (21–35)
    {
        question: "Which sentence is in the present perfect tense?",
        options: ["She cooks dinner.", "She has cooked dinner.", "She is cooking dinner."],
        answer: "She has cooked dinner.",
        difficulty: "medium"
    },
    {
        question: "Choose the sentence with correct punctuation:",
        options: ["Its raining outside.", "It's raining outside.", "Its' raining outside."],
        answer: "It's raining outside.",
        difficulty: "medium"
    },
    {
        question: "Which sentence uses a conditional correctly?",
        options: ["If I will go, I will see her.", "If I go, I will see her.", "If I gone, I will see her."],
        answer: "If I go, I will see her.",
        difficulty: "medium"
    },
    {
        question: "Select the correct reported speech:",
        options: ["He said he goes to school.", "He said he went to school.", "He said he going to school."],
        answer: "He said he went to school.",
        difficulty: "medium"
    },
    {
        question: "What is the passive voice of: 'They built a house'?",
        options: ["A house is built.", "A house was built.", "They were building a house."],
        answer: "A house was built.",
        difficulty: "medium"
    },
    {
        question: "Which sentence shows correct subject-verb agreement?",
        options: ["The dogs barks loudly.", "The dog bark loudly.", "The dog barks loudly."],
        answer: "The dog barks loudly.",
        difficulty: "medium"
    },
    {
        question: "Identify the correct use of 'their':",
        options: ["There going to the store.", "They're going to the store.", "Their car is red."],
        answer: "Their car is red.",
        difficulty: "medium"
    },
    {
        question: "Choose the correct sentence in future perfect:",
        options: ["She will have finished by noon.", "She will finish by noon.", "She has finished by noon."],
        answer: "She will have finished by noon.",
        difficulty: "medium"
    },
    {
        question: "Which word is an adverb?",
        options: ["Quickly", "Quick", "Quicker"],
        answer: "Quickly",
        difficulty: "medium"
    },
    {
        question: "Which sentence is punctuated correctly?",
        options: ["My friend, who is kind, gave me a gift.", "My friend who is kind gave me a gift.", "My friend who is kind, gave me a gift."],
        answer: "My friend, who is kind, gave me a gift.",
        difficulty: "medium"
    },

    //  HARD (36–50)
    {
        question: "Which is an example of a dangling modifier?",
        options: [
            "While reading the book, the phone rang.",
            "She read the book while the phone rang.",
            "The phone rang as she read the book."
        ],
        answer: "While reading the book, the phone rang.",
        difficulty: "hard"
    },
    {
        question: "Which sentence is grammatically correct in subjunctive mood?",
        options: [
            "If I was taller, I’d play basketball.",
            "If I were taller, I’d play basketball.",
            "If I am taller, I’d play basketball."
        ],
        answer: "If I were taller, I’d play basketball.",
        difficulty: "hard"
    },
    {
        question: "What is the correct parallel structure?",
        options: [
            "She likes reading, to jog, and painting.",
            "She likes to read, jog, and paint.",
            "She likes to read, jogging, and paint."
        ],
        answer: "She likes to read, jog, and paint.",
        difficulty: "hard"
    },
    {
        question: "Which sentence uses an ellipsis correctly?",
        options: [
            "She said... she might come later.",
            "She...said she might come later.",
            "She said she might...come later"
        ],
        answer: "She said... she might come later.",
        difficulty: "hard"
    },
    {
        question: "Choose the correct example of a misplaced modifier:",
        options: [
            "He nearly drove his kids to school every day.",
            "He drove his kids to school nearly every day.",
            "Nearly every day, he drove his kids to school."
        ],
        answer: "He nearly drove his kids to school every day.",
        difficulty: "hard"
    },
    {
        question: "Which sentence correctly uses the colon?",
        options: [
            "He wanted: to win the race.",
            "He had one goal: to win the race.",
            "He had one goal to win the race:"
        ],
        answer: "He had one goal: to win the race.",
        difficulty: "hard"
    },
    {
        question: "Which sentence uses proper parallelism?",
        options: [
            "He likes swimming, biking, and to run.",
            "He likes to swim, bike, and running.",
            "He likes swimming, biking, and running."
        ],
        answer: "He likes swimming, biking, and running.",
        difficulty: "hard"
    },
    {
        question: "Which sentence uses 'whom' correctly?",
        options: [
            "Whom do you think will win?",
            "To whom did you give the gift?",
            "Whom is going to the party?"
        ],
        answer: "To whom did you give the gift?",
        difficulty: "hard"
    },
    {
        question: "What is the best use of a semicolon?",
        options: [
            "She studied hard; therefore, she passed.",
            "She studied hard: therefore she passed.",
            "She studied hard, therefore she passed."
        ],
        answer: "She studied hard; therefore, she passed.",
        difficulty: "hard"
    },
    {
        question: "Identify the correct form of the sentence using passive voice:",
        options: [
            "The company released the product.",
            "The product was released by the company.",
            "The company was releasing the product."
        ],
        answer: "The product was released by the company.",
        difficulty: "hard"
    },
    {
        question: "Choose the grammatically correct sentence:",
        options: [
            "Neither of the boys are ready.",
            "Neither of the boys is ready.",
            "Neither of the boys be ready."
        ],
        answer: "Neither of the boys is ready.",
        difficulty: "hard"
    },
    {
        question: "Which sentence uses proper conditional form?",
        options: [
            "If I had studied, I would pass.",
            "If I had studied, I would have passed.",
            "If I studied, I would have passed."
        ],
        answer: "If I had studied, I would have passed.",
        difficulty: "hard"
    },
    {
        question: "What is the correct comparative structure?",
        options: [
            "This car is more fast than that one.",
            "This car is faster than that one.",
            "This car is most fast than that one."
        ],
        answer: "This car is faster than that one.",
        difficulty: "hard"
    },
    {
        question: "Which sentence is punctuated correctly with parentheses?",
        options: [
            "He finally answered (after taking five minutes) the question.",
            "He finally answered after taking five minutes (the question).",
            "He finally (answered after taking five minutes) the question."
        ],
        answer: "He finally answered (after taking five minutes) the question.",
        difficulty: "hard"
    },
    {
        question: "What’s the correct sentence with an appositive?",
        options: [
            "My brother he plays football.",
            "My brother, a football player, loves the sport.",
            "My brother a football player loves the sport."
        ],
        answer: "My brother, a football player, loves the sport.",
        difficulty: "hard"
    }
];




