let tipoF = ["abacaxi", "banana", "banana","banana", "ameixa","ameixa", "laranja", "laranja", "laranja"];
let frutas = [];
let hold, mouseXvel, mouseYvel;
let n = 0;
let bcont = 1;
let tx, jx;

function setup() {
  createCanvas(windowWidth,windowHeight);
  noStroke();
  jx = random(-150, width - 250);
  tx = random(-400, width - 650);

  for (let i = 0; i <12; i++) {
    let x = random(width);
    let y = 50;
    frutas[i] = new Fruta(tipoF[int(random(tipoF.length))], x, y);
  }
}

function draw() {
  
  
  
  fundo();
  translate(jx, height - height / 5 - 340);
  jarro();
  resetMatrix();
  for (let t of frutas) {
    if (hold) {
      mouseVel();
      t.mouseCheck();
    }

    if (!(hold && t.mouseHit())) {
      t.move();
    }
    t.display();
  }

  translate(tx, height - height / 5 - 480);
  tigela();
  resetMatrix();

  //clean();
}

function mousePressed() {
  hold = true;

  if (key == "v") {
    console.log(
      "vertex(" + (mouseX - width / 2) + "," + (mouseY - height / 2) + ");"
    );
  } else if (key == "b" && bcont < 3) {
    console.log(mouseX - width / 2 + "," + (mouseY - height / 2) + ",");
    bcont++;
  } else if (key == "b") {
    console.log(mouseX - width / 2 + "," + (mouseY - height / 2) + ");");
    bcont = 1;
  }
}

function mouseReleased() {
  hold = false;
}

function keyPressed() {
  if (key == "b") {
    console.log("bezierVertex(");
  }
}

function fundo() {
  rectMode(CORNER);
  background("#E1E1E2");
  fill("#B5B6CF");
  rect(0, height - height / 5, width, height - height / 7);
  fill("#595B8A");
  rect(0, height - height / 10, width, height - height / 10);
}

function mouseVel() {
  mouseXvel = mouseX - pmouseX;
  mouseYvel = mouseY - pmouseY;
}

class Fruta {
  constructor(tipo, px = random(width), py = 50) {
    noStroke();
    rectMode(CENTER);
    this.maxVel = 5.0;
    this.x = px;
    this.y = py;
    this.xVel = 0;
    this.yVel = random(this.maxVel);
    this.forca = 1.2;
    this.atrito = 0.5;
    this.g = 0.5;
    this.r = random(2);

    this.base = random(height - height / 5, height - height / 10);
    this.tipo = tipo;

    if (tipo == "banana") {
      this.l = 50;
      this.a = 150;
      this.cor = "#FFEB3B";
      this.isCirc = false;
    } else if (tipo == "ameixa") {
      this.l = 50;
      this.cor = "#5A114C";
      this.isCirc = true;
    } else if (tipo == "laranja") {
      this.l = 75;
      this.cor = "#FFC107";
      this.isCirc = true;
    } else if (tipo == "abacaxi") {
      this.l = 150;
      this.a = 250;
      this.cor = "#FF9800";
      this.isCirc = false;
    }
  }

  display() {
    rectMode(CENTER);
    translate(this.x, this.y);
    rotate(this.r);
    if (this.tipo == "banana") {
      banana();
      this.isCirc = false;
    } else if (this.tipo == "ameixa") {
      ameixa();
      this.isCirc = true;
    } else if (this.tipo == "laranja") {
      laranja();
      this.isCirc = true;
    } else if (this.tipo == "abacaxi") {
      abacaxi();
      this.isCirc = false;
    }
    resetMatrix();
  }

  move() {
    if (this.isCirc) {
      if (
        (this.x >= width - this.l / 2 && this.xVel > 0) ||
        (this.x <= this.l / 2 && this.xVel < 0)
      ) {
        this.xVel *= -1 * this.atrito;
        this.x += this.xVel;
      } else if (
        (this.y >= this.base - this.l / 2 && this.yVel > 0) ||
        (this.y <= this.l / 2 && this.yVel < 0)
      ) {
        this.yVel *= -1 * this.atrito;
        this.y += this.yVel;
      }

      if (this.frutasCheck() && this.y > 120) {
        this.yVel *= -1 * this.atrito;
        this.y += this.yVel;
        this.xVel *= -1 * this.atrito;
        this.x += this.xVel;
      }

      if (this.y <= this.base - this.l / 2 + 2 && !this.frutasCheck()) {
        this.yVel += this.g;
        this.y += this.yVel;
        this.x += this.xVel;
      }
    } else {
      if (
        (this.x >= width - this.l / 2 && this.xVel > 0) ||
        (this.x <= this.l / 2 && this.xVel < 0)
      ) {
        this.xVel *= -1 * this.atrito;
        this.x += this.xVel;
      } else if (
        (this.y >= this.base - this.a / 2 && this.yVel > 0) ||
        (this.y <= this.a / 2 && this.yVel < 0)
      ) {
        this.yVel *= -1 * this.atrito;
        this.y += this.yVel;
      }

      if (this.y <= this.base - this.a / 2 + 2) {
        this.yVel += this.g;
        this.y += this.yVel;
        this.x += this.xVel;
      }
    }
  }

  mouseHit() {
    //if(this.isCirc){
    return dist(this.x, this.y, mouseX, mouseY) <= this.l / 2;
    //     }else {
    //       return(mouseX < this.x + this.l/2 & mouseX> this.x - this.l/2 && mouseY < this.y + this.a/2 & mouseY> this.y - this.a/2);
    //     }
  }

  mouseCheck() {
    if (this.mouseHit()) {
      if (this.y <= this.base) {
        this.y = mouseY;
      }

      this.r += map(noise(7 + n / 100), 0, 1, -0.1, 0.1);
      n++;
      this.x = mouseX;
      this.xVel = this.forca * mouseXvel;
      this.yVel = this.forca * mouseYvel;
    }
  }

  frutasCheck() {
    let over = false;
    for (let b of frutas) {
      if (
        (this.x & this.y) !== (b.x & b.y) &&
        dist(this.x, this.y, b.x, b.y) <= this.l / 2 + b.l / 2
      ) {
        if (this.y > 100 && this.y < b.y) {
          over = true;
          return true;
        } else {
          over = false;
        }
      }
    }
    if (!over) {
      return false;
    }
  }
}
