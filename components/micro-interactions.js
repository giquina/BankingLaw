/**
 * JuriBank Micro-Interactions Controller
 * Professional animations and interactions for delightful UX
 */

class JuriBankMicroInteractions {
    constructor() {
        this.init();
        this.bindEvents();
        this.legalTips = [
            "💡 Did you know? Banks must respond to complaints within 8 weeks under FCA rules.",
            "📋 Tip: Keep records of all communication with your bank for stronger claims.",
            "⚖️ Legal fact: The Financial Ombudsman Service is free to use for consumers.",
            "🛡️ Know your rights: Banks must treat customers fairly under FCA principles.",
            "📊 Insight: 78% of PPI complaints are successful when properly documented.",
            "⏰ Important: Complaint time limits vary - act quickly to preserve your rights.",
            "🎯 Pro tip: Clear evidence significantly increases your chance of success.",
            "📞 Remember: You can escalate to the Ombudsman if unsatisfied with bank responses."
        ];
        this.currentTipIndex = 0;
    }

    init() {
        // Initialize animations when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        this.setupFormValidation();
        this.setupProgressAnimations();
        this.setupCardAnimations();
        this.setupButtonAnimations();
        this.setupTooltips();
        this.setupPageTransitions();
        this.setupIntersectionObserver();
    }

    bindEvents() {
        // Bind event listeners for interactive elements
        document.addEventListener('click', this.handleClicks.bind(this));
        document.addEventListener('input', this.handleInputs.bind(this));
        document.addEventListener('focus', this.handleFocus.bind(this), true);
        document.addEventListener('blur', this.handleBlur.bind(this), true);
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    }

    /**
     * Form Validation Animations
     */
    setupFormValidation() {
        const formFields = document.querySelectorAll('.form-field');
        
        formFields.forEach(field => {
            const input = field.querySelector('.form-input');
            if (!input) return;

            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearValidationState(input));
        });
    }

    validateField(input) {
        const field = input.closest('.form-field');
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');

        // Clear previous states
        this.clearValidationState(input);

        if (required && !value) {
            this.setFieldState(field, input, 'invalid', 'This field is required');
            return;
        }

        if (value) {
            let isValid = true;
            let message = '';

            switch (type) {
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    message = 'Please enter a valid email address';
                    break;
                case 'tel':
                    isValid = /^[\d\s\-\+\(\)]+$/.test(value) && value.length >= 10;
                    message = 'Please enter a valid phone number';
                    break;
                default:
                    isValid = value.length >= 2;
                    message = 'Please enter at least 2 characters';
            }

            this.setFieldState(field, input, isValid ? 'valid' : 'invalid', message);
        }
    }

    setFieldState(field, input, state, message) {
        field.classList.remove('valid', 'invalid');
        input.classList.remove('valid', 'invalid');
        
        field.classList.add(state);
        input.classList.add(state);

        // Remove existing message
        const existingMessage = field.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add new message for invalid state
        if (state === 'invalid' && message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'validation-message text-sm text-red-600 mt-1 animate-slide-down';
            messageEl.textContent = message;
            field.appendChild(messageEl);
        }
    }

    clearValidationState(input) {
        const field = input.closest('.form-field');
        field.classList.remove('valid', 'invalid');
        input.classList.remove('valid', 'invalid');
        
        const message = field.querySelector('.validation-message');
        if (message) {
            message.remove();
        }
    }

    /**
     * Progress Bar Animations
     */
    setupProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar-animated');
        
        progressBars.forEach(bar => {
            this.animateProgressBar(bar);
        });
    }

    animateProgressBar(bar, targetWidth) {
        if (!targetWidth) {
            targetWidth = bar.getAttribute('data-progress') || bar.style.width;
        }

        const numericWidth = parseInt(targetWidth);
        let currentWidth = 0;
        const increment = numericWidth / 50; // 50 frames for smooth animation
        
        const animate = () => {
            if (currentWidth < numericWidth) {
                currentWidth += increment;
                bar.style.width = Math.min(currentWidth, numericWidth) + '%';
                
                // Check for milestones
                this.checkProgressMilestones(bar, Math.min(currentWidth, numericWidth));
                
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                if (numericWidth >= 100) {
                    this.celebrateProgressCompletion(bar);
                }
            }
        };

        requestAnimationFrame(animate);
    }

    checkProgressMilestones(bar, progress) {
        const milestones = [25, 50, 75, 100];
        const container = bar.closest('.progress-animated');
        
        milestones.forEach(milestone => {
            if (progress >= milestone && !container.dataset[`milestone${milestone}`]) {
                container.dataset[`milestone${milestone}`] = 'true';
                this.showMilestone(container, milestone, progress);
            }
        });
    }

    showMilestone(container, milestone, progress) {
        const milestoneEl = document.createElement('div');
        milestoneEl.className = 'progress-milestone';
        milestoneEl.style.left = milestone + '%';
        milestoneEl.textContent = milestone === 100 ? '🎉 Complete!' : `${milestone}%`;
        
        container.appendChild(milestoneEl);

        // Remove milestone after animation
        setTimeout(() => {
            if (milestoneEl.parentNode) {
                milestoneEl.parentNode.removeChild(milestoneEl);
            }
        }, 3000);
    }

    celebrateProgressCompletion(bar) {
        const container = bar.closest('.progress-animated');
        container.classList.add('progress-complete');
        
        // Trigger confetti effect
        this.triggerConfetti();
        
        setTimeout(() => {
            container.classList.remove('progress-complete');
        }, 1000);
    }

    /**
     * Card Animations
     */
    setupCardAnimations() {
        const cards = document.querySelectorAll('.card-interactive');
        
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('card-enter');
        });
    }

    /**
     * Button Animations
     */
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn-micro');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });
    }

    handleButtonClick(event) {
        const button = event.currentTarget;
        
        // Add ripple effect
        this.createRippleEffect(button, event);
        
        // Check for special button types
        if (button.classList.contains('btn-success')) {
            setTimeout(() => {
                button.classList.add('btn-success-pulse');
                setTimeout(() => {
                    button.classList.remove('btn-success-pulse');
                }, 600);
            }, 100);
        }
    }

    createRippleEffect(button, event) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
            if (button.querySelectorAll('[style*="ripple"]').length === 0) {
                button.style.overflow = '';
            }
        }, 600);
    }

    /**
     * Tooltip System
     */
    setupTooltips() {
        const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
        
        tooltipTriggers.forEach(trigger => {
            const tooltipText = trigger.getAttribute('data-tooltip');
            const tooltip = this.createTooltip(tooltipText);
            
            trigger.appendChild(tooltip);
            trigger.classList.add('tooltip-container');
        });
    }

    createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        return tooltip;
    }

    /**
     * Loading States with Legal Tips
     */
    showLoadingWithTips(container) {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-container animate-fade-in';
        
        loadingEl.innerHTML = `
            <div class="flex items-center justify-center mb-4">
                <div class="spinner-legal"></div>
            </div>
            <div class="loading-tip">
                <span class="loading-tip-icon">💡</span>
                <span class="loading-tip-text">${this.getRandomLegalTip()}</span>
            </div>
        `;
        
        container.appendChild(loadingEl);
        
        // Rotate tips every 3 seconds
        const tipInterval = setInterval(() => {
            const tipText = loadingEl.querySelector('.loading-tip-text');
            if (tipText) {
                tipText.style.opacity = '0';
                setTimeout(() => {
                    tipText.textContent = this.getRandomLegalTip();
                    tipText.style.opacity = '1';
                }, 200);
            }
        }, 3000);
        
        return {
            element: loadingEl,
            destroy: () => {
                clearInterval(tipInterval);
                loadingEl.remove();
            }
        };
    }

    getRandomLegalTip() {
        const tip = this.legalTips[this.currentTipIndex];
        this.currentTipIndex = (this.currentTipIndex + 1) % this.legalTips.length;
        return tip;
    }

    /**
     * Success Celebrations
     */
    celebrateSuccess(title = "Success!", message = "Your action was completed successfully.") {
        // Create celebration overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in';
        
        overlay.innerHTML = `
            <div class="success-modal">
                <div class="success-icon">
                    <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <h2 class="heading-3 text-center mb-2">${title}</h2>
                <p class="text-body text-center mb-6">${message}</p>
                <button class="btn btn-primary w-full" onclick="this.closest('.fixed').remove()">
                    Continue
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger confetti
        this.triggerConfetti();
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 5000);
    }

    triggerConfetti() {
        const celebration = document.createElement('div');
        celebration.className = 'success-celebration';
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            celebration.appendChild(confetti);
        }
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 5000);
    }

    /**
     * Error Handling with Recovery
     */
    showError(message, recovery = null) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-container mb-4';
        
        errorContainer.innerHTML = `
            <div class="flex items-start">
                <div class="error-icon mr-3">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="text-sm text-red-800">${message}</p>
                    ${recovery ? `<button class="error-recovery-button btn btn-sm btn-outline mt-2">${recovery.text}</button>` : ''}
                </div>
            </div>
        `;
        
        if (recovery) {
            const recoveryBtn = errorContainer.querySelector('.error-recovery-button');
            recoveryBtn.addEventListener('click', recovery.action);
        }
        
        return errorContainer;
    }

    /**
     * Page Transitions
     */
    setupPageTransitions() {
        // Add page transition class to main content
        const mainContent = document.querySelector('main') || document.body;
        mainContent.classList.add('page-transition');
        
        // Setup navigation link transitions
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-1px)';
            });
            link.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Intersection Observer for Scroll Animations
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const elementsToObserve = document.querySelectorAll('.card, .form-field, .progress-animated');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    /**
     * Event Handlers
     */
    handleClicks(event) {
        // Handle special click interactions
        if (event.target.classList.contains('help-icon')) {
            event.target.style.transform = 'scale(1.2)';
            setTimeout(() => {
                event.target.style.transform = 'scale(1)';
            }, 150);
        }
    }

    handleInputs(event) {
        // Handle real-time input feedback
        const input = event.target;
        if (input.classList.contains('form-input')) {
            // Add typing animation class
            input.parentNode.classList.add('typing');
            clearTimeout(input.typingTimeout);
            input.typingTimeout = setTimeout(() => {
                input.parentNode.classList.remove('typing');
            }, 500);
        }
    }

    handleFocus(event) {
        const element = event.target;
        if (element.classList.contains('form-input')) {
            element.parentNode.classList.add('focused');
        }
    }

    handleBlur(event) {
        const element = event.target;
        if (element.classList.contains('form-input')) {
            element.parentNode.classList.remove('focused');
        }
    }

    handleScroll() {
        // Handle scroll-based animations
        const scrollY = window.scrollY;
        const nav = document.querySelector('nav');
        
        if (nav) {
            if (scrollY > 50) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        }
    }

    /**
     * Utility Functions
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
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

    /**
     * Public API Methods
     */
    updateProgress(selector, percentage) {
        const progressBar = document.querySelector(selector);
        if (progressBar) {
            this.animateProgressBar(progressBar, percentage + '%');
        }
    }

    showLoading(selector) {
        const container = document.querySelector(selector);
        if (container) {
            return this.showLoadingWithTips(container);
        }
    }

    celebrate(title, message) {
        this.celebrateSuccess(title, message);
    }

    displayError(selector, message, recovery) {
        const container = document.querySelector(selector);
        if (container) {
            const errorEl = this.showError(message, recovery);
            container.appendChild(errorEl);
            return errorEl;
        }
    }
}

// Initialize when DOM is ready
const juriBankMicroInteractions = new JuriBankMicroInteractions();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankMicroInteractions;
} else {
    window.JuriBankMicroInteractions = JuriBankMicroInteractions;
    window.microInteractions = juriBankMicroInteractions;
}