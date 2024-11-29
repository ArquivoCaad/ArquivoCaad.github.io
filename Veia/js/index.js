// Função para redirecionar para uma página aleatória
function RandomPage(event) {
  // Previne o comportamento padrão do link
  event.preventDefault();

  // Lista das páginas disponíveis
  const pages = ["classic.html", "browsers.html", "69.html", "rampage.html"];

  // Gera um índice aleatório para escolher uma página
  const randomIndex = Math.floor(Math.random() * pages.length);

  // Redireciona para a página aleatória escolhida
  window.location.href = pages[randomIndex];
}

window.onload = function () {
  const randomLink = document.querySelector(".random-link");
  // Corrigir a função chamada para a mesma que foi definida
  randomLink.addEventListener("click", RandomPage);
};

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const mainHtml = {
  modos:
  ' <div class="ops"><a id="classico" href="./classic.html" onmouseover="frame(this.id)">Clássico</a><a id="browser" href="./browsers.html" onmouseover="frame(this.id)">Browser Battle</a><a id="69" href="./69.html" onmouseover="frame(this.id)">69 Mode</a><a id="rampage" href="./rampage.html" onmouseover="frame(this.id)">Rampage</a><a id="aleatorio" href="#" class="random-link" onmouseover="frame(this.id)">Modo Aleatório</a> <!-- Link com a classe random-link --></div><div id="frame"><img id="ref" src="./assets/preview/classico.png" alt="imagem"></div>',
tutorial: `<div id="howto">
    <h1>Como jogar Jogo da Velha?</h1>

    <p>
        No <b>Jogo da Veia: Epic Version</b>, você experimenta o clássico jogo da velha de uma maneira totalmente
        inovadora! Aqui está um guia rápido sobre como jogar e aproveitar os diferentes modos que oferecemos:
    </p>

    <h2>O Básico do Jogo da Velha</h2>

    <p>
        O objetivo é simples: alinhar três símbolos iguais em linha reta, seja na horizontal, vertical ou diagonal.
        Cada
        jogador escolhe entre "X" e "O" e faz turnos alternados para marcar suas jogadas no tabuleiro 3x3.
    </p>


    <ul>
        <li>Escolha um modo de jogo no menu principal.</li>
        <li>Use sua estratégia para antecipar as jogadas do adversário e bloquear suas chances de vitória.</li>
        <li>O primeiro a alinhar três símbolos vence a rodada!</li>
    </ul>

    <h1>Dicas e Estratégias</h1>

    <ul>
        <li>
            <b>No Clássico:</b> Controle o centro do tabuleiro para maximizar suas possibilidades de vitória.
        </li>
        <li>
            <b>Nos Modos Temáticos:</b> Explore as características únicas de cada um para adaptar sua estratégia.
        </li>
        <li>
            <b>Em Rampage:</b> Reaja rápido! Este modo testa não só sua estratégia, mas também sua velocidade de
            raciocínio.
        </li>
    </ul>

    <p>
        Com gráficos elegantes, transições suaves e personalizações únicas, o <b>Jogo da Veia: Epic Version</b> promete
        transformar o simples jogo da velha em uma experiência épica. Venha jogar e descubra por que o clássico
        nunca sai de moda!
    </p>
</div>
`,
sobre: "",
};

// Verificar o tema salvo no localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-mode");
  themeToggle.checked = true;
}

// Alternar entre claro e escuro
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }
});

function frame(name) {
  let imagem = document.getElementById("ref");
  let link = "./assets/preview/" + name + ".png";
  imagem.setAttribute("src", link);
}

function mainChange(name) {
  const main = document.getElementById("conteudo");
  main.innerHTML = mainHtml[name];
}
