/**
 * Portfolio Website JavaScript
 * Handles theme switching, form validation, language switching, 
 * smooth scrolling, and contact form functionality
 */

// ===== INITIALIZATION AND CONFIGURATION =====
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLanguageSwitcher();
    initSmoothScrolling();
    initScrollToTopButton();
    initContactForm();
    initMobileMenu();

    // Initialize any active sections based on URL hash
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }
});

// ===== THEME SWITCHING =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.body.classList.toggle('light-theme', currentTheme === 'light');
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    
    // Update toggle state
    updateThemeToggleState(currentTheme);
    
    // Add event listener for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isCurrentlyLight = document.body.classList.contains('light-theme');
            const newTheme = isCurrentlyLight ? 'dark' : 'light';
            
            // Toggle theme classes with animation
            document.body.classList.add('theme-transition');
            document.body.classList.toggle('light-theme', newTheme === 'light');
            document.body.classList.toggle('dark-theme', newTheme === 'dark');
            
            // Save preference to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Update toggle state
            updateThemeToggleState(newTheme);
            
            // Remove transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        });
    }
}

function updateThemeToggleState(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.querySelector('.fa-moon');
    const sunIcon = document.querySelector('.fa-sun');
    
    if (themeToggle && moonIcon && sunIcon) {
        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
}

// ===== LANGUAGE SWITCHING =====
function initLanguageSwitcher() {
    const languageSelector = document.getElementById('language-selector');
    const storedLanguage = localStorage.getItem('language') || 'en';
    
    // Set initial language
    updateLanguage(storedLanguage);
    
    // Update selector value
    if (languageSelector) {
        languageSelector.value = storedLanguage;
        
        // Add event listener for language changes
        languageSelector.addEventListener('change', (e) => {
            const newLanguage = e.target.value;
            updateLanguage(newLanguage);
            localStorage.setItem('language', newLanguage);
        });
    }
}

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-lang]');
    
    elements.forEach(element => {
        const translations = JSON.parse(element.getAttribute('data-lang'));
        if (translations && translations[lang]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', translations[lang]);
                } else {
                    element.value = translations[lang];
                }
            } else {
                element.textContent = translations[lang];
            }
        }
    });
    
    // Update html lang attribute
    document.documentElement.lang = lang;
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip empty anchors or JavaScript handlers
            if (href === '#' || href === 'javascript:void(0)') return;
            
            e.preventDefault();
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTopButton() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== CONTACT FORM HANDLING =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form elements
    const form = e.target;
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const submitButton = form.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('form-status');
    
    // Reset previous error states
    resetFormErrors(form);
    
    // Validate the form
    const errors = validateForm(nameInput, emailInput, messageInput);
    
    if (Object.keys(errors).length > 0) {
        // Display validation errors
        Object.keys(errors).forEach(field => {
            const input = form.querySelector(`#${field}`);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = errors[field];
            input.parentNode.appendChild(errorMessage);
            input.classList.add('error');
        });
        
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        try {
            // Success scenario
            form.reset();
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
            
            // Show success message
            if (formStatus) {
                formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
                formStatus.className = 'success-message';
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = '';
                }, 5000);
            }
        } catch (error) {
            // Error scenario
            console.error('Form submission error:', error);
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
            
            if (formStatus) {
                formStatus.textContent = 'An error occurred. Please try again later.';
                formStatus.className = 'error-message';
            }
        }
    }, 1500);
}

function validateForm(nameInput, emailInput, messageInput) {
    const errors = {};
    
    // Validate name (required, at least 2 characters)
    if (!nameInput.value || nameInput.value.trim().length < 2) {
        errors.name = 'Please enter your name (at least 2 characters)';
    }
    
    // Validate email (required, valid format)
    if (!emailInput.value) {
        errors.email = 'Please enter your email address';
    } else if (!isValidEmail(emailInput.value)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Validate message (required, at least 10 characters)
    if (!messageInput.value || messageInput.value.trim().length < 10) {
        errors.message = 'Please enter your message (at least 10 characters)';
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function resetFormErrors(form) {
    // Remove all error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());
    
    // Remove error class from inputs
    const errorInputs = form.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add window resize handler with debounce
window.addEventListener('resize', debounce(() => {
    // Any resize-sensitive adjustments can go here
    // For example, closing mobile menu on desktop sizes
    const mobileMenu = document.getElementById('mobile-menu');
    if (window.innerWidth > 768 && mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}));

// Handle external links - open in new tab
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Main JavaScript file for the website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScroll();
    initScrollToTop();
    initContactForm();
    initThemeToggle();
    initLanguageSwitcher();
});

/**
 * Enable smooth scrolling for navigation links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return; // Skip if it's just '#'
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

/**
 * Initialize scroll-to-top button functionality
 */
function initScrollToTop() {
    // Create scroll-to-top button if it doesn't exist
    if (!document.querySelector('.scroll-top')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            z-index: 999; 
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            padding: 10px 15px;
            background-color: var(--primary-color, #007bff);
            color: #fff;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(scrollBtn);
        
        // Add click event to scroll to top
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        const scrollBtn = document.querySelector('.scroll-top');
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
}

/**
 * Initialize contact form with validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const nameInput = contactForm.querySelector('[name="name"]');
            const emailInput = contactForm.querySelector('[name="email"]');
            const messageInput = contactForm.querySelector('[name="message"]');
            
            // Validate inputs
            let isValid = true;
            
            // Simple validation for name
            if (!nameInput.value.trim()) {
                showInputError(nameInput, 'Please enter your name');
                isValid = false;
            } else {
                clearInputError(nameInput);
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                showInputError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearInputError(emailInput);
            }
            
            // Message validation
            if (!messageInput.value.trim()) {
                showInputError(messageInput, 'Please enter your message');
                isValid = false;
            } else {
                clearInputError(messageInput);
            }
            
            if (isValid) {
                // Simulate form submission (in a real application, this would be an API call)
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                
                // Disable button and show loading state
                submitButton.disabled = true;
                submitButton.innerHTML = 'Sending...';
                
                // Simulate API call with setTimeout
                setTimeout(() => {
                    // Form submission success
                    contactForm.reset();
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = 'Your message has been sent successfully!';
                    successMessage.style.cssText = `
                        color: #28a745;
                        padding: 10px;
                        margin-top: 15px;
                        background-color: rgba(40, 167, 69, 0.1);
                        border-radius: 4px;
                    `;
                    
                    // Add success message after form
                    contactForm.appendChild(successMessage);
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                    
                }, 1500); // Simulate 1.5s delay for API call
            }
        });
        
        // Helper functions for form validation
        function showInputError(inputElement, errorMessage) {
            // Remove existing error message if any
            clearInputError(inputElement);
            
            // Create and add error message
            const errorElement = document.createElement('div');
            errorElement.className = 'input-error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `
                color: #dc3545;
                font-size: 0.85em;
                margin-top: 5px;
            `;
            
            inputElement.classList.add('input-error');
            inputElement.style.borderColor = '#dc3545';
            inputElement.parentNode.appendChild(errorElement);
        }
        
        function clearInputError(inputElement) {
            const errorElement = inputElement.parentNode.querySelector('.input-error-message');
            if (errorElement) {
                errorElement.remove();
            }
            inputElement.classList.remove('input-error');
            inputElement.style.borderColor = '';
        }
    }
}

/**
 * Initialize theme toggle between light and dark modes
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            document.body.classList.add('light-theme');
            themeToggle.checked = false;
        }
        
        // Handle theme toggle
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

/**
 * Initialize language switcher functionality
 */
function initLanguageSwitcher() {
    const contactForm = document.getElementById('contactForm');
    
    if (co    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Apply transition class before changing theme
            document.body.classList.add('theme-transition');
            
            // Add animation effects to elements
            animateThemeChange(newTheme);
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon with animation
            const icon = themeToggle.querySelector('i');
            icon.style.transform = 'rotate(360deg)';
            
            setTimeout(() => {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                icon.style.transform = 'rotate(0deg)';
            }, 150);
            
            // Remove transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 500);
        });
            applyLanguage(selectedLanguage);
        });
    }
    
    // Theme transition animations
    function animateThemeChange(newTheme) {
        const cards = document.querySelectorAll('.skill-card, .about-card, .project-card, .contact-form');
        const headings = document.querySelectorAll('h1, h2, h3, h4');
        const buttons = document.querySelectorAll('.btn, .form-btn');
        
        // Add transition effects to elements
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-10px)';
                card.style.opacity = '0.8';
                
                setTimeout(() => {
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }, 200);
            }, index * 50);
        });
        
        headings.forEach((heading) => {
            heading.style.transform = 'scale(0.95)';
            heading.style.opacity = '0.8';
            
            setTimeout(() => {
                heading.style.transform = 'scale(1)';
                heading.style.opacity = '1';
            }, 200);
        });
        
        buttons.forEach((button) => {
            button.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        });
        
        // Animate stars for dark theme
        if (newTheme === 'dark') {
            createStars();
        } else {
            const starsContainer = document.querySelector('.stars-container');
            if (starsContainer) {
                starsContainer.style.opacity = '0';
                setTimeout(() => {
                    if (starsContainer.parentNode) {
                        starsContainer.parentNode.removeChild(starsContainer);
                    }
                }, 500);
            }
        }
    }
    
    function createStars() {
        // Remove existing stars container if any
        const existingStars = document.querySelector('.stars-container');
        if (existingStars) {
            existingStars.parentNode.removeChild(existingStars);
        }
        
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        starsContainer.style.opacity = '0';
        document.body.appendChild(starsContainer);
        
        // Create stars
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            // Random size
            const size = Math.random() * 2 + 1;
            
            // Random opacity and twinkle duration
            const opacity = Math.random() * 0.7 + 0.3;
            const duration = Math.random() * 3 + 2;
            
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.opacity = opacity;
            star.style.setProperty('--star-opacity', opacity);
            star.style.setProperty('--twinkle-duration', `${duration}s`);
            
            starsContainer.appendChild(star);
        }
        
        // Fade in stars
        setTimeout(() => {
            starsContainer.style.opacity = '1';
        }, 100);
    }
    
    // Form validation
    const contactForm = document.getElementById('contactForm');
     * @param {string} language - Language code (en, de, sv)
     */
    function validateForm() {
        let isValid = true;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        // Clear previous error messages
        clearFormErrors();
        
        // Name validation
        if (!nameInput.value.trim()) {
            showError(nameInput, getTranslatedText('name_required'));
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, getTranslatedText('name_too_short'));
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, getTranslatedText('email_required'));
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, getTranslatedText('email_invalid'));
            isValid = false;
        }
        
        // Subject validation (optional)
        if (subjectInput && subjectInput.value.trim().length > 50) {
            showError(subjectInput, getTranslatedText('subject_too_long'));
            isValid = false;
        }
        
        // Message validation
        if (!messageInput.value.trim()) {
            showError(messageInput, getTranslatedText('message_required'));
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, getTranslatedText('message_too_short'));
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.invalid-feedback') || document.createElement('div');
        
        if (!formGroup.querySelector('.invalid-feedback')) {
            errorElement.className = 'invalid-feedback';
            formGroup.appendChild(errorElement);
        }
        
        input.classList.add('is-invalid');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function clearFormErrors() {
        const formInputs = document.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.classList.remove('is-invalid');
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.querySelector('.invalid-feedback');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }
    
    // Translation utilities
    const translations = {
        'en': {
            'name_required': 'Please enter your name',
            'name_too_short': 'Name must be at least 2 characters',
            'email_required': 'Please enter your email address',
            'email_invalid': 'Please enter a valid email address',
            'subject_too_long': 'Subject must be less than 50 characters',
            'message_required': 'Please enter your message',
            'message_too_short': 'Message must be at least 10 characters',
            'send_message': 'Send Message',
            'sending_message': 'Sending...',
            'message_sent': 'Your message has been sent successfully!',
            'message_error': 'There was an error sending your message. Please try again.',
            'name_placeholder': 'Your Name',
            'email_placeholder': 'Your Email',
            'subject_placeholder': 'Subject',
            'message_placeholder': 'Your Message'
        },
        'de': {
            'name_required': 'Bitte geben Sie Ihren Namen ein',
            'name_too_short': 'Der Name muss mindestens 2 Zeichen lang sein',
            'email_required': 'Bitte geben Sie Ihre E-Mail-Adresse ein',
            'email_invalid': 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
            'subject_too_long': 'Der Betreff darf nicht länger als 50 Zeichen sein',
            'message_required': 'Bitte geben Sie Ihre Nachricht ein',
            'message_too_short': 'Die Nachricht muss mindestens 10 Zeichen lang sein',
            'send_message': 'Nachricht Senden',
            'sending_message': 'Senden...',
            'message_sent': 'Ihre Nachricht wurde erfolgreich gesendet!',
            'message_error': 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
            'name_placeholder': 'Ihr Name',
            'email_placeholder': 'Ihre E-Mail',
            'subject_placeholder': 'Betreff',
            'message_placeholder': 'Ihre Nachricht'
        },
        'sv': {
            'name_required': 'Vänligen ange ditt namn',
            'name_too_short': 'Namnet måste vara minst 2 tecken',
            'email_required': 'Vänligen ange din e-postadress',
            'email_invalid': 'Vänligen ange en giltig e-postadress',
            'subject_too_long': 'Ämnet får inte vara längre än 50 tecken',
            'message_required': 'Vänligen ange ditt meddelande',
            'message_too_short': 'Meddelandet måste vara minst 10 tecken',
            'send_message': 'Skicka Meddelande',
            'sending_message': 'Skickar...',
            'message_sent': 'Ditt meddelande har skickats!',
            'message_error': 'Det uppstod ett fel när ditt meddelande skulle skickas. Vänligen försök igen.',
            'name_placeholder': 'Ditt Namn',
            'email_placeholder': 'Din E-post',
            'subject_placeholder': 'Ämne',
            'message_placeholder': 'Ditt Meddelande'
        }
    };
    
    function getTranslatedText(key) {
        const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
        return translations[currentLang][key] || translations['en'][key];
    }
    
    function updateTranslations(lang) {
        // Update all elements with data-lang-text attribute
        document.querySelectorAll('[data-lang-text]').forEach(element => {
            const key = element.getAttribute('data-lang-text');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update all placeholders with data-lang-placeholder attribute
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
    }
        // Define translations for various elements
        const translations = {
            'nav-home': {
                'en': 'Home',
                'de': 'Startseite',
                'sv': 'Hem'
            },
            'nav-about': {
                'en': 'About',
                'de': 'Über mich',
                'sv': 'Om mig'
            },
            'nav-skills': {
                'en': 'Skills',
                'de': 'Fähigkeiten',
                'sv': 'Färdigheter'
            },
            'nav-projects': {
                'en': 'Projects',
                'de': 'Projekte',
                'sv': 'Projekt'
            },
            'nav-contact': {
                'en': 'Contact',
                'de': 'Kontakt',
                'sv': 'Kontakt'
            },
            'hero-title': {
                'en': 'Verification & Integration Engineer',
                'de': 'Verifikations- und Integrationsingenieur',
                'sv': 'Verifierings- och integrationssingenjör'
            },
            'about-title': {
                'en': 'About Me',
                'de': 'Über Mich',
                'sv': 'Om Mig'
            },
            'contact-title': {
                'en': 'Get In Touch',
                'de': 'Kontaktieren Sie Mich',
                'sv': 'Kontakta Mig'
            },
            'contact-name': {
                'en': 'Name',
                'de': 'Name',
                'sv': 'Namn'
            },
            'contact-email': {
                'en': 'Email',
                'de': 'E-Mail',
                'sv': 'E-post'
            },
            'contact-message': {
                'en': 'Message',
                'de': 'Nachricht',
                'sv': 'Meddelande'
            },
            'contact-submit': {
                'en': 'Send Message',
                'de': 'Nachricht Senden',
                'sv': 'Skicka Meddelande'
            },
            // Add more translations as needed
        };
        
        // Apply translations to elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const translationKey = element.getAttribute('data-lang');
            if (translations[translationKey] && translations[translationKey][language]) {
                element.textContent = translations[translationKey][language];
            }
        });
        
        // Set placeholder translations for form elements
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const translationKey = element.getAttribute('data-lang-placeholder');
            if (translations[translationKey] && translations[translationKey][language]) {
                element.placeholder = translations[translationKey][language];
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
    }
}

