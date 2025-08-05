/**
 * JuriBank Dashboard API v3.0
 * User progress tracking and educational milestone system
 * Manages user data, claims progress, and achievements
 */

class DashboardAPI {
    constructor() {
        this.apiBase = '/api/dashboard';
        this.userData = null;
        this.achievements = new Map();
        this.educationalMilestones = new Map();
        this.progressTrackers = new Map();
        
        this.initializeAchievements();
        this.initializeEducationalMilestones();
        this.startProgressTracking();
    }

    /**
     * Initialize achievement system
     */
    initializeAchievements() {
        this.achievementDefinitions = [
            {
                id: 'getting-started',
                title: 'Getting Started',
                description: 'Completed your first assessment',
                icon: 'rocket',
                points: 100,
                category: 'onboarding',
                requirements: {
                    assessments_completed: 1
                }
            },
            {
                id: 'knowledge-seeker',
                title: 'Knowledge Seeker',
                description: 'Saved your first educational resource',
                icon: 'bookmark',
                points: 50,
                category: 'learning',
                requirements: {
                    resources_saved: 1
                }
            },
            {
                id: 'community-helper',
                title: 'Community Helper',
                description: 'Helped 5 community members',
                icon: 'users',
                points: 250,
                category: 'community',
                requirements: {
                    helpful_replies: 5
                }
            },
            {
                id: 'claim-master',
                title: 'Claim Master',
                description: 'Successfully completed your first claim',
                icon: 'trophy',
                points: 500,
                category: 'success',
                requirements: {
                    claims_completed: 1
                }
            },
            {
                id: 'researcher',
                title: 'Research Expert',
                description: 'Browsed 25+ educational resources',
                icon: 'search',
                points: 150,
                category: 'learning',
                requirements: {
                    resources_viewed: 25
                }
            },
            {
                id: 'persistent',
                title: 'Never Give Up',
                description: 'Continued working on claims for 30 days',
                icon: 'calendar-check',
                points: 300,
                category: 'persistence',
                requirements: {
                    active_days: 30
                }
            },
            {
                id: 'mentor',
                title: 'Community Mentor',
                description: 'Top contributor with 20+ helpful responses',
                icon: 'graduation-cap',
                points: 750,
                category: 'community',
                requirements: {
                    helpful_replies: 20,
                    community_reputation: 100
                }
            },
            {
                id: 'financial-wizard',
                title: 'Financial Wizard',
                description: 'Successfully recovered over £5,000 in refunds',
                icon: 'coins',
                points: 1000,
                category: 'success',
                requirements: {
                    total_recovered: 5000
                }
            }
        ];

        // Initialize achievement tracking
        this.achievementDefinitions.forEach(achievement => {
            this.achievements.set(achievement.id, {
                ...achievement,
                unlocked: false,
                progress: {},
                unlockedDate: null
            });
        });
    }

    /**
     * Initialize educational milestone system
     */
    initializeEducationalMilestones() {
        this.milestoneDefinitions = [
            {
                id: 'basic-rights',
                title: 'Understanding Your Basic Rights',
                description: 'Learn fundamental consumer and financial rights',
                category: 'foundation',
                steps: [
                    'Read consumer rights guide',
                    'Complete basic rights quiz',
                    'Save 3 relevant resources'
                ],
                rewards: {
                    points: 100,
                    badge: 'rights-champion'
                }
            },
            {
                id: 'claim-process',
                title: 'Mastering the Claim Process',
                description: 'Complete understanding of how to make effective claims',
                category: 'practical',
                steps: [
                    'Complete eligibility assessment',
                    'Learn evidence gathering',
                    'Practice writing complaint letters',
                    'Understand escalation process'
                ],
                rewards: {
                    points: 250,
                    badge: 'claim-expert'
                }
            },
            {
                id: 'financial-literacy',
                title: 'Financial Services Literacy',
                description: 'Advanced understanding of financial products and regulations',
                category: 'advanced',
                steps: [
                    'Study FCA regulations',
                    'Learn about different financial products',
                    'Understand ombudsman process',
                    'Complete advanced case studies'
                ],
                rewards: {
                    points: 500,
                    badge: 'finance-scholar'
                }
            }
        ];

        // Initialize milestone tracking
        this.milestoneDefinitions.forEach(milestone => {
            this.educationalMilestones.set(milestone.id, {
                ...milestone,
                completed: false,
                currentStep: 0,
                completedSteps: [],
                startedDate: null,
                completedDate: null
            });
        });
    }

    /**
     * Start progress tracking
     */
    startProgressTracking() {
        // Track user actions for achievements and milestones
        this.trackedActions = {
            assessments_completed: 0,
            resources_saved: 0,
            resources_viewed: 0,
            helpful_replies: 0,
            claims_completed: 0,
            total_recovered: 0,
            active_days: 0,
            community_reputation: 0
        };

        // Start daily activity tracking
        this.startDailyTracking();
    }

    /**
     * Get user dashboard data
     */
    async getUserDashboard(userId = 'anonymous') {
        try {
            const userData = await this.loadUserData(userId);
            const stats = await this.calculateUserStats(userData);
            const achievements = await this.getUserAchievements(userId);
            const milestones = await this.getUserMilestones(userId);
            const recentActivity = await this.getRecentActivity(userId);
            const activeClaims = await this.getActiveClaims(userId);

            return {
                user: userData,
                stats: stats,
                achievements: achievements,
                milestones: milestones,
                recentActivity: recentActivity,
                activeClaims: activeClaims,
                recommendations: await this.getPersonalizedRecommendations(userData),
                nextActions: await this.getNextActions(userData)
            };

        } catch (error) {
            throw new Error('Failed to load dashboard: ' + error.message);
        }
    }

    /**
     * Update user progress
     */
    async updateProgress(userId, action, data = {}) {
        try {
            // Update tracked actions
            if (this.trackedActions.hasOwnProperty(action)) {
                this.trackedActions[action] += (data.increment || 1);
            }

            // Record activity
            await this.recordActivity(userId, action, data);

            // Check for achievement unlocks
            await this.checkAchievements(userId);

            // Check milestone progress
            await this.checkMilestones(userId);

            // Save progress
            await this.saveUserProgress(userId);

            return {
                success: true,
                newAchievements: await this.getNewAchievements(userId),
                milestoneUpdates: await this.getMilestoneUpdates(userId)
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Calculate user statistics
     */
    async calculateUserStats(userData) {
        const claims = userData.claims || [];
        const activeClaims = claims.filter(claim => claim.status !== 'completed');
        const completedClaims = claims.filter(claim => claim.status === 'completed');

        return {
            totalClaims: claims.length,
            activeClaims: activeClaims.length,
            completedClaims: completedClaims.length,
            totalPotentialRefund: claims.reduce((sum, claim) => sum + (claim.estimatedRefund || 0), 0),
            totalRecovered: completedClaims.reduce((sum, claim) => sum + (claim.actualRefund || 0), 0),
            averageClaimValue: claims.length > 0 ? claims.reduce((sum, claim) => sum + (claim.estimatedRefund || 0), 0) / claims.length : 0,
            successRate: completedClaims.length > 0 ? (completedClaims.filter(c => c.successful).length / completedClaims.length) * 100 : 0,
            assessmentsCompleted: this.trackedActions.assessments_completed,
            resourcesSaved: this.trackedActions.resources_saved,
            resourcesViewed: this.trackedActions.resources_viewed,
            communityContributions: this.trackedActions.helpful_replies,
            achievementsUnlocked: Array.from(this.achievements.values()).filter(a => a.unlocked).length,
            totalPoints: this.calculateTotalPoints(userData),
            currentLevel: this.calculateUserLevel(userData),
            daysActive: this.trackedActions.active_days
        };
    }

    /**
     * Check and unlock achievements
     */
    async checkAchievements(userId) {
        const newAchievements = [];

        for (const [id, achievement] of this.achievements) {
            if (achievement.unlocked) continue;

            let canUnlock = true;
            for (const [requirement, target] of Object.entries(achievement.requirements)) {
                if (this.trackedActions[requirement] < target) {
                    canUnlock = false;
                    break;
                }
            }

            if (canUnlock) {
                achievement.unlocked = true;
                achievement.unlockedDate = new Date();
                newAchievements.push(achievement);
                
                // Award points
                await this.awardPoints(userId, achievement.points);
                
                // Record achievement unlock activity
                await this.recordActivity(userId, 'achievement_unlocked', {
                    achievementId: id,
                    title: achievement.title,
                    points: achievement.points
                });
            }
        }

        return newAchievements;
    }

    /**
     * Check milestone progress
     */
    async checkMilestones(userId) {
        const updatedMilestones = [];

        for (const [id, milestone] of this.educationalMilestones) {
            if (milestone.completed) continue;

            // Update milestone progress based on user actions
            const progressUpdate = await this.updateMilestoneProgress(milestone, this.trackedActions);
            
            if (progressUpdate.updated) {
                updatedMilestones.push({
                    milestoneId: id,
                    ...progressUpdate
                });

                if (progressUpdate.completed) {
                    milestone.completed = true;
                    milestone.completedDate = new Date();
                    
                    // Award milestone rewards
                    await this.awardPoints(userId, milestone.rewards.points);
                    
                    // Record milestone completion
                    await this.recordActivity(userId, 'milestone_completed', {
                        milestoneId: id,
                        title: milestone.title,
                        points: milestone.rewards.points
                    });
                }
            }
        }

        return updatedMilestones;
    }

    /**
     * Update milestone progress
     */
    async updateMilestoneProgress(milestone, actions) {
        let updated = false;
        let completed = false;
        let newSteps = [];

        // Check each step based on milestone type
        milestone.steps.forEach((step, index) => {
            if (milestone.completedSteps.includes(index)) return;

            let stepCompleted = false;

            // Define step completion logic based on step content
            if (step.includes('assessment')) {
                stepCompleted = actions.assessments_completed > 0;
            } else if (step.includes('save') || step.includes('bookmark')) {
                stepCompleted = actions.resources_saved >= 3;
            } else if (step.includes('quiz')) {
                // Would check quiz completion in real implementation
                stepCompleted = false;
            } else if (step.includes('guide') || step.includes('read')) {
                stepCompleted = actions.resources_viewed >= 5;
            }

            if (stepCompleted && !milestone.completedSteps.includes(index)) {
                milestone.completedSteps.push(index);
                milestone.currentStep = Math.max(milestone.currentStep, index + 1);
                newSteps.push(index);
                updated = true;
            }
        });

        // Check if milestone is completed
        if (milestone.completedSteps.length === milestone.steps.length) {
            completed = true;
        }

        return {
            updated,
            completed,
            newSteps,
            currentStep: milestone.currentStep,
            progress: (milestone.completedSteps.length / milestone.steps.length) * 100
        };
    }

    /**
     * Get personalized recommendations
     */
    async getPersonalizedRecommendations(userData) {
        const recommendations = [];
        const stats = await this.calculateUserStats(userData);

        // Recommendation logic based on user behavior
        if (stats.assessmentsCompleted === 0) {
            recommendations.push({
                type: 'action',
                title: 'Start Your First Assessment',
                description: 'Complete an eligibility assessment to understand your potential claims',
                action: 'start-assessment',
                priority: 'high',
                icon: 'rocket'
            });
        }

        if (stats.resourcesSaved < 3) {
            recommendations.push({
                type: 'learning',
                title: 'Build Your Knowledge Base',
                description: 'Save important resources to reference during your claim process',
                action: 'browse-resources',
                priority: 'medium',
                icon: 'bookmark'
            });
        }

        if (stats.activeClaims > 0 && stats.communityContributions === 0) {
            recommendations.push({
                type: 'community',
                title: 'Share Your Experience',
                description: 'Help others by sharing your experience in the community forum',
                action: 'join-community',
                priority: 'low',
                icon: 'users'
            });
        }

        if (stats.assessmentsCompleted >= 2 && userData.accountType === 'free') {
            recommendations.push({
                type: 'upgrade',
                title: 'Unlock Full Potential',
                description: 'Upgrade to access all claim types and advanced tools',
                action: 'upgrade-account',
                priority: 'medium',
                icon: 'crown'
            });
        }

        return recommendations;
    }

    /**
     * Get next recommended actions
     */
    async getNextActions(userData) {
        const actions = [];
        const activeClaims = userData.claims?.filter(c => c.status !== 'completed') || [];

        // Next actions based on active claims
        activeClaims.forEach(claim => {
            if (claim.nextAction) {
                actions.push({
                    type: 'claim-progress',
                    claimId: claim.id,
                    title: claim.nextAction,
                    description: `Continue your ${claim.title} claim`,
                    dueDate: claim.nextActionDue,
                    priority: claim.priority || 'medium'
                });
            }
        });

        // Educational next actions
        const incompleteMilestones = Array.from(this.educationalMilestones.values())
            .filter(m => !m.completed)
            .sort((a, b) => a.currentStep - b.currentStep);

        if (incompleteMilestones.length > 0) {
            const nextMilestone = incompleteMilestones[0];
            const nextStepIndex = nextMilestone.currentStep;
            if (nextStepIndex < nextMilestone.steps.length) {
                actions.push({
                    type: 'education',
                    milestoneId: nextMilestone.id,
                    title: nextMilestone.steps[nextStepIndex],
                    description: `Next step in ${nextMilestone.title}`,
                    priority: 'low'
                });
            }
        }

        return actions.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    /**
     * Record user activity
     */
    async recordActivity(userId, type, data = {}) {
        const activity = {
            id: this.generateId(),
            userId: userId,
            type: type,
            data: data,
            timestamp: new Date()
        };

        // Store activity (in real implementation, would save to database)
        console.log('Activity recorded:', activity);

        return activity;
    }

    /**
     * Award points to user
     */
    async awardPoints(userId, points) {
        // In real implementation, would update user's point total
        console.log(`Awarded ${points} points to user ${userId}`);
    }

    /**
     * Calculate user's total points
     */
    calculateTotalPoints(userData) {
        let totalPoints = 0;
        
        // Points from achievements
        Array.from(this.achievements.values()).forEach(achievement => {
            if (achievement.unlocked) {
                totalPoints += achievement.points;
            }
        });

        // Points from milestones
        Array.from(this.educationalMilestones.values()).forEach(milestone => {
            if (milestone.completed) {
                totalPoints += milestone.rewards.points;
            }
        });

        return totalPoints;
    }

    /**
     * Calculate user level based on points
     */
    calculateUserLevel(userData) {
        const totalPoints = this.calculateTotalPoints(userData);
        
        // Level thresholds
        const levels = [
            { level: 1, points: 0, title: 'Beginner' },
            { level: 2, points: 100, title: 'Learning' },
            { level: 3, points: 300, title: 'Progressing' },
            { level: 4, points: 600, title: 'Experienced' },
            { level: 5, points: 1000, title: 'Expert' },
            { level: 6, points: 1500, title: 'Master' },
            { level: 7, points: 2500, title: 'Guru' }
        ];

        let currentLevel = levels[0];
        for (const level of levels) {
            if (totalPoints >= level.points) {
                currentLevel = level;
            } else {
                break;
            }
        }

        // Calculate progress to next level
        const nextLevelIndex = levels.findIndex(l => l.level === currentLevel.level + 1);
        const nextLevel = nextLevelIndex !== -1 ? levels[nextLevelIndex] : null;
        const progressToNext = nextLevel ? 
            ((totalPoints - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100 : 100;

        return {
            ...currentLevel,
            totalPoints,
            progressToNext: Math.min(progressToNext, 100),
            nextLevel
        };
    }

    /**
     * Start daily activity tracking
     */
    startDailyTracking() {
        // Track daily active users
        const today = new Date().toDateString();
        const lastActiveDate = localStorage.getItem('lastActiveDate');

        if (lastActiveDate !== today) {
            this.trackedActions.active_days += 1;
            localStorage.setItem('lastActiveDate', today);
        }
    }

    /**
     * Load user data
     */
    async loadUserData(userId) {
        // In real implementation, would load from database
        // For now, return mock data or load from localStorage
        const savedData = localStorage.getItem(`dashboard-${userId}`);
        
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.warn('Failed to parse saved user data');
            }
        }

        // Return default user data
        return {
            id: userId,
            accountType: 'free',
            memberSince: new Date(),
            claims: [],
            preferences: {}
        };
    }

    /**
     * Save user progress
     */
    async saveUserProgress(userId) {
        const progressData = {
            trackedActions: this.trackedActions,
            achievements: Array.from(this.achievements.entries()),
            milestones: Array.from(this.educationalMilestones.entries()),
            lastUpdated: new Date()
        };

        localStorage.setItem(`dashboard-progress-${userId}`, JSON.stringify(progressData));
    }

    /**
     * Get new achievements since last check
     */
    async getNewAchievements(userId) {
        // Return recently unlocked achievements
        return Array.from(this.achievements.values())
            .filter(a => a.unlocked && a.unlockedDate && 
                Date.now() - a.unlockedDate.getTime() < 24 * 60 * 60 * 1000); // Last 24 hours
    }

    /**
     * Get milestone updates since last check
     */
    async getMilestoneUpdates(userId) {
        // Return recently updated milestones
        return Array.from(this.educationalMilestones.values())
            .filter(m => m.completedDate && 
                Date.now() - m.completedDate.getTime() < 24 * 60 * 60 * 1000); // Last 24 hours
    }

    /**
     * Get user's recent activity
     */
    async getRecentActivity(userId) {
        // Mock recent activity - in real implementation would come from database
        return [
            {
                type: 'assessment_completed',
                title: 'Eligibility assessment completed',
                description: 'You may be eligible for a refund of up to £1,200',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                icon: 'check',
                color: 'green'
            },
            {
                type: 'resource_saved',
                title: 'Saved: New FCA Rules on Bank Charges',
                description: 'Important update that affects your current claim',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                icon: 'bookmark',
                color: 'blue'
            }
        ];
    }

    /**
     * Get user's active claims
     */
    async getActiveClaims(userId) {
        // Mock active claims - in real implementation would come from database
        return [
            {
                id: 'claim-1',
                type: 'bank-charges',
                title: 'Bank Charges Refund',
                institution: 'Barclays Bank',
                status: 'in-progress',
                progress: 60,
                currentStep: 3,
                totalSteps: 5,
                nextAction: 'Submit complaint to bank',
                estimatedRefund: 1247,
                startedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            }
        ];
    }

    /**
     * Utility methods
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize Dashboard API
const dashboardAPI = new DashboardAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardAPI;
}

// Make available globally
window.DashboardAPI = DashboardAPI;
window.dashboardAPI = dashboardAPI;