let maxRare = 2;
let rareCount = 0;

class Adventurer {

    constructor(number) {

        this.number = number;
        this.checkpoint = random(towns);
        this.init(true);
    }

    init(fresh) {

        this.edgePadding = 200;
        this.x = random(this.edgePadding, width-this.edgePadding);
        this.y = random(this.edgePadding, height-this.edgePadding);

        this.speed = 1;
        this.velocityX = random(-this.speed, this.speed);
        this.velocityY = random(-this.speed, this.speed);

        this.radius = 30;

        this.isCarrying = false;
        this.isRare = false;

        this.passingThroughTown = false;

        this.maxHitpoints = 60;
        this.hitpoints = this.maxHitpoints;
        this.dead = false;

        this.timeBetweenDrops = 0;
        this.mined = false;
        this.fought = false;

        if (fresh) this.inventory = {
            stone: int(random(10)),
            wood: int(random(10)),
            bones: int(random(10)),
            gems: int(random(5)),
        };
        else this.inventory = {
            stone: 0,
            wood: 0,
            bones: 0,
            gems: 0,
        }
    }

    update() {

        if (this.dead) return;

        if (this.velocity < 1) {
            this.velocity += 0.001;
        }

        // for (let i = 0; i < loots.length; i++) {
        //     if (this.checkProximity(loots[i].x, loots[i].y, this.radius/2 + loots[i].radius/2)) {

        //         this.isCarrying = true;
        //         loots[i].respawn();

        //         if (!this.isRare && random(50) < 1 && rareCount < maxRare) {
        //             this.isRare = true;
        //             rareCount++;
        //         }
        //     }
        // }
        if (this.checkProximity(player.x, player.y, this.radius/2 + player.radius/2)) {

            if (this.isRare && this.isCarrying) {
                this.isCarrying = false;
                this.isRare = false;
                rareCount--;
                player.isCarryingRare = true;
                player.rareCount++;

            } else if (this.isCarrying) {
                player.velocity = 0.1;
                this.isCarrying = false;
                player.isCarryingRare = false;
                player.rareCount = 0;

                // player.addToinventory();
                // player.addToinventory();
            }
        }
        this.passingThroughTown = false;

        for (let i = 0; i < towns.length; i++) {
            if (this.checkProximity(towns[i].x, towns[i].y, this.radius/2 + towns[i].radius/2)) {

                if (this.isCarrying && this.isRare) {
                    this.isRare = false;
                    rareCount--;
                    this.isCarrying = false;
                } else if (this.isCarrying) {
                    this.isCarrying = false;
                }
                this.passingThroughTown = true;

                if (this.mined) this.mined = false;
                if (this.fought) this.fought = false;
                if (this.checkpoint != towns[i]) this.checkpoint = towns[i];

                for (let [key, value] of Object.entries(this.inventory)) {
                    if (value > 0) {
                        towns[i].inventory[key.toString()] += value;
                        this.inventory[key.toString()] = 0;
                    }
                }
            }
        }

        if (this.dead) return;

        let inFight = false;

        for (let i = 0; i < monsters.length; i++) {
            if (this.collide(monsters[i])) {
                if (!inFight) inFight = true;
                monsters[i].hitpoints--;
                if (monsters[i].hitpoints <= 0) this.fought = true;
                break;
            }
        }

        if (this.hitpoints < 0) {
            this.dead = true;
            this.dropAll();
            this.init(false);
            return;
        }

        if (!this.dead && !inFight) {
            this.move();
            if (this.hitpoints < this.maxHitpoints) this.hitpoints += 0.5;

            this.harvest();
            this.collect();
        }

        this.hover();
    }

    move() {

        let pos = createVector(this.x, this.y);

        if (random() < 0.005) {
            this.velocityX = random(-this.speed, this.speed);
            this.velocityY = random(-this.speed, this.speed);
        } else if (random() < 0.0005) {
            this.velocityX = 0;
            this.velocityY = 0;
        }

        let velocity = createVector(this.velocityX, this.velocityY);

        if (this.passingThroughTown) {
            velocity.normalize().mult(0.2);
        }

        pos.add(velocity);

        this.velocityX = velocity.x;
        this.velocityY = velocity.y;

        let edgePadding = 50;

        if ((this.x > width-edgePadding && this.velocityX > 0) || (this.x < edgePadding && this.velocityX < 0)) {
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

    checkProximity(x, y, distance) {

        if (dist(x, y, this.x, this.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    harvest() {

        for (let i = 0; i < mountains.length; i++) {

            if (this.collide(mountains[i])) {
                if (!this.mined) this.mined = true;
                this.timeBetweenDrops++;

                if (this.timeBetweenDrops > 200) {

                    if (this.inventory.stone < 10) {
                        this.inventory.stone++;
                    } else {
                        let radius = 10;
                        loots.push(new Loot(this.x + random(-radius, radius), this.y + random(-radius, radius), "stone"));
                    }

                    if (this.inventory.gems < 5 && random() < 0.1) this.inventory.gems++;

                    this.timeBetweenDrops = 0;
                }
            }
        }

        for (let i = 0; i < forests.length; i++) {

            if (this.collide(forests[i])) {
                this.timeBetweenDrops++;

                if (this.timeBetweenDrops > 200) {

                    if (this.inventory.wood < 10) {
                        this.inventory.wood++;
                    } else {
                        let radius = 10;
                        loots.push(new Loot(this.x + random(-radius, radius), this.y + random(-radius, radius), "wood"));
                    }

                    this.timeBetweenDrops = 0;
                }
            }

        }
    }

    collect() {

        for (let i = loots.length-1; i >= 0; i--) {

            if (!this.collide(loots[i])) return;

            if (this.collectResource(i, this.inventory.gems, "gems", 5)) return;
            else if (this.collectResource(i, this.inventory.wood, "wood", 10)) return;
            else if (this.collectResource(i, this.inventory.stone, "stone", 10)) return;
            else if (this.collectResource(i, this.inventory.bones, "bones", 10)) return;
        }
    }

    collectResource(i, resourceCount, resourceAsString, maxCarry) {

        if (resourceCount < maxCarry && loots[i].type == resourceAsString) {
            this.inventory[resourceAsString]++;
            loots[i].destruct();
            return true;
        }
    }

    dropAll() {

        let offset = 15;
        loots.push(new Loot(this.x+random(-offset, offset), this.y+random(-offset, offset), "bones"));

        for (let [key, value] of Object.entries(this.inventory)) {
            for (let i = 0; i < value; i++) {
                loots.push(new Loot(this.x+random(-offset, offset), this.y+random(-offset, offset), key.toString()));
            }
        }
    }

    hover() {

        if(dist(mouseX, mouseY, this.x, this.y) < this.radius/2) popupSelected = this;
    }

    display() {

        if (this.dead) return;

        push();

        stroke("#fff");

        if (this.isRare && this.isCarrying) {
            fill("#FFE600");
        } else if (this.isCarrying) {
            fill("#BF4A4A");
        } else {
            fill("#aaa");
        }
        ellipse(this.x, this.y, this.radius);

        image(adventurerImages[this.number], this.x, this.y, this.radius, this.radius);

        pop();
    }
}
