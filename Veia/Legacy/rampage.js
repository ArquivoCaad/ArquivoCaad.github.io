var player = "X";
var numJog = 0;
var gameOver = false;
var xWins = 0;
var oWins = 0;
var timeLeft = 5;  // Tempo máximo para cada movimento (5 segundos)
var timer;  // Variável para o temporizador

function toggleMode() {
    document.body.classList.toggle('dark-mode');
    var modeButton = document.querySelector('.mode-toggle');
    if (document.body.classList.contains('dark-mode')) {
        modeButton.textContent = "Modo Estranho";
    } else {
        modeButton.textContent = "Modo Decente";
    }
}

// Variavel para ozaudio
let win = document.getElementById('win');
let win2 = document.getElementById('win2');
let epicWin = document.getElementById('eWin');
let bruh = document.getElementById('bruh');

function startTimer() {
    // Reseta o temporizador a cada novo turno
    timeLeft = 5;  // Tempo de 5 segundos para o jogador fazer uma jogada
    updateTimerDisplay();  // Atualiza a visualização do tempo

    // Define um intervalo que decrementa o tempo a cada segundo
    timer = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(timer); // Para o temporizador quando chega a 0
            alert("Tempo esgotado! Vitória do outro jogador.");
            declareWinner();  // Declara a vitória para o outro jogador
        } else {
            timeLeft--;
            updateTimerDisplay(); // Atualiza a visualização do tempo
        }
    }, 1000);
}

function declareWinner() {
    // Alterna o jogador e atribui a vitória ao jogador adversário
    if (player === "X") {
        oWins++;  // Incrementa vitórias do "O"
        document.getElementById('oWins').textContent = oWins;
    } else {
        xWins++;  // Incrementa vitórias do "X"
        document.getElementById('xWins').textContent = xWins;
    }

    // Reseta o jogo
    resetGame();  // Reinicia o jogo
    player = player === "X" ? "O" : "X";  // Passa a vez para o outro jogador
}

function updateTimerDisplay() {
    var timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.textContent = `Tempo restante: ${timeLeft}s`;
    }
}

function checkjogo(cell) {
    if (gameOver) return;

    if (cell.classList.contains('X') || cell.classList.contains('O')) {
        return; // Célula já foi marcada
    }

    // Marcar a célula com o jogador atual
    cell.classList.add(player);
    var img = cell.querySelector('img');
    img.src = "./assets/img_jogo_base/" + player + ".png"; // Atualiza a imagem

    numJog++;

    // Verifica se alguém ganhou
    if (winCheck()) {
        gameOver = true;
        if (player === "X") {
            xWins++;
            document.getElementById('xWins').textContent = xWins;
        } else {
            oWins++;
            document.getElementById('oWins').textContent = oWins;
        }
        alert("Fim de jogo: Vitória do " + player + "!!");
        resetGame();
        return;
    }

    if (numJog === 9) {
        gameOver = true;
        alert("Fim de jogo: Deu velha!!");
        bruh.play();
        resetGame();
    }

    nextTurn();
}

if (xWins == 3) {
    win.play();
}
if (xWins == 10) {
    epicWin.play();
    win.pause();
}

if (oWins == 3) {
    win2.play();
}
if (oWins == 10) {
    epicWin.play();
    win2.pause();
}

function nextTurn() {
    player = player === "X" ? "O" : "X"; // Alterna o jogador
    startTimer(); // Inicia o temporizador para o próximo jogador
}

function winCheck() {
    // Verificar as linhas
    if ((document.getElementById("c1").classList.contains(player) && document.getElementById("c2").classList.contains(player) && document.getElementById("c3").classList.contains(player)) ||
        (document.getElementById("c4").classList.contains(player) && document.getElementById("c5").classList.contains(player) && document.getElementById("c6").classList.contains(player)) ||
        (document.getElementById("c7").classList.contains(player) && document.getElementById("c8").classList.contains(player) && document.getElementById("c9").classList.contains(player))) {
        return true;
    }

    // Verificar as colunas
    if ((document.getElementById("c1").classList.contains(player) && document.getElementById("c4").classList.contains(player) && document.getElementById("c7").classList.contains(player)) ||
        (document.getElementById("c2").classList.contains(player) && document.getElementById("c5").classList.contains(player) && document.getElementById("c8").classList.contains(player)) ||
        (document.getElementById("c3").classList.contains(player) && document.getElementById("c6").classList.contains(player) && document.getElementById("c9").classList.contains(player))) {
        return true;
    }

    // Verificar diagonais
    if ((document.getElementById("c1").classList.contains(player) && document.getElementById("c5").classList.contains(player) && document.getElementById("c9").classList.contains(player)) ||
        (document.getElementById("c3").classList.contains(player) && document.getElementById("c5").classList.contains(player) && document.getElementById("c7").classList.contains(player))) {
        return true;
    }

    return false;
}

function resetGame() {
    numJog = 0;
    gameOver = false;
    player = "X";
    for (var i = 1; i <= 9; i++) {
        var cell = document.getElementById('c' + i);
        cell.classList.remove('X', 'O'); // Remove as classes X e O
        cell.querySelector('img').src = "./assets/img_jogo_base/transp.png"; // Remove a imagem
    }
}

function restartGame() {
    xWins = 0;
    oWins = 0;
}
