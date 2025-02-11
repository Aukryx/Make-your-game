import {
  setupGame,
  moveInvaders,
  respawnInvaders,
  invaders,
} from "../enemies/invaders.js";
import { isGameOver, isPaused } from "../UI/menu.js";
// import { handleCollisions } from "../players/collisions.js";

let gameState = {
  player: null,
  invaders: [],
};

function gameInit() {
  setupGame();
  gameLoop();
}

function gameLoop() {
  if (!isGameOver && !isPaused) {
    moveInvaders();
    if (gameState.player) {
      handleCollisions(gameState.player, window.invaders);
    }

    if (invaders.length <= 0) {
      respawnInvaders();
    }
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", gameInit);
