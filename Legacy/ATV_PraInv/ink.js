
class Drop {
    constructor(x, y, r, col) {
      this.center = createVector(x, y);
      this.r = r;
      this.x = 0;
      this.y = 0;
      this.acc = 0.1;
      this.vel = 1;
      this.circleDetail = 100;//this.r * 16;
      this.vertices = [];
      for (let i = 0; i < this.circleDetail; i++) {
        let angle = map(i, 0, this.circleDetail, 0, TWO_PI);
        let v = createVector(cos(angle), sin(angle));
        v.mult(this.r);
        v.add(this.center);
        this.vertices[i] = v;
      }
      this.col = col;
    }
  
  
    tine(m, x, y, z, c) {
      let u = 1 / pow(2, 1 / c);
      let b = createVector(x, y);
      for (let v of this.vertices) {
        let pb = p5.Vector.sub(v, b);
        let n = m.copy().rotate(HALF_PI);
        let d = abs(pb.dot(n));
        let mag = z * pow(u, d);
        v.add(m.copy().mult(mag));
      }
    }
  
    marble(other) {
      for (let v of this.vertices) {
        let c = other.center;
        let r = other.r;
        let p = v.copy();
        p.sub(c);
        let m = p.mag();
        let root = sqrt(1 + (r * r) / (m * m));
        p.mult(root);
        p.add(c);
        v.set(p);
      }
    }
  
    show() {
      fill(this.col);
      noStroke();
      beginShape();
      for (let v of this.vertices) {
        vertex(v.x+this.x, v.y+this.y);
      }
      endShape(CLOSE);
      this.vel += this.acc;
      //this.x++;
      this.y+= this.vel;
    }
  }
  