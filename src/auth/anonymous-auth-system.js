/**
 * JuriBank Anonymous Authentication System v3.0
 * Privacy-first session management for community forum
 * Complete anonymity with educational compliance
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class AnonymousAuthSystem {
    constructor(options = {}) {
        this.options = {
            sessionTimeout: options.sessionTimeout || 7 * 24 * 60 * 60 * 1000, // 7 days
            tokenSecret: options.tokenSecret || process.env.JWT_SECRET || 'juribank-forum-secret',
            sessionCleanupInterval: options.sessionCleanupInterval || 60 * 60 * 1000, // 1 hour
            maxSessionsPerIP: options.maxSessionsPerIP || 10,
            rateLimit: options.rateLimit || {
                windowMs: 15 * 60 * 1000, // 15 minutes
                maxAttempts: 100 // Max 100 requests per 15 minutes
            },
            ...options
        };

        // In-memory storage (use Redis in production)
        this.sessions = new Map();
        this.ipSessions = new Map(); // Track sessions per IP hash
        this.rateLimits = new Map();
        this.bannedHashes = new Set();

        this.startCleanupTasks();
        this.initializeSecurityMeasures();
    }

    /**
     * Create a new anonymous session
     */
    async createAnonymousSession(req) {
        try {
            // Rate limiting check
            const ipHash = this.hashIP(this.getClientIP(req));
            if (!this.checkRateLimit(ipHash)) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            // Check for banned IPs
            if (this.bannedHashes.has(ipHash)) {
                throw new Error('Access denied.');
            }

            // Check session limit per IP
            if (this.getSessionCountForIP(ipHash) >= this.options.maxSessionsPerIP) {
                throw new Error('Too many active sessions from this location.');
            }

            // Generate session data
            const sessionId = this.generateSessionId();
            const sessionToken = this.generateSessionToken();
            const expiresAt = new Date(Date.now() + this.options.sessionTimeout);

            const session = {
                id: sessionId,
                token: sessionToken,
                ipHash: ipHash,
                userAgent: this.hashUserAgent(req.headers['user-agent']),
                
                // Timestamps
                createdAt: new Date(),
                lastActive: new Date(),
                expiresAt: expiresAt,
                
                // Privacy protection
                isAnonymous: true,
                hasPersonalInfo: false,
                
                // Activity tracking
                postCount: 0,
                replyCount: 0,
                likeCount: 0,
                reportCount: 0,
                
                // Behavioral analysis for moderation
                suspicionScore: 0,
                behaviorFlags: [],
                
                // Session preferences
                preferences: {
                    notifications: true,
                    realTimeUpdates: true,
                    accessibility: false
                },
                
                // Educational compliance tracking
                complianceWarnings: 0,
                educationalPrompts: 0,
                
                // Security features
                fingerprintHash: this.generateFingerprint(req),
                isVerified: false
            };

            // Store session
            this.sessions.set(sessionId, session);
            
            // Track IP sessions
            this.addSessionToIP(ipHash, sessionId);

            // Generate JWT token for client
            const clientToken = this.generateClientToken(session);

            return {
                success: true,
                sessionId: sessionId,
                token: clientToken,
                expiresAt: expiresAt,
                preferences: session.preferences
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Validate and refresh an existing session
     */
    async validateSession(token, req) {
        try {
            // Decode JWT token
            const decoded = jwt.verify(token, this.options.tokenSecret);
            const sessionId = decoded.sessionId;

            const session = this.sessions.get(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            // Check expiration
            if (new Date() > session.expiresAt) {
                this.sessions.delete(sessionId);
                throw new Error('Session expired');
            }

            // Verify fingerprint for additional security
            const currentFingerprint = this.generateFingerprint(req);
            if (session.fingerprintHash !== currentFingerprint) {
                // Possible session hijacking - mark as suspicious
                session.suspicionScore += 10;
                session.behaviorFlags.push('fingerprint_mismatch');
                
                if (session.suspicionScore > 50) {
                    this.sessions.delete(sessionId);
                    throw new Error('Session security violation');
                }
            }

            // Update last active
            session.lastActive = new Date();
            
            // Rate limiting check
            if (!this.checkRateLimit(session.ipHash)) {
                throw new Error('Rate limit exceeded');
            }

            return {
                success: true,
                session: this.sanitizeSessionForClient(session)
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update session activity and preferences
     */
    async updateSession(sessionId, updates) {
        try {
            const session = this.sessions.get(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            // Update allowed fields
            const allowedUpdates = ['preferences', 'lastActive'];
            Object.keys(updates).forEach(key => {
                if (allowedUpdates.includes(key)) {
                    if (key === 'preferences') {
                        session.preferences = { ...session.preferences, ...updates.preferences };
                    } else {
                        session[key] = updates[key];
                    }
                }
            });

            return {
                success: true,
                session: this.sanitizeSessionForClient(session)
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Track user activity for behavioral analysis
     */
    trackActivity(sessionId, activity) {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        switch (activity.type) {
            case 'post_created':
                session.postCount++;
                this.analyzePostingBehavior(session);
                break;
                
            case 'reply_created':
                session.replyCount++;
                break;
                
            case 'content_liked':
                session.likeCount++;
                break;
                
            case 'content_reported':
                session.reportCount++;
                this.analyzeReportingBehavior(session);
                break;
                
            case 'compliance_warning':
                session.complianceWarnings++;
                this.analyzeComplianceBehavior(session);
                break;
                
            case 'educational_prompt':
                session.educationalPrompts++;
                break;
        }

        // Update activity timestamp
        session.lastActive = new Date();
        
        // Check for suspicious behavior
        this.analyzeBehavior(session);
    }

    /**
     * Invalidate a session (logout)
     */
    async invalidateSession(sessionId) {
        try {
            const session = this.sessions.get(sessionId);
            if (!session) {
                return { success: false, error: 'Session not found' };
            }

            // Remove from IP tracking
            this.removeSessionFromIP(session.ipHash, sessionId);
            
            // Delete session
            this.sessions.delete(sessionId);

            return { success: true };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get session information for client
     */
    getSessionInfo(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return { success: false, error: 'Session not found' };
        }

        return {
            success: true,
            session: this.sanitizeSessionForClient(session)
        };
    }

    /**
     * Privacy protection methods
     */
    hashIP(ip) {
        // Use SHA-256 with salt for IP privacy
        const salt = 'juribank-ip-salt';
        return crypto.createHash('sha256').update(ip + salt).digest('hex');
    }

    hashUserAgent(userAgent) {
        if (!userAgent) return null;
        return crypto.createHash('sha256').update(userAgent).digest('hex').substring(0, 16);
    }

    generateFingerprint(req) {
        // Create a unique fingerprint without storing personal info
        const fingerprint = [
            this.hashUserAgent(req.headers['user-agent']),
            req.headers['accept-language'] || '',
            req.headers['accept-encoding'] || '',
            req.headers['accept'] || ''
        ].join('|');
        
        return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 32);
    }

    getClientIP(req) {
        return req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
               '127.0.0.1';
    }

    /**
     * Token generation and management
     */
    generateSessionId() {
        return 'sess_' + crypto.randomBytes(16).toString('hex');
    }

    generateSessionToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    generateClientToken(session) {
        return jwt.sign(
            {
                sessionId: session.id,
                isAnonymous: true,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(session.expiresAt.getTime() / 1000)
            },
            this.options.tokenSecret
        );
    }

    /**
     * Rate limiting
     */
    checkRateLimit(identifier) {
        const now = Date.now();
        const limit = this.rateLimits.get(identifier);

        if (!limit) {
            this.rateLimits.set(identifier, {
                count: 1,
                resetTime: now + this.options.rateLimit.windowMs
            });
            return true;
        }

        if (now > limit.resetTime) {
            limit.count = 1;
            limit.resetTime = now + this.options.rateLimit.windowMs;
            return true;
        }

        if (limit.count >= this.options.rateLimit.maxAttempts) {
            return false;
        }

        limit.count++;
        return true;
    }

    /**
     * Behavioral analysis for moderation
     */
    analyzeBehavior(session) {
        let suspicionIncrease = 0;

        // Check for rapid posting (potential spam)
        if (session.postCount > 10 && session.postCount > session.replyCount * 3) {
            suspicionIncrease += 5;
            session.behaviorFlags.push('rapid_posting');
        }

        // Check for high complaint rate
        if (session.reportCount > 5) {
            suspicionIncrease += 3;
            session.behaviorFlags.push('high_reporting');
        }

        // Check for compliance warnings
        if (session.complianceWarnings > 3) {
            suspicionIncrease += 10;
            session.behaviorFlags.push('compliance_violations');
        }

        session.suspicionScore += suspicionIncrease;

        // Auto-ban for very high suspicion
        if (session.suspicionScore > 100) {
            this.bannedHashes.add(session.ipHash);
            this.sessions.delete(session.id);
        }
    }

    analyzePostingBehavior(session) {
        const now = Date.now();
        const sessionAge = now - session.createdAt.getTime();
        const postsPerHour = (session.postCount / sessionAge) * 1000 * 60 * 60;

        // Flag if posting too frequently
        if (postsPerHour > 10) {
            session.behaviorFlags.push('high_posting_frequency');
            session.suspicionScore += 5;
        }
    }

    analyzeReportingBehavior(session) {
        // Flag users who report too much content
        if (session.reportCount > session.postCount + session.replyCount) {
            session.behaviorFlags.push('excessive_reporting');
            session.suspicionScore += 3;
        }
    }

    analyzeComplianceBehavior(session) {
        // Educational intervention for compliance issues
        if (session.complianceWarnings > 2) {
            session.behaviorFlags.push('needs_educational_guidance');
        }
    }

    /**
     * IP session management
     */
    addSessionToIP(ipHash, sessionId) {
        if (!this.ipSessions.has(ipHash)) {
            this.ipSessions.set(ipHash, new Set());
        }
        this.ipSessions.get(ipHash).add(sessionId);
    }

    removeSessionFromIP(ipHash, sessionId) {
        if (this.ipSessions.has(ipHash)) {
            this.ipSessions.get(ipHash).delete(sessionId);
            if (this.ipSessions.get(ipHash).size === 0) {
                this.ipSessions.delete(ipHash);
            }
        }
    }

    getSessionCountForIP(ipHash) {
        return this.ipSessions.has(ipHash) ? this.ipSessions.get(ipHash).size : 0;
    }

    /**
     * Security measures
     */
    initializeSecurityMeasures() {
        // Add known malicious IP patterns to ban list
        // This would be populated from threat intelligence in production
        
        console.log('[Anonymous Auth] Security measures initialized');
    }

    /**
     * Cleanup and maintenance
     */
    startCleanupTasks() {
        // Clean expired sessions every hour
        setInterval(() => {
            this.cleanupExpiredSessions();
        }, this.options.sessionCleanupInterval);

        // Reset rate limits periodically
        setInterval(() => {
            const now = Date.now();
            this.rateLimits.forEach((limit, identifier) => {
                if (now > limit.resetTime) {
                    this.rateLimits.delete(identifier);
                }
            });
        }, this.options.rateLimit.windowMs);

        // Clean up IP session tracking
        setInterval(() => {
            this.ipSessions.forEach((sessions, ipHash) => {
                sessions.forEach(sessionId => {
                    if (!this.sessions.has(sessionId)) {
                        sessions.delete(sessionId);
                    }
                });
                if (sessions.size === 0) {
                    this.ipSessions.delete(ipHash);
                }
            });
        }, this.options.sessionCleanupInterval);
    }

    cleanupExpiredSessions() {
        const now = new Date();
        let cleanedCount = 0;

        this.sessions.forEach((session, sessionId) => {
            if (now > session.expiresAt) {
                this.removeSessionFromIP(session.ipHash, sessionId);
                this.sessions.delete(sessionId);
                cleanedCount++;
            }
        });

        if (cleanedCount > 0) {
            console.log(`[Anonymous Auth] Cleaned up ${cleanedCount} expired sessions`);
        }
    }

    /**
     * Utility methods
     */
    sanitizeSessionForClient(session) {
        return {
            id: session.id,
            isAnonymous: session.isAnonymous,
            createdAt: session.createdAt,
            lastActive: session.lastActive,
            expiresAt: session.expiresAt,
            preferences: session.preferences,
            postCount: session.postCount,
            replyCount: session.replyCount,
            likeCount: session.likeCount,
            complianceWarnings: session.complianceWarnings,
            isVerified: session.isVerified
        };
    }

    /**
     * Statistics and monitoring
     */
    getSystemStats() {
        const activeSessions = Array.from(this.sessions.values())
            .filter(session => new Date() <= session.expiresAt);

        return {
            totalSessions: this.sessions.size,
            activeSessions: activeSessions.length,
            uniqueIPs: this.ipSessions.size,
            rateLimitedIPs: this.rateLimits.size,
            bannedIPs: this.bannedHashes.size,
            averageSessionAge: this.calculateAverageSessionAge(activeSessions),
            totalPosts: activeSessions.reduce((sum, s) => sum + s.postCount, 0),
            totalReplies: activeSessions.reduce((sum, s) => sum + s.replyCount, 0),
            complianceWarnings: activeSessions.reduce((sum, s) => sum + s.complianceWarnings, 0)
        };
    }

    calculateAverageSessionAge(sessions) {
        if (sessions.length === 0) return 0;
        
        const now = Date.now();
        const totalAge = sessions.reduce((sum, session) => 
            sum + (now - session.createdAt.getTime()), 0);
        
        return Math.round(totalAge / sessions.length / 1000 / 60); // minutes
    }

    /**
     * Educational compliance helpers
     */
    flagForEducationalGuidance(sessionId, reason) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.behaviorFlags.push(`educational_guidance_${reason}`);
            session.complianceWarnings++;
        }
    }

    getComplianceStatus(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        return {
            warningCount: session.complianceWarnings,
            needsGuidance: session.behaviorFlags.some(flag => 
                flag.includes('educational_guidance') || flag.includes('compliance_violations')),
            suspicionScore: session.suspicionScore,
            flags: session.behaviorFlags
        };
    }
}

module.exports = AnonymousAuthSystem;