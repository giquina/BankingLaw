/**
 * JuriBank Platform - Banking-Grade Security Configuration
 * Implements enterprise-level security policies for financial services
 */

class JuriBankSecurityConfig {
    constructor() {
        this.cspNonce = this.generateNonce();
        this.csrfToken = this.generateCSRFToken();
        this.initializeSecurityPolicies();
    }

    /**
     * Content Security Policy - Banking Grade
     * Prevents XSS, clickjacking, and other injection attacks
     */
    getCSPHeaders() {
        return {
            'Content-Security-Policy': [
                "default-src 'self'",
                `script-src 'self' 'nonce-${this.cspNonce}' https://fonts.googleapis.com https://vercel.live`,
                `style-src 'self' 'nonce-${this.cspNonce}' https://fonts.googleapis.com`,
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: https:",
                "connect-src 'self' https://vercel.live",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "object-src 'none'",
                "media-src 'self'",
                "form-action 'self'",
                "upgrade-insecure-requests"
            ].join('; ')
        };
    }

    /**
     * Comprehensive Security Headers for Banking Applications
     */
    getSecurityHeaders() {
        return {
            // Content Security Policy
            ...this.getCSPHeaders(),
            
            // HTTP Strict Transport Security - Banking Grade
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            
            // Prevent clickjacking attacks
            'X-Frame-Options': 'DENY',
            
            // Prevent MIME type sniffing
            'X-Content-Type-Options': 'nosniff',
            
            // XSS Protection
            'X-XSS-Protection': '1; mode=block',
            
            // Referrer Policy - Minimal information disclosure
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            
            // Permissions Policy - Restrict dangerous features
            'Permissions-Policy': [
                'camera=()',
                'microphone=()',
                'geolocation=()',
                'payment=(self)',
                'usb=()',
                'bluetooth=()',
                'magnetometer=()',
                'gyroscope=()',
                'accelerometer=()',
                'ambient-light-sensor=()',
                'autoplay=()',
                'encrypted-media=()',
                'fullscreen=(self)',
                'picture-in-picture=()'
            ].join(', '),
            
            // Cross-Origin Policies
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Resource-Policy': 'same-origin',
            
            // Cache Control for sensitive data
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Pragma': 'no-cache',
            'Expires': '0',
            
            // Additional Banking Security Headers
            'X-Permitted-Cross-Domain-Policies': 'none',
            'X-Download-Options': 'noopen',
            'X-DNS-Prefetch-Control': 'off'
        };
    }

    /**
     * CSRF Protection Implementation
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * CSP Nonce Generation
     */
    generateNonce() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array));
    }

    /**
     * Input Sanitization for XSS Prevention
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {return input;}
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Secure form validation with CSRF protection
     */
    validateSecureForm(formData, csrfToken) {
        // CSRF token validation
        if (!csrfToken || csrfToken !== this.csrfToken) {
            throw new Error('CSRF token validation failed');
        }

        // Input sanitization
        const sanitizedData = {};
        for (const [key, value] of Object.entries(formData)) {
            sanitizedData[key] = this.sanitizeInput(value);
        }

        return sanitizedData;
    }

    /**
     * Session Security Configuration
     */
    getSessionConfig() {
        return {
            name: 'JURIBANK_SESSION',
            secret: process.env.SESSION_SECRET || this.generateSecureSecret(),
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: true, // HTTPS only
                httpOnly: true, // Prevent XSS
                maxAge: 30 * 60 * 1000, // 30 minutes
                sameSite: 'strict' // CSRF protection
            }
        };
    }

    /**
     * Generate secure session secret
     */
    generateSecureSecret() {
        const array = new Uint8Array(64);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Rate Limiting Configuration for Banking Applications
     */
    getRateLimitConfig() {
        return {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later',
            standardHeaders: true,
            legacyHeaders: false,
            skipSuccessfulRequests: false,
            skipFailedRequests: false
        };
    }

    /**
     * Security audit logging
     */
    logSecurityEvent(event, details) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            event,
            details: this.sanitizeInput(JSON.stringify(details)),
            ip: details.ip || 'unknown',
            userAgent: this.sanitizeInput(details.userAgent || 'unknown')
        };

        console.log('🔒 SECURITY EVENT:', JSON.stringify(logEntry));
        
        // In production, send to security monitoring system
        if (process.env.NODE_ENV === 'production') {
            // Send to security monitoring service
            this.sendToSecurityMonitoring(logEntry);
        }
    }

    /**
     * Initialize security policies on page load
     */
    initializeSecurityPolicies() {
        if (typeof window !== 'undefined') {
            // Prevent console access in production
            if (process.env.NODE_ENV === 'production') {
                console.clear();
                console.log('%cJuriBank Security Notice', 'color: red; font-size: 20px; font-weight: bold;');
                console.log('%cThis is a browser feature intended for developers. Unauthorized access may violate banking regulations.', 'color: red; font-size: 14px;');
            }

            // Disable right-click in production
            if (process.env.NODE_ENV === 'production') {
                document.addEventListener('contextmenu', (e) => e.preventDefault());
                document.addEventListener('selectstart', (e) => e.preventDefault());
                document.addEventListener('dragstart', (e) => e.preventDefault());
            }

            // Detect developer tools
            this.detectDevTools();
        }
    }

    /**
     * Developer tools detection for additional security
     */
    detectDevTools() {
        const threshold = 160;
        
        const detect = () => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                this.logSecurityEvent('dev_tools_detected', {
                    timestamp: Date.now(),
                    url: window.location.href
                });
            }
        };

        setInterval(detect, 1000);
    }

    /**
     * Send security events to monitoring system
     */
    sendToSecurityMonitoring(logEntry) {
        // Placeholder for security monitoring integration
        // In production, integrate with services like Datadog, Splunk, etc.
        fetch('/api/security/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': this.csrfToken
            },
            body: JSON.stringify(logEntry)
        }).catch(err => console.error('Security logging failed:', err));
    }
}

// Export configuration
const securityConfig = new JuriBankSecurityConfig();

// Make available globally for client-side usage
if (typeof window !== 'undefined') {
    window.JuriBankSecurity = securityConfig;
}

// Export for Node.js/build tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankSecurityConfig;
}