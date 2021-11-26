let img;

let townsJson;
let backpackJson;

let player;
let targets = [];
let towns = [];
let adventurers = [];
let loots = [];

let score = 0;
let scoreTextSize = 0;

function preload() {

    img = loadImage("beedle.png");
    townsJson = loadJSON("towns.json");
    backpackJson = loadJSON("backpack.json");
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);
    document.addEventListener('contextmenu', event => event.preventDefault());

    player = new Player(width/2, height/2, img, backpackJson.resources);

    for (let i = 0; i < townsJson.towns.length; i++) {
        towns[i] = new Town(townsJson.towns[i]);
    }
    for (let i = 0; i < 20; i++) {
        adventurers[i] = new Adventurer();
    }
    for (let i = 0; i < 80; i++) {
        loots[i] = new Loot();
    }
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

    background("#ccc");

    displayScore();

    for (let i = 0; i < towns.length; i++) {
        towns[i].display()
    }
    for (let i = 0; i < adventurers.length; i++) {
        adventurers[i].display();
    }
    for (let i = 0; i < loots.length; i++) {
        loots[i].display();
    }
    for (let i = 0; i < targets.length; i++) {
        targets[i].display();
    }
    player.display();
    //player.displayBackpack();
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
