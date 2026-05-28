const field = document.getElementById("canva");
const ctx = field.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");

field.width = window.innerWidth;
field.height = window.innerHeight;

const size = 20;

function resizeCanvas() {
  field.width = Math.floor(window.innerWidth / size) * size;
  field.height = Math.floor(window.innerHeight / size) * size;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

let snake;
let direction;
let apple;
let game;
let score;
let bestScore = localStorage.getItem("snake_best") || 0;
bestEl.textContent = bestScore;

// Звуки
const eatSound = new Audio("bite.mp3");
const gameOverSound = new Audio("lose.mp3");

// Створення яблука
function createApple() {
  const cols = Math.floor(field.width / size);
  const rows = Math.floor(field.height / size);

  let newApple;

  do {
    newApple = {
      x: Math.floor(Math.random() * cols) * size,
      y: Math.floor(Math.random() * rows) * size,
    };
  } while (
    snake.some(
      (segment) => segment.x === newApple.x && segment.y === newApple.y
    )
  );

  return newApple;
}

// Відмальовування поля
function render() {
  // Фон
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, field.width, field.height);

  // Яблуко
  // Яблуко
  ctx.beginPath();
  ctx.arc(apple.x + size / 2, apple.y + size / 2, size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();

  // Змія
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Голова
      ctx.fillStyle = "green";
    } else {
      // Тулуб
      ctx.fillStyle = "#50FF50";
    }

    ctx.fillRect(segment.x, segment.y, size, size);
  });
}

// Рухи
function move() {
  let head = { ...snake[0] };

  if (direction === "right") head.x += size;
  if (direction === "left") head.x -= size;
  if (direction === "up") head.y -= size;
  if (direction === "down") head.y += size;

  // Перехід за краї екрану / Телепорт
  if (head.x >= field.width) head.x = 0;
  if (head.x < 0) head.x = field.width - size;

  if (head.y >= field.height) head.y = 0;
  if (head.y < 0) head.y = field.height - size;

  // Удар об хвіст
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  // Поїдання яблука
  if (head.x === apple.x && head.y === apple.y) {
    eatSound.currentTime = 0;
    eatSound.play();

    score++;
    scoreEl.textContent = score;

    if (score > bestScore) {
      bestScore = score;

      localStorage.setItem("snake_best", bestScore);

      bestEl.textContent = bestScore;
    }

    apple = createApple();
  } else {
    snake.pop();
  }

  render();
}

// Програш
function gameOver() {
  clearInterval(game);

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  menu.style.display = "flex";
  startBtn.textContent = "Restart";
}

// Старт
function startGame() {
  snake = [{ x: 100, y: 100 }];
  direction = "right";
  apple = createApple();
  score = 0;

  scoreEl.textContent = score;

  clearInterval(game);

  game = setInterval(move, 150);

  menu.style.display = "none";

  render();
}

startBtn.addEventListener("click", startGame);

// Івент Лістенери (Настикання на кнопки)
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight" && direction !== "left") {
    direction = "right";
  }

  if (e.code === "ArrowLeft" && direction !== "right") {
    direction = "left";
  }

  if (e.code === "ArrowUp" && direction !== "down") {
    direction = "up";
  }

  if (e.code === "ArrowDown" && direction !== "up") {
    direction = "down";
  }

  if (e.code === "Escape") {
    clearInterval(game);
  }
});
