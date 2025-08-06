/**
 * JuriBank Educational Platform - Security Manager
 * Comprehensive security middleware for API endpoints
 * 
 * Features:
 * - API key management and validation
 * - Request sanitization and validation
 * - Security headers enforcement
 * - Threat detection and blocking
 * - Rate limiting and abuse protection
 * - Audit logging for compliance
 * - OWASP security best practices
 */

const crypto = require('crypto');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

class SecurityManager {
    constructor(config = {}, logger = console) {
        this.config = {
            // API Key settings
            apiKeys: {
                enabled: true,
                length: 32,
                prefix: 'jb_',
                rotation: {
                    enabled: true,
                    intervalDays: 30,
                    overlapDays: 7
                },
                encryption: {
                    algorithm: 'aes-256-gcm',
                    keyLength: 32
                }
            },
            
            // Rate limiting
            rateLimiting: {
                enabled: true,
                global: {
                    windowMs: 15 * 60 * 1000, // 15 minutes
                    max: 1000, // requests per window
                    message: 'Too many requests from this IP'
                },
                api: {
                    windowMs: 15 * 60 * 1000, // 15 minutes
                    max: 100, // requests per window per API key
                    message: 'API rate limit exceeded'
                },
                strict: {
                    windowMs: 5 * 60 * 1000, // 5 minutes
                    max: 10, // requests for sensitive endpoints
                    message: 'Strict rate limit exceeded'
                }
            },
            
            // Request validation
            validation: {
                maxRequestSize: '10mb',
                allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                requiredHeaders: ['User-Agent'],
                blockedHeaders: ['X-Forwarded-For', 'X-Real-IP'],
                sanitization: {
                    enabled: true,
                    removeScripts: true,
                    removeSql: true,
                    removeHtml: true
                }
            },
            
            // Security headers
            headers: {
                'Content-Security-Policy': "default-src 'self'; connect-src 'self' *.gov.uk *.fca.org.uk",
                'X-Frame-Options': 'DENY',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
                'X-XSS-Protection': '1; mode=block',
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
            },
            
            // Threat detection
            threatDetection: {
                enabled: true,
                patterns: {
                    sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)|('|"|;|--|\*)/i,
                    xss: /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i,
                    pathTraversal: /\.\.[\/\\]|%2e%2e[\/\\]|\.\.%2f|\.\.%5c/i,
                    commandInjection: /(\||&|;|`|\$\()/,
                    ldapInjection: /(\*|\(|\)|\|)/
                },
                blockOnDetection: true,
                logThreats: true
            },
            
            // Audit logging
            audit: {
                enabled: true,
                logLevel: 'info',
                includeRequestBody: false,
                includeResponseBody: false,
                sensitiveFields: ['password', 'token', 'api_key', 'authorization'],
                retention: '90d'
            },
            
            ...config
        };

        this.logger = logger;
        this.apiKeys = new Map();
        this.threatStats = {
            blocked: 0,
            detected: 0,
            byType: {}
        };
        
        this.initialize();
    }

    /**
     * Initialize security manager
     */
    initialize() {
        try {
            // Load API keys
            this.loadAPIKeys();
            
            // Setup threat pattern compilation
            this.compileThreatPatterns();
            
            // Initialize rate limiters
            this.initializeRateLimiters();
            
            this.logger.info('Security Manager initialized', {
                apiKeysEnabled: this.config.apiKeys.enabled,
                rateLimitingEnabled: this.config.rateLimiting.enabled,
                threatDetectionEnabled: this.config.threatDetection.enabled
            });
            
        } catch (error) {
            this.logger.error('Security Manager initialization failed', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Load and validate API keys
     */
    loadAPIKeys() {
        // In production, these would be loaded from secure storage
        const keys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
        
        if (keys.length === 0 && this.config.apiKeys.enabled) {
            // Generate a default key for development
            const defaultKey = this.generateAPIKey();
            this.apiKeys.set(defaultKey, {
                id: 'default',
                created: new Date(),
                permissions: ['read', 'write'],
                active: true,
                rateLimit: this.config.rateLimiting.api
            });
            
            this.logger.warn('No API keys configured, generated default key for development', {
                key: defaultKey.substring(0, 8) + '...'
            });
        } else {
            keys.forEach((key, index) => {
                this.apiKeys.set(key.trim(), {
                    id: `key_${index}`,
                    created: new Date(),
                    permissions: ['read', 'write'],
                    active: true,
                    rateLimit: this.config.rateLimiting.api
                });
            });
        }

        this.logger.info(`Loaded ${this.apiKeys.size} API keys`);
    }

    /**
     * Generate secure API key
     */
    generateAPIKey() {
        const randomBytes = crypto.randomBytes(this.config.apiKeys.length);
        return this.config.apiKeys.prefix + randomBytes.toString('hex');
    }

    /**
     * Compile threat detection patterns
     */
    compileThreatPatterns() {
        this.compiledPatterns = {};
        
        for (const [threatType, pattern] of Object.entries(this.config.threatDetection.patterns)) {
            try {
                this.compiledPatterns[threatType] = new RegExp(pattern, 'i');
            } catch (error) {
                this.logger.warn(`Failed to compile threat pattern for ${threatType}`, {
                    pattern: pattern.toString(),
                    error: error.message
                });
            }
        }
    }

    /**
     * Initialize rate limiters
     */
    initializeRateLimiters() {
        this.rateLimiters = {
            global: rateLimit({
                ...this.config.rateLimiting.global,
                keyGenerator: (req) => req.ip,
                onLimitReached: (req, res, options) => {
                    this.logger.warn('Global rate limit exceeded', {
                        ip: req.ip,
                        userAgent: req.get('User-Agent'),
                        url: req.url
                    });
                }
            }),
            
            api: rateLimit({
                ...this.config.rateLimiting.api,
                keyGenerator: (req) => req.apiKey || req.ip,
                onLimitReached: (req, res, options) => {
                    this.logger.warn('API rate limit exceeded', {
                        apiKey: req.apiKey ? req.apiKey.substring(0, 8) + '...' : 'none',
                        ip: req.ip,
                        url: req.url
                    });
                }
            }),
            
            strict: rateLimit({
                ...this.config.rateLimiting.strict,
                keyGenerator: (req) => req.apiKey || req.ip,
                onLimitReached: (req, res, options) => {
                    this.logger.warn('Strict rate limit exceeded', {
                        apiKey: req.apiKey ? req.apiKey.substring(0, 8) + '...' : 'none',
                        ip: req.ip,
                        url: req.url
                    });
                }
            })
        };
    }

    /**
     * API Key validation middleware
     */
    validateAPIKey() {
        return (req, res, next) => {
            if (!this.config.apiKeys.enabled) {
                return next();
            }

            const apiKey = req.headers['x-api-key'] || req.query.api_key;
            
            if (!apiKey) {
                this.logSecurityEvent('missing_api_key', req, {
                    message: 'API key required but not provided'
                });
                
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'MISSING_API_KEY',
                        message: 'API key is required'
                    }
                });
            }

            const keyData = this.apiKeys.get(apiKey);
            
            if (!keyData || !keyData.active) {
                this.logSecurityEvent('invalid_api_key', req, {
                    apiKey: apiKey.substring(0, 8) + '...',
                    message: 'Invalid or inactive API key'
                });
                
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_API_KEY',
                        message: 'Invalid API key'
                    }
                });
            }

            // Attach key data to request
            req.apiKey = apiKey;
            req.apiKeyData = keyData;
            
            next();
        };
    }

    /**
     * Request sanitization middleware
     */
    sanitizeRequest() {
        return (req, res, next) => {
            try {
                if (this.config.validation.sanitization.enabled) {
                    // Sanitize query parameters
                    if (req.query) {
                        req.query = this.sanitizeObject(req.query);
                    }
                    
                    // Sanitize request body
                    if (req.body) {
                        req.body = this.sanitizeObject(req.body);
                    }
                    
                    // Sanitize URL parameters
                    if (req.params) {
                        req.params = this.sanitizeObject(req.params);
                    }
                }
                
                next();
                
            } catch (error) {
                this.logger.error('Request sanitization error', {
                    requestId: req.id,
                    error: error.message
                });
                
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'SANITIZATION_ERROR',
                        message: 'Request could not be processed'
                    }
                });
            }
        };
    }

    /**
     * Threat detection middleware
     */
    detectThreats() {
        return (req, res, next) => {
            if (!this.config.threatDetection.enabled) {
                return next();
            }

            try {
                const threats = this.scanForThreats(req);
                
                if (threats.length > 0) {
                    this.threatStats.detected += threats.length;
                    
                    threats.forEach(threat => {
                        this.threatStats.byType[threat.type] = 
                            (this.threatStats.byType[threat.type] || 0) + 1;
                    });
                    
                    this.logSecurityEvent('threat_detected', req, {
                        threats: threats,
                        action: this.config.threatDetection.blockOnDetection ? 'blocked' : 'logged'
                    });
                    
                    if (this.config.threatDetection.blockOnDetection) {
                        this.threatStats.blocked++;
                        
                        return res.status(403).json({
                            success: false,
                            error: {
                                code: 'SECURITY_VIOLATION',
                                message: 'Request blocked due to security policy'
                            }
                        });
                    }
                }
                
                next();
                
            } catch (error) {
                this.logger.error('Threat detection error', {
                    requestId: req.id,
                    error: error.message
                });
                next();
            }
        };
    }

    /**
     * Security headers middleware
     */
    setSecurityHeaders() {
        return (req, res, next) => {
            // Set security headers
            for (const [header, value] of Object.entries(this.config.headers)) {
                res.setHeader(header, value);
            }
            
            // Set request ID header
            if (req.id) {
                res.setHeader('X-Request-ID', req.id);
            }
            
            next();
        };
    }

    /**
     * Audit logging middleware
     */
    auditLog() {
        return (req, res, next) => {
            if (!this.config.audit.enabled) {
                return next();
            }

            const originalSend = res.send;
            const startTime = Date.now();
            
            res.send = function(body) {
                const responseTime = Date.now() - startTime;
                
                // Log audit event
                this.logSecurityEvent('api_request', req, {
                    method: req.method,
                    url: req.url,
                    statusCode: res.statusCode,
                    responseTime: responseTime,
                    userAgent: req.get('User-Agent'),
                    contentLength: body ? body.length : 0,
                    apiKey: req.apiKey ? req.apiKey.substring(0, 8) + '...' : null
                });
                
                return originalSend.call(this, body);
            }.bind(this);
            
            next();
        };
    }

    /**
     * Scan request for security threats
     */
    scanForThreats(req) {
        const threats = [];
        const scanTargets = [];
        
        // Collect all string values to scan
        if (req.query) {
            this.collectStrings(req.query, scanTargets, 'query');
        }
        if (req.body) {
            this.collectStrings(req.body, scanTargets, 'body');
        }
        if (req.params) {
            this.collectStrings(req.params, scanTargets, 'params');
        }
        
        // Add URL and headers
        scanTargets.push({ value: req.url, source: 'url' });
        scanTargets.push({ value: req.get('User-Agent') || '', source: 'user-agent' });
        
        // Scan each target against all patterns
        for (const target of scanTargets) {
            for (const [threatType, pattern] of Object.entries(this.compiledPatterns)) {
                if (pattern.test(target.value)) {
                    threats.push({
                        type: threatType,
                        source: target.source,
                        value: target.value.substring(0, 100) + '...',
                        pattern: pattern.toString()
                    });
                }
            }
        }
        
        return threats;
    }

    /**
     * Collect string values from object recursively
     */
    collectStrings(obj, collection, source, depth = 0) {
        if (depth > 5) return; // Prevent deep recursion
        
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                collection.push({
                    value: value,
                    source: `${source}.${key}`
                });
            } else if (typeof value === 'object' && value !== null) {
                this.collectStrings(value, collection, `${source}.${key}`, depth + 1);
            }
        }
    }

    /**
     * Sanitize object recursively
     */
    sanitizeObject(obj, depth = 0) {
        if (depth > 5) return obj; // Prevent deep recursion
        
        if (typeof obj === 'string') {
            return this.sanitizeString(obj);
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item, depth + 1));
        }
        
        if (typeof obj === 'object' && obj !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                sanitized[this.sanitizeString(key)] = this.sanitizeObject(value, depth + 1);
            }
            return sanitized;
        }
        
        return obj;
    }

    /**
     * Sanitize string value
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return str;
        
        let sanitized = str;
        
        if (this.config.validation.sanitization.removeScripts) {
            sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        
        if (this.config.validation.sanitization.removeHtml) {
            sanitized = validator.escape(sanitized);
        }
        
        if (this.config.validation.sanitization.removeSql) {
            sanitized = sanitized.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi, '');
        }
        
        return sanitized;
    }

    /**
     * Log security event
     */
    logSecurityEvent(eventType, req, details = {}) {
        if (!this.config.audit.enabled) return;
        
        const logData = {
            timestamp: new Date().toISOString(),
            event: eventType,
            requestId: req.id,
            ip: req.ip,
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            ...details
        };
        
        // Remove sensitive information
        logData.sanitized = this.sanitizeSensitiveData(logData);
        
        this.logger.info('Security event', logData);
    }

    /**
     * Remove sensitive data from logs
     */
    sanitizeSensitiveData(data) {
        const sanitized = JSON.parse(JSON.stringify(data));
        
        const redactValue = (obj, key) => {
            if (this.config.audit.sensitiveFields.includes(key.toLowerCase())) {
                obj[key] = '***REDACTED***';
            }
        };
        
        const redactRecursive = (obj) => {
            if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                    redactValue(obj, key);
                    if (typeof obj[key] === 'object') {
                        redactRecursive(obj[key]);
                    }
                }
            }
        };
        
        redactRecursive(sanitized);
        return sanitized;
    }

    /**
     * Get rate limiter by type
     */
    getRateLimiter(type = 'global') {
        return this.rateLimiters[type] || this.rateLimiters.global;
    }

    /**
     * Get security statistics
     */
    getSecurityStats() {
        return {
            apiKeys: {
                total: this.apiKeys.size,
                active: Array.from(this.apiKeys.values()).filter(key => key.active).length
            },
            threats: {
                ...this.threatStats,
                detectionEnabled: this.config.threatDetection.enabled,
                blockingEnabled: this.config.threatDetection.blockOnDetection
            },
            rateLimiting: {
                enabled: this.config.rateLimiting.enabled,
                limiters: Object.keys(this.rateLimiters)
            },
            audit: {
                enabled: this.config.audit.enabled,
                level: this.config.audit.logLevel
            }
        };
    }

    /**
     * Validate request structure
     */
    validateRequest() {
        return (req, res, next) => {
            try {
                // Check request method
                if (!this.config.validation.allowedMethods.includes(req.method)) {
                    return res.status(405).json({
                        success: false,
                        error: {
                            code: 'METHOD_NOT_ALLOWED',
                            message: `Method ${req.method} not allowed`
                        }
                    });
                }
                
                // Check required headers
                for (const header of this.config.validation.requiredHeaders) {
                    if (!req.get(header)) {
                        return res.status(400).json({
                            success: false,
                            error: {
                                code: 'MISSING_HEADER',
                                message: `Required header ${header} is missing`
                            }
                        });
                    }
                }
                
                // Check blocked headers
                for (const header of this.config.validation.blockedHeaders) {
                    if (req.get(header)) {
                        this.logSecurityEvent('blocked_header_detected', req, {
                            header: header,
                            value: req.get(header)
                        });
                    }
                }
                
                next();
                
            } catch (error) {
                this.logger.error('Request validation error', {
                    requestId: req.id,
                    error: error.message
                });
                
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Request validation failed'
                    }
                });
            }
        };
    }

    /**
     * Health check for security manager
     */
    healthCheck() {
        return {
            status: 'healthy',
            apiKeysLoaded: this.apiKeys.size > 0,
            threatPatternsCompiled: Object.keys(this.compiledPatterns).length > 0,
            rateLimitersInitialized: Object.keys(this.rateLimiters).length > 0,
            configuration: {
                apiKeysEnabled: this.config.apiKeys.enabled,
                rateLimitingEnabled: this.config.rateLimiting.enabled,
                threatDetectionEnabled: this.config.threatDetection.enabled,
                auditEnabled: this.config.audit.enabled
            }
        };
    }
}

module.exports = SecurityManager;