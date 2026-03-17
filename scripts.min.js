/* =============================================
   INIT
   ============================================= */
AOS.init({ once: false, offset: 80, duration: 900, easing: 'ease-out-cubic' });
emailjs.init("X3hyI6ImGcwFx0oAE");

/* =============================================
   PRELOADER
   ============================================= */
document.body.style.overflow = 'hidden';

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
});

/* =============================================
   HERO CANVAS — Floating particles
   ============================================= */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const PARTICLE_COUNT = 60;
  const ACCENT_COLOR   = '245, 200, 66';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.3,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.05,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${ACCENT_COLOR}, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT_COLOR}, ${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

/* =============================================
   SCROLL PROGRESS
   ============================================= */
function updateScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  const pct = window.scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100;
  bar.style.width = pct + '%';
}

/* =============================================
   NAV — scroll-aware
   ============================================= */
const navbar = document.getElementById('navbar');
const topBtn = document.getElementById('topBtn');

window.addEventListener('scroll', () => {
  updateScrollProgress();
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  topBtn.classList.toggle('visible',  window.scrollY > 400);
});

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* =============================================
   HAMBURGER / MOBILE NAV
   ============================================= */
const hamburger     = document.getElementById('hamburger');
const navLinks      = document.getElementById('nav-links');
const mobileOverlay = document.getElementById('mobileOverlay');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  mobileOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleMobileMenu(e) {
  e.preventDefault();
  e.stopPropagation();
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  mobileOverlay.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileMenu);
// touchend for snappier response on mobile
hamburger.addEventListener('touchend', toggleMobileMenu, { passive: false });

mobileOverlay.addEventListener('click', closeMobileMenu);
mobileOverlay.addEventListener('touchend', (e) => { e.preventDefault(); closeMobileMenu(); }, { passive: false });
document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMobileMenu));

/* =============================================
   DARK / LIGHT MODE
   ============================================= */
const modeToggle = document.getElementById('modeToggle');
const body       = document.body;
const toggleIcon = document.querySelector('.toggle-icon');

function setMode(mode) {
  if (mode === 'light') {
    body.classList.replace('dark', 'light');
    toggleIcon.textContent = '⏾';
    localStorage.setItem('mode', 'light');
  } else {
    body.classList.replace('light', 'dark');
    toggleIcon.textContent = '☀︎';
    localStorage.setItem('mode', 'dark');
  }
}

setMode(localStorage.getItem('mode') === 'light' ? 'light' : 'dark');
modeToggle.addEventListener('click', () => setMode(body.classList.contains('dark') ? 'light' : 'dark'));

/* =============================================
   CUSTOM CURSOR
   ============================================= */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');

if (cursor && trail) {
  let trailX = 0, trailY = 0, mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  })();

  document.querySelectorAll(
    'a, button, input, textarea, .project-card-wrapper, .tech-badge, .skill-item, #topBtn, .service-pill'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered');    trail.classList.add('hovered');    });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); trail.classList.remove('hovered'); });
  });
}

/* =============================================
   PROJECT CARD FLIP — mobile tap / desktop click
   On desktop the CSS :hover handles the flip.
   On mobile we toggle a .flipped class via click
   (the native click event fires reliably on touch
   without fighting synthetic mouse events).
   ============================================= */
(function () {
  const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // Update hint text for mobile
  if (isMobile) {
    document.querySelectorAll('.card-hint').forEach(hint => {
      hint.textContent = 'Tap to see details ↗';
    });
  }

  const allWrappers = document.querySelectorAll('.project-card-wrapper');

  allWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', (e) => {
      // Let link clicks (GitHub etc.) pass through unhindered
      if (e.target.closest('a')) return;

      // Only handle click-to-flip on mobile
      if (!isMobile) return;

      // Close every other open card
      allWrappers.forEach(other => {
        if (other !== wrapper) other.classList.remove('flipped');
      });

      wrapper.classList.toggle('flipped');
    });
  });

  // Tap outside any card → unflip all
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card-wrapper')) {
      allWrappers.forEach(w => w.classList.remove('flipped'));
    }
  });
})();

/* =============================================
   TYPED ROLE ANIMATION
   ============================================= */
const roles     = ['Full-Stack Developer', 'Graphic Designer', 'Android Developer', 'ML Enthusiast', '3D Artist'];
const typedSpan = document.getElementById('typed-role');
let roleIndex = 0, charIndex = 0, typing = true;

function typeRole() {
  const current = roles[roleIndex];
  if (typing) {
    typedSpan.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      typing = false;
      setTimeout(typeRole, 1400);
      return;
    }
  } else {
    typedSpan.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      typing    = true;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeRole, typing ? 52 : 26);
}

typeRole();

/* =============================================
   STATS COUNTER ANIMATION
   ============================================= */
function animateCounter(el, target, duration = 1200) {
  let start = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(el => {
          animateCounter(el, parseInt(el.dataset.count, 10));
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  statsObserver.observe(statsStrip);
}

/* =============================================
   CONTACT FORM
   ============================================= */
const contactForm  = document.getElementById('contact-form');
const formStatus   = document.getElementById('form-status');
const submitButton = contactForm.querySelector('button[type="submit"]');
const btnText      = submitButton.querySelector('.btn-text');

/* --- Validation helpers --- */
function setFieldError(input, message) {
  const group = input.closest('.form-group');
  group.classList.add('has-error');
  let err = group.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-error';
    group.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldError(input) {
  const group = input.closest('.form-group');
  group.classList.remove('has-error');
  const err = group.querySelector('.field-error');
  if (err) err.remove();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Clear errors on input
contactForm.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => clearFieldError(field));
});

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // --- Run validation ---
  const nameField    = document.getElementById('input-name');
  const emailField   = document.getElementById('input-email');
  const messageField = document.getElementById('input-message');
  let hasError = false;

  // Clear previous errors
  [nameField, emailField, messageField].forEach(f => clearFieldError(f));

  if (!nameField.value.trim()) {
    setFieldError(nameField, 'Please enter your name.');
    hasError = true;
  }

  if (!emailField.value.trim()) {
    setFieldError(emailField, 'Please enter your email address.');
    hasError = true;
  } else if (!validateEmail(emailField.value.trim())) {
    setFieldError(emailField, 'Please enter a valid email address.');
    hasError = true;
  }

  if (!messageField.value.trim()) {
    setFieldError(messageField, 'Please write a message before sending.');
    hasError = true;
  }

  if (hasError) return; // Stop here — don't send

  // --- All good, send ---
  submitButton.disabled    = true;
  const originalText       = btnText.textContent;
  btnText.textContent      = 'Sending…';
  formStatus.style.color   = 'var(--accent-dim)';
  formStatus.textContent   = 'Sending your message…';
  formStatus.style.opacity = '1';

  emailjs.sendForm('service_6dy44so', 'template_w6kjode', this)
    .then(() => {
      formStatus.style.color   = '#4ade80';
      formStatus.textContent   = "✓ Message sent! I'll get back to you soon.";
      formStatus.style.opacity = '1';
      contactForm.reset();
      setTimeout(() => {
        formStatus.style.opacity = '0';
        setTimeout(() => { formStatus.textContent = ''; }, 400);
      }, 3500);
    }, err => {
      console.error('EmailJS error:', err);
      formStatus.style.color   = '#f87171';
      formStatus.textContent   = 'Something went wrong. Please try again.';
      formStatus.style.opacity = '1';
      setTimeout(() => {
        formStatus.style.opacity = '0';
        setTimeout(() => { formStatus.textContent = ''; }, 400);
      }, 3500);
    })
    .finally(() => {
      submitButton.disabled = false;
      btnText.textContent   = originalText;
    });
});

/* =============================================
   COPYRIGHT YEAR
   ============================================= */
const currentYear = new Date().getFullYear();
const yearEl      = document.getElementById('copyright-year');
if (yearEl) yearEl.textContent = currentYear;

/* =============================================
   HERO GHOST TEXT — Veni, Vidi, Vici
   ============================================= */
const decoText   = document.getElementById('hero-deco-text');
const latinWords = ['Veni.', 'Vidi.', 'Vici.'];

if (decoText) {
  let latinIndex = 0;

  function cycleLatinWord() {
    decoText.style.opacity   = '0';
    decoText.style.transform = 'translateY(20px)';
    setTimeout(() => {
      decoText.textContent     = latinWords[latinIndex];
      latinIndex               = (latinIndex + 1) % latinWords.length;
      decoText.style.opacity   = '1';
      decoText.style.transform = 'translateY(0)';
    }, 700);
  }

  decoText.textContent     = latinWords[0];
  latinIndex               = 1;
  decoText.style.opacity   = '1';
  decoText.style.transform = 'translateY(0)';

  setInterval(cycleLatinWord, 2200);
}

/* =============================================
   ACTIVE NAV LINK (SCROLLSPY)
   ============================================= */
const sections   = document.querySelectorAll('section[id], header[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* =============================================
   MAGNETIC BUTTONS
   ============================================= */
(function () {
  // Skip on touch devices
  if ('ontouchstart' in window) return;

  const STRENGTH = 0.38; // how strongly the button pulls
  const RESTORE  = 0.15; // spring-back speed

  document.querySelectorAll('.btn').forEach(btn => {
    let currentX = 0, currentY = 0;
    let targetX  = 0, targetY  = 0;
    let rafId    = null;
    let isHovered = false;

    function animate() {
      currentX += (targetX - currentX) * RESTORE;
      currentY += (targetY - currentY) * RESTORE;

      btn.style.transform = `translate(${currentX}px, ${currentY}px)`;

      // Keep animating until settled
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01 || isHovered) {
        rafId = requestAnimationFrame(animate);
      } else {
        currentX = 0; currentY = 0;
        btn.style.transform = 'translate(0px, 0px)';
        rafId = null;
      }
    }

    btn.addEventListener('mouseenter', () => {
      isHovered = true;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    btn.addEventListener('mousemove', e => {
      const rect   = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      targetX = (e.clientX - centerX) * STRENGTH;
      targetY = (e.clientY - centerY) * STRENGTH;
    });

    btn.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX   = 0;
      targetY   = 0;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });
  });
})();

/* =============================================
   CARD SHINE on mousemove (desktop only, no flip interference)
   ============================================= */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.project-card-wrapper').forEach(wrapper => {
    wrapper.addEventListener('mousemove', e => {
      const rect  = wrapper.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top)  / rect.height;
      const shine = wrapper.querySelector('.card-shine');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${normX * 100}% ${normY * 100}%, rgba(245,200,66,0.07) 0%, transparent 65%)`;
      }
    });
    wrapper.addEventListener('mouseleave', () => {
      const shine = wrapper.querySelector('.card-shine');
      if (shine) shine.style.background = 'none';
    });
  });
})();