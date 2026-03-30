const cards = document.querySelectorAll('.memory-card');
const flipSound = document.getElementById('sound-flip');
const matchSound = document.getElementById('sound-match');
const mismatchSound = document.getElementById('sound-mismatch');
const bgMusic = document.getElementById('bg-music');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let timerStarted = false;
let seconds = 0;
let timerInterval;

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
  }, 1000); 
});

function updateVolume() {
  const bgVol = document.getElementById('bg-volume').value;
  const sfxVol = document.getElementById('sfx-volume').value;
  bgMusic.volume = bgVol;
  flipSound.volume = sfxVol;
  matchSound.volume = sfxVol;
  mismatchSound.volume = sfxVol;
}

function toggleSettings() {
  const panel = document.getElementById('audio-settings');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (!timerStarted) {
    updateVolume();
    bgMusic.play().catch(() => console.log("Music waiting for interaction"));
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
  setTimeout(() => { if (matchSound) { matchSound.currentTime = 0; matchSound.play(); } }, 300);
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  matchedPairs++;
  if (matchedPairs === 12) { clearInterval(timerInterval); bgMusic.pause(); showWinMessage(); }
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    if (mismatchSound) { mismatchSound.currentTime = 0; mismatchSound.play(); }
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() { [hasFlippedCard, lockBoard] = [false, false]; [firstCard, secondCard] = [null, null]; }

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    document.getElementById('timer').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

function showWinMessage() {
  const overlay = document.getElementById('win-message');
  document.getElementById('final-stats').innerText = `Matched in ${moves} moves and ${document.getElementById('timer').innerText}!`;
  overlay.style.display = 'flex';
}

function shuffle() { cards.forEach(card => card.style.order = Math.floor(Math.random() * 24)); }

function resetGame() {
  clearInterval(timerInterval);
  bgMusic.pause(); bgMusic.currentTime = 0;
  seconds = 0; moves = 0; matchedPairs = 0; timerStarted = false;
  document.getElementById('timer').innerText = "00:00";
  document.getElementById('move-counter').innerText = "0";
  document.getElementById('win-message').style.display = 'none';
  cards.forEach(card => { card.classList.remove('flip'); card.addEventListener('click', flipCard); });
  setTimeout(shuffle, 500); resetBoard();
}

shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
