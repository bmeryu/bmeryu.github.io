// ===================================================================
// --- 1. DEFINICIONES DE FUNCIONES AUXILIARES (SCOPE GLOBAL) ---
// ===================================================================

/**
 * Muestra un mensaje de confirmación efímero en la pantalla.
 * @param {string} message - El mensaje a mostrar.
 */
const showConfirmationMessage = (message) => {
    const messageEl = document.getElementById('emotion-confirmation-message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.add('show');
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    }
};

/**
 * Cierra todos los modales activos y abre el especificado.
 * @param {HTMLElement} modal - El modal que se va a abrir.
 */
const openModal = (modal) => {
    if (!modal) return;
    document.querySelectorAll('.modal-overlay.active').forEach(activeModal => {
        activeModal.classList.remove('active');
    });
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

/**
 * Cierra un modal específico.
 * @param {HTMLElement} modal - El modal que se va a cerrar.
 */
const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    if (!document.querySelector('.modal-overlay.active')) {
        document.body.style.overflow = '';
    }
};


// ===================================================================
// --- 2. ACCIONES Y EVENT LISTENERS (CUANDO EL DOM ESTÁ LISTO) ---
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    const switchModalButtons = document.querySelectorAll('.switch-modal-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // Formularios
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const b2bForm = document.getElementById('b2b-form');
    const contactForm = document.getElementById('contact-form');
    
    // Chatbot
    const chatbotFloater = document.getElementById('chatbot-floater');
    const chatbotHeader = document.getElementById('chatbot-header');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');


    // --- ASIGNACIÓN DE EVENTOS ---

    // Menú Móvil
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Lógica del Chatbot
    if (chatbotFloater && chatbotHeader) {
        chatbotHeader.addEventListener('click', (e) => {
            // Previene que el toggle se active si se hace clic en un botón dentro del header
            if (e.target.closest('button')) return;
            chatbotFloater.classList.toggle('is-minimized');
        });
    }
    if (chatbotToggleBtn) {
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotFloater.classList.toggle('is-minimized');
        });
    }

    // Lógica de Modales
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById(button.dataset.modalTarget);
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
            const targetModal = document.getElementById(button.dataset.modalTarget);
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


    // Lógica del Formulario de Contacto
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/solicitud-contacto';
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                message: contactForm.querySelector('#message').value
            };

            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showConfirmationMessage('¡Gracias! Tu mensaje ha sido enviado.');
                    contactForm.reset();
                } else {
                    const errorText = await response.text();
                    alert('Hubo un problema al enviar tu mensaje. ' + errorText);
                }
            } catch (error) {
                alert('No se pudo enviar el mensaje por un error de red.');
            }
        });
    }
    
    // Aquí puedes añadir la lógica para los otros formularios (login, register, b2b) si es necesario,
    // siguiendo el mismo patrón que el contactForm.
    // Por ejemplo, para el formulario B2B:
    if (b2bForm) {
        b2bForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const institutionName = b2bForm.querySelector('#b2b-institution').value;
            const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/solicitud-b2b';
            const formData = {
                name: b2bForm.querySelector('#b2b-name').value,
                email: b2bForm.querySelector('#b2b-email').value,
                institution: institutionName,
                role: b2bForm.querySelector('#b2b-role').value,
                families: b2bForm.querySelector('#b2b-families').value
            };
            
            try {
                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if(response.ok) {
                    closeModal(b2bForm.closest('.modal-overlay'));
                    showConfirmationMessage(`¡Gracias! El kit para ${institutionName} se ha enviado a tu correo.`);
                } else {
                    alert('Hubo un problema al enviar tu solicitud.');
                }
            } catch(error) {
                alert('No se pudo enviar tu solicitud por un error de red.');
            }
        });
    }

    // Y así sucesivamente con los demás...

});
