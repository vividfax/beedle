class Loot {

    constructor() {

        this.pos = createVector(random(width), random(height));
        this.radius = 10;

        this.respawn();
    }

    update() {

    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.pos.x, this.pos.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    respawn() {

        this.pos.x = random(width);
        this.pos.y = random(height);

        let unsuitable = false;

        do {
            unsuitable = false;

            this.pos.x = random(width);
            this.pos.y = random(height);

            for (let i = 0; i < towns.length; i++) {
                if (this.checkProximity(towns[i].pos.x, towns[i].pos.y, this.radius + towns[i].radius/2)) {

                    unsuitable = true;
                }
            }
            for (let i = 0; i < adventurers.length; i++) {
                if (this.checkProximity(adventurers[i].pos.x, adventurers[i].pos.y, this.radius + adventurers[i].radius*2)) {

                    unsuitable = true;
                }
            }
            if (this.checkProximity(player.pos.x, player.pos.y, this.radius + player.radius*2)) {

                unsuitable = true;
            }
        } while (unsuitable);
    }

    display() {

        push();

        noStroke();
        fill("#ECE184");
        ellipse(this.pos.x, this.pos.y, this.radius);

        pop();
    }
}
