/**
 * WHACK FOOD CORNER - MULTI-PAGE APPLICATION & CHAT ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initParallaxScroll();
  initRevealOnScroll();
  initStickyHeader();
  initCartState();
  initMobileMenu();
  initFloatingChat();
  initPortalTabs();
});

/**
 * 1. PARALLAX SCROLL SCALE ENGINE (1.00 to 1.08)
 */
function initParallaxScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxImages = document.querySelectorAll('.parallax-bg');
  if (!parallaxImages.length) return;

  let ticking = false;

  function updateParallax() {
    const windowHeight = window.innerHeight;

    parallaxImages.forEach(img => {
      const parent = img.closest('.hero-section, .page-hero, .parallax-container, .split-card');
      if (!parent) return;

      const rect = parent.getBoundingClientRect();

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalDist = windowHeight + rect.height;
        const currentDist = windowHeight - rect.top;
        const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
        const scale = 1.00 + (progress * 0.08);
        img.style.transform = `scale(${scale.toFixed(4)})`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}

/**
 * 2. RESTRAINED VIEWPORT REVEAL
 */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 3. STICKY HEADER
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

/**
 * 4. GLOBAL CART STATE MANAGEMENT
 */
function initCartState() {
  // Get cart from localStorage or initialize
  let cart = JSON.parse(localStorage.getItem('wfc_cart') || '[]');

  function updateCartUI() {
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(b => {
      b.textContent = totalItems;
    });

    localStorage.setItem('wfc_cart', JSON.stringify(cart));
  }

  // Bind add-to-cart buttons
  const addBtns = document.querySelectorAll('.btn-add-cart');
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.dataset.name || 'Double Burger';
      const price = parseFloat(btn.dataset.price || '14.60');
      const img = btn.dataset.img || 'assets/burger-thumb.png';

      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }

      updateCartUI();

      // Visual Toast Notification
      btn.textContent = '✓ Added!';
      btn.style.backgroundColor = '#2E7D32';
      setTimeout(() => {
        btn.textContent = '+ Add to Order';
        btn.style.backgroundColor = '';
      }, 1200);
    });
  });

  updateCartUI();
}

/**
 * 5. MOBILE MENU TOGGLE
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '76px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = '#FDFBF7';
        navLinks.style.padding = '24px';
        navLinks.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      }
    });
  }
}

/**
 * 6. FLOATING CHAT WIDGET TOGGLE & SIMULATION
 */
function initFloatingChat() {
  const chatTrigger = document.querySelector('.chat-trigger-btn');
  const chatModal = document.querySelector('.chat-window-modal');
  const closeBtn = document.querySelector('.chat-close-btn');
  const sendBtn = document.querySelector('.chat-send-btn');
  const input = document.querySelector('.chat-input');
  const body = document.querySelector('.chat-modal-body');

  if (chatTrigger && chatModal) {
    chatTrigger.addEventListener('click', () => {
      chatModal.classList.toggle('is-open');
    });
  }

  if (closeBtn && chatModal) {
    closeBtn.addEventListener('click', () => {
      chatModal.classList.remove('is-open');
    });
  }

  if (sendBtn && input && body) {
    sendBtn.addEventListener('click', () => {
      const txt = input.value.trim();
      if (!txt) return;

      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg chat-msg-user';
      userMsg.textContent = txt;
      body.appendChild(userMsg);

      input.value = '';
      body.scrollTop = body.scrollHeight;

      // Simulate bot reply
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg chat-msg-bot';
        botMsg.textContent = "Thanks for contacting Whack Food Corner! Our team is preparing your order freshly. How else can we help you today?";
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
      }, 1000);
    });
  }
}

/**
 * 7. PORTAL TABS
 */
function initPortalTabs() {
  const tabs = document.querySelectorAll('.portal-tab');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(item => item.classList.remove('active'));
      t.classList.add('active');
    });
  });
}
