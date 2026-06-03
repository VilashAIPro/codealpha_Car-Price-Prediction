/* ============================================================
   CAR PRICE PREDICTION — app.js
   Author: Vilash Kumar Reddy | CodeAlpha May 2026
   ============================================================ */

// ── NAVBAR SCROLL ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER MENU ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── SMOOTH ACTIVE NAV LINK ─────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ── SCROLL REVEAL ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

// ── ANIMATE STAT BARS ──────────────────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-bar, .metric-bar').forEach(bar => {
        bar.classList.add('animated');
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-card-main, .model-card').forEach(el => barObserver.observe(el));

// ── COUNTER ANIMATION ──────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);   // ease-out cubic
    const val      = Math.floor(target * ease);
    el.textContent = val + suffix;
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

// ── PARTICLE CANVAS ────────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function Particle() {
  this.x    = Math.random() * canvas.width;
  this.y    = Math.random() * canvas.height;
  this.vx   = (Math.random() - 0.5) * 0.4;
  this.vy   = (Math.random() - 0.5) * 0.4;
  this.r    = Math.random() * 2 + 0.5;
  const hue = Math.random() > 0.5 ? '#FF6B9D' : '#00D4FF';
  this.clr  = hue;
  this.alpha = Math.random() * 0.5 + 0.1;
}

Particle.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
  if (this.x < 0) this.x = canvas.width;
  if (this.x > canvas.width)  this.x = 0;
  if (this.y < 0) this.y = canvas.height;
  if (this.y > canvas.height) this.y = 0;
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  ctx.fillStyle = this.clr;
  ctx.globalAlpha = this.alpha;
  ctx.fill();
  ctx.globalAlpha = 1;
};

// create particles
for (let i = 0; i < 80; i++) particles.push(new Particle());

// draw connecting lines
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#00D4FF';
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── LIGHTBOX ───────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbTitle  = document.getElementById('lb-title');

function openLightbox(src, title) {
  lbImg.src      = src;
  lbTitle.textContent = title;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lbImg.src = '';
}

// close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── STAGGERED CARD ANIMATION DELAY ────────────────────────────
document.querySelectorAll('.about-grid [data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.07}s`;
});
document.querySelectorAll('.viz-grid [data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.06}s`;
});
document.querySelectorAll('.insights-grid [data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.07}s`;
});
document.querySelectorAll('.tech-grid [data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.06}s`;
});
document.querySelectorAll('.pipeline-step[data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});
document.querySelectorAll('.models-grid [data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.12}s`;
});

// ── ACTIVE NAV STYLE ───────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--cyan) !important; }`;
document.head.appendChild(style);

// ── TOOLTIP FOR SPLIT BAR ──────────────────────────────────────
document.querySelectorAll('.split-seg').forEach(seg => {
  seg.addEventListener('mouseenter', e => {
    const tip = document.createElement('div');
    tip.className = 'seg-tooltip';
    tip.textContent = seg.title;
    tip.style.cssText = `
      position:fixed;top:${e.clientY-34}px;left:${e.clientX}px;
      background:rgba(0,0,0,0.85);color:#fff;padding:5px 12px;
      border-radius:6px;font-size:0.78rem;pointer-events:none;z-index:999;
      border:1px solid rgba(255,255,255,0.1);
    `;
    document.body.appendChild(tip);
    seg._tip = tip;
  });
  seg.addEventListener('mouseleave', () => {
    if (seg._tip) { seg._tip.remove(); seg._tip = null; }
  });
});

// ── LOG ────────────────────────────────────────────────────────
console.log('%c🚗 CarPredictAI', 'color:#FF6B9D;font-size:20px;font-weight:bold;');
console.log('%cCodeAlpha Data Science Internship — May 2026', 'color:#00D4FF;font-size:12px;');
console.log('%cAuthor: Vilash Kumar Reddy', 'color:#FFD700;font-size:12px;');
