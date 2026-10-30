/**
 * SMARTLINK BUSINESS - BILINGUAL AI CHATBOT GUIDE
 * Interactive AI Assistant guiding users across the website in English and Hindi
 */

(function() {
  const knowledgeBase = {
    nfc: {
      en: {
        text: "⚡ **How SmartLink NFC Works:**\n\nNFC (Near Field Communication) transmits data instantly when a customer holds their smartphone within 2 to 4 cm of our card or table stand.\n\n• **Zero App Needed:** Opens directly in iOS App Clips or native Safari/Chrome.\n• **0.4s Launch:** Loads menus 5x faster than camera QR scanning.\n• **Lifetime Durability:** Industrial NTAG216 chip tested for 100,000+ taps.",
        actions: [
          { label: "⚡ Test NFC on Hero Phone", action: "test_nfc" },
          { label: "📦 Request Sample NFC Card", action: "goto_contact" }
        ]
      },
      hi: {
        text: "⚡ **स्मार्टलिंक एनएफसी (NFC) कैसे काम करता है:**\n\nजब ग्राहक अपना स्मार्टफोन हमारे कार्ड या टेबल स्टैंड के पास (2 से 4 सेमी) लाते हैं, तो एनएफसी चिप तुरंत सक्रिय हो जाती है।\n\n• **किसी ऐप की ज़रूरत नहीं:** यह सीधे आईफ़ोन और एंड्रॉइड के ब्राउज़र में खुलता है।\n• **0.4 सेकंड में लोड:** सामान्य कैमरा क्यूआर से 5 गुना ज़्यादा तेज़।\n• **100,000+ टैप वारंटी:** टिकाऊ औद्योगिक NTAG216 माइक्रोचिप।",
        actions: [
          { label: "⚡ स्क्रीन पर एनएफसी टेस्ट करें", action: "test_nfc" },
          { label: "📦 मुफ़्त सैंपल कार्ड मंगाएं", action: "goto_contact" }
        ]
      }
    },
    demos: {
      en: {
        text: "🍽️ **Our 3 Live Interactive Restaurant Demos:**\n\n1. **Brew & Bloom:** Minimalist beige café menu with coffee flavor notes & waiter calling.\n2. **Saffron Table:** Royal black & gold fine dining with sommelier wine pairings & table reservation.\n3. **Urban Bites:** Modern quick-service menu with active cart & 1-click WhatsApp order generation!",
        actions: [
          { label: "📱 Open Phone Simulator", action: "open_simulator" },
          { label: "🚀 View Showroom Section", action: "goto_demos" }
        ]
      },
      hi: {
        text: "🍽️ **हमारे 3 लाइव रेस्टोरेंट डिजिटल मेनू डेमो:**\n\n1. **ब्रू एंड ब्लूम (Brew & Bloom):** मिनिमलिस्ट बेज कैफ़े मेनू, कॉफ़ी स्वाद प्रोफ़ाइल और वेटर कॉलिंग।\n2. **सैफ़रन टेबल (Saffron Table):** शाही ब्लैक और गोल्ड थीम, वाइन पेयरिंग और ऑनलाइन टेबल बुकिंग।\n3. **अर्बन बाइट्स (Urban Bites):** आधुनिक भोजनालय जिसमें लाइव कार्ट और 1-क्लिक व्हाट्सएप ऑर्डर है!",
        actions: [
          { label: "📱 मोबाइल सिम्युलेटर खोलें", action: "open_simulator" },
          { label: "🚀 डेमो गैलरी पर जाएं", action: "goto_demos" }
        ]
      }
    },
    pricing: {
      en: {
        text: "💰 **Transparent Hardware Packages & Pricing (INR):**\n\n• **Starter Stand Kit (₹4,999):** 5x Walnut QR Stands + 2x Staff NFC Cards + Cloud Portal.\n• **Pro NFC Suite (₹11,999 - Most Popular):** 15x Dual NFC/QR Stands + 6x Custom Engraved NFC Cards + Google Review Plaques + WhatsApp Cart.\n• **Enterprise (₹24,999+):** Custom volume tiered for multi-location brands & hotels.\n\n*No recurring monthly fees — you own your hardware outright!*",
        actions: [
          { label: "🧮 Use Interactive ROI Calculator", action: "goto_pricing" },
          { label: "📦 Claim Free Sample Kit", action: "goto_contact" }
        ]
      },
      hi: {
        text: "💰 **हार्डवेयर पैकेज और कीमतें (रुपये में):**\n\n• **स्टार्टर किट (₹4,999):** 5 वॉलनट टेबल स्टैंड + 2 स्टाफ़ एनएफसी कार्ड + क्लाउड पोर्टल।\n• **प्रो एनएफसी सुइट (₹11,999 - सबसे लोकप्रिय):** 15 डुअल स्टैंड + 6 कस्टम लेज़र कार्ड + गूगल रिव्यू स्टैंड + व्हाट्सएप कार्ट।\n• **एंटरप्राइज़ (₹24,999+):** बड़े होटल और मल्टी-लोकेशन रेस्टोरेंट के लिए कस्टम पैकेज।\n\n*कोई छुपा हुआ मासिक किराया नहीं — हार्डवेयर स्थायी रूप से आपका होगा!*",
        actions: [
          { label: "🧮 ROI कैलकुलेटर चलाएं", action: "goto_pricing" },
          { label: "📦 मुफ़्त सैंपल किट बुक करें", action: "goto_contact" }
        ]
      }
    },
    sample: {
      en: {
        text: "📦 **How to Claim Your Free Hardware Sample Kit:**\n\nWe provide a complimentary sample pack containing our genuine Matte Black NFC Card, a sample Walnut QR block, and testing links for your venue.\n\nSimply fill in your venue name and shipping address in our enquiry form below!",
        actions: [
          { label: "✍️ Fill Free Sample Request Form", action: "goto_contact" },
          { label: "💬 Message on WhatsApp", action: "open_whatsapp" }
        ]
      },
      hi: {
        text: "📦 **मुफ़्त हार्डवेयर सैंपल किट कैसे प्राप्त करें:**\n\nहम सत्यापित व्यवसायों को एक मानार्थ सैंपल पैक भेजते हैं जिसमें असली मैट ब्लैक एनएफसी कार्ड, अखरोट की लकड़ी का क्यूआर ब्लॉक और परीक्षण लिंक्स शामिल हैं।\n\nनीचे दिए गए फ़ॉर्म में अपने प्रतिष्ठान का नाम और डिलीवरी पता दर्ज करें!",
        actions: [
          { label: "✍️ सैंपल अनुरोध फ़ॉर्म भरें", action: "goto_contact" },
          { label: "💬 व्हाट्सएप पर पूछें", action: "open_whatsapp" }
        ]
      }
    },
    reviews: {
      en: {
        text: "⭐ **Google Review Tap Cards — 300% Lift:**\n\nInstead of asking guests to search your business on Google, they simply tap the card with their phone.\n\nOur direct deep-link automatically launches the native Google Maps app directly to the 5-star rating window with zero typing friction!",
        actions: [
          { label: "🔍 View Review Card Details", action: "goto_products" },
          { label: "📦 Request Review Card Sample", action: "goto_contact" }
        ]
      },
      hi: {
        text: "⭐ **गूगल 5-स्टार रिव्यू कार्ड — 300% तक रिव्यू वृद्धि:**\n\nग्राहकों को गूगल पर आपका नाम खोजने के लिए कहने के बजाय, वे बस अपना फ़ोन कार्ड पर टैप करते हैं।\n\nहमारा डायरेक्ट डीप-लिंक गूगल मैप्स ऐप को सीधे 5-स्टार रेटिंग विंडो के साथ खोल देता है, जिससे ग्राहक 2 सेकंड में रिव्यू दे देते हैं!",
        actions: [
          { label: "🔍 रिव्यू कार्ड के विवरण देखें", action: "goto_products" },
          { label: "📦 रिव्यू कार्ड सैंपल मंगाएं", action: "goto_contact" }
        ]
      }
    },
    indore: {
      en: {
        text: "📍 **SmartLink Business in Indore & MP:**\n\nYes! We actively serve restaurants, cafés, salons, and retail venues across Indore, including Vijay Nagar, Palasia, Bhawarkua, Chappan Dukan, Sarafa, and Super Corridor.\n\n• **Local Express Delivery:** Sample kits and tabletop hardware dispatch directly in Indore.\n• **On-Site Setup Assistance:** Available for restaurants across the Indore metropolitan area.",
        actions: [
          { label: "📦 Request Sample Kit in Indore", action: "goto_contact" },
          { label: "💬 WhatsApp Indore Support", action: "open_whatsapp" }
        ]
      },
      hi: {
        text: "📍 **इंदौर एवं मध्य प्रदेश में स्मार्टलिंक सेवा:**\n\nहाँ! हम इंदौर के सभी प्रमुख क्षेत्रों (विजयनगर, पलासिया, भंवरकुआं, छप्पन दुकान, सराफा, सुपर कॉरिडोर आदि) के रेस्टोरेंट, कैफ़े और स्टोर्स को सीधे सेवा प्रदान करते हैं।\n\n• **इंदौर में त्वरित डिलीवरी:** 24 से 48 घंटे में सीधे आपके काउंटर पर डिस्पैच।\n• **ऑन-साइट सेटअप सहायता:** इंदौर शहर में प्रतिष्ठानों के लिए उपलब्ध।",
        actions: [
          { label: "📦 इंदौर में सैंपल किट मंगाएं", action: "goto_contact" },
          { label: "💬 इंदौर टीम से व्हाट्सएप चैट", action: "open_whatsapp" }
        ]
      }
    },
    whatsapp: {
      en: {
        text: "💬 **WhatsApp Ordering & Support:**\n\nOur smart links allow guests to build their order at the table and transmit a beautifully structured ticket directly to your WhatsApp counter.\n\nYou can also contact our team directly on WhatsApp for custom branding or questions!",
        actions: [
          { label: "🍔 Test WhatsApp Cart Demo", action: "open_urban_demo" },
          { label: "💬 Chat on WhatsApp", action: "open_whatsapp" }
        ]
      },
      hi: {
        text: "💬 **व्हाट्सएप ऑर्डरिंग व सहायता:**\n\nस्मार्टलिंक से ग्राहक अपनी टेबल पर बैठकर मेनू से आइटम चुनते हैं और एक क्लिक में पूरा ऑर्डर बिल आपके व्हाट्सएप पर भेज देते हैं।\n\nकस्टम ब्रांडिंग या किसी प्रश्न के लिए आप सीधे हमारी टीम से व्हाट्सएप पर भी जुड़ सकते हैं!",
        actions: [
          { label: "🍔 व्हाट्सएप कार्ट डेमो चलाएं", action: "open_urban_demo" },
          { label: "💬 व्हाट्सएप पर चैट शुरू करें", action: "open_whatsapp" }
        ]
      }
    },
    fallback: {
      en: {
        text: "I am here to guide you! I can help you with:\n• **NFC Technology & Stand Durability**\n• **Exploring our 3 live restaurant demo menus**\n• **Packages, pricing & ROI calculation**\n• **How to get a free hardware sample kit**\n• **Setting up 1-tap Google Review cards**",
        actions: [
          { label: "🍽️ Explore Live Demos", action: "goto_demos" },
          { label: "💰 View Pricing & ROI", action: "goto_pricing" },
          { label: "📦 Free Sample Kit", action: "goto_contact" }
        ]
      },
      hi: {
        text: "मैं आपकी सहायता के लिए तैयार हूँ! आप मुझसे इनके बारे में पूछ सकते हैं:\n• **एनएफसी तकनीक और स्टैंड की मजबूती**\n• **हमारे 3 लाइव रेस्टोरेंट डिजिटल मेनू देखना**\n• **पैकेज, कीमतें और ROI कैलकुलेटर**\n• **मुफ़्त हार्डवेयर सैंपल किट मंगाना**\n• **गूगल 5-स्टार रिव्यू कार्ड की जानकारी**",
        actions: [
          { label: "🍽️ लाइव डेमो देखें", action: "goto_demos" },
          { label: "💰 मूल्य व ROI देखें", action: "goto_pricing" },
          { label: "📦 मुफ़्त सैंपल किट", action: "goto_contact" }
        ]
      }
    }
  };

  function matchQuery(query) {
    const q = query.toLowerCase();
    
    // NFC queries
    if (q.includes('nfc') || q.includes('tap') || q.includes('how it work') || q.includes('टैप') || q.includes('काम') || q.includes('chip') || q.includes('काम करता')) {
      return 'nfc';
    }
    // Demo queries
    if (q.includes('demo') || q.includes('menu') || q.includes('restaurant') || q.includes('cafe') || q.includes('डेमो') || q.includes('मेनू') || q.includes('रेस्टोरेंट') || q.includes('saffron') || q.includes('urban') || q.includes('brew')) {
      return 'demos';
    }
    // Pricing queries
    if (q.includes('price') || q.includes('cost') || q.includes('package') || q.includes('roi') || q.includes('rate') || q.includes('कीमत') || q.includes('मूल्य') || q.includes('पैकेज') || q.includes('खर्च') || q.includes('kitne')) {
      return 'pricing';
    }
    // Sample kit queries
    if (q.includes('sample') || q.includes('free') || q.includes('order') || q.includes('kit') || q.includes('सैंपल') || q.includes('मुफ़्त') || q.includes('फ्री') || q.includes('किट') || q.includes('manga')) {
      return 'sample';
    }
    // Review card queries
    if (q.includes('review') || q.includes('google') || q.includes('rating') || q.includes('star') || q.includes('रिव्यू') || q.includes('गूगल') || q.includes('स्टार')) {
      return 'reviews';
    }
    // Indore / Local coverage queries
    if (q.includes('indore') || q.includes('madhya pradesh') || q.includes('इंदौर') || q.includes('delivery') || q.includes('delhi') || q.includes('location') || q.includes('vijay nagar') || q.includes('palasia')) {
      return 'indore';
    }
    // WhatsApp queries
    if (q.includes('whatsapp') || q.includes('chat') || q.includes('message') || q.includes('व्हाट्सएप') || q.includes('मैसेज')) {
      return 'whatsapp';
    }

    return 'fallback';
  }

  function handleAction(actionKey) {
    switch(actionKey) {
      case 'goto_demos':
        document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto_pricing':
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto_products':
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'goto_contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'open_simulator':
        if (window.openSimulatorModal) window.openSimulatorModal('brew');
        break;
      case 'open_urban_demo':
        window.open('demos/urban-bites.html', '_blank');
        break;
      case 'open_whatsapp':
        // WhatsApp configurable placeholder CTA mapped to SMARTLINK_CONFIG
        const phone = (window.SMARTLINK_CONFIG && window.SMARTLINK_CONFIG.whatsappNumber) ? window.SMARTLINK_CONFIG.whatsappNumber : 'YOUR_PHONE_NUMBER';
        const msg = encodeURIComponent('Hello SmartLink Business! I would like to inquire about your NFC cards, smart stands, and digital menus in Indore.');
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
        break;
      case 'test_nfc':
        document.getElementById('heroTapTrigger')?.click();
        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }

  window.initAiChatbot = function() {
    const toggleBtn = document.getElementById('aiChatToggle');
    const chatContainer = document.getElementById('aiChatContainer');
    const closeBtn = document.getElementById('aiChatClose');
    const messagesBox = document.getElementById('aiChatMessages');
    const chipsBox = document.getElementById('aiChatChips');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSend');

    if (!toggleBtn || !chatContainer) return;

    let isChatOpen = false;

    function openChat() {
      chatContainer.classList.add('active');
      toggleBtn.classList.add('chat-open');
      isChatOpen = true;
      if (chatInput) chatInput.focus();
    }

    function closeChat() {
      chatContainer.classList.remove('active');
      toggleBtn.classList.remove('chat-open');
      isChatOpen = false;
    }

    toggleBtn.addEventListener('click', () => {
      if (isChatOpen) closeChat();
      else openChat();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    function renderMessage(sender, text, actions = []) {
      if (!messagesBox) return;

      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg chat-msg-${sender}`;

      // Convert Markdown bold to strong tags
      let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedText = formattedText.replace(/\n/g, '<br/>');

      let actionHtml = '';
      if (actions.length > 0) {
        actionHtml = `
          <div class="chat-actions-row">
            ${actions.map(a => `<button class="chat-action-btn" data-action="${a.action}">${a.label}</button>`).join('')}
          </div>
        `;
      }

      msgDiv.innerHTML = `
        <div class="msg-bubble">
          ${formattedText}
          ${actionHtml}
        </div>
      `;

      messagesBox.appendChild(msgDiv);
      messagesBox.scrollTop = messagesBox.scrollHeight;

      // Bind action buttons
      msgDiv.querySelectorAll('.chat-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const act = btn.getAttribute('data-action');
          handleAction(act);
        });
      });
    }

    function sendUserQuery(userText) {
      if (!userText || !userText.trim()) return;
      const text = userText.trim();

      renderMessage('user', text);
      if (chatInput) chatInput.value = '';

      // Typing indicator
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-msg chat-msg-bot typing-indicator-msg';
      typingDiv.innerHTML = `
        <div class="msg-bubble typing-bubble">
          <span></span><span></span><span></span>
        </div>
      `;
      messagesBox.appendChild(typingDiv);
      messagesBox.scrollTop = messagesBox.scrollHeight;

      setTimeout(() => {
        typingDiv.remove();
        const lang = currentLang || 'en';
        const topic = matchQuery(text);
        const data = knowledgeBase[topic][lang] || knowledgeBase.fallback[lang];

        renderMessage('bot', data.text, data.actions);
      }, 550);
    }

    if (sendBtn && chatInput) {
      sendBtn.addEventListener('click', () => sendUserQuery(chatInput.value));
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendUserQuery(chatInput.value);
      });
    }

    // Bind Quick Chips
    if (chipsBox) {
      chipsBox.addEventListener('click', (e) => {
        const chip = e.target.closest('.chat-chip');
        if (chip) {
          const queryText = chip.getAttribute('data-query') || chip.textContent;
          sendUserQuery(queryText);
        }
      });
    }

    // Refresh chips & welcome message on language switch
    window.onChatbotLanguageChange = function(newLang) {
      if (!chipsBox) return;
      const t = translations[newLang];
      if (!t) return;

      chipsBox.innerHTML = `
        <button class="chat-chip" data-query="${t.chat_chip_nfc}">${t.chat_chip_nfc}</button>
        <button class="chat-chip" data-query="${t.chat_chip_demos}">${t.chat_chip_demos}</button>
        <button class="chat-chip" data-query="${t.chat_chip_pricing}">${t.chat_chip_pricing}</button>
        <button class="chat-chip" data-query="${t.chat_chip_sample}">${t.chat_chip_sample}</button>
        <button class="chat-chip" data-query="${t.chat_chip_review}">${t.chat_chip_review}</button>
      `;

      // Add a greeting update
      const botGreeting = document.getElementById('chatInitialGreeting');
      if (botGreeting) {
        botGreeting.innerHTML = t.chat_welcome;
      }
    };
  };

  document.addEventListener('DOMContentLoaded', window.initAiChatbot);
})();
