export const createProtectionBlocks = () => {
  const lineOfProtection = document.getElementById("line-of-protection");
  const gameContainer = document.getElementById("game-container");
  const containerWidth = gameContainer.offsetWidth;
  const spacing = containerWidth / 5; // Divise l'espace en 5 pour avoir 4 blocs bien espacés

  for (let i = 0; i < 4; i++) {
    const block = document.createElement("div");
    block.className = "protection-block wall";
    block.id = `protection-block-${i}`;

    // Calcul de la position horizontale
    // On commence à spacing pour avoir une marge au début
    // et on multiplie par (i + 1) pour positionner chaque bloc
    block.style.left = `${spacing * (i + 1) - 30}px`; // -30 pour centrer le bloc de 60px

    const wallJPEG = document.createElement("img");
    wallJPEG.src = "/web/assets/wall1.png";
    wallJPEG.alt = "wall";

    const number = document.createElement("span");
    number.className = "block-number";
    number.id = `block-number-${i}`;
    number.textContent = "3";

    block.appendChild(wallJPEG);
    block.appendChild(number);
    lineOfProtection.appendChild(block);
  }
};
export const clearProtectionBlocks = () => {
  const blocks = document.querySelectorAll(".protection-block");
  blocks.forEach((block) => {
    block.remove();
  });
};
