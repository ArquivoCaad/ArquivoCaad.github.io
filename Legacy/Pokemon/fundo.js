
const ctx = document.getElementById("anima");
const c = ctx.getContext("2d");
var mouse = {
    x: 0,
    y: 0
};
function resize() {
    c.canvas.width = window.innerWidth;
    c.canvas.height = window.innerHeight;
}

function Bola() {
    this.x = Math.floor(Math.random() * (c.canvas.width - 50));
    this.y = Math.floor(Math.random() * (c.canvas.height - 50));
    this.velx = (Math.random() * 1 - 0.5) * (Math.random() * 3);
    this.vely = (Math.random() * 1 - 0.5) * (Math.random() * 3);
    this.diametro = Math.floor(Math.random() * 10) + 10;

    this.draw = function () {
        c.fillStyle = "rgb(96, 107, 181,20%)";
        c.beginPath();
        c.arc(this.x, this.y, this.diametro / 2, 0, Math.PI * 2);
        c.fill();
    }

    this.update = function () {
        for (let i = 0; i < bolas.length; i++) {
            const element = bolas[i];
            if (this != element && this.intersects(element, "hit")) {
                this.velx *= -1;
                this.vely *= -1;
                element.velx *= -1;
                element.vely *= -1;
            }
            if (this != element && this.intersects(element, "line")) {
                c.strokeStyle = "rgb(96, 107, 181,20%)";
                c.lineWidth = 2;
                c.beginPath();
                c.moveTo(this.x, this.y);
                c.lineTo(element.x, element.y);
                c.stroke();
            }
            if (this != element && this.intersects(mouse, "dist") < 100) {
                c.strokeStyle = "rgb(96, 107, 181,20%)";
                c.lineWidth = 2;
                c.beginPath();
                c.moveTo(this.x, this.y);
                c.lineTo(mouse.x, mouse.y);
                c.stroke();
            }
        }

        if (this.x + this.diametro > c.canvas.width || this.x < 0) {
            this.velx = -this.velx;
        }
        if (this.y + this.diametro > c.canvas.height || this.y < 0) {
            this.vely = -this.vely;
        }
        this.x += this.velx;
        this.y += this.vely;
        this.draw();
    }

    this.intersects = function (element, tipo) {
        const dx = this.x - element.x;
        const dy = this.y - element.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (tipo == "dist") {
            return distance;
        } else if (tipo == "hit") {
            return distance <= (this.diametro + element.diametro) / 2;
        } else if (tipo == "line") {
            return distance <= (this.diametro * 5);
        }
    }
}


let bolas = [];

function init() {
    resize();
    window.requestAnimationFrame(draw);

    for (let i = 0; i < 300; i++) {
        bolas.push(new Bola());
    }
}


function draw() {
    // ctx.globalCompositeOperation = "destination-over";
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    bolas.forEach(element => {
        element.update();
    });

    c.fillStyle = "rgb(96, 107, 181,50%)";
    c.beginPath();
    c.arc(mouse.x, mouse.y, 20 / 2, 0, Math.PI * 2);
    c.fill();
    document.getElementById("anima").style.cursor = "none";

    window.requestAnimationFrame(draw);
}

ctx.addEventListener("mousemove", function (evt) {
    mouse = getMousePos(ctx, evt);
}, false);


function getMousePos(c, evt) {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.pageX,
        y: evt.pageY - window.scrollY
    };
}

init();