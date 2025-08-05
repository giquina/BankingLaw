/**
 * JuriBank Community Forum System v3.0
 * Anonymous peer support platform moderated by law students
 * Educational forum for financial and legal guidance
 */

class CommunityForumAPI {
    constructor() {
        this.apiBase = '/api/forum';
        this.posts = new Map();
        this.categories = new Map();
        this.moderators = new Set();
        this.currentUser = null;
        
        this.initializeModeration();
        this.setupRealTimeUpdates();
    }

    /**
     * Initialize moderation system
     */
    initializeModeration() {
        this.moderationRules = {
            // Content filtering rules
            blockedWords: [
                'specific legal advice', 'lawsuit', 'sue', 'court case',
                'personal details', 'address', 'phone number', 'email'
            ],
            
            // Educational boundaries
            prohibitedAdvice: [
                'you should', 'must do', 'file a lawsuit', 'contact lawyer',
                'legal action', 'definite answer', 'guaranteed'
            ],
            
            // Privacy protection
            personalInfo: [
                'name', 'address', 'phone', 'email', 'account number',
                'sort code', 'personal data'
            ]
        };

        this.educationalPrompts = {
            legalAdvice: "Remember: This is an educational platform. We encourage sharing experiences but cannot provide specific legal advice.",
            privacy: "For your privacy, please avoid sharing personal information like names, addresses, or account details.",
            guidance: "Consider framing this as 'Here's what I learned' or 'This was my experience' rather than specific advice."
        };
    }

    /**
     * Setup real-time updates for forum
     */
    setupRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.checkForNewPosts();
            this.updateModerationQueue();
        }, 30000); // Check every 30 seconds
    }

    /**
     * Create a new forum post
     */
    async createPost(postData) {
        try {
            // Validate post content
            const validation = await this.validatePost(postData);
            if (!validation.isValid) {
                throw new Error(validation.message);
            }

            // Apply content moderation
            const moderatedPost = await this.moderateContent(postData);
            
            // Create post object
            const post = {
                id: this.generateId(),
                title: moderatedPost.title,
                content: moderatedPost.content,
                category: postData.category,
                author: {
                    id: 'anonymous',
                    displayName: 'Anonymous User',
                    isAnonymous: true
                },
                timestamp: new Date(),
                status: 'published',
                moderationStatus: 'approved',
                likes: 0,
                replies: [],
                replyCount: 0,
                views: 0,
                tags: this.extractTags(moderatedPost.content),
                educationalLevel: this.assessEducationalLevel(moderatedPost.content),
                isHelpful: false,
                moderatorNotes: moderatedPost.moderatorNotes || []
            };

            // Store post
            this.posts.set(post.id, post);
            
            // Update category stats
            this.updateCategoryStats(post.category);
            
            // Notify moderators if needed
            if (moderatedPost.needsReview) {
                await this.notifyModerators(post);
            }

            return {
                success: true,
                post: post,
                message: 'Post created successfully'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Validate post content for educational guidelines
     */
    async validatePost(postData) {
        const errors = [];

        // Check required fields
        if (!postData.title || postData.title.trim().length < 10) {
            errors.push('Title must be at least 10 characters');
        }

        if (!postData.content || postData.content.trim().length < 20) {
            errors.push('Content must be at least 20 characters');
        }

        if (!postData.category) {
            errors.push('Please select a category');
        }

        // Check for inappropriate content
        const titleLower = postData.title.toLowerCase();
        const contentLower = postData.content.toLowerCase();

        // Check for requests for specific legal advice
        const adviceRequests = [
            'what should i do', 'should i sue', 'can you advise',
            'give me legal advice', 'what\'s my case worth'
        ];

        if (adviceRequests.some(phrase => titleLower.includes(phrase) || contentLower.includes(phrase))) {
            errors.push('This appears to be a request for specific legal advice. Please frame your question as sharing an experience or asking for educational information.');
        }

        // Check for personal information
        const personalInfoPatterns = [
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Card numbers
            /\b\d{2}[\s-]?\d{2}[\s-]?\d{2}\b/, // Sort codes
            /\b[A-Z]{2}\d{2}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{2}\b/, // IBANs
            /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/, // Phone numbers
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/ // Email addresses
        ];

        if (personalInfoPatterns.some(pattern => pattern.test(postData.content))) {
            errors.push('Please remove personal information for your privacy and security.');
        }

        return {
            isValid: errors.length === 0,
            message: errors.join(' ')
        };
    }

    /**
     * Moderate content and provide educational guidance
     */
    async moderateContent(postData) {
        const moderatedPost = {
            title: postData.title,
            content: postData.content,
            moderatorNotes: [],
            needsReview: false
        };

        // Check for prohibited advice language
        const contentLower = postData.content.toLowerCase();
        
        if (this.moderationRules.prohibitedAdvice.some(phrase => contentLower.includes(phrase))) {
            moderatedPost.moderatorNotes.push({
                type: 'guidance',
                message: this.educationalPrompts.legalAdvice,
                timestamp: new Date()
            });
        }

        // Check for personal information
        if (this.moderationRules.personalInfo.some(info => contentLower.includes(info))) {
            moderatedPost.moderatorNotes.push({
                type: 'privacy',
                message: this.educationalPrompts.privacy,
                timestamp: new Date()
            });
        }

        // Add educational context if needed
        if (this.needsEducationalContext(postData.content)) {
            moderatedPost.content += '\n\n---\n*Educational Note: This discussion is for informational purposes only and should not be considered as legal advice.*';
        }

        return moderatedPost;
    }

    /**
     * Get posts with filtering and sorting
     */
    async getPosts(filters = {}) {
        try {
            let posts = Array.from(this.posts.values());

            // Apply category filter
            if (filters.category && filters.category !== 'all') {
                posts = posts.filter(post => post.category === filters.category);
            }

            // Apply search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                posts = posts.filter(post => 
                    post.title.toLowerCase().includes(searchLower) ||
                    post.content.toLowerCase().includes(searchLower)
                );
            }

            // Apply sorting
            switch (filters.sort || 'recent') {
                case 'popular':
                    posts.sort((a, b) => (b.likes + b.replyCount) - (a.likes + a.replyCount));
                    break;
                case 'answered':
                    posts.sort((a, b) => b.replyCount - a.replyCount);
                    break;
                case 'trending':
                    posts.sort((a, b) => this.calculateTrendingScore(b) - this.calculateTrendingScore(a));
                    break;
                default: // recent
                    posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            }

            // Apply pagination
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const start = (page - 1) * limit;
            const paginatedPosts = posts.slice(start, start + limit);

            return {
                posts: paginatedPosts,
                total: posts.length,
                page: page,
                totalPages: Math.ceil(posts.length / limit)
            };

        } catch (error) {
            throw new Error('Failed to fetch posts: ' + error.message);
        }
    }

    /**
     * Add reply to a post
     */
    async addReply(postId, replyData) {
        try {
            const post = this.posts.get(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            // Validate reply
            const validation = await this.validateReply(replyData);
            if (!validation.isValid) {
                throw new Error(validation.message);
            }

            // Create reply object
            const reply = {
                id: this.generateId(),
                content: replyData.content,
                author: {
                    id: 'anonymous',
                    displayName: 'Anonymous User',
                    isAnonymous: true
                },
                timestamp: new Date(),
                likes: 0,
                isHelpful: false,
                moderatorVerified: false
            };

            // Add reply to post
            post.replies.push(reply);
            post.replyCount = post.replies.length;

            // Update post timestamp for activity
            post.lastActivity = new Date();

            return {
                success: true,
                reply: reply,
                message: 'Reply added successfully'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Validate reply content
     */
    async validateReply(replyData) {
        const errors = [];

        if (!replyData.content || replyData.content.trim().length < 10) {
            errors.push('Reply must be at least 10 characters');
        }

        // Check for inappropriate advice
        const contentLower = replyData.content.toLowerCase();
        const adviceLanguage = ['you should', 'you must', 'definitely do', 'file a lawsuit'];
        
        if (adviceLanguage.some(phrase => contentLower.includes(phrase))) {
            errors.push('Please share your experience rather than giving specific advice');
        }

        return {
            isValid: errors.length === 0,
            message: errors.join(' ')
        };
    }

    /**
     * Get forum categories with stats
     */
    getCategories() {
        return [
            {
                id: 'all',
                name: 'All Posts',
                icon: 'fas fa-home',
                color: 'blue',
                count: this.posts.size,
                description: 'All community discussions'
            },
            {
                id: 'banking',
                name: 'Banking Issues',
                icon: 'fas fa-university', 
                color: 'blue',
                count: this.getCategoryCount('banking'),
                description: 'Overdraft charges, account problems, banking disputes'
            },
            {
                id: 'payments',
                name: 'Payment Problems',
                icon: 'fas fa-credit-card',
                color: 'green', 
                count: this.getCategoryCount('payments'),
                description: 'Card disputes, transaction issues, payment failures'
            },
            {
                id: 'ppi',
                name: 'PPI Claims',
                icon: 'fas fa-shield-alt',
                color: 'purple',
                count: this.getCategoryCount('ppi'),
                description: 'Payment protection insurance experiences and guidance'
            },
            {
                id: 'investment',
                name: 'Investment Issues',
                icon: 'fas fa-chart-line',
                color: 'orange',
                count: this.getCategoryCount('investment'),
                description: 'Investment advice complaints, pension issues'
            },
            {
                id: 'mortgage',
                name: 'Mortgage Help',
                icon: 'fas fa-home',
                color: 'red',
                count: this.getCategoryCount('mortgage'),
                description: 'Mortgage applications, payment difficulties, advice complaints'
            },
            {
                id: 'success',
                name: 'Success Stories',
                icon: 'fas fa-trophy',
                color: 'yellow',
                count: this.getCategoryCount('success'),
                description: 'Share your positive outcomes and experiences'
            }
        ];
    }

    /**
     * Get category post count
     */
    getCategoryCount(categoryId) {
        return Array.from(this.posts.values())
            .filter(post => post.category === categoryId).length;
    }

    /**
     * Like/unlike a post
     */
    async toggleLike(postId, userId = 'anonymous') {
        try {
            const post = this.posts.get(postId);
            if (!post) {
                throw new Error('Post not found');
            }

            // In a real system, track user likes
            post.likes += 1;

            return {
                success: true,
                likes: post.likes
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Report content for moderation
     */
    async reportContent(contentId, contentType, reason) {
        try {
            const report = {
                id: this.generateId(),
                contentId: contentId,
                contentType: contentType, // 'post' or 'reply'
                reason: reason,
                reportedBy: 'anonymous',
                timestamp: new Date(),
                status: 'pending',
                moderatorAssigned: null
            };

            // Add to moderation queue
            await this.addToModerationQueue(report);

            return {
                success: true,
                message: 'Content reported successfully. Our student moderators will review it.'
            };

        } catch (error) {
            return {
                success: false,
                message: 'Failed to report content'
            };
        }
    }

    /**
     * Get forum statistics
     */
    getForumStats() {
        const posts = Array.from(this.posts.values());
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return {
            totalPosts: posts.length,
            totalReplies: posts.reduce((sum, post) => sum + post.replyCount, 0),
            activeMembers: 423, // Mock data
            postsToday: posts.filter(post => new Date(post.timestamp) >= today).length,
            averageResponseTime: '2.4 hours',
            questionAnswerRate: 0.89,
            studentModerators: 12,
            categories: this.getCategories().length - 1 // Exclude 'all'
        };
    }

    /**
     * Search posts and replies
     */
    async searchContent(query, filters = {}) {
        try {
            const posts = Array.from(this.posts.values());
            const searchLower = query.toLowerCase();
            
            const results = posts.filter(post => {
                // Search in title and content
                const titleMatch = post.title.toLowerCase().includes(searchLower);
                const contentMatch = post.content.toLowerCase().includes(searchLower);
                
                // Search in replies if requested
                let replyMatch = false;
                if (filters.includeReplies) {
                    replyMatch = post.replies.some(reply => 
                        reply.content.toLowerCase().includes(searchLower)
                    );
                }

                return titleMatch || contentMatch || replyMatch;
            });

            // Apply additional filters
            if (filters.category && filters.category !== 'all') {
                results = results.filter(post => post.category === filters.category);
            }

            return {
                results: results,
                total: results.length,
                query: query
            };

        } catch (error) {
            throw new Error('Search failed: ' + error.message);
        }
    }

    /**
     * Utility methods
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    extractTags(content) {
        // Extract relevant tags from content
        const keywords = {
            'overdraft': ['overdraft', 'overdrawn'],
            'charges': ['charge', 'fee', 'penalty'],
            'ppi': ['ppi', 'payment protection'],
            'refund': ['refund', 'money back', 'compensation'],
            'complaint': ['complaint', 'complain', 'dispute'],
            'bank': ['bank', 'banking', 'lender'],
            'mortgage': ['mortgage', 'home loan'],
            'credit': ['credit card', 'credit']
        };

        const contentLower = content.toLowerCase();
        const tags = [];

        Object.entries(keywords).forEach(([tag, words]) => {
            if (words.some(word => contentLower.includes(word))) {
                tags.push(tag);
            }
        });

        return tags;
    }

    assessEducationalLevel(content) {
        // Assess if content is educational vs advice-seeking
        const educationalWords = ['experience', 'learned', 'found out', 'discovered', 'tip'];
        const adviceWords = ['should i', 'what do', 'help me', 'advice'];
        
        const contentLower = content.toLowerCase();
        const educationalScore = educationalWords.filter(word => contentLower.includes(word)).length;
        const adviceScore = adviceWords.filter(word => contentLower.includes(word)).length;
        
        if (educationalScore > adviceScore) {return 'educational';}
        if (adviceScore > educationalScore) {return 'advice-seeking';}
        return 'discussion';
    }

    calculateTrendingScore(post) {
        const ageHours = (Date.now() - new Date(post.timestamp)) / (1000 * 60 * 60);
        const engagement = post.likes + (post.replyCount * 2);
        return engagement / Math.pow(ageHours + 1, 1.5);
    }

    needsEducationalContext(content) {
        const legalTerms = ['legal', 'law', 'court', 'solicitor', 'advice'];
        const contentLower = content.toLowerCase();
        return legalTerms.some(term => contentLower.includes(term));
    }

    updateCategoryStats(category) {
        // Update category statistics
        console.log(`Updated stats for category: ${category}`);
    }

    async checkForNewPosts() {
        // Check for new posts from other users
        console.log('Checking for new posts...');
    }

    async updateModerationQueue() {
        // Update moderation queue
        console.log('Updating moderation queue...');
    }

    async notifyModerators(post) {
        // Notify student moderators of posts needing review
        console.log('Notifying moderators about post:', post.id);
    }

    async addToModerationQueue(report) {
        // Add content report to moderation queue
        console.log('Added to moderation queue:', report);
    }
}

// Initialize Community Forum API
const communityForumAPI = new CommunityForumAPI();

// Populate with some initial data
async function initializeMockData() {
    // Create some sample posts
    const samplePosts = [
        {
            title: "Bank charged me £200 for going £5 overdrawn - is this fair?",
            content: "I went £5 over my overdraft limit for one day and my bank charged me £200 in fees. This seems excessive - what are my options? Has anyone else experienced this?",
            category: "banking"
        },
        {
            title: "Successfully got £3,000 PPI refund - here's how",
            content: "Want to share my experience claiming PPI - took 6 months but worth it. Happy to answer questions about the process and what documents you need. Remember this is just my experience, not advice!",
            category: "success"
        },
        {
            title: "Mortgage application rejected - what can I do?",
            content: "My mortgage was rejected with no clear explanation. Credit score is good, income stable. What rights do I have to understand why? Anyone been through similar situation?",
            category: "mortgage"
        }
    ];

    for (const postData of samplePosts) {
        await communityForumAPI.createPost(postData);
    }
}

// Initialize mock data
initializeMockData();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommunityForumAPI;
}

// Make available globally
window.CommunityForumAPI = CommunityForumAPI;
window.communityForumAPI = communityForumAPI;