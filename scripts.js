const startBtn = document.getElementById('start-btn');
const audioBtn = document.getElementById('audio-settings-btn');
const introOverlay = document.getElementById('intro-overlay');
const countNum = document.getElementById('count-num');

let countdown = 6;

// Audio Setting Button Logic
audioBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents click from hitting the overlay
    alert("Audio Settings: Music is ON. Adjust your device volume for best experience!");
});

// Start Game and Countdown Sequence
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none'; // Hide the start button
    
    const timer = setInterval(() => {
        countdown--;
        countNum.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            introOverlay.style.display = 'none'; // Remove the white overlay
            initGame(); // Call your existing function to shuffle and show cards
        }
    }, 1000);
});

function initGame() {
    console.log("Game Started on the Beach Background!");
    // Add your card generation/shuffling logic here
}
