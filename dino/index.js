const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 250;
const dinoImage = document.getElementById("dino");
const roadImage = document.getElementById("road");
const cloudImage = document.getElementById("cloud");
const cactusImage = document.getElementById("cactus");
const restartImage = document.getElementById("restart-btn");
const leftRunImage = document.getElementById("left-run");
const rightRunImage = document.getElementById("right-run");
const dinoSprites = document.getElementById("dino-sprites");

const jumpSound = new Audio("./assets/jump_sound.wav");
const gameOverSound = new Audio("./assets/game_over_sound.wav");
let gameOverSoundActive = false;
const checkpointSound = new Audio("./assets/checkpoint.wav");

let gameOver = false;

class Player {
  constructor(game) {
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.x = 30;
    this.y = 165;
    this.groundY = 165;
    this.speedX = 10;
    this.speedY = 0;
    this.gravity = 0.5;
    this.jumpStrengh = -10;
    this.grounded = true;
    this.frames = 0;
  }
  update() {
    if (gameOver) return;
    this.speedY += this.gravity;
    this.y += this.speedY;
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.speedY = 0;
      this.grounded = true;
    }
    if (!gameOver) {
      if (this.game.keys.includes("ArrowUp") && this.grounded) {
        jumpSound.play();
        this.speedY = this.jumpStrengh;
        this.grounded = false;
      }
    }
  }
  draw() {
    this.frames += 1;

    if (!this.game.gameStart || gameOver || !this.grounded) {
      ctx.drawImage(
        dinoSprites,
        1335,
        0,
        85,
        100,
        this.x,
        this.y,
        this.game.player.width,
        this.game.player.height
      );
    } else {
      if (this.frames % 20 < 10) {
        ctx.drawImage(
          dinoSprites,
          1602,
          0,
          85,
          100,
          this.x,
          this.y,
          this.game.player.width,
          this.game.player.height
        );
      } else {
        ctx.drawImage(
          dinoSprites,
          1515,
          0,
          85,
          100,
          this.x,
          this.y,
          this.game.player.width,
          this.game.player.height
        );
      }
    }
  }
}

class Game {
  constructor() {
    this.width = 600;
    this.height = 250;
    this.x = 0;
    this.y = 0;
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.keys = [];
    this.clouds = new Clouds(this);
    this.road = new Road(this);
    this.cactus = new Cactus(this);
    this.score = new Interface(this);
    this.gameSpeed = -5;

    this.gameScore = 0;
    this.gameStart = false;

    this.scoreCheckpoint = 0;
  }
  draw() {
    if (gameOver === true) {
      this.gameSpeed = 0;
      this.clouds.speedX = 0;
      this.scoreCheckpoint = 0;
    } else {
      this.clouds.speedX = -0.3;
    }
    if (this.gameScore - this.scoreCheckpoint === 100) {
      checkpointSound.volume = 0.5;
      checkpointSound.play();
      this.gameSpeed -= 0.4;
      this.scoreCheckpoint = this.gameScore;
    }

    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.clouds.draw(this);
    this.road.draw(this);
    this.player.draw(this);
    this.cactus.draw(this);
    this.score.draw(this);
  }
  update() {
    this.player.update(this);
    this.road.update(this);
    this.clouds.update(this);
    this.cactus.update(this);
    this.score.update(this);
    checkCollision(this.player, this.cactus);
  }
}

class InputHandler {
  constructor(game) {
    this.game = game;
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && this.game.keys.indexOf(e.key) === -1) {
        this.game.keys.push(e.key);
      }
    });
    window.addEventListener("keyup", (e) => {
      this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
      if (e.key == "ArrowUp" || e.key == " ") {
        this.game.gameStart = true;
      }
    });

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      let clickX = e.clientX - rect.left;
      let clickY = e.clientY - rect.top;
      if (
        clickX >= 286 &&
        clickX <= 320 &&
        clickY >= 123 &&
        clickY <= 162 &&
        gameOver
      ) {
        gameOver = false;
        this.game.gameSpeed = -5;
        this.game.gameStart = false;
        this.game.player.x = 30;
        this.game.player.y = 160;
        this.game.road.x = 0;
        this.game.road.y = 200;
        this.game.cactus.x =
          Math.random() * (this.game.width * 1.5) + this.game.width;
        this.game.gameStart = true;
        gameOverSoundActive = false;
      }
    });
  }
}

class Clouds {
  constructor() {
    this.x = [10, 170, 220, 300, 450, 550];
    this.y = [50, 10, 70, 20, 30, 50];
    this.height = 100;
    this.width = 100;
    this.speedX = -0.3;
  }
  update() {
    for (let i = 0; i < this.x.length; i++) {
      if (this.x[i] > -this.width) {
        this.x[i] += this.speedX;
      } else {
        this.x[i] = game.width;
      }
    }
  }
  draw() {
    for (let i = 0; i < this.x.length; i++) {
      ctx.drawImage(cloudImage, this.x[i], this.y[i]);
    }
  }
}

class Road {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 200;
    this.speedX;
    this.width = canvas.width;
  }
  update() {
    this.speedX = this.game.gameSpeed;
    this.x += this.speedX;
    if (this.x <= -this.width) {
      this.x = 0;
    }
  }
  draw() {
    ctx.drawImage(roadImage, this.x, this.y);
  }
}

class Cactus {
  constructor(game) {
    this.game = game;
    this.x = Math.random() * (this.game.width * 1.5) + this.game.width;
    this.y = 150;
    this.width = 50;
    this.height = 80;
    this.speedX;
    this.currentCactus = Math.floor(Math.random() * 2 + 1);
  }
  update() {
    if (gameOver) return;
    this.speedX = this.game.gameSpeed;
    this.x += this.speedX;
    if (this.x <= -this.width) {
      this.currentCactus = Math.floor(Math.random() * 3 + 1);
      this.x = Math.random() * (this.game.width * 1.5) + this.game.width;
    }
  }

  draw() {
    if (this.currentCactus === 1) {
      this.y = 150;
      ctx.drawImage(cactusImage, this.x, this.y, this.width, this.height);
    } else if (this.currentCactus === 2) {
      this.y = 150;
      ctx.drawImage(dinoSprites, 440, 0, 110, 100, this.x, this.y + 20, 70, 70);
    } else {
      this.y = 130;
      if (this.game.player.frames % 30 < 15 && !gameOver) {
        ctx.drawImage(
          dinoSprites,
          348,
          8,
          100,
          100,
          this.x,
          this.y + 20,
          60,
          50
        );
      } else {
        ctx.drawImage(
          dinoSprites,
          255,
          8,
          100,
          100,
          this.x,
          this.y + 20,
          60,
          50
        );
      }
    }
  }
}

class Interface {
  constructor(game) {
    this.game = game;
    this.x = 540;
    this.y = 35;
    this.startTime = null;
  }

  update() {
    if (!gameOver && this.game.gameStart) {
      if (this.startTime === null) {
        this.startTime = Date.now();
      }
      this.game.gameScore = Math.floor((Date.now() - this.startTime) / 100);
    }
    if (gameOver) {
      this.startTime = null;
    }
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(this.game.gameScore, this.x, this.y);

    if (gameOver) {
      ctx.save();
      ctx.font = "26px Arial";
      ctx.shadowColor = "grey";
      ctx.shadowOffsetX = 1.5;
      ctx.fillText("Game Over", 230, 110);
      ctx.restore();
      ctx.drawImage(restartImage, 280, 120, 50, 50);
    }
  }
}

function checkCollision(player, cactus) {
  if (
    player.x - 25 <= cactus.x - 55 + cactus.width &&
    player.x - 25 + player.width >= cactus.x + 15 &&
    player.y - 25 <= cactus.y - 15 + cactus.height &&
    player.y - 25 + player.height >= cactus.y - 15
  ) {
    gameOver = true;
    if (!gameOverSoundActive) {
      gameOverSound.play();
      gameOverSoundActive = true;
    }
  }
}

const game = new Game(canvas.width, canvas.height);
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  game.draw(ctx);
  if (game.gameStart) {
    game.update();
  }
  requestAnimationFrame(animate);
}

animate();
