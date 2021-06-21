class Town {

    constructor(json) {

        this.pos = createVector(json.x, json.y);
        this.name = json.name;
        this.resource = json.resource;
        this.visiting = false;
    }

    display() {

        noStroke();

        if (this.visiting) {
            fill("#aaa");
        } else {
            fill("#fff");
        }
        ellipse(this.pos.x, this.pos.y, 40);

        fill("#000");
        text(this.name + "\n" + this.resource, this.pos.x, this.pos.y)
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
