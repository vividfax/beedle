
class Compendium {

    constructor() {

        this.genBeetles = [];

        let rowsAndColumns = [3, 2, 3];
        let spacingX = 350;
        let spacingY = 150;
        let row = 0;
        let column = 0;

        let offset = 30;

        for (let i = 0; i < 8; i++) {

            let beetleSize = random(150, 360);
            let x = width/size/2-inventoryWidth/2 + column*spacingX - rowsAndColumns[row]/2*spacingX + spacingX/2 + random(-offset, offset);
            let y = height/size/2 + row*spacingY - rowsAndColumns.length/2*spacingY + spacingY/2 + random(-offset, offset);

            this.genBeetles.push(new BeetleGen(x, y, beetleSize, i));

            column++;
            if (column > column%rowsAndColumns[row]) {
                column = 0;
                row++;
            }
        }

        this.numberUnlocked = 0;
    }

    update() {

        beetleUnlocked = false;

        for (let i = 0; i < this.genBeetles.length; i++) {
            this.genBeetles[i].update();
        }
    }

    unlockBeetle() {

        needToCheckCompendium = true;

        this.numberUnlocked++;

        if (this.numberUnlocked > this.genBeetles.length) return;

        let rand = int(random(this.genBeetles.length));

        for (let i = 0; i < this.genBeetles.length; i++) {
            let index = (rand+i)%this.genBeetles.length;

            if (this.genBeetles[index].unlocked && !this.genBeetles[index].caught) {
                this.genBeetles[index].caught = true;

                let timeThisFrame = new Date().getTime();
                let timeString = int((timeThisFrame-startTime)/1000);
                let hours = int(timeString/60/60);
                let minutes = int(timeString/60)%60;
                if (hours > 0 && minutes < 10) minutes = "0"+minutes;
                if (hours > 0) {
                    timeString = hours+":"+minutes;
                } else if (minutes > 0) {
                    timeString = minutes;
                }
                this.genBeetles[index].number = timeString;
                break;
            }
        }
    }

    display() {

        if (needToCheckCompendium) needToCheckCompendium = false;

        for (let i = 0; i < this.genBeetles.length; i++) {
            this.genBeetles[i].display();
        }
    }
}