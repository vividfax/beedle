class Target {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.radius = 0;
        this.visualRadius = 0;

        this.assigned = false;
    }

    update() {

        if (this.radius != this.visualRadius) {
            this.visualRadius = lerp(this.visualRadius, this.radius, 0.1);
        }
    }

    display() {

        push();
        translate(this.x, this.y);
        fill(255);
        noStroke();
        textFont(targetCrossFont);
        textSize(this.visualRadius*4);
        text("X", 0, -this.visualRadius/1.2);
        pop();
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < 1) return true;
    }
}
