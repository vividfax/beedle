let beetlePatternSize = 150;
let beetlePatternSet = ["circles", "circlePack", "stripesV", "stripesH", "circles", "circlePack", "circles", "stripesH"];

let questDescriptions = [
    "Hoard coins\n$/50",
    "Sell wood\n$/500",
    "Sell stone\n$/200",
    "Sell bones\n$/50",
    "Hoard coins\n$/250",
    "Hoard gems\n$/10",
    "Hoard coins\n$/1500",
    "Sell food\n$/150",
];

class BeetleGen {

    constructor(x, y, radius, index) {

        this.x = x;
        this.y = y;
        this.radius = radius;

        this.palette = {
            white: color(random(222, 255), random(222, 255), random(222, 255)),
            light: color(random(110, 230), random(110, 230), random(110, 230)),
            mid: color(random(0, 200), random(0, 200), random(0, 200)),
            dark: color(random(0, 110), random(0, 110), random(0, 110)),
            black: color(random(30, 60), random(30, 60), random(30, 60)),
        };
        this.bodyColour = random([this.palette.mid, this.palette.dark]);
        this.legColour = random([this.palette.mid, this.palette.dark, this.palette.black]);
        while(this.bodyColour == this.legColour) this.legColour = random([this.palette.mid, this.palette.dark, this.palette.black]);

        this.image = createGraphics(this.radius, this.radius);
        this.transparentImage = createGraphics(this.radius, this.radius);
        this.pattern = createGraphics(beetlePatternSize, beetlePatternSize);
        this.wingShape = createGraphics(beetlePatternSize, beetlePatternSize);

        this.wingsVectors = [random(180, 250), random(180, 210)];
        this.bodyVectors = [random(100, 140), random(250, 280), random(150, 180), random(180, 220)];

        this.createPattern(index);
        this.createWingShape();

        this.image.translate(this.image.width/2, this.image.height/2);
        this.image.scale(1/beetlePatternSize/6 * this.radius*0.95)
        this.displayAntenna();
        this.displayLegs();
        this.displayBody();
        this.displayWings();

        this.transparentImage.tint(0, 30);
        this.transparentImage.image(this.image, 0, 0);

        this.index = index;
        this.unlocked = false;
        this.caught = false;
        this.description = questDescriptions[index];
        this.number = -1;
    }

    update() {

        if (this.caught) return;

        this.unlocked = false;

        if (this.index == 0) {
            if (score >= 50) this.unlocked = true;
        } else if (this.index == 1) {
            if (player.lifetimeDelivery.wood >= 500) this.unlocked = true;
        } else if (this.index == 2) {
            if (player.lifetimeDelivery.stone >= 200) this.unlocked = true;
        } else if (this.index == 3) {
            if (player.lifetimeDelivery.bones >= 50) this.unlocked = true;
        } else if (this.index == 4) {
            if (score >= 250) this.unlocked = true;
        } else if (this.index == 5) {
            if (player.inventory.gems >= 10) this.unlocked = true;
        } else if (this.index == 6) {
            if (score >= 1500) this.unlocked = true;
        } else if (this.index == 7) {
            if (player.lifetimeDelivery.food >= 150) this.unlocked = true;
        }

        if (this.unlocked && !this.caught && !beetleUnlocked) beetleUnlocked = true;
    }

    display() {

        push();
        translate(this.x, this.y);

        if (this.caught) {
            textFont(beetleDescriptionFont);
            textSize(30);
            textLeading(30);
            noStroke();
            fill(0, 100);
            text(this.number, 0, this.radius/4+5);

            image(this.transparentImage, 1, 1, this.radius, this.radius);
            image(this.image, 0, 0, this.radius, this.radius);
        }
        else {

            image(this.transparentImage, 0, 0, this.radius, this.radius);

            let description = this.description;

            if (this.index == 0) {
                description = description.replace("$", score);
            } else if (this.index == 1) {
                description = description.replace("$", player.lifetimeDelivery.wood);
            } else if (this.index == 2) {
                description = description.replace("$", player.lifetimeDelivery.stone);
            } else if (this.index == 3) {
                description = description.replace("$", player.lifetimeDelivery.bones);
            } else if (this.index == 4) {
                description = description.replace("$", score);
            } else if (this.index == 5) {
                description = description.replace("$", player.inventory.gems);
            } else if (this.index == 6) {
                description = description.replace("$", score);
            } else if (this.index == 7) {
                description = description.replace("$", player.lifetimeDelivery.food);
            }

            strokeWeight(0.5);
            textFont(beetleDescriptionFont);
            textSize(30);
            textLeading(30);

            if (this.unlocked) {
                stroke("#FFE600");
                fill("#FFE600");
                text(description, 1, 1);
            }

            stroke(0, 200);
            fill(0, 200);
            text(description, 0, 0);
        }

        pop();
    }

    createPattern(index) {

        let chosenPattern = beetlePatternSet[index];

        if (chosenPattern == "circles") {
            this.createCircles();
        } else if (chosenPattern == "circlePack") {
            this.createCirclePack();
        } else if (chosenPattern == "stripesV") {
            this.createStripes(true);
        } else if (chosenPattern == "stripesH") {
            this.createStripes(false);
        }
    }

    createCircles() {

        let w = beetlePatternSize;
        let h = beetlePatternSize;

        this.pattern.background(this.palette.dark);
        this.pattern.noStroke();

        for (let i = 0; i < 200; i++) {
            this.pattern.fill(this.palette.light);
            this.pattern.ellipse(random(w), random(h), random(120/6, 200/6), random(120/6, 200/6));
            this.pattern.fill(this.palette.dark);
            this.pattern.ellipse(random(w), random(h), random(120/6, 200/6), random(120/6, 200/6));
            this.pattern.fill(this.palette.mid);
            this.pattern.ellipse(random(w), random(h), random(120/6, 200/6), random(120/6, 200/6));
        }

        for (let i = 0; i < 200; i++) {
            this.pattern.fill(this.bodyColour);
            this.pattern.ellipse(random(w), random(h), random(4/6, 15/6));
        }
    }

    createCirclePack() {

        let circlePackCircles = [];

        this.pattern.background(this.palette.mid);
        this.pattern.noStroke();

        for (let i = 0; i < 200; i++) {
            this.pattern.fill(this.palette.mid);
            this.pattern.ellipse(random(beetlePatternSize), random(beetlePatternSize), random(120, 200)/6, random(120, 200)/6);
            this.pattern.fill(this.palette.dark);
            this.pattern.ellipse(random(beetlePatternSize), random(beetlePatternSize), random(120, 200)/6, random(120, 200)/6);
        }

        for (let i = 0; i < 20; i++) {
            circlePackCircles.push(new CirclePack(beetlePatternSize, beetlePatternSize, this.palette, this.pattern));
        }

        for (let i = 0; i <= int(200/6); i++) {
            for (let j = 0; j < circlePackCircles.length; j++) {
                circlePackCircles[j].grow(circlePackCircles);

                if (i == int(200/6)) circlePackCircles[j].display();
            }
        }
    }

    createStripes(vertical) {

        this.pattern.background(this.palette.mid);
        this.pattern.noStroke();

        if (vertical) {

            let stripeCount = int(random(6, 10));
            let stripeThickness = random(0, 50)/6;

            for (let i = 0; i <= beetlePatternSize; i+=beetlePatternSize/stripeCount) {
                for (let j = 0; j <= beetlePatternSize; j+=10/6) {
                    this.pattern.fill(this.palette.white);
                    this.pattern.ellipse(i+random(-2, 2)/6, j+random(-2, 2)/6, random(stripeThickness, stripeThickness+50/6));
                }
            }

            for (let i = 0; i <= beetlePatternSize; i+=beetlePatternSize/stripeCount) {
                for (let j = 0; j <= beetlePatternSize; j+=10/6) {
                    this.pattern.fill(this.palette.dark);
                    this.pattern.ellipse(i+random(-2, 2)/6, j+random(-2, 2)/6, random(stripeThickness/2, stripeThickness/2+20/6));
                }
            }
        } else {

            let stripeCount = int(random(2, 4));
            let stripeThickness = random(50, 100)/6;

            for (let i = 0; i <= beetlePatternSize; i+=30/6) {
                for (let j = 0; j <= beetlePatternSize; j+=beetlePatternSize/stripeCount) {
                    this.pattern.fill(this.palette.white);
                    this.pattern.ellipse(i+random(-2, 2)/6, j+random(-2, 2)/6, random(stripeThickness, stripeThickness+50/6));
                }
            }

            for (let i = 0; i <= beetlePatternSize; i+=30/6) {
                for (let j = 0; j <= beetlePatternSize; j+=beetlePatternSize/stripeCount) {
                    this.pattern.fill(this.palette.dark);
                    this.pattern.ellipse(i+random(-2, 2)/6, j+random(-2, 2)/6, random(60/6));
                }
            }
        }
    }

    createWingShape() {

        let w = beetlePatternSize;
        let h = beetlePatternSize;

        this.wingShape.fill(this.legColour);
        this.wingShape.noStroke();
        this.wingShape.rectMode(CENTER);
        this.wingShape.rect(w/2, h/2, w/2, h, random(80/6, 150/6), random(10/6, 30/6), random(10/6, 50/6), 500/6);
    }

    displayAntenna() {

        this.image.noFill();
        this.image.stroke(this.legColour);
        this.image.strokeWeight(10);

        let antenna = [-random(0, 50), -random(50, 150), -random(50, 150), -random(50, 180), -random(50, 180), -random(150, 200)];

        this.image.push();
        this.image.translate(-20, -120);
        this.image.bezier(0, 0, antenna[0], antenna[1], antenna[2], antenna[3], antenna[4], antenna[5]);
        this.image.pop();

        this.image.push();
        this.image.scale(-1, 1);
        this.image.translate(-20, -120);
        this.image.bezier(0, 0, antenna[0], antenna[1], antenna[2], antenna[3], antenna[4], antenna[5]);
        this.image.pop();
    }

    displayLegs() {

        stroke(this.legColour);

        let topLegs = [random(40, 60), random(10, 20), random(60, 80), random(70, 90), random(110, 140), random(90, 130)];

        this.image.push();
        this.image.translate(-70, -60);
        this.image.strokeWeight(20);
        this.image.line(0, 0, -topLegs[0], -topLegs[1]);
        this.image.strokeWeight(15);
        this.image.line(-topLegs[0], -topLegs[1], -topLegs[2], -topLegs[3]);
        this.image.strokeWeight(10);
        this.image.line(-topLegs[2], -topLegs[3], -topLegs[4], -topLegs[5]);
        this.image.pop();

        this.image.push();
        this.image.scale(-1, 1);
        this.image.translate(-70, -60);
        this.image.strokeWeight(20);
        this.image.line(0, 0, -topLegs[0], -topLegs[1]);
        this.image.strokeWeight(15);
        this.image.line(-topLegs[0], -topLegs[1], -topLegs[2], -topLegs[3]);
        this.image.strokeWeight(10);
        this.image.line(-topLegs[2], -topLegs[3], -topLegs[4], -topLegs[5]);
        this.image.pop();

        let middleLegs = [random(30, 50), random(0, 10), random(80, 100), random(60, 90), random(130, 150), random(100, 120)];

        this.image.push();
        this.image.translate(-90, 0);
        this.image.strokeWeight(20);
        this.image.line(0, 0, -middleLegs[0], middleLegs[1]);
        this.image.strokeWeight(15);
        this.image.line(-middleLegs[0], middleLegs[1], -middleLegs[2], middleLegs[3]);
        this.image.strokeWeight(10);
        this.image.line(-middleLegs[2], middleLegs[3], -middleLegs[4], middleLegs[5]);
        this.image.pop();

        this.image.push();
        this.image.scale(-1, 1);
        this.image.translate(-90, 0);
        this.image.strokeWeight(20);
        this.image.line(0, 0, -middleLegs[0], middleLegs[1]);
        this.image.strokeWeight(15);
        this.image.line(-middleLegs[0], middleLegs[1], -middleLegs[2], middleLegs[3]);
        this.image.strokeWeight(10);
        this.image.line(-middleLegs[2], middleLegs[3], -middleLegs[4], middleLegs[5]);
        this.image.pop();

        let bottomLegs = [random(20, 40), random(10, 30), random(20, 40), random(100, 130), random(50, 70), random(140, 170)];

        this.image.push();
        this.image.translate(-90, 80);
        this.image.strokeWeight(20);
        this.image.line(0, 0, -bottomLegs[0], bottomLegs[1]);
        this.image.strokeWeight(15);
        this.image.line(-bottomLegs[0], bottomLegs[1], -bottomLegs[2], bottomLegs[3]);
        this.image.strokeWeight(10);
        this.image.line(-bottomLegs[2], bottomLegs[3], -bottomLegs[4], bottomLegs[5]);
        this.image.pop();

        this.image.push();
        this.image.scale(-1, 1)
        this.image.translate(-90, 80);
        this.image.strokeWeight(20);
        this.image.line(0, 0, -bottomLegs[0], bottomLegs[1]);
        this.image.strokeWeight(15);
        this.image.line(-bottomLegs[0], bottomLegs[1], -bottomLegs[2], bottomLegs[3]);
        this.image.strokeWeight(10);
        this.image.line(-bottomLegs[2], bottomLegs[3], -bottomLegs[4], bottomLegs[5]);
        this.image.pop();
    }

    displayBody() {

        this.image.push();
        this.image.rectMode(CENTER);
        this.image.noStroke();
        this.image.stroke(this.legColour);
        this.image.strokeWeight(2);
        this.image.fill(this.bodyColour);
        this.image.rect(0, 0, this.bodyVectors[0], this.bodyVectors[1], 50);
        this.image.fill(this.bodyColour);
        this.image.rect(0, 0, this.bodyVectors[2], this.bodyVectors[3], 50);
        this.image.pop();
    }

    displayWings() {

        let wingPattern = this.pattern.get();
        wingPattern.mask(this.wingShape);
        this.image.imageMode(CENTER);

        let wingWidth = this.wingsVectors[1];

        this.image.image(this.wingShape, -wingWidth/4, -height/size/2 + height/size/5*3, wingWidth+4, this.wingsVectors[0]+4);
        this.image.image(wingPattern, -wingWidth/4, -height/size/2 + height/size/5*3, wingWidth-4, this.wingsVectors[0]);
        this.image.scale(-1, 1);
        this.image.image(this.wingShape, -(wingWidth/4), -height/size/2 + height/size/5*3, wingWidth+4, this.wingsVectors[0]+4);
        this.image.image(wingPattern, -(wingWidth/4), -height/size/2 + height/size/5*3, wingWidth-4, this.wingsVectors[0]);
    }
}

class CirclePack {

    constructor(w, h, palette, pattern) {

        this.x = random(w);
        this.y = random(h);

        this.radius = 0;

        this.palette = palette;
        this.pattern = pattern;
    }

    grow(circlePackCircles) {

        let grow = true;

        for (let i = 0; i < circlePackCircles.length; i++) {

            if (this == circlePackCircles[i]) continue;

            if (dist(this.x, this.y, circlePackCircles[i].x, circlePackCircles[i].y) < this.radius/2 + circlePackCircles[i].radius/2) {
            grow = false;
            }
        }

        if (grow) this.radius++;
    }

    display() {

        this.pattern.push();
        this.pattern.stroke(this.palette.light);
        this.pattern.strokeWeight(this.radius/8);
        this.pattern.fill(this.palette.dark);
        this.pattern.ellipse(this.x, this.y, this.radius);
        this.pattern.pop();
    }
}