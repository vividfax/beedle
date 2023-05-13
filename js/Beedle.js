class Beedle {

    constructor(x, y, index) {

        this.x = x;
        this.y = y;
        this.radius = 20;

        this.targets = [];

        this.velocity = 1;
        this.moved = false;
        this.visiting;

        this.beedleLineColour = beedleLineColours[index];

        this.trading = false;
        this.tradingWith;
        this.newTrade = false;
        this.tradingTimer = 60*1.5;
        if (index == 0) this.tradingTimer = 0;
    }

    update() {

        this.moved = false;

        if (this.velocity < 1) {
            this.velocity += 0.002;
        }
        for (let i = 0; i < towns.length; i++) {
            if (this.checkProximity(towns[i].x, towns[i].y, this.radius/2 + towns[i].radius/2)) {

                // if (this.isCarryingRare) {
                //     score += 20 * this.rareCount;
                //     this.rareCount = 0;
                //     this.isCarryingRare = false;
                // }
                this.velocity = 1;

                // if (this.inventory[towns[i].resource] > 0) {
                //     score += this.inventory[towns[i].resource];
                //     this.inventory[towns[i].resource] = 0;
                // }

                for (let [key, value] of Object.entries(player.inventory)) {
                    if (value > 0 && (towns[i].inventory[key.toString()] < 100 || key.toString() == "gems")) {

                        towns[i].inventory[key.toString()] ++;
                        score++;
                        player.inventory[key.toString()]--;
                        player.lifetimeDelivery[key.toString()]++;

                        if (key.toString() == "gems") score += 4;
                    }
                }
            }
        }

        for (let i = 0; i < loots.length; i++) {
            if (this.checkProximity(loots[i].x, loots[i].y, this.radius/2 + loots[i].radius)) {

                player.addToinventory(loots[i].type);
                loots[i].destruct();
            }
        }

        if (this.trading && this.tradingTimer > 60*6) {
            this.trading = false;
            this.tradingTimer = 0;
            this.move();
        } else if (this.trading && this.tradingTimer > 60*1.5) {
            this.tradingWith = -1;
            this.tradingTimer++;
            this.move();
        } else if (this.trading) {
            this.tradingTimer++;
            if (random() < 0.1) {
                let keys = Object.keys(player.inventory);
                let randomResource = keys[Math.floor(Math.random() * keys.length)];
                if (player.inventory[randomResource.toString()] > 0) {
                    if (randomResource == "gems" && this.tradingWith.inventory[randomResource.toString()] >= 5) {
                        // do nothing
                    } else if (this.tradingWith.inventory[randomResource.toString()] >= maxResourceCarry) {
                        // do nothing
                    } else {
                        player.inventory[randomResource.toString()]--;
                        player.lifetimeDelivery[randomResource.toString()]++;
                        score += randomResource.toString() == "gems" ? 5 : 1;
                    }
                }
            }
        } else {
            this.move();
        }

        if (this.targets.length == 0) return;

        if (dist(this.targets[0].x, this.targets[0].y, this.x, this.y) < 1) {
            this.targets.shift();
        }
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < this.radius/2 + collider.radius/2) return true;
    }

    checkProximity(x, y, distance) {

        if (dist(x, y, this.x, this.y) < distance) {
            return true;
        } else {
            return false;
        }
    }

    move() {

        if (this.targets.length == 0) return;

        let target = this.targets[0];

        this.velocity = 1;

        // for (let i = 0; i < adventurers.length; i++) {
        //     if (this.collide(adventurers[i])) {
        //         this.velocity = 0.2;
        //         break;
        //     }
        // }

        for (let i = 0; i < monsters.length; i++) {
            if (this.collide(monsters[i])) {
                this.velocity = 0.2;
                break;
            }
        }

        this.moved = true;

        let pos = createVector(this.x, this.y);
        let targetPos = createVector(target.x - this.x, target.y - this.y);

        if (dist(target.x, target.y, this.x, this.y) > 1) {

            targetPos.normalize().mult(this.velocity);
            pos.add(targetPos);

            this.x = pos.x;
            this.y = pos.y;
        }
    }

    display() {

        image(playerImage, this.x, this.y, 750 * 0.1, 650 * 0.1);
    }

    displayLine() {

        push();
        stroke(this.beedleLineColour);

        if (this.targets.length > 0) {

            let previousTarget = this;
            let lineWeight = 3;

            for (let i = 0; i < this.targets.length; i++) {

                if (this.targets[i].visualLineWeight < lineWeight) {
                    this.targets[i].visualLineWeight += lineWeight/50;
                } else if (this.targets[i].visualLineWeight > lineWeight+0.1) {
                    this.targets[i].visualLineWeight -= 0.1;
                }

                let weight = this.targets[i].visualLineWeight;
                if (weight <= 0.1) break;

                strokeWeight(weight);
                myCanvas.drawingContext.setLineDash([8, 8]);
                line(this.targets[i].x, this.targets[i].y, previousTarget.x, previousTarget.y);
                previousTarget = this.targets[i];
                lineWeight -= 0.5;
                if (lineWeight <= 0.5) lineWeight = 0;
            }
        }
        myCanvas.drawingContext.setLineDash([]);
        pop();
    }
}