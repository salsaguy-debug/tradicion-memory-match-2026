const startBtn = document.getElementById('start-btn');
const audioBtn = document.getElementById('audio-settings-btn');
const introOverlay = document.getElementById('intro-overlay');
const countNum = document.getElementById('count-num');

let countdown = 6;

// Audio Setting logic
audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    alert("Audio Settings: Music is ON.");
});

// Start Button & 6-Second Counter
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
    console.log("Original Game Started!");
}
