class Loot {

    constructor(x, y, type) {

        if (x != undefined && y != undefined) {
            this.pos = createVector(x, y);
            this.x = x;
            this.y = y;
        }
        else {
            this.x = random(width/size);
            this.y = random(height/size);
        }

        this.radius = 20;

        this.type = type;
        this.visible = false;
    }

    update() {

    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.x, this.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    destruct() {

        let index = loots.indexOf(this);
        if (index != -1) loots.splice(index, 1);
    }

    display() {

        if (!this.visible) {

            for (let i = 0; i < beedles.length; i++) {
                let distance = dist(beedles[i].x, beedles[i].y, this.x, this.y);
                if (distance < beedleVisionRadius) {
                    this.visible = true;
                    break;
                }
            }
        }

        if (!this.visible) return;

        image(lootImages[this.type], this.x, this.y, 20, 20);
    }
}
