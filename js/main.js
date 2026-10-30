/**
 * SMARTLINK BUSINESS - INTERACTIVE CLIENT LOGIC
 * Dynamic 3D Card Customizer, NFC Tap Simulator, Live Analytics & Interactive Demos
 */

document.addEventListener('DOMContentLoaded', () => {
  initNfcSimulator();
  initCardCustomizer();
  initAnalyticsDashboard();
  initQuoteCalculator();
  initIndustryTabs();
  initFaqAccordion();
  initSimulatorModal();
  initLeadForm();
  initBusinessConfig();
  initMobileNav();
  initScrollEffects();
});

/* ===================================================================
   WEB AUDIO API: REALISTIC HAPTIC / NFC CHIME (NO EXTERNAL AUDIO NEEDED)
   =================================================================== */
function playNfcChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // High soft ping
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6
    
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.log('Audio disabled or blocked by browser policy');
  }
}

/* ===================================================================
   NFC TAP SIMULATOR ON HERO SECTION
   =================================================================== */
function initNfcSimulator() {
  const tapTrigger = document.getElementById('heroTapTrigger');
  const floatingCard = document.getElementById('floatingNfcCard');
  const phoneScreen = document.getElementById('phoneScreenContent');
  
  const demoScreens = [
    {
      brand: "Brew & Bloom Café",
      badge: "NFC Tap Active",
      item: "Artisan Iced Vanilla Oat Latte",
      price: "₹240",
      img: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80",
      status: "Table #07 Connected"
    },
    {
      brand: "Saffron Table",
      badge: "Verified SmartLink",
      item: "Awadhi Dum Gosht Biryani",
      price: "₹650",
      img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=300&auto=format&fit=crop&q=80",
      status: "VIP Table Reservation"
    },
    {
      brand: "Urban Bites Burger Co.",
      badge: "WhatsApp Order Ready",
      item: "Truffle Smash Double Burger",
      price: "₹249",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
      status: "Direct Kitchen Tap"
    }
  ];

  let currentScreenIdx = 0;

  function triggerTapAction() {
    playNfcChime();
    currentScreenIdx = (currentScreenIdx + 1) % demoScreens.length;
    const current = demoScreens[currentScreenIdx];

    // Pulse animation on phone
    const phone = document.querySelector('.mockup-phone');
    if (phone) {
      phone.style.transform = 'scale(1.03) translateY(-10px)';
      phone.style.boxShadow = '0 0 50px rgba(245, 158, 11, 0.8), 0 25px 70px rgba(0,0,0,0.9)';
      setTimeout(() => {
        phone.style.transform = '';
        phone.style.boxShadow = '';
      }, 350);
    }

    // Render screen update
    if (phoneScreen) {
      phoneScreen.innerHTML = `
        <div class="phone-screen-header">
          <span class="phone-brand-title">${current.brand}</span>
          <span class="phone-status-pill">
            <span class="badge-pulse"></span> ${current.badge}
          </span>
        </div>
        <div class="phone-content-area">
          <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 10px; font-size: 0.72rem; color: #FAF7F2; display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Instant NFC Connected: <strong>${current.status}</strong></span>
          </div>

          <div class="screen-card-demo">
            <img src="${current.img}" alt="${current.item}" />
            <div class="info">
              <h5>${current.item}</h5>
              <p>${current.price}</p>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; color: #A6C2B2;">Google Review Link</span>
            <span style="font-size: 0.75rem; color: #F59E0B; font-weight: bold;">★ 4.9 (482)</span>
          </div>

          <div class="screen-tap-instruction" style="margin-top: auto;">
            <p style="font-size: 0.75rem; margin-bottom: 4px; color: #FAF8F5;">⚡ Tap triggered! Instant micro-app live in 0.4s</p>
            <button onclick="openSimulatorModal('${currentScreenIdx === 0 ? 'brew' : currentScreenIdx === 1 ? 'saffron' : 'urban'}')" style="background: #F59E0B; border: none; color: #0A0B0D; font-size: 0.75rem; font-weight: 700; padding: 6px 14px; border-radius: 20px; cursor: pointer; width: 100%;">Explore Full Screen Demo</button>
          </div>
        </div>
      `;
    }

    showToast(`NFC Tap detected: Connected to ${current.brand}!`);
  }

  if (tapTrigger) tapTrigger.addEventListener('click', triggerTapAction);
  if (floatingCard) floatingCard.addEventListener('click', triggerTapAction);
}

/* ===================================================================
   INTERACTIVE 3D CARD CUSTOMIZER
   =================================================================== */
function initCardCustomizer() {
  const cardElement = document.getElementById('customizerLiveCard');
  const nameInput = document.getElementById('customizerNameInput');
  const displayBrand = document.getElementById('customizerBrandName');
  const swatches = document.querySelectorAll('.swatch-btn');

  const themes = {
    obsidian: {
      background: 'linear-gradient(135deg, #1C1E23 0%, #0A0B0D 100%)',
      border: '1px solid rgba(245, 158, 11, 0.45)',
      color: '#FAF8F5',
      accent: '#F59E0B',
      chip: 'linear-gradient(135deg, #E6A247 0%, #B87A31 100%)'
    },
    walnut: {
      background: 'linear-gradient(135deg, #4A2E24 0%, #2A1A14 100%)',
      border: '1px solid rgba(194, 174, 163, 0.4)',
      color: '#F5EFE6',
      accent: '#DFD0BE',
      chip: 'linear-gradient(135deg, #DFD0BE 0%, #8F8071 100%)'
    },
    beige: {
      background: 'linear-gradient(135deg, #FAF7F2 0%, #EDE4D6 100%)',
      border: '1px solid #C4B5A0',
      color: '#2A1A14',
      accent: '#648B77',
      chip: 'linear-gradient(135deg, #648B77 0%, #375245 100%)'
    },
    sage: {
      background: 'linear-gradient(135deg, #2D4238 0%, #15221C 100%)',
      border: '1px solid rgba(166, 194, 178, 0.4)',
      color: '#FAF8F5',
      accent: '#A6C2B2',
      chip: 'linear-gradient(135deg, #A6C2B2 0%, #4E705F 100%)'
    }
  };

  if (nameInput && displayBrand) {
    nameInput.addEventListener('input', (e) => {
      displayBrand.textContent = e.target.value.trim() || 'YOUR BRAND NAME';
    });
  }

  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');

      const themeKey = btn.getAttribute('data-theme');
      const theme = themes[themeKey];
      if (!theme || !cardElement) return;

      cardElement.style.background = theme.background;
      cardElement.style.border = theme.border;
      cardElement.style.color = theme.color;

      const chip = cardElement.querySelector('.card-chip');
      if (chip) chip.style.background = theme.chip;

      const waves = cardElement.querySelector('.card-waves');
      if (waves) waves.style.color = theme.accent;

      // 3D bounce effect
      cardElement.style.transform = 'scale(0.97)';
      setTimeout(() => {
        cardElement.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

/* ===================================================================
   ANALYTICS DASHBOARD INTERACTION
   =================================================================== */
function initAnalyticsDashboard() {
  const timeBtns = document.querySelectorAll('.time-btn');
  const scansCount = document.getElementById('metricScansCount');
  const reviewsCount = document.getElementById('metricReviewsCount');
  const revLift = document.getElementById('metricRevLift');
  const chartPath = document.getElementById('analyticsSvgPath');
  const chartFill = document.getElementById('analyticsSvgFill');

  const datasets = {
    '7d': {
      scans: '18,420',
      reviews: '314',
      lift: '+24.6%',
      path: 'M 0 160 Q 100 130 200 110 T 400 90 T 600 50 T 800 30',
      fill: 'M 0 160 Q 100 130 200 110 T 400 90 T 600 50 T 800 30 L 800 200 L 0 200 Z'
    },
    '30d': {
      scans: '76,890',
      reviews: '1,420',
      lift: '+38.2%',
      path: 'M 0 170 Q 120 140 240 120 T 450 70 T 650 40 T 800 20',
      fill: 'M 0 170 Q 120 140 240 120 T 450 70 T 650 40 T 800 20 L 800 200 L 0 200 Z'
    },
    '90d': {
      scans: '248,310',
      reviews: '4,890',
      lift: '+52.8%',
      path: 'M 0 180 Q 100 150 220 100 T 420 60 T 620 30 T 800 15',
      fill: 'M 0 180 Q 100 150 220 100 T 420 60 T 620 30 T 800 15 L 800 200 L 0 200 Z'
    }
  };

  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.getAttribute('data-period');
      const data = datasets[period];
      if (!data) return;

      if (scansCount) scansCount.textContent = data.scans;
      if (reviewsCount) reviewsCount.textContent = data.reviews;
      if (revLift) revLift.textContent = data.lift;

      if (chartPath && chartFill) {
        chartPath.setAttribute('d', data.path);
        chartFill.setAttribute('d', data.fill);
      }
    });
  });
}

/* ===================================================================
   INTERACTIVE QUOTE & ROI CALCULATOR
   =================================================================== */
function initQuoteCalculator() {
  const standsSlider = document.getElementById('calcStandsSlider');
  const cardsSlider = document.getElementById('calcCardsSlider');
  const standsVal = document.getElementById('calcStandsValue');
  const cardsVal = document.getElementById('calcCardsValue');
  const totalPrice = document.getElementById('calcTotalPrice');
  const estScans = document.getElementById('calcEstScans');

  function updateEstimate() {
    if (!standsSlider || !cardsSlider) return;
    const stands = parseInt(standsSlider.value, 10);
    const cards = parseInt(cardsSlider.value, 10);

    if (standsVal) standsVal.textContent = stands;
    if (cardsVal) cardsVal.textContent = cards;

    // Pricing formula: Base ₹3,999 + ₹499/stand + ₹249/NFC card
    const cost = 3999 + (stands * 499) + (cards * 249);
    // Estimated scans: roughly 25 taps/day per active stand
    const scansPerMonth = stands * 25 * 30;

    if (totalPrice) totalPrice.textContent = `₹${cost.toLocaleString('en-IN')}`;
    if (estScans) estScans.textContent = `${scansPerMonth.toLocaleString('en-IN')} scans/mo`;
  }

  if (standsSlider) standsSlider.addEventListener('input', updateEstimate);
  if (cardsSlider) cardsSlider.addEventListener('input', updateEstimate);
  updateEstimate();
}

/* ===================================================================
   INDUSTRY SOLUTIONS TABS
   =================================================================== */
function initIndustryTabs() {
  const tabs = document.querySelectorAll('.industry-tab-btn');
  const panels = document.querySelectorAll('.industry-content-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   FAQS ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ===================================================================
   DEVICE SIMULATOR MODAL (PREVIEW THE 3 DEMOS)
   =================================================================== */
function initSimulatorModal() {
  const modal = document.getElementById('simulatorModal');
  const closeBtn = document.getElementById('simCloseBtn');
  const iframe = document.getElementById('simIframe');
  const tabs = document.querySelectorAll('.sim-tab');

  const demoUrls = {
    creme: 'demos/creme-and-cone.html',
    brew: 'demos/brew-and-bloom.html',
    saffron: 'demos/saffron-table.html',
    urban: 'demos/urban-bites.html'
  };

  window.openSimulatorModal = function(demoKey = 'creme') {
    if (!modal || !iframe) return;
    iframe.src = demoUrls[demoKey] || demoUrls.creme;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-demo') === demoKey);
    });
  };

  window.closeSimulatorModal = function() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (iframe) iframe.src = 'about:blank';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeSimulatorModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeSimulatorModal();
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const demoKey = tab.getAttribute('data-demo');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (iframe) iframe.src = demoUrls[demoKey] || demoUrls.brew;
    });
  });
}

/* ===================================================================
   LEAD FORM SUBMISSION & NOTIFICATIONS
   =================================================================== */
/* ===================================================================
   LEAD FORM SUBMISSION & REAL-TIME VALIDATION
   =================================================================== */
function initLeadForm() {
  const form = document.getElementById('freeDemoForm');
  if (!form) return;

  const nameInput = form.querySelector('[name="fullName"]');
  const businessInput = form.querySelector('[name="businessName"]');
  const emailInput = form.querySelector('[name="email"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const serviceInput = form.querySelector('[name="service"]');
  const messageInput = form.querySelector('[name="message"]');

  function validateField(input, condition) {
    if (!input) return true;
    if (condition) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s+\-()]{7,18}$/;

  if (nameInput) {
    nameInput.addEventListener('input', () => validateField(nameInput, nameInput.value.trim().length >= 2));
  }
  if (businessInput) {
    businessInput.addEventListener('input', () => validateField(businessInput, businessInput.value.trim().length >= 2));
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => validateField(emailInput, emailRegex.test(emailInput.value.trim())));
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', () => validateField(phoneInput, phoneRegex.test(phoneInput.value.trim())));
  }
  if (messageInput) {
    messageInput.addEventListener('input', () => validateField(messageInput, messageInput.value.trim().length >= 5));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameInput && nameInput.value.trim().length >= 2);
    const isBusinessValid = validateField(businessInput, businessInput && businessInput.value.trim().length >= 2);
    const isEmailValid = validateField(emailInput, emailInput && emailRegex.test(emailInput.value.trim()));
    const isPhoneValid = validateField(phoneInput, phoneInput && phoneRegex.test(phoneInput.value.trim()));
    const isMessageValid = validateField(messageInput, messageInput && messageInput.value.trim().length >= 5);

    if (!isNameValid || !isBusinessValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
      showToast('⚠️ Please fill out all required fields with valid details.');
      return;
    }

    const name = nameInput.value.trim();
    const venue = businessInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const service = serviceInput?.value || 'SmartLink Suite';
    const message = messageInput.value.trim();

    const payload = {
      fullName: name,
      businessName: venue,
      email: email,
      phone: phone,
      service: service,
      message: message,
      timestamp: new Date().toISOString()
    };

    // Store enquiry entry into local browser storage for persistence audit trail
    try {
      const existingLeads = JSON.parse(localStorage.getItem('smartlink_enquiries') || '[]');
      existingLeads.push({
        id: 'LEAD-' + Date.now(),
        ...payload
      });
      localStorage.setItem('smartlink_enquiries', JSON.stringify(existingLeads));
    } catch (err) {
      console.warn('LocalStorage unavailable:', err);
    }

    // Submit to server-side email endpoint
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting Enquiry...</span>';
    }

    try {
      const response = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showToast(`🎉 Thank you, ${name}! Your enquiry was securely emailed to our team. We will contact you at ${phone} shortly.`);
        } else if (result.code === 'SMTP_NOT_CONFIGURED') {
          showToast(`✅ Enquiry recorded on server! (Note: Live email delivery requires SMTP credentials configured in .env)`);
        } else {
          showToast(`✅ Enquiry recorded in storage for ${venue}! (${result.message || 'Queued'})`);
        }
      } else {
        showToast(`✅ Enquiry recorded for ${name} (${venue})! Stored locally. Start server.ps1 or server.js with .env for live email transmission.`);
      }
    } catch (networkErr) {
      // Offline or static file mode (file:// protocol)
      showToast(`✅ Enquiry safely logged for ${name} (${venue})! Stored in browser storage. Start local server.ps1 for live SMTP email transmission.`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      form.reset();
      form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    }
  });
}

/* ===================================================================
   DYNAMIC CONFIGURATION INITIALIZER (INDORE DEPLOYMENT READY)
   =================================================================== */
function initBusinessConfig() {
  if (typeof SMARTLINK_CONFIG === 'undefined') return;

  const cfg = SMARTLINK_CONFIG;

  // Update Direct WhatsApp button
  const whatsappCta = document.getElementById('btnWhatsappDirectCta');
  if (whatsappCta && cfg.whatsappNumber) {
    const defaultMsg = encodeURIComponent(`Hello ${cfg.businessName}! I am interested in your NFC tap cards, smart tabletop stands, and digital menus in ${cfg.city}.`);
    whatsappCta.href = `https://wa.me/${cfg.whatsappNumber}?text=${defaultMsg}`;
  }

  // Update Footer social links if configured
  const instaLink = document.querySelector('a[title="Configurable Instagram Handle"]');
  if (instaLink && cfg.socials?.instagram) instaLink.href = cfg.socials.instagram;

  const linkedinLink = document.querySelector('a[title="Configurable LinkedIn Page"]');
  if (linkedinLink && cfg.socials?.linkedin) linkedinLink.href = cfg.socials.linkedin;

  const twitterLink = document.querySelector('a[title="Configurable X / Twitter"]');
  if (twitterLink && cfg.socials?.twitter) twitterLink.href = cfg.socials.twitter;
}

/* ===================================================================
   MULTIPLE SCROLL EFFECTS (PROGRESS BAR, REVEALS, SCROLL SPY & BACK TO TOP)
   =================================================================== */
function initScrollEffects() {
  const progressBar = document.getElementById('scrollProgressBar');
  const header = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const sections = document.querySelectorAll('section[id], header[id="hero"]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  // 1. Scroll Progress Bar & Header Shrink
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      header.classList.toggle('scrolled', scrollTop > 40);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollTop > 450);
    }

    // 2. Scroll Spy Navigation Highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${currentSectionId}`);
      });
    }
  }, { passive: true });

  // 3. Back to Top Click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. IntersectionObserver for Smooth Scroll Reveal
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      el.classList.add('is-visible');
    });
  }
}

/* ===================================================================
   MOBILE NAVIGATION TOGGLE
   =================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.getElementById('mobileDrawer');
  const header = document.getElementById('siteHeader');

  if (toggle && drawer) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        drawer.classList.add('open');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Auto-close menu when any mobile nav link or button is clicked
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close drawer when clicking outside the header
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && header && !header.contains(e.target)) {
        drawer.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll offset for all internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Helper: Toast Notifications */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
    <span>${message}</span>
  `;

  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4200);
}

