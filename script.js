/**
 * script.js — Sathish G Portfolio
 * Features:
 *  - Sticky navbar with active-link highlighting
 *  - Mobile hamburger menu
 *  - Dark / Light mode toggle with localStorage persistence
 *  - Typing animation (hero)
 *  - Animated counter (hero stats)
 *  - Scroll-triggered reveal animations
 *  - Skill progress-bar animation
 *  - Particle canvas background
 *  - Contact form validation
 *  - Back-to-top button
 *  - Smooth scroll
 *  - Footer year
 */

'use strict';

/* ============================================================
   UTILITIES
   ============================================================ */

/**
 * Throttle function – limits how often fn() fires.
 * @param {Function} fn
 * @param {number}   wait  ms
 */
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn.apply(this, args); }
  };
}

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navMenu      = document.getElementById('nav-menu');
const navLinks     = document.querySelectorAll('.nav-link');
const themeToggle  = document.getElementById('theme-toggle');
const themeIcon    = document.getElementById('theme-icon');
const backToTop    = document.getElementById('back-to-top');
const contactForm  = document.getElementById('contact-form');
const footerYear   = document.getElementById('footer-year');
const typedTarget  = document.getElementById('typed-text');
const particles    = document.getElementById('particles-canvas');
const downloadBtn  = document.getElementById('download-resume-btn');

/* ============================================================
   1. FOOTER YEAR
   ============================================================ */
if (footerYear) footerYear.textContent = new Date().getFullYear();

/* ============================================================
   2. DARK / LIGHT MODE TOGGLE
   ============================================================ */
(function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);
})();

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  // Keep the legacy class for navbar background compatibility
  document.body.classList.toggle('light-mode', theme === 'light');
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
  localStorage.setItem('portfolio-theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.dataset.theme === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
}

/* ============================================================
   3. HAMBURGER MENU (MOBILE)
   ============================================================ */
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   4. NAVBAR – SCROLL BEHAVIOUR & ACTIVE LINK
   ============================================================ */
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  const scrollY = window.scrollY;

  // Sticky shadow
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 20);

  // Back-to-top visibility
  if (backToTop) backToTop.classList.toggle('visible', scrollY > 400);

  // Active nav link highlighting
  let currentId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (scrollY >= sectionTop) currentId = section.id;
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${currentId}`);
  });
}

window.addEventListener('scroll', throttle(onScroll, 80));
onScroll(); // Run once on page load

/* ============================================================
   5. BACK TO TOP BUTTON
   ============================================================ */
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   6. TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  if (!typedTarget) return;

  const strings = [
    'Java Backend Developer',
    'Spring Boot Specialist',
    'Microservices Architect',
    'REST API Developer',
    'Cloud Enthusiast'
  ];

  let strIdx  = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = strings[strIdx];

    if (isDeleting) {
      typedTarget.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedTarget.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === current.length) {
      // Pause at end of word
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      strIdx = (strIdx + 1) % strings.length;
      delay = 350;
    } else {
      delay = isDeleting ? 55 : 100;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 600);
})();

/* ============================================================
   7. ANIMATED COUNTERS (hero stats)
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800; // ms
  const step = Math.ceil(duration / target);
  let current = 0;

  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, step);
}

/* ============================================================
   8. INTERSECTION OBSERVER – Reveal & Skill Bars & Counters
   ============================================================ */
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll(
  '.animate-on-scroll, .animate-fadein-left, .animate-fadein-right'
).forEach(el => revealObserver.observe(el));

// Skill bar observer – fires bars after card becomes visible
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target.querySelector('.skill-bar');
    if (bar) {
      const targetWidth = bar.dataset.width;
      setTimeout(() => { bar.style.width = targetWidth + '%'; }, 200);
    }
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* ============================================================
   9. PARTICLE CANVAS BACKGROUND
   ============================================================ */
(function initParticles() {
  if (!particles) return;

  const ctx = particles.getContext('2d');
  let W, H;
  let particleArr = [];
  const COUNT = 70;

  function resize() {
    W = particles.width  = window.innerWidth;
    H = particles.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = Math.random() * H;
      this.r   = Math.random() * 1.8 + 0.5;
      this.vx  = (Math.random() - 0.5) * 0.4;
      this.vy  = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.35 + 0.05;
    }
    move() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
  }

  function initParticleArr() {
    particleArr = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particleArr.length; i++) {
      for (let j = i + 1; j < particleArr.length; j++) {
        const a = particleArr[i], b = particleArr[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const isDark = document.body.dataset.theme === 'dark';
          ctx.strokeStyle = isDark
            ? `rgba(62,146,204,${0.08 * (1 - dist / 110)})`
            : `rgba(10,36,99,${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  let animId;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.body.dataset.theme === 'dark';

    particleArr.forEach(p => {
      p.move();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(62,146,204,${p.alpha})`
        : `rgba(10,36,99,${p.alpha * 0.8})`;
      ctx.fill();
    });

    drawConnections();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', throttle(() => { resize(); }, 200));
  resize();
  initParticleArr();
  loop();
})();

/* ============================================================
   10. CONTACT FORM VALIDATION
   ============================================================ */
if (contactForm) {
  const fields = {
    name:    { el: document.getElementById('contact-name'),    err: document.getElementById('name-error') },
    email:   { el: document.getElementById('contact-email'),   err: document.getElementById('email-error') },
    subject: { el: document.getElementById('contact-subject'), err: document.getElementById('subject-error') },
    message: { el: document.getElementById('contact-message'), err: document.getElementById('message-error') }
  };
  const submitBtn   = document.getElementById('submit-btn');
  const submitText  = document.getElementById('submit-text');
  const successMsg  = document.getElementById('form-success');

  /**
   * Validate a single field and return true if valid.
   */
  function validateField(key) {
    const { el, err } = fields[key];
    const val = el.value.trim();
    let msg = '';

    switch (key) {
      case 'name':
        if (!val)           msg = 'Please enter your full name.';
        else if (val.length < 2) msg = 'Name must be at least 2 characters.';
        break;
      case 'email':
        if (!val)           msg = 'Please enter your email address.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Please enter a valid email.';
        break;
      case 'subject':
        if (!val)           msg = 'Please enter a subject.';
        else if (val.length < 4) msg = 'Subject is too short.';
        break;
      case 'message':
        if (!val)           msg = 'Please write your message.';
        else if (val.length < 20) msg = 'Message should be at least 20 characters.';
        break;
    }

    err.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  // Form submit
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const valid = Object.keys(fields).map(key => validateField(key)).every(Boolean);
    if (!valid) return;

    // Simulate submission (replace with your backend endpoint)
    submitBtn.disabled = true;
    submitText.textContent = 'Sending…';
    submitBtn.style.opacity = '0.75';

    await new Promise(resolve => setTimeout(resolve, 1400));

    submitBtn.disabled = false;
    submitText.textContent = 'Send Message';
    submitBtn.style.opacity = '1';

    contactForm.reset();
    Object.keys(fields).forEach(key => {
      fields[key].el.classList.remove('error');
      fields[key].err.textContent = '';
    });

    if (successMsg) {
      successMsg.style.display = 'flex';
      setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    }
  });
}

/* ============================================================
   11. SMOOTH SCROLL for anchor links (polyfill helper)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   12. DOWNLOAD RESUME BUTTON
   (Attach real PDF path here when available)
   ============================================================ */
if (downloadBtn) {
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Replace 'resume.pdf' with the actual file path when available.
    const resumePath = 'resume.pdf';
    const a = document.createElement('a');
    a.href = resumePath;
    a.download = 'Sathish_G_Resume.pdf';
    // Graceful fallback — alert if file not found
    fetch(resumePath, { method: 'HEAD' }).then(res => {
      if (res.ok) {
        a.click();
      } else {
        alert('Resume file not found. Please add resume.pdf to the portfolio folder.');
      }
    }).catch(() => {
      alert('Resume file not found. Please add resume.pdf to the portfolio folder.');
    });
  });
}

/* ============================================================
   13. PROJECT CARD 3D TILT EFFECT
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const rotX  = ((e.clientY - cy) / (rect.height / 2)) * -6;
    const rotY  = ((e.clientX - cx) / (rect.width  / 2)) *  6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================================
   14. CERT CARD HOVER GLOW
   ============================================================ */
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = 'var(--shadow-glow), var(--shadow-lg)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ============================================================
   End of script.js
   ============================================================ */
