/**
 * JuriBank User Dashboard - Educational Progress Tracking System
 * Personal learning journey visualization with educational milestones
 * Student-focused legal education progress management
 */

class UserDashboard {
    constructor() {
        this.userId = null;
        this.userProfile = null;
        this.learningProgress = new Map();
        this.achievements = [];
        this.bookmarkedContent = [];
        this.subscriptionTier = 'free';
        this.dashboardContainer = null;
        
        // Learning path configuration
        this.learningPaths = {
            'banking-law-fundamentals': {
                title: 'Banking Law Fundamentals',
                description: 'Essential concepts in UK banking law and consumer rights',
                modules: [
                    { id: 'consumer-rights', title: 'Consumer Rights & Protection', duration: '2 hours', difficulty: 'beginner' },
                    { id: 'banking-complaints', title: 'Banking Complaints Process', duration: '1.5 hours', difficulty: 'beginner' },
                    { id: 'fca-regulations', title: 'FCA Regulations Overview', duration: '3 hours', difficulty: 'intermediate' },
                    { id: 'ombudsman-process', title: 'Ombudsman Service Process', duration: '2 hours', difficulty: 'intermediate' }
                ],
                estimatedTime: '8.5 hours',
                difficulty: 'beginner-intermediate',
                category: 'banking'
            },
            'financial-disputes': {
                title: 'Financial Disputes Resolution',
                description: 'Understanding how to resolve financial disputes through proper channels',
                modules: [
                    { id: 'dispute-types', title: 'Types of Financial Disputes', duration: '1 hour', difficulty: 'beginner' },
                    { id: 'evidence-gathering', title: 'Gathering Evidence', duration: '2 hours', difficulty: 'intermediate' },
                    { id: 'complaint-procedures', title: 'Formal Complaint Procedures', duration: '2.5 hours', difficulty: 'intermediate' },
                    { id: 'alternative-resolution', title: 'Alternative Dispute Resolution', duration: '2 hours', difficulty: 'advanced' }
                ],
                estimatedTime: '7.5 hours',
                difficulty: 'intermediate',
                category: 'disputes'
            },
            'investment-protection': {
                title: 'Investment & Pension Protection',
                description: 'Understanding FSCS protection and investment complaint processes',
                modules: [
                    { id: 'fscs-coverage', title: 'FSCS Coverage & Limits', duration: '1.5 hours', difficulty: 'beginner' },
                    { id: 'investment-complaints', title: 'Investment Complaint Process', duration: '2 hours', difficulty: 'intermediate' },
                    { id: 'pension-protection', title: 'Pension Protection Schemes', duration: '2.5 hours', difficulty: 'intermediate' },
                    { id: 'compensation-calculation', title: 'Compensation Calculations', duration: '3 hours', difficulty: 'advanced' }
                ],
                estimatedTime: '9 hours',
                difficulty: 'intermediate-advanced',
                category: 'investment'
            }
        };
        
        // Achievement system
        this.achievementSystem = {
            'first-steps': { title: 'First Steps', description: 'Complete your first learning module', icon: 'fa-baby', points: 10 },
            'knowledge-seeker': { title: 'Knowledge Seeker', description: 'Complete 5 learning modules', icon: 'fa-search', points: 50 },
            'law-scholar': { title: 'Law Scholar', description: 'Complete an entire learning path', icon: 'fa-graduation-cap', points: 100 },
            'community-helper': { title: 'Community Helper', description: 'Help others in the forum (5+ helpful reactions)', icon: 'fa-hands-helping', points: 75 },
            'content-curator': { title: 'Content Curator', description: 'Bookmark 10+ educational resources', icon: 'fa-bookmark', points: 25 },
            'persistent-learner': { title: 'Persistent Learner', description: 'Learn for 7 consecutive days', icon: 'fa-calendar-check', points: 60 },
            'advanced-learner': { title: 'Advanced Learner', description: 'Complete an advanced-level module', icon: 'fa-medal', points: 80 },
            'mentor': { title: 'Mentor', description: 'Share knowledge that helps 10+ people', icon: 'fa-chalkboard-teacher', points: 150 }
        };
        
        this.init();
    }
    
    init() {
        this.loadUserProfile();
        this.setupDashboardContainer();
        this.loadProgressData();
        this.renderDashboard();
        this.setupEventListeners();
        this.startProgressTracking();
        this.checkAchievements();
    }
    
    async loadUserProfile() {
        try {
            const sessionId = localStorage.getItem('userSessionId');
            if (!sessionId) {
                await this.createUserSession();
                return;
            }
            
            // Simulate API call to load user profile
            const profileData = this.loadLocalUserProfile() || await this.createUserSession();
            this.userProfile = profileData;
            this.userId = profileData.id;
            this.subscriptionTier = profileData.subscriptionTier || 'free';
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            await this.createUserSession();
        }
    }
    
    loadLocalUserProfile() {
        const stored = localStorage.getItem('userProfile');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                return null;
            }
        }
        return null;
    }
    
    async createUserSession() {
        const newUser = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            email: null,
            isAnonymous: true,
            registrationDate: new Date().toISOString(),
            subscriptionTier: 'free',
            preferences: {
                emailNotifications: false,
                progressReminders: true,
                weeklyDigest: false
            },
            learningGoals: [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        this.userProfile = newUser;
        this.userId = newUser.id;
        this.subscriptionTier = 'free';
        
        // Save to localStorage
        localStorage.setItem('userSessionId', newUser.id);
        localStorage.setItem('userProfile', JSON.stringify(newUser));
        
        return newUser;
    }
    
    setupDashboardContainer() {
        // Find or create dashboard container
        this.dashboardContainer = document.getElementById('dashboard-container') || this.createDashboardContainer();
    }
    
    createDashboardContainer() {
        const container = document.createElement('div');
        container.id = 'dashboard-container';
        container.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8';
        
        // Insert into page
        const mainContent = document.querySelector('main') || document.body;
        mainContent.appendChild(container);
        
        return container;
    }
    
    async loadProgressData() {
        try {
            // Load from localStorage for demo purposes
            const progressData = localStorage.getItem(`progress_${this.userId}`);
            const achievementsData = localStorage.getItem(`achievements_${this.userId}`);
            const bookmarksData = localStorage.getItem(`bookmarks_${this.userId}`);
            
            if (progressData) {
                const parsed = JSON.parse(progressData);
                this.learningProgress = new Map(parsed.entries || []);
            }
            
            if (achievementsData) {
                this.achievements = JSON.parse(achievementsData);
            }
            
            if (bookmarksData) {
                this.bookmarkedContent = JSON.parse(bookmarksData);
            }
            
        } catch (error) {
            console.error('Error loading progress data:', error);
            this.initializeDefaultProgress();
        }
    }
    
    initializeDefaultProgress() {
        // Initialize with some sample progress for demo
        Object.keys(this.learningPaths).forEach(pathId => {
            this.learningProgress.set(pathId, {
                completedModules: [],
                currentModule: null,
                startedDate: new Date().toISOString(),
                lastAccessDate: null,
                timeSpent: 0,
                overallProgress: 0
            });
        });
        
        this.saveProgressData();
    }
    
    renderDashboard() {
        if (!this.dashboardContainer) return;
        
        const dashboardHTML = `
            <div class="space-y-8">
                ${this.renderDashboardHeader()}
                ${this.renderProgressOverview()}
                ${this.renderLearningPaths()}
                ${this.renderAchievements()}
                ${this.renderBookmarkedContent()}
                ${this.renderSubscriptionStatus()}
            </div>
        `;
        
        this.dashboardContainer.innerHTML = dashboardHTML;
        this.attachEventListeners();
    }
    
    renderDashboardHeader() {
        const totalModules = Object.values(this.learningPaths).reduce((acc, path) => acc + path.modules.length, 0);
        const completedModules = Array.from(this.learningProgress.values()).reduce((acc, progress) => 
            acc + progress.completedModules.length, 0);
        const overallProgress = Math.round((completedModules / totalModules) * 100);
        
        return `
            <div class="bg-gradient-to-br from-student-blue to-student-green rounded-2xl p-8 text-white">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div class="mb-6 md:mb-0">
                        <h1 class="text-3xl font-bold mb-2">Learning Dashboard</h1>
                        <p class="text-blue-100 mb-4">Track your progress through UK legal education resources</p>
                        <div class="flex items-center space-x-6 text-sm">
                            <div class="flex items-center">
                                <i class="fas fa-book-open mr-2"></i>
                                <span>${completedModules}/${totalModules} Modules Completed</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-trophy mr-2"></i>
                                <span>${this.achievements.length} Achievements</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-bookmark mr-2"></i>
                                <span>${this.bookmarkedContent.length} Bookmarks</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <div class="relative w-24 h-24 mx-auto mb-3">
                            <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.2)" stroke-width="8" fill="transparent"/>
                                <circle cx="50" cy="50" r="40" stroke="white" stroke-width="8" fill="transparent"
                                        stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * overallProgress / 100)}"
                                        class="transition-all duration-1000 ease-in-out"/>
                            </svg>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-2xl font-bold">${overallProgress}%</span>
                            </div>
                        </div>
                        <p class="text-blue-100">Overall Progress</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderProgressOverview() {
        const recentActivity = this.getRecentActivity();
        const upcomingGoals = this.getUpcomingGoals();
        
        return `
            <div class="grid md:grid-cols-2 gap-8">
                <!-- Recent Activity -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-clock text-student-blue mr-2"></i>
                        Recent Activity
                    </h3>
                    <div class="space-y-3">
                        ${recentActivity.length > 0 ? recentActivity.map(activity => `
                            <div class="flex items-start space-x-3">
                                <div class="w-2 h-2 bg-student-green rounded-full mt-2"></div>
                                <div>
                                    <p class="text-sm text-gray-900">${activity.title}</p>
                                    <p class="text-xs text-gray-500">${activity.timeAgo}</p>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="text-center py-4">
                                <i class="fas fa-book text-gray-300 text-2xl mb-2"></i>
                                <p class="text-gray-500 text-sm">No recent activity</p>
                                <button onclick="userDashboard.startLearning()" class="text-student-blue text-sm font-medium mt-2 hover:underline">
                                    Start Learning
                                </button>
                            </div>
                        `}
                    </div>
                </div>
                
                <!-- Learning Goals -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-target text-student-blue mr-2"></i>
                        Learning Goals
                    </h3>
                    <div class="space-y-3">
                        ${upcomingGoals.length > 0 ? upcomingGoals.map(goal => `
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p class="text-sm font-medium text-gray-900">${goal.title}</p>
                                    <p class="text-xs text-gray-500">${goal.description}</p>
                                </div>
                                <div class="w-16 h-2 bg-gray-200 rounded-full">
                                    <div class="h-2 bg-student-green rounded-full" style="width: ${goal.progress}%"></div>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="text-center py-4">
                                <i class="fas fa-bullseye text-gray-300 text-2xl mb-2"></i>
                                <p class="text-gray-500 text-sm">No learning goals set</p>
                                <button onclick="userDashboard.setLearningGoals()" class="text-student-blue text-sm font-medium mt-2 hover:underline">
                                    Set Goals
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderLearningPaths() {
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold text-gray-900">Learning Paths</h3>
                    <div class="flex items-center space-x-2">
                        <select id="path-filter" class="text-sm border border-gray-300 rounded-lg px-3 py-2">
                            <option value="all">All Paths</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="not-started">Not Started</option>
                        </select>
                    </div>
                </div>
                
                <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    ${Object.entries(this.learningPaths).map(([pathId, path]) => 
                        this.renderLearningPathCard(pathId, path)
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    renderLearningPathCard(pathId, path) {
        const progress = this.learningProgress.get(pathId) || { completedModules: [], overallProgress: 0 };
        const completedCount = progress.completedModules.length;
        const totalCount = path.modules.length;
        const progressPercent = Math.round((completedCount / totalCount) * 100);
        const isCompleted = completedCount === totalCount;
        const isStarted = completedCount > 0;
        
        const difficultyColor = {
            'beginner': 'bg-green-100 text-green-800',
            'beginner-intermediate': 'bg-blue-100 text-blue-800',
            'intermediate': 'bg-yellow-100 text-yellow-800',
            'intermediate-advanced': 'bg-orange-100 text-orange-800',
            'advanced': 'bg-red-100 text-red-800'
        };
        
        return `
            <div class="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer learning-path-card" 
                 data-path-id="${pathId}" onclick="userDashboard.viewLearningPath('${pathId}')">
                
                <!-- Path Header -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 mb-2">${path.title}</h4>
                        <p class="text-sm text-gray-600 mb-3">${path.description}</p>
                        
                        <div class="flex items-center space-x-3 text-xs">
                            <span class="flex items-center text-gray-500">
                                <i class="fas fa-clock mr-1"></i>
                                ${path.estimatedTime}
                            </span>
                            <span class="inline-block px-2 py-1 ${difficultyColor[path.difficulty] || 'bg-gray-100 text-gray-800'} rounded-full">
                                ${path.difficulty}
                            </span>
                        </div>
                    </div>
                    
                    ${isCompleted ? `
                        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-check text-green-600"></i>
                        </div>
                    ` : isStarted ? `
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-play text-blue-600"></i>
                        </div>
                    ` : `
                        <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-book text-gray-400"></i>
                        </div>
                    `}
                </div>
                
                <!-- Progress Bar -->
                <div class="mb-4">
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="text-gray-600">Progress</span>
                        <span class="font-medium text-gray-900">${completedCount}/${totalCount} modules</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full transition-all duration-500 ${
                            progressPercent === 100 ? 'bg-green-500' : 
                            progressPercent > 0 ? 'bg-student-blue' : 'bg-gray-300'
                        }" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                
                <!-- Module Preview -->
                <div class="space-y-2">
                    ${path.modules.slice(0, 3).map(module => {
                        const isModuleCompleted = progress.completedModules.includes(module.id);
                        return `
                            <div class="flex items-center text-sm">
                                <i class="fas fa-${isModuleCompleted ? 'check-circle text-green-500' : 'circle text-gray-300'} mr-2"></i>
                                <span class="${isModuleCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}">${module.title}</span>
                            </div>
                        `;
                    }).join('')}
                    ${path.modules.length > 3 ? `<div class="text-xs text-gray-500">+${path.modules.length - 3} more modules</div>` : ''}
                </div>
                
                <!-- Action Button -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <button class="w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isCompleted ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        isStarted ? 'bg-student-blue text-white hover:bg-blue-700' :
                        'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }" onclick="event.stopPropagation(); userDashboard.${isCompleted ? 'reviewPath' : isStarted ? 'continuePath' : 'startPath'}('${pathId}')">
                        ${isCompleted ? 'Review Path' : isStarted ? 'Continue Learning' : 'Start Path'}
                    </button>
                </div>
            </div>
        `;
    }
    
    renderAchievements() {
        const recentAchievements = this.achievements.slice(-3);
        const availableAchievements = Object.entries(this.achievementSystem).filter(([id]) => 
            !this.achievements.find(a => a.id === id)
        ).slice(0, 3);
        
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <i class="fas fa-trophy text-student-orange mr-2"></i>
                    Achievements
                </h3>
                
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Recent Achievements -->
                    <div>
                        <h4 class="font-medium text-gray-700 mb-3">Recently Earned</h4>
                        <div class="space-y-3">
                            ${recentAchievements.length > 0 ? recentAchievements.map(achievement => {
                                const achievementData = this.achievementSystem[achievement.id];
                                return `
                                    <div class="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                        <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3">
                                            <i class="fas ${achievementData.icon} text-white"></i>
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">${achievementData.title}</p>
                                            <p class="text-sm text-gray-600">${achievementData.description}</p>
                                            <p class="text-xs text-orange-600 font-medium">${achievementData.points} points</p>
                                        </div>
                                    </div>
                                `;
                            }).join('') : `
                                <div class="text-center py-6">
                                    <i class="fas fa-medal text-gray-300 text-2xl mb-2"></i>
                                    <p class="text-gray-500 text-sm">No achievements yet</p>
                                    <p class="text-gray-400 text-xs">Complete modules to earn your first achievement!</p>
                                </div>
                            `}
                        </div>
                    </div>
                    
                    <!-- Available Achievements -->
                    <div>
                        <h4 class="font-medium text-gray-700 mb-3">Available to Earn</h4>
                        <div class="space-y-3">
                            ${availableAchievements.map(([id, achievement]) => `
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                        <i class="fas ${achievement.icon} text-gray-400"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-700">${achievement.title}</p>
                                        <p class="text-sm text-gray-500">${achievement.description}</p>
                                        <p class="text-xs text-gray-400 font-medium">${achievement.points} points</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderBookmarkedContent() {
        const recentBookmarks = this.bookmarkedContent.slice(-5);
        
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold text-gray-900 flex items-center">
                        <i class="fas fa-bookmark text-student-blue mr-2"></i>
                        Bookmarked Resources
                    </h3>
                    <button onclick="userDashboard.viewAllBookmarks()" class="text-student-blue hover:text-blue-700 text-sm font-medium">
                        View All (${this.bookmarkedContent.length})
                    </button>
                </div>
                
                ${recentBookmarks.length > 0 ? `
                    <div class="space-y-3">
                        ${recentBookmarks.map(bookmark => `
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div class="w-8 h-8 bg-student-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-${bookmark.type === 'article' ? 'file-alt' : bookmark.type === 'video' ? 'play' : 'book'} text-student-blue text-sm"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900 text-sm mb-1">${bookmark.title}</h4>
                                    <p class="text-xs text-gray-600 mb-2">${bookmark.description}</p>
                                    <div class="flex items-center space-x-3 text-xs text-gray-500">
                                        <span>${bookmark.category}</span>
                                        <span>•</span>
                                        <span>${bookmark.timeAgo}</span>
                                    </div>
                                </div>
                                <button onclick="userDashboard.removeBookmark('${bookmark.id}')" class="text-gray-400 hover:text-red-500">
                                    <i class="fas fa-times text-sm"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8">
                        <i class="fas fa-bookmark text-gray-300 text-3xl mb-3"></i>
                        <h4 class="font-medium text-gray-700 mb-2">No bookmarks yet</h4>
                        <p class="text-gray-500 text-sm mb-4">Save useful resources as you explore our knowledge hub</p>
                        <button onclick="window.location.href='knowledge-hub.html'" class="bg-student-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Browse Knowledge Hub
                        </button>
                    </div>
                `}
            </div>
        `;
    }
    
    renderSubscriptionStatus() {
        const tierInfo = {
            'free': {
                title: 'Free Account',
                description: 'Access to basic educational resources',
                color: 'bg-gray-100 text-gray-800',
                features: ['Basic learning modules', '3 bookmarks', 'Community forum access'],
                limitations: ['Limited advanced content', 'No offline access', 'Basic support']
            },
            'student': {
                title: 'Student Plan',
                description: 'Enhanced learning with premium features',
                color: 'bg-blue-100 text-blue-800',
                features: ['All learning modules', 'Unlimited bookmarks', 'Priority support', 'Offline access'],
                limitations: ['Limited mentorship sessions']
            },
            'premium': {
                title: 'Premium Plan',
                description: 'Full access to all educational resources',
                color: 'bg-green-100 text-green-800',
                features: ['Everything in Student', 'One-on-one mentorship', 'Custom learning paths', 'Certificate programs'],
                limitations: []
            }
        };
        
        const currentTier = tierInfo[this.subscriptionTier];
        const isFreeTier = this.subscriptionTier === 'free';
        
        return `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Subscription Status</h3>
                        <span class="inline-block px-3 py-1 ${currentTier.color} rounded-full text-sm font-medium">
                            ${currentTier.title}
                        </span>
                    </div>
                    ${isFreeTier ? `
                        <button onclick="userDashboard.upgradeAccount()" class="bg-student-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Upgrade Account
                        </button>
                    ` : `
                        <button onclick="userDashboard.manageSubscription()" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                            Manage Subscription
                        </button>
                    `}
                </div>
                
                <p class="text-gray-600 mb-4">${currentTier.description}</p>
                
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-medium text-gray-700 mb-2">Included Features</h4>
                        <ul class="space-y-1 text-sm">
                            ${currentTier.features.map(feature => `
                                <li class="flex items-center text-green-600">
                                    <i class="fas fa-check mr-2"></i>
                                    <span>${feature}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    ${currentTier.limitations.length > 0 ? `
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Limitations</h4>
                            <ul class="space-y-1 text-sm">
                                ${currentTier.limitations.map(limitation => `
                                    <li class="flex items-center text-gray-500">
                                        <i class="fas fa-minus mr-2"></i>
                                        <span>${limitation}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                ${isFreeTier ? `
                    <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div class="flex items-start">
                            <i class="fas fa-lightbulb text-blue-600 mr-3 mt-1"></i>
                            <div>
                                <h4 class="font-medium text-blue-900 mb-1">Unlock More Learning</h4>
                                <p class="text-blue-800 text-sm mb-3">Upgrade to access advanced modules, unlimited bookmarks, and priority support from our law student mentors.</p>
                                <button onclick="userDashboard.viewUpgradeOptions()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View Upgrade Options →
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Event handling methods
    setupEventListeners() {
        // Filter changes
        document.addEventListener('change', (e) => {
            if (e.target.id === 'path-filter') {
                this.filterLearningPaths(e.target.value);
            }
        });
        
        // Window focus event to update recent activity
        window.addEventListener('focus', () => {
            this.refreshRecentActivity();
        });
    }
    
    attachEventListeners() {
        // Path filter
        const pathFilter = document.getElementById('path-filter');
        if (pathFilter) {
            pathFilter.addEventListener('change', (e) => {
                this.filterLearningPaths(e.target.value);
            });
        }
    }
    
    // Helper methods for data management
    getRecentActivity() {
        // Mock recent activity data
        const activities = [
            { title: 'Completed "Consumer Rights & Protection" module', timeAgo: '2 hours ago', type: 'completion' },
            { title: 'Started "Banking Law Fundamentals" learning path', timeAgo: '1 day ago', type: 'start' },
            { title: 'Bookmarked "FCA Regulations Guide"', timeAgo: '3 days ago', type: 'bookmark' },
            { title: 'Earned "First Steps" achievement', timeAgo: '1 week ago', type: 'achievement' }
        ];
        
        return activities.slice(0, 5);
    }
    
    getUpcomingGoals() {
        // Mock learning goals
        return [
            { title: 'Complete Banking Law Fundamentals', description: 'Finish remaining 2 modules', progress: 75 },
            { title: 'Earn Knowledge Seeker badge', description: '2 more modules to complete', progress: 60 },
            { title: 'Master Financial Disputes', description: 'Start new learning path', progress: 0 }
        ];
    }
    
    // Action methods
    viewLearningPath(pathId) {
        const path = this.learningPaths[pathId];
        if (!path) return;
        
        // Create detailed learning path view
        this.showLearningPathModal(pathId, path);
    }
    
    showLearningPathModal(pathId, path) {
        const progress = this.learningProgress.get(pathId) || { completedModules: [], overallProgress: 0 };
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">${path.title}</h2>
                            <p class="text-gray-600 mb-4">${path.description}</p>
                            <div class="flex items-center space-x-4 text-sm">
                                <span class="flex items-center text-gray-500">
                                    <i class="fas fa-clock mr-1"></i>
                                    ${path.estimatedTime}
                                </span>
                                <span class="flex items-center text-gray-500">
                                    <i class="fas fa-layer-group mr-1"></i>
                                    ${path.modules.length} modules
                                </span>
                                <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    ${path.difficulty}
                                </span>
                            </div>
                        </div>
                        <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- Modules List -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-900">Learning Modules</h3>
                        ${path.modules.map((module, index) => {
                            const isCompleted = progress.completedModules.includes(module.id);
                            const isAvailable = index === 0 || progress.completedModules.includes(path.modules[index - 1].id);
                            
                            return `
                                <div class="border border-gray-200 rounded-lg p-4 ${isCompleted ? 'bg-green-50' : isAvailable ? 'bg-white' : 'bg-gray-50'}">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-10 h-10 rounded-full flex items-center justify-center ${
                                                isCompleted ? 'bg-green-100' : isAvailable ? 'bg-blue-100' : 'bg-gray-100'
                                            }">
                                                <i class="fas fa-${
                                                    isCompleted ? 'check text-green-600' : 
                                                    isAvailable ? 'play text-blue-600' : 
                                                    'lock text-gray-400'
                                                }"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-medium text-gray-900">${module.title}</h4>
                                                <div class="flex items-center space-x-3 text-sm text-gray-500">
                                                    <span>${module.duration}</span>
                                                    <span>•</span>
                                                    <span>${module.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="flex items-center space-x-2">
                                            ${isCompleted ? `
                                                <button onclick="userDashboard.reviewModule('${pathId}', '${module.id}')" class="text-green-600 hover:text-green-700 text-sm font-medium">
                                                    Review
                                                </button>
                                            ` : isAvailable ? `
                                                <button onclick="userDashboard.startModule('${pathId}', '${module.id}')" class="bg-student-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                                                    ${index === 0 && progress.completedModules.length === 0 ? 'Start Learning' : 'Continue'}
                                                </button>
                                            ` : `
                                                <span class="text-gray-400 text-sm">Complete previous modules</span>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    startModule(pathId, moduleId) {
        // Simulate starting a learning module
        const path = this.learningPaths[pathId];
        const module = path.modules.find(m => m.id === moduleId);
        
        if (!module) return;
        
        // Update progress
        const progress = this.learningProgress.get(pathId) || { completedModules: [], currentModule: null, startedDate: new Date().toISOString(), lastAccessDate: null, timeSpent: 0, overallProgress: 0 };
        progress.currentModule = moduleId;
        progress.lastAccessDate = new Date().toISOString();
        this.learningProgress.set(pathId, progress);
        
        // Save progress
        this.saveProgressData();
        
        // Show learning interface (simulate)
        alert(`Starting module: ${module.title}\n\nThis would open the interactive learning interface with educational content, exercises, and progress tracking.`);
        
        // Simulate completion after a delay (for demo purposes)
        setTimeout(() => {
            this.completeModule(pathId, moduleId);
        }, 3000);
    }
    
    completeModule(pathId, moduleId) {
        const progress = this.learningProgress.get(pathId);
        if (!progress || progress.completedModules.includes(moduleId)) return;
        
        // Mark module as completed
        progress.completedModules.push(moduleId);
        progress.currentModule = null;
        progress.lastAccessDate = new Date().toISOString();
        
        // Update overall progress
        const path = this.learningPaths[pathId];
        progress.overallProgress = Math.round((progress.completedModules.length / path.modules.length) * 100);
        
        this.learningProgress.set(pathId, progress);
        this.saveProgressData();
        
        // Check for achievements
        this.checkAchievements();
        
        // Refresh dashboard
        this.renderDashboard();
        
        // Show completion notification
        this.showNotification(`Module completed! Well done on finishing "${path.modules.find(m => m.id === moduleId)?.title}".`, 'success');
    }
    
    checkAchievements() {
        const totalCompleted = Array.from(this.learningProgress.values()).reduce((acc, progress) => acc + progress.completedModules.length, 0);
        const completedPaths = Array.from(this.learningProgress.values()).filter(progress => {
            const pathId = Array.from(this.learningProgress.keys()).find(key => this.learningProgress.get(key) === progress);
            const path = this.learningPaths[pathId];
            return path && progress.completedModules.length === path.modules.length;
        }).length;
        
        // Check for achievements
        const newAchievements = [];
        
        if (totalCompleted >= 1 && !this.achievements.find(a => a.id === 'first-steps')) {
            newAchievements.push({ id: 'first-steps', earnedDate: new Date().toISOString() });
        }
        
        if (totalCompleted >= 5 && !this.achievements.find(a => a.id === 'knowledge-seeker')) {
            newAchievements.push({ id: 'knowledge-seeker', earnedDate: new Date().toISOString() });
        }
        
        if (completedPaths >= 1 && !this.achievements.find(a => a.id === 'law-scholar')) {
            newAchievements.push({ id: 'law-scholar', earnedDate: new Date().toISOString() });
        }
        
        if (this.bookmarkedContent.length >= 10 && !this.achievements.find(a => a.id === 'content-curator')) {
            newAchievements.push({ id: 'content-curator', earnedDate: new Date().toISOString() });
        }
        
        // Add new achievements
        if (newAchievements.length > 0) {
            this.achievements.push(...newAchievements);
            this.saveProgressData();
            
            // Show achievement notifications
            newAchievements.forEach(achievement => {
                const achievementData = this.achievementSystem[achievement.id];
                this.showAchievementNotification(achievementData);
            });
        }
    }
    
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <i class="fas ${achievement.icon} text-white"></i>
                </div>
                <div>
                    <h4 class="font-bold">Achievement Unlocked!</h4>
                    <p class="text-sm">${achievement.title}</p>
                    <p class="text-xs opacity-90">+${achievement.points} points</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    saveProgressData() {
        try {
            localStorage.setItem(`progress_${this.userId}`, JSON.stringify({
                entries: Array.from(this.learningProgress.entries())
            }));
            localStorage.setItem(`achievements_${this.userId}`, JSON.stringify(this.achievements));
            localStorage.setItem(`bookmarks_${this.userId}`, JSON.stringify(this.bookmarkedContent));
        } catch (error) {
            console.error('Error saving progress data:', error);
        }
    }
    
    startProgressTracking() {
        // Track time spent learning
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            // Update total time spent (this would be sent to backend in real app)
            console.log('Session time:', Math.round(timeSpent / 1000), 'seconds');
        });
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
    
    // Additional utility methods can be added here...
    filterLearningPaths(filter) {
        const pathCards = document.querySelectorAll('.learning-path-card');
        
        pathCards.forEach(card => {
            const pathId = card.dataset.pathId;
            const progress = this.learningProgress.get(pathId);
            const path = this.learningPaths[pathId];
            
            let show = true;
            
            if (filter === 'in-progress') {
                show = progress && progress.completedModules.length > 0 && progress.completedModules.length < path.modules.length;
            } else if (filter === 'completed') {
                show = progress && progress.completedModules.length === path.modules.length;
            } else if (filter === 'not-started') {
                show = !progress || progress.completedModules.length === 0;
            }
            
            card.style.display = show ? 'block' : 'none';
        });
    }
}

// Initialize user dashboard
let userDashboard;

document.addEventListener('DOMContentLoaded', () => {
    userDashboard = new UserDashboard();
});

// Export for global access
if (typeof window !== 'undefined') {
    window.userDashboard = userDashboard;
}