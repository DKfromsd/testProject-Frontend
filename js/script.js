// // js/script.js (type="module" 사용)
// const gameArea = document.getElementById('game-area');
// const track = document.querySelector('.carousel-track');
// const leftArrow = document.querySelector('.carousel-arrow.left');
// const rightArrow = document.querySelector('.carousel-arrow.right');
// let currentGame = null;
 
// let currentIndex = 0;  // 현재 선택된 인덱스

// // const games = {
// //     tictactoe: { name: "Tic Tac Toe", file: "../game/tictactoe.js" },
// //     omok: { name: "Omok", file: "../game/omok.js" },
// //     baseball: { name: "Baseball", file: "../game/baseball.js" }
// // };
// // 동적 games 로드
// let games = {};
// async function loadGames() {
//     try {
//         const module = await import('./games.js?t=' + Date.now());
//         games = module.games;
//         console.log('동적 게임 목록 로드:', Object.keys(games));
//         renderCarousel();
//         if (Object.keys(games).length > 0) {
//             selectGameByIndex(0);  // 첫 번째 자동 선택
//         }
//     } catch (err) {
//         console.error('games.js 로드 실패:', err);
//         gameArea.innerHTML = '<p style="color:red;">게임 목록을 찾을 수 없습니다.<br>python generate_games.py 를 실행하세요!</p>';
//     }
// }

// // V2. 동적으로 보이는 추가 부분 시작.
// // 캐러셀 동적 렌더링
// function renderCarousel() {
//     track.innerHTML = '';
//     const gameKeys = Object.keys(games);
    
//     // 무한 루프를 위해 버튼 3배 복제 (처음+중간+끝)
//     for (let i = -1; i <= gameKeys.length; i++) {  // -1: 복제 시작, 0~length-1: 원본, length: 복제 끝
//         const key = gameKeys[i % gameKeys.length];
//         const data = games[key];
//         const btn = document.createElement('button');
//         btn.className = 'game-btn';
//         btn.dataset.game = key;
//         btn.dataset.index = i % gameKeys.length;  // 실제 인덱스
//         btn.textContent = data.name;
//         btn.addEventListener('click', (e) => {
//             const realIndex = parseInt(e.currentTarget.dataset.index);
//             selectGameByIndex(realIndex);
//         });
//         track.appendChild(btn);
//     }

//     // 트랙 너비 설정 (infinite 위해 충분히 길게)
//     track.style.width = `${gameKeys.length * 3 * 270}px`;  // 버튼 너비 220 + gap 25 * 2margin
// }


// function selectGameByIndex(index) {
//     const gameKeys = Object.keys(games);
//     currentIndex = index % gameKeys.length;
//     const gameKey = gameKeys[currentIndex];
//     selectGame(gameKey);
    
//     // 중앙 snap: 선택된 버튼을 뷰포트 중앙으로
//     const btnWidth = 270;  // 버튼+gap
//     const scrollLeft = (currentIndex + 1) * btnWidth - window.innerWidth / 2 + 110;  // 중앙 맞춤
//     track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
// }

// // 게임 선택 핸들러 - not using this anymore
// // async function handleGameSelect(e) {
// //     const gameKey = e.currentTarget.dataset.game;
// //     selectGame(gameKey);
// // }

// // 게임 선택 + 로드
// async function selectGame(gameKey) {
//     if (currentGame === gameKey) return;
//     currentGame = gameKey;
//     // 선택 UI
//     // document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('selected'));
//     // document.querySelector(`[data-game="${gameKey}"]`).classList.add('selected');
//     // 선택 효과 (실제 인덱스의 모든 복제본 selected)
//     document.querySelectorAll('.game-btn').forEach(btn => {
//         btn.classList.toggle('selected', parseInt(btn.dataset.index) === currentIndex);
//     });

//     gameArea.innerHTML = '<div id="loading">게임 로딩 중...</div>';

//     try {
//         //const module = await import(games[gameKey].file);
//         const module = await import(games[gameKey].file + '?t=' + Date.now());
//         if (module.init) {
//             module.init(gameArea);
//         } else {
//             throw new Error('init 함수 없음');
//         }
//     } catch (err) {
//         console.error(`게임 로드 실패: ${gameKey}`, err);
//         //gameArea.innerHTML = `<p style="color:red;">${gameKey} 로드 실패!</p>`;
//         gameArea.innerHTML = `<p style="color:red;">${games[gameKey]?.name || gameKey} 로드 실패!</p>`;
//     }
// }
// // V2. 추가부분 완료 


// // 캐러셀 스크롤
// // document.querySelector('.carousel-arrow.left').addEventListener('click', () => {
// //     track.scrollBy({ left: -220, behavior: 'smooth' });
// // });
// // document.querySelector('.carousel-arrow.right').addEventListener('click', () => {
// //     track.scrollBy({ left: 220, behavior: 'smooth' });
// // });

// // 무한 회전 스크롤 (circular + snap)
// function scrollLeft() {
//     currentIndex = (currentIndex - 1 + Object.keys(games).length) % Object.keys(games).length;
//     selectGameByIndex(currentIndex);
// }

// function scrollRight() {
//     currentIndex = (currentIndex + 1) % Object.keys(games).length;
//     selectGameByIndex(currentIndex);
// }

// leftArrow.addEventListener('click', scrollLeft);
// rightArrow.addEventListener('click', scrollRight);

// // 키보드 지원 (← →)
// document.addEventListener('keydown', (e) => {
//     if (e.key === 'ArrowLeft') scrollLeft();
//     if (e.key === 'ArrowRight') scrollRight();
// });

// // 터치/드래그 지원 (모바일)
// let startX = 0;
// track.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
// track.addEventListener('touchend', (e) => {
//     const endX = e.changedTouches[0].clientX;
//     if (startX - endX > 50) scrollRight();  // 스와이프 오른쪽
//     if (endX - startX > 50) scrollLeft();   // 스와이프 왼쪽
// });

// // 게임 선택 시 동적 로딩  V1 
// // 기존에는 HTML 에 미리 버튼이 있었기 때문에 아래가 필요해서 gameButtons.forEach 를 사용했으나,
// // 이제 위에서 render 하면서 버튼도 생성함. js/games.js 를 자동생성하므로 새로 

// // gameButtons.forEach(btn => {
// //     btn.addEventListener('click', async () => {
// //         const gameKey = btn.dataset.game;

// //         // 선택 효과
// //         document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('selected'));
// //         btn.classList.add('selected');

// //         if (currentGame === gameKey) return;
// //         currentGame = gameKey;

// //         gameArea.innerHTML = '<div id="loading">게임 로딩 중...</div>';

// //         try {
// //             const module = await import(games[gameKey].file);
// //             if (module && module.init) {
// //                 module.init(gameArea);
// //             }
// //         } catch (err) {
// //             console.error("게임 로드 실패:", err);
// //             gameArea.innerHTML = `<p style="color:red;">게임 로드 실패: ${gameKey}</p>`;
// //         }
// //     });
// // });

// // 첫 화면: TicTacToe 기본 로드 변경 
// // document.querySelector('[data-game="tictactoe"]').click();

// // V2. 초기화: games 로드 후 캐러셀 렌더
// loadGames();

// js/script.js - 단순 스크롤 버전 (통째 교체! 무한 제거 + 끝 감지 + 고정 화살표)

const gameArea = document.getElementById('game-area');
const track = document.querySelector('.carousel-track');
const leftArrow = document.querySelector('.carousel-arrow.left');
const rightArrow = document.querySelector('.carousel-arrow.right');
let currentGame = null;
let games = {};

async function loadGames() {
    try {
        const module = await import('./games.js?t=' + Date.now());
        games = module.games;
        console.log('✅ 동적 게임 목록 로드 성공:', Object.keys(games));
        renderCarousel();
        if (Object.keys(games).length > 0) {
            selectGame(Object.keys(games)[0]);  // 첫 게임 자동 선택
        }
    } catch (err) {
        console.error('❌ games.js 로드 실패:', err);
        gameArea.innerHTML = '<div style="text-align:center; color:red; font-size:24px; margin:100px;"><strong>게임 목록 로드 실패!</strong><br><br>터미널에서 <code>python generate_games.py</code> 실행 후 새로고침하세요.<br><small>F12 콘솔 확인</small></div>';
    }
}

function renderCarousel() {
    track.innerHTML = '';
    Object.entries(games).forEach(([key, data]) => {
        const btn = document.createElement('button');
        btn.className = 'game-btn';
        btn.dataset.game = key;
        btn.textContent = data.name;
        btn.addEventListener('click', () => selectGame(key));
        track.appendChild(btn);
    });
    updateArrows();  // 스크롤 끝 감지 초기화
}

async function selectGame(gameKey) {
    if (currentGame === gameKey) return;
    currentGame = gameKey;

    // 선택 효과
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.game === gameKey);
    });

    // 가벼운 스크롤: 선택된 버튼 보이게
    const selectedBtn = document.querySelector(`[data-game="${gameKey}"]`);
    if (selectedBtn) {
        selectedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    gameArea.innerHTML = '<div id="loading">게임 로딩 중...</div>';

    try {
        const module = await import(games[gameKey].file + '?t=' + Date.now());
        if (module && module.init) {
            module.init(gameArea);
        } else {
            throw new Error('init 함수 없음');
        }
    } catch (err) {
        console.error(`❌ ${gameKey} 로드 실패:`, err);
        gameArea.innerHTML = `<div style="text-align:center; color:red; padding:50px;"><h3>${games[gameKey]?.name || gameKey} 로드 실패!</h3><p>F12 콘솔 확인</p></div>`;
    }
}

// 스크롤 끝 감지 + 화살표 활성/비활성
function updateArrows() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const isLeftEnd = track.scrollLeft <= 0;
    const isRightEnd = track.scrollLeft >= maxScroll - 1;

    leftArrow.classList.toggle('disabled', isLeftEnd);
    rightArrow.classList.toggle('disabled', isRightEnd);
}

// 좌우 스크롤 (단순 scrollBy + 끝 감지)
leftArrow.addEventListener('click', () => {
    if (!leftArrow.classList.contains('disabled')) {
        track.scrollBy({ left: -250, behavior: 'smooth' });
    }
});
rightArrow.addEventListener('click', () => {
    if (!rightArrow.classList.contains('disabled')) {
        track.scrollBy({ left: 250, behavior: 'smooth' });
    }
});

// 스크롤 이벤트: 화살표 실시간 업데이트
track.addEventListener('scroll', updateArrows);

// 키보드 지원
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !leftArrow.classList.contains('disabled')) {
        track.scrollBy({ left: -250, behavior: 'smooth' });
    } else if (e.key === 'ArrowRight' && !rightArrow.classList.contains('disabled')) {
        track.scrollBy({ left: 250, behavior: 'smooth' });
    }
});

// 모바일 터치 스와이프
let startX = 0;
track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
track.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 60) {  // 오른쪽 스와이프
        rightArrow.click();
    } else if (endX - startX > 60) {  // 왼쪽 스와이프
        leftArrow.click();
    }
});

// 시작!
loadGames();