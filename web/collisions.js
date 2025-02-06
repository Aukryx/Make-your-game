function checkCollision(rect1, rect2) {
  return !(rect1.right < rect2.left || 
           rect1.left > rect2.right || 
           rect1.bottom < rect2.top || 
           rect1.top > rect2.bottom);
}

function handleCollisions(player, invaders) {
  // Safely access player bullets
  const playerBullets = player.bullets || [];
  const enemyBullets = document.querySelectorAll('.bullet');
  const protectionBlocks = document.querySelectorAll('.protection-block');

  // Handle player bullet collisions
  playerBullets.forEach((bullet, bulletIndex) => {
    if (!bullet || !bullet.element) return; // Skip if bullet is invalid
    
    const bulletRect = bullet.element.getBoundingClientRect();

    // Check collisions with invaders
    invaders.forEach((invader, invaderIndex) => {
      if (!invader || !invader.element) return; // Skip if invader is invalid
      
      const invaderRect = invader.element.getBoundingClientRect();
      
      if (checkCollision(bulletRect, invaderRect)) {
        // Remove bullet
        bullet.destroy();
        playerBullets.splice(bulletIndex, 1);
        
        // Remove invader
        invader.element.remove();
        invaders.splice(invaderIndex, 1);
        
        // Update score
        const scoreElement = document.getElementById('score');
        const currentScore = parseInt(scoreElement.textContent);
        scoreElement.textContent = currentScore + 50;
      }
    });

    // Check collisions with protection blocks
    protectionBlocks.forEach(block => {
      if (!block) return; // Skip if block is invalid
      
      const blockRect = block.getBoundingClientRect();
      const blockNumber = block.querySelector('.block-number');
      
      if (checkCollision(bulletRect, blockRect)) {
        // Remove bullet
        bullet.destroy();
        playerBullets.splice(bulletIndex, 1);
        
        // Update protection block health
        if (blockNumber) {
          let lives = parseInt(blockNumber.textContent);
          lives--;
          blockNumber.textContent = lives;
          
          if (lives <= 0) {
            block.remove();
          }
        }
      }
    });
  });

  // Handle enemy bullet collisions
  enemyBullets.forEach(bullet => {
    if (!bullet) return; // Skip if bullet is invalid
    
    const bulletRect = bullet.getBoundingClientRect();
    
    // Check collision with player
    if (player.element) {
      const spaceshipRect = player.element.getBoundingClientRect();
      
      if (checkCollision(bulletRect, spaceshipRect)) {
        bullet.remove();
        if (typeof window.loseLife === 'function') {
          window.loseLife();
        }
      }
    }

    // Check collisions with protection blocks
    protectionBlocks.forEach(block => {
      if (!block) return; // Skip if block is invalid
      
      const blockRect = block.getBoundingClientRect();
      const blockNumber = block.querySelector('.block-number');
      
      if (checkCollision(bulletRect, blockRect)) {
        bullet.remove();
        
        if (blockNumber) {
          let lives = parseInt(blockNumber.textContent);
          lives--;
          blockNumber.textContent = lives;
          
          if (lives <= 0) {
            block.remove();
          }
        }
      }
    });
  });
}

export { handleCollisions };