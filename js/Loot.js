class Loot {

    constructor(x, y, type) {

        if (x != undefined && y != undefined) {
            this.pos = createVector(x, y);
            this.x = x;
            this.y = y;
        }
        else {
            this.x = random(width);
            this.y = random(height);
        }

        this.radius = 20;

        this.type = type;
    }

    update() {

    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.x, this.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    destruct() {

        let index = loots.indexOf(this);
        if (index != -1) loots.splice(index, 1);
    }

    display() {

        push();

        image(lootImages[this.type], this.x, this.y, 20, 20);
            // noStroke();
            // fill("#ECE184");
            // ellipse(this.x, this.y, this.radius);

        pop();
    }
}
