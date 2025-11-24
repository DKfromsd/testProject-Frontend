export function init(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2>Tic Tac Toe</h2>
            <div class="menu">
                <button id="pvpButton" class="selected">Player vs Player</button>
                <button id="pvsButton">Player vs System</button>
            </div>
            <div class="grid-container">
                ${Array(9).fill().map((_, i) => `<div class="grid-item"></div>`).join('')}
            </div>
            <button id="resetButton">Reset Game</button>
        </div>
    `;

    // 여기부터 기존 TicTacToe 로직 그대로 복붙 (약간 정리)
    const gridItems = container.querySelectorAll('.grid-item');
    const resetButton = container.querySelector('#resetButton');
    const pvpButton = container.querySelector('#pvpButton');
    const pvsButton = container.querySelector('#pvsButton');
    let currentPlayer = 'X';
    let gameMode = 'PvP';
    let gameOver = false;

    const winningCombinations = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    const updateModeVisuals = (selected) => {
        pvpButton.classList.toggle('selected', selected === pvpButton);
        pvsButton.classList.toggle('selected', selected === pvsButton);
    };

    const resetGame = () => {
        gridItems.forEach(item => {
            item.textContent = "";
            item.className = "grid-item";
        });
        currentPlayer = "X";
        gameOver = false;
        const result = container.querySelector('.result');
        if (result) result.remove();
    };

    const endGame = (msg) => {
        if (gameOver) return;
        gameOver = true;
        const p = document.createElement('p');
        p.textContent = msg;
        p.className = 'result';
        container.appendChild(p);
    };

    const checkWinner = (p) => winningCombinations.some(comb => 
        comb.every(i => gridItems[i].textContent === p)
    );

    const systemMove = () => {
        const empty = [...gridItems].filter(c => c.textContent === '');
        if (empty.length === 0) return;
        const cell = empty[Math.floor(Math.random() * empty.length)];
        cell.textContent = 'O';
        cell.classList.add('playerO');
        if (checkWinner('O')) endGame('System Wins!');
        else if ([...gridItems].every(c => c.textContent !== '')) endGame("Tie!");
        else currentPlayer = 'X';
    };

    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.textContent || gameOver) return;
            item.textContent = currentPlayer;
            item.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');
            if (checkWinner(currentPlayer)) {
                endGame(currentPlayer + ' Wins!');
            } else if ([...gridItems].every(c => c.textContent !== '')) {
                endGame("Tie!");
            } else if (gameMode === 'PvP') {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            } else if (currentPlayer === 'X') {
                currentPlayer = 'O';
                setTimeout(systemMove, 400);
            }
        });
    });

    pvpButton.onclick = () => { gameMode = 'PvP'; updateModeVisuals(pvpButton); resetGame(); };
    pvsButton.onclick = () => { gameMode = 'PvS'; updateModeVisuals(pvsButton); resetGame(); };
    resetButton.onclick = resetGame;
}
