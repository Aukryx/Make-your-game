import { setupGame, moveInvaders } from "../enemies/invaders.js";
import { handleCollisions } from "./collisions.js";

let gameState = {
  player: null,
  invaders: []
};

function gameInit() {
  setupGame();
  // Get the player instance properly
  const playerElement = document.querySelector('#spaceship');
  // Make sure we have access to the player's __proto__ which contains the player instance
  if (playerElement && playerElement.__proto__) {
    gameState.player = playerElement.__proto__;
  } else {
    console.error('Player instance not found');
    return;
  }
  
  gameLoop();
}

function gameLoop() {
  if (!isGameOver && !isPaused) {
    moveInvaders();
    // Pass the gameState object to handleCollisions
    if (gameState.player) {
      handleCollisions(gameState.player, window.invaders);
    }
  }
  requestAnimationFrame(gameLoop);
}

window.addEventListener("DOMContentLoaded", gameInit);