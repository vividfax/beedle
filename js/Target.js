class Target {

    constructor(x, y, assignedTo) {

        this.x = x;
        this.y = y;
        this.radius = 0;
        this.visualRadius = 0;
        this.assignedTo;
        this.visualLineWeight = 0;

        this.assigned = false;
    }

    update() {

        if (this.radius != this.visualRadius) {
            this.visualRadius = lerp(this.visualRadius, this.radius, 0.1);
        }
    }

    clicked() {

        if (dist(mouseX/size, mouseY/size, this.x, this.y) < 12) {
            this.destruct();
            return true;
        }
    }

    destruct() {

        let index = targets.indexOf(this);
        if (index != -1) targets.splice(index, 1);
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
