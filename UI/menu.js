// TO DO stop bullets game over and paused from enemies


// DOM Elements
const score = document.getElementById("score");
const highscore = document.getElementById("highscore");
const timer = document.getElementById("time");
const livesDisplay = document.getElementById("lives");
const mainElements = ["grid", "line-of-protection", "spaceship"];
const gameOverMenu = document.getElementById("game-over-menu");
const pauseMenu = document.getElementById("pause-menu");
const gameOverOverlay = document.createElement("div");

// Game state
let time = 0;
let timerStarted = false;
let interval;
let currentLives = 3;
let pauseOverlay;
let isGameOver = false;
let isPaused = false;


// Setup game over menu
function initGameOverOverlay(){
    livesDisplay.textContent = currentLives;
    gameOverOverlay.className = 'game-over-overlay';
    document.body.appendChild(gameOverOverlay);
gameOverMenu.innerHTML = `
  <h2 style="color: white; margin-bottom: 2rem;">Game Over</h2>
  <h3 id="final-score" style="color: white; margin-bottom: 2rem;"></h3>
  <button id="gameover-restart-btn" class="pause-button">Restart</button>
  <button id="gameover-return-menu-btn" class="pause-button">Return Menu</button>
`;
}

// Initialize overlay and pause menu
function initPauseOverlay() {
    const gameDiv = document.getElementById("game-container");
    pauseOverlay = document.createElement("div");
    pauseOverlay.className = "pause-overlay";
    gameDiv.appendChild(pauseOverlay);
    
    pauseMenu.innerHTML = `
        <h2 style="color: white; margin-bottom: 2rem;">Jeu en Pause</h2>
        <button id="pause-continue-btn" class="pause-button">Continuer</button>
        <button id="pause-restart-btn" class="pause-button">Recommencer</button>
        <button id="pause-return-menu-btn" class="pause-button">Retour au Menu</button>
    `;
}

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

function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = null;
        timerStarted = false;
    }
}

// Game control functions
function handleKeyPress(event) {
    if (isGameOver) return;
    
    switch(event.key) {
        case 'Escape':
            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
            break;
        case 'k':
            if (!isPaused) {
                loseLife();
            }
            break;
    }
}

function pauseGame() {
    if (!isPaused && !isGameOver) {
        isPaused = true;
        stopTimer();
        
        mainElements.forEach((elementId) => {
            const element = document.getElementById(elementId);
            if (element) element.classList.add("game-paused");
        });
        
        pauseOverlay.style.display = "block";
        pauseMenu.style.display = "block";
    }
}

function resumeGame() {
    if (isPaused) {
        isPaused = false;
        startTimer();
        
        mainElements.forEach((elementId) => {
            const element = document.getElementById(elementId);
            if (element) element.classList.remove("game-paused");
        });
        
        pauseOverlay.style.display = "none";
        pauseMenu.style.display = "none";
    }
}

function loseLife() {
    currentLives--;
    livesDisplay.textContent = currentLives;
    
    if (currentLives <= 0) {
        gameOver();
    }
}

function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        const finalScore = document.getElementById("final-score");
        finalScore.textContent = `Final Score: ${score.textContent}`;
        
        stopTimer();
        
        mainElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) element.classList.add('game-over');
        });
        
        gameOverOverlay.style.display = 'block';
        gameOverMenu.style.display = 'block';
    }
}

function restartGame() {
    // Reset time
    time = 0;
    timer.textContent = "00:00:00";
    
    // Reset score
    score.textContent = "0";
    
    // Reset lives
    currentLives = 3;
    livesDisplay.textContent = currentLives;
    
    // Reset game elements
    const grid = document.getElementById("grid");
    if (grid) grid.innerHTML = "";
    createLine(30);
    // createEnnemies(50);
    
    // Reset game state
    isGameOver = false;
    isPaused = false;
    
    // Hide both menus and overlays
    gameOverOverlay.style.display = 'none';
    gameOverMenu.style.display = 'none';
    pauseOverlay.style.display = 'none';
    pauseMenu.style.display = 'none';
    
    mainElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('game-over');
            element.classList.remove('game-paused');
        }
    });
    
    // Restart timer
    stopTimer();
    startTimer();
}

function returnToMenu() {
    stopTimer();
    isPaused = false;
    isGameOver = false;
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", function () {
    initPauseOverlay();
    initGameOverOverlay();
    startTimer();
    document.addEventListener("keydown", handleKeyPress);
    
    const pauseContinueBtn = document.getElementById('pause-continue-btn');
    const pauseRestartBtn = document.getElementById('pause-restart-btn');
    const pauseReturnMenuBtn = document.getElementById('pause-return-menu-btn');
    
    if (pauseContinueBtn) pauseContinueBtn.addEventListener('click', resumeGame);
    if (pauseRestartBtn) pauseRestartBtn.addEventListener('click', restartGame);
    if (pauseReturnMenuBtn) pauseReturnMenuBtn.addEventListener('click', returnToMenu);
    
    const gameoverRestartBtn = document.getElementById('gameover-restart-btn');
    const gameoverReturnMenuBtn = document.getElementById('gameover-return-menu-btn');
    
    if (gameoverRestartBtn) gameoverRestartBtn.addEventListener('click', restartGame);
    if (gameoverReturnMenuBtn) gameoverReturnMenuBtn.addEventListener('click', returnToMenu);
    
});