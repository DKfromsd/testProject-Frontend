export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#000; color:#0f0; font-family:monospace;">
            <h2>Galaga Shooter</h2>
            <p>← → 이동 | 스페이스 발사 | ESC로 나가기</p>
            <canvas id="gameCanvas" width="480" height="600" style="border:3px solid #0f0; background:#000;"></canvas>
            <p style="margin-top:10px;">점수: <span id="score">0</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');

    let player = { x: 240, y: 520, width: 40, height: 40, speed: 5 };
    let bullets = [];
    let enemies = [];
    let score = 0;
    let gameLoop;

    // 플레이어 그리기 (삼각형 우주선)
    function drawPlayer() {
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y - 20);
        ctx.lineTo(player.x - 20, player.y + 20);
        ctx.lineTo(player.x + 20, player.y + 20);
        ctx.closePath();
        ctx.fill();
    }

    // 적군 생성
    function spawnEnemy() {
        if (Math.random() < 0.02) {
            enemies.push({
                x: Math.random() * (canvas.width - 40) + 20,
                y: -40,
                width: 40,
                height: 40,
                speed: 1 + Math.random() * 2
            });
        }
    }

    // 적군 그리기
    function drawEnemies() {
        enemies.forEach(e => {
            ctx.fillStyle = '#f00';
            ctx.fillRect(e.x - 20, e.y - 20, e.width, e.height);
            // 눈 같은 거
            ctx.fillStyle = '#fff';
            ctx.fillRect(e.x - 10, e.y - 10, 8, 8);
            ctx.fillRect(e.x + 2, e.y - 10, 8, 8);
        });
    }

    // 총알
    function shoot() {
        bullets.push({
            x: player.x,
            y: player.y - 20,
            width: 6,
            height: 16,
            speed: 10
        });
    }

    // 충돌 체크
    function checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    // 게임 루프
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 적군 생성 & 이동
        spawnEnemy();
        enemies.forEach((e, i) => {
            e.y += e.speed;
            if (e.y > canvas.height + 50) enemies.splice(i, 1);
        });

        // 총알 이동 & 충돌
        bullets.forEach((b, i) => {
            b.y -= b.speed;
            if (b.y < -20) bullets.splice(i, 1);

            enemies.forEach((e, j) => {
                if (checkCollision(b, e)) {
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score += 10;
                    scoreEl.textContent = score;
                }
            });
        });

        // 그리기
        drawPlayer();
        drawEnemies();
        ctx.fillStyle = '#0f0';
        bullets.forEach(b => ctx.fillRect(b.x - 3, b.y, b.width, b.height));
    }

    // 키보드 컨트롤
    const keys = {};
    window.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.key === ' ') {
            e.preventDefault();
            shoot();
        }
        if (e.key === 'Escape') {
            clearInterval(gameLoop);
            container.innerHTML = '<h2 style="color:lime; text-align:center;">Galaga Shooter 종료됨<br>다시 시작하려면 버튼 클릭!</h2>';
        }
    });
    window.addEventListener('keyup', e => keys[e.key] = false);

    // 이동 업데이트
    function movePlayer() {
        if (keys['ArrowLeft'] && player.x > 30) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x < canvas.width - 30) player.x += player.speed;
    }

    // 메인 루프
    gameLoop = setInterval(() => {
        movePlayer();
        update();
    }, 1000 / 60);

    // 포커스 주기
    canvas.focus();
    canvas.tabIndex = 0;
}