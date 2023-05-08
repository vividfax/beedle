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

        // this.moved = false;

        // if (this.velocity < 1) {
        //     this.velocity += 0.002;
        // }
        // for (let i = 0; i < towns.length; i++) {
        //     if (this.checkProximity(towns[i].x, towns[i].y, this.radius/2 + towns[i].radius/2)) {

        //         if (this.isCarryingRare) {
        //             score += 20 * this.rareCount;
        //             this.rareCount = 0;
        //             this.isCarryingRare = false;
        //         }
        //         this.velocity = 1;

        //         // if (this.inventory[towns[i].resource] > 0) {
        //         //     score += this.inventory[towns[i].resource];
        //         //     this.inventory[towns[i].resource] = 0;
        //         // }

        //         for (let [key, value] of Object.entries(this.inventory)) {
        //             if (value > 0 && (towns[i].inventory[key.toString()] < 100 || key.toString() == "gems")) {

        //                 towns[i].inventory[key.toString()] ++;
        //                 score++;
        //                 this.inventory[key.toString()]--;

        //                 if (key.toString() == "gems") score += 4;
        //             }
        //         }
        //     }
        // }
        // for (let i = 0; i < loots.length; i++) {
        //     if (this.checkProximity(loots[i].x, loots[i].y, this.radius/2 + loots[i].radius)) {

        //         this.addToinventory(loots[i].type);
        //         loots[i].destruct();
        //     }
        // }
    }

    move(vector) {

        this.velocity = 1;

        for (let i = 0; i < adventurers.length; i++) {
            if (this.collide(adventurers[i])) {
                this.velocity = 0.2;
                break;
            }
        }

        for (let i = 0; i < monsters.length; i++) {
            if (this.collide(monsters[i])) {
                this.velocity = 0.2;
                break;
            }
        }

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

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < this.radius/2 + collider.radius/2) return true;
    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.x, this.y) < distance) {
            return true;
        } else {
            return false;
        }
    }
}
