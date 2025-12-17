// game/HelixJump.js - 화려한 Helix Jump!
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#121212;">
            <h2>🌈 Helix Jump</h2>
            <p>클릭 또는 스페이스로 공 떨어뜨리기!</p>
            <canvas id="gameCanvas" width="400" height="600" style="border:4px solid #ff4081; background:#000; border-radius:15px;"></canvas>
            <p style="font-size:20px; color:#ff4081; margin-top:10px;">점수: <span id="score">0</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');

    let ball = { x: 200, y: 50, vy: 0, radius: 20 };
    let platforms = [];
    let colors = ['#ff4081', '#3f51b5', '#4caf50', '#ffeb3b', '#ff9800', '#9c27b0'];
    let score = 0;
    let rotation = 0;
    let gameLoop;

    function createPlatform(y) {
        const gap = Math.floor(Math.random() * 4) * 90;
        platforms.push({ y, gap, color: colors[Math.floor(Math.random() * colors.length)] });
    }

    for (let i = 0; i < 15; i++) createPlatform(100 + i * 100);

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        rotation += 0.01;

        platforms.forEach(p => {
            ctx.save();
            ctx.translate(200, p.y);
            ctx.rotate(rotation);
            ctx.fillStyle = p.color;
            for (let i = 0; i < 4; i++) {
                if (i !== p.gap/90) {
                    ctx.fillRect(-150, -20, 300, 40);
                }
                ctx.rotate(Math.PI/2);
            }
            ctx.restore();
        });

        // 공
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fff';
        ctx.fill();

        // 충돌 & 점수
        platforms.forEach(p => {
            if (ball.y + ball.radius > p.y - 20 && ball.y - ball.radius < p.y + 20) {
                const angle = Math.atan2(ball.x - 200, p.y - ball.y) + rotation;
                const segment = Math.floor((angle + Math.PI) / (Math.PI/2));
                if (segment !== p.gap/90) {
                    ball.vy = 8;
                    score++;
                    scoreEl.textContent = score;
                    if (score % 5 === 0) createPlatform(platforms[0].y - 100);
                }
            }
        });

        ball.vy += 0.3;
        ball.y += ball.vy;

        if (ball.y > canvas.height + 50) {
            clearInterval(gameLoop);
            alert(`게임 오버! 점수: ${score}`);
        }
    }

    function drop() {
        ball.vy = 8;
    }

    canvas.addEventListener('click', drop);
    window.addEventListener('keydown', e => {
        if (e.key === ' ') { e.preventDefault(); drop(); }
    });

    gameLoop = setInterval(draw, 1000/60);
}