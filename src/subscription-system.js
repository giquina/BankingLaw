/**
 * JuriBank Freemium Subscription System
 * Educational platform subscription management with tiered access control
 * Student-friendly pricing with educational boundaries and compliance
 */

class SubscriptionSystem {
    constructor() {
        this.userId = null;
        this.currentTier = 'free';
        this.subscriptionData = null;
        this.usageLimits = new Map();
        this.features = new Map();
        
        // Subscription tiers configuration
        this.tiers = {
            'free': {
                name: 'Free Account',
                price: 0,
                currency: 'GBP',
                description: 'Essential educational resources for students',
                features: {
                    learningModules: { limit: 5, description: 'Basic learning modules' },
                    bookmarks: { limit: 3, description: 'Resource bookmarks' },
                    forumPosts: { limit: 10, description: 'Community posts per month' },
                    apiAccess: { limit: 100, description: 'API calls per day' },
                    support: { type: 'community', description: 'Community forum support' },
                    offlineAccess: { enabled: false, description: 'Offline content access' },
                    advancedModules: { enabled: false, description: 'Advanced legal topics' },
                    mentorship: { enabled: false, description: 'Student mentor sessions' },
                    certificates: { enabled: false, description: 'Completion certificates' },
                    customPaths: { enabled: false, description: 'Custom learning paths' }
                },
                color: 'bg-gray-100 text-gray-800',
                popular: false
            },
            'student': {
                name: 'Student Plan',
                price: 9.99,
                currency: 'GBP',
                billing: 'monthly',
                description: 'Enhanced learning for dedicated students',
                features: {
                    learningModules: { limit: -1, description: 'All learning modules' },
                    bookmarks: { limit: 50, description: 'Resource bookmarks' },
                    forumPosts: { limit: 100, description: 'Community posts per month' },
                    apiAccess: { limit: 1000, description: 'API calls per day' },
                    support: { type: 'priority', description: 'Priority email support' },
                    offlineAccess: { enabled: true, description: 'Download for offline study' },
                    advancedModules: { enabled: true, description: 'Advanced legal topics' },
                    mentorship: { enabled: false, description: 'Student mentor sessions' },
                    certificates: { enabled: true, description: 'Verified completion certificates' },
                    customPaths: { enabled: false, description: 'Custom learning paths' }
                },
                color: 'bg-blue-100 text-blue-800',
                popular: true,
                studentDiscount: true,
                discountPrice: 7.99
            },
            'premium': {
                name: 'Premium Plan',
                price: 19.99,
                currency: 'GBP',
                billing: 'monthly',
                description: 'Complete educational platform access',
                features: {
                    learningModules: { limit: -1, description: 'All learning modules + exclusive content' },
                    bookmarks: { limit: -1, description: 'Unlimited bookmarks' },
                    forumPosts: { limit: -1, description: 'Unlimited community participation' },
                    apiAccess: { limit: 10000, description: 'High-volume API access' },
                    support: { type: 'priority', description: '24/7 priority support' },
                    offlineAccess: { enabled: true, description: 'Full offline library' },
                    advancedModules: { enabled: true, description: 'All advanced content' },
                    mentorship: { enabled: true, description: '2 mentor sessions per month' },
                    certificates: { enabled: true, description: 'Professional certificates' },
                    customPaths: { enabled: true, description: 'Personalized learning journeys' }
                },
                color: 'bg-green-100 text-green-800',
                popular: false,
                studentDiscount: true,
                discountPrice: 14.99
            }
        };
        
        // Usage tracking
        this.usageTracking = {
            dailyApiCalls: 0,
            monthlyPosts: 0,
            bookmarksUsed: 0,
            modulesAccessed: 0,
            lastResetDate: new Date().toISOString().split('T')[0]
        };
        
        this.init();
    }
    
    init() {
        this.loadSubscriptionData();
        this.loadUsageData();
        this.setupUsageTracking();
        this.checkSubscriptionStatus();
        this.bindEventListeners();
        
        // Daily reset check
        this.checkDailyReset();
        setInterval(() => this.checkDailyReset(), 60000); // Check every minute
    }
    
    async loadSubscriptionData() {
        try {
            const sessionId = localStorage.getItem('userSessionId');
            if (!sessionId) {
                this.createFreeAccount();
                return;
            }
            
            // Load subscription data from localStorage (in real app, from API)
            const storedSubscription = localStorage.getItem(`subscription_${sessionId}`);
            if (storedSubscription) {
                this.subscriptionData = JSON.parse(storedSubscription);
                this.currentTier = this.subscriptionData.tier;
                this.userId = sessionId;
            } else {
                this.createFreeAccount();
            }
            
        } catch (error) {
            console.error('Error loading subscription data:', error);
            this.createFreeAccount();
        }
    }
    
    createFreeAccount() {
        const sessionId = localStorage.getItem('userSessionId') || 'user_' + Date.now();
        
        this.subscriptionData = {
            userId: sessionId,
            tier: 'free',
            status: 'active',
            startDate: new Date().toISOString(),
            nextBillingDate: null,
            canceledAt: null,
            trialEnd: null,
            paymentMethod: null,
            studentVerified: false
        };
        
        this.currentTier = 'free';
        this.userId = sessionId;
        
        this.saveSubscriptionData();
    }
    
    loadUsageData() {
        try {
            const storedUsage = localStorage.getItem(`usage_${this.userId}`);
            if (storedUsage) {
                this.usageTracking = { ...this.usageTracking, ...JSON.parse(storedUsage) };
            }
        } catch (error) {
            console.error('Error loading usage data:', error);
        }
    }
    
    setupUsageTracking() {
        // Track various platform usage
        this.trackApiUsage();
        this.trackContentAccess();
        this.trackForumUsage();
    }
    
    trackApiUsage() {
        // Intercept API calls to track usage
        const originalFetch = window.fetch;
        const self = this;
        
        window.fetch = function(...args) {
            const url = args[0];
            
            // Track API calls to our educational endpoints
            if (typeof url === 'string' && (
                url.includes('/api/knowledge-hub') || 
                url.includes('/api/community') ||
                url.includes('/api/learning')
            )) {
                self.incrementUsage('dailyApiCalls');
            }
            
            return originalFetch.apply(this, args);
        };
    }
    
    trackContentAccess() {
        // Track learning module access
        document.addEventListener('moduleStart', (event) => {
            this.incrementUsage('modulesAccessed');
        });
        
        // Track bookmark creation
        document.addEventListener('bookmarkAdded', (event) => {
            this.incrementUsage('bookmarksUsed');
        });
    }
    
    trackForumUsage() {
        // Track forum post creation
        document.addEventListener('forumPostCreated', (event) => {
            this.incrementUsage('monthlyPosts');
        });
    }
    
    incrementUsage(metric) {
        this.usageTracking[metric] = (this.usageTracking[metric] || 0) + 1;
        this.saveUsageData();
        
        // Check if user has hit limits
        this.checkUsageLimits();
    }
    
    checkUsageLimits() {
        const tierLimits = this.tiers[this.currentTier].features;
        const exceeded = [];
        
        // Check each usage metric against tier limits
        Object.keys(this.usageTracking).forEach(metric => {
            const usage = this.usageTracking[metric];
            const limit = tierLimits[metric]?.limit;
            
            if (limit && limit > 0 && usage >= limit) {
                exceeded.push(metric);
            }
        });
        
        if (exceeded.length > 0) {
            this.showUsageLimitWarning(exceeded);
        }
    }
    
    showUsageLimitWarning(exceededLimits) {
        const limitDescriptions = exceededLimits.map(limit => {
            switch (limit) {
                case 'dailyApiCalls': return 'Daily API requests';
                case 'monthlyPosts': return 'Monthly forum posts';
                case 'bookmarksUsed': return 'Saved bookmarks';
                case 'modulesAccessed': return 'Learning modules';
                default: return limit;
            }
        });
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-yellow-100 border border-yellow-200 text-yellow-800 p-4 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="fas fa-exclamation-triangle text-yellow-600 mr-3 mt-1"></i>
                <div class="flex-1">
                    <h4 class="font-semibold mb-1">Usage Limit Reached</h4>
                    <p class="text-sm mb-3">You've reached your limit for: ${limitDescriptions.join(', ')}</p>
                    <div class="flex space-x-2">
                        <button onclick="subscriptionSystem.showUpgradeModal()" class="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                            Upgrade
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="text-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-200">
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
    
    checkFeatureAccess(feature) {
        const tierFeatures = this.tiers[this.currentTier].features;
        const featureConfig = tierFeatures[feature];
        
        if (!featureConfig) return false;
        
        // Check if feature is enabled
        if (featureConfig.hasOwnProperty('enabled')) {
            return featureConfig.enabled;
        }
        
        // Check usage limits
        if (featureConfig.limit) {
            const usage = this.usageTracking[feature] || 0;
            
            if (featureConfig.limit === -1) return true; // Unlimited
            return usage < featureConfig.limit;
        }
        
        return true;
    }
    
    showUpgradeModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900">Choose Your Learning Plan</h2>
                            <p class="text-gray-600 mt-2">Unlock advanced educational features and support</p>
                        </div>
                        <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    ${this.renderSubscriptionPlans()}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    renderSubscriptionPlans() {
        return `
            <!-- Student Verification Banner -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div class="flex items-center">
                    <i class="fas fa-graduation-cap text-blue-600 mr-3"></i>
                    <div>
                        <h3 class="font-semibold text-blue-900">Student Discount Available</h3>
                        <p class="text-blue-800 text-sm">Verify your student status for additional savings on paid plans</p>
                    </div>
                    <button onclick="subscriptionSystem.verifyStudentStatus()" class="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        Verify Student Status
                    </button>
                </div>
            </div>
            
            <!-- Subscription Plans -->
            <div class="grid md:grid-cols-3 gap-6">
                ${Object.entries(this.tiers).map(([tierId, tier]) => this.renderPlanCard(tierId, tier)).join('')}
            </div>
            
            <!-- Educational Notice -->
            <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-start">
                    <i class="fas fa-info-circle text-green-600 mr-3 mt-1"></i>
                    <div class="text-green-800 text-sm">
                        <strong>Educational Platform:</strong> This platform is operated by law students for educational purposes. 
                        Subscriptions support content development, student mentors, and platform maintenance. 
                        All content is for educational guidance only.
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPlanCard(tierId, tier) {
        const isCurrentPlan = this.currentTier === tierId;
        const showStudentPrice = this.subscriptionData?.studentVerified && tier.studentDiscount;
        const displayPrice = showStudentPrice ? tier.discountPrice : tier.price;
        const originalPrice = tier.price;
        
        return `
            <div class="relative bg-white border-2 ${tier.popular ? 'border-student-blue' : 'border-gray-200'} rounded-2xl p-6 ${
                isCurrentPlan ? 'ring-2 ring-student-blue ring-opacity-50' : ''
            }">
                
                ${tier.popular ? `
                    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span class="bg-student-blue text-white px-3 py-1 text-sm font-medium rounded-full">
                            Most Popular
                        </span>
                    </div>
                ` : ''}
                
                ${isCurrentPlan ? `
                    <div class="absolute top-4 right-4">
                        <span class="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                            Current Plan
                        </span>
                    </div>
                ` : ''}
                
                <!-- Plan Header -->
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">${tier.name}</h3>
                    <p class="text-gray-600 text-sm mb-4">${tier.description}</p>
                    
                    <div class="mb-4">
                        ${tier.price === 0 ? `
                            <span class="text-4xl font-bold text-gray-900">Free</span>
                        ` : `
                            <div class="flex items-center justify-center">
                                ${showStudentPrice ? `
                                    <div class="text-center">
                                        <div class="text-sm text-gray-500 line-through">£${originalPrice}</div>
                                        <div class="text-4xl font-bold text-gray-900">£${displayPrice}</div>
                                    </div>
                                ` : `
                                    <span class="text-4xl font-bold text-gray-900">£${displayPrice}</span>
                                `}
                                <span class="text-gray-600 ml-2">/${tier.billing}</span>
                            </div>
                            ${showStudentPrice ? `
                                <div class="text-xs text-green-600 font-medium mt-1">Student Discount Applied</div>
                            ` : ''}
                        `}
                    </div>
                </div>
                
                <!-- Features List -->
                <div class="space-y-3 mb-6">
                    ${Object.entries(tier.features).map(([feature, config]) => `
                        <div class="flex items-start">
                            <i class="fas fa-${config.enabled !== false ? 'check' : 'times'} text-${
                                config.enabled !== false ? 'green' : 'gray'
                            }-500 mt-0.5 mr-3 flex-shrink-0"></i>
                            <div class="text-sm">
                                <span class="${config.enabled === false ? 'text-gray-500' : 'text-gray-700'}">${config.description}</span>
                                ${config.limit && config.limit > 0 ? `
                                    <span class="text-xs text-gray-500 block">Limit: ${config.limit}</span>
                                ` : config.limit === -1 ? `
                                    <span class="text-xs text-green-600 block">Unlimited</span>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Action Button -->
                <div class="text-center">
                    ${isCurrentPlan ? `
                        <button class="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium cursor-not-allowed">
                            Current Plan
                        </button>
                    ` : tier.price === 0 ? `
                        <button onclick="subscriptionSystem.downgradeToFree()" class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200">
                            Switch to Free
                        </button>
                    ` : `
                        <button onclick="subscriptionSystem.upgradeToPlan('${tierId}')" class="w-full bg-student-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                            Upgrade to ${tier.name}
                        </button>
                    `}
                </div>
                
                ${tier.price > 0 ? `
                    <div class="text-center text-xs text-gray-500 mt-3">
                        Cancel anytime • Student-friendly terms
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    async upgradeToPlan(tierId) {
        const tier = this.tiers[tierId];
        if (!tier) return;
        
        // In a real application, this would integrate with payment processing
        // For demo purposes, we'll simulate the upgrade process
        
        const confirmed = confirm(`Upgrade to ${tier.name} for £${tier.price}/month?\n\nThis is a demonstration - no actual payment will be processed.`);
        
        if (!confirmed) return;
        
        try {
            // Simulate payment processing
            await this.simulatePaymentProcessing(tierId);
            
            // Update subscription
            this.subscriptionData.tier = tierId;
            this.subscriptionData.status = 'active';
            this.subscriptionData.startDate = new Date().toISOString();
            this.subscriptionData.nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
            
            this.currentTier = tierId;
            this.saveSubscriptionData();
            
            // Close modal
            document.querySelector('.fixed.inset-0')?.remove();
            
            // Show success notification
            this.showNotification(`Successfully upgraded to ${tier.name}! You now have access to all premium features.`, 'success');
            
            // Refresh any dashboards or UI that might be affected
            this.refreshSubscriptionUI();
            
        } catch (error) {
            console.error('Upgrade error:', error);
            this.showNotification('Upgrade failed. Please try again later.', 'error');
        }
    }
    
    async simulatePaymentProcessing(tierId) {
        // Simulate payment processing delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 95% success rate for demo
                if (Math.random() < 0.95) {
                    resolve();
                } else {
                    reject(new Error('Payment processing failed'));
                }
            }, 2000);
        });
    }
    
    async downgradeToFree() {
        const confirmed = confirm('Downgrade to Free account? You will lose access to premium features immediately.');
        
        if (!confirmed) return;
        
        this.subscriptionData.tier = 'free';
        this.subscriptionData.status = 'active';
        this.subscriptionData.canceledAt = new Date().toISOString();
        this.subscriptionData.nextBillingDate = null;
        
        this.currentTier = 'free';
        this.saveSubscriptionData();
        
        // Close modal
        document.querySelector('.fixed.inset-0')?.remove();
        
        this.showNotification('Downgraded to Free account. Premium features are no longer available.', 'info');
        this.refreshSubscriptionUI();
    }
    
    verifyStudentStatus() {
        // In a real application, this would integrate with student verification services
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Student Verification</h3>
                    <p class="text-gray-600 mb-4">Verify your student status to unlock educational discounts.</p>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">University/College Email</label>
                            <input type="email" id="student-email" 
                                   placeholder="your.name@university.ac.uk"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue">
                            <p class="text-xs text-gray-500 mt-1">We'll send a verification link to your .ac.uk email</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                            <input type="text" id="student-institution" 
                                   placeholder="University of Cambridge"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Course of Study</label>
                            <select id="student-course" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue">
                                <option value="">Select your course...</option>
                                <option value="law">Law / LLB</option>
                                <option value="business">Business Studies</option>
                                <option value="economics">Economics</option>
                                <option value="finance">Finance</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <div class="flex items-start text-sm text-blue-800">
                            <i class="fas fa-shield-alt text-blue-600 mr-2 mt-0.5"></i>
                            <div>
                                <strong>Privacy:</strong> We only use this information to verify student status. 
                                Your details are not shared with third parties.
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 mt-6">
                        <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancel
                        </button>
                        <button onclick="subscriptionSystem.submitStudentVerification()" class="px-4 py-2 bg-student-blue text-white rounded-lg hover:bg-blue-700">
                            Send Verification
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    submitStudentVerification() {
        const email = document.getElementById('student-email').value;
        const institution = document.getElementById('student-institution').value;
        const course = document.getElementById('student-course').value;
        
        if (!email || !email.includes('.ac.uk')) {
            alert('Please enter a valid university email address (.ac.uk)');
            return;
        }
        
        if (!institution || !course) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate verification process
        document.querySelector('.fixed.inset-0')?.remove();
        
        // For demo purposes, automatically verify after a short delay
        setTimeout(() => {
            this.subscriptionData.studentVerified = true;
            this.subscriptionData.studentEmail = email;
            this.subscriptionData.studentInstitution = institution;
            this.subscriptionData.studentCourse = course;
            this.saveSubscriptionData();
            
            this.showNotification('Student status verified! You can now access educational discounts.', 'success');
        }, 2000);
    }
    
    checkDailyReset() {
        const today = new Date().toISOString().split('T')[0];
        
        if (this.usageTracking.lastResetDate !== today) {
            // Reset daily counters
            this.usageTracking.dailyApiCalls = 0;
            this.usageTracking.lastResetDate = today;
            
            // Reset monthly counters on first of month
            const currentMonth = new Date().getMonth();
            const lastResetMonth = new Date(this.usageTracking.lastResetDate).getMonth();
            
            if (currentMonth !== lastResetMonth) {
                this.usageTracking.monthlyPosts = 0;
            }
            
            this.saveUsageData();
        }
    }
    
    checkSubscriptionStatus() {
        if (this.subscriptionData?.nextBillingDate) {
            const billingDate = new Date(this.subscriptionData.nextBillingDate);
            const now = new Date();
            const daysUntilBilling = Math.ceil((billingDate - now) / (1000 * 60 * 60 * 24));
            
            if (daysUntilBilling <= 3 && daysUntilBilling > 0) {
                this.showBillingReminder(daysUntilBilling);
            } else if (daysUntilBilling <= 0) {
                this.processBilling();
            }
        }
    }
    
    showBillingReminder(days) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="fas fa-calendar-alt text-blue-600 mr-3 mt-1"></i>
                <div>
                    <h4 class="font-semibold mb-1">Billing Reminder</h4>
                    <p class="text-sm mb-3">Your subscription renews in ${days} day${days !== 1 ? 's' : ''}</p>
                    <button onclick="subscriptionSystem.manageSubscription()" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Manage Subscription
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
    
    processBilling() {
        // In real application, this would process payment
        // For demo, we'll simulate successful billing
        
        const nextBillingDate = new Date();
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        
        this.subscriptionData.nextBillingDate = nextBillingDate.toISOString();
        this.saveSubscriptionData();
        
        this.showNotification('Subscription renewed successfully!', 'success');
    }
    
    manageSubscription() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full">
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Manage Subscription</h3>
                    
                    ${this.renderSubscriptionDetails()}
                    ${this.renderUsageOverview()}
                    ${this.renderSubscriptionActions()}
                    
                    <div class="flex justify-end mt-6">
                        <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    renderSubscriptionDetails() {
        const tier = this.tiers[this.currentTier];
        const isActive = this.subscriptionData.status === 'active';
        
        return `
            <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <div class="flex items-start justify-between">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900 mb-2">${tier.name}</h4>
                        <p class="text-gray-600 mb-4">${tier.description}</p>
                        
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-500">Status:</span>
                                <span class="font-medium text-${isActive ? 'green' : 'red'}-600">
                                    ${isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            ${this.subscriptionData.nextBillingDate ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Next billing:</span>
                                    <span class="font-medium">${new Date(this.subscriptionData.nextBillingDate).toLocaleDateString()}</span>
                                </div>
                            ` : ''}
                            <div class="flex justify-between">
                                <span class="text-gray-500">Member since:</span>
                                <span class="font-medium">${new Date(this.subscriptionData.startDate).toLocaleDateString()}</span>
                            </div>
                            ${this.subscriptionData.studentVerified ? `
                                <div class="flex justify-between">
                                    <span class="text-gray-500">Student discount:</span>
                                    <span class="font-medium text-green-600">Active</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <span class="inline-block px-3 py-1 ${tier.color} rounded-full text-sm font-medium">
                        ${tier.price === 0 ? 'Free' : `£${tier.price}/month`}
                    </span>
                </div>
            </div>
        `;
    }
    
    renderUsageOverview() {
        const tierLimits = this.tiers[this.currentTier].features;
        
        const usageMetrics = [
            {
                name: 'API Calls Today',
                current: this.usageTracking.dailyApiCalls || 0,
                limit: tierLimits.apiAccess?.limit || 0,
                icon: 'fa-exchange-alt'
            },
            {
                name: 'Forum Posts This Month',
                current: this.usageTracking.monthlyPosts || 0,
                limit: tierLimits.forumPosts?.limit || 0,
                icon: 'fa-comments'
            },
            {
                name: 'Bookmarks Used',
                current: this.usageTracking.bookmarksUsed || 0,
                limit: tierLimits.bookmarks?.limit || 0,
                icon: 'fa-bookmark'
            },
            {
                name: 'Modules Accessed',
                current: this.usageTracking.modulesAccessed || 0,
                limit: tierLimits.learningModules?.limit || 0,
                icon: 'fa-book'
            }
        ];
        
        return `
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    ${usageMetrics.map(metric => {
                        const percentage = metric.limit > 0 ? Math.round((metric.current / metric.limit) * 100) : 0;
                        const isUnlimited = metric.limit === -1;
                        
                        return `
                            <div class="border border-gray-200 rounded-lg p-4">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center">
                                        <i class="fas ${metric.icon} text-student-blue mr-2"></i>
                                        <span class="font-medium text-gray-900">${metric.name}</span>
                                    </div>
                                    <span class="text-sm text-gray-500">
                                        ${metric.current}${isUnlimited ? '' : `/${metric.limit === 0 ? '∞' : metric.limit}`}
                                    </span>
                                </div>
                                
                                ${!isUnlimited && metric.limit > 0 ? `
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        <div class="h-2 rounded-full ${
                                            percentage >= 90 ? 'bg-red-500' : 
                                            percentage >= 70 ? 'bg-yellow-500' : 
                                            'bg-green-500'
                                        }" style="width: ${Math.min(percentage, 100)}%"></div>
                                    </div>
                                ` : `
                                    <div class="text-xs text-green-600">Unlimited</div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    renderSubscriptionActions() {
        const canUpgrade = this.currentTier === 'free';
        const canDowngrade = this.currentTier !== 'free';
        
        return `
            <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Actions</h4>
                <div class="space-y-3">
                    ${canUpgrade ? `
                        <button onclick="subscriptionSystem.showUpgradeModal(); this.closest('.fixed').remove();" 
                                class="w-full bg-student-blue text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                            <i class="fas fa-arrow-up mr-2"></i>
                            Upgrade Plan
                        </button>
                    ` : ''}
                    
                    ${canDowngrade ? `
                        <button onclick="subscriptionSystem.showDowngradeOptions()" 
                                class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-arrow-down mr-2"></i>
                            Change Plan
                        </button>
                    ` : ''}
                    
                    <button onclick="subscriptionSystem.exportUsageData()" 
                            class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-download mr-2"></i>
                        Export Usage Data
                    </button>
                </div>
            </div>
        `;
    }
    
    exportUsageData() {
        const data = {
            subscription: this.subscriptionData,
            usage: this.usageTracking,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `juribank-usage-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        this.showNotification('Usage data exported successfully', 'success');
    }
    
    bindEventListeners() {
        // Listen for feature access attempts
        document.addEventListener('featureAccessRequest', (event) => {
            const { feature, callback } = event.detail;
            const hasAccess = this.checkFeatureAccess(feature);
            
            if (hasAccess) {
                callback(true);
            } else {
                callback(false);
                this.showFeatureUpgradePrompt(feature);
            }
        });
    }
    
    showFeatureUpgradePrompt(feature) {
        const featureName = feature.replace(/([A-Z])/g, ' $1').toLowerCase();
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="fas fa-lock text-blue-600 mr-3 mt-1"></i>
                <div class="flex-1">
                    <h4 class="font-semibold mb-1">Premium Feature</h4>
                    <p class="text-sm mb-3">${featureName} requires a premium subscription</p>
                    <button onclick="subscriptionSystem.showUpgradeModal(); this.closest('.fixed').remove();" 
                            class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Upgrade Now
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }
    
    refreshSubscriptionUI() {
        // Dispatch event for other components to update their UI
        window.dispatchEvent(new CustomEvent('subscriptionUpdated', {
            detail: {
                tier: this.currentTier,
                features: this.tiers[this.currentTier].features
            }
        }));
    }
    
    saveSubscriptionData() {
        try {
            localStorage.setItem(`subscription_${this.userId}`, JSON.stringify(this.subscriptionData));
        } catch (error) {
            console.error('Error saving subscription data:', error);
        }
    }
    
    saveUsageData() {
        try {
            localStorage.setItem(`usage_${this.userId}`, JSON.stringify(this.usageTracking));
        } catch (error) {
            console.error('Error saving usage data:', error);
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${
                    type === 'success' ? 'check-circle' :
                    type === 'error' ? 'exclamation-triangle' :
                    'info-circle'
                } mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Public API methods
    getCurrentTier() {
        return this.currentTier;
    }
    
    getUsageStats() {
        return { ...this.usageTracking };
    }
    
    getTierFeatures(tier = null) {
        const targetTier = tier || this.currentTier;
        return this.tiers[targetTier]?.features || {};
    }
    
    hasFeatureAccess(feature) {
        return this.checkFeatureAccess(feature);
    }
}

// Initialize subscription system
let subscriptionSystem;

document.addEventListener('DOMContentLoaded', () => {
    subscriptionSystem = new SubscriptionSystem();
});

// Export for global access
if (typeof window !== 'undefined') {
    window.subscriptionSystem = subscriptionSystem;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SubscriptionSystem;
}