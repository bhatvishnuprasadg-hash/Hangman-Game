const wordBank = {
    easy: [
        { word: "mouse", hint: "Pointing device" },
        { word: "pixel", hint: "Smallest unit of an image" },
        { word: "virus", hint: "Malicious software" },
        { word: "email", hint: "Electronic mail" },
        { word: "key", hint: "What you press on a keyboard" },
        { word: "web", hint: "World Wide ___" },
        { word: "code", hint: "Instructions for computers" },
        { word: "data", hint: "Information stored by computers" },
        { word: "file", hint: "A digital document" },
        { word: "disk", hint: "Storage hardware" },
        { word: "icon", hint: "A small picture representing an app" },
        { word: "link", hint: "Clickable text to a website" },
        { word: "wifi", hint: "Wireless internet connection" },
        { word: "chat", hint: "Instant messaging" },
        { word: "site", hint: "Short for website" },
        { word: "user", hint: "Person using the computer" },
        { word: "chip", hint: "Integrated circuit" },
        { word: "task", hint: "A single piece of work" },
        { word: "menu", hint: "List of options in an app" },
        { word: "boot", hint: "Starting up the computer" },
        { word: "host", hint: "Computer that provides services" },
        { word: "port", hint: "Connection point on a PC" },
        { word: "save", hint: "Keep changes to a file" },
        { word: "byte", hint: "8 bits of data" },
        { word: "font", hint: "Style of text" }
    ],
    medium: [
        { word: "laptop", hint: "Portable personal computer" },
        { word: "server", hint: "Computer providing data to others" },
        { word: "python", hint: "High-level programming language" },
        { word: "binary", hint: "Base-2 number system" },
        { word: "kernel", hint: "Core part of an OS" },
        { word: "cookie", hint: "Small web data file" },
        { word: "router", hint: "Sends data packets between networks" },
        { word: "backup", hint: "A copy of important data" },
        { word: "memory", hint: "Where data is stored temporarily" },
        { word: "folder", hint: "Used to organize files" },
        { word: "search", hint: "Looking for info online" },
        { word: "driver", hint: "Hardware control software" },
        { word: "screen", hint: "Output display device" },
        { word: "window", hint: "Rectangular area of an interface" },
        { word: "system", hint: "Operating ___" },
        { word: "script", hint: "A small automated program" },
        { word: "buffer", hint: "Temporary storage area" },
        { word: "client", hint: "Requests data from a server" },
        { word: "upload", hint: "Send data to the internet" },
        { word: "cursor", hint: "Visual indicator for mouse" },
        { word: "cache", hint: "High-speed data storage" },
        { word: "hacker", hint: "One who finds vulnerabilities" },
        { word: "sensor", hint: "Input hardware for environment" },
        { word: "syntax", hint: "Rules of a coding language" },
        { word: "format", hint: "To prepare a disk for data" }
    ],
    hard: [
        { word: "algorithm", hint: "Step-by-step problem solver" },
        { word: "processor", hint: "The brain of the computer" },
        { word: "framework", hint: "Pre-built software structure" },
        { word: "encryption", hint: "Scrambling data for security" },
        { word: "database", hint: "Organized collection of data" },
        { word: "protocol", hint: "Set of rules for communication" },
        { word: "bandwidth", hint: "Data transfer capacity" },
        { word: "interface", hint: "Point where two systems meet" },
        { word: "firewall", hint: "Network security system" },
        { word: "debugger", hint: "Tool used to find code errors" },
        { word: "firmware", hint: "Permanent software in hardware" },
        { word: "recursive", hint: "Function that calls itself" },
        { word: "overclock", hint: "Speeding up a CPU manually" },
        { word: "compiling", hint: "Translating code to machine language" },
        { word: "rendering", hint: "Generating an image from a model" },
        { word: "hyperlink", hint: "Technical name for a web link" },
        { word: "mainframe", hint: "Large, powerful central computer" },
        { word: "metadata", hint: "Data that describes other data" },
        { word: "terminal", hint: "Text-based user interface" },
        { word: "bandwidth", hint: "Speed of network connection" },
        { word: "localhost", hint: "Standard name for the current PC" },
        { word: "broadband", hint: "High-speed internet access" },
        { word: "peripheral", hint: "External hardware device" },
        { word: "repository", hint: "Storage place for code (Repo)" },
        { word: "megahertz", hint: "Unit of clock speed" }
    ]
};

const hangmanStages = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

let selectedWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let timerInterval;
let timeLeft = 0;
let playerName = "";

// =====================
// GAME ENGINE
// =====================

function startGame() {
    playerName = document.getElementById("playerName").value.trim() || "Guest";
    const diff = document.getElementById("difficulty").value;

    // Set Timer based on difficulty
    if (diff === "easy") timeLeft = 45;
    else if (diff === "medium") timeLeft = 90;
    else timeLeft = 120;

    // Select Word using dynamic length logic
    const list = wordBank[diff];
    const random = list[Math.floor(Math.random() * list.length)];
    
    selectedWord = random.word;
    guessedLetters = [];
    wrongGuesses = 0;

    // UI Reset
    document.getElementById("hint").innerText = random.hint;
    document.getElementById("message").innerText = "";
    document.getElementById("message").style.color = "black";
    document.getElementById("letter").value = "";
    
    updateWordDisplay();
    updateHangmanDisplay();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    document.getElementById("timer").innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function guessLetter() {
    const input = document.getElementById("letter");
    const letter = input.value.toLowerCase();
    input.value = "";

    // Validation
    if (!letter.match(/[a-z]/) || letter === "" || guessedLetters.includes(letter)) {
        return;
    }

    guessedLetters.push(letter);

    if (!selectedWord.includes(letter)) {
        wrongGuesses++;
        updateHangmanDisplay();
    }

    updateWordDisplay();
    checkGameState();
}

function updateWordDisplay() {
    const display = selectedWord.split("").map(l => 
        guessedLetters.includes(l) ? l : "_"
    ).join(" ");
    document.getElementById("word").innerText = display;
}

function updateHangmanDisplay() {
    document.getElementById("hangman").innerText = hangmanStages[wrongGuesses];
}

function checkGameState() {
    if (wrongGuesses >= hangmanStages.length - 1) {
        endGame(false);
    } else if (selectedWord.split("").every(l => guessedLetters.includes(l))) {
        endGame(true);
    }
}

function endGame(win) {
    clearInterval(timerInterval);
    const msg = document.getElementById("message");
    
    if (win) {
        msg.innerText = "🎉 Success! You Guessed It Right.";
        msg.style.color = "#00b894";
        saveScore();
    } else {
        msg.innerText = "❌ Wrong Guess! The Word Was : " + selectedWord;
        msg.style.color = "#d63031";
    }
}

// =====================
// LEADERBOARD LOGIC
// =====================

function saveScore() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push({ name: playerName, score: timeLeft });
    
    // Sort by highest score (remaining time)
    scores.sort((a, b) => b.score - a.score);
    
    // Keep top 5
    localStorage.setItem("leaderboard", JSON.stringify(scores));
    displayLeaderboard();
}

function displayLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const tbody = document.getElementById("leaderboardBody");
    tbody.innerHTML = "";

    if (scores.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3'>No High Scores Yet</td></tr>";
        return;
    }

    scores.slice(0, 5).forEach((p, i) => {
        const row = `<tr>
            <td>${i + 1}</td>
            <td>${p.name}</td>
            <td>${p.score}s</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Display leaderboard on page load
displayLeaderboard();

// Optional: Enter key listener for guessing
document.getElementById("letter").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        guessLetter();
    }
});