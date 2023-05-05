class Mountain {

    constructor(x, y) {

        this.edgePadding = 200;
        this.x = x;
        this.y = y;

        this.radius = random(50, 100);
    }

    update() {

    }

    display() {

        // noStroke();
        // fill("#aaa");
        // ellipse(this.x, this.y, this.radius);
    }
}

function createMountainRange(x, y) {

    let spacing = 40;
    mountains.push(new Mountain(x, y));
    x += random(-spacing, spacing);
    y += random(-spacing, spacing);

    return { x: x, y: y};
}