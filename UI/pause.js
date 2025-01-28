// Variables globales pour le système de pause
let isPaused = false;
const mainElements = ["grid", "line-of-protection", "spaceship"];

// Création de l'overlay
const gameDiv = document.getElementById("game-container");
const pauseOverlay = document.createElement("div");
pauseOverlay.className = "pause-overlay";
gameDiv.appendChild(pauseOverlay);

// Configuration du menu de pause
const pauseMenu = document.getElementById("pause-menu");
pauseMenu.innerHTML = `
  <h2 style="color: white; margin-bottom: 2rem;">Jeu en Pause</h2>
  <button id="continue-btn" class="pause-button">Continuer</button>
  <button id="restart-btn" class="pause-button">Recommencer</button>
`;

// Fonction pour mettre le jeu en pause
function pauseGame() {
  if (!isPaused) {
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

// Fonction pour reprendre le jeu
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

// Fonction pour recommencer le jeu
function restartGame() {
  // Réinitialiser le temps
  time = 0;
  timer.textContent = "00:00:00";

  // Réinitialiser le score
  score.textContent = "0";

  // Réinitialiser les vies
  lives.textContent = "3"; // ou votre nombre initial de vies

  // Réinitialiser les positions des éléments
  // À adapter selon votre logique de jeu
  const grid = document.getElementById("grid");
  if (grid) grid.innerHTML = ""; // Nettoyer la grille
  createLine(30);
  createEnnemies(50);

  // Reprendre le jeu
  resumeGame();

  // Redémarrer le chronomètre
  stopTimer();
  startTimer();
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

// Fonction à définir selon votre jeu
function handleKeyPress(event) {
  // Votre logique de contrôle du jeu ici
}
