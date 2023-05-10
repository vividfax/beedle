let bigBadCount = 0;
let bigBadMax = 3;

class Monster {

    constructor() {

        this.init();
    }

    init() {

        this.edgePadding = 100;
        this.x = random(this.edgePadding+inventoryWidth, width-this.edgePadding);
        this.y = random(this.edgePadding, height-this.edgePadding);

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
                    if (this.bigBad) bigBadCount--;
                    this.init();
                    return;
                }
            }
        }

        if (!inFight) {
            this.move();
            if (this.hitpoints < this.maxHitpoints) this.hitpoints += 0.05;
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

        let edgePadding = 100;

        if ((this.x > width-edgePadding && this.velocityX > 0) || (this.x < edgePadding+inventoryWidth && this.velocityX < 0)) {
            this.velocityX *= -1;
        }
        if ((this.y > height-edgePadding && this.velocityY > 0) || (this.y < edgePadding && this.velocityY < 0)) {
            this.velocityY *= -1;
        }

        this.x = pos.x;
        this.y = pos.y;
    }

    collide(collider) {

        if (collider.dead) return false;

        if (dist(collider.x, collider.y, this.x, this.y) < this.radius/2 + collider.radius/2) return true;
    }

    display() {

        if (this.dead) return;

        push();

        stroke(0);
        fill(50);
        ellipse(this.x, this.y, this.radius);

        pop();
    }
}
