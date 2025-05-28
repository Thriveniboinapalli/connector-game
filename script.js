const ROWS = 6;
const COLS = 7;
const board = document.getElementById("board");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset");
let gameBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let redScore = 0;
let yellowScore = 0;
let currentPlayer = "red";
let isPlayerTurn = true;

function createBoard() {
  board.innerHTML = "";
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
}

function updateScore() {
  document.getElementById("score-red").textContent = `You (Red): ${redScore}`;
  document.getElementById("score-yellow").textContent = `Chatai Bot (Yellow): ${yellowScore}`;
}

function checkWinner(row, col) {
  const directions = [
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 1, c: 1 },
    { r: 1, c: -1 },
  ];

  for (const { r, c } of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const newRow = row + r * i;
      const newCol = col + c * i;
      if (
        newRow >= 0 &&
        newRow < ROWS &&
        newCol >= 0 &&
        newCol < COLS &&
        gameBoard[newRow][newCol] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 4; i++) {
      const newRow = row - r * i;
      const newCol = col - c * i;
      if (
        newRow >= 0 &&
        newRow < ROWS &&
        newCol >= 0 &&
        newCol < COLS &&
        gameBoard[newRow][newCol] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 4) {
      return true;
    }
  }
  return false;
}

function playerMove(col) {
  if (!isPlayerTurn || gameBoard[0][col] !== null) return;

  let row;
  for (let i = ROWS - 1; i >= 0; i--) {
    if (gameBoard[i][col] === null) {
      row = i;
      break;
    }
  }

  gameBoard[row][col] = "red";
  document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).classList.add("red");

  if (checkWinner(row, col)) {
    redScore++;
    updateScore();
    message.textContent = "You Win! 🎉";
    board.style.pointerEvents = "none";
    return;
  }

  currentPlayer = "yellow";
  isPlayerTurn = false;
  message.textContent = "Chatai Bot's Turn (Yellow)";
  setTimeout(botMove, 500);
}

function botMove() {
  const col = Math.floor(Math.random() * COLS);
  let row;
  for (let i = ROWS - 1; i >= 0; i--) {
    if (gameBoard[i][col] === null) {
      row = i;
      break;
    }
  }

  gameBoard[row][col] = "yellow";
  document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`).classList.add("yellow");

  if (checkWinner(row, col)) {
    yellowScore++;
    updateScore();
    message.textContent = "Chatai Bot Wins! 🤖";
    board.style.pointerEvents = "none";
    return;
  }

  currentPlayer = "red";
  isPlayerTurn = true;
  message.textContent = "Your Turn (Red)";
}

function resetGame() {
  gameBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  currentPlayer = "red";
  isPlayerTurn = true;
  message.textContent = "Your Turn (Red)";
  board.style.pointerEvents = "auto";
  createBoard();
  updateScore();
}

board.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) return;
  const col = parseInt(e.target.dataset.col);
  playerMove(col);
});

resetButton.addEventListener("click", resetGame);

createBoard();
updateScore();
