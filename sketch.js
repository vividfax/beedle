let img;

let townsJson;
let backpackJson;

let player;
let targets = [];
let towns = [];
let adventurers = [];

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

    player = new Player(width/2, height/2, img, backpackJson.resources);

    for (let i = 0; i < townsJson.towns.length; i++) {
        towns[i] = new Town(townsJson.towns[i]);
    }
    for (let i = 0; i < 20; i++) {
        adventurers[i] = new Adventurer();
    }
}

function draw() {

    update();
    display();
}

function update() {

    if (targets.length > 0) {

        player.move(targets[0].pos);

        if (targets[0].pos.dist(player.pos) < 1) {
            targets.shift();
        }
    }
    for (let i = 0; i < towns.length; i++) {
        towns[i].checkVisiting(player.pos);
    }
    for (let i = 0; i < adventurers.length; i++) {
        adventurers[i].move();
    }
}

function display() {

    background("#ccc");

    for (let i = 0; i < towns.length; i++) {
        towns[i].display()
    }
    for (let i = 0; i < targets.length; i++) {
        targets[i].display();
    }
    player.display();
    player.displayBackpack();

    for (let i = 0; i < adventurers.length; i++) {
        adventurers[i].display();
    }
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
