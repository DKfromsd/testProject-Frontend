// game/baseball.js
export function init(container) {
    container.innerHTML = `
        <div class="game-container">
            <h2>Baseball Guessing Game</h2>
            <p>Try to guess the 3-digit number (unique digits from 1 to 9).</p>
            <p><strong>Maximum Attempts:</strong> 10</p>
            <div style="margin: 20px 0;">
                <input type="text" id="guessInput" maxlength="3" placeholder="예: 456" 
                       style="padding: 10px; font-size: 18px; width: 120px; text-align: center;">
                <button id="submitGuess">Submit Guess</button>
                <button id="resetBaseballGame">Restart Game</button>
            </div>
            <div id="result"></div>
        </div>
    `;

    const MAX_TRIES = 10;
    let answer = [];
    let attemptCount = 0;
    const resultDiv = container.querySelector('#result');

    function logMessage(msg) {
        const p = document.createElement('p');
        p.textContent = msg;
        resultDiv.appendChild(p);
        resultDiv.scrollTop = resultDiv.scrollHeight; // 자동 스크롤
    }

    function generateAnswer() {
        answer = [];
        while (answer.length < 3) {
            const digit = Math.floor(Math.random() * 9) + 1;
            if (!answer.includes(digit)) answer.push(digit);
        }
        console.log("정답 (개발자용):", answer.join(''));
    }

    function startGame() {
        attemptCount = 0;
        resultDiv.innerHTML = '';
        logMessage(`새 게임 시작! 최대 ${MAX_TRIES}번 시도 가능합니다.`);
        generateAnswer();
    }

    function checkGuess(guessStr) {
        if (!/^\d{3}$/.test(guessStr)) {
            logMessage("3자리 숫자를 입력하세요.");
            return;
        }

        const guess = guessStr.split('').map(Number);
        if (new Set(guess).size < 3) {
            logMessage("중복되지 않는 숫자 3개를 입력하세요.");
            return;
        }

        let strike = 0;
        let ball = 0;

        for (let i = 0; i < 3; i++) {
            if (guess[i] === answer[i]) strike++;
            else if (answer.includes(guess[i])) ball++;
        }

        attemptCount++;
        logMessage(`시도 ${attemptCount}: ${guessStr} → ${strike}S ${ball}B`);

        if (strike === 3) {
            logMessage(`🎉 정답! ${attemptCount}번 만에 맞췄습니다! 정답: ${answer.join('')}`);
            return;
        }

        if (attemptCount >= MAX_TRIES) {
            logMessage(`💀 게임 오버! 정답은 ${answer.join('')} 였습니다.`);
        }
    }

    // 이벤트 연결
    container.querySelector('#submitGuess').addEventListener('click', () => {
        const input = container.querySelector('#guessInput');
        checkGuess(input.value.trim());
        input.value = '';
        input.focus();
    });

    container.querySelector('#guessInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            container.querySelector('#submitGuess').click();
        }
    });

    container.querySelector('#resetBaseballGame').addEventListener('click', startGame);

    // 게임 시작
    startGame();
}
