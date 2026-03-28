/**
 * ==============================================================================
 * PROJECT: Tradición Memory Match
 * BTG REV: 1.1.7
 * UPDATES: Stabilized lockBoard logic; Added 1-second interval Timer.
 * ==============================================================================
 */

const cards = document.querySelectorAll('.memory-card');
const moveDisplay = document.getElementById('move-counter');
const bestDisplay = document.getElementById('best-score');
const timerDisplay = document.getElementById('timer');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let moves = 0;
const totalPairs = 12;

let seconds = 0;
let timerInterval = null;
let gameStarted = false;

let bestScore = localStorage.getItem('tradicionBestScore') || "-";
bestDisplay.innerText = bestScore;

function startTimer() {
  if (!gameStarted) {
    gameStarted = true;
    timerInterval = setInterval(() => {
      seconds++;
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;
      timerDisplay.innerText = 
        `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  startTimer();
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
  moves++;
  moveDisplay.innerText = moves;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedPairs++;
  if (matchedPairs === totalPairs) {
    clearInterval(timerInterval);
    handleGameOver();
  }
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  firstCard.classList.add('shake');
  secondCard.classList.add('shake');

  setTimeout(() => {
    firstCard.classList.remove('flip', 'shake');
    secondCard.classList.remove('flip', 'shake');
    resetBoard();
  }, 1200);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function handleGameOver() {
  if (bestScore === "-" || moves < parseInt(bestScore)) {
    localStorage.setItem('tradicionBestScore', moves);
    bestScore = moves;
    bestDisplay.innerText = moves;
  }
  document.getElementById('final-stats').innerText = 
    `Time: ${timerDisplay.innerText} | Moves: ${moves}`;
  setTimeout(() => {
    document.getElementById('win-message').style.display = 'flex';
  }, 600);
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 24);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));