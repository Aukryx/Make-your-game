const grid = document.getElementById("grid")

const bloc = document.createElement("div")


const createLine = (lineCount) => {
    for (let i = 1; i <= lineCount; i++) {
        const line = document.createElement("div");
        line.setAttribute("class", "line");
        line.id = `line-${i}`;
        grid.appendChild(line);
    }
}
createLine(30);

const createEnnemies = (ennemiesCount) => {
    let line = 1;
    for (let i = 1; i <= ennemiesCount; i++) {
        const ennemy = document.createElement("div");
        ennemy.setAttribute("class", "ennemy");
        ennemy.id = `ennemy-${i}`;
        
        const currentLine = document.getElementById(`line-${line}`);
        
        if (currentLine) {
            currentLine.appendChild(ennemy);
        } else {
            console.error(`La ligne ${line} n'existe pas`);
        }
        
        if (i % 10 === 0) {
            line++;
        }
    }
}

createEnnemies(50);

const createProtectionBlocks = () => {
    const lineOfProtection = document.getElementById('line-of-protection');
    for (let i = 0; i < 4; i++) {
        const block = document.createElement('div');
        block.className = 'protection-block';
        block.id = `protection-block-${i}`;
        lineOfProtection.appendChild(block);
    }
}

createProtectionBlocks();

