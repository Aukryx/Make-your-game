
//TO DO : Quand je met la pause, la position des balles change, ma théorie est que la balle qui n'est pas dans le menu pause a comme position 0 en vertical
//le bord de l'écran alors que dans le menu pause, la position 0 est le bas du header.
//Dans la console, la position Y de la balle ne bouge pas quand je met pause. 

import { invaders } from "../enemies/invaders.js";
import { Bullet, throttle } from "./shoot.js";

const game_container = document.getElementById("game-container");

class Player {
  constructor(container) {
    this.element = document.getElementById("spaceship");
    this.x = 400;
    this.speed = 0.5;
    this.container = container;
    this.bullets = [];
    this.init();
  }

  init() {
    this.element.style.left = `${this.x}px`;
  }

  move(direction, deltaTime) {
    if (isPaused || isGameOver) return;
    
    this.x += direction * this.speed * deltaTime * 500;
    this.x = Math.max(30, Math.min(game_container.clientWidth - 30, this.x));
    this.element.style.left = `${this.x}px`;
  }

  shoot() {
    if (isPaused || isGameOver) return;
    
    const gameContainerRect = this.container.getBoundingClientRect();
    const spaceshipRect = this.element.getBoundingClientRect();
    const bulletY = spaceshipRect.top - gameContainerRect.top;
    
    const bullet = new Bullet(this.x, bulletY, this.container);
    this.bullets.push(bullet);
  }

  updateBullets() {
    if (isPaused || isGameOver) return;
    
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.y < 0) {
        bullet.element.remove();
        this.bullets.splice(index, 1);
      }
    });
  }
}

const player = new Player(grid);

let lastTime = 0;
let direction = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  player.move(direction, deltaTime);
  player.updateBullets();
  checkCollision(player, invaders)
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

let keys = {
  ArrowRight: false,
  ArrowLeft: false,
  Space: false
};

const updateDirection = () => {
  if (isPaused || isGameOver) {
    direction = 0;
    return;
  }
  
  if (keys.ArrowLeft && keys.ArrowRight) {
    direction = 0;
  } else if (keys.ArrowRight) {
    direction = 1;
  } else if (keys.ArrowLeft) {
    direction = -1;
  } else {
    direction = 0;
  }
};

const throttledShoot = throttle(() => {
  player.shoot();
}, 500);

window.addEventListener("keydown", (event) => {
  if (isPaused || isGameOver) return;
  
  if (event.key in keys) {
    keys[event.key] = true;
    updateDirection();
  }

  if (event.key === " ") {
    throttledShoot();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    updateDirection();
  }
});

function checkCollision(player, invaders){
  // Collisions Bullets/Invaders
  player.bullets.forEach((bullet, bulletIndex) => {
    console.log(bullet)
    console.log(invaders)
    invaders.forEach((invader, invaderIndex) => {
      if (
        bullet.x < invader.x + invader.width &&
        bullet.x + bullet.width > invader.x &&
        bullet.y < invader.y + invader.height &&
        bullet.y + bullet.height > invader.y
      ) {
        // Collision détectée
        bullet.element.remove();
        player.bullets.splice(bulletIndex, 1);
        
        invader.element.remove();
        invaders.splice(invaderIndex, 1);
        
        // ajouter ici la logique score
      }
    });
  });
  invaders.forEach((invader) => {
    if (
      invader.x < player.x + player.element.clientWidth &&
      invader.x + invader.width > player.x &&
      invader.y + invader.height > player.element.offsetTop
    ) {
      // Game Over si un invader touche le joueur
      endGame();
    }
  });
}

function endGame() {
  isGameOver = true;
  // Ajouter votre logique de fin de jeu
}

export { checkCollision }