/* ============================================================
   CAR PRICE PREDICTION — app.js (Light Theme)
   Author: Vilash Kumar Reddy | CodeAlpha May 2026
   ============================================================ */

// ── PAGE LOADER ────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 1300);
});

// ── READING PROGRESS BAR ───────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ── NAVBAR SCROLL ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── HAMBURGER MENU ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

// close when link clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) navLinks.classList.remove('open');
});

// ── ACTIVE NAV HIGHLIGHTING ────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-35% 0px -60% 0px' });

sections.forEach(s => activeObserver.observe(s));

// ── SCROLL-REVEAL ANIMATIONS ───────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-animate]').forEach((el, i) => {
  // stagger within same parent grid
  const siblings = el.parentElement.querySelectorAll('[data-animate]');
  let delay = 0;
  siblings.forEach((sib, idx) => { if (sib === el) delay = idx * 80; });
  el.style.transitionDelay = delay + 'ms';
  revealObserver.observe(el);
});

// ── ANIMATED METRIC & STAT BARS ────────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-bar, .metric-bar').forEach(b => b.classList.add('animated'));
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stat-card-main, .model-card').forEach(el => barObserver.observe(el));

// ── COUNTER ANIMATION ──────────────────────────────────────────
function animateCounter(el) {
  const raw     = parseInt(el.dataset.target, 10);
  const decimal = parseInt(el.dataset.decimal || '0', 10);
  const dur     = 1800;
  const start   = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / dur, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const val      = Math.floor(raw * ease);

    if (decimal > 0) {
      // format as 0.XXXX (e.g. 9641 → 0.9641)
      const str = String(val).padStart(decimal, '0');
      el.textContent = '0.' + str;
    } else {
      el.textContent = val.toLocaleString();
    }

    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ── PARTICLE CANVAS (light-mode colours) ──────────────────────
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['#4F46E5', '#F59E0B', '#7C3AED', '#10B981'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x     = Math.random() * canvas.width;
      this.y     = init ? Math.random() * canvas.height : -10;
      this.vx    = (Math.random() - 0.5) * 0.5;
      this.vy    = (Math.random() - 0.5) * 0.5;
      this.r     = Math.random() * 2.5 + 0.8;
      this.alpha = Math.random() * 0.4 + 0.08;
      this.clr   = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -5) this.x = canvas.width + 5;
      if (this.x > canvas.width + 5)  this.x = -5;
      if (this.y < -5) this.y = canvas.height + 5;
      if (this.y > canvas.height + 5) this.y = -5;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.clr;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  const pts = Array.from({ length: 65 }, () => new Particle());

  function drawLines() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx   = pts[i].x - pts[j].x;
        const dy   = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = '#4F46E5';
          ctx.globalAlpha = (1 - dist / 110) * 0.08;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── LIGHTBOX ───────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbTitle  = document.getElementById('lb-title');

function openLightbox(src, title) {
  lbImg.src           = src;
  lbImg.alt           = title;
  lbTitle.textContent = title;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── BACK TO TOP ────────────────────────────────────────────────
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

btt.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── SMOOTH HOVER TILT ON VIZ CARDS ────────────────────────────
document.querySelectorAll('.viz-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width  - 0.5;
    const y    = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── SPLIT BAR TOOLTIPS ─────────────────────────────────────────
document.querySelectorAll('.split-seg[title]').forEach(seg => {
  let tip;
  seg.addEventListener('mouseenter', e => {
    tip = document.createElement('div');
    tip.textContent = seg.title;
    Object.assign(tip.style, {
      position: 'fixed',
      top: (e.clientY - 36) + 'px',
      left: e.clientX + 'px',
      background: '#111827',
      color: '#F9FAFB',
      padding: '5px 12px',
      borderRadius: '6px',
      fontSize: '0.78rem',
      fontFamily: "'Inter', sans-serif",
      fontWeight: '600',
      pointerEvents: 'none',
      zIndex: '9999',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      transform: 'translateX(-50%)',
    });
    document.body.appendChild(tip);
  });
  seg.addEventListener('mouseleave', () => { if (tip) { tip.remove(); tip = null; } });
});

// ── DOWNLOAD BUTTON FEEDBACK ────────────────────────────────────
const dlBtn = document.getElementById('dl-csv');
if (dlBtn) {
  dlBtn.addEventListener('click', () => {
    const orig = dlBtn.textContent;
    dlBtn.textContent = '✅ Downloading…';
    dlBtn.style.background = 'var(--emerald)';
    setTimeout(() => {
      dlBtn.textContent = orig;
      dlBtn.style.background = '';
    }, 2500);
  });
}

// ── CONSOLE BRANDING ───────────────────────────────────────────
console.log('%c🚗 CarPredictAI', 'color:#4F46E5;font-size:22px;font-weight:900;font-family:Inter,sans-serif');
console.log('%cCodeAlpha Data Science Internship — May 2026', 'color:#F59E0B;font-size:13px;font-weight:600');
console.log('%cAuthor: Vilash Kumar Reddy  |  Best R²: 0.9641', 'color:#6B7280;font-size:12px');
