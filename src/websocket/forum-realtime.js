/**
 * JuriBank Community Forum Real-Time System v3.0
 * WebSocket implementation for live discussions and notifications
 * Educational platform with privacy-first anonymous interactions
 */

const socketIo = require('socket.io');

class ForumRealtimeSystem {
    constructor(server, forumBackend) {
        this.server = server;
        this.forumBackend = forumBackend;
        this.io = socketIo(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: false // No credentials for anonymous users
            },
            transports: ['websocket', 'polling']
        });

        // Active connections tracking
        this.activeConnections = new Map();
        this.userSessions = new Map();
        this.categoryRooms = new Map();
        this.postRooms = new Map();
        this.typingUsers = new Map();

        // Rate limiting
        this.rateLimits = new Map();
        this.messageHistory = new Map();

        this.initializeSocketHandlers();
        this.startCleanupTasks();
    }

    /**
     * Initialize WebSocket event handlers
     */
    initializeSocketHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`[Forum WebSocket] User connected: ${socket.id}`);
            
            this.handleUserConnection(socket);
            this.setupEventHandlers(socket);
        });

        // Heartbeat to keep connections alive
        setInterval(() => {
            this.io.emit('heartbeat', { timestamp: Date.now() });
        }, 30000);
    }

    /**
     * Handle new user connection
     */
    handleUserConnection(socket) {
        const connection = {
            socketId: socket.id,
            sessionToken: null,
            joinedAt: new Date(),
            lastActivity: new Date(),
            currentCategory: null,
            currentPost: null,
            isAnonymous: true,
            messageCount: 0,
            typing: false
        };

        this.activeConnections.set(socket.id, connection);
        
        // Send connection acknowledgment
        socket.emit('connection-established', {
            socketId: socket.id,
            timestamp: Date.now(),
            totalUsers: this.activeConnections.size
        });

        // Update global statistics
        this.broadcastUserCount();
    }

    /**
     * Setup event handlers for a socket connection
     */
    setupEventHandlers(socket) {
        // Authentication with session token
        socket.on('authenticate', (data) => {
            this.handleAuthentication(socket, data);
        });

        // Category management
        socket.on('join-category', (data) => {
            this.handleJoinCategory(socket, data);
        });

        socket.on('leave-category', (data) => {
            this.handleLeaveCategory(socket, data);
        });

        // Post discussions
        socket.on('join-post', (data) => {
            this.handleJoinPost(socket, data);
        });

        socket.on('leave-post', (data) => {
            this.handleLeavePost(socket, data);
        });

        // Real-time interactions
        socket.on('typing-start', (data) => {
            this.handleTypingStart(socket, data);
        });

        socket.on('typing-stop', (data) => {
            this.handleTypingStop(socket, data);
        });

        socket.on('like-post', (data) => {
            this.handleLikePost(socket, data);
        });

        socket.on('new-post-created', (data) => {
            this.handleNewPostCreated(socket, data);
        });

        socket.on('new-reply-created', (data) => {
            this.handleNewReplyCreated(socket, data);
        });

        // Content reporting
        socket.on('report-content', (data) => {
            this.handleContentReport(socket, data);
        });

        // Moderation events
        socket.on('moderator-action', (data) => {
            this.handleModeratorAction(socket, data);
        });

        // Presence and activity
        socket.on('user-activity', (data) => {
            this.updateUserActivity(socket, data);
        });

        // Error handling
        socket.on('error', (error) => {
            console.error(`[Forum WebSocket] Socket error for ${socket.id}:`, error);
        });

        // Disconnection handling
        socket.on('disconnect', (reason) => {
            this.handleUserDisconnection(socket, reason);
        });

        // Rate limiting middleware
        socket.use((packet, next) => {
            if (this.checkRateLimit(socket.id)) {
                next();
            } else {
                socket.emit('rate-limit-exceeded', {
                    message: 'Too many messages. Please slow down.',
                    retryAfter: 60000
                });
            }
        });
    }

    /**
     * Handle user authentication with session token
     */
    handleAuthentication(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        const { sessionToken } = data;
        
        if (sessionToken && this.validateSessionToken(sessionToken)) {
            connection.sessionToken = sessionToken;
            connection.isAnonymous = true; // Still anonymous even with session
            
            // Join user to their personal notification room
            socket.join(`session-${sessionToken}`);
            
            socket.emit('authentication-success', {
                sessionToken,
                isAnonymous: true,
                timestamp: Date.now()
            });

            console.log(`[Forum WebSocket] User authenticated: ${socket.id} (Session: ${sessionToken})`);
        } else {
            socket.emit('authentication-failed', {
                message: 'Invalid session token',
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle user joining a category
     */
    handleJoinCategory(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        const { categoryId } = data;
        
        // Leave previous category if any
        if (connection.currentCategory) {
            socket.leave(`category-${connection.currentCategory}`);
            this.updateCategoryUserCount(connection.currentCategory, -1);
        }

        // Join new category
        socket.join(`category-${categoryId}`);
        connection.currentCategory = categoryId;
        connection.lastActivity = new Date();
        
        this.updateCategoryUserCount(categoryId, 1);

        // Send category statistics
        socket.emit('category-joined', {
            categoryId,
            userCount: this.getCategoryUserCount(categoryId),
            recentActivity: this.getRecentCategoryActivity(categoryId)
        });

        // Notify others in category (anonymously)
        socket.to(`category-${categoryId}`).emit('user-joined-category', {
            categoryId,
            userCount: this.getCategoryUserCount(categoryId),
            timestamp: Date.now()
        });

        console.log(`[Forum WebSocket] User ${socket.id} joined category: ${categoryId}`);
    }

    /**
     * Handle user leaving a category
     */
    handleLeaveCategory(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection || !connection.currentCategory) return;

        const categoryId = connection.currentCategory;
        
        socket.leave(`category-${categoryId}`);
        connection.currentCategory = null;
        
        this.updateCategoryUserCount(categoryId, -1);

        // Notify others in category
        socket.to(`category-${categoryId}`).emit('user-left-category', {
            categoryId,
            userCount: this.getCategoryUserCount(categoryId),
            timestamp: Date.now()
        });
    }

    /**
     * Handle user joining a post discussion
     */
    handleJoinPost(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        const { postId } = data;
        
        // Leave previous post if any
        if (connection.currentPost) {
            socket.leave(`post-${connection.currentPost}`);
        }

        // Join new post discussion
        socket.join(`post-${postId}`);
        connection.currentPost = postId;
        connection.lastActivity = new Date();

        // Send post statistics
        socket.emit('post-joined', {
            postId,
            activeUsers: this.getPostUserCount(postId),
            timestamp: Date.now()
        });

        // Notify others in post discussion
        socket.to(`post-${postId}`).emit('user-joined-discussion', {
            postId,
            activeUsers: this.getPostUserCount(postId),
            timestamp: Date.now()
        });

        console.log(`[Forum WebSocket] User ${socket.id} joined post discussion: ${postId}`);
    }

    /**
     * Handle user leaving a post discussion
     */
    handleLeavePost(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection || !connection.currentPost) return;

        const postId = connection.currentPost;
        
        socket.leave(`post-${postId}`);
        connection.currentPost = null;
        
        // Stop typing if user was typing
        if (connection.typing) {
            this.handleTypingStop(socket, { postId });
        }

        // Notify others in post discussion
        socket.to(`post-${postId}`).emit('user-left-discussion', {
            postId,
            activeUsers: this.getPostUserCount(postId),
            timestamp: Date.now()
        });
    }

    /**
     * Handle typing indicators
     */
    handleTypingStart(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        const { postId, type = 'reply' } = data;
        
        if (!postId || postId !== connection.currentPost) return;

        connection.typing = true;
        
        // Add to typing users for this post
        if (!this.typingUsers.has(postId)) {
            this.typingUsers.set(postId, new Set());
        }
        this.typingUsers.get(postId).add(socket.id);

        // Notify others in post (anonymously)
        socket.to(`post-${postId}`).emit('user-typing', {
            postId,
            type,
            typingCount: this.typingUsers.get(postId).size,
            timestamp: Date.now()
        });

        // Auto-stop typing after 10 seconds
        setTimeout(() => {
            if (connection.typing) {
                this.handleTypingStop(socket, { postId });
            }
        }, 10000);
    }

    /**
     * Handle stopping typing indicators
     */
    handleTypingStop(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection || !connection.typing) return;

        const { postId } = data;
        
        connection.typing = false;
        
        // Remove from typing users
        if (this.typingUsers.has(postId)) {
            this.typingUsers.get(postId).delete(socket.id);
            
            // Notify others
            socket.to(`post-${postId}`).emit('user-stopped-typing', {
                postId,
                typingCount: this.typingUsers.get(postId).size,
                timestamp: Date.now()
            });

            // Clean up empty typing sets
            if (this.typingUsers.get(postId).size === 0) {
                this.typingUsers.delete(postId);
            }
        }
    }

    /**
     * Handle real-time like updates
     */
    async handleLikePost(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection || !connection.sessionToken) return;

        const { postId, contentType = 'post' } = data;

        try {
            // Call backend to handle like
            const result = await this.forumBackend.toggleLike(postId, connection.sessionToken);
            
            if (result.success) {
                // Broadcast like update to all users viewing this post
                this.io.to(`post-${postId}`).emit('like-updated', {
                    postId,
                    contentType,
                    likes: result.likes,
                    timestamp: Date.now()
                });

                // If in category view, also update category room
                if (connection.currentCategory) {
                    socket.to(`category-${connection.currentCategory}`).emit('post-like-updated', {
                        postId,
                        likes: result.likes,
                        timestamp: Date.now()
                    });
                }
            }
        } catch (error) {
            socket.emit('action-failed', {
                action: 'like',
                error: error.message,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle new post creation broadcast
     */
    handleNewPostCreated(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        const { post, categoryId } = data;

        // Broadcast to category room (exclude sender)
        socket.to(`category-${categoryId}`).emit('new-post', {
            post: this.sanitizePostForBroadcast(post),
            categoryId,
            timestamp: Date.now()
        });

        // Update category statistics
        this.updateCategoryStats(categoryId);

        console.log(`[Forum WebSocket] New post broadcasted to category ${categoryId}: ${post.id}`);
    }

    /**
     * Handle new reply broadcast
     */
    handleNewReplyCreated(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        const { reply, postId } = data;

        // Broadcast to post discussion room (exclude sender)
        socket.to(`post-${postId}`).emit('new-reply', {
            reply: this.sanitizeReplyForBroadcast(reply),
            postId,
            timestamp: Date.now()
        });

        // Also broadcast to category if post is in current category
        if (connection.currentCategory) {
            socket.to(`category-${connection.currentCategory}`).emit('post-reply-added', {
                postId,
                replyCount: reply.post?.replyCount || 0,
                timestamp: Date.now()
            });
        }

        console.log(`[Forum WebSocket] New reply broadcasted to post ${postId}: ${reply.id}`);
    }

    /**
     * Handle content reporting
     */
    async handleContentReport(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection || !connection.sessionToken) return;

        const { contentId, contentType, reason } = data;

        try {
            // Call backend to handle report
            const result = await this.forumBackend.reportContent(contentId, contentType, reason);
            
            if (result.success) {
                // Notify moderators in real-time
                this.io.to('moderators').emit('new-report', {
                    contentId,
                    contentType,
                    reason,
                    timestamp: Date.now()
                });

                socket.emit('report-submitted', {
                    message: result.message,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            socket.emit('action-failed', {
                action: 'report',
                error: error.message,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Handle moderator actions
     */
    handleModeratorAction(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection || !this.isModerator(connection.sessionToken)) return;

        const { action, contentId, contentType, reason } = data;

        // Broadcast moderation action to relevant rooms
        switch (action) {
            case 'approve':
            case 'flag':
            case 'delete':
                this.broadcastModerationAction(contentId, contentType, action, reason);
                break;
        }

        console.log(`[Forum WebSocket] Moderator action: ${action} on ${contentType} ${contentId}`);
    }

    /**
     * Update user activity
     */
    updateUserActivity(socket, data) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        connection.lastActivity = new Date();
        
        // Update activity type if provided
        if (data.activity) {
            connection.currentActivity = data.activity;
        }
    }

    /**
     * Handle user disconnection
     */
    handleUserDisconnection(socket, reason) {
        const connection = this.activeConnections.get(socket.id);
        if (!connection) return;

        console.log(`[Forum WebSocket] User disconnected: ${socket.id} (Reason: ${reason})`);

        // Leave all rooms
        if (connection.currentCategory) {
            this.updateCategoryUserCount(connection.currentCategory, -1);
        }

        if (connection.currentPost && connection.typing) {
            this.handleTypingStop(socket, { postId: connection.currentPost });
        }

        // Clean up connection
        this.activeConnections.delete(socket.id);
        
        // Update global user count
        this.broadcastUserCount();
    }

    /**
     * Utility Methods
     */
    validateSessionToken(token) {
        // In production, validate against database or JWT
        return token && typeof token === 'string' && token.length > 0;
    }

    isModerator(sessionToken) {
        // In production, check moderator status from database
        return false; // Placeholder
    }

    checkRateLimit(socketId) {
        const now = Date.now();
        const limit = this.rateLimits.get(socketId) || { count: 0, resetTime: now + 60000 };
        
        if (now > limit.resetTime) {
            // Reset rate limit
            this.rateLimits.set(socketId, { count: 1, resetTime: now + 60000 });
            return true;
        }
        
        if (limit.count >= 30) { // 30 messages per minute
            return false;
        }
        
        limit.count++;
        this.rateLimits.set(socketId, limit);
        return true;
    }

    getCategoryUserCount(categoryId) {
        let count = 0;
        this.activeConnections.forEach(conn => {
            if (conn.currentCategory === categoryId) count++;
        });
        return count;
    }

    getPostUserCount(postId) {
        let count = 0;
        this.activeConnections.forEach(conn => {
            if (conn.currentPost === postId) count++;
        });
        return count;
    }

    updateCategoryUserCount(categoryId, delta) {
        const currentCount = this.getCategoryUserCount(categoryId);
        
        this.io.to(`category-${categoryId}`).emit('category-user-count-updated', {
            categoryId,
            userCount: currentCount,
            timestamp: Date.now()
        });
    }

    broadcastUserCount() {
        this.io.emit('global-user-count', {
            totalUsers: this.activeConnections.size,
            timestamp: Date.now()
        });
    }

    sanitizePostForBroadcast(post) {
        return {
            id: post.id,
            title: post.title,
            content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
            category: post.category,
            author: post.author,
            createdAt: post.createdAt,
            likes: post.likes,
            replyCount: post.replyCount
        };
    }

    sanitizeReplyForBroadcast(reply) {
        return {
            id: reply.id,
            content: reply.content,
            author: reply.author,
            createdAt: reply.createdAt,
            likes: reply.likes,
            isHelpful: reply.isHelpful
        };
    }

    getRecentCategoryActivity(categoryId) {
        // Mock implementation - would query database in production
        return {
            recentPosts: 3,
            recentReplies: 12,
            lastActivity: new Date()
        };
    }

    updateCategoryStats(categoryId) {
        // Update and broadcast category statistics
        const activity = this.getRecentCategoryActivity(categoryId);
        
        this.io.to(`category-${categoryId}`).emit('category-stats-updated', {
            categoryId,
            activity,
            timestamp: Date.now()
        });
    }

    broadcastModerationAction(contentId, contentType, action, reason) {
        this.io.emit('moderation-action', {
            contentId,
            contentType,
            action,
            reason,
            timestamp: Date.now()
        });
    }

    /**
     * Cleanup tasks
     */
    startCleanupTasks() {
        // Clean up inactive connections every 5 minutes
        setInterval(() => {
            const now = Date.now();
            const inactiveThreshold = 5 * 60 * 1000; // 5 minutes
            
            this.activeConnections.forEach((connection, socketId) => {
                if (now - connection.lastActivity.getTime() > inactiveThreshold) {
                    const socket = this.io.sockets.sockets.get(socketId);
                    if (socket) {
                        socket.disconnect(true);
                    }
                    this.activeConnections.delete(socketId);
                }
            });
        }, 5 * 60 * 1000);

        // Clean up rate limits every minute
        setInterval(() => {
            const now = Date.now();
            this.rateLimits.forEach((limit, socketId) => {
                if (now > limit.resetTime) {
                    this.rateLimits.delete(socketId);
                }
            });
        }, 60 * 1000);

        // Clean up empty typing indicators every 30 seconds
        setInterval(() => {
            this.typingUsers.forEach((users, postId) => {
                if (users.size === 0) {
                    this.typingUsers.delete(postId);
                }
            });
        }, 30 * 1000);
    }

    /**
     * Get system statistics
     */
    getSystemStats() {
        return {
            activeConnections: this.activeConnections.size,
            categoryRooms: this.categoryRooms.size,
            postRooms: this.postRooms.size,
            typingUsers: this.typingUsers.size,
            rateLimitedUsers: this.rateLimits.size,
            uptime: process.uptime()
        };
    }
}

module.exports = ForumRealtimeSystem;