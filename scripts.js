const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// 1. Create the Audio Objects
const flipSound = new Audio('flip.mp3');
const matchSound = new Audio('match.mp3');
const errorSound = new Audio('mismatch.mp3');

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // 2. THE SOUND FIX: Start audio on first click to "unlock" the browser
  flipSound.play().catch(e => console.log("Audio waiting for user interaction"));

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
    // Play Match Sound
    setTimeout(() => { matchSound.play(); }, 300);
  } else {
    unflipCards();
    // Play Error Sound
    setTimeout(() => { errorSound.play(); }, 500);
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));
