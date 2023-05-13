let player;
let targets = [];
let towns = [];
let adventurers = [];
let monsters = [];
let loots = [];
let mountains = [];
let forests = [];
let animals = [];
let shouts = [];

let score = 0;
let buyingBeetleDebt = 0;

let myCanvas;
let mapLayer;
let mapCutoutLayer;
let compendiumPaperLayer;
let fogLayer;
let fogMask;
let fogCircles = [];

let screenWidth = 2560/2-10;
let screenHeight = 1406/2-10;
let inventoryWidth = 100;

let lootImages = {};
let adventurerImages = [];
let coinImage;
let playerImage;
let deathShoutImage;
let beetleShoutImage;

let popupSelected;
let popupBoxLayer;
let popupBoxLayer2;
let newPopupRequired;

let wildBeetleCount = 0;
let beetleScoreCount = 0;

let beedles = [];

let compendium;
let compendiumVisible = false;
let needToCheckCompendium = false;

let beetleDescriptionFont;
let cartoonFont;
let targetCrossFont;

let beetleUnlocked = false;

let size;

let beedleVisionRadius = 150;

// https://coolors.co/ff96ee-ffabab-ffbc74-7af587-7df8d7-88c5ff-9580ff-bc88ff
// https://coolors.co/ffdada-c4ffd1-c9e5ff-cac4ff
let beedleLineColours = ["#FF96EE", "#FFABAB", "#FFBC74", "#7AF587", "#7DF8D7", "#88C5FF", "#9580FF", "#BC88FF", "#FFDADA", "#C4FFD1", "#C9E5FF", "#CAC4FF"];

function preload() {

    lootImages.stone = loadImage("./images/Stone.png");
    lootImages.wood = loadImage("./images/Wood.png");
    lootImages.bones = loadImage("./images/Skull.png");
    lootImages.gems = loadImage("./images/Crystal.png");
    lootImages.food = loadImage("./images/Meat.png");

    for (let i = 0; i < 12; i++) {
        adventurerImages.push(loadImage("./images/hero" + i + ".png"));
    }

    coinImage = loadImage("./images/Coin.png");
    beetleImage = loadImage("./images/beetle.png");
    castleImage = loadImage("./images/castle.png");
    playerImage = loadImage("./images/beedle.png");
    deathShoutImage = loadImage("./images/death-shout.png")
    beetleShoutImage = loadImage("./images/beetle-shout.png")

    beetleDescriptionFont = loadFont("./fonts/Allura-Regular.ttf");
    cartoonFont = loadFont("./fonts/ConcertOne-Regular.ttf");
    targetCrossFont = loadFont("./fonts/ArchitectsDaughter-Regular.ttf");
}

function setup() {

    let sizeX = 1/screenWidth*(windowWidth-20);
    let sizeY = 1/screenHeight*(windowHeight-20);
    let x = sizeX < sizeY ? screenWidth*sizeX : screenWidth*sizeY;
    let y = sizeX < sizeY ? screenHeight*sizeX : screenHeight*sizeY;
    x = int(x);
    y = int(y);

    if (windowWidth < screenWidth || windowHeight < screenHeight) {
        x = screenWidth;
        y = screenHeight;
    }

    myCanvas = createCanvas(x, y);
    size = 1/screenWidth*width;
    angleMode(DEGREES);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    canvas.addEventListener('contextmenu', event => event.preventDefault());

    player = new Player(width/size/2-inventoryWidth/2, height/size/2);
    shuffle(beedleLineColours, true);

    for (let i = 0; i < 1; i++) {
        beedles.push(new Beedle(width/size/2-inventoryWidth/2, height/size/2, i));
    }

    for (let i = 0; i < 3; i++) {
        towns.push(new Town(i));
    }

    for (let i = 0; i < 5; i++) {
        adventurers.push(new Adventurer(i));
    }

    for (let i = 0; i < 17; i++) {
        monsters.push(new Monster());
    }

    for (let i = 0; i < 45; i++) {
        animals.push(new Animal());
    }

    compendium = new Compendium();

    createBackground();
    createTerrain();
    createMapCutout();
    createFog();

    createPopupBox();

    for (let i = 0; i < 700; i++) draw();
}

function draw() {

    hoverOverInventory();

    update();
    display();
}

function update() {

    if (compendiumVisible) return;

    popupSelected = 0;

    player.update();

    for (let i = 0; i < adventurers.length; i++) {
        adventurers[i].update();
    }

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].update();
    }

    for (let i = 0; i < animals.length; i++) {
        animals[i].update();
    }

    for (let i = 0; i < towns.length; i++) {

        towns[i].update();
        towns[i].checkVisiting(player);

        if (towns[i].visiting) {
            player.velocity = 1;
        }
    }

    for (let i = 0; i < loots.length; i++) {
        loots[i].update();
    }

    for (let i = 0; i < mountains.length; i++) {
        mountains[i].update();
    }

    for (let i = 0; i < forests.length; i++) {
        forests[i].update();
    }

    for (let i = 0; i < beedles.length; i++) {
        beedles[i].update();
    }

    for (let i = 0; i < shouts.length; i++) {
        shouts[i].update();
    }

    for (let i = 0; i < targets.length; i++) {
        targets[i].radius = (20-int(i/beedles.length))/20*9;
        if (targets[i].radius < 3) targets[i].radius = 3;
        targets[i].update();
    }

    moveBeedles();

    if (buyingBeetleDebt > 0) {
        buyingBeetleDebt--;
        score--;
    }

    compendium.update();
}

function display() {

    scale(size, size);

    clear();

    if (compendiumVisible) {

        push();
        scale(-1, 1);
        image(compendiumPaperLayer, -(-inventoryWidth/2 + width/size/2), height/size/2, width/size-inventoryWidth, height/size);
        stroke("#333");
        strokeWeight(1);
        noFill();
        rect(0, 0, width/size, height/size);
        image(mapCutoutLayer, -(-inventoryWidth/2 + width/size/2), height/size/2);
        pop();

        compendium.display();
        displayInventory();

        return;
    }

    image(mapLayer, -inventoryWidth/2 + width/size/2, height/size/2, width/size-inventoryWidth, height/size);

    for (let i = 0; i < towns.length; i++) {
        towns[i].display()
    }

    for (let i = 0; i < loots.length; i++) {
        loots[i].display();
    }

    displayFog();
    image(fogLayer, -inventoryWidth/2 + width/size/2, height/size/2);

    for (let i = 0; i < towns.length; i++) {
        towns[i].displayName()
    }

    for (let i = 0; i < beedles.length; i++) {
        beedles[i].displayLine();
    }

    for (let i = 0; i < mountains.length; i++) {
        mountains[i].display();
    }

    for (let i = 0; i < forests.length; i++) {
        forests[i].display();
    }

    for (let i = 0; i < animals.length; i++) {
        animals[i].display();
    }

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].display();
    }

    for (let i = 0; i < adventurers.length; i++) {
        adventurers[i].display();
    }

    for (let i = 0; i < targets.length; i++) {
        targets[i].display();
    }

    for (let i = 0; i < shouts.length; i++) {
        shouts[i].display();
    }

    for (let i = 0; i < beedles.length; i++) {
        beedles[i].display();
    }

    stroke("#333");
    strokeWeight(1);
    noFill();
    rect(0, 0, width/size, height/size);
    image(mapCutoutLayer, -inventoryWidth/2 + width/size/2, height/size/2);
    displayInventory();
    displayPopup();
}

function hoverOverInventory() {

    if (mouseX/size > 0 && mouseX/size < width/size-inventoryWidth && mouseY/size > 0 && mouseY/size < height/size) {
        compendiumVisible = false;
    } else {
        compendiumVisible = true;
    }
}

function mousePressed() {

    for (let i = 0; i < beedles.length; i++) {
        for (let j = 0; j < beedles[i].targets.length; j++) {
            if (beedles[i].targets[j].clicked()) {

                let index = beedles[i].targets.indexOf(beedles[i].targets[j]);
                if (index != -1) beedles[i].targets.splice(index, 1);
                if (beedles[i].targets[j] != undefined) beedles[i].targets[j].visualLineWeight = 0;
                return;
            }
        }
    }

    let edgePadding = 30;

    if (mouseX > width-edgePadding*3-inventoryWidth || mouseX < edgePadding || mouseY > height-edgePadding || mouseY < edgePadding) return;

    unassignWaypoints();

    if (keyIsDown(SHIFT) || mouseButton != LEFT) {

        for (let i = 0; i < beedles.length; i++) {
            for (let j = 0; j < beedles[i].targets.length; j++) {
                beedles[i].targets[j].assigned = false;
            }
            beedles[i].targets = [];
        }
        targets.unshift(new Target(mouseX/size, mouseY/size));

    } else {
        targets.push(new Target(mouseX/size, mouseY/size));
    }
}

function keyPressed() {

    if (keyCode == ESCAPE) {
        targets = [];
    }
}

function createPopupBox() {

    let w = 150;
    let h = 100;
    let interval = 20;
    let bumpiness = 2;

    popupBoxLayer = createGraphics(w, h);
    popupBoxLayer.noStroke();
    popupBoxLayer.fill("#928E74");
    popupBoxLayer.beginShape();

    popupBoxLayer2 = createGraphics(w, h);
    popupBoxLayer2.noStroke();
    popupBoxLayer2.fill(0, 50);
    popupBoxLayer2.beginShape();

    for (let i = bumpiness; i < w; i += interval) {
        popupBoxLayer.vertex(i+random(-bumpiness, bumpiness), bumpiness+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < h; i += interval) {
        popupBoxLayer.vertex(w-bumpiness+random(-bumpiness, bumpiness), i+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < w; i += interval) {
        popupBoxLayer.vertex(w-i+random(-bumpiness, bumpiness), h-bumpiness+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < h; i += interval) {
        popupBoxLayer.vertex(bumpiness+random(-bumpiness, bumpiness), h-i+random(-bumpiness, bumpiness));
    }

    popupBoxLayer.endShape(CLOSE);
    popupBoxLayer2.endShape(CLOSE);
}

function displayPopup() {

    if (popupSelected == 0) {
        if (!newPopupRequired) newPopupRequired = true;
        return;
    }

    if (popupSelected.visible == false) return;

    if (newPopupRequired) {
        createPopupBox();
        newPopupRequired = false;
    }

    push();
    translate(popupSelected.x + 30, popupSelected.y);
    if (popupSelected instanceof Town) translate(15, -10);

    translate(70, 30);
    image(popupBoxLayer2, 7, 7);
    image(popupBoxLayer, 0, 0);

    translate(0, -33);
    strokeWeight(0.3);
    textFont(beetleDescriptionFont);
    textSize(20);
    textLeading(20);

    let i = 0;
    for (let [key, value] of Object.entries(popupSelected.inventory)) {

        let txt = key.toString() + ": " + value;
        if (popupSelected instanceof Town) txt += "/100";
        else if (popupSelected instanceof Adventurer && key.toString() != "gems") txt += "/8";
        else if (popupSelected instanceof Adventurer && key.toString() == "gems") txt += "/5";

        if (value >= 100) {
            stroke(150, 0, 0, 200);
            fill(150, 0, 0, 200);
        } else {
            stroke(0, 200);
            fill(0, 200);
        }

        text(txt, 0, 15*i);
        i++;
    }

    pop();
}

function createBackground() {

    let multiplier = 1;

    let mapWidth = width/size-inventoryWidth;
    let mapHeight = height/size;

    let w = mapWidth * multiplier;
    let h = mapHeight * multiplier;

    mapLayer = createGraphics(w/2, h/2);
    mapLayer.fill(255, 0,0);
    mapLayer.loadPixels();

    let fuzz = 2;

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let index = (w*y + x) * 4;
            let col = color(112);

            if (random() < 0.1 || (x < 200*multiplier && random(0.2/multiplier) < 1/(x)) || (y < 200*multiplier && random(0.2/multiplier) < 1/(y)) || (x > w-200*multiplier && random(0.2/multiplier) < 1/(w-x)) || (y > h-200*multiplier && random(0.2/multiplier) < 1/(h-y))) {
                //
            } else if (x+int(random(-fuzz, fuzz)) > int(mapWidth/3-20)-fuzz && x+int(random(-fuzz, fuzz)) < int(mapWidth/3-20)+fuzz) {
                //
            } else if (x+int(random(-fuzz, fuzz)) > int(mapWidth/3*2+20)-fuzz && x+int(random(-fuzz, fuzz)) < int(mapWidth/3*2+20)+fuzz) {
                //
            } else if (y+int(random(-fuzz, fuzz)) > int(mapHeight/3-20)-fuzz && y+int(random(-fuzz, fuzz)) < int(mapHeight/3-20)+fuzz) {
                //
            } else if (y+int(random(-fuzz, fuzz)) > int(mapHeight/3*2+20)-fuzz && y+int(random(-fuzz, fuzz)) < int(mapHeight/3*2+20)+fuzz) {
                //
            } else {
                let perlin = noise(x*0.005/multiplier, y*0.005/multiplier);

                if (perlin < 0.3) {
                    col = lerpColor(color(0, 0, 150), color(0, 150, 150), perlin);
                } else if (perlin < 0.55) {
                    col = lerpColor(color(150, 255, 100), color(0, 40, 0), perlin);
                } else if (perlin > 0.7) {
                    col = lerpColor(color(0), color(255), perlin);
                } else {
                    col = lerpColor(color(255), color(0), perlin);
                }
            }

            mapLayer.pixels[index] = red(col);
            mapLayer.pixels[index+1] = green(col);
            mapLayer.pixels[index+2] = blue(col);
            mapLayer.pixels[index+3] = 255;
        }
    }

    mapLayer.updatePixels();

    mapLayer.filter(POSTERIZE, 40);

    compendiumPaperLayer = createGraphics(w/2, h/2);
    compendiumPaperLayer.image(mapLayer, 0, 0);
    compendiumPaperLayer.noStroke();
    compendiumPaperLayer.fill(148, 142, 119, 245);
    compendiumPaperLayer.rect(0, 0, w, h);

    mapLayer.noStroke();
    mapLayer.fill(173, 163, 126, 140);
    mapLayer.rect(0, 0, w, h);
}

function createTerrain() {

    for (let i = 0; i < width-inventoryWidth; i+=50) {
        for (let j = 0; j < height; j+=50) {

            let perlin = noise(i*0.005, j*0.005)

            if (perlin > 0.6) {
                mountains.push(new Mountain(i, j));
            } else if (perlin > 0.4 && perlin < 0.45) {
                forests.push(new Forest(i, j));
            }
        }
    }
}

function createMapCutout() {

    let w = width/size-inventoryWidth;
    let h = height/size;

    mapCutoutLayer = createGraphics(w, h);
    mapCutoutLayer.noStroke();
    mapCutoutLayer.fill("#333");

    mapCutoutLayer.beginShape();
    mapCutoutLayer.vertex(0, 0);
    mapCutoutLayer.vertex(0, h);
    mapCutoutLayer.vertex(w, h);
    mapCutoutLayer.vertex(w, 0);

    mapCutoutLayer.beginContour();

    let interval = 50;
    let bumpiness = 5;

    for (let i = bumpiness; i < w; i += interval) {
        mapCutoutLayer.vertex(i+random(-bumpiness, bumpiness), bumpiness+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < h; i += interval) {
        mapCutoutLayer.vertex(w-bumpiness+random(-bumpiness, bumpiness), i+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < w; i += interval) {
        mapCutoutLayer.vertex(w-i+random(-bumpiness, bumpiness), h-bumpiness+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < h; i += interval) {
        mapCutoutLayer.vertex(bumpiness+random(-bumpiness, bumpiness), h-i+random(-bumpiness, bumpiness));
    }

    mapCutoutLayer.endContour();
    mapCutoutLayer.endShape(CLOSE);
}

function displayInventory() {

    push();

    translate(width/size-inventoryWidth+10, 10);

    fill("#333");
    noStroke();
    rect(-10, -10, inventoryWidth, height);

    textAlign(LEFT);
    textSize(20);
    textFont(cartoonFont);

    translate(0, -25);

    fill(255);
    image(coinImage, 10, 35, 20, 20);
    text(score, 30, 35);

    let i = 1;

    for (let [key, value] of Object.entries(player.inventory)) {
        image(lootImages[key.toString()], 10, 37 + 25*i, 20, 20);
        text(value, 30, 35 + 25*i);
        i++;
    }

    if (needToCheckCompendium) {
        textSize(20 + sin(frameCount*10));
        text("<<<\nNew\nbeetle!\n<<<", 0, height/size/2);
    }

    pop();
}

function moveBeedles() {

    for (let i = 0; i < targets.length; i++) {
        for (let j = 0; j < beedles.length; j++) {

            if (dist(targets[i].x, targets[i].y, beedles[j].x, beedles[j].y) < 1) {
                targets.splice(i, 1);
                i--;
                if (i < 0) return;
                continue;
            }
        }
    }

    for (let i = 0; i < targets.length; i++) {
        if (targets[i].assigned) continue;

        let closestBeedleIndex = -1;
        let closestDistance = -1;

        for (let j = 0; j < beedles.length; j++) {

            let distance = 0;
            let beedlePosition = [beedles[j].x, beedles[j].y];

            for (let k = 0; k < beedles[j].targets.length; k++) {
                distance += dist(beedlePosition[0], beedlePosition[1], beedles[j].targets[k].x,  beedles[j].targets[k].y);
                beedlePosition = [beedles[j].targets[k].x,  beedles[j].targets[k].y];
            }

            distance += dist(beedlePosition[0], beedlePosition[1], targets[i].x, targets[i].y);

            if (closestBeedleIndex == -1 || distance < closestDistance) {
                closestBeedleIndex = j;
                closestDistance = distance;
            }
        }

        if (closestBeedleIndex == -1) break;

        beedles[closestBeedleIndex].targets.push(targets[i]);
        targets[i].assigned = true;
        targets[i].assignedTo = this;
    }
}

function createFog() {

    let w = width/size-inventoryWidth;
    let h = height/size;

    fogLayer = createGraphics(w, h);

    let spacing = 20;

    for (let i = 0; i < w; i += spacing) {
        for (let j = 0; j < h; j += spacing) {

            fogCircles.push({
                x: i + random(-15, 15),
                y: j + random(-15, 15),
                radius: random(50, 70),
                breatheOffset: random(360),
            })
        }
    }
}

function displayFog() {

    fogLayer.clear();
    fogLayer.noStroke();

    for (let i = 0; i < fogCircles.length; i++) {

        let fogAlpha = 60;

        for (let j = 0; j < beedles.length; j++) {

            let distance = dist(beedles[j].x, beedles[j].y, fogCircles[i].x, fogCircles[i].y);

            if (distance < beedleVisionRadius+fogAlpha/2) {
                let newAlpha = distance-(beedleVisionRadius+fogAlpha/2 - fogAlpha);
                if (newAlpha < fogAlpha) fogAlpha = newAlpha;
            }
        }

        fogLayer.fill(148, 142, 119, fogAlpha);
        fogLayer.ellipse(fogCircles[i].x, fogCircles[i].y, fogCircles[i].radius+sin(frameCount+fogCircles[i].breatheOffset)*5);
    }
}

function unassignWaypoints() {

    for (let i = 0; i < beedles.length; i++) {
        for (let j = 0; j < beedles[i].targets.length; j++) {
            beedles[i].targets[j].assigned = false;
        }
        beedles[i].targets = [];
    }

    for (let i = 0; i < targets.length; i++) {
        if (targets[i].assigned) targets[i].assigned = false;
    }
}