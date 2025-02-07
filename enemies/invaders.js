
// VOIR POUR DEPLACMENT DES INVADERS VERS LE BAS
// LES INVADERS DESCENDENT INDIVIDUELLEMENT ET NON PAR GROUPE (LIGNE)
// VOIR POUR DEFINIR LA LIMITE DE LA FENETRE DE JEU (DROITE ET GAUCHE)
// FAIRE LES PROJECTILES ENNEMIES, EN MODE ALEATOIRE
// FAIRE COLLISION AVEC SHOOT PLAYERS + SUPPRIMER LE INVADERS TOUCHE
// CREATION DES ANIMATIONS
// FAIRE LA LIGNE DE PROTECTION
// DEFINIR LE GAME OVER LORSQU'UN INVADER ATTEINT LA LIGNE FINALE

import { Bullet, shootEnemy } from "../enemies/shootEnemy.js";


let direction = 1;
export let invaders = [];
let gameWidth = document.getElementById("game-container").clientWidth;

class Invader {
  constructor(x, y, id) {
    this.width = 30;
    this.height = 20;
    this.x = x;
    this.y = y;
    this.id = id

    this.element = this.createElement();
  }
  
  createElement() {
    const element = document.createElement("div");
    const STPng = document.createElement("img")
    const tiePng = document.createElement("img")
    const tieDVPng = document.createElement("img")
    STPng.src = "/web/assets/stormtrooper.png"
    STPng.alt = "stormtrooper"
    tiePng.src = "/web/assets/tie.png"
    tiePng.alt = "tie"
    tieDVPng.src = "/web/assets/tieDV.png"
    tieDVPng.alt = "tieDV"

    element.appendChild(tieDVPng)
    
    element.id = `invader-${this.id}`
    //modifier l'image que l'on veut ici
    element.className = "invader tie";
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
  setInterval(checkGameOverLine, 100);
}

function checkGameOverLine() {
  const gameOverLine = document.querySelector('.game-over-line');
  const linePosition = gameOverLine.getBoundingClientRect().top;
  
  invaders.forEach(invader => {
    const invaderBottom = invader.element.getBoundingClientRect().bottom;
    if (invaderBottom > linePosition) {
      gameOver();
    }
  });
}

export function setupGame() {
  const game_container = document.getElementById("game-container");
  const gameOverLine = document.createElement('div');
  gameOverLine.className = 'game-over-line';
  document.getElementById('game-container').appendChild(gameOverLine);
  // Create invaders grid
  const rows = 5;
  const cols = 10;
  const spacing = 40;
  let invaderId = 1
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const invader = new Invader(col * spacing + 50, row * spacing + 30, invaderId);
      invader.id = invaderId
      invaderId ++
      invaders.push(invader);
      game_container.appendChild(invader.element);
    }
  }


    // Appel à shootEnemy pour chaque invader à intervalles réguliers
    setInterval(() => {
      const randomInvader = invaders[Math.floor(Math.random() * invaders.length)];
      if (randomInvader) {
        shootEnemy(randomInvader);
      }
    }, 3000); // Les envahisseurs tirent toutes les secondes
  }