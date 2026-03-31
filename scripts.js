/** ============================================================================== 
* PROJECT: Tradición Memory Match 2026
* BRIDGE THE GAP (BTG) VERSION: 3.1.5
* EFFECTIVE DATE: March 31, 2026
* DESCRIPTION OF UPDATES: Fixed Background Music by adding a user-interaction 
* trigger on the first card flip to bypass browser autoplay blocks.
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

  // --- AUDIO FIX START ---
  // Browsers require a click to play sound. This triggers on the very first flip.
  if (!timerStarted) {
    bgMusic.volume = 0.2; // Set a comfortable background volume
    bgMusic.play().catch(error => {
      console.log("Autoplay prevented. Music will start on next interaction.");
    });
    startTimer();
    timerStarted = true;
  }
  // --- AUDIO FIX END ---

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
    document.getElementById('win-message').style.display = 'flex';
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
  location.reload(); // Simplest way to reset all states and audio
}

shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
