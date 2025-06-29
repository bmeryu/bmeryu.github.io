// El script se ejecuta solo cuando el DOM se ha cargado completamente.
document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONES AUXILIARES ---
    const showConfirmationMessage = (message) => {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.className = 'ephemeral-message';
        document.body.appendChild(messageEl);
        setTimeout(() => messageEl.classList.add('show'), 10);
        setTimeout(() => {
            messageEl.classList.remove('show');
            messageEl.addEventListener('transitionend', () => messageEl.remove());
        }, 3000);
    };
    
    // --- SELECCIÓN DE ELEMENTOS ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainContent = document.getElementById('main-content');
    const faqPage = document.getElementById('faq-page');
    const siteHeader = document.getElementById('site-header');
    const siteFooterMain = document.getElementById('site-footer-main');
    const viewAllFaqsBtn = document.getElementById('view-all-faqs-btn');
    const backToMainBtn = document.getElementById('back-to-main-btn');
    const chatbotIframe = document.querySelector('#chatbot-body iframe');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const onboardingForm = document.getElementById('onboarding-form');
    const b2bForm = document.getElementById('b2b-form');
    const paymentForm = document.getElementById('payment-form');
    const contactForm = document.getElementById('contact-form');
    const userDashboard = document.getElementById('user-dashboard');
    const dashboardUsername = document.getElementById('dashboard-username');
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    const emotionSelectorContainer = document.getElementById('emotion-selector-container');
    const postEmotionView = document.getElementById('post-emotion-view');
    const emotionAckMessage = document.getElementById('emotion-ack-message');
    const startChatBtn = document.getElementById('start-chat-btn');
    const changeEmotionBtn = document.getElementById('change-emotion-btn');
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const profileEmail = document.getElementById('profile-email');
    const logoutButton = document.getElementById('logout-button');
    const chatbotFloater = document.getElementById('chatbot-floater');
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');

    let loggedInUserEmail = '';

    // --- LÓGICA DE VISUALIZACIÓN ---
    const showDashboard = (username, isNewUser) => {
        siteHeader.classList.add('hidden');
        mainContent.classList.add('hidden');
        siteFooterMain.classList.add('hidden');
        faqPage.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        userDashboard.classList.add('flex');
        dashboardUsername.textContent = username || 'usuario';
        postEmotionView.classList.add('hidden');
        emotionSelectorContainer.classList.remove('hidden');
        emotionButtons.forEach(btn => btn.classList.remove('selected'));

        if (isNewUser) {
            setTimeout(() => openModal(document.getElementById('onboarding-modal')), 500);
        }
    };

    const showMainSiteView = () => {
        siteHeader.classList.remove('hidden');
        mainContent.classList.remove('hidden');
        siteFooterMain.classList.remove('hidden');
        userDashboard.classList.add('hidden');
        userDashboard.classList.remove('flex');
        faqPage.classList.add('hidden');
    };

    // --- LÓGICA DE AUTENTICACIÓN ---
    const updateUIForLogin = (email, isNewUser) => {
        loggedInUserEmail = email;
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
        profileEmail.textContent = email;
        showDashboard(email.split('@')[0], isNewUser);
    };

    const updateUIForLogout = () => {
        loggedInUserEmail = '';
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
        showMainSiteView();
        showConfirmationMessage('Has cerrado sesión. ¡Esperamos verte pronto!');
    };
    
    // --- LÓGICA DE MODALES ---
    const openModal = (modal) => {
        if (!modal) return;
        document.querySelectorAll('.modal-overlay.active').forEach(activeModal => closeModal(activeModal));
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        if (!document.querySelector('.modal-overlay.active')) {
            document.body.style.overflow = '';
        }
    };
    
    // --- INICIALIZACIÓN DE EVENTOS ---
    
    // Menú móvil
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    // Modales (corregido para usar selectores globales)
    document.querySelectorAll('.open-modal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById(button.dataset.modalTarget);
            if (modal) openModal(modal);
        });
    });

    document.querySelectorAll('.close-modal-btn').forEach(button => {
        button.addEventListener('click', () => closeModal(button.closest('.modal-overlay')));
    });

    document.querySelectorAll('.switch-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const currentModal = button.closest('.modal-overlay');
            const targetModal = document.getElementById(button.dataset.modalTarget);
            closeModal(currentModal);
            if (targetModal) setTimeout(() => openModal(targetModal), 300);
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay);
        });
    });
    
    // Dropdown de perfil
    if (profileButton) {
        profileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
    }
    if (logoutButton) logoutButton.addEventListener('click', () => {
        profileDropdown.classList.remove('active');
        updateUIForLogout();
    });
    document.addEventListener('click', (e) => {
        if (profileDropdown && !profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Chatbot
    const openChatbot = () => {
        if (chatbotFloater) chatbotFloater.classList.remove('is-minimized');
    };
    if (chatbotBubble) chatbotBubble.addEventListener('click', openChatbot);
    if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', () => chatbotFloater.classList.add('is-minimized'));

    // --- FORMULARIOS ---

    // UX MEJORADA PARA LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorMessage = document.getElementById('login-error-message');
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;

            // 1. Mostrar estado de carga inmediatamente
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></span>Iniciando sesión...`;
            errorMessage.classList.add('hidden');

            const webhookURL = 'https://muna.auto.hostybee.com/webhook/login';
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const result = await response.json();
                if (response.ok) {
                    closeModal(loginForm.closest('.modal-overlay'));
                    updateUIForLogin(email, false);
                } else {
                    errorMessage.textContent = result.error || 'Email o contraseña incorrectos.';
                    errorMessage.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error de conexión en login:', error);
                errorMessage.textContent = 'No se pudo conectar con el servidor.';
                errorMessage.classList.remove('hidden');
            } finally {
                // 2. Restaurar el botón al finalizar
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    }
    
    if (registerForm) { /* ...código de registro sin cambios... */ }
    if (onboardingForm) { /* ...código de onboarding sin cambios... */ }
    // ...resto de formularios

    // Manejo de emociones (versión final)
    emotionButtons.forEach(button => {
        button.addEventListener('click', async () => { 
            emotionButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
    
            const selectedEmotion = button.dataset.emotion; 
            const feeling = button.dataset.feeling;
            
            if (chatbotIframe) {
                const baseUrl = 'https://muna.auto.hostybee.com/webhook/9bedfe60-a6f1-4592-8d6f-51e7e309affc/chat';
                const newUrl = `${baseUrl}?startEmotion=${encodeURIComponent(selectedEmotion)}`;
                if (chatbotIframe.src !== newUrl) chatbotIframe.src = newUrl;
            }
    
            const webhookURL = 'https://muna.auto.hostybee.com/webhook/registrar-emocion';
            const emotionData = { email: loggedInUserEmail, emotion: selectedEmotion };
    
            showConfirmationMessage(`Gracias por compartir que te sientes ${feeling}.`);
    
            setTimeout(openChatbot, 1500);
    
            try {
                await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emotionData)
                });
            } catch (error) {
                console.error('Error de red al registrar emoción:', error);
            }
        });
    });
    
    // Navegación y otros
    if (viewAllFaqsBtn) { /* ...código sin cambios... */ }
    if (backToMainBtn) { /* ...código sin cambios... */ }
    document.querySelectorAll('.faq-question').forEach(button => { /* ...código sin cambios... */ });
    // Búsqueda del blog
    const searchInput = document.getElementById('blog-search-input');
    if(searchInput){ /* ...código sin cambios... */ }
});
