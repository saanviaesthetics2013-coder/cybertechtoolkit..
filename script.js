const output = document.getElementById("terminal-output");
const input = document.getElementById("terminal-input");

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

function randomIP() {
  return `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
}

function generatePassword(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

function fakeHash() {
  let hash = "";
  const chars = "abcdef0123456789";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

async function simulatePingSweep() {
  await typeLine("Starting Ping Sweep...");
  await typeLine("Scanning network: 192.168.1.0/24");

  const found = Math.floor(Math.random() * 8) + 3;
  for (let i = 0; i < found; i++) {
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
    await typeLine(p, 12);
  }

  await typeLine("Port Scan Completed.");
  await typeLine("Report saved: reports/port_scan_demo.json");
}

async function simulateWebCheck() {
  await typeLine("Checking Website Security Headers...");
  await typeLine("Target: https://example.com");

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
  await typeLine("robots.txt FOUND");
  await typeLine("User-agent: *");
  await typeLine("Disallow: /admin/");
  await typeLine("Disallow: /private/");

  await typeLine("robots.txt scan completed.");
  await typeLine("Report saved: reports/robots_demo.txt");
}

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

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim().toLowerCase();
    output.innerHTML += `root@cybersec:~$ ${command}\n`;
    input.value = "";

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
      output.innerHTML += `MD5 Hash: ${fakeHash().substring(0, 32)}\n\n`;
    } else if (command === "hash-sha256") {
      output.innerHTML += `SHA256 Hash: ${fakeHash()}\n\n`;
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

bootSequence();
