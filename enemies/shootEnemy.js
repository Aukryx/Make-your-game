
class Bullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.element = this.createElement();
    }
  
    createElement() {
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
      element.style.left = `${this.x}px`;
      element.style.top = `${this.y}px`;
    }
  
    launch() {
      const game = document.getElementById("game-container");
      game.appendChild(this.element);
      const interval = setInterval(() => {
        this.y += 5; // Vitesse de la balle
        this.updatePosition();
        if (this.y > game.offsetHeight) {
          clearInterval(interval);
          this.element.remove(); // Supprime la balle quand elle sort de l'écran
        }
      }, 20);
    }
  }
  
  function shootEnemy(invader) {
    const bullet = new Bullet(invader.x + invader.width / 2, invader.y + invader.height);
    bullet.launch();
  }
  
  export {shootEnemy}