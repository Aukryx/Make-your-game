
//TO DO : Quand je met la pause, la position des balles change, ma théorie est que la balle qui n'est pas dans le menu pause a comme position 0 en vertical
//le bord de l'écran alors que dans le menu pause, la position 0 est le bas du header.
//Dans la console, la position Y de la balle ne bouge pas quand je met pause. 

import { Bullet, throttle } from "./shoot.js";
import { invaders } from "../enemies/invaders.js";

const game_container = document.getElementById("game-container");

class Player {
  constructor(container) {
    this.element = document.getElementById("spaceship");
    this.x = 400;
    this.speed = 0.5;
    this.container = container;
    this.bullets = [];
    this.invaders = invaders
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

    // Calculer la position relative au game-container
    const gameContainerRect = game_container.getBoundingClientRect();
    const spaceshipRect = this.element.getBoundingClientRect();
    const bulletY = spaceshipRect.top - gameContainerRect.top - 10;
    
    const bullet = new Bullet(this.x, bulletY, this.container);
    this.bullets.push(bullet);
  }

  updateBullets() {
    if (isPaused || isGameOver) return;

    this.bullets.forEach((bullet, bulletIndex) => {
      bullet.update();

      // Vérifier si le projectile sort de l'écran
      if (bullet.y < 0) {
        bullet.element.remove();
        this.bullets.splice(bulletIndex, 1);
      } else {
        // Vérifier les collisions avec les envahisseurs
        invaders.forEach((invader, invaderIndex) => {
          if (this.checkCollision(bullet, invader)) {
            bullet.element.remove();
            invader.element.remove();
            this.bullets.splice(bulletIndex, 1);
            invaders.splice(invaderIndex, 1);
            const scoreElement = document.getElementById('score');
           const currentScore = parseInt(scoreElement.textContent);
           scoreElement.textContent = currentScore + 50;
          }
        });
      }
    });
  }
  checkCollision(bullet, invader) {
    const bulletRect = bullet.element.getBoundingClientRect();
    const invaderRect = invader.element.getBoundingClientRect();

    return !(
      bulletRect.top > invaderRect.bottom ||
      bulletRect.bottom < invaderRect.top ||
      bulletRect.right < invaderRect.left ||
      bulletRect.left > invaderRect.right
    );
  }
}


export const player = new Player(grid);

let lastTime = 0;
let direction = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  player.move(direction, deltaTime);
  player.updateBullets(invaders);
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
