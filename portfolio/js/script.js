document.addEventListener('DOMContentLoaded', function () {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navbarCollapse = document.getElementById('navbarNav');

  function updateActiveNavLink() {
    let currentSectionId = 'home';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom >= 180) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === '#' + currentSectionId;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : 'false');
          });
        }
      });
    },
    { rootMargin: '-20% 0px -55% 0px', threshold: 0.1 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  window.addEventListener('scroll', () => {
    updateActiveNavLink();

    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          new bootstrap.Collapse(navbarCollapse).hide();
        }
      }
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get('name').toString().trim();
      const email = formData.get('email').toString().trim();
      const message = formData.get('message').toString().trim();
      let isValid = true;

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const resetFieldState = (field) => {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      };

      const markFieldError = (field) => {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
      };

      [nameInput, emailInput, messageInput].forEach((field) => field.classList.remove('is-invalid', 'is-valid'));

      if (!name) {
        markFieldError(nameInput);
        isValid = false;
      } else {
        resetFieldState(nameInput);
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailPattern.test(email)) {
        markFieldError(emailInput);
        isValid = false;
      } else {
        resetFieldState(emailInput);
      }

      if (!message) {
        markFieldError(messageInput);
        isValid = false;
      } else {
        resetFieldState(messageInput);
      }

      if (!formMessage) {
        return;
      }

      if (!isValid) {
        formMessage.textContent = 'Please fill in all fields correctly before submitting.';
        formMessage.className = 'form-message show error';
        return;
      }

      formMessage.textContent = 'Thank you for your message. The contact form is currently a demo.';
      formMessage.className = 'form-message show success';
      contactForm.reset();
      [nameInput, emailInput, messageInput].forEach((field) => field.classList.remove('is-invalid', 'is-valid'));
    });
  }

  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  updateActiveNavLink();
});
