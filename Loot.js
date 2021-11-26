class Loot {

    constructor() {

        this.pos = createVector(random(width), random(height));
        this.radius = 10;
    }

    update() {

        for (let i = 0; i < towns.length; i++) {
            if (this.checkProximity(towns[i].pos.x, towns[i].pos.y, this.radius/2 + towns[i].radius/2)) {

                this.pos.x = random(width);
                this.pos.y = random(height);
            }
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

        noStroke();
        fill("#bbb");
        rect(this.pos.x, this.pos.y, this.radius, this.radius);

        pop();
    }
}
