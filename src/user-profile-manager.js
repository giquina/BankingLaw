/**
 * JuriBank User Profile Manager
 * Manages user profiles and educational progress tracking
 */

class JuriBankUserProfileManager {
    constructor(storage = null, authMiddleware = null) {
        this.storage = storage;
        this.authMiddleware = authMiddleware;
        this.currentProfile = null;
        this.progressData = null;
        
        this.initializeProfileManager();
    }

    /**
     * Initialize profile manager
     */
    initializeProfileManager() {
        this.loadUserProfile();
        this.loadProgressData();
        this.setupProgressTracking();
        
        console.log('👤 JuriBank User Profile Manager initialized');
    }

    /**
     * Load user profile from storage
     */
    loadUserProfile() {
        if (this.storage) {
            this.currentProfile = this.storage.getUserProfile();
            this.progressData = this.storage.getLearningProgress();
        }
    }

    /**
     * Load progress data
     */
    loadProgressData() {
        if (!this.progressData) {
            this.progressData = this.createDefaultProgressData();
            this.saveProgressData();
        }
    }

    /**
     * Create default progress data structure
     */
    createDefaultProgressData() {
        return {
            // Learning Progress
            completedLessons: 0,
            totalQuizzes: 0,
            passedQuizzes: 0,
            studyTimeMinutes: 0,
            streakDays: 0,
            lastStudyDate: null,
            
            // Achievement Points
            totalPoints: 0,
            pointsThisWeek: 0,
            pointsThisMonth: 0,
            
            // Course Progress
            courses: {
                'banking-law-basics': {
                    name: 'Banking Law Basics',
                    progress: 0,
                    lessonsCompleted: 0,
                    totalLessons: 12,
                    startDate: null,
                    completionDate: null
                },
                'consumer-rights': {
                    name: 'Consumer Rights & Protection',
                    progress: 0,
                    lessonsCompleted: 0,
                    totalLessons: 8,
                    startDate: null,
                    completionDate: null
                },
                'financial-regulation': {
                    name: 'Financial Regulation Overview',
                    progress: 0,
                    lessonsCompleted: 0,
                    totalLessons: 15,
                    startDate: null,
                    completionDate: null
                }
            },
            
            // Activities
            activities: {
                forumPosts: 0,
                questionsAsked: 0,
                documentsDownloaded: 0,
                chatMessages: 0,
                assessmentAttempts: 0,
                professionalConsultations: 0
            },
            
            // Achievements
            achievements: [],
            badges: [],
            
            // Learning Path
            currentPath: 'beginner',
            recommendedNextSteps: [],
            
            // Preferences
            learningGoals: [],
            studySchedule: {
                preferredDays: [],
                preferredTime: null,
                dailyGoalMinutes: 30
            },
            
            // Analytics
            weeklyStats: this.initializeWeeklyStats(),
            monthlyStats: this.initializeMonthlyStats(),
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Initialize weekly stats
     */
    initializeWeeklyStats() {
        const stats = {};
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            stats[dateKey] = {
                studyMinutes: 0,
                lessonsCompleted: 0,
                pointsEarned: 0,
                activitiesCompleted: 0
            };
        }
        
        return stats;
    }

    /**
     * Initialize monthly stats
     */
    initializeMonthlyStats() {
        const stats = {};
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            
            stats[dateKey] = {
                studyMinutes: 0,
                activitiesCompleted: 0,
                pointsEarned: 0
            };
        }
        
        return stats;
    }

    /**
     * Update user profile
     */
    async updateProfile(profileUpdates) {
        try {
            if (!this.currentProfile) {
                this.currentProfile = this.createDefaultProfile();
            }
            
            // Merge updates
            this.currentProfile = {
                ...this.currentProfile,
                ...profileUpdates,
                lastUpdated: new Date().toISOString()
            };
            
            // Save to storage
            if (this.storage) {
                this.storage.setUserProfile(this.currentProfile);
            }
            
            // Update via API if available
            if (this.authMiddleware && this.authMiddleware.currentUser) {
                await this.authMiddleware.updateProfile(profileUpdates);
            }
            
            this.logProfileEvent('profile_updated', { fields: Object.keys(profileUpdates) });
            
            return { success: true, profile: this.currentProfile };
            
        } catch (error) {
            console.error('Profile update failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create default profile structure
     */
    createDefaultProfile() {
        return {
            // Basic Information
            userId: null,
            email: null,
            name: null,
            university: null,
            studyYear: 1,
            studyField: null,
            
            // Educational Background
            academicLevel: 'undergraduate', // undergraduate, postgraduate, professional
            legalBackground: 'none', // none, basic, intermediate, advanced
            interests: [],
            specializations: [],
            
            // Platform Preferences
            subscriptionTier: 'free',
            upgradeDate: null,
            notificationPreferences: {
                email: true,
                courseReminders: true,
                achievementAlerts: true,
                communityUpdates: false,
                promotionalEmails: false
            },
            
            // Privacy Settings
            profileVisibility: 'public', // public, friends, private
            showProgress: true,
            showAchievements: true,
            allowPeerConnections: true,
            
            // Regional Settings
            country: 'UK',
            timezone: 'Europe/London',
            language: 'en-GB',
            
            // Account Metadata
            joinDate: new Date().toISOString(),
            lastLoginDate: null,
            lastActiveDate: new Date().toISOString(),
            accountStatus: 'active', // active, suspended, deleted
            
            // Verification Status
            emailVerified: false,
            universityVerified: false,
            
            // Analytics Consent
            analyticsConsent: false,
            marketingConsent: false,
            
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Track learning progress
     */
    trackProgress(activityType, data = {}) {
        if (!this.progressData) {
            this.loadProgressData();
        }
        
        const today = new Date().toISOString().split('T')[0];
        let pointsEarned = 0;
        
        switch (activityType) {
            case 'lesson_completed':
                this.progressData.completedLessons++;
                this.updateCourseProgress(data.courseId, 'lesson');
                pointsEarned = 10;
                break;
                
            case 'quiz_completed':
                this.progressData.totalQuizzes++;
                if (data.passed) {
                    this.progressData.passedQuizzes++;
                    pointsEarned = data.score ? Math.round(data.score / 10) : 15;
                } else {
                    pointsEarned = 5; // Participation points
                }
                break;
                
            case 'study_session':
                const minutes = data.minutes || 0;
                this.progressData.studyTimeMinutes += minutes;
                pointsEarned = Math.round(minutes / 10); // 1 point per 10 minutes
                break;
                
            case 'forum_post':
                this.progressData.activities.forumPosts++;
                pointsEarned = 5;
                break;
                
            case 'question_asked':
                this.progressData.activities.questionsAsked++;
                pointsEarned = 3;
                break;
                
            case 'document_downloaded':
                this.progressData.activities.documentsDownloaded++;
                pointsEarned = 2;
                break;
                
            case 'chat_interaction':
                this.progressData.activities.chatMessages++;
                pointsEarned = 1;
                break;
                
            case 'assessment_attempt':
                this.progressData.activities.assessmentAttempts++;
                pointsEarned = data.score ? Math.round(data.score / 5) : 5;
                break;
        }
        
        // Update points
        if (pointsEarned > 0) {
            this.progressData.totalPoints += pointsEarned;
            this.progressData.pointsThisWeek += pointsEarned;
            this.progressData.pointsThisMonth += pointsEarned;
        }
        
        // Update daily stats
        if (this.progressData.weeklyStats[today]) {
            this.progressData.weeklyStats[today].pointsEarned += pointsEarned;
            this.progressData.weeklyStats[today].activitiesCompleted++;
            
            if (activityType === 'study_session') {
                this.progressData.weeklyStats[today].studyMinutes += data.minutes || 0;
            }
            
            if (activityType === 'lesson_completed') {
                this.progressData.weeklyStats[today].lessonsCompleted++;
            }
        }
        
        // Update streak
        this.updateStudyStreak();
        
        // Check for achievements
        this.checkAchievements(activityType, data);
        
        // Save progress
        this.saveProgressData();
        
        this.logProfileEvent('progress_tracked', { 
            activityType, 
            pointsEarned, 
            totalPoints: this.progressData.totalPoints 
        });
        
        return { pointsEarned, totalPoints: this.progressData.totalPoints };
    }

    /**
     * Update course progress
     */
    updateCourseProgress(courseId, type) {
        if (!courseId || !this.progressData.courses[courseId]) {
            return;
        }
        
        const course = this.progressData.courses[courseId];
        
        if (type === 'lesson') {
            course.lessonsCompleted++;
            course.progress = Math.min(100, (course.lessonsCompleted / course.totalLessons) * 100);
            
            if (!course.startDate) {
                course.startDate = new Date().toISOString();
            }
            
            if (course.progress >= 100 && !course.completionDate) {
                course.completionDate = new Date().toISOString();
                this.trackProgress('course_completed', { courseId });
            }
        }
    }

    /**
     * Update study streak
     */
    updateStudyStreak() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split('T')[0];
        
        if (this.progressData.lastStudyDate === yesterdayKey) {
            // Continue streak
            this.progressData.streakDays++;
        } else if (this.progressData.lastStudyDate !== today) {
            // Break streak or start new one
            this.progressData.streakDays = 1;
        }
        
        this.progressData.lastStudyDate = today;
    }

    /**
     * Check for achievements
     */
    checkAchievements(activityType, data) {
        const achievements = this.getAvailableAchievements();
        
        achievements.forEach(achievement => {
            if (this.progressData.achievements.includes(achievement.id)) {
                return; // Already earned
            }
            
            if (this.checkAchievementCriteria(achievement)) {
                this.awardAchievement(achievement);
            }
        });
    }

    /**
     * Get available achievements
     */
    getAvailableAchievements() {
        return [
            {
                id: 'first_lesson',
                name: 'First Steps',
                description: 'Complete your first lesson',
                icon: '🎯',
                points: 10,
                criteria: { completedLessons: 1 }
            },
            {
                id: 'quiz_master',
                name: 'Quiz Master',
                description: 'Pass 10 quizzes',
                icon: '📚',
                points: 50,
                criteria: { passedQuizzes: 10 }
            },
            {
                id: 'study_streak_7',
                name: 'Week Warrior',
                description: 'Study for 7 days in a row',
                icon: '🔥',
                points: 25,
                criteria: { streakDays: 7 }
            },
            {
                id: 'forum_contributor',
                name: 'Community Helper',
                description: 'Make 25 forum posts',
                icon: '🤝',
                points: 30,
                criteria: { forumPosts: 25 }
            },
            {
                id: 'point_collector',
                name: 'Point Collector',
                description: 'Earn 1000 achievement points',
                icon: '⭐',
                points: 100,
                criteria: { totalPoints: 1000 }
            },
            {
                id: 'course_completer',
                name: 'Course Champion',
                description: 'Complete your first course',
                icon: '🏆',
                points: 75,
                criteria: { completedCourses: 1 }
            }
        ];
    }

    /**
     * Check if achievement criteria is met
     */
    checkAchievementCriteria(achievement) {
        const criteria = achievement.criteria;
        
        for (const [key, requiredValue] of Object.entries(criteria)) {
            let currentValue = 0;
            
            if (key === 'completedCourses') {
                currentValue = Object.values(this.progressData.courses)
                    .filter(course => course.progress >= 100).length;
            } else if (key === 'forumPosts') {
                currentValue = this.progressData.activities.forumPosts;
            } else {
                currentValue = this.progressData[key] || 0;
            }
            
            if (currentValue < requiredValue) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Award achievement to user
     */
    awardAchievement(achievement) {
        this.progressData.achievements.push(achievement.id);
        this.progressData.totalPoints += achievement.points;
        
        // Show achievement notification
        this.showAchievementNotification(achievement);
        
        this.logProfileEvent('achievement_earned', { 
            achievementId: achievement.id, 
            name: achievement.name,
            points: achievement.points 
        });
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement) {
        if (typeof document === 'undefined') return;
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #F4C430, #FFD700);
            color: #0D1B2A;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem; margin-right: 0.5rem;">${achievement.icon}</span>
                <strong>Achievement Unlocked!</strong>
            </div>
            <div style="font-size: 0.9rem;">
                <div style="font-weight: 500;">${achievement.name}</div>
                <div style="opacity: 0.8;">${achievement.description}</div>
                <div style="margin-top: 0.25rem; font-size: 0.8rem;">+${achievement.points} points</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
        
        // Add CSS animations if not already added
        if (!document.querySelector('#achievement-animations')) {
            const style = document.createElement('style');
            style.id = 'achievement-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Get user dashboard data
     */
    getDashboardData() {
        if (!this.progressData) {
            this.loadProgressData();
        }
        
        const completedCourses = Object.values(this.progressData.courses)
            .filter(course => course.progress >= 100).length;
        
        const totalCourses = Object.keys(this.progressData.courses).length;
        
        const recentAchievements = this.getAvailableAchievements()
            .filter(achievement => this.progressData.achievements.includes(achievement.id))
            .slice(-3);
        
        return {
            user: this.currentProfile,
            progress: {
                totalPoints: this.progressData.totalPoints,
                completedLessons: this.progressData.completedLessons,
                passedQuizzes: this.progressData.passedQuizzes,
                totalQuizzes: this.progressData.totalQuizzes,
                studyTimeMinutes: this.progressData.studyTimeMinutes,
                streakDays: this.progressData.streakDays,
                completedCourses,
                totalCourses
            },
            courses: this.progressData.courses,
            activities: this.progressData.activities,
            achievements: recentAchievements,
            weeklyProgress: this.getWeeklyProgressSummary(),
            monthlyProgress: this.getMonthlyProgressSummary(),
            recommendations: this.getPersonalizedRecommendations()
        };
    }

    /**
     * Get weekly progress summary
     */
    getWeeklyProgressSummary() {
        const weeklyStats = this.progressData.weeklyStats;
        const dates = Object.keys(weeklyStats).sort().slice(-7);
        
        let totalMinutes = 0;
        let totalPoints = 0;
        let totalActivities = 0;
        
        dates.forEach(date => {
            const stats = weeklyStats[date];
            totalMinutes += stats.studyMinutes;
            totalPoints += stats.pointsEarned;
            totalActivities += stats.activitiesCompleted;
        });
        
        return {
            totalMinutes,
            totalPoints,
            totalActivities,
            dailyAverage: Math.round(totalMinutes / 7),
            chartData: dates.map(date => ({
                date,
                minutes: weeklyStats[date].studyMinutes,
                points: weeklyStats[date].pointsEarned
            }))
        };
    }

    /**
     * Get monthly progress summary
     */
    getMonthlyProgressSummary() {
        const monthlyStats = this.progressData.monthlyStats;
        const dates = Object.keys(monthlyStats).sort().slice(-30);
        
        let totalMinutes = 0;
        let totalPoints = 0;
        
        dates.forEach(date => {
            const stats = monthlyStats[date];
            totalMinutes += stats.studyMinutes;
            totalPoints += stats.pointsEarned;
        });
        
        return {
            totalMinutes,
            totalPoints,
            dailyAverage: Math.round(totalMinutes / 30),
            weeklyAverage: Math.round(totalMinutes / 4)
        };
    }

    /**
     * Get personalized recommendations
     */
    getPersonalizedRecommendations() {
        const recommendations = [];
        
        // Based on course progress
        const inProgressCourses = Object.entries(this.progressData.courses)
            .filter(([_, course]) => course.progress > 0 && course.progress < 100);
        
        if (inProgressCourses.length > 0) {
            recommendations.push({
                type: 'continue_course',
                title: `Continue ${inProgressCourses[0][1].name}`,
                description: `You're ${Math.round(inProgressCourses[0][1].progress)}% complete`,
                action: 'resume_course',
                courseId: inProgressCourses[0][0]
            });
        }
        
        // Based on streak
        if (this.progressData.streakDays >= 3) {
            recommendations.push({
                type: 'maintain_streak',
                title: `Keep your ${this.progressData.streakDays}-day streak!`,
                description: 'Study today to maintain your learning momentum',
                action: 'start_study_session'
            });
        }
        
        // Based on achievements
        const nearAchievements = this.getNearAchievements();
        if (nearAchievements.length > 0) {
            recommendations.push({
                type: 'achievement_progress',
                title: `You're close to "${nearAchievements[0].name}"`,
                description: nearAchievements[0].progressDescription,
                action: 'view_achievements'
            });
        }
        
        return recommendations.slice(0, 3); // Limit to 3 recommendations
    }

    /**
     * Get achievements user is close to earning
     */
    getNearAchievements() {
        const achievements = this.getAvailableAchievements();
        const nearAchievements = [];
        
        achievements.forEach(achievement => {
            if (this.progressData.achievements.includes(achievement.id)) {
                return; // Already earned
            }
            
            const criteria = achievement.criteria;
            let isNear = false;
            let progressDescription = '';
            
            for (const [key, requiredValue] of Object.entries(criteria)) {
                let currentValue = 0;
                
                if (key === 'completedCourses') {
                    currentValue = Object.values(this.progressData.courses)
                        .filter(course => course.progress >= 100).length;
                } else if (key === 'forumPosts') {
                    currentValue = this.progressData.activities.forumPosts;
                } else {
                    currentValue = this.progressData[key] || 0;
                }
                
                const progress = currentValue / requiredValue;
                if (progress >= 0.7 && progress < 1) { // 70% or more progress
                    isNear = true;
                    const remaining = requiredValue - currentValue;
                    progressDescription = `${remaining} more ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} needed`;
                    break;
                }
            }
            
            if (isNear) {
                nearAchievements.push({
                    ...achievement,
                    progressDescription
                });
            }
        });
        
        return nearAchievements;
    }

    /**
     * Save progress data
     */
    saveProgressData() {
        if (this.storage) {
            this.progressData.lastUpdated = new Date().toISOString();
            this.storage.setLearningProgress(this.progressData);
        }
    }

    /**
     * Setup progress tracking listeners
     */
    setupProgressTracking() {
        if (typeof window !== 'undefined') {
            // Listen for custom progress events
            window.addEventListener('juribank:progress', (event) => {
                const { activityType, data } = event.detail;
                this.trackProgress(activityType, data);
            });
            
            // Expose progress tracking globally
            window.JuriBankProgress = {
                track: (activityType, data) => this.trackProgress(activityType, data),
                getDashboard: () => this.getDashboardData(),
                getProfile: () => this.currentProfile,
                updateProfile: (updates) => this.updateProfile(updates)
            };
        }
    }

    /**
     * Log profile events
     */
    logProfileEvent(eventType, details = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            type: eventType,
            userId: this.currentProfile?.userId || 'anonymous',
            details
        };
        
        console.log('👤 PROFILE EVENT:', event);
    }

    /**
     * Export user data for GDPR compliance
     */
    exportUserData() {
        return {
            profile: this.currentProfile,
            progress: this.progressData,
            exportTimestamp: new Date().toISOString(),
            version: '3.0.0'
        };
    }

    /**
     * Clear all user data
     */
    clearUserData() {
        this.currentProfile = null;
        this.progressData = null;
        
        if (this.storage) {
            this.storage.removeItem('profile');
            this.storage.removeItem('progress');
        }
        
        this.logProfileEvent('user_data_cleared');
    }
}

// Initialize profile manager when dependencies are available
let userProfileManager = null;

function initializeProfileManager() {
    if (typeof window !== 'undefined') {
        userProfileManager = new JuriBankUserProfileManager(
            window.JuriBankAuthStorage,
            window.JuriBankAuthMiddleware
        );
        
        window.JuriBankUserProfileManager = userProfileManager;
    }
}

// Try to initialize
initializeProfileManager();

// Also try after DOM load
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProfileManager);
    } else {
        setTimeout(initializeProfileManager, 200);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankUserProfileManager;
}