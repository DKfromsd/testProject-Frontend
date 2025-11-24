

// game/omok.js
export function init(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2>Omok (Gomoku)</h2>
            <div class="omok-grid"></div>
            <button id="resetOmokGame">Reset Omok Game</button>
        </div>
    `;


    const omokGrid = container.querySelector('.omok-grid');
    let omokGridItems = [];
    let currentPlayer = 'X';
    let omokGameOver = false;
    const BOARD_SIZE = 15;
    const WINNING_LENGTH = 5;


    // 그리드 초기화
    function initializeOmokGrid() {
        omokGridItems = [];
        omokGrid.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
            const item = document.createElement('div');
            item.classList.add('omok-grid-item');
            item.addEventListener('click', () => handleOmokMove(item));
            omokGrid.appendChild(item);
            omokGridItems.push(item);
        }
    }


    // 좌표로 셀 가져오기
    function getCell(row, col) {
        if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            return omokGridItems[row * BOARD_SIZE + col];
        }
        return null;
    }


    // 방향별 승리 체크
    function checkDirection(player, row, col, dr, dc) {
        let count = 0;
        for (let i = 0; i < WINNING_LENGTH; i++) {
            const r = row + i * dr;
            const c = col + i * dc;
            const cell = getCell(r, c);
            if (cell && cell.textContent === player) {
                count++;
            } else {
                break;
            }
        }
        return count === WINNING_LENGTH;
    }


    // 전체 승리 체크
    function checkOmokWinner(player) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = getCell(row, col);
                if (cell && cell.textContent === player) {
                    if (
                        checkDirection(player, row, col, 0, 1) ||   // 가로
                        checkDirection(player, row, col, 1, 0) ||   // 세로
                        checkDirection(player, row, col, 1, 1) ||   // 대각선 \
                        checkDirection(player, row, col, 1, -1)     // 대각선 /
                    ) {
                        // 승리한 라인 하이라이트 (옵션)
                        highlightWinningLine(player, row, col);
                        return true;
                    }
                }
            }
        }
        return false;
    }


    // 승리한 라인 하이라이트 (보너스)
    function highlightWinningLine(player, row, col) {
        const directions = [[0,1], [1,0], [1,1], [1,-1]];
        for (const [dr, dc] of directions) {
            let valid = true;
            for (let i = 0; i < WINNING_LENGTH; i++) {
                const r = row + i * dr;
                const c = col + i * dc;
                if (!getCell(r, c) || getCell(r, c).textContent !== player) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                for (let i = 0; i < WINNING_LENGTH; i++) {
                    const r = row + i * dr;
                    const c = col + i * dc;
                    getCell(r, c).classList.add('winner');
                }
                break;
            }
        }
    }


    // 오목 두기
    function handleOmokMove(item) {
        if (omokGameOver || item.textContent) return;


        item.textContent = currentPlayer;
        item.classList.add(currentPlayer === 'X' ? 'playerX' : 'playerO');


        if (checkOmokWinner(currentPlayer)) {
            endOmokGame(`${currentPlayer} Wins!`);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }


    // 게임 종료 메시지
    function endOmokGame(message) {
        if (omokGameOver) return;
        omokGameOver = true;
        const result = document.createElement('p');
        result.textContent = message;
        result.classList.add('result');
        container.appendChild(result);
    }


    // 리셋
    function resetOmokGame() {
        initializeOmokGrid();
        currentPlayer = 'X';
        omokGameOver = false;
        const oldResult = container.querySelector('.result');
        if (oldResult) oldResult.remove();
    }


    // 이벤트 연결
    container.querySelector('#resetOmokGame').addEventListener('click', resetOmokGame);


    // 초기화 실행
    initializeOmokGrid();
}
