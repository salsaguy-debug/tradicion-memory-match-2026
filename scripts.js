const startBtn = document.getElementById('start-btn');
const audioBtn = document.getElementById('audio-settings-btn');
const introOverlay = document.getElementById('intro-overlay');
const countNum = document.getElementById('count-num');

let countdown = 6;

// Audio Setting Button Logic
audioBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    alert("Audio Settings: Music is active! Adjust volume on your device.");
});

// Start Button & 6-Second Countdown
startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none'; 
    
    const timer = setInterval(() => {
        countdown--;
        countNum.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(timer);
            introOverlay.style.display = 'none'; 
            initGame(); 
        }
    }, 1000);
});

function initGame() {
    console.log("Game Initialized!");
    // Insert your card shuffle and matching logic here
}
