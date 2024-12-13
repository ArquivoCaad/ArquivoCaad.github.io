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
function botao(txt, x, y, l, a,cor1,cor2,cor3,stk) {
  rectMode(CENTER);
  let b = createVector(x - (l - a) / 2, y - a / 2);
  if (
    mouseOverR(b, l - a, a) ||
    dist(mouseX, mouseY, x - (l / 2 - a / 2), y) <= a / 2 ||
    dist(mouseX, mouseY, x + (l / 2 - a / 2), y) <= a / 2
  ) {
    if (click) {
      fill(cor3);
    } else {
      fill(cor2);
    }
    cursor(HAND);
  } else {
    fill(cor1);
  }
  stroke(stk);
  rect(x, y, l, a, 90);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(stk);
  text(txt, x, y);

  rectMode(CORNER);

  if (
    (mouseOverR(b, l - a, a) ||
      dist(mouseX, mouseY, x - (l / 2 - a / 2), y) <= a / 2 ||
      dist(mouseX, mouseY, x + (l / 2 - a / 2), y) <= a / 2) &&
    click
  ) {
    click = false;
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
