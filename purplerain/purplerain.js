let WINDOW_WIDTH =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
let WINDOW_HEIGHT =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const MAX_RAIN_DROPS_NUMBER = 500;

const settings = {
  backgroundColor: "#E6E6FA",
  rainColor: "#8A2BE2",
  rainDropsNumber: 200,
};

// let stars;
// let gui;

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
  gui = new dat.GUI();
  gui.add(settings, "rainDropsNumber", 0, MAX_RAIN_DROPS_NUMBER);
  // gui.add(settings, "velocity", 0, 50);
  // gui.add(settings, "zoom", 1, 3);
  // gui.add(settings, "withSteroid");
  gui.addColor(settings, "backgroundColor");
  gui.addColor(settings, "rainColor");
  // gui.addColor(settings, "steroidDashColor");
  drops = new Array(MAX_RAIN_DROPS_NUMBER).fill().map((e) => new Drop());
}

function windowResized() {
  WINDOW_WIDTH =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  WINDOW_HEIGHT =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  resizeCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function draw() {
  background(settings.backgroundColor);
  // translate(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);

  for (let i = 0; i < settings.rainDropsNumber; i++) {
    drops[i].fall();
    drops[i].show();
  }
}

class Drop {
  constructor() {
    this.x = random(WINDOW_WIDTH);
    this.y = random(-200, WINDOW_HEIGHT);
    this.z = random(0, 20);
    this.speed = map(this.z, 0, 20, 1, 15);
    this.len = map(this.z, 0, 20, 10, 20);
  }

  fall() {
    this.y += this.speed;
    this.speed += map(this.z, 0, 20, 0.01, 0.1);
    if (this.y > WINDOW_HEIGHT) {
      this.y = random(-300, -10);
      this.speed = map(this.z, 0, 20, 1, 15);
    }
  }

  show() {
    const thick = map(this.z, 0, 20, 1, 3);
    strokeWeight(thick);
    stroke(settings.rainColor);
    line(this.x, this.y, this.x, this.y + this.len);
  }
}
