// const onePlayer = document.getElementById('spaceship');

class Player {
  constructor(container) {
    // this.element = document.createElement('div');
    // this.element.className = 'spaceship';
    this.element = document.getElementById("spaceship");
    this.x = 400;
    this.speed = 0.5;
    this.container = container;
    this.init();
  }

  init() {
    this.element.style.left = `${this.x}px`;
    // this.container.appendChild(this.element);
  }

  move(direction, deltaTime) {
    this.x += direction * this.speed * deltaTime * 500;
    this.x = Math.max(0, Math.min(760, this.x));
    this.element.style.left = `${this.x}px`;
  }
}

const player = new Player(grid);

let lastTime = 0;
let direction = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  //   const test = document.getElementsByClassName('direction_space')[0]
  //     test.textContent = `${direction} / ${player.x}`
  player.move(direction, deltaTime);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" && event.key === "ArrowLeft") {
    direction = 0;
  } else if (event.key === "ArrowRight") {
    direction = 1;
  } else if (event.key === "ArrowLeft") {
    direction = -1;
  }
});

window.addEventListener("keyup", () => {
  direction = 0;
});

// function updatePlayerMovement(timestamp){
//     const deltaTime = (timestamp - lastTime) / 1000;
//     lastTime = timestamp

//     player.move(direction, deltaTime);

//     requestAnimationFrame(updatePlayerMovement)
// }

// requestAnimationFrame(updatePlayerMovement)
