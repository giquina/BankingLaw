/**
 * JuriBank Authentication Configuration
 * Banking-grade security settings for educational platform
 */

class JuriBankAuthConfig {
    constructor() {
        this.config = {
            // Security Settings
            security: {
                passwordMinLength: 12,
                passwordRequireUppercase: true,
                passwordRequireLowercase: true,
                passwordRequireNumbers: true,
                passwordRequireSymbols: true,
                maxLoginAttempts: 5,
                lockoutDuration: 15 * 60 * 1000, // 15 minutes
                sessionTimeout: 30 * 60 * 1000, // 30 minutes
                passwordResetExpiry: 30 * 60 * 1000, // 30 minutes
                enforceHTTPS: true,
                requireEmailVerification: true,
                enableTwoFactor: false, // Disabled for educational platform
                rateLimitRequests: 50, // Per 15 minutes
                ipWhitelistEnabled: false // For development
            },

            // Educational Platform Tiers
            freemiumTiers: {
                free: {
                    name: 'Free Educational Access',
                    features: {
                        knowledgeHubAccess: true,
                        communityForumAccess: true,
                        basicClaimWizard: true,
                        limitedChatSupport: true,
                        progressTracking: true
                    },
                    limits: {
                        monthlyQuestions: 10,
                        forumPosts: 20,
                        documentDownloads: 5,
                        chatMessages: 50,
                        assessmentAttempts: 3
                    },
                    restrictions: {
                        premiumContent: false,
                        advancedTools: false,
                        prioritySupport: false,
                        exportFeatures: false,
                        professionalMatching: false
                    }
                },
                premium: {
                    name: 'Premium Educational Subscription',
                    price: '£19.99/month',
                    features: {
                        knowledgeHubAccess: true,
                        communityForumAccess: true,
                        fullClaimWizard: true,
                        unlimitedChatSupport: true,
                        progressTracking: true,
                        premiumContent: true,
                        advancedTools: true,
                        prioritySupport: true,
                        exportFeatures: true,
                        professionalMatching: true
                    },
                    limits: {
                        monthlyQuestions: -1, // Unlimited
                        forumPosts: -1,
                        documentDownloads: -1,
                        chatMessages: -1,
                        assessmentAttempts: -1
                    },
                    restrictions: {}
                }
            },

            // Storage Configuration
            storage: {
                prefix: 'juribank_',
                sessionKey: 'session_data',
                userKey: 'user_profile',
                progressKey: 'learning_progress',
                preferencesKey: 'user_preferences',
                encryptionEnabled: true,
                compressionEnabled: true,
                maxStorageSize: 10 * 1024 * 1024, // 10MB
                storageType: 'localStorage', // localStorage or sessionStorage
                fallbackToMemory: true
            },

            // API Endpoints Configuration
            endpoints: {
                base: '/api/auth',
                signUp: '/signup',
                signIn: '/signin',
                signOut: '/signout',
                profile: '/profile',
                resetPassword: '/reset-password',
                verifyEmail: '/verify-email',
                refreshToken: '/refresh',
                checkSubscription: '/subscription/status',
                updateSubscription: '/subscription/update'
            },

            // Development Environment
            development: {
                enableMockAPI: true,
                skipEmailVerification: true,
                allowWeakPasswords: false,
                verboseLogging: true,
                disableRateLimit: false,
                allowTestAccounts: true,
                mockDelay: 500 // Simulate API delays
            },

            // Production Environment
            production: {
                enableMockAPI: false,
                skipEmailVerification: false,
                allowWeakPasswords: false,
                verboseLogging: false,
                disableRateLimit: false,
                allowTestAccounts: false,
                mockDelay: 0
            },

            // Educational Compliance
            educational: {
                ageRestriction: 16, // Minimum age for registration
                parentalConsentRequired: false, // For users under 18
                dataRetentionPeriod: 365 * 24 * 60 * 60 * 1000, // 1 year
                educationalDisclaimer: true,
                legalAdviceWarning: true,
                progressDataCollection: true,
                anonymousUsageStats: true
            },

            // Banking Security Standards
            bankingCompliance: {
                auditLogging: true,
                encryptionAtRest: true,
                encryptionInTransit: true,
                accessControlList: true,
                suspiciousActivityDetection: true,
                regularSecurityScans: true,
                dataClassification: 'sensitive',
                backupStrategy: 'encrypted',
                incidentResponsePlan: true
            }
        };
    }

    /**
     * Get configuration for current environment
     */
    getConfig(environment = 'development') {
        const baseConfig = { ...this.config };
        const envConfig = this.config[environment] || this.config.development;
        
        return {
            ...baseConfig,
            environment: {
                ...envConfig,
                name: environment,
                timestamp: new Date().toISOString()
            }
        };
    }

    /**
     * Get freemium tier configuration
     */
    getTierConfig(tierName = 'free') {
        return this.config.freemiumTiers[tierName] || this.config.freemiumTiers.free;
    }

    /**
     * Get security rules for password validation
     */
    getPasswordRules() {
        const security = this.config.security;
        return {
            minLength: security.passwordMinLength,
            requireUppercase: security.passwordRequireUppercase,
            requireLowercase: security.passwordRequireLowercase,
            requireNumbers: security.passwordRequireNumbers,
            requireSymbols: security.passwordRequireSymbols,
            forbiddenPatterns: [
                'password', '123456', 'qwerty', 'admin', 'juribank',
                'banking', 'legal', 'student', 'education'
            ]
        };
    }

    /**
     * Get storage configuration
     */
    getStorageConfig() {
        return {
            ...this.config.storage,
            keys: {
                session: `${this.config.storage.prefix}${this.config.storage.sessionKey}`,
                user: `${this.config.storage.prefix}${this.config.storage.userKey}`,
                progress: `${this.config.storage.prefix}${this.config.storage.progressKey}`,
                preferences: `${this.config.storage.prefix}${this.config.storage.preferencesKey}`
            }
        };
    }

    /**
     * Get API endpoint URLs
     */
    getEndpoints() {
        const base = this.config.endpoints.base;
        const endpoints = { ...this.config.endpoints };
        delete endpoints.base;
        
        const fullEndpoints = {};
        for (const [key, path] of Object.entries(endpoints)) {
            fullEndpoints[key] = `${base}${path}`;
        }
        
        return fullEndpoints;
    }

    /**
     * Validate configuration integrity
     */
    validateConfig() {
        const errors = [];
        
        // Validate password requirements
        if (this.config.security.passwordMinLength < 8) {
            errors.push('Password minimum length should be at least 8 characters');
        }
        
        // Validate session timeout
        if (this.config.security.sessionTimeout < 5 * 60 * 1000) {
            errors.push('Session timeout should be at least 5 minutes');
        }
        
        // Validate freemium tiers
        if (!this.config.freemiumTiers.free || !this.config.freemiumTiers.premium) {
            errors.push('Both free and premium tiers must be configured');
        }
        
        // Validate storage limits
        if (this.config.storage.maxStorageSize < 1024 * 1024) {
            errors.push('Storage size should be at least 1MB');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Generate secure configuration hash for integrity checking
     */
    generateConfigHash() {
        const configString = JSON.stringify(this.config, null, 0);
        let hash = 0;
        
        for (let i = 0; i < configString.length; i++) {
            const char = configString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return hash.toString(16);
    }

    /**
     * Get educational compliance settings
     */
    getEducationalCompliance() {
        return {
            ...this.config.educational,
            disclaimers: {
                legal: "This platform provides educational information only and does not constitute legal advice.",
                financial: "Educational content about financial matters is for learning purposes only.",
                age: `This service requires users to be at least ${this.config.educational.ageRestriction} years old.`,
                privacy: "We collect learning progress data to improve educational outcomes."
            }
        };
    }

    /**
     * Get banking compliance requirements
     */
    getBankingCompliance() {
        return {
            ...this.config.bankingCompliance,
            requirements: {
                auditTrail: "All authentication events must be logged",
                dataProtection: "User data must be encrypted at rest and in transit",
                accessControl: "Role-based access control must be enforced",
                monitoring: "Suspicious activity must be detected and reported"
            }
        };
    }
}

// Initialize and export configuration
const authConfig = new JuriBankAuthConfig();

// Validate configuration on initialization
const validation = authConfig.validateConfig();
if (!validation.valid) {
    console.error('⚠️ Authentication configuration validation failed:', validation.errors);
} else {
    console.log('✅ Authentication configuration validated successfully');
}

// Export for use
if (typeof window !== 'undefined') {
    window.JuriBankAuthConfig = authConfig;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankAuthConfig;
}