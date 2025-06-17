// ===== 要素の取得 =====
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameClearScreen = document.getElementById('game-clear-screen');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('time-left');
const finalScoreDisplay = document.getElementById('final-score');
const clearScoreDisplay = document.getElementById('clear-score');
const player = document.getElementById('player');
const gameArea = document.querySelector('.game-area');
const startButton = document.getElementById('start-button');

const bgm = new Audio('bgm/motech_bgm.mp3');
bgm.loop = true;

let gameEnded = false

const startSound = new Audio('bgm/motech_start.mp3');

// ✅ スタートボタンを押した時の処理
startButton.addEventListener("click", () => {
  const startSound = new Audio("bgm/motech_start.mp3");
  startSound.play();

  setTimeout(() => {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    startGame(); // 既存のゲーム開始関数を呼び出し
  }, 500);
});


// ===== 効果音 =====
const sounds = {
  bubu: new Audio('bgm/bubu.mp3'),
  idole: new Audio('bgm/idole_get.mp3'),
  heart: new Audio('bgm/kirakira.mp3'),
  point: new Audio('bgm/jump.wav')
};

function playSound(key) {
  const se = sounds[key];
  if (!se) return;
  se.pause(); // 同時再生防止
  se.currentTime = 0;
  se.play().catch(e => console.warn(`効果音エラー (${key}):`, e));
}

// ===== ゲーム状態 =====
let playerX = 50;
let playerY = 10;
let gameSpeed = 2;
let score = 0;
let lives = 3;
let timeLeft = 60;
let gameInterval, itemInterval, countdown;
let isDragging = false;
let bottomBanner;

// ===== ゲーム読み込み時のイベント =====
window.addEventListener('load', () => {
    bottomBanner = document.getElementById('game-banner');
    showScoreHistory();
  
    startButton.addEventListener('click', () => {
      // スタート音を再生
      startSound.play().catch(e => console.warn("スタート音が再生できません", e));
  
      // 少し待ってからゲームスタート
      setTimeout(() => {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startGame();
  
        // BGMも開始
        bgm.play().catch(e => console.warn("BGM再生がブロックされました", e));
      }, 500); // ← 再生に0.5秒余裕をもたせて切り替え
    });
  
    // キー操作やプレイヤーのポインター移動などはそのまま
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft') movePlayer(-15, 0);
      if (e.code === 'ArrowRight') movePlayer(15, 0);
      if (e.code === 'ArrowUp') movePlayer(0, 20);
      if (e.code === 'ArrowDown') movePlayer(0, -20);
    });
  
    player.addEventListener('pointerdown', () => isDragging = true);
    document.addEventListener('pointermove', (e) => {
      if (document.body.classList.contains('game-active')) {
        e.preventDefault();
      }
      const x = e.clientX - gameArea.offsetLeft - player.offsetWidth / 2;
      const y = gameArea.offsetHeight - (e.clientY - gameArea.offsetTop) - player.offsetHeight / 2;
      moveTo(x, y);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (document.body.classList.contains('game-active')) {
        e.preventDefault();
      }
    }, { passive: false });    

const goalSound = new Audio('bgm/motech_goal2.mp3');


function startGame() {
  document.body.classList.add('game-active');

  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  gameOverScreen.classList.add('hidden');
  gameClearScreen.classList.add('hidden');
  showBanner();


  score = 0;
  lives = 2;
  timeLeft = 60;
  playerX = 50;
  playerY = 10;
  gameSpeed = 1;
  isDragging = true;
  updateUI();
  updatePlayerPosition();

  gameInterval = setInterval(updateGame, 1000 / 60);
itemInterval = setInterval(spawnItem, 500);
countdown = setInterval(() => {
  timeLeft--;
  timerDisplay.textContent = timeLeft;

  // ゆるやかな加速
  if (timeLeft <= 10) {
    gameSpeed = 6;
  } else if (timeLeft <= 20) {
    gameSpeed = 5;
  } else if (timeLeft <= 30) {
    gameSpeed = 4;
  } else if (timeLeft <= 40) {
    gameSpeed = 3;
  } else if (timeLeft <= 50) {
    gameSpeed = 2;
  } else {
    gameSpeed = 1;
  }

  if (timeLeft <= 0) {
    clearInterval(countdown);
    endGame(true);
  }
}, 1000); // ← ✅ ここで終わったあとに…
} // ← ✅ この閉じカッコが必要！！


function updateUI() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    timerDisplay.textContent = timeLeft;
  }
  
  function moveTo(x, y) {
    const maxX = gameArea.clientWidth - player.offsetWidth;
    const maxY = gameArea.clientHeight - player.offsetHeight;
  
    playerX = Math.max(0, Math.min(x, maxX));
    playerY = Math.max(0, Math.min(y, maxY)); // ← 上限までOKにする
    updatePlayerPosition();
  }
  
  function movePlayer(dx, dy) {
    const maxX = gameArea.clientWidth - player.offsetWidth;
    const maxY = gameArea.clientHeight - player.offsetHeight;
  
    playerX = Math.max(0, Math.min(playerX + dx, maxX));
    playerY = Math.max(0, Math.min(playerY + dy, maxY)); // ← ここも
    updatePlayerPosition();
  }
  
  
  function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.bottom = `${playerY}px`;
  }
  

function spawnItem() {
  const items = [
    { src: 'img/item_star.png', score: 5 },
    { src: 'img/item_star.png', score: 5 },
    { src: 'img/item_star.png', score: 5 },
    { src: 'img/item_penlight.png', score: 10 },
    { src: 'img/item_penlight.png', score: 10 },
    { src: 'img/item_penlight.png', score: 10 },
    { src: 'img/item_uchiwa.png', score: 10 },
    { src: 'img/item_uchiwa.png', score: 10 },
    { src: 'img/item_uchiwa.png', score: 10 },
    { src: 'img/item_heart_green.png', life: 1 },
    { src: 'img/item_crow.png', score: -50 },
    { src: 'img/item_crow.png', score: -50 },
    { src: 'img/item_crow.png', score: -50 },
    { src: 'img/item_crow.png', score: -50 },
    { src: 'img/item_poop.png', life: -1 },
    { src: 'img/item_poop.png', life: -1 },
    { src: 'img/item_poop.png', life: -1 },
    { src: 'img/motech_idle.png', score: 100 }
  ];

  const item = items[Math.floor(Math.random() * items.length)];
  const el = document.createElement('img');
  el.src = item.src;
  el.classList.add('falling-item');
  el.dataset.score = item.score || 0;
  el.dataset.life = item.life || 0;
  el.style.top = `${Math.random() * 80 + 10}%`;
  el.style.right = '-60px';
  gameArea.appendChild(el);
}

function updateGame() {
  const items = document.querySelectorAll('.falling-item');
  items.forEach(item => {
    const r = parseFloat(item.style.right);
    item.style.right = `${r + gameSpeed}px`;

    const playerRect = player.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (
      playerRect.left < itemRect.right &&
      playerRect.right > itemRect.left &&
      playerRect.top < itemRect.bottom &&
      playerRect.bottom > itemRect.top
    ) {
      const itemScore = parseInt(item.dataset.score);
      const itemLife = parseInt(item.dataset.life);
      score += itemScore;
      lives += itemLife;
      if (lives > 3) lives = 3;

      const filename = item.getAttribute('src');
      if (filename.includes('item_crow.png') || filename.includes('item_poop.png')) {
        playSound('bubu');
      } else if (filename.includes('motech_idle.png')) {
        playSound('idole');
      } else if (filename.includes('item_heart_green.png')) {
        playSound('heart');
      } else if (
        filename.includes('item_star.png') ||
        filename.includes('item_penlight.png') ||
        filename.includes('item_uchiwa.png')
      ) {
        playSound('point');
      }

      item.remove();
      updateUI();
      if (lives <= 0) endGame(false);
    }

    if (r > window.innerWidth + 100) {
      item.remove();
    }
  });
}

function endGame(cleared) {
    if (gameEnded) return;         // ←多重呼び出しを防ぐ
    gameEnded = true;
  
    document.body.classList.remove('game-active');

    clearInterval(gameInterval);
    clearInterval(itemInterval);
    clearInterval(countdown);
    bgm.pause();
    bgm.currentTime = 0;
  
    gameScreen.classList.add('hidden');
    hideBanner();
  
    if (cleared) {
      gameClearScreen.classList.remove('hidden');
      clearScoreDisplay.textContent = score;
    } else {
      gameOverScreen.classList.remove('hidden');
      finalScoreDisplay.textContent = score;
    }
  
    saveScore(score);
    showScoreHistory();
  
    // 🔊効果音が多重再生されないように前処理
    goalSound.pause();
    goalSound.currentTime = 0;
    goalSound.play().catch(e => {
      console.warn('効果音の再生に失敗しました:', e);
    });
  
    // 🎥動画も表示
    const video = document.createElement('video');
    video.src = 'bgm/motech_goal.mp4';
    video.autoplay = true;
    video.muted = false;
    video.controls = false;
    video.style.width = '100%';
    video.style.height = 'auto';
    document.body.appendChild(video);
  }
  

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem('motech_scores')) || [];
  scores.unshift(score);
  localStorage.setItem('motech_scores', JSON.stringify(scores.slice(0, 3)));
}

function showScoreHistory() {
  const scoreList = document.getElementById('score-list');
  const bestScore = document.getElementById('best-score');
  const scores = JSON.parse(localStorage.getItem('motech_scores')) || [];

  scoreList.innerHTML = '';
  scores.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s} 点`;
    scoreList.appendChild(li);
  });

  if (scores.length > 0) {
    bestScore.textContent = `${Math.max(...scores)} 点`;
  } else {
    bestScore.textContent = '-';
  }
}

function showBanner() {
  bottomBanner.style.display = 'block';
}

function hideBanner() {
  bottomBanner.style.display = 'none';
}
