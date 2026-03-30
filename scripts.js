/** * REVISION LEVEL: 3.1 
 * STATUS: BASE CODE - PERMANENT REFERENCE
 * DEVELOPER NOTE: Use this specific logic for all future iterative changes.
 */

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

let highScore = localStorage.getItem('tradicionBest') || null;

function flipCard() {
  if (lockBoard || this === firstCard) return;

  if (!timerStarted) {
    bgMusic.play().catch(() => console.log("Audio waiting for interaction"));
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
    processWin();
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

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 24);
    card.style.order = randomPos;
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    let m = Math.floor(seconds / 60).toString().padStart(2, '0');
    let s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
  }, 1000);
}

function processWin() {
  if (!highScore || seconds < highScore) {
    localStorage.setItem('tradicionBest', seconds);
    highScore = seconds;
  }
  const m = Math.floor(highScore / 60).toString().padStart(2, '0');
  const s = (highScore % 60).toString().padStart(2, '0');
  document.getElementById('final-stats').innerHTML = 
    `Time: ${document.getElementById('timer').innerText}<br>Best: ${m}:${s}`;
  document.getElementById('win-message').style.display = 'flex';
}

function resetGame() {
  clearInterval(timerInterval);
  seconds = 0;
  moves = 0;
  matchedPairs = 0;
  timerStarted = false;
  document.getElementById('timer').innerText = '00:00';
  document.getElementById('move-counter').innerText = '0';
  document.getElementById('win-message').style.display = 'none';
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  setTimeout(shuffle, 500);
}

function toggleSettings() {
  const p = document.getElementById('audio-settings');
  p.style.display = (p.style.display === 'none' || p.style.display === '') ? 'flex' : 'none';
}

function updateVolume() {
  bgMusic.volume = document.getElementById('bg-volume').value;
}

shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
