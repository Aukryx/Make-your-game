class Player {
    constructor(container) {
        this.element = document.createElement('div');
        this.element.className ='player';
        this.x = 400;
        this.speed = 0.5;
        this.container = container;
        this.init()
    }

    init(){
        this.element.style.left =`${this.x}px`;
        this.container.appendChild(this.element);
    }

    move(direction, deltaTime) {
        this.x += direction * this.speed * deltaTime;
        this.x = Math.max(0 , Math.min(760, this.x));
        this.element.style.left = `${this.x}px`
    }
}

const grid = document.getElementById('grid');
const player = new Player(grid)

let lastTime = 0;
function gameLoop(timestamp){
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    player.move(1, deltaTime);

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

