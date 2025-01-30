// VOIR POUR DEPLACMENT DES INVADERS VERS LE BAS 
// LES INVADERS DESCENDENT INDIVIDUELLEMENT ET NON PAR GROUPE (LIGNE)
// VOIR POUR DEFINIR LA LIMITE DE LA FENETRE DE JEU (DROITE ET GAUCHE)
// FAIRE LES PROJECTILES ENNEMIES, EN MODE ALEATOIRE
// FAIRE COLLISION AVEC SHOOT PLAYERS + SUPPRIMER LE INVADERS TOUCHE
// CREATION DES ANIMATIONS 
// FAIRE LA LIGNE DE PROTECTION 
// DEFINIR LE GAME OVER LORSQU'UN INVADER ATTEINT LA LIGNE FINALE

class Invader {
    constructor(game, position_enemy) {
        this.game = game; 
        this.position_enemy = position_enemy; 
        this.size = { x: 15, y: 15 }; 
        this.patrolX = 0; 
        this.speedX = 0.5; 

        // Création de l'élément DOM pour l'envahisseur
        this.element = document.createElement('div');
        this.element.className = 'ennemy'; 
        this.updatePosition(); 
        document.getElementById(`line-${Math.floor(position_enemy.y / 30) + 1}`).appendChild(this.element); 
    }

    update() {
        // Vérification si l'envahisseur touche les limites de la fenêtre de jeu
        if (this.position_enemy.x <= 0 || this.position_enemy.x + this.size.x >= 500) { 
            this.game.moveInvadersDown(); 
            this.speedX = -this.speedX; 
        }

        // Déplacement des ennemis suivant la vitesse
        this.position_enemy.x += this.speedX;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.position_enemy.x}px`; 
        this.element.style.top = `${this.position_enemy.y}px`; 
    }
}

class InvaderGroup {
    constructor(game) {
        this.game = game;
        this.invaders = this.createInvaders();
        this.groupPosition = { x: 0, y: 30 }; // Position du groupe
        this.direction = 1; // 1 pour droite, -1 pour gauche
        this.speed = 0.5; // Vitesse de déplacement
    }

    createInvaders() {
        const invaders = [];
        const invaderSpacing = 30; 

        for (let i = 0; i < 24; i++) {
            const x = invaderSpacing + (i % 8) * invaderSpacing;
            const y = 30 + Math.floor(i / 8) * invaderSpacing;
            // Création d'un enemy
            invaders.push(new Invader(this.game, { x: x, y: y }));
        }
        return invaders; 
    }

    update() {
        this.invaders.forEach(invader => invader.update());
        this.move(this.direction * this.speed, 0); // Déplace le groupe dans la direction actuelle
    }

    move(dx, dy) {
        this.groupPosition.x += dx;
        this.groupPosition.y += dy;

        this.invaders.forEach(invader => {
            invader.position_enemy.x += dx;
            invader.position_enemy.y += dy;
            invader.updatePosition();
        });
    }

    moveInvadersDown() {
        const downStep = 30; // Distance à descendre
        this.move(0, downStep); // Déplace le groupe vers le bas
    }

    checkBounds() {
        // Vérifie si le groupe touche les bords de l'écran
        const leftMost = Math.min(...this.invaders.map(invader => invader.position_enemy.x));
        const rightMost = Math.max(...this.invaders.map(invader => invader.position_enemy.x + invader.size.x));

        if (leftMost <= 0 || rightMost >= 500) {
            this.direction *= -1; // Change la direction
            this.moveInvadersDown(); // Fait descendre le groupe
        }
    }
}

// Fonction pour créer le jeu
const game = {
    invaders: [], 
    invadersBelow: function(invader) {
        // Logique pour vérifier s'il y a des envahisseurs en dessous
        return false; 
    },
    moveInvadersDown: function() {
        this.invaders.forEach(invader => {
            // Cette méthode n'est plus utilisée car le mouvement est géré par InvaderGroup
        });
    }
};

// Création du groupe d'ennemis
const invaderGroup = new InvaderGroup(game);
game.invaders = invaderGroup.invaders; 

// Boucle de mise à jour
function gameLoop() {
    invaderGroup.update();
    invaderGroup.checkBounds(); // Vérifie les limites du groupe
    requestAnimationFrame(gameLoop); 
}

// Appel de la boucle de jeu
gameLoop();
