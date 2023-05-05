class Player {

    constructor(x, y, img) {

        this.x = x;
        this.y = y;
        this.moved = false;

        this.img = img;
        this.visiting;

        this.radius = 20;

        this.velocity = 1;

        this.isCarryingRare = false;
        this.rareCount = 0;

        this.inventory = {
            stone: 0,
            wood: 0,
            bones: 0,
            gems: 0,
        };
    }

    update() {

        this.moved = false;

        if (this.velocity < 1) {
            this.velocity += 0.002;
        }
        for (let i = 0; i < towns.length; i++) {
            if (this.checkProximity(towns[i].x, towns[i].y, this.radius/2 + towns[i].radius/2)) {

                if (this.isCarryingRare) {
                    score += 20 * this.rareCount;
                    this.rareCount = 0;
                    this.isCarryingRare = false;
                }
                this.velocity = 1;

                if (this.inventory[towns[i].resource] > 0) {
                    score += this.inventory[towns[i].resource];
                    this.inventory[towns[i].resource] = 0;
                }
            }
        }
        for (let i = 0; i < loots.length; i++) {
            if (this.checkProximity(loots[i].x, loots[i].y, this.radius/2 + loots[i].radius)) {

                this.addToinventory(loots[i].type);
                loots[i].destruct();
            }
        }
    }

    move(vector) {

        this.moved = true;

        let pos = createVector(this.x, this.y);
        let targetPos = createVector(vector.x - this.x, vector.y - this.y);

        if (dist(vector.x, vector.y, this.x, this.y) > 1) {

            targetPos.normalize().mult(this.velocity);
            pos.add(targetPos);

            this.x = pos.x;
            this.y = pos.y;
        }
    }

    addToinventory(lootType) {

        if (lootType == "stone") this.inventory.stone++;
        else if (lootType == "wood") this.inventory.wood++;
        else if (lootType == "bones") this.inventory.bones++;
        else if (lootType == "gems") this.inventory.gems++;
    }

    displayinventory() {

        push();

        fill("#000");
        textAlign(LEFT);

        let i = 0;

        for (let resource in this.inventory) {
            let label = resource + " " + this.inventory[resource];
            text(label, 20, 30 + i * 30);
            i++;
        }
        pop();
    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.x, this.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    display() {

        if (this.moved) {
            // let pixel = pg.get(this.x, this.y);
            // pixel[0] -= 5;
            // pixel[1] -= 5;
            // pixel[2] -= 5;
            // pg.set(this.x, this.y, color(pixel));
            // pg.updatePixels();
        }

        push();

        // pg.noStroke();
        // pg.fill(255, 255, 255, 10);
        // pg.ellipse(this.x, this.y, 10);

        //image(img, this.x, this.y, 750 * 0.1, 650 * 0.1);

        if (this.isCarryingRare) {
            stroke("#333")
            fill("#FFE600");
        } else {
            stroke("#333");
            fill("#fff");
        }

        ellipse(this.x, this.y, this.radius);

        pop();
    }
}
