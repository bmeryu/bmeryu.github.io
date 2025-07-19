// El script se ejecuta solo cuando el DOM se ha cargado completamente.
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN CENTRALIZADA DE WEBHOOKS ---
    // Gestiona todas tus URLs de n8n desde un solo lugar.
    const N8N_WEBHOOKS = {
        login: 'https://muna.auto.hostybee.com/webhook/login',
        register: 'https://muna.auto.hostybee.com/webhook/registro',
        updateProfile: 'https://muna.auto.hostybee.com/webhook/actualizar-perfil',
        b2bRequest: 'https://muna.auto.hostybee.com/webhook/solicitud-b2b',
        contactRequest: 'https://muna.auto.hostybee.com/webhook/solicitud-contacto',
        logEmotion: 'https://muna.auto.hostybee.com/webhook/registrar-emocion'
    };

    // --- VARIABLES GLOBALES Y ESTADO ---
    let loggedInUserEmail = '';
    let emotionToSendMessage = null; // Variable para "grabar" la emoción para el chat

    // --- FUNCIONES AUXILIARES ---

    /**
     * Muestra un mensaje de confirmación temporal en la pantalla.
     * @param {string} message - El mensaje a mostrar.
     * @param {boolean} isError - Si el mensaje es de error.
     */
    const showEphemeralMessage = (message, isError = false) => {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.className = 'ephemeral-message';
        if (isError) {
            messageEl.style.backgroundColor = '#EF4444'; // Un color rojo para errores
        }
        document.body.appendChild(messageEl);
        setTimeout(() => messageEl.classList.add('show'), 10);
        setTimeout(() => {
            messageEl.classList.remove('show');
            messageEl.addEventListener('transitionend', () => messageEl.remove());
        }, 4000);
    };

    /**
     * Controla el estado de carga de un botón, mostrando un spinner.
     * @param {HTMLElement} button - El botón a modificar.
     * @param {boolean} isLoading - Si está en estado de carga.
     * @param {string} loadingText - El texto a mostrar durante la carga.
     */
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

    /**
     * Función centralizada para enviar eventos de seguimiento a n8n.
     * @param {string} eventName - El nombre del evento (debe coincidir con una clave en N8N_WEBHOOKS).
     * @param {object} data - Los datos a enviar en el cuerpo de la solicitud.
     * @returns {Promise<object|null>} - El resultado de la operación.
     */
    const trackEvent = async (eventName, data) => {
        const webhookURL = N8N_WEBHOOKS[eventName];
        if (!webhookURL) {
            console.error(`Webhook para el evento "${eventName}" no encontrado.`);
            return { success: false, error: `Configuración de webhook faltante para ${eventName}.` };
        }

        // Enriquece los datos con información común para un mejor seguimiento.
        const eventData = {
            ...data,
            event_name: eventName,
            timestamp_utc: new Date().toISOString(),
            user_email: loggedInUserEmail || 'anonymous',
            page_url: window.location.href,
            user_agent: navigator.userAgent
        };

        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            // Intenta leer la respuesta como JSON, pero si falla, maneja el error grácilmente.
            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                // Esto sucede si n8n devuelve un error que no es JSON (ej. un 400 Bad Request con texto plano)
                console.error('La respuesta del servidor no es un JSON válido:', await response.text());
                result = { message: 'El servidor respondió con un formato inesperado.' };
            }

            if (!response.ok) {
                console.error(`Error al enviar el evento "${eventName}" a n8n:`, result);
                return { success: false, error: result.message || `Error del servidor (HTTP ${response.status})` };
            }
            
            return { success: true, data: result };

        } catch (error) {
            console.error(`Error de red al enviar el evento "${eventName}":`, error);
            return { success: false, error: 'Error de red o el servidor no está accesible.' };
        }
    };

    /**
     * Valida si un string tiene formato de email.
     * @param {string} email - El email a validar.
     * @returns {boolean} - True si es válido, false si no.
     */
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
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
    const contactForm = document.getElementById('contact-form');
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
    const skipOnboardingBtn = document.getElementById('skip-onboarding-btn');

    // --- LÓGICA DE VISUALIZACIÓN Y NAVEGACIÓN ---
    const showDashboard = (username, isNewUser) => {
        siteHeader.classList.add('hidden');
        mainContent.classList.add('hidden');
        siteFooterMain.classList.add('hidden');
        faqPage.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        userDashboard.classList.add('flex');
        dashboardUsername.textContent = username || 'usuario';

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

        closeModal(document.getElementById('login-modal'));
        closeModal(document.getElementById('register-modal'));

        showDashboard(email.split('@')[0], isNewUser);
    };

    const updateUIForLogout = () => {
        loggedInUserEmail = '';
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
        showMainSiteView();
        showEphemeralMessage('Has cerrado sesión. ¡Esperamos verte pronto!');
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
        if (chatbotFloater) chatbotFloater.classList.remove('is-minimized');

        if (emotionToSendMessage && chatbotIframe && chatbotIframe.contentWindow) {
            setTimeout(() => {
                const message = {
                    type: 'startConversation',
                    emotion: emotionToSendMessage,
                    focus: true
                };
                chatbotIframe.contentWindow.postMessage(message, '*');
                emotionToSendMessage = null; // Limpiar después de enviar
            }, 500);
        }
    };

    // --- MANEJO DE EVENTOS ---

    if (mobileMenuButton) mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    document.querySelectorAll('.open-modal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById(button.dataset.modalTarget);
            openModal(modal);
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
            setTimeout(() => openModal(targetModal), 300);
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

    // --- GESTIÓN DE FORMULARIOS ---

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorMessage = document.getElementById('login-error-message');
            const submitButton = loginForm.querySelector('button[type="submit"]');

            // Validación del lado del cliente
            if (!isValidEmail(email)) {
                errorMessage.textContent = 'Por favor, ingresa un correo electrónico válido.';
                errorMessage.classList.remove('hidden');
                return;
            }

            setButtonLoadingState(submitButton, true, "Iniciando sesión...");
            errorMessage.classList.add('hidden');

            const result = await trackEvent('login', { email, password });

            setButtonLoadingState(submitButton, false);

            if (result.success) {
                updateUIForLogin(email, false); // Asumimos que un login es de un usuario existente
            } else {
                errorMessage.textContent = result.error || 'Email o contraseña incorrectos.';
                errorMessage.classList.remove('hidden');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const submitButton = registerForm.querySelector('button[type="submit"]');

            // --- MEJORA: Validación del lado del cliente ---
            if (!isValidEmail(email)) {
                showEphemeralMessage('Por favor, ingresa un correo electrónico válido.', true);
                return; // Detiene la ejecución si el email no es válido
            }

            setButtonLoadingState(submitButton, true, "Creando cuenta...");

            const result = await trackEvent('register', { email, password });

            setButtonLoadingState(submitButton, false);

            if (result.success) {
                updateUIForLogin(email, true); // El registro es siempre de un nuevo usuario
            } else {
                showEphemeralMessage(result.error || 'No se pudo completar el registro.', true);
            }
        });
    }

    if (onboardingForm) {
        onboardingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = onboardingForm.querySelector('button[type="submit"]');
            setButtonLoadingState(submitButton, true, "Guardando...");

            const caregiverName = document.getElementById('caregiver-name').value;
            const profileData = {
                email: loggedInUserEmail,
                caregiverName: caregiverName,
                childName: document.getElementById('child-name').value,
                childAge: document.getElementById('child-age').value,
                interests: Array.from(document.querySelectorAll('input[name="interest-topic"]:checked')).map(cb => cb.value)
            };

            const result = await trackEvent('updateProfile', profileData);

            setButtonLoadingState(submitButton, false);

            if (result.success) {
                closeModal(onboardingForm.closest('.modal-overlay'));
                showDashboard(caregiverName || loggedInUserEmail.split('@')[0], false);
                showEphemeralMessage('¡Tu perfil ha sido actualizado!');
            } else {
                showEphemeralMessage(result.error || 'No se pudo actualizar tu perfil.', true);
            }
        });
    }
    
    if (skipOnboardingBtn) {
        skipOnboardingBtn.addEventListener('click', () => {
            closeModal(document.getElementById('onboarding-modal'));
            showDashboard(loggedInUserEmail.split('@')[0], false);
        });
    }

    if (b2bForm) {
        b2bForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = b2bForm.querySelector('button[type="submit"]');
            setButtonLoadingState(submitButton, true);

            const formData = {
                name: document.getElementById('b2b-name').value,
                email: document.getElementById('b2b-email').value,
                institution: document.getElementById('b2b-institution').value,
                role: document.getElementById('b2b-role').value,
                families: document.getElementById('b2b-families').value
            };

            const result = await trackEvent('b2bRequest', formData);
            
            setButtonLoadingState(submitButton, false);

            if (result.success) {
                closeModal(b2bForm.closest('.modal-overlay'));
                showEphemeralMessage(`¡Gracias! El kit para ${formData.institution} se ha enviado a tu correo.`);
                b2bForm.reset();
            } else {
                showEphemeralMessage(result.error || 'Hubo un problema al enviar tu solicitud.', true);
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            setButtonLoadingState(submitButton, true);

            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                message: contactForm.querySelector('#message').value
            };

            const result = await trackEvent('contactRequest', formData);

            setButtonLoadingState(submitButton, false);

            if (result.success) {
                showEphemeralMessage('¡Gracias! Tu mensaje ha sido enviado.');
                contactForm.reset();
            } else {
                showEphemeralMessage(result.error || 'No se pudo enviar el mensaje.', true);
            }
        });
    }

    emotionButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const selectedEmotion = button.dataset.emotion;
            const feeling = button.dataset.feeling;
            
            emotionToSendMessage = selectedEmotion;

            showEphemeralMessage(`Gracias por compartir que te sientes ${feeling}.`);
            openChatbot();

            const emotionData = {
                emotion: selectedEmotion,
                email: loggedInUserEmail 
            };

            const result = await trackEvent('logEmotion', emotionData);
            
            if (!result.success) {
                console.error('Fallo al registrar la emoción en n8n:', result.error);
            }
        });
    });

    // --- NAVEGACIÓN Y OTROS ---
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

    // --- BÚSQUEDA DEL BLOG ---
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
