class Target {

    constructor(x, y) {

        this.x = x;
        this.y = y;
    }

    display() {

        push();
        translate(this.x, this.y);
        stroke(255);
        strokeWeight(2);
        let size = 5;
        line(-size, -size, size, size);
        line(-size, size, size, -size);
        pop();
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < 1) return true;
    }
}
