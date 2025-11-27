// game/PenguinSlide.js - 완전 수정 버전 (점프+속도 완벽!)
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#e0f7fa; color:#0277bd;">
            <h2>🐧 Penguin Slide</h2>
            <p>스페이스 또는 클릭으로 점프!</p>
            <canvas id="gameCanvas" width="600" height="400" style="border:4px solid #0277bd; background:linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%); border-radius:15px;"></canvas>
            <p style="font-size:20px; margin-top:10px;">점수: <span id="score">0</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');

    // 플레이어 (충돌 박스 작게 조정!)
    const player = {
        x: 120,
        y: 250,
        vy: 0,
        width: 50,
        height: 45,
        gravity: 0.5,
        jumpPower: -12,
        grounded: false
    };

    let obstacles = [];
    let particles = [];
    let score = 0;
    let gameSpeed = 2.5;        // ← 원래보다 훨씬 느리게 시작
    let gameLoop;

    function drawPlayer() {
        ctx.save();
        ctx.translate(player.x + 25, player.y + 35);
        
        // 배 미끄러지는 펭귄
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(-25, -10, 50, 30);           // 몸통
        ctx.fillStyle = '#fff';
        ctx.fillRect(-23, -5, 46, 25);            // 하얀 배
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();                         // 머리
        ctx.arc(0, -20, 18, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#ff9800';                // 부리
        ctx.beginPath();
        ctx.moveTo(10, -18);
        ctx.lineTo(20, -15);
        ctx.lineTo(10, -12);
        ctx.fill();
        ctx.fillStyle = '#fff';                   // 눈
        ctx.beginPath();
        ctx.arc(-8, -22, 6, 0, Math.PI*2);
        ctx.arc(8, -22, 6, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-8, -22, 3, 0, Math.PI*2);
        ctx.arc(8, -22, 3, 0, Math.PI*2);
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

        // 바닥
        player.vy += player.gravity;
        player.y += player.vy;

        if (player.y >= 250) {
            player.y = 250;
            player.vy = 0;
            player.grounded = true;
        } else {
            player.grounded = false;
        }

        // 장애물 생성 (훨씬 덜 나옴)
        if (Math.random() < 0.008) {
            obstacles.push({
                x: canvas.width,
                y: 290,
                width: 50,
                height: 60
            });
        }

        // 장애물 이동 및 충돌 체크
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const o = obstacles[i];
            o.x -= gameSpeed;

            // 충돌 체크 (정확하게!)
            if (
                player.x + player.width > o.x + 10 &&
                player.x < o.x + o.width - 10 &&
                player.y + player.height > o.y
            ) {
                clearInterval(gameLoop);
                alert(`게임 오버! 점수: ${score}`);
                return;
            }

            if (o.x < -100) obstacles.splice(i, 1);
        }

        // 점수 (천천히 오름)
        score += 0.1;
        scoreEl.textContent = Math.floor(score);
        if (score % 50 === 0) gameSpeed += 0.1;   // 아주 천천히 빨라짐

        // 파티클 (눈송이)
        if (Math.random() < 0.3) {
            particles.push({
                x: canvas.width,
                y: Math.random() * 200,
                vy: 1 + Math.random(),
                alpha: 1
            });
        }
        particles = particles.filter(p => {
            p.x -= gameSpeed * 0.7;
            p.y += p.vy;
            p.alpha -= 0.01;
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = '#fff';
            ctx.fillRect(p.x, p.y, 4, 4);
            return p.alpha > 0;
        });
        ctx.globalAlpha = 1;

        // 그리기
        drawPlayer();
        obstacles.forEach(o => {
            ctx.fillStyle = '#81d4fa';
            ctx.fillRect(o.x + 5, o.y + 5, o.width - 10, o.height - 10);
            ctx.fillStyle = '#4fc3f7';
            ctx.fillRect(o.x, o.y, o.width, o.height);
        });
    }

    canvas.addEventListener('click', jump);
    window.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
        if (e.key === 'Escape') clearInterval(gameLoop);
    });

    gameLoop = setInterval(update, 1000/60);
}