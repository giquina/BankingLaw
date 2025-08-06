/**
 * Gov.UK API Integration System
 * Educational Platform for Government Guidance and Updates
 * 
 * Features:
 * - Real-time government guidance fetching
 * - Tax and legal information updates
 * - News and policy change notifications
 * - Educational content transformation
 * - Multi-department data aggregation
 */

class GovUKIntegration {
    constructor(config = {}) {
        this.config = {
            baseURL: 'https://www.gov.uk',
            apiURL: 'https://www.gov.uk/api/content',
            searchURL: 'https://www.gov.uk/api/search.json',
            rateLimit: {
                maxRequests: 1000,
                windowHours: 1
            },
            cache: config.cache || null,
            logger: config.logger || console,
            monitoring: config.monitoring || null,
            ...config
        };

        this.cache = this.config.cache;
        this.logger = this.config.logger;
        this.monitoring = this.config.monitoring;
        this.initialized = false;
    }

    /**
     * Initialize Gov.UK integration
     */
    async initialize() {
        try {
            this.logger.info('🏛️ Initializing Gov.UK API Integration...');
            
            await this.validateConnection();
            this.setupEndpoints();
            
            this.initialized = true;
            this.logger.info('✅ Gov.UK API Integration initialized successfully');
            
        } catch (error) {
            this.logger.error('❌ Gov.UK API Integration initialization failed:', error);
            throw error;
        }
    }

    /**
     * Validate connection to Gov.UK endpoints
     */
    async validateConnection() {
        const testEndpoints = [
            { name: 'Content API', url: `${this.apiURL}/browse` },
            { name: 'Search API', url: `${this.searchURL}?q=test` }
        ];

        for (const endpoint of testEndpoints) {
            try {
                const response = await this.makeRequest('GET', endpoint.url);
                if (response.ok) {
                    this.logger.info(`✅ ${endpoint.name} accessible`);
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                this.logger.warn(`⚠️ ${endpoint.name} validation failed:`, error.message);
                // Continue - some endpoints may be temporarily unavailable
            }
        }
    }

    /**
     * Setup API endpoints
     */
    setupEndpoints() {
        this.endpoints = {
            browse: '/browse',
            guidance: '/guidance',
            organisations: '/government/organisations',
            publications: '/government/publications.json',
            news: '/government/news.json',
            announcements: '/government/announcements.json',
            statistics: '/government/statistics.json',
            search: '/api/search.json',
            
            // Specific areas of interest for educational platform
            tax: '/browse/tax',
            benefits: '/browse/benefits',
            employment: '/browse/employing-people',
            business: '/browse/business',
            consumer: '/browse/consumer',
            housing: '/browse/housing-local-services',
            money: '/browse/tax/dealing-with-hmrc'
        };

        this.logger.info('📋 Gov.UK API endpoints configured');
    }

    /**
     * Get guidance on specific topics
     */
    async getGuidance(topic, options = {}) {
        this.logger.info(`🔍 Fetching Gov.UK guidance for topic: ${topic}`);
        
        try {
            const cacheKey = `govuk:guidance:${topic}`;
            
            // Check cache first
            if (this.cache) {
                const cached = await this.cache.get(cacheKey);
                if (cached) {
                    this.logger.info('📋 Using cached guidance data');
                    return cached;
                }
            }

            let guidanceData;
            
            // Try direct endpoint first
            if (this.endpoints[topic]) {
                guidanceData = await this.fetchTopicGuidance(this.endpoints[topic], topic);
            } else {
                // Fall back to search
                guidanceData = await this.searchGuidance(topic, options);
            }

            // Transform for educational use
            const educational = this.transformGuidanceForEducation(guidanceData, topic);
            
            // Cache results
            if (this.cache) {
                await this.cache.set(cacheKey, educational, 3600); // 1 hour
            }

            this.logger.info(`✅ Fetched guidance for ${topic}`);
            return educational;
            
        } catch (error) {
            this.logger.error(`❌ Failed to fetch guidance for ${topic}:`, error);
            return this.getFallbackGuidance(topic);
        }
    }

    /**
     * Fetch topic-specific guidance
     */
    async fetchTopicGuidance(endpoint, topic) {
        const response = await this.makeRequest('GET', `${this.apiURL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${topic} guidance: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract relevant guidance content
        const guidance = {
            title: data.title || `${topic} guidance`,
            description: data.description || '',
            content: data.details?.body || data.details?.parts || [],
            links: this.extractLinks(data),
            lastUpdated: data.updated_at || data.public_updated_at,
            organisations: data.organisations || [],
            format: data.document_type,
            url: `${this.config.baseURL}${data.base_path || endpoint}`
        };

        // If content is limited, try to get more detailed information
        if (!guidance.content.length && data.details?.parts) {
            guidance.content = data.details.parts;
        }

        return guidance;
    }

    /**
     * Search for guidance using Gov.UK search API
     */
    async searchGuidance(topic, options = {}) {
        const searchParams = new URLSearchParams({
            q: topic,
            count: options.limit || 20,
            start: options.offset || 0,
            order: options.order || 'relevance',
            filter_format: 'guidance'
        });

        const response = await this.makeRequest('GET', `${this.searchURL}?${searchParams}`);
        
        if (!response.ok) {
            throw new Error(`Search failed: ${response.status}`);
        }

        const searchResults = await response.json();
        
        return {
            title: `${topic} guidance`,
            description: `Search results for ${topic} guidance`,
            content: searchResults.results || [],
            totalResults: searchResults.total,
            searchQuery: topic,
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Get latest government news
     */
    async getLatestNews(options = {}) {
        this.logger.info('📰 Fetching latest government news...');
        
        try {
            const cacheKey = 'govuk:news:latest';
            
            if (this.cache) {
                const cached = await this.cache.get(cacheKey);
                if (cached) {
                    this.logger.info('📋 Using cached news data');
                    return cached;
                }
            }

            const departments = options.departments || [
                'hm-revenue-customs',
                'department-for-work-pensions',
                'hm-treasury',
                'department-for-business-and-trade'
            ];

            const newsData = await this.fetchDepartmentNews(departments, options);
            const educational = this.transformNewsForEducation(newsData);
            
            if (this.cache) {
                await this.cache.set(cacheKey, educational, 1800); // 30 minutes
            }

            this.logger.info(`✅ Fetched ${educational.articles.length} news articles`);
            return educational;
            
        } catch (error) {
            this.logger.error('❌ Failed to fetch news:', error);
            return this.getFallbackNews();
        }
    }

    /**
     * Fetch news from specific departments
     */
    async fetchDepartmentNews(departments, options = {}) {
        const newsPromises = departments.map(async (dept) => {
            try {
                const params = new URLSearchParams({
                    departments: dept,
                    per_page: options.perDepartment || 5
                });

                const response = await this.makeRequest('GET', `${this.config.baseURL}${this.endpoints.news}?${params}`);
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        department: dept,
                        articles: data.results || []
                    };
                }
            } catch (error) {
                this.logger.warn(`Failed to fetch news from ${dept}:`, error.message);
            }
            return { department: dept, articles: [] };
        });

        const results = await Promise.allSettled(newsPromises);
        const news = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value)
            .filter(dept => dept.articles.length > 0);

        return news;
    }

    /**
     * Get government publications
     */
    async getPublications(options = {}) {
        this.logger.info('📚 Fetching government publications...');
        
        try {
            const cacheKey = `govuk:publications:${JSON.stringify(options)}`;
            
            if (this.cache) {
                const cached = await this.cache.get(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            const params = new URLSearchParams({
                per_page: options.limit || 20,
                page: options.page || 1
            });

            if (options.departments) {
                params.append('departments[]', options.departments.join(','));
            }
            if (options.publication_type) {
                params.append('publication_filter_option', options.publication_type);
            }

            const response = await this.makeRequest('GET', `${this.config.baseURL}${this.endpoints.publications}?${params}`);
            
            if (!response.ok) {
                throw new Error(`Publications API returned: ${response.status}`);
            }

            const data = await response.json();
            const educational = this.transformPublicationsForEducation(data);
            
            if (this.cache) {
                await this.cache.set(cacheKey, educational, 3600); // 1 hour
            }

            this.logger.info(`✅ Fetched ${educational.publications.length} publications`);
            return educational;
            
        } catch (error) {
            this.logger.error('❌ Failed to fetch publications:', error);
            return this.getFallbackPublications();
        }
    }

    /**
     * Get statistics and data
     */
    async getStatistics(options = {}) {
        this.logger.info('📊 Fetching government statistics...');
        
        try {
            const cacheKey = `govuk:statistics:${JSON.stringify(options)}`;
            
            if (this.cache) {
                const cached = await this.cache.get(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            const params = new URLSearchParams({
                per_page: options.limit || 15,
                page: options.page || 1
            });

            const response = await this.makeRequest('GET', `${this.config.baseURL}${this.endpoints.statistics}?${params}`);
            
            if (!response.ok) {
                throw new Error(`Statistics API returned: ${response.status}`);
            }

            const data = await response.json();
            const educational = this.transformStatisticsForEducation(data);
            
            if (this.cache) {
                await this.cache.set(cacheKey, educational, 7200); // 2 hours
            }

            this.logger.info(`✅ Fetched ${educational.statistics.length} statistical releases`);
            return educational;
            
        } catch (error) {
            this.logger.error('❌ Failed to fetch statistics:', error);
            return this.getFallbackStatistics();
        }
    }

    /**
     * Search government content
     */
    async search(query, options = {}) {
        this.logger.info(`🔍 Searching Gov.UK for: ${query}`);
        
        try {
            const params = new URLSearchParams({
                q: query,
                count: options.limit || 20,
                start: options.offset || 0,
                order: options.order || 'relevance'
            });

            if (options.filter_format) {
                params.append('filter_format', options.filter_format);
            }
            if (options.filter_organisations) {
                params.append('filter_organisations[]', options.filter_organisations.join(','));
            }

            const response = await this.makeRequest('GET', `${this.searchURL}?${params}`);
            
            if (!response.ok) {
                throw new Error(`Search API returned: ${response.status}`);
            }

            const data = await response.json();
            return this.transformSearchForEducation(data, query);
            
        } catch (error) {
            this.logger.error(`❌ Search failed for "${query}":`, error);
            return this.getFallbackSearch(query);
        }
    }

    /**
     * Transform guidance content for educational use
     */
    transformGuidanceForEducation(guidance, topic) {
        return {
            topic: topic,
            title: guidance.title,
            summary: this.createEducationalSummary(guidance.description),
            content: this.processContentForEducation(guidance.content),
            keyPoints: this.extractKeyPoints(guidance.content),
            practicalTips: this.extractPracticalTips(guidance.content),
            commonQuestions: this.generateCommonQuestions(guidance.content, topic),
            relatedLinks: guidance.links,
            lastUpdated: guidance.lastUpdated,
            source: {
                name: 'Gov.UK',
                url: guidance.url,
                reliability: 'Official government source'
            },
            learningObjectives: this.generateLearningObjectives(topic),
            nextSteps: this.suggestNextSteps(topic),
            educationalContext: {
                purpose: 'Understanding government guidance and your rights',
                level: 'General public',
                disclaimer: 'This is educational content based on official government guidance. Always check the latest official information for your specific situation.'
            }
        };
    }

    /**
     * Transform news for educational use
     */
    transformNewsForEducation(newsData) {
        const allArticles = newsData.flatMap(dept => 
            dept.articles.map(article => ({
                ...article,
                department: dept.department
            }))
        );

        return {
            summary: `${allArticles.length} recent government announcements affecting your rights and obligations`,
            articles: allArticles.map(article => this.transformArticleForEducation(article)),
            categories: this.categorizeNews(allArticles),
            educationalValue: {
                purpose: 'Stay informed about policy changes that may affect you',
                relevance: 'Current government policies and their implications',
                actionItems: this.extractActionableItems(allArticles)
            },
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Transform single article for education
     */
    transformArticleForEducation(article) {
        return {
            title: article.title,
            summary: article.summary || article.description,
            publishedDate: article.public_timestamp,
            department: article.department,
            whatThisMeans: this.explainArticleImplications(article),
            whoIsAffected: this.identifyAffectedGroups(article),
            whenThisTakesEffect: this.extractEffectiveDate(article),
            whereToGetMoreInfo: article.url,
            educationalPoints: this.extractEducationalPoints(article)
        };
    }

    /**
     * Process content for educational presentation
     */
    processContentForEducation(content) {
        if (!content || !Array.isArray(content)) {
            return [];
        }

        return content.map(section => {
            if (typeof section === 'string') {
                return {
                    type: 'text',
                    content: this.simplifyLanguage(section),
                    keyTerms: this.extractKeyTerms(section)
                };
            } else if (section.title && section.contents) {
                return {
                    type: 'section',
                    title: section.title,
                    content: this.simplifyLanguage(section.contents),
                    keyTerms: this.extractKeyTerms(section.contents)
                };
            }
            return section;
        });
    }

    /**
     * Create educational summary
     */
    createEducationalSummary(description) {
        if (!description) return '';
        
        return {
            brief: description.split('.')[0] + '.',
            detailed: description,
            keyTakeaway: this.extractKeyTakeaway(description),
            readingTime: Math.ceil(description.split(' ').length / 200) + ' minutes'
        };
    }

    /**
     * Extract key points from content
     */
    extractKeyPoints(content) {
        const keyPoints = [];
        
        if (Array.isArray(content)) {
            content.forEach(item => {
                if (typeof item === 'string' && item.includes('must') || item.includes('should') || item.includes('required')) {
                    keyPoints.push(item.split('.')[0] + '.');
                }
            });
        }
        
        return keyPoints.slice(0, 5); // Top 5 key points
    }

    /**
     * Make HTTP request with error handling
     */
    async makeRequest(method, url, options = {}) {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'User-Agent': 'JuriBank-Educational-Platform/3.0 (+https://banking-law.vercel.app)',
                    'Accept': 'application/json',
                    ...options.headers
                },
                timeout: options.timeout || 30000
            });

            // Log API call if monitoring is available
            if (this.monitoring) {
                await this.monitoring.recordAPICall({
                    module: 'govuk',
                    method: method,
                    url: url,
                    status: response.status,
                    responseTime: Date.now() - (options.startTime || Date.now()),
                    success: response.ok
                });
            }

            return response;
            
        } catch (error) {
            this.logger.error('Gov.UK API request failed:', {
                method,
                url,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Fallback methods for when APIs fail
     */
    getFallbackGuidance(topic) {
        return {
            topic: topic,
            title: `${topic} guidance currently unavailable`,
            summary: {
                brief: 'Unable to fetch current guidance from Gov.UK',
                detailed: 'The guidance service is temporarily unavailable. Please visit gov.uk directly for the latest information.',
                keyTakeaway: 'Check official government sources for current information'
            },
            fallback: true,
            source: {
                name: 'Gov.UK',
                url: `${this.config.baseURL}/browse/${topic}`,
                reliability: 'Official government source (direct access recommended)'
            },
            educationalContext: {
                purpose: 'Understanding government guidance and your rights',
                level: 'General public',
                disclaimer: 'This service is temporarily unavailable. Please visit gov.uk directly.'
            }
        };
    }

    getFallbackNews() {
        return {
            summary: 'Government news currently unavailable',
            articles: [],
            fallback: true,
            message: 'Unable to fetch current government news. Please visit gov.uk/government/news for the latest updates.',
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Get health status
     */
    async getHealthStatus() {
        try {
            const testUrl = `${this.apiURL}/browse`;
            const response = await this.makeRequest('GET', testUrl);
            
            return {
                status: response.ok ? 'healthy' : 'degraded',
                lastCheck: new Date().toISOString(),
                responseTime: response.headers.get('x-response-time') || 'unknown'
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                lastCheck: new Date().toISOString()
            };
        }
    }

    /**
     * Helper methods
     */
    extractLinks(data) {
        const links = [];
        
        if (data.details?.external_related_links) {
            links.push(...data.details.external_related_links);
        }
        if (data.links?.related) {
            links.push(...data.links.related);
        }
        
        return links;
    }

    simplifyLanguage(text) {
        if (!text) return text;
        
        // Replace complex terms with simpler alternatives
        const replacements = {
            'pursuant to': 'according to',
            'notwithstanding': 'despite',
            'hereafter': 'from now on',
            'aforementioned': 'mentioned above',
            'whereby': 'where',
            'thereof': 'of it'
        };

        let simplified = text;
        for (const [complex, simple] of Object.entries(replacements)) {
            simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
        }
        
        return simplified;
    }

    extractKeyTerms(text) {
        if (!text) return [];
        
        // Extract terms that appear to be important (capitalized, repeated, etc.)
        const terms = new Set();
        const words = text.split(/\s+/);
        
        words.forEach(word => {
            // Clean the word
            const clean = word.replace(/[^\w]/g, '').toLowerCase();
            
            // Add if it's capitalized (proper noun) or appears multiple times
            if ((word[0] === word[0].toUpperCase() && clean.length > 3) ||
                (words.filter(w => w.toLowerCase().includes(clean)).length > 1 && clean.length > 4)) {
                terms.add(clean);
            }
        });
        
        return Array.from(terms).slice(0, 10);
    }
}

module.exports = GovUKIntegration;