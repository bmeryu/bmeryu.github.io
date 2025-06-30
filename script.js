/* =====================================================================
 *  Muna IA – script.js   (versión limpia 2025-06-30)
 * ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. UTILIDADES BÁSICAS ---------- */

  const showConfirmationMessage = (message, duration = 3000) => {
    const el = document.createElement('div');
    el.textContent = message;
    el.className = 'ephemeral-message';
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('show'), 20);
    setTimeout(() => {
      el.classList.remove('show');
      el.addEventListener('transitionend', () => el.remove());
    }, duration);
  };

  const setButtonLoadingState = (btn, isLoading, text = 'Enviando…') => {
    if (!btn) return;
    if (isLoading) {
      btn.dataset.originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML =
        `<span class="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full inline-block"></span><span>${text}</span>`;
    } else {
      btn.disabled = false;
      if (btn.dataset.originalHtml) btn.innerHTML = btn.dataset.originalHtml;
    }
  };

  /* ---------- 2. SELECTORES DE ELEMENTOS ---------- */

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => c.querySelectorAll(s);

  // vistas generales
  const siteHeader          = $('#site-header');
  const mainContent         = $('#main-content');
  const faqPage             = $('#faq-page');
  const siteFooterMain      = $('#site-footer-main');

  // dashboard & emociones
  const userDashboard             = $('#user-dashboard');
  const dashboardUsername         = $('#dashboard-username');
  const emotionButtons            = $$('.emotion-btn');
  const emotionSelectorContainer  = $('#emotion-selector-container');
  const postEmotionView           = $('#post-emotion-view');
  const emotionAckMessage         = $('#emotion-ack-message');
  const startChatBtn              = $('#start-chat-btn');
  const changeEmotionBtn          = $('#change-emotion-btn');

  // navegación / perfil
  const mobileMenuButton  = $('#mobile-menu-button');
  const mobileMenu        = $('#mobile-menu');
  const viewAllFaqsBtn    = $('#view-all-faqs-btn');
  const backToMainBtn     = $('#back-to-main-btn');
  const profileButton     = $('#profile-button');
  const profileDropdown   = $('#profile-dropdown');
  const loggedOutView     = $('#logged-out-view');
  const loggedInView      = $('#logged-in-view');
  const profileEmail      = $('#profile-email');
  const logoutButton      = $('#logout-button');

  // chatbot flotante
  const chatbotFloater    = $('#chatbot-floater');
  const chatbotBubble     = $('#chatbot-bubble');
  const chatbotCloseBtn   = $('#chatbot-close-btn');
  const chatbotIframe     = $('#chatbot-body iframe');

  // formularios
  const loginForm     = $('#login-form');
  const registerForm  = $('#register-form');
  const onboardingForm= $('#onboarding-form');
  const b2bForm       = $('#b2b-form');
  const paymentForm   = $('#payment-form');
  const contactForm   = $('#contact-form');

  /* ---------- 3. ESTADO GLOBAL ---------- */

  let loggedInUserEmail   = '';
  let emotionToSendMessage = null;   // se setea al elegir emoción

  /* ---------- 4. VISTAS Y MODALES ---------- */

  const openModal = (el) => {
    if (!el) return;
    $$('.modal-overlay.active').forEach(m => closeModal(m));
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (el) => {
    if (!el) return;
    el.classList.remove('active');
    if (!$('.modal-overlay.active')) document.body.style.overflow = '';
  };

  const showDashboard = (username, isNewUser) => {
    siteHeader.classList.add('hidden');
    mainContent.classList.add('hidden');
    siteFooterMain.classList.add('hidden');
    faqPage.classList.add('hidden');

    userDashboard.classList.remove('hidden');
    userDashboard.classList.add('flex');
    dashboardUsername.textContent = username || 'Usuario';

    postEmotionView.classList.add('hidden');
    emotionSelectorContainer.classList.remove('hidden');
    emotionButtons.forEach(b => b.classList.remove('selected'));

    if (isNewUser) setTimeout(() => openModal($('#onboarding-modal')), 500);
  };

  const showMainSiteView = () => {
    siteHeader.classList.remove('hidden');
    mainContent.classList.remove('hidden');
    siteFooterMain.classList.remove('hidden');
    faqPage.classList.add('hidden');

    userDashboard.classList.add('hidden');
    userDashboard.classList.remove('flex');
  };

  const updateUIForLogin = (email, isNew) => {
    loggedInUserEmail = email;
    loggedOutView.classList.add('hidden');
    loggedInView.classList.remove('hidden');
    profileEmail.textContent = email;
    showDashboard(email.split('@')[0], isNew);
  };

  const updateUIForLogout = () => {
    loggedInUserEmail = '';
    loggedOutView.classList.remove('hidden');
    loggedInView.classList.add('hidden');
    showMainSiteView();
    showConfirmationMessage('Has cerrado sesión. ¡Esperamos verte pronto!');
  };

  /* ---------- 5. CHATBOT ---------- */

  const openChatbot = () => {
    if (!chatbotFloater) return;
    chatbotFloater.classList.remove('is-minimized');

    // Enviar emoción como metadata o primer mensaje
    if (emotionToSendMessage && chatbotIframe?.contentWindow) {
      setTimeout(() => {
        chatbotIframe.contentWindow.postMessage(
          { type: 'startConversation',
            emotion: emotionToSendMessage,
            focus: true
          },
          '*'
        );
        emotionToSendMessage = null;   // limpiar
      }, 500);
    }
  };

  /* ---------- 6. LISTENERS ---------- */

  // menú móvil
  if (mobileMenuButton) mobileMenuButton.addEventListener('click', () =>
    mobileMenu.classList.toggle('hidden'));

  // FAQ
  if (viewAllFaqsBtn) viewAllFaqsBtn.addEventListener('click', () => {
    mainContent.classList.add('hidden');
    siteFooterMain.classList.add('hidden');
    faqPage.classList.remove('hidden');
    window.scrollTo(0, 0);
  });
  if (backToMainBtn) backToMainBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showMainSiteView();
  });

  // perfil
  if (profileButton) profileButton.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
  });
  if (logoutButton) logoutButton.addEventListener('click', updateUIForLogout);
  document.addEventListener('click', (e) => {
    if (profileDropdown && !profileDropdown.contains(e.target) &&
        !profileButton.contains(e.target)) {
      profileDropdown.classList.remove('active');
    }
  });

  // chatbot flotante
  if (chatbotBubble) chatbotBubble.addEventListener('click', openChatbot);
  if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', () =>
    chatbotFloater.classList.add('is-minimized'));
  if (startChatBtn)   startChatBtn.addEventListener('click', openChatbot);

  // ----- Emociones (¡CORREGIDO!) -----
  emotionButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      // 1. Estilo visual
      emotionButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // 2. Capturar emoción correctamente
      const selectedEmotion = btn.dataset.emotion;   // <— corregido
      const feelingText     = btn.dataset.feeling;

      // 3. Registrar la emoción (opcional)
      try {
        await fetch('https://muna.auto.hostybee.com/webhook/registrar-emocion', {
          method : 'POST',
          headers: { 'Content-Type':'application/json' },
          body   : JSON.stringify({ email: loggedInUserEmail,
                                   emotion: selectedEmotion })
        });
      } catch (err) { console.error('registrar_emocion', err); }

      // 4. Guardar para la sesión de chat y avisar al usuario
      emotionToSendMessage = selectedEmotion;
      showConfirmationMessage(`Gracias por compartir que te sientes ${feelingText}.`);
      postEmotionView.classList.remove('hidden');
      emotionSelectorContainer.classList.add('hidden');
    });
  });

  if (changeEmotionBtn) changeEmotionBtn.addEventListener('click', () => {
    postEmotionView.classList.add('hidden');
    emotionSelectorContainer.classList.remove('hidden');
  });

  /* ---------- 7. FORMULARIOS (RESUMIDOS) ---------- */

  // 7.1  Login
  if (loginForm) loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = $('#login-email').value;
    const password = $('#login-password').value;
    const errorMsg = $('#login-error-message');
    const submit   = $('button[type="submit"]', loginForm);

    setButtonLoadingState(submit, true, 'Iniciando sesión…');
    errorMsg.classList.add('hidden');

    try {
      const r = await fetch('https://muna.auto.hostybee.com/webhook/login', {
        method :'POST', headers:{ 'Content-Type':'application/json' },
        body   : JSON.stringify({ email, password })
      });
      const res = await r.json();
      if (r.ok) {
        closeModal(loginForm.closest('.modal-overlay'));
        updateUIForLogin(email, false);
      } else {
        errorMsg.textContent = res.error || 'Email o contraseña incorrectos.';
        errorMsg.classList.remove('hidden');
      }
    } catch (er) {
      console.error('login:', er);
      errorMsg.textContent = 'No se pudo conectar con el servidor.';
      errorMsg.classList.remove('hidden');
    } finally {
      setButtonLoadingState(submit, false);
    }
  });

  // 7.2  Registro
  if (registerForm) registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = $('#register-email').value;
    const password = $('#register-password').value;
    const submit   = $('button[type="submit"]', registerForm);

    setButtonLoadingState(submit, true, 'Creando cuenta…');

    try {
      const r = await fetch('https://muna.auto.hostybee.com/webhook/registro', {
        method :'POST', headers:{ 'Content-Type':'application/json' },
        body   : JSON.stringify({ email, password,
                                 registeredAt: new Date().toISOString() })
      });
      const res = await r.json();
      if (res.success) {
        closeModal(registerForm.closest('.modal-overlay'));
        updateUIForLogin(email, true);
      } else alert(res.message);
    } catch (er) {
      console.error('registro:', er);
      alert('No se pudo completar el registro.');
    } finally { setButtonLoadingState(submit, false); }
  });

  /* ----- (b2bForm, paymentForm, contactForm, FAQ toggle, búsqueda blog, etc.)
          Se mantienen idénticos a tu versión previa; si necesitas
          moverlos ponlos aquí debajo, asegurándote de no duplicar código. ----- */

});
