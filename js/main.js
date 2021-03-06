let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const gameOver = document.getElementById("gameover");
const clear = document.getElementById("clear");

const BALL_COLOR = "yellow";
const BALL_RADIUS = "10";
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let xMove = 2;
let yMove = 2;

const BAR_COLOR = "white";
const BAR_HEIGHT = 10;
const BAR_WIDTH = 75;
let barX = (canvas.width - BAR_WIDTH) / 2;
let rightKeyFlag = false;
let leftKeyFlag = false;

const BLOCK_COLOR = "red";
const BLOCK_ROW_COUNT = 6;
const BLOCK_COLUMN_COUNT = 16;
const BLOCK_WIDTH = 50;
const BLOCK_HEGHT = 20;
const BLOCK_MARGIN = 10;
const BLOCK_AREA_MARGIN = 30;
let blockArray = [];
for (let i = 0; i < BLOCK_ROW_COUNT * BLOCK_COLUMN_COUNT; i++) {
  let row = Math.floor(i / BLOCK_COLUMN_COUNT);
  let column = i - BLOCK_COLUMN_COUNT * row;
  blockArray.push({
    x: BLOCK_AREA_MARGIN + BLOCK_MARGIN * column + BLOCK_WIDTH * column,
    y: BLOCK_AREA_MARGIN + BLOCK_MARGIN * row + BLOCK_HEGHT * row,
  });
}

function drawBall() {
  ballX += xMove;
  ballY += yMove;
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = BALL_COLOR;
  ctx.fill();
  ctx.closePath();
  if (
    ballX + xMove > canvas.width - BALL_RADIUS ||
    ballX + xMove < BALL_RADIUS
  ) {
    xMove = -xMove;
  }
  if (ballY + yMove < BALL_RADIUS) {
    yMove = -yMove;
  } else if (ballY + yMove > canvas.height - BALL_RADIUS) {
    if (ballX > barX && ballX < barX + BAR_WIDTH) {
      yMove = -yMove;
    } else {
      gameOver.classList.remove("hidden");
      clearInterval(interval);
    }
  }
}

function drawBlock() {
  blockArray = blockArray.filter((block, index) => {
    if (
      ballX > block.x &&
      ballX < block.x + BLOCK_WIDTH &&
      ballY > block.y &&
      ballY < block.y + BLOCK_HEGHT
    ) {
      yMove = -yMove;
    } else {
      return block;
    }
  });
  if (blockArray.length === 0) {
    clear.classList.remove("hidden");
    clearInterval(interval);
    return;
  }
  blockArray.forEach((block) => {
    ctx.beginPath();
    ctx.rect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEGHT);
    ctx.fillStyle = BLOCK_COLOR;
    ctx.fill();
    ctx.closePath();
  });
}

function drawBar() {
  if (rigthKeyFlag && barX < canvas.width - BAR_WIDTH) {
    barX += 7;
  } else if (leftKeyFlag && barX > 0) {
    barX -= 7;
  }
  ctx.beginPath();
  ctx.rect(barX, canvas.height - BAR_HEIGHT, BAR_WIDTH, BAR_HEIGHT);
  ctx.fillStyle = BAR_COLOR;
  ctx.fill();
  ctx.closePath();
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rigthKeyFlag = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftKeyFlag = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rigthKeyFlag = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftKeyFlag = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawBlock();
  drawBar();
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
let interval = setInterval(draw, 10);
