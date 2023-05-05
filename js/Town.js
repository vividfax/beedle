let townNames = ["Gerudo", "Hateno", "Tarrey"];
let resources = ["hide", "cobblestone", "nitre"];

class Town {

    constructor(townNumber) {

        this.townNumber = townNumber;

        this.edgePadding = 200;
        this.pos = createVector(random(this.edgePadding, width-this.edgePadding), random(this.edgePadding, height-this.edgePadding));

        while (this.touchingAnotherTown()) this.pos = createVector(random(this.edgePadding, width-this.edgePadding), random(this.edgePadding, height-this.edgePadding));

        this.name = townNames[townNumber];
        this.resource = resources[townNumber];
        this.visiting = false;

        this.radius = 60;

        this.waitingForResource = false;
    }

    update() {

        if (player.backpack[this.resource] > 0) {
            this.waitingForResource = true;
        } else {
            this.waitingForResource = false;
        }
    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.pos.x, this.pos.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    touchingAnotherTown() {

        for (let i = 0; i < towns.length; i++) {

            if (dist(this.pos.x, this.pos.y, towns[i].pos.x, towns[i].pos.y) < 300) return true;
        }
    }

    display() {

        push();

        noStroke();

        if (this.waitingForResource) {
            fill("#fff")
        } else {
            fill("#aaa");
        }
        ellipse(this.pos.x, this.pos.y, this.radius);

        fill("#000");
        text(this.name + "\n" + this.resource, this.pos.x, this.pos.y)

        pop();
    }

    checkVisiting(pos) {

        let distance = dist(pos.x, pos.y, this.pos.x, this.pos.y);

        if (distance < 20) {
            this.visiting = true;
            player.visiting = this.name;
        } else {
            this.visiting = false;
        }
    }
}
