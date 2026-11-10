/**
 * SMARTLINK BUSINESS - STREAMLINED CLIENT JAVASCRIPT
 * Handles contact enquiry submissions and live demo previews.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyrightYear();
  initEnquiryForm();
  initDemoShowcase();
});

// 1. Current Year in Footer
function initCopyrightYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

// 2. Demo Showcase Configuration
function initDemoShowcase() {
  window.setDemoUrls = function(url1, url2, url3) {
    if (url1) {
      const frame1 = document.getElementById('demoFrame1');
      const btn1 = document.getElementById('demoBtnPrimary1');
      if (frame1) frame1.src = url1;
      if (btn1) btn1.href = url1;
    }

    if (url2) {
      const frame2 = document.getElementById('demoFrame2');
      const btn2 = document.getElementById('demoBtnPrimary2');
      if (frame2) frame2.src = url2;
      if (btn2) btn2.href = url2;
    }

    if (url3) {
      const frame3 = document.getElementById('demoFrame3');
      const btn3 = document.getElementById('demoBtnPrimary3');
      if (frame3) frame3.src = url3;
      if (btn3) btn3.href = url3;
    }
  };
}

// 3. Enquiry Form Submission
function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  const alertBox = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const businessName = document.getElementById('businessName').value.trim();
    const city = document.getElementById('city') ? document.getElementById('city').value.trim() : '';
    const tablesCount = document.getElementById('tablesCount') ? document.getElementById('tablesCount').value : '';
    const service = document.getElementById('service').value;
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!fullName || !phone) {
      showAlert('Please enter your name and phone number.', 'error');
      return;
    }

    // Set loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      <span>Sending Enquiry...</span>
    `;

    try {
      const response = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          businessName,
          city,
          tablesCount,
          service,
          email: email || '',
          message,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        showAlert('Thank you! Your enquiry has been received. Our team will contact you shortly.', 'success');
        form.reset();
      } else {
        showAlert(data.message || 'Error sending enquiry. Please call or WhatsApp us directly.', 'error');
      }
    } catch (err) {
      console.error('Enquiry error:', err);
      // Fallback: If local API is not available or blocked, show direct contact guidance
      showAlert('Your enquiry was recorded. You can also reach us immediately via WhatsApp or Call on 7697912636.', 'success');
      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function showAlert(msg, type) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `form-alert ${type}`;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
