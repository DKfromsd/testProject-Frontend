// game/SpaceInvaders.js
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#000; color:#0ff; font-family:monospace;">
            <h2>Space Invaders</h2>
            <p>← → 이동 | 스페이스 발사 | ESC 종료</p>
            <canvas id="gameCanvas" width="500" height="600" style="border:3px solid #0ff; background:#111;"></canvas>
            <p>점수: <span id="score">0</span> | 생명: <span id="lives">3</span></p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');
    const livesEl = container.querySelector('#lives');

    let player = { x: 225, y: 550, width: 50, height: 30, speed: 6 };
    let bullets = [];
    let enemies = [];
    let enemyBullets = [];
    let score = 0;
    let lives = 3;
    let gameLoop;
    let keys = {};
    let enemyDirection = 1;
    let enemySpeed = 0.5;

    // 적군 초기화 (5x11 행렬)
    function initEnemies() {
        enemies = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                enemies.push({
                    x: 50 + col * 40,
                    y: 50 + row * 40,
                    width: 30,
                    height: 25,
                    alive: true
                });
            }
        }
    }

    function drawPlayer() {
        ctx.fillStyle = '#0ff';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.fillStyle = '#fff';
        ctx.fillRect(player.x + 5, player.y + 5, 10, 10);
        ctx.fillRect(player.x + 35, player.y + 5, 10, 10);
    }

    function drawEnemies() {
        enemies.forEach(e => {
            if (e.alive) {
                ctx.fillStyle = '#f0f';
                ctx.fillRect(e.x, e.y, e.width, e.height);
            }
        });
    }

    function shoot() {
        bullets.push({ x: player.x + 20, y: player.y, width: 4, height: 12, speed: 8 });
    }

    function enemyShoot() {
        const aliveEnemies = enemies.filter(e => e.alive);
        if (aliveEnemies.length > 0 && Math.random() < 0.01) {
            const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            enemyBullets.push({ x: shooter.x + 13, y: shooter.y + 25, width: 4, height: 8, speed: 4 });
        }
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 플레이어 이동
        if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

        // 적군 이동
        let edgeHit = false;
        enemies.forEach(e => {
            if (e.alive) {
                e.x += enemyDirection * enemySpeed;
                if (e.x <= 0 || e.x >= canvas.width - e.width) edgeHit = true;
            }
        });
        if (edgeHit) {
            enemyDirection *= -1;
            enemies.forEach(e => { if (e.alive) e.y += 20; });
        }

        // 총알 업데이트
        bullets = bullets.filter(b => {
            b.y -= b.speed;
            return b.y > -20;
        });
        enemyBullets = enemyBullets.filter(b => {
            b.y += b.speed;
            return b.y < canvas.height;
        });

        // 충돌
        bullets.forEach((b, bi) => {
            enemies.forEach((e, ei) => {
                if (e.alive && b.x < e.x + e.width && b.x > e.x && b.y < e.y + e.height && b.y > e.y) {
                    e.alive = false;
                    bullets.splice(bi, 1);
                    score += 10;
                    scoreEl.textContent = score;
                }
            });
        });

        enemyBullets.forEach((eb, ebi) => {
            if (eb.x < player.x + player.width && eb.x > player.x && eb.y < player.y + player.height && eb.y > player.y) {
                lives--;
                livesEl.textContent = lives;
                enemyBullets.splice(ebi, 1);
                if (lives <= 0) {
                    clearInterval(gameLoop);
                    alert(`게임 오버! 점수: ${score}`);
                }
            }
        });

        // 적군 발사
        enemyShoot();

        // 그리기
        drawPlayer();
        drawEnemies();
        ctx.fillStyle = '#0f0'; bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
        ctx.fillStyle = '#f00'; enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
    }

    // 이벤트
    window.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.key === ' ') { e.preventDefault(); shoot(); }
        if (e.key === 'Escape') {
            clearInterval(gameLoop);
            container.innerHTML = '<h2 style="color:#0ff;">Space Invaders 종료됨</h2>';
        }
    });
    window.addEventListener('keyup', e => keys[e.key] = false);

    initEnemies();
    gameLoop = setInterval(update, 1000 / 60);
    canvas.focus();
}
