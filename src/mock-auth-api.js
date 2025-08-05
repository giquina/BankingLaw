/**
 * JuriBank Mock Authentication API
 * Development-only mock API endpoints for authentication testing
 */

class JuriBankMockAuthAPI {
    constructor(devConfig = null, storage = null, sessionManager = null) {
        this.devConfig = devConfig;
        this.storage = storage;
        this.sessionManager = sessionManager;
        this.apiDelay = 500; // Default delay
        this.enableMockMode = true;
        
        // In-memory user database for development
        this.userDatabase = new Map();
        this.emailVerificationTokens = new Map();
        this.passwordResetTokens = new Map();
        
        this.initializeMockAPI();
    }

    /**
     * Initialize mock API with test data
     */
    initializeMockAPI() {
        // Load test users if dev config is available
        if (this.devConfig && this.devConfig.testUsers) {
            Object.values(this.devConfig.testUsers).forEach(user => {
                this.userDatabase.set(user.email, {
                    ...user,
                    passwordHash: this.hashPassword(user.password),
                    createdAt: new Date().toISOString(),
                    lastLoginAt: null,
                    loginAttempts: 0,
                    isLocked: false
                });
            });
        }
        
        console.log('🔧 Mock Authentication API initialized');
        console.log(`👥 Loaded ${this.userDatabase.size} test users`);
    }

    /**
     * Simple password hashing for demo (not production-grade)
     */
    hashPassword(password) {
        // Simple hash for demo - use proper bcrypt in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return `mock_hash_${Math.abs(hash).toString(16)}`;
    }

    /**
     * Verify password against hash
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    /**
     * Simulate API delay
     */
    async simulateDelay() {
        if (this.apiDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, this.apiDelay));
        }
    }

    /**
     * Mock Sign Up API
     */
    async signUp(userData) {
        await this.simulateDelay();
        
        try {
            // Validate required fields
            const required = ['email', 'password', 'name'];
            for (const field of required) {
                if (!userData[field]) {
                    return {
                        success: false,
                        error: `${field} is required`,
                        code: 'MISSING_FIELD'
                    };
                }
            }
            
            // Check if user already exists
            if (this.userDatabase.has(userData.email)) {
                return {
                    success: false,
                    error: 'Email already registered',
                    code: 'EMAIL_EXISTS'
                };
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                return {
                    success: false,
                    error: 'Invalid email format',
                    code: 'INVALID_EMAIL'
                };
            }
            
            // Validate password strength
            const passwordValidation = this.validatePassword(userData.password);
            if (!passwordValidation.valid) {
                return {
                    success: false,
                    error: passwordValidation.message,
                    code: 'WEAK_PASSWORD'
                };
            }
            
            // Create new user
            const newUser = {
                userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                email: userData.email,
                passwordHash: this.hashPassword(userData.password),
                name: userData.name,
                role: 'student',
                subscriptionTier: 'free',
                emailVerified: false, // In development, we can skip verification
                createdAt: new Date().toISOString(),
                lastLoginAt: null,
                loginAttempts: 0,
                isLocked: false,
                profile: {
                    university: userData.university || '',
                    studyYear: userData.studyYear || 1,
                    interests: userData.interests || [],
                    joinDate: new Date().toISOString()
                },
                progress: {
                    completedLessons: 0,
                    totalQuizzes: 0,
                    forumPosts: 0,
                    achievementPoints: 0
                }
            };
            
            this.userDatabase.set(userData.email, newUser);
            
            // Generate email verification token (for demo)
            const verificationToken = this.generateToken();
            this.emailVerificationTokens.set(verificationToken, {
                email: userData.email,
                expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
            });
            
            this.logAPIEvent('user_registered', { 
                userId: newUser.userId, 
                email: userData.email 
            });
            
            return {
                success: true,
                user: {
                    userId: newUser.userId,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    subscriptionTier: newUser.subscriptionTier,
                    emailVerified: newUser.emailVerified
                },
                verificationToken, // Only for development
                message: 'Account created successfully'
            };
            
        } catch (error) {
            console.error('Sign up error:', error);
            return {
                success: false,
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            };
        }
    }

    /**
     * Mock Sign In API
     */
    async signIn(credentials) {
        await this.simulateDelay();
        
        try {
            const { email, password } = credentials;
            
            // Validate required fields
            if (!email || !password) {
                return {
                    success: false,
                    error: 'Email and password are required',
                    code: 'MISSING_CREDENTIALS'
                };
            }
            
            // Find user
            const user = this.userDatabase.get(email);
            if (!user) {
                return {
                    success: false,
                    error: 'Invalid email or password',
                    code: 'INVALID_CREDENTIALS'
                };
            }
            
            // Check if account is locked
            if (user.isLocked) {
                return {
                    success: false,
                    error: 'Account is temporarily locked due to multiple failed attempts',
                    code: 'ACCOUNT_LOCKED'
                };
            }
            
            // Verify password
            if (!this.verifyPassword(password, user.passwordHash)) {
                // Increment login attempts
                user.loginAttempts = (user.loginAttempts || 0) + 1;
                
                // Lock account after 5 failed attempts
                if (user.loginAttempts >= 5) {
                    user.isLocked = true;
                    setTimeout(() => {
                        user.isLocked = false;
                        user.loginAttempts = 0;
                    }, 15 * 60 * 1000); // 15 minutes lockout
                }
                
                return {
                    success: false,
                    error: 'Invalid email or password',
                    code: 'INVALID_CREDENTIALS',
                    attemptsRemaining: Math.max(0, 5 - user.loginAttempts)
                };
            }
            
            // Reset login attempts on successful login
            user.loginAttempts = 0;
            user.lastLoginAt = new Date().toISOString();
            
            // Create session
            let sessionId = null;
            if (this.sessionManager) {
                sessionId = this.sessionManager.createSession({
                    userId: user.userId,
                    email: user.email,
                    role: user.role,
                    ipAddress: '127.0.0.1',
                    userAgent: navigator.userAgent || 'Unknown'
                });
            }
            
            this.logAPIEvent('user_signed_in', { 
                userId: user.userId, 
                email: user.email 
            });
            
            return {
                success: true,
                user: {
                    userId: user.userId,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    subscriptionTier: user.subscriptionTier,
                    emailVerified: user.emailVerified,
                    lastLoginAt: user.lastLoginAt
                },
                sessionId,
                message: 'Sign in successful'
            };
            
        } catch (error) {
            console.error('Sign in error:', error);
            return {
                success: false,
                error: 'Internal server error',
                code: 'SERVER_ERROR'
            };
        }
    }

    /**
     * Mock Sign Out API
     */
    async signOut(sessionId) {
        await this.simulateDelay();
        
        try {
            if (this.sessionManager && sessionId) {
                this.sessionManager.destroySession(sessionId);
            }
            
            // Clear storage
            if (this.storage) {
                this.storage.removeUserSession();
            }
            
            this.logAPIEvent('user_signed_out', { sessionId });
            
            return {
                success: true,
                message: 'Sign out successful'
            };
            
        } catch (error) {
            console.error('Sign out error:', error);
            return {
                success: false,
                error: 'Sign out failed',
                code: 'SIGNOUT_ERROR'
            };
        }
    }

    /**
     * Mock Profile Update API
     */
    async updateProfile(userId, profileData) {
        await this.simulateDelay();
        
        try {
            // Find user by ID
            let targetUser = null;
            for (const [email, user] of this.userDatabase) {
                if (user.userId === userId) {
                    targetUser = user;
                    break;
                }
            }
            
            if (!targetUser) {
                return {
                    success: false,
                    error: 'User not found',
                    code: 'USER_NOT_FOUND'
                };
            }
            
            // Update profile data
            targetUser.profile = {
                ...targetUser.profile,
                ...profileData,
                lastUpdated: new Date().toISOString()
            };
            
            this.logAPIEvent('profile_updated', { userId });
            
            return {
                success: true,
                profile: targetUser.profile,
                message: 'Profile updated successfully'
            };
            
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                error: 'Profile update failed',
                code: 'UPDATE_ERROR'
            };
        }
    }

    /**
     * Mock Password Reset API
     */
    async requestPasswordReset(email) {
        await this.simulateDelay();
        
        try {
            const user = this.userDatabase.get(email);
            if (!user) {
                // Don't reveal if email exists for security
                return {
                    success: true,
                    message: 'If the email exists, a reset link has been sent'
                };
            }
            
            // Generate reset token
            const resetToken = this.generateToken();
            this.passwordResetTokens.set(resetToken, {
                email: email,
                expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutes
            });
            
            this.logAPIEvent('password_reset_requested', { email });
            
            return {
                success: true,
                resetToken, // Only for development
                message: 'If the email exists, a reset link has been sent'
            };
            
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                error: 'Password reset failed',
                code: 'RESET_ERROR'
            };
        }
    }

    /**
     * Mock Subscription Status API
     */
    async getSubscriptionStatus(userId) {
        await this.simulateDelay();
        
        try {
            // Find user by ID
            let targetUser = null;
            for (const [email, user] of this.userDatabase) {
                if (user.userId === userId) {
                    targetUser = user;
                    break;
                }
            }
            
            if (!targetUser) {
                return {
                    success: false,
                    error: 'User not found',
                    code: 'USER_NOT_FOUND'
                };
            }
            
            return {
                success: true,
                subscription: {
                    tier: targetUser.subscriptionTier,
                    status: 'active',
                    expiresAt: targetUser.subscriptionTier === 'premium' 
                        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() 
                        : null,
                    features: this.getSubscriptionFeatures(targetUser.subscriptionTier)
                }
            };
            
        } catch (error) {
            console.error('Subscription status error:', error);
            return {
                success: false,
                error: 'Failed to get subscription status',
                code: 'SUBSCRIPTION_ERROR'
            };
        }
    }

    /**
     * Get subscription features
     */
    getSubscriptionFeatures(tier) {
        const features = {
            free: [
                'Basic knowledge hub access',
                'Community forum participation',
                'Limited chat support',
                'Basic claim wizard',
                'Progress tracking'
            ],
            premium: [
                'Full knowledge hub access',
                'Premium content and resources',
                'Unlimited chat support',
                'Advanced claim wizard',
                'Professional matching',
                'Export capabilities',
                'Priority support',
                'Analytics and insights'
            ]
        };
        
        return features[tier] || features.free;
    }

    /**
     * Validate password strength
     */
    validatePassword(password) {
        const rules = {
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true
        };
        
        const errors = [];
        
        if (password.length < rules.minLength) {
            errors.push(`Password must be at least ${rules.minLength} characters long`);
        }
        
        if (rules.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (rules.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (rules.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (rules.requireSymbols && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        // Check for common weak patterns
        const weakPatterns = [
            'password', '123456', 'qwerty', 'admin', 'juribank',
            'banking', 'legal', 'student', 'education'
        ];
        
        const lowercasePassword = password.toLowerCase();
        for (const pattern of weakPatterns) {
            if (lowercasePassword.includes(pattern)) {
                errors.push(`Password cannot contain "${pattern}"`);
                break;
            }
        }
        
        return {
            valid: errors.length === 0,
            message: errors.join(', '),
            score: this.calculatePasswordScore(password)
        };
    }

    /**
     * Calculate password strength score
     */
    calculatePasswordScore(password) {
        let score = 0;
        
        // Length bonus
        score += Math.min(password.length * 2, 20);
        
        // Character variety bonus
        if (/[a-z]/.test(password)) score += 5;
        if (/[A-Z]/.test(password)) score += 5;
        if (/\d/.test(password)) score += 5;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
        
        // Uniqueness bonus
        const uniqueChars = new Set(password).size;
        score += uniqueChars * 2;
        
        return Math.min(score, 100);
    }

    /**
     * Generate secure token
     */
    generateToken() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return token;
    }

    /**
     * Log API events
     */
    logAPIEvent(eventType, details = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            type: eventType,
            details,
            api: 'mock'
        };
        
        console.log('🌐 MOCK API EVENT:', event);
    }

    /**
     * Get mock API statistics
     */
    getAPIStats() {
        return {
            totalUsers: this.userDatabase.size,
            activeTokens: this.emailVerificationTokens.size + this.passwordResetTokens.size,
            mockMode: this.enableMockMode,
            apiDelay: this.apiDelay,
            uptime: Date.now() - (this.startTime || Date.now())
        };
    }

    /**
     * Set API delay for testing
     */
    setDelay(milliseconds) {
        this.apiDelay = Math.max(0, milliseconds);
        console.log(`🔧 Mock API delay set to ${this.apiDelay}ms`);
    }

    /**
     * Enable/disable mock mode
     */
    setMockMode(enabled) {
        this.enableMockMode = enabled;
        console.log(`🔧 Mock API mode: ${enabled ? 'enabled' : 'disabled'}`);
    }
}

// Initialize mock API
let mockAuthAPI = null;

// Initialize when dependencies are available
function initializeMockAPI() {
    if (typeof window !== 'undefined') {
        mockAuthAPI = new JuriBankMockAuthAPI(
            window.JuriBankAuthDevConfig,
            window.JuriBankAuthStorage,
            window.JuriBankSessionManager
        );
        
        window.JuriBankMockAuthAPI = mockAuthAPI;
    }
}

// Try to initialize immediately
initializeMockAPI();

// Also try to initialize after DOM is loaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMockAPI);
    } else {
        setTimeout(initializeMockAPI, 100);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankMockAuthAPI;
}