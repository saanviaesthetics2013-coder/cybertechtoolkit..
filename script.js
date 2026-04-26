// ============================
// CyberSec Toolkit Website JS
// Matrix + Typing + Fake Login + Terminal Simulation + Sound Effects
// ============================

const output = document.getElementById("terminal-output");
const input = document.getElementById("terminal-input");
const typingText = document.getElementById("typing-text");
const soundToggle = document.getElementById("sound-toggle");

// Login elements
const loginOverlay = document.getElementById("login-overlay");
const loginBtn = document.getElementById("login-btn");
const loginStatus = document.getElementById("login-status");

let soundEnabled = true;

// ---------------- SOUND EFFECT ----------------
function beep() {
  if (!soundEnabled) return;

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(850, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.05);
}

// ---------------- HERO TYPING EFFECT ----------------
const typingMessage =
  ">> Welcome Hacker... Initializing toolkit modules... Terminal access required...";

let typingIndex = 0;

function heroTyping() {
  if (typingIndex < typingMessage.length) {
    typingText.textContent += typingMessage.charAt(typingIndex);
    typingIndex++;
    setTimeout(heroTyping, 35);
  }
}

// ---------------- MATRIX EFFECT ----------------
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@";
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);

let drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = Math.random() * canvas.height;
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff99";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(drawMatrix, 40);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  columns = Math.floor(canvas.width / fontSize);
  drops = [];

  for (let x = 0; x < columns; x++) {
    drops[x] = Math.random() * canvas.height;
  }
});

// ---------------- TERMINAL TYPING ----------------
function typeLine(text, speed = 15) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      output.innerHTML += text.charAt(i);
      output.scrollTop = output.scrollHeight;
      i++;

      if (i >= text.length) {
        clearInterval(interval);
        output.innerHTML += "\n";
        resolve();
      }
    }, speed);
  });
}

// ---------------- BOOT SEQUENCE ----------------
async function bootSequence() {
  output.innerHTML = "";
  await typeLine("Initializing CyberSec Toolkit v1.0.0...");
  await typeLine("Loading modules: network_scanner.py");
  await typeLine("Loading modules: port_scanner.py");
  await typeLine("Loading modules: web_checker.py");
  await typeLine("Loading modules: password_tools.py");
  await typeLine("Loading modules: hash_tools.py");
  await typeLine("Loading report system...");
  await typeLine("SYSTEM STATUS: [OK]");
  await typeLine("------------------------------------------");
  await typeLine("Type: help   (to see commands)");
  await typeLine("------------------------------------------");
}

// ---------------- HELP MENU ----------------
function showHelp() {
  output.innerHTML += `
Available Commands:
  help                Show all commands
  clear               Clear terminal
  banner              Show toolkit banner
  ping-sweep          Simulate ping sweep scan
  port-scan           Simulate port scanning
  web-check           Simulate website security scan
  robots              Simulate robots.txt scan
  pass-gen            Generate a strong password
  hash-md5            Generate MD5 hash
  hash-sha256         Generate SHA256 hash
  about               Show project info
  exit                Close terminal (simulation)

`;
  output.scrollTop = output.scrollHeight;
}

// ---------------- UTILITIES ----------------
function randomIP() {
  return `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
}

function generatePassword(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
  let pass = "";

  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }

  return pass;
}

function fakeHash(len) {
  let hash = "";
  const chars = "abcdef0123456789";

  for (let i = 0; i < len; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }

  return hash;
}

// ---------------- SIMULATIONS ----------------
async function simulatePingSweep() {
  await typeLine("Starting Ping Sweep...");
  await typeLine("Scanning network: 192.168.1.0/24");

  const found = Math.floor(Math.random() * 8) + 3;
  for (let i = 0; i < found; i++) {
    beep();
    await typeLine(`[LIVE] Host detected -> ${randomIP()}`, 8);
  }

  await typeLine("Ping Sweep Completed.");
  await typeLine("Report saved: reports/ping_sweep_demo.txt");
}

async function simulatePortScan() {
  await typeLine("Starting Port Scan...");
  await typeLine("Target: 192.168.1.1");

  const ports = [
    "22/tcp OPEN  SSH",
    "80/tcp OPEN  HTTP",
    "443/tcp OPEN HTTPS",
    "3389/tcp CLOSED RDP",
    "445/tcp OPEN  SMB"
  ];

  for (let p of ports) {
    beep();
    await typeLine(p, 12);
  }

  await typeLine("Port Scan Completed.");
  await typeLine("Report saved: reports/port_scan_demo.json");
}

async function simulateWebCheck() {
  await typeLine("Checking Website Security Headers...");
  await typeLine("Target: https://example.com");

  beep();
  await typeLine("HTTPS: TRUE");
  await typeLine("Status Code: 200");
  await typeLine("Strict-Transport-Security: MISSING");
  await typeLine("Content-Security-Policy: MISSING");
  await typeLine("X-Frame-Options: PRESENT");

  await typeLine("Web Security Scan Completed.");
  await typeLine("Report saved: reports/web_security_demo.json");
}

async function simulateRobots() {
  await typeLine("Searching robots.txt...");
  await typeLine("Target: https://example.com/robots.txt");

  beep();
  await typeLine("robots.txt FOUND");
  await typeLine("User-agent: *");
  await typeLine("Disallow: /admin/");
  await typeLine("Disallow: /private/");

  await typeLine("robots.txt scan completed.");
  await typeLine("Report saved: reports/robots_demo.txt");
}

// ---------------- TERMINAL OUTPUT COMMANDS ----------------
function showBanner() {
  output.innerHTML += `
 ██████╗██╗   ██╗██████╗ ███████╗███████╗ ██████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝██╔════╝
██║      ╚████╔╝ ██████╔╝█████╗  ███████╗██║     
██║       ╚██╔╝  ██╔══██╗██╔══╝  ╚════██║██║     
╚██████╗   ██║   ██████╔╝███████╗███████║╚██████╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚══════╝ ╚═════╝

 CyberSec Toolkit Demo Terminal
 Ethical Hacking Toolkit Simulation
--------------------------------------------------

`;
  output.scrollTop = output.scrollHeight;
}

function showAbout() {
  output.innerHTML += `
CyberSec Toolkit (Demo Terminal)
Version: 1.0.0

This is a browser simulation of the Python toolkit.
To run the real version:
  python -m src.main

WARNING:
Use only on authorized systems.
`;
  output.scrollTop = output.scrollHeight;
}

// ---------------- TERMINAL COMMAND HANDLER ----------------
input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim().toLowerCase();
    output.innerHTML += `root@cybersec:~$ ${command}\n`;
    input.value = "";

    if (command !== "") beep();

    if (command === "help") {
      showHelp();
    } else if (command === "clear") {
      output.innerHTML = "";
    } else if (command === "banner") {
      showBanner();
    } else if (command === "ping-sweep") {
      await simulatePingSweep();
    } else if (command === "port-scan") {
      await simulatePortScan();
    } else if (command === "web-check") {
      await simulateWebCheck();
    } else if (command === "robots") {
      await simulateRobots();
    } else if (command === "pass-gen") {
      const pass = generatePassword();
      output.innerHTML += `Generated Password: ${pass}\n\n`;
    } else if (command === "hash-md5") {
      output.innerHTML += `MD5 Hash: ${fakeHash(32)}\n\n`;
    } else if (command === "hash-sha256") {
      output.innerHTML += `SHA256 Hash: ${fakeHash(64)}\n\n`;
    } else if (command === "about") {
      showAbout();
    } else if (command === "exit") {
      output.innerHTML += "Session terminated.\n";
    } else if (command === "") {
      output.innerHTML += "\n";
    } else {
      output.innerHTML += `Command not found: ${command}\nType 'help' for list of commands.\n\n`;
    }

    output.scrollTop = output.scrollHeight;
  }
});

// ---------------- SOUND TOGGLE ----------------
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
});

// ---------------- FAKE LOGIN SYSTEM ----------------
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("user").value.trim();
  const password = document.getElementById("pass").value.trim();

  beep();

  if (username === "root" && password === "cybersec") {
    loginStatus.style.color = "#00ff99";
    loginStatus.textContent = "ACCESS GRANTED... LOADING TERMINAL";

    setTimeout(() => {
      loginOverlay.classList.add("fade-out");

      setTimeout(() => {
        loginOverlay.style.display = "none";
        bootSequence();
      }, 1000);

    }, 900);

  } else {
    loginStatus.style.color = "#ff4b4b";
    loginStatus.textContent = "ACCESS DENIED";
  }
});

// ---------------- START EFFECTS ----------------
heroTyping();
