// Simple confetti implementation using canvas
// (lightweight; no external libraries required)

const yesButton = document.getElementById("yesButton");
const landing = document.getElementById("landing");
const transitionLayer = document.getElementById("transition-layer");
const car = document.getElementById("car");
const mainScreen = document.getElementById("main-screen");
const birthdaySong = document.getElementById("birthdaySong");

let confettiCanvas;
let confettiCtx;
let confettiPieces = [];
let confettiRunning = false;

yesButton.addEventListener("click", () => {
  // Show car layer and start animation
  transitionLayer.classList.add("show");
  car.classList.add("car-drive");

  // Reveal main screen slightly after car starts
  setTimeout(() => {
    landing.style.display = "none";
    mainScreen.classList.add("show");
    startConfetti();
    playSongOnce();
  }, 1200); // adjust to taste vs car animation timing

  // Hide car after it leaves the screen
  setTimeout(() => {
    transitionLayer.classList.remove("show");
  }, 2600);
});

// Play audio once, if browser allows it
function playSongOnce() {
  if (!birthdaySong) return;
  birthdaySong.currentTime = 0;
  // Some browsers block autoplay; this will just fail silently
  birthdaySong.play().catch(() => {});
}

/* ===========================
   Confetti implementation
   =========================== */

function startConfetti() {
  if (confettiRunning) return;
  confettiRunning = true;

  confettiCanvas = document.createElement("canvas");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.style.position = "fixed";
  confettiCanvas.style.inset = "0";
  confettiCanvas.style.pointerEvents = "none";
  confettiCanvas.style.zIndex = "1";
  document.body.appendChild(confettiCanvas);

  confettiCtx = confettiCanvas.getContext("2d");

  createConfettiPieces(200);
  requestAnimationFrame(updateConfetti);

  // Stop after 15 seconds
  setTimeout(() => {
    confettiRunning = false;
    if (confettiCanvas && confettiCanvas.parentNode) {
      confettiCanvas.parentNode.removeChild(confettiCanvas);
    }
  }, 15000);
}

function createConfettiPieces(count) {
  const colors = ["#b0e0ff", "#e56717", "#ffffff", "#ffb347", "#4169e1"];

  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: 8 + Math.random() * 6,
      h: 8 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: -1 + Math.random() * 2,
      rotation: Math.random() * 360,
      rotationSpeed: -5 + Math.random() * 10
    });
  }
}

function updateConfetti() {
  if (!confettiRunning) return;

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;

    if (p.y > confettiCanvas.height) {
      p.y = -10;
      p.x = Math.random() * confettiCanvas.width;
    }

    drawConfettiPiece(p);
  });

  requestAnimationFrame(updateConfetti);
}

function drawConfettiPiece(p) {
  confettiCtx.save();
  confettiCtx.translate(p.x, p.y);
  confettiCtx.rotate((p.rotation * Math.PI) / 180);
  confettiCtx.fillStyle = p.color;
  confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
  confettiCtx.restore();
}

window.addEventListener("resize", () => {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});
