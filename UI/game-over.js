// game-over.js
const gameOverMenu = document.getElementById("game-over-menu");
const gameOverOverlay = document.createElement("div");
gameOverOverlay.className = 'game-over-overlay'
document.body.appendChild(gameOverOverlay)
let isGameOver = false;

// Configuration du menu de Game Over
gameOverMenu.innerHTML = `
  <h2 style="color: white; margin-bottom: 2rem;">Game Over</h2>
  <h3 id="final-score" style="color: white; margin-bottom: 2rem;"></h3>
  <button id="restart-btn" class="pause-button">Restart</button>
  <button id="return-menu-btn" class="pause-button">Return Menu</button>
`;

const finalScore = document.getElementById("final-score");

function gameOver() {
    if (!isGameOver) {
        isGameOver = true;
        finalScore.textContent = `Final Score: ${score.textContent}`;

        stopTimer();

        // Assombrir les éléments du jeu
        mainElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) element.classList.add('game-over');
        });

        // Afficher l'overlay et le menu de Game Over
        gameOverOverlay.style.display = 'block';
        gameOverMenu.style.display = 'block';

        // Désactiver les contrôles du jeu
        document.removeEventListener('keydown', handleKeyPress);
    }
}

// Événements des boutons
document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('return-menu-btn').addEventListener('click', returnToMenu);

// Fonction pour perdre une vie
function loseLife() {
    currentLives--;
    livesDisplay.textContent = currentLives;
    
    if (currentLives <= 0) {
        gameOver();
    }
}

// Pour tester la fonction gameOver
document.addEventListener('keydown', (event) => {
    if (event.key === 'k') {
        loseLife();
        console.log(currentLives);
    }
});


function gameOver(){
    if (!isGameOver){
        isGameOver = true
        finalScore.textContent = score.textContent


        stopTimer()

        mainElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) element.classList.add('game-over');
        });

        gameOverOverlay.style.display = 'block';
        gameOverMenu.style.display = 'block';

        document.removeEventListener('keydown', handleKeyPress);
    }

    document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('return-menu-btn').addEventListener('click', returnToMenu);
    }