let qdl,
  qdn,
  state,
  pages,
  layer,
  player,
  dots_temp,
  dots_save,
  dots,
  click,
  dot_pressed, cor;

function setup() {
  // Config
  let largura = windowHeight * 0.8;
  createCanvas(largura, largura);
  smooth();
  cursor(CROSS);
  colorMode(HSL);

  // Variaveis
  qdn = 20;
  qdr = largura % qdn;
  qdl = int(largura / qdn);
  desenhando = false;
  player = 1;
  layer = 0;
  click = false;
  state = {
    drawing: false,
    animate: false,
  };

  dots_temp = [
    createVector(-130, 100),
    createVector(-124, 84),
    createVector(-109, 69),
    createVector(-96, 58),
    createVector(-81, 53),
    createVector(-66, 51),
    createVector(-53, 50),
    createVector(-34, 46),
    createVector(-21, 33),
    createVector(-19, 11),
    createVector(-19, -8),
    createVector(-20, -27),
    createVector(-12, -46),
    createVector(-3, -57),
    createVector(12, -65),
    createVector(26, -69),
    createVector(30, -89),
    createVector(32, -104),
    createVector(47, -123),
    createVector(57, -128),
    createVector(69, -126),
    createVector(87, -124),
    createVector(92, -118),
    createVector(74, -109),
    createVector(67, -98),
    createVector(66, -83),
    createVector(58, -75),
    createVector(45, -67),
    createVector(32, -64),
    createVector(15, -53),
    createVector(4, -43),
    createVector(-2, -32),
    createVector(-4, -13),
    createVector(-5, 10),
    createVector(-1, 28),
    createVector(3, 41),
    createVector(19, 45),
    createVector(48, 52),
    createVector(59, 59),
    createVector(68, 73),
    createVector(73, 91),
    createVector(76, 104),
    createVector(35, 104),
    createVector(-7, 106),
    createVector(-44, 106),
    createVector(-68, 109),
    createVector(-85, 108),
    createVector(-101, 107),
    createVector(-119, 107),
    createVector(-132, 101),
  ];

  dots_save = [
    [
      createVector(-130, 100),
      createVector(-124, 84),
      createVector(-109, 69),
      createVector(-96, 58),
      createVector(-81, 53),
      createVector(-66, 51),
      createVector(-53, 50),
      createVector(-34, 46),
      createVector(-21, 33),
      createVector(-19, 11),
      createVector(-19, -8),
      createVector(-20, -27),
      createVector(-12, -46),
      createVector(-3, -57),
      createVector(12, -65),
      createVector(26, -69),
      createVector(30, -89),
      createVector(32, -104),
      createVector(47, -123),
      createVector(57, -128),
      createVector(69, -126),
      createVector(87, -124),
      createVector(92, -118),
      createVector(74, -109),
      createVector(67, -98),
      createVector(66, -83),
      createVector(58, -75),
      createVector(45, -67),
      createVector(32, -64),
      createVector(15, -53),
      createVector(4, -43),
      createVector(-2, -32),
      createVector(-4, -13),
      createVector(-5, 10),
      createVector(-1, 28),
      createVector(3, 41),
      createVector(19, 45),
      createVector(48, 52),
      createVector(59, 59),
      createVector(68, 73),
      createVector(73, 91),
      createVector(76, 104),
      createVector(35, 104),
      createVector(-7, 106),
      createVector(-44, 106),
      createVector(-68, 109),
      createVector(-85, 108),
      createVector(-101, 107),
      createVector(-119, 107),
      createVector(-132, 101),
    ],
    [
      createVector(-141, 100.33334350585938),
      createVector(-67, 48.333343505859375),
      createVector(-24, 34.333343505859375),
      createVector(-8, 15.333343505859375),
      createVector(5, -11.666656494140625),
      createVector(-6, -44.666656494140625),
      createVector(-41, -79.66665649414062),
      createVector(-82, -93.66665649414062),
      createVector(-120, -61.666656494140625),
      createVector(-163, -72.66665649414062),
      createVector(-167, -125.66665649414062),
      createVector(-124, -151.66665649414062),
      createVector(-81, -154.66665649414062),
      createVector(-54, -144.66665649414062),
      createVector(-54, -175.66665649414062),
      createVector(-74, -203.66665649414062),
      createVector(-62, -245.66665649414062),
      createVector(-30, -265.6666564941406),
      createVector(6, -257.6666564941406),
      createVector(22, -207.66665649414062),
      createVector(17, -158.66665649414062),
      createVector(20, -137.66665649414062),
      createVector(45, -159.66665649414062),
      createVector(77, -192.66665649414062),
      createVector(107, -193.66665649414062),
      createVector(131, -181.66665649414062),
      createVector(148, -138.66665649414062),
      createVector(129, -104.66665649414062),
      createVector(88, -98.66665649414062),
      createVector(46, -102.66665649414062),
      createVector(25, -81.66665649414062),
      createVector(18, -45.666656494140625),
      createVector(23, -13.666656494140625),
      createVector(22, 7.333343505859375),
      createVector(13, 36.333343505859375),
      createVector(39, 47.333343505859375),
      createVector(67, 58.333343505859375),
      createVector(77, 81.33334350585938),
      createVector(84, 105.33334350585938),
      createVector(32, 104.33334350585938),
      createVector(-5, 104.33334350585938),
      createVector(-43, 106.33334350585938),
      createVector(-68, 110.33334350585938),
      createVector(-88, 105.33334350585938),
      createVector(-101, 105.33334350585938),
      createVector(-111, 105.33334350585938),
      createVector(-123, 103.33334350585938),
      createVector(-128, 104.33334350585938),
      createVector(-132, 103.33334350585938),
      createVector(-137, 98.33334350585938),
    ],
  ];

  dots = [
    [
      createVector(-130, 100),
      createVector(-124, 84),
      createVector(-109, 69),
      createVector(-96, 58),
      createVector(-81, 53),
      createVector(-66, 51),
      createVector(-53, 50),
      createVector(-34, 46),
      createVector(-21, 33),
      createVector(-19, 11),
      createVector(-19, -8),
      createVector(-20, -27),
      createVector(-12, -46),
      createVector(-3, -57),
      createVector(12, -65),
      createVector(26, -69),
      createVector(30, -89),
      createVector(32, -104),
      createVector(47, -123),
      createVector(57, -128),
      createVector(69, -126),
      createVector(87, -124),
      createVector(92, -118),
      createVector(74, -109),
      createVector(67, -98),
      createVector(66, -83),
      createVector(58, -75),
      createVector(45, -67),
      createVector(32, -64),
      createVector(15, -53),
      createVector(4, -43),
      createVector(-2, -32),
      createVector(-4, -13),
      createVector(-5, 10),
      createVector(-1, 28),
      createVector(3, 41),
      createVector(19, 45),
      createVector(48, 52),
      createVector(59, 59),
      createVector(68, 73),
      createVector(73, 91),
      createVector(76, 104),
      createVector(35, 104),
      createVector(-7, 106),
      createVector(-44, 106),
      createVector(-68, 109),
      createVector(-85, 108),
      createVector(-101, 107),
      createVector(-119, 107),
      createVector(-132, 101),
    ],
    [
      createVector(-141, 100.33334350585938),
      createVector(-67, 48.333343505859375),
      createVector(-24, 34.333343505859375),
      createVector(-8, 15.333343505859375),
      createVector(5, -11.666656494140625),
      createVector(-6, -44.666656494140625),
      createVector(-41, -79.66665649414062),
      createVector(-82, -93.66665649414062),
      createVector(-120, -61.666656494140625),
      createVector(-163, -72.66665649414062),
      createVector(-167, -125.66665649414062),
      createVector(-124, -151.66665649414062),
      createVector(-81, -154.66665649414062),
      createVector(-54, -144.66665649414062),
      createVector(-54, -175.66665649414062),
      createVector(-74, -203.66665649414062),
      createVector(-62, -245.66665649414062),
      createVector(-30, -265.6666564941406),
      createVector(6, -257.6666564941406),
      createVector(22, -207.66665649414062),
      createVector(17, -158.66665649414062),
      createVector(20, -137.66665649414062),
      createVector(45, -159.66665649414062),
      createVector(77, -192.66665649414062),
      createVector(107, -193.66665649414062),
      createVector(131, -181.66665649414062),
      createVector(148, -138.66665649414062),
      createVector(129, -104.66665649414062),
      createVector(88, -98.66665649414062),
      createVector(46, -102.66665649414062),
      createVector(25, -81.66665649414062),
      createVector(18, -45.666656494140625),
      createVector(23, -13.666656494140625),
      createVector(22, 7.333343505859375),
      createVector(13, 36.333343505859375),
      createVector(39, 47.333343505859375),
      createVector(67, 58.333343505859375),
      createVector(77, 81.33334350585938),
      createVector(84, 105.33334350585938),
      createVector(32, 104.33334350585938),
      createVector(-5, 104.33334350585938),
      createVector(-43, 106.33334350585938),
      createVector(-68, 110.33334350585938),
      createVector(-88, 105.33334350585938),
      createVector(-101, 105.33334350585938),
      createVector(-111, 105.33334350585938),
      createVector(-123, 103.33334350585938),
      createVector(-128, 104.33334350585938),
      createVector(-132, 103.33334350585938),
      createVector(-137, 98.33334350585938),
    ],
  ];

  cor = {
    base : color(270, 70, 50),
    final : color(350, 100, 50),
    atual : 0
  };

  cor.atual = cor.base;

  // // Classe
  // button1 = createButton("Draw");
  // button1.id = "draw";
  // button1.position(width + 14, 14);
  // button1.mousePressed(btnStart);
  // button2 = createButton("Clear");
  // button2.id = "clean";
  // button2.position(width + 14, 50);
  // button2.mousePressed(btnClean);
  // button3 = createButton("Animate");
  // button3.id = "animate";
  // button3.position(width + 14, 150);
  // button3.mousePressed(btnAnimate);
  // button4 = createButton("Print");
  // button4.id = "print";
  // button4.position(width + 14, 180);
  // button4.mousePressed(btnPrint);

  // pages = createRadio();

  // pages.position(width + 14, 80);
  // pages.class("pages_radio");
  // pages.size(100);
  // pages.option("Layer 1");
  // pages.option("Layer 2");
  // pages.selected("Layer 1");
  // pages.id("pagesR");
}

function draw() {
  background(5);
 
  translate(width / 2, height / 2);

  if (state.animate) {
    for (let i = 0; i < dots_temp.length; i++) {
      dots_temp[i].lerp(dots[player][i], 0.01);
    }
    cor.atual = lerpColor(cor.atual, cor.final, 0.02);
  } else {
    grid();
    // pages.mouseClicked(dots_control);
  }

  dots_draw();
  colorMode(HSL);
}

function mouseReleased() {
  if (
    isIn(mouseX, mouseY, 0, 0, width, height) &&
    state.drawing &&
    !state.animate && !click
  ) {
    dots_temp.push(createVector(mouseX - width / 2, mouseY - height / 2));
    //     console.log(mouseX - width / 2 + "," + (mouseY - height / 2));
    dots_save[layer].push(
      createVector(mouseX - width / 2, mouseY - height / 2)
    );
    dots[layer] = dots_temp;
  }
  
  if(click && state.drawing){
     dots_temp[dot_pressed].set(mouseX - width / 2, mouseY - height / 2);
    dots_save[layer][dot_pressed].set(mouseX - width / 2, mouseY - height / 2);
    dots[layer] = dots_temp;
     }
  cursor(CROSS);
  click = false;
}

function mousePressed() {
  // console.log(document.body.innerHTML);
 dot_move();
}


