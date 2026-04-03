const startBtn = document.getElementById('start-btn');
const audioBtn = document.getElementById('audio-settings-btn');
const introOverlay = document.getElementById('intro-overlay');
const countNum = document.getElementById('count-num');

let countdown = 6;

// AUDIO SETTING BUTTON - FIXED LOGIC
audioBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the click from hitting the overlay behind it
    alert("Audio Settings: Music is active! Adjust volume on your device.");
});

// START BUTTON & 6-SECOND COUNTDOWN
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none'; // Hide button once clicked
    
    const timer = setInterval(() => {
        countdown--;
        countNum.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            introOverlay.style.display = 'none'; // Fade out loading screen
            initGame(); // Call your card shuffle function here
        }
    }, 1000);
});

function initGame() {
    console.log("Tradición Memory Match: Game Initialized!");
    // PASTE YOUR CARD GENERATION LOGIC HERE
}
