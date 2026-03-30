const cards = document.querySelectorAll('.memory-card');
const bgMusic = document.getElementById('bg-music');
const flipSound = document.getElementById('sound-flip');
const matchSound = document.getElementById('sound-match');
const mismatchSound = document.getElementById('sound-mismatch');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let timerStarted = false;
let seconds = 0;
let timerInterval;

// High Score
let highScore = localStorage.getItem('tradicionHighScore') || null;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // ACTIVATE MUSIC ON FIRST CLICK
  if (!timerStarted) {
    startMusic();
    startTimer();
    timerStarted = true;
  }

  if (flipSound) { flipSound.currentTime = 0; flipSound.play(); }
  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  checkForMatch();
}

function startMusic() {
  bgMusic.volume = 0.3;
  // Browser workaround: play returns a promise
  let playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log("Playback prevented. Ensure audio files are in the main folder.");
    });
  }
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
  moves++;
  document.getElementById('move-counter').innerText = moves;
}

function disableCards() {
  setTimeout(() => { if (matchSound) matchSound.play(); }, 300);
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedPairs++;
  
  if (matchedPairs === 12) {
    clearInterval(timerInterval);
    bgMusic.pause();
    saveHighScore();
    showWinMessage();
  }
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    if (mismatchSound) mismatchSound.play();
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    document.getElementById('timer').innerText = 
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

function saveHighScore() {
  if (!highScore || seconds < highScore) {
    localStorage.setItem('tradicionHighScore', seconds);
    highScore = seconds;
  }
}

function showWinMessage() {
  const overlay = document.getElementById('win-message');
  const bestTime = highScore ? Math.floor(highScore/60).toString().padStart(2,'0') + ":" + (highScore%60).toString().padStart(2,'0') : "--:--";
  document.getElementById('final-stats').innerHTML = `
    Moves: ${moves} | Time: ${document.getElementById('timer').innerText}<br>
    🏆 Best Time: ${bestTime}
  `;
  overlay.style.display = 'flex';
}

function shuffle() {
  cards.forEach(card => card.style.order = Math.floor(Math.random() * 24));
}

function resetGame() {
  location.reload(); // Cleanest way to reset everything and shuffle
}

function toggleSettings() {
  const panel = document.getElementById('audio-settings');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function updateVolume() {
  bgMusic.volume = document.getElementById('bg-volume').value;
}

shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
