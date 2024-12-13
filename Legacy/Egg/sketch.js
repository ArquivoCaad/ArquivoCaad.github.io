//variaveis globais
let range,
  escala,
  time,
  brocolis,
  alface,
  fim,
  trans,
  cont,
  m,
  resultado,
  txt,
  entidade,
  imgEntidade,
  click,
  state;

//classes
let interfa, cam, player, grid, hotB, tempo, casa, igreja, loja;

let imagens;

function preload() {
  imagens = {
    player: [
      loadImage("data/pulga_frente.svg"),
      loadImage("data/pulga_costas.svg"),
    ],
    grama: loadImage("data/grama.svg"),
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  escala = 50;
  time = 0;
  click = false;
  cam = new Cam();
  player = new Player();
  grid = new Grid(10, -(10 * escala) / 2, 0);
  hotB = new HotBar();
  tempo = new Tempo();
  interfa = new Interfacce();
  casa = new Bilding("casa", -((grid.numCells * escala) / 2), -300, 300, 300);
  igreja = new Bilding("igreja", (grid.numCells * escala) / 2, -300, 300, 300);
  loja = new Bilding("loja", (grid.numCells * escala) / 2 + 350, 200, 300, 300);
  range = 4 * (player.raio * 2);
  state = "jogo";
  fim = false;
  brocolis = 0;
  alface = 0;
  resultado = false;
  cursor(CROSS);
  //tint(255,100);
}

function draw() {
  cursor(CROSS);
  switch (state) {
    case "jogo":
      background(0);
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
      fill(0);
      rect(grid.pos.x,grid.pos.y,grid.numCells*escala,grid.numCells*escala);
      
      grid.show();
      for (const ob of obs) {
        ob.show();
      }

      player.show();
      casa.show();
      igreja.show();
      loja.show();
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
        text(`O dia ${tempo.dia - 1} acabou`, width / 2, height / 2);
        textSize(30);
        if (botao("Proximo dia", width / 2, height / 2 + escala * 2, 200, 50)) {
          state = "jogo";
        }
      } else {
        background("#150D270A");
      }
      break;
    case "fim":
      background(0);
      if (fim) {
        if (!resultado) {
          const finalizacao = [
            "10 dias se passaram",
            "Voce caminha em direção ao altar, a pressão do magestoso ovo em sua frente lhe enche de alegria",
            "Este é o dia mais feliz em sua vida, o tão esperado fim chegou, nosso grande deus em breve chegara em nosso plano",
            "Voce faz sua oferenda " +
              brocolis +
              " Brocolis e " +
              alface +
              " Alfaces",
          ];

          textAlign(CENTER, CENTER);
          textSize(250);
          fill(255);
          text("🥚", width / 2, height / 3);
          fill(255, trans);
          textSize(30);
          text(
            finalizacao[cont],
            width / 5,
            (height / 5) * 3,
            (width / 5) * 3,
            (height / 5) * 2
          );

          if (trans == 10) {
            trans = 255;
            m = millis();
            cont++;
            resultado = cont == finalizacao.length ? true : false;
            cont = cont == finalizacao.length ? 0 : cont;
            cont = constrain(cont, 0, finalizacao.length - 1);
          } else if (m + 2500 <= millis()) {
            trans -= 2;
            trans = constrain(trans, 10, 255);
          }
        } else {
          if (entidade != "vazio") {
            imageMode(CENTER);
            image(
              imgEntidade,
              width / 2,
              height / 3,
              (imgEntidade.width * 300) / imgEntidade.height,
              300
            );
            textSize(30);
            fill(255, trans);
            textAlign(CENTER, CENTER);
            text(
              txt[cont],
              width / 5,
              (height / 5) * 3,
              (width / 5) * 3,
              (height / 5) * 2
            );

            if (trans == 10) {
              trans = 255;
              m = millis();
              cont++;
              cont = cont == txt.length ? 0 : cont;
              cont = constrain(cont, 0, txt.length - 1);
            } else if (m + 2500 <= millis()) {
              trans -= 2;
              trans = constrain(trans, 10, 255);
            }
          } else {
            textSize(30);
            fill(255);
            textAlign(CENTER, CENTER);
            text(
              "Os Grandes Antigos estão decepcionados com suas oferendas, tente novamente.",
              width / 5,
              height / 5,
              (width / 5) * 3,
              (height / 5) * 4
            );
          }
        }
      } else {
        for (let i = 0; i < hotB.itemNum; i++) {
          if (hotB.item[i].type === "crop") {
            if (hotB.item[i].id === "Brocolis") {
              brocolis = hotB.item[i].qnt;
            } else if (hotB.item[i].id === "Alface") {
              alface = hotB.item[i].qnt;
            }
          }
        }
        const porB = (brocolis * 100) / (brocolis + alface);
        const porA = (alface * 100) / (brocolis + alface);
        cont = 0;
        trans = 255;
        m = millis();

        if (brocolis == 0 && alface == 0) {
          fim = true;
          entidade = "vazio";
        } else if (porB > 60) {
          fim = true;
          entidade = "Cthulhu";
          txt = [
            "No momento em que as palavras arcaicas ecoam nas profundezas da noite",
            " uma névoa antiga começa a se erguer dos abismos ocultos da mente humana.",
            "Sombras ancestrais dançam ao redor de um altar macabro, enquanto uma figura colossal emerge lentamente das sombras dimensionais.",
            "Suas asas imensas abrem-se como portais para um cosmos distorcido e sem estrelas",
            " revelando um corpo coberto por escamas e tentáculos que retorcem-se em um frenesi de loucura.",
            " Os olhos de Cthulhu, incandescentes com a promessa de um conhecimento proibido, fitam o invocador com um misto de curiosidade e malícia.",
            " O ar ao redor vibra com uma energia opressiva",
            " O Grande Antigo desperta de seu sono milenar para contemplar novamente a humanidade com sua presença indescritível e terrível.",
          ];
          imgEntidade = loadImage("data/cthulhu.jpg");
        } else if (porA > 60) {
          fim = true;
          entidade = "Apophis";
          txt = [
            "À medida que as estrelas se alinham em uma conjunção sinistra,",
            " as palavras sagradas ressoam em um eco ancestral que penetra os véus do tempo e do espaço.",
            " Uma escuridão profunda se adensa, enchendo o ar com um frio que vai além do físico.",
            " Das profundezas do vazio cósmico, surge lentamente uma serpente titânica,",
            " cujo corpo escamoso e sinuoso se contorce em padrões impossíveis de serem compreendidos pela mente humana.",
            " Apophis, o Devorador de Mundos, desenrola-se das sombras primordiais,",
            " seus olhos brilhando com uma fome insaciável pela destruição e pela entropia.",
            " As estrelas parecem empalidecer diante de sua presença imponente,",
            " enquanto sua mera existência distorce a realidade ao seu redor.",
            " O ar fica pesado com a promessa de desolação,",
            " pois o Grande Ser Antigo desperta para sondar os limites da existência terrena mais uma vez,",
            " pronto para cumprir seu papel cósmico como o arauto do fim dos tempos.",
          ];
          imgEntidade = loadImage("data/apophis.jpg");
        } else {
          fim = true;
          entidade = "Caos";
          txt = [
            "Caos foi o primeiro primordial a existir, antes dos deuses e dos titã,",
            " foi o Caos que deu origem a toda a existência e tudo que existe.",
            " O Caos é deus do vazio e do caos a primeira forma de consciência divina,",
            " pouco se sabe sobre ele por ser difícil entendimento e compreensão,",
            " pelas suas mudanças de ideas que sofre ao passar do tempo,",
            " esse deus pode tanto quanto criar universo e reduzi-los ao completo caos primordial.",
          ];
          imgEntidade = loadImage("data/Caos.jpg");
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
      if (inReach(player.pos, "m")) {
        grid.mouseC = true;
      }
      break;
    default:
  }

  click = true;
  print(cam.camPos.x - mouseX + ", " + (cam.camPos.y - mouseY));
}
