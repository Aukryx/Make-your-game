class Invader {
    constructor(game, position_enemy) {
        this.game = game; 
        this.position_enemy = position_enemy; 
        this.size = { x: 15, y: 15 }; 
        this.patrolX = 0; 
        this.speedX = 0.3; 

        // Création de l'élément DOM pour l'envahisseur
        this.element = document.createElement('div');
        this.element.className = 'ennemy'; 
        this.updatePosition(); 
        document.getElementById(`line-${Math.floor(position_enemy.y / 30) + 1}`).appendChild(this.element); 
    }

    update() {
        // déplacement des enemies suivant la vitesse
        this.position_enemy.x += this.speedX;

        // vérification si l'enemy touche les limites de la fenetre de jeu
        if (this.position_enemy.x <= 0 || this.position_enemy.x + this.size.x >= 800) { 
            this.game.moveInvadersDown(); 
            this.speedX = -this.speedX; 
        }
        this.updatePosition();
    }
    updatePosition() {
        this.element.style.left = `${this.position_enemy.x}px`; 
        this.element.style.top = `${this.position_enemy.y}px`; 
    }
}

// fonction pour créer des invaders
const createInvaders = (game) => {
    const invaders = [];
    const invaderWidth = 15; 
    const invaderSpacing = 30; 
    const gridWidth = 800; 

    for (let i = 0; i < 24; i++) {
        const x = invaderSpacing + (i % 8) * invaderSpacing;
        const y = 30 + Math.floor(i / 8) * invaderSpacing;
        // création d'un enemy
        invaders.push(new Invader(game, { x: x, y: y }));
    }
    return invaders; 
};

// test d'utilisation
const game = {
    invaders: [], 
    invadersBelow: function(invader) {
        return false; 
    },
    // addBody: function(bullet) {
    //     // Implémentez la logique pour ajouter un projectile au jeu
    // },
    moveInvadersDown: function() {
        this.invaders.forEach(invader => {
            invader.position_enemy.y += 30; 
            // vérification si l'enemy dépasse la limite de la grille
            // VOIR POUR FAIRE UNE FUNCTION GAME OVER 
            if (invader.position_enemy.y + invader.size.y > 600) { 
                console.warn("Un envahisseur dépasse le bas de la grille !");
            }
            invader.updatePosition();
        });
    }
};

// création des ennemies
const invaders = createInvaders(game);
game.invaders = invaders; 

// Boucle de mise à jour
function gameLoop() {
    game.invaders.forEach(invader => invader.update()); 
    requestAnimationFrame(gameLoop); 
}


gameLoop();
