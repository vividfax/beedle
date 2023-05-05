class Target {

    constructor(x, y) {

        this.pos = createVector(x, y);
    }

    display() {

        noStroke();
        fill("#888");
        ellipse(this.pos.x, this.pos.y, 10);
    }
}
