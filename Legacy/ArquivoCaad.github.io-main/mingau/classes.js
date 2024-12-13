class Falas {
  constructor(x, y, l, a, name, id, txt) {
    this.trans = 255;
    this.cont = 0;
    this.m = millis();
    this.fala = txt;
    this.see = false;
    this.seechar = false;
    this.name = name;
    this.display = {
      pos: createVector(0, y - 10),
      size: createVector(0, 0),
      min: createVector(0, 0),
      max: createVector(l, a),
    };
    this.cor = color(255);
    this.id = id;
    this.img = {
      pos: createVector(
        x -(((imagem.talk[id].width * height) / 5) * 7) /imagem.talk[id].height /2, y - 10 - ((height / 5) * 4) / 2),
      size: createVector(
        (((imagem.talk[id].width * height) / 5) * 4) / imagem.talk[id].height,
        (height / 5) * 4
      ),
    };
  }

  show() {
    rectMode(CORNER);
    //Display
    if (this.display.size.x > 10) {
      strokeWeight(1);
      stroke(255);
      fill(this.cor);
      rect(
        this.display.pos.x,
        this.display.pos.y-this.display.size.y/3,
        this.display.size.x,
        this.display.size.y,
        28
      );

      if (this.display.size.x > this.display.max.x - 20) {
        fill(0);
        stroke(0);
        textAlign(CENTER, CENTER);
        textSize(20);
        text(
          this.name,
          this.img.size.x + 50,
          this.display.pos.y + 70 / 3 - this.display.size.y/3
        );
        textSize(15);
        textAlign(LEFT, CENTER);
        fill(0, this.trans);
        text(
          this.fala[this.cont],
          this.img.size.x + 25,
          this.img.size.y - this.display.size.y/4,
          (width / 5) * 4 - 10 - (this.img.size.x + 25)
        );
      }
    }
    if (this.seechar) {
      imageMode(CORNER);
      image(
        imagem.talk[this.id],
        this.img.pos.x,
        this.img.pos.y,
        this.img.size.x,
        this.img.size.y
      );
    }
  }

  update() {
    if (
      this.seechar &&
      !this.see &&
      mouseOverR(this.img.pos, this.img.size.x, this.img.size.y, 1)
    ) {
      if (click) {
        this.see = true;
        click = false;
      }
    }
    //print(next);

    if (this.trans == 10) {
      next = false;
      this.trans = 255;
      this.cont++;
      this.cont = constrain(this.cont, 0, this.fala.length - 1);
    } else if (next) {
      this.trans -= 10;
      this.trans = constrain(this.trans, 10, 255);
    }

    if (
      this.see &&
      mouseOverR(this.display.pos, this.display.size.x, this.display.size.y, 1)
    ) {
      cursor(HAND);
      this.cor = color(255, 200);
      if (click) {
        //this.cor = color(255);
        next = true;
        this.click = false;
      }
    } else {
      this.cor = color(255, 170);
    }

    if (this.see) {
      this.display.size.lerp(this.display.max, 0.2);
    } else if (this.display.size.x > 10) {
      this.display.size.lerp(this.display.min, 0.2);
    }
  }
}

class GUI {
  constructor(x, y, l, a, escala, dot, name) {
    switch (dot) {
      case "menu":
        this.name = "Menu";
        break;
      default:
        this.id = dot;
        this.name = name;
    }
    this.state = "icon";
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
        createVector(x + escala - escala / 4, y + escala / 3 + escala / 3 / 2),
      ],
      pdot: [
        createVector(x + escala / 4, y + escala / 3),
        createVector(x + escala - escala / 4, y + escala / 3),
        createVector(x + escala / 4, y + escala - escala / 3),
        createVector(x + escala - escala / 4, y + escala - escala / 3),
        createVector(x + escala / 4, y + escala / 3 + escala / 3 / 2),
        createVector(x + escala - escala / 4, y + escala / 3 + escala / 3 / 2),
      ],
    };
    this.display = {
      pos: createVector(x - 10, y - 10),
      size: createVector(0, 0),
      min: createVector(0, 0),
      max: createVector(l, a),
    };
    this.cor = color(255, 80);
    this.type = dot;
  }

  show() {
    if (this.type != "menu") {
      if (
        (this.see &&
          mouseOverR(this.icon.pos, this.icon.size.x, this.icon.size.y, 1)) ||
        (this.see &&
          !mouseOverR(
            this.display.pos,
            this.display.size.x,
            this.display.size.y,
            1
          ))
      ) {
        cursor(HAND);
        this.cor = color(255);
        if (click) {
          this.see = !this.see;
          click = false;
        }
      } else {
        this.cor = color(255, 200);
      }
    } else {
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
        this.cor = color(255);
        if (click) {
          this.see = !this.see;
          click = false;
        }
      } else {
        this.cor = color(255, 200);
      }
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
      stroke(255);
      fill(220, 200);
      rect(
        this.display.pos.x,
        this.display.pos.y,
        this.display.size.x,
        this.display.size.y,
        28
      );

      if (this.display.size.x > this.display.max.x - 20) {
        fill(0);
        stroke(0);
        textAlign(CENTER, CENTER);
        textSize(15);
        text(
          this.name,
          this.display.pos.x + this.display.max.x / 2,
          this.display.pos.y + (this.icon.size.x / 3) * 2+5
        );
      }
    }

    if (this.type != "menu") {
      if (this.see) {
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
        stroke(0, 0, 0);
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
        imageMode(CORNER);
        if (
          this.name == "Pagina 1" ||
          this.name == "Pagina 2" ||
          this.name == "Pagina 3"
        ) {
          image(
            imagem.origame[this.id],
            this.display.pos.x + 10,
            this.display.pos.y + 40,
            this.display.size.x - 20,
            (imagem.origame[this.id].height * (this.display.size.x - 20)) /
              imagem.origame[this.id].width
          );
        } else {
          image(
            imagem.obj[this.id],
            this.display.pos.x + 10,
            this.display.pos.y + 40,
            this.display.size.x - 20,
            (imagem.obj[this.id].height * (this.display.size.x - 20)) /
              imagem.obj[this.id].width
          );
        }
      }
    } else {
      if (this.see) {
        textSize(20);
        if (
          botao(
            "Origami",
            this.display.pos.x + this.display.size.x / 2,
            this.icon.pos.y + 140,
            this.display.size.x - 30,
            50,
            "rgb(94,115,168)",
            "rgb(81,81,151)",
            "rgb(209,211,224)",
            "white"
          )
        ) {
          pState = state;
          state = "ORIGAMI";
          click = false;
          this.see = false;
        } else if (
          botao(
            "Fases",
            this.display.pos.x + this.display.size.x / 2,
            this.icon.pos.y + 80,
            this.display.size.x - 30,
            50,
            "rgb(94,115,168)",
            "rgb(81,81,151)",
            "rgb(209,211,224)",
            "white"
          )
        ) {
          pState = state;
          state = "FASES";
          click = false;
          this.see = false;
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
      stroke(0, 0, 0);
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
}
