// game/PianoTiles.js - 요즘 감성 네온 피아노 타일!
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#000;">
            <h2>🎹 Piano Tiles</h2>
            <p>클릭으로 타일 누르기!</p>
            <canvas id="gameCanvas" width="400" height="600" style="border:4px solid #00ffea; background:#000; border-radius:15px;"></canvas>
            <p style="font-size:20px; color:#00ffea; margin-top:10px;">점수: <span id="score">0</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');

    const cols = 4;
    const tileHeight = 150;
    let tiles = [];
    let score = 0;
    let gameLoop;
    let speed = 3;

    function createTile() {
        const col = Math.floor(Math.random() * cols);
        tiles.push({ col, y: -tileHeight, active: true });
    }

    for (let i = 0; i < 4; i++) createTile();

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        tiles.forEach((t, i) => {
            t.y += speed;

            if (t.active) {
                ctx.fillStyle = '#00ffea';
                ctx.shadowBlur = 30;
                ctx.shadowColor = '#00ffea';
            } else {
                ctx.fillStyle = '#ff0040';
                ctx.shadowBlur = 30;
                ctx.shadowColor = '#ff0040';
            }

            ctx.fillRect(t.col * 100, t.y, 100, tileHeight);

            if (t.y > canvas.height) {
                if (t.active) {
                    clearInterval(gameLoop);
                    alert(`게임 오버! 점수: ${score}`);
                }
                tiles.splice(i, 1);
                createTile();
            }
        });

        ctx.shadowBlur = 0;
    }

    canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const col = Math.floor(x / 100);

        for (let i = tiles.length - 1; i >= 0; i--) {
            const t = tiles[i];
            if (t.col === col && t.y + tileHeight > canvas.height - 200) {
                if (t.active) {
                    tiles.splice(i, 1);
                    score++;
                    scoreEl.textContent = score;
                    speed += 0.1;
                    createTile();
                } else {
                    clearInterval(gameLoop);
                    alert(`게임 오버! 점수: ${score}`);
                }
                break;
            }
        }
    });

    gameLoop = setInterval(draw, 1000/60);
    setInterval(createTile, 1000);
}