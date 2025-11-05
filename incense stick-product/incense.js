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

// ================== CANVAS ANIMATION (LEAVES, SPARKLES, POLLEN) ==================
const canvas = document.getElementById('footer-leaves');
if (canvas) {
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

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

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
        if (dist < 100) {
          this.x += dx / 50;
          this.y += dy / 50;
        }
      }
      if (this.y < -this.size) {
        this.y = canvas.height + this.size;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = 'rgba(163,209,140,0.7)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size / 2, this.size, this.angle, 0, Math.PI * 2);
      ctx.fill();
    }
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
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
          this.alpha = Math.random() * 0.8 + 0.2;
        }
      } else {
        this.alpha -= 0.02;
        if (this.alpha <= 0) this.toRemove = true;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(255,223,100,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Pollen {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.05 + 0.02;
      this.alpha = Math.random() * 0.3 + 0.1;
    }
    update() {
      this.y -= this.speedY;
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(255,255,200,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---- ARRAYS & INIT ----
  let leavesArray = [], sparklesArray = [], pollenArray = [];

  function initLeaves() {
    leavesArray = [];
    for (let i = 0; i < (window.innerWidth <= 768 ? 20 : 40); i++) leavesArray.push(new Leaf());
  }
  function initSparkles() {
    sparklesArray = [];
    for (let i = 0; i < (window.innerWidth <= 768 ? 15 : 30); i++) sparklesArray.push(new Sparkle());
  }
  function initPollen() {
    pollenArray = [];
    for (let i = 0; i < (window.innerWidth <= 768 ? 30 : 60); i++) pollenArray.push(new Pollen());
  }

  window.addEventListener('mousemove', e => {
    for (let i = 0; i < 2; i++) {
      let s = new Sparkle(e.x + (Math.random() * 20 - 10), e.y + (Math.random() * 20 - 10));
      s.followMouse = true;
      sparklesArray.push(s);
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leavesArray.forEach(l => { l.update(); l.draw(); });
    pollenArray.forEach(p => { p.update(); p.draw(); });
    sparklesArray.forEach((s, i) => {
      s.update();
      s.draw();
      if (s.toRemove) sparklesArray.splice(i, 1);
    });
    requestAnimationFrame(animate);
  }

  initLeaves();
  initSparkles();
  initPollen();
  animate();
}
// ================== NAVBAR & MOBILE MENU ==================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const navbar = document.getElementById('navbar');

// Create overlay for dim background
let overlay = document.createElement('div');
overlay.classList.add('menu-overlay');
document.body.appendChild(overlay);

// ✅ Toggle mobile menu
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('show');
  });
}

// ✅ Close button or overlay click
if (closeMenu) {
  closeMenu.addEventListener('click', closeMobileMenu);
}
overlay.addEventListener('click', closeMobileMenu);

// ✅ Close when a link is clicked
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  hamburger.classList.remove('active');
  overlay.classList.remove('show');
}

// ✅ Navbar background on scroll
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
});
