let number1, number2, correctAnswer;
let openedLocks = 0;
const totalLocks = 3;
const problemText = document.getElementById('problemText');
const inputAnswer = document.getElementById('inputAnswer');
const feedbackText = document.getElementById('feedbackText');
const explosion = document.getElementById('explosion');
const resultText = document.getElementById('resultText');
const candado1 = document.getElementById('candado1');
const candado1Abierto = document.getElementById('candado1-abierto');
const candado2 = document.getElementById('candado2');
const candado2Abierto = document.getElementById('candado2-abierto');
const candado3 = document.getElementById('candado3');
const candado3Abierto = document.getElementById('candado3-abierto');
const submitButton = document.getElementById('submitAnswer');

let history = [];
let timer;

// Genera una suma o resta aleatoria
function generateProblem() {
    clearTimeout(timer); // Limpia el temporizador anterior
    number1 = Math.floor(Math.random() * 50) + 1;
    number2 = Math.floor(Math.random() * 50) + 1;
    let isAddition = Math.random() >= 0.5;

    if (isAddition) {
        problemText.textContent = `${number1} + ${number2} = ?`;
        correctAnswer = number1 + number2;
    } else {
        problemText.textContent = `${number1} - ${number2} = ?`;
        correctAnswer = number1 - number2;
    }

    inputAnswer.value = ''; // Limpia el campo de entrada para la nueva operación
    feedbackText.textContent = ''; // Limpia el mensaje de retroalimentación
    feedbackText.style.color = 'white'; // Restablece el color del texto

    // Inicia un temporizador de 10 segundos
    timer = setTimeout(() => {
        bombExplode(); // Si no se responde en 10 segundos, la bomba explota
    }, 10000);
}

// Verifica la respuesta del jugador
function checkAnswer() {
    clearTimeout(timer); // Limpia el temporizador si el jugador responde

    const playerAnswer = parseInt(inputAnswer.value);

    if (playerAnswer === correctAnswer) {
        feedbackText.textContent = '¡Correcto!';
        feedbackText.style.color = 'green';
        openLock();
        generateProblem(); // Genera una nueva operación después de una respuesta correcta
    } else {
        feedbackText.textContent = 'Incorrecto. ¡La bomba explotó!';
        feedbackText.style.color = 'red';
        bombExplode();
    }
}

// Abre un candado
function openLock() {
    openedLocks++;
    if (openedLocks === 1) {
        candado1.style.display = 'none';
        candado1Abierto.style.display = 'block';
    } else if (openedLocks === 2) {
        candado2.style.display = 'none';
        candado2Abierto.style.display = 'block';
    } else if (openedLocks === 3) {
        candado3.style.display = 'none';
        candado3Abierto.style.display = 'block';
        bombDeactivated();
    }
}

// La bomba se desactiva
function bombDeactivated() {
    resultText.style.display = 'block';
    logResult("Success");
}

// La bomba explota
function bombExplode() {
    explosion.style.display = 'block';
    logResult("Fail");
}

// Registrar el resultado en el historial y generar Excel
function logResult(status) {
    const now = new Date();
    const dateTime = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    history.push([dateTime, status]);

    if (history.length >= totalLocks) {
        generateExcel();
    }
}

// Generar archivo Excel con resultados
function generateExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Fecha y Hora", "Resultado"], ...history]);
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "resultados_bomba.xlsx");
}

// Evento del botón de enviar respuesta
submitButton.addEventListener('click', checkAnswer);

// Generar el primer problema al cargar la página
window.onload = generateProblem;
