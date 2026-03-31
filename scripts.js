/** ============================================================================== 
PROJECT: Tradición Memory Match 2026
BRIDGE THE GAP (BTG) VERSION: 3.2.0
EFFECTIVE DATE: March 31, 2026
DESCRIPTION OF UPDATES: Added Intro Sequence Logic:
  1. Hides game board and header initially.
  2. Runs 6-second countdown.
  3. Activates Background Music (Music Channel Only) during countdown.
  4. Automatically transitions to Game State after countdown.
  5. Audio can also be activated by user clicking any active link.
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
let musicUnlocked = false; // Tracks if autoplay block is bypassed

// --- NEW INTRO SEQUENCE LOGIC ---

// Start sequence when page loads
window.addEventListener('load', runIntroSequence);

// Unlock audio if user clicks links during intro
document.querySelectorAll('#intro-overlay a').forEach(link => {
  link.addEventListener('click', unlockMusic);
});

function runIntroSequence() {
  const intro = document.getElementById('intro-overlay');
  const board = document.getElementById('game-board');
  const header = document.querySelector('.game-header');
  const countDisplay = document.getElementById('count-num');

  // Ensure game is hidden during intro
  board.style.visibility = 'hidden';
  header.style.visibility = 'hidden';

  let countdown = 6;
  countDisplay.innerText = countdown;

  // Attempt to play music (Music Channel Only) immediately.
  // Modern browsers may block this until a click, but we handle the error.
  initializeMusicChannel();

  const introInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countDisplay.innerText = countdown;
    } else {
      clearInterval(introInterval);
      // Countdown finished: Transition to Game
      intro.style.display = 'none';
      board.style.visibility = 'visible';
      header.style.visibility = 'visible';
    }
  }, 1000);
}

function initializeMusicChannel() {
  // Set default volumes from UI values
  updateVolume(); 
  
  // Try autoplaying the music channel.
  // SFX channels remain silent until game start.
  bgMusic.play()
    .then(() => {
      musicUnlocked = true;
      console.log("Music channel started successfully.");
    })
    .catch(error => {
      // Browsers often block non-muted autoplay.
      console.log("Autoplay blocked. Music will start upon user interaction (click/link).");
    });
}

// Function to force unlock music if user interacts (like clicking a promo link)
function unlockMusic() {
  if (!musicUnlocked && bgMusic) {
    updateVolume();
    bgMusic.play().catch(e => console.log("Failed final play attempt:", e));
    musicUnlocked = true;
  }
}

// --- PREVIOUS GAME LOGIC (Restored & Optimized) ---

function flipCard() {
  if (lockBoard || this === firstCard) return;

  // SFX and Game Timer trigger on first actual interaction/flip
  if (!timerStarted) {
    // If music was still blocked, this interaction unlocks it.
    unlockMusic();
    
    startTimer();
    timerStarted = true;
  }

  // Play Flip Sound (SFX Channel)
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

// Independent volume control: Music vs SFX
function updateVolume() {
  const musicVal = document.getElementById('music-vol').value;
  const sfxVal = document.getElementById('sfx-vol').value;

  // Set Background Music volume
  if (bgMusic) bgMusic.volume = musicVal;

  // Set Sound Effects volumes (SFX Channels)
  const sfxChannels = [flipSound, matchSound, mismatchSound];
  sfxChannels.forEach(sound => {
    if (sound) sound.volume = sfxVal;
  });
}

function toggleAudioSettings() {
  const modal = document.getElementById('audio-modal');
  modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'flex' : 'none';
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
  moves++;
  document.getElementById('move-counter').innerText = moves;
}

function disableCards() {
  // Match Sound (SFX Channel)
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
    // Mismatch Sound (SFX Channel)
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
