// ================== MOBILE MENU TOGGLE ==================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
    hamburger.classList.toggle('active');
  });
}

if (closeMenu && hamburger && mobileMenu) {
  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('show');
    hamburger.classList.remove('active');
  });
}

if (mobileMenu && hamburger) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
      hamburger.classList.remove('active');
    });
  });
}

// ================== REVEAL ANIMATION ==================
// ================== REVEAL ANIMATION (FIXED) ==================
// ================== REVEAL ANIMATION (DESKTOP REPLAY FIX) ==================
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {

      // DESKTOP: replay animation every time
      if (window.innerWidth > 768) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      }

      // MOBILE: show once, no replay (smooth)
      else {
        entry.target.classList.add('show');
      }

    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  });

  revealEls.forEach(el => {
    el.classList.remove('show');
    obs.observe(el);
  });
} else {
  revealEls.forEach(el => el.classList.add('show'));
}


// ================== TESTIMONIALS LOOP SLIDER ==================
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
    let start = null, currentX = 0;
    let isPaused = false;

    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => isPaused = false);
    track.addEventListener('touchstart', () => isPaused = true);
    track.addEventListener('touchend', () => isPaused = false);

    function step(ts) {
      if (!start) start = ts;
      const dt = (ts - start) / 1000;
      start = ts;

      if (!isPaused) {
        currentX += SPEED_PX_PER_SEC * dt;
        if (currentX >= loopPoint) currentX -= loopPoint;
        track.style.transform = `translate3d(${-currentX}px, 0, 0)`;
      }
      requestAnimationFrame(step);
    }

    track.style.willChange = 'transform';
    requestAnimationFrame(step);
  });
})();

// ================== NAVBAR BACKGROUND ON SCROLL ==================
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
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
  const question = item.querySelector('.faq-question');
  if (!question) return;

  question.addEventListener('click', () => {
    document.querySelectorAll('.faq-item').forEach(i => {
      if (i !== item) i.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

// ================== NEWSLETTER ==================
const form = document.getElementById('newsletter-form');
const successMsg = document.querySelector('.success-msg');

if (form && successMsg) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    successMsg.style.display = 'block';
    form.reset();
    setTimeout(() => successMsg.style.display = 'none', 4000);
  });
}

// ================== FOOTER CANVAS (REPLACED & MATCHED) ==================
// ================== FOOTER CANVAS ==================
const canvas = document.getElementById('footer-leaves');
const seasonBtn = document.getElementById('seasonBtn');

if (canvas && seasonBtn) {

  const ctx = canvas.getContext('2d');

 // ✅ Resize canvas to FULL footer height
  function resizeCanvas() {
    const footer = canvas.closest('.footer');
    if (!footer) return;

    canvas.width = footer.clientWidth;
    canvas.height = footer.scrollHeight;
  }

  // ✅ Force resize after footer fully renders (mobile fix)
  function forceResize() {
    resizeCanvas();
    requestAnimationFrame(resizeCanvas);
    setTimeout(resizeCanvas, 300);
    setTimeout(resizeCanvas, 800);
  }

  window.addEventListener('load', forceResize);
  window.addEventListener('resize', forceResize);
  window.addEventListener('orientationchange', forceResize)

  // 📱 Detect mobile
const isMobile = window.innerWidth < 768;

// 🎛 Performance tuning
const RAIN_COUNT = isMobile ? 40 : 90;
const LEAF_COUNT = isMobile ? 20 : 35;


  // 🌙 AUTO DAY / NIGHT
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour <= 6;

  // 🎚️ SEASON STATE
  let season = 'monsoon';
  seasonBtn.textContent = '🌧️ Monsoon';

  seasonBtn.addEventListener('click', () => {
    season = season === 'monsoon' ? 'autumn' : 'monsoon';
    seasonBtn.textContent = season === 'monsoon' ? '🌧️ Monsoon' : '🍂 Autumn';
    init();
  });

  // 🍃 AUTUMN COLORS
  const leafColors = isNight
    ? ['rgba(150,100,50,0.9)', 'rgba(170,120,60,0.9)', 'rgba(130,80,40,0.9)']
    : ['rgba(200,150,80,0.9)', 'rgba(180,120,60,0.9)', 'rgba(220,170,90,0.9)', 'rgba(160,100,50,0.9)'];

  // 🌬️ WIND
  let wind = 0.5;
  setInterval(() => {
    wind = Math.random() * 1.2 - 0.6;
  }, 5000);

  // 🖱️ MOUSE TRACKING
  const mouse = { x: null, y: null };
  const footer = canvas.closest('.footer');

  if (footer) {
    footer.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    footer.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  // ⛈️ LIGHTNING
  //let lightningAlpha = 0;
  //function triggerLightning() {
   // if (season === 'monsoon' && Math.random() < 0.01) {
     // lightningAlpha = 1;
    //}
 // }

  let rain = [];
  let leaves = [];

  class RainDrop {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.len = Math.random() * 18 + 10;
      this.speed = Math.random() * 6 + 4;
    }
    update() {
      this.y += this.speed;
      this.x += wind;
      if (this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.strokeStyle = isNight ? 'rgba(160,200,255,0.5)' : 'rgba(120,180,240,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.len);
      ctx.stroke();
    }
  }

  class Leaf {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 120;
      this.size = Math.random() * 22 + 16;
      this.speed = Math.random() * 0.5 + 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
    }
    update() {
      this.y -= this.speed;
      this.x += Math.sin(this.angle) + wind;
      this.angle += 0.01;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 130;
        if (dist < radius && dist > 1) {
          const force = (radius - dist) / radius;
          this.x += (dx / dist) * force * 7;
          this.y += (dy / dist) * force * 7;
        }
      }

      if (this.y < -this.size || this.x < -100 || this.x > canvas.width + 100) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.4, this.size * 0.6, this.size * 0.6, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.6, -this.size * 0.6, -this.size * 0.4, 0, -this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    rain = [];
    leaves = [];
    if (season === 'monsoon') {
      for (let i = 0; i < 90; i++) rain.push(new RainDrop());
    } else {
      for (let i = 0; i < 35; i++) leaves.push(new Leaf());
    }
  }
  init();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   // triggerLightning();

    if (season === 'monsoon') {
      rain.forEach(r => { r.update(); r.draw(); });
     // if (lightningAlpha > 0) {
      //  ctx.fillStyle = `rgba(255,255,255,${lightningAlpha})`;
      //  ctx.fillRect(0, 0, canvas.width, canvas.height);
       // lightningAlpha -= 0.05;
     // }
    } else {
      leaves.forEach(l => { l.update(); l.draw(); });
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ================== ABOUT SECTION CARD ANIMATION ==================
document.querySelectorAll('.about-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth <= 900) return;
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height/2) / (rect.height/2)) * 10;
    const rotateY = ((e.clientX - rect.left - rect.width/2) / (rect.width/2)) * 10;
    card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});


