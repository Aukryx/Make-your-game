import { setupGame, moveInvaders } from "../enemies/invaders.js";
// import { handleCollisions } from "../players/collisions.js";

let gameState = {
  player: null,
  invaders: []
};

function gameInit() {
  setupGame();
  gameLoop();
}

function gameLoop() {
  if (!isGameOver && !isPaused) {
    moveInvaders();
    if (gameState.player){

      handleCollisions(gameState.player , window.invaders)
    }
  }

  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", gameInit);
