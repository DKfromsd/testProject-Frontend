// game/DinoCatRun.js - 뚱냥이 뛰는 귀여운 버전!
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#fff8e1; color:#5d4037;">
            <h2>😼 Dino Cat Run</h2>
            <p>스페이스 또는 클릭으로 점프!</p>
            <canvas id="gameCanvas" width="600" height="400" style="border:4px solid #ffab91; background:linear-gradient(to bottom, #ffecb3 0%, #fff8e1 100%); border-radius:15px;"></canvas>
            <p style="font-size:20px; margin-top:10px;">점수: <span id="score">0</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');

    const player = {
        x: 100,
        y: 280,
        vy: 0,
        width: 60,
        height: 50,
        gravity: 0.5,
        jumpPower: -13,
        grounded: false
    };

    let obstacles = [];
    let clouds = [];
    let score = 0;
    let gameSpeed = 3;
    let gameLoop;

    function drawCat() {
        ctx.save();
        ctx.translate(player.x + 30, player.y + 40);
        // 뚱냥이 몸통
        ctx.fillStyle = '#ffab91';
        ctx.beginPath();
        ctx.arc(0, -10, 28, 0, Math.PI*2);
        ctx.fill();
        // 귀
        ctx.fillStyle = '#ff8a65';
        ctx.beginPath();
        ctx.moveTo(-20, -30);
        ctx.lineTo(-25, -45);
        ctx.lineTo(-15, -35);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(20, -30);
        ctx.lineTo(25, -45);
        ctx.lineTo(15, -35);
        ctx.fill();
        // 눈
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-10, -15, 8, 0, Math.PI*2);
        ctx.arc(10, -15, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-10, -15, 4, 0, Math.PI*2);
        ctx.arc(10, -15, 4, 0, Math.PI*2);
        ctx.fill();
        // 꼬리
        ctx.strokeStyle = '#ff8a65';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(30, -5);
        ctx.quadraticCurveTo(45, -20, 55, -10);
        ctx.stroke();
        ctx.restore();
    }

    function jump() {
        if (player.grounded) player.vy = player.jumpPower;
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 바닥
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, 340, canvas.width, 60);

        player.vy += player.gravity;
        player.y += player.vy;
        if (player.y >= 280) {
            player.y = 280;
            player.vy = 0;
            player.grounded = true;
        } else player.grounded = false;

        // 장애물 (선인장)
        if (Math.random() < 0.01) {
            obstacles.push({
                x: canvas.width,
                y: 300,
                width: 40,
                height: 80
            });
        }

        obstacles.forEach((o, i) => {
            o.x -= gameSpeed;
            ctx.fillStyle = '#689f38';
            ctx.fillRect(o.x, o.y, o.width, o.height);
            if (o.x < -50) obstacles.splice(i, 1);

            // 충돌
            if (player.x + player.width > o.x && player.x < o.x + o.width && player.y + player.height > o.y) {
                clearInterval(gameLoop);
                alert(`냐옹... 게임 오버! 점수: ${score}`);
                return;
            }
        });

        // 구름
        if (Math.random() < 0.02) clouds.push({ x: canvas.width, y: Math.random() * 150 + 50 });
        clouds.forEach(c => {
            c.x -= gameSpeed * 0.3;
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.beginPath();
            ctx.arc(c.x, c.y, 20, 0, Math.PI*2);
            ctx.arc(c.x + 25, c.y, 25, 0, Math.PI*2);
            ctx.arc(c.x + 50, c.y, 20, 0, Math.PI*2);
            ctx.fill();
        });
        clouds = clouds.filter(c => c.x > -100);

        score += 0.1;
        scoreEl.textContent = Math.floor(score);
        if (score % 50 === 0) gameSpeed += 0.2;

        drawCat();
    }

    canvas.addEventListener('click', jump);
    window.addEventListener('keydown', e => {
        if (e.key === ' ') { e.preventDefault(); jump(); }
    });

    gameLoop = setInterval(update, 1000/60);
}