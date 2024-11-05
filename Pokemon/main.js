let correctPokemon;
let options = [];
let score = 0; // Variável para armazenar os acertos

// Função para buscar um Pokémon aleatório pela API
async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 150) + 1; // Pega um Pokémon aleatório entre 1 e 150(Geração 1)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return data;
}

// Função para buscar quatro Pokémon aleatórios e embaralhar as opções
async function generateQuestion() {
    correctPokemon = await getRandomPokemon(); // Pokémon correto
    options = [correctPokemon]; // Adiciona o Pokémon correto nas opções

    // Adiciona mais 3 Pokémon aleatórios nas opções
    while (options.length < 4) {
        const randomPokemon = await getRandomPokemon();
        if (!options.includes(randomPokemon)) {
            options.push(randomPokemon);
        }
    }

    // Embaralha as opções
    options.sort(() => Math.random() - 0.5);

    displayQuestion(); // Exibe a imagem e as opções de resposta
}

// Função para exibir a imagem do Pokémon e as opções de resposta
function displayQuestion() {
    const pokemonImage = document.getElementById('pokemonImage');
    pokemonImage.src = correctPokemon.sprites.front_default; // Exibe imagem do Pokémon
    pokemonImage.style.display = 'block';

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Limpa as opções anteriores

    // Cria botões para cada uma das opções de resposta
    options.forEach(option => {
        const button = document.createElement('button');
        button.setAttribute('class', "opcao");
        button.setAttribute('id', option.name);
        button.innerText = capitalizeFirstLetter(option.name); // Nome do Pokémon
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

// Função para verificar se a resposta está correta
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    if (selected.name === correctPokemon.name) {
        resultDiv.innerHTML = '<p>Correto!</p>';
        resultDiv.style.color = '#5cdb95';
        score++; // Incrementa o número de acertos
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O Pokémon correto era: ${capitalizeFirstLetter(correctPokemon.name)}</p>`;
        resultDiv.style.color = '#ff5f5f';
        score = 0;
    }

    const botoes = document.getElementsByClassName("opcao");

    // Iterando sobre a coleção de elementos
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].setAttribute('disabled', 'disabled');
        botoes[i].style.filter = "brightness(0.5)";
    }

    document.getElementById(selected.name).style.filter = "brightness(1)";
    document.getElementById('pokemonImage').style.filter = "brightness(1)";
    document.getElementById('nextButton').style.display = 'inline-block'; // Exibe o botão "Próximo"

    // Atualiza a exibição do placar
    updateScore();
}

// Função para atualizar a exibição do placar
function updateScore() {
    const scoreDiv = document.getElementById('score');
    scoreDiv.innerHTML = `Acertos: ${score}`;
}

// Quando o botão "Próximo" for clicado, gera uma nova pergunta
document.getElementById('nextButton').onclick = () => {
    document.getElementById('pokemonImage').style.filter = "brightness(0)";
    document.getElementById('result').innerHTML = ''; // Limpa o resultado anterior
    document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
    generateQuestion(); // Gera uma nova pergunta
};

// Função para capitalizar a primeira letra do nome do Pokémon
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

generateQuestion();
