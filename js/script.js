const canvas = document.querySelector('#myCanvas'),
      scoreElement = document.querySelector('.score span'),
      endGameElement = document.querySelector('.end-game'),
      startGameButton = document.querySelector('#start'),
      endGameButton = document.querySelector('#ok'),
      ctx = canvas.getContext('2d'),
      width = canvas.clientWidth,
      height = canvas.clientHeight,
      debugDirX = document.querySelector('.debug__dir-x'),
      debugDirY = document.querySelector('.debug__dir-y'),
      debugInfoKey = document.querySelector('.debug-info__key'),
      blockSize = 10,
      widthInBlocks = width / blockSize,
      heightInBlocks = height / blockSize;

let key = 'd',
    time = 200  ,
    scoreCount = 0;

function drawScore() {
  scoreElement.textContent = scoreCount;
}



function Block(col, row) {
  this.col = col;
  this.row = row;
}

Block.prototype.drawSquare = function(color) {
  let x = this.col * blockSize;
  let y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.equal = function(otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};

function Snake() {
  this.segments = [
    new Block(7, 5),
  ];

  this.dir = 'right';
  this.nextDir = 'right';
}

Snake.prototype.draw = function() {
  for (let i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare('#2F1124');
  }
  console.log('Snake head col: ' + this.segments[0].col);
  console.log('Snake head row: ' + this.segments[0].row);
};

Snake.prototype.checkCollision = function(head) {
  let leftCollision = (head.col === -1),
      topCollision = (head.row === -1),
      rightCollision = (head.col === widthInBlocks),
      bottomCollision = (head.row === heightInBlocks);

  let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

  let selfCollision = false;

  for (let i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }

  return wallCollision || selfCollision;

};


Snake.prototype.move = function() {
  let head = this.segments[0];
  let newHead;

  this.dir = this.nextDir;

  if (this.dir === 'right') {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.dir === 'down') {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.dir === 'left') {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.dir === 'up') {
    newHead = new Block(head.col, head.row - 1);
  }

  if (this.checkCollision(newHead)) {
    endGame();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    console.log('snake eat apple');
    scoreCount += 10;
    apple.move();
  } else {
    this.segments.pop();
  }
};

Snake.prototype.setDir = function(newDir) {
  if (this.dir === 'up' && newDir === 'down') {
    return;
  } else if (this.dir === 'right' && newDir === 'left') {
    return;
  } else if (this.dir === 'down' && newDir === 'up') {
    return;
  } else if (this.dir === 'left' && newDir === 'right') {
    return;
  }

  this.nextDir = newDir;
};

const directions = {
  65: 'left', 
  87: 'up',
  68: 'right',
  83: 'down'
};

window.addEventListener('keydown', (e) => {
  let newDir = directions[e.keyCode];

  if (newDir !== undefined) {
    snake.setDir(newDir);
  }
});

function circle(x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

// Method which draw a circle
Block.prototype.drawCircle = function(color) {
  let centerX = this.col * blockSize + blockSize / 2;
  let centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};

function Apple() {
  this.position = new Block(Math.floor(Math.random() * (heightInBlocks)), Math.floor(Math.random() * (widthInBlocks)));
}

Apple.prototype.draw = function() {
  this.position.drawCircle('#D45A77');
  console.log('Apple col: ' + this.position.col);
  console.log('Apple row: ' + this.position.row);
};

Apple.prototype.move = function() {
  let randomCol = Math.floor(Math.random() * (heightInBlocks));
  let randomRow = Math.floor(Math.random() * (widthInBlocks));
  this.position = new Block(randomCol, randomRow);
};

const snake = new Snake();
const apple = new Apple();

function endGame(intervalId) {
  endGameElement.style.visibility = 'visible';
  clearInterval(intervalId);
}

function startGame() {
  console.log(width, height);
  let intervalId = setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
  }, time);
}

startGameButton.addEventListener('click', () => {
  startGame();
  startGameButton.style.visibility = 'hidden';
});

