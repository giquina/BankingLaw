// FCA API Integration Infrastructure
// JuriBank Educational Platform - Real-time Consumer Protection Alerts

class FCAIntegration {
    constructor(config = {}) {
        this.config = {
            baseURL: 'https://www.fca.org.uk',
            registerURL: 'https://register.fca.org.uk/Services/V1',
            rateLimit: {
                maxRequests: 500,
                windowHours: 1
            },
            cache: {
                alertTTL: 3600000, // 1 hour for critical alerts
                registerTTL: 86400000, // 24 hours for register data
                publicationTTL: 21600000 // 6 hours for publications
            },
            retryPolicy: {
                maxRetries: 3,
                backoffMs: 1000,
                backoffMultiplier: 2
            },
            ...config
        };

        this.rateLimiter = new Map();
        this.cache = new Map();
        this.apiCallLog = [];
        this.isInitialized = false;
        
        this.initialize();
    }

    // Initialize FCA API integration
    async initialize() {
        console.log('🏛️ Initializing FCA API Integration...');
        
        try {
            await this.validateConnection();
            await this.loadConfiguration();
            this.setupRateLimiting();
            this.startCacheCleanup();
            
            this.isInitialized = true;
            console.log('✅ FCA API Integration initialized successfully');
            
            // Start real-time monitoring
            this.startRealTimeMonitoring();
            
        } catch (error) {
            console.error('❌ FCA API Integration initialization failed:', error);
            throw error;
        }
    }

    // Validate connection to FCA endpoints
    async validateConnection() {
        const endpoints = [
            { name: 'FCA Main', url: `${this.config.baseURL}/about/the-fca` },
            { name: 'Register API', url: `${this.config.registerURL}/Firms` }
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await this.makeRequest('GET', endpoint.url, null, {
                    timeout: 10000,
                    validateStatus: false
                });
                
                if (response.status === 200 || response.status === 404) {
                    console.log(`✅ ${endpoint.name} endpoint accessible`);
                } else {
                    throw new Error(`Unexpected status: ${response.status}`);
                }
            } catch (error) {
                console.warn(`⚠️ ${endpoint.name} validation failed:`, error.message);
                // Continue with other endpoints - some may be temporarily unavailable
            }
        }
    }

    // Load FCA API configuration
    async loadConfiguration() {
        // Load environment-specific configuration
        this.apiConfig = {
            userAgent: 'JuriBank-Educational-Platform/3.0 (https://banking-law.vercel.app; educational@juribank.uk)',
            headers: {
                'Accept': 'application/json, text/html, */*',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            timeout: 30000
        };

        // Load API endpoints mapping
        this.endpoints = {
            consumerAlerts: '/consumers/warnings',
            scamAlerts: '/scamsmart',
            publications: '/publications',
            registerFirms: '/Services/V1/Firms',
            registerIndividuals: '/Services/V1/Individuals',
            policyUpdates: '/about/the-fca/what-we-do/how-we-operate/transparency'
        };

        console.log('📋 FCA API configuration loaded');
    }

    // Setup rate limiting
    setupRateLimiting() {
        this.rateLimiter.set('requests', []);
        
        // Clean up old rate limit records every minute
        setInterval(() => {
            this.cleanupRateLimitRecords();
        }, 60000);
        
        console.log('🚦 Rate limiting configured (500 requests/hour)');
    }

    // Start cache cleanup process
    startCacheCleanup() {
        setInterval(() => {
            this.cleanupExpiredCache();
        }, 300000); // Clean every 5 minutes
        
        console.log('🧹 Cache cleanup process started');
    }

    // Start real-time monitoring
    startRealTimeMonitoring() {
        // Monitor consumer alerts every 15 minutes
        setInterval(async () => {
            await this.fetchConsumerAlerts();
        }, 15 * 60 * 1000);

        // Monitor scam alerts every 30 minutes
        setInterval(async () => {
            await this.fetchScamAlerts();
        }, 30 * 60 * 1000);

        // Monitor publications every hour
        setInterval(async () => {
            await this.fetchLatestPublications();
        }, 60 * 60 * 1000);

        console.log('🔄 Real-time monitoring started');
        
        // Initial fetch
        setTimeout(async () => {
            await this.performInitialDataFetch();
        }, 5000);
    }

    // Perform initial data fetch
    async performInitialDataFetch() {
        console.log('📥 Performing initial FCA data fetch...');
        
        try {
            await Promise.allSettled([
                this.fetchConsumerAlerts(),
                this.fetchScamAlerts(),
                this.fetchLatestPublications()
            ]);
            
            console.log('✅ Initial FCA data fetch completed');
        } catch (error) {
            console.error('❌ Initial data fetch failed:', error);
        }
    }

    // Check rate limiting
    async checkRateLimit() {
        const now = Date.now();
        const requests = this.rateLimiter.get('requests');
        const windowStart = now - (this.config.rateLimit.windowHours * 60 * 60 * 1000);
        
        // Filter requests within current window
        const recentRequests = requests.filter(timestamp => timestamp > windowStart);
        
        if (recentRequests.length >= this.config.rateLimit.maxRequests) {
            const oldestRequest = Math.min(...recentRequests);
            const waitTime = oldestRequest + (this.config.rateLimit.windowHours * 60 * 60 * 1000) - now;
            
            throw new Error(`Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)} seconds.`);
        }
        
        // Update rate limiter
        recentRequests.push(now);
        this.rateLimiter.set('requests', recentRequests);
        
        return true;
    }

    // Make HTTP request with retry logic
    async makeRequest(method, url, data = null, options = {}) {
        await this.checkRateLimit();
        
        const requestConfig = {
            method,
            headers: {
                ...this.apiConfig.headers,
                'User-Agent': this.apiConfig.userAgent
            },
            timeout: options.timeout || this.apiConfig.timeout,
            ...options
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            requestConfig.body = JSON.stringify(data);
            requestConfig.headers['Content-Type'] = 'application/json';
        }

        let lastError;
        
        for (let attempt = 0; attempt <= this.config.retryPolicy.maxRetries; attempt++) {
            try {
                const response = await fetch(url, requestConfig);
                
                // Log API call
                this.logAPICall(method, url, response.status, attempt);
                
                if (!response.ok && !options.validateStatus) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return response;
                
            } catch (error) {
                lastError = error;
                
                if (attempt < this.config.retryPolicy.maxRetries) {
                    const backoffTime = this.config.retryPolicy.backoffMs * 
                        Math.pow(this.config.retryPolicy.backoffMultiplier, attempt);
                    
                    console.warn(`🔄 Retrying FCA API request (${attempt + 1}/${this.config.retryPolicy.maxRetries}) in ${backoffTime}ms`);
                    await this.sleep(backoffTime);
                } else {
                    console.error('❌ FCA API request failed after all retries:', error);
                }
            }
        }
        
        throw lastError;
    }

    // Fetch consumer alerts from FCA
    async fetchConsumerAlerts() {
        console.log('🚨 Fetching FCA consumer alerts...');
        
        try {
            const cacheKey = 'consumer-alerts';
            const cached = this.getFromCache(cacheKey);
            
            if (cached) {
                console.log('📋 Using cached consumer alerts');
                return cached;
            }

            // Scrape consumer warnings page
            const response = await this.makeRequest('GET', 
                `${this.config.baseURL}${this.endpoints.consumerAlerts}`);
            
            const html = await response.text();
            const alerts = await this.parseConsumerAlerts(html);
            
            // Cache the results
            this.setCache(cacheKey, alerts, this.config.cache.alertTTL);
            
            // Process new alerts
            await this.processNewAlerts(alerts, 'consumer');
            
            console.log(`✅ Fetched ${alerts.length} consumer alerts`);
            return alerts;
            
        } catch (error) {
            console.error('❌ Failed to fetch consumer alerts:', error);
            return [];
        }
    }

    // Parse consumer alerts from HTML
    async parseConsumerAlerts(html) {
        const alerts = [];
        
        try {
            // Extract alert information from HTML
            // This is a simplified parser - in production, you'd use a proper DOM parser
            const alertPattern = /<div[^>]*class="[^"]*warning[^"]*"[^>]*>(.*?)<\/div>/gis;
            const matches = html.matchAll(alertPattern);
            
            for (const match of matches) {
                const alertHtml = match[1];
                
                // Extract title
                const titleMatch = alertHtml.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/is);
                const title = titleMatch ? this.stripHTML(titleMatch[1]).trim() : '';
                
                // Extract description
                const descMatch = alertHtml.match(/<p[^>]*>(.*?)<\/p>/is);
                const description = descMatch ? this.stripHTML(descMatch[1]).trim() : '';
                
                // Extract date
                const dateMatch = alertHtml.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
                const publishedDate = dateMatch ? new Date(`${dateMatch[2]} ${dateMatch[1]}, ${dateMatch[3]}`).toISOString() : new Date().toISOString();
                
                if (title && description) {
                    alerts.push({
                        id: this.generateAlertId('consumer', title),
                        type: 'consumer_warning',
                        category: 'consumer_protection',
                        title: title,
                        description: description,
                        severity: this.determineSeverity(title, description),
                        published_date: publishedDate,
                        source: 'FCA Consumer Warnings',
                        url: `${this.config.baseURL}${this.endpoints.consumerAlerts}`,
                        metadata: {
                            fetched_at: new Date().toISOString(),
                            source_type: 'html_scrape'
                        }
                    });
                }
            }
            
        } catch (error) {
            console.error('❌ Error parsing consumer alerts:', error);
        }
        
        return alerts;
    }

    // Fetch scam alerts
    async fetchScamAlerts() {
        console.log('🔍 Fetching FCA scam alerts...');
        
        try {
            const cacheKey = 'scam-alerts';
            const cached = this.getFromCache(cacheKey);
            
            if (cached) {
                console.log('📋 Using cached scam alerts');
                return cached;
            }

            const response = await this.makeRequest('GET', 
                `${this.config.baseURL}${this.endpoints.scamAlerts}`);
            
            const html = await response.text();
            const alerts = await this.parseScamAlerts(html);
            
            this.setCache(cacheKey, alerts, this.config.cache.alertTTL);
            await this.processNewAlerts(alerts, 'scam');
            
            console.log(`✅ Fetched ${alerts.length} scam alerts`);
            return alerts;
            
        } catch (error) {
            console.error('❌ Failed to fetch scam alerts:', error);
            return [];
        }
    }

    // Parse scam alerts from HTML
    async parseScamAlerts(html) {
        const alerts = [];
        
        try {
            // Extract scam warnings
            const scamPattern = /<div[^>]*class="[^"]*scam[^"]*"[^>]*>(.*?)<\/div>/gis;
            const matches = html.matchAll(scamPattern);
            
            for (const match of matches) {
                const alertHtml = match[1];
                
                const titleMatch = alertHtml.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/is);
                const title = titleMatch ? this.stripHTML(titleMatch[1]).trim() : '';
                
                const descMatch = alertHtml.match(/<p[^>]*>(.*?)<\/p>/is);
                const description = descMatch ? this.stripHTML(descMatch[1]).trim() : '';
                
                if (title && description) {
                    alerts.push({
                        id: this.generateAlertId('scam', title),
                        type: 'scam_warning',
                        category: 'fraud_prevention',
                        title: title,
                        description: description,
                        severity: 'high', // Scam alerts are always high priority
                        published_date: new Date().toISOString(),
                        source: 'FCA ScamSmart',
                        url: `${this.config.baseURL}${this.endpoints.scamAlerts}`,
                        metadata: {
                            fetched_at: new Date().toISOString(),
                            source_type: 'html_scrape'
                        }
                    });
                }
            }
            
        } catch (error) {
            console.error('❌ Error parsing scam alerts:', error);
        }
        
        return alerts;
    }

    // Fetch latest publications
    async fetchLatestPublications() {
        console.log('📚 Fetching FCA publications...');
        
        try {
            const cacheKey = 'publications';
            const cached = this.getFromCache(cacheKey);
            
            if (cached) {
                console.log('📋 Using cached publications');
                return cached;
            }

            const response = await this.makeRequest('GET', 
                `${this.config.baseURL}${this.endpoints.publications}`);
            
            const html = await response.text();
            const publications = await this.parsePublications(html);
            
            this.setCache(cacheKey, publications, this.config.cache.publicationTTL);
            await this.processNewAlerts(publications, 'publication');
            
            console.log(`✅ Fetched ${publications.length} publications`);
            return publications;
            
        } catch (error) {
            console.error('❌ Failed to fetch publications:', error);
            return [];
        }
    }

    // Parse publications from HTML
    async parsePublications(html) {
        const publications = [];
        
        try {
            // Extract publication information
            const pubPattern = /<article[^>]*>(.*?)<\/article>/gis;
            const matches = html.matchAll(pubPattern);
            
            for (const match of matches) {
                const pubHtml = match[1];
                
                const titleMatch = pubHtml.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/is);
                const title = titleMatch ? this.stripHTML(titleMatch[1]).trim() : '';
                
                const descMatch = pubHtml.match(/<p[^>]*class="[^"]*summary[^"]*"[^>]*>(.*?)<\/p>/is);
                const description = descMatch ? this.stripHTML(descMatch[1]).trim() : '';
                
                const linkMatch = pubHtml.match(/<a[^>]*href="([^"]*)"[^>]*>/is);
                const link = linkMatch ? linkMatch[1] : '';
                
                const dateMatch = pubHtml.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
                const publishedDate = dateMatch ? new Date(`${dateMatch[2]} ${dateMatch[1]}, ${dateMatch[3]}`).toISOString() : new Date().toISOString();
                
                if (title) {
                    publications.push({
                        id: this.generateAlertId('publication', title),
                        type: 'regulatory_publication',
                        category: 'policy_update',
                        title: title,
                        description: description || 'No description available',
                        severity: this.determineSeverity(title, description),
                        published_date: publishedDate,
                        source: 'FCA Publications',
                        url: link.startsWith('http') ? link : `${this.config.baseURL}${link}`,
                        metadata: {
                            fetched_at: new Date().toISOString(),
                            source_type: 'html_scrape'
                        }
                    });
                }
            }
            
        } catch (error) {
            console.error('❌ Error parsing publications:', error);
        }
        
        return publications;
    }

    // Check firm authorization status
    async checkFirmAuthorization(firmName, firmNumber = null) {
        console.log(`🔍 Checking authorization for firm: ${firmName}`);
        
        try {
            const cacheKey = `firm-${firmNumber || firmName}`;
            const cached = this.getFromCache(cacheKey);
            
            if (cached) {
                console.log('📋 Using cached firm data');
                return cached;
            }

            let searchQuery;
            if (firmNumber) {
                searchQuery = `Number=${firmNumber}`;
            } else {
                searchQuery = `Name=${encodeURIComponent(firmName)}`;
            }

            const response = await this.makeRequest('GET', 
                `${this.config.registerURL}/Firms?${searchQuery}&format=json`);
            
            if (!response.ok) {
                throw new Error(`Register API returned: ${response.status}`);
            }

            const data = await response.json();
            const result = {
                firm_name: firmName,
                firm_number: firmNumber,
                authorized: false,
                status: 'unknown',
                permissions: [],
                last_checked: new Date().toISOString(),
                raw_data: data
            };

            if (data && data.length > 0) {
                const firm = data[0];
                result.authorized = firm.Status === 'Authorised';
                result.status = firm.Status || 'unknown';
                result.firm_number = firm.FirmReferenceNumber;
                result.permissions = firm.Permissions || [];
            }

            this.setCache(cacheKey, result, this.config.cache.registerTTL);
            
            console.log(`✅ Firm authorization check completed: ${result.authorized ? 'Authorized' : 'Not authorized'}`);
            return result;
            
        } catch (error) {
            console.error('❌ Failed to check firm authorization:', error);
            return {
                firm_name: firmName,
                firm_number: firmNumber,
                authorized: false,
                status: 'error',
                error: error.message,
                last_checked: new Date().toISOString()
            };
        }
    }

    // Process new alerts
    async processNewAlerts(alerts, type) {
        if (!Array.isArray(alerts) || alerts.length === 0) {
            return;
        }

        for (const alert of alerts) {
            try {
                // Check if this is a new alert
                if (await this.isNewAlert(alert.id)) {
                    console.log(`🆕 Processing new ${type} alert: ${alert.title}`);
                    
                    // Classify the alert
                    alert.classification = await this.classifyAlert(alert);
                    
                    // Trigger alert system
                    if (window.regulatoryAlerts) {
                        const alertId = window.regulatoryAlerts.createAlert({
                            title: alert.title,
                            summary: alert.description,
                            regulator: 'FCA',
                            type: alert.type,
                            impact: alert.severity,
                            detected_at: alert.published_date,
                            url: alert.url,
                            keywords: alert.classification.keywords || []
                        }, alert.severity);
                        
                        console.log(`📨 Created regulatory alert: ${alertId}`);
                    }
                    
                    // Store alert history
                    await this.storeAlertHistory(alert);
                    
                    // Emit event for other systems
                    this.emitAlertEvent('new-fca-alert', alert);
                }
                
            } catch (error) {
                console.error(`❌ Error processing alert ${alert.id}:`, error);
            }
        }
    }

    // Classify alert based on content
    async classifyAlert(alert) {
        const classification = {
            keywords: [],
            urgency: 'medium',
            categories: [],
            risk_level: 'medium'
        };

        const title = alert.title.toLowerCase();
        const description = alert.description.toLowerCase();
        const content = `${title} ${description}`;

        // Extract keywords
        const keywordPatterns = {
            'scam': /scam|fraud|fake|bogus|unauthorised|unauthorized/i,
            'investment': /investment|trading|forex|crypto|bitcoin|shares/i,
            'banking': /bank|account|payment|transfer|card/i,
            'insurance': /insurance|claim|policy|premium/i,
            'pension': /pension|retirement|sipp|ssas/i,
            'consumer_duty': /consumer duty|consumer protection|fair treatment/i,
            'aml': /money laundering|aml|sanctions|financial crime/i,
            'capital': /capital|buffer|ratio|leverage|liquidity/i
        };

        for (const [keyword, pattern] of Object.entries(keywordPatterns)) {
            if (pattern.test(content)) {
                classification.keywords.push(keyword);
            }
        }

        // Determine urgency
        if (content.includes('urgent') || content.includes('immediate') || 
            content.includes('critical') || alert.type === 'scam_warning') {
            classification.urgency = 'high';
        }

        // Determine categories
        if (classification.keywords.includes('scam')) {
            classification.categories.push('fraud_prevention');
            classification.risk_level = 'high';
        }
        if (classification.keywords.includes('consumer_duty')) {
            classification.categories.push('consumer_protection');
        }
        if (classification.keywords.includes('aml')) {
            classification.categories.push('financial_crime');
            classification.risk_level = 'high';
        }

        return classification;
    }

    // Check if alert is new
    async isNewAlert(alertId) {
        // Check in local storage or cache
        const processedAlerts = this.getFromCache('processed-alerts') || new Set();
        
        if (processedAlerts.has(alertId)) {
            return false;
        }
        
        // Add to processed alerts
        processedAlerts.add(alertId);
        this.setCache('processed-alerts', processedAlerts, 7 * 24 * 60 * 60 * 1000); // 7 days
        
        return true;
    }

    // Store alert history
    async storeAlertHistory(alert) {
        const history = this.getFromCache('alert-history') || [];
        
        history.unshift({
            ...alert,
            stored_at: new Date().toISOString()
        });
        
        // Keep only last 1000 alerts
        if (history.length > 1000) {
            history.splice(1000);
        }
        
        this.setCache('alert-history', history, 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    // Emit alert event
    emitAlertEvent(eventName, data) {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            const event = new CustomEvent(eventName, { detail: data });
            window.dispatchEvent(event);
        }
    }

    // Utility methods
    generateAlertId(type, title) {
        const hash = this.simpleHash(`${type}-${title}`);
        return `fca-${type}-${hash}`;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    determineSeverity(title, description) {
        const content = `${title} ${description}`.toLowerCase();
        
        if (content.includes('critical') || content.includes('urgent') || 
            content.includes('immediate') || content.includes('scam')) {
            return 'critical';
        } else if (content.includes('important') || content.includes('warning') ||
                   content.includes('risk')) {
            return 'high';
        } else if (content.includes('update') || content.includes('change')) {
            return 'medium';
        }
        
        return 'low';
    }

    // Cache management
    setCache(key, value, ttl) {
        this.cache.set(key, {
            value: value,
            expires: Date.now() + ttl,
            created: Date.now()
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            return null;
        }
        
        if (Date.now() > cached.expires) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.value;
    }

    cleanupExpiredCache() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, cached] of this.cache.entries()) {
            if (now > cached.expires) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
        }
    }

    cleanupRateLimitRecords() {
        const now = Date.now();
        const windowStart = now - (this.config.rateLimit.windowHours * 60 * 60 * 1000);
        const requests = this.rateLimiter.get('requests') || [];
        
        const recentRequests = requests.filter(timestamp => timestamp > windowStart);
        this.rateLimiter.set('requests', recentRequests);
    }

    // Logging
    logAPICall(method, url, status, attempt) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: method,
            url: url,
            status: status,
            attempt: attempt + 1,
            user_agent: this.apiConfig.userAgent
        };
        
        this.apiCallLog.push(logEntry);
        
        // Keep only last 1000 log entries
        if (this.apiCallLog.length > 1000) {
            this.apiCallLog.shift();
        }
        
        // Log to console for debugging
        console.log(`📊 FCA API: ${method} ${url} → ${status} (attempt ${attempt + 1})`);
    }

    // Get API statistics
    getAPIStats() {
        const now = Date.now();
        const last24h = now - (24 * 60 * 60 * 1000);
        
        const recentLogs = this.apiCallLog.filter(log => 
            new Date(log.timestamp).getTime() > last24h);
        
        const stats = {
            total_calls_24h: recentLogs.length,
            success_rate: 0,
            rate_limit_remaining: 0,
            cache_hit_rate: 0,
            average_response_time: 0
        };
        
        if (recentLogs.length > 0) {
            const successful = recentLogs.filter(log => log.status >= 200 && log.status < 300);
            stats.success_rate = (successful.length / recentLogs.length) * 100;
        }
        
        const requests = this.rateLimiter.get('requests') || [];
        stats.rate_limit_remaining = Math.max(0, 
            this.config.rateLimit.maxRequests - requests.length);
        
        return stats;
    }

    // Utility function for delays
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API methods
    async getActiveAlerts() {
        const consumerAlerts = await this.fetchConsumerAlerts();
        const scamAlerts = await this.fetchScamAlerts();
        
        return [...consumerAlerts, ...scamAlerts]
            .sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
    }

    async getAlertHistory(days = 7) {
        const history = this.getFromCache('alert-history') || [];
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        
        return history.filter(alert => 
            new Date(alert.published_date) >= cutoff);
    }

    async searchFirms(query) {
        return await this.checkFirmAuthorization(query);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FCAIntegration;
} else if (typeof window !== 'undefined') {
    window.FCAIntegration = FCAIntegration;
}

console.log('🏛️ FCA API Integration module loaded');