let WINDOW_WIDTH = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
let WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight ||
    document.body.clientHeight;


const mapElements = (...elements) => elements.map((element) => element * 100);

let theMap, circlePosition, lastPosition, pathRecord, taxTotal, operation = "";

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    reset();
}

function windowResized() {
    WINDOW_WIDTH = window.innerWidth || document.documentElement.clientWidth ||
        document.body.clientWidth;
    WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight ||
        document.body.clientHeight;
    resizeCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function draw() {
    // base
    background(0);
    translate(WINDOW_WIDTH / 2 - mapElements(2), WINDOW_HEIGHT / 2 - mapElements(1.5));
    fill(255);

    // Tax
    textSize(40);
    textAlign(CENTER);
    const templeReached = circlePosition[0] === 4 && circlePosition[1] === 4;

    strokeWeight(1);
    text(`Tax: ${taxTotal} ${operation}`, ...mapElements(2, -0.7));

    if (templeReached) {
        textSize(30);
        text(`${taxTotal <= 0 ? "You won" : "You lost"}`, ...mapElements(2, -0.3));
    }

    // City map
    strokeWeight(4);
    stroke("#E9C46A");
    theMap.forEach(mapLine => line(...mapElements(...mapLine)));


    //City HUD - Temple
    strokeWeight(1);
    textSize(20);
    strokeWeight(1);
    textAlign(LEFT);
    fill("#FFFFFF");
    stroke("#2A9D8F");
    text("Temple", ...mapElements(4.2, 4));
    fill("#2A9D8F");
    circle(...mapElements(4, 4), 30);


    // Traveler position
    strokeWeight(4);
    stroke("#3A2D72");
    fill("#3A2D72");
    circle(...mapElements(...circlePosition), 20);
    pathRecord.forEach(pathRecordLine => line(...mapElements(...pathRecordLine)));

    //City HUD - Gate
    strokeWeight(1);
    textSize(20);
    strokeWeight(1);
    fill("#FFFFFF");
    stroke("#264653");
    textAlign(RIGHT);
    text("Gate", ...mapElements(-0.2, 0));
    fill("#264653");
    circle(...mapElements(0, 0), 30);


    //City HUD - Coordinates
    strokeWeight(1);
    textSize(40);
    fill("#FFFFFF");
    textAlign(RIGHT);
    text("+2", WINDOW_WIDTH / 2 + 100, -WINDOW_HEIGHT / 2 + 300);
    text("-2", WINDOW_WIDTH / 2 - 100, -WINDOW_HEIGHT / 2 + 300);
    text("x2", WINDOW_WIDTH / 2, -WINDOW_HEIGHT / 2 + 400);
    text("÷2", WINDOW_WIDTH / 2, -WINDOW_HEIGHT / 2 + 200);
    strokeWeight(3);
    stroke("#FFFFFF");
    noFill();
    line(WINDOW_WIDTH / 2 - 20, -WINDOW_HEIGHT / 2 + 320, WINDOW_WIDTH / 2 - 20, -WINDOW_HEIGHT / 2 + 250)
    line(WINDOW_WIDTH / 2 - 55, -WINDOW_HEIGHT / 2 + 285, WINDOW_WIDTH / 2 + 15, -WINDOW_HEIGHT / 2 + 285)
    circle(WINDOW_WIDTH / 2 - 20, -WINDOW_HEIGHT / 2 + 285, 70);


}


let operationShowTimer;

function keyPressed() {
    lastPosition = [...circlePosition]
    let newCirclePosition
    switch (keyCode) {
        case LEFT_ARROW:
            newCirclePosition = generateNewCirclePosition(-1, 0);
            if (isPathPossible(...lastPosition, ...newCirclePosition)) {
                circlePosition = newCirclePosition;
                taxTotal -= 2;
                operation = "-2";
            }
            break;
        case RIGHT_ARROW:
            newCirclePosition = generateNewCirclePosition(1, 0);
            if (isPathPossible(...lastPosition, ...newCirclePosition)) {
                circlePosition = newCirclePosition;
                taxTotal += 2;
                operation = "+2";
            }
            break;
        case UP_ARROW:
            newCirclePosition = generateNewCirclePosition(0, -1);
            if (isPathPossible(...lastPosition, ...newCirclePosition)) {
                circlePosition = newCirclePosition;
                taxTotal /= 2;
                operation = "÷2";
            }
            break;
        case DOWN_ARROW:
            newCirclePosition = generateNewCirclePosition(0, 1);
            if (isPathPossible(...lastPosition, ...newCirclePosition)) {
                circlePosition = newCirclePosition;
                taxTotal *= 2;
                operation = "x2";
            }
            break;
        case 82:
            reset();
            break;
    }
    clearTimeout(operationShowTimer);
    operationShowTimer = setTimeout(() => operation = "", 700);

    if (lastPosition[0] !== circlePosition[0] || lastPosition[1] !== circlePosition[1]) {
        pathRecord.push([...lastPosition, ...circlePosition]);
    }
}

const generateNewCirclePosition = (x, y) => {
    if (x < 0 || y < 0) {
        return [Math.max(circlePosition[0] + x, 0), Math.max(circlePosition[1] + y, 0)];
    } else {
        return [Math.min(circlePosition[0] + x, 4), Math.min(circlePosition[1] + y, 4)];
    }
}

const isPathPossible = (p1x, p1y, p2x, p2y) => {
    const differentPoints = p1x === p2x && p1y === p2y;
    return !differentPoints && !pathRecord.find(pathRecordLine => [p1x, p1y, p2x, p2y].every((value, index) => value === pathRecordLine[index]) || [p2x, p2y, p1x, p1y].every((value, index) => value === pathRecordLine[index]));
}

const reset = () => {
    circlePosition = [2, 0]
    lastPosition = [1, 0]
    pathRecord = [
        [0, 0, 1, 0],
        [1, 0, 2, 0]
    ];
    taxTotal = 4;
    theMap = [
        [0, 0, 0, 4],
        [1, 0, 1, 4],
        [2, 0, 2, 4],
        [3, 0, 3, 4],
        [4, 0, 4, 4],
        [0, 0, 4, 0],
        [0, 1, 4, 1],
        [0, 2, 4, 2],
        [0, 3, 4, 3],
        [0, 4, 4, 4],
    ]
}