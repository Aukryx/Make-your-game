class Bullet {
  constructor(x, y, container) {
    this.x = x;
    this.y = y;
    this.element = this.createElement();
    this.container = container;
    this.moveInterval = null;
    this.initialY = y; // Stockage de la position Y initiale
  }

  createElement() {
    const element = document.createElement('div');
    element.className = 'bullet';
    if (isPaused) {
      element.classList.add('game-paused');
    }
    element.style.position = 'absolute';
    element.style.width = '5px';
    element.style.height = '10px';
    this.updatePosition(element);
    return element;
  }

  updatePosition(element = this.element) {
    if (!element) return;
    
    element.style.left = `${this.x}px`;
    element.style.top = `${this.y}px`;
    element.style.transform = 'translateX(-50%)';
  }

  launch() {
    if (isPaused || isGameOver) return;
    
    this.container.appendChild(this.element);
    
    this.moveInterval = setInterval(() => {
      if (isPaused) {
        return;
      }

      this.y -= 5;
      this.updatePosition();

      if (this.y < 0) {
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

export { Bullet, throttle };