import { setupGame, moveInvaders } from "../enemies/invaders.js";
import { isGameOver, isPaused } from "../UI/menu.js";

let lastMoveTime = 0;
const MOVE_INTERVAL = 16; 

function gameInit() {
  setupGame();
  gameLoop();
}

function gameLoop(timestamp) {
  if (!isGameOver && !isPaused) {
    if (timestamp - lastMoveTime >= MOVE_INTERVAL) {
      moveInvaders();
      lastMoveTime = timestamp;
    }
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", gameInit);
