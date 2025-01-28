const score = document.getElementById("score");
const highscore = document.getElementById("highscore");
const timer = document.getElementById("time");
const livesDisplay = document.getElementById("lives");

let time = 0;
let timerStarted = false;
let interval;
let currentLives = 3;
livesDisplay.textContent = currentLives;

// Fonction pour démarrer le chronomètre
function startTimer() {
    if (!timerStarted) {
        interval = setInterval(() => {
            time += 1;
            const minutes = Math.floor((time / 100) / 60);
            const seconds = Math.floor((time / 100) % 60);
            const milliseconds = time % 100;
            
            timer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
        }, 10);
        timerStarted = true;
    }
}

// Fonction pour arrêter le chronomètre
function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        timerStarted = false;
    }
}

// Attendre que le DOM soit chargé avant de démarrer
// document.addEventListener('DOMContentLoaded', () => {
//     startTimer();
// });

