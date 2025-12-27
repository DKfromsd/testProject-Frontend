// game/PicoPark.js - 순수 Canvas Pico Park 2인용 클론 (Phaser 없이!)
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#2c3e50; color:#ecf0f1; font-family:monospace;">
            <h2>👥 Pico Park (2인용)</h2>
            <p>P1: A/D 이동, W 점프 | P2: ←→ 이동, ↑ 점프 | ESC 리셋</p>
            <canvas id="picoCanvas" width="800" height="600" style="border:4px solid #3498db; background:#34495e; border-radius:15px;"></canvas>
            <p style="font-size:24px; margin-top:10px;">상태: <span id="status">플레이 중...</span></p>
        </div>
    `;

    const canvas = container.querySelector('#picoCanvas');
    const ctx = canvas.getContext('2d');
    const statusEl = container.querySelector('#status');

    const GRAVITY = 0.8;
    const JUMP = -15;
    const SPEED = 5;

    let p1 = { x: 100, y: 400, vx: 0, vy: 0, w: 40, h: 40, color: '#e74c3c' };
    let p2 = { x: 200, y: 400, vx: 0, vy: 0, w: 40, h: 40, color: '#3498db' };
    let key = { x: 400, y: 200, w: 20, h: 20, heldBy: null };
    let door = { x: 700, y: 520, w: 60, h: 80, open: false };

    let platforms = [
        // 바닥
        { x: 0, y: 568, w: 800, h: 32 },
        // 플랫폼
        { x: 150, y: 450, w: 200, h: 20 },
        { x: 450, y: 350, w: 200, h: 20 },
        { x: 300, y: 250, w: 200, h: 20 }
    ];

    let keys = {};
    let gameOver = false;

    function drawRect(obj, color) {
        ctx.fillStyle = color;
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    }

    function drawPlayer(p) {
        // 몸통
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w/2, 0, Math.PI*2);
        ctx.fill();
        // 눈
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x + p.w/3, p.y + p.h/3, 6, 0, Math.PI*2);
        ctx.arc(p.x + p.w*2/3, p.y + p.h/3, 6, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(p.x + p.w/3, p.y + p.h/3, 3, 0, Math.PI*2);
        ctx.arc(p.x + p.w*2/3, p.y + p.h/3, 3, 0, Math.PI*2);
        ctx.fill();
    }

    function drawKey() {
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(key.x, key.y, key.w, key.h);
        ctx.fillStyle = '#b8860b';
        ctx.fillRect(key.x + key.w/2 - 3, key.y - 10, 6, 15);
    }

    function drawDoor() {
        ctx.fillStyle = door.open ? '#27ae60' : '#8b4513';
        ctx.fillRect(door.x, door.y, door.w, door.h);
    }

    function updatePhysics(player) {
        player.vy += GRAVITY;
        player.y += player.vy;
        player.x += player.vx;

        // 바닥 충돌
        let onGround = false;
        for (let plat of platforms) {
            if (player.x + player.w > plat.x && player.x < plat.x + plat.w &&
                player.y + player.h > plat.y && player.y + player.h - player.vy <= plat.y + 10) {
                player.y = plat.y - player.h;
                player.vy = 0;
                onGround = true;
            }
        }
        player.grounded = onGround;

        // 벽 충돌 (간단)
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.w) player.x = canvas.width - player.w;
    }

    function handleInput() {
        // P1 (WASD)
        p1.vx = 0;
        if (keys['a'] || keys['A']) p1.vx = -SPEED;
        if (keys['d'] || keys['D']) p1.vx = SPEED;
        if ((keys['w'] || keys['W']) && p1.grounded) p1.vy = JUMP;

        // P2 (Arrows)
        p2.vx = 0;
        if (keys['ArrowLeft']) p2.vx = -SPEED;
        if (keys['ArrowRight']) p2.vx = SPEED;
        if (keys['ArrowUp'] && p2.grounded) p2.vy = JUMP;
    }

    function checkCollisions() {
        // 서로 밀기
        if (Math.abs(p1.x - p2.x) < p1.w && Math.abs(p1.y - p2.y) < p1.h) {
            if (p1.vx > 0 && p1.x < p2.x) p2.x += 2;
            if (p1.vx < 0 && p1.x > p2.x) p2.x -= 2;
            if (p2.vx > 0 && p2.x < p1.x) p1.x += 2;
            if (p2.vx < 0 && p2.x > p1.x) p1.x -= 2;
        }

        // 키 줍기
        if (key.heldBy === null) {
            if (Math.abs(p1.x + p1.w/2 - key.x - key.w/2) < 40 && Math.abs(p1.y + p1.h/2 - key.y - key.h/2) < 40) {
                key.heldBy = 'p1';
            }
            if (Math.abs(p2.x + p2.w/2 - key.x - key.w/2) < 40 && Math.abs(p2.y + p2.h/2 - key.y - key.h/2) < 40) {
                key.heldBy = 'p2';
            }
        }

        // 키 따라다니기
        if (key.heldBy === 'p1') {
            key.x = p1.x + p1.w/2 - key.w/2;
            key.y = p1.y - 30;
        } else if (key.heldBy === 'p2') {
            key.x = p2.x + p2.w/2 - key.w/2;
            key.y = p2.y - 30;
        }

        // 문 열기
        if (key.heldBy && Math.abs(p1.x + p1.w/2 - door.x - door.w/2) < 60 && p1.y > door.y - 100 ||
            Math.abs(p2.x + p2.w/2 - door.x - door.w/2) < 60 && p2.y > door.y - 100) {
            door.open = true;
            statusEl.textContent = 'GOAL REACHED! 🎉';
            gameOver = true;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 플랫폼
        ctx.fillStyle = '#7f8c8d';
        platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

        drawPlayer(p1);
        drawPlayer(p2);
        drawKey();
        drawDoor();
    }

    function loop() {
        if (gameOver) return;
        handleInput();
        updatePhysics(p1);
        updatePhysics(p2);
        checkCollisions();
        draw();
        requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') location.reload();
    });

    loop();
}