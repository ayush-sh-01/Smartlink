/**
 * SMARTLINK BUSINESS - DEMO SHOWROOM LOGIC
 * Dynamic Cart, Category Filtering, WhatsApp Message Generator & Reservations
 */

document.addEventListener('DOMContentLoaded', () => {
  initCategoryFilters();
  initUrbanCart();
  initSaffronReservation();
  initWaiterCall();
});

/* ===================================================================
   SHARED CATEGORY & LIVE TEXT SEARCH FILTERING
   =================================================================== */
function initCategoryFilters() {
  const pills = document.querySelectorAll('.cat-pill, .saffron-pill, .urban-pill');
  const items = document.querySelectorAll('.cafe-menu-item, .royal-dish-card, .urban-item-card');
  const searchInput = document.getElementById('menuSearchInput');
  const container = document.querySelector('.menu-container, .saffron-menu-list, .urban-grid');

  let activeCategory = 'all';
  let searchQuery = '';

  // Ensure empty state container exists
  let emptyState = document.getElementById('menuEmptyState');
  if (!emptyState && container) {
    emptyState = document.createElement('div');
    emptyState.id = 'menuEmptyState';
    emptyState.className = 'menu-empty-state';
    emptyState.style.display = 'none';
    emptyState.innerHTML = '🔍 <strong>No matching dishes found.</strong><br><small style="color: #999;">Try searching for something else or reset your filter.</small>';
    container.parentNode.appendChild(emptyState);
  }

  function applyFilters() {
    let visibleCount = 0;
    items.forEach(item => {
      const itemCat = item.getAttribute('data-cat') || '';
      const text = item.textContent.toLowerCase();
      const matchesCategory = (activeCategory === 'all' || itemCat === activeCategory);
      const matchesSearch = (!searchQuery || text.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const parent = pill.parentElement;
      parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-cat') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* ===================================================================
   URBAN BITES CART & WHATSAPP ORDER GENERATOR
   =================================================================== */
let urbanCart = [];
let discountApplied = false;

function initUrbanCart() {
  const addButtons = document.querySelectorAll('.urban-add-btn');
  const cartBar = document.getElementById('urbanCartBar');
  const cartDrawer = document.getElementById('urbanCartDrawer');
  const drawerOverlay = document.getElementById('urbanDrawerOverlay');
  const closeDrawerBtn = document.getElementById('closeCartDrawer');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const cartBarTotalEl = document.getElementById('cartBarTotal');
  const whatsappBtn = document.getElementById('btnWhatsappOrder');
  const promoInput = document.getElementById('promoCodeInput');
  const applyPromoBtn = document.getElementById('btnApplyPromo');

  if (!addButtons.length) return; // Not on urban bites page

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));

      const existing = urbanCart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        urbanCart.push({ id, name, price, qty: 1 });
      }

      updateCartUI();
      // Button bounce feedback
      btn.textContent = '✓ Added!';
      setTimeout(() => {
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg> Add`;
      }, 900);
    });
  });

  function updateCartUI() {
    const totalItems = urbanCart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = urbanCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = discountApplied ? subtotal * 0.10 : 0;
    const packaging = totalItems > 0 ? 25 : 0;
    const finalTotal = Math.max(0, subtotal - discount + packaging);

    if (cartCountEl) cartCountEl.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    if (cartBarTotalEl) cartBarTotalEl.textContent = `₹${Math.round(finalTotal).toLocaleString('en-IN')}`;
    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${Math.round(subtotal).toLocaleString('en-IN')}`;
    if (cartTotalEl) cartTotalEl.textContent = `₹${Math.round(finalTotal).toLocaleString('en-IN')}`;

    // Show/hide bottom bar
    if (cartBar) {
      if (totalItems > 0) {
        cartBar.style.display = 'flex';
      } else {
        cartBar.style.display = 'none';
        if (cartDrawer) cartDrawer.classList.remove('open');
        if (drawerOverlay) drawerOverlay.style.display = 'none';
      }
    }

    // Render items in drawer
    if (cartItemsList) {
      if (urbanCart.length === 0) {
        cartItemsList.innerHTML = '<p style="color: #94A3B8; font-size: 0.9rem; text-align: center; padding: 2rem 0;">Your cart is currently empty.</p>';
      } else {
        cartItemsList.innerHTML = urbanCart.map(item => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
            <div>
              <h5 style="color: #FFF; font-size: 0.95rem;">${item.name}</h5>
              <span style="color: #F59E0B; font-size: 0.82rem;">₹${item.price.toLocaleString('en-IN')} each</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button onclick="changeUrbanQty('${item.id}', -1)" style="background: #252A34; border: 1px solid rgba(255,255,255,0.1); color: #FFF; width: 26px; height: 26px; border-radius: 6px; cursor: pointer;">-</button>
              <span style="font-weight: bold; min-width: 18px; text-align: center; color: #FFF;">${item.qty}</span>
              <button onclick="changeUrbanQty('${item.id}', 1)" style="background: #252A34; border: 1px solid rgba(255,255,255,0.1); color: #FFF; width: 26px; height: 26px; border-radius: 6px; cursor: pointer;">+</button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  window.changeUrbanQty = function(id, delta) {
    const item = urbanCart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      urbanCart = urbanCart.filter(i => i.id !== id);
    }
    updateCartUI();
  };

  // Open/close drawer
  if (cartBar) {
    cartBar.addEventListener('click', (e) => {
      if (e.target.closest('#openCartBtn') || e.target.closest('.cart-bar-info')) {
        if (cartDrawer) cartDrawer.classList.add('open');
        if (drawerOverlay) drawerOverlay.style.display = 'block';
      }
    });
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      if (cartDrawer) cartDrawer.classList.remove('open');
      if (drawerOverlay) drawerOverlay.style.display = 'none';
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      if (cartDrawer) cartDrawer.classList.remove('open');
      drawerOverlay.style.display = 'none';
    });
  }

  // Promo code
  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'URBAN10') {
        discountApplied = true;
        alert('🎉 Promo URBAN10 applied! 10% discount subtracted from your order.');
        updateCartUI();
      } else {
        alert('Invalid promo code. Try "URBAN10" for 10% off.');
      }
    });
  }

  // Format WhatsApp Order
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      if (urbanCart.length === 0) {
        alert('Please add items to your cart first.');
        return;
      }

      const tableNum = document.getElementById('tableSelect')?.value || 'Table 04';
      const orderNotes = document.getElementById('orderNotes')?.value || 'None';
      const subtotal = urbanCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const discount = discountApplied ? subtotal * 0.10 : 0;
      const packaging = 25;
      const total = Math.round(Math.max(0, subtotal - discount + packaging));

      let msg = `*🍔 NEW ORDER - URBAN BITES (SMARTLINK)*%0A`;
      msg += `📍 *Location:* ${encodeURIComponent(tableNum)}%0A%0A`;
      msg += `*Items Ordered:*%0A`;
      urbanCart.forEach(item => {
        msg += `• ${item.qty}x ${encodeURIComponent(item.name)} (₹${(item.price * item.qty).toLocaleString('en-IN')})%0A`;
      });
      if (discountApplied) {
        msg += `🏷️ *Discount (URBAN10 - 10%):* -₹${Math.round(discount).toLocaleString('en-IN')}%0A`;
      }
      msg += `📦 *Eco Fee:* ₹25%0A`;
      msg += `💰 *Total Due:* ₹${total.toLocaleString('en-IN')}%0A`;
      msg += `📝 *Customer Note:* ${encodeURIComponent(orderNotes)}%0A%0A`;
      msg += `_Sent via SmartLink NFC Table Card_`;
      const phone = (window.SMARTLINK_CONFIG && window.SMARTLINK_CONFIG.whatsappNumber) ? window.SMARTLINK_CONFIG.whatsappNumber : '';
      const whatsappUrl = phone 
        ? `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`
        : `https://api.whatsapp.com/send?text=${msg}`;

      // Persist demonstration order into localStorage for audit trail
      try {
        const pastOrders = JSON.parse(localStorage.getItem('smartlink_demo_orders') || '[]');
        pastOrders.push({
          date: new Date().toISOString(),
          table: tableNum,
          items: urbanCart,
          currency: 'INR',
          total: total
        });
        localStorage.setItem('smartlink_demo_orders', JSON.stringify(pastOrders));
      } catch (err) {
        console.warn('Storage disabled:', err);
      }

      window.open(whatsappUrl, '_blank');
    });
  }
}

/* ===================================================================
   SAFFRON TABLE RESERVATIONS
   =================================================================== */
function initSaffronReservation() {
  const modal = document.getElementById('saffronResModal');
  const openBtns = document.querySelectorAll('.open-res-modal');
  const closeBtn = document.getElementById('closeResModal');
  const form = document.getElementById('saffronResForm');
  const confirmation = document.getElementById('saffronResConfirmation');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (confirmation) confirmation.style.display = 'none';
      if (form) form.style.display = 'block';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = form.querySelector('[name="guestName"]')?.value || 'Honored Guest';
      const date = form.querySelector('[name="resDate"]')?.value || 'Today';
      const time = form.querySelector('[name="resTime"]')?.value || '8:00 PM';
      const guests = form.querySelector('[name="resGuests"]')?.value || '2';

      form.style.display = 'none';
      if (confirmation) {
        confirmation.innerHTML = `
          <div style="color: #D4AF37; font-size: 2.2rem; margin-bottom: 0.5rem;">✦</div>
          <h3 style="font-family: 'Cinzel', serif; color: #FFF; margin-bottom: 0.5rem;">Reservation Confirmed</h3>
          <p style="color: #C7BCAE; font-size: 0.9rem; margin-bottom: 1.5rem;">We look forward to welcoming you, <strong>${guestName}</strong>.</p>
          <div style="background: #1C1D24; border: 1px dashed #D4AF37; border-radius: 8px; padding: 1rem; text-align: left; font-size: 0.85rem; color: #E6DFD5; margin-bottom: 1.5rem;">
            <div>📅 <strong>Date:</strong> ${date}</div>
            <div>⏰ <strong>Time:</strong> ${time}</div>
            <div>👥 <strong>Party:</strong> ${guests} Guests</div>
            <div>⚜️ <strong>Table:</strong> Royal Alcove (Reserved via SmartLink)</div>
          </div>
          <button onclick="document.getElementById('saffronResModal').classList.remove('active')" style="background: #D4AF37; border: none; color: #0A0A0C; font-weight: 700; padding: 10px 24px; border-radius: 4px; cursor: pointer; font-family: 'Cinzel', serif;">Close Confirmation</button>
        `;
        confirmation.style.display = 'block';
      }
    });
  }
}

/* ===================================================================
   WAITER CALL / REVIEW DIALOG SIMULATION
   =================================================================== */
function initWaiterCall() {
  const callWaiterBtn = document.getElementById('btnCallWaiter');
  if (callWaiterBtn) {
    callWaiterBtn.addEventListener('click', () => {
      callWaiterBtn.textContent = '🛎️ Staff Notified!';
      callWaiterBtn.style.background = '#4D6D60';
      setTimeout(() => {
        alert('🔔 Table #07: Waiter has been notified via SmartLink POS. Someone will be right over with water & assistance!');
        callWaiterBtn.innerHTML = '🛎️ Call Waiter';
        callWaiterBtn.style.background = '';
      }, 400);
    });
  }

  const reviewBtn = document.getElementById('btnReviewGoogle');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
      alert('⭐ SmartLink Direct Google Review Trigger:\n\nIn live deployment, tapping this card opens Google Maps 5-Star submission dialogue directly in 1 second, bypassing search results!');
    });
  }
}
