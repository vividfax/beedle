let townNames = ["Gerudo", "Hateno", "Tarrey"];
let resources = ["stone", "wood", "bones"];

class Town {

    constructor(townNumber) {

        this.townNumber = townNumber;

        this.edgePadding = 200;
        this.x = random(this.edgePadding, width-this.edgePadding);
        this.y = random(this.edgePadding, height-this.edgePadding);

        while (this.touchingAnotherTown()) {
            this.x = random(this.edgePadding, width-this.edgePadding);
            this.y = random(this.edgePadding, height-this.edgePadding);
        }

        this.name = townNames[townNumber];
        this.resource = resources[townNumber];
        this.visiting = false;

        this.radius = 60;

        this.waitingForResource = false;

        this.inventory = {
            stone: 0,
            wood: 0,
            bones: 0,
            gems: 0,
        };
    }

    update() {

        if (player.inventory[this.resource] > 0) {
            this.waitingForResource = true;
        } else {
            this.waitingForResource = false;
        }

        if (frameCount % 300 == 1) {
            for (let [key, value] of Object.entries(this.inventory)) {
                if (value > 0) this.inventory[key.toString()]--;
            }
        }


        this.hover();
    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.x, this.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    touchingAnotherTown() {

        for (let i = 0; i < towns.length; i++) {

            if (dist(this.x, this.y, towns[i].x, towns[i].y) < 300) return true;
        }
    }

    checkVisiting(character) {

        let distance = dist(character.x, character.y, this.x, this.y);

        if (distance < 20) {
            this.visiting = true;
            player.visiting = this.name;
        } else {
            this.visiting = false;
        }
    }

    hover() {

        if(dist(mouseX, mouseY, this.x, this.y) < this.radius/2) popupSelected = this;
    }

    display() {

        push();

        noStroke();

        // if (this.waitingForResource) {
            fill("#fff")
        // } else {
        //     fill("#aaa");
        // }
        ellipse(this.x, this.y, this.radius);

        fill("#000");
        text(this.name, this.x, this.y)

        pop();
    }
}
