window.onload = function(){
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
} else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
    document.documentElement.mozRequestFullScreen();
} else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    document.documentElement.webkitRequestFullscreen();
} else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
    document.documentElement.msRequestFullscreen();
}
}

let state, click, next, pState, npc, obj, oriCont, senha, fase;

let menu,
  delegado,
  amigo,
  porteiro,
  aluna_entrada,
  cantina,
  aluno_cantina,
  pintora;

let fala = {
  detetive: [
    "Olá, detetive. Nós recebemos a denúncia de que o gato Mingau está desaparecido. Você foi designado para o caso.",
    "Venha comigo, vou te levar para o local onde o Mingau foi visto pela última vez.",
    " É aqui que começa sua missão. Entreviste as testemunhas e procure por pistas. Boa sorte, detetive!",
  ],
  porteiro: [
    "Eu via o  Mingau passar por aqui todos os dias, ele tem aulas aqui.",
  ],
  amigo: [
    "Eu sou amigo do Mingau. Ele estava entrando na Belas Artes da última vez que eu o vi. Por favor, encontre ele! Sinto falta de desenhar com ele pelo prédio, olha o que a gente costumava fazer.",
  ],
  npcEntrada: [
    "Desculpe, eu não conheço o Mingau. Mas eu encontrei esse papel no chão no dia que parece que ele sumiu. Talvez seja dele.",
  ],
  vendedora: [
    "Sim, o Mingau passou por aqui naquele dia! Lembro porque ele reclamou de tintas vazando na mochila dele.",
    "Ele comprou uma empada de whiskas.",
    "Tem um mural perto da entrada, você pode descobrir a aula que ele teve.",
  ],
  npcCantina: [
    "Nham nham nham. Desculpa, não estou com tempo. Tenho que correr para a aula.",
  ],
  npcPintura: [
    "Aquela é a tela de pintura do Mingau. Foi da última atividade que a professora passou. Talvez olhar lá possa te ajudar.",
  ],
};

let imagem;

function preload() {
  imagem = {
    delegacia: loadImage("data/delegacia.jpg"),
    entrada: loadImage("data/entrada.jpg"),
    cantina: [loadImage("data/cantina.jpg"), loadImage("data/cantina2.jpg")],
    pintura: loadImage("data/pintura.jpg"),
    mingau: loadImage("data/mingau.svg"),
    talk: [
      loadImage("data/delegado.svg"),
      loadImage("data/amigo.svg"),
      loadImage("data/npc_entrada.svg"),
      loadImage("data/porteiro.svg"),
      loadImage("data/cantina.svg"),
      loadImage("data/pintora.svg"),
      loadImage("data/npc_cantina.svg"),
    ],
    talkId: {
      delegado: 0,
      amigo: 1,
      porteiro: 3,
      aluna_entrada: 2,
      cantina: 4,
      pintora: 5,
      aluno_cantina: 6,
    },
    obj: [
      loadImage("data/horario.jpg"),
      loadImage("data/Empada.jpg"),
      loadImage("data/foto.jpg"),
      loadImage("data/cartao.svg"),
      loadImage("data/quadro.jpg"),
    ],
    objName: [
      "Horario Aulas",
      "Promoção Empada",
      "Eu e Mingau",
      "Cartão Mingau",
      "Quadro Mingau",
    ],
    objId: {
      horario: 0,
      empada: 1,
      foto: 2,
      cartao: 3,
      quadro: 4,
    },
    origame: [
      loadImage("data/origami1.svg"),
      loadImage("data/origami2.svg"),
      loadImage("data/origami3.svg"),
      loadImage("data/origami.jpg"),
    ],
    pata: [loadImage("data/pata1.svg"),
    loadImage("data/pata2.svg")]
  };
  superHoney = loadFont("data/SuperHoney.ttf");
}

function setup() {
  state = "INICIO";
  click = false;
  next = false;
  oriCont = 0;
  createCanvas(windowWidth, windowHeight);
  menu = new GUI(25, 25, 200, 200, 30, "menu");

  delegado = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Delegado",
    imagem.talkId.delegado,
    fala.detetive
  );
  amigo = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Amigo",
    imagem.talkId.amigo,
    fala.amigo
  );
  porteiro = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Porteiro",
    imagem.talkId.porteiro,
    fala.porteiro
  );
  aluna_entrada = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Estudante",
    imagem.talkId.aluna_entrada,
    fala.npcEntrada
  );
  aluno_cantina = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Estudante",
    imagem.talkId.aluno_cantina,
    fala.npcCantina
  );
  cantina = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Tia da cantina",
    imagem.talkId.cantina,
    fala.vendedora
  );
  pintora = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Estudante",
    imagem.talkId.pintora,
    fala.npcPintura
  );
  let heightentrada = (imagem.entrada.height * width) / imagem.entrada.width;

  npc = {
    porteiro: {
      pos: createVector(
        (width / 30) * 4,
        (heightentrada / 10) * 5 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, heightentrada / 10),
    },
    amigo: {
      pos: createVector(
        (width / 30) * 12,
        (heightentrada / 11) * 5 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 3, (heightentrada / 11) * 4),
    },
    aluna_entrada: {
      pos: createVector(
        (width / 30) * 21,
        (heightentrada / 10) * 4 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 3, (heightentrada / 10) * 4),
    },
    cantina: {
      pos: createVector(
        (width / 30) * 5,
        (heightentrada / 10) * 3 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 4, (heightentrada / 10) * 3),
    },
    aluno_cantina: {
      see: true,
      pos: createVector(
        (width / 30) * 5,
        (heightentrada / 10) * 3 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 4, (heightentrada / 10) * 7),
    },
    pintora: {
      see: false,
      pos: createVector(
        (width / 30) * 12,
        (heightentrada / 11) * 4 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 11) * 3),
    },
  };

  obj = {
    horario: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.horario].height * width) /
            4 /
            imagem.obj[imagem.objId.horario].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.horario].height * width) /
          4 /
          imagem.obj[imagem.objId.horario].width +
          70,
        25,
        imagem.objId.horario,
        imagem.objName[imagem.objId.horario]
      ),
      pos: createVector(
        (width / 30) * 25,
        (heightentrada / 11) * 2 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 10) * 2),
    },
    empada: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.empada].height * width) /
            4 /
            imagem.obj[imagem.objId.empada].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.empada].height * width) /
          4 /
          imagem.obj[imagem.objId.empada].width +
          70,
          25,
        imagem.objId.empada,
        imagem.objName[imagem.objId.empada]
      ),
      pos: createVector(
        (width / 30) * 26,
        (heightentrada / 11) * 6 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 11) * 2),
    },
    foto: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.foto].height * width) /
            4 /
            imagem.obj[imagem.objId.foto].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.foto].height * width) /
          4 /
          imagem.obj[imagem.objId.foto].width +
          70,
          25,
        imagem.objId.foto,
        imagem.objName[imagem.objId.foto]
      ),
    },
    cartao: {
      popUp: new GUI(
        width / 4,
        height / 2 -
          (imagem.obj[imagem.objId.cartao].height * width) /
            2 /
            imagem.obj[imagem.objId.cartao].width /
            2,
        width / 2,
        (imagem.obj[imagem.objId.cartao].height * width) /
          2 /
          imagem.obj[imagem.objId.cartao].width +
          70,
          25,
        imagem.objId.cartao,
        imagem.objName[imagem.objId.cartao]
      ),
      pos: createVector(
        (width / 30) * 19,
        (heightentrada / 10) * 6 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 10) * 1),
    },
    quadro: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.quadro].height * width) /
            4 /
            imagem.obj[imagem.objId.quadro].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.quadro].height * width) /
          4 /
          imagem.obj[imagem.objId.quadro].width +
          70,
          25,
        imagem.objId.quadro,
        imagem.objName[imagem.objId.quadro]
      ),
      pos: createVector(
        (width / 30) * 22,
        (heightentrada / 10) * 2 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 4, (heightentrada / 10) * 5),
    },
    origame: {
      um: {
        pos: createVector(random(100, width - 100), random(100, height - 100)),
        size: createVector(
          width / 3,
          (imagem.origame[0].height * (width / 3)) / imagem.origame[0].width
        ),
      },
      dois: {
        pos: createVector(random(100, width - 100), random(100, height - 100)),
        size: createVector(
          width / 3,
          (imagem.origame[1].height * (width / 3)) / imagem.origame[1].width
        ),
      },
      tres: {
        pos: createVector(random(100, width - 100), random(100, height - 100)),
        size: createVector(
          width / 3,
          (imagem.origame[2].height * (width / 3)) / imagem.origame[2].width
        ),
      },
      pagUm: new GUI(
        width / 4,
        height / 2 -
          (imagem.origame[0].height * width) / 2 / imagem.origame[0].width / 2,
        width / 2,
        (imagem.origame[0].height * width) / 2 / imagem.origame[0].width + 50,
        25,
        0,
        "Pagina 1"
      ),
      pagDois: new GUI(
        width / 4,
        height / 2 -
          (imagem.origame[1].height * width) / 2 / imagem.origame[1].width / 2,
        width / 2,
        (imagem.origame[1].height * width) / 2 / imagem.origame[1].width + 50,
        25,
        1,
        "Pagina 2"
      ),
      pagTres: new GUI(
        width / 4,
        height / 2 -
          (imagem.origame[2].height * width) / 2 / imagem.origame[2].width / 2,
        width / 2,
        (imagem.origame[2].height * width) / 2 / imagem.origame[2].width + 50,
        25,
        2,
        "Pagina 3"
      ),
    },
  };
  delegado.see = true;
  fase = 0;
}

function draw() {
  switch (state) {
    case "INICIO":
      background("#F5F5F5");
      textSize(30);
      textAlign(CENTER, CENTER);
      fill("#9370DB");
      imageMode(CORNER);
      image(imagem.pata[0],width/10*0.5,height/10*1,width/7,imagem.pata[0].height*width/7/imagem.pata[0].width);
      image(imagem.pata[1],width/10*7,height/10*5,width/7,imagem.pata[1].height*width/7/imagem.pata[1].width);
      textFont(superHoney);
      textStyle(BOLD);
      text("EM BUSCA DE MINGAU", width / 2, height / 8);

      fill(0, 206, 209);
      textSize(20);
      text("BEM VINDE AO NOSSO JOGO!", width / 2, height / 4.8);

      textSize(15);
      fill(75, 0, 130);
      textStyle(NORMAL);
      textFont("Verdana");
      textAlign(LEFT, CENTER);
      text(
        "Este é um jogo desenvolvido na disciplina Introdução a Narrativas Interativas e se passa fisicamente na Escola de Belas Artes. Boa sorte na busca e esperamos que se divirta!! Qualquer feedback nos contate pelo número 31 99672-0919. ",
        50,
        height / 2,
        width / 2
      );

      fill(220, 20, 60);
      textAlign(CENTER, BOTTOM);
      text(
        "PS: O seu jogo não sera salvo caso feche a pagina. Cuidado!",
        width / 2,
        height / 1.05
      );

      if (
        botao(
          "Iniciar",
          width / 10*7,
          (height / 8) * 3.4,
          200,
          30,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        state = "INTRODUÇÃO";
        m = millis();
        click = false;
      } else if (
        botao(
          "Fases",
          width / 10*7,
          (height / 8) * 4.3,
          200,
          30,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        state = "FASES";
        click = false;
      }
      break;
    case "INTRODUÇÃO":
      delegado.seechar = true;
      cursor(ARROW);
      image(
        imagem.delegacia,
        0,
        0,
        width,
        (imagem.delegacia.height * width) / imagem.delegacia.width
      );
      if (delegado.cont == 1) {
        textSize(20);
        if (
          botao(
            "Proximo",
            width - 100,
            height - 100,
            100,
            70,
            color(81, 173, 100),
            color(67, 240, 102),
            color(132, 240, 154),
            "white"
          )
        ) {
          pState = "INTRODUÇÂO";
          delegado.cont++;
          state = "FASE_1";
          click = false;
          fase = 1;
        }
      } else {
        delegado.update();
      }
      delegado.show();
      menu.show();
      break;
    case "FASES":
      background("#F5F5F5");
      imageMode(CORNER);
      image(imagem.pata[0],width/10*0.5,height/10*1,width/7,imagem.pata[0].height*width/7/imagem.pata[0].width);
      image(imagem.pata[1],width/10*7,height/10*5,width/7,imagem.pata[1].height*width/7/imagem.pata[1].width);
      textSize(50);
      textAlign(CENTER, CENTER);
      fill("#9370DB");
      textFont(superHoney);
      textStyle(BOLD);
      text("Fases", width / 2, height / 8);
      textSize(20);
      textStyle(NORMAL);
      textFont("Verdana");
      if (
        botao(
          "Inicio",
          width / 2 - 200,
          height / 3,
          200,
          40,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        state = "INICIO";
        click = false;
      } else if (
        botao(
          "Introdução",
          width / 2- 200,
          height/2,
          200,
          40,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        delegado.cont = 0;
        state = "INTRODUÇÃO";
        click = false;
      }
      else if (
        botao(
          "Origami",
          width / 2 - 200,
          (height / 3) * 2,
          200,
          40,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        pState = state;
        state = "ORIGAMI";
        click = false;
      }
      textSize(15);

      if(fase >= 1){
        if (
        botao(
          "Fase 1",
          width / 2 + 200,
          height / 10*4,
          200,
          30,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        state = "FASE_1";
        click = false;
      }
      } else {
        if (
          botao(
            "Fase 1",
            width / 2 + 200,
            height / 10*4,
            200,
            30,
            "rgb(173, 177, 196)",
            "rgb(173, 177, 196)",
            "rgb(173, 177, 196)",
            0
          )
        ) {
          click = false;
        }
      }

      if(fase >= 2){ 
        if (
        botao(
          "Fase 2",
          width / 2 + 200,
          height / 2,
          200,
          30,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        state = "FASE_2";
        click = false;
      }
    } else {
      if (
        botao(
          "Fase 2",
          width / 2 + 200,
          height / 2,
          200,
          30,
          "rgb(173, 177, 196)",
            "rgb(173, 177, 196)",
            "rgb(173, 177, 196)",
            0
        )
      ) {
        click = false;
      }
    }
    if(fase >= 3){
      if (
        botao(
          "Fase 3",
          width / 2 + 200,
          height / 10*6,
          200,
          30,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        state = "FASE_3";
        click = false;
      }
    } else {
      if (
        botao(
          "Fase 3",
          width / 2 + 200,
          height / 10*6,
          200,
          30,
          "rgb(173, 177, 196)",
            "rgb(173, 177, 196)",
            "rgb(173, 177, 196)",
            0
        )
      ) {
        click = false;
      }
    }

    if(fase >= 4){
       if (
        botao(
          "Fim",
          width / 2 + 200,
          height / 10*7,
          200,
          30,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        state = "FIM";
        click = false;
      }
    }
      break;
    case "LEITORQR":
      background("#F5F5F5");
      textSize(30);
      textAlign(CENTER, CENTER);
      fill("#9370DB");
      textFont(superHoney);
      textStyle(BOLD);
      text("Próxima fase", width / 2, height / 8);
      textStyle(NORMAL);
      textFont("Verdana");
      textSize(15);
      text(
        "Insira a senha presente no cartaz para avançar para a próxima fase, caso esteja muito dificil de encontrar você pode pedir uma dica abaixo.",
        100,
        (height / 8) * 2,
        width - 200
      );
      textStyle(BOLD);
      fill(color(235, 16, 16));
      textSize(20);
      text("Senha Inserida:", 50, (height / 8) * 2+30, width - 100);
      if (senha !== null) {
        fill(0);
        text(senha, 50, height/2 +10, width - 100);
      }
      textStyle(NORMAL);
      textSize(17);
      if (
        botao(
          "Voltar",
          100,
          height - 40,
          100,
          50,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        state = pState;
        click = false;
      }
      if (
        botao(
          "Próximo",
          width - 100,
          height - 40,
          100,
          50,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        switch (fase) {
          case 0:
            senha =
              "O que voce ta fazendo aqui? vai fazer a introdução primeiro.";
            break;
          case 1:
            if (senha == "Mingau, o artista felino") {
              state = "FASE_2";
              fase = 2;
            } else {
              senha = "Senha Incorreta";
            }
            break;
          case 2:
            if (senha == "Entre telas e pincéis") {
              state = "FASE_3";
              fase = 3;
            } else {
              senha = "Senha Incorreta";
            }
            break;
          case 3:
            if (senha == "Sua face se revela") {
              state = "FIM";
              fase = 4;
            } else {
              senha = "Senha Incorreta";
            }
            break;
        }
        click = false;
      }
      if (
        botao(
          "Dica",
          width / 2 + 100,
          height - 40,
          70,
          50,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        switch (fase) {
          case 0:
            senha =
              "O que voce ta fazendo aqui? vai fazer a introdução primeiro.";
            break;
          case 1:
            senha = "A proxima senha esta na entrada da cantina";
            break;
          case 2:
            senha = "A proxima senha esta na entrada do atelie 8";
            break;
          case 3:
            senha = "A proxima senha esta na junção dos origamis";
            break;
        }
      }
      if (
        botao(
          "Senha",
          width / 2 - 50,
          height - 40,
          200,
          50,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        senha = prompt("Por favor, digite a senha:");
        click = false;
      }
      break;
    case "FASE_1":
      background(0);
      cursor(ARROW);
      imageMode(CENTER, CENTER);
      image(
        imagem.entrada,
        width / 2,
        height / 2,
        width,
        (imagem.entrada.height * width) / imagem.entrada.width
      );

      amigo.show();
      amigo.update();
      porteiro.show();
      porteiro.update();
      aluna_entrada.show();
      aluna_entrada.update();

      textSize(40);
      if (delegado.display.size.x > 10) {
        delegado.update();
        delegado.show();
        if (click) {
          delegado.see = false;
        }
      } else if (
        !amigo.seechar &&
        !porteiro.seechar &&
        !aluna_entrada.seechar &&
        !obj.horario.popUp.see &&
        !obj.origame.pagUm.see &&
        botao(
          "😺",
          50,
          height - 50,
          60,
          60,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        pState = "FASE_1";
        state = "LEITORQR";
        click = false;
      } else {
        if (click) {
          if (
            !porteiro.seechar &&
            !aluna_entrada.seechar &&
            !obj.origame.pagUm.see &&
            mouseOverR(npc.amigo.pos, npc.amigo.size.x, npc.amigo.size.y, 1)
          ) {
            amigo.seechar = true;
            click = false;
          } else if (
            !amigo.seechar &&
            !aluna_entrada.seechar &&
            !obj.origame.pagUm.see &&
            mouseOverR(
              npc.porteiro.pos,
              npc.porteiro.size.x,
              npc.porteiro.size.y,
              1
            )
          ) {
            porteiro.seechar = true;
            click = false;
          } else if (
            !amigo.seechar &&
            !porteiro.seechar &&
            !obj.origame.pagUm.see &&
            mouseOverR(
              npc.aluna_entrada.pos,
              npc.aluna_entrada.size.x,
              npc.aluna_entrada.size.y,
              1
            )
          ) {
            aluna_entrada.seechar = true;
            click = false;
          } else if (
            !amigo.seechar &&
            !porteiro.seechar &&
            !aluna_entrada.seechar &&
            !obj.empada.popUp.see &&
            !obj.origame.pagUm.see &&
            mouseOverR(
              obj.horario.pos,
              obj.horario.size.x,
              obj.horario.size.y,
              1
            )
          ) {
            obj.horario.popUp.see = true;
            click = false;
          } else if (
            !amigo.seechar &&
            !porteiro.seechar &&
            !aluna_entrada.seechar &&
            !obj.horario.popUp.see &&
            !obj.origame.pagUm.see &&
            mouseOverR(obj.empada.pos, obj.empada.size.x, obj.empada.size.y, 1)
          ) {
            obj.empada.popUp.see = true;
            click = false;
          }

          if (amigo.see && amigo.cont == amigo.fala.length - 1) {
            amigo.see = false;
            amigo.seechar = false;
            obj.foto.popUp.see = true;
            click = false;
          }
          if (porteiro.see && porteiro.cont == porteiro.fala.length - 1) {
            porteiro.see = false;
            porteiro.seechar = false;
            click = false;
          }
          if (
            aluna_entrada.see &&
            aluna_entrada.cont == aluna_entrada.fala.length - 1
          ) {
            if (oriCont == 0) {
              oriCont++;
            }
            obj.origame.pagUm.see = true;
            aluna_entrada.see = false;
            aluna_entrada.seechar = false;
            click = false;
          }
        }
      }

      obj.origame.pagUm.show();
      obj.foto.popUp.show();
      obj.empada.popUp.show();
      obj.horario.popUp.show();
      menu.show();
      break;
    case "FASE_2":
      cursor(ARROW);
      imageMode(CENTER, CENTER);
      if (npc.aluno_cantina.see) {
        image(
          imagem.cantina[1],
          width / 2,
          height / 2,
          width,
          (imagem.delegacia.height * width) / imagem.delegacia.width
        );
      } else {
        image(
          imagem.cantina[0],
          width / 2,
          height / 2,
          width,
          (imagem.delegacia.height * width) / imagem.delegacia.width
        );
      }

      textSize(40);
      if (
        !aluno_cantina.seechar &&
        !obj.origame.pagUm.see &&
        !cantina.seechar &&
        botao(
          "😺",
          50,
          height - 50,
          60,
          60,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        pState = "FASE_2";
        state = "LEITORQR";
        click = false;
      } else {
        if (click) {
          if (
            !aluno_cantina.seechar &&
            !npc.aluno_cantina.see &&
            !obj.cartao.popUp.see &&
            !obj.origame.pagDois.see &&
            mouseOverR(
              npc.cantina.pos,
              npc.cantina.size.x,
              npc.cantina.size.y,
              1
            )
          ) {
            cantina.seechar = true;
            click = false;
          } else if (
            npc.aluno_cantina.see &&
            !obj.cartao.popUp.see &&
            mouseOverR(
              npc.aluno_cantina.pos,
              npc.aluno_cantina.size.x,
              npc.aluno_cantina.size.y,
              1
            )
          ) {
            npc.aluno_cantina.see = false;
            aluno_cantina.seechar = true;
            click = false;
          } else if (
            !aluno_cantina.seechar &&
            !cantina.seechar &&
            !obj.origame.pagDois.see &&
            mouseOverR(obj.cartao.pos, obj.cartao.size.x, obj.cartao.size.y, 1)
          ) {
            obj.cartao.popUp.see = true;
            click = false;
          }

          if (cantina.see && cantina.cont == cantina.fala.length - 1) {
            cantina.see = false;
            cantina.seechar = false;
            click = false;
          }
          if (
            aluno_cantina.see &&
            aluno_cantina.cont == aluno_cantina.fala.length - 1
          ) {
            aluno_cantina.see = false;
            aluno_cantina.seechar = false;
            click = false;

            if (oriCont == 1) {
              oriCont++;
            }
            obj.origame.pagDois.see = true;
          }
        }
      }
      cantina.show();
      cantina.update();
      aluno_cantina.show();
      aluno_cantina.update();
      obj.cartao.popUp.show();
      obj.origame.pagDois.show();
      menu.show();
      break;
    case "FASE_3":
      cursor(ARROW);
      imageMode(CENTER, CENTER);
      image(
        imagem.pintura,
        width / 2,
        height / 2,
        width,
        (imagem.delegacia.height * width) / imagem.delegacia.width
      );
      textSize(40);
      if (
        !pintora.seechar &&
        !obj.origame.pagTres.see &&
        botao(
          "😺",
          50,
          height - 50,
          60,
          60,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        pState = "FASE_3";
        state = "LEITORQR";
        click = false;
      } else {
        if (click) {
          if (
            !obj.quadro.popUp.see &&
            !obj.origame.pagTres.see &&
            mouseOverR(
              npc.pintora.pos,
              npc.pintora.size.x,
              npc.pintora.size.y,
              1
            )
          ) {
            npc.pintora.see = true;
            pintora.seechar = true;
            click = false;
          } else if (
            npc.pintora.see &&
            !pintora.seechar &&
            !obj.origame.pagTres.see &&
            mouseOverR(obj.quadro.pos, obj.quadro.size.x, obj.quadro.size.y, 1)
          ) {
            obj.quadro.popUp.see = true;
            click = false;
          } else if (obj.quadro.popUp.see) {
            obj.quadro.popUp.see = false;
            click = false;
            if (oriCont == 2) {
              oriCont++;
            }
            obj.origame.pagTres.see = true;
          }

          if (pintora.see && pintora.cont == pintora.fala.length - 1) {
            pintora.see = false;
            pintora.seechar = false;
            click = false;
          }
        }
      }
      pintora.show();
      pintora.update();
      obj.quadro.popUp.show();
      obj.origame.pagTres.show();
      menu.show();
      break;
    case "ORIGAMI":
      cursor(ARROW);
      background("#F5F5F5");
      imageMode(CENTER);
      switch (oriCont) {
        case 1:
          image(
            imagem.origame[0],
            obj.origame.um.pos.x,
            obj.origame.um.pos.y,
            obj.origame.um.size.x,
            obj.origame.um.size.y
          );
          break;
        case 2:
          image(
            imagem.origame[1],
            obj.origame.dois.pos.x,
            obj.origame.dois.pos.y,
            obj.origame.dois.size.x,
            obj.origame.dois.size.y
          );
          image(
            imagem.origame[0],
            obj.origame.um.pos.x,
            obj.origame.um.pos.y,
            obj.origame.um.size.x,
            obj.origame.um.size.y
          );
          break;
        case 3:
          image(
            imagem.origame[2],
            obj.origame.tres.pos.x,
            obj.origame.tres.pos.y,
            obj.origame.tres.size.x,
            obj.origame.tres.size.y
          );
          image(
            imagem.origame[1],
            obj.origame.dois.pos.x,
            obj.origame.dois.pos.y,
            obj.origame.dois.size.x,
            obj.origame.dois.size.y
          );
          image(
            imagem.origame[0],
            obj.origame.um.pos.x,
            obj.origame.um.pos.y,
            obj.origame.um.size.x,
            obj.origame.um.size.y
          );
          break;
      }
      if (mouseIsPressed) {
        let ppos1 = createVector(
          obj.origame.um.pos.x - obj.origame.um.size.x / 2,
          obj.origame.um.pos.y - obj.origame.um.size.y / 2
        );
        let ppos2 = createVector(
          obj.origame.dois.pos.x - obj.origame.dois.size.x / 2,
          obj.origame.dois.pos.y - obj.origame.dois.size.y / 2
        );
        let ppos3 = createVector(
          obj.origame.tres.pos.x - obj.origame.tres.size.x / 2,
          obj.origame.tres.pos.y - obj.origame.tres.size.y / 2
        );
        if (mouseOverR(ppos1, obj.origame.um.size.x, obj.origame.um.size.y)) {
          let pmouse = createVector(mouseX, mouseY);
          obj.origame.um.pos.lerp(pmouse, 0.2);
        } else if (
          mouseOverR(ppos2, obj.origame.dois.size.x, obj.origame.dois.size.y)
        ) {
          let pmouse = createVector(mouseX, mouseY);
          obj.origame.dois.pos.lerp(pmouse, 0.2);
        } else if (
          mouseOverR(ppos3, obj.origame.tres.size.x, obj.origame.tres.size.y)
        ) {
          let pmouse = createVector(mouseX, mouseY);
          obj.origame.tres.pos.lerp(pmouse, 0.2);
        }
      }

      if (
        botao(
          "Voltar",
          50,
          height - 50,
          80,
          50,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        state = pState;
        click = false;
      }
      menu.show();
      break;
    case "FIM":
      background("#F5F5F5");
      imageMode(CORNER);
      image(imagem.pata[0],width/10*0.5,height/10*1,width/7,imagem.pata[0].height*width/7/imagem.pata[0].width);
      image(imagem.pata[1],width/10*7,height/10*5,width/7,imagem.pata[1].height*width/7/imagem.pata[1].width);
      image(imagem.mingau,-20,0,imagem.mingau.width*height/imagem.mingau.height,height);
      textSize(40);
      textAlign(CENTER, CENTER);
      fill("#9370DB");
      textFont(superHoney);
      textStyle(BOLD);
      text("FIM", width / 4*3, height / 8);
      textStyle(NORMAL);
      textAlign(LEFT, CENTER);
      textFont("Verdana");
      textSize(15);
      fill(75, 0, 130);
      text(
        "Ufa! Estou inteiro de novo! Oi, eu sou o Mingau. Muito obrigado por me encontrar, meus amigos devem estar preocupados! Parabéns por ter chegado até o final! E muito obrigado por ter participado. Não esquece de compartilhar o origami que você fez de mim para os criadores do jogo. Manda uma foto clicando em compartilhar!",
        (width / 4*3)-300,
        (height / 8) * 4,
        400
      );
      if (
        botao(
          "Fases",
          width / 4*3-width / 8,
          height-20,
          200,
          40,
          "rgb(94,115,168)",
          "rgb(81,81,151)",
          "rgb(209,211,224)",
          "white"
        )
      ) {
        state = "FASES";
        click = false;
      } else if (
        botao(
          "compartilhar",
          width / 4*3+width / 8,
          height-20,
          200,
          40,
          color(81, 173, 100),
          color(67, 240, 102),
          color(132, 240, 154),
          "white"
        )
      ) {
        window.location.href = "https://api.whatsapp.com/send?phone=5531996720919&text=Bom%20dia,%20que%20acabei%20de%20jogar%20o%20jogo%20%22Em%20busca%20de%20Mingau%22.";
        click = false;
      }
      break;
  }
  click = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  click = false;
  next = false;
  menu = new GUI(25, 25, 200, 200, 30, "menu");

  delegado = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Delegado",
    imagem.talkId.delegado,
    fala.detetive
  );
  amigo = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Amigo",
    imagem.talkId.amigo,
    fala.amigo
  );
  porteiro = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Porteiro",
    imagem.talkId.porteiro,
    fala.porteiro
  );
  aluna_entrada = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Estudante",
    imagem.talkId.aluna_entrada,
    fala.npcEntrada
  );
  aluno_cantina = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Estudante",
    imagem.talkId.aluno_cantina,
    fala.npcCantina
  );
  cantina = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Tia da cantina",
    imagem.talkId.cantina,
    fala.vendedora
  );
  pintora = new Falas(
    200,
    (height / 5) * 3,
    (width / 5) * 4,
    (height / 5) * 3,
    "Estudante",
    imagem.talkId.pintora,
    fala.npcPintura
  );
  let heightentrada = (imagem.entrada.height * width) / imagem.entrada.width;

  npc = {
    porteiro: {
      pos: createVector(
        (width / 30) * 4,
        (heightentrada / 10) * 5 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, heightentrada / 10),
    },
    amigo: {
      pos: createVector(
        (width / 30) * 12,
        (heightentrada / 11) * 5 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 3, (heightentrada / 11) * 4),
    },
    aluna_entrada: {
      pos: createVector(
        (width / 30) * 21,
        (heightentrada / 10) * 4 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 3, (heightentrada / 10) * 4),
    },
    cantina: {
      pos: createVector(
        (width / 30) * 5,
        (heightentrada / 10) * 3 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 4, (heightentrada / 10) * 3),
    },
    aluno_cantina: {
      see: true,
      pos: createVector(
        (width / 30) * 5,
        (heightentrada / 10) * 3 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 4, (heightentrada / 10) * 7),
    },
    pintora: {
      see: false,
      pos: createVector(
        (width / 30) * 12,
        (heightentrada / 11) * 4 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 11) * 3),
    },
  };

  obj = {
    horario: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.horario].height * width) /
            4 /
            imagem.obj[imagem.objId.horario].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.horario].height * width) /
          4 /
          imagem.obj[imagem.objId.horario].width +
          70,
        25,
        imagem.objId.horario,
        imagem.objName[imagem.objId.horario]
      ),
      pos: createVector(
        (width / 30) * 25,
        (heightentrada / 11) * 2 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 10) * 2),
    },
    empada: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.empada].height * width) /
            4 /
            imagem.obj[imagem.objId.empada].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.empada].height * width) /
          4 /
          imagem.obj[imagem.objId.empada].width +
          70,
          25,
        imagem.objId.empada,
        imagem.objName[imagem.objId.empada]
      ),
      pos: createVector(
        (width / 30) * 26,
        (heightentrada / 11) * 6 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 11) * 2),
    },
    foto: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.foto].height * width) /
            4 /
            imagem.obj[imagem.objId.foto].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.foto].height * width) /
          4 /
          imagem.obj[imagem.objId.foto].width +
          70,
          25,
        imagem.objId.foto,
        imagem.objName[imagem.objId.foto]
      ),
    },
    cartao: {
      popUp: new GUI(
        width / 4,
        height / 2 -
          (imagem.obj[imagem.objId.cartao].height * width) /
            2 /
            imagem.obj[imagem.objId.cartao].width /
            2,
        width / 2,
        (imagem.obj[imagem.objId.cartao].height * width) /
          2 /
          imagem.obj[imagem.objId.cartao].width +
          70,
          25,
        imagem.objId.cartao,
        imagem.objName[imagem.objId.cartao]
      ),
      pos: createVector(
        (width / 30) * 19,
        (heightentrada / 10) * 6 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 2, (heightentrada / 10) * 1),
    },
    quadro: {
      popUp: new GUI(
        width / 3,
        height / 2 -
          (imagem.obj[imagem.objId.quadro].height * width) /
            4 /
            imagem.obj[imagem.objId.quadro].width /
            2,
        width / 4,
        (imagem.obj[imagem.objId.quadro].height * width) /
          4 /
          imagem.obj[imagem.objId.quadro].width +
          70,
          25,
        imagem.objId.quadro,
        imagem.objName[imagem.objId.quadro]
      ),
      pos: createVector(
        (width / 30) * 22,
        (heightentrada / 10) * 2 + (height - heightentrada) / 2
      ),
      size: createVector((width / 30) * 4, (heightentrada / 10) * 5),
    },
    origame: {
      um: {
        pos: createVector(random(100, width - 100), random(100, height - 100)),
        size: createVector(
          width / 3,
          (imagem.origame[0].height * (width / 3)) / imagem.origame[0].width
        ),
      },
      dois: {
        pos: createVector(random(100, width - 100), random(100, height - 100)),
        size: createVector(
          width / 3,
          (imagem.origame[1].height * (width / 3)) / imagem.origame[1].width
        ),
      },
      tres: {
        pos: createVector(random(100, width - 100), random(100, height - 100)),
        size: createVector(
          width / 3,
          (imagem.origame[2].height * (width / 3)) / imagem.origame[2].width
        ),
      },
      pagUm: new GUI(
        width / 4,
        height / 2 -
          (imagem.origame[0].height * width) / 2 / imagem.origame[0].width / 2,
        width / 2,
        (imagem.origame[0].height * width) / 2 / imagem.origame[0].width + 50,
        25,
        0,
        "Pagina 1"
      ),
      pagDois: new GUI(
        width / 4,
        height / 2 -
          (imagem.origame[1].height * width) / 2 / imagem.origame[1].width / 2,
        width / 2,
        (imagem.origame[1].height * width) / 2 / imagem.origame[1].width + 50,
        25,
        1,
        "Pagina 2"
      ),
      pagTres: new GUI(
        width / 4,
        height / 2 -
          (imagem.origame[2].height * width) / 2 / imagem.origame[2].width / 2,
        width / 2,
        (imagem.origame[2].height * width) / 2 / imagem.origame[2].width + 50,
        25,
        2,
        "Pagina 3"
      ),
    },
  };
}

function mouseClicked() {
  click = true;
}
