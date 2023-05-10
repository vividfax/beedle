let player;
let targets = [];
let towns = [];
let adventurers = [];
let monsters = [];
let loots = [];
let mountains = [];
let forests = [];
let animals = [];

let score = 0;
let buyingBeetleDebt = 0;

let mapLayer;
let mapCutoutLayer;
let compendiumPaperLayer;

let screenWidth = 2560/2;
let screenHeight = 1406/2;
let inventoryWidth = 100;

let lootImages = {};
let adventurerImages = [];
let coinImage;
let playerImage;

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

let beetleUnlocked = false;

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

    beetleDescriptionFont = loadFont("./fonts/Allura-Regular.ttf");
    cartoonFont = loadFont("./fonts/ConcertOne-Regular.ttf");
}

function setup() {

    createCanvas(screenWidth, screenHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    canvas.addEventListener('contextmenu', event => event.preventDefault());

    player = new Player(width/2, height/2);

    for (let i = 0; i < 1; i++) {
        beedles.push(new Beedle(width/2, height/2));
    }

    for (let i = 0; i < 3; i++) {
        towns.push(new Town(i));
    }

    for (let i = 0; i < 12; i++) {
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

    // if (targets.length > 0) {

    //     player.move(targets[0]);

    //     if (targets[0].collide(player)) {
    //         targets.shift();
    //     }
    // }

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

    moveBeedles();

    if (buyingBeetleDebt > 0) {
        buyingBeetleDebt--;
        score--;
    }

    compendium.update();
}

function display() {

    clear();
    displayInventory();

    if (compendiumVisible) {

        push();
        scale(-1, 1);
        image(compendiumPaperLayer, -(inventoryWidth/2 + width/2), height/2, width-inventoryWidth, height);
        image(mapCutoutLayer, -(inventoryWidth/2 + width/2), height/2);
        pop();

        compendium.display();

        return;
    }

    image(mapLayer, inventoryWidth/2 + width/2, height/2, width-inventoryWidth, height);

    for (let i = 0; i < mountains.length; i++) {
        mountains[i].display();
    }

    for (let i = 0; i < forests.length; i++) {
        forests[i].display();
    }

    for (let i = 0; i < loots.length; i++) {
        loots[i].display();
    }

    for (let i = 0; i < towns.length; i++) {
        towns[i].display()
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

    for (let i = 0; i < beedles.length; i++) {
        beedles[i].display();
    }

    image(mapCutoutLayer, inventoryWidth/2 + width/2, height/2);
    displayPopup();
}

function hoverOverInventory() {

    if (mouseX > inventoryWidth && mouseX < width && mouseY > 0 && mouseY < height) {
        compendiumVisible = false;
    } else {
        compendiumVisible = true;
    }
}

function mousePressed() {

    let edgePadding = 30;

    if (mouseX > width-edgePadding || mouseX < edgePadding+inventoryWidth || mouseY > height-edgePadding || mouseY < edgePadding) return;

    if (keyIsDown(SHIFT) || mouseButton != LEFT) {

        for (let i = 0; i < beedles.length; i++) {
            beedles[i].targets = [];
        }
        targets = [(new Target(mouseX, mouseY))];
    } else {
        targets.push(new Target(mouseX, mouseY));
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

        if (value > 100) {
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

    let mapWidth = width-inventoryWidth;
    let mapHeight = height;

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
                mountains.push(new Mountain(i+inventoryWidth, j));
            } else if (perlin > 0.4 && perlin < 0.45) {
                forests.push(new Forest(i+inventoryWidth, j));
            }
        }
    }
}

function createMapCutout() {

    let w = width-inventoryWidth;
    let h = height;

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
    translate(10, 5);

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
        text(">>>\nNew\nbeetle!\n>>>", 0, height/2);
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
    }
}
