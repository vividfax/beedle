class Player {

    constructor(x, y, img, backpack) {

        this.pos = createVector(x, y);
        this.img = img;
        this.visiting;

        this.radius = 20;

        this.velocity = 1;

        this.isCarryingRare = false;

        this.backpack = {
            cobblestone: 0,
            hide: 0,
            nitre: 0,
        };
    }

    update() {

        if (this.velocity < 1) {
            this.velocity += 0.002;
        }
        for (let i = 0; i < towns.length; i++) {
            if (this.checkProximity(towns[i].pos.x, towns[i].pos.y, this.radius/2 + towns[i].radius/2)) {

                if (this.isCarryingRare) {
                    score += 20;
                    this.isCarryingRare = false;
                }
                this.velocity = 1;

                if (this.backpack[towns[i].resource] > 0) {
                    score += this.backpack[towns[i].resource];
                    this.backpack[towns[i].resource] = 0;
                }
            }
        }
        for (let i = 0; i < loots.length; i++) {
            if (this.checkProximity(loots[i].pos.x, loots[i].pos.y, this.radius/2 + loots[i].radius/2)) {

                loots[i].pos.x = random(width);
                loots[i].pos.y = random(height);

                this.addToBackpack();
            }
        }
    }

    move(vector) {

        let targetPos = createVector(vector.x - this.pos.x, vector.y - this.pos.y);

        if (this.pos.dist(vector) > 1) {

            targetPos.normalize().mult(this.velocity);
            this.pos.add(targetPos);
        }
    }

    addToBackpack() {

        let resource = int(random(3));

        if (resource == 0) {
            this.backpack.cobblestone++;
        } else if (resource == 1) {
            this.backpack.hide++
        } else if (resource == 2) {
            this.backpack.nitre++
        } else {
            console.log("ERR901409");
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

    checkProximity(x, y, distance) {

        if (dist(x, y, this.pos.x, this.pos.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    display() {

        push();

        //image(img, this.pos.x, this.pos.y, 750 * 0.1, 650 * 0.1);

        if (this.isCarryingRare) {
            stroke("#333")
            fill("#FFE600");
        } else {
            stroke("#333");
            fill("#fff");
        }
        ellipse(this.pos.x, this.pos.y, this.radius);

        pop();
    }
}
