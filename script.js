/**
 * Portfolio JavaScript
 * Modern, vanilla ES6+, zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger, .hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  const navLinks = document.querySelectorAll('.navbar__link, .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.querySelector('.back-to-top, .footer__back-to-top');
  const scrollIndicator = document.querySelector('.hero__scroll-indicator, .scroll-indicator');
  const typingText = document.querySelector('.typing-text');
  const contactForm = document.querySelector('#contact-form');
  const yearElement = document.querySelector('.current-year');

  // 2. Set Current Year in Footer
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 3. Mobile Navigation Toggle
  const toggleMobileMenu = (isOpen) => {
    if (!hamburger || !mobileMenu) return;
    const open = typeof isOpen === 'boolean' ? isOpen : !mobileMenu.classList.contains('open');
    hamburger.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.classList.toggle('active', open);
    document.body.classList.toggle('overflow-hidden', open);
  };

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile menu when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close mobile menu when clicking outside or pressing Escape
  document.addEventListener('click', (e) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      hamburger &&
      !hamburger.contains(e.target)
    ) {
      toggleMobileMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  // 4. Smooth Scrolling with Offset for Fixed Header
  const navbarHeight = 64;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // 5. Active Nav Link on Scroll (Intersection Observer)
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((section) => navObserver.observe(section));

  // 6. Scroll-triggered Reveal Animations (.fade-in)
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
  } else {
    // Fallback for older browsers
    fadeElements.forEach((el) => el.classList.add('visible'));
  }

  // 7. Navbar Scroll State & Back to Top Visibility
  let ticking = false;
  const onScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar style on scroll
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll down indicator fade out
    if (scrollIndicator) {
      if (scrollY > 150) {
        scrollIndicator.classList.add('faded');
      } else {
        scrollIndicator.classList.remove('faded');
      }
    }

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  // Back to Top Button Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 8. Dynamic Text Typing Animation in Hero
  if (typingText) {
    const roles = [
      'Frontend Developer',
      'UI/UX Enthusiast',
      'Fullstack Learner',
      'Creative Problem Solver'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 90;

    const typeRole = () => {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeDelay = 45;
      } else {
        typingText.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeDelay = 95;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        // Pause at end of text
        typeDelay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        // Switch to next word
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeDelay = 400;
      }

      setTimeout(typeRole, typeDelay);
    };

    // Start typing after initial load
    setTimeout(typeRole, 600);
  }

  // 9. Contact Form Validation and Submission Handling
  if (contactForm) {
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const subjectInput = contactForm.querySelector('#subject');
    const messageInput = contactForm.querySelector('#message');
    const submitBtn = contactForm.querySelector('.form-submit');
    const statusMsg = contactForm.querySelector('.form-status, .form-message');

    const setError = (input, message) => {
      const formGroup = input.closest('.form-group');
      if (!formGroup) return;
      const errorSpan = formGroup.querySelector('.field-error');
      if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = message ? 'block' : 'none';
      }
      if (message) {
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
      }
    };

    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    const validateField = (input) => {
      const value = input.value.trim();
      const id = input.id;

      if (id === 'name') {
        if (!value) {
          setError(input, 'Please enter your name.');
          return false;
        } else if (value.length < 2) {
          setError(input, 'Name must be at least 2 characters.');
          return false;
        }
      }

      if (id === 'email') {
        if (!value) {
          setError(input, 'Please enter your email.');
          return false;
        } else if (!validateEmail(value)) {
          setError(input, 'Please enter a valid email address.');
          return false;
        }
      }

      if (id === 'subject') {
        if (!value) {
          setError(input, 'Please enter a subject.');
          return false;
        }
      }

      if (id === 'message') {
        if (!value) {
          setError(input, 'Please enter your message.');
          return false;
        } else if (value.length < 10) {
          setError(input, 'Message must be at least 10 characters.');
          return false;
        }
      }

      setError(input, '');
      return true;
    };

    // Real-time validation on blur & input
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          validateField(input);
        }
      });
    });

    // Form submit event
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isSubjectValid = validateField(subjectInput);
      const isMsgValid = validateField(messageInput);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMsgValid) {
        // Focus first invalid field
        const firstInvalid = contactForm.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Enter loading state
      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText ? btnText.textContent : 'Send Message';
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'Sending...';

      // Clear previous status
      if (statusMsg) {
        statusMsg.className = 'form-message form-status';
        statusMsg.style.display = 'none';
        statusMsg.innerHTML = '';
      }

      // Simulate sending and provide honest client-side feedback
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        if (btnText) btnText.textContent = originalText;

        if (statusMsg) {
          const userName = nameInput.value.trim();
          const userEmail = emailInput.value.trim();
          const userSubject = subjectInput.value.trim();
          const userBody = messageInput.value.trim();

          const mailtoUrl = `mailto:alex@example.com?subject=${encodeURIComponent(userSubject)}&body=${encodeURIComponent(`Hi Alex,\n\nFrom: ${userName} (${userEmail})\n\n${userBody}`)}`;

          statusMsg.innerHTML = `
            <div class="feedback-card">
              <div class="feedback-header">
                <span class="feedback-badge">Client Demo Notice</span>
              </div>
              <p>Thank you, <strong>${escapeHtml(userName)}</strong>! Your form validation passed successfully.</p>
              <p class="feedback-sub">Since this is a static frontend website without an active email server, click below to send directly via your email client or configure Formspree/EmailJS:</p>
              <div class="feedback-actions">
                <a href="${mailtoUrl}" class="btn-primary btn-sm">Open in Email Client</a>
              </div>
            </div>
          `;
          statusMsg.classList.add('show', 'info');
          statusMsg.style.display = 'block';

          // Reset form fields
          contactForm.reset();
        }
      }, 1200);
    });
  }

  // Simple HTML escape helper
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
