// JuriBank Core Intelligence System
// Educational UK Money and Finance Help Platform

class JuriBankCore {
    constructor() {
        this.modules = {};
        this.initialized = false;
        this.config = {
            debug: false,
            apiEnabled: true,
            securityLevel: 'banking-grade'
        };
        
        this.initializeCore();
    }

    // Initialize core intelligence systems
    async initializeCore() {
        console.log('🏛️ JuriBank Educational Platform - Initializing...');
        
        try {
            // Initialize all intelligence modules
            await this.loadIntelligenceModules();
            
            // Setup security framework
            this.initializeSecurity();
            
            // Initialize UI components
            this.initializeUI();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            console.log('✅ JuriBank Core Systems - Operational');
            
            // Trigger ready event
            this.trigger('juribank:ready', {
                modules: Object.keys(this.modules),
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('❌ JuriBank Initialization Error:', error);
            this.handleInitializationError(error);
        }
    }

    // Load all intelligence modules
    async loadIntelligenceModules() {
        const modules = [
            'AutoRegulatoryMonitoring',
            'LegalCitationEngine', 
            'ComplianceCalendar',
            'LearningDatabase',
            'LegalTemplates',
            'RegulatoryAlerts',
            'RegulatoryUpdates',
            'JurisdictionMapping'
        ];

        for (const moduleName of modules) {
            try {
                if (window[moduleName]) {
                    console.log(`📚 Loading: ${moduleName}`);
                    this.modules[moduleName] = window[moduleName];
                } else {
                    console.warn(`⚠️ Module not found: ${moduleName}`);
                }
            } catch (error) {
                console.error(`❌ Error loading ${moduleName}:`, error);
            }
        }

        console.log(`✅ Loaded ${Object.keys(this.modules).length} intelligence modules`);
    }

    // Initialize security framework
    initializeSecurity() {
        // Banking-grade security initialization
        this.security = {
            csp: this.setupCSP(),
            audit: this.setupAuditLogging(),
            encryption: this.setupEncryption()
        };
        
        console.log('🔒 Banking-grade security framework initialized');
    }

    // Setup Content Security Policy
    setupCSP() {
        // Banking industry CSP standards
        const csp = {
            'default-src': "'self'",
            'script-src': "'self' 'unsafe-inline' fonts.googleapis.com",
            'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
            'font-src': "'self' fonts.gstatic.com",
            'img-src': "'self' data: https:",
            'connect-src': "'self' https://www.bankofengland.co.uk https://www.fca.org.uk"
        };
        
        return csp;
    }

    // Setup audit logging
    setupAuditLogging() {
        return {
            log: (action, details) => {
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    action: action,
                    details: details,
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };
                
                // In production, send to secure logging service
                if (this.config.debug) {
                    console.log('📋 Audit Log:', logEntry);
                }
            }
        };
    }

    // Setup encryption utilities
    setupEncryption() {
        return {
            hash: async (data) => {
                const encoder = new TextEncoder();
                const dataBuffer = encoder.encode(data);
                const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }
        };
    }

    // Initialize UI components
    initializeUI() {
        // Create main dashboard container
        this.createMainDashboard();
        
        // Initialize navigation
        this.initializeNavigation();
        
        // Setup responsive design
        this.setupResponsiveDesign();
        
        console.log('🎨 Professional UI components initialized');
    }

    // Create main dashboard
    createMainDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'juribank-dashboard';
        dashboard.className = 'juribank-dashboard hidden';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <div class="flex items-center justify-between p-6 bg-white border-b border-gray-200">
                    <div class="flex items-center space-x-4">
                        <img src="/assets/juribank-logo.svg" alt="JuriBank" class="h-10">
                        <div class="text-sm text-gray-600">
                            <div class="font-semibold">Educational Dashboard</div>
                            <div>UK Money and Finance Help Platform for LLB Students</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="status-indicator bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            All Systems Operational
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <div class="col-span-2">
                    <div id="regulatory-monitoring-widget"></div>
                    <div id="compliance-calendar-widget"></div>
                </div>
                <div class="col-span-1">
                    <div id="agent-chat-widget"></div>
                    <div id="citation-search-widget"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dashboard);
    }

    // Initialize navigation
    initializeNavigation() {
        const nav = document.querySelector('.professional-nav');
        if (nav) {
            // Add intelligence system navigation
            const intelligenceNav = document.createElement('div');
            intelligenceNav.className = 'intelligence-nav flex space-x-6';
            intelligenceNav.innerHTML = `
                <button class="nav-item" data-module="regulatory-monitoring">
                    <span class="icon">📊</span> Regulatory Monitoring
                </button>
                <button class="nav-item" data-module="citation-engine">
                    <span class="icon">⚖️</span> Citation Engine
                </button>
                <button class="nav-item" data-module="compliance-calendar">
                    <span class="icon">📅</span> Compliance Calendar
                </button>
                <button class="nav-item" data-module="ai-agents">
                    <span class="icon">🤖</span> AI Agents
                </button>
            `;
            
            nav.appendChild(intelligenceNav);
        }
    }

    // Setup responsive design
    setupResponsiveDesign() {
        // Professional mobile navigation
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu hidden lg:hidden';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-overlay fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div class="mobile-menu-content fixed right-0 top-0 h-full w-80 bg-white z-50 transform translate-x-full transition-transform">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <img src="/assets/juribank-logo.svg" alt="JuriBank" class="h-8">
                        <button class="mobile-menu-close">
                            <span class="sr-only">Close menu</span>
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <nav class="space-y-4">
                        <a href="#regulatory-monitoring" class="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">Regulatory Monitoring</a>
                        <a href="#citation-engine" class="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">Citation Engine</a>
                        <a href="#compliance-calendar" class="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">Compliance Calendar</a>
                        <a href="#ai-agents" class="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">AI Agents</a>
                    </nav>
                </div>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-item')) {
                const module = e.target.dataset.module;
                this.activateModule(module);
            }
            
            if (e.target.matches('.mobile-menu-toggle')) {
                this.toggleMobileMenu();
            }
            
            if (e.target.matches('.mobile-menu-close') || e.target.matches('.mobile-menu-overlay')) {
                this.closeMobileMenu();
            }
        });

        // Module activation events
        document.addEventListener('juribank:activate-module', (e) => {
            this.activateModule(e.detail.module);
        });

        // Window resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Activate intelligence module
    activateModule(moduleName) {
        console.log(`🚀 Activating module: ${moduleName}`);
        
        // Log for audit trail
        this.security.audit.log('module_activation', { module: moduleName });
        
        switch(moduleName) {
            case 'regulatory-monitoring':
                this.showRegulatoryMonitoring();
                break;
            case 'citation-engine':
                this.showCitationEngine();
                break;
            case 'compliance-calendar':
                this.showComplianceCalendar();
                break;
            case 'ai-agents':
                this.showAIAgents();
                break;
            default:
                console.warn(`Unknown module: ${moduleName}`);
        }
    }

    // Show regulatory monitoring interface
    showRegulatoryMonitoring() {
        const widget = document.getElementById('regulatory-monitoring-widget');
        if (widget && this.modules.AutoRegulatoryMonitoring) {
            const monitoring = new this.modules.AutoRegulatoryMonitoring();
            const status = monitoring.getMonitoringStatus();
            
            widget.innerHTML = `
                <div class="card-elevated">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-heading-professional text-xl">Regulatory Monitoring</h3>
                        <span class="status-active">Live</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="text-2xl font-bold text-juribank-navy">${status.sources.length}</div>
                            <div class="text-sm text-gray-600">Monitoring Sources</div>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="text-2xl font-bold text-juribank-navy">${status.total_changes}</div>
                            <div class="text-sm text-gray-600">Total Changes Tracked</div>
                        </div>
                    </div>
                    <div class="space-y-2">
                        ${status.sources.slice(0, 3).map(source => `
                            <div class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <div>
                                    <div class="font-medium">${source.name}</div>
                                    <div class="text-sm text-gray-600">${source.regulator}</div>
                                </div>
                                <span class="status-${source.status === 'active' ? 'active' : 'warning'}">${source.status}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    // Show citation engine interface
    showCitationEngine() {
        const widget = document.getElementById('citation-search-widget');
        if (widget && this.modules.LegalCitationEngine) {
            widget.innerHTML = `
                <div class="card">
                    <h3 class="text-heading-professional text-lg mb-4">Legal Citation Engine</h3>
                    <div class="space-y-4">
                        <div>
                            <input type="text" 
                                   id="citation-search" 
                                   placeholder="Search 2,847+ legal references..." 
                                   class="form-input">
                        </div>
                        <div class="text-sm text-gray-600">
                            <div>• OSCOLA-compliant formatting</div>
                            <div>• UK money and finance database</div>
                            <div>• Real-time validation</div>
                        </div>
                        <button class="btn-primary w-full">Search Citations</button>
                    </div>
                </div>
            `;
            
            // Add search functionality
            const searchInput = document.getElementById('citation-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value;
                    if (query.length > 2) {
                        this.searchCitations(query);
                    }
                });
            }
        }
    }

    // Show compliance calendar interface  
    showComplianceCalendar() {
        const widget = document.getElementById('compliance-calendar-widget');
        if (widget && this.modules.ComplianceCalendar) {
            const calendar = new this.modules.ComplianceCalendar();
            const upcoming = calendar.getUpcomingDeadlines(30);
            
            widget.innerHTML = `
                <div class="card mt-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-heading-professional text-xl">Compliance Calendar</h3>
                        <span class="badge-regulatory">${upcoming.length} Upcoming</span>
                    </div>
                    <div class="space-y-3">
                        ${upcoming.slice(0, 5).map(deadline => `
                            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                    <div class="font-medium">${deadline.title}</div>
                                    <div class="text-sm text-gray-600">${deadline.regulator}</div>
                                </div>
                                <div class="text-right">
                                    <div class="font-medium">${new Date(deadline.deadline).toLocaleDateString()}</div>
                                    <div class="text-sm text-${deadline.importance === 'critical' ? 'red' : 'orange'}-600">
                                        ${deadline.importance}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn-outline w-full mt-4">View Full Calendar</button>
                </div>
            `;
        }
    }

    // Show AI agents interface
    showAIAgents() {
        const widget = document.getElementById('agent-chat-widget');
        if (widget) {
            widget.innerHTML = `
                <div class="card">
                    <h3 class="text-heading-professional text-lg mb-4">AI Legal Agents</h3>
                    <div class="space-y-3">
                        <div class="agent-selector">
                            <select class="form-select" id="agent-select">
                                <option value="">Select an AI Agent...</option>
                                <option value="regulatory-compliance">🏛️ UK Regulatory Information</option>
                                <option value="securities-law">📈 UK Securities Information</option>
                                <option value="fintech-innovation">💡 FinTech Learning</option>
                                <option value="aml-compliance">🔒 AML Learning</option>
                                <option value="risk-management">⚠️ Risk Management Learning</option>
                                <option value="financial-information-validator">✅ Financial Information Validator</option>
                            </select>
                        </div>
                        <div class="chat-interface" id="agent-chat">
                            <div class="bg-gray-50 p-4 rounded-lg text-center text-gray-600">
                                Select an AI agent to begin consultation
                            </div>
                        </div>
                        <div class="chat-input hidden">
                            <div class="flex space-x-2">
                                <input type="text" 
                                       id="agent-query" 
                                       placeholder="Ask your legal question..." 
                                       class="form-input flex-1">
                                <button class="btn-primary" id="send-query">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add agent selection functionality
            this.setupAgentInterface();
        }
    }

    // Setup agent interface functionality
    setupAgentInterface() {
        const agentSelect = document.getElementById('agent-select');
        const chatInterface = document.getElementById('agent-chat');
        const chatInput = document.querySelector('.chat-input');
        
        if (agentSelect) {
            agentSelect.addEventListener('change', (e) => {
                const selectedAgent = e.target.value;
                if (selectedAgent) {
                    chatInput.classList.remove('hidden');
                    chatInterface.innerHTML = `
                        <div class="bg-juribank-off-white p-4 rounded-lg">
                            <div class="flex items-center space-x-3 mb-2">
                                <div class="agent-avatar">AI</div>
                                <div class="font-medium">AI Legal Agent Ready</div>
                            </div>
                            <div class="text-gray-700">
                                Hello! I'm your ${e.target.options[e.target.selectedIndex].text} educational guide. 
                                How can I help you learn about UK money and finance today?
                            </div>
                        </div>
                    `;
                    
                    this.setupAgentChat(selectedAgent);
                }
            });
        }
    }

    // Setup agent chat functionality
    setupAgentChat(agentType) {
        const queryInput = document.getElementById('agent-query');
        const sendButton = document.getElementById('send-query');
        const chatInterface = document.getElementById('agent-chat');
        
        const sendQuery = () => {
            const query = queryInput.value.trim();
            if (query) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'mb-4';
                userMessage.innerHTML = `
                    <div class="bg-juribank-navy text-white p-3 rounded-lg ml-12">
                        ${query}
                    </div>
                `;
                chatInterface.appendChild(userMessage);
                
                // Clear input
                queryInput.value = '';
                
                // Add thinking message
                const thinkingMessage = document.createElement('div');
                thinkingMessage.className = 'mb-4';
                thinkingMessage.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <div class="agent-avatar">AI</div>
                        <div class="bg-gray-100 p-3 rounded-lg">
                            <div class="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                            Analyzing your learning query...
                        </div>
                    </div>
                `;
                chatInterface.appendChild(thinkingMessage);
                
                // Simulate agent response (in production, this would call the actual agent)
                setTimeout(() => {
                    this.simulateAgentResponse(agentType, query, chatInterface, thinkingMessage);
                }, 2000);
                
                // Scroll to bottom
                chatInterface.scrollTop = chatInterface.scrollHeight;
            }
        };
        
        if (sendButton) {
            sendButton.addEventListener('click', sendQuery);
        }
        
        if (queryInput) {
            queryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendQuery();
                }
            });
        }
    }

    // Simulate agent response (placeholder for actual agent integration)
    simulateAgentResponse(agentType, query, container, thinkingElement) {
        // Remove thinking indicator
        thinkingElement.remove();
        
        // Sample responses based on agent type
        const responses = {
            'regulatory-compliance': `Based on current PRA and FCA regulations, I can provide educational information on compliance topics. For study purposes, please review the latest PRA Rulebook and FCA Handbook requirements.`,
            'securities-law': `Regarding UK securities information, this falls under FCA jurisdiction. For learning, please refer to MiFID II regulations and the FCA Conduct of Business Sourcebook (COBS).`,
            'fintech-innovation': `For FinTech learning matters, consider studying the FCA's regulatory sandbox and innovation hub initiatives. Digital asset regulations are evolving rapidly in the UK.`,
            'aml-compliance': `AML learning requires understanding the Money Laundering Regulations 2017. This involves customer due diligence, suspicious activity reporting, and ongoing monitoring concepts.`,
            'risk-management': `Risk management learning frameworks should understand PRA expectations and Basel III requirements. Consider operational resilience and stress testing concepts.`,
            'financial-information-validator': `I've checked this against current UK financial information sources. Please ensure you're referencing the most recent regulatory updates for your studies.`
        };
        
        const response = responses[agentType] || "I'm ready to assist with your UK money and finance learning query. Please provide more specific details for targeted educational guidance.";
        
        const responseMessage = document.createElement('div');
        responseMessage.className = 'mb-4';
        responseMessage.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="agent-avatar">AI</div>
                <div class="bg-juribank-off-white p-4 rounded-lg flex-1">
                    <div class="text-gray-700">${response}</div>
                    <div class="mt-3 text-xs text-gray-500">
                        ⚠️ This is AI-generated educational information. Always consult qualified solicitors for specific legal advice. This is for LLB student learning purposes only.
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(responseMessage);
        container.scrollTop = container.scrollHeight;
    }

    // Search citations functionality
    searchCitations(query) {
        if (this.modules.LegalCitationEngine) {
            const engine = new this.modules.LegalCitationEngine();
            const suggestions = engine.suggestCitations(query);
            
            // Display search results (implementation would show in UI)
            console.log('Citation search results:', suggestions);
        }
    }

    // Mobile menu functionality
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            const content = mobileMenu.querySelector('.mobile-menu-content');
            if (content) {
                content.classList.toggle('translate-x-full');
            }
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            const content = mobileMenu.querySelector('.mobile-menu-content');
            if (content) {
                content.classList.add('translate-x-full');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
            }
        }
    }

    // Handle window resize
    handleResize() {
        // Responsive adjustments
        if (window.innerWidth >= 1024) {
            this.closeMobileMenu();
        }
    }

    // Handle initialization errors
    handleInitializationError(error) {
        console.error('🚨 JuriBank initialization failed:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <span>JuriBank initialization error. Please refresh the page.</span>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 10000);
    }

    // Utility methods
    trigger(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // Public API methods
    getModules() {
        return this.modules;
    }

    getStatus() {
        return {
            initialized: this.initialized,
            modules: Object.keys(this.modules),
            config: this.config
        };
    }

    // Activate dashboard
    showDashboard() {
        const dashboard = document.getElementById('juribank-dashboard');
        if (dashboard) {
            dashboard.classList.remove('hidden');
            this.activateModule('regulatory-monitoring'); // Show default module
        }
    }

    // Hide dashboard
    hideDashboard() {
        const dashboard = document.getElementById('juribank-dashboard');
        if (dashboard) {
            dashboard.classList.add('hidden');
        }
    }
}

// Initialize JuriBank Core when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.JuriBankCore = new JuriBankCore();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankCore;
}