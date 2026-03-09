/* ========================================
   VOLTEC SOLAR — Cinematic Animations & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });


  /* ---------- Hero Parallax + Content Fade ---------- */
  const heroBg = document.getElementById('heroBg');
  const heroContent = document.querySelector('.hero-content');
  const heroScroll = document.querySelector('.hero-scroll');

  const handleHeroParallax = () => {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroH = heroSection.offsetHeight;

    if (scrollY < heroH) {
      const progress = scrollY / heroH; // 0 → 1

      // Background: deep parallax + scale
      const translateY = scrollY * 0.45;
      const scale = 1 + (scrollY * 0.0003);
      heroBg.style.transform = `translateY(${translateY}px) scale(${scale})`;

      // Content: fade out + lift as user scrolls
      if (heroContent) {
        const contentOpacity = Math.max(0, 1 - progress * 2.2);
        const contentY = scrollY * -0.2;
        heroContent.style.opacity = contentOpacity;
        heroContent.style.transform = `translateY(${contentY}px)`;
      }

      // Scroll indicator: fade quickly
      if (heroScroll) {
        heroScroll.style.opacity = Math.max(0, 1 - progress * 4);
      }
    }
  };

  window.addEventListener('scroll', handleHeroParallax, { passive: true });


  /* ---------- Floating Particle System ---------- */
  const canvas = document.getElementById('heroParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.growing = Math.random() > 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.growing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 0.6) this.growing = false;
        } else {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0) this.reset();
        }

        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 197, 24, ${this.opacity})`;
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      const count = Math.min(Math.floor(canvas.width * canvas.height / 15000), 60);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animFrame = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', init);

    // Pause when hero is not visible
    const heroObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!animFrame) animate();
      } else {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    });
    heroObs.observe(heroSection);
  }


  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip, .reveal-clip-horizontal, .resilience-list li'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ---------- Image Parallax on Scroll ---------- */
  const parallaxImages = document.querySelectorAll('[data-parallax]');

  const handleImageParallax = () => {
    parallaxImages.forEach(img => {
      const factor = parseFloat(img.dataset.parallax) || 0.05;
      const rect = img.closest('section') ?
        img.closest('section').getBoundingClientRect() :
        img.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const distance = sectionCenter - viewCenter;
      const translateY = distance * factor;

      img.style.transform = `translateY(${translateY}px) scale(1.04)`;
    });
  };

  window.addEventListener('scroll', handleImageParallax, { passive: true });
  handleImageParallax();


  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('.counter');

  const formatNumber = (num) => {
    if (num >= 100000) return (num / 1000).toFixed(0) + 'K';
    if (num >= 1000) return num.toLocaleString('fr-FR');
    return num.toString();
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 2400;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target);
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => counterObserver.observe(counter));


  /* ---------- Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ---------- Advantage cards hover tilt ---------- */
  const cards = document.querySelectorAll('.advantage-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });


  /* ---------- Figure items subtle hover glow ---------- */
  const figureItems = document.querySelectorAll('.figure-item');

  figureItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      item.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(74, 122, 181, 0.1), var(--off-white) 70%)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.background = '';
    });
  });


  /* ---------- Solar Sweep Mouse Interaction ---------- */
  const sweepFlare = document.createElement('div');
  sweepFlare.className = 'solar-sweep-flare';
  Object.assign(sweepFlare.style, {
    position: 'fixed',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(245, 197, 24, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)',
    mixBlendMode: 'plus-lighter',
    opacity: '0',
    transition: 'opacity 0.6s ease, width 0.3s ease, height 0.3s ease',
    filter: 'blur(40px)',
    border: '1px solid rgba(245, 197, 24, 0.1)'
  });
  document.body.appendChild(sweepFlare);

  window.addEventListener('mousemove', (e) => {
    sweepFlare.style.opacity = '1';
    sweepFlare.style.left = e.clientX + 'px';
    sweepFlare.style.top = e.clientY + 'px';

    // Highlight targets near cursor
    document.querySelectorAll('h1, h2, .btn-primary').forEach(target => {
      const rect = target.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      if (dist < 200) {
        target.classList.add('solar-sweep-active');
      } else {
        target.classList.remove('solar-sweep-active');
      }
    });
  });

  window.addEventListener('mouseleave', () => {
    sweepFlare.style.opacity = '0';
  });


  /* ---------- Deep Parallax & Visual Breaks ---------- */
  const handleDeepParallax = () => {
    const scrollY = window.scrollY;

    // Break BG parallax
    document.querySelectorAll('.break-bg').forEach(bg => {
      const rect = bg.parentElement.getBoundingClientRect();
      const offset = rect.top;
      if (offset < window.innerHeight && offset > -rect.height) {
        const factor = 0.2;
        bg.style.transform = `translateY(${offset * factor}px)`;
      }
    });

    // Installer BG parallax
    const installerBg = document.querySelector('.installer-bg');
    if (installerBg) {
      const rect = installerBg.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const move = rect.top * 0.15;
        installerBg.style.transform = `translateY(${move}px)`;
      }
    }

    // Enhanced tag parallax
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const factor = parseFloat(el.dataset.parallax);
      const rect = el.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const move = (scrollProgress - 0.5) * 100 * factor;
      el.style.transform = `translateY(${move}px)`;
    });
  };

  window.addEventListener('scroll', handleDeepParallax, { passive: true });
  handleDeepParallax();


  /* ---------- Section Progress Bars... ---------- */
  const sections = document.querySelectorAll('.intro, .product, .manufacturing, .figures, .installer');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty('--section-visible', '1');
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(s => sectionObserver.observe(s));

});
