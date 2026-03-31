/** ============================================================================== 
PROJECT: Tradición Memory Match 2026
BRIDGE THE GAP (BTG) VERSION: 3.1.7
EFFECTIVE DATE: March 31, 2026
DESCRIPTION OF UPDATES: Finalized audio trigger. Background music starts on 
the very first card flip.
==============================================================================
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

function flipCard() {
  if (lockBoard || this === firstCard) return;

  // Music Trigger: Browsers require a click/flip to start audio
  if (!timerStarted) {
    bgMusic.volume = 0.2;
    bgMusic.play().catch(e => console.log("Audio waiting for user."));
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
    alert("¡Felicidades! You matched all pairs.");
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

function resetGame() {
  location.reload();
}

shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
