// MOBILE MENU TOGGLE (unchanged)
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

// REVEAL ANIMATION using IntersectionObserver (re-runs when element leaves+re-enters)
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
      else entry.target.classList.remove('show');
    });
  }, {threshold: 0.12});
  revealEls.forEach(el => { el.classList.remove('show'); obs.observe(el); });
} else {
  // fallback
  revealEls.forEach(el => el.classList.add('show'));
}

/* ===== Testimonials full-width continuous left-loop JS =====
   Behavior:
   - Uses a wide track (.slider-track) moved with transform: translateX()
   - Duplicates track content at runtime until track width >= 2x viewport (ensures seamless wrap)
   - Moves left at a constant speed (pixels/sec). Normal speed tuned for desktop & mobile.
   - Never stops looping. No pause on hover (per request). If you prefer pause on hover, tell me.
*/
(function() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;

  // Make sure images/fonts can load before measuring — run after load if needed
  function onReady(cb) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') cb();
    else window.addEventListener('load', cb);
  }

  onReady(() => {
    // compute widths and duplicate until enough content exists to loop seamlessly
    const viewportWidth = () => Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    // helper to measure track total width including gaps
    function measureTrackWidth(el) {
      const children = Array.from(el.children);
      let total = 0;
      const gap = parseFloat(getComputedStyle(el).gap) || 24;
      children.forEach((child, i) => {
        const w = child.getBoundingClientRect().width;
        total += w;
        if (i < children.length - 1) total += gap;
      });
      return total;
    }

    // duplicate until trackWidth >= 2 * viewportWidth
    function ensureLoopable() {
      let total = measureTrackWidth(track);
      const minNeeded = viewportWidth() * 2;
      // if too small, clone the original set (not clones) to preserve semantics
      const orig = Array.from(track.children);
      let safety = 0;
      while (total < minNeeded && safety < 10) {
        orig.forEach(n => {
          const clone = n.cloneNode(true);
          track.appendChild(clone);
        });
        total = measureTrackWidth(track);
        safety++;
      }
      return total;
    }

    let trackWidth = ensureLoopable();

    // We'll animate transformX on the track. When it reaches -halfWidth, we reset to 0.
    // Determine half point (we duplicate content so the track is at least 2x viewport).
    // Find "loopPoint" as half of track width (the point where content repeats).
    // Use translateX from 0 -> -loopPoint, then set to 0 seamlessly.
    let loopPoint = trackWidth / 2;

    // If loopPoint is 0 (weird), abort
    if (loopPoint <= 0) return;

    // Set sensible speed (pixels per second). "Normal" speed:
    // Desktop & mobile both same speed per request; if you want slightly slower on mobile,
    // we could reduce using device detection — but you asked normal on both.
    const SPEED_PX_PER_SEC = 60; // normal speed: 60 px/s

    let start = null;
    let currentX = 0;
    let raf;

    // to prevent tiny jitter, use transform translate3d
    function step(ts) {
      if (!start) start = ts;
      const dt = (ts - start) / 1000; // seconds since start
      start = ts;

      // advance
      currentX += SPEED_PX_PER_SEC * dt;

      // when currentX >= loopPoint, wrap
      if (currentX >= loopPoint) {
        // subtract loopPoint to wrap seamlessly
        currentX -= loopPoint;
      }

      // apply transform (negative because we move left)
      track.style.transform = `translate3d(${-currentX}px, 0, 0)`;

      raf = requestAnimationFrame(step);
    }

    // Ensure track has no accidental initial transform and uses will-change for performance
    track.style.transform = 'translate3d(0,0,0)';
    track.style.willChange = 'transform';

    // Start the animation loop
    raf = requestAnimationFrame(step);

    // Recompute sizes on resize (and re-seed duplicates if needed)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      // debounce
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // reset variables and maybe duplicate more if needed
        // remove any transforms temporarily
        track.style.transform = 'translate3d(0,0,0)';
        currentX = 0;
        start = null;

        // measure and ensure loopability again
        trackWidth = ensureLoopable();
        loopPoint = trackWidth / 2;

        // restart
        raf = requestAnimationFrame(step);
      }, 120);
    });

    // Safety cleanup when unloading page
    window.addEventListener('beforeunload', () => {
      if (raf) cancelAnimationFrame(raf);
    });
  });
})();

// NAV BACKGROUND ON SCROLL (unchanged)
(function(){
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

})();

// ================= FAQ NATURAL MOUSE HOVER BACKGROUND EFFECT =================
const faqSection = document.querySelector('.faq-section');

if (faqSection) {
  faqSection.addEventListener('mousemove', (e) => {
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

// ================= FAQ TOGGLE FUNCTIONALITY =================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    faqItems.forEach(i => {
      if (i !== item) i.classList.remove('active');
    });

    item.classList.toggle('active');
  });
});


// Newsletter
const form = document.getElementById('newsletter-form');
const successMsg = document.querySelector('.success-msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  successMsg.style.display = 'block';
  form.reset();
  setTimeout(() => successMsg.style.display = 'none', 4000);
});

// Mouse
let mouse = { x: null, y: null };
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

// Canvas
const canvas = document.getElementById('footer-leaves');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initLeaves();
  initSparkles();
  initPollen();
});

// Leaf class
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

    if(mouse.x && mouse.y){
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100){
        this.x += dx/50;
        this.y += dy/50;
      }
    }

    if(this.y < -this.size){
      this.y = canvas.height + this.size;
      this.x = Math.random() * canvas.width;
    }
  }
  draw(){
    ctx.fillStyle = 'rgba(163,209,140,0.7)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size/2, this.size, this.angle, 0, Math.PI*2);
    ctx.fill();
  }
}

// Sparkle class
class Sparkle {
  constructor(x=null, y=null){
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 0.2 + 0.1;
    this.alpha = Math.random() * 0.8 + 0.2;
  }
  update(){
    if(!this.followMouse){
      this.y -= this.speedY;
      if(this.y < 0){
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
        this.alpha = Math.random() * 0.8 + 0.2;
      }
    } else {
      this.alpha -= 0.02;
      if(this.alpha <= 0) this.toRemove = true;
    }
  }
  draw(){
    ctx.fillStyle = `rgba(255,223,100,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

// Pollen class
class Pollen {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedY = Math.random() * 0.05 + 0.02;
    this.alpha = Math.random() * 0.3 + 0.1;
  }
  update(){
    this.y -= this.speedY;
    if(this.y < 0){
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
      this.alpha = Math.random() * 0.3 + 0.1;
    }
  }
  draw(){
    ctx.fillStyle = `rgba(255,255,200,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

// Initialize arrays
let leavesArray = [];
let sparklesArray = [];
let pollenArray = [];

function initLeaves(){
  leavesArray=[];
  let count = window.innerWidth <= 768 ? 20 : 40;
  for(let i=0;i<count;i++) leavesArray.push(new Leaf());
}

function initSparkles(){
  sparklesArray=[];
  let count = window.innerWidth <= 768 ? 15 : 30;
  for(let i=0;i<count;i++) sparklesArray.push(new Sparkle());
}

function initPollen(){
  pollenArray=[];
  let count = window.innerWidth <= 768 ? 30 : 60;
  for(let i=0;i<count;i++) pollenArray.push(new Pollen());
}

// Mouse trailing sparkles
window.addEventListener('mousemove', e => {
  for(let i=0;i<2;i++){
    let s = new Sparkle(e.x + (Math.random()*20-10), e.y + (Math.random()*20-10));
    s.followMouse = true;
    sparklesArray.push(s);
  }
});

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  leavesArray.forEach(l=>{ l.update(); l.draw(); });
  pollenArray.forEach(p=>{ p.update(); p.draw(); });
  sparklesArray.forEach((s,i)=>{
    s.update();
    s.draw();
    if(s.toRemove) sparklesArray.splice(i,1);
  });

  requestAnimationFrame(animate);
}

initLeaves();
initSparkles();
initPollen();
animate();
