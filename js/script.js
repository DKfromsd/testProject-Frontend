// js/script.js (type="module" 사용)
const gameArea = document.getElementById('game-area');
const track = document.querySelector('.carousel-track');
const gameButtons = document.querySelectorAll('.game-btn');
let currentGame = null;

const games = {
    tictactoe: { name: "Tic Tac Toe", file: "../game/tictactoe.js" },
    omok: { name: "Omok", file: "../game/omok.js" },
    baseball: { name: "Baseball", file: "../game/baseball.js" }
};

// 캐러셀 스크롤
document.querySelector('.carousel-arrow.left').addEventListener('click', () => {
    track.scrollBy({ left: -220, behavior: 'smooth' });
});
document.querySelector('.carousel-arrow.right').addEventListener('click', () => {
    track.scrollBy({ left: 220, behavior: 'smooth' });
});

// 게임 선택 시 동적 로딩
gameButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const gameKey = btn.dataset.game;

        // 선택 효과
        document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        if (currentGame === gameKey) return;
        currentGame = gameKey;

        gameArea.innerHTML = '<div id="loading">게임 로딩 중...</div>';

        try {
            const module = await import(games[gameKey].file);
            if (module && module.init) {
                module.init(gameArea);
            }
        } catch (err) {
            console.error("게임 로드 실패:", err);
            gameArea.innerHTML = `<p style="color:red;">게임 로드 실패: ${gameKey}</p>`;
        }
    });
});

// 첫 화면: TicTacToe 기본 로드
document.querySelector('[data-game="tictactoe"]').click();