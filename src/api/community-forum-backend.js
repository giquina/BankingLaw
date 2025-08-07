/**
 * JuriBank Community Forum Backend v3.0
 * Comprehensive backend infrastructure for anonymous peer support platform
 * Moderated by law students with professional oversight
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');

class CommunityForumBackend {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // In-memory storage (would be PostgreSQL in production)
        this.posts = new Map();
        this.users = new Map();
        this.sessions = new Map();
        this.moderationQueue = new Map();
        this.reports = new Map();
        this.categories = new Map();
        this.notifications = new Map();
        
        // Active connections for real-time updates
        this.activeConnections = new Map();
        
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeWebSocket();
        this.initializeCategories();
        this.initializeModerationSystem();
        this.startServer();
    }

    /**
     * Initialize Express middleware
     */
    initializeMiddleware() {
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        
        // CORS middleware
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Session-Token');
            
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        // Session middleware for anonymous users
        this.app.use('/api/forum', (req, res, next) => {
            const sessionToken = req.headers['session-token'] || this.generateSessionToken();
            
            if (!this.sessions.has(sessionToken)) {
                this.sessions.set(sessionToken, {
                    id: sessionToken,
                    createdAt: new Date(),
                    isAnonymous: true,
                    posts: [],
                    likes: new Set(),
                    reports: []
                });
            }

            req.session = this.sessions.get(sessionToken);
            req.sessionToken = sessionToken;
            res.header('Session-Token', sessionToken);
            
            next();
        });

        // Content filtering middleware
        this.app.use('/api/forum', (req, res, next) => {
            if (req.method === 'POST' && (req.body.content || req.body.title)) {
                const filteredContent = this.filterContent(req.body);
                req.body = { ...req.body, ...filteredContent };
            }
            next();
        });
    }

    /**
     * Initialize API routes
     */
    initializeRoutes() {
        const router = express.Router();

        // Forum posts endpoints
        router.get('/posts', this.getPosts.bind(this));
        router.post('/posts', this.createPost.bind(this));
        router.get('/posts/:postId', this.getPost.bind(this));
        router.put('/posts/:postId/like', this.likePost.bind(this));
        router.post('/posts/:postId/replies', this.addReply.bind(this));
        
        // Categories
        router.get('/categories', this.getCategories.bind(this));
        
        // Search
        router.get('/search', this.searchContent.bind(this));
        
        // Moderation
        router.post('/report', this.reportContent.bind(this));
        router.get('/moderation/queue', this.getModerationQueue.bind(this));
        router.put('/moderation/:reportId', this.handleModerationAction.bind(this));
        
        // Statistics
        router.get('/stats', this.getForumStats.bind(this));
        
        // User session
        router.get('/session', this.getSession.bind(this));

        this.app.use('/api/forum', router);

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'healthy', 
                timestamp: new Date(),
                activeSessions: this.sessions.size,
                totalPosts: this.posts.size
            });
        });
    }

    /**
     * Initialize WebSocket for real-time updates
     */
    initializeWebSocket() {
        this.io.on('connection', (socket) => {
            console.log('User connected:', socket.id);
            
            // Store connection
            this.activeConnections.set(socket.id, {
                socketId: socket.id,
                joinedAt: new Date(),
                currentCategory: null,
                currentPost: null
            });

            // Join category room
            socket.on('join-category', (categoryId) => {
                const connection = this.activeConnections.get(socket.id);
                if (connection) {
                    if (connection.currentCategory) {
                        socket.leave(connection.currentCategory);
                    }
                    socket.join(categoryId);
                    connection.currentCategory = categoryId;
                    
                    console.log(`User ${socket.id} joined category: ${categoryId}`);
                }
            });

            // Join post discussion
            socket.on('join-post', (postId) => {
                const connection = this.activeConnections.get(socket.id);
                if (connection) {
                    if (connection.currentPost) {
                        socket.leave(`post-${connection.currentPost}`);
                    }
                    socket.join(`post-${postId}`);
                    connection.currentPost = postId;
                    
                    console.log(`User ${socket.id} joined post: ${postId}`);
                }
            });

            // Handle user typing
            socket.on('typing', (data) => {
                socket.to(`post-${data.postId}`).emit('user-typing', {
                    postId: data.postId,
                    isTyping: data.isTyping
                });
            });

            // Handle disconnect
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                this.activeConnections.delete(socket.id);
            });
        });
    }

    /**
     * Initialize forum categories
     */
    initializeCategories() {
        const categories = [
            {
                id: 'banking',
                name: 'Banking Issues',
                description: 'Overdraft charges, account problems, banking disputes',
                icon: 'fas fa-university',
                color: 'blue',
                moderatorRequired: false
            },
            {
                id: 'payments',
                name: 'Payment Problems',
                description: 'Card disputes, transaction issues, payment failures',
                icon: 'fas fa-credit-card',
                color: 'green',
                moderatorRequired: false
            },
            {
                id: 'ppi',
                name: 'PPI Claims',
                description: 'Payment protection insurance experiences and guidance',
                icon: 'fas fa-shield-alt',
                color: 'purple',
                moderatorRequired: true
            },
            {
                id: 'investment',
                name: 'Investment Issues',
                description: 'Investment advice complaints, pension issues',
                icon: 'fas fa-chart-line',
                color: 'orange',
                moderatorRequired: true
            },
            {
                id: 'mortgage',
                name: 'Mortgage Help',
                description: 'Mortgage applications, payment difficulties, advice complaints',
                icon: 'fas fa-home',
                color: 'red',
                moderatorRequired: false
            },
            {
                id: 'success',
                name: 'Success Stories',
                description: 'Share your positive outcomes and experiences',
                icon: 'fas fa-trophy',
                color: 'yellow',
                moderatorRequired: false
            }
        ];

        categories.forEach(category => {
            this.categories.set(category.id, {
                ...category,
                postCount: 0,
                createdAt: new Date()
            });
        });
    }

    /**
     * Initialize moderation system
     */
    initializeModerationSystem() {
        this.moderationRules = {
            // Blocked words for educational compliance
            blockedWords: [
                'specific legal advice', 'sue them', 'file lawsuit', 'guaranteed win',
                'personal details', 'my address is', 'my phone is', 'email me at'
            ],
            
            // Educational boundary enforcement
            educationalFlags: [
                'you should definitely', 'you must do', 'i guarantee', 'legal action',
                'court case', 'lawsuit', 'legal advice', 'professional advice'
            ],
            
            // Privacy protection patterns
            privacyPatterns: [
                /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Card numbers
                /\b\d{2}[\s-]?\d{2}[\s-]?\d{2}\b/, // Sort codes  
                /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
                /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/, // Phone numbers
                /\b(?:Mr|Mrs|Ms|Dr|Professor)\s+[A-Z][a-z]+\b/ // Names with titles
            ]
        };

        // Student moderators (mock data)
        this.moderators = new Map([
            ['mod_001', {
                id: 'mod_001',
                name: 'LLB Student - Cambridge',
                specialization: ['banking', 'consumer'],
                verified: true,
                activeHours: '9:00-17:00',
                responses: 127
            }],
            ['mod_002', {
                id: 'mod_002', 
                name: 'LLB Student - Oxford',
                specialization: ['investment', 'ppi'],
                verified: true,
                activeHours: '10:00-18:00',
                responses: 98
            }]
        ]);

        // Professional oversight
        this.professionalOversight = {
            id: 'prof_001',
            name: 'Qualified Solicitor',
            qualification: 'LLM, Solicitor (England & Wales)',
            specialization: 'Financial Services Law',
            verified: true
        };
    }

    /**
     * API Handlers
     */
    async getPosts(req, res) {
        try {
            const { category = 'all', sort = 'recent', page = 1, limit = 10, search } = req.query;
            
            let posts = Array.from(this.posts.values());
            
            // Apply filters
            if (category !== 'all') {
                posts = posts.filter(post => post.category === category);
            }
            
            if (search) {
                const searchLower = search.toLowerCase();
                posts = posts.filter(post => 
                    post.title.toLowerCase().includes(searchLower) ||
                    post.content.toLowerCase().includes(searchLower)
                );
            }
            
            // Apply sorting
            switch (sort) {
                case 'popular':
                    posts.sort((a, b) => (b.likes + b.replyCount * 2) - (a.likes + a.replyCount * 2));
                    break;
                case 'answered':
                    posts.sort((a, b) => b.replyCount - a.replyCount);
                    break;
                case 'trending':
                    posts.sort((a, b) => this.calculateTrendingScore(b) - this.calculateTrendingScore(a));
                    break;
                default: // recent
                    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            
            // Apply pagination
            const startIndex = (page - 1) * limit;
            const paginatedPosts = posts.slice(startIndex, startIndex + parseInt(limit));
            
            res.json({
                posts: paginatedPosts,
                total: posts.length,
                page: parseInt(page),
                totalPages: Math.ceil(posts.length / limit),
                hasMore: startIndex + parseInt(limit) < posts.length
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch posts', message: error.message });
        }
    }

    async createPost(req, res) {
        try {
            const { title, content, category } = req.body;
            
            // Validation
            if (!title || !content || !category) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            if (title.length < 10) {
                return res.status(400).json({ error: 'Title must be at least 10 characters' });
            }
            
            if (content.length < 20) {
                return res.status(400).json({ error: 'Content must be at least 20 characters' });
            }
            
            // Content moderation
            const moderationResult = await this.moderateContent(title, content);
            if (!moderationResult.approved) {
                return res.status(400).json({ 
                    error: 'Content moderation failed', 
                    reason: moderationResult.reason,
                    suggestions: moderationResult.suggestions 
                });
            }
            
            // Create post
            const postId = this.generateId();
            const post = {
                id: postId,
                title: moderationResult.title || title,
                content: moderationResult.content || content,
                category,
                author: {
                    id: req.session.id,
                    displayName: 'Anonymous User',
                    isAnonymous: true
                },
                createdAt: new Date(),
                updatedAt: new Date(),
                likes: 0,
                replies: [],
                replyCount: 0,
                views: 0,
                status: 'published',
                moderationFlags: moderationResult.flags || [],
                tags: this.extractTags(content),
                isHelpful: false,
                isPinned: false
            };
            
            this.posts.set(postId, post);
            
            // Update category stats
            const categoryData = this.categories.get(category);
            if (categoryData) {
                categoryData.postCount++;
            }
            
            // Add to user session
            req.session.posts.push(postId);
            
            // Real-time notification
            this.io.to(category).emit('new-post', {
                post: this.sanitizePost(post),
                category
            });
            
            res.status(201).json({
                success: true,
                post: this.sanitizePost(post),
                message: 'Post created successfully'
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to create post', message: error.message });
        }
    }

    async getPost(req, res) {
        try {
            const { postId } = req.params;
            const post = this.posts.get(postId);
            
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            
            // Increment view count
            post.views++;
            
            res.json({
                post: this.sanitizePost(post),
                replies: post.replies.map(reply => this.sanitizeReply(reply))
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch post', message: error.message });
        }
    }

    async addReply(req, res) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            
            const post = this.posts.get(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            
            if (!content || content.length < 10) {
                return res.status(400).json({ error: 'Reply must be at least 10 characters' });
            }
            
            // Content moderation for reply
            const moderationResult = await this.moderateContent('', content);
            if (!moderationResult.approved) {
                return res.status(400).json({ 
                    error: 'Content moderation failed', 
                    reason: moderationResult.reason
                });
            }
            
            const replyId = this.generateId();
            const reply = {
                id: replyId,
                content: moderationResult.content || content,
                author: {
                    id: req.session.id,
                    displayName: 'Anonymous User', 
                    isAnonymous: true
                },
                createdAt: new Date(),
                likes: 0,
                isHelpful: false,
                moderatorVerified: false
            };
            
            post.replies.push(reply);
            post.replyCount = post.replies.length;
            post.updatedAt = new Date();
            
            // Real-time notification
            this.io.to(`post-${postId}`).emit('new-reply', {
                postId,
                reply: this.sanitizeReply(reply)
            });
            
            res.status(201).json({
                success: true,
                reply: this.sanitizeReply(reply),
                message: 'Reply added successfully'
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to add reply', message: error.message });
        }
    }

    async likePost(req, res) {
        try {
            const { postId } = req.params;
            const post = this.posts.get(postId);
            
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            
            // Check if user already liked (simplified)
            if (req.session.likes.has(postId)) {
                req.session.likes.delete(postId);
                post.likes = Math.max(0, post.likes - 1);
            } else {
                req.session.likes.add(postId);
                post.likes++;
            }
            
            // Real-time update
            this.io.to(`post-${postId}`).emit('like-update', {
                postId,
                likes: post.likes
            });
            
            res.json({
                success: true,
                likes: post.likes,
                userLiked: req.session.likes.has(postId)
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to like post', message: error.message });
        }
    }

    async getCategories(req, res) {
        try {
            const categories = Array.from(this.categories.values()).map(cat => ({
                id: cat.id,
                name: cat.name,
                description: cat.description,
                icon: cat.icon,
                color: cat.color,
                postCount: cat.postCount
            }));
            
            res.json({ categories });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
        }
    }

    async searchContent(req, res) {
        try {
            const { q: query, category, includeReplies = 'false' } = req.query;
            
            if (!query) {
                return res.status(400).json({ error: 'Search query required' });
            }
            
            const searchLower = query.toLowerCase();
            let posts = Array.from(this.posts.values());
            
            const results = posts.filter(post => {
                // Search in title and content
                const titleMatch = post.title.toLowerCase().includes(searchLower);
                const contentMatch = post.content.toLowerCase().includes(searchLower);
                
                // Search in replies if requested
                let replyMatch = false;
                if (includeReplies === 'true') {
                    replyMatch = post.replies.some(reply => 
                        reply.content.toLowerCase().includes(searchLower)
                    );
                }
                
                // Category filter
                const categoryMatch = !category || category === 'all' || post.category === category;
                
                return (titleMatch || contentMatch || replyMatch) && categoryMatch;
            });
            
            res.json({
                results: results.map(post => this.sanitizePost(post)),
                total: results.length,
                query
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Search failed', message: error.message });
        }
    }

    async reportContent(req, res) {
        try {
            const { contentId, contentType, reason } = req.body;
            
            if (!contentId || !contentType || !reason) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            
            const reportId = this.generateId();
            const report = {
                id: reportId,
                contentId,
                contentType,
                reason,
                reportedBy: req.session.id,
                createdAt: new Date(),
                status: 'pending',
                moderatorAssigned: null,
                reviewedAt: null
            };
            
            this.reports.set(reportId, report);
            this.moderationQueue.set(reportId, report);
            
            // Notify moderators
            this.io.emit('new-report', { reportId, contentType, reason });
            
            res.json({
                success: true,
                message: 'Content reported successfully. Our student moderators will review it.'
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to report content', message: error.message });
        }
    }

    async getForumStats(req, res) {
        try {
            const posts = Array.from(this.posts.values());
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            const stats = {
                totalPosts: posts.length,
                totalReplies: posts.reduce((sum, post) => sum + post.replyCount, 0),
                activeMembers: this.sessions.size,
                postsToday: posts.filter(post => new Date(post.createdAt) >= today).length,
                categoriesActive: this.categories.size,
                moderationQueue: this.moderationQueue.size,
                studentModerators: this.moderators.size,
                questionAnswerRate: posts.length > 0 ? 
                    posts.filter(post => post.replyCount > 0).length / posts.length : 0
            };
            
            res.json({ stats });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
        }
    }

    async getSession(req, res) {
        try {
            const sessionInfo = {
                id: req.session.id,
                isAnonymous: req.session.isAnonymous,
                postsCount: req.session.posts.length,
                joinedAt: req.session.createdAt,
                token: req.sessionToken
            };
            
            res.json({ session: sessionInfo });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to get session', message: error.message });
        }
    }

    /**
     * Utility Methods
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    generateSessionToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    async moderateContent(title, content) {
        const fullText = `${title} ${content}`.toLowerCase();
        const flags = [];
        const suggestions = [];
        
        // Check for blocked words
        const hasBlockedWords = this.moderationRules.blockedWords.some(word => 
            fullText.includes(word.toLowerCase())
        );
        
        if (hasBlockedWords) {
            flags.push('blocked_words');
            suggestions.push('Please avoid requesting specific legal advice. Frame your question as sharing an experience or asking for educational information.');
        }
        
        // Check for educational boundary violations
        const hasEducationalViolations = this.moderationRules.educationalFlags.some(flag => 
            fullText.includes(flag.toLowerCase())
        );
        
        if (hasEducationalViolations) {
            flags.push('educational_boundary');
            suggestions.push('This appears to be giving specific advice. Please share your experience rather than giving definitive guidance.');
        }
        
        // Check for privacy violations
        const hasPrivacyViolations = this.moderationRules.privacyPatterns.some(pattern => 
            pattern.test(content)
        );
        
        if (hasPrivacyViolations) {
            flags.push('privacy_violation');
            suggestions.push('Please remove personal information for your privacy and security.');
            return { approved: false, reason: 'Privacy violation detected', suggestions };
        }
        
        // Auto-approve if no major issues
        const approved = !hasBlockedWords && !hasPrivacyViolations;
        
        return {
            approved,
            flags,
            suggestions,
            reason: flags.length > 0 ? 'Content needs review' : null,
            title: title,
            content: content
        };
    }

    filterContent(data) {
        // Basic content filtering
        const filtered = { ...data };
        
        if (filtered.title) {
            filtered.title = filtered.title.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD NUMBER REMOVED]');
            filtered.title = filtered.title.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REMOVED]');
        }
        
        if (filtered.content) {
            filtered.content = filtered.content.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD NUMBER REMOVED]');
            filtered.content = filtered.content.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REMOVED]');
            filtered.content = filtered.content.replace(/\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, '[PHONE REMOVED]');
        }
        
        return filtered;
    }

    extractTags(content) {
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

    calculateTrendingScore(post) {
        const ageHours = (Date.now() - new Date(post.createdAt)) / (1000 * 60 * 60);
        const engagement = post.likes + (post.replyCount * 2) + (post.views * 0.1);
        return engagement / Math.pow(ageHours + 1, 1.5);
    }

    sanitizePost(post) {
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            author: post.author,
            createdAt: post.createdAt,
            likes: post.likes,
            replyCount: post.replyCount,
            views: post.views,
            tags: post.tags,
            isHelpful: post.isHelpful,
            isPinned: post.isPinned
        };
    }

    sanitizeReply(reply) {
        return {
            id: reply.id,
            content: reply.content,
            author: reply.author,
            createdAt: reply.createdAt,
            likes: reply.likes,
            isHelpful: reply.isHelpful,
            moderatorVerified: reply.moderatorVerified
        };
    }

    startServer() {
        const PORT = process.env.PORT || 3001;
        this.server.listen(PORT, () => {
            console.log(`Community Forum Backend running on port ${PORT}`);
            console.log('Real-time WebSocket server initialized');
            console.log('Educational compliance system active');
        });
    }
}

// Initialize the Community Forum Backend
const forumBackend = new CommunityForumBackend();

module.exports = CommunityForumBackend;