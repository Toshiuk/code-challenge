let WINDOW_WIDTH =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
let WINDOW_HEIGHT =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const settings = {
  velocity: 5,
  maxRoots: 4,
  maxRootLevels: 6,
  rootWeight: 3,
  skipGrowing: false,
  rootColor: "#FFF",
  backgroundColor: "#4a0175",
};

let root;

function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT, WEBGL);
  gui = new dat.GUI();
  gui.add(settings, "velocity", 1, 20);
  gui.add(settings, "maxRoots", 1, 5);
  gui.add(settings, "maxRootLevels", 2, 10);
  gui.add(settings, "rootWeight", 1, 10);
  gui.add(settings, "skipGrowing");
  gui.addColor(settings, "rootColor");
  gui.addColor(settings, "backgroundColor");

  reset();
}

function mousePressed() {
  reset();
}

function reset() {
  root = new Branch(0, WINDOW_HEIGHT / 2, WINDOW_HEIGHT / 5, 0, 0);
  loop();
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
  frameRate(30);
  stroke(settings.rootColor);
  strokeWeight(settings.rootWeight);
  noFill();
  settings.skipGrowing && noLoop();
  root.grow();
}

class Branch {
  constructor(x, y, size, xPosition, position) {
    this.position = position;
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + xPosition;
    this.y2 = y - size;
    this.size = size;
    this.growthSize = y;
    this.xPosition = xPosition;
    this.xAngle = random(0, xPosition / 2);
    this.yAngle = random(0, size / 2);

    this.naked = true;

    if (position < settings.maxRootLevels) {
      if (position) {
        this.branches = new Array(
          floor(random(1 - this.position / 10, settings.maxRoots))
        );
      } else {
        this.branches = new Array(floor(random(3, settings.maxRoots)));
      }
    } else {
      this.branches = [];
    }
  }

  grow() {
    if (settings.skipGrowing) this.growthSize = this.y2;

    if (this.position) {
      const xGrowthSize = map(
        this.growthSize,
        this.y1,
        this.y2,
        this.x1,
        this.x2
      );

      const xAngleGrowthSize = map(
        this.growthSize,
        this.y1,
        this.y2,
        0,
        this.xAngle
      );

      const yAngleGrowthSize = map(
        this.growthSize,
        this.y1,
        this.y2,
        0,
        this.yAngle
      );

      bezier(
        this.x1,
        this.y1,
        this.x1 + xAngleGrowthSize,
        this.y1,
        xGrowthSize,
        this.growthSize + yAngleGrowthSize,
        xGrowthSize,
        this.growthSize
      );
    } else {
      line(this.x1, this.y1, this.x2, this.growthSize);
    }

    if (this.growthSize > this.y2)
      this.growthSize = Math.max(this.growthSize - settings.velocity, this.y2);

    if (this.naked && this.growthSize <= this.y2) {
      this.naked = false;
      this.branches = this.branches
        .fill()
        .map(
          (e) =>
            new Branch(
              this.x2,
              this.y2,
              random(this.size * 0.6, this.size * 0.85),
              map(random(-100, 100), -100, 100, -this.size, this.size),
              this.position + 1
            )
        );
    }
    this.branches.forEach((branch) => branch.grow());
  }
}
