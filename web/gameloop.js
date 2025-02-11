import { setupGame, moveInvaders } from "../enemies/invaders.js";
import { isGameOver, isPaused } from "../UI/menu.js";

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
