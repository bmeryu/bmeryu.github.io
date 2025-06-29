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

    const setButtonLoadingState = (button, isLoading, loadingText = "Enviando...") => {
        if (!button) return;
        if (isLoading) {
            button.dataset.originalHtml = button.innerHTML;
            button.disabled = true;
            button.innerHTML = `<span class="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full" style="display: inline-block;"></span><span>${loadingText}</span>`;
        } else {
            button.disabled = false;
            if (button.dataset.originalHtml) {
                button.innerHTML = button.dataset.originalHtml;
            }
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
    let emotionToSendMessage = null; // Variable para "grabar" la emoción

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
    
    // --- LÓGICA DEL CHATBOT ---
    const openChatbot = () => {
        if (chatbotFloater) {
            chatbotFloater.classList.remove('is-minimized');
        }

        // Lógica de "Reproducir": Se ejecuta DESPUÉS de abrir el chat.
        if (emotionToSendMessage && chatbotIframe && chatbotIframe.contentWindow) {
            // Esperamos un instante para asegurar que el iframe está listo
            setTimeout(() => {
                const message = {
                    type: 'startConversation',
                    emotion: emotionToSendMessage,
                    focus: true // Se añade la instrucción de hacer focus
                };
                chatbotIframe.contentWindow.postMessage(message, '*');
                emotionToSendMessage = null; // Borramos la grabación
            }, 500); // Se aumenta el tiempo para más fiabilidad
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
                console.error('Error de conexión en login:', error);
                errorMessage.textContent = 'No se pudo conectar con el servidor.';
                errorMessage.classList.remove('hidden');
            } finally {
                setButtonLoadingState(submitButton, false);
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const submitButton = registerForm.querySelector('button[type="submit"]');
            
            setButtonLoadingState(submitButton, true, "Creando cuenta...");

            const webhookURL = 'https://muna.auto.hostybee.com/webhook/registro'; 
            const formData = { email, password, registeredAt: new Date().toISOString() };
    
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if (result.success === true) {
                    closeModal(registerForm.closest('.modal-overlay'));
                    updateUIForLogin(email, true);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error de red en registro:', error);
                alert('No se pudo completar el registro por un error de red.');
            } finally {
                setButtonLoadingState(submitButton, false);
            }
        });
    }

    if (b2bForm) {
        b2bForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = b2bForm.querySelector('button[type="submit"]');
            setButtonLoadingState(submitButton, true);

            const institutionName = document.getElementById('b2b-institution').value;
            const webhookURL = 'https://muna.auto.hostybee.com/webhook/solicitud-b2b';
            const formData = {
                name: document.getElementById('b2b-name').value,
                email: document.getElementById('b2b-email').value,
                institution: institutionName,
                role: document.getElementById('b2b-role').value,
                families: document.getElementById('b2b-families').value
            };
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (response.ok) {
                    closeModal(b2bForm.closest('.modal-overlay'));
                    showConfirmationMessage(`¡Gracias! El kit para ${institutionName} se ha enviado a tu correo.`);
                    b2bForm.reset();
                } else {
                    alert('Hubo un problema al enviar tu solicitud.');
                }
            } catch (error) {
                console.error('Error de red en B2B:', error);
                alert('No se pudo enviar tu solicitud por un error de red.');
            } finally {
                setButtonLoadingState(submitButton, false);
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            setButtonLoadingState(submitButton, true);

            const webhookURL = 'https://muna.auto.hostybee.com/webhook/solicitud-contacto';
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                message: contactForm.querySelector('#message').value
            };
    
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString(),
                });
                if (response.ok) {
                    showConfirmationMessage('¡Gracias! Tu mensaje ha sido enviado.');
                    contactForm.reset();
                } else {
                    alert('Hubo un problema al procesar tu mensaje en el servidor.');
                }
            } catch (error) {
                console.error('Error de red en contacto:', error);
                alert('No se pudo enviar el mensaje por un error de red.');
            } finally {
                setButtonLoadingState(submitButton, false);
            }
        });
    }

    // Manejo de emociones
    emotionButtons.forEach(button => {
        button.addEventListener('click', async () => { 
            emotionButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
    
            // Se usa el atributo 'value' si existe, si no, se usa 'data-emotion' como respaldo.
            const selectedEmotion = button.value || button.dataset.emotion; 
            const feeling = button.dataset.feeling;
            
            // Lógica de "Grabar": Guardamos la emoción para más tarde
            emotionToSendMessage = selectedEmotion;
    
            const webhookURL = 'https://muna.auto.hostybee.com/webhook/registrar-emocion';
            const emotionData = { email: loggedInUserEmail, emotion: selectedEmotion };
    
            showConfirmationMessage(`Gracias por compartir que te sientes ${feeling}.`);
    
            // Abrimos el chat inmediatamente
            openChatbot();
    
            // Enviamos el registro de la emoción al servidor en segundo plano
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
    if (viewAllFaqsBtn) {
        viewAllFaqsBtn.addEventListener('click', () => {
            mainContent.classList.add('hidden');
            siteFooterMain.classList.add('hidden');
            faqPage.classList.remove('hidden');
            window.scrollTo(0, 0);
        });
    }
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMainSiteView();
        });
    }
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = document.getElementById(button.getAttribute('aria-controls'));
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
            button.classList.toggle('active');
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '0 1.5rem 1.5rem 1.5rem';
            } else {
                answer.style.maxHeight = null;
                answer.style.padding = '0 1.5rem';
            }
        });
    });

    // Búsqueda del blog
    const searchInput = document.getElementById('blog-search-input');
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const articles = document.querySelectorAll('.blog-article-card');
    const noResultsMessage = document.getElementById('no-results-message');
    let currentCategory = 'todos';

    function filterAndSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let articlesFound = false;

        articles.forEach(article => {
            const categoryMatch = currentCategory === 'todos' || article.dataset.category === currentCategory;
            const searchMatch = searchTerm === '' || 
                                article.dataset.keywords.toLowerCase().includes(searchTerm) ||
                                article.querySelector('h3').textContent.toLowerCase().includes(searchTerm);

            if (categoryMatch && searchMatch) {
                article.style.display = 'flex';
                articlesFound = true;
            } else {
                article.style.display = 'none';
            }
        });
        
        noResultsMessage.style.display = articlesFound ? 'none' : 'block';
    }

    if (searchInput) searchInput.addEventListener('input', filterAndSearch);
    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentCategory = button.dataset.category;
                filterAndSearch();
            });
        });
    }
});
