let WINDOW_WIDTH =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
let WINDOW_HEIGHT =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const MAX_RAIN_DROPS_NUMBER = 1000;

const settings = {
  backgroundColor: "#E6E6FA",
  rainColor: "#8A2BE2",
  dropEffectColor: "#8A2BE2",
  rainDropsNumber: 2,
  dropEffectDistance: 10,
  maxSpeed: 20,
  wind: 5,
};

let drops;
let gui;

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
  gui = new dat.GUI();
  gui.add(settings, "rainDropsNumber", 0, MAX_RAIN_DROPS_NUMBER);
  gui.add(settings, "maxSpeed", 1, 40);
  gui.add(settings, "dropEffectDistance", 0, 20);
  gui.add(settings, "wind", -20, 20);
  gui.addColor(settings, "backgroundColor");
  gui.addColor(settings, "rainColor");
  gui.addColor(settings, "dropEffectColor");
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
    this.radius = 30;
    this.maxRadius = random(0, 100);
    this.dropEffectX = 0;
    this.speed = map(this.z, 0, 20, 1, settings.maxSpeed);
    this.len = map(this.z, 0, 20, 10, 20);
  }

  initDropEffect() {
    this.radius = 2;
    this.dropEffectX = this.x;
  }

  dropEffect() {
    if (this.radius < this.maxRadius) {
      this.radius += 3;
      const alpha = map(this.radius, 0, 20, 1, 0.8);
      stroke(hex2rgba(settings.dropEffectColor, alpha));
      circle(this.dropEffectX, WINDOW_HEIGHT, this.radius);
    }
  }

  fall() {
    this.y += this.speed;
    this.x += settings.wind;
    this.speed += map(this.z, 0, 20, 0.01, 0.1);
    if (this.y > WINDOW_HEIGHT) {
      if (this.z > settings.dropEffectDistance) this.initDropEffect();
      this.y = random(-300, -10);
      this.z = random(0, 20);
      this.speed = map(this.z, 0, 20, 1, settings.maxSpeed);
      this.x = random(WINDOW_WIDTH);
      this.len = map(this.z, 0, 20, 10, 20);
    }

    if (this.x > WINDOW_WIDTH) {
      this.x = 0;
    }

    if (this.x < 0) {
      this.x = WINDOW_WIDTH;
    }
  }

  show() {
    const thick = map(this.z, 0, 20, 1, 5);
    const transparency = map(this.z, 0, 20, 0.1, 0.9);
    this.dropEffect();
    noFill();
    strokeWeight(thick);
    stroke(hex2rgba(settings.rainColor, transparency));
    line(this.x, this.y, this.x + settings.wind, this.y + this.len);
  }
}

const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};
