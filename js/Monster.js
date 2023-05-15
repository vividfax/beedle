let bigBadCount = 0;
let bigBadMax = 0;

class Monster {

    constructor() {

        this.init();
    }

    init() {

        this.edgePadding = 60;
        this.x = random(this.edgePadding, width/size-this.edgePadding-inventoryWidth);
        this.y = random(this.edgePadding, height/size-this.edgePadding);

        this.bigBad = false;
        if (bigBadCount < bigBadMax && random() < 0.3) {
            this.bigBad = true;
            bigBadCount++;
        }

        this.radius = this.bigBad ? 45 : 15;
        this.visualRadius = this.radius;
        this.speed = 0.8 - this.radius/100;
        this.velocityX = random(-this.speed, this.speed);
        this.velocityY = random(-this.speed, this.speed);

        this.maxHitpoints = this.radius*2;
        this.hitpoints = this.maxHitpoints;
        this.healPoints = 0;
        this.dead = false;
        this.visible = false;

        this.inFight = false;
        this.charging = false;
        this.chargeToward = -1;
    }

    update() {

        if (this.dead) return;

        if (this.visualRadius < this.radius) this.visualRadius += 0.5;

        this.inFight = false;

        for (let i = 0; i < adventurers.length; i++) {
            if (this.collide(adventurers[i])) {
                if (!this.inFight) this.inFight = true;
                adventurers[i].hitpoints--;

                if (this.hitpoints < 0) {
                    this.dead = true;
                    loots.push(new Loot(this.x, this.y, "bones"));
                    if (adventurers[i].inventory.gems < 5) adventurers[i].inventory.gems++;
                    if (this.bigBad) {
                        bigBadCount--;

                        for (let j = 0; j < beedles.length; j++) {
                            let distance = dist(beedles[j].x, beedles[j].y, this.x, this.y);
                            if (distance < beedleVisionRadius) {
                                player.epicBattleWitness++;
                                break;
                            }
                        }
                    }
                    this.init();
                    return;
                }
            } else if (!this.charging && dist(this.x, this.y, adventurers[i].x, adventurers[i].y) < this.radius*3) {
                this.charging = true;
                this.chargeToward = {x: adventurers[i].x, y: adventurers[i].y};
            }
        }

        for (let i = 0; i < animals.length; i++) {
            if (this.collide(animals[i])) {
                if (!this.inFight) this.inFight = true;
                break;
            }
        }

        for (let i = 0; i < towns.length; i++) {
            if (this.collide(towns[i])) {

                if (frameCount%20 != 1) break;

                for (let [key, value] of Object.entries(towns[i].inventory)) {
                    if (value > 0) {
                        towns[i].inventory[key.toString()]--;
                    }
                }
                break;
            }
        }

        for (let i = 0; i < caravans.length; i++) {
            if (this.collide(caravans[i])) {
                if (!this.inFight) this.inFight = true;
                this.hitpoints--;

                if (this.hitpoints <= 0) {
                    this.dead = true;
                    loots.push(new Loot(this.x, this.y, "bones"));
                    this.init();
                    return;
                }
            }
        }

        if (this.charging && !this.inFight) {
            this.move();
        } else if (!this.inFight) {
            this.move();
            this.eat();
            if (this.healPoints > 0) {
                this.healPoints -= 0.1;
                this.hitpoints += 0.1;
            }
        }

        if (this.hitpoints > this.maxHitpoints) this.hitpoints = this.maxHitpoints;
    }

    move() {

        if (this.charging && !this.inFight) {

            let target = this.chargeToward;

            this.velocity = 1;

            let pos = createVector(this.x, this.y);
            let targetPos = createVector(target.x - this.x, target.y - this.y);

            if (dist(target.x, target.y, this.x, this.y) > 1) {

                targetPos.normalize().mult(this.velocity);
                pos.add(targetPos);

                this.x = pos.x;
                this.y = pos.y;
            } else {
                this.charging = false;
                this.chargeToward = -1;
            }

            return;
        }

        let pos = createVector(this.x, this.y);

        if (random() < 0.05) {
            this.velocityX = random(-this.speed, this.speed);
            this.velocityY = random(-this.speed, this.speed);
        } else if (random() < 0.001) {
            this.velocityX = 0;
            this.velocityY = 0;
        }

        pos.add(createVector(this.velocityX, this.velocityY));

        let edgePadding = 60;

        if ((this.x > width/size-edgePadding-inventoryWidth && this.velocityX > 0) || (this.x < edgePadding && this.velocityX < 0)) {
            this.velocityX *= -1;
        }
        if ((this.y > height/size-edgePadding && this.velocityY > 0) || (this.y < edgePadding && this.velocityY < 0)) {
            this.velocityY *= -1;
        }

        this.x = pos.x;
        this.y = pos.y;
    }

    eat() {

        for (let i = loots.length-1; i >= 0; i--) {

            if (!this.collide(loots[i])) continue;

            if (loots[i].type == "food") {
                this.healPoints += 3;
                loots[i].destruct();
                return true;
            }
        }
    }

    collide(collider) {

        if (collider.dead) return false;

        if (dist(collider.x, collider.y, this.x, this.y) < this.radius/2 + collider.radius/2) return true;
    }

    display() {

        if (this.dead) return;

        let opacity = 0;

        for (let i = 0; i < beedles.length; i++) {

            let distance = dist(beedles[i].x, beedles[i].y, this.x, this.y);
            let newOpacity = (beedleVisionRadius-distance)*4;
            opacity = newOpacity > opacity ? newOpacity : opacity;
        }

        if (opacity < 0) return;

        push();

        noStroke();
        fill(50, opacity);
        ellipse(this.x, this.y, this.visualRadius+4);

        noFill();
        strokeWeight(1.5);
        let healthColour = color("#95423A");
        healthColour.setAlpha(opacity);
        stroke(healthColour);
        let degree = this.hitpoints/this.maxHitpoints*360;
        if (degree >= 360) ellipse(this.x, this.y, this.visualRadius);
        else arc(this.x, this.y, this.visualRadius, this.visualRadius, -90+(360-degree), -90);

        pop();
    }
}
