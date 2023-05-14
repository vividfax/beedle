let bigBadCount = 0;
let bigBadMax = 3;

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

        this.radius = this.bigBad ? 40 : 15;
        this.speed = 0.8 - this.radius/100;
        this.velocityX = random(-this.speed, this.speed);
        this.velocityY = random(-this.speed, this.speed);

        this.maxHitpoints = this.radius*2;
        this.hitpoints = this.maxHitpoints;
        this.dead = false;
        this.visible = false;
    }

    update() {

        if (this.dead) return;

        let inFight = false;

        for (let i = 0; i < adventurers.length; i++) {
            if (this.collide(adventurers[i])) {
                if (!inFight) inFight = true;
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
            }
        }

        for (let i = 0; i < animals.length; i++) {
            if (this.collide(animals[i])) {
                if (!inFight) inFight = true;
                break;
            }
        }

        if (!inFight) {
            this.move();
            this.eat();
            // if (this.hitpoints < this.maxHitpoints) this.hitpoints += 0.1;
        }
    }

    move() {

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
                this.hitpoints++;
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

        stroke(0, 0, 0, opacity/2);
        fill(50, opacity);
        ellipse(this.x, this.y, this.radius);

        pop();
    }
}
