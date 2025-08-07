/**
 * JuriBank Community Forum System v3.0 - Enhanced Frontend
 * Real-time anonymous peer support platform with WebSocket integration
 * Modern interactive features with educational compliance
 * Student moderated with professional oversight
 */

class CommunityForumAPI {
    constructor() {
        this.apiBase = '/api/forum';
        this.wsUrl = 'ws://localhost:3001';
        this.posts = new Map();
        this.categories = new Map();
        this.moderators = new Set();
        this.currentUser = null;
        this.socket = null;
        this.isConnected = false;
        
        // Session management
        this.sessionToken = localStorage.getItem('juribank-forum-session');
        this.currentCategory = 'all';
        this.currentPost = null;
        
        // UI state
        this.isTyping = false;
        this.typingTimeout = null;
        this.notificationQueue = [];
        
        // Initialize systems
        this.initializeModeration();
        this.setupRealTimeConnection();
        this.initializeUI();
        this.createAnonymousSession();
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
     * Setup WebSocket connection for real-time updates
     */
    setupRealTimeConnection() {
        try {
            this.socket = new WebSocket(this.wsUrl);
            
            this.socket.onopen = () => {
                console.log('[Forum] WebSocket connected');
                this.isConnected = true;
                this.authenticateSocket();
                this.updateConnectionStatus(true);
            };
            
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealtimeMessage(data);
            };
            
            this.socket.onclose = () => {
                console.log('[Forum] WebSocket disconnected');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                // Attempt reconnection after 5 seconds
                setTimeout(() => this.setupRealTimeConnection(), 5000);
            };
            
            this.socket.onerror = (error) => {
                console.error('[Forum] WebSocket error:', error);
                this.showNotification('Connection error. Some features may not work properly.', 'warning');
            };
        } catch (error) {
            console.error('[Forum] Failed to establish WebSocket connection:', error);
            // Fall back to polling for updates
            this.setupPollingFallback();
        }
    }
    
    /**
     * Initialize UI components and event listeners
     */
    initializeUI() {
        // Setup notification system
        this.createNotificationContainer();
        
        // Setup typing indicators
        this.setupTypingIndicators();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup search functionality
        this.initializeSearch();
        
        // Setup infinite scroll
        this.setupInfiniteScroll();
        
        // Setup connection status indicator
        this.createConnectionIndicator();
        
        console.log('[Forum] UI components initialized');
    }
    
    /**
     * Create anonymous session for privacy protection
     */
    async createAnonymousSession() {
        if (this.sessionToken) {
            // Validate existing session
            try {
                const response = await fetch(`${this.apiBase}/session`, {
                    headers: {
                        'Session-Token': this.sessionToken
                    }
                });
                
                if (response.ok) {
                    const { session } = await response.json();
                    this.currentUser = session;
                    console.log('[Forum] Existing session validated');
                    return;
                }
            } catch (error) {
                console.log('[Forum] Session validation failed, creating new session');
            }
        }
        
        try {
            // Create new anonymous session
            const response = await fetch(`${this.apiBase}/auth/anonymous`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userAgent: navigator.userAgent,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.sessionToken = data.token;
                this.currentUser = data.session;
                localStorage.setItem('juribank-forum-session', this.sessionToken);
                console.log('[Forum] New anonymous session created');
            }
        } catch (error) {
            console.error('[Forum] Failed to create session:', error);
            this.showNotification('Failed to establish session. Some features may be limited.', 'warning');
        }
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

    /**
     * Handle real-time WebSocket messages
     */
    handleRealtimeMessage(data) {
        switch (data.type) {
            case 'new-post':
                this.handleNewPost(data.post);
                break;
            case 'new-reply':
                this.handleNewReply(data.reply, data.postId);
                break;
            case 'like-updated':
                this.handleLikeUpdate(data.postId, data.likes);
                break;
            case 'user-typing':
                this.handleTypingIndicator(data.postId, data.typingCount);
                break;
            case 'user-stopped-typing':
                this.handleStoppedTyping(data.postId, data.typingCount);
                break;
            case 'category-user-count-updated':
                this.updateCategoryUserCount(data.categoryId, data.userCount);
                break;
            case 'moderation-action':
                this.handleModerationAction(data);
                break;
            case 'notification':
                this.showNotification(data.message, data.type);
                break;
            case 'connection-established':
                console.log('[Forum] Connection established with socket ID:', data.socketId);
                break;
            case 'heartbeat':
                // Respond to heartbeat
                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({ type: 'heartbeat-response', timestamp: Date.now() }));
                }
                break;
        }
    }
    
    /**
     * Authenticate WebSocket connection
     */
    authenticateSocket() {
        if (this.socket && this.sessionToken && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'authenticate',
                sessionToken: this.sessionToken
            }));
        }
    }
    
    /**
     * Join category for real-time updates
     */
    joinCategory(categoryId) {
        this.currentCategory = categoryId;
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'join-category',
                categoryId: categoryId
            }));
        }
    }
    
    /**
     * Join post discussion for real-time updates
     */
    joinPost(postId) {
        this.currentPost = postId;
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'join-post',
                postId: postId
            }));
        }
    }
    
    /**
     * Setup fallback polling if WebSocket fails
     */
    setupPollingFallback() {
        console.log('[Forum] Using polling fallback for real-time updates');
        setInterval(() => {
            if (!this.isConnected) {
                this.checkForNewPosts();
            }
        }, 30000);
    }
    
    /**
     * Create notification container for real-time alerts
     */
    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;
        
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-20 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }
    
    /**
     * Show notification to user
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `transform transition-all duration-300 translate-x-full opacity-0 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`;
        
        const typeStyles = {
            info: 'border-l-4 border-blue-500',
            success: 'border-l-4 border-green-500',
            warning: 'border-l-4 border-yellow-500',
            error: 'border-l-4 border-red-500'
        };
        
        const typeIcons = {
            info: 'fa-info-circle text-blue-500',
            success: 'fa-check-circle text-green-500',
            warning: 'fa-exclamation-triangle text-yellow-500',
            error: 'fa-exclamation-circle text-red-500'
        };
        
        notification.className += ' ' + typeStyles[type];
        
        notification.innerHTML = `
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="fas ${typeIcons[type]} text-xl"></i>
                    </div>
                    <div class="ml-3 w-0 flex-1 pt-0.5">
                        <p class="text-sm font-medium text-gray-900">${message}</p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex">
                        <button class="close-notification bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
        }, 100);
        
        // Setup close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        return notification;
    }
    
    /**
     * Remove notification with animation
     */
    removeNotification(notification) {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
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

    /**
     * Setup typing indicators for real-time interaction
     */
    setupTypingIndicators() {
        const textareas = document.querySelectorAll('textarea[name="content"]');
        textareas.forEach(textarea => {
            let typingTimer;
            
            textarea.addEventListener('input', () => {
                if (!this.isTyping && this.currentPost) {
                    this.isTyping = true;
                    this.sendTypingStart();
                }
                
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    this.isTyping = false;
                    this.sendTypingStop();
                }, 2000);
            });
            
            textarea.addEventListener('blur', () => {
                if (this.isTyping) {
                    this.isTyping = false;
                    this.sendTypingStop();
                }
            });
        });
    }
    
    /**
     * Send typing start notification
     */
    sendTypingStart() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.currentPost) {
            this.socket.send(JSON.stringify({
                type: 'typing-start',
                postId: this.currentPost
            }));
        }
    }
    
    /**
     * Send typing stop notification
     */
    sendTypingStop() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.currentPost) {
            this.socket.send(JSON.stringify({
                type: 'typing-stop',
                postId: this.currentPost
            }));
        }
    }
    
    /**
     * Handle typing indicator from other users
     */
    handleTypingIndicator(postId, typingCount) {
        const indicator = document.getElementById(`typing-indicator-${postId}`);
        if (indicator && typingCount > 0) {
            indicator.textContent = `${typingCount} user${typingCount > 1 ? 's' : ''} typing...`;
            indicator.style.display = 'block';
        }
    }
    
    /**
     * Handle stopped typing indicator
     */
    handleStoppedTyping(postId, typingCount) {
        const indicator = document.getElementById(`typing-indicator-${postId}`);
        if (indicator) {
            if (typingCount > 0) {
                indicator.textContent = `${typingCount} user${typingCount > 1 ? 's' : ''} typing...`;
            } else {
                indicator.style.display = 'none';
            }
        }
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('forum-search');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + Enter to submit forms
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const activeForm = document.querySelector('form:focus-within');
                if (activeForm) {
                    const submitBtn = activeForm.querySelector('button[type="submit"]');
                    if (submitBtn && !submitBtn.disabled) {
                        submitBtn.click();
                    }
                }
            }
        });
    }
    
    /**
     * Initialize search functionality
     */
    initializeSearch() {
        // Create search input if it doesn't exist
        this.createSearchInterface();
        
        const searchInput = document.getElementById('forum-search');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
        }
    }
    
    /**
     * Create search interface
     */
    createSearchInterface() {
        const existingSearch = document.getElementById('forum-search');
        if (existingSearch) return;
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'relative mb-6';
        searchContainer.innerHTML = `
            <div class="relative">
                <input type="text" id="forum-search" 
                       class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-transparent" 
                       placeholder="Search discussions... (Ctrl+K)">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                </div>
            </div>
            <div id="search-results" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg hidden"></div>
        `;
        
        const forumPosts = document.getElementById('forum-posts');
        if (forumPosts && forumPosts.parentNode) {
            forumPosts.parentNode.insertBefore(searchContainer, forumPosts);
        }
    }
    
    /**
     * Perform search and show results
     */
    async performSearch(query) {
        if (!query || query.length < 2) {
            this.hideSearchResults();
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBase}/search?q=${encodeURIComponent(query)}&category=${this.currentCategory}`, {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const { results } = await response.json();
                this.displaySearchResults(results, query);
            }
        } catch (error) {
            console.error('[Forum] Search failed:', error);
        }
    }
    
    /**
     * Display search results
     */
    displaySearchResults(results, query) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    <i class="fas fa-search text-2xl mb-2"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = results.map(result => `
                <div class="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer search-result-item" data-post-id="${result.id}">
                    <h4 class="font-medium text-gray-900">${this.highlightSearchTerms(result.title, query)}</h4>
                    <p class="text-sm text-gray-600 mt-1">${this.highlightSearchTerms(result.content.substring(0, 150), query)}...</p>
                    <div class="flex items-center mt-2 text-xs text-gray-500">
                        <span class="bg-${this.getCategoryColor(result.category)}-100 text-${this.getCategoryColor(result.category)}-800 px-2 py-1 rounded-full mr-2">${result.category}</span>
                        <span>${this.formatDate(result.createdAt)}</span>
                    </div>
                </div>
            `).join('');
            
            // Add click handlers for search results
            resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const postId = item.getAttribute('data-post-id');
                    this.openPost(postId);
                    this.hideSearchResults();
                });
            });
        }
        
        resultsContainer.classList.remove('hidden');
        
        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!resultsContainer.contains(e.target) && !document.getElementById('forum-search').contains(e.target)) {
                this.hideSearchResults();
            }
        }, { once: true });
    }
    
    /**
     * Hide search results
     */
    hideSearchResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
        }
    }
    
    /**
     * Highlight search terms in text
     */
    highlightSearchTerms(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    }
    
    /**
     * Setup infinite scroll for posts
     */
    setupInfiniteScroll() {
        let loading = false;
        let hasMore = true;
        let currentPage = 1;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !loading && hasMore) {
                    loading = true;
                    this.loadMorePosts(currentPage + 1)
                        .then(result => {
                            if (result && result.posts.length > 0) {
                                currentPage++;
                                hasMore = result.hasMore;
                            } else {
                                hasMore = false;
                            }
                            loading = false;
                        })
                        .catch(() => {
                            loading = false;
                        });
                }
            });
        });
        
        // Observe load more button or create sentinel
        const loadMoreBtn = document.querySelector('.load-more-posts');
        if (loadMoreBtn) {
            observer.observe(loadMoreBtn);
        }
    }
    
    /**
     * Load more posts for infinite scroll
     */
    async loadMorePosts(page) {
        try {
            const response = await fetch(`${this.apiBase}/posts?page=${page}&category=${this.currentCategory}`, {
                headers: this.getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                this.appendPostsToDOM(data.posts);
                return data;
            }
        } catch (error) {
            console.error('[Forum] Failed to load more posts:', error);
        }
        return null;
    }
    
    /**
     * Create connection status indicator
     */
    createConnectionIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'connection-indicator';
        indicator.className = 'fixed bottom-4 left-4 z-50 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300';
        document.body.appendChild(indicator);
        
        this.updateConnectionStatus(this.isConnected);
    }
    
    /**
     * Update connection status indicator
     */
    updateConnectionStatus(isConnected) {
        const indicator = document.getElementById('connection-indicator');
        if (!indicator) return;
        
        if (isConnected) {
            indicator.className = 'fixed bottom-4 left-4 z-50 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-green-500 text-white';
            indicator.innerHTML = '<i class="fas fa-wifi mr-2"></i>Connected';
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 3000);
        } else {
            indicator.className = 'fixed bottom-4 left-4 z-50 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-red-500 text-white';
            indicator.innerHTML = '<i class="fas fa-wifi-slash mr-2"></i>Disconnected';
            indicator.style.opacity = '1';
        }
    }
    
    /**
     * Get authentication headers
     */
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.sessionToken) {
            headers['Session-Token'] = this.sessionToken;
        }
        
        return headers;
    }
    
    /**
     * Handle new post from WebSocket
     */
    handleNewPost(post) {
        if (post.category === this.currentCategory || this.currentCategory === 'all') {
            this.prependPostToDOM(post);
            this.showNotification('New post in this category', 'info');
        }
    }
    
    /**
     * Handle new reply from WebSocket
     */
    handleNewReply(reply, postId) {
        if (this.currentPost === postId) {
            this.appendReplyToDOM(reply, postId);
            this.showNotification('New reply to this discussion', 'info');
        }
    }
    
    /**
     * Handle like update from WebSocket
     */
    handleLikeUpdate(postId, likes) {
        const likeButton = document.querySelector(`[data-post-id="${postId}"] .like-count`);
        if (likeButton) {
            likeButton.textContent = likes;
        }
    }
    
    /**
     * Utility methods for DOM manipulation
     */
    prependPostToDOM(post) {
        const postsContainer = document.getElementById('forum-posts');
        if (!postsContainer) return;
        
        const postElement = this.createPostElement(post);
        postsContainer.insertBefore(postElement, postsContainer.firstChild);
    }
    
    appendPostsToDOM(posts) {
        const postsContainer = document.getElementById('forum-posts');
        if (!postsContainer) return;
        
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    }
    
    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-item bg-white rounded-xl shadow-lg p-6 cursor-pointer';
        postDiv.setAttribute('data-post-id', post.id);
        
        postDiv.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-gray-600"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">${post.title}</h3>
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Anonymous User</span>
                            <span>•</span>
                            <span>${this.formatDate(post.createdAt)}</span>
                            <span>•</span>
                            <span class="bg-${this.getCategoryColor(post.category)}-100 text-${this.getCategoryColor(post.category)}-800 px-2 py-1 rounded-full text-xs">${this.formatCategory(post.category)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <p class="text-gray-700 mb-4">${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}</p>
            
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <button class="flex items-center text-gray-600 hover:text-student-blue like-button" data-post-id="${post.id}">
                        <i class="fas fa-thumbs-up mr-1"></i>
                        <span class="like-count">${post.likes || 0}</span>
                    </button>
                    <span class="flex items-center text-gray-600">
                        <i class="fas fa-comment mr-1"></i>
                        <span>${post.replyCount || 0} replies</span>
                    </span>
                    <button class="flex items-center text-gray-600 hover:text-student-blue share-button" data-post-id="${post.id}">
                        <i class="fas fa-share mr-1"></i>
                        <span>Share</span>
                    </button>
                </div>
                <span class="text-sm text-gray-500">Last activity ${this.formatDate(post.updatedAt || post.createdAt)}</span>
            </div>
        `;
        
        // Add event listeners
        const likeButton = postDiv.querySelector('.like-button');
        likeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.likePost(post.id);
        });
        
        const shareButton = postDiv.querySelector('.share-button');
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sharePost(post.id);
        });
        
        postDiv.addEventListener('click', () => {
            this.openPost(post.id);
        });
        
        return postDiv;
    }
    
    /**
     * Like a post
     */
    async likePost(postId) {
        try {
            const response = await fetch(`${this.apiBase}/posts/${postId}/like`, {
                method: 'PUT',
                headers: this.getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error('Failed to like post');
            }
            
            // WebSocket will handle the UI update
        } catch (error) {
            console.error('[Forum] Failed to like post:', error);
            this.showNotification('Failed to like post', 'error');
        }
    }
    
    /**
     * Share a post
     */
    sharePost(postId) {
        const url = `${window.location.origin}/community-forum.html?post=${postId}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'JuriBank Community Discussion',
                url: url
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Post link copied to clipboard', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy link', 'error');
            });
        }
    }
    
    /**
     * Get category color for styling
     */
    getCategoryColor(category) {
        const colors = {
            banking: 'red',
            payments: 'green', 
            ppi: 'purple',
            investment: 'orange',
            mortgage: 'red',
            success: 'green'
        };
        return colors[category] || 'gray';
    }
    
    /**
     * Format category name
     */
    formatCategory(category) {
        const names = {
            banking: 'Banking Issues',
            payments: 'Payment Problems',
            ppi: 'PPI Claims', 
            investment: 'Investment Issues',
            mortgage: 'Mortgage Help',
            success: 'Success Story'
        };
        return names[category] || category;
    }
    
    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
        
        return date.toLocaleDateString();
    }
    
    /**
     * Handle opening a post
     */
    openPost(postId) {
        // In a real implementation, this would navigate to post detail view
        window.location.href = `post.html?id=${postId}`;
    }

    /**
     * Legacy method updates for compatibility
     */
    async checkForNewPosts() {
        // Polling fallback when WebSocket is not available
        if (!this.isConnected) {
            try {
                const response = await fetch(`${this.apiBase}/posts?since=${Date.now() - 30000}`, {
                    headers: this.getAuthHeaders()
                });
                
                if (response.ok) {
                    const { posts } = await response.json();
                    posts.forEach(post => this.handleNewPost(post));
                }
            } catch (error) {
                console.error('[Forum] Polling failed:', error);
            }
        }
    }
}

// Initialize Community Forum API when DOM is ready
let communityForumAPI = null;

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        communityForumAPI = new CommunityForumAPI();
        
        // Make API available globally for debugging
        window.communityForumAPI = communityForumAPI;
    });
}

// Export for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommunityForumAPI;
}

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