/* custom interactions for portfolio */

document.addEventListener('DOMContentLoaded', () => {

  /* 
     1. SMOOTH SCROLLING
     Intercepts all anchor clicks and scrolls
     smoothly to the target section. */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile nav if open
      const bsNav = bootstrap.Collapse.getInstance(document.getElementById('navMenu'));
      if (bsNav) bsNav.hide();

      
      // const navH = document.getElementById('mainNav').offsetHeight;
      // const top  = target.getBoundingClientRect().top + window.scrollY - navH;

const headerHeight = document.getElementById('mainNav').offsetHeight;
const scrollPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;



        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    });
  });


   
  /*   2. NAVBAR SCROLL CLASS
     Adds .scrolled when page is scrolled > 30px */


  // const nav = document.getElementById('mainNav');


  const navbar = document.getElementById('mainNav');





  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


   
   /*  3. INTERSECTION OBSERVER — REVEAL ELEMENTS
     Adds .visible when element enters viewport.
     Handles: .reveal-up, .reveal-left, .reveal-right */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal — animate once
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));


   
  /*   4. SKILL BARS — FILL ON SCROLL
     Reads data-width attribute and animates
     the skill bar fill when visible. */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const progress = target.dataset.width || '0';
          // Small delay for staggered feel
          setTimeout(() => {
            target.style.width = progress + '%';
          }, 150);
          skillObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillFills.forEach(fill => skillObserver.observe(fill));


   
   /*  5. BUTTON RIPPLE EFFECT
     Creates a ripple at the click point
     for .btn-primary-custom buttons. */
  document.querySelectorAll('.btn-primary-custom').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Remove any existing ripple
      const existing = this.querySelector('.ripple');
      if (existing) existing.remove();

    const rippleEl = document.createElement('span');
      rippleEl.className = 'ripple';

      // this.appendChild(rippleEl);

      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.5;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      Object.assign(rippleEl.style, {
        width:     size + 'px',
        height:    size + 'px',
        left:      x + 'px',
        top:       y + 'px',
        position:  'absolute',
        borderRadius: '50%',
        background: 'rgba(255,255,255,.25)',
        transform: 'scale(0)',
        animation: 'rippleAnim .55s ease-out forwards',
        pointerEvents: 'none',
        zIndex: '10',
      });

      this.style.overflow = 'hidden';
      this.appendChild(rippleEl);

      // Cleanup after animation
      setTimeout(() => rippleEl.remove(), 600);
    });
  });

  // Inject ripple keyframes dynamically (once)
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id    = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }


   
  /* 6. CONTACT FORM — SUBMIT FEEDBACK
     Shows a success message on click. */
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (submitBtn && formSuccess) {
    submitBtn.addEventListener('click', () => {
      // Basic validation check
      const inputs = document.querySelectorAll(
        '.contact-form-card input, .contact-form-card textarea'
      );
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          // Shake empty fields
          input.style.borderColor = '#F472B6';
          input.style.boxShadow   = '0 0 0 3px rgba(244,114,182,.15)';
          setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow   = '';
          }, 2000);
        }
      });

      if (!isValid) return;

      // Show loading state
      submitBtn.disabled = true;
      const label = submitBtn.querySelector('.btn-label');
      if (label) label.textContent = 'Sending...';

      // Simulate send delay then show success
      setTimeout(() => {
        document.querySelector('.form-row-group').style.display = 'none';
        formSuccess.style.display = 'block';
      }, 1200);
    });
  }


   
   /*  7. ACTIVE NAV LINK on scroll
     Highlights the nav link matching the
     currently visible section.*/
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const matches = link.getAttribute('href') === `#${id}`;
            link.style.color    = matches ? 'var(--primary)' : '';
            link.style.fontWeight = matches ? '600' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => activeObserver.observe(sec));


   
   /*  8. HERO CARD STACK — subtle mouse parallax
     Makes the card stack react to mouse movement. */
  const heroSection = document.getElementById('hero');
  const cardStack   = document.querySelector('.hero-card-stack');

  if (heroSection && cardStack) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      cardStack.style.transform = `
        rotateX(${y * -8}deg)
        rotateY(${x * 10}deg)
        translateZ(10px)
      `;
    });

    heroSection.addEventListener('mouseleave', () => {
      cardStack.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
    });
  }

});
