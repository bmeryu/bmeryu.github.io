document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONES AUXILIARES ---
    const showConfirmationMessage = (message, duration = 3000) => {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.className = 'ephemeral-message';
        document.body.appendChild(messageEl);
        setTimeout(() => messageEl.classList.add('show'), 10);
        setTimeout(() => {
            messageEl.classList.remove('show');
            messageEl.addEventListener('transitionend', () => messageEl.remove());
        }, duration);
    };

    const setButtonLoadingState = (button, isLoading, loadingText = "Enviando...") => {
        if (!button) return;
        if (isLoading) {
            button.dataset.originalHtml = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<span class="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full" style="display: inline-block;"></span><span>${loadingText}</span>`;
        } else {
            button.disabled = false;
            if (button.dataset.originalHtml) button.innerHTML = button.dataset.originalHtml;
        }
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
    const userDashboard = document.getElementById('user-dashboard');
    const dashboardUsername = document.getElementById('dashboard-username');
    const emotionButtons = document.querySelectorAll('.emotion-btn');
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
    let emotionToSendMessage = null;

    // --- LÓGICA DE VISUALIZACIÓN ---
    const showDashboard = (username, isNewUser) => {
        siteHeader.classList.add('hidden');
        mainContent.classList.add('hidden');
        siteFooterMain.classList.add('hidden');
        faqPage.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        userDashboard.classList.add('flex');
        dashboardUsername.textContent = username || 'usuario';
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
    
    // --- LÓGICA DEL CHATBOT (CON TU SOLUCIÓN) ---
    const openChatbot = () => {
        if (chatbotFloater) chatbotFloater.classList.remove('is-minimized');

        if (emotionToSendMessage && chatbotIframe && chatbotIframe.contentWindow) {
            const sendEmotion = () => {
                chatbotIframe.contentWindow.postMessage({
                    action: 'sendMessage',
                    chatInput: `Hoy me siento ${emotionToSendMessage}`
                }, '*');
                emotionToSendMessage = null; // Limpia la variable para no reenviar
            };

            // Comprueba si el iframe ya está cargado, si no, espera al evento 'load'
            if (chatbotIframe.contentDocument?.readyState === 'complete') {
                setTimeout(sendEmotion, 300); // Espera un instante por seguridad
            } else {
                chatbotIframe.addEventListener('load', () => setTimeout(sendEmotion, 300), { once: true });
            }
        }
    };

    // --- INICIALIZACIÓN DE EVENTOS ---
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

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

    if (chatbotBubble) chatbotBubble.addEventListener('click', openChatbot);
    if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', () => chatbotFloater.classList.add('is-minimized'));

    // --- FORMULARIOS ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorMessage = document.getElementById('login-error-message');
            const submitButton = loginForm.querySelector('button[type="submit"]');
            
            setButtonLoadingState(submitButton, true, "Iniciando sesión...");
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
                errorMessage.textContent = 'No se pudo conectar con el servidor.';
                errorMessage.classList.remove('hidden');
            } finally {
                setButtonLoadingState(submitButton, false);
            }
        });
    }
    
    // ... (resto de formularios)

    // --- MANEJO DE EMOCIONES ---
    emotionButtons.forEach(button => {
        button.addEventListener('click', async () => { 
            emotionButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
    
            const selectedEmotion = button.dataset.emotion || button.value; 
            const feeling = button.dataset.feeling;
            
            emotionToSendMessage = selectedEmotion;
    
            const webhookURL = 'https://muna.auto.hostybee.com/webhook/registrar-emocion';
            const emotionData = { email: loggedInUserEmail, emotion: selectedEmotion };
    
            showConfirmationMessage(`Gracias por compartir que te sientes ${feeling}.`);
    
            openChatbot();
    
            try {
                await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emotionData)
                });
            } catch (error) {
                console.error('Error al registrar la emoción:', error);
            }
        });
    });
    
    // ... (resto de la lógica de la página)
});
