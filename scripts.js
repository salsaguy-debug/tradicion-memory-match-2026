const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let timerStarted = false;
let seconds = 0;
let timerInterval;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // Music starts on the first interaction
  if (!timerStarted) {
    const music = document.getElementById('bg-music');
    music.volume = 0.3; 
    music.play().catch(e => console.log("Audio waiting for user interaction."));
    startTimer();
    timerStarted = true;
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
    document.getElementById('match-sound').play();
    disableCards();
  } else {
    document.getElementById('mismatch-sound').play();
    unflipCards();
  }
  
  moves++;
  document.getElementById('move-counter').innerText = moves;
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedPairs++;
  if (matchedPairs === 12) {
    clearInterval(timerInterval);
    document.getElementById('bg-music').pause(); // Stop music on win
    showWinMessage();
  }
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
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

function showWinMessage() {
  const overlay = document.getElementById('win-message');
  const stats = document.getElementById('final-stats');
  stats.innerText = `Finished in ${moves} moves and ${document.getElementById('timer').innerText}!`;
  overlay.style.display = 'flex';
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 24);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));
