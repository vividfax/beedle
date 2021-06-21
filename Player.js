class Player {

    constructor(x, y, img, backpack) {

        this.pos = createVector(x, y);
        this.img = img;
        this.backpack = backpack;
        this.visiting;
    }

    display() {

        image(img, this.pos.x, this.pos.y, 750 * 0.1, 650 * 0.1);
    }

    move(vector) {

        let targetPos = createVector(vector.x - this.pos.x, vector.y - this.pos.y);

        if (this.pos.dist(vector) > 1) {

            targetPos.normalize().mult(1);
            this.pos.add(targetPos);
        }
    }

    displayBackpack() {

        push();

        fill("#000");
        textAlign(LEFT);

        let i = 0;

        for (let resource in this.backpack) {
            let label = resource + " " + this.backpack[resource];
            text(label, 20, 30 + i * 30);
            i++;
        }
        pop();
    }

    updateBackpack() {

    }
}
