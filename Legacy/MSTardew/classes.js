let obs = [];

//Classe Para o controle e movimentação da camera
class Cam {
  constructor() {
    this.camPos = createVector(width / 2, height / 2);
    this.lmtCam = createVector(width / 2, height / 2);
  }

  move() {
    translate(this.camPos);
    if (player.pos.x < -1 * this.camPos.x + this.lmtCam.x) {
      this.camPos.x -= player.vel.x;
    }
    if (player.pos.x > -1 * this.camPos.x - this.lmtCam.x + width) {
      this.camPos.x -= player.vel.x;
    }
    if (player.pos.y < -1 * this.camPos.y + this.lmtCam.y) {
      this.camPos.y -= player.vel.y;
    }
    if (player.pos.y > -1 * this.camPos.y - this.lmtCam.y + height) {
      this.camPos.y -= player.vel.y;
    }
  }
}

//Classe Jogador
class Player {
  constructor() {
    this.pos = createVector(0, 0);
    this.face = 0;
    this.raio = escala / 2;
    this.vel = createVector(0, 0);
    this.acc = 0.5;
    this.vellmt = 7;
    this.over = false;
    this.fe = dindin;
    this.r = 0;
    this.boosted = false;
  }

  move() {
    let ppos = this.pos;

    if (keyIsPressed) {

      keyIsDown(65) || keyIsDown(LEFT_ARROW) ? this.vel.sub(this.acc, 0) : keyIsDown(68) || keyIsDown(RIGHT_ARROW) ? this.vel.add(this.acc, 0) : this.face = 0;

      // if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      //   this.face = 0;
      //   this.vel.sub(this.acc, 0);
      // } else if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      //   this.face = 0;
      //   this.vel.add(this.acc, 0);
      // }

      if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        this.face = 1;
        this.vel.sub(0, this.acc);
      } else if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        this.face = 0;
        this.vel.add(0, this.acc);
      }
      this.vel.limit(this.vellmt);
      this.r = radians(map(sin(millis()/100),-1,1,-15,15));
    } else {
      if (this.vel.mag() >= 1) {
        this.p = createVector(0, 0);
        this.vel.lerp(this.p, 0.2);
      } else {
        this.vel.set(0, 0);
      }
    }
    
    if (obsCheck(this.pos) && state != "minigame") {
      this.vel.mult(-1, -1);
    }

    this.pos.add(this.vel);

    if (obsCheck(this.pos) && state != "minigame") {
      this.pos.set(ppos);
    }

    if(state == "minigame"){
      let x = constrain(this.pos.x, this.raio, width - this.raio);
      let y = constrain(this.pos.y, height / 2, height - this.raio);
      this.pos.set(createVector(x,y));
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.r);
    imageMode(CENTER);
    this.boosted ? tint(color(255, 100, 255)) : noTint();
    image(imagens.player[this.face],0, 0, this.raio * 3, this.raio * 3);
    noTint();
    pop();
  }

  emitParticles() {
    for (let i = 0; i < 1; i++) {
      particles.push(new Particle(this.pos.x, this.pos.y + this.raio/2));
    }
  }
  speedBoost() {
    this.vellmt = 12;
    this.boosted = true;
  }

  resetSpeed() {
    this.vellmt = 7;
    this.boosted = false;
  }
}

//Classe para griar e gerenciar o mapa e a grade de celulas
class Grid {
  constructor(num, px, py) {
    this.pos = createVector(px, py);
    this.numCells = num;
    this.cells = [this.numCells];
    this.mouseC = false;
    for (let x = 0; x < this.numCells; x++) {
      this.cells[x] = [this.numCells];
      for (let y = 0; y < this.numCells; y++) {
        this.cells[x][y] = new Cell(
          px + x * escala,
          py + y * escala,
          x,
          y,
          escala
        );
      }
    }
  }

  show() {
    noFill();
    for (let i = 0; i <= this.numCells; i++) {
      let limit = this.numCells * escala;
      noFill();
      stroke(255, 50);
      line(
        this.pos.x + 0,
        this.pos.y + i * escala,
        this.pos.x + limit,
        this.pos.y + i * escala
      );
      line(
        this.pos.x + i * escala,
        this.pos.y + 0,
        this.pos.x + i * escala,
        this.pos.y + limit
      );
    }

    for (let i = 0; i < this.numCells; i++) {
      for (let z = 0; z < this.numCells; z++) {
        this.cells[i][z].show();
        this.cells[i][z].update();
      }
    }
  }
}

//Classe de criação de uma celula individual
class Cell {
  constructor(x, y, idx, idy, escala) {
    this.pos = createVector(x, y);
    this.center = createVector(x + escala / 2, y + escala / 2);
    this.cor = {
      over: color(237, 242, 179, 80),
      roxo: color(141, 66, 245),
      area: color(147, 255, 135, 20),
      arado: color(221, 66, 245,50),
      regado: color(10, 17, 240, 50),
      plantado: color(245, 66, 96),
    };
    this.id = createVector(idx, idy);
    this.state = "vazio";
    this.wet = false;
    this.crop = [1];
    this.i = 0;
  }

  show() {
    noStroke();

    if (this.state === "vazio") {
      if (inReach(this.center, player.pos)) {
        fill(this.cor.area);
        rect(this.pos.x, this.pos.y, escala, escala);
      }
    } else if (this.state === "Arado") {
      fill(this.cor.arado);
      rect(this.pos.x, this.pos.y, escala, escala);
    } else if (this.state === "Plantado") {
      if (this.crop[this.i].state === "pronto") {
        fill(255,255);
        textSize(escala - 10);
        textAlign(CENTER, CENTER);
        text(this.crop[this.i].cor.pronto, this.center.x, this.center.y);
      } else {
        fill(this.cor.arado);
        rect(this.pos.x, this.pos.y, escala, escala);
        fill(this.crop[this.i].cor.estagio);
        ellipse(
          this.pos.x + escala / 2,
          this.pos.y + escala / 2,
          escala / 2,
          escala / 2
        );
      }
    }

    if (inReach(this.center, player.pos)) {
      if (mouseOverR(this.pos, escala, escala, 0)) {
        fill(this.cor.over);
        rect(this.pos.x, this.pos.y, escala, escala);
      }
    }

    if (this.wet && this.state != "vazio") {
      fill(this.cor.regado);
      rect(this.pos.x, this.pos.y, escala, escala);
    }
  }

  update() {
    if (grid.mouseC) {
      if (inReach(this.center, player.pos)) {
        if (mouseOverR(this.pos, escala, escala, 0)) {
          if (
            this.state === "Plantado" &&
            this.crop[this.i].state === "pronto"
          ) {
            this.state = "Arado";
            for (let i = 0; i < hotB.itemNum; i++) {
              if (
                hotB.item[i].type === "crop" &&
                hotB.item[i].id === this.crop[this.i].id
              ) {
                hotB.item[i].qnt++;
                i = hotB.itemNum;
              } else if (hotB.item[i].type === "vazio") {
                hotB.item[i] = new Item(this.crop[this.i].id);
                i = hotB.itemNum;
              }
            }
            this.crop[this.i].id == "Brocolis" ? brocolis++ : alface++;
          } else if (hotB.item[hotB.itemInUse].id === "Picareta") {
            this.state = "vazio";
            this.wet = false;
            grid.mouseC = false;
          } else if (
            hotB.item[hotB.itemInUse].id === "Agua" &&
            this.state != "vazio"
          ) {
            this.wet = true;
            grid.mouseC = false;
          } else if (
            hotB.item[hotB.itemInUse].id === "Arador" &&
            this.state === "vazio"
          ) {
            this.state = "Arado";
            grid.mouseC = false;
          } else if (
            hotB.item[hotB.itemInUse].type === "seed" &&
            this.state === "Arado"
          ) {
            if (this.wet) {
              this.state = "Plantado";
              grid.mouseC = false;
              this.crop[this.i] = new Crop(
                hotB.item[hotB.itemInUse].id,
                hotB.item[hotB.itemInUse].cday
              );
              for (let i = 0; i < hotB.itemNum; i++) {
                if (
                  hotB.item[i].type === "seed" &&
                  hotB.item[i].id === this.crop[this.i].pid
                ) {
                  hotB.item[i].qnt--;
                }
              }
            }
          } else {
            grid.mouseC = false;
          }
        }
      }
    }
  }
}

//classe auxiliar de criação de plantaçoes
class Crop {
  constructor(n, l) {
    switch (n) {
      case "Semente Brocolis":
        this.pid = n;
        this.id = "Brocolis";
        this.pday = tempo.dia;
        this.lday = l;
        this.aday = 1;
        this.cor = { estagio: color(128, 53, 40), pronto: "🥦" };
        this.state = "crescendo";
        break;
      case "Semente alface":
        this.pid = n;
        this.id = "Alface";
        this.pday = tempo.dia;
        this.lday = l;
        this.aday = 1;
        this.cor = { estagio: color(40, 128, 59), pronto: "🥬" };
        this.state = "crescendo";
        break;
      default:
        this.id = "";
    }
  }
}

//Classe da hotbar
class HotBar {
  constructor() {
    this.itemNum = 7;
    this.itemNumy = 10;
    this.item = [this.itemNum];
    this.itemInUse = 0;
    this.sizeItemFrame = escala;
    this.border = escala / 6;
    this.sizeHotBar = createVector(
      this.sizeItemFrame + this.itemNumy + (this.itemNumy + 1) * this.border,
      this.sizeItemFrame * this.itemNum + (this.itemNum + 1) * this.border
    );
    this.pos = createVector(
      width - this.sizeItemFrame - escala / 2,
      escala / 2
    );
    this.cor = {
      base: color(40, 40, 60, 200),
      item: color(80, 80, 80, 170),
      over: color(40, 40, 60, 220),
      inUse: color(100, 150, 100, 200),
    };

    for (let i = 0; i < this.itemNum; i++) {
      this.item[i] = new Item(i);
    }
  }

  show() {
    stroke(255,70);
    fill(this.cor.base);
    rect(this.pos.x, this.pos.y, this.sizeHotBar.x, this.sizeHotBar.y,20);

    for (let i = 0; i < this.itemNum; i++) {
      let tpos = createVector(
        this.pos.x + this.border,
        this.pos.y + this.border + i * this.sizeItemFrame + i * this.border
      );
      if (this.itemInUse === i) {
        stroke(255,70);
        fill(this.cor.inUse);
      } else if (mouseOverR(tpos, this.sizeItemFrame, this.sizeItemFrame, 1)) {
        stroke(255,70);
        fill(this.cor.over);
        cursor(HAND);
        if (mouseIsPressed) {
          this.itemInUse = i;
        }
      } else {
        stroke(255,70);
        fill(this.cor.item);
      }

      rect(tpos.x, tpos.y, this.sizeItemFrame, this.sizeItemFrame,20);

      textSize(32);
      textAlign(CENTER, CENTER);
      fill(255);
      text(
        this.item[i].icon,
        tpos.x + this.sizeItemFrame / 2,
        tpos.y - this.sizeItemFrame / 2 + this.sizeItemFrame
      );

      textSize(20);
      if (this.item[i].type === "seed" || this.item[i].type === "crop") {
        if (this.item[i].qnt > 0) {
          textAlign(RIGHT, BOTTOM);
          stroke(80, 80, 80,200);
          strokeWeight(5);
          fill("white");
          text(
            this.item[i].qnt,
            tpos.x + this.sizeItemFrame - this.border,
            tpos.y + this.sizeItemFrame
          );
          strokeWeight(1);
        } else {
          this.item[i] = new Item("vazio");
        }
      }

      if (mouseOverR(tpos, this.sizeItemFrame, this.sizeItemFrame, 1)) {
        textAlign(RIGHT, CENTER);
        fill(255, 180);
        text(
          this.item[i].id,
          tpos.x - this.sizeItemFrame/2,
          tpos.y - this.sizeItemFrame / 2 + this.sizeItemFrame
        );
      }
    }
  }
}

//Classe auxiliar de criação de item
class Item {
  constructor(n) {
    switch (n) {
      case 0:
        this.id = "Arador";
        this.type = "tool";
        this.icon = "🐜";
        break;
      case 1:
        this.id = "Picareta";
        this.type = "tool";
        this.icon = "⛏️";
        break;
      case 2:
        this.id = "Agua";
        this.type = "tool";
        this.icon = "💧";
        break;
      case 3:
        this.id = "Semente Brocolis";
        this.icon = "🌰";
        this.type = "seed";
        this.pday = 0;
        this.cday = 3;
        this.qnt = 15;
        break;
      case 4:
        this.id = "Semente alface";
        this.icon = "🌰";
        this.type = "seed";
        this.pday = 0;
        this.cday = 3;
        this.qnt = 15;
        break;
      case "Brocolis":
        this.id = "Brocolis";
        this.icon = "🥦";
        this.type = "crop";
        this.qnt = 1;
        break;
      case "Alface":
        this.id = "Alface";
        this.type = "crop";
        this.icon = "🥬";
        this.qnt = 1;
        break;
      default:
        this.id = " ";
        this.type = "vazio";
        this.icon = "";
    }
  }
}

//Classe de controle tempo e derivados
class Tempo {
  constructor() {
    this.dia = 1;
    this.pdia = 0;
    this.timeRate = 208;
    this.pmili = millis();
    this.relogioIcon = {
      zero: [
        "🕛",
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
        "🕕",
        "🕖",
        "🕗",
        "🕘",
        "🕙",
        "🕚",
        "🕛",
      ],
      meia: [
        "🕧",
        "🕜",
        "🕝",
        "🕞",
        "🕟",
        "🕠",
        "🕡",
        "🕢",
        "🕣",
        "🕤",
        "🕥",
        "🕦",
        "🕧",
      ],
    };
    this.relogio = "🕛";
    this.horario = createVector(12, 0);
  }

  show() {
    textSize(25);
    textAlign(LEFT, TOP);
    fill(255);
    stroke(0);

    if (this.horario.x < 10) {
      this.h = "0" + this.horario.x;
    } else {
      this.h = this.horario.x;
    }
    if (this.horario.y < 10) {
      this.m = "0" + this.horario.y;
    } else {
      this.m = this.horario.y;
    }
    fill(255, 100, 255);
    text(
      `📅: ${this.dia}  ${this.relogio}: ${this.h} : ${this.m}`,
      escala * 2,
      escala / 2
    );
  }

  update() {
    if (this.m < 30) {
      this.relogio = this.relogioIcon.zero[this.horario.x % 12];
    } else {
      this.relogio = this.relogioIcon.meia[this.horario.x % 12];
    }

    if (millis() >= this.pmili + this.timeRate) {
      this.horario.add(0, 1);
      this.pmili = millis();
    }

    if (this.horario.y >= 60) {
      this.horario.add(1, 0);
      this.horario.y = 0;
    }

    if (this.horario.x >= 24) {
      tempo.newDay();
    }
  }

  newDay() {
    for (let i = 0; i < grid.numCells; i++) {
      for (let z = 0; z < grid.numCells; z++) {
        if (
          grid.cells[i][z].wet &&
          grid.cells[i][z].crop[grid.cells[i][z].i].aday <
            grid.cells[i][z].crop[grid.cells[i][z].i].lday
        ) {
          grid.cells[i][z].crop[grid.cells[i][z].i].aday++;
        } else if (
          grid.cells[i][z].crop[grid.cells[i][z].i].aday >=
          grid.cells[i][z].crop[grid.cells[i][z].i].lday
        ) {
          grid.cells[i][z].crop[grid.cells[i][z].i].state = "pronto";
        }
        if (grid.cells[i][z].state === "Arado") {
          if (int(random(100) < 40)) {
            grid.cells[i][z].state = "vazio";
          }
        }
        grid.cells[i][z].wet = false;
      }
    }

    this.horario.x = 0;
    this.dia++;
    state = "novo dia";
    time = 0;
    player.pos.set(0, 0);
    player.vel.set(0, 0);
    player.fe += 30;
    dindin += 30;
    auxilio += 30;
    cam.camPos.set(width / 2, height / 2);
  }
}

//Classe GUI
class Interfacce {
  constructor() {
    this.temp = false;
    this.menu = new GUI(escala / 2, escala / 2, 300, 230, "menu");
    this.loja = new GUI(width / 2, height / 2, 600, 560, "shop");
  }

  show() {
    textSize(25);
    fill(255);
    textAlign(LEFT, TOP);
    fill(0, 255, 200);
    text("💰: " + player.fe, escala * 2, escala+10);
    this.menu.show();
    this.loja.show();
  }
}

class GUI {
  constructor(x, y, l, a, dot) {
    this.state = "icon";
    this.type = dot;
    switch (dot) {
      case "menu":
        this.see = false;
        this.icon = {
          pos: createVector(x, y),
          size: createVector(escala, escala),
          dot: [
            createVector(x + escala / 4, y + escala / 3),
            createVector(x + escala - escala / 4, y + escala / 3),
            createVector(x + escala / 4, y + escala - escala / 3),
            createVector(x + escala - escala / 4, y + escala - escala / 3),
            createVector(x + escala / 4, y + escala / 3 + escala / 3 / 2),
            createVector(
              x + escala - escala / 4,
              y + escala / 3 + escala / 3 / 2
            ),
          ],
          pdot: [
            createVector(x + escala / 4, y + escala / 3),
            createVector(x + escala - escala / 4, y + escala / 3),
            createVector(x + escala / 4, y + escala - escala / 3),
            createVector(x + escala - escala / 4, y + escala - escala / 3),
            createVector(x + escala / 4, y + escala / 3 + escala / 3 / 2),
            createVector(
              x + escala - escala / 4,
              y + escala / 3 + escala / 3 / 2
            ),
          ],
        };
        this.display = {
          pos: createVector(x - 10, y - 10),
          size: createVector(0, 0),
          min: createVector(0, 0),
          max: createVector(l, a),
        };
        this.cor = color(40, 40, 60, 220);
        this.slider1 = new Slider(
          this.icon.pos.x + 10,
          this.icon.pos.y + 85,
          200,
          15,
          1,
          12,
          1,
          500,
          "quantidade"
        );
        break;
      case "shop":
        this.see = false;
        this.icon = {
          pos: createVector(x - l / 2, y - a / 2),
          size: createVector(escala, escala),
          dot: [
            createVector(x - l / 2 + escala / 4, y - a / 2 + escala / 3),
            createVector(
              x - l / 2 + escala - escala / 4,
              y - a / 2 + escala / 3
            ),
            createVector(
              x - l / 2 + escala / 4,
              y - a / 2 + escala - escala / 3
            ),
            createVector(
              x - l / 2 + escala - escala / 4,
              y - a / 2 + escala - escala / 3
            ),
            createVector(
              x - l / 2 + escala / 4,
              y - a / 2 + escala / 3 + escala / 3 / 2
            ),
            createVector(
              x - l / 2 + escala - escala / 4,
              y - a / 2 + escala / 3 + escala / 3 / 2
            ),
          ],
          pdot: [
            createVector(x - l / 2 + escala / 4, y - a / 2 + escala / 3),
            createVector(
              x - l / 2 + escala - escala / 4,
              y - a / 2 + escala / 3
            ),
            createVector(
              x - l / 2 + escala / 4,
              y - a / 2 + escala - escala / 3
            ),
            createVector(
              x - l / 2 + escala - escala / 4,
              y - a / 2 + escala - escala / 3
            ),
            createVector(
              x - l / 2 + escala / 4,
              y - a / 2 + escala / 3 + escala / 3 / 2
            ),
            createVector(
              x - l / 2 + escala - escala / 4,
              y - a / 2 + escala / 3 + escala / 3 / 2
            ),
          ],
        };
        this.display = {
          pos: createVector(x - 10 - l / 2, y - 10 - a / 2),
          size: createVector(0, 0),
          min: createVector(0, 0),
          max: createVector(l, a),
          center: createVector(x - 10, y - 10),
        };
        this.cor = color(255, 200);
        break;
    }
  }

  show() {
    switch (this.type) {
      case "menu":
        this.menu();
        break;
      case "shop":
        this.shop();
        break;
    }
  }

  shop() {
    if (
      mouseOverR(this.icon.pos, this.icon.size.x, this.icon.size.y, 1) ||
      (this.see &&
        !mouseOverR(
          this.display.pos,
          this.display.size.x,
          this.display.size.y,
          1
        ) &&
        this.display.size.x >= this.display.size.x - 10)
    ) {
      cursor(HAND);
      this.cor = color(40, 40, 60, 220);
      if (click) {
        this.see = !this.see;
        click = false;
      }
    } else {
      this.cor = color(100, 100, 140, 255);
    }

    if (this.see) {
      this.display.size.lerp(this.display.max, 0.2);
    } else if (this.display.size.x > this.icon.size.x) {
      this.display.size.lerp(this.display.min, 0.2);
    }

    if (this.see) {
      this.icon.dot[0].lerp(this.icon.pdot[2], 0.2);
      this.icon.dot[2].lerp(this.icon.pdot[0], 0.2);
      this.icon.dot[4].lerp(this.icon.pdot[2], 0.2);
      this.icon.dot[5].lerp(this.icon.pdot[1], 0.2);
    } else {
      this.icon.dot[0].lerp(this.icon.pdot[0], 0.2);
      this.icon.dot[2].lerp(this.icon.pdot[2], 0.2);
      this.icon.dot[4].lerp(this.icon.pdot[4], 0.2);
      this.icon.dot[5].lerp(this.icon.pdot[5], 0.2);
    }

    rectMode(CENTER);
    //Display
    if (this.display.size.x > this.icon.size.x) {
      strokeWeight(1);
      stroke(255,50);
      fill(40, 40, 60, 220);
      rect(
        this.display.center.x,
        this.display.center.y,
        this.display.size.x,
        this.display.size.y,
        28
      );

      if (this.display.size.x > this.display.max.x - 20) {
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(27);
        text(
          "Loja do seu Zé",
          this.display.center.x +
            this.display.max.x / 2 -
            this.display.size.x / 2,
          this.display.center.y +
            (this.icon.size.x / 3) * 2 -
            this.display.size.y / 2
        );
        fill(0,255,0);
          stroke("green");
        text(
          "💰: " + player.fe,
          this.display.center.x +
            this.display.max.x / 2 -
            this.display.size.x / 2 + 200,
          this.display.center.y +
            (this.icon.size.x / 3) * 2 -
            this.display.size.y / 2
        );
        
        /*
        textAlign(LEFT, CENTER);
        textSize(16);
        text("Quantidade:", this.icon.pos.x, this.icon.pos.y + 50);
        this.slider1.update();
        this.slider1.show();*/

        rectMode(CORNER);
        //Icon
        noStroke();
        fill(this.cor);
        rect(
          this.icon.pos.x,
          this.icon.pos.y,
          this.icon.size.x,
          this.icon.size.y,
          28
        );
        stroke(200);
        strokeWeight(3);
        line(
          this.icon.dot[0].x,
          this.icon.dot[0].y,
          this.icon.dot[1].x,
          this.icon.dot[1].y
        );
        line(
          this.icon.dot[4].x,
          this.icon.dot[4].y,
          this.icon.dot[5].x,
          this.icon.dot[5].y
        );
        line(
          this.icon.dot[2].x,
          this.icon.dot[2].y,
          this.icon.dot[3].x,
          this.icon.dot[3].y
        );
        strokeWeight(1);
        fill(200);
        stroke(200);
        text(
          "SEMENTES",
          this.display.pos.x + this.display.size.x / 2,
          this.display.pos.y + this.display.size.y / 5 - 10
        );
        text(
          "Brocolis",
          this.display.pos.x + this.display.size.x / 4,
          this.display.pos.y + this.display.size.y / 5 + 40
        );
        text(
          "Alface",
          this.display.pos.x + (this.display.size.x / 4) * 3,
          this.display.pos.y + this.display.size.y / 5 + 40
        );
        if (player.fe >= 13) {
          fill(0,255,0);
          stroke("green");
        } else {
          fill(255,0,0);
          stroke("red");
        }
        text(
          "💰: 13",
          this.display.pos.x + this.display.size.x / 4,
          this.display.pos.y + (this.display.size.y / 5) * 4
        );
        if (player.fe >= 7) {
          fill(0,255,0);
          stroke("green");
        } else {
          fill(255,0,0);
          stroke("red");
        }
        text(
          "💰: 7",
          this.display.pos.x + (this.display.size.x / 4) * 3,
          this.display.pos.y + (this.display.size.y / 5) * 4
        );
        textSize(100);
        if (
          botao(
            "🥦",
            this.display.pos.x + this.display.size.x / 4,
            this.display.pos.y + this.display.size.y / 2 + 20,
            200,
            200
          ) &&
          player.fe >= 13
        ) {
          player.fe -= 13;
          gasto+=13;
          let cont = 0;
          let found = false;
          for (let i = 0; i < hotB.itemNum; i++) {
            if (found) {
              if (hotB.item[i].type === "vazio") {
                hotB.item[i] = new Item(3);
                hotB.item[i].qnt = 1;
                break;
              }
            } else if (
              hotB.item[i].type === "seed" &&
              hotB.item[i].id === "Semente Brocolis"
            ) {
              hotB.item[i].qnt++;
              break;
            } else {
              cont++;
              if (cont >= hotB.itemNum - 1) {
                i = 0;
                found = true;
              }
            }
          }
        }

        if (
          botao(
            "🥬",
            this.display.pos.x + (this.display.size.x / 4) * 3,
            this.display.pos.y + this.display.size.y / 2 + 20,
            200,
            200
          ) &&
          player.fe >= 7
        ) {
          player.fe -= 7;
          gasto+= 7;
          let cont = 0;
          let found = false;
          for (let i = 0; i < hotB.itemNum; i++) {
            if (found) {
              if (hotB.item[i].type === "vazio") {
                hotB.item[i] = new Item(4);
                hotB.item[i].qnt = 1;
                break;
              }
            } else if (
              hotB.item[i].type === "seed" &&
              hotB.item[i].id === "Semente alface"
            ) {
              hotB.item[i].qnt++;
              break;
            } else {
              cont++;
              if (cont >= hotB.itemNum - 1) {
                i = 0;
                found = true;
              }
            }
          }
        }
        textSize(20);
        if (
          botao(
            "Vender - $20",
            this.display.pos.x + (this.display.size.x / 4) * 3,
            this.display.pos.y + this.display.size.y / 2 + 240,
            150,
            50,
            0
          ) 
        ) {
          for (let i = 0; i < hotB.itemNum; i++) {
            if (
              hotB.item[i].type === "crop" &&
              hotB.item[i].id === "Alface"
            ) {
              hotB.item[i].qnt--;
              player.fe += 20;
              dindin += 20;
              v_alface++;
              break;
            }
          }
        }
        if (
          botao(
            "Vender - $35",
            this.display.pos.x + this.display.size.x / 4,
            this.display.pos.y + this.display.size.y / 2 + 240,
            150,
            50,
            0
          ) 
        ) {
          for (let i = 0; i < hotB.itemNum; i++) {
            if (
              hotB.item[i].type === "crop" &&
              hotB.item[i].id === "Brocolis"
            ) {
              hotB.item[i].qnt--;
              v_brocolis++;
              player.fe += 35;
              dindin += 35;
              break;
            }
          }
        }
      }
    }
    rectMode(CORNER);
  }

  menu() {
    if (
      mouseOverR(this.icon.pos, this.icon.size.x, this.icon.size.y, 1) ||
      (this.see &&
        !mouseOverR(
          this.display.pos,
          this.display.size.x,
          this.display.size.y,
          1
        ))
    ) {
      cursor(HAND);
      this.cor = color(40, 40, 60, 220);
      if (click) {
        this.see = !this.see;
        this.click = false;
      }
    } else {
      this.cor = color(100, 100, 140, 255);
    }

    if (this.see) {
      this.display.size.lerp(this.display.max, 0.2);
    } else if (this.display.size.x > this.icon.size.x) {
      this.display.size.lerp(this.display.min, 0.2);
    }

    if (this.see) {
      this.icon.dot[0].lerp(this.icon.pdot[2], 0.2);
      this.icon.dot[2].lerp(this.icon.pdot[0], 0.2);
      this.icon.dot[4].lerp(this.icon.pdot[2], 0.2);
      this.icon.dot[5].lerp(this.icon.pdot[1], 0.2);
    } else {
      this.icon.dot[0].lerp(this.icon.pdot[0], 0.2);
      this.icon.dot[2].lerp(this.icon.pdot[2], 0.2);
      this.icon.dot[4].lerp(this.icon.pdot[4], 0.2);
      this.icon.dot[5].lerp(this.icon.pdot[5], 0.2);
    }
    rectMode(CORNER);

    //Display
    if (this.display.size.x > this.icon.size.x) {
      strokeWeight(1);
      stroke(255,50);
      fill(40, 40, 60, 220);
      rect(
        this.display.pos.x,
        this.display.pos.y,
        this.display.size.x,
        this.display.size.y,
        28
      );

      if (this.display.size.x > this.display.max.x - 20) {
        fill(255);
        noStroke()
        textAlign(CENTER, CENTER);
        textSize(27);
        text(
          "Menu",
          this.display.pos.x + this.display.max.x / 2,
          this.display.pos.y + (this.icon.size.x / 3) * 2
        );
        
        if(botao("Fazer as contas", this.display.pos.x + this.display.max.x / 2,
          this.display.pos.y + (this.icon.size.x / 4) * 2 + this.display.max.y / 2, this.display.max.x-escala, escala*2, 0)){
            state = "fim";
            time = 0;
        }
        if(botao("↻",this.display.pos.x + this.display.size.x - (this.icon.size.x / 3) * 2,
          this.display.pos.y + (this.icon.size.x / 3) * 2,
          this.icon.size.x *0.8,
          this.icon.size.y*0.8)){
            player.pos.set(0, 0);
    player.vel.set(0, 0);
    cam.camPos.set(width / 2, height / 2);
        }
      }
    }
    //Icon
    noStroke();
    fill(this.cor);
    rect(
      this.icon.pos.x,
      this.icon.pos.y,
      this.icon.size.x,
      this.icon.size.y,
      28
    );
    stroke(200);
    strokeWeight(3);
    line(
      this.icon.dot[0].x,
      this.icon.dot[0].y,
      this.icon.dot[1].x,
      this.icon.dot[1].y
    );
    line(
      this.icon.dot[4].x,
      this.icon.dot[4].y,
      this.icon.dot[5].x,
      this.icon.dot[5].y
    );
    line(
      this.icon.dot[2].x,
      this.icon.dot[2].y,
      this.icon.dot[3].x,
      this.icon.dot[3].y
    );
    strokeWeight(1);
  }
}

//Classe auxiliar de criação de casas e estruturas
class Building {
  constructor(id, x, y, l, a) {
    this.pos = createVector(x, y);
    this.size = createVector(l, a);
    this.id = id;
    switch (id) {
      case "casa":
        this.ima = loadImage("data/casa1.png");
        this.msg = "Cochilar💤";
        this.tmpPos = createVector(
          x - l / 2,
          y + a - a / 2
        );
        this.tmpSize = createVector(l, a / 3);
        break;
      case "bicicleta":
        this.ima = loadImage("data/bike.png");
        this.msg = "Doar🫴";
        this.tmpPos = createVector(
          x - l/2 - l*2/3,
          y - a/2
        );
        this.tmpSize = createVector(l/1.5, a);
        break;
      case "loja":
        this.ima = loadImage("data/loja.png");
        this.msg = "Comprar com Zé👴";
        this.tmpPos = createVector(
          x - l/2 - l*2/3 +50,
          y - a/2
        );
        this.tmpSize = createVector(l/1.5, a);
        break;
      case "minigame":
        this.ima = loadImage("data/arvore.png");
        this.msg = "Panhar 🍎";
        this.tmpPos = createVector(
          x - l / 2,
          y + a - a / 2
        );
        this.tmpSize = createVector(l, a / 3);
        break;
      default:
        this.ima = loadImage("data/loja.png");
        this.msg = "casa";
        this.tmpPos = createVector(
          x - l / 2,
          y + a - a / 2
        );this.tmpSize = createVector(l, a / 3);
        break;
    }
    obs.push(new Obstaculo(x - l / 2, y - a / 2, l, a));
  }

  show() {
    //imagem
    fill(255);
    textSize(this.size.y);
    imageMode(CENTER);
    if(this.id == "casa"){
      image(this.ima,this.pos.x, this.pos.y,this.ima.width/1.5,this.ima.height/1.5);
    } else if(this.id == "bicicleta"){
      image(this.ima,this.pos.x, this.pos.y,this.ima.width/2.5,this.ima.height/2.5);
    } else if(this.id == "minigame"){
      image(this.ima,this.pos.x, this.pos.y,this.ima.width,this.ima.height);
    } else {
    image(this.ima,this.pos.x, this.pos.y,this.ima.width/1.8,this.ima.height/1.8);

    }
    
    //hitbox

    if (pointCheck(player.pos, this.tmpPos, this.tmpSize)) {
      player.cor = color(245, 54, 178);
      player.over = true;
      // this.tmpPos.set(this.pos.x - this.size.x / 2, this.pos.y - this.size.y / 2);
      if (mouseOverR(createVector(this.pos.x-this.size.x/2,this.pos.y-this.size.y/2), this.size.x, this.size.y, 0)) {
        cursor(HAND);
        strokeWeight(2);
        stroke(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(
          this.msg,
          mouseX + -1 * cam.camPos.x,
          mouseY - 20 + -1 * cam.camPos.y
        );

        if (this.id == "casa" && click) {
          tempo.newDay();
          click = false;
        } else if (this.id == "loja" && click && !interfa.loja.see) {
          interfa.loja.see = true;
          click = false;
        } else if (this.id == "bicicleta" && click) {
          for (let i = 0; i < hotB.itemNum; i++) {
            if (
              hotB.item[i].type === "crop" &&
              hotB.item[i].id === "Alface"
            ) {
              d_alface += hotB.item[i].qnt
              hotB.item[i].qnt = 0;
            } else if (
              hotB.item[i].type === "crop" &&
              hotB.item[i].id === "Brocolis"
            ) {
              d_brocolis += hotB.item[i].qnt
              hotB.item[i].qnt = 0;
            }
          }
          click = false;
        } else if (this.id == "minigame" && click) {
          player.pos.set(width/2,height-escala*2);
          state = "minigame";
        }
      }
      
    }
    
  }
}

class Obstaculo {
  constructor(x, y, l, a) {
    this.pos = createVector(x, y);
    this.size = createVector(l, a);
  }

  show() {
    noStroke();
    fill(224, 52, 135, 70);
    //rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}

class Slider {
  constructor(x, y, l, a, r, varb, varMin, varMax, varN) {
    this.size = createVector(l, a);
    this.pos = createVector(x, y);
    this.spos = map(varb, varMin, varMax, 0, l) + x;
    this.newspos = this.spos;
    this.sposMin = x;
    this.sposMax = x + l;
    this.loose = r;
    this.vMin = varMin;
    this.vMax = varMax;
    this.name = varN;
    this.locked = false;
  }

  update() {
    if (click && this.overR()) {
      this.locked = true;
    }
    if (!mouseIsPressed) {
      this.locked = false;
    }
    if (this.locked) {
      this.newspos = constrain(mouseX, this.sposMin, this.sposMax);
    }
    if (abs(this.newspos - this.spos) > 1) {
      this.spos += (this.newspos - this.spos) / this.loose;
      switch (this.name) {
        case "quantidade":
          return int(
            map(
              this.spos,
              this.pos.x,
              this.pos.x + this.size.x,
              this.vMin,
              this.vMax
            )
          );
      }
    }
  }

  overR() {
    if (dist(mouseX, mouseY, this.spos, this.pos.y) <= this.size.y / 2) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    strokeWeight(5);
    stroke(334, 78, 99, 40);
    line(this.pos.x, this.pos.y, this.pos.x + this.size.x, this.pos.y);
    stroke(334, 78, 99);
    line(this.pos.x, this.pos.y, this.spos, this.pos.y);
    if (this.overR() || this.locked) {
      fill(334, 78, 84);
    } else {
      fill(334, 78, 99);
    }
    noStroke();
    ellipse(this.spos, this.pos.y, this.size.y, this.size.y);

    fill(0, 0, 20);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(int(this.vMin), this.pos.x, this.pos.y - this.size.y - 3);
    text(
      int(this.vMax),
      this.pos.x + this.size.x,
      this.pos.y - this.size.y - 3
    );
    fill(334, 78, 99);
    switch (this.name) {
      case "quantidade":
        text("quantidade", this.spos, this.pos.y - this.size.y - 3);
        break;
    }
  }
}

class Apple {
  constructor(baseSpeed, elapsed) {
    this.r = 15;
    this.x = random(this.r, width - this.r);
    this.y = -this.r;
    this.speed = random(2, 4) * baseSpeed + (elapsed / 10000);
    this.opacity = 255;

    let chance = random(1);
    if (chance < 0.8) this.type = "normal";
    else if (chance < 0.95) this.type = "gold";
    else this.type = "speed";
  }

  show() {
    noStroke();
    if (this.type === "normal") fill(255, 0, 0, this.opacity);
    else if (this.type === "gold") {
      fill(255, 215, 0, this.opacity);
      stroke(255);
      strokeWeight(1);
    } else {
      fill(0, 200, 255, this.opacity);
      stroke(0, 255, 255);
      strokeWeight(1);
    }
    ellipse(this.x, this.y, this.r * 2);
  }

  fall() {
    this.y += this.speed;
    this.opacity = map(this.y, 0, height, 255, 100);
  }

  hits(player) {
    return dist(this.x, this.y, player.pos.x, player.pos.y) < this.r + player.raio;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x + random(-20, 20);
    this.y = y + random(-10, 10);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-1, 1);
    this.alpha = 150;
    this.size = random(3, 10);
  }

  finished() {
    return this.alpha <= 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
    this.size -= 0.1;
    this.size = constrain(this.size , 0, 10);
  }

  show() {
    noStroke();
    fill(255, 150, 255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

class Shine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.alpha = 255;
  }

  finished() {
    return this.alpha <= 0;
  }

  update() {
    this.size += 2;
    this.alpha -= 10;
  }

  show() {
    noFill();
    stroke(255, 255, 150, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size);
  }
}
