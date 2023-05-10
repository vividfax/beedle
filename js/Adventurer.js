let maxRare = 2;
let rareCount = 0;

let maxResourceCarry = 8;

class Adventurer {

    constructor(number) {

        this.number = number;
        this.checkpoint = random(towns);
        this.init(true);
    }

    init(fresh) {

        if (!fresh) {
            this.x = this.checkpoint.x;
            this.y = this.checkpoint.y;
        } else {
            this.edgePadding = 100;
            this.x = random(this.edgePadding+inventoryWidth, width-this.edgePadding);
            this.y = random(this.edgePadding, height-this.edgePadding);
        }

        this.speed = 1;
        this.velocityX = random(-this.speed, this.speed);
        this.velocityY = random(-this.speed, this.speed);

        this.radius = 30;

        this.isCarrying = false;
        this.isRare = false;

        this.passingThroughTown = false;

        this.maxHitpoints = 60;
        this.hitpoints = random(this.maxHitpoints/2, this.maxHitpoints);
        this.dead = false;

        this.timeBetweenDrops = 0;
        this.mined = false;
        this.fought = false;

        if (fresh) this.inventory = {
            stone: int(random(maxResourceCarry)),
            wood: int(random(maxResourceCarry)),
            bones: int(random(maxResourceCarry)),
            food: int(random(maxResourceCarry)),
            gems: int(random(5)),
        };
        else this.inventory = {
            stone: 0,
            wood: 0,
            bones: 0,
            food: 0,
            gems: 0,
        }

        this.headingHome = false;
        this.headingTo = 0;

        this.carryingBeetle = false;
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

        if (this.carryingBeetle && score >= 50) {
            for (let i = 0; i < beedles.length; i++) {
                if (this.checkProximity(beedles[i].x, beedles[i].y, this.radius/2 + player.radius/2)) {
                    this.carryingBeetle = false;
                    wildBeetleCount--;
                    compendium.unlockBeetle();
                    beetleScoreCount++;
                    buyingBeetleDebt += 50;
                    beedles.push(new Beedle(beedles[i].x, beedles[i].y));
                    break;
                }
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
                    if (value > 0 && key.toString() != "food") {
                        towns[i].inventory[key.toString()] += value;
                        this.inventory[key.toString()] = 0;
                    }
                }

                if (this.inventory.food < maxResourceCarry) this.inventory.food++;

                if (this.carryingBeetle) {
                    this.carryingBeetle = false;
                    wildBeetleCount--;
                }

                if (this.hitpoints < this.maxHitpoints) this.hitpoints = this.maxHitpoints;
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

        for (let i = 0; i < animals.length; i++) {
            if (this.collide(animals[i])) {
                if (!inFight) inFight = true;
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

            if (!this.headingHome && !this.passingThroughTown && this.inventory.gems >= 5) {
                this.headingHome = true;
                this.headingTo = this.getClosestTown();
            } else if (this.headingHome && this.passingThroughTown) {
                this.headingHome = false;
            }
            this.move();
            // if (this.hitpoints < this.maxHitpoints) this.hitpoints += 0.5;
            this.harvest();
            this.collect();
            this.eat();

            if (!this.carryingBeetle && wildBeetleCount < 1 && beetleUnlocked && score > 50 && random() < 0.001) {
                this.carryingBeetle = true;
                wildBeetleCount++;
            }
        }

        this.hover();
    }

    move() {

        if (this.headingHome) {

            let direction = createVector(this.headingTo.x - this.x, this.headingTo.y - this.y);
            direction.normalize();
            direction.mult(this.speed);

            this.x += direction.x;
            this.y += direction.y;

            return;
        }

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

                    if (this.inventory.stone < maxResourceCarry) {
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

                    if (this.inventory.wood < maxResourceCarry) {
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

            if (!this.collide(loots[i])) continue;

            if (this.collectResource(i, this.inventory.gems, "gems", 5)) continue;
            else if (this.collectResource(i, this.inventory.wood, "wood", maxResourceCarry)) continue;
            else if (this.collectResource(i, this.inventory.stone, "stone", maxResourceCarry)) continue;
            else if (this.collectResource(i, this.inventory.bones, "bones", maxResourceCarry)) continue;
            else if (this.collectResource(i, this.inventory.food, "food", maxResourceCarry)) continue;
        }
    }

    collectResource(i, resourceCount, resourceAsString, maxCarry) {

        if (resourceCount < maxCarry && loots[i].type == resourceAsString) {
            this.inventory[resourceAsString]++;
            loots[i].destruct();
            return true;
        }
    }

    eat() {

        if (this.hitpoints < this.maxHitpoints && this.inventory.food > 0) {
            this.hitpoints += 3;
            this.inventory.food--;
            return true;
        }
    }

    dropAll() {

        let offset = 15;
        loots.push(new Loot(this.x+random(-offset, offset), this.y+random(-offset, offset), "bones"));

        for (let [key, value] of Object.entries(this.inventory)) {
            for (let i = 0; i < value; i++) {
                if (key.toString() == "food") continue;
                loots.push(new Loot(this.x+random(-offset, offset), this.y+random(-offset, offset), key.toString()));
            }
        }

        if (this.carryingBeetle) {
            this.carryingBeetle = false;
            wildBeetleCount--;
        }
    }

    getClosestTown() {

        let shortestDist = -1;
        let closestTown = -1;

        for (let i = 0; i < towns.length; i++) {

            let distance = dist(this.x, this.y, towns[i].x, towns[i].y);

            if (shortestDist == -1 || distance < shortestDist) {
                shortestDist = distance;
                closestTown = towns[i];
            }
        }

        return closestTown;
    }

    hover() {

        if(dist(mouseX, mouseY, this.x, this.y) < this.radius/2) popupSelected = this;
    }

    display() {

        if (this.dead) return;

        push();

        if (this.carryingBeetle) {
            let borderWeight = sin(frameCount*3)*3 + 4;
            stroke("#FFE600");
            strokeWeight(borderWeight);
            ellipse(this.x, this.y, this.radius+borderWeight);
        }

        image(adventurerImages[this.number], this.x, this.y, this.radius, this.radius);

        pop();
    }
}
