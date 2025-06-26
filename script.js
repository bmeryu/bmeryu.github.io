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
        messageEl.className = 'ephemeral-message';

        // 2. Añadir el mensaje al cuerpo (body) de la página
        document.body.appendChild(messageEl);

        // 3. Forzar un pequeño delay para que la animación CSS funcione
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

    // --- MENÚ MÓVIL ---
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- FUNCIONALIDAD DE MODALES (VENTANAS EMERGENTES) ---
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const switchModalButtons = document.querySelectorAll('.switch-modal-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

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
            setTimeout(() => openModal(targetModal), 300);
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
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const profileEmail = document.getElementById('profile-email');
    const logoutButton = document.getElementById('logout-button');
    
    let loggedInUserEmail = '';

    const showDashboard = (username, isNewUser) => {
        siteHeader.classList.add('hidden');
        mainContent.classList.add('hidden');
        siteFooterMain.classList.add('hidden');
        faqPage.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        userDashboard.classList.add('flex');
        dashboardUsername.textContent = username || 'usuario';

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
        if (profileEmail) profileEmail.textContent = email;
        showDashboard(email.split('@')[0], isNewUser);
    };

    const updateUIForLogout = () => {
        loggedInUserEmail = '';
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
        showMainSiteView();
        showConfirmationMessage('Has cerrado sesión. ¡Esperamos verte pronto!');
    };

    // --- MANEJADORES DE ENVÍO DE FORMULARIOS ---

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const errorMessage = document.getElementById('login-error-message');
            // Lógica de login...
            closeModal(document.getElementById('login-modal'));
            updateUIForLogin(email, false);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            // Lógica de registro...
            closeModal(document.getElementById('register-modal'));
            updateUIForLogin(email, true);
        });
    }

    if (onboardingForm) {
        onboardingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Lógica de onboarding...
            closeModal(document.getElementById('onboarding-modal'));
            showConfirmationMessage("¡Gracias por completar tu perfil!");
        });
    }
    
    if (b2bForm) {
        b2bForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const institutionName = document.getElementById('b2b-institution').value;
            // Lógica de B2B...
            closeModal(document.getElementById('b2b-modal'));
            showConfirmationMessage(`¡Gracias! El kit para ${institutionName} se ha enviado a tu correo.`);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Enviando...</span>';
            
            // Simulación de envío
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula espera de red
                showConfirmationMessage('¡Gracias! Tu mensaje ha sido enviado.');
                contactForm.reset();
            } catch (error) {
                alert('No se pudo enviar el mensaje.');
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

    // --- MANEJO DE EMOCIONES (CHATBOT) ---
    emotionButtons.forEach(button => {
        button.addEventListener('click', async () => { 
            emotionButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            const selectedEmotion = button.dataset.emotion;
            
            showConfirmationMessage(`Emoción "${selectedEmotion}" registrada.`);
            
            const chatbotFloater = document.getElementById('chatbot-floater');
            if (chatbotFloater && chatbotFloater.classList.contains('is-minimized')) {
                chatbotFloater.classList.remove('is-minimized');
            }
        });
    });

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
            } else {
                answer.style.maxHeight = null;
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
        if (!searchInput) return;
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
        
        if(noResultsMessage) noResultsMessage.style.display = articlesFound ? 'none' : 'block';
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
