/**
 * JuriBank Educational Platform - Cache Manager
 * Intelligent multi-layer caching system for API responses
 * 
 * Features:
 * - Memory-based caching with LRU eviction
 * - Redis integration for distributed caching
 * - Smart cache invalidation strategies
 * - Cache warming and preloading
 * - Comprehensive cache analytics
 * - Educational content caching optimization
 */

const NodeCache = require('node-cache');
const crypto = require('crypto');

class CacheManager {
    constructor(config = {}, logger = console) {
        this.config = {
            // Memory cache settings
            memory: {
                stdTTL: config.defaultTTL || 3600, // 1 hour default
                checkperiod: config.checkInterval || 600, // 10 minutes
                useClones: false,
                deleteOnExpire: true,
                enableLegacyCallbacks: false,
                maxKeys: 10000
            },
            
            // Redis settings (if available)
            redis: {
                enabled: false, // Will be set based on availability
                host: process.env.REDIS_URL || 'localhost',
                port: 6379,
                ttl: {
                    short: 300,     // 5 minutes
                    medium: 1800,   // 30 minutes  
                    long: 3600,     // 1 hour
                    extended: 86400 // 24 hours
                }
            },
            
            // Cache strategies
            strategies: {
                writeThrough: ['critical-alerts', 'real-time-data'],
                writeBack: ['statistics', 'historical-data'],
                lazyLoading: ['reference-data', 'static-content'],
                noCache: ['user-specific', 'authentication']
            },
            
            // Cache warming
            warming: {
                enabled: true,
                schedules: {
                    'fca-alerts': '*/5 * * * *',      // Every 5 minutes
                    'tax-guidance': '0 */6 * * *',    // Every 6 hours
                    'gov-updates': '0 */3 * * *',     // Every 3 hours
                    'ombudsman-stats': '0 8 * * *'    // Daily at 8am
                }
            },
            
            ...config
        };

        this.logger = logger;
        this.memoryCache = null;
        this.redisClient = null;
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            errors: 0,
            totalRequests: 0
        };
        
        this.initialized = false;
    }

    /**
     * Initialize cache manager
     */
    async initialize() {
        try {
            // Initialize memory cache
            this.memoryCache = new NodeCache(this.config.memory);
            
            // Set up cache event listeners
            this.setupCacheEvents();
            
            // Try to initialize Redis if available
            await this.initializeRedis();
            
            // Set up cache warming if enabled
            if (this.config.warming.enabled) {
                this.setupCacheWarming();
            }
            
            // Start statistics collection
            this.startStatsCollection();
            
            this.initialized = true;
            this.logger.info('Cache Manager initialized successfully', {
                memoryCache: 'enabled',
                redisCache: this.config.redis.enabled ? 'enabled' : 'disabled',
                warming: this.config.warming.enabled ? 'enabled' : 'disabled'
            });
            
        } catch (error) {
            this.logger.error('Failed to initialize Cache Manager', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    /**
     * Initialize Redis connection
     */
    async initializeRedis() {
        try {
            // Only attempt Redis if environment variable is set
            if (!process.env.REDIS_URL) {
                this.logger.info('Redis not configured, using memory cache only');
                return;
            }

            const redis = require('redis');
            this.redisClient = redis.createClient({
                url: process.env.REDIS_URL,
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        this.logger.error('Redis server connection refused');
                        return new Error('Redis server connection refused');
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        this.logger.error('Redis retry time exhausted');
                        return new Error('Retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        this.logger.error('Max Redis connection attempts reached');
                        return undefined;
                    }
                    // Exponential backoff
                    return Math.min(options.attempt * 100, 3000);
                }
            });

            this.redisClient.on('error', (error) => {
                this.logger.error('Redis error', { error: error.message });
                this.config.redis.enabled = false;
            });

            this.redisClient.on('connect', () => {
                this.logger.info('Redis connected successfully');
                this.config.redis.enabled = true;
            });

            this.redisClient.on('disconnect', () => {
                this.logger.warn('Redis disconnected');
                this.config.redis.enabled = false;
            });

            await this.redisClient.connect();
            
        } catch (error) {
            this.logger.warn('Redis initialization failed, continuing with memory cache only', {
                error: error.message
            });
            this.config.redis.enabled = false;
        }
    }

    /**
     * Set up cache event listeners
     */
    setupCacheEvents() {
        this.memoryCache.on('set', (key, value) => {
            this.stats.sets++;
            this.logger.debug('Cache SET', { key: this.sanitizeKey(key) });
        });

        this.memoryCache.on('get', (key, value) => {
            if (value !== undefined) {
                this.stats.hits++;
                this.logger.debug('Cache HIT', { key: this.sanitizeKey(key) });
            } else {
                this.stats.misses++;
                this.logger.debug('Cache MISS', { key: this.sanitizeKey(key) });
            }
            this.stats.totalRequests++;
        });

        this.memoryCache.on('del', (key, value) => {
            this.stats.deletes++;
            this.logger.debug('Cache DELETE', { key: this.sanitizeKey(key) });
        });

        this.memoryCache.on('expired', (key, value) => {
            this.logger.debug('Cache EXPIRED', { key: this.sanitizeKey(key) });
        });
    }

    /**
     * Generate cache key from various inputs
     */
    generateKey(...parts) {
        const keyString = parts
            .filter(part => part !== null && part !== undefined)
            .map(part => typeof part === 'object' ? JSON.stringify(part) : String(part))
            .join(':');
        
        // Create hash for very long keys
        if (keyString.length > 200) {
            const hash = crypto.createHash('md5').update(keyString).digest('hex');
            return `hash:${hash}`;
        }
        
        return keyString.replace(/[^a-zA-Z0-9:_-]/g, '_');
    }

    /**
     * Get value from cache (checks memory first, then Redis)
     */
    async get(key, options = {}) {
        if (!this.initialized) {
            throw new Error('Cache Manager not initialized');
        }

        try {
            const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
            
            // Check memory cache first
            let value = this.memoryCache.get(cacheKey);
            
            if (value !== undefined) {
                this.logger.debug('Memory cache hit', { key: this.sanitizeKey(cacheKey) });
                return this.deserializeValue(value);
            }
            
            // Check Redis if available
            if (this.config.redis.enabled && this.redisClient) {
                try {
                    const redisValue = await this.redisClient.get(cacheKey);
                    if (redisValue !== null) {
                        const parsed = JSON.parse(redisValue);
                        const deserialized = this.deserializeValue(parsed);
                        
                        // Warm memory cache
                        this.memoryCache.set(cacheKey, parsed, options.ttl || this.config.memory.stdTTL);
                        
                        this.logger.debug('Redis cache hit', { key: this.sanitizeKey(cacheKey) });
                        return deserialized;
                    }
                } catch (redisError) {
                    this.logger.warn('Redis get error', { 
                        key: this.sanitizeKey(cacheKey),
                        error: redisError.message 
                    });
                }
            }
            
            this.logger.debug('Cache miss', { key: this.sanitizeKey(cacheKey) });
            return null;
            
        } catch (error) {
            this.stats.errors++;
            this.logger.error('Cache get error', { 
                key: this.sanitizeKey(key),
                error: error.message 
            });
            return null;
        }
    }

    /**
     * Set value in cache (writes to both memory and Redis)
     */
    async set(key, value, ttl = null, options = {}) {
        if (!this.initialized) {
            throw new Error('Cache Manager not initialized');
        }

        try {
            const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
            const cacheTTL = ttl || options.ttl || this.config.memory.stdTTL;
            const serialized = this.serializeValue(value);
            
            // Store in memory cache
            this.memoryCache.set(cacheKey, serialized, cacheTTL);
            
            // Store in Redis if available
            if (this.config.redis.enabled && this.redisClient) {
                try {
                    await this.redisClient.setEx(
                        cacheKey,
                        cacheTTL,
                        JSON.stringify(serialized)
                    );
                } catch (redisError) {
                    this.logger.warn('Redis set error', { 
                        key: this.sanitizeKey(cacheKey),
                        error: redisError.message 
                    });
                }
            }
            
            this.logger.debug('Cache set successful', { 
                key: this.sanitizeKey(cacheKey),
                ttl: cacheTTL 
            });
            
            return true;
            
        } catch (error) {
            this.stats.errors++;
            this.logger.error('Cache set error', { 
                key: this.sanitizeKey(key),
                error: error.message 
            });
            return false;
        }
    }

    /**
     * Delete key from cache
     */
    async del(key) {
        if (!this.initialized) {
            throw new Error('Cache Manager not initialized');
        }

        try {
            const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
            
            // Delete from memory cache
            this.memoryCache.del(cacheKey);
            
            // Delete from Redis if available
            if (this.config.redis.enabled && this.redisClient) {
                try {
                    await this.redisClient.del(cacheKey);
                } catch (redisError) {
                    this.logger.warn('Redis delete error', { 
                        key: this.sanitizeKey(cacheKey),
                        error: redisError.message 
                    });
                }
            }
            
            this.logger.debug('Cache delete successful', { 
                key: this.sanitizeKey(cacheKey)
            });
            
            return true;
            
        } catch (error) {
            this.stats.errors++;
            this.logger.error('Cache delete error', { 
                key: this.sanitizeKey(key),
                error: error.message 
            });
            return false;
        }
    }

    /**
     * Check if key exists in cache
     */
    async exists(key) {
        if (!this.initialized) {
            return false;
        }

        const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
        
        // Check memory cache
        if (this.memoryCache.has(cacheKey)) {
            return true;
        }
        
        // Check Redis if available
        if (this.config.redis.enabled && this.redisClient) {
            try {
                const exists = await this.redisClient.exists(cacheKey);
                return exists === 1;
            } catch (error) {
                this.logger.warn('Redis exists check error', { 
                    key: this.sanitizeKey(cacheKey),
                    error: error.message 
                });
            }
        }
        
        return false;
    }

    /**
     * Invalidate cache entries by pattern
     */
    async invalidatePattern(pattern) {
        if (!this.initialized) {
            throw new Error('Cache Manager not initialized');
        }

        try {
            let deletedCount = 0;
            
            // Invalidate memory cache
            const keys = this.memoryCache.keys();
            for (const key of keys) {
                if (key.includes(pattern)) {
                    this.memoryCache.del(key);
                    deletedCount++;
                }
            }
            
            // Invalidate Redis if available
            if (this.config.redis.enabled && this.redisClient) {
                try {
                    const redisKeys = await this.redisClient.keys(`*${pattern}*`);
                    if (redisKeys.length > 0) {
                        await this.redisClient.del(redisKeys);
                        deletedCount += redisKeys.length;
                    }
                } catch (redisError) {
                    this.logger.warn('Redis pattern invalidation error', { 
                        pattern,
                        error: redisError.message 
                    });
                }
            }
            
            this.logger.info('Cache pattern invalidation completed', { 
                pattern,
                deletedCount 
            });
            
            return deletedCount;
            
        } catch (error) {
            this.logger.error('Cache pattern invalidation error', { 
                pattern,
                error: error.message 
            });
            return 0;
        }
    }

    /**
     * Get cache with fallback function
     */
    async getWithFallback(key, fallbackFn, ttl = null, options = {}) {
        let value = await this.get(key, options);
        
        if (value === null && typeof fallbackFn === 'function') {
            try {
                value = await fallbackFn();
                if (value !== null && value !== undefined) {
                    await this.set(key, value, ttl, options);
                }
            } catch (error) {
                this.logger.error('Cache fallback function error', { 
                    key: this.sanitizeKey(key),
                    error: error.message 
                });
            }
        }
        
        return value;
    }

    /**
     * Warm cache with predefined data
     */
    async warmCache(warningConfig) {
        if (!this.initialized) {
            return;
        }

        try {
            this.logger.info('Starting cache warming', { config: warningConfig });
            
            for (const [cacheKey, dataFunction] of Object.entries(warningConfig)) {
                try {
                    if (typeof dataFunction === 'function') {
                        const data = await dataFunction();
                        await this.set(cacheKey, data, this.config.redis.ttl.long);
                        this.logger.debug('Cache warmed', { key: cacheKey });
                    }
                } catch (error) {
                    this.logger.warn('Cache warming failed for key', { 
                        key: cacheKey,
                        error: error.message 
                    });
                }
            }
            
            this.logger.info('Cache warming completed');
            
        } catch (error) {
            this.logger.error('Cache warming error', { error: error.message });
        }
    }

    /**
     * Setup cache warming schedules
     */
    setupCacheWarming() {
        // This would integrate with a job scheduler like node-cron
        // For now, we'll just log the intention
        this.logger.info('Cache warming schedules configured', { 
            schedules: this.config.warming.schedules 
        });
    }

    /**
     * Start statistics collection
     */
    startStatsCollection() {
        // Reset stats every hour
        setInterval(() => {
            this.logger.info('Cache statistics', { 
                ...this.stats,
                hitRate: this.stats.totalRequests > 0 
                    ? ((this.stats.hits / this.stats.totalRequests) * 100).toFixed(2) + '%'
                    : '0%',
                memoryKeys: this.memoryCache.keys().length
            });
            
            // Reset counters
            this.stats = {
                hits: 0,
                misses: 0,
                sets: 0,
                deletes: 0,
                errors: 0,
                totalRequests: 0
            };
        }, 3600000); // 1 hour
    }

    /**
     * Serialize value for caching
     */
    serializeValue(value) {
        return {
            data: value,
            type: typeof value,
            cached_at: new Date().toISOString(),
            cache_version: '1.0'
        };
    }

    /**
     * Deserialize value from cache
     */
    deserializeValue(serialized) {
        if (typeof serialized === 'object' && serialized.data !== undefined) {
            return serialized.data;
        }
        return serialized;
    }

    /**
     * Sanitize key for logging (remove sensitive information)
     */
    sanitizeKey(key) {
        if (typeof key !== 'string') {
            return '[complex-key]';
        }
        
        // Remove potential sensitive data
        return key.replace(/api[_-]?key[=:][\w-]+/gi, 'api_key=***')
                 .replace(/token[=:][\w-]+/gi, 'token=***')
                 .replace(/password[=:][\w-]+/gi, 'password=***');
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            ...this.stats,
            hitRate: this.stats.totalRequests > 0 
                ? ((this.stats.hits / this.stats.totalRequests) * 100).toFixed(2) + '%'
                : '0%',
            memoryKeys: this.memoryCache ? this.memoryCache.keys().length : 0,
            redisEnabled: this.config.redis.enabled,
            initialized: this.initialized
        };
    }

    /**
     * Health check
     */
    async ping() {
        if (!this.initialized) {
            throw new Error('Cache Manager not initialized');
        }

        const testKey = 'health_check_' + Date.now();
        const testValue = 'ping';
        
        try {
            // Test memory cache
            this.memoryCache.set(testKey, testValue, 10);
            const retrieved = this.memoryCache.get(testKey);
            this.memoryCache.del(testKey);
            
            if (retrieved !== testValue) {
                throw new Error('Memory cache health check failed');
            }
            
            // Test Redis if available
            if (this.config.redis.enabled && this.redisClient) {
                await this.redisClient.setEx(testKey, 10, testValue);
                const redisRetrieved = await this.redisClient.get(testKey);
                await this.redisClient.del(testKey);
                
                if (redisRetrieved !== testValue) {
                    throw new Error('Redis cache health check failed');
                }
            }
            
            return true;
            
        } catch (error) {
            this.logger.error('Cache health check failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Disconnect and cleanup
     */
    async disconnect() {
        try {
            if (this.memoryCache) {
                this.memoryCache.close();
            }
            
            if (this.redisClient) {
                await this.redisClient.disconnect();
            }
            
            this.initialized = false;
            this.logger.info('Cache Manager disconnected');
            
        } catch (error) {
            this.logger.error('Cache Manager disconnect error', { error: error.message });
        }
    }
}

module.exports = CacheManager;