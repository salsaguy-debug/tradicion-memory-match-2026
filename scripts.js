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

function flipCard() {
  if (lockBoard || this === firstCard) return;

  if (!timerStarted) {
    bgMusic.play().catch(() => console.log("Music ready"));
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

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
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

function resetBoard() { [hasFlippedCard, lockBoard] = [false, false]; [firstCard, secondCard] = [null, null]; }

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    let m = Math.floor(seconds / 60).toString().padStart(2, '0');
    let s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
  }, 1000);
}

function showWinMessage() {
  document.getElementById('final-stats').innerHTML = `Time: ${document.getElementById('timer').innerText}<br>Moves: ${moves}`;
  document.getElementById('win-message').style.display = 'flex';
}

function resetGame() { location.reload(); }

function toggleSettings() {
  const p = document.getElementById('audio-settings');
  p.style.display = p.style.display === 'block' ? 'none' : 'block';
}

function updateVolume() { bgMusic.volume = document.getElementById('bg-volume').value; }

cards.forEach(card => {
  card.style.order = Math.floor(Math.random() * 24);
  card.addEventListener('click', flipCard);
});
