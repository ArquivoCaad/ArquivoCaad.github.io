let player = "X";
let numJog = 0;
let gameOver = false;
let xWins = 0;
let oWins = 0;
let contPartida = 0;
let iaEnabled = true; // Controle da IA
let difficulty = "medium"; // Dificuldade padrão: medium
let draws = 0;

// Alternar IA ligada/desligada
function toggleIA() {
    iaEnabled = !iaEnabled;
}

// Alterar dificuldade da IA
function setDifficulty(level) {
    difficulty = level;
    // Seleciona todos os botões de dificuldade
    const buttons = document.querySelectorAll('.controls .difficulty-button');

    // Remove a classe 'active' de todos os botões
    buttons.forEach((btn) => btn.classList.remove('active'));

    // Encontra o botão correspondente ao nível e adiciona a classe 'active'
    const selectedButton = Array.from(buttons).find((btn) => btn.dataset.level === level);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Obter o estado atual do tabuleiro
function getBoardState() {
    let board = [];
    for (let i = 1; i <= 9; i++) {
        let cell = document.getElementById("c" + i);
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
// Verificar vencedor ou empate
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        verifica = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            //board[b].forEach(id => document.getElementById(id).classList.add('winner'));
            return board[a];
        }
    }

    return board.includes("") ? null : "tie";
}

// Algoritmo Minimax
function minimax(board, depth, isMaximizing) {
    let scores = { X: -1, O: 1, tie: 0 };
    let result = checkWinner(board);

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
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
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Função para a jogada da IA
function bestMove() {
    if (gameOver || !iaEnabled) return;

    let board = getBoardState();
    let move;

    if (difficulty === "easy") {
        // Escolha aleatória entre células disponíveis
        let availableMoves = board.map((val, idx) => (val === "" ? idx : null)).filter(idx => idx !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (difficulty === "medium") {
        // 50% aleatório, 50% Minimax
        if (Math.random() > 0.5) {
            let availableMoves = board.map((val, idx) => (val === "" ? idx : null)).filter(idx => idx !== null);
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        } else {
            move = calculateBestMove(board);
        }
    } else {
        // Dificuldade "hard": sempre Minimax
        move = calculateBestMove(board);
    }

    if (move !== undefined) {
        let cell = document.getElementById("c" + (move + 1));
        checkjogo(cell);
    }
}

// Calcula a melhor jogada com Minimax
function calculateBestMove(board) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Função principal de jogada
function checkjogo(cell) {
    if (gameOver || cell.classList.contains("X") || cell.classList.contains("O")) return;

    // Marcar a célula para o jogador atual
    cell.classList.add(player);
    cell.querySelector("img").src = ref + player + ".png";
    numJog++;

    if (winCheck()) {
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

    // Alternar entre jogador e IA
    if (player === "X") {
        player = "O";
        if (iaEnabled) {
            setTimeout(bestMove, 500); // Jogada da IA
        }
    } else {
        player = "X";
    }
}

// Verificar condição de vitória
function winCheck() {
    let board = getBoardState();
    return checkWinner(board) === player;
}

// Funções auxiliares para vitória e empate
function handleWin(winner) {
    gameOver = true;
    if (winner === "X") {
        xWins++;
        document.getElementById("xWins").textContent = xWins;
    } else {
        oWins++;
        document.getElementById("oWins").textContent = oWins;
    }

    if(timer != 0){
        clearInterval(timer); // Para o temporizador
    }
}

function handleDraw() {
    gameOver = true;
    draws++;
    document.getElementById('draws').textContent = draws;
    bruh.play();
}

// Reiniciar jogo
function resetGame() {
    numJog = 0;
    gameOver = false;
    player = "X";
    for (let i = 1; i <= 9; i++) {
        let cell = document.getElementById("c" + i);
        cell.classList.remove("X", "O", "winner");
        cell.querySelector("img").src = "./assets/img_jogo_base/transp.png";
    }
    contPartida++;
    document.getElementById("contPartida").textContent = "#"+(contPartida+1);
}
