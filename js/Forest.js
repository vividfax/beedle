class Forest {

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
        // fill("#bbb");
        // ellipse(this.x, this.y, this.radius);
    }
}

function createForests(x, y) {

    let spacing = 40;
    forests.push(new Forest(x, y));
    x += random(-spacing, spacing);
    y += random(-spacing, spacing);

    return { x: x, y: y};
}