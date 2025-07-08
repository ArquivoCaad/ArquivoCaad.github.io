//variaveis globais
let escala = 50;
let time = 0;
let range, trans, cont, m, txt, entidade, imgEntidade;

//Controle estatisticas
let brocolis = 0;
let alface = 0;
let v_brocolis = 0;
let v_alface = 0;
let d_brocolis = 0;
let d_alface = 0;
let p_alface = 800;
let p_brocolis = 400;
let dindin = 130;
let auxilio = 130;
let gasto = 0;

//Controle estado
let fim = false;
let resultado = false;
let click = false;
let state = "jogo";

//classes
let interfa, cam, player, grid, hotB, tempo, casa, bicicleta, loja, minigame;

let imagens;

//Minigame
let apples = [];
let particles = [];
let effects = [];
let score = 0;
let startTime;
let gameOver = false;
let speedBoostTimer = 0;
let gameStarted = false;
let selectedDifficulty = 1;
let fadeAlpha = 255;
let fadingIn = false;
let fadingOut = false;

let difficulties = [
  { label: "Fácil", duration: 60000, baseSpeed: 1, spawnFactor: 20000 },
  { label: "Médio", duration: 45000, baseSpeed: 1.5, spawnFactor: 15000 },
  { label: "Difícil", duration: 30000, baseSpeed: 2, spawnFactor: 10000 },
];

function setup() {
  imagens = {
    player: [
      loadImage("data/pulga_frente.svg"),
      loadImage("data/pulga_costas.svg"),
    ],
    grama: loadImage("data/grama.svg"),
    mato: loadImage("data/mato.png"),
    terra: loadImage("data/terra.png"),
    loja: loadImage("data/loja.png"),
    arvore: loadImage("data/arvore.png"),
  };

  createCanvas(windowWidth, windowHeight);
  cam = new Cam();
  player = new Player();
  grid = new Grid(10, -(10 * escala) / 2, 0);
  hotB = new HotBar();
  tempo = new Tempo();
  interfa = new Interfacce();
  casa = new Building("casa", -150, -300, 300, 400);
  bicicleta = new Building(
    "bicicleta",
    (grid.numCells * escala) / 2 + 350,
    -100,
    200,
    150
  );
  loja = new Building(
    "loja",
    (grid.numCells * escala) / 2 + 350,
    230,
    270,
    460
  );
  minigame = new Building("minigame", 250, -400, 300, 600);
  range = 4 * (player.raio * 2);
}

function draw() {
  cursor(CROSS);
  switch (state) {
    case "jogo":
      background(50,200,100);
      push();
      cam.move();
      player.move();
      for (let i = 0; i < grid.numCells * 2; i++) {
        for (let z = 0; z < grid.numCells * 2; z++) {
          image(
            imagens.grama,
            -(grid.numCells * 100) + i * 100,
            -(grid.numCells * 100) + z * 100,
            100,
            100
          );
        }
      }
      noStroke();
      fill(50,200,100);
      rect(
        grid.pos.x,
        grid.pos.y,
        grid.numCells * escala,
        grid.numCells * escala
      );
      image(imagens.terra,grid.pos.x-20, grid.pos.y-20,imagens.terra.width/2-60,imagens.terra.height/2-60);
      if (inReach(player.pos, "m") && mouseIsPressed) {
        grid.mouseC = true;
      } else {
        grid.mouseC = false;
      }
      grid.show();

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].finished()) {
          particles.splice(i, 1);
        }
      }

      fill("#82DD52");

      player.show();
      rect(-1000, -1000, 600, 2000);
      rect(-1000, -1000, 2500, 700);
      rect(800, 100, 600, 2000);
      rect(-1000, 600, 2000, 600);

      push();
      image(imagens.mato,-550,-420,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,-500,500,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,0,500,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,0,-450,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,200,500,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,700,-350,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,400,-350,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,750,-50,imagens.mato.width/2,imagens.mato.height/2);
      rotate(radians(90));
      image(imagens.mato,-350,320,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,50,320,imagens.mato.width/2,imagens.mato.height/2);
      image(imagens.mato,0,-1000,imagens.mato.width/2,imagens.mato.height/2);
      pop();
      casa.show();
      //igreja.show();
      bicicleta.show();
      loja.show();
      minigame.show();

      for (let i = effects.length - 1; i >= 0; i--) {
        effects[i].update();
        effects[i].show();
        if (effects[i].finished()) {
          effects.splice(i, 1);
        }
      }

      for (const ob of obs) {
        ob.show();
      }
      pop();

      tempo.show();
      interfa.show();
      tempo.update();
      hotB.show();
      break;
    case "novo dia":
      if (time === 0) {
        time = millis();
      } else if (millis() >= time + 1000) {
        background("#1B1133");
        fill(255);
        textSize(50);
        textAlign(CENTER, CENTER);
        text(`O dia ${tempo.dia - 1} acabou`, width / 2, height / 3);
        textSize(20);
        if (
          botao(
            "Proximo dia",
            width / 2,
            height / 3 + escala * 2,
            200,
            escala * 1.5
          )
        ) {
          state = "jogo";
        }
        if (
          botao(
            "Fazer as contas",
            width / 2,
            height / 3 + escala * 4,
            200,
            escala * 1.5,
            0
          )
        ) {
          state = "fim";
          time = 0;
        }
      } else {
        background("#150D270A");
      }
      break;
    case "fim":
      if (time === 0) {
        time = millis();
      } else if (millis() >= time + 1000) {
        background("#1B1133");
        fill(255);
        textSize(50);
        textAlign(CENTER, CENTER);
        text("✍️Contas finais🧾", width / 2, height / 2.5);
        textSize(25);
        text("Plantação", width / 2, height / 2);
        textSize(20);
        text("Produzido    Doado     Vendido", width / 2, height / 2 + 30);
        text(
          " B:" +
            brocolis +
            " A:" +
            alface +
            "    B:" +
            d_brocolis +
            " A:" +
            d_alface +
            "    B:" +
            v_brocolis +
            " A:" +
            v_alface,
          width / 2,
          height / 2 + 60
        );
        textSize(25);
        text("Dinheiro", width / 2, height / 2 + 90);
        textSize(20);
        text(
          "Total: $" +
            dindin +
            "   Auxilio: $" +
            auxilio +
            "   Lucro: $" +
            (dindin - gasto),
          width / 2,
          height / 2 + 120
        );
        textSize(25);
        text("Refeições produzidas", width / 2, height / 2 + 150);
        textSize(20);
        text(
          "Alimento produzido: " +
            (alface * p_alface + brocolis * p_brocolis) +
            "g   Refeições:" +
            (alface * p_alface + brocolis * p_brocolis) / 400,
          width / 2,
          height / 2 + 180
        );
      } else {
        background("#150D270A");
      }
      break;
    case "minigame":
      if (!fadingOut) {
        textAlign(CENTER, CENTER);
        background(30, 30, 50);
        if (!gameStarted) {
          showStartScreen();
          return;
        }
        background(50,200,100);
      for (let i = 0; i < grid.numCells * 2; i++) {
        for (let z = 0; z < grid.numCells * 2; z++) {
          image(
            imagens.grama,
            -(grid.numCells * 100) + i * 200,
            -(grid.numCells * 100) + z * 200,
            200,
            200
          );
        }
      }
        imageMode(CENTER);
        image(imagens.arvore,width/2,0,width,imagens.arvore.height*(width)/imagens.arvore.width);
        imageMode(CORNER);

        let config = difficulties[selectedDifficulty];
        let elapsedTime = millis() - startTime;

        // Spawn maçãs
        let spawnRate = max(5, 60 - int(elapsedTime / 1000));
        if (frameCount % spawnRate === 0) {
          let quantidade = floor(1 + elapsedTime / config.spawnFactor);
          for (let i = 0; i < quantidade; i++) {
            apples.push(new Apple(config.baseSpeed, elapsedTime));
          }
        }

        // Jogador e partículas

        player.move();
        if (player.vel.x != 0 || player.vel.y != 0) {
          player.emitParticles();
        }

        // Partículas do rastro
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].show();
          if (particles[i].finished()) {
            particles.splice(i, 1);
          }
        }
        player.show();

        // Brilho coletado
        for (let i = effects.length - 1; i >= 0; i--) {
          effects[i].update();
          effects[i].show();
          if (effects[i].finished()) {
            effects.splice(i, 1);
          }
        }

        // Maçãs
        for (let i = apples.length - 1; i >= 0; i--) {
          apples[i].fall();
          apples[i].show();

          if (apples[i].hits(player)) {
            if (apples[i].type === "normal") score++;
            else if (apples[i].type === "gold") score += 5;
            else if (apples[i].type === "speed") {
              player.speedBoost();
              speedBoostTimer = millis() + 5000;
            }
            effects.push(new Shine(apples[i].x, apples[i].y));
            apples.splice(i, 1);
          } else if (apples[i].y > height) {
            apples.splice(i, 1);
          }
        }

        // Reseta boost
        if (player.boosted && millis() > speedBoostTimer) {
          player.resetSpeed();
        }

        drawHUD(config.duration, elapsedTime);

        if (elapsedTime >= config.duration && !fadingOut) {
          fadingOut = true;
        }
      } else {
        fadeAlpha += 5;
        fill(0, fadeAlpha);
        rect(0, 0, width, height);
        if (fadeAlpha >= 255) {
          showEndScreen();
        }
      }
      break;
    default:
      background(0);
      fill(255);
      textSize(50);
      textAlign(CENTER, CENTER);
      text("Algum erro aconteceu 💀", width / 2, height / 2);
  }

  click = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cam.lmtCam.set(width / 2, height / 2);
  hotB.pos.set(width - hotB.sizeItemFrame - escala / 2, escala / 2);
}

function mouseWheel(event) {
  switch (state) {
    case "jogo":
      if (event.delta > 0) {
        //baixo
        if (hotB.itemInUse < hotB.itemNum - 1) {
          hotB.itemInUse++;
        } else {
          hotB.itemInUse = 0;
        }
      } else if (event.delta < 0) {
        //cima
        if (hotB.itemInUse > 0) {
          hotB.itemInUse--;
        } else {
          hotB.itemInUse = hotB.itemNum - 1;
        }
      }
      break;
    default:
  }

  return false;
}

function mouseClicked() {
  switch (state) {
    case "jogo":
      // if (inReach(player.pos, "m")) {
      //   grid.mouseC = true;
      // }
      // if ( hotB.item[hotB.itemInUse].id === "Agua" ) {}
        effects.push(new Shine(mouseX + -1 * cam.camPos.x, mouseY + -1 * cam.camPos.y));
      
      break;
    default:
  }

  click = true;
  //print(cam.camPos.x - mouseX + ", " + (cam.camPos.y - mouseY));
}

function keyPressed() {
  if (!gameStarted && state == "minigame") {
    if (keyCode === UP_ARROW)
      selectedDifficulty =
        (selectedDifficulty + difficulties.length - 1) % difficulties.length;
    else if (keyCode === DOWN_ARROW)
      selectedDifficulty = (selectedDifficulty + 1) % difficulties.length;
    else if (keyCode === ENTER) {
      gameStarted = true;
      startTime = millis();
      fadeAlpha = 255;
      fadingIn = true;
      fadingOut = false;
    }
  }
}
