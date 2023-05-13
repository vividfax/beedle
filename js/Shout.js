class Shout {

    constructor (x, y, target) {

        this.x = x;
        this.y = y;
        this.target = target;
        this.radius = 20;

        this.lifeTime = 0;
        this.visible = false;

        this.pulseOffset = random(360);
    }

    update() {

        this.lifeTime++;

        if (this.lifeTime > 60*30) this.destruct();
        if (this.target != -1 && !this.target.carryingBeetle) this.destruct();

        let x, y;

        if (this.target == -1) {
            x = this.x;
            y = this.y;
        } else {
            x = this.target.x;
            y = this.target.y;
        }

        for (let i = 0; i < beedles.length; i++) {

            let distance = dist(beedles[i].x, beedles[i].y, x, y);
            if (this.target == -1 && distance < beedleVisionRadius) {
                this.destruct();
                return;
            } else if (this.target != -1 && distance < beedleVisionRadius) {
                this.visible = true;
                break;
            } else if (this.target != -1) {
                this.visible = false;
            }
        }
    }

    destruct() {

        let index = shouts.indexOf(this);
        if (index != -1) shouts.splice(index, 1);
    }

    display() {

        if (this.visible) return;

        let x, y;
        let radius = this.radius + sin((frameCount+this.pulseOffset)*8)*4;

        if (this.target == -1) {
            x = this.x;
            y = this.y;
            image(deathShoutImage, x, y, radius, radius);
        } else {
            x = this.target.x;
            y = this.target.y;
            image(beetleShoutImage, x, y, radius, radius);
        }
    }
}