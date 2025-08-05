/**
 * JuriBank Freemium Subscription Manager v3.0
 * Educational platform subscription system with free and paid tiers
 * Manages user access, limits, and upgrade paths
 */

class SubscriptionManager {
    constructor() {
        this.subscriptionTiers = new Map();
        this.userSubscriptions = new Map();
        this.usageLimits = new Map();
        this.features = new Map();
        
        this.initializeSubscriptionTiers();
        this.initializeFeatures();
        this.loadUserSubscription();
    }

    /**
     * Initialize subscription tiers
     */
    initializeSubscriptionTiers() {
        this.subscriptionTiers.set('free', {
            id: 'free',
            name: 'Free Explorer',
            price: 0,
            currency: 'GBP',
            billing_period: null,
            trial_days: 0,
            description: 'Perfect for getting started with basic educational guidance',
            limits: {
                assessments_per_month: 5,
                claim_types: ['bank-charges', 'basic-ppi', 'payment-disputes'],
                saved_items: 3,
                community_posts: 10,
                priority_support: false,
                advanced_tools: false,
                document_templates: 2,
                api_access: false,
                real_time_alerts: false,
                unlimited_bookmarks: false,
                premium_content: false,
                solicitor_referrals: false,
                detailed_analytics: false
            },
            features: [
                'Basic eligibility checker',
                '5 claim types covered',
                'Public knowledge base',
                '3 saved items',
                'Community forum access',
                'Weekly updates',
                'Basic templates'
            ],
            educational_focus: [
                'Consumer rights basics',
                'Simple banking issues',
                'Introduction to financial services',
                'Basic complaint process'
            ]
        });

        this.subscriptionTiers.set('premium', {
            id: 'premium',
            name: 'Full Access',
            price: 9.99,
            currency: 'GBP',
            billing_period: 'monthly',
            trial_days: 7,
            description: 'Everything you need to succeed with comprehensive educational support',
            limits: {
                assessments_per_month: null, // unlimited
                claim_types: 'all', // all 25+ types
                saved_items: null, // unlimited
                community_posts: null, // unlimited
                priority_support: true,
                advanced_tools: true,
                document_templates: null, // unlimited
                api_access: true,
                real_time_alerts: true,
                unlimited_bookmarks: true,
                premium_content: true,
                solicitor_referrals: true,
                detailed_analytics: true
            },
            features: [
                'All 25+ claim types',
                'Advanced assessment tools',
                'Custom dashboard & tracking',
                'Unlimited saves & bookmarks',
                'Real-time alerts & updates',
                'Priority support from students',
                'Document templates & letters',
                'Private community access',
                'Verified solicitor referrals',
                'Premium statistics & insights',
                'Mobile app access',
                'Email alerts & notifications'
            ],
            educational_focus: [
                'Advanced financial services law',
                'Complex regulatory frameworks',
                'Professional complaint strategies',
                'Investment and pension guidance',
                'Mortgage and lending issues',
                'Commercial banking disputes',
                'Regulatory compliance understanding'
            ]
        });

        this.subscriptionTiers.set('annual', {
            id: 'annual',
            name: 'Full Access Annual',
            price: 99.99, // 2 months free
            currency: 'GBP',
            billing_period: 'yearly',
            trial_days: 14,
            description: 'Best value - full access with extended trial and annual savings',
            limits: {
                // Same as premium but with additional benefits
                ...this.subscriptionTiers.get('premium').limits,
                extended_trial: true,
                bonus_consultations: 2,
                priority_matching: true
            },
            features: [
                ...this.subscriptionTiers.get('premium').features,
                '2 months free (annual billing)',
                '14-day trial period',
                '2 bonus consultation credits',
                'Priority solicitor matching',
                'Annual progress reports'
            ],
            educational_focus: [
                ...this.subscriptionTiers.get('premium').educational_focus,
                'Year-long learning journey',
                'Advanced case study access',
                'Exclusive masterclasses'
            ]
        });
    }

    /**
     * Initialize feature definitions
     */
    initializeFeatures() {
        this.features.set('assessments', {
            name: 'Claim Assessments',
            description: 'Guided assessments for different claim types',
            free_limit: 5,
            premium_limit: null,
            usage_tracking: true
        });

        this.features.set('saved_items', {
            name: 'Saved Resources',
            description: 'Bookmark important educational resources',
            free_limit: 3,
            premium_limit: null,
            usage_tracking: true
        });

        this.features.set('claim_types', {
            name: 'Claim Type Access',
            description: 'Access to different types of financial claims',
            free_limit: ['bank-charges', 'basic-ppi', 'payment-disputes'],
            premium_limit: 'all',
            usage_tracking: false
        });

        this.features.set('priority_support', {
            name: 'Priority Student Support',
            description: 'Faster response times from law student moderators',
            free_limit: false,
            premium_limit: true,
            usage_tracking: false
        });

        this.features.set('advanced_tools', {
            name: 'Advanced Tools',
            description: 'Sophisticated calculators and analysis tools',
            free_limit: false,
            premium_limit: true,
            usage_tracking: false
        });

        this.features.set('real_time_alerts', {
            name: 'Real-time Alerts',
            description: 'Immediate notifications for relevant updates',
            free_limit: false,
            premium_limit: true,
            usage_tracking: false
        });

        this.features.set('solicitor_referrals', {
            name: 'Verified Solicitor Referrals',
            description: 'Access to pre-screened legal professionals',
            free_limit: false,
            premium_limit: true,
            usage_tracking: true
        });
    }

    /**
     * Get user's current subscription
     */
    getCurrentSubscription(userId = 'anonymous') {
        const userSubscription = this.userSubscriptions.get(userId);
        
        if (!userSubscription) {
            // Return default free subscription
            return {
                userId: userId,
                tier: 'free',
                status: 'active',
                startDate: new Date(),
                endDate: null,
                trialEndDate: null,
                autoRenew: false,
                paymentMethod: null,
                usage: this.initializeUsageTracking(userId)
            };
        }

        return userSubscription;
    }

    /**
     * Check if user can access a feature
     */
    canAccessFeature(userId, featureName, options = {}) {
        const subscription = this.getCurrentSubscription(userId);
        const tier = this.subscriptionTiers.get(subscription.tier);
        const feature = this.features.get(featureName);

        if (!tier || !feature) {
            return {
                allowed: false,
                reason: 'Feature not found'
            };
        }

        // Check subscription status
        if (subscription.status !== 'active' && subscription.status !== 'trial') {
            return {
                allowed: false,
                reason: 'Subscription not active',
                upgradeRequired: true
            };
        }

        // Check if feature is enabled for this tier
        const limit = tier.limits[featureName];
        
        if (limit === false) {
            return {
                allowed: false,
                reason: 'Feature not available in current tier',
                upgradeRequired: true,
                currentTier: subscription.tier,
                requiredTier: 'premium'
            };
        }

        if (limit === true || limit === null) {
            return {
                allowed: true,
                unlimited: true
            };
        }

        // Check usage limits for features with tracking
        if (feature.usage_tracking && typeof limit === 'number') {
            const currentUsage = this.getCurrentUsage(userId, featureName);
            const remaining = limit - currentUsage;

            if (remaining <= 0) {
                return {
                    allowed: false,
                    reason: 'Usage limit reached',
                    currentUsage: currentUsage,
                    limit: limit,
                    upgradeRequired: true,
                    resetDate: this.getUsageResetDate(userId)
                };
            }

            return {
                allowed: true,
                remaining: remaining,
                limit: limit,
                currentUsage: currentUsage
            };
        }

        // Check array-based limits (like claim types)
        if (Array.isArray(limit)) {
            const requestedItem = options.claimType || options.item;
            if (requestedItem && !limit.includes(requestedItem)) {
                return {
                    allowed: false,
                    reason: 'Item not available in current tier',
                    availableItems: limit,
                    upgradeRequired: true
                };
            }

            return {
                allowed: true,
                availableItems: limit
            };
        }

        if (limit === 'all') {
            return {
                allowed: true,
                unlimited: true
            };
        }

        return {
            allowed: true
        };
    }

    /**
     * Track feature usage
     */
    async trackUsage(userId, featureName, amount = 1) {
        const usage = this.getCurrentUsage(userId);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const usageKey = `${currentYear}-${currentMonth}`;

        if (!usage[usageKey]) {
            usage[usageKey] = {};
        }

        if (!usage[usageKey][featureName]) {
            usage[usageKey][featureName] = 0;
        }

        usage[usageKey][featureName] += amount;

        // Save usage
        await this.saveUsageData(userId, usage);

        // Check if limit reached
        const accessCheck = this.canAccessFeature(userId, featureName);
        
        if (!accessCheck.allowed && accessCheck.reason === 'Usage limit reached') {
            this.handleLimitReached(userId, featureName, accessCheck);
        }

        return {
            success: true,
            currentUsage: usage[usageKey][featureName],
            accessCheck: accessCheck
        };
    }

    /**
     * Upgrade user subscription
     */
    async upgradeSubscription(userId, targetTier, paymentDetails = {}) {
        try {
            const currentSubscription = this.getCurrentSubscription(userId);
            const newTier = this.subscriptionTiers.get(targetTier);

            if (!newTier) {
                throw new Error('Invalid subscription tier');
            }

            // Process payment (mock implementation)
            const paymentResult = await this.processPayment(userId, newTier, paymentDetails);
            
            if (!paymentResult.success) {
                throw new Error('Payment failed: ' + paymentResult.message);
            }

            // Calculate subscription dates
            const startDate = new Date();
            const trialEndDate = newTier.trial_days > 0 ? 
                new Date(startDate.getTime() + newTier.trial_days * 24 * 60 * 60 * 1000) : null;
            
            let endDate = null;
            if (newTier.billing_period === 'monthly') {
                endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
            } else if (newTier.billing_period === 'yearly') {
                endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
            }

            // Update subscription
            const newSubscription = {
                userId: userId,
                tier: targetTier,
                status: trialEndDate ? 'trial' : 'active',
                startDate: startDate,
                endDate: endDate,
                trialEndDate: trialEndDate,
                autoRenew: true,
                paymentMethod: paymentResult.paymentMethod,
                billingHistory: [
                    {
                        date: startDate,
                        amount: trialEndDate ? 0 : newTier.price,
                        description: trialEndDate ? 'Trial started' : 'Subscription activated',
                        status: 'completed'
                    }
                ]
            };

            this.userSubscriptions.set(userId, newSubscription);
            await this.saveSubscriptionData(userId, newSubscription);

            // Clear usage limits for new tier
            await this.resetUsageLimits(userId);

            // Send welcome email
            await this.sendWelcomeEmail(userId, newTier);

            // Track upgrade event
            await this.trackEvent(userId, 'subscription_upgraded', {
                fromTier: currentSubscription.tier,
                toTier: targetTier,
                trialDays: newTier.trial_days,
                amount: newTier.price
            });

            return {
                success: true,
                subscription: newSubscription,
                message: trialEndDate ? 
                    `Trial started! You have ${newTier.trial_days} days of free access.` :
                    'Subscription activated successfully!'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(userId, reason = '') {
        try {
            const subscription = this.getCurrentSubscription(userId);
            
            if (subscription.tier === 'free') {
                return {
                    success: false,
                    message: 'Cannot cancel free subscription'
                };
            }

            // Update subscription status
            subscription.status = 'cancelled';
            subscription.cancelledDate = new Date();
            subscription.cancellationReason = reason;
            subscription.autoRenew = false;

            // Keep access until end of billing period
            subscription.accessEndDate = subscription.endDate;

            this.userSubscriptions.set(userId, subscription);
            await this.saveSubscriptionData(userId, subscription);

            // Track cancellation
            await this.trackEvent(userId, 'subscription_cancelled', {
                tier: subscription.tier,
                reason: reason,
                accessUntil: subscription.accessEndDate
            });

            return {
                success: true,
                message: `Subscription cancelled. You'll have access until ${subscription.accessEndDate.toLocaleDateString()}.`,
                accessUntil: subscription.accessEndDate
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get subscription pricing
     */
    getPricingInformation() {
        const pricing = [];

        this.subscriptionTiers.forEach(tier => {
            pricing.push({
                id: tier.id,
                name: tier.name,
                price: tier.price,
                currency: tier.currency,
                billing_period: tier.billing_period,
                trial_days: tier.trial_days,
                description: tier.description,
                features: tier.features,
                educational_focus: tier.educational_focus,
                savings: tier.id === 'annual' ? {
                    amount: 19.99,
                    percentage: 17
                } : null,
                popular: tier.id === 'premium'
            });
        });

        return pricing;
    }

    /**
     * Get usage statistics
     */
    getUsageStatistics(userId) {
        const subscription = this.getCurrentSubscription(userId);
        const tier = this.subscriptionTiers.get(subscription.tier);
        const usage = this.getCurrentUsage(userId);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const usageKey = `${currentYear}-${currentMonth}`;
        const monthlyUsage = usage[usageKey] || {};

        const stats = {};

        this.features.forEach((feature, featureName) => {
            if (feature.usage_tracking) {
                const limit = tier.limits[featureName];
                const used = monthlyUsage[featureName] || 0;
                
                stats[featureName] = {
                    used: used,
                    limit: limit,
                    remaining: limit ? Math.max(0, limit - used) : null,
                    percentage: limit ? Math.min(100, (used / limit) * 100) : 0,
                    unlimited: limit === null
                };
            }
        });

        return {
            subscription: subscription,
            monthlyUsage: stats,
            resetDate: this.getUsageResetDate(userId)
        };
    }

    /**
     * Generate upgrade recommendations
     */
    generateUpgradeRecommendations(userId) {
        const currentSubscription = this.getCurrentSubscription(userId);
        const usageStats = this.getUsageStatistics(userId);
        const recommendations = [];

        if (currentSubscription.tier === 'free') {
            // Check if user is hitting limits
            Object.entries(usageStats.monthlyUsage).forEach(([feature, stats]) => {
                if (stats.percentage >= 80) {
                    recommendations.push({
                        type: 'limit-approaching',
                        feature: feature,
                        message: `You've used ${stats.percentage}% of your ${feature.replace('_', ' ')} limit`,
                        urgency: stats.percentage >= 100 ? 'high' : 'medium'
                    });
                }
            });

            // General upgrade benefits
            recommendations.push({
                type: 'feature-unlock',
                message: 'Upgrade to unlock all 25+ claim types and unlimited assessments',
                urgency: 'low',
                benefits: [
                    'Unlimited assessments',
                    'All claim types',
                    'Priority support',
                    'Advanced tools'
                ]
            });
        }

        // Trial ending reminder
        if (currentSubscription.status === 'trial' && currentSubscription.trialEndDate) {
            const daysLeft = Math.ceil((currentSubscription.trialEndDate - new Date()) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 3) {
                recommendations.push({
                    type: 'trial-ending',
                    message: `Your trial ends in ${daysLeft} days`,
                    urgency: 'high',
                    action: 'Continue with full access'
                });
            }
        }

        return recommendations;
    }

    /**
     * Initialize usage tracking for user
     */
    initializeUsageTracking(userId) {
        const existingUsage = this.usageLimits.get(userId);
        if (existingUsage) {return existingUsage;}

        const usage = {};
        this.usageLimits.set(userId, usage);
        return usage;
    }

    /**
     * Get current usage for user
     */
    getCurrentUsage(userId, featureName = null) {
        const usage = this.initializeUsageTracking(userId);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const usageKey = `${currentYear}-${currentMonth}`;

        if (!usage[usageKey]) {
            usage[usageKey] = {};
        }

        if (featureName) {
            return usage[usageKey][featureName] || 0;
        }

        return usage;
    }

    /**
     * Get usage reset date
     */
    getUsageResetDate(userId) {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    /**
     * Handle when user reaches a limit
     */
    handleLimitReached(userId, featureName, accessCheck) {
        // Trigger upgrade prompt
        this.triggerUpgradePrompt(userId, {
            feature: featureName,
            limit: accessCheck.limit,
            resetDate: accessCheck.resetDate
        });
    }

    /**
     * Trigger upgrade prompt
     */
    triggerUpgradePrompt(userId, context) {
        // Emit event for UI to handle
        const event = new CustomEvent('subscription-limit-reached', {
            detail: {
                userId,
                context,
                recommendations: this.generateUpgradeRecommendations(userId)
            }
        });
        
        if (typeof document !== 'undefined') {
            document.dispatchEvent(event);
        }
    }

    /**
     * Mock payment processing
     */
    async processPayment(userId, tier, paymentDetails) {
        // Mock payment processing - in real implementation would integrate with Stripe/PayPal
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: this.generateId(),
                    paymentMethod: {
                        type: paymentDetails.type || 'card',
                        last4: paymentDetails.last4 || '****',
                        brand: paymentDetails.brand || 'visa'
                    },
                    amount: tier.price,
                    currency: tier.currency
                });
            }, 1000);
        });
    }

    /**
     * Send welcome email
     */
    async sendWelcomeEmail(userId, tier) {
        // Mock email sending
        console.log(`Welcome email sent to user ${userId} for ${tier.name} subscription`);
    }

    /**
     * Track events
     */
    async trackEvent(userId, eventType, data) {
        const event = {
            userId,
            eventType,
            data,
            timestamp: new Date()
        };
        
        console.log('Event tracked:', event);
    }

    /**
     * Reset usage limits
     */
    async resetUsageLimits(userId) {
        const usage = this.initializeUsageTracking(userId);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const usageKey = `${currentYear}-${currentMonth}`;
        
        usage[usageKey] = {};
        await this.saveUsageData(userId, usage);
    }

    /**
     * Save subscription data
     */
    async saveSubscriptionData(userId, subscription) {
        localStorage.setItem(`subscription-${userId}`, JSON.stringify(subscription));
    }

    /**
     * Save usage data
     */
    async saveUsageData(userId, usage) {
        localStorage.setItem(`usage-${userId}`, JSON.stringify(usage));
    }

    /**
     * Load user subscription
     */
    loadUserSubscription(userId = 'anonymous') {
        try {
            const saved = localStorage.getItem(`subscription-${userId}`);
            if (saved) {
                const subscription = JSON.parse(saved);
                this.userSubscriptions.set(userId, subscription);
            }

            const savedUsage = localStorage.getItem(`usage-${userId}`);
            if (savedUsage) {
                const usage = JSON.parse(savedUsage);
                this.usageLimits.set(userId, usage);
            }
        } catch (error) {
            console.warn('Failed to load subscription data:', error);
        }
    }

    /**
     * Utility methods
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize Subscription Manager
const subscriptionManager = new SubscriptionManager();

// Listen for subscription events
if (typeof document !== 'undefined') {
    document.addEventListener('subscription-limit-reached', (event) => {
        console.log('Subscription limit reached:', event.detail);
        // UI can handle this event to show upgrade prompts
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SubscriptionManager;
}

// Make available globally
window.SubscriptionManager = SubscriptionManager;
window.subscriptionManager = subscriptionManager;