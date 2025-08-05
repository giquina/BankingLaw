/**
 * JuriBank Authentication Development Environment Configuration
 * Development tools and testing utilities for authentication system
 */

class JuriBankAuthDevConfig {
    constructor() {
        this.isDevelopment = this.detectEnvironment();
        this.testUsers = this.createTestUsers();
        this.mockApiDelay = 500; // Simulate API delays
        this.debugMode = true;
        
        this.initializeDevelopmentMode();
    }

    /**
     * Detect if running in development environment
     */
    detectEnvironment() {
        // Check various environment indicators
        const indicators = [
            window.location.hostname === 'localhost',
            window.location.hostname === '127.0.0.1',
            window.location.port === '8000',
            window.location.protocol === 'http:',
            window.location.href.includes('vercel.app') && window.location.href.includes('-preview'),
            process?.env?.NODE_ENV === 'development'
        ];
        
        return indicators.some(Boolean);
    }

    /**
     * Initialize development mode features
     */
    initializeDevelopmentMode() {
        if (this.isDevelopment) {
            this.setupDevelopmentConsole();
            this.enableDebugLogging();
            this.createDevelopmentUI();
            
            console.log('🔧 JuriBank Authentication Development Mode Enabled');
            console.log('📋 Available test users:', Object.keys(this.testUsers));
        }
    }

    /**
     * Create test user accounts for development
     */
    createTestUsers() {
        return {
            freeStudent: {
                userId: 'test_free_001',
                email: 'student.free@juribank.test',
                password: 'DevPassword123!',
                name: 'Free Student User',
                role: 'student',
                subscriptionTier: 'free',
                emailVerified: true,
                profile: {
                    university: 'University of Cambridge',
                    studyYear: 2,
                    interests: ['banking law', 'consumer rights'],
                    joinDate: '2024-01-15',
                    lastActive: new Date().toISOString()
                },
                progress: {
                    completedLessons: 5,
                    totalQuizzes: 12,
                    forumPosts: 8,
                    achievementPoints: 450
                }
            },
            premiumStudent: {
                userId: 'test_premium_001',
                email: 'student.premium@juribank.test',
                password: 'DevPassword123!',
                name: 'Premium Student User',
                role: 'student',
                subscriptionTier: 'premium',
                emailVerified: true,
                profile: {
                    university: 'University of Oxford',
                    studyYear: 3,
                    interests: ['financial regulation', 'banking disputes'],
                    joinDate: '2023-09-01',
                    upgradeDate: '2024-01-01',
                    lastActive: new Date().toISOString()
                },
                progress: {
                    completedLessons: 45,
                    totalQuizzes: 78,
                    forumPosts: 124,
                    achievementPoints: 2850,
                    certificatesEarned: 3
                }
            },
            moderator: {
                userId: 'test_mod_001',
                email: 'moderator@juribank.test',
                password: 'DevPassword123!',
                name: 'Community Moderator',
                role: 'moderator',
                subscriptionTier: 'premium',
                emailVerified: true,
                profile: {
                    university: 'King\'s College London',
                    studyYear: 'Graduate',
                    specialization: 'Financial Law',
                    joinDate: '2023-06-01',
                    lastActive: new Date().toISOString()
                },
                permissions: {
                    canModerateForum: true,
                    canAccessAnalytics: true,
                    canManageContent: true
                }
            },
            admin: {
                userId: 'test_admin_001',
                email: 'admin@juribank.test',
                password: 'DevPassword123!',
                name: 'Platform Administrator',
                role: 'admin',
                subscriptionTier: 'premium',
                emailVerified: true,
                profile: {
                    university: 'LSE',
                    position: 'Research Assistant',
                    joinDate: '2023-01-01',
                    lastActive: new Date().toISOString()
                },
                permissions: {
                    canModerateForum: true,
                    canAccessAnalytics: true,
                    canManageContent: true,
                    canManageUsers: true,
                    canAccessAdminPanel: true
                }
            }
        };
    }

    /**
     * Set up development console commands
     */
    setupDevelopmentConsole() {
        if (typeof window !== 'undefined') {
            window.JuriBankDev = {
                // Quick login functions
                loginAsFree: () => this.quickLogin('freeStudent'),
                loginAsPremium: () => this.quickLogin('premiumStudent'),
                loginAsModerator: () => this.quickLogin('moderator'),
                loginAsAdmin: () => this.quickLogin('admin'),
                
                // Test functions
                testAllFeatures: () => this.testAllFeatures(),
                testFreemiumLimits: () => this.testFreemiumLimits(),
                clearStorage: () => this.clearAllStorage(),
                simulateUpgrade: () => this.simulateUpgrade(),
                
                // Debug functions
                getStorageStats: () => this.getStorageStats(),
                validateSecurity: () => this.validateSecurity(),
                
                // Mock API functions
                enableMockAPI: () => this.enableMockAPI(),
                disableMockAPI: () => this.disableMockAPI(),
                setApiDelay: (ms) => this.setApiDelay(ms)
            };
        }
    }

    /**
     * Enable debug logging
     */
    enableDebugLogging() {
        if (this.debugMode) {
            const originalLog = console.log;
            console.log = (...args) => {
                const timestamp = new Date().toISOString();
                originalLog(`[${timestamp}]`, ...args);
            };
        }
    }

    /**
     * Create development UI panel
     */
    createDevelopmentUI() {
        if (typeof document !== 'undefined' && this.isDevelopment) {
            const devPanel = document.createElement('div');
            devPanel.id = 'juribank-dev-panel';
            devPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
                max-width: 300px;
                display: none;
            `;
            
            devPanel.innerHTML = `
                <div style="margin-bottom: 10px; font-weight: bold;">JuriBank Dev Panel</div>
                <button onclick="JuriBankDev.loginAsFree()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Login as Free</button>
                <button onclick="JuriBankDev.loginAsPremium()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Login as Premium</button>
                <button onclick="JuriBankDev.loginAsModerator()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Login as Mod</button>
                <button onclick="JuriBankDev.loginAsAdmin()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Login as Admin</button>
                <hr style="margin: 10px 0;">
                <button onclick="JuriBankDev.testAllFeatures()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Test Features</button>
                <button onclick="JuriBankDev.testFreemiumLimits()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Test Limits</button>
                <button onclick="JuriBankDev.clearStorage()" style="margin: 2px; padding: 4px 8px; font-size: 10px;">Clear Storage</button>
                <hr style="margin: 10px 0;">
                <div style="font-size: 10px; opacity: 0.7;">
                    Press Ctrl+D to toggle this panel<br>
                    Check console for JuriBankDev commands
                </div>
            `;
            
            document.body.appendChild(devPanel);
            
            // Toggle panel with Ctrl+D
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    devPanel.style.display = devPanel.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
    }

    /**
     * Quick login for testing
     */
    async quickLogin(userType) {
        const user = this.testUsers[userType];
        if (!user) {
            console.error('Unknown user type:', userType);
            return false;
        }
        
        console.log(`🚀 Quick login as ${userType}:`, user.email);
        
        // Simulate API login
        await this.simulateApiDelay();
        
        // Create session using existing session manager
        if (window.JuriBankSessionManager) {
            const sessionId = window.JuriBankSessionManager.createSession({
                userId: user.userId,
                email: user.email,
                role: user.role,
                ipAddress: '127.0.0.1',
                userAgent: navigator.userAgent
            });
            
            console.log('📝 Session created:', sessionId);
        }
        
        // Store user data using auth storage
        if (window.JuriBankAuthStorage) {
            window.JuriBankAuthStorage.setUserSession({
                sessionId: `dev_${Date.now()}`,
                userId: user.userId,
                email: user.email,
                role: user.role,
                tier: user.subscriptionTier
            });
            
            window.JuriBankAuthStorage.setUserProfile(user.profile);
            window.JuriBankAuthStorage.setLearningProgress(user.progress);
        }
        
        console.log('✅ Quick login completed for:', user.name);
        
        // Refresh page to apply changes
        if (confirm('Login successful! Refresh page to see changes?')) {
            window.location.reload();
        }
        
        return true;
    }

    /**
     * Test all feature access
     */
    testAllFeatures() {
        console.log('🧪 Testing all feature access...');
        
        if (window.JuriBankFreemiumController) {
            const controller = new window.JuriBankFreemiumController();
            const features = [
                'knowledgeHubAccess',
                'communityForumAccess',
                'basicClaimWizard',
                'fullClaimWizard',
                'premiumContent',
                'advancedTools',
                'exportFeatures'
            ];
            
            features.forEach(feature => {
                const status = controller.getFeatureStatus(feature);
                console.log(`${feature}:`, status);
            });
        }
    }

    /**
     * Test freemium limits
     */
    testFreemiumLimits() {
        console.log('🧪 Testing freemium limits...');
        
        if (window.JuriBankFreemiumController) {
            const controller = new window.JuriBankFreemiumController();
            const actions = [
                'monthlyQuestions',
                'forumPosts',
                'documentDownloads',
                'chatMessages',
                'assessmentAttempts'
            ];
            
            actions.forEach(action => {
                const status = controller.getActionStatus(action);
                console.log(`${action}:`, status);
                
                // Simulate some usage
                for (let i = 0; i < 3; i++) {
                    controller.recordUsage(action);
                }
            });
            
            console.log('Usage summary:', controller.getUsageSummary());
        }
    }

    /**
     * Clear all storage for testing
     */
    clearAllStorage() {
        if (confirm('Clear all JuriBank storage data?')) {
            if (window.JuriBankAuthStorage) {
                window.JuriBankAuthStorage.clearAll();
            }
            
            // Clear session manager
            if (window.JuriBankSessionManager) {
                window.JuriBankSessionManager.sessions.clear();
            }
            
            console.log('🧹 All storage cleared');
            
            if (confirm('Storage cleared! Refresh page?')) {
                window.location.reload();
            }
        }
    }

    /**
     * Simulate tier upgrade
     */
    simulateUpgrade() {
        if (window.JuriBankFreemiumController) {
            const controller = new window.JuriBankFreemiumController();
            const success = controller.simulateUpgrade('premium');
            
            if (success) {
                console.log('✅ Simulated upgrade to premium');
                if (confirm('Upgrade simulated! Refresh page to see changes?')) {
                    window.location.reload();
                }
            }
        }
    }

    /**
     * Get storage statistics
     */
    getStorageStats() {
        if (window.JuriBankAuthStorage) {
            const stats = window.JuriBankAuthStorage.getStorageStats();
            console.log('📊 Storage Statistics:', stats);
            return stats;
        }
    }

    /**
     * Validate security features
     */
    validateSecurity() {
        console.log('🔒 Validating security features...');
        
        const results = {
            sessionManager: !!window.JuriBankSessionManager,
            authStorage: !!window.JuriBankAuthStorage,
            freemiumController: !!window.JuriBankFreemiumController,
            httpsEnabled: window.location.protocol === 'https:',
            storageEncryption: window.JuriBankAuthStorage?.config?.encryptionEnabled,
            sessionTimeout: window.JuriBankSessionManager?.sessionConfig?.maxAge
        };
        
        console.log('Security validation results:', results);
        return results;
    }

    /**
     * Simulate API delay for realistic testing
     */
    async simulateApiDelay() {
        if (this.mockApiDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, this.mockApiDelay));
        }
    }

    /**
     * Enable mock API mode
     */
    enableMockAPI() {
        this.mockApiEnabled = true;
        console.log('🔧 Mock API enabled');
    }

    /**
     * Disable mock API mode
     */
    disableMockAPI() {
        this.mockApiEnabled = false;
        console.log('🔧 Mock API disabled');
    }

    /**
     * Set API delay for testing
     */
    setApiDelay(milliseconds) {
        this.mockApiDelay = Math.max(0, milliseconds);
        console.log(`🔧 API delay set to ${this.mockApiDelay}ms`);
    }

    /**
     * Generate development test data
     */
    generateTestData() {
        return {
            users: this.testUsers,
            sessions: this.generateTestSessions(),
            usage: this.generateTestUsage(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Generate test sessions
     */
    generateTestSessions() {
        const sessions = {};
        
        Object.entries(this.testUsers).forEach(([key, user]) => {
            sessions[key] = {
                sessionId: `test_session_${user.userId}`,
                userId: user.userId,
                created: Date.now() - (Math.random() * 3600000), // Within last hour
                lastActivity: Date.now() - (Math.random() * 300000), // Within last 5 minutes
                ipAddress: '127.0.0.1',
                userAgent: navigator.userAgent
            };
        });
        
        return sessions;
    }

    /**
     * Generate test usage data
     */
    generateTestUsage() {
        const usage = {};
        const actions = ['monthlyQuestions', 'forumPosts', 'documentDownloads', 'chatMessages'];
        
        Object.values(this.testUsers).forEach(user => {
            usage[user.userId] = {};
            actions.forEach(action => {
                usage[user.userId][action] = Math.floor(Math.random() * 10);
            });
        });
        
        return usage;
    }
}

// Initialize development configuration
const authDevConfig = new JuriBankAuthDevConfig();

// Export for use
if (typeof window !== 'undefined') {
    window.JuriBankAuthDevConfig = authDevConfig;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankAuthDevConfig;
}