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

let worldWidth = 1512;
let worldHeight = 982;

let mapBorderImage;
let lootImages = {};
let adventurerImages = [];

let popupSelected;

function preload() {

    mapBorderImage = loadImage("./images/mapBorder.png");

    lootImages.stone = loadImage("./images/Stone.png");
    lootImages.wood = loadImage("./images/Wood.png");
    lootImages.bones = loadImage("./images/Skull.png");
    lootImages.gems = loadImage("./images/Crystal.png");

    for (let i = 0; i < 12; i++) {
        adventurerImages.push(loadImage("./images/hero" + i + ".png"));
    }
}

function setup() {

    createCanvas(worldWidth, worldHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    canvas.addEventListener('contextmenu', event => event.preventDefault());
    pg = createGraphics(width, height);

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

    // for (let i = 0; i < 3; i++) {
    //     let edgePadding = 200;
    //     let pos = {
    //         x: random(edgePadding, width-edgePadding),
    //         y: random(edgePadding, height-edgePadding)
    //     }
    //     pos = createMountainRange(pos.x, pos.y);
    //     pos = createMountainRange(pos.x, pos.y);
    //     pos = createMountainRange(pos.x, pos.y);
    //     pos = createMountainRange(pos.x, pos.y);
    //     pos = createMountainRange(pos.x, pos.y);
    //     pos = createMountainRange(pos.x, pos.y);
    // }

    // for (let i = 0; i < 3; i++) {
    //     let edgePadding = 200;
    //     let pos = {
    //         x: random(edgePadding, width-edgePadding),
    //         y: random(edgePadding, height-edgePadding)
    //     }
    //     pos = createForests(pos.x, pos.y);
    //     pos = createForests(pos.x, pos.y);
    //     pos = createForests(pos.x, pos.y);
    //     pos = createForests(pos.x, pos.y);
    //     pos = createForests(pos.x, pos.y);
    //     pos = createForests(pos.x, pos.y);
    // }

    pg.background("#ccc");
    createBackground();
    createTerrain();
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
    image(pg, width/2, height/2);

    displayScore();

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

    image(mapBorderImage, width/2, height/2, width, height);

    displayPopup();
}

function mousePressed() {

    let edgePadding = 50;

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

function displayScore() {

    if (score > 0) {

        if (scoreTextSize < score + 20) {
            scoreTextSize++;
        }

        push();
        translate(width/2, height/2 + scoreTextSize * 0.07);

        fill("#ddd");
        textAlign(CENTER, CENTER);
        textSize(scoreTextSize);
        text(score, 0, 0);

        pop();
    }
}

function displayPopup() {

    if (popupSelected == 0) return;

    push();
    translate(popupSelected.x + 30, popupSelected.y);
    textAlign(LEFT, TOP);

    fill(255);
    rect(0, 0, 50, 100);
    fill(0);

    let i = 0;

    for (let [key, value] of Object.entries(popupSelected.inventory)) {
        text(key.toString() + ":" + value, 0, 15*i);
        i++;
    }

    pop();
}

function createBackground() {

    let colorA = 0;
    let colorB = 255;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {

            let col;
            let perlin = noise(i*0.004, j*0.004)

            if (perlin < 0.3) {
                col = lerpColor(color(0, 0, 150), color(0, 150, 150), perlin);
            } else if (perlin < 0.55) {
                col = lerpColor(color(150, 255, 100), color(0, 40, 0), perlin);
            } else if (perlin > 0.7) {
                col = lerpColor(color(0), color(255), perlin);
            } else {
                col = lerpColor(color(255), color(0), perlin);
            }

            pg.set(i, j, color(col));
        }
    }
    pg.updatePixels();

    pg.fill(173, 163, 126, 120);
    pg.rect(0, 0, width, height);
    pg.filter(POSTERIZE, 40);
}

function createTerrain() {

    for (let i = 0; i < width; i+=50) {
        for (let j = 0; j < height; j+=50) {

            let perlin = noise(i*0.004, j*0.004)

            if (perlin > 0.65) {
                mountains.push(new Mountain(i, j));
            } else if (perlin > 0.45 && perlin < 0.55) {
                forests.push(new Forest(i, j));
            }
        }
    }
}