     AOS.init({
      once: false,
      offset: 100,
      duration: 1000,
      easing: 'ease-out-back',
    });

    emailjs.init('X3hyI6ImGcwFx0oAE');

    let topBtn = document.getElementById("topBtn");
    window.onscroll = function() {
      topBtn.style.display = window.scrollY > 400 ? "block" : "none";
      
      updateScrollProgress();
    };
    
    function updateScrollProgress() {
      const scrollProgress = document.getElementById('scroll-progress');
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }
    
    function topFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    const modeToggle = document.getElementById('modeToggle');
    const body = document.body;
    const cursor = document.getElementById('cursor');

    if(localStorage.getItem('mode') === 'light') {
      body.classList.remove('dark');
      body.classList.add('light');
      modeToggle.textContent = '⏾';
    } else {
      body.classList.remove('light');
      body.classList.add('dark');
      modeToggle.textContent = '☀︎';
    }

    modeToggle.addEventListener('click', () => {
      if(body.classList.contains('dark')) {
        body.classList.replace('dark', 'light');
        modeToggle.textContent = '⏾';
        localStorage.setItem('mode', 'light');
      } else {
        body.classList.replace('light', 'dark');
        modeToggle.textContent = '☀︎';
        localStorage.setItem('mode', 'dark');
      }
    });

    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, input, textarea, .project-card-wrapper, .tech-badge, .skill-icon');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      submitButton.disabled = true;
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      formStatus.style.color = 'var(--text-muted)';
      formStatus.textContent = 'Sending your message...';
      formStatus.style.opacity = '1';

      emailjs.sendForm('service_6dy44so', 'template_w6kjode', this)
        .then(function() {
          formStatus.style.color = '#4ade80';
          formStatus.textContent = 'Thanks! Your message has been sent successfully.';
          formStatus.style.opacity = '1';
          contactForm.reset();
          setTimeout(function() {
            formStatus.style.opacity = '0';
            setTimeout(function() {
              formStatus.textContent = '';
            }, 400);
          }, 2000);
        }, function(error) {
          console.error('EmailJS error:', error);
          formStatus.style.color = '#f87171';
          formStatus.textContent = 'Sorry, something went wrong. Please try again later.';
          formStatus.style.opacity = '1';
          setTimeout(function() {
            formStatus.style.opacity = '0';
            setTimeout(function() {
              formStatus.textContent = '';
            }, 400);
          }, 2000);
        })
        .finally(function() {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        });
    });

    const roles = [
      "Full-Stack Developer",
      "Graphic Designer",
      "Android Developer",
      "ML Enthusiast",
      "3D Artist"
    ];

    const typedSpan = document.getElementById("typed-role");
    let roleIndex = 0;
    let charIndex = 0;
    let typing = true;

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (typing) {
        typedSpan.textContent = currentRole.substring(0, charIndex++);
        if (charIndex > currentRole.length) {
          typing = false;
          setTimeout(typeRole, 800);
          return;
        }
      } else {
        typedSpan.textContent = currentRole.substring(0, charIndex--);
        if (charIndex < 0) {
          typing = true;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(typeRole, typing ? 50 : 30);
    }

    typeRole();