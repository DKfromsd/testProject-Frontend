// game/ShibaDash.js - 시바견 대시 완전 수정 버전!
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#fce4ec; color:#c2185b;">
            <h2>🐕 Shiba Dash</h2>
            <p>스페이스 또는 클릭으로 점프!</p>
            <canvas id="gameCanvas" width="600" height="400" style="border:4px solid #e91e63; background:linear-gradient(to bottom, #f8bbd0 0%, #fce4ec 100%); border-radius:15px;"></canvas>
            <p style="font-size:20px; margin-top:10px;">점수: <span id="score">0</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');

    const player = {
        x: 120,
        y: 260,
        vy: 0,
        width: 55,
        height: 45,
        gravity: 0.5,
        jumpPower: -13,
        grounded: false
    };

    let obstacles = [];
    let score = 0;
    let gameSpeed = 2.8;
    let gameLoop;

    function drawShiba() {
        ctx.save();
        ctx.translate(player.x + 30, player.y + 35);
        // 몸통
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(-30, -15, 55, 30);
        // 머리
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(-15, -25, 18, 0, Math.PI*2);
        ctx.fill();
        // 귀
        ctx.fillStyle = '#ff8a65';
        ctx.beginPath();
        ctx.moveTo(-25, -35);
        ctx.lineTo(-30, -45);
        ctx.lineTo(-20, -38);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-5, -35);
        ctx.lineTo(0, -45);
        ctx.lineTo(10, -38);
        ctx.fill();
        // 눈 & 코
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-20, -25, 4, 0, Math.PI*2);
        ctx.arc(-10, -25, 4, 0, Math.PI*2);
        ctx.arc(-15, -18, 3, 0, Math.PI*2);
        ctx.fill();
        // 꼬리
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.arc(30, -10, 12, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

    function jump() {
        if (player.grounded) {
            player.vy = player.jumpPower;
            player.grounded = false;
        }
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 물리
        player.vy += player.gravity;
        player.y += player.vy;
        if (player.y >= 260) {
            player.y = 260;
            player.vy = 0;
            player.grounded = true;
        } else {
            player.grounded = false;
        }

        // 장애물
        if (Math.random() < 0.009) {
            obstacles.push({
                x: canvas.width,
                y: 300,
                width: 45,
                height: 70
            });
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            const o = obstacles[i];
            o.x -= gameSpeed;

            // 충돌 체크 (정확!)
            if (
                player.x + player.width > o.x + 10 &&
                player.x < o.x + o.width - 10 &&
                player.y + player.height > o.y
            ) {
                clearInterval(gameLoop);
                alert(`게임 오버! 시바 힘내... 점수: ${score}`);
                return;
            }
            if (o.x < -100) obstacles.splice(i, 1);
        }

        // 점수 & 속도
        score += 0.12;
        scoreEl.textContent = Math.floor(score);
        if (score % 60 === 0) gameSpeed += 0.1;

        // 그리기
        drawShiba();
        obstacles.forEach(o => {
            ctx.fillStyle = '#e91e63';
            ctx.fillRect(o.x, o.y, o.width, o.height);
        });
    }

    canvas.addEventListener('click', jump);
    window.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
    });

    gameLoop = setInterval(update, 1000/60);
}