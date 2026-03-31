/** ============================================================================== 
PROJECT: Tradición Memory Match 2026
BRIDGE THE GAP (BTG) VERSION: 3.1.8
EFFECTIVE DATE: March 31, 2026
DESCRIPTION OF UPDATES: Integrated dual-channel volume control logic.
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

  if (!timerStarted) {
    updateVolume(); // Initialize volumes from UI
    bgMusic.play().catch(e => console.log("Waiting for interaction..."));
    startTimer();
    timerStarted = true;
  }

  if (flipSound) { 
    flipSound.currentTime = 0; 
    flipSound.play(); 
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

function updateVolume() {
  const musicVal = document.getElementById('music-vol').value;
  const sfxVal = document.getElementById('sfx-vol').value;

  // Set Music
  bgMusic.volume = musicVal;

  // Set SFX
  [flipSound, matchSound, mismatchSound].forEach(sound => {
    if (sound) sound.volume = sfxVal;
  });
}

function toggleAudioSettings() {
  const modal = document.getElementById('audio-modal');
  modal.style.display = (modal.style.display === 'none') ? 'flex' : 'none';
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
    alert("¡Excelente! Game Finished.");
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
