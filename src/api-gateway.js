/**
 * JuriBank Educational Platform - API Gateway
 * Centralized API management for government data integration
 * 
 * Features:
 * - Rate limiting and request throttling
 * - Intelligent caching with Redis fallback
 * - Security middleware and CORS management
 * - Educational content transformation
 * - Real-time update notifications
 * - Comprehensive monitoring and logging
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

// Internal API modules
const FCAIntegration = require('./api/fca-integration.js');
const HMRCIntegration = require('./api/hmrc-integration.js');
const GovUKIntegration = require('./api/govuk-integration.js');
const OmbudsmanIntegration = require('./api/ombudsman-integration.js');
const BankOfEnglandIntegration = require('./api/boe-integration.js');

// Middleware and utilities
const CacheManager = require('./middleware/cache-manager.js');
const SecurityManager = require('./middleware/security-manager.js');
const EducationalTransformer = require('./middleware/educational-transformer.js');
const MonitoringCollector = require('./middleware/monitoring-collector.js');

class APIGateway {
    constructor(config = {}) {
        this.config = {
            port: process.env.API_PORT || 3001,
            environment: process.env.NODE_ENV || 'development',
            corsOrigins: [
                'https://banking-law.vercel.app',
                'http://localhost:8000',
                ...(config.corsOrigins || [])
            ],
            rateLimit: {
                windowMs: 15 * 60 * 1000, // 15 minutes
                max: 100, // limit each IP to 100 requests per windowMs
                skipSuccessfulRequests: false,
                skipFailedRequests: false,
                standardHeaders: true,
                legacyHeaders: false,
                keyGenerator: (req) => req.ip + ':' + (req.user?.id || 'anonymous')
            },
            cache: {
                defaultTTL: 3600, // 1 hour
                maxMemory: '100mb',
                checkInterval: 600 // 10 minutes
            },
            monitoring: {
                enabled: true,
                metricsEndpoint: '/api/metrics',
                healthEndpoint: '/api/health'
            },
            ...config
        };

        this.app = express();
        this.cache = null;
        this.logger = null;
        this.monitoring = null;
        this.apiModules = new Map();
        
        this.initializeLogger();
        this.initializeMiddleware();
        this.initializeAPIModules();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    /**
     * Initialize Winston logger with structured logging
     */
    initializeLogger() {
        this.logger = winston.createLogger({
            level: this.config.environment === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: {
                service: 'juribank-api-gateway',
                version: '3.0.0'
            },
            transports: [
                new winston.transports.File({ 
                    filename: './logs/api-gateway-error.log', 
                    level: 'error',
                    maxsize: 10485760, // 10MB
                    maxFiles: 5
                }),
                new winston.transports.File({ 
                    filename: './logs/api-gateway.log',
                    maxsize: 10485760, // 10MB
                    maxFiles: 5
                })
            ]
        });

        // Add console transport for development
        if (this.config.environment !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }));
        }

        this.logger.info('API Gateway logger initialized', {
            environment: this.config.environment,
            logLevel: this.logger.level
        });
    }

    /**
     * Initialize core middleware stack
     */
    initializeMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    connectSrc: [
                        "'self'",
                        "https://*.gov.uk",
                        "https://*.fca.org.uk",
                        "https://register.fca.org.uk",
                        "https://www.financial-ombudsman.org.uk",
                        "https://www.bankofengland.co.uk"
                    ],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    fontSrc: ["'self'", "https:", "data:"]
                }
            },
            crossOriginEmbedderPolicy: false // Allow embedding of government content
        }));

        // CORS configuration
        this.app.use(cors({
            origin: (origin, callback) => {
                // Allow requests with no origin (mobile apps, Postman, etc.)
                if (!origin) return callback(null, true);
                
                if (this.config.corsOrigins.includes(origin)) {
                    return callback(null, true);
                } else {
                    return callback(new Error('Not allowed by CORS policy'));
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Request-ID'],
            credentials: true,
            maxAge: 86400 // 24 hours
        }));

        // Request parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request ID and logging
        this.app.use((req, res, next) => {
            req.id = uuidv4();
            req.startTime = Date.now();
            
            // Log incoming request
            this.logger.info('Incoming request', {
                requestId: req.id,
                method: req.method,
                url: req.url,
                userAgent: req.get('User-Agent'),
                ip: req.ip,
                timestamp: new Date().toISOString()
            });
            
            res.set('X-Request-ID', req.id);
            next();
        });

        // Rate limiting
        const limiter = rateLimit({
            ...this.config.rateLimit,
            message: {
                error: 'Too many requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: Math.ceil(this.config.rateLimit.windowMs / 1000)
            },
            onLimitReached: (req, res, options) => {
                this.logger.warn('Rate limit exceeded', {
                    requestId: req.id,
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    limit: options.max,
                    windowMs: options.windowMs
                });
            }
        });

        this.app.use('/api', limiter);

        this.logger.info('Core middleware initialized');
    }

    /**
     * Initialize API integration modules
     */
    async initializeAPIModules() {
        try {
            // Initialize cache manager
            this.cache = new CacheManager(this.config.cache, this.logger);
            await this.cache.initialize();

            // Initialize monitoring
            if (this.config.monitoring.enabled) {
                this.monitoring = new MonitoringCollector(this.logger);
                await this.monitoring.initialize();
            }

            // Initialize API modules
            const fcaConfig = {
                cache: this.cache,
                logger: this.logger,
                monitoring: this.monitoring
            };

            this.apiModules.set('fca', new FCAIntegration(fcaConfig));
            this.apiModules.set('hmrc', new HMRCIntegration(fcaConfig));
            this.apiModules.set('govuk', new GovUKIntegration(fcaConfig));
            this.apiModules.set('ombudsman', new OmbudsmanIntegration(fcaConfig));
            this.apiModules.set('boe', new BankOfEnglandIntegration(fcaConfig));

            // Initialize all modules
            for (const [name, module] of this.apiModules) {
                try {
                    if (typeof module.initialize === 'function') {
                        await module.initialize();
                        this.logger.info(`${name.toUpperCase()} API module initialized`);
                    }
                } catch (error) {
                    this.logger.error(`Failed to initialize ${name} module`, {
                        error: error.message,
                        stack: error.stack
                    });
                    // Continue with other modules
                }
            }

            this.logger.info('All API modules initialized');

        } catch (error) {
            this.logger.error('Failed to initialize API modules', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Setup API routes and endpoints
     */
    setupRoutes() {
        // Health check endpoint
        this.app.get(this.config.monitoring.healthEndpoint, async (req, res) => {
            try {
                const health = await this.getHealthStatus();
                const statusCode = health.status === 'healthy' ? 200 : 503;
                
                res.status(statusCode).json({
                    status: health.status,
                    timestamp: new Date().toISOString(),
                    version: '3.0.0',
                    uptime: process.uptime(),
                    services: health.services,
                    requestId: req.id
                });
            } catch (error) {
                this.logger.error('Health check failed', {
                    requestId: req.id,
                    error: error.message
                });
                
                res.status(503).json({
                    status: 'unhealthy',
                    error: 'Health check failed',
                    requestId: req.id
                });
            }
        });

        // Metrics endpoint
        if (this.config.monitoring.enabled) {
            this.app.get(this.config.monitoring.metricsEndpoint, async (req, res) => {
                try {
                    const metrics = await this.monitoring.getMetrics();
                    res.json({
                        timestamp: new Date().toISOString(),
                        metrics: metrics,
                        requestId: req.id
                    });
                } catch (error) {
                    this.logger.error('Metrics collection failed', {
                        requestId: req.id,
                        error: error.message
                    });
                    res.status(500).json({ error: 'Metrics unavailable' });
                }
            });
        }

        // FCA API routes
        this.app.get('/api/fca/alerts', this.createAPIHandler('fca', 'getActiveAlerts'));
        this.app.get('/api/fca/alerts/history', this.createAPIHandler('fca', 'getAlertHistory'));
        this.app.get('/api/fca/firms/:query', this.createAPIHandler('fca', 'searchFirms'));
        this.app.get('/api/fca/scam-alerts', this.createAPIHandler('fca', 'fetchScamAlerts'));

        // HMRC API routes
        this.app.get('/api/hmrc/tax-guidance', this.createAPIHandler('hmrc', 'getTaxGuidance'));
        this.app.get('/api/hmrc/employment-rights', this.createAPIHandler('hmrc', 'getEmploymentRights'));
        this.app.get('/api/hmrc/benefits', this.createAPIHandler('hmrc', 'getBenefitsInformation'));
        this.app.get('/api/hmrc/self-employment', this.createAPIHandler('hmrc', 'getSelfEmploymentGuidance'));

        // Gov.UK API routes
        this.app.get('/api/govuk/guidance/:topic', this.createAPIHandler('govuk', 'getGuidance'));
        this.app.get('/api/govuk/news', this.createAPIHandler('govuk', 'getLatestNews'));
        this.app.get('/api/govuk/publications', this.createAPIHandler('govuk', 'getPublications'));

        // Ombudsman API routes
        this.app.get('/api/ombudsman/statistics', this.createAPIHandler('ombudsman', 'getComplaintStatistics'));
        this.app.get('/api/ombudsman/procedures', this.createAPIHandler('ombudsman', 'getComplaintProcedures'));
        this.app.get('/api/ombudsman/decisions', this.createAPIHandler('ombudsman', 'getRecentDecisions'));

        // Bank of England API routes
        this.app.get('/api/boe/base-rate', this.createAPIHandler('boe', 'getBaseRate'));
        this.app.get('/api/boe/statistics', this.createAPIHandler('boe', 'getBankingStatistics'));
        this.app.get('/api/boe/policy-updates', this.createAPIHandler('boe', 'getPolicyUpdates'));

        // Aggregate data endpoints
        this.app.get('/api/dashboard/summary', this.createDashboardSummaryHandler());
        this.app.get('/api/alerts/all', this.createAllAlertsHandler());
        this.app.get('/api/updates/recent', this.createRecentUpdatesHandler());

        this.logger.info('API routes configured');
    }

    /**
     * Create standardized API handler with caching and error handling
     */
    createAPIHandler(moduleName, methodName) {
        return async (req, res) => {
            const startTime = Date.now();
            
            try {
                const module = this.apiModules.get(moduleName);
                if (!module) {
                    throw new Error(`API module '${moduleName}' not found`);
                }

                if (typeof module[methodName] !== 'function') {
                    throw new Error(`Method '${methodName}' not found in '${moduleName}' module`);
                }

                // Generate cache key
                const cacheKey = `${moduleName}:${methodName}:${JSON.stringify(req.params)}:${JSON.stringify(req.query)}`;
                
                // Check cache first
                let data = await this.cache.get(cacheKey);
                let fromCache = true;
                
                if (!data) {
                    // Call the API method
                    data = await module[methodName](req.params, req.query);
                    fromCache = false;
                    
                    // Cache the result
                    if (data && !data.error) {
                        await this.cache.set(cacheKey, data, this.config.cache.defaultTTL);
                    }
                }

                // Transform data for educational context
                const transformer = new EducationalTransformer();
                const educationalData = await transformer.transform(data, {
                    source: moduleName,
                    method: methodName,
                    userContext: 'educational'
                });

                // Record metrics
                if (this.monitoring) {
                    await this.monitoring.recordAPICall({
                        module: moduleName,
                        method: methodName,
                        responseTime: Date.now() - startTime,
                        fromCache: fromCache,
                        success: true,
                        requestId: req.id
                    });
                }

                // Send response
                res.json({
                    success: true,
                    data: educationalData,
                    metadata: {
                        source: moduleName,
                        method: methodName,
                        fromCache: fromCache,
                        requestId: req.id,
                        timestamp: new Date().toISOString(),
                        responseTime: Date.now() - startTime
                    }
                });

            } catch (error) {
                // Log error
                this.logger.error('API handler error', {
                    requestId: req.id,
                    module: moduleName,
                    method: methodName,
                    error: error.message,
                    stack: error.stack,
                    responseTime: Date.now() - startTime
                });

                // Record error metrics
                if (this.monitoring) {
                    await this.monitoring.recordAPICall({
                        module: moduleName,
                        method: methodName,
                        responseTime: Date.now() - startTime,
                        fromCache: false,
                        success: false,
                        error: error.message,
                        requestId: req.id
                    });
                }

                // Send error response
                res.status(error.statusCode || 500).json({
                    success: false,
                    error: {
                        message: error.message || 'Internal server error',
                        code: error.code || 'INTERNAL_ERROR',
                        requestId: req.id
                    },
                    fallback: await this.getFallbackData(moduleName, methodName)
                });
            }
        };
    }

    /**
     * Create dashboard summary handler
     */
    createDashboardSummaryHandler() {
        return async (req, res) => {
            try {
                const cacheKey = 'dashboard:summary';
                let summary = await this.cache.get(cacheKey);

                if (!summary) {
                    // Collect data from all modules
                    const [fcaAlerts, hmrcTax, govukNews, ombudsmanStats] = await Promise.allSettled([
                        this.apiModules.get('fca')?.getActiveAlerts?.() || Promise.resolve([]),
                        this.apiModules.get('hmrc')?.getTaxGuidance?.() || Promise.resolve({}),
                        this.apiModules.get('govuk')?.getLatestNews?.() || Promise.resolve([]),
                        this.apiModules.get('ombudsman')?.getComplaintStatistics?.() || Promise.resolve({})
                    ]);

                    summary = {
                        totalAlerts: fcaAlerts.status === 'fulfilled' ? fcaAlerts.value.length : 0,
                        lastTaxUpdate: hmrcTax.status === 'fulfilled' ? hmrcTax.value.lastUpdated : null,
                        recentNews: govukNews.status === 'fulfilled' ? govukNews.value.slice(0, 5) : [],
                        complaintStats: ombudsmanStats.status === 'fulfilled' ? ombudsmanStats.value : {},
                        lastUpdated: new Date().toISOString()
                    };

                    await this.cache.set(cacheKey, summary, 900); // 15 minutes
                }

                res.json({
                    success: true,
                    data: summary,
                    requestId: req.id
                });

            } catch (error) {
                this.logger.error('Dashboard summary error', {
                    requestId: req.id,
                    error: error.message
                });

                res.status(500).json({
                    success: false,
                    error: 'Failed to generate dashboard summary',
                    requestId: req.id
                });
            }
        };
    }

    /**
     * Create all alerts handler
     */
    createAllAlertsHandler() {
        return async (req, res) => {
            try {
                const cacheKey = 'alerts:all';
                let alerts = await this.cache.get(cacheKey);

                if (!alerts) {
                    const [fcaAlerts, govukAlerts] = await Promise.allSettled([
                        this.apiModules.get('fca')?.getActiveAlerts?.() || Promise.resolve([]),
                        this.apiModules.get('govuk')?.getAlerts?.() || Promise.resolve([])
                    ]);

                    alerts = {
                        fca: fcaAlerts.status === 'fulfilled' ? fcaAlerts.value : [],
                        govuk: govukAlerts.status === 'fulfilled' ? govukAlerts.value : [],
                        total: 0,
                        lastUpdated: new Date().toISOString()
                    };

                    alerts.total = alerts.fca.length + alerts.govuk.length;
                    await this.cache.set(cacheKey, alerts, 300); // 5 minutes
                }

                res.json({
                    success: true,
                    data: alerts,
                    requestId: req.id
                });

            } catch (error) {
                this.logger.error('All alerts error', {
                    requestId: req.id,
                    error: error.message
                });

                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch all alerts',
                    requestId: req.id
                });
            }
        };
    }

    /**
     * Create recent updates handler
     */
    createRecentUpdatesHandler() {
        return async (req, res) => {
            try {
                const cacheKey = 'updates:recent';
                let updates = await this.cache.get(cacheKey);

                if (!updates) {
                    // Collect recent updates from all sources
                    const updatePromises = Array.from(this.apiModules.entries()).map(async ([name, module]) => {
                        try {
                            if (typeof module.getRecentUpdates === 'function') {
                                const moduleUpdates = await module.getRecentUpdates();
                                return { source: name, updates: moduleUpdates };
                            }
                            return { source: name, updates: [] };
                        } catch (error) {
                            this.logger.warn(`Failed to get updates from ${name}`, { error: error.message });
                            return { source: name, updates: [] };
                        }
                    });

                    const results = await Promise.allSettled(updatePromises);
                    updates = {
                        sources: results
                            .filter(result => result.status === 'fulfilled')
                            .map(result => result.value),
                        lastUpdated: new Date().toISOString()
                    };

                    await this.cache.set(cacheKey, updates, 600); // 10 minutes
                }

                res.json({
                    success: true,
                    data: updates,
                    requestId: req.id
                });

            } catch (error) {
                this.logger.error('Recent updates error', {
                    requestId: req.id,
                    error: error.message
                });

                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch recent updates',
                    requestId: req.id
                });
            }
        };
    }

    /**
     * Setup error handling middleware
     */
    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    message: 'API endpoint not found',
                    code: 'NOT_FOUND',
                    path: req.path,
                    requestId: req.id
                }
            });
        });

        // Global error handler
        this.app.use((error, req, res, next) => {
            // Log error
            this.logger.error('Unhandled error', {
                requestId: req.id,
                error: error.message,
                stack: error.stack,
                url: req.url,
                method: req.method
            });

            // Don't reveal internal errors in production
            const message = this.config.environment === 'production' 
                ? 'An internal server error occurred'
                : error.message;

            res.status(error.statusCode || 500).json({
                success: false,
                error: {
                    message: message,
                    code: error.code || 'INTERNAL_ERROR',
                    requestId: req.id
                }
            });
        });

        this.logger.info('Error handling middleware configured');
    }

    /**
     * Get system health status
     */
    async getHealthStatus() {
        const services = {};
        let overallStatus = 'healthy';

        // Check each API module
        for (const [name, module] of this.apiModules) {
            try {
                if (typeof module.getHealthStatus === 'function') {
                    const status = await module.getHealthStatus();
                    services[name] = status;
                    
                    if (status.status !== 'healthy') {
                        overallStatus = 'degraded';
                    }
                } else {
                    services[name] = { status: 'unknown', message: 'Health check not implemented' };
                }
            } catch (error) {
                services[name] = { status: 'unhealthy', error: error.message };
                overallStatus = 'degraded';
            }
        }

        // Check cache
        try {
            await this.cache.ping();
            services.cache = { status: 'healthy' };
        } catch (error) {
            services.cache = { status: 'unhealthy', error: error.message };
            overallStatus = 'degraded';
        }

        return {
            status: overallStatus,
            services: services
        };
    }

    /**
     * Get fallback data for when APIs fail
     */
    async getFallbackData(moduleName, methodName) {
        try {
            const fallbackKey = `fallback:${moduleName}:${methodName}`;
            return await this.cache.get(fallbackKey);
        } catch (error) {
            this.logger.warn('Failed to get fallback data', {
                module: moduleName,
                method: methodName,
                error: error.message
            });
            return null;
        }
    }

    /**
     * Start the API Gateway server
     */
    async start() {
        try {
            await new Promise((resolve, reject) => {
                this.server = this.app.listen(this.config.port, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            this.logger.info('API Gateway started', {
                port: this.config.port,
                environment: this.config.environment,
                version: '3.0.0'
            });

            // Setup graceful shutdown
            this.setupGracefulShutdown();

        } catch (error) {
            this.logger.error('Failed to start API Gateway', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Setup graceful shutdown
     */
    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            this.logger.info(`Received ${signal}, starting graceful shutdown`);

            // Close server
            if (this.server) {
                await new Promise((resolve) => {
                    this.server.close(resolve);
                });
            }

            // Cleanup resources
            if (this.cache) {
                await this.cache.disconnect();
            }

            if (this.monitoring) {
                await this.monitoring.stop();
            }

            this.logger.info('Graceful shutdown completed');
            process.exit(0);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
}

// Export for use as module or start directly
if (require.main === module) {
    // Start API Gateway if run directly
    const gateway = new APIGateway();
    gateway.start().catch(error => {
        console.error('Failed to start API Gateway:', error);
        process.exit(1);
    });
} else {
    module.exports = APIGateway;
}

console.log('🚀 JuriBank API Gateway module loaded');