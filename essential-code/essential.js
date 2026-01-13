// ================== NEWSLETTER ==================
const form = document.getElementById('newsletter-form');
const successMsg = document.querySelector('.success-msg');

if (form && successMsg) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    successMsg.style.display = 'block';
    form.reset();
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 4000);
  });
}

// ================== FOOTER CANVAS ==================
const canvas = document.getElementById('footer-leaves');
const seasonBtn = document.getElementById('seasonBtn');

if (canvas && seasonBtn) {

  const ctx = canvas.getContext('2d');

 function resizeCanvas() {
  const footer = canvas.closest('.footer');
  if (!footer) return;

  canvas.width = footer.clientWidth;
  canvas.height = footer.scrollHeight;
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
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
  let lightningAlpha = 0;
  function triggerLightning() {
    if (season === 'monsoon' && Math.random() < 0.01) {
      lightningAlpha = 1;
    }
  }

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
    triggerLightning();

    if (season === 'monsoon') {
      rain.forEach(r => { r.update(); r.draw(); });
      if (lightningAlpha > 0) {
        ctx.fillStyle = `rgba(255,255,255,${lightningAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lightningAlpha -= 0.05;
      }
    } else {
      leaves.forEach(l => { l.update(); l.draw(); });
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ================== MOBILE PRODUCT POPUP ==================
document.addEventListener('DOMContentLoaded', () => {

  if (window.innerWidth > 768) return;

  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'mobile-popup-overlay';
  document.body.appendChild(popupOverlay);

  document.querySelectorAll('.fragrance-card').forEach(card => {

    card.addEventListener('touchstart', e => {

      // ❌ Ignore taps on links & buttons
      if (e.target.closest('a, button')) return;

      e.preventDefault();
      e.stopPropagation();

      popupOverlay.innerHTML = '';

      const popupCard = card.cloneNode(true);
      popupCard.classList.add('mobile-popup-card');

      popupOverlay.appendChild(popupCard);
      popupOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';

    }, { passive: false });

  });

  popupOverlay.addEventListener('touchstart', e => {
    if (e.target === popupOverlay) {
      popupOverlay.classList.remove('show');
      popupOverlay.innerHTML = '';
      document.body.style.overflow = '';
    }
  });

});
