let img;
let mapBorderImage;

let townsJson;
let backpackJson;

let player;
let targets = [];
let towns = [];
let adventurers = [];
let monsters = [];
let loots = [];

let score = 0;
let scoreTextSize = 0;

let pg;

let worldWidth = 1512;
let worldHeight = 982;

function preload() {

    img = loadImage("./beedle.png");
    mapBorderImage = loadImage("./mapBorder.png");

    // townsJson = loadJSON("./json/towns.json");
    backpackJson = loadJSON("./json/backpack.json");
}

function setup() {

    createCanvas(worldWidth, worldHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    canvas.addEventListener('contextmenu', event => event.preventDefault());
    pg = createGraphics(width, height);

    player = new Player(width/2, height/2, img, backpackJson.resources);

    for (let i = 0; i < 3; i++) {
        towns[i] = new Town(i);
    }
    for (let i = 0; i < 20; i++) {
        adventurers[i] = new Adventurer();
    }
    for (let i = 0; i < 5; i++) {
        monsters[i] = new Monster();
    }
    for (let i = 0; i < 80; i++) {
        loots[i] = new Loot();
    }

    pg.background("#ccc");
}

function draw() {

    update();
    display();
}

function update() {

    player.update();

    if (targets.length > 0) {

        player.move(targets[0].pos);

        if (targets[0].pos.dist(player.pos) < 1) {
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
        towns[i].checkVisiting(player.pos);

        if (towns[i].visiting) {
            player.velocity = 1;
        }
    }

    for (let i = 0; i < loots.length; i++) {

        loots[i].update();
    }
}

function display() {

    clear();
    image(pg, width/2, height/2);

    displayScore();

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
    //player.displayBackpack();

    image(mapBorderImage, width/2, height/2, width, height);
}

function mousePressed() {

    if (keyIsDown(SHIFT) || mouseButton != LEFT) {
        targets.push(new Target(mouseX, mouseY));
    } else {
        targets = [(new Target(mouseX, mouseY))];
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
