// VOIR POUR DEPLACMENT DES INVADERS VERS LE BAS
// LES INVADERS DESCENDENT INDIVIDUELLEMENT ET NON PAR GROUPE (LIGNE)
// VOIR POUR DEFINIR LA LIMITE DE LA FENETRE DE JEU (DROITE ET GAUCHE)
// FAIRE LES PROJECTILES ENNEMIES, EN MODE ALEATOIRE
// FAIRE COLLISION AVEC SHOOT PLAYERS + SUPPRIMER LE INVADERS TOUCHE
// CREATION DES ANIMATIONS
// FAIRE LA LIGNE DE PROTECTION
// DEFINIR LE GAME OVER LORSQU'UN INVADER ATTEINT LA LIGNE FINALE

let direction = 1;
let invaders = [];
let gameWidth = document.getElementById("game-container").clientWidth;

class Invader {
  constructor(x, y) {
    this.width = 30;
    this.height = 20;
    this.x = x;
    this.y = y;
    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("div");
    element.className = "invader";
    element.style.position = "absolute";
    element.style.width = `${this.width}px`;
    element.style.height = `${this.height}px`;
    this.updatePosition(element);
    return element;
  }

  updatePosition(element = this.element) {
    element.style.left = `${this.x}px`;
    element.style.top = `${this.y}px`;
  }

  remove() {
    this.element.remove();
  }
}

export function moveInvaders() {
  let touchedEdge = false;
  const margin = 20;

  invaders.forEach((invader) => {
    invader.x += direction;

    if (
      invader.x <= margin ||
      invader.x >= gameWidth - invader.width - margin
    ) {
      touchedEdge = true;
    }
  });

  if (touchedEdge) {
    direction *= -1;
    const game = document.getElementById("game-container");
    invaders.forEach((invader) => {
      invader.y += 15;
      //Collision avec la bordure du bas
      if (invader.y > game.offsetHeight - invader.height) {
        invader.remove();
      }
    });
  }

  invaders.forEach((invader) => invader.updatePosition());
}

export function setupGame() {
  const game_container = document.getElementById("game-container");
  // Create invaders grid
  const rows = 5;
  const cols = 10;
  const spacing = 40;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const invader = new Invader(col * spacing + 50, row * spacing + 30);
      invaders.push(invader);
      game_container.appendChild(invader.element);
    }
  }
}

/*
class InvaderGroup {
  constructor(game) {
    this.game = game;
    this.invaders = this.createInvaders();
    this.groupPosition = { x: 0, y: 30 }; // Position du groupe
    this.direction = 1; // 1 pour droite, -1 pour gauche
    this.speed = 0.5; // Vitesse de déplacement
    this.moveDownDistance = 30; // Distance de descente
  }

  createInvaders() {
    const invaders = [];
    const invaderSpacing = 30;

    for (let i = 0; i < 4; i++) {
      const x = invaderSpacing + (i % 8) * invaderSpacing;
      const y = 30 + Math.floor(i / 8) * invaderSpacing;
      // Création d'un enemy
      invaders.push(new Invader(this.game, { x: x, y: y }));
    }
    return invaders;
  }

  update() {
    // Vérifier les limites avant de bouger
    this.checkBounds();

    // Déplacer le groupe
    this.groupPosition.x += this.direction * this.speed;

    // Mettre à jour la position de chaque invader
    this.invaders.forEach((invader) => {
      invader.position_enemy.x = this.groupPosition.x + invader.initialX;
      invader.position_enemy.y = this.groupPosition.y + invader.initialY;
      invader.updatePosition();
    });
  }

  move(dx, dy) {
    this.groupPosition.x += dx;
    this.groupPosition.y += dy;

    this.invaders.forEach((invader) => {
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
    const gameWidth = document.getElementById("game-container").clientWidth;
    const leftMost = this.groupPosition.x;
    const rightMost = this.groupPosition.x + 7 * 30; // 8 colonnes * 30px d'espacement

    if (leftMost <= 0 || rightMost >= gameWidth) {
      this.direction *= -1; // Inverser la direction
      this.moveDown(); // Descendre
    }
  }

  moveDown() {
    this.groupPosition.y += this.moveDownDistance;
  }
}

// Fonction pour créer le jeu
const game = {
  invaders: [],
  invadersBelow: function (invader) {
    // Logique pour vérifier s'il y a des envahisseurs en dessous
    return false;
  },
  moveInvadersDown: function () {
    this.invaders.forEach((invader) => {
      // Cette méthode n'est plus utilisée car le mouvement est géré par InvaderGroup
    });
  },
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

*/
