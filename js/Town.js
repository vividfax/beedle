let townNames = [];

class Town {

    constructor(townNumber, x, y) {

        this.townNumber = townNumber;

        this.name = this.createName();
        if (townNames.includes(this.name) || commonWords.words.includes(this.name.toLowerCase())) this.name = this.createName();
        townNames.push(this.name);

        this.x = x;
        this.y = y;

        if (x == undefined) {
            this.edgePadding = 200;
            this.x = random(this.edgePadding, width/size-this.edgePadding-inventoryWidth);
            this.y = random(this.edgePadding, height/size-this.edgePadding);

            while (this.touchingAnotherTown()) {
                this.x = random(this.edgePadding, width/size-this.edgePadding-inventoryWidth);
                this.y = random(this.edgePadding, height/size-this.edgePadding);
            }
        }

        this.visiting = false;
        this.visited = false;

        this.waitingForResource = false;

        this.inventory = {
            stone: 0,
            wood: 0,
            bones: 0,
            food: 0,
            gems: 0,
        };

        // let resourceSize = this.inventory.stone + this.inventory.wood;
        // this.radius = 30 + resourceSize/200*60;
        this.resourceCapacity = 10;
        this.radius = this.resourceCapacity/2 + 35;
        this.visualRadius = this.radius;

        this.visible = true;
        this.discovered = false;

        this.lastCaravanSent = -1;
    }

    update() {

        if (!this.discovered) {
            for (let i = 0; i < beedles.length; i++) {
                let distance = dist(beedles[i].x, beedles[i].y, this.x, this.y);
                if (distance < beedleVisionRadius) {
                    this.discovered = true;
                    break;
                }
            }
        }

        if (player.inventory[this.resource] > 0) {
            this.waitingForResource = true;
        } else {
            this.waitingForResource = false;
        }

        if (frameCount % (60*4) == 1) {
            if (this.inventory.gems > 0 && this.resourceCapacity < 100 && (this.inventory.stone >= this.resourceCapacity || this.inventory.wood >= this.resourceCapacity)) this.resourceCapacity++;

            for (let [key, value] of Object.entries(this.inventory)) {
                if (value > 0) {
                    this.inventory[key.toString()]--;
                }
            }
        }

        // let stone = this.inventory.stone > 100 ? 100 : this.inventory.stone;
        // let wood = this.inventory.wood > 100 ? 100 : this.inventory.wood;
        // let resourceSize = stone + wood;
        // this.radius = 30 + resourceSize/200*60;

        this.radius = this.resourceCapacity/2 + 35;
        if (this.visualRadius < this.radius) this.visualRadius += 0.01;

        this.lastCaravanSent++;

        if (this.resourceCapacity >= 100 && towns.length < 5 && caravans.length == 0 && this.inventory.wood >= this.resourceCapacity && this.inventory.stone >= this.resourceCapacity) {
            if (this.lastCaravanSent > 60*30) {
                this.inventory.stone = 0;
                this.inventory.wood = 0;
                this.birthCaravan();
                this.lastCaravanSent = 0;
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

            if (dist(this.x, this.y, towns[i].x, towns[i].y) < 200) return true;
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

        textAlign(CENTER, CENTER);
        if(dist(mouseX/size, mouseY/size, this.x, this.y) < this.radius/2) popupSelected = this;
    }

    createName() {

        let prefix = random(guideWords.words);
        let mid = random(guideWords.words)
        let suffix = random(guideWords.words);

        let name = [prefix, mid, suffix].join("");
        name = name.slice(0, int(random(4, 8)));
        name = name.replace(/^\w/, (c) => c.toUpperCase());

        return name;
    }

    birthCaravan() {

        caravans.push(new Caravan(this.x, this.y));
    }

    display() {

        image(castleImage, this.x, this.y, this.visualRadius, this.visualRadius);
    }


    displayName() {

        if (!this.discovered) return;

        push();

        fill(0, 200);
        stroke(0, 200);
        strokeWeight(0.3);
        textFont(beetleDescriptionFont);
        textSize(20);
        textLeading(20);
        text(this.name, this.x, this.y+this.visualRadius/2 + 10)

        pop();
    }
}
