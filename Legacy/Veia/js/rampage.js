let player = "X";
let numJog = 0;
let gameOver = false;
let xWins = 0;
let oWins = 0;
let contPartida = 0;
let iaEnabled = true; // Controle da IA
let difficulty = "medium"; // Dificuldade padrão: medium
let draws = 0;
let timeLeft = 5; // Tempo máximo para cada movimento (5 segundos)
let timer; // Variável para o temporizador
const ref = "./assets/img_jogo_base/";

let win = document.getElementById("win");
let win2 = document.getElementById("win2");
let epicWin = document.getElementById("eWin");
let bruh = document.getElementById("bruh");

function startTimer() {
    timeLeft = 5;
    updateTimerDisplay();
    clearInterval(timer);

    timer = setInterval(function () {
        if (gameOver) {
            clearInterval(timer);
            return;
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            declareWinner();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById("timer");
    if (timerDisplay) {
        timerDisplay.textContent = `${timeLeft}s`;
    }
}

function toggleIA() {
    iaEnabled = !iaEnabled;
}

function setDifficulty(level) {
    difficulty = level;
    const buttons = document.querySelectorAll(".controls .difficulty-button");

    buttons.forEach((btn) => btn.classList.remove("active"));
    const selectedButton = Array.from(buttons).find((btn) => btn.dataset.level === level);
    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}

function getBoardState() {
    let board = [];
    for (let i = 1; i <= 9; i++) {
        const cell = document.getElementById("c" + i);
        if (cell.classList.contains("X")) {
            board.push("X");
        } else if (cell.classList.contains("O")) {
            board.push("O");
        } else {
            board.push("");
        }
    }
    return board;
}
let verifica;

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        verifica = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes("") ? null : "tie";
}

function bestMove() {
    if (gameOver || !iaEnabled) return;

    const board = getBoardState();
    let move;

    if (difficulty === "easy") {
        const availableMoves = board.map((val, idx) => (val === "" ? idx : null)).filter((idx) => idx !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (difficulty === "medium") {
        if (Math.random() > 0.5) {
            const availableMoves = board.map((val, idx) => (val === "" ? idx : null)).filter((idx) => idx !== null);
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        } else {
            move = calculateBestMove(board);
        }
    } else {
        move = calculateBestMove(board);
    }

    if (move !== undefined) {
        const cell = document.getElementById("c" + (move + 1));
        checkjogo(cell);
    }
}

function calculateBestMove(board) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            const score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = { X: -1, O: 1, tie: 0 };
    const result = checkWinner(board);

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkjogo(cell) {
    if (gameOver || cell.classList.contains("X") || cell.classList.contains("O")) return;

    cell.classList.add(player);
    cell.querySelector("img").src = ref + player + ".png";
    numJog++;

    if (checkWinner(getBoardState()) === player) {
        document.getElementById("c"+(verifica[0]+1)).classList.add('winner');
        document.getElementById("c"+(verifica[1]+1)).classList.add('winner');
        document.getElementById("c"+(verifica[2]+1)).classList.add('winner');
        handleWin(player);
        return;
    }

    if (numJog === 9) {
        handleDraw();
        return;
    }

    player = player === "X" ? "O" : "X";
    if (player === "O" && iaEnabled) {
        setTimeout(bestMove, 500);
    }

    startTimer();
}

function handleWin(winner) {
    if (gameOver) return;

    gameOver = true;
    if (winner === "X") {
        xWins++;
        document.getElementById("xWins").textContent = xWins;
    } else {
        oWins++;
        document.getElementById("oWins").textContent = oWins;
    }

    clearInterval(timer);
}

function handleDraw() {
    if (gameOver) return;

    gameOver = true;
    draws++;
    document.getElementById("draws").textContent = draws;
    bruh.play();
    clearInterval(timer);
}

function resetGame() {
    clearInterval(timer);
    numJog = 0;
    gameOver = false;
    player = "X";
    timeLeft = 5;

    for (let i = 1; i <= 9; i++) {
        const cell = document.getElementById("c" + i);
        cell.classList.remove("X", "O", "winner");
        cell.querySelector("img").src = ref + "transp.png";
    }

    contPartida++;
    document.getElementById("contPartida").textContent = `#${contPartida + 1}`;
    startTimer();
}

function declareWinner() {
    if (gameOver) return;

    gameOver = true;
    if (player === "X") {
        oWins++;
        document.getElementById("oWins").textContent = oWins;
    } else {
        xWins++;
        document.getElementById("xWins").textContent = xWins;
    }

    clearInterval(timer);
    resetGame();
}
