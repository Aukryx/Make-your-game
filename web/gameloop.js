import { setupGame, moveInvaders } from "../enemies/invaders.js";

function gameInit() {
  setupGame();
  gameLoop();
}

function gameLoop() {
  if (!isGameOver && !isPaused) {
    moveInvaders();
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", gameInit);
