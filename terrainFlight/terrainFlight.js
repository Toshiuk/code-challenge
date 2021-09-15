let WINDOW_WIDTH =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
let WINDOW_HEIGHT =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

let WINDOW_WIDTH_LARGER = WINDOW_WIDTH + WINDOW_WIDTH / 2;
let WINDOW_HEIGHT_LARGER = WINDOW_HEIGHT + WINDOW_HEIGHT / 2;

const MAX_SCL = 100;
const MIN_SCL = 35;

const settings = {
  backgroundColor: "#4a0175",
  terrainColor: "#b800ff",
  terrainFillColor: "#242f64",
  terrainFillOpacity: 0.1,
  scl: 50,
  velMax: 0.06,
  maxTerrainHeight: 300,
};

const cols = () => WINDOW_WIDTH_LARGER / settings.scl;
const rows = () => WINDOW_HEIGHT_LARGER / settings.scl;
let velocity = 0;

const terrain = new Array(MAX_SCL).fill().map((e) => new Array(MAX_SCL).fill());

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT, WEBGL);
  gui = new dat.GUI();
  gui.add(settings, "scl", MIN_SCL, MAX_SCL).name("terrainDistance");
  gui.add(settings, "velMax", 0.01, 0.2);
  gui.add(settings, "maxTerrainHeight", 100, 400);
  gui.addColor(settings, "backgroundColor");
  gui.addColor(settings, "terrainColor");
  gui.addColor(settings, "terrainFillColor");
  gui.add(settings, "terrainFillOpacity", 0, 1);
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
  velocity -= settings.velMax;
  let yoff = velocity;
  for (let y = 0; y < rows() - 1; y++) {
    let xoff = 0;
    for (let x = 0; x < cols(); x++) {
      terrain[x][y] = map(
        noise(xoff, yoff),
        0,
        1,
        -10,
        settings.maxTerrainHeight
      );
      xoff += 0.2;
    }
    yoff += 0.2;
  }
  background(settings.backgroundColor);
  stroke(settings.terrainColor);
  fill(hex2rgba(settings.terrainFillColor, settings.terrainFillOpacity));

  rotateX(PI / 3);

  translate(-WINDOW_WIDTH_LARGER / 2, -WINDOW_HEIGHT_LARGER / 2 + 100);

  for (let y = 0; y < rows() - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols(); x++) {
      vertex(x * settings.scl, y * settings.scl, terrain[x][y]);
      vertex(x * settings.scl, (y + 1) * settings.scl, terrain[x][y + 1]);
    }
    endShape();
  }
}

const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};
