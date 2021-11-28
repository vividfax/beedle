class Adventurer {

    constructor() {

        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));

        this.radius = 30;

        this.velocity = 1;

        this.isCarrying = false;
        this.isRare = false;

        this.passingThroughTown = false;
    }

    update() {

        if (this.velocity < 1) {
            this.velocity += 0.001;
        }

        for (let i = 0; i < loots.length; i++) {
            if (this.checkProximity(loots[i].pos.x, loots[i].pos.y, this.radius/2 + loots[i].radius/2)) {

                this.isCarrying = true;
                loots[i].respawn();

                if (!this.isRare && random(50) < 1) {
                    this.isRare = true;
                }
            }
        }
        if (this.checkProximity(player.pos.x, player.pos.y, this.radius/2 + player.radius/2)) {

            if (this.isRare && this.isCarrying) {
                this.isCarrying = false;
                this.isRare = false;
                player.isCarryingRare = true;

            } else if (this.isCarrying) {
                player.velocity = 0.1;
                this.isCarrying = false;

                // player.addToBackpack();
                // player.addToBackpack();
            }
        }
        this.passingThroughTown = false;

        for (let i = 0; i < towns.length; i++) {
            if (this.checkProximity(towns[i].pos.x, towns[i].pos.y, this.radius/2 + towns[i].radius/2)) {
                if (this.isCarrying) {
                    this.isCarrying = false;
                }
                this.passingThroughTown = true;
            }
        }

        this.move();
    }

    move() {

        let velocity = createVector(this.vel.x, this.vel.y);

        if (random() < 0.01) {
            velocity = createVector(random(-1, 1), random(-1, 1));
        } else if (random() < 0.0005) {
            velocity = createVector(0, 0);
        }

        if (this.passingThroughTown) {
            velocity.normalize().mult(0.2);
        }

        this.pos.add(velocity);

        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.pos.x, this.pos.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    display() {

        push();

        stroke("#fff");

        if (this.isRare && this.isCarrying) {
            fill("#FFE600");
        } else if (this.isCarrying) {
            fill("#BF4A4A");
        } else {
            fill("#aaa");
        }
        ellipse(this.pos.x, this.pos.y, this.radius);

        pop();
    }
}
