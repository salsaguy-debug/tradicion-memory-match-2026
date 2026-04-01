window.addEventListener('load', runIntroSequence);

function runIntroSequence() {
  const intro = document.getElementById('intro-overlay');
  const welcome = document.getElementById('welcome-content');
  const instructions = document.getElementById('instructions-content');
  const countDisplay = document.getElementById('count-num');
  const board = document.getElementById('game-board');
  const header = document.querySelector('.game-header');

  // Hide board during intro
  board.style.visibility = 'hidden';
  header.style.visibility = 'hidden';

  let countdown = 6;
  const introInterval = setInterval(() => {
    countdown--;
    countDisplay.innerText = countdown;

    // SWAP CONTENT AT 3 SECONDS
    if (countdown === 3) {
      welcome.style.display = 'none';
      instructions.style.display = 'block';
    }

    if (countdown <= 0) {
      clearInterval(introInterval);
      intro.style.display = 'none';
      board.style.visibility = 'visible';
      header.style.visibility = 'visible';
    }
  }, 1000);
}

// Ensure the Win Screen is layered correctly
function showWinScreen() {
  clearInterval(timerInterval);
  fireConfetti();
  
  setTimeout(() => {
    const winModal = document.getElementById('win-modal');
    winModal.style.display = 'flex'; // Uses flex to center the card
    document.getElementById('final-stats-text').innerHTML = `You completed the challenge in <b>${moves} moves</b> and <b>${seconds} seconds</b>.`;
    document.getElementById('final-score-big').innerText = currentScore;
  }, 500);
}
