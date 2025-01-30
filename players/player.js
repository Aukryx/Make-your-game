import { Bullet , throttle } from "./shoot.js";


class Player {
  // constructor qui permet initialiser les propriétés de l'objet Player
  constructor(container) {
    this.element = document.getElementById("spaceship");
    this.x = 400;
    this.speed = 0.5;
    this.container = container;
    this.bullets = [];
    this.init();
  }

  // initialise la position du vaisseau
  init() {
    this.element.style.left = `${this.x}px`;
  }

  // deplacements du vaisseau
  move(direction, deltaTime) {
    this.x += direction * this.speed * deltaTime * 500;
    this.x = Math.max(30, Math.min(game_container.clientWidth - 30, this.x));
    this.element.style.left = `${this.x}px`;
  }

  // Tire un projectile et ajout à la liste des projectiles
  shoot() {
    const bullet = new Bullet(this.x + 7.5, this.element.offsetTop - 10);
    this.bullets.push(bullet);
  }

  // Mise à jour la position des balles 
  updateBullets() {
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.y < 0 || bullet.y > this.gridHeight) {
        bullet.element.remove();
        this.bullets.splice(index, 1);
      }
    });
  }
}

const player = new Player(grid);

let lastTime = 0;
let direction = 0;

// Boucle de jeu principale qui met à jour la position du player et des projectiles
function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  player.move(direction, deltaTime)
  player.updateBullets()
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

let keys = {
  ArrowRight: false,
  ArrowLeft: false,
  Space: false
};

// Mise à jour de la direction du player en fonction des touches ArrowRight, ArrowLeft, Space
const updateDirection = () => {
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
  if (event.key in keys) {
    keys[event.key] = true;
    updateDirection();
  }

  if (event.key === " ") {
    // player.shoot()
    throttledShoot()
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    updateDirection();
  }
});


// voir throttle pour controle le tire fait 
// voir limiter le tire sur la taille de la grille 
// controler le tire au mouvement du vaisseau
// mettre des commentaires fait 
// faire les tires aliens 
