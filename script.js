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