let drops = [];
let r = 1;
let a = 0;
let palette;
let bk;
let newDrop = true;
let currentColor;
let n = 1;


function setup() {
  createCanvas(windowWidth, windowHeight);
  // palette = [
  //   color(11, 106, 136),
  //   color(45, 197, 244),
  //   color(112, 50, 126),
  //   color(146, 83, 161),
  //   color(164, 41, 99),
  //   color(236, 1, 90),
  //   color(240, 99, 164),
  //   color(241, 97, 100),
  //   color(248, 158, 79),
  //   //
  // ];
  // bk = random(palette);
  colorMode(HSB);

  currentColor = color(map(noise(n),0,1,0,360),70,100);

  // for(let i = 0; i<100; i++) {
  //   n+=0.5;
  //   addInk(random(width), random(height), random(50, 300), color(map(noise(n),0,1,0,360),70,100));
  // }
}

function tineLine(v, x, y, z, c) {
  for (let drop of drops) {
    drop.tine(v, x, y, z, c);
  }
}

function addInk(x, y, r, col) {
  let drop = new Drop(x, y, r, col);
  for (let other of drops) {
    other.marble(drop);
  }
  drops.push(drop);
}

function mouseReleased() {
  newDrop = true;
}

let val = 4;
let counter = 1;

function draw() {
  //  if (mouseIsPressed) {
  //    let v2 = createVector(mouseX, mouseY);
  //    let v1 = createVector(pmouseX, pmouseY);
  //    v2.sub(v1);
  //    if (v2.mag() > 0.1) {
  //      v2.normalize();
  //      tineLine(v2, mouseX, mouseY, 2, 16);
  //    }
  //  }

  if (mouseIsPressed) {
    if (newDrop) {
      n+= 0.5;
      currentColor = color(map(noise(n),0,1,0,360),70,100); //palette[counter % palette.length];
      newDrop = false;
      counter++;
    }
    addInk(mouseX, mouseY, 50, currentColor);
  }

  background(0);
  for (let drop of drops) {
    drop.show();
  }
  
}

