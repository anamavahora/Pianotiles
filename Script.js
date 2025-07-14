const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");
const tapSound = document.getElementById("tap-sound");
const bgMusic = document.getElementById("bg-music");

let score = 0;
let tileSpeed = 2;
let interval;
let tiles = [];

function createTile() {
  const tile = document.createElement("div");
  tile.classList.add("tile", "black");
  const lane = Math.floor(Math.random() * 5);
  tile.style.left = `${(100 / 5) * lane}%`;
  tile.style.width = `${100 / 5}%`;
  tile.style.top = "-150px";
  board.appendChild(tile);
  tiles.push(tile);
}

function moveTiles() {
  tiles.forEach((tile, index) => {
    let top = parseFloat(tile.style.top);
    top += tileSpeed;
    tile.style.top = `${top}px`;

    if (top >= 600) {
      // Missed tile
      gameOver();
    }
  });
}

function gameLoop() {
  moveTiles();
  if (Math.random() < 0.03) {
    createTile();
  }
}

function gameOver() {
  clearInterval(interval);
  bgMusic.pause();
  alert("Game Over! Final Score: " + score);
  location.reload();
}

function startGame() {
  interval = setInterval(gameLoop, 16);
  bgMusic.volume = 0.3;
  bgMusic.play();
}

// Tap handling
board.addEventListener("click", function (e) {
  const clickedX = e.offsetX;
  const laneWidth = board.clientWidth / 5;
  const lane = Math.floor(clickedX / laneWidth);

  let hit = false;
  tiles.forEach((tile, index) => {
    const tileTop = parseFloat(tile.style.top);
    if (
      tileTop >= 450 &&
      tileTop <= 600 &&
      parseFloat(tile.style.left) === (100 / 5) * lane
    ) {
      tapSound.currentTime = 0;
      tapSound.play();
      board.removeChild(tile);
      tiles.splice(index, 1);
      score++;
      tileSpeed += 0.01; // Speed up
      scoreEl.textContent = "Score: " + score;
      hit = true;
    }
  });

  if (!hit) {
    gameOver(); // Tapped wrong lane
  }
});

startGame();
