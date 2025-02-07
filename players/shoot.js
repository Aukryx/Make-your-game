class Bullet {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.element = document.createElement('div');
    this.element.className = 'bullet';
    container.appendChild(this.element);
    this.updatePosition();
  }

  update() {
    this.y -= this.speed;
    this.updatePosition();
    
    // Check protection block collisions
    const blocks = document.querySelectorAll('.protection-block');
    for (const block of blocks) {
      if (this.checkCollision(this.element, block)) {
        const blockId = block.id;
        const numberElement = document.getElementById(`block-number-${blockId.split('-')[2]}`);
        const currentHealth = parseInt(numberElement.textContent);
        
        if (currentHealth > 1) {
          numberElement.textContent = (currentHealth - 1).toString();
        } else {
          block.remove();
        }
        
        this.element.remove();
        return true;
      }
    }
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = 'translateX(-50%)';
  }
  
  checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    return !(
      rect1.top > rect2.bottom ||
      rect1.bottom < rect2.top ||
      rect1.right < rect2.left ||
      rect1.left > rect2.right
    );
  }
}
  // Fonction pour limiter la fréquence d'exécution pour les projectiles
  function throttle(func, limit) {
    let lastFunc;
    let lastRan = 0;
  
    return function () {
      const context = this;
      const args = arguments;
  
      if (Date.now() - lastRan >= limit) {
        func.apply(context, args);
        lastRan = Date.now();
      }
    };
  }

  export {Bullet, throttle}