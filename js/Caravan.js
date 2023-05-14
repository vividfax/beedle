class Caravan {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.edgePadding = 200;
        this.targetX = random(this.edgePadding, width/size-this.edgePadding-inventoryWidth);
        this.targetY = random(this.edgePadding, height/size-this.edgePadding);

        while (this.touchingAnotherTown()) {
            this.targetX = random(this.edgePadding, width/size-this.edgePadding-inventoryWidth);
            this.targetY = random(this.edgePadding, height/size-this.edgePadding);
        }

        this.radius = 40;
        this.speed = 0.1;

        this.maxHitpoints = 150;
        this.hitpoints = this.maxHitpoints;
        this.healPoints = 0;
        this.dead = false;
        this.visible = false;
    }

    update() {

        let inFight = false;

        for (let i = 0; i < monsters.length; i++) {
            if (this.collide(monsters[i])) {
                if (!inFight) inFight = true;

                this.hitpoints--;

                if (this.hitpoints < 0) {
                    for (let i = 0; i < random(5, 10); i++) {
                        loots.push(new Loot(this.x, this.y, "stone"));
                    }
                    for (let i = 0; i < random(5, 10); i++) {
                        loots.push(new Loot(this.x, this.y, "wood"));
                    }
                    for (let i = 0; i < random(3, 6); i++) {
                        loots.push(new Loot(this.x, this.y, "bones"));
                    }
                    shouts.push(new Shout(this.x, this.y, -1));
                    this.destruct();
                    return;
                }
            }
        }

        if (!inFight) {
            this.move();

            if (dist(this.x, this.y, this.targetX, this.targetY) < 1) {
                towns.push(new Town(towns.length, this.x, this.y));
                this.destruct();
                return;
            }
        }
    }

    move() {

        let pos = createVector(this.x, this.y);
        let targetPos = createVector(this.targetX - this.x, this.targetY - this.y);

        if (dist(this.targetX, this.targetY, this.x, this.y) > 1) {

            targetPos.normalize().mult(this.speed);
            pos.add(targetPos);

            this.x = pos.x;
            this.y = pos.y;
        }
    }

    collide(collider) {

        if (collider.dead) return false;

        if (dist(collider.x, collider.y, this.x, this.y) < this.radius/2 + collider.radius/2) return true;
    }

    touchingAnotherTown() {

        for (let i = 0; i < towns.length; i++) {
            if (dist(this.targetX, this.targetY, towns[i].x, towns[i].y) < 200) return true;
        }
    }

    destruct() {

        let index = caravans.indexOf(this);
        if (index != -1) caravans.splice(index, 1);
    }

    display() {

        let opacity = 0;

        for (let i = 0; i < beedles.length; i++) {

            let distance = dist(beedles[i].x, beedles[i].y, this.x, this.y);
            let newOpacity = (beedleVisionRadius-distance)*4;
            opacity = newOpacity > opacity ? newOpacity : opacity;
        }

        if (opacity < 0) return;
        if (opacity > 255) opacity = 255;

        push();

        noStroke();
        fill(245, opacity);
        ellipse(this.x, this.y, this.radius+4);

        noFill();
        strokeWeight(1.5);
        stroke(0, 0, 0, opacity);
        ellipse(this.x, this.y, this.radius);
        let healthColour = color("#D78471");
        healthColour.setAlpha(opacity);
        stroke(healthColour);
        let degree = this.hitpoints/this.maxHitpoints*360;
        if (degree >= 360) ellipse(this.x, this.y, this.radius);
        else arc(this.x, this.y, this.radius, this.radius, -90+(360-degree), -90);
        image(caravanTints[int(opacity/10)], this.x+5, this.y, this.radius*1.5, this.radius*1.5);

        pop();
    }
}