const gameCells = document.querySelector(".game");
const restartEl = document.getElementById("restart");

const winScore = 15;
let gameOver = false;

let cells = new Array(16).fill(0).map((_item, index) => index + 1);
cells = shuffleArray(cells);
addCellToDOM(cells);
function addCellToDOM(cells) {
  for (i of cells) {
    let cellEl = document.createElement("button");
    cellEl.classList.add("cell");
    cellEl.textContent = i;
    if (i == 16) {
      cellEl.id = "void";
    }
    gameCells.append(cellEl);
    // добавляем ячейки в DOM внутрь gameCells
  }
}

let items = gameCells.querySelectorAll(".cell");

let matrix = getMatrix(items);

gameCells.addEventListener("click", (e) => {
  if (!gameOver) {
    if (e.target.id === "void") return false;

    let voidPos = findVoid(matrix);
    let elPos = findEl(matrix, e.target);

    if (nextTo([...elPos], [...voidPos])) {
      const [y1, x1] = elPos;
      const [y2, x2] = voidPos;

      let elCell = matrix[y1][x1]; // ячейка
      let voidCell = matrix[y2][x2]; // пустая ячейка

      let currNum = elCell.textContent;
      // меняем id обоих ячеек
      if (
        elCell.id === "" ||
        elCell.id === "correct" ||
        elCell.id === "incorrect"
      ) {
        elCell.id = "void";
        elCell.textContent = "";
      }
      if (voidCell.id === "void") {
        voidCell.id = "";
        voidCell.textContent = currNum;
      }
      isCorrectNum(matrix);
      checkWin(matrix);
    }
  }
});

// находим координаты пустой ячейки
function findVoid(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x].id === "void") {
        return [y, x];
      }
    }
  }
}

// находим координаты элемента на который кликнули
function findEl(matrix, el) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x] == el) {
        return [y, x];
      }
    }
  }
}

// заполнение матрицы  массивом
function getMatrix(arr) {
  let matrix = [[], [], [], []];
  let x = 0;
  let y = 0;
  for (let i = 0; i < arr.length; i++) {
    if (x === 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}

// проверка находится ли пустой элемент рядом с выбранным
//  если разница по оси x + разница по оси y === 1 значит пустая ячейка рядом
function nextTo([y1, x1], [y2, x2]) {
  const x = Math.abs(x1 - x2);
  const y = Math.abs(y1 - y2);
  if (x + y === 1) {
    return true;
  } else {
    return false;
  }
}

// надо проверить соответствует ли textContent передаваемого элемента порядковому номеру в матрице
function isCorrectNum(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (
        matrix[y][x].textContent == y * 4 + x + 1 &&
        matrix[y][x].id !== "void"
      ) {
        matrix[y][x].id = "correct";
      } else if (
        matrix[y][x].textContent != y * 4 + x + 1 &&
        matrix[y][x].id !== "void"
      ) {
        matrix[y][x].id = "incorrect";
      }
    }
  }
}
isCorrectNum(matrix);

function restartGame() {
  gameOver = false;
  cleanGameBoard();
  const newCells = shuffleArray(cells);
  addCellToDOM(newCells);
  items = gameCells.querySelectorAll(".cell");
  matrix = getMatrix(items);
  isCorrectNum(matrix);
  textWinEl.classList.add("hidden");
  textWinEl.classList.remove("visible");
  timerEl.textContent = `0:00`
  resultTime = 0
  start = Date.now()
}

function cleanGameBoard() {
  gameCells.innerHTML = "";
}

const textWinEl = document.querySelector(".text-win");
function checkWin(matrix) {
  let currentScore = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x].id === "correct") {
        currentScore += 1;
        if (currentScore === winScore) {
          gameOver = true;
          textWinEl.classList.remove("hidden");
          textWinEl.classList.add("visible");
        }
      }
    }
  }
}

// перемешка массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let start = Date.now() 

// time
const timerEl = document.getElementById('timer-score')
timerEl.textContent = `0:00`

function timer(){
  const current = Date.now()
  let resultTime = Math.floor((current - start) / 1000)
  let minutes = Math.floor(resultTime / 60)
  let seconds = String(Math.floor(resultTime % 60)).padStart(2, "0")
  let hours = Math.floor(resultTime / 3600)
  if (hours > 0){
    resultTime = `${hours}:${minutes}:${seconds}`
  } else {
    resultTime = `${minutes}:${seconds}`
  }
  timerEl.textContent = resultTime
}
setInterval(timer, 1000)
// 
restartEl.addEventListener("click", restartGame);
