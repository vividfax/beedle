let townsJson;
let inventoryJson;

let player;
let targets = [];
let towns = [];
let adventurers = [];
let monsters = [];
let loots = [];
let mountains = [];
let forests = [];

let score = 0;
let scoreTextSize = 0;

let pg;
let mapCutoutLayer;

let worldWidth = 1512;
let worldHeight = 982;

let lootImages = {};
let adventurerImages = [];
let coinImage;
let playerImage;

let popupSelected;

let wildBeetleCount = 0;
let beetleScoreCount = 0;

function preload() {

    lootImages.stone = loadImage("./images/Stone.png");
    lootImages.wood = loadImage("./images/Wood.png");
    lootImages.bones = loadImage("./images/Skull.png");
    lootImages.gems = loadImage("./images/Crystal.png");

    for (let i = 0; i < 12; i++) {
        adventurerImages.push(loadImage("./images/hero" + i + ".png"));
    }

    coinImage = loadImage("./images/Coin.png");
    beetleImage = loadImage("./images/beetle.png");
    castleImage = loadImage("./images/castle.png");
    playerImage = loadImage("./images/beedle.png");
}

function setup() {

    createCanvas(worldWidth, worldHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    canvas.addEventListener('contextmenu', event => event.preventDefault());

    player = new Player(width/2, height/2);

    for (let i = 0; i < 3; i++) {
        towns.push(new Town(i));
    }

    for (let i = 0; i < 12; i++) {
        adventurers.push(new Adventurer(i));
    }

    for (let i = 0; i < 17; i++) {
        monsters.push(new Monster());
    }

    createBackground();
    createTerrain();
    createMapCutout();
}

function draw() {

    update();
    display();
}

function update() {

    popupSelected = 0;

    player.update();

    if (targets.length > 0) {

        player.move(targets[0]);

        if (targets[0].collide(player)) {
            targets.shift();
        }
    }

    for (let i = 0; i < adventurers.length; i++) {
        adventurers[i].update();
    }

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].update();
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
}

function display() {

    clear();
    image(pg, width/2, height/2, width, height);

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

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].display();
    }

    for (let i = 0; i < adventurers.length; i++) {
        adventurers[i].display();
    }

    for (let i = 0; i < targets.length; i++) {
        targets[i].display();
    }

    player.display();

    image(mapCutoutLayer, width/2, height/2);
    displayInventory();
    displayPopup();
}

function mousePressed() {

    let edgePadding = 100;

    if (mouseX > width-edgePadding || mouseX < edgePadding || mouseY > height-edgePadding || mouseY < edgePadding) return;

    if (keyIsDown(SHIFT) || mouseButton != LEFT) {
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

function displayPopup() {

    if (popupSelected == 0) return;

    push();
    translate(popupSelected.x + 30, popupSelected.y);
    textAlign(LEFT, TOP);

    fill(255);
    rect(0, 0, 50, 60);
    fill(0);

    let i = 0;

    for (let [key, value] of Object.entries(popupSelected.inventory)) {
        text(key.toString() + ":" + value, 0, 15*i);
        i++;
    }

    pop();
}

function createBackground() {

    let multiplier = 1;
    let w = width * multiplier;
    let h = height * multiplier;

    pg = createGraphics(w, h);

    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {

            let col;

            if (random() < 0.1 || (i < 200*multiplier && random(0.2/multiplier) < 1/(i)) || (j < 200*multiplier && random(0.2/multiplier) < 1/(j)) || (i > w-200*multiplier && random(0.2/multiplier) < 1/(w-i)) || (j > h-200*multiplier && random(0.2/multiplier) < 1/(h-j))) {
                col = color(112);
            } else {
                let perlin = noise(i*0.004/multiplier, j*0.004/multiplier)

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

            pg.set(i, j, color(col));
        }
    }
    pg.updatePixels();

    pg.stroke(112);
    let offset = 10;

    let topLeft = [width/3 + random(-offset, offset), height/3 + random(-offset, offset)]
    let topRight = [width/3*2 + random(-offset, offset), height/3 + random(-offset, offset)]
    let bottomLeft = [width/3 + random(-offset, offset), height/3*2 + random(-offset, offset)]
    let bottomRight = [width/3*2 + random(-offset, offset), height/3*2 + random(-offset, offset)]

    pg.line(0, height/3 + random(-offset, offset), topLeft[0], topLeft[1]);
    pg.line(width, height/3 + random(-offset, offset), topRight[0], topRight[1]);
    pg.line(0, height/3*2 + random(-offset, offset), bottomLeft[0], bottomLeft[1]);
    pg.line(width, height/3*2 + random(-offset, offset), bottomRight[0], bottomRight[1]);
    pg.line(width/3 + random(-offset, offset), 0, topLeft[0], topLeft[1]);
    pg.line(width/3 + random(-offset, offset), height, bottomLeft[0], bottomLeft[1]);
    pg.line(width/3*2 + random(-offset, offset), 0, topRight[0], topRight[1]);
    pg.line(width/3*2 + random(-offset, offset), height, bottomRight[0], bottomRight[1]);
    pg.line(topLeft[0], topLeft[1], topRight[0], topRight[1]);
    pg.line(bottomLeft[0], bottomLeft[1], bottomRight[0], bottomRight[1]);
    pg.line(topLeft[0], topLeft[1], bottomLeft[0], bottomLeft[1]);
    pg.line(topRight[0], topRight[1], bottomRight[0], bottomRight[1]);


    pg.noStroke();
    pg.fill(173, 163, 126, 140);
    pg.rect(0, 0, w, h);
    pg.filter(POSTERIZE, 40);
}

function createTerrain() {

    for (let i = 0; i < width; i+=50) {
        for (let j = 0; j < height; j+=50) {

            let perlin = noise(i*0.004, j*0.004)

            if (perlin > 0.6) {
                mountains.push(new Mountain(i, j));
            } else if (perlin > 0.4 && perlin < 0.45) {
                forests.push(new Forest(i, j));
            }
        }
    }
}

function createMapCutout() {

    mapCutoutLayer = createGraphics(width, height);
    mapCutoutLayer.noStroke();
    mapCutoutLayer.fill("#333");

    mapCutoutLayer.beginShape();
    mapCutoutLayer.vertex(0, 0);
    mapCutoutLayer.vertex(0, height);
    mapCutoutLayer.vertex(width, height);
    mapCutoutLayer.vertex(width, 0);

    mapCutoutLayer.beginContour();

    let interval = 50;
    let bumpiness = 5;

    for (let i = bumpiness; i < width; i += interval) {
        mapCutoutLayer.vertex(i+random(-bumpiness, bumpiness), bumpiness+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < height; i += interval) {
        mapCutoutLayer.vertex(width-bumpiness+random(-bumpiness, bumpiness), i+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < width; i += interval) {
        mapCutoutLayer.vertex(width-i+random(-bumpiness, bumpiness), height-bumpiness+random(-bumpiness, bumpiness));
    }

    for (let i = bumpiness; i < height; i += interval) {
        mapCutoutLayer.vertex(bumpiness+random(-bumpiness, bumpiness), height-i+random(-bumpiness, bumpiness));
    }

    mapCutoutLayer.endContour();
    mapCutoutLayer.endShape(CLOSE);
}

function displayInventory() {

    push();

    noStroke();
    fill("#333");
    beginShape();
    vertex(0, 0);
    vertex(150, 0);
    vertex(0, 250);
    endShape(CLOSE);

    fill(255);
    textAlign(LEFT);
    textSize(20);

    image(beetleImage, 10, 10, 25, 25);
    text(beetleScoreCount, 30, 10);

    image(coinImage, 10, 35, 20, 20);
    text(score, 30, 35);

    let i = 1;

    for (let [key, value] of Object.entries(player.inventory)) {
        image(lootImages[key.toString()], 10, 35 + 25*i, 20, 20);
        text(value, 30, 35 + 25*i);
        i++;
    }

    pop();
}