const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let girl = { x: 50, y: 300, width: 30, height: 40, speed: 5 };
let stork = { x: 0, y: 0, width: 40, height: 40, speed: 2 };
let bunnies = [];
let obstacles = [];
let poops = [];
let carrots = [];
let purples = [];
let score = 0;
let level = 1;
let frame = 0;

// controls
let keys = {};
document.addEventListener('keydown', (e) => { keys[e.code] = true; });
document.addEventListener('keyup', (e) => { keys[e.code] = false; });

function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function update() {
  frame++;

  // move girl
  if (keys['ArrowRight']) girl.x += girl.speed;
  if (keys['ArrowLeft']) girl.x -= girl.speed;
  if (keys['ArrowUp']) girl.y -= girl.speed;
  if (keys['ArrowDown']) girl.y += girl.speed;

  // keep girl in canvas
  girl.x = Math.max(0, Math.min(canvas.width - girl.width, girl.x));
  girl.y = Math.max(0, Math.min(canvas.height - girl.height, girl.y));

  // move stork
  if (stork.x < girl.x) stork.x += stork.speed;
  if (stork.x > girl.x) stork.x -= stork.speed;

  // stork poop
  if (frame % 100 === 0) {
    poops.push({ x: stork.x + 15, y: stork.y + 40, width: 10, height: 15 });
  }

  poops.forEach(p => p.y += 3);

  // collision detection
  poops = poops.filter(p => {
    if (isColliding(girl, p)) {
      score = Math.max(0, score - 10);
      return false;
    }
    return p.y < canvas.height;
  });

  // generate carrots and bunnies
  if (frame % 80 === 0) {
    carrots.push({ x: canvas.width, y: Math.random() * (canvas.height - 30), width: 20, height: 20 });
  }

  if (frame % 200 === 0) {
    bunnies.push({ x: canvas.width, y: Math.random() * (canvas.height - 30), width: 20, height: 20 });
  }

  // move and collect
  carrots.forEach(c => c.x -= 2);
  bunnies.forEach(b => b.x -= 2);

  carrots = carrots.filter(c => {
    if (isColliding(girl, c)) {
      score += 5;
      return false;
    }
    return c.x > 0;
  });

  bunnies = bunnies.filter(b => {
    if (isColliding(girl, b)) {
      score += 10;
      return false;
    }
    return b.x > 0;
  });

  // purples start in level 3
  if (level >= 3 && frame % 150 === 0) {
    purples.push({ x: canvas.width, y: Math.random() * (canvas.height - 30), width: 15, height: 15 });
  }

  purples = purples.filter(p => {
    p.x -= 3;
    if (isColliding(girl, p)) {
      girl.speed += 2;
      setTimeout(() => girl.speed = 5, 2000); // speed boost lasts 2s
      return false;
    }
    return p.x > 0;
  });

  // level up
  if (score >= level * 50) {
    level++;
    stork.speed += 1;
  }

  // update display
  document.getElementById("levelDisplay").textContent = `Level: ${level}`;
  document.getElementById("scoreDisplay").textContent = `Score: ${score}`;
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(girl, '#ff66cc'); // girl = pink
  drawRect(stork, '#9999ff'); // stork = blue-gray

  bunnies.forEach(b => drawRect(b, '#fff'));
  carrots.forEach(c => drawRect(c, '#ffa500'));
  poops.forEach(p => drawRect(p, '#654321'));
  purples.forEach(p => drawRect(p, '#a259ff'));
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

