let WINDOW_WIDTH = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
let WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight ||
    document.body.clientHeight;

    const theMap = [[0,0,0,400],
    [100,0,100,400],
    [200,0,200,400],
    [300,0,300,400],
    [400,0,400,400],
    [0,0,400,0],
    [0,100,400,100],
    [0,200,400,200],
    [0,300,400,300],
    [0,400,400,400],
]
    
let circlePosition = [200, 0]
let lastPosition = [200, 0]
let pathRecord = [[0, 0, 100, 0], [100, 0, 200, 0]];
let credits = 4;
let operation = "";

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
  
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
    translate(200, 200);
    fill(255);

    // Credits
    textSize(40);
    textAlign(CENTER);
    const templeReached = circlePosition[0] === 400 && circlePosition[1] === 400;

    strokeWeight(2);
    text(`Credits: ${credits} ${operation}`, 200, -100);
    
    if(templeReached){
        textSize(30);
        text(`${credits <= 0 ? "You won" : "You lost"}`, 200, -50);
    }

    // City map
    strokeWeight(4);
    stroke("#E9C46A");
    theMap.forEach(mapLine => line(...mapLine));

   
    //City HUD
    strokeWeight(1);
    textSize(20);
    strokeWeight(1);
    textAlign(LEFT);
    fill("#FFFFFF");
    stroke("#2A9D8F");
    text("Temple", 420, 400);
    fill("#2A9D8F");
    circle(400, 400, 30);


    // Traveler position
    strokeWeight(4);
    stroke("#3A2D72");
    fill("#3A2D72");
    circle(...circlePosition, 20);
    pathRecord.forEach(pathRecordLine => line(...pathRecordLine));

   
    //City HUD
    strokeWeight(1);
    textSize(20);
    strokeWeight(1);
    fill("#FFFFFF");
    stroke("#264653");
    textAlign(RIGHT);
    text("Gate", -20, 0);
    fill("#264653");
    circle(0, 0, 30);
 

    //City HUD
    strokeWeight(1);
    textSize(40);
    fill("#FFFFFF");
    textAlign(RIGHT);
    text("-2", WINDOW_WIDTH -300, WINDOW_HEIGHT -400);
    text("+2", WINDOW_WIDTH -500, WINDOW_HEIGHT -400);
    text("÷2", WINDOW_WIDTH -400, WINDOW_HEIGHT -300);
    text("x2", WINDOW_WIDTH -400, WINDOW_HEIGHT -500);
    strokeWeight(3);
    stroke("#FFFFFF");
    noFill();
    line(WINDOW_WIDTH -455, WINDOW_HEIGHT -420, WINDOW_WIDTH -385, WINDOW_HEIGHT -420)
    line(WINDOW_WIDTH -420, WINDOW_HEIGHT -455, WINDOW_WIDTH -420, WINDOW_HEIGHT -385)
    circle(WINDOW_WIDTH -420,  WINDOW_HEIGHT -420, 70);


}


let operationShowTimer;

function keyPressed() {
    lastPosition = [...circlePosition]
    let newCirclePosition
    switch (keyCode){
        case LEFT_ARROW:
            newCirclePosition = generateNewCirclePosition(-100,0);
            if(isPathPossible(...lastPosition, ...newCirclePosition)){
                circlePosition = newCirclePosition;
                credits -= 2;
                operation = "-2";
            }
            break;
        case RIGHT_ARROW:
            newCirclePosition = generateNewCirclePosition(100,0);
            if(isPathPossible(...lastPosition, ...newCirclePosition)){
                circlePosition = newCirclePosition;
                credits += 2;
                operation = "+2";
            }
            break;
        case UP_ARROW:
            newCirclePosition = generateNewCirclePosition(0,-100);
            if(isPathPossible(...lastPosition, ...newCirclePosition)){
                circlePosition = newCirclePosition;
                credits /= 2;
                operation = "÷2";
            }
            break;
        case DOWN_ARROW:
            newCirclePosition = generateNewCirclePosition(0,100);
            if(isPathPossible(...lastPosition, ...newCirclePosition)){
                circlePosition = newCirclePosition;
                credits *= 2;
                operation = "x2";
            }
        break;
        case 82:
            reset();
        break;
    }
    clearTimeout(operationShowTimer);
    operationShowTimer = setTimeout(() => operation = "", 700);
    
    if(lastPosition[0] !== circlePosition[0] || lastPosition[1] !== circlePosition[1]){
        pathRecord.push([...lastPosition,...circlePosition]);
    }
  }

const generateNewCirclePosition = (x,y) => {
     if( x < 0 || y < 0){
        return [Math.max(circlePosition[0] + x, 0), Math.max(circlePosition[1]+ y, 0)];
    } else {
        return [Math.min(circlePosition[0] + x, 400), Math.min(circlePosition[1]+ y, 400)];
    }
}

const isPathPossible = (p1x, p1y, p2x, p2y) => {
    const differentPoints = p1x === p2x && p1y === p2y;
    return !differentPoints && !pathRecord.find(pathRecordLine => [p1x, p1y, p2x, p2y].every((value, index) => value === pathRecordLine[index]) || [ p2x, p2y, p1x, p1y].every((value, index) => value === pathRecordLine[index]));
}

const reset = () => {
    circlePosition = [200, 0]
    lastPosition = [200, 0]
    pathRecord = [[0, 0, 100, 0], [100, 0, 200, 0]];
    credits = 4;
}