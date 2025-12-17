// game/HamsterRun.js - 햄스터 휠 굴리며 달리기!
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#fff3e0; color:#e65100;">
            <h2>🐹 Hamster Run</h2>
            <p>스페이스 또는 클릭으로 점프!</p>
            <canvas id="gameCanvas" width="600" height="400" style="border:4px solid #ff8a65; background:linear-gradient(to bottom, #ffe0b2 0%, #fff3e0 100%); border-radius:15px;"></canvas>
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
        grounded: false,
        wheelAngle: 0
    };

    let obstacles = [];
    let score = 0;
    let gameSpeed = 3;
    let gameLoop;

    function drawHamster() {
        ctx.save();
        ctx.translate(player.x + 30, player.y + 40);

        // 휠
        player.wheelAngle += gameSpeed * 0.3;
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI*2);
        ctx.stroke();
        for (let i = 0; i < 8; i++) {
            ctx.save();
            ctx.rotate(player.wheelAngle + i * Math.PI/4);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(35, 0);
            ctx.stroke();
            ctx.restore();
        }

        // 햄스터 몸통
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(0, -10, 25, 0, Math.PI*2);
        ctx.fill();
        // 머리
        ctx.fillStyle = '#ffab40';
        ctx.beginPath();
        ctx.arc(-10, -20, 15, 0, Math.PI*2);
        ctx.fill();
        // 눈
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-15, -22, 4, 0, Math.PI*2);
        ctx.arc(-5, -22, 4, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-14, -23, 2, 0, Math.PI*2);
        ctx.arc(-4, -23, 2, 0, Math.PI*2);
        ctx.fill();

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

        if (Math.random() < 0.01) {
            obstacles.push({
                x: canvas.width,
                y: 300,
                width: 40,
                height: 70
            });
        }

        obstacles.forEach((o, i) => {
            o.x -= gameSpeed;
            ctx.fillStyle = '#8bc34a';
            ctx.fillRect(o.x, o.y, o.width, o.height);
            if (o.x < -50) obstacles.splice(i, 1);

            if (player.x + player.width > o.x && player.x < o.x + o.width && player.y + player.height > o.y) {
                clearInterval(gameLoop);
                alert(`삐약... 게임 오버! 점수: ${score}`);
                return;
            }
        });

        score += 0.1;
        scoreEl.textContent = Math.floor(score);
        if (score % 50 === 0) gameSpeed += 0.2;

        drawHamster();
    }

    canvas.addEventListener('click', jump);
    window.addEventListener('keydown', e => {
        if (e.key === ' ') { e.preventDefault(); jump(); }
    });

    gameLoop = setInterval(update, 1000/60);
}