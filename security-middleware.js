/**
 * JuriBank Platform - Security Middleware
 * CSRF Protection, Input Sanitization, and Security Validation
 */

class JuriBankSecurityMiddleware {
    constructor() {
        this.csrfTokens = new Map();
        this.rateLimiter = new Map();
        this.securityLog = [];
        this.initializeSecurityMiddleware();
    }

    /**
     * CSRF Token Management
     */
    generateCSRFToken(sessionId) {
        const token = this.generateSecureToken(32);
        const expiry = Date.now() + (30 * 60 * 1000); // 30 minutes
        
        this.csrfTokens.set(sessionId, {
            token,
            expiry,
            used: false
        });

        return token;
    }

    /**
     * Validate CSRF Token
     */
    validateCSRFToken(sessionId, providedToken) {
        const tokenData = this.csrfTokens.get(sessionId);
        
        if (!tokenData) {
            this.logSecurityEvent('csrf_token_missing', { sessionId });
            return false;
        }

        if (Date.now() > tokenData.expiry) {
            this.csrfTokens.delete(sessionId);
            this.logSecurityEvent('csrf_token_expired', { sessionId });
            return false;
        }

        if (tokenData.used) {
            this.logSecurityEvent('csrf_token_reuse_attempt', { sessionId });
            return false;
        }

        if (tokenData.token !== providedToken) {
            this.logSecurityEvent('csrf_token_invalid', { sessionId });
            return false;
        }

        // Mark token as used (single-use tokens)
        tokenData.used = true;
        return true;
    }

    /**
     * Advanced Input Sanitization
     */
    sanitizeInput(input, type = 'text') {
        if (input === null || input === undefined) return input;
        
        let sanitized = String(input);

        switch (type) {
            case 'email':
                sanitized = this.sanitizeEmail(sanitized);
                break;
            case 'phone':
                sanitized = this.sanitizePhone(sanitized);
                break;
            case 'currency':
                sanitized = this.sanitizeCurrency(sanitized);
                break;
            case 'html':
                sanitized = this.sanitizeHTML(sanitized);
                break;
            case 'sql':
                sanitized = this.sanitizeSQL(sanitized);
                break;
            default:
                sanitized = this.sanitizeText(sanitized);
        }

        return sanitized;
    }

    /**
     * Text sanitization with XSS prevention
     */
    sanitizeText(input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .replace(/\\/g, '&#x5C;')
            .replace(/`/g, '&#x60;')
            .replace(/=/g, '&#x3D;');
    }

    /**
     * Email sanitization
     */
    sanitizeEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const sanitized = this.sanitizeText(email).toLowerCase();
        
        if (!emailRegex.test(sanitized)) {
            throw new Error('Invalid email format');
        }
        
        return sanitized;
    }

    /**
     * Phone number sanitization
     */
    sanitizePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const ukPhoneRegex = /^(?:(?:\+44\s?|0044\s?|0)(?:\s?\d{2}\s?\d{4}\s?\d{4}|\s?\d{3}\s?\d{3}\s?\d{4}|\s?\d{4}\s?\d{6}))$/;
        
        if (!ukPhoneRegex.test(phone)) {
            throw new Error('Invalid UK phone number format');
        }
        
        return cleaned;
    }

    /**
     * Currency sanitization for banking applications
     */
    sanitizeCurrency(amount) {
        const cleaned = String(amount).replace(/[^\d.-]/g, '');
        const numAmount = parseFloat(cleaned);
        
        if (isNaN(numAmount) || numAmount < 0) {
            throw new Error('Invalid currency amount');
        }
        
        // Round to 2 decimal places for banking precision
        return Math.round(numAmount * 100) / 100;
    }

    /**
     * HTML sanitization (allow specific safe tags)
     */
    sanitizeHTML(html) {
        const allowedTags = ['p', 'br', 'strong', 'em', 'u'];
        const allowedAttributes = ['class'];
        
        // Basic HTML sanitization - in production, use DOMPurify
        return html.replace(/<(?!\/?(?:p|br|strong|em|u)\b)[^>]*>/gi, '');
    }

    /**
     * SQL injection prevention
     */
    sanitizeSQL(input) {
        const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
            /(;|--|\||\/\*|\*\/)/g,
            /(\b(OR|AND)\s+\d+=\d+)/gi
        ];

        let sanitized = this.sanitizeText(input);
        
        sqlPatterns.forEach(pattern => {
            if (pattern.test(sanitized)) {
                this.logSecurityEvent('sql_injection_attempt', { input: sanitized });
                throw new Error('Potentially malicious input detected');
            }
        });

        return sanitized;
    }

    /**
     * Rate Limiting Implementation
     */
    checkRateLimit(identifier, maxRequests = 100, windowMs = 15 * 60 * 1000) {
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!this.rateLimiter.has(identifier)) {
            this.rateLimiter.set(identifier, []);
        }
        
        const requests = this.rateLimiter.get(identifier);
        
        // Remove old requests outside the window
        const recentRequests = requests.filter(timestamp => timestamp > windowStart);
        
        if (recentRequests.length >= maxRequests) {
            this.logSecurityEvent('rate_limit_exceeded', { identifier });
            return false;
        }
        
        recentRequests.push(now);
        this.rateLimiter.set(identifier, recentRequests);
        
        return true;
    }

    /**
     * Form validation with security checks
     */
    validateSecureForm(formData, sessionId, csrfToken) {
        // Rate limiting check
        if (!this.checkRateLimit(sessionId, 10, 60000)) { // 10 requests per minute
            throw new Error('Rate limit exceeded. Please wait before submitting again.');
        }

        // CSRF validation
        if (!this.validateCSRFToken(sessionId, csrfToken)) {
            throw new Error('Security validation failed. Please refresh and try again.');
        }

        // Input sanitization
        const sanitizedData = {};
        
        for (const [key, value] of Object.entries(formData)) {
            try {
                switch (key) {
                    case 'email':
                        sanitizedData[key] = this.sanitizeInput(value, 'email');
                        break;
                    case 'phone':
                        sanitizedData[key] = this.sanitizeInput(value, 'phone');
                        break;
                    case 'amount':
                    case 'claimAmount':
                        sanitizedData[key] = this.sanitizeInput(value, 'currency');
                        break;
                    default:
                        sanitizedData[key] = this.sanitizeInput(value, 'text');
                }
            } catch (error) {
                this.logSecurityEvent('input_validation_failed', {
                    field: key,
                    error: error.message,
                    sessionId
                });
                throw new Error(`Invalid ${key}: ${error.message}`);
            }
        }

        return sanitizedData;
    }

    /**
     * Session Security Validation
     */
    validateSession(sessionData) {
        const requiredFields = ['sessionId', 'created', 'lastActivity'];
        
        for (const field of requiredFields) {
            if (!sessionData[field]) {
                throw new Error(`Missing required session field: ${field}`);
            }
        }

        // Check session expiry (30 minutes)
        const maxAge = 30 * 60 * 1000;
        if (Date.now() - sessionData.lastActivity > maxAge) {
            throw new Error('Session expired');
        }

        // Update last activity
        sessionData.lastActivity = Date.now();
        
        return sessionData;
    }

    /**
     * Security event logging
     */
    logSecurityEvent(eventType, details) {
        const event = {
            timestamp: new Date().toISOString(),
            type: eventType,
            details: details,
            severity: this.getEventSeverity(eventType)
        };

        this.securityLog.push(event);
        
        // Keep only last 1000 events
        if (this.securityLog.length > 1000) {
            this.securityLog.shift();
        }

        console.log('🛡️ SECURITY EVENT:', event);

        // Alert on high-severity events
        if (event.severity === 'high') {
            this.alertHighSeverityEvent(event);
        }
    }

    /**
     * Determine event severity
     */
    getEventSeverity(eventType) {
        const highSeverity = [
            'sql_injection_attempt',
            'csrf_token_invalid',
            'multiple_failed_attempts',
            'suspicious_activity'
        ];

        const mediumSeverity = [
            'rate_limit_exceeded',
            'input_validation_failed',
            'csrf_token_expired'
        ];

        if (highSeverity.includes(eventType)) return 'high';
        if (mediumSeverity.includes(eventType)) return 'medium';
        return 'low';
    }

    /**
     * Alert system for high-severity events
     */
    alertHighSeverityEvent(event) {
        // In production, integrate with alerting systems
        console.error('🚨 HIGH SEVERITY SECURITY EVENT:', event);
        
        // Send to security monitoring
        if (typeof fetch !== 'undefined') {
            fetch('/api/security/alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            }).catch(console.error);
        }
    }

    /**
     * Generate secure token
     */
    generateSecureToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            for (let i = 0; i < length; i++) {
                result += chars[array[i] % chars.length];
            }
        } else {
            // Fallback for environments without crypto.getRandomValues
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        
        return result;
    }

    /**
     * Initialize security middleware
     */
    initializeSecurityMiddleware() {
        // Cleanup old tokens and rate limit data periodically
        setInterval(() => {
            this.cleanupExpiredTokens();
            this.cleanupRateLimitData();
        }, 5 * 60 * 1000); // Every 5 minutes

        console.log('🛡️ JuriBank Security Middleware initialized');
    }

    /**
     * Cleanup expired CSRF tokens
     */
    cleanupExpiredTokens() {
        const now = Date.now();
        for (const [sessionId, tokenData] of this.csrfTokens) {
            if (now > tokenData.expiry) {
                this.csrfTokens.delete(sessionId);
            }
        }
    }

    /**
     * Cleanup old rate limit data
     */
    cleanupRateLimitData() {
        const cutoff = Date.now() - (60 * 60 * 1000); // 1 hour
        for (const [identifier, requests] of this.rateLimiter) {
            const recentRequests = requests.filter(timestamp => timestamp > cutoff);
            if (recentRequests.length === 0) {
                this.rateLimiter.delete(identifier);
            } else {
                this.rateLimiter.set(identifier, recentRequests);
            }
        }
    }

    /**
     * Get security status report
     */
    getSecurityStatus() {
        return {
            activeTokens: this.csrfTokens.size,
            rateLimitedEntries: this.rateLimiter.size,
            recentEvents: this.securityLog.slice(-10),
            lastCleanup: new Date().toISOString()
        };
    }
}

// Initialize global security middleware
const securityMiddleware = new JuriBankSecurityMiddleware();

// Export for use
if (typeof window !== 'undefined') {
    window.JuriBankSecurityMiddleware = securityMiddleware;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankSecurityMiddleware;
}