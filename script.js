// ================== MOBILE MENU TOGGLE ==================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
    hamburger.classList.toggle('active');
  });
}
if (closeMenu) {
  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
    hamburger.classList.remove('active');
  });
}
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
      hamburger.classList.remove('active');
    });
  });
}

// ================== REVEAL ANIMATION ==================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('show', entry.isIntersecting);
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => { el.classList.remove('show'); obs.observe(el); });
} else {
  revealEls.forEach(el => el.classList.add('show'));
}

// ================== TESTIMONIALS LOOP SLIDER ==================
// ================== TESTIMONIALS LOOP SLIDER (AUTO SCROLL + LOOP + PAUSE) ==================
(function () {
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  function onReady(cb) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') cb();
    else window.addEventListener('load', cb);
  }

  onReady(() => {
    const viewportWidth = () => Math.max(document.documentElement.clientWidth, window.innerWidth);

    const measureTrackWidth = el => {
      const children = Array.from(el.children);
      let total = 0;
      const gap = parseFloat(getComputedStyle(el).gap) || 24;
      children.forEach((child, i) => {
        total += child.getBoundingClientRect().width;
        if (i < children.length - 1) total += gap;
      });
      return total;
    };

    // ✅ Duplicate slides until track is wide enough for smooth infinite scroll
    function ensureLoopable() {
      let total = measureTrackWidth(track);
      const minNeeded = viewportWidth() * 2;
      const orig = Array.from(track.children);
      let safety = 0;
      while (total < minNeeded && safety < 10) {
        orig.forEach(n => track.appendChild(n.cloneNode(true)));
        total = measureTrackWidth(track);
        safety++;
      }
      return total;
    }

    let trackWidth = ensureLoopable();
    let loopPoint = trackWidth / 2;
    const SPEED_PX_PER_SEC = 60;
    let start = null, currentX = 0, raf;
    let isPaused = false;

    // ✅ Pause when hovered (desktop) or touched (mobile)
    track.addEventListener('mouseenter', () => { isPaused = true; });
    track.addEventListener('mouseleave', () => { isPaused = false; });
    track.addEventListener('touchstart', () => { isPaused = true; });
    track.addEventListener('touchend', () => { isPaused = false; });

    function step(ts) {
      if (!start) start = ts;
      const dt = (ts - start) / 1000;
      start = ts;

      if (!isPaused) {
        currentX += SPEED_PX_PER_SEC * dt;
        if (currentX >= loopPoint) currentX -= loopPoint;
        track.style.transform = `translate3d(${-currentX}px, 0, 0)`;
      }

      raf = requestAnimationFrame(step);
    }

    track.style.transform = 'translate3d(0,0,0)';
    track.style.willChange = 'transform';
    raf = requestAnimationFrame(step);
  });
})();




// ================== NAVBAR BACKGROUND ON SCROLL ==================
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
})();

// ================== FAQ NATURAL MOUSE HOVER ==================
const faqSection = document.querySelector('.faq-section');
if (faqSection) {
  faqSection.addEventListener('mousemove', e => {
    const rect = faqSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    faqSection.style.setProperty('--x', `${x}%`);
    faqSection.style.setProperty('--y', `${y}%`);
  });
  faqSection.addEventListener('mouseleave', () => {
    faqSection.style.setProperty('--x', '50%');
    faqSection.style.setProperty('--y', '50%');
  });
}

// ================== FAQ TOGGLE ==================
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    document.querySelectorAll('.faq-item').forEach(i => i !== item && i.classList.remove('active'));
    item.classList.toggle('active');
  });
});

// ================== NEWSLETTER ==================
const form = document.getElementById('newsletter-form');
const successMsg = document.querySelector('.success-msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  successMsg.style.display = 'block';
  form.reset();
  setTimeout(() => successMsg.style.display = 'none', 4000);
});

// ================== CANVAS ANIMATION (LEAVES, SPARKLES, POLLEN) ==================
const canvas = document.getElementById('footer-leaves');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initLeaves(); initSparkles(); initPollen();
});

let mouse = { x: null, y: null };
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

// ---- CLASSES ----
class Leaf {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 20 + 10;
    this.speed = Math.random() * 0.5 + 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = Math.random() * 0.02 - 0.01;
  }
  update() {
    this.y -= this.speed;
    this.x += Math.sin(this.angle) * 0.5;
    this.angle += this.angleSpeed;
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) { this.x += dx / 50; this.y += dy / 50; }
    }
    if (this.y < -this.size) { this.y = canvas.height + this.size; this.x = Math.random() * canvas.width; }
  }
  draw() { ctx.fillStyle = 'rgba(163,209,140,0.7)'; ctx.beginPath(); ctx.ellipse(this.x, this.y, this.size/2, this.size, this.angle, 0, Math.PI*2); ctx.fill(); }
}

class Sparkle {
  constructor(x = null, y = null) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 0.2 + 0.1;
    this.alpha = Math.random() * 0.8 + 0.2;
  }
  update() {
    if (!this.followMouse) {
      this.y -= this.speedY;
      if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; this.alpha = Math.random() * 0.8 + 0.2; }
    } else { this.alpha -= 0.02; if (this.alpha <= 0) this.toRemove = true; }
  }
  draw() { ctx.fillStyle = `rgba(255,223,100,${this.alpha})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill(); }
}

class Pollen {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedY = Math.random() * 0.05 + 0.02;
    this.alpha = Math.random() * 0.3 + 0.1;
  }
  update() { this.y -= this.speedY; if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; } }
  draw() { ctx.fillStyle = `rgba(255,255,200,${this.alpha})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill(); }
}

// ---- ARRAYS & INIT ----
let leavesArray = [], sparklesArray = [], pollenArray = [];

function initLeaves() { leavesArray = []; for (let i = 0; i < (window.innerWidth <= 768 ? 20 : 40); i++) leavesArray.push(new Leaf()); }
function initSparkles() { sparklesArray = []; for (let i = 0; i < (window.innerWidth <= 768 ? 15 : 30); i++) sparklesArray.push(new Sparkle()); }
function initPollen() { pollenArray = []; for (let i = 0; i < (window.innerWidth <= 768 ? 30 : 60); i++) pollenArray.push(new Pollen()); }

window.addEventListener('mousemove', e => {
  for (let i = 0; i < 2; i++) {
    let s = new Sparkle(e.x + (Math.random()*20-10), e.y + (Math.random()*20-10));
    s.followMouse = true;
    sparklesArray.push(s);
  }
});

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  leavesArray.forEach(l => { l.update(); l.draw(); });
  pollenArray.forEach(p => { p.update(); p.draw(); });
  sparklesArray.forEach((s, i) => { s.update(); s.draw(); if(s.toRemove) sparklesArray.splice(i,1); });
  requestAnimationFrame(animate);
}

initLeaves(); initSparkles(); initPollen(); animate();

// ================== ABOUT SECTION CARD ANIMATION ==================
const aboutCards = document.querySelectorAll('.about-card');

if (aboutCards.length) {
  aboutCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      if(window.innerWidth <= 900) return; // disable tilt on small screens
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}


// Optional: Reveal on scroll
const revealCards = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight * 0.85;
  revealCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if(cardTop < triggerBottom) {
      card.classList.add('reveal-active');
    }
  });
});


  
