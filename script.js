// ===================================================================
// --- 1. DEFINICIONES DE FUNCIONES AUXILIARES (SCOPE GLOBAL) ---
// ===================================================================

/**
 * Muestra un mensaje de confirmación efímero en la pantalla.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - El tipo de mensaje ('success' o 'error'). Por defecto es 'success'.
 */
const showConfirmationMessage = (message, type = 'success') => {
    const container = document.getElementById('notification-container');
    if (!container) {
        alert(message); // Fallback si el contenedor no existe
        return;
    }
    container.style.backgroundColor = (type === 'success') ? '#6AB09B' : '#E74266';
    container.textContent = message;
    container.classList.add('show');
    setTimeout(() => {
        container.classList.remove('show');
    }, 3500);
};

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


// ===================================================================
// --- 2. ACCIONES Y EVENT LISTENERS (CUANDO EL DOM ESTÁ LISTO) ---
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE TODOS LOS ELEMENTOS ---
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
    // ... y otros si los hubiera.

    // Chatbot (según tu último HTML)
    const chatbotFloater = document.getElementById('chatbot-floater');
    const chatbotBubble = document.getElementById('chatbot-bubble');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');

    // --- ASIGNACIÓN DE TODOS LOS EVENTOS ---

    // Menú Móvil
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Chatbot Floater (Lógica restaurada para tu HTML actual)
    if (chatbotBubble) {
        chatbotBubble.addEventListener('click', () => {
            if(chatbotFloater) chatbotFloater.classList.remove('is-minimized');
        });
    }
    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', () => {
            if(chatbotFloater) chatbotFloater.classList.add('is-minimized');
        });
    }

    // Lógica de Modales (Restaurada)
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

    // Lógica para todos tus formularios...
    // ... (Login, Registro, B2B, etc., que ya tenías y funcionaban)

    // Lógica del Formulario de Contacto (CON LA CORRECCIÓN DE CORS)
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const webhookURL = 'https://muna.auto.hostybee.com/webhook-test/solicitud-contacto';
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
                    const errorText = await response.text();
                    alert('Hubo un problema al procesar tu mensaje en el servidor.');
                    console.error('Error del servidor:', response.status, errorText);
                }
            } catch (error) {
                alert('No se pudo enviar el mensaje por un error de red.');
                console.error('Error de red:', error);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    }
});
