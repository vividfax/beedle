let maxRare = 2;
let rareCount = 0;

class Adventurer {

    constructor() {

        this.init();
    }

    init() {

        this.birthTown = random(towns);

        this.pos = createVector(this.birthTown.pos.x, this.birthTown.pos.y);
        this.vel = createVector(random(-1, 1), random(-1, 1));

        this.radius = 30;

        this.velocity = 1;

        this.isCarrying = false;
        this.isRare = false;

        this.passingThroughTown = false;

        this.maxHitpoints = 60;
        this.hitpoints = this.maxHitpoints;
        this.dead = false;
    }

    update() {

        if (this.dead) return;

        if (this.velocity < 1) {
            this.velocity += 0.001;
        }

        for (let i = 0; i < loots.length; i++) {
            if (this.checkProximity(loots[i].pos.x, loots[i].pos.y, this.radius/2 + loots[i].radius/2)) {

                this.isCarrying = true;
                loots[i].respawn();

                if (!this.isRare && random(50) < 1 && rareCount < maxRare) {
                    this.isRare = true;
                    rareCount++;
                }
            }
        }
        if (this.checkProximity(player.pos.x, player.pos.y, this.radius/2 + player.radius/2)) {

            if (this.isRare && this.isCarrying) {
                this.isCarrying = false;
                this.isRare = false;
                rareCount--;
                player.isCarryingRare = true;
                player.rareCount++;

            } else if (this.isCarrying) {
                player.velocity = 0.1;
                this.isCarrying = false;
                player.isCarryingRare = false;
                player.rareCount = 0;

                // player.addToBackpack();
                // player.addToBackpack();
            }
        }
        this.passingThroughTown = false;

        for (let i = 0; i < towns.length; i++) {
            if (this.checkProximity(towns[i].pos.x, towns[i].pos.y, this.radius/2 + towns[i].radius/2)) {

                if (this.isCarrying && this.isRare) {
                    this.isRare = false;
                    rareCount--;
                    this.isCarrying = false;
                } else if (this.isCarrying) {
                    this.isCarrying = false;
                }
                this.passingThroughTown = true;
            }
        }

        if (this.dead) return;

        let inFight = false;

        for (let i = 0; i < monsters.length; i++) {
            if (this.collide(monsters[i])) {
                if (!inFight) inFight = true;
                monsters[i].hitpoints--;
                break;
            }
        }

        if (this.hitpoints < 0) {
            this.dead = true;
            this.init();
        }

        if (!inFight) {
            this.move();
            if (this.hitpoints < this.maxHitpoints) this.hitpoints++;
        }
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

    checkProximity(x, y, distance) {

        if (dist(x, y, this.pos.x, this.pos.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    display() {

        if (this.dead) return;

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
