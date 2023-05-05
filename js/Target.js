class Target {

    constructor(x, y) {

        this.x = x;
        this.y = y;
    }

    display() {

        noStroke();
        fill("#888");
        ellipse(this.x, this.y, 10);
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < 1) return true;
    }
}
