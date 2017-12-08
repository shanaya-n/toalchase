
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("meter");
const buttonWidth = 140;
const buttonHeight = 35;
const buttonX = canvas.width / 2 - buttonWidth / 2;
const buttonY = canvas.height / 2 + buttonHeight;

let timer = 0;
let score = 0;
let isPaused = false;

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    this.image = new Image();
    this.image.src = "https://is05.ezphotoshare.com/2017/12/01/zTPDmp.png";
    Object.assign(this, { x, y, radius, color, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 70, 80);
  }
}

let player = new Player(250, 150, 15, "lemonchiffon", 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, { x, y, radius, color, speed });
  }
}

let enemies = [
  new Enemy(80, 200, 20, "rgba(250, 0, 50, 0.8)", 0.042),
  new Enemy(200, 250, 17, "rgba(200, 100, 0, 0.7)", 0.03),
  new Enemy(150, 180, 22, "rgba(50, 10, 70, 0.5)", 0.02)
];

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= 2;
    }
  });
  document.getElementById("score").innerHTML = score;
}

function clearBackground() {
  ctx.fillStyle = "#cce6ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setColor() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameOver() {
  if (progressBar.value <= 0) {
    setColor();
    ctx.font = "30px Bungee Inline";
    ctx.fillStyle = "#ccccff";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    Button = function(x, y, buttonWidth, buttonHeight) {
      ctx.fillRect(x, y, buttonWidth, buttonHeight);
      ctx.fillStyle = "blue";
      ctx.font = "15px Bungee Inline";
      ctx.fillText(
        "PLAY AGAIN",
        canvas.width / 2,
        canvas.height / 2 + buttonHeight + buttonHeight / 1.5
      );
      this.click = function() {
        console.log("clicked");
      }
    };
    function init() {
        var button = new Button(
          buttonX,
          buttonY,
          buttonWidth,
          buttonHeight
        );
        }

    $('document').ready(() => {
      init();
    })

   } else {
     requestAnimationFrame(drawScene);
  }
}

window.addEventListener("keyup", function(e) {
  console.log(e.keyCode);
  if (e.keyCode === 32) {
    isPaused = !isPaused;
  }
});

$("#canvas").click((e) => {
  console.log(canvas);
  if (progressBar.value > 0) {
    return;
  }
  let x = e.pageX - canvas.offsetLeft;
  let y = e.pageY - canvas.offsetTop;
  if (
    x >= buttonX &&
    x <= buttonX + buttonWidth &&
    y >= buttonY &&
    y <= buttonY + buttonHeight
  )
    restartGame();
});

function restartGame() {
  player = new Player(250, 150, 15, "lemonchiffon", 0.07);
  enemies = [
  new Enemy(80, 200, 20, "rgba(250, 0, 50, 0.8)", 0.042),
  new Enemy(200, 250, 17, "rgba(200, 100, 0, 0.7)", 0.03),
  new Enemy(150, 180, 22, "rgba(50, 10, 70, 0.5)", 0.02)
];
  progressBar.value = 100;

  requestAnimationFrame(drawScene);

}

function drawScene() {
  if (isPaused) {
    requestAnimationFrame(drawScene);
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    ctx.font = "40px 'VT323'";
  } else {
    clearBackground();
    player.draw();
    enemies.forEach(enemy => enemy.draw());
    updateScene();
    gameOver();
    timer++;
    if (timer % 100 === 0) {
      score++;
    }
  }
}

requestAnimationFrame(drawScene);
