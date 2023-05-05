class Monster {

    constructor() {

        this.init();
    }

    init() {

        this.pos = createVector(random(width), random(height));

        this.radius = random([20, 20, 50]);
        this.speed = 0.5;

        this.vel = createVector(random(-this.speed, this.speed), random(-this.speed, this.speed));

        this.hitpoints = this.radius*2;
        this.dead = false;
    }

    update() {

        if (this.dead) return;

        let inFight = false;

        for (let i = 0; i < adventurers.length; i++) {
            if (this.collide(adventurers[i])) {
                if (!inFight) inFight = true;
                adventurers[i].hitpoints--;
                break;
            }
        }

        if (this.hitpoints < 0) {
            this.dead = true;
            this.init();
        }

        if (!inFight) {
            this.move();
        }
    }

    move() {

        let velocity = createVector(this.vel.x, this.vel.y);

        if (random() < 0.01) {
            velocity = createVector(random(-this.speed, this.speed), random(-this.speed, this.speed));
        } else if (random() < 0.0005) {
            velocity = createVector(0, 0);
        }

        this.pos.add(velocity);

        let edgePadding = 50;

        if (this.pos.x > width-edgePadding || this.pos.x < edgePadding) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height-edgePadding || this.pos.y < edgePadding) {
            this.vel.y *= -1;
        }
    }

    collide(collider) {

        if (collider.dead) return false;

        if (dist(collider.pos.x, collider.pos.y, this.pos.x, this.pos.y) < this.radius/2 + collider.radius/2) return true;
    }

    display() {

        if (this.dead) return;

        push();

        stroke("#fff");

        fill(0);
        ellipse(this.pos.x, this.pos.y, this.radius);

        pop();
    }
}
