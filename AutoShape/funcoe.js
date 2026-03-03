function dot_move() {
  for (let i = 0; i < dots_temp.length; i++) {
    if (
      dist(
        dots_temp[i].x,
        dots_temp[i].y,
        mouseX - width / 2,
        mouseY - height / 2
      ) <= 5
      && state.drawing) {
      click = true;
      dot_pressed = i;
    }
  }
}

function dots_draw() {
  let layer2 = layer == 0 ? 1 : 0;

  noStroke();

  // Draw layer 2
  if (dots[layer2].length > 0 && !state.animate) {
    fill("rgba(198,122,240,0.49)");
    beginShape(TESS);
    curveVertex(dots[layer2][0].x, dots[layer2][0].y);
    for (let i of dots[layer2]) {
      curveVertex(i.x, i.y);
    }
    endShape(CLOSE);
    for (let i = 0; i < dots[layer2].length; i++) {
      fill("rgb(144,0,255)");
      ellipse(dots[layer2][i].x, dots[layer2][i].y, 10, 10);
    }
  }

  // Draw layer 1
  if (dots_temp.length > 0) {
    if(!state.animate){
      fill("rgba(122,165,240,0.49)");
    } else {
      fill(cor.atual);
    };
    beginShape(TESS);
    curveVertex(dots_temp[0].x, dots_temp[0].y);
    for (let i of dots_temp) {
      curveVertex(i.x, i.y);
    }
    endShape(CLOSE);
    if (!state.animate) {
      for (let i = 0; i < dots_temp.length; i++) {
        fill("rgb(0,0,255)");
        if (click) {
          if (i == dot_pressed) {
            noCursor();
            fill("rgb(0,200,200)");
            ellipse(mouseX - width / 2, mouseY - height / 2, 10, 10);
          } else {
            ellipse(dots_temp[i].x, dots_temp[i].y, 10, 10);
          }
        } else {
          ellipse(dots_temp[i].x, dots_temp[i].y, 10, 10);
        }
      }
    }
  }

  // Visual Cursor

  if (
    mouseIsPressed &&
    isIn(mouseX, mouseY, 0, 0, width, height) &&
    desenhando
  ) {
    noCursor();
    noStroke();
    fill("rgb(217,217,248)");
    ellipse(mouseX - width / 2, mouseY - height / 2, 10, 10);
  }
}

function dots_control(page) {
  switch (page) {
    case "Layer 1":
      layer = 0;
      break;
    case "Layer 2":
      layer = 1;
      break;
  }

  if (player == layer) {
    player = layer == 0 ? 1 : 0;
    dots[player] = dots_temp;
    dots_temp = dots[layer];
  }
}

function btnStart() {
  //   print(desenhando);
  state.drawing = !state.drawing;
}

function btnClean() {
  if (!state.animate) {
    dots_save[layer] = [];
    dots_temp = [];
  }
}

function btnAnimate() {
  if (state.animate) {
    reset();
    state.animate = false;
    document.getElementById("pagesR").style.visibility = "visible";
    cor.atual = cor.base;
  } else {
    dots[layer] = dots_temp;
    state.animate = true;
    document.getElementById("pagesR").style.visibility = "hidden";
  }
}

function reset() {
  for (let i = 0; i < dots_save[layer].length; i++) {
    dots_temp[i].set(dots_save[layer][i]);
  }
}

function isIn(x, y, x1, y1, x2, y2) {
  return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? true : false;
}

function grid() {
  background(0);
  stroke("rgba(100, 100, 100, 50)");
  strokeWeight(1);
  for (let x = 0; x < qdn; x++) {
    line(
      x * qdl - width / 2 + qdr / 2,
      -height / 2 + qdr / 2,
      x * qdl - width / 2 + qdr / 2,
      height / 2 + qdr / 2
    );
    line(
      -width / 2 + qdr / 2,
      x * qdl - height / 2 + qdr / 2,
      width / 2 + qdr / 2,
      x * qdl - height / 2 + qdr / 2
    );
  }

  stroke("rgba(200, 0, 0, 110)");
  strokeWeight(3);
  line(0, -height / 2, 0, height / 2);
  line(-width / 2, 0, width / 2, 0);

  if (!state.drawing) {
    fill("#E76FD923");
    rect(0 - width / 2, 0 - height / 2, width, height);
  }
}

function btnPrint() {
  let texto;

 texto = "dots = [[";
  for (let i of dots_save[0]) {
    let ptx ="createVector(" + i.x + "," + i.y + "),";
    texto += ptx +`
    `;
  }
  texto +="], [";
  for (let i of dots_save[1]) {
    let ptx ="createVector(" + i.x + "," + i.y + "),";
    texto += ptx +`
    `;
  }
  texto +="]];";

  document.getElementById("codigo").innerText = texto;
  console.log(texto);
}

function copiarTexto() {
  const textarea = document.getElementById("codigo");
  const feedback = document.getElementById("copyFeedback");

  textarea.select();
  textarea.setSelectionRange(0, 99999); // Compatibilidade com mobile
  document.execCommand("copy");

  feedback.textContent = "Copiado! ✅";
  setTimeout(() => {
    feedback.textContent = "";
  }, 2000);
}