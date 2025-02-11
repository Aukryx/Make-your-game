import { isGameOver, isPaused, currentLives } from "../UI/menu.js";
import { gameOver } from "../UI/menu.js";
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
      element._bulletInstance = this;
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
      
      this.y += 5;
      this.updatePosition();
      
      // Check protection block collisions
      const blocks = document.querySelectorAll('.protection-block');
      for (const block of blocks) {
        if (this.checkCollision(this, block)) {
          const blockId = block.id;
          const numberElement = document.getElementById(`block-number-${blockId.split('-')[2]}`);
          const currentHealth = parseInt(numberElement.textContent);
          
          if (currentHealth > 1) {
            numberElement.textContent = (currentHealth - 1).toString();
          } else {
            block.remove();
          }
          
          this.destroy();
          return;
        }
      }
      
      // Check player collision
      const currentHealth = document.getElementById("lives")
      const player = document.getElementById("spaceship");
      if (this.checkCollision(this, player)) {
        const event = new CustomEvent('playerHit');
        currentLives.value--;
        currentHealth.textContent = currentLives.value

        this.destroy();
        if (currentLives.value <= 0) {
            gameOver();
            return;
        }
    }
      
      if (this.y > game.offsetHeight) {
        this.destroy();
      }
    }, 20);
  }

  checkCollision(bullet, element) {
    const bulletRect = bullet.element.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return !(
      bulletRect.top > elementRect.bottom ||
      bulletRect.bottom < elementRect.top ||
      bulletRect.right < elementRect.left ||
      bulletRect.left > elementRect.right
    );
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

export function cleanupAllBullets() {
  const bullets = document.querySelectorAll('.bullet');
  bullets.forEach(bullet => {
    const bulletInstance = bullet._bulletInstance;
    if (bulletInstance) {
      bulletInstance.destroy();
    }
  });
}

export { Bullet, shootEnemy };