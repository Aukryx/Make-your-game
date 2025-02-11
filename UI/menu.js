import { respawnInvaders, clearInvaders } from "../enemies/invaders.js";
import { createProtectionBlocks, clearProtectionBlocks } from "../web/grid.js";
import { cleanupAllBullets } from "../enemies/shootEnemy.js";
import { clearShootingInterval } from "../enemies/invaders.js";

// DOM Elements
const score = document.getElementById("score");
const highscore = document.getElementById("highscore");
const timer = document.getElementById("time");
export const livesDisplay = document.getElementById("lives"); // Export livesDisplay
const mainElements = ["line-of-protection", "spaceship"];
const gameOverMenu = document.getElementById("game-over-menu");
const pauseMenu = document.getElementById("pause-menu");
const gameOverOverlay = document.createElement("div");

// Game state
let time = 0;
let timerStarted = false;
let interval;
let currentScore = 0;
export let currentLives = {
  value: 3,
};
let pauseOverlay;
export let isGameOver = false;
export let isPaused = false;

// Update lives display
export function updateLivesDisplay() {
  livesDisplay.textContent = currentLives.value;
}

// Setup game over menu
function initGameOverOverlay() {
  livesDisplay.textContent = currentLives.value;
  gameOverOverlay.className = "game-over-overlay";
  document.body.appendChild(gameOverOverlay);
  gameOverMenu.innerHTML = `
  <h2 style="color: white; margin-bottom: 2rem;">Game Over</h2>
  <h3 id="final-score" style="color: white; margin-bottom: 2rem;"></h3>
  <input type="text" id="name" placeholder="Invaders27" maxlength=15>
  <button id="gameover-save-btn" class="pause-button">Send Score</button>
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
  stopTimer();
  timerStarted = false;

  interval = setInterval(() => {
    time += 1;
    const minutes = Math.floor(time / 100 / 60);
    const seconds = Math.floor((time / 100) % 60);
    const milliseconds = time % 100;

    timer.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  }, 10);
  timerStarted = true;
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

  switch (event.key) {
    case "Escape":
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
      break;
    case "k":
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
  currentLives.value--;
  livesDisplay.textContent = currentLives.value;

  if (currentLives.value <= 0) {
    gameOver();
  }
}

export async function gameOver() {
  // Display final score
  if (!isGameOver) {
    isGameOver = true;
    const finalScore = document.getElementById("final-score");
    finalScore.textContent = `Final Score: ${score.textContent}`;

    stopTimer();

    mainElements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) element.classList.add("game-over");
    });

    const nameInput = document.getElementById("name");
    const sendBtn = document.getElementById("gameover-save-btn");
    if (sendBtn) {
      sendBtn.addEventListener("click", async () => {
        const name = nameInput.value.trim();
        if (name) {
          const score = {
            Name: name,
            Score: currentScore,
            Time: timer.textContent,
            Rank: 0,
          };
          await sendScore(score);
          sendBtn.disabled = true;
          sendBtn.style.background = "black";
          await updateLeaderboard();
        }
      });
    } else {
      console.error("Save button not found in the game over menu");
    }

    gameOverOverlay.style.display = "block";
    gameOverMenu.style.display = "block";
  }
}

function restartGame() {
  // Reset time
  stopTimer();
  time = 0;
  timer.textContent = "00:00:00";

  // Reset score
  currentScore = 0;
  score.textContent = "0";

  // Reset lives
  currentLives.value = 3;
  livesDisplay.textContent = currentLives.value;

  // Reset game state
  isGameOver = false;
  isPaused = false;

  cleanupAllBullets();
  clearInvaders();
  clearProtectionBlocks();

  respawnInvaders();
  createProtectionBlocks();

  // Reinitialize spaceship position
  const spaceship = document.getElementById("spaceship");
  if (spaceship) {
    spaceship.style.left = "50%"; // Position initiale
    spaceship.style.transform = "translateX(-50%)";
  }

  // Hide both menus and overlays
  gameOverOverlay.style.display = "none";
  gameOverMenu.style.display = "none";
  pauseOverlay.style.display = "none";
  pauseMenu.style.display = "none";

  // Remove visual effects from game elements
  mainElements.forEach((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove("game-over");
      element.classList.remove("game-paused");
    }
  });

  // Restart timer
  stopTimer();
  startTimer();
}
function returnToMenu() {
  stopTimer();
  clearShootingInterval();
  isPaused = false;
  isGameOver = false;
  window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", function () {
  initPauseOverlay();
  initGameOverOverlay();
  startTimer();
  document.addEventListener("keydown", handleKeyPress);

  const pauseContinueBtn = document.getElementById("pause-continue-btn");
  const pauseRestartBtn = document.getElementById("pause-restart-btn");
  const pauseReturnMenuBtn = document.getElementById("pause-return-menu-btn");

  if (pauseContinueBtn) pauseContinueBtn.addEventListener("click", resumeGame);
  if (pauseRestartBtn) pauseRestartBtn.addEventListener("click", restartGame);
  if (pauseReturnMenuBtn)
    pauseReturnMenuBtn.addEventListener("click", returnToMenu);

  const gameoverRestartBtn = document.getElementById("gameover-restart-btn");
  const gameoverReturnMenuBtn = document.getElementById(
    "gameover-return-menu-btn"
  );

  if (gameoverRestartBtn)
    gameoverRestartBtn.addEventListener("click", restartGame);
  if (gameoverReturnMenuBtn)
    gameoverReturnMenuBtn.addEventListener("click", returnToMenu);
});
