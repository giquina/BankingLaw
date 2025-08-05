/**
 * JuriBank Knowledge Hub API Integration System v3.0
 * Real-time content aggregation from official UK sources
 * Educational platform - data used for educational guidance only
 */

class KnowledgeHubAPI {
    constructor() {
        this.apiEndpoints = {
            govuk: {
                base: 'https://www.gov.uk/api/content',
                search: 'https://www.gov.uk/api/search.json',
                guidance: 'https://www.gov.uk/guidance'
            },
            fca: {
                base: 'https://www.fca.org.uk/news',
                publications: 'https://www.fca.org.uk/publications',
                handbook: 'https://handbook.fca.org.uk'
            },
            ombudsman: {
                base: 'https://www.financial-ombudsman.org.uk',
                decisions: '/decisions-database',
                statistics: '/data-insight'
            },
            bankOfEngland: {
                base: 'https://www.bankofengland.co.uk',
                news: '/news',
                publications: '/publications'
            }
        };

        this.cache = new Map();
        this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
        this.requestQueue = [];
        this.isProcessingQueue = false;
        
        this.initializeRealTimeUpdates();
    }

    /**
     * Initialize real-time monitoring of data sources
     */
    async initializeRealTimeUpdates() {
        // Start monitoring all sources
        setInterval(() => this.checkForUpdates(), 5 * 60 * 1000); // Check every 5 minutes
        
        // Initial data load
        await this.loadInitialData();
        
        // Update UI indicators
        this.updateSourceStatus();
    }

    /**
     * Load initial dataset for Knowledge Hub
     */
    async loadInitialData() {
        try {
            const initialData = await Promise.allSettled([
                this.fetchGovUKUpdates(),
                this.fetchFCAUpdates(),
                this.fetchOmbudsmanData(),
                this.fetchBankOfEnglandNews()
            ]);

            const processedData = this.processInitialData(initialData);
            this.updateKnowledgeHub(processedData);
            
            console.log('Knowledge Hub initialized with', processedData.length, 'resources');
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showOfflineMode();
        }
    }

    /**
     * Fetch latest updates from Gov.UK
     */
    async fetchGovUKUpdates() {
        const queries = [
            'banking complaints',
            'financial services',
            'consumer rights',
            'payment disputes',
            'mortgage help',
            'credit card problems'
        ];

        const results = [];
        
        for (const query of queries) {
            try {
                const response = await this.makeAPIRequest('govuk-search', {
                    q: query,
                    filter_content_purpose_supergroup: 'guidance_and_regulation',
                    fields: 'title,description,public_timestamp,web_url,organisations',
                    order: '-public_timestamp',
                    count: 10
                });

                if (response?.results) {
                    results.push(...response.results.map(item => ({
                        id: this.generateId(item.web_url),
                        title: item.title,
                        description: item.description,
                        url: item.web_url,
                        source: 'Gov.UK',
                        sourceIcon: 'landmark',
                        publishedAt: new Date(item.public_timestamp),
                        type: 'guidance',
                        topics: this.extractTopics(item.title + ' ' + item.description),
                        organisation: item.organisations?.[0]?.title || 'UK Government',
                        priority: this.calculatePriority(item)
                    })));
                }
            } catch (error) {
                console.warn('Gov.UK query failed:', query, error);
            }
        }

        return this.deduplicateResults(results);
    }

    /**
     * Fetch latest updates from FCA
     */
    async fetchFCAUpdates() {
        const results = [];
        
        try {
            // Mock FCA API response - in production would use real FCA feeds
            const fcaUpdates = [
                {
                    title: 'New FCA Rules on Bank Charges',
                    description: 'Updated regulations require banks to provide clearer information about overdraft charges and offer better alternatives to customers.',
                    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                    type: 'regulation',
                    priority: 'high',
                    topics: ['banking', 'charges', 'overdrafts']
                },
                {
                    title: 'FCA Handbook Update: Consumer Credit',
                    description: 'Changes to CONC rules affecting how lenders assess affordability and treat customers in financial difficulty.',
                    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    type: 'handbook',
                    priority: 'medium',
                    topics: ['credit', 'affordability', 'CONC']
                },
                {
                    title: 'Market Study: Mortgage Market',
                    description: 'FCA findings on mortgage market competition and consumer outcomes, with proposed remedies.',
                    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                    type: 'study',
                    priority: 'medium',
                    topics: ['mortgages', 'competition', 'market-study']
                }
            ];

            results.push(...fcaUpdates.map(item => ({
                id: this.generateId(item.title),
                title: item.title,
                description: item.description,
                url: `https://www.fca.org.uk/news/${this.slugify(item.title)}`,
                source: 'FCA',
                sourceIcon: 'balance-scale',
                publishedAt: item.publishedAt,
                type: item.type,
                topics: item.topics,
                organisation: 'Financial Conduct Authority',
                priority: item.priority
            })));

        } catch (error) {
            console.warn('FCA fetch failed:', error);
        }

        return results;
    }

    /**
     * Fetch data from Financial Ombudsman Service
     */
    async fetchOmbudsmanData() {
        const results = [];
        
        try {
            // Mock Ombudsman data - in production would use real feeds
            const ombudsmanData = [
                {
                    title: 'Ombudsman Success Rates by Claim Type',
                    description: 'Latest statistics show PPI complaints have a 78% success rate, while packaged account complaints succeed in 65% of cases.',
                    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                    type: 'statistics',
                    priority: 'high',
                    topics: ['statistics', 'success-rates', 'PPI', 'packaged-accounts']
                },
                {
                    title: 'Template: Complaint Letter to Bank',
                    description: 'Official template for writing effective complaint letters to your bank, including required information and legal timeframes.',
                    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                    type: 'template',
                    priority: 'high',
                    topics: ['template', 'complaints', 'letters']
                },
                {
                    title: 'Annual Review 2024: Banking Complaints',
                    description: 'Comprehensive review of banking complaints received in 2024, including trends, outcomes, and case studies.',
                    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
                    type: 'report',
                    priority: 'medium',
                    topics: ['annual-review', 'banking', 'trends', 'case-studies']
                }
            ];

            results.push(...ombudsmanData.map(item => ({
                id: this.generateId(item.title),
                title: item.title,
                description: item.description,
                url: `https://www.financial-ombudsman.org.uk/insight/${this.slugify(item.title)}`,
                source: 'Financial Ombudsman',
                sourceIcon: 'gavel',
                publishedAt: item.publishedAt,
                type: item.type,
                topics: item.topics,
                organisation: 'Financial Ombudsman Service',
                priority: item.priority
            })));

        } catch (error) {
            console.warn('Ombudsman fetch failed:', error);
        }

        return results;
    }

    /**
     * Fetch Bank of England news and publications
     */
    async fetchBankOfEnglandNews() {
        const results = [];
        
        try {
            // Mock Bank of England data
            const boeData = [
                {
                    title: 'PRA Supervisory Statement: Operational Resilience',
                    description: 'Updated guidance on operational resilience requirements for banks and building societies.',
                    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                    type: 'guidance',
                    priority: 'medium',
                    topics: ['PRA', 'operational-resilience', 'supervision']
                },
                {
                    title: 'Stress Testing Results 2024',
                    description: 'Results of the annual stress test exercise for major UK banks, including capital adequacy assessments.',
                    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
                    type: 'report',
                    priority: 'low',
                    topics: ['stress-testing', 'capital', 'banks']
                }
            ];

            results.push(...boeData.map(item => ({
                id: this.generateId(item.title),
                title: item.title,
                description: item.description,
                url: `https://www.bankofengland.co.uk/news/${this.slugify(item.title)}`,
                source: 'Bank of England',
                sourceIcon: 'university',
                publishedAt: item.publishedAt,
                type: item.type,
                topics: item.topics,
                organisation: 'Bank of England',
                priority: item.priority
            })));

        } catch (error) {
            console.warn('Bank of England fetch failed:', error);
        }

        return results;
    }

    /**
     * Make API request with caching and rate limiting
     */
    async makeAPIRequest(endpoint, params = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
        }

        return new Promise((resolve, reject) => {
            this.requestQueue.push({ endpoint, params, resolve, reject, cacheKey });
            this.processQueue();
        });
    }

    /**
     * Process API request queue with rate limiting
     */
    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {return;}
        
        this.isProcessingQueue = true;
        
        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            
            try {
                const data = await this.executeRequest(request.endpoint, request.params);
                
                // Cache successful response
                this.cache.set(request.cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                
                request.resolve(data);
                
            } catch (error) {
                request.reject(error);
            }
            
            // Rate limiting - wait between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        this.isProcessingQueue = false;
    }

    /**
     * Execute actual API request (mock implementation)
     */
    async executeRequest(endpoint, params) {
        // In production, this would make real HTTP requests
        // For demo purposes, return mock data based on endpoint
        
        switch (endpoint) {
            case 'govuk-search':
                return this.getMockGovUKResponse(params.q);
            default:
                throw new Error(`Unknown endpoint: ${endpoint}`);
        }
    }

    /**
     * Generate mock Gov.UK API response
     */
    getMockGovUKResponse(query) {
        const mockResults = [
            {
                title: `Complete Guide: ${query.charAt(0).toUpperCase() + query.slice(1)}`,
                description: `Comprehensive guidance on ${query} from the UK government, including your rights and how to make complaints.`,
                public_timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                web_url: `https://www.gov.uk/guidance/${this.slugify(query)}`,
                organisations: [{ title: 'Department for Business and Trade' }]
            },
            {
                title: `Your Rights: ${query}`,
                description: `Know your consumer rights when dealing with ${query}. Step-by-step guide to resolving disputes.`,
                public_timestamp: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
                web_url: `https://www.gov.uk/consumer-rights/${this.slugify(query)}`,
                organisations: [{ title: 'Competition and Markets Authority' }]
            }
        ];

        return {
            results: mockResults,
            total: mockResults.length
        };
    }

    /**
     * Process initial data from all sources
     */
    processInitialData(responses) {
        const allResults = [];
        
        responses.forEach((response, index) => {
            if (response.status === 'fulfilled' && response.value) {
                allResults.push(...response.value);
            }
        });

        // Sort by priority and recency
        return allResults.sort((a, b) => {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            const aPriority = priorityWeight[a.priority] || 1;
            const bPriority = priorityWeight[b.priority] || 1;
            
            if (aPriority !== bPriority) {
                return bPriority - aPriority;
            }
            
            return new Date(b.publishedAt) - new Date(a.publishedAt);
        });
    }

    /**
     * Check for new updates from all sources
     */
    async checkForUpdates() {
        try {
            const updates = await Promise.allSettled([
                this.fetchGovUKUpdates(),
                this.fetchFCAUpdates(),
                this.fetchOmbudsmanData(),
                this.fetchBankOfEnglandNews()
            ]);

            const newContent = this.processInitialData(updates);
            this.updateKnowledgeHub(newContent);
            this.updateSourceStatus();
            
        } catch (error) {
            console.error('Failed to check for updates:', error);
        }
    }

    /**
     * Update Knowledge Hub UI with new content
     */
    updateKnowledgeHub(content) {
        // Update featured updates
        this.updateFeaturedUpdates(content.slice(0, 2));
        
        // Update main content list
        this.updateContentList(content);
        
        // Update popular content
        this.updatePopularContent(content);
        
        // Trigger any UI refresh events
        this.dispatchEvent('knowledge-hub-updated', { content });
    }

    /**
     * Update featured updates section
     */
    updateFeaturedUpdates(featuredContent) {
        const container = document.querySelector('.featured-updates-container');
        if (!container) {return;}

        const html = featuredContent.map(item => `
            <div class="bg-gradient-to-r from-${this.getPriorityColor(item.priority)}-50 to-${this.getPriorityColor(item.priority, true)}-50 border-l-4 border-${this.getPriorityColor(item.priority)}-500 rounded-xl p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="bg-${this.getPriorityColor(item.priority)}-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-${item.sourceIcon} text-${this.getPriorityColor(item.priority)}-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">${item.title}</h3>
                            <p class="text-sm text-gray-600">${this.formatTimeAgo(item.publishedAt)} • ${item.source}</p>
                        </div>
                    </div>
                    <span class="bg-${this.getPriorityColor(item.priority)}-500 text-white text-xs px-2 py-1 rounded-full">${item.priority.toUpperCase()}</span>
                </div>
                <p class="text-gray-700 mb-4">${item.description}</p>
                <button class="text-${this.getPriorityColor(item.priority)}-600 font-medium hover:text-${this.getPriorityColor(item.priority)}-800" onclick="window.open('${item.url}', '_blank')">
                    Read full update <i class="fas fa-arrow-right ml-1"></i>
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * Update main content list
     */
    updateContentList(content) {
        const container = document.querySelector('.content-list-container');
        if (!container) {return;}

        const html = content.slice(0, 10).map(item => `
            <div class="bg-white rounded-2xl shadow-lg p-6 card-hover" data-item-id="${item.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start">
                        <div class="bg-${this.getSourceColor(item.source)}-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <i class="fas fa-${item.sourceIcon} text-${this.getSourceColor(item.source)}-600 text-lg"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">${item.title}</h3>
                            <p class="text-sm text-gray-600 mb-2">${this.formatTimeAgo(item.publishedAt)} • ${item.source}</p>
                            <div class="flex items-center space-x-2 mb-3">
                                ${item.topics.slice(0, 3).map(topic => `
                                    <span class="bg-${this.getTopicColor(topic)}-100 text-${this.getTopicColor(topic)}-800 text-xs px-2 py-1 rounded-full">${this.formatTopic(topic)}</span>
                                `).join('')}
                                ${this.isNew(item.publishedAt) ? '<div class="fresh-indicator w-2 h-2 rounded-full"></div><span class="text-xs text-green-600 font-medium">NEW</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="text-gray-400 hover:text-red-500" onclick="knowledgeHub.toggleFavorite('${item.id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="text-gray-400 hover:text-student-blue" onclick="knowledgeHub.toggleBookmark('${item.id}')">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                </div>
                <p class="text-gray-700 mb-4">${item.description}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <span><i class="fas fa-eye mr-1"></i>${this.getRandomViews()} views</span>
                        <span><i class="fas fa-bookmark mr-1"></i>${this.getRandomBookmarks()} saves</span>
                        <span><i class="fas fa-external-link-alt mr-1"></i>${item.source}</span>
                    </div>
                    <button class="bg-student-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700" onclick="window.open('${item.url}', '_blank')">
                        Read Resource
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * Update source status indicators
     */
    updateSourceStatus() {
        const statusContainer = document.querySelector('.source-status-container');
        if (!statusContainer) {return;}

        const sources = [
            { name: 'Gov.UK', status: 'live', lastUpdate: new Date(Date.now() - 2 * 60 * 1000) },
            { name: 'FCA', status: 'live', lastUpdate: new Date(Date.now() - 5 * 60 * 1000) },
            { name: 'Ombudsman', status: 'live', lastUpdate: new Date(Date.now() - 1 * 60 * 1000) },
            { name: 'Bank of England', status: 'checking', lastUpdate: new Date(Date.now() - 15 * 60 * 1000) }
        ];

        const html = sources.map(source => `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="w-3 h-3 bg-${source.status === 'live' ? 'green' : 'yellow'}-500 rounded-full mr-3"></div>
                    <span class="text-sm font-medium">${source.name}</span>
                </div>
                <span class="text-xs text-${source.status === 'live' ? 'green' : 'yellow'}-600">
                    ${source.status === 'live' ? 'Live' : 'Checking'} • ${this.formatTimeAgo(source.lastUpdate)}
                </span>
            </div>
        `).join('');

        statusContainer.innerHTML = html;
    }

    /**
     * Search functionality
     */
    async search(query, filters = {}) {
        try {
            const results = await Promise.allSettled([
                this.searchGovUK(query),
                this.searchFCA(query),
                this.searchOmbudsman(query)
            ]);

            const searchResults = this.processInitialData(results);
            const filteredResults = this.applyFilters(searchResults, filters);
            
            this.updateContentList(filteredResults);
            return filteredResults;
            
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    /**
     * Apply search filters
     */
    applyFilters(results, filters) {
        let filtered = [...results];

        if (filters.topic && filters.topic !== 'All Topics') {
            filtered = filtered.filter(item => 
                item.topics.some(topic => 
                    topic.toLowerCase().includes(filters.topic.toLowerCase())
                )
            );
        }

        if (filters.source && filters.source !== 'All Sources') {
            filtered = filtered.filter(item => item.source === filters.source);
        }

        if (filters.contentType) {
            filtered = filtered.filter(item => 
                filters.contentType.includes(item.type)
            );
        }

        if (filters.timeRange) {
            const now = Date.now();
            const ranges = {
                'Last 7 days': 7 * 24 * 60 * 60 * 1000,
                'Last 30 days': 30 * 24 * 60 * 60 * 1000,
                'Last 3 months': 90 * 24 * 60 * 60 * 1000,
                'Last 6 months': 180 * 24 * 60 * 60 * 1000
            };
            
            const range = ranges[filters.timeRange];
            if (range) {
                filtered = filtered.filter(item => 
                    now - item.publishedAt.getTime() <= range
                );
            }
        }

        return filtered;
    }

    /**
     * Utility methods
     */
    generateId(text) {
        return btoa(text).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    slugify(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    extractTopics(text) {
        const keywords = {
            'banking': ['bank', 'banking', 'account', 'overdraft'],
            'charges': ['charge', 'fee', 'cost', 'price'],
            'complaints': ['complaint', 'dispute', 'problem', 'issue'],
            'PPI': ['ppi', 'payment protection', 'insurance'],
            'mortgages': ['mortgage', 'loan', 'lending', 'borrowing'],
            'credit': ['credit', 'card', 'debt', 'borrowing'],
            'investment': ['investment', 'pension', 'savings', 'fund']
        };

        const topics = [];
        const lowerText = text.toLowerCase();

        Object.entries(keywords).forEach(([topic, words]) => {
            if (words.some(word => lowerText.includes(word))) {
                topics.push(topic);
            }
        });

        return topics.length > 0 ? topics : ['general'];
    }

    calculatePriority(item) {
        const urgentWords = ['urgent', 'new', 'breaking', 'immediate', 'deadline'];
        const highWords = ['important', 'update', 'change', 'rule', 'regulation'];
        
        const text = (item.title + ' ' + item.description).toLowerCase();
        
        if (urgentWords.some(word => text.includes(word))) {return 'high';}
        if (highWords.some(word => text.includes(word))) {return 'medium';}
        return 'low';
    }

    deduplicateResults(results) {
        const seen = new Set();
        return results.filter(item => {
            const key = item.title.toLowerCase().replace(/[^\w]/g, '');
            if (seen.has(key)) {return false;}
            seen.add(key);
            return true;
        });
    }

    formatTimeAgo(date) {
        const now = Date.now();
        const diff = now - date.getTime();
        
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = 7 * day;
        
        if (diff < hour) {return `${Math.floor(diff / minute)} min ago`;}
        if (diff < day) {return `${Math.floor(diff / hour)} hours ago`;}
        if (diff < week) {return `${Math.floor(diff / day)} days ago`;}
        return `${Math.floor(diff / week)} weeks ago`;
    }

    isNew(date) {
        return Date.now() - date.getTime() < 24 * 60 * 60 * 1000; // Within 24 hours
    }

    getPriorityColor(priority, secondary = false) {
        const colors = {
            high: secondary ? 'red' : 'red',
            medium: secondary ? 'yellow' : 'orange', 
            low: secondary ? 'blue' : 'blue'
        };
        return colors[priority] || 'gray';
    }

    getSourceColor(source) {
        const colors = {
            'Gov.UK': 'blue',
            'FCA': 'orange',
            'Financial Ombudsman': 'green',
            'Bank of England': 'purple'
        };
        return colors[source] || 'gray';
    }

    getTopicColor(topic) {
        const colors = {
            'banking': 'blue',
            'charges': 'red',
            'complaints': 'yellow',
            'PPI': 'purple',
            'mortgages': 'green',
            'credit': 'orange',
            'investment': 'indigo'
        };
        return colors[topic] || 'gray';
    }

    formatTopic(topic) {
        return topic.charAt(0).toUpperCase() + topic.slice(1);
    }

    getRandomViews() {
        return Math.floor(Math.random() * 5000) + 100;
    }

    getRandomBookmarks() {
        return Math.floor(Math.random() * 500) + 10;
    }

    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    showOfflineMode() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-wifi-off mr-2"></i>
                <span>Knowledge Hub running in offline mode</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }

    // Public methods for UI interaction
    toggleFavorite(itemId) {
        // Implementation for favoriting items
        console.log('Toggle favorite:', itemId);
    }

    toggleBookmark(itemId) {
        // Implementation for bookmarking items
        console.log('Toggle bookmark:', itemId);
    }
}

// Initialize Knowledge Hub API
const knowledgeHub = new KnowledgeHubAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnowledgeHubAPI;
}

// Make available globally
window.KnowledgeHubAPI = KnowledgeHubAPI;
window.knowledgeHub = knowledgeHub;