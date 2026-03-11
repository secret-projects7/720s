// ================================================
// Birthday Surprise - script.js
// ================================================

const yesButton       = document.getElementById('yesButton');
const landing         = document.getElementById('landing');
const transitionLayer = document.getElementById('transition-layer');
const car             = document.getElementById('car');
const mainScreen      = document.getElementById('main-screen');
const birthdaySong    = document.getElementById('birthdaySong');
const heartContainer  = document.getElementById('heart-container');
const heartBg         = document.getElementById('heart-bg');
const hbText          = document.getElementById('hb-text');
const people          = document.querySelectorAll('.person');
const heartLobes      = document.querySelectorAll('.heart-lobe');

// ---- Confetti ----
let confettiCanvas, confettiCtx;
let confettiPieces = [];
let confettiRunning = false;

// ================================================
// CLICK HANDLER
// ================================================
yesButton.addEventListener('click', () => {
  // 1. Fade out landing
  landing.classList.add('fade-out');

  // 2. Bring in the car transition layer
  setTimeout(() => {
    landing.style.display = 'none';
    transitionLayer.classList.add('show');
    car.classList.add('car-drive');
  }, 400);

  // 3. Show main birthday screen as car finishes
  setTimeout(() => {
    mainScreen.classList.add('show');
    revealBirthday();
    playSongOnce();
    startConfetti();
  }, 1800);

  // 4. Hide transition layer after car exits
  setTimeout(() => {
    transitionLayer.classList.remove('show');
  }, 2700);
});

// ================================================
// REVEAL SEQUENCE
// ================================================
function revealBirthday() {
  // Step 1: Heart background pops in
  if (heartBg)  heartBg.classList.add('reveal');
  heartLobes.forEach(l => l.classList.add('reveal'));

  // Step 2: Heart container gets the pulse animation class
  setTimeout(() => {
    heartContainer.classList.add('reveal');
  }, 300);

  // Step 3: Happy Birthday text
  setTimeout(() => {
    hbText.classList.add('reveal');
  }, 700);

  // Step 4: People stagger in (CSS transition-delay handles stagger)
  setTimeout(() => {
    people.forEach(p => p.classList.add('reveal'));
  }, 900);
}

// ================================================
// AUDIO
// ================================================
function playSongOnce() {
  if (!birthdaySong) return;
  birthdaySong.currentTime = 0;
  birthdaySong.play().catch(() => {});
}

// ================================================
// CONFETTI
// ================================================
function startConfetti() {
  if (confettiRunning) return;
  confettiRunning = true;

  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.style.position     = 'fixed';
  confettiCanvas.style.inset        = '0';
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.zIndex       = '6';

  confettiCtx = confettiCanvas.getContext('2d');
  createConfettiPieces(280);
  requestAnimationFrame(updateConfetti);

  // Stop after 18 seconds
  setTimeout(() => {
    confettiRunning = false;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 18000);
}

function createConfettiPieces(count) {
  const colors = ['#b0e0ff', '#e56717', '#ffffff', '#ffb347', '#4169e1', '#c0392b', '#f0e68c'];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x:             Math.random() * (confettiCanvas ? confettiCanvas.width  : window.innerWidth),
      y:             Math.random() * (confettiCanvas ? confettiCanvas.height : window.innerHeight) - window.innerHeight,
      w:             6 + Math.random() * 8,
      h:             6 + Math.random() * 8,
      color:         colors[Math.floor(Math.random() * colors.length)],
      speedY:        1.5 + Math.random() * 3,
      speedX:        -1.5 + Math.random() * 3,
      rotation:      Math.random() * 360,
      rotationSpeed: -6 + Math.random() * 12,
      shape:         Math.random() < 0.5 ? 'rect' : 'circle',
    });
  }
}

function updateConfetti() {
  if (!confettiRunning) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    if (p.y > confettiCanvas.height) {
      p.y = -10;
      p.x = Math.random() * confettiCanvas.width;
    }
    drawPiece(p);
  });
  requestAnimationFrame(updateConfetti);
}

function drawPiece(p) {
  confettiCtx.save();
  confettiCtx.translate(p.x, p.y);
  confettiCtx.rotate((p.rotation * Math.PI) / 180);
  confettiCtx.fillStyle = p.color;
  if (p.shape === 'circle') {
    confettiCtx.beginPath();
    confettiCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
    confettiCtx.fill();
  } else {
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
  }
  confettiCtx.restore();
}

window.addEventListener('resize', () => {
  if (!confettiCanvas) return;
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});
