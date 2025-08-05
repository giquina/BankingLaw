/**
 * JuriBank Authentication Middleware
 * Integrates authentication system with existing session manager
 */

class JuriBankAuthMiddleware {
    constructor(sessionManager = null, storage = null, freemiumController = null, mockAPI = null) {
        this.sessionManager = sessionManager;
        this.storage = storage;
        this.freemiumController = freemiumController;
        this.mockAPI = mockAPI;
        this.currentUser = null;
        this.isAuthenticated = false;
        
        this.initializeMiddleware();
    }

    /**
     * Initialize authentication middleware
     */
    initializeMiddleware() {
        this.loadCurrentSession();
        this.setupGlobalAuthState();
        this.bindUIEvents();
        
        console.log('🔐 JuriBank Authentication Middleware initialized');
    }

    /**
     * Load current session from storage
     */
    loadCurrentSession() {
        if (!this.storage) return;
        
        const session = this.storage.getUserSession();
        const profile = this.storage.getUserProfile();
        
        if (session && profile) {
            this.currentUser = {
                ...session,
                ...profile
            };
            this.isAuthenticated = true;
            
            // Validate session with session manager
            if (this.sessionManager && session.sessionId) {
                const validSession = this.sessionManager.getSession(session.sessionId);
                if (!validSession) {
                    this.signOut();
                    return;
                }
            }
            
            console.log('👤 User session restored:', this.currentUser.email);
        }
    }

    /**
     * Set up global authentication state
     */
    setupGlobalAuthState() {
        if (typeof window !== 'undefined') {
            // Global auth state object
            window.JuriBankAuth = {
                isAuthenticated: () => this.isAuthenticated,
                getCurrentUser: () => this.currentUser,
                signIn: (credentials) => this.signIn(credentials),
                signUp: (userData) => this.signUp(userData),
                signOut: () => this.signOut(),
                updateProfile: (data) => this.updateProfile(data),
                hasFeatureAccess: (feature) => this.hasFeatureAccess(feature),
                canPerformAction: (action) => this.canPerformAction(action),
                getUsageSummary: () => this.getUsageSummary(),
                recordUsage: (action, count) => this.recordUsage(action, count)
            };
            
            // Dispatch authentication state change event
            this.dispatchAuthEvent('auth_state_initialized', {
                isAuthenticated: this.isAuthenticated,
                user: this.currentUser
            });
        }
    }

    /**
     * Bind UI events for authentication
     */
    bindUIEvents() {
        if (typeof document === 'undefined') return;
        
        // Handle sign up button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-auth-action="signup"]') || 
                event.target.closest('[data-auth-action="signup"]')) {
                event.preventDefault();
                this.handleSignUpClick(event);
            }
        });
        
        // Handle sign in button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-auth-action="signin"]') || 
                event.target.closest('[data-auth-action="signin"]')) {
                event.preventDefault();
                this.handleSignInClick(event);
            }
        });
        
        // Handle sign out button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-auth-action="signout"]') || 
                event.target.closest('[data-auth-action="signout"]')) {
                event.preventDefault();
                this.signOut();
            }
        });
        
        // Handle protected feature access
        document.addEventListener('click', (event) => {
            const protectedElement = event.target.closest('[data-requires-auth]');
            if (protectedElement) {
                const requiredFeature = protectedElement.dataset.requiresAuth;
                if (!this.hasFeatureAccess(requiredFeature)) {
                    event.preventDefault();
                    this.handleUnauthorizedAccess(requiredFeature, protectedElement);
                }
            }
        });
        
        // Handle usage tracking
        document.addEventListener('click', (event) => {
            const trackingElement = event.target.closest('[data-track-usage]');
            if (trackingElement && this.isAuthenticated) {
                const actionType = trackingElement.dataset.trackUsage;
                this.recordUsage(actionType);
            }
        });
    }

    /**
     * Handle sign up button click
     */
    handleSignUpClick(event) {
        const button = event.target.closest('[data-auth-action="signup"]');
        const tier = button?.dataset.tier || 'free';
        
        this.showSignUpModal(tier);
    }

    /**
     * Handle sign in button click
     */
    handleSignInClick(event) {
        this.showSignInModal();
    }

    /**
     * Show sign up modal
     */
    showSignUpModal(tier = 'free') {
        const modal = this.createAuthModal('signup', {
            title: `Sign Up for ${tier === 'premium' ? 'Premium' : 'Free'} Account`,
            tier: tier
        });
        
        document.body.appendChild(modal);
        
        // Focus first input
        const firstInput = modal.querySelector('input[type="email"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * Show sign in modal
     */
    showSignInModal() {
        const modal = this.createAuthModal('signin', {
            title: 'Sign In to Your Account'
        });
        
        document.body.appendChild(modal);
        
        // Focus first input
        const firstInput = modal.querySelector('input[type="email"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * Create authentication modal
     */
    createAuthModal(type, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'juribank-auth-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        if (type === 'signup') {
            modalContent.innerHTML = this.getSignUpModalHTML(options);
        } else {
            modalContent.innerHTML = this.getSignInModalHTML(options);
        }
        
        modal.appendChild(modalContent);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeAuthModal(modal);
            }
        });
        
        // Handle form submission
        const form = modalContent.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (type === 'signup') {
                    this.handleSignUpSubmit(form, modal);
                } else {
                    this.handleSignInSubmit(form, modal);
                }
            });
        }
        
        // Handle close button
        const closeButton = modalContent.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeAuthModal(modal);
            });
        }
        
        return modal;
    }

    /**
     * Get sign up modal HTML
     */
    getSignUpModalHTML(options) {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: #0D1B2A;">${options.title}</h2>
                <button type="button" class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            
            <form class="auth-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email Address</label>
                    <input type="email" name="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
                    <input type="text" name="name" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">University (Optional)</label>
                    <input type="text" name="university" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password</label>
                    <input type="password" name="password" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                    <div style="font-size: 0.875rem; color: #666; margin-top: 0.25rem;">
                        Password must be at least 12 characters with uppercase, lowercase, numbers, and symbols
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: flex; align-items: center; font-size: 0.875rem;">
                        <input type="checkbox" name="terms" required style="margin-right: 0.5rem;">
                        I agree to the <a href="#" style="color: #F4C430;">Terms of Service</a> and acknowledge this is an educational platform
                    </label>
                </div>
                
                <button type="submit" style="width: 100%; padding: 0.75rem; background: #0D1B2A; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer;">
                    Create ${options.tier === 'premium' ? 'Premium' : 'Free'} Account
                </button>
                
                <div style="text-align: center; margin-top: 1rem; font-size: 0.875rem;">
                    Already have an account? <a href="#" class="switch-to-signin" style="color: #F4C430;">Sign In</a>
                </div>
            </form>
            
            <div class="auth-message" style="margin-top: 1rem; padding: 0.75rem; border-radius: 6px; display: none;"></div>
        `;
    }

    /**
     * Get sign in modal HTML
     */
    getSignInModalHTML(options) {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0; color: #0D1B2A;">${options.title}</h2>
                <button type="button" class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            
            <form class="auth-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email Address</label>
                    <input type="email" name="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Password</label>
                    <input type="password" name="password" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                </div>
                
                <button type="submit" style="width: 100%; padding: 0.75rem; background: #0D1B2A; color: white; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer;">
                    Sign In
                </button>
                
                <div style="text-align: center; margin-top: 1rem; font-size: 0.875rem;">
                    Don't have an account? <a href="#" class="switch-to-signup" style="color: #F4C430;">Sign Up Free</a>
                </div>
                
                <div style="text-align: center; margin-top: 0.5rem; font-size: 0.875rem;">
                    <a href="#" class="forgot-password" style="color: #666;">Forgot Password?</a>
                </div>
            </form>
            
            <div class="auth-message" style="margin-top: 1rem; padding: 0.75rem; border-radius: 6px; display: none;"></div>
        `;
    }

    /**
     * Handle sign up form submission
     */
    async handleSignUpSubmit(form, modal) {
        const formData = new FormData(form);
        const userData = {
            email: formData.get('email'),
            name: formData.get('name'),
            university: formData.get('university'),
            password: formData.get('password'),
            subscriptionTier: modal.querySelector('button[type="submit"]').textContent.includes('Premium') ? 'premium' : 'free'
        };
        
        this.showAuthMessage(modal, 'Creating your account...', 'info');
        
        try {
            const result = await this.signUp(userData);
            
            if (result.success) {
                this.showAuthMessage(modal, 'Account created successfully! Signing you in...', 'success');
                setTimeout(() => {
                    this.closeAuthModal(modal);
                }, 2000);
            } else {
                this.showAuthMessage(modal, result.error || 'Sign up failed', 'error');
            }
        } catch (error) {
            this.showAuthMessage(modal, 'An error occurred. Please try again.', 'error');
        }
    }

    /**
     * Handle sign in form submission
     */
    async handleSignInSubmit(form, modal) {
        const formData = new FormData(form);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        this.showAuthMessage(modal, 'Signing you in...', 'info');
        
        try {
            const result = await this.signIn(credentials);
            
            if (result.success) {
                this.showAuthMessage(modal, 'Sign in successful!', 'success');
                setTimeout(() => {
                    this.closeAuthModal(modal);
                }, 1000);
            } else {
                this.showAuthMessage(modal, result.error || 'Sign in failed', 'error');
            }
        } catch (error) {
            this.showAuthMessage(modal, 'An error occurred. Please try again.', 'error');
        }
    }

    /**
     * Show authentication message
     */
    showAuthMessage(modal, message, type) {
        const messageElement = modal.querySelector('.auth-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';
            
            const colors = {
                success: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
                error: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
                info: { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' }
            };
            
            const color = colors[type] || colors.info;
            messageElement.style.backgroundColor = color.bg;
            messageElement.style.color = color.text;
            messageElement.style.border = `1px solid ${color.border}`;
        }
    }

    /**
     * Close authentication modal
     */
    closeAuthModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    /**
     * Sign up user
     */
    async signUp(userData) {
        if (this.mockAPI) {
            const result = await this.mockAPI.signUp(userData);
            
            if (result.success) {
                // Automatically sign in after successful signup
                const signInResult = await this.signIn({
                    email: userData.email,
                    password: userData.password
                });
                
                return signInResult;
            }
            
            return result;
        }
        
        return { success: false, error: 'Authentication API not available' };
    }

    /**
     * Sign in user
     */
    async signIn(credentials) {
        if (this.mockAPI) {
            const result = await this.mockAPI.signIn(credentials);
            
            if (result.success) {
                // Store session data
                if (this.storage) {
                    this.storage.setUserSession({
                        sessionId: result.sessionId,
                        userId: result.user.userId,
                        email: result.user.email,
                        role: result.user.role,
                        tier: result.user.subscriptionTier
                    });
                    
                    this.storage.setUserProfile(result.user);
                }
                
                // Update internal state
                this.currentUser = result.user;
                this.isAuthenticated = true;
                
                // Update global state
                this.setupGlobalAuthState();
                
                // Dispatch event
                this.dispatchAuthEvent('user_signed_in', result.user);
                
                // Reload page to apply authentication state
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
            
            return result;
        }
        
        return { success: false, error: 'Authentication API not available' };
    }

    /**
     * Sign out user
     */
    async signOut() {
        const sessionId = this.currentUser?.sessionId;
        
        if (this.mockAPI) {
            await this.mockAPI.signOut(sessionId);
        }
        
        // Clear storage
        if (this.storage) {
            this.storage.clearAll();
        }
        
        // Clear internal state
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Update global state
        this.setupGlobalAuthState();
        
        // Dispatch event
        this.dispatchAuthEvent('user_signed_out');
        
        // Reload page
        window.location.reload();
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        if (!this.isAuthenticated) {
            return { success: false, error: 'User not authenticated' };
        }
        
        if (this.mockAPI) {
            const result = await this.mockAPI.updateProfile(this.currentUser.userId, profileData);
            
            if (result.success && this.storage) {
                this.storage.setUserProfile(result.profile);
                this.currentUser.profile = result.profile;
            }
            
            return result;
        }
        
        return { success: false, error: 'API not available' };
    }

    /**
     * Check feature access
     */
    hasFeatureAccess(featureName) {
        if (!this.isAuthenticated) {
            return false;
        }
        
        if (this.freemiumController) {
            return this.freemiumController.hasFeatureAccess(featureName);
        }
        
        // Default access for authenticated users
        return true;
    }

    /**
     * Check if user can perform action
     */
    canPerformAction(actionType) {
        if (!this.isAuthenticated) {
            return { allowed: false, reason: 'User not authenticated' };
        }
        
        if (this.freemiumController) {
            return this.freemiumController.canPerformAction(actionType);
        }
        
        return { allowed: true, reason: 'Action permitted' };
    }

    /**
     * Record usage
     */
    recordUsage(actionType, count = 1) {
        if (!this.isAuthenticated) {
            return false;
        }
        
        if (this.freemiumController) {
            return this.freemiumController.recordUsage(actionType, count);
        }
        
        return true;
    }

    /**
     * Get usage summary
     */
    getUsageSummary() {
        if (!this.isAuthenticated || !this.freemiumController) {
            return null;
        }
        
        return this.freemiumController.getUsageSummary();
    }

    /**
     * Handle unauthorized access
     */
    handleUnauthorizedAccess(requiredFeature, element) {
        if (!this.isAuthenticated) {
            this.showSignInModal();
            return;
        }
        
        // Show upgrade prompt for premium features
        const upgradeModal = this.createUpgradeModal(requiredFeature);
        document.body.appendChild(upgradeModal);
    }

    /**
     * Create upgrade modal
     */
    createUpgradeModal(feature) {
        const modal = document.createElement('div');
        modal.className = 'juribank-upgrade-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;
        
        modalContent.innerHTML = `
            <h2 style="color: #0D1B2A; margin-bottom: 1rem;">Upgrade Required</h2>
            <p style="margin-bottom: 1.5rem; color: #666;">
                This feature requires a Premium subscription to access advanced educational tools and unlimited usage.
            </p>
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <h3 style="color: #F4C430; margin-bottom: 1rem;">Premium Benefits</h3>
                <ul style="text-align: left; margin: 0; padding-left: 1.5rem;">
                    <li>Unlimited access to all educational tools</li>
                    <li>Premium content and advanced features</li>
                    <li>Priority support from legal experts</li>
                    <li>Professional matching services</li>
                    <li>Export and download capabilities</li>
                </ul>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="upgrade-btn" style="padding: 0.75rem 1.5rem; background: #F4C430; color: #0D1B2A; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">
                    Upgrade to Premium
                </button>
                <button class="close-modal" style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Maybe Later
                </button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        
        // Close handlers
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                modal.remove();
            }
        });
        
        // Upgrade handler
        modalContent.querySelector('.upgrade-btn').addEventListener('click', () => {
            // In a real app, this would redirect to payment flow
            alert('Upgrade functionality would be implemented here!');
            modal.remove();
        });
        
        return modal;
    }

    /**
     * Dispatch authentication events
     */
    dispatchAuthEvent(eventType, data = null) {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            const event = new CustomEvent(`juribank:${eventType}`, {
                detail: data
            });
            window.dispatchEvent(event);
        }
    }
}

// Initialize middleware when dependencies are available
let authMiddleware = null;

function initializeAuthMiddleware() {
    if (typeof window !== 'undefined') {
        authMiddleware = new JuriBankAuthMiddleware(
            window.JuriBankSessionManager,
            window.JuriBankAuthStorage,
            window.JuriBankFreemiumController ? new window.JuriBankFreemiumController() : null,
            window.JuriBankMockAuthAPI
        );
        
        window.JuriBankAuthMiddleware = authMiddleware;
    }
}

// Try to initialize
initializeAuthMiddleware();

// Also try after DOM load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuthMiddleware);
    } else {
        setTimeout(initializeAuthMiddleware, 100);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankAuthMiddleware;
}