class SmartAlarm {
    constructor() {
        this.alarms = [];
        this.currentAlarm = null;
        this.isAlarmRinging = false;
        this.currentPuzzle = null;
        
        this.initializeElements();
        this.startClock();
        this.loadAlarms();
        this.setupEventListeners();
    }

    initializeElements() {
        // Time elements
        this.currentTimeEl = document.getElementById('currentTime');
        
        // Alarm setup elements
        this.alarmTimeInput = document.getElementById('alarmTime');
        this.setAlarmBtn = document.getElementById('setAlarm');
        this.alarmListEl = document.getElementById('alarmList');
        
        // Alarm ringing elements
        this.alarmRingingSection = document.getElementById('alarmRinging');
        this.puzzleContentEl = document.getElementById('puzzleContent');
        this.puzzleAnswerInput = document.getElementById('puzzleAnswer');
        this.submitAnswerBtn = document.getElementById('submitAnswer');
        this.puzzleFeedbackEl = document.getElementById('puzzleFeedback');
        
        // Motivation section
        this.motivationSection = document.getElementById('motivationSection');
        this.motivationQuoteEl = document.getElementById('motivationQuote');
        this.closeAlarmBtn = document.getElementById('closeAlarm');
        
        // Audio
        this.alarmSound = document.getElementById('alarmSound');
    }

    startClock() {
        setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            this.currentTimeEl.textContent = timeString;
            
            this.checkAlarms(now);
        }, 1000);
    }

    setupEventListeners() {
        this.setAlarmBtn.addEventListener('click', () => this.setAlarm());
        this.submitAnswerBtn.addEventListener('click', () => this.checkPuzzleAnswer());
        this.closeAlarmBtn.addEventListener('click', () => this.closeAlarm());
        
        // Enter key for puzzle answer
        this.puzzleAnswerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPuzzleAnswer();
            }
        });
    }

    setAlarm() {
        const alarmTime = this.alarmTimeInput.value;
        if (!alarmTime) {
            alert('Please set a valid time!');
            return;
        }

        const alarm = {
            id: Date.now(),
            time: alarmTime,
            active: true
        };

        this.alarms.push(alarm);
        this.saveAlarms();
        this.renderAlarms();
        this.alarmTimeInput.value = '';
        
        // Show confirmation
        this.showFeedback(`Alarm set for ${this.formatTime(alarmTime)}`, 'success');
    }

    removeAlarm(alarmId) {
        this.alarms = this.alarms.filter(alarm => alarm.id !== alarmId);
        this.saveAlarms();
        this.renderAlarms();
    }

    renderAlarms() {
        this.alarmListEl.innerHTML = '';
        
        if (this.alarms.length === 0) {
            this.alarmListEl.innerHTML = '<p style="text-align: center; color: #718096;">No alarms set</p>';
            return;
        }

        this.alarms.forEach(alarm => {
            const alarmEl = document.createElement('div');
            alarmEl.className = 'alarm-item';
            alarmEl.innerHTML = `
                <div class="alarm-time">${this.formatTime(alarm.time)}</div>
                <button class="btn btn-danger" onclick="smartAlarm.removeAlarm(${alarm.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            `;
            this.alarmListEl.appendChild(alarmEl);
        });
    }

    checkAlarms(now) {
        if (this.isAlarmRinging) return;

        const currentTime = now.toTimeString().slice(0, 5);
        
        this.alarms.forEach(alarm => {
            if (alarm.active && alarm.time === currentTime) {
                this.triggerAlarm(alarm);
            }
        });
    }

    triggerAlarm(alarm) {
        this.currentAlarm = alarm;
        this.isAlarmRinging = true;
        
        // Show alarm ringing section
        this.alarmRingingSection.classList.remove('hidden');
        
        // Play alarm sound
        this.alarmSound.play().catch(e => {
            console.log('Audio play failed:', e);
        });
        
        // Generate puzzle
        this.generatePuzzle();
    }

    generatePuzzle() {
        const puzzleTypes = ['math', 'riddle', 'match'];
        const randomType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
        
        this.currentPuzzle = this.createPuzzle(randomType);
        this.renderPuzzle(this.currentPuzzle);
    }

    createPuzzle(type) {
        switch(type) {
            case 'math':
                return this.createMathPuzzle();
            case 'riddle':
                return this.createRiddlePuzzle();
            case 'match':
                return this.createMatchPuzzle();
            default:
                return this.createMathPuzzle();
        }
    }

    createMathPuzzle() {
        const operations = [
            { symbol: '+', func: (a, b) => a + b },
            { symbol: '-', func: (a, b) => a - b },
            { symbol: '×', func: (a, b) => a * b }
        ];
        
        const op = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2;
        
        if (op.symbol === '×') {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
        } else {
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            
            if (op.symbol === '-' && num1 < num2) {
                [num1, num2] = [num2, num1];
            }
        }
        
        const answer = op.func(num1, num2);
        
        return {
            type: 'math',
            question: `What is ${num1} ${op.symbol} ${num2}?`,
            answer: answer.toString(),
            display: `<div class="math-puzzle">${num1} ${op.symbol} ${num2} = ?</div>`
        };
    }

    createRiddlePuzzle() {
        const riddles = [
            {
                question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
                answer: "echo"
            },
            {
                question: "The more of this there is, the less you see. What is it?",
                answer: "darkness"
            },
            {
                question: "What has keys but can't open locks?",
                answer: "piano"
            },
            {
                question: "What has to be broken before you can use it?",
                answer: "egg"
            },
            {
                question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
                answer: "candle"
            }
        ];
        
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        return {
            type: 'riddle',
            question: riddle.question,
            answer: riddle.answer.toLowerCase(),
            display: `<div class="riddle-puzzle">${riddle.question}</div>`
        };
    }

    createMatchPuzzle() {
        const pairs = [
            { left: "Capital of France", right: "Paris" },
            { left: "Largest planet", right: "Jupiter" },
            { left: "Author of Hamlet", right: "Shakespeare" },
            { left: "Chemical symbol for Gold", right: "Au" }
        ];
        
        // Shuffle the right column
        const shuffledRights = [...pairs].sort(() => Math.random() - 0.5);
        
        let displayHTML = '<div class="match-puzzle">';
        displayHTML += '<div>';
        pairs.forEach(pair => {
            displayHTML += `<div class="match-item">${pair.left}</div>`;
        });
        displayHTML += '</div><div>';
        shuffledRights.forEach(pair => {
            displayHTML += `<div class="match-item">${pair.right}</div>`;
        });
        displayHTML += '</div></div>';
        displayHTML += '<p>Enter the correct pairs separated by commas (e.g., 1A,2B,3C,4D)</p>';
        
        // Create correct answer (positions)
        const correctPairs = pairs.map((pair, index) => {
            const rightIndex = shuffledRights.findIndex(p => p.right === pair.right);
            return `${index + 1}${String.fromCharCode(65 + rightIndex)}`;
        }).join(',');
        
        return {
            type: 'match',
            question: "Match the items correctly",
            answer: correctPairs.toLowerCase(),
            display: displayHTML
        };
    }

    renderPuzzle(puzzle) {
        this.puzzleContentEl.innerHTML = puzzle.display;
        this.puzzleAnswerInput.value = '';
        this.puzzleFeedbackEl.textContent = '';
        this.puzzleAnswerInput.focus();
    }

    checkPuzzleAnswer() {
        const userAnswer = this.puzzleAnswerInput.value.trim().toLowerCase();
        
        if (!userAnswer) {
            this.showFeedback('Please enter an answer!', 'error');
            return;
        }

        if (userAnswer === this.currentPuzzle.answer) {
            this.showFeedback('Correct! Well done! 🎉', 'success');
            setTimeout(() => this.showMotivation(), 1500);
        } else {
            this.showFeedback('Incorrect! Try again! 💪', 'error');
            this.puzzleAnswerInput.focus();
            this.puzzleAnswerInput.select();
        }
    }

    showMotivation() {
        // Stop alarm sound
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
        
        // Hide alarm ringing section
        this.alarmRingingSection.classList.add('hidden');
        
        // Show motivation section
        this.motivationSection.classList.remove('hidden');
        
        // Display random motivation quote
        const quotes = [
            "The secret of getting ahead is getting started. - Mark Twain",
            "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
            "Every morning we are born again. What we do today matters most. - Buddha",
            "The way to get started is to quit talking and begin doing. - Walt Disney",
            "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
            "The future depends on what you do today. - Mahatma Gandhi",
            "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi",
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "Today is a new beginning, chase your dreams with passion! 🌟"
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        this.motivationQuoteEl.textContent = randomQuote;
    }

    closeAlarm() {
        this.isAlarmRinging = false;
        this.currentAlarm = null;
        this.motivationSection.classList.add('hidden');
        
        // Deactivate the alarm that just rang
        if (this.currentAlarm) {
            this.alarms = this.alarms.filter(alarm => alarm.id !== this.currentAlarm.id);
            this.saveAlarms();
            this.renderAlarms();
        }
    }

    showFeedback(message, type) {
        this.puzzleFeedbackEl.textContent = message;
        this.puzzleFeedbackEl.style.color = type === 'success' ? '#48bb78' : '#f56565';
        
        if (type === 'success') {
            setTimeout(() => {
                this.puzzleFeedbackEl.textContent = '';
            }, 3000);
        }
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }

    saveAlarms() {
        localStorage.setItem('smartAlarms', JSON.stringify(this.alarms));
    }

    loadAlarms() {
        const savedAlarms = localStorage.getItem('smartAlarms');
        if (savedAlarms) {
            this.alarms = JSON.parse(savedAlarms);
            this.renderAlarms();
        }
    }
}

// Initialize the smart alarm when page loads
const smartAlarm = new SmartAlarm();

// Add some demo alarms on first visit
window.addEventListener('load', () => {
    const savedAlarms = localStorage.getItem('smartAlarms');
    if (!savedAlarms) {
        // Add a demo alarm for 1 minute from now
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        const demoTime = now.toTimeString().slice(0, 5);
        
        smartAlarm.alarms.push({
            id: Date.now(),
            time: demoTime,
            active: true
        });
        smartAlarm.saveAlarms();
        smartAlarm.renderAlarms();
    }
});