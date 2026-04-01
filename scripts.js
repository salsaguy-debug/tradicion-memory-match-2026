/** ============================================================================== 
PROJECT: Tradición Memory Match 2026
BRIDGE THE GAP (BTG) VERSION: 3.2.7
DESCRIPTION: Final Logic with Confetti and 1.5s delay before win modal.
============================================================================== */

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
let currentScore = 1000;

window.addEventListener('load', runIntroSequence);

function runIntroSequence() {
  const intro = document.getElementById('intro-overlay');
  const board = document.getElementById('game-board');
  const header = document.querySelector('.game-header');
  const countDisplay = document.getElementById('count-num');
  
  board.style.visibility = 'hidden';
  header.style.visibility = 'hidden';

  let countdown = 6;
  const introInterval = setInterval(() => {
    countdown--;
    countDisplay.innerText = countdown;
    if (countdown === 0) {
      clearInterval(introInterval);
      intro.style.display = 'none';
      board.style.visibility = 'visible';
      header.style.visibility = 'visible';
    }
  }, 1000);
}

function flipCard() {
  if (lockBoard || this === firstCard) return;
  if (!timerStarted) {
    updateVolume();
    bgMusic.play().catch(() => {});
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
  calculateScore();
}

function calculateScore() {
  currentScore = 1000 - (moves * 10) - (seconds * 2);
  if (currentScore < 100) currentScore = 100;
  document.getElementById('score-display').innerText = currentScore;
}

function disableCards() {
  setTimeout(() => { if (matchSound) matchSound.play(); }, 300);
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedPairs++;
  
  if (matchedPairs === 12) {
    // 1.5 second delay so the last card flip is fully visible
    setTimeout(showWinScreen, 1500);
  }
  resetBoard();
}

function showWinScreen() {
  clearInterval(timerInterval);
  fireConfetti();
  
  setTimeout(() => {
    const winModal = document.getElementById('win-modal');
    winModal.style.display = 'flex';
    document.getElementById('final-stats-text').innerHTML = `Completed in <b>${moves}</b> moves and <b>${seconds}</b> seconds.`;
    document.getElementById('final-score-big').innerText = `Score: ${currentScore}`;
  }, 300);
}

function fireConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;
  const colors = ['#2c7a9b', '#f39c12', '#ffffff'];

  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: colors, zIndex: 10001 });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: colors, zIndex: 10001 });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
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

function updateVolume() {
  bgMusic.volume = document.getElementById('music-vol').value;
  const sfxVal = document.getElementById('sfx-vol').value;
  [flipSound, matchSound, mismatchSound].forEach(s => { if(s) s.volume = sfxVal; });
}

function toggleAudioSettings() {
  const modal = document.getElementById('audio-modal');
  modal.style.display = (modal.style.display === 'none') ? 'flex' : 'none';
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    let m = Math.floor(seconds / 60).toString().padStart(2, '0');
    let s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
    calculateScore();
  }, 1000);
}

function resetGame() { location.reload(); }
function shuffle() { cards.forEach(c => c.style.order = Math.floor(Math.random() * 24)); }
shuffle();
cards.forEach(c => c.addEventListener('click', flipCard));
