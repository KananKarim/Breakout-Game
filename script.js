const container = document.querySelector(".container");
const score = document.querySelector("#score");
let scoreEl = 0;
const blockWidth = 100;
const blockHeight = 20;
const boardWidth = 560;
let userStart = [230, 10];
let ballStart = [270, 30];
let currentPosition = userStart;
let currentPositionBall = ballStart;
let timerId;
const ballDiameter = 20;
const boardHeight = 300;
let xDirection = 2;
let yDirection = 2;

// create block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

//blocks array
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

// create blocks and append to container
function addBlock() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    container.append(block);
  }
}

addBlock();

// draw a ball
function drawBall() {
  ball.style.left = currentPositionBall[0] + "px";
  ball.style.bottom = currentPositionBall[1] + "px";
}

// draw a user
function drawUser() {
  userBlock.style.left = currentPosition[0] + "px";
  userBlock.style.bottom = currentPosition[1] + "px";
}

// create user block
const userBlock = document.createElement("div");
userBlock.classList.add("user");
drawUser();
container.append(userBlock);

// move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}

document.addEventListener("keydown", moveUser);

// add ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
container.append(ball);

// move ball
function moveBall() {
  currentPositionBall[0] += xDirection;
  currentPositionBall[1] += yDirection;
  drawBall();
  checkForCollisions();
}

timerId = setInterval(moveBall, 30);

// check for collisions
function checkForCollisions() {
  //check for block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      currentPositionBall[0] > blocks[i].bottomLeft[0] &&
      currentPositionBall[0] < blocks[i].bottomRight[0] &&
      currentPositionBall[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      currentPositionBall[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      scoreEl++;
      score.innerText = scoreEl;
    }
  }

  // check for user collisions
  if (
    currentPositionBall[0] > currentPosition[0] &&
    currentPositionBall[0] < currentPosition[0] + blockWidth &&
    currentPositionBall[1] > currentPosition[1] &&
    currentPositionBall[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection();
  }

  // check for wall collisions
  if (
    currentPositionBall[0] >= boardWidth - ballDiameter ||
    currentPositionBall[1] >= boardHeight - ballDiameter ||
    currentPositionBall[0] <= 0
  ) {
    changeDirection();
  }

  // check for game over
  if (currentPositionBall[1] <= 0) {
    clearInterval(timerId);
    score.innerText = "YOU LOSE!!";
    removeEventListener("keydown", moveUser);
  }

  // check for win
  if (blocks.length === 0) {
    score.innerText = "YOU WIN!!!";
    clearInterval(timerId);
    document.removeEventListener("keydown", moveUser);
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
