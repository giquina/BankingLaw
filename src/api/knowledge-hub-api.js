/**
 * JuriBank Knowledge Hub API Integration System
 * Real-time data aggregation from UK official sources
 * Educational platform integration with Gov.UK, FCA, HMRC, Ombudsman APIs
 */

class KnowledgeHubAPI {
    constructor() {
        this.apiEndpoints = {
            govUK: {
                base: 'https://www.gov.uk/api/content',
                search: 'https://www.gov.uk/api/search.json',
                guidance: 'https://www.gov.uk/api/content/guidance'
            },
            fca: {
                base: 'https://www.fca.org.uk/data',
                alerts: 'https://www.fca.org.uk/news/alerts',
                handbook: 'https://www.handbook.fca.org.uk/api'
            },
            ombudsman: {
                base: 'https://www.financial-ombudsman.org.uk/api',
                decisions: 'https://www.financial-ombudsman.org.uk/decisions',
                data: 'https://www.financial-ombudsman.org.uk/data-insight'
            },
            hmrc: {
                base: 'https://www.gov.uk/government/organisations/hm-revenue-customs/api',
                guidance: 'https://www.gov.uk/api/content/government/organisations/hm-revenue-customs'
            }
        };
        
        this.contentCategories = {
            'banking-rights': {
                title: 'Banking Rights & Consumer Protection',
                sources: ['govUK', 'fca', 'ombudsman'],
                keywords: ['banking', 'consumer rights', 'complaints', 'protection', 'current account', 'savings']
            },
            'ppi-claims': {
                title: 'Payment Protection Insurance',
                sources: ['fca', 'ombudsman'],
                keywords: ['ppi', 'payment protection', 'insurance', 'mis-selling', 'compensation']
            },
            'investment-protection': {
                title: 'Investment & Pension Protection',
                sources: ['fca', 'ombudsman'],
                keywords: ['investment', 'pension', 'advice', 'compensation scheme', 'FSCS']
            },
            'mortgage-guidance': {
                title: 'Mortgage & Lending',
                sources: ['fca', 'govUK', 'ombudsman'],
                keywords: ['mortgage', 'lending', 'rates', 'arrears', 'possession', 'help to buy']
            },
            'tax-financial': {
                title: 'Tax & Financial Compliance',
                sources: ['hmrc', 'govUK'],
                keywords: ['tax', 'capital gains', 'income tax', 'corporation tax', 'vat']
            }
        };
        
        this.cache = new Map();
        this.lastUpdate = {};
        this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
        
        this.init();
    }
    
    init() {
        this.setupCacheSystem();
        this.scheduleRegularUpdates();
        
        // Educational content structure
        this.educationalFramework = {
            learningLevels: ['beginner', 'intermediate', 'advanced'],
            contentTypes: ['guide', 'template', 'case-study', 'regulation', 'news'],
            audienceTypes: ['individual', 'business', 'student', 'professional']
        };
    }
    
    setupCacheSystem() {
        // Initialize localStorage-based caching for educational content
        if (typeof localStorage !== 'undefined') {
            const cachedData = localStorage.getItem('knowledgeHubCache');
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    this.cache = new Map(parsed.entries);
                    this.lastUpdate = parsed.lastUpdate || {};
                } catch (error) {
                    console.error('Error loading cache:', error);
                }
            }
        }
    }
    
    async fetchGovUKContent(category, limit = 20) {
        const cacheKey = `govuk-${category}`;
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const keywords = this.contentCategories[category]?.keywords || [];
            const searchQuery = keywords.join(' OR ');
            
            // Simulate Gov.UK API call (replace with actual API integration)
            const mockResponse = await this.simulateGovUKAPI(searchQuery, limit);
            
            const processedContent = this.processGovUKContent(mockResponse, category);
            
            this.cache.set(cacheKey, processedContent);
            this.lastUpdate[cacheKey] = Date.now();
            this.saveCache();
            
            return processedContent;
            
        } catch (error) {
            console.error('Gov.UK API Error:', error);
            return this.getFallbackContent(category);
        }
    }
    
    async simulateGovUKAPI(query, limit) {
        // Educational content simulation - replace with real API calls
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        return {
            results: [
                {
                    title: "Making a complaint about your bank or building society",
                    description: "How to complain to your bank and what to do if they don't resolve your complaint",
                    link: "https://www.gov.uk/complain-about-bank-building-society-credit-card-company",
                    updated: new Date().toISOString(),
                    format: "guide",
                    tags: ["banking", "complaints", "consumer-rights"],
                    content: this.generateEducationalContent('banking-complaints')
                },
                {
                    title: "Payment Protection Insurance (PPI) claims",
                    description: "Information about PPI claims and how to get help if you were mis-sold PPI",
                    link: "https://www.gov.uk/guidance/payment-protection-insurance-ppi-claims",
                    updated: new Date().toISOString(),
                    format: "guidance",
                    tags: ["ppi", "insurance", "compensation"],
                    content: this.generateEducationalContent('ppi-guidance')
                },
                {
                    title: "Financial Services Compensation Scheme",
                    description: "How the FSCS protects your money when financial firms fail",
                    link: "https://www.gov.uk/government/organisations/financial-services-compensation-scheme",
                    updated: new Date().toISOString(),
                    format: "information",
                    tags: ["compensation", "protection", "fscs"],
                    content: this.generateEducationalContent('fscs-protection')
                }
            ]
        };
    }
    
    generateEducationalContent(contentType) {
        const educationalContent = {
            'banking-complaints': {
                overview: "Understanding your rights when dealing with banking disputes",
                keyPoints: [
                    "Banks must have a complaints procedure and respond within 8 weeks",
                    "You can escalate to Financial Ombudsman Service if unsatisfied",
                    "Keep detailed records of all communications",
                    "There are strict time limits for different types of complaints"
                ],
                learnMoreLinks: [
                    "FCA Banking Conduct Rules",
                    "Ombudsman Service Procedures",
                    "Consumer Rights Act 2015"
                ],
                practicalSteps: [
                    "Contact your bank's complaints department first",
                    "Put your complaint in writing with specific details",
                    "Allow 8 weeks for the bank to investigate",
                    "If unsatisfied, contact Financial Ombudsman Service"
                ]
            },
            'ppi-guidance': {
                overview: "Educational guidance on Payment Protection Insurance and your rights",
                keyPoints: [
                    "PPI was often sold without proper explanation of terms",
                    "You may be entitled to compensation if mis-sold",
                    "Deadline for most PPI claims was August 2019",
                    "Some exceptions may still apply for certain circumstances"
                ],
                learnMoreLinks: [
                    "FCA PPI Rules and Guidance",
                    "Ombudsman PPI Decisions",
                    "Consumer Credit Act Protections"
                ],
                practicalSteps: [
                    "Check old financial agreements for PPI",
                    "Contact the lender who sold you PPI",
                    "Use the FCA's template complaint form",
                    "Seek professional advice for complex cases"
                ]
            },
            'fscs-protection': {
                overview: "Understanding how the Financial Services Compensation Scheme protects consumers",
                keyPoints: [
                    "Protects up to £85,000 per person per authorized firm",
                    "Covers deposits, investments, insurance, and mortgage advice",
                    "Claims must be made within specific time limits",
                    "Different limits apply to different types of products"
                ],
                learnMoreLinks: [
                    "FSCS Coverage Limits",
                    "Making a Claim Guide",
                    "Authorized Firms Register"
                ],
                practicalSteps: [
                    "Check if your firm is FSCS protected",
                    "Understand the coverage limits for your products",
                    "Know how to make a claim if needed",
                    "Keep records of all financial products"
                ]
            }
        };
        
        return educationalContent[contentType] || {
            overview: "Educational content about UK financial regulations and consumer rights",
            keyPoints: ["Contact relevant authorities for specific guidance"],
            learnMoreLinks: [],
            practicalSteps: ["Seek professional advice for complex situations"]
        };
    }
    
    async fetchFCAContent(category, limit = 20) {
        const cacheKey = `fca-${category}`;
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            // Simulate FCA API integration
            const mockResponse = await this.simulateFCAAPI(category, limit);
            const processedContent = this.processFCAContent(mockResponse, category);
            
            this.cache.set(cacheKey, processedContent);
            this.lastUpdate[cacheKey] = Date.now();
            this.saveCache();
            
            return processedContent;
            
        } catch (error) {
            console.error('FCA API Error:', error);
            return this.getFallbackContent(category);
        }
    }
    
    async simulateFCAAPI(category, limit) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        return {
            data: [
                {
                    title: "Consumer Duty: Key Information",
                    type: "regulation",
                    category: "consumer-protection",
                    summary: "New rules requiring firms to act in customers' best interests",
                    publishDate: new Date().toISOString(),
                    url: "https://www.fca.org.uk/firms/consumer-duty",
                    educationalContent: {
                        studentSummary: "Consumer Duty requires financial firms to prioritize customer outcomes",
                        keyRequirements: [
                            "Firms must act in good faith towards customers",
                            "Products must provide fair value",
                            "Customer service must be fit for purpose",
                            "Communications must be clear and understandable"
                        ],
                        relevantToStudents: "Understanding consumer rights and firm obligations"
                    }
                },
                {
                    title: "Banking Conduct Rules Update",
                    type: "guidance",
                    category: "banking",
                    summary: "Updated guidance on banking conduct and customer treatment",
                    publishDate: new Date().toISOString(),
                    url: "https://www.fca.org.uk/publications/guidance-consultations/banking-conduct",
                    educationalContent: {
                        studentSummary: "Rules governing how banks must treat customers fairly",
                        keyRequirements: [
                            "Fair treatment of customers in financial difficulty",
                            "Clear information about products and charges",
                            "Proper complaints handling procedures",
                            "Regular monitoring of customer outcomes"
                        ],
                        relevantToStudents: "Essential for understanding banking law and consumer protection"
                    }
                }
            ]
        };
    }
    
    processFCAContent(response, category) {
        return response.data.map(item => ({
            id: `fca-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title,
            description: item.summary,
            content: item.educationalContent,
            source: 'FCA',
            category: category,
            type: item.type,
            publishDate: item.publishDate,
            url: item.url,
            educationalLevel: this.determineEducationalLevel(item),
            tags: this.extractTags(item.summary + ' ' + item.title),
            lastUpdated: new Date().toISOString()
        }));
    }
    
    async fetchOmbudsmanContent(category, limit = 15) {
        const cacheKey = `ombudsman-${category}`;
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        try {
            const mockResponse = await this.simulateOmbudsmanAPI(category, limit);
            const processedContent = this.processOmbudsmanContent(mockResponse, category);
            
            this.cache.set(cacheKey, processedContent);
            this.lastUpdate[cacheKey] = Date.now();
            this.saveCache();
            
            return processedContent;
            
        } catch (error) {
            console.error('Ombudsman API Error:', error);
            return this.getFallbackContent(category);
        }
    }
    
    async simulateOmbudsmanAPI(category, limit) {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        return {
            cases: [
                {
                    caseType: "Banking Charges",
                    outcome: "upheld",
                    summary: "Bank failed to properly explain overdraft charges structure",
                    educationalValue: "Shows importance of clear fee disclosure",
                    anonymizedFacts: "Customer not told about daily overdraft fees, leading to unexpected charges",
                    decision: "Bank required to refund charges and improve communication",
                    keyLearning: "Banks must clearly explain all charges before account opening",
                    publishDate: new Date().toISOString()
                },
                {
                    caseType: "PPI Complaint",
                    outcome: "upheld",
                    summary: "Insurance not suitable for customer's employment situation",
                    educationalValue: "Demonstrates proper suitability assessment requirements",
                    anonymizedFacts: "Self-employed customer sold PPI that wouldn't pay out for their work type",
                    decision: "Full refund of premiums plus interest awarded",
                    keyLearning: "PPI must be suitable for customer's specific circumstances",
                    publishDate: new Date().toISOString()
                }
            ],
            statistics: {
                totalComplaints: 127549,
                upheldRate: 0.42,
                averageResolutionTime: "4.2 months",
                topCategories: ["Banking", "Insurance", "Investments"]
            }
        };
    }
    
    processOmbudsmanContent(response, category) {
        return response.cases.map(case_ => ({
            id: `ombudsman-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Case Study: ${case_.caseType}`,
            description: case_.summary,
            content: {
                overview: case_.educationalValue,
                facts: case_.anonymizedFacts,
                decision: case_.decision,
                keyLearning: case_.keyLearning,
                outcome: case_.outcome
            },
            source: 'Financial Ombudsman Service',
            category: category,
            type: 'case-study',
            publishDate: case_.publishDate,
            educationalLevel: 'intermediate',
            tags: this.extractTags(case_.summary + ' ' + case_.caseType),
            lastUpdated: new Date().toISOString()
        }));
    }
    
    async aggregateContent(category = 'all', limit = 50) {
        const allContent = [];
        
        try {
            if (category === 'all') {
                // Fetch from all sources for all categories
                for (const cat of Object.keys(this.contentCategories)) {
                    const [govUK, fca, ombudsman] = await Promise.all([
                        this.fetchGovUKContent(cat, Math.ceil(limit / 6)),
                        this.fetchFCAContent(cat, Math.ceil(limit / 6)),
                        this.fetchOmbudsmanContent(cat, Math.ceil(limit / 6))
                    ]);
                    
                    allContent.push(...govUK, ...fca, ...ombudsman);
                }
            } else {
                // Fetch for specific category
                const sources = this.contentCategories[category]?.sources || ['govUK', 'fca', 'ombudsman'];
                const promises = [];
                
                if (sources.includes('govUK')) promises.push(this.fetchGovUKContent(category, Math.ceil(limit / sources.length)));
                if (sources.includes('fca')) promises.push(this.fetchFCAContent(category, Math.ceil(limit / sources.length)));
                if (sources.includes('ombudsman')) promises.push(this.fetchOmbudsmanContent(category, Math.ceil(limit / sources.length)));
                if (sources.includes('hmrc')) promises.push(this.fetchHMRCContent(category, Math.ceil(limit / sources.length)));
                
                const results = await Promise.all(promises);
                results.forEach(result => allContent.push(...result));
            }
            
            // Sort by relevance and recency
            return this.rankContent(allContent, category).slice(0, limit);
            
        } catch (error) {
            console.error('Content aggregation error:', error);
            return this.getFallbackContent(category);
        }
    }
    
    rankContent(content, category) {
        return content.sort((a, b) => {
            // Prioritize more recent content
            const dateA = new Date(a.publishDate || a.lastUpdated);
            const dateB = new Date(b.publishDate || b.lastUpdated);
            
            // Educational relevance score
            let scoreA = dateA.getTime();
            let scoreB = dateB.getTime();
            
            // Boost score for educational content
            if (a.educationalLevel) scoreA += 1000000;
            if (b.educationalLevel) scoreB += 1000000;
            
            // Boost for case studies and practical guides
            if (a.type === 'case-study' || a.type === 'guide') scoreA += 500000;
            if (b.type === 'case-study' || b.type === 'guide') scoreB += 500000;
            
            return scoreB - scoreA;
        });
    }
    
    async searchContent(query, category = 'all', filters = {}) {
        const allContent = await this.aggregateContent(category, 200);
        const searchTerms = query.toLowerCase().split(' ');
        
        return allContent.filter(item => {
            // Text matching
            const searchableText = `${item.title} ${item.description} ${JSON.stringify(item.content)}`.toLowerCase();
            const matchesQuery = searchTerms.every(term => searchableText.includes(term));
            
            // Filter matching
            const matchesFilters = Object.keys(filters).every(filterKey => {
                if (!filters[filterKey]) return true;
                return item[filterKey] === filters[filterKey];
            });
            
            return matchesQuery && matchesFilters;
        }).slice(0, 50);
    }
    
    determineEducationalLevel(content) {
        const complexTerms = ['regulation', 'compliance', 'statutory', 'derivative', 'structured product'];
        const intermediateTerms = ['complaint', 'compensation', 'procedure', 'assessment'];
        
        const text = `${content.title} ${content.summary}`.toLowerCase();
        
        if (complexTerms.some(term => text.includes(term))) return 'advanced';
        if (intermediateTerms.some(term => text.includes(term))) return 'intermediate';
        return 'beginner';
    }
    
    extractTags(text) {
        const commonTags = {
            'banking': ['bank', 'account', 'overdraft', 'current account', 'savings'],
            'ppi': ['ppi', 'protection', 'insurance', 'payment protection'],
            'investment': ['investment', 'pension', 'fund', 'portfolio', 'shares'],
            'mortgage': ['mortgage', 'lending', 'home loan', 'property'],
            'complaints': ['complaint', 'dispute', 'ombudsman', 'resolution'],
            'regulation': ['fca', 'regulation', 'compliance', 'rules', 'guidance']
        };
        
        const foundTags = [];
        const lowerText = text.toLowerCase();
        
        Object.keys(commonTags).forEach(tag => {
            if (commonTags[tag].some(keyword => lowerText.includes(keyword))) {
                foundTags.push(tag);
            }
        });
        
        return foundTags;
    }
    
    isCacheValid(cacheKey) {
        const lastUpdateTime = this.lastUpdate[cacheKey];
        if (!lastUpdateTime) return false;
        
        return (Date.now() - lastUpdateTime) < this.updateInterval;
    }
    
    getFallbackContent(category) {
        // Provide educational fallback content when APIs are unavailable
        return [{
            id: `fallback-${category}-${Date.now()}`,
            title: "Educational Resources Available",
            description: "Our knowledge base contains comprehensive guides on UK financial law and consumer rights.",
            content: {
                overview: "Educational information about financial services and consumer protection",
                keyPoints: [
                    "Always seek professional advice for complex legal matters",
                    "Keep detailed records of all financial communications",
                    "Know your rights under UK consumer protection law",
                    "Understand the complaints procedures for financial services"
                ]
            },
            source: 'JuriBank Educational Team',
            category: category,
            type: 'guide',
            educationalLevel: 'beginner',
            tags: [category],
            lastUpdated: new Date().toISOString()
        }];
    }
    
    saveCache() {
        if (typeof localStorage !== 'undefined') {
            try {
                const cacheData = {
                    entries: Array.from(this.cache.entries()),
                    lastUpdate: this.lastUpdate
                };
                localStorage.setItem('knowledgeHubCache', JSON.stringify(cacheData));
            } catch (error) {
                console.error('Error saving cache:', error);
            }
        }
    }
    
    scheduleRegularUpdates() {
        // Update content every 24 hours
        setInterval(() => {
            this.refreshAllContent();
        }, this.updateInterval);
        
        // Also update on page visibility change (when user returns to tab)
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.checkForUpdates();
                }
            });
        }
    }
    
    async refreshAllContent() {
        console.log('Refreshing knowledge hub content...');
        
        for (const category of Object.keys(this.contentCategories)) {
            // Clear cache for this category to force refresh
            this.lastUpdate[`govuk-${category}`] = 0;
            this.lastUpdate[`fca-${category}`] = 0;
            this.lastUpdate[`ombudsman-${category}`] = 0;
            
            // Fetch fresh content
            await this.aggregateContent(category, 20);
        }
        
        console.log('Content refresh complete');
    }
    
    async checkForUpdates() {
        // Quick check for new content without full refresh
        const lastCheck = localStorage.getItem('lastUpdateCheck');
        const now = Date.now();
        
        if (!lastCheck || (now - parseInt(lastCheck)) > (60 * 60 * 1000)) { // 1 hour
            localStorage.setItem('lastUpdateCheck', now.toString());
            
            // Sample one category for updates
            const sampleCategory = Object.keys(this.contentCategories)[0];
            const currentContent = await this.aggregateContent(sampleCategory, 5);
            
            if (currentContent.length > 0) {
                this.notifyContentUpdate();
            }
        }
    }
    
    notifyContentUpdate() {
        // Dispatch custom event for UI to handle
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('knowledgeHubUpdate', {
                detail: { message: 'New educational content available' }
            }));
        }
    }
    
    getContentStatistics() {
        return {
            totalItems: Array.from(this.cache.values()).reduce((acc, items) => acc + items.length, 0),
            categories: Object.keys(this.contentCategories).length,
            sources: 4,
            lastUpdate: Math.max(...Object.values(this.lastUpdate)),
            cacheSize: this.cache.size
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnowledgeHubAPI;
} else if (typeof window !== 'undefined') {
    window.KnowledgeHubAPI = KnowledgeHubAPI;
}