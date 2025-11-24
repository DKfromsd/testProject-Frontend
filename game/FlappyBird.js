// game/FlappyBird.js - 귀여운 쉬운 버전! (아이도 할 수 있음)
export function init(container) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; background:#87CEEB; color:#000; font-family:monospace;">
            <h2>Flappy Bird (귀여운 모드! 🐥)</h2>
            <p>스페이스 또는 클릭으로 점프 | ESC 종료</p>
            <canvas id="gameCanvas" width="400" height="600" style="border:5px solid #FFD700; background:linear-gradient(to bottom, #87CEEB 0%, #98D8E8 100%); border-radius:15px;"></canvas>
            <p style="font-size:24px; margin:15px;">점수: <span id="score">0</span></p>
            <p style="color:#FF4500;">지금은 아주 쉬워요! 😊</p>
        </div>
    `;

    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#score');

    // ★★★ 난이도 완전 하향! ★★★
    let bird = { 
        x: 100, 
        y: 300, 
        vy: 0, 
        width: 40, 
        height: 30, 
        gravity: 0.25,   // 원래 0.5 → 반으로 줄임 (천천히 떨어짐)
        jump: -8.5       // 원래 -10 → 더 높이 점프!
    };
    let pipes = [];
    let score = 0;
    let gameLoop;
    let gameOver = false;

    // 새 그리기 (더 귀엽게!)
    function drawBird() {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(bird.x + 10, bird.y + 5, 20, 20);
        // 눈
        ctx.fillStyle = '#000';
        ctx.fillRect(bird.x + 25, bird.y + 8, 6, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(bird.x + 27, bird.y + 9, 3, 3);
        // 부리
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(bird.x + 32, bird.y + 15, 10, 6);
    }

    function createPipe() {
        const gap = 220;  // 원래 150 → 훨씬 넓은 통로!
        const minHeight = 80;
        const maxHeight = canvas.height - gap - minHeight;
        const height = minHeight + Math.random() * (maxHeight - minHeight);
        
        pipes.push({
            x: canvas.width,
            top: height,
            bottom: canvas.height - height - gap,
            width: 70,     // 원래 60 → 더 넓게!
            passed: false
        });
    }

    function drawPipes() {
        pipes.forEach(p => {
            // 위 파이프
            ctx.fillStyle = '#228B22';
            ctx.fillRect(p.x, 0, p.width, p.top);
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(p.x - 5, p.top - 40, p.width + 10, 40);
            
            // 아래 파이프
            ctx.fillStyle = '#228B22';
            ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(p.x - 5, canvas.height - p.bottom, p.width + 10, 40);
        });
    }

    function update() {
        if (gameOver) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 새 물리 (더 부드럽게)
        bird.vy += bird.gravity;
        bird.y += bird.vy;

        // 파이프 생성 간격 늘림 (여유롭게)
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 350) {
            createPipe();
        }

        pipes.forEach((p, i) => {
            p.x -= 1.5;  // 원래 3 → 반속도! 천천히 옴

            // 점수
            if (!p.passed && p.x + p.width < bird.x) {
                p.passed = true;
                score++;
                scoreEl.textContent = score;
            }

            // 화면 밖 제거
            if (p.x + p.width < 0) pipes.splice(i, 1);
        });

        // 충돌 (더 관대하게!)
        const hit = bird.y < 0 || bird.y + bird.height > canvas.height ||
            pipes.some(p => bird.x + 10 < p.x + p.width && bird.x + bird.width - 10 > p.x &&
                           (bird.y + 5 < p.top || bird.y + bird.height - 5 > canvas.height - p.bottom));

        if (hit) {
            gameOver = true;
            clearInterval(gameLoop);
            alert(`좋았어요! 점수: ${score}점 🎉\n다시 하려면 버튼 클릭!`);
        }

        drawBird();
        drawPipes();
    }

    // 점프 (더 강하게!)
    const jump = () => {
        if (!gameOver) bird.vy = bird.jump;
    };

    window.addEventListener('keydown', e => {
        if (e.key === ' ') { e.preventDefault(); jump(); }
        if (e.key === 'Escape') {
            clearInterval(gameLoop);
            container.innerHTML = '<h2 style="color:#FF4500; text-align:center;">Flappy Bird 종료됨 😢<br>다시 시작하려면 버튼 클릭!</h2>';
        }
    });
    canvas.addEventListener('click', jump);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); jump(); });

    // 시작!
    createPipe();
    gameLoop = setInterval(update, 1000 / 60);
    canvas.focus();
}
