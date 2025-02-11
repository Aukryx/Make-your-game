import {
  setupGame,
  moveInvaders,
  respawnInvaders,
  invaders,
} from "../enemies/invaders.js";
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

    if (invaders.length <= 0) {
      respawnInvaders();
    }
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", gameInit);
