// --- FUNCIONES AUXILIARES ---

/**
 * Muestra un mensaje de confirmación efímero en la pantalla.
 * @param {string} message - El mensaje a mostrar.
 */
const showConfirmationMessage = (message) => {// --- FUNCIONES AUXILIARES ---

/**
 * Muestra un mensaje de confirmación efímero en la pantalla.
 * @param {string} message - El mensaje a mostrar.
 */
const showConfirmationMessage = (message) => {
    // Busca el elemento en el HTML para mostrar el mensaje bonito.
    const messageEl = document.getElementById('emotion-confirmation-message');
    
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.add('show');
        // Ocultar el mensaje después de 3 segundos.
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    } else {
        // Si por alguna razón no encuentra el elemento, usa un alert como respaldo.
        alert(message);
    }
};// This script runs after the DOM has been fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainContent = document.getElementById('main-content');
    const faqPage = document.getElementById('faq-page');
    const siteHeader = document.getElementById('site-header');
    const siteFooterMain = document.getElementById('site-footer-main');
    const viewAllFaqsBtn = document.getElementById('view-all-faqs-btn');
    const backToMainBtn = document.getElementById('back-to-main-btn');

    // --- Mobile Menu Toggle ---
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Generic Modal Functionality ---
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const switchModalButtons = document.querySelectorAll('.switch-modal-btn');

    /**
     * Opens a modal and hides any other active modals.
     * @param {HTMLElement} modal - The modal element to open.
     */
    const openModal = (modal) => {
        if (modal == null) return;
        // Close any currently active modals before opening a new one.
        document.querySelectorAll('.modal-overlay.active').forEach(activeModal => closeModal(activeModal));
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    /**
     * Closes a modal.
     * @param {HTMLElement} modal - The modal element to close.
     */
    const closeModal = (modal) => {
        if (modal == null) return;
        modal.classList.remove('active');
        // Restore background scrolling if no modals are active.
        if (!document.querySelector('.modal-overlay.active')) {
            document.body.style.overflow = '';
        }
    };

    /**
 * Muestra un mensaje de confirmación efímero en la pantalla.
 * @param {string} message - El mensaje a mostrar.
 */
const showConfirmationMessage = (message) => {
    const emotionConfirmationMessage = document.getElementById('emotion-confirmation-message');
    if (emotionConfirmationMessage) {
        emotionConfirmationMessage.textContent = message;
        emotionConfirmationMessage.classList.add('show');
        // Ocultar el mensaje después de 3 segundos.
        setTimeout(() => {
            emotionConfirmationMessage.classList.remove('show');
        }, 3000); 
    }
};
    // Add event listeners for opening modals.
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const modalId = button.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });

    // Add event listeners for closing modals via buttons.
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });
    
    // Add event listeners for switching between modals (e.g., from login to register).
     switchModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentModal = button.closest('.modal-overlay');
            const targetModalId = button.dataset.modalTarget;
            const targetModal = document.getElementById(targetModalId);
            closeModal(currentModal);
            // Use a timeout to allow the close animation to finish before opening the new modal.
            setTimeout(() => openModal(targetModal), 300);
        });
    });

    // Add event listeners for closing modals by clicking on the overlay.
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });
    
    // --- User Dashboard and Login/Registration Logic ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const onboardingForm = document.getElementById('onboarding-form');
    const b2bForm = document.getElementById('b2b-form');
    const paymentForm = document.getElementById('payment-form');
    const userDashboard = document.getElementById('user-dashboard');
    const dashboardUsername = document.getElementById('dashboard-username');
    const emotionButtons = document.querySelectorAll('.emotion-btn');
    const emotionConfirmationMessage = document.getElementById('emotion-confirmation-message');
    const emotionSelectorContainer = document.getElementById('emotion-selector-container');
    
    // Profile Dropdown elements
    const profileButton = document.getElementById('profile-button');
    const profileDropdown = document.getElementById('profile-dropdown');
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const profileEmail = document.getElementById('profile-email');
    const logoutButton = document.getElementById('logout-button');
    
    let loggedInUserEmail = ''; // Store the logged-in user's email.
  // --- Chatbot Floater Logic ---
const chatbotFloater = document.getElementById('chatbot-floater');
const chatbotBubble = document.getElementById('chatbot-bubble');
const chatbotCloseBtn = document.getElementById('chatbot-close-btn');

if (chatbotBubble) {
    chatbotBubble.addEventListener('click', () => {
        chatbotFloater.classList.remove('is-minimized');
    });
}

if (chatbotCloseBtn) {
    chatbotCloseBtn.addEventListener('click', () => {
        chatbotFloater.classList.add('is-minimized');
    });
}

    /**
     * Shows the user dashboard view and hides the main site.
     * @param {string} username - The username to display on the dashboard.
     * @param {boolean} isNewUser - Flag to determine if the onboarding modal should be shown.
     */
    const showDashboard = (username, isNewUser) => {
        siteHeader.classList.add('hidden');
        mainContent.classList.add('hidden');
        siteFooterMain.classList.add('hidden');
        faqPage.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        userDashboard.classList.add('flex');
        dashboardUsername.textContent = username || 'usuario'; 

        // Reset dashboard view to its initial state.
        emotionSelectorContainer.classList.remove('hidden');
        emotionButtons.forEach(btn => btn.classList.remove('selected'));

        // If it's a new user, show the onboarding modal after a short delay.
        if(isNewUser) {
            setTimeout(() => {
               openModal(document.getElementById('onboarding-modal'));
            }, 500);
        }
    };

    /**
     * Shows the main marketing site view and hides the dashboard.
     */
    const showMainSiteView = () => {
        siteHeader.classList.remove('hidden');
        mainContent.classList.remove('hidden');
        siteFooterMain.classList.remove('hidden');
        userDashboard.classList.add('hidden');
        userDashboard.classList.remove('flex');
        faqPage.classList.add('hidden'); 
    };
    
    /**
     * Updates the UI to reflect a logged-in state.
     * @param {string} email - The user's email.
     * @param {boolean} isNewUser - Flag to determine if it's a fresh registration.
     */
    const updateUIForLogin = (email, isNewUser) => {
        loggedInUserEmail = email;
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
        profileEmail.textContent = email;
        showDashboard(email.split('@')[0], isNewUser);
    };

    /**
     * Updates the UI to reflect a logged-out state.
     */
    const updateUIForLogout = () => {
        loggedInUserEmail = '';
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
        showMainSiteView();
        showConfirmationMessage('Has cerrado sesión. ¡Esperamos verte pronto!');
    };
    
    // --- Form Submission Handlers (Simulation) ---

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => { // Hacemos la función async
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorMessage = document.getElementById('login-error-message');
            
            // 1. Define la URL de tu Webhook de LOGIN.
            // !!! REEMPLAZA ESTA URL POR LA TUYA (la de producción, con el path /login) !!!
            const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/login';

            const formData = {
                email: email,
                password: password
            };

            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                // 2. Analizar la respuesta que nos envía n8n
                const result = await response.json(); 

                if (response.ok) {
                    // ÉXITO: n8n dijo que el login es correcto.
                    errorMessage.classList.add('hidden');
                    closeModal(document.getElementById('login-modal'));
                    updateUIForLogin(email, false); // Actualiza la UI para el usuario logueado.
                } else {
                    // ERROR: n8n devolvió un error (ej: usuario no encontrado, pass incorrecta).
                    errorMessage.textContent = result.error || 'Email o contraseña incorrectos.';
                    errorMessage.classList.remove('hidden');
                }
            } catch (error) {
                // ERROR DE RED: No se pudo conectar con n8n.
                console.error('Failed to connect to login webhook:', error);
                errorMessage.textContent = 'No se pudo conectar con el servidor. Revisa tu conexión.';
                errorMessage.classList.remove('hidden');
            }
        });
    }
    
    if (registerForm) {
        // Handle registration form submission with webhook integration.
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            // ** WEBHOOK INTEGRATION **
            // Replace this with your actual webhook URL.
            const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/registro'; 
            
            const formData = {
                email: email,
                password: password, // Note: Sending passwords should be done securely (e.g., over HTTPS).
                registeredAt: new Date().toISOString()
            };

            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    console.log('Registration data sent to webhook successfully.');
                    // Proceed with the original success logic only if the webhook call succeeds.
                    closeModal(document.getElementById('register-modal'));
                    updateUIForLogin(email, true); // This is a new user
                } else {
                    // Handle cases where the webhook returns an error.
                    console.error('Webhook returned an error:', response.status, response.statusText);
                    alert('Hubo un problema con el registro. Por favor, inténtalo de nuevo.');
                }
            } catch (error) {
                // Handle network errors or other issues with the fetch call.
                console.error('Failed to send registration data to webhook:', error);
                alert('No se pudo completar el registro debido a un error de red. Por favor, revisa tu conexión.');
            }
        });
    }
    
    if (b2bForm) {
    // Convertimos la función a 'async'
    b2bForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Recolectar todos los datos del formulario.
        const institutionName = document.getElementById('b2b-institution').value;
        const formData = {
            name: document.getElementById('b2b-name').value,
            email: document.getElementById('b2b-email').value,
            institution: institutionName,
            role: document.getElementById('b2b-role').value,
            families: document.getElementById('b2b-families').value
        };

        // 2. Definir la URL de tu webhook B2B.
        // !!! REEMPLAZA ESTA URL POR LA DE PRODUCCIÓN DE TU NUEVO FLUJO !!!
        const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/solicitud-b2b';

        // 3. Enviar los datos al webhook.
        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Si todo sale bien, cerramos el modal y mostramos el mensaje de éxito.
                console.log('B2B form data sent successfully.');
                closeModal(document.getElementById('b2b-modal'));
                showConfirmationMessage(`¡Gracias! El kit para ${institutionName} se ha enviado a tu correo.`);
            } else {
                // Si n8n devuelve un error.
                console.error('B2B webhook returned an error:', response.status);
                alert('Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            // Si hay un error de red.
            console.error('Failed to send B2B form data:', error);
            alert('No se pudo enviar tu solicitud debido a un error de red.');
        }
    });
}
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const planName = document.getElementById('payment-plan-name').textContent;
            closeModal(document.getElementById('payment-modal'));
            showConfirmationMessage(`¡Felicidades! Has mejorado al ${planName}.`);
            // In a real app, you would redirect to a payment gateway like Mercado Pago here.
        });
    }

   if(onboardingForm) {
        onboardingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 1. Recolectar los nuevos datos del formulario.
            const caregiverName = document.getElementById('caregiver-name').value;
            const childName = document.getElementById('child-name').value;
            const childAge = document.getElementById('child-age').value;
            const selectedInterests = Array.from(document.querySelectorAll('input[name="interest-topic"]:checked')).map(checkbox => checkbox.value);

            // 2. Definir la URL de tu NUEVO webhook (el de actualización).
            // !!! REEMPLAZA ESTA URL POR LA TUYA !!!
            const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/actualizar-perfil'; 

            // 3. Preparar los datos para enviar. ¡Incluimos el email del usuario logueado!
            const formData = {
                email: loggedInUserEmail, // ¡MUY IMPORTANTE para saber a quién actualizar!
                nombre: caregiverName, 
                nombre_niño: childName,
                edad_niño: childAge,
                intereses: selectedInterests
            };

            // 4. Enviar los datos al webhook.
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    console.log('Profile update data sent successfully.');
                    // Si todo sale bien, cerramos el modal y mostramos la confirmación.
                    closeModal(document.getElementById('onboarding-modal'));
                    showConfirmationMessage("¡Gracias por completar tu perfil!");
                } else {
                    console.error('Webhook returned an error:', response.status);
                    alert('Hubo un problema al guardar tu perfil.');
                }
            } catch (error) {
                console.error('Failed to send profile data:', error);
                alert('No se pudo guardar tu perfil debido a un error de red.');
            }
        });
        }

   emotionButtons.forEach(button => {
    // Convertimos la función a 'async' para poder usar 'await'
    button.addEventListener('click', async () => { 
        emotionButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        
        const selectedEmotion = button.dataset.emotion; 
        
        // --- INICIO DE LA INTEGRACIÓN CON N8N ---

        // 1. Define la URL de tu NUEVO webhook.
        // !!! REEMPLAZA ESTA URL POR LA URL DE PRODUCCIÓN DE TU NUEVO FLUJO !!!
        const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/registrar-emocion';

        // 2. Prepara los datos para enviar.
        const emotionData = {
            email: loggedInUserEmail, // Usamos la variable que ya guarda el email del usuario.
            emotion: selectedEmotion
        };

        // 3. Envía los datos al webhook usando fetch.
        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emotionData)
            });

            if (response.ok) {
                // Si n8n responde 'OK', mostramos el mensaje de confirmación que ya tenías.
                console.log('Emotion data sent successfully.');
                showConfirmationMessage(`¡Emoción "${selectedEmotion}" registrada!`);
            } else {
                // Si n8n responde con un error.
                console.error('Webhook for emotion returned an error:', response.status);
                showConfirmationMessage('Hubo un problema al registrar tu emoción.');
            }

        } catch (error) {
            // Si hay un error de red y no se puede conectar con n8n.
            console.error('Failed to send emotion data:', error);
            showConfirmationMessage('Error de conexión al registrar tu emoción.');
        }

        // --- FIN DE LA INTEGRACIÓN CON N8N ---

        // El resto de tu lógica original se mantiene.
        if (chatbotIframe) {
            const personalizedUrl = `${genericChatbotUrl}?user=${encodeURIComponent(loggedInUserEmail)}&emotion=${encodeURIComponent(selectedEmotion)}`;
            chatbotIframe.src = personalizedUrl;
            console.log('Chatbot URL updated for personalization:', personalizedUrl);
        }

        if (chatbotFloater && chatbotFloater.classList.contains('is-minimized')) {
            chatbotFloater.classList.remove('is-minimized');
        }
        
        // Esta línea la puedes mantener o quitar según prefieras la experiencia.
        // showMainSiteView(); 
    });
});
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            profileDropdown.classList.remove('active');
            updateUIForLogout();
        });
    }

    // --- Profile Dropdown Logic ---
    if (profileButton) {
        profileButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from bubbling up to the document.
            profileDropdown.classList.toggle('active');
        });
    }

    // Close the dropdown if clicking outside of it.
    document.addEventListener('click', (e) => {
        if (profileDropdown && !profileDropdown.contains(e.target) && !profileButton.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });


    // --- FAQ Page Navigation ---
    if(viewAllFaqsBtn) {
        viewAllFaqsBtn.addEventListener('click', () => {
            mainContent.classList.add('hidden');
            siteFooterMain.classList.add('hidden');
            faqPage.classList.remove('hidden');
            window.scrollTo(0, 0); // Scroll to the top of the new page.
        });
    }

    if(backToMainBtn) {
        backToMainBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMainSiteView();
        });
    }


    // --- FAQ Accordion Logic ---
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = document.getElementById(button.getAttribute('aria-controls'));
            const isAlreadyActive = button.getAttribute('aria-expanded') === 'true';

            if (isAlreadyActive) {
                // Close the clicked accordion.
                button.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
                answer.style.padding = '0 1.5rem';
            } else {
                // Open the clicked accordion.
                button.setAttribute('aria-expanded', 'true');
                answer.style.padding = '0 1.5rem 1.5rem 1.5rem';
                // Set max-height to the scroll height to animate opening.
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- Blog Search and Filter Logic ---
    const searchInput = document.getElementById('blog-search-input');
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const articles = document.querySelectorAll('.blog-article-card');
    const noResultsMessage = document.getElementById('no-results-message');
    let currentCategory = 'todos';

    /**
     * Filters and searches blog articles based on the current category and search input.
     */
    function filterAndSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let articlesFound = false;

        articles.forEach(article => {
            const category = article.dataset.category;
            const keywords = article.dataset.keywords.toLowerCase();
            const title = article.querySelector('h3').textContent.toLowerCase();

            const categoryMatch = currentCategory === 'todos' || category === currentCategory;
            const searchMatch = searchTerm === '' || title.includes(searchTerm) || keywords.includes(searchTerm);

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

    if (filterButtons) {
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
// Pega este bloque corregido en tu script.js en lugar del anterior para 'contactForm'

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/solicitud-contacto';
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonHTML = submitButton.innerHTML;

        // Deshabilitamos el botón para prevenir envíos múltiples
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Enviando...</span>';

        const formData = {
            name: contactForm.querySelector('#name').value,
            email: contactForm.querySelector('#email').value,
            message: contactForm.querySelector('#message').value
        };

        try {
            // --- LA CORRECCIÓN CLAVE ESTÁ AQUÍ ---
            // Se cambia el tipo de contenido para evitar la petición de permiso CORS (preflight)
            // que está siendo bloqueada por el servidor de Hostybee.
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                showConfirmationMessage('¡Gracias! Tu mensaje ha sido enviado.');
                contactForm.reset();
            } else {
                const errorText = await response.text();
                console.error('Error del servidor:', response.status, errorText);
                alert('Hubo un problema al procesar tu mensaje en el servidor.');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo enviar el mensaje por un error de red.');
        } finally {
            // Volvemos a habilitar el botón al final
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        }
    });
}
