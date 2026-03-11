// ================================================
// Birthday Surprise — script.js  (fixed)
// ================================================

const yesButton       = document.getElementById('yesButton');
const landing         = document.getElementById('landing');
const transitionLayer = document.getElementById('transition-layer');
const car             = document.getElementById('car');
const mainScreen      = document.getElementById('main-screen');
const birthdaySong    = document.getElementById('birthdaySong');
const heartWrapper    = document.getElementById('heart-wrapper');
const hbText          = document.getElementById('hb-text');
const people          = document.querySelectorAll('.person');

// confetti state
let confettiCanvas  = null;
let confettiCtx     = null;
let confettiPieces  = [];
let confettiRunning = false;

// ------------------------------------------------
// CLICK HANDLER
// ------------------------------------------------
yesButton.addEventListener('click', () => {
  // 1 — fade landing out
  landing.classList.add('fade-out');

  // 2 — after fade, show car on dark background
  setTimeout(() => {
    landing.style.display = 'none';
    transitionLayer.classList.add('show');
    // small rAF delay so opacity:1 transition fires BEFORE the animation class
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        car.classList.add('car-drive');
      });
    });
  }, 450);

  // 3 — show main screen while car is still crossing
  setTimeout(() => {
    mainScreen.classList.add('show');
    revealBirthday();
    playSongOnce();
    startConfetti();
  }, 1700);

  // 4 — remove transition layer after car exits
  setTimeout(() => {
    transitionLayer.classList.remove('show');
    // reset car position so it doesn't jump if someone replays
    car.classList.remove('car-drive');
  }, 2900);
});

// ------------------------------------------------
// REVEAL SEQUENCE
// ------------------------------------------------
function revealBirthday() {
  // heart pops in immediately (CSS transition on #heart-wrapper)
  heartWrapper.classList.add('reveal');

  // birthday text pops in after heart arrives
  setTimeout(() => hbText.classList.add('reveal'), 400);

  // portraits stagger in (CSS transition-delay on each #p*)
  setTimeout(() => {
    people.forEach(p => p.classList.add('reveal'));
  }, 600);

  // start heartbeat pulse after all elements have settled
  setTimeout(() => heartWrapper.classList.add('pulse'), 2000);
}

// ------------------------------------------------
// AUDIO
// ------------------------------------------------
function playSongOnce() {
  if (!birthdaySong) return;
  birthdaySong.currentTime = 0;
  birthdaySong.play().catch(() => {});
}

// ------------------------------------------------
// CONFETTI
// ------------------------------------------------
function startConfetti() {
  if (confettiRunning) return;
  confettiRunning = true;

  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCtx = confettiCanvas.getContext('2d');

  spawnPieces(300);
  requestAnimationFrame(tickConfetti);

  // stop after 20 s
  setTimeout(() => {
    confettiRunning = false;
    if (confettiCtx) confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 20000);
}

function spawnPieces(n) {
  const palette = ['#b0e0ff','#e56717','#ffffff','#ffb347','#4169e1','#c0392b','#f0e68c'];
  for (let i = 0; i < n; i++) {
    confettiPieces.push({
      x:  Math.random() * confettiCanvas.width,
      y:  Math.random() * confettiCanvas.height - confettiCanvas.height,
      w:  5 + Math.random() * 9,
      h:  5 + Math.random() * 9,
      color: palette[Math.floor(Math.random() * palette.length)],
      vy: 1.8 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot:  Math.random() * 360,
      rotV: -7 + Math.random() * 14,
      circle: Math.random() < 0.4
    });
  }
}

function tickConfetti() {
  if (!confettiRunning) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  for (const p of confettiPieces) {
    p.x   += p.vx;
    p.y   += p.vy;
    p.rot += p.rotV;
    if (p.y > confettiCanvas.height) {
      p.y = -10;
      p.x = Math.random() * confettiCanvas.width;
    }
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot * Math.PI / 180);
    confettiCtx.fillStyle = p.color;
    if (p.circle) {
      confettiCtx.beginPath();
      confettiCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      confettiCtx.fill();
    } else {
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    confettiCtx.restore();
  }
  requestAnimationFrame(tickConfetti);
}

window.addEventListener('resize', () => {
  if (!confettiCanvas) return;
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});
