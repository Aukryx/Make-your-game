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
    bullet.launch();
    
    // Nettoyage des balles détruites de notre tableau
    this.bullets = this.bullets.filter(b => b.moveInterval !== null);
    this.bullets.push(bullet);
  }
}

const player = new Player(grid);

let lastTime = 0;
let direction = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  player.move(direction, deltaTime);
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