// game/Tetris.js
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#000; color:#0f0; font-family:monospace;">
            <h2>Tetris</h2>
            <p>← → 이동 | ↑ 회전 | ↓ 빠르게 | 스페이스 드롭 | ESC 종료</p>
            <canvas id="gameCanvas" width="300" height="600" style="border:3px solid #0f0; background:#111;"></canvas>
            <canvas id="nextCanvas" width="120" height="120" style="border:1px solid #0f0; background:#222;"></canvas>
            <p>점수: <span id="score">0</span> | 라인: <span id="lines">0</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const nextCtx = container.querySelector('#nextCanvas').getContext('2d');
    const scoreEl = container.querySelector('#score');
    const linesEl = container.querySelector('#lines');

    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    let currentPiece = null;
    let nextPiece = null;
    let score = 0;
    let lines = 0;
    let dropTime = 0;
    let dropInterval = 1000;
    let keys = {};
    let gameLoop;

    const PIECES = [
        [[1,1,1,1]], // I
        [[1,1],[1,1]], // O
        [[1,1,1],[0,1,0]], // T
        [[1,1,0],[0,0,1]], // S
        [[0,1,1],[1,1,0]], // Z
        [[1,1,1],[1,0,0]], // J
        [[1,1,1],[0,0,1]]  // L
    ];
    const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#00f000', '#f00000', '#0000f0', '#f0a000'];

    function newPiece() {
        currentPiece = {
            shape: nextPiece || PIECES[Math.floor(Math.random() * PIECES.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            x: 3,
            y: 0
        };
        nextPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
        drawNext();
    }

    function rotatePiece() {
        const rotated = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i]).reverse());
        if (!collides(rotated)) currentPiece.shape = rotated;
    }

    function collides(shape = currentPiece.shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const nx = currentPiece.x + x;
                    const ny = currentPiece.y + y;
                    if (nx < 0 || nx >= BOARD_WIDTH || ny >= BOARD_HEIGHT || (ny >= 0 && board[ny][nx])) return true;
                }
            }
        }
        return false;
    }

    function move(dx, dy) {
        currentPiece.x += dx;
        currentPiece.y += dy;
        if (collides()) {
            currentPiece.x -= dx;
            currentPiece.y -= dy;
            return false;
        }
        return true;
    }

    function drop() {
        while (move(0, 1));
        placePiece();
    }

    function placePiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            });
        });
        clearLines();
        newPiece();
        if (collides()) {
            clearInterval(gameLoop);
            alert(`게임 오버! 점수: ${score}`);
        }
    }

    function clearLines() {
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (board[y].every(cell => cell)) {
                board.splice(y, 1);
                board.unshift(Array(BOARD_WIDTH).fill(0));
                lines++;
                score += 100;
            }
        }
        scoreEl.textContent = score;
        linesEl.textContent = lines;
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                if (board[y][x]) {
                    ctx.fillStyle = board[y][x];
                    ctx.fillRect(x * 30, y * 30, 29, 29);
                }
            }
        }
    }

    function drawPiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect((currentPiece.x + x) * 30, (currentPiece.y + y) * 30, 29, 29);
                }
            });
        });
    }

    function drawNext() {
        nextCtx.clearRect(0, 0, 120, 120);
        nextCtx.fillStyle = '#333';
        nextCtx.fillRect(0, 0, 120, 120);
        nextPiece.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    nextCtx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
                    nextCtx.fillRect(x * 30 + 15, y * 30 + 15, 28, 28);
                }
            });
        });
    }

    function update() {
        drawBoard();
        drawPiece();

        dropTime++;
        if (dropTime > dropInterval) {
            if (!move(0, 1)) placePiece();
            dropTime = 0;
        }
    }

    // 이벤트
    window.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.key === 'ArrowLeft' && !keys['ArrowRight']) move(-1, 0);
        if (e.key === 'ArrowRight' && !keys['ArrowLeft']) move(1, 0);
        if (e.key === 'ArrowDown') dropInterval = 50;
        if (e.key === 'ArrowUp') rotatePiece();
        if (e.key === ' ') drop();
        if (e.key === 'Escape') {
            clearInterval(gameLoop);
            container.innerHTML = '<h2 style="color:#0f0;">Tetris 종료됨</h2>';
        }
    });
    window.addEventListener('keyup', e => {
        keys[e.key] = false;
        if (e.key === 'ArrowDown') dropInterval = 1000;
    });

    newPiece();
    gameLoop = setInterval(update, 1000 / 60);
    canvas.focus();
}
