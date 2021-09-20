let WINDOW_WIDTH = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
let WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight ||
    document.body.clientHeight;

const MAX_STARS_NUMBER = 1000;

const settings = {
    backgroundColor: "#000000",
    steroidColor: "#ffffff",
    steroidDashColor: "#ffffff",
    starsNumber: 300,
    velocity: 20,
    zoom: 1,
    withSteroid: false
}

let stars;
let gui;

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    gui = new dat.GUI();
    gui.add(settings, "starsNumber", 0, MAX_STARS_NUMBER);
    gui.add(settings, "velocity", 0, 50);
    gui.add(settings, "zoom", 1, 3);
    gui.add(settings, "withSteroid");
    gui.addColor(settings, "backgroundColor");
    gui.addColor(settings, "steroidColor");
    gui.addColor(settings, "steroidDashColor");
    stars = new Array(MAX_STARS_NUMBER).fill().map(e => new Star());
}

function windowResized() {
    WINDOW_WIDTH = window.innerWidth || document.documentElement.clientWidth ||
        document.body.clientWidth;
    WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight ||
        document.body.clientHeight;
    resizeCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function draw() {
    background(settings.backgroundColor);
    translate(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);

    for (let i = 0; i < settings.starsNumber; i++) {
        stars[i].update();
        stars[i].show();
    }
}

class Star {
    constructor() {
        this.x = random(-WINDOW_WIDTH, WINDOW_WIDTH);
        this.y = random(-WINDOW_HEIGHT, WINDOW_HEIGHT);
        this.z = random(WINDOW_WIDTH);

        this.pz = this.z;
    }

    reset() {
        this.z = WINDOW_WIDTH;
        this.x = random(-WINDOW_WIDTH, WINDOW_WIDTH);
        this.y = random(-WINDOW_HEIGHT, WINDOW_HEIGHT);
        this.pz = this.z;
    }

    update() {
        this.z = this.z - settings.velocity;
        if (Math.abs(this.x / this.z) > (1 * settings.zoom) || Math.abs(this.y / this.z) > (1 * settings.zoom) || this.z < 1) {
            this.reset();
        }
    }

    show() {

        const sx = map(this.x / this.z, 0, 1, 0, WINDOW_WIDTH / settings.zoom);
        const sy = map(this.y / this.z, 0, 1, 0, WINDOW_HEIGHT / settings.zoom);



        const px = map(this.x / this.pz, 0, 1, 0, WINDOW_WIDTH / settings.zoom);
        const py = map(this.y / this.pz, 0, 1, 0, WINDOW_HEIGHT / settings.zoom);

        this.pz = this.z;

        stroke(settings.steroidDashColor);
        line(px, py, sx, sy)

        if (settings.withSteroid) {
            const size = map(this.z, 0, WINDOW_WIDTH, 16, 0);
            noStroke();
            fill(settings.steroidColor);
            ellipse(sx, sy, size, size);
        }
    }

}
