// play again button
// powerups
// add more enemies
// space bar = pause

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("meter");
let timer = 0;
let score = 0;

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}

class Button {
 constructor(x, y, width, height, color, text){
   Object.assign(this, {x,y,width,height,color,text});
 }
  draw() {
    ctx.font = "15px Bungee Inline";
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.fillText(this.text, this.x, this.y);
  }
  // this.onclick = requestAnimationFrame(drawScene);
  // this.onclick = function () {
  //   console.log(this);
  // }
}

let button = new Button((canvas.width/2)-50, (canvas.height/2)+40, 140, 30, "rgba(255,255,255,1)","Play Again");

(function() {
  console.log(ctx);
})();

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
  new Enemy(80, 200, 20, "rgba(250, 0, 50, 0.8)", 0.02),
  new Enemy(200, 250, 17, "rgba(200, 100, 0, 0.7)", 0.01),
  new Enemy(150, 180, 22, "rgba(50, 10, 70, 0.5)", 0.002)
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
  document.getElementById('score').innerHTML = score;
}

// function clearBackground() {
//   var background = new Image();
//   background.src = "http://nmgncp.com/latest-desktop-background/5442037.html";
//   background.onload = function() {
//     ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
//   };

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setColor(){
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameOver() {
 if (progressBar.value <= 0) {
   setColor();
   ctx.font = "30px Bungee Inline";
   ctx.fillStyle = "red";
   ctx.textAlign = "center";
   ctx.fillText("GAME OVER",canvas.width/2, canvas.height/2);
   button.draw();
 }
 else {
   requestAnimationFrame(drawScene);
 }
}

function drawScene() {
 clearBackground();
 player.draw();
 enemies.forEach(enemy => enemy.draw());
 updateScene();
 gameOver();
 evt();
 timer++;
  if(timer%100 === 0){
    score++;
  }
}

requestAnimationFrame(drawScene);
