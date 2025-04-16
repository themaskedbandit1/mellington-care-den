const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const levelDisplay = document.getElementById("levelDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const levelScreen = document.getElementById("levelScreen");
const levelStats = document.getElementById("levelStats");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const restartLevelBtn = document.getElementById("restartLevelBtn");

// === Constants ===
const INITIAL_SPEED = 5;
const CARROT_POINTS = 5;
const BUNNY_POINTS = 10;
const SPEED_BOOST = 2;
const BOOST_DURATION = 2000;
const POOP_DAMAGE = 1;
const HEART_COUNT = 3;
const LEVEL_SCORE_THRESHOLD = 50;
const STORK_POOP_INTERVAL = 3 * 60;
const STORK_RUN_INTERVAL = 8 * 60;

const OBJECT_SIZE = {
  girl: { width: 30, height: 40 },
  stork: { width: 40, height: 40 },
  carrot: { width: 20, height: 20 },
  bunny: { width: 20, height: 20 },
  poop: { width: 10, height: 15 },
  purple: { width: 15, height: 15 },
};

// === Game State ===
let girl, stork, bunnies, carrots, purples, poops;
let score, level, frame, keys, startTime;
let carrotCount, bunnyCount;
let paused = false;

function initGame(resetLevelOnly = false) {
  girl = {
    x: 50,
    y: 300,
    width: OBJECT_SIZE.girl.width,
    height: OBJECT_SIZE.girl.height,
    speed: INITIAL_SPEED,
    health: HEART_COUNT,
  };

  stork = {
    x: 0,
    y: 0,
    width: OBJECT_SIZE.stork.width,
    height: OBJECT_SIZE.stork.height,
    speed: 2 + (level - 1),
    mode: 'run',
  };

  bunnies = [];
  carrots = [];
  purples = [];
  poops = [];

  frame = 0;
  keys = {};
  carrotCount = 0;
  bunnyCount = 0;

  if (!resetLevelOnly) {
    score = 0;
    level = 1;
  }

  startTime = Date.now();
  levelScreen.style.display = "none";
  loop();
}

document.addEventListener('keydown', (e) => keys[e.code] = true);
document.addEventListener('keyup', (e) => keys[e.code] = false);

function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function isColliding(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function moveAndFilter(array, speed, onCollision) {
  return array.filter(obj => {
    obj.x -= speed;
    if (isColliding(girl, obj)) {
      onCollision?.(obj);
      return false;
    }
    return obj.x + obj.width > 0;
  });
}

function drawHearts() {
  for (let i = 0; i < girl.health; i++) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(20 + i * 20, 20, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleStork() {
  if (stork.x < girl.x) stork.x += stork.speed;
  if (stork.x > girl.x) stork.x -= stork.speed;

  if (stork.mode === 'run' && frame % STORK_RUN_INTERVAL === 0) stork.mode = 'poop';
  if (stork.mode === 'poop' && frame % STORK_POOP_INTERVAL === 0) stork.mode = 'run';

  if (stork.mode === 'poop' && frame % 15 === 0) {
    poops.push({
      x: stork.x + 15,
      y: stork.y + stork.height,
      width: OBJECT_SIZE.poop.width,
      height: OBJECT_SIZE.poop.height
    });
  }
}

function updateGirlMovement() {
  if (keys['ArrowRight']) girl.x += girl.speed;
  if (keys['ArrowLeft']) girl.x -= girl.speed;
  if (keys['ArrowUp']) girl.y -= girl.speed;
  if (keys['ArrowDown']) girl.y += girl.speed;

  girl.x = Math.max(0, Math.min(canvas.width - girl.width, girl.x));
  girl.y = Math.max(0, Math.min(canvas.height - girl.height, girl.y));
}

function update() {
  if (paused) return;

  frame++;
  updateGirlMovement();
  handleStork();

  if (frame % 80 === 0) {
    carrots.push({ x: canvas.width, y: Math.random() * (canvas.height - 30), ...OBJECT_SIZE.carrot });
  }

  if (frame % 200 === 0) {
    bunnies.push({ x: canvas.width, y: Math.random() * (canvas.height - 30), ...OBJECT_SIZE.bunny });
  }

  if (level >= 3 && frame % 150 === 0) {
    purples.push({ x: canvas.width, y: Math.random() * (canvas.height - 30), ...OBJECT_SIZE.purple });
  }

  carrots = moveAndFilter(carrots, 2, () => {
    score += CARROT_POINTS;
    carrotCount++;
  });

  bunnies = moveAndFilter(bunnies, 2, () => {
    score += BUNNY_POINTS;
    bunnyCount++;
  });

  purples = moveAndFilter(purples, 3, () => {
    girl.speed += SPEED_BOOST;
    setTimeout(() => girl.speed = INITIAL_SPEED, BOOST_DURATION);
  });

  poops = poops.filter(p => {
    p.y += 3;
    if (isColliding(girl, p)) {
      girl.health -= POOP_DAMAGE;
      return false;
    }
    return p.y < canvas.height;
  });

  if (girl.health <= 0) {
    alert('Game Over!');
    location.reload();
  }

  if (score >= level * LEVEL_SCORE_THRESHOLD) {
    paused = true;
    showLevelCompleteScreen();
  }

  levelDisplay.textContent = `Level: ${level}`;
  scoreDisplay.textContent = `Score: ${score}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(girl, '#ff66cc');
  drawRect(stork, '#9999ff');
  carrots.forEach(c => drawRect(c, '#ffa500'));
  bunnies.forEach(b => drawRect(b, '#ffffff'));
  purples.forEach(p => drawRect(p, '#a259ff'));
  poops.forEach(p => drawRect(p, '#654321'));
  drawHearts();
}

function loop() {
  update();
  draw();
  if (!paused) requestAnimationFrame(loop);
}

function showLevelCompleteScreen() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  levelStats.innerHTML = `
    <p>Level ${level} Complete!</p>
    <p>Time: ${elapsed}s</p>
    <p>Carrots: ${carrotCount}</p>
    <p>Bunnies: ${bunnyCount}</p>
  `;
  levelScreen.style.display = 'block';
}

nextLevelBtn.addEventListener("click", () => {
  level++;
  paused = false;
  initGame(true);
});

restartLevelBtn.addEventListener("click", () => {
  paused = false;
  initGame(true);
});

initGame();
