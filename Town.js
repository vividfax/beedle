class Town {

    constructor(json) {

        this.pos = createVector(json.x, json.y);
        this.name = json.name;
        this.resource = json.resource;
        this.visiting = false;

        this.radius = 60;

        this.waitingForResource = false;
    }

    update() {

        if (player.backpack[this.resource] > 0) {
            this.waitingForResource = true;
        } else {
            this.waitingForResource = false;
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
        //text(this.name + "\n" + this.resource, this.pos.x, this.pos.y)

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
