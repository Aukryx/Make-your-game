class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.element = this.createElement();
    this.moveInterval = null;
  }
    
  createElement() {
    if (isPaused || isGameOver) return;
    const element = document.createElement("div");
    element.className = "bullet";
    element.style.position = "absolute";
    element.style.width = "5px";
    element.style.height = "10px";
    element.style.backgroundColor = "blue";
    this.updatePosition(element);
    return element;
  }
        
  updatePosition(element = this.element) {
    if (isPaused || isGameOver) return;
    element.style.left = `${this.x}px`;
    element.style.top = `${this.y}px`;
  }
    
  launch() {
    if (isPaused || isGameOver) return;
    const game = document.getElementById("game-container");
    game.appendChild(this.element);
    
    this.moveInterval = setInterval(() => {
      if (isPaused || isGameOver) {
        return; 
      }
      
      this.y += 5; // Bullet speed
      this.updatePosition();
      
      if (this.y > game.offsetHeight) {
        this.destroy();
      }
    }, 20);
  }

  destroy() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
    if (this.element && this.element.parentNode) {
      this.element.remove();
    }
  }
}

function shootEnemy(invader) {
  const bullet = new Bullet(invader.x + invader.width / 2, invader.y + invader.height);
  bullet.launch();
}

export { Bullet, shootEnemy };