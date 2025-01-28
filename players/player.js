
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
    this.x += direction * this.speed * deltaTime * 500;
    this.x = Math.max(0, Math.min(760, this.x));
    this.element.style.left = `${this.x}px`;
  }

  shoot(){
    const bullet = new Bullet(this.x + 7.5, this.element.offsetTop - 10);
    this.bullets.push(bullet);
  }

  updateBullets() {
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.y < 0) {
        bullet.element.remove();
        this.bullets.splice(index, 1);
      }
    });
  }
}


class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.element = document.createElement('div');
    this.element.className = 'bullet';
    document.body.appendChild(this.element);
    this.updatePosition();
  }

  update() {
    this.y -= this.speed;
    this.updatePosition()
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
  

}




const player = new Player(grid);

let lastTime = 0;
let direction = 0;

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

window.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
    updateDirection();
  }

  if (event.key === " ") {
    player.shoot()
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    updateDirection();
  }
});



