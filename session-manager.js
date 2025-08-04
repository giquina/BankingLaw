/**
 * JuriBank Platform - Secure Session Management
 * Banking-grade session handling with security features
 */

class JuriBankSessionManager {
    constructor() {
        this.sessions = new Map();
        this.sessionConfig = {
            maxAge: 30 * 60 * 1000, // 30 minutes
            refreshThreshold: 5 * 60 * 1000, // Refresh if less than 5 minutes remaining
            maxSessions: 1000, // Prevent memory issues
            cleanupInterval: 5 * 60 * 1000 // Cleanup every 5 minutes
        };
        
        this.initializeSessionManager();
    }

    /**
     * Create new secure session
     */
    createSession(userData = {}) {
        const sessionId = this.generateSecureSessionId();
        const now = Date.now();
        
        const session = {
            id: sessionId,
            created: now,
            lastActivity: now,
            data: this.sanitizeSessionData(userData),
            securityFlags: {
                ipAddress: userData.ipAddress || null,
                userAgent: userData.userAgent || null,
                fingerprintHash: this.generateFingerprint(userData),
                loginAttempts: 0,
                suspicious: false
            },
            permissions: {
                canSubmitForms: true,
                canAccessPortal: true,
                rateLimitRemaining: 100
            }
        };

        // Cleanup old sessions if approaching limit
        if (this.sessions.size >= this.sessionConfig.maxSessions) {
            this.cleanupOldestSessions(100);
        }

        this.sessions.set(sessionId, session);
        this.logSessionEvent('session_created', sessionId);
        
        return sessionId;
    }

    /**
     * Validate and retrieve session
     */
    getSession(sessionId) {
        if (!sessionId || typeof sessionId !== 'string') {
            return null;
        }

        const session = this.sessions.get(sessionId);
        
        if (!session) {
            this.logSessionEvent('session_not_found', sessionId);
            return null;
        }

        // Check if session has expired
        if (this.isSessionExpired(session)) {
            this.destroySession(sessionId);
            this.logSessionEvent('session_expired', sessionId);
            return null;
        }

        // Update last activity
        session.lastActivity = Date.now();
        
        return session;
    }

    /**
     * Update session data securely
     */
    updateSession(sessionId, updateData) {
        const session = this.getSession(sessionId);
        
        if (!session) {
            throw new Error('Invalid session');
        }

        // Merge sanitized data
        session.data = {
            ...session.data,
            ...this.sanitizeSessionData(updateData)
        };

        session.lastActivity = Date.now();
        this.logSessionEvent('session_updated', sessionId);
        
        return session;
    }

    /**
     * Refresh session (extend expiry)
     */
    refreshSession(sessionId) {
        const session = this.getSession(sessionId);
        
        if (!session) {
            return false;
        }

        const now = Date.now();
        const timeRemaining = (session.lastActivity + this.sessionConfig.maxAge) - now;
        
        // Only refresh if within threshold
        if (timeRemaining < this.sessionConfig.refreshThreshold) {
            session.lastActivity = now;
            this.logSessionEvent('session_refreshed', sessionId);
            return true;
        }
        
        return false;
    }

    /**
     * Destroy session securely
     */
    destroySession(sessionId) {
        const session = this.sessions.get(sessionId);
        
        if (session) {
            // Clear sensitive data
            if (session.data) {
                Object.keys(session.data).forEach(key => {
                    delete session.data[key];
                });
            }
            
            this.sessions.delete(sessionId);
            this.logSessionEvent('session_destroyed', sessionId);
            return true;
        }
        
        return false;
    }

    /**
     * Validate session security
     */
    validateSessionSecurity(sessionId, requestData) {
        const session = this.getSession(sessionId);
        
        if (!session) {
            return { valid: false, reason: 'Invalid session' };
        }

        // IP address validation
        if (session.securityFlags.ipAddress && 
            requestData.ipAddress && 
            session.securityFlags.ipAddress !== requestData.ipAddress) {
            this.flagSuspiciousActivity(sessionId, 'ip_mismatch');
            return { valid: false, reason: 'Security validation failed' };
        }

        // User agent validation (basic)
        if (session.securityFlags.userAgent && 
            requestData.userAgent && 
            session.securityFlags.userAgent !== requestData.userAgent) {
            this.flagSuspiciousActivity(sessionId, 'user_agent_change');
            // Don't invalidate immediately as user agents can change
        }

        // Check for suspicious activity
        if (session.securityFlags.suspicious) {
            return { valid: false, reason: 'Session flagged for suspicious activity' };
        }

        // Rate limiting check
        if (session.permissions.rateLimitRemaining <= 0) {
            return { valid: false, reason: 'Rate limit exceeded' };
        }

        return { valid: true, session };
    }

    /**
     * Flag suspicious activity
     */
    flagSuspiciousActivity(sessionId, reason) {
        const session = this.sessions.get(sessionId);
        
        if (session) {
            session.securityFlags.suspicious = true;
            session.securityFlags.suspiciousReason = reason;
            session.securityFlags.flaggedAt = Date.now();
            
            this.logSessionEvent('suspicious_activity', sessionId, { reason });
            
            // Auto-destroy session for high-risk activities
            const highRiskReasons = ['ip_mismatch', 'multiple_failures', 'injection_attempt'];
            if (highRiskReasons.includes(reason)) {
                setTimeout(() => this.destroySession(sessionId), 1000);
            }
        }
    }

    /**
     * Generate secure session ID
     */
    generateSecureSessionId() {
        const timestamp = Date.now().toString(36);
        const randomBytes = new Uint8Array(32);
        
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(randomBytes);
        } else {
            // Fallback for environments without crypto
            for (let i = 0; i < randomBytes.length; i++) {
                randomBytes[i] = Math.floor(Math.random() * 256);
            }
        }
        
        const randomString = Array.from(randomBytes, byte => 
            byte.toString(16).padStart(2, '0')
        ).join('');
        
        return `jb_${timestamp}_${randomString}`;
    }

    /**
     * Generate device fingerprint
     */
    generateFingerprint(userData) {
        const components = [
            userData.userAgent || '',
            userData.language || '',
            userData.timezone || '',
            userData.screenResolution || '',
            userData.colorDepth || ''
        ];
        
        const fingerprint = components.join('|');
        
        // Simple hash function (in production, use crypto.subtle)
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return hash.toString(16);
    }

    /**
     * Sanitize session data
     */
    sanitizeSessionData(data) {
        if (!data || typeof data !== 'object') {
            return {};
        }

        const sanitized = {};
        const allowedFields = [
            'userId', 'email', 'name', 'role', 'preferences',
            'lastLogin', 'permissions', 'clientId'
        ];

        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
                if (typeof value === 'string') {
                    sanitized[key] = this.sanitizeString(value);
                } else if (typeof value === 'object' && value !== null) {
                    sanitized[key] = this.sanitizeSessionData(value);
                } else {
                    sanitized[key] = value;
                }
            }
        }

        return sanitized;
    }

    /**
     * Sanitize string input
     */
    sanitizeString(input) {
        return String(input)
            .replace(/[<>\"'&]/g, (match) => {
                const entityMap = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                };
                return entityMap[match];
            })
            .substring(0, 500); // Limit length
    }

    /**
     * Check if session is expired
     */
    isSessionExpired(session) {
        const now = Date.now();
        const sessionAge = now - session.lastActivity;
        return sessionAge > this.sessionConfig.maxAge;
    }

    /**
     * Cleanup expired sessions
     */
    cleanupExpiredSessions() {
        const now = Date.now();
        let cleanedCount = 0;
        
        for (const [sessionId, session] of this.sessions) {
            if (this.isSessionExpired(session)) {
                this.destroySession(sessionId);
                cleanedCount++;
            }
        }
        
        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
        }
        
        return cleanedCount;
    }

    /**
     * Cleanup oldest sessions to prevent memory issues
     */
    cleanupOldestSessions(count) {
        const sessions = Array.from(this.sessions.entries())
            .sort(([,a], [,b]) => a.created - b.created)
            .slice(0, count);
        
        sessions.forEach(([sessionId]) => {
            this.destroySession(sessionId);
        });
        
        console.log(`🧹 Cleaned up ${sessions.length} oldest sessions`);
    }

    /**
     * Session event logging
     */
    logSessionEvent(eventType, sessionId, details = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            type: eventType,
            sessionId: sessionId ? sessionId.substring(0, 16) + '...' : 'unknown', // Truncate for privacy
            details
        };
        
        console.log('📝 SESSION EVENT:', event);
    }

    /**
     * Get session statistics
     */
    getSessionStats() {
        const now = Date.now();
        let activeCount = 0;
        let expiredCount = 0;
        let suspiciousCount = 0;
        
        for (const session of this.sessions.values()) {
            if (this.isSessionExpired(session)) {
                expiredCount++;
            } else {
                activeCount++;
            }
            
            if (session.securityFlags.suspicious) {
                suspiciousCount++;
            }
        }
        
        return {
            total: this.sessions.size,
            active: activeCount,
            expired: expiredCount,
            suspicious: suspiciousCount,
            memoryUsage: this.sessions.size * 1024 // Rough estimate
        };
    }

    /**
     * Initialize session manager
     */
    initializeSessionManager() {
        // Start cleanup interval
        setInterval(() => {
            this.cleanupExpiredSessions();
        }, this.sessionConfig.cleanupInterval);

        console.log('🔐 JuriBank Session Manager initialized');
        console.log(`📊 Config: ${this.sessionConfig.maxAge/1000/60}min timeout, max ${this.sessionConfig.maxSessions} sessions`);
    }

    /**
     * Middleware function for session validation
     */
    middleware() {
        return (req, res, next) => {
            const sessionId = req.headers['x-session-id'] || req.cookies?.session_id;
            
            if (sessionId) {
                const validation = this.validateSessionSecurity(sessionId, {
                    ipAddress: req.ip,
                    userAgent: req.headers['user-agent']
                });
                
                if (validation.valid) {
                    req.session = validation.session;
                    req.sessionId = sessionId;
                } else {
                    req.sessionError = validation.reason;
                }
            }
            
            next();
        };
    }
}

// Initialize global session manager
const sessionManager = new JuriBankSessionManager();

// Export for use
if (typeof window !== 'undefined') {
    window.JuriBankSessionManager = sessionManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankSessionManager;
}