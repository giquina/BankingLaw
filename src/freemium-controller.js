/**
 * JuriBank Freemium Tier Controller
 * Manages access controls and limitations for educational platform tiers
 */

class JuriBankFreemiumController {
    constructor(authConfig = null, storage = null) {
        this.authConfig = authConfig;
        this.storage = storage;
        this.currentUser = null;
        this.tierConfig = null;
        this.usageTracking = new Map();
        
        this.initializeController();
    }

    /**
     * Initialize freemium controller
     */
    initializeController() {
        this.loadCurrentUser();
        this.loadUsageTracking();
        this.setupUsageResetTimer();
        
        console.log('💎 JuriBank Freemium Controller initialized');
    }

    /**
     * Load current user data
     */
    loadCurrentUser() {
        if (this.storage) {
            const session = this.storage.getUserSession();
            const profile = this.storage.getUserProfile();
            
            if (session && profile) {
                this.currentUser = {
                    ...profile,
                    sessionId: session.sessionId,
                    tier: profile.subscriptionTier || 'free'
                };
                
                this.tierConfig = this.authConfig 
                    ? this.authConfig.getTierConfig(this.currentUser.tier)
                    : this.getDefaultTierConfig(this.currentUser.tier);
            }
        }
    }

    /**
     * Load usage tracking data
     */
    loadUsageTracking() {
        if (this.storage) {
            const tracking = this.storage.getItem('usage_tracking');
            if (tracking) {
                this.usageTracking = new Map(Object.entries(tracking));
            }
        }
    }

    /**
     * Save usage tracking data
     */
    saveUsageTracking() {
        if (this.storage) {
            const trackingObj = Object.fromEntries(this.usageTracking);
            this.storage.setItem('usage_tracking', trackingObj);
        }
    }

    /**
     * Get default tier configuration
     */
    getDefaultTierConfig(tier = 'free') {
        const configs = {
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
        };
        
        return configs[tier] || configs.free;
    }

    /**
     * Check if user has access to a feature
     */
    hasFeatureAccess(featureName) {
        if (!this.currentUser || !this.tierConfig) {
            return false;
        }
        
        const hasFeature = this.tierConfig.features[featureName] === true;
        const isRestricted = this.tierConfig.restrictions[featureName] === false;
        
        return hasFeature && !isRestricted;
    }

    /**
     * Check if user can perform an action based on limits
     */
    canPerformAction(actionType) {
        if (!this.currentUser || !this.tierConfig) {
            return {
                allowed: false,
                reason: 'User not authenticated',
                limit: 0,
                used: 0,
                remaining: 0
            };
        }
        
        const limit = this.tierConfig.limits[actionType];
        
        // Unlimited access (premium tier)
        if (limit === -1) {
            return {
                allowed: true,
                reason: 'Unlimited access',
                limit: -1,
                used: this.getUsageCount(actionType),
                remaining: -1
            };
        }
        
        const used = this.getUsageCount(actionType);
        const remaining = Math.max(0, limit - used);
        
        return {
            allowed: remaining > 0,
            reason: remaining > 0 ? 'Within limits' : 'Limit exceeded',
            limit,
            used,
            remaining
        };
    }

    /**
     * Record action usage
     */
    recordUsage(actionType, count = 1) {
        if (!this.currentUser) {
            return false;
        }
        
        const currentMonth = this.getCurrentMonth();
        const key = `${this.currentUser.userId}_${actionType}_${currentMonth}`;
        
        const currentUsage = this.usageTracking.get(key) || 0;
        this.usageTracking.set(key, currentUsage + count);
        
        this.saveUsageTracking();
        this.logUsageEvent(actionType, count);
        
        return true;
    }

    /**
     * Get current usage count for an action
     */
    getUsageCount(actionType) {
        if (!this.currentUser) {
            return 0;
        }
        
        const currentMonth = this.getCurrentMonth();
        const key = `${this.currentUser.userId}_${actionType}_${currentMonth}`;
        
        return this.usageTracking.get(key) || 0;
    }

    /**
     * Get current month identifier
     */
    getCurrentMonth() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    /**
     * Get usage summary for current user
     */
    getUsageSummary() {
        if (!this.currentUser || !this.tierConfig) {
            return null;
        }
        
        const summary = {
            tier: this.currentUser.tier,
            tierName: this.tierConfig.name,
            month: this.getCurrentMonth(),
            usage: {},
            features: this.tierConfig.features,
            restrictions: this.tierConfig.restrictions
        };
        
        // Calculate usage for each limit
        for (const [actionType, limit] of Object.entries(this.tierConfig.limits)) {
            const used = this.getUsageCount(actionType);
            const remaining = limit === -1 ? -1 : Math.max(0, limit - used);
            
            summary.usage[actionType] = {
                limit,
                used,
                remaining,
                percentage: limit === -1 ? 0 : Math.round((used / limit) * 100)
            };
        }
        
        return summary;
    }

    /**
     * Check if user needs upgrade prompt
     */
    shouldShowUpgradePrompt(actionType) {
        const actionCheck = this.canPerformAction(actionType);
        
        if (actionCheck.allowed) {
            return false;
        }
        
        // Show upgrade prompt if user has exceeded limits
        return this.currentUser.tier === 'free' && actionCheck.reason === 'Limit exceeded';
    }

    /**
     * Generate upgrade recommendation
     */
    getUpgradeRecommendation() {
        if (!this.currentUser || this.currentUser.tier !== 'free') {
            return null;
        }
        
        const summary = this.getUsageSummary();
        const limitedActions = [];
        
        for (const [actionType, usage] of Object.entries(summary.usage)) {
            if (usage.limit > 0 && usage.percentage >= 80) {
                limitedActions.push({
                    action: actionType,
                    usage: usage.used,
                    limit: usage.limit,
                    percentage: usage.percentage
                });
            }
        }
        
        if (limitedActions.length === 0) {
            return null;
        }
        
        return {
            reason: 'Approaching usage limits',
            limitedActions,
            benefits: [
                'Unlimited access to all educational tools',
                'Premium content and advanced features',
                'Priority support and professional matching',
                'Export capabilities and progress tracking'
            ],
            ctaText: 'Upgrade to Premium',
            urgency: limitedActions.some(a => a.percentage >= 90) ? 'high' : 'medium'
        };
    }

    /**
     * Simulate tier upgrade (for development)
     */
    simulateUpgrade(newTier = 'premium') {
        if (!this.currentUser) {
            return false;
        }
        
        this.currentUser.tier = newTier;
        this.tierConfig = this.getDefaultTierConfig(newTier);
        
        // Update stored profile
        if (this.storage) {
            const profile = this.storage.getUserProfile();
            if (profile) {
                profile.subscriptionTier = newTier;
                profile.upgradeDate = new Date().toISOString();
                this.storage.setUserProfile(profile);
            }
        }
        
        this.logUsageEvent('tier_upgraded', 0, { newTier });
        return true;
    }

    /**
     * Reset usage tracking (monthly reset)
     */
    resetMonthlyUsage() {
        const currentMonth = this.getCurrentMonth();
        const keysToDelete = [];
        
        for (const key of this.usageTracking.keys()) {
            if (!key.endsWith(currentMonth)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.usageTracking.delete(key));
        this.saveUsageTracking();
        
        console.log(`🔄 Reset usage tracking: removed ${keysToDelete.length} old entries`);
    }

    /**
     * Setup automatic usage reset timer
     */
    setupUsageResetTimer() {
        // Check for monthly reset every hour
        setInterval(() => {
            this.resetMonthlyUsage();
        }, 60 * 60 * 1000);
    }

    /**
     * Get feature access status for UI
     */
    getFeatureStatus(featureName) {
        const hasAccess = this.hasFeatureAccess(featureName);
        const isRestricted = this.tierConfig?.restrictions[featureName] === false;
        
        return {
            hasAccess,
            isRestricted,
            requiresUpgrade: !hasAccess && this.currentUser?.tier === 'free',
            tier: this.currentUser?.tier || 'free',
            message: hasAccess 
                ? 'Feature available' 
                : isRestricted 
                    ? 'Upgrade required for access'
                    : 'Feature not available'
        };
    }

    /**
     * Get action limit status for UI
     */
    getActionStatus(actionType) {
        const actionCheck = this.canPerformAction(actionType);
        let status = 'available';
        let message = 'Action available';
        
        if (!actionCheck.allowed) {
            status = 'blocked';
            message = actionCheck.reason;
        } else if (actionCheck.limit > 0 && actionCheck.remaining <= 2) {
            status = 'limited';
            message = `${actionCheck.remaining} uses remaining`;
        } else if (actionCheck.limit > 0 && actionCheck.remaining <= 5) {
            status = 'warning';
            message = `${actionCheck.remaining} uses remaining`;
        }
        
        return {
            status,
            message,
            ...actionCheck
        };
    }

    /**
     * Log usage events
     */
    logUsageEvent(actionType, count, details = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            userId: this.currentUser?.userId || 'anonymous',
            tier: this.currentUser?.tier || 'free',
            actionType,
            count,
            details
        };
        
        console.log('📊 USAGE EVENT:', event);
    }

    /**
     * Get comprehensive user access report
     */
    getUserAccessReport() {
        if (!this.currentUser || !this.tierConfig) {
            return null;
        }
        
        const report = {
            user: {
                id: this.currentUser.userId,
                tier: this.currentUser.tier,
                tierName: this.tierConfig.name
            },
            features: {},
            limits: {},
            recommendations: this.getUpgradeRecommendation(),
            generatedAt: new Date().toISOString()
        };
        
        // Feature access report
        const commonFeatures = [
            'knowledgeHubAccess',
            'communityForumAccess',
            'basicClaimWizard',
            'fullClaimWizard',
            'limitedChatSupport',
            'unlimitedChatSupport',
            'progressTracking',
            'premiumContent',
            'advancedTools',
            'prioritySupport',
            'exportFeatures',
            'professionalMatching'
        ];
        
        commonFeatures.forEach(feature => {
            report.features[feature] = this.getFeatureStatus(feature);
        });
        
        // Limits report
        const commonActions = [
            'monthlyQuestions',
            'forumPosts',
            'documentDownloads',
            'chatMessages',
            'assessmentAttempts'
        ];
        
        commonActions.forEach(action => {
            report.limits[action] = this.getActionStatus(action);
        });
        
        return report;
    }
}

// Export for use
if (typeof window !== 'undefined') {
    window.JuriBankFreemiumController = JuriBankFreemiumController;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankFreemiumController;
}