import { setupGame, moveInvaders } from "../enemies/invaders.js";
import { player , checkCollision } from "../players/player.js"

function gameInit() {
  setupGame();
  gameLoop();
}

function gameLoop() {
  if (!isGameOver && !isPaused) {
    moveInvaders();
      for (let i = 0; i < bullet.length; i++) {
      for (let j = 0; j < invaders.length; j++) {
          if (checkCollision(bullet[i], invaders[j])) {
              // Collision détectée, supprimer l'envahisseur
              invaders.splice(j, 1);
              // Optionnel : supprimer le projectile
              bullet.splice(i, 1);
              return; // Sortir de la boucle pour éviter les erreurs d'index
          }
      }
  }
}
    player.checkCollision()
  

  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", gameInit);
