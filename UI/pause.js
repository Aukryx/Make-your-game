// pause.js
let isPaused = false;
const mainElements = ["grid", "line-of-protection", "spaceship"];
let pauseOverlay;
const pauseMenu = document.getElementById("pause-menu");

//On document load
document.addEventListener("DOMContentLoaded", function () {
  initOverlay();
});

// Création de l'overlay
function initOverlay() {
  const gameDiv = document.getElementById("game-container");
  pauseOverlay = document.createElement("div");
  pauseOverlay.className = "pause-overlay";
  gameDiv.appendChild(pauseOverlay);

  // Configuration du menu de pause
  pauseMenu.innerHTML = `
  <h2 style="color: white; margin-bottom: 2rem;">Jeu en Pause</h2>
  <button id="continue-btn" class="pause-button">Continuer</button>
  <button id="restart-btn" class="pause-button">Recommencer</button>
  <button id="return-menu-btn" class="pause-button">Retour au Menu</button>
`;
}

function pauseGame() {
  if (!isPaused && !isGameOver) {
    isPaused = true;

    // Arrêt du chronomètre
    stopTimer();

    // Assombrir les éléments du jeu
    mainElements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) element.classList.add("game-paused");
    });

    // Afficher l'overlay et le menu
    pauseOverlay.style.display = "block";
    pauseMenu.style.display = "block";

    // Désactiver les contrôles du jeu
    document.removeEventListener("keydown", handleKeyPress);
  }
}

function resumeGame() {
  if (isPaused) {
    isPaused = false;

    // Redémarrer le chronomètre
    startTimer();

    // Restaurer la luminosité
    mainElements.forEach((elementId) => {
      const element = document.getElementById(elementId);
      if (element) element.classList.remove("game-paused");
    });

    // Cacher l'overlay et le menu
    pauseOverlay.style.display = "none";
    pauseMenu.style.display = "none";

    // Réactiver les contrôles du jeu
    document.addEventListener("keydown", handleKeyPress);
  }
}

function restartGame() {
  // Réinitialiser le temps
  time = 0;
  timer.textContent = "00:00:00";

  // Réinitialiser le score
  score.textContent = "0";

  currentLives = 3;
  livesDisplay.textContent = currentLives;

  // Réinitialiser les positions des éléments
  const grid = document.getElementById("grid");
  if (grid) grid.innerHTML = "";
  createLine(30);
  createEnnemies(50);

  // Reprendre le jeu
  resumeGame();

  // Redémarrer le chronomètre
  stopTimer();
  startTimer();
}

function returnToMenu() {
  // Arrêter les timers et le jeu
  stopTimer();
  isPaused = false;

  // Rediriger vers la page du menu
  window.location.href = "/";
}

// Gestionnaire d'événements pour la touche Échap
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
});

// Événements des boutons
document.getElementById("continue-btn").addEventListener("click", resumeGame);
document.getElementById("restart-btn").addEventListener("click", restartGame);
document
  .getElementById("return-menu-btn")
  .addEventListener("click", returnToMenu);
