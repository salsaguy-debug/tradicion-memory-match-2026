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

// Load High Score from browser memory
let highScore = localStorage.getItem('tradicionHighScore') || null;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // ACTIVATE TIMER & MUSIC ON FIRST INTERACTION
  if (!timerStarted) {
    playAudio(bgMusic, 0.3); // Starts background music at 30% volume
    startTimer();
    timerStarted = true;
  }

  // Play Flip Sound
  if (flipSound) { 
    flipSound.currentTime = 0; 
    flipSound.play().catch(e => console.log("SFX Blocked")); 
  }
  
  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
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
  // Play Match Sound
  setTimeout(() => { if (matchSound) matchSound.play(); }, 300);
  
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  
  matchedPairs++;
  
  // Game Win Condition (12 Pairs = 24 Cards)
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
  // If no high score exists or current time is faster
  if (!highScore || seconds < parseInt(highScore)) {
    localStorage.setItem('tradicionHighScore', seconds);
    highScore = seconds;
  }
}

function formatTime(totalSeconds) {
  if (!totalSeconds) return "--:--";
  let m = Math.floor(totalSeconds / 60);
  let s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function showWinMessage() {
  const overlay = document.getElementById('win-message');
  const finalTime = document.getElementById('timer').innerText;
  const bestTime = formatTime(highScore);

  document.getElementById('final-stats').innerHTML = `
    Moves: <b>${moves}</b><br>
    Time: <b>${finalTime}</b><br><br>
    🏆 Personal Best: <b>${bestTime}</b>
  `;
  overlay.style.display = 'flex';
}

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 24);
    card.style.order = randomPos;
  });
}

function resetGame() {
  // Easiest way to reset everything, reshuffle, and clear memory leaks
  location.reload(); 
}

function toggleSettings() {
  const panel = document.getElementById('audio-settings');
  panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}

function updateVolume() {
  if (bgMusic) {
    bgMusic.volume = document.getElementById('bg-volume').value;
  }
}

// Helper function to handle browser audio restrictions
function playAudio(audioElement, vol) {
  if (audioElement) {
    audioElement.volume = vol;
    let promise = audioElement.play();
    if (promise !== undefined) {
      promise.catch(error => {
        console.log("Autoplay prevented. Music will start on next interaction.");
      });
    }
  }
}

// INITIALIZE
shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
