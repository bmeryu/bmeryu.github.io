// This script runs after the DOM has been fully loaded.
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
