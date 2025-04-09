const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const coinDisplay = document.getElementById('coins');
const charSelect = document.getElementById('character-select');

let lane = 1;
let score = 0;
let coins = 0;
let gameRunning = true;
let isInvincible = false;
let gameSpeed = 30;
const lanes = [30, 120, 210];
let highScore = localStorage.getItem('subwayHighScore') || 0;

// 🎧 Autoplay fix
document.addEventListener('keydown', () => {
  document.getElementById('bg-music').play();
}, { once: true });


// 🎮 Controls
function movePlayer() {
  player.style.left = `${lanes[lane]}px`;
}
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  if (e.key === 'ArrowLeft' && lane > 0) lane--;
  else if (e.key === 'ArrowRight' && lane < 2) lane++;
  movePlayer();
});
document.getElementById('leftBtn').onclick = () => {
  if (lane > 0) lane--;
  movePlayer();
};
document.getElementById('rightBtn').onclick = () => {
  if (lane < 2) lane++;
  movePlayer();
};

// 🎯 Game Logic
function createObstacleOrCoin() {
  const isCoin = Math.random() < 0.3;
  const isPower = !isCoin && Math.random() < 0.1;

  const obj = document.createElement('div');
  const objLane = Math.floor(Math.random() * 3);
  obj.style.left = `${lanes[objLane]}px`;
  obj.className = `absolute top-0 w-[60px] h-[60px] ${
    isCoin ? 'bg-yellow-400' : isPower ? 'bg-green-400' : 'bg-red-500'
  } rounded-full`;
  game.appendChild(obj);

  let pos = 0;
  const fall = setInterval(() => {
    if (!gameRunning) {
      clearInterval(fall);
      obj.remove();
      return;
    }

    pos += 5;
    obj.style.top = `${pos}px`;

    const collided = pos > 430 && objLane === lane;

    if (collided) {
      if (isCoin) {
        coins++;
        coinDisplay.textContent = `Coins: ${coins}`;
        score += 5;
        obj.remove();
        clearInterval(fall);
      } else if (isPower) {
        isInvincible = true;
        player.classList.add('ring-4', 'ring-green-400');
        setTimeout(() => {
          isInvincible = false;
          player.classList.remove('ring-4', 'ring-green-400');
        }, 5000);
        obj.remove();
        clearInterval(fall);
      } else if (!isInvincible) {
        clearInterval(fall);
        gameOver();
      }
    }

    if (pos > 500) {
      clearInterval(fall);
      obj.remove();
      if (!isCoin && !isPower) score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  }, gameSpeed);
}

function gameOver() {
  gameRunning = false;
  if (score > highScore) {
    localStorage.setItem('subwayHighScore', score);
    highScore = score;
  }

  const overText = document.createElement('div');
  overText.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center';
  overText.innerHTML = `
    <p class="text-2xl font-bold text-red-500">💥 Game Over!</p>
    <p class="text-white mt-2">Score: ${score}</p>
    <p class="text-yellow-400 mt-1">🏆 High Score: ${highScore}</p>
    <button onclick="restartGame()" class="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded text-white">Restart</button>
  `;
  game.appendChild(overText);
}

function restartGame() {
  window.location.reload();
}

movePlayer();

setInterval(() => {
  if (gameRunning) {
    createObstacleOrCoin();
  }
}, 800);

setInterval(() => {
  if (gameRunning && gameSpeed > 10) {
    gameSpeed -= 1;
  }
}, 3000);
