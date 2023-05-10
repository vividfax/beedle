class Animal {

    constructor() {

        this.init();
    }

    init() {

        this.edgePadding = 100;
        this.x = random(this.edgePadding+inventoryWidth, width-this.edgePadding);
        this.y = random(this.edgePadding, height-this.edgePadding);

        this.radius = 10;
        this.speed = 0.2;
        this.velocityX = random(-this.speed, this.speed);
        this.velocityY = random(-this.speed, this.speed);

        this.maxHitpoints = 50;
        this.hitpoints = this.maxHitpoints;
        this.dead = false;
    }

    update() {

        if (this.dead) return;

        for (let i = 0; i < towns.length; i++) {
            if (this.collide(towns[i])) {
                this.init();
                return;
            }
        }

        let inFight = false;

        for (let i = 0; i < adventurers.length; i++) {
            if (this.collide(adventurers[i])) {
                if (!inFight) inFight = true;

                this.hitpoints--;

                if (this.hitpoints < 0) {
                    this.dead = true;
                    loots.push(new Loot(this.x, this.y, "food"));
                    this.init();
                    return;
                }
            }
        }

        for (let i = 0; i < monsters.length; i++) {
            if (this.collide(monsters[i])) {
                if (!inFight) inFight = true;

                this.hitpoints--;

                if (this.hitpoints < 0) {
                    this.dead = true;
                    this.init();
                    return;
                }
            }
        }

        if (!inFight) {
            this.move();
        }
    }

    move() {

        let pos = createVector(this.x, this.y);

        if (random() < 0.005) {
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

        noStroke();
        fill(200, 100);
        ellipse(this.x, this.y, this.radius);

        pop();
    }
}