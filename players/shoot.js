// constructor qui permet initialiser les propriétés de l'objet Bullet
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
  
    // Mise à jour de la position du projectile en la déplaçant vers le haut
    update() {
      this.y -= this.speed;
      this.updatePosition()
    }
  
    // Mise à jour de la position visuelle du projectile  
    updatePosition() {
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
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