document.addEventListener('DOMContentLoaded', () => {

  // ===== CUSTOM LEAF CURSOR =====
  const cursor = document.getElementById('leaf-cursor');

  document.addEventListener('mousemove', (e) => {
    if (!cursor) return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';

    // Parallax on hero background
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.07)`;
    }
  });

  document.addEventListener('mousedown', () => {
    if (cursor) cursor.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    if (cursor) cursor.classList.remove('clicking');
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
  });

  // ===== SCROLL REVEAL =====
  const revealEls = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      el.classList.add('revealed');
    } else {
      revealObserver.observe(el);
    }
  });

  // ===== NAVBAR SHRINK ON SCROLL =====
  const nav = document.querySelector('.nav-container');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Scroll-shift section titles
    document.querySelectorAll('.section-title-shift').forEach(el => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const shift = (progress - 0.5) * -55;
        el.style.transform = `translateX(${shift}px)`;
      }
    });
  };
  // ===== INQUIRY FORM INTERCEPTION =====
const inquiryForm = document.getElementById('journey-inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('inquiry-error');
    if (errorEl) errorEl.textContent = '';

    const name  = document.getElementById('inq-name').value.trim();
    const email = document.getElementById('inq-email').value.trim();
    const plan  = document.getElementById('inq-plan').value;
    const date  = document.getElementById('inq-date').value;

    if (!name || !email || !plan || !date) {
      if (errorEl) errorEl.textContent = 'Please complete all fields.';
      return;
    }

    // Store locally for demonstration (replace with API call in production)
    const inquiry = { name, email, plan, date, submittedAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('wander_inquiries') || '[]');
    existing.push(inquiry);
    localStorage.setItem('wander_inquiries', JSON.stringify(existing));

    showToast('Itinerary request received. We will be in touch shortly.');
    inquiryForm.reset();
  });
}

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== FAQ ACCORDION TOGGLE =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');
    
    // Close all items (accordion behavior)
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    
    // Open clicked item if it wasn't already active
    if (!isActive) {
      item.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
});
