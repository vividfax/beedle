class Town {

    constructor(json) {

        this.pos = createVector(json.x, json.y);
        this.name = json.name;
        this.resource = json.resource;
        this.visiting = false;

        this.radius = 60;

        this.waitingForResource = false;

        this.spawn();
    }

    update() {

        if (player.backpack[this.resource] > 0) {
            this.waitingForResource = true;
        } else {
            this.waitingForResource = false;
        }
    }

    spawn() {

        let unsuitable;

        this.pos.x = random(100, width-100);
        this.pos.y = random(100, height-100);

        do {
            unsuitable = false;

            this.pos.x = random(100, width-100);
            this.pos.y = random(100, height-100);

            for (let i = 0; i < towns.length; i++) {
                if (this.checkProximity(towns[i].pos.x, towns[i].pos.y, 300)) {

                    unsuitable = true;
                }
            }
            if (this.checkProximity(player.pos.x, player.pos.y, 100)) {

                unsuitable = true;
            }
        } while (unsuitable);
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

        if (this.waitingForResource) {
            fill("#D4E9B9")
        } else {
            fill("#fff");
        }
        ellipse(this.pos.x, this.pos.y, this.radius);

        fill("#000");
        text(this.name + "\n" + this.resource, this.pos.x, this.pos.y)

        pop();
    }

    checkVisiting(pos) {

        let distance = dist(pos.x, pos.y, this.pos.x, this.pos.y);

        if (distance < 20) {
            this.visiting = true;
            player.visiting = this.name;
        } else {
            this.visiting = false;
        }
    }
}
