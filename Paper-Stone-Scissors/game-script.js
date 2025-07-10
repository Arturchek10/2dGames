window.addEventListener("load", function () {
  console.log("page is fully loaded");
  // canvas setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1200;
  canvas.height = 500;

  class Inputhandler {
    constructor(game) {
      this.game = game;
      // обработка нажатия клавиш
      window.addEventListener("keydown", (e) => {
        // e.key - клавиша которую нажали, например "ArrowLeft"
        // проверяем значение e.key и проверяем находится ли это значение в массиве keys. Если не находится то добавляем в keys
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key); // добавялем в массив keys (создан в классе Game)
        } else if (e.key === " ") {
          this.game.player.shootTop();
        }
      });
      //обаботка отпускания клавиш
      window.addEventListener("keyup", (e) => {
        // проверяем есть ли эта клавиша в массиве keys, если есть удаляем ее
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  // класс для снарядов
  class Projectile {
    // класс будет содержать аргумент game - для доступа к свойствам игры, и координаты x и y,
    // так как начальные координаты каждого снаряда будут зависеть от текущего положения игрока
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.95) {
        this.markedForDeletion = true;
      }
    }
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Particle {}

  class Player {
    // Конструктор игрока принимает объект game и сохраняет ссылку на него.
    // Это нужно, чтобы игрок мог взаимодействовать с "миром".
    constructor(game) {
      this.game = game;
      this.width = 110;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      this.maxSpeed = 2;
      this.projectiles = [];
    }
    update() {
      if (this.game.keys.includes("ArrowUp")) {
        this.speedY = -this.maxSpeed;
      } else if (this.game.keys.includes("ArrowDown")) {
        this.speedY = this.maxSpeed;
      } else {
        this.speedY = 0;
      }
      this.y += this.speedY;

      //handle projectiles
      //  в this.projectiles хранится массив всех снарядов, которые выпустил игрок.
      // Метод forEach перебирает каждый объект Projectile внутри массива
      // Для каждого снаряда вызывается его метод update():
      // Каждый вызов update() сдвигает снаряд вправо (увеличивает x на speed)
      // Если снаряд долетел до 80% ширины экрана, он помечается на удаление: markedForDeletion = true
      // После обновления фильтруем массив — оставляем только те снаряды, которые ещё не помечены на удаление
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
    }
    draw(context) {
      context.fillStyle = "black"; // окрашивает прямоугольник в желтый
      context.fillRect(this.x, this.y, this.width, this.height); // рисует прямоугольник

      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    shootTop() {
      // проверка на доступность боеприпасов. С каждым добавлением нового боеприпаса их количесво уменьшается на 1
      if (this.game.ammo > 0) {
        // метод добавляющий каждый новый объект снаряда в массив projectiles
        this.projectiles.push(new Projectile(this.game, this.x + 105, this.y)); // передаем в аргументы саму игру и координаты
        this.game.ammo -= 1;
      }
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = -2;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
    }
    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = "black";
      context.font = "20px Helvetica";
      context.fillText(this.lives, this.x, this.y);
    }
  }
  // создаем класс для подвида врага. Этот класс будет наследовать Enemy. Если свойства не будут найдены автоматически
  // начнется поиск в родительском классе
  class Angler1 extends Enemy {
    constructor(game) {
      super(game); // вызов конструктора родителя чтобы быть уверенным что он выполнится
      this.width = 228 * 0.2;
      this.height = 169 * 0.2;
      //рандомное значение умножаем на высоту 90% всего канваса и вычитаем высоту самого врага, чтобы он не вылез за пределы
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
  }

  class Layer {}

  class Background {}

  class UI {
    // отрисовка кол ва патронов
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvetica";
      this.color = "white";
    }
    update() {}

    draw(context) {
      context.save();
      context.font = this.fontSize + "px" + this.fontFamily;
      context.fillStyle = this.color;
      // score
      context.fillText("Score: " + this.game.score, 20, 40);
      // запас патронов.
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(10 * i + 20, 50, 5, 20); // x, y, width, height. x = 5 пикселей умножаем на номер патрона i и получается что
        //  каждый новый патрон отображается праве на 5 пикселей. +20 означает изначальный отступ всех патронов от края холста.
      }
      context.restore();
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this); // Создаём объект Player, передаём туда this — ссылку на саму игру,
      // чтобы игрок мог получить доступ к её свойствам.
      this.input = new Inputhandler(this);
      this.keys = [];
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.ammo = 20; // количество боеприпасов
      this.maxAmmo = 50; // максимально допустимое количество патронов
      this.ammoTimer = 0; // таймер накопления боеприпасов
      this.ammoInterval = 500; //интервал перезарядки (в миллисекундах): раз в 500 мс добавляется 1 патрон
      this.ui = new UI(this);

      this.gameOver = false;
      this.score = 0;
      this.winningScore = 5;
    }
    update(deltaTime) {
      this.player.update(deltaTime);

      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
          enemy.markedForDeletion = true;
        }
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0) {
              enemy.markedForDeletion = true;
              this.score++;
              if (this.score > this.winningScore) {
                this.gameOver = true;
              }
            }
          }
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }
    addEnemy() {
      this.enemies.push(new Angler1(this));
    }
    // метод для проверки столкновения прямоугольников. true если столкновение было false если не было
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
  }
  const game = new Game(canvas.width, canvas.height);
  
  
  // animation loop
  let lastTime = 0; // эта переменная будет хранить значение времени предыдущей анимации

  function animate(currentTime) {
    const deltaTime = currentTime - lastTime; // разница времени между текущим и предыдущей анимацией
    lastTime = currentTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // очищаем полотно перед след анимацией
    game.draw(ctx);
    game.update(deltaTime);
    requestAnimationFrame(animate); // запускает функцию анимации примерно 60 раз в секунду
  }
  animate(0);
});
