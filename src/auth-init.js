/**
 * JuriBank Authentication System Initialization
 * Main entry point for authentication system setup
 */

class JuriBankAuthSystem {
    constructor() {
        this.initialized = false;
        this.components = {
            config: null,
            storage: null,
            sessionManager: null,
            freemiumController: null,
            mockAPI: null,
            middleware: null,
            profileManager: null,
            devConfig: null
        };
        
        this.initializationPromise = this.initialize();
    }

    /**
     * Initialize the complete authentication system
     */
    async initialize() {
        try {
            console.log('🚀 Initializing JuriBank Authentication System...');
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Load and initialize components in order
            await this.loadComponents();
            await this.initializeComponents();
            await this.setupIntegrations();
            await this.finalizeInitialization();
            
            this.initialized = true;
            console.log('✅ JuriBank Authentication System initialized successfully');
            
            // Dispatch ready event
            this.dispatchReadyEvent();
            
            return true;
            
        } catch (error) {
            console.error('❌ Authentication system initialization failed:', error);
            throw error;
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Load all authentication components
     */
    async loadComponents() {
        console.log('📦 Loading authentication components...');
        
        // Load configuration
        if (window.JuriBankAuthConfig) {
            this.components.config = new window.JuriBankAuthConfig();
            console.log('  ✅ Configuration loaded');
        }
        
        // Load storage manager
        if (window.JuriBankAuthStorage) {
            this.components.storage = window.JuriBankAuthStorage;
            console.log('  ✅ Storage manager loaded');
        }
        
        // Load session manager
        if (window.JuriBankSessionManager) {
            this.components.sessionManager = window.JuriBankSessionManager;
            console.log('  ✅ Session manager loaded');
        }
        
        // Load development configuration
        if (window.JuriBankAuthDevConfig) {
            this.components.devConfig = window.JuriBankAuthDevConfig;
            console.log('  ✅ Development configuration loaded');
        }
    }

    /**
     * Initialize individual components
     */
    async initializeComponents() {
        console.log('⚙️ Initializing authentication components...');
        
        // Initialize freemium controller
        if (window.JuriBankFreemiumController) {
            this.components.freemiumController = new window.JuriBankFreemiumController(
                this.components.config,
                this.components.storage
            );
            console.log('  ✅ Freemium controller initialized');
        }
        
        // Initialize mock API
        if (window.JuriBankMockAuthAPI) {
            this.components.mockAPI = new window.JuriBankMockAuthAPI(
                this.components.devConfig,
                this.components.storage,
                this.components.sessionManager
            );
            console.log('  ✅ Mock API initialized');
        }
        
        // Initialize middleware
        if (window.JuriBankAuthMiddleware) {
            this.components.middleware = new window.JuriBankAuthMiddleware(
                this.components.sessionManager,
                this.components.storage,
                this.components.freemiumController,
                this.components.mockAPI
            );
            console.log('  ✅ Authentication middleware initialized');
        }
        
        // Initialize profile manager
        if (window.JuriBankUserProfileManager) {
            this.components.profileManager = new window.JuriBankUserProfileManager(
                this.components.storage,
                this.components.middleware
            );
            console.log('  ✅ User profile manager initialized');
        }
    }

    /**
     * Setup integrations between components
     */
    async setupIntegrations() {
        console.log('🔗 Setting up component integrations...');
        
        // Link components together
        if (this.components.middleware && this.components.freemiumController) {
            this.components.middleware.freemiumController = this.components.freemiumController;
        }
        
        if (this.components.profileManager && this.components.middleware) {
            this.components.profileManager.authMiddleware = this.components.middleware;
        }
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('  ✅ Component integrations configured');
    }

    /**
     * Setup system-wide event listeners
     */
    setupEventListeners() {
        // Listen for authentication state changes
        window.addEventListener('juribank:user_signed_in', (event) => {
            this.handleUserSignIn(event.detail);
        });
        
        window.addEventListener('juribank:user_signed_out', (event) => {
            this.handleUserSignOut();
        });
        
        // Listen for progress tracking events
        window.addEventListener('juribank:progress', (event) => {
            if (this.components.profileManager) {
                const { activityType, data } = event.detail;
                this.components.profileManager.trackProgress(activityType, data);
            }
        });
        
        // Setup UI event delegation
        this.setupUIEventDelegation();
    }

    /**
     * Setup UI event delegation for authentication actions
     */
    setupUIEventDelegation() {
        document.addEventListener('click', (event) => {
            // Handle "Sign Up Free" buttons
            if (event.target.matches('.btn-signup, [data-signup], .cta-button') ||
                event.target.closest('.btn-signup, [data-signup], .cta-button')) {
                event.preventDefault();
                this.handleSignUpClick(event);
            }
            
            // Handle "Sign In" buttons
            if (event.target.matches('.btn-signin, [data-signin]') ||
                event.target.closest('.btn-signin, [data-signin]')) {
                event.preventDefault();
                this.handleSignInClick(event);
            }
            
            // Handle protected content
            if (event.target.closest('[data-requires-premium]')) {
                const element = event.target.closest('[data-requires-premium]');
                if (!this.hasFeatureAccess('premiumContent')) {
                    event.preventDefault();
                    this.showUpgradePrompt(element);
                }
            }
        });
    }

    /**
     * Handle sign up button clicks
     */
    handleSignUpClick(event) {
        const button = event.target.closest('.btn-signup, [data-signup], .cta-button');
        const tier = button?.dataset?.tier || 
                    (button?.textContent?.toLowerCase().includes('premium') ? 'premium' : 'free');
        
        if (this.components.middleware) {
            this.components.middleware.showSignUpModal(tier);
        } else {
            console.warn('Authentication middleware not available');
        }
    }

    /**
     * Handle sign in button clicks
     */
    handleSignInClick(event) {
        if (this.components.middleware) {
            this.components.middleware.showSignInModal();
        } else {
            console.warn('Authentication middleware not available');
        }
    }

    /**
     * Handle user sign in
     */
    handleUserSignIn(userData) {
        console.log('👤 User signed in:', userData.email);
        
        // Update UI to reflect authenticated state
        this.updateUIForAuthenticatedUser(userData);
        
        // Track sign in event
        this.trackProgress('user_signed_in', { userId: userData.userId });
    }

    /**
     * Handle user sign out
     */
    handleUserSignOut() {
        console.log('👤 User signed out');
        
        // Update UI to reflect unauthenticated state
        this.updateUIForUnauthenticatedUser();
    }

    /**
     * Update UI for authenticated user
     */
    updateUIForAuthenticatedUser(userData) {
        // Update navigation
        const signUpButtons = document.querySelectorAll('.btn-signup, [data-signup]');
        signUpButtons.forEach(button => {
            button.style.display = 'none';
        });
        
        // Show user menu or dashboard link
        const userMenus = document.querySelectorAll('.user-menu, [data-user-menu]');
        userMenus.forEach(menu => {
            menu.style.display = 'block';
            const userNameElement = menu.querySelector('.user-name');
            if (userNameElement) {
                userNameElement.textContent = userData.name || userData.email;
            }
        });
        
        // Update tier-specific content
        const tierElements = document.querySelectorAll('[data-tier]');
        tierElements.forEach(element => {
            const requiredTier = element.dataset.tier;
            if (userData.subscriptionTier === requiredTier || 
                (requiredTier === 'free' && userData.subscriptionTier === 'premium')) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    /**
     * Update UI for unauthenticated user
     */
    updateUIForUnauthenticatedUser() {
        // Show sign up buttons
        const signUpButtons = document.querySelectorAll('.btn-signup, [data-signup]');
        signUpButtons.forEach(button => {
            button.style.display = 'inline-block';
        });
        
        // Hide user menus
        const userMenus = document.querySelectorAll('.user-menu, [data-user-menu]');
        userMenus.forEach(menu => {
            menu.style.display = 'none';
        });
        
        // Hide all tier-specific content
        const tierElements = document.querySelectorAll('[data-tier]');
        tierElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    /**
     * Check if user has feature access
     */
    hasFeatureAccess(featureName) {
        if (this.components.middleware) {
            return this.components.middleware.hasFeatureAccess(featureName);
        }
        return false;
    }

    /**
     * Show upgrade prompt
     */
    showUpgradePrompt(element) {
        if (this.components.middleware) {
            this.components.middleware.handleUnauthorizedAccess('premiumContent', element);
        }
    }

    /**
     * Track progress
     */
    trackProgress(activityType, data = {}) {
        const event = new CustomEvent('juribank:progress', {
            detail: { activityType, data }
        });
        window.dispatchEvent(event);
    }

    /**
     * Finalize initialization
     */
    async finalizeInitialization() {
        // Setup global API
        window.JuriBank = {
            // Authentication
            auth: this.components.middleware,
            signUp: (userData) => this.components.middleware?.signUp(userData),
            signIn: (credentials) => this.components.middleware?.signIn(credentials),
            signOut: () => this.components.middleware?.signOut(),
            
            // User management
            profile: this.components.profileManager,
            updateProfile: (data) => this.components.profileManager?.updateProfile(data),
            getDashboard: () => this.components.profileManager?.getDashboardData(),
            
            // Progress tracking
            trackProgress: (activityType, data) => this.trackProgress(activityType, data),
            
            // Feature access
            hasFeatureAccess: (feature) => this.hasFeatureAccess(feature),
            canPerformAction: (action) => this.components.middleware?.canPerformAction(action),
            
            // System info
            isInitialized: () => this.initialized,
            getSystemInfo: () => this.getSystemInfo(),
            
            // Development helpers (only in dev mode)
            dev: this.components.devConfig?.isDevelopment ? {
                loginAsFree: () => this.components.devConfig?.quickLogin('freeStudent'),
                loginAsPremium: () => this.components.devConfig?.quickLogin('premiumStudent'),
                clearStorage: () => this.components.storage?.clearAll(),
                getStats: () => this.getSystemStats()
            } : undefined
        };
        
        // Mark system as ready
        document.body.classList.add('juribank-auth-ready');
        
        console.log('🎉 JuriBank Authentication System ready for use');
    }

    /**
     * Get system information
     */
    getSystemInfo() {
        return {
            version: '3.0.0',
            initialized: this.initialized,
            components: Object.keys(this.components).reduce((info, key) => {
                info[key] = !!this.components[key];
                return info;
            }, {}),
            currentUser: this.components.middleware?.currentUser,
            isDevelopment: this.components.devConfig?.isDevelopment || false
        };
    }

    /**
     * Get system statistics
     */
    getSystemStats() {
        const stats = {
            storage: this.components.storage?.getStorageStats(),
            session: this.components.sessionManager?.getSessionStats(),
            api: this.components.mockAPI?.getAPIStats()
        };
        
        return stats;
    }

    /**
     * Dispatch ready event
     */
    dispatchReadyEvent() {
        const event = new CustomEvent('juribank:auth_ready', {
            detail: this.getSystemInfo()
        });
        window.dispatchEvent(event);
        
        // Also dispatch on document for older code compatibility
        document.dispatchEvent(event);
    }
}

// Initialize the authentication system
const juriBankAuthSystem = new JuriBankAuthSystem();

// Export for use
if (typeof window !== 'undefined') {
    window.JuriBankAuthSystem = juriBankAuthSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankAuthSystem;
}