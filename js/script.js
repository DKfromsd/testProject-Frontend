// js/script.js (type="module" 사용)
const gameArea = document.getElementById('game-area');
const track = document.querySelector('.carousel-track');
const gameButtons = document.querySelectorAll('.game-btn');
let currentGame = null;

// const games = {
//     tictactoe: { name: "Tic Tac Toe", file: "../game/tictactoe.js" },
//     omok: { name: "Omok", file: "../game/omok.js" },
//     baseball: { name: "Baseball", file: "../game/baseball.js" }
// };
// 동적 games 로드
let games = {};
async function loadGames() {
    try {
        const module = await import('./games.js');
        games = module.games;
        console.log('동적 게임 목록 로드:', games);
        renderCarousel();
        // 첫 게임 자동 선택
        selectGame(Object.keys(games)[0]);
    } catch (err) {
        console.error('games.js 로드 실패:', err);
        gameArea.innerHTML = '<p style="color:red;">게임 목록 로드 실패! generate_games.py 실행하세요.</p>';
    }
}

// V2. 동적으로 보이는 추가 부분 시작.
// 캐러셀 동적 렌더링
function renderCarousel() {
    track.innerHTML = '';
    Object.entries(games).forEach(([key, data]) => {
        const btn = document.createElement('button');
        btn.className = 'game-btn';
        btn.dataset.game = key;
        btn.textContent = data.name;
        track.appendChild(btn);
    });
    // 새 버튼들 이벤트 연결
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.addEventListener('click', handleGameSelect);
    });
}

// 게임 선택 핸들러
async function handleGameSelect(e) {
    const gameKey = e.currentTarget.dataset.game;
    selectGame(gameKey);
}

// 게임 선택 + 로드
async function selectGame(gameKey) {
    // 선택 UI
    document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('selected'));
    document.querySelector(`[data-game="${gameKey}"]`).classList.add('selected');

    if (currentGame === gameKey) return;
    currentGame = gameKey;

    gameArea.innerHTML = '<div id="loading">게임 로딩 중...</div>';

    try {
        const module = await import(games[gameKey].file);
        if (module.init) {
            module.init(gameArea);
        } else {
            throw new Error('init 함수 없음');
        }
    } catch (err) {
        console.error(`게임 로드 실패: ${gameKey}`, err);
        gameArea.innerHTML = `<p style="color:red;">${gameKey} 로드 실패!</p>`;
    }
}
// V2. 추가부분 완료 


// 캐러셀 스크롤
document.querySelector('.carousel-arrow.left').addEventListener('click', () => {
    track.scrollBy({ left: -220, behavior: 'smooth' });
});
document.querySelector('.carousel-arrow.right').addEventListener('click', () => {
    track.scrollBy({ left: 220, behavior: 'smooth' });
});

// 게임 선택 시 동적 로딩  V1 
// 기존에는 HTML 에 미리 버튼이 있었기 때문에 아래가 필요해서 gameButtons.forEach 를 사용했으나,
// 이제 위에서 render 하면서 버튼도 생성함. js/games.js 를 자동생성하므로 새로 

// gameButtons.forEach(btn => {
//     btn.addEventListener('click', async () => {
//         const gameKey = btn.dataset.game;

//         // 선택 효과
//         document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('selected'));
//         btn.classList.add('selected');

//         if (currentGame === gameKey) return;
//         currentGame = gameKey;

//         gameArea.innerHTML = '<div id="loading">게임 로딩 중...</div>';

//         try {
//             const module = await import(games[gameKey].file);
//             if (module && module.init) {
//                 module.init(gameArea);
//             }
//         } catch (err) {
//             console.error("게임 로드 실패:", err);
//             gameArea.innerHTML = `<p style="color:red;">게임 로드 실패: ${gameKey}</p>`;
//         }
//     });
// });

// 첫 화면: TicTacToe 기본 로드 변경 
// document.querySelector('[data-game="tictactoe"]').click();

// V2. 초기화: games 로드 후 캐러셀 렌더
loadGames();