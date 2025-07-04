//função para conferir se mause esta sobre vetor redondo

function mouseOver(base, raio, dot) {
  if (dot === 0) {
    if (
      dist(
        mouseX + -1 * cam.camPos.x,
        mouseY + -1 * cam.camPos.y,
        base.x,
        base.y
      ) <= raio
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (dist(mouseX, mouseY, base.x, base.y) <= raio) {
      return true;
    } else {
      return false;
    }
  }
}

//função para conferir se mause esta sobre vetor quadrilatero
function mouseOverR(base, largura, altura, dot) {
  if (dot === 0) {
    if (
      mouseX + -1 * cam.camPos.x <= base.x + largura &&
      mouseX + -1 * cam.camPos.x >= base.x &&
      mouseY + -1 * cam.camPos.y <= base.y + altura &&
      mouseY + -1 * cam.camPos.y >= base.y
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      mouseX <= base.x + largura &&
      mouseX >= base.x &&
      mouseY <= base.y + altura &&
      mouseY >= base.y
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function inReach(base, dot) {
  if (dot === "m") {
    if (
      dist(
        mouseX + -1 * cam.camPos.x,
        mouseY + -1 * cam.camPos.y,
        base.x,
        base.y
      ) <= range
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (dist(dot.x, dot.y, base.x, base.y) <= range) {
      return true;
    } else {
      return false;
    }
  }
}

function botao(txt, x, y, l, a, dot) {
  rectMode(CENTER);
  let cor1 = "rgba(94,115,168,90)";
  let cor2 = "rgba(81,81,151,90)";
  if (dot == 0) {
    cor1 = "rgba(200,115,168,90)";
    cor2 = "rgba(200,81,151,90)";
  }
  let b = createVector(x - (l - a) / 2, y - a / 2);
  if (
    mouseOverR(b, l - a, a) ||
    dist(mouseX, mouseY, x - (l / 2 - a / 2), y) <= a / 2 ||
    dist(mouseX, mouseY, x + (l / 2 - a / 2), y) <= a / 2
  ) {
    if (mouseIsPressed) {
      fill("rgb(209,211,224)");
    } else {
      fill(cor2);
    }
    cursor(HAND);
  } else {
    fill(cor1);
  }
  stroke(255, 50);
  rect(x, y, l, a, 90);
  textAlign(CENTER, CENTER);
  noStroke();
  fill("white");
  text(txt, x, y);

  rectMode(CORNER);

  if (
    (mouseOverR(b, l - a, a) ||
      dist(mouseX, mouseY, x - (l / 2 - a / 2), y) <= a / 2 ||
      dist(mouseX, mouseY, x + (l / 2 - a / 2), y) <= a / 2) &&
    click
  ) {
    return true;
  } else {
    return false;
  }
}

function obsCheck(base, dot) {
  if (dot === 0) {
    for (const ob of obs) {
      if (
        base.x + -1 * cam.camPos.x <= ob.pos.x + ob.size.x &&
        base.x + -1 * cam.camPos.x >= ob.pos.x &&
        base.y + -1 * cam.camPos.y <= ob.pos.y + ob.size.y &&
        base.y + -1 * cam.camPos.y >= ob.pos.y
      ) {
        return true;
      }
    }
    return false;
  } else {
    for (const ob of obs) {
      if (
        base.x <= ob.pos.x + ob.size.x &&
        base.x >= ob.pos.x &&
        base.y <= ob.pos.y + ob.size.y &&
        base.y >= ob.pos.y
      ) {
        return true;
      }
    }
    if (base.x <= -400 || base.x >= 500 || base.y <= -150 || base.y >= 600) {
      return true;
    }
    return false;
  }
}

function pointCheck(base, pos, size, dot) {
  if (dot === 0) {
    if (
      base.x + -1 * cam.camPos.x <= pos.x + size.x &&
      base.x + -1 * cam.camPos.x >= pos.x &&
      base.y + -1 * cam.camPos.y <= pos.y + size.y &&
      base.y + -1 * cam.camPos.y >= pos.y
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      base.x <= pos.x + size.x &&
      base.x >= pos.x &&
      base.y <= pos.y + size.y &&
      base.y >= pos.y
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function rectCheck(base, bsize, pos, size, dot) {
  if (dot === 0) {
    if (
      (base.x + -1 * cam.camPos.x <= pos.x + size.x &&
        base.x + -1 * cam.camPos.x >= pos.x &&
        base.y + -1 * cam.camPos.y <= pos.y + size.y &&
        base.y + -1 * cam.camPos.y >= pos.y) ||
      (base.x + bsize.x + -1 * cam.camPos.x <= pos.x + size.x &&
        base.x + bsize.x + -1 * cam.camPos.x >= pos.x &&
        base.y + -1 * cam.camPos.y <= pos.y + size.y &&
        base.y + -1 * cam.camPos.y >= pos.y) ||
      (base.x + -1 * cam.camPos.x <= pos.x + size.x &&
        base.x + -1 * cam.camPos.x >= pos.x &&
        base.y + bsize.y + -1 * cam.camPos.y <= pos.y + size.y &&
        base.y + bsize.y + -1 * cam.camPos.y >= pos.y) ||
      (base.x + bsize.x + -1 * cam.camPos.x <= pos.x + size.x &&
        base.x + bsize.x + -1 * cam.camPos.x >= pos.x &&
        base.y + bsize.y + -1 * cam.camPos.y <= pos.y + size.y &&
        base.y + bsize.y + -1 * cam.camPos.y >= pos.y)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    if (
      (base.x <= pos.x + size.x &&
        base.x >= pos.x &&
        base.y <= pos.y + size.y &&
        base.y >= pos.y) ||
      (base.x + bsize.x <= pos.x + size.x &&
        base.x + bsize.x >= pos.x &&
        base.y <= pos.y + size.y &&
        base.y >= pos.y) ||
      (base.x <= pos.x + size.x &&
        base.x >= pos.x &&
        base.y + bsize.y <= pos.y + size.y &&
        base.y + bsize.y >= pos.y) ||
      (base.x + bsize.x <= pos.x + size.x &&
        base.x + bsize.x >= pos.x &&
        base.y + bsize.y <= pos.y + size.y &&
        base.y + bsize.y >= pos.y)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

//Minigame

function drawHUD(duration, elapsedTime) {
  // HUD base
  fill(40, 40, 60, 220);
  noStroke();
  rect(10, 10, 160, 70, 12);

  // Pontuação
  fill(0, 255, 200);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Pontuação", 20, 18);
  fill(255);
  textSize(22);
  text(score, 20, 38);

  // Tempo
  let remaining = max(0, floor((duration - elapsedTime) / 1000));
  fill(255, 100, 255);
  textSize(16);
  text("Tempo", 100, 18);
  fill(255);
  textSize(22);
  text(`${remaining}s`, 100, 38);

  // Boost bar
  if (player.boosted) {
    let remainingBoost = (speedBoostTimer - millis()) / 5000;
    fill(0, 200, 255, 150);
    rect(0, height - 10, width * remainingBoost, 10);
    stroke(0, 255, 255);
    noFill();
    rect(0, height - 10, width, 10);
    noStroke();
  }

  // Timer circular
  let angle = map(elapsedTime, 0, duration, 0, TWO_PI);
  stroke(255, 255, 150);
  strokeWeight(5);
  noFill();
  arc(width - 45, 45, 50, 50, -HALF_PI, -HALF_PI + angle);
}

function showEndScreen() {
  noStroke();
  background(30, 30, 50);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255, 100, 255);
  text("🎉 Fim de Jogo! 🎉", width / 2, height / 2 - 40);

  fill(255);
  textSize(22);
  text(`Sua pontuação: ${score}`, width / 2, height / 2 + 10);

  if (botao("voltar", width / 2, height / 2 + 70, 100, 50, 0)) {
    state = "jogo";
    player.pos.set(0, 0);
    player.vel.set(0, 0);
    cam.camPos.set(width / 2, height / 2);
    score = 0;
    startTime;
    gameOver = false;
    speedBoostTimer = 0;
    gameStarted = false;
    selectedDifficulty = 1;
    fadeAlpha = 255;
    fadingIn = false;
    fadingOut = false;
  }
}

function showStartScreen() {
  background(20, 20, 40);
  fill(255);
  textSize(28);
  text("🍎 Coletando Maçãs 🍏", width / 2, 60);
  textSize(16);
  text("Use as setas para mover", width / 2, 110);
  text("← / → / ↑ / ↓  ou  w / a / s / d  para andar", width / 2, 130);
  text("ENTER para começar", width / 2, 200);

  textSize(18);
  text("Selecione a dificuldade:", width / 2, 250);

  for (let i = 0; i < difficulties.length; i++) {
    let y = 280 + i * 30;
    fill(i === selectedDifficulty ? color(0, 200, 255) : 255);
    text(difficulties[i].label, width / 2, y);
  }
}
