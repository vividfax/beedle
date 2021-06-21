class Adventurer {

    constructor() {

        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
    }

    display() {

        fill("#000");
        ellipse(this.pos.x, this.pos.y, 30);
    }

    move() {

        if (random() < 0.01) {
            this.vel = createVector(random(-1, 1), random(-1, 1));
        } else if (random() < 0.0005) {
            this.vel = createVector(0, 0);
        }
        this.pos.add(this.vel);

        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }
}
