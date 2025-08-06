/**
 * JuriBank Educational Platform - Monitoring Collector
 * Comprehensive monitoring and metrics collection for API integrations
 * 
 * Features:
 * - API performance metrics
 * - System health monitoring
 * - User behavior analytics
 * - Error tracking and alerting
 * - Educational content engagement tracking
 * - GDPR-compliant data collection
 */

class MonitoringCollector {
    constructor(logger = console) {
        this.logger = logger;
        this.metrics = new Map();
        this.alerts = [];
        this.systemMetrics = {
            startTime: Date.now(),
            requests: {
                total: 0,
                successful: 0,
                failed: 0,
                byEndpoint: new Map(),
                byStatus: new Map()
            },
            performance: {
                responseTimeP50: 0,
                responseTimeP95: 0,
                responseTimeP99: 0,
                responseTimes: []
            },
            api: {
                calls: new Map(),
                failures: new Map(),
                rateLimits: new Map()
            },
            cache: {
                hits: 0,
                misses: 0,
                hitRate: 0
            },
            educational: {
                contentViews: new Map(),
                userEngagement: new Map(),
                learningProgress: new Map()
            }
        };
        
        this.initialized = false;
        this.alertThresholds = {
            errorRate: 5, // 5%
            responseTime: 2000, // 2 seconds
            cacheHitRate: 70, // 70%
            apiFailureRate: 10 // 10%
        };
    }

    /**
     * Initialize monitoring collector
     */
    async initialize() {
        try {
            this.logger.info('📊 Initializing Monitoring Collector...');
            
            this.setupMetricsCollection();
            this.startPeriodicReporting();
            
            this.initialized = true;
            this.logger.info('✅ Monitoring Collector initialized successfully');
            
        } catch (error) {
            this.logger.error('❌ Monitoring Collector initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup metrics collection intervals
     */
    setupMetricsCollection() {
        // Collect system metrics every 30 seconds
        setInterval(() => {
            this.collectSystemMetrics();
        }, 30000);

        // Calculate percentiles every minute
        setInterval(() => {
            this.calculatePercentiles();
        }, 60000);

        // Clean old data every 5 minutes
        setInterval(() => {
            this.cleanupOldData();
        }, 300000);
    }

    /**
     * Start periodic reporting
     */
    startPeriodicReporting() {
        // Report metrics every 5 minutes
        setInterval(() => {
            this.reportMetrics();
        }, 300000);

        // Check for alerts every minute
        setInterval(() => {
            this.checkAlerts();
        }, 60000);
    }

    /**
     * Record API call metrics
     */
    async recordAPICall(callData) {
        try {
            const {
                module,
                method,
                responseTime,
                fromCache = false,
                success = true,
                error = null,
                requestId = null
            } = callData;

            // Update request counts
            this.systemMetrics.requests.total++;
            if (success) {
                this.systemMetrics.requests.successful++;
            } else {
                this.systemMetrics.requests.failed++;
            }

            // Update endpoint metrics
            const endpoint = `${module}:${method}`;
            const endpointMetrics = this.systemMetrics.requests.byEndpoint.get(endpoint) || {
                total: 0,
                successful: 0,
                failed: 0,
                avgResponseTime: 0,
                responseTimes: []
            };

            endpointMetrics.total++;
            if (success) {
                endpointMetrics.successful++;
            } else {
                endpointMetrics.failed++;
            }

            // Update response times (only for non-cached requests)
            if (!fromCache && responseTime) {
                endpointMetrics.responseTimes.push(responseTime);
                if (endpointMetrics.responseTimes.length > 100) {
                    endpointMetrics.responseTimes = endpointMetrics.responseTimes.slice(-100);
                }
                
                endpointMetrics.avgResponseTime = 
                    endpointMetrics.responseTimes.reduce((a, b) => a + b, 0) / 
                    endpointMetrics.responseTimes.length;

                // Add to global response times
                this.systemMetrics.performance.responseTimes.push(responseTime);
                if (this.systemMetrics.performance.responseTimes.length > 1000) {
                    this.systemMetrics.performance.responseTimes = 
                        this.systemMetrics.performance.responseTimes.slice(-1000);
                }
            }

            this.systemMetrics.requests.byEndpoint.set(endpoint, endpointMetrics);

            // Update API module metrics
            const moduleMetrics = this.systemMetrics.api.calls.get(module) || {
                total: 0,
                successful: 0,
                failed: 0,
                cached: 0,
                errors: []
            };

            moduleMetrics.total++;
            if (success) {
                moduleMetrics.successful++;
            } else {
                moduleMetrics.failed++;
                if (error) {
                    moduleMetrics.errors.push({
                        error: error,
                        timestamp: new Date().toISOString(),
                        method: method,
                        requestId: requestId
                    });
                    
                    // Keep only last 50 errors
                    if (moduleMetrics.errors.length > 50) {
                        moduleMetrics.errors = moduleMetrics.errors.slice(-50);
                    }
                }
            }

            if (fromCache) {
                moduleMetrics.cached++;
            }

            this.systemMetrics.api.calls.set(module, moduleMetrics);

            // Log detailed metrics for debugging
            this.logger.debug('API call recorded', {
                module,
                method,
                success,
                responseTime,
                fromCache,
                requestId
            });

        } catch (error) {
            this.logger.error('Error recording API call:', error);
        }
    }

    /**
     * Record cache metrics
     */
    recordCacheMetrics(hit = false) {
        if (hit) {
            this.systemMetrics.cache.hits++;
        } else {
            this.systemMetrics.cache.misses++;
        }

        const total = this.systemMetrics.cache.hits + this.systemMetrics.cache.misses;
        this.systemMetrics.cache.hitRate = total > 0 
            ? (this.systemMetrics.cache.hits / total) * 100 
            : 0;
    }

    /**
     * Record educational content interaction
     */
    recordEducationalInteraction(interactionData) {
        try {
            const {
                contentType,
                contentId,
                action,
                userId = 'anonymous',
                duration = null,
                metadata = {}
            } = interactionData;

            // Update content views
            const contentKey = `${contentType}:${contentId}`;
            const contentMetrics = this.systemMetrics.educational.contentViews.get(contentKey) || {
                views: 0,
                uniqueUsers: new Set(),
                avgDuration: 0,
                durations: [],
                interactions: {}
            };

            contentMetrics.views++;
            contentMetrics.uniqueUsers.add(userId);

            if (duration) {
                contentMetrics.durations.push(duration);
                if (contentMetrics.durations.length > 100) {
                    contentMetrics.durations = contentMetrics.durations.slice(-100);
                }
                contentMetrics.avgDuration = 
                    contentMetrics.durations.reduce((a, b) => a + b, 0) / 
                    contentMetrics.durations.length;
            }

            // Track interaction types
            contentMetrics.interactions[action] = (contentMetrics.interactions[action] || 0) + 1;

            this.systemMetrics.educational.contentViews.set(contentKey, contentMetrics);

            // Update user engagement (anonymized)
            const userKey = this.anonymizeUserId(userId);
            const userMetrics = this.systemMetrics.educational.userEngagement.get(userKey) || {
                sessionsCount: 0,
                totalTime: 0,
                contentTypes: {},
                lastActivity: null
            };

            userMetrics.sessionsCount++;
            if (duration) {
                userMetrics.totalTime += duration;
            }
            userMetrics.contentTypes[contentType] = (userMetrics.contentTypes[contentType] || 0) + 1;
            userMetrics.lastActivity = new Date().toISOString();

            this.systemMetrics.educational.userEngagement.set(userKey, userMetrics);

        } catch (error) {
            this.logger.error('Error recording educational interaction:', error);
        }
    }

    /**
     * Record system performance metrics
     */
    collectSystemMetrics() {
        try {
            // Memory usage
            if (typeof process !== 'undefined' && process.memoryUsage) {
                const memUsage = process.memoryUsage();
                this.recordMetric('system.memory.used', memUsage.heapUsed);
                this.recordMetric('system.memory.total', memUsage.heapTotal);
                this.recordMetric('system.memory.rss', memUsage.rss);
            }

            // Uptime
            const uptime = Date.now() - this.systemMetrics.startTime;
            this.recordMetric('system.uptime', uptime);

            // Request rates
            const requestRate = this.systemMetrics.requests.total / (uptime / 60000); // per minute
            this.recordMetric('system.requests.rate', requestRate);

            // Error rate
            const errorRate = this.systemMetrics.requests.total > 0 
                ? (this.systemMetrics.requests.failed / this.systemMetrics.requests.total) * 100
                : 0;
            this.recordMetric('system.requests.errorRate', errorRate);

        } catch (error) {
            this.logger.error('Error collecting system metrics:', error);
        }
    }

    /**
     * Calculate response time percentiles
     */
    calculatePercentiles() {
        try {
            const responseTimes = this.systemMetrics.performance.responseTimes;
            
            if (responseTimes.length === 0) {
                return;
            }

            const sorted = [...responseTimes].sort((a, b) => a - b);
            
            this.systemMetrics.performance.responseTimeP50 = 
                this.getPercentile(sorted, 50);
            this.systemMetrics.performance.responseTimeP95 = 
                this.getPercentile(sorted, 95);
            this.systemMetrics.performance.responseTimeP99 = 
                this.getPercentile(sorted, 99);

        } catch (error) {
            this.logger.error('Error calculating percentiles:', error);
        }
    }

    /**
     * Get percentile value from sorted array
     */
    getPercentile(sortedArray, percentile) {
        const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
        return sortedArray[Math.max(0, index)];
    }

    /**
     * Record custom metric
     */
    recordMetric(name, value, timestamp = Date.now()) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const metricData = this.metrics.get(name);
        metricData.push({ value, timestamp });

        // Keep only last 1000 data points per metric
        if (metricData.length > 1000) {
            metricData.splice(0, metricData.length - 1000);
        }
    }

    /**
     * Get current metrics snapshot
     */
    getMetrics() {
        const now = Date.now();
        const uptime = now - this.systemMetrics.startTime;

        return {
            timestamp: new Date().toISOString(),
            uptime: {
                milliseconds: uptime,
                human: this.formatUptime(uptime)
            },
            requests: {
                ...this.systemMetrics.requests,
                rate: this.systemMetrics.requests.total / (uptime / 60000), // per minute
                errorRate: this.systemMetrics.requests.total > 0 
                    ? (this.systemMetrics.requests.failed / this.systemMetrics.requests.total) * 100
                    : 0
            },
            performance: {
                ...this.systemMetrics.performance,
                averageResponseTime: this.systemMetrics.performance.responseTimes.length > 0
                    ? this.systemMetrics.performance.responseTimes.reduce((a, b) => a + b, 0) / 
                      this.systemMetrics.performance.responseTimes.length
                    : 0
            },
            apis: this.getAPIMetrics(),
            cache: this.systemMetrics.cache,
            educational: this.getEducationalMetrics(),
            system: this.getSystemHealth()
        };
    }

    /**
     * Get API-specific metrics
     */
    getAPIMetrics() {
        const apiMetrics = {};
        
        for (const [module, metrics] of this.systemMetrics.api.calls) {
            apiMetrics[module] = {
                ...metrics,
                successRate: metrics.total > 0 
                    ? (metrics.successful / metrics.total) * 100 
                    : 0,
                cacheRate: metrics.total > 0
                    ? (metrics.cached / metrics.total) * 100
                    : 0,
                recentErrors: metrics.errors.slice(-5) // Last 5 errors
            };
        }

        return apiMetrics;
    }

    /**
     * Get educational content metrics
     */
    getEducationalMetrics() {
        const contentMetrics = {};
        const userEngagement = {
            totalUsers: this.systemMetrics.educational.userEngagement.size,
            avgSessionTime: 0,
            contentTypeDistribution: {}
        };

        // Process content views
        for (const [contentKey, metrics] of this.systemMetrics.educational.contentViews) {
            contentMetrics[contentKey] = {
                views: metrics.views,
                uniqueUsers: metrics.uniqueUsers.size,
                avgDuration: Math.round(metrics.avgDuration),
                interactions: metrics.interactions
            };
        }

        // Process user engagement
        let totalTime = 0;
        let userCount = 0;
        const contentTypes = {};

        for (const [userKey, metrics] of this.systemMetrics.educational.userEngagement) {
            totalTime += metrics.totalTime;
            userCount++;

            for (const [contentType, count] of Object.entries(metrics.contentTypes)) {
                contentTypes[contentType] = (contentTypes[contentType] || 0) + count;
            }
        }

        userEngagement.avgSessionTime = userCount > 0 ? Math.round(totalTime / userCount) : 0;
        userEngagement.contentTypeDistribution = contentTypes;

        return {
            content: contentMetrics,
            engagement: userEngagement
        };
    }

    /**
     * Get system health status
     */
    getSystemHealth() {
        const errorRate = this.systemMetrics.requests.total > 0 
            ? (this.systemMetrics.requests.failed / this.systemMetrics.requests.total) * 100
            : 0;

        const avgResponseTime = this.systemMetrics.performance.responseTimes.length > 0
            ? this.systemMetrics.performance.responseTimes.reduce((a, b) => a + b, 0) / 
              this.systemMetrics.performance.responseTimes.length
            : 0;

        let status = 'healthy';
        const issues = [];

        if (errorRate > this.alertThresholds.errorRate) {
            status = 'degraded';
            issues.push(`High error rate: ${errorRate.toFixed(2)}%`);
        }

        if (avgResponseTime > this.alertThresholds.responseTime) {
            status = 'degraded';
            issues.push(`Slow response time: ${avgResponseTime.toFixed(0)}ms`);
        }

        if (this.systemMetrics.cache.hitRate < this.alertThresholds.cacheHitRate) {
            issues.push(`Low cache hit rate: ${this.systemMetrics.cache.hitRate.toFixed(1)}%`);
        }

        return {
            status: status,
            issues: issues,
            errorRate: errorRate,
            avgResponseTime: avgResponseTime,
            cacheHitRate: this.systemMetrics.cache.hitRate
        };
    }

    /**
     * Check for alerts and trigger notifications
     */
    checkAlerts() {
        try {
            const health = this.getSystemHealth();
            
            if (health.status !== 'healthy' && health.issues.length > 0) {
                const alert = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    severity: 'warning',
                    title: 'System Performance Alert',
                    message: `System health degraded: ${health.issues.join(', ')}`,
                    metrics: {
                        errorRate: health.errorRate,
                        avgResponseTime: health.avgResponseTime,
                        cacheHitRate: health.cacheHitRate
                    }
                };

                this.alerts.push(alert);
                
                // Keep only last 100 alerts
                if (this.alerts.length > 100) {
                    this.alerts = this.alerts.slice(-100);
                }

                this.logger.warn('System performance alert', alert);
            }

        } catch (error) {
            this.logger.error('Error checking alerts:', error);
        }
    }

    /**
     * Report metrics periodically
     */
    reportMetrics() {
        try {
            const metrics = this.getMetrics();
            
            this.logger.info('📊 Periodic metrics report', {
                uptime: metrics.uptime.human,
                requests: {
                    total: metrics.requests.total,
                    rate: Math.round(metrics.requests.rate * 10) / 10,
                    errorRate: Math.round(metrics.requests.errorRate * 10) / 10
                },
                performance: {
                    avgResponseTime: Math.round(metrics.performance.averageResponseTime),
                    p95ResponseTime: metrics.performance.responseTimeP95
                },
                cache: {
                    hitRate: Math.round(metrics.cache.hitRate * 10) / 10
                },
                system: metrics.system.status
            });

        } catch (error) {
            this.logger.error('Error reporting metrics:', error);
        }
    }

    /**
     * Clean up old data to prevent memory leaks
     */
    cleanupOldData() {
        try {
            const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

            // Clean up custom metrics
            for (const [name, data] of this.metrics) {
                const filtered = data.filter(point => point.timestamp > cutoffTime);
                this.metrics.set(name, filtered);
            }

            // Clean up alerts
            this.alerts = this.alerts.filter(alert => 
                new Date(alert.timestamp).getTime() > cutoffTime
            );

            this.logger.debug('Old monitoring data cleaned up');

        } catch (error) {
            this.logger.error('Error cleaning up old data:', error);
        }
    }

    /**
     * Anonymize user ID for privacy compliance
     */
    anonymizeUserId(userId) {
        if (userId === 'anonymous') return 'anonymous';
        
        // Simple hash for anonymization (in production, use a proper cryptographic hash)
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return `user_${Math.abs(hash)}`;
    }

    /**
     * Format uptime in human-readable format
     */
    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    /**
     * Get active alerts
     */
    getAlerts() {
        return this.alerts.slice(-50); // Last 50 alerts
    }

    /**
     * Stop monitoring collector
     */
    async stop() {
        try {
            this.logger.info('📊 Stopping Monitoring Collector...');
            
            // Final metrics report
            this.reportMetrics();
            
            this.initialized = false;
            this.logger.info('✅ Monitoring Collector stopped');
            
        } catch (error) {
            this.logger.error('Error stopping Monitoring Collector:', error);
        }
    }
}

module.exports = MonitoringCollector;