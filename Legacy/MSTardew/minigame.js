
function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  player = new Player();
}

function draw() {
  background(30, 30, 50);

  if (!gameStarted) {
    showStartScreen();
    return;
  }

  let config = difficulties[selectedDifficulty];
  let elapsedTime = millis() - startTime;

  // Spawn maçãs
  let spawnRate = max(5, 60 - int(elapsedTime / 1000));
  if (frameCount % spawnRate === 0) {
    let quantidade = floor(1 + (elapsedTime / config.spawnFactor));
    for (let i = 0; i < quantidade; i++) {
      apples.push(new Apple(config.baseSpeed, elapsedTime));
    }
  }

  // Jogador e partículas
  
  player.move();
  this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, height / 2, height - this.r);
    this.vel.limit(this.vellmt);
  player.emitParticles();

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

  if (fadingOut) {
    fadeAlpha += 5;
    fill(0, fadeAlpha);
    rect(0, 0, width, height);
    if (fadeAlpha >= 255) {
      showEndScreen();
    }
  }
}

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
  background(30, 30, 50);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255, 100, 255);
  text("🎉 Fim de Jogo! 🎉", width / 2, height / 2 - 40);

  fill(255);
  textSize(22);
  text(`Sua pontuação: ${score}`, width / 2, height / 2 + 10);

  textSize(16);
  fill(200);
  text("Recarregue a página para jogar de novo", width / 2, height / 2 + 50);
}

function showStartScreen() {
  background(20, 20, 40);
  fill(255);
  textSize(28);
  text("🍎 Coletando Maçãs 🍏", width / 2, 60);
  textSize(16);
  text("Use as setas para mover", width / 2, 110);
  text("← / → / ↑ / ↓ para andar", width / 2, 130);
  text("ENTER para começar", width / 2, 200);

  textSize(18);
  text("Selecione a dificuldade:", width / 2, 250);

  for (let i = 0; i < difficulties.length; i++) {
    let y = 280 + i * 30;
    fill(i === selectedDifficulty ? color(0, 200, 255) : 255);
    text(difficulties[i].label, width / 2, y);
  }
}

function keyPressed() {
  if (!gameStarted) {
    if (keyCode === UP_ARROW) selectedDifficulty = (selectedDifficulty + difficulties.length - 1) % difficulties.length;
    else if (keyCode === DOWN_ARROW) selectedDifficulty = (selectedDifficulty + 1) % difficulties.length;
    else if (keyCode === ENTER) {
      gameStarted = true;
      startTime = millis();
      fadeAlpha = 255;
      fadingIn = true;
      fadingOut = false;
      loop();
    }
  }
}

class Player {
  constructor() {
    this.r = 25;
    this.x = width / 2;
    this.y = height - this.r;
    this.acc = 0.3;
    this.velX = 0;
    this.velY = 0;
    this.maxSpeed = 7;
    this.boosted = false;
  }

  show() {
    fill(this.boosted ? color(0, 200, 255) : color(180, 60, 255));
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) this.velX -= this.acc;
    else if (keyIsDown(RIGHT_ARROW)) this.velX += this.acc;
    else this.velX *= 0.8;

    if (keyIsDown(UP_ARROW)) this.velY -= this.acc;
    else if (keyIsDown(DOWN_ARROW)) this.velY += this.acc;
    else this.velY *= 0.8;

    this.velX = constrain(this.velX, -this.maxSpeed, this.maxSpeed);
    this.velY = constrain(this.velY, -this.maxSpeed, this.maxSpeed);

    this.x += this.velX;
    this.y += this.velY;

    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, height / 2, height - this.r);
  }

  emitParticles() {
    for (let i = 0; i < 2; i++) {
      particles.push(new Particle(this.x, this.y + this.r / 2));
    }
  }

  speedBoost() {
    this.maxSpeed = 12;
    this.boosted = true;
  }

  resetSpeed() {
    this.maxSpeed = 7;
    this.boosted = false;
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
    this.x = x + random(-5, 5);
    this.y = y;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-1, 1);
    this.alpha = 255;
    this.size = random(3, 6);
  }

  finished() {
    return this.alpha <= 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
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
