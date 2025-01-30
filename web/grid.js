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

