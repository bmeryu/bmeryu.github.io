// El script se ejecuta solo cuando el DOM se ha cargado completamente.
document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONES AUXILIARES ---
    /**
     * Muestra un mensaje de confirmación global y efímero en la pantalla.
     * @param {string} message - El mensaje a mostrar.
     */
    const showConfirmationMessage = (message) => {
        // 1. Crear el elemento del mensaje
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        // Usaremos una clase CSS para darle estilo
        messageEl.className = 'ephemeral-message';

        // 2. Añadir el mensaje al cuerpo (body) de la página
        document.body.appendChild(messageEl);

        // 3. Forzar un pequeño delay para que la animación CSS funcione
        // y luego añadir la clase 'show' para hacerlo visible.
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 10);

        // 4. Ocultar y eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            messageEl.classList.remove('show');
            // Esperar a que la animación de salida termine para eliminar el elemento del DOM
            messageEl.addEventListener('transitionend', () => {
                messageEl.remove();
            });
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

    // --- FUNCIONALIDAD DE MODALES (VENTANAS EMERGENTES) ---
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const switchModalButtons = document.querySelectorAll('.switch-modal-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    const openModal = (modal) => {
        if (!modal) return;
        // Cierra cualquier otro modal activo
        document.querySelectorAll('.modal-overlay.active').forEach(activeModal => closeModal(activeModal));
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        if (!document.querySelector('.modal-overlay.active')) {
            document.body.style.overflow = ''; // Restaura el scroll
        }
    };

    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    switchModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentModal = button.closest('.modal-overlay');
            const targetModalId = button.dataset.modalTarget;
            const targetModal = document.getElementById(targetModalId);
            closeModal(currentModal);
            setTimeout(() => openModal(targetModal), 300); // Pequeño delay para la animación
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // --- LÓGICA DE LOGIN, REGISTRO Y DASHBOARD DE USUARIO ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const onboardingForm = document.getElementById('onboarding-form');
    const b2bForm = document.getElementById('b2b-form');
    const paymentForm = document.getElementById('payment-form');
    const contactForm = document.getElementById('contact-form');
    const userDashboard = document.getElementById('user-dashboard');
    const dashboardUsername = document.getElementById('dashboard-username');
    
    // --- INICIO DE CAMBIOS: SELECCIÓN DE NUEVOS ELEMENTOS ---
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    const emotionSelectorContainer = document.getElementById('emotion-selector-container');
    const postEmotionView = document.getElementById('post-emotion-view');
    const emotionAckMessage = document.getElementById('emotion-ack-message');
    const startChatBtn = document.getElementById('start-chat-btn');
    const changeEmotionBtn = document.getElementById('change-emotion-btn');
    // --- FIN DE CAMBIOS ---
    
    // Elementos del Dropdown de Perfil
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const profileEmail = document.getElementById('profile-email');
    const logoutButton = document.getElementById('logout-button');
    
    let loggedInUserEmail = ''; // Almacena el email del usuario logueado

    const showDashboard = (username, isNewUser) => {
        siteHeader.classList.add('hidden');
        mainContent.classList.add('hidden');
        siteFooterMain.classList.add('hidden');
        faqPage.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        userDashboard.classList.add('flex');
        dashboardUsername.textContent = username || 'usuario';

        // --- INICIO DE CAMBIOS: Asegurar que la vista correcta se muestra al entrar al dashboard ---
        postEmotionView.classList.add('hidden');
        emotionSelectorContainer.classList.remove('hidden');
        emotionButtons.forEach(btn => btn.classList.remove('selected'));
        // --- FIN DE CAMBIOS ---

        if (isNewUser) {
            setTimeout(() => {
                openModal(document.getElementById('onboarding-modal'));
            }, 500);
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

    // --- MANEJADORES DE ENVÍO DE FORMULARIOS (SIMULACIÓN CON WEBHOOKS) ---

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorMessage = document.getElementById('login-error-message');
            const webhookURL = 'https://muna.auto.hostybee.com/webhook/login';

            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const result = await response.json();
                if (response.ok) {
                    errorMessage.classList.add('hidden');
                    closeModal(document.getElementById('login-modal'));
                    updateUIForLogin(email, false);
                } else {
                    errorMessage.textContent = result.error || 'Email o contraseña incorrectos.';
                    errorMessage.classList.remove('hidden');
                }
            } catch (error) {
                console.error('Error de conexión en login:', error);
                errorMessage.textContent = 'No se pudo conectar con el servidor.';
                errorMessage.classList.remove('hidden');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
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
                    closeModal(document.getElementById('register-modal'));
                    updateUIForLogin(email, true);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error de red en registro:', error);
                alert('No se pudo completar el registro por un error de red.');
            }
        });
    }

    if (onboardingForm) {
        onboardingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const webhookURL = 'https://muna.auto.hostybee.com/webhook/actualizar-perfil';
            const formData = {
                email: loggedInUserEmail,
                nombre: document.getElementById('caregiver-name').value,
                nombre_niño: document.getElementById('child-name').value,
                edad_niño: document.getElementById('child-age').value,
                intereses: Array.from(document.querySelectorAll('input[name="interest-topic"]:checked')).map(cb => cb.value)
            };
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (response.ok) {
                    closeModal(document.getElementById('onboarding-modal'));
                    showConfirmationMessage("¡Gracias por completar tu perfil!");
                } else {
                    alert('Hubo un problema al guardar tu perfil.');
                }
            } catch (error) {
                console.error('Error de red en onboarding:', error);
                alert('No se pudo guardar tu perfil por un error de red.');
            }
        });
    }
    
    if (b2bForm) {
        b2bForm.addEventListener('submit', async (e) => {
            e.preventDefault();
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
                    closeModal(document.getElementById('b2b-modal'));
                    showConfirmationMessage(`¡Gracias! El kit para ${institutionName} se ha enviado a tu correo.`);
                } else {
                    alert('Hubo un problema al enviar tu solicitud.');
                }
            } catch (error) {
                console.error('Error de red en B2B:', error);
                alert('No se pudo enviar tu solicitud por un error de red.');
            }
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const planName = document.getElementById('payment-plan-name').textContent;
            closeModal(document.getElementById('payment-modal'));
            showConfirmationMessage(`¡Felicidades! Has mejorado al ${planName}.`);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const webhookURL = 'https://muna.auto.hostybee.com/webhook/solicitud-contacto';
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;
    
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Enviando...</span>';
    
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
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    }
    
    // --- LÓGICA DEL DROPDOWN DE PERFIL ---
    if (profileButton) {
        profileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            profileDropdown.classList.remove('active');
            updateUIForLogout();
        });
    }
    document.addEventListener('click', (e) => {
        if (profileDropdown && !profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
    
    // --- INICIO DE CAMBIOS: NUEVA LÓGICA DE EMOCIONES Y CHATBOT ---

    // --- LÓGICA DEL CHATBOT FLOTANTE ---
    const chatbotFloater = document.getElementById('chatbot-floater');
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');

    const openChatbot = () => {
        if (chatbotFloater) {
            chatbotFloater.classList.remove('is-minimized');
        }
    };

    if (chatbotBubble) {
        chatbotBubble.addEventListener('click', openChatbot);
    }
    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', () => chatbotFloater.classList.add('is-minimized'));
    }

    // --- MANEJO DE EMOCIONES ---
    emotionButtons.forEach(button => {
        button.addEventListener('click', async () => { 
            emotionButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            const selectedEmotion = button.dataset.emotion; 
            const feeling = button.dataset.feeling;
            
            // LÓGICA PARA ACTUALIZAR EL CHATBOT
            if (chatbotIframe) {
                const baseUrl = 'https://muna.auto.hostybee.com/webhook/9bedfe60-a6f1-4592-8d6f-51e7e309affc/chat';
                // Se codifica la emoción para que sea segura en una URL y se añade como parámetro.
                const newUrl = `${baseUrl}?startEmotion=${encodeURIComponent(selectedEmotion)}`;
                chatbotIframe.src = newUrl;
            }

            const webhookURL = 'https://muna.auto.hostybee.com/webhook/registrar-emocion';
            const emotionData = { email: loggedInUserEmail, emotion: selectedEmotion };

            // 1. Transición de la UI
            emotionSelectorContainer.classList.add('hidden');
            emotionAckMessage.textContent = `Gracias por compartir que te sientes ${feeling}. Estoy aquí para ti. ¿Hablamos?`;
            postEmotionView.classList.remove('hidden');

            // 2. Asignar evento al botón para iniciar chat
            if (startChatBtn) {
                startChatBtn.onclick = openChatbot;
            }

            // 3. Enviar datos al webhook en segundo plano
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emotionData)
                });
                if (!response.ok) {
                    console.warn('Hubo un problema al registrar tu emoción.');
                }
            } catch (error) {
                console.error('Error de red al registrar emoción:', error);
            }
        });
    });

    // Lógica para el botón "Cambiar mi emoción"
    if (changeEmotionBtn) {
        changeEmotionBtn.addEventListener('click', () => {
            postEmotionView.classList.add('hidden');
            emotionSelectorContainer.classList.remove('hidden');
            emotionButtons.forEach(btn => btn.classList.remove('selected'));
        });
    }

    // --- FIN DE CAMBIOS ---


    // --- NAVEGACIÓN A PÁGINA DE FAQ ---
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

    // --- ACORDEÓN DE FAQ ---
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

    // --- BÚSQUEDA Y FILTRO DEL BLOG ---
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

    if (searchInput) {
        searchInput.addEventListener('input', filterAndSearch);
    }
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
