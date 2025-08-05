// JuriBank Client Portal Functionality
class ClientPortal {
    constructor() {
        // Constants
        this.JURIBANK_BLUE = 'var(--juribank-blue)';
        this.currentTab = 'services';
        this.initialized = false;
        this.init();
    }

    init() {
        // Initialize portal tabs
        this.setupTabNavigation();
        
        // Initialize components (placeholders for now - will be replaced with React components)
        this.initializeComponents();
        
        // Setup scroll behavior
        this.setupScrollBehavior();
        
        this.initialized = true;
        console.log('✅ JuriBank Client Portal - Initialized');
    }

    setupTabNavigation() {
        const tabs = document.querySelectorAll('.portal-tab');
        // const panels = document.querySelectorAll('.portal-panel'); // Will be used when React components are implemented

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.showTab(targetTab);
            });
        });

        // Setup hover effects
        tabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => {
                if (!tab.classList.contains('active')) {
                    const tabElement = tab;
                    tabElement.style.color = this.JURIBANK_BLUE;
                    tabElement.style.borderBottomColor = 'var(--gray-300)';
                }
            });

            tab.addEventListener('mouseleave', () => {
                if (!tab.classList.contains('active')) {
                    const tabElement = tab;
                    tabElement.style.color = 'var(--gray-600)';
                    tabElement.style.borderBottomColor = 'transparent';
                }
            });
        });
    }

    showTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.portal-tab').forEach(tab => {
            const tabElement = tab;
            tabElement.classList.remove('active');
            tabElement.style.color = 'var(--gray-600)';
            tabElement.style.borderBottomColor = 'transparent';
        });

        document.querySelectorAll('.portal-panel').forEach(panel => {
            const panelElement = panel;
            panelElement.style.display = 'none';
            panelElement.classList.remove('active');
        });

        // Activate selected tab
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        const activePanel = document.getElementById(`${tabName}-tab`);

        if (activeTab && activePanel) {
            activeTab.classList.add('active');
            activeTab.style.color = this.JURIBANK_BLUE;
            activeTab.style.borderBottomColor = this.JURIBANK_BLUE;
            
            activePanel.style.display = 'block';
            activePanel.classList.add('active');

            // Smooth fade in animation
            activePanel.style.opacity = '0';
            activePanel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activePanel.style.transition = 'all 0.3s ease';
                activePanel.style.opacity = '1';
                activePanel.style.transform = 'translateY(0)';
            }, 50);
        }

        this.currentTab = tabName;
        
        // Initialize tab-specific functionality
        this.initializeTabContent(tabName);
    }

    initializeTabContent(tabName) {
        switch (tabName) {
            case 'services':
                this.initializeServicesTab();
                break;
            case 'tracker':
                this.initializeTrackerTab();
                break;
            case 'intake':
                this.initializeIntakeTab();
                break;
            case 'chat':
                this.initializeChatTab();
                break;
            default:
                // Handle unknown tab
                break;
        }
    }

    initializeServicesTab() {
        // This would initialize the React Service Cards component
        console.log('🏛️ Initializing Legal Services...');
        
        // Simulate loading service cards
        const container = document.getElementById('service-cards-container');
        if (container) {
            // Add loading animation
            const placeholder = container.querySelector('.services-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div style="font-size: 1.5rem; margin-bottom: var(--space-4);">⚖️</div>
                    <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--gray-700); margin-bottom: var(--space-2);">Loading Legal Services...</h3>
                    <div style="display: flex; justify-content: center; margin-top: var(--space-4);">
                        <div class="loading-spinner" style="width: 24px; height: 24px; border: 3px solid var(--gray-300); border-top: 3px solid var(--juribank-blue); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </div>
                `;
            }
        }
    }

    initializeTrackerTab() {
        console.log('📊 Initializing Case Tracker...');
        
        const container = document.getElementById('claim-tracker-container');
        if (container) {
            // Show demo case tracker
            const demoTracker = this.createDemoTracker();
            container.innerHTML = demoTracker;
        }
    }

    initializeIntakeTab() {
        console.log('📝 Initializing Intake Form...');
        
        const container = document.getElementById('intake-form-container');
        if (container) {
            // Show demo intake form
            const demoForm = this.createDemoIntakeForm();
            container.innerHTML = demoForm;
        }
    }

    initializeChatTab() {
        console.log('🤖 Initializing Legal Assistant...');
        
        const container = document.getElementById('legal-chat-container');
        if (container) {
            // Show demo chat interface
            const demoChat = this.createDemoChat();
            container.innerHTML = demoChat;
        }
    }

    createDemoTracker() {
        return `
            <div class="demo-tracker" style="background: white; border-radius: var(--card-radius); box-shadow: var(--card-shadow); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, var(--juribank-blue), #2563eb); color: white; padding: var(--space-6);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-4);">
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: var(--space-1);">Claim #JB-2024-0156</h3>
                            <p style="opacity: 0.8; font-size: 0.875rem;">Employment Dispute - Wrongful Dismissal</p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.5rem; font-weight: 700;">75%</div>
                            <div style="font-size: 0.75rem; opacity: 0.8;">Complete</div>
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); border-radius: 4px; height: 8px;">
                        <div style="background: white; height: 8px; width: 75%; border-radius: 4px; transition: width 0.3s ease;"></div>
                    </div>
                </div>

                <!-- Timeline -->
                <div style="padding: var(--space-6);">
                    <div style="space-y: var(--space-4);">
                        <div style="display: flex; align-items: center; space-x: var(--space-4); padding: var(--space-4); background: var(--green-50); border-radius: 8px; border-left: 4px solid var(--success);">
                            <div style="flex-shrink: 0; width: 24px; height: 24px; background: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">✓</div>
                            <div style="flex: 1;">
                                <h4 style="font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-1);">Case Review Completed</h4>
                                <p style="font-size: 0.875rem; color: var(--gray-600);">Initial assessment and evidence review finished</p>
                            </div>
                            <div style="text-align: right; font-size: 0.75rem; color: var(--gray-500);">Jan 15, 2024</div>
                        </div>

                        <div style="display: flex; align-items: center; space-x: var(--space-4); padding: var(--space-4); background: var(--blue-50); border-radius: 8px; border-left: 4px solid var(--juribank-blue);">
                            <div style="flex-shrink: 0; width: 24px; height: 24px; background: var(--juribank-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                                <div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: pulse 2s infinite;"></div>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-1);">Negotiation in Progress</h4>
                                <p style="font-size: 0.875rem; color: var(--gray-600);">Settlement discussions with employer underway</p>
                            </div>
                            <div style="text-align: right; font-size: 0.75rem; color: var(--gray-500);">In Progress</div>
                        </div>

                        <div style="display: flex; align-items: center; space-x: var(--space-4); padding: var(--space-4); background: var(--gray-50); border-radius: 8px; opacity: 0.6;">
                            <div style="flex-shrink: 0; width: 24px; height: 24px; border: 2px solid var(--gray-300); border-radius: 50%;"></div>
                            <div style="flex: 1;">
                                <h4 style="font-weight: 600; color: var(--gray-600); margin-bottom: var(--space-1);">Settlement Agreement</h4>
                                <p style="font-size: 0.875rem; color: var(--gray-500);">Final agreement and compensation payment</p>
                            </div>
                            <div style="text-align: right; font-size: 0.75rem; color: var(--gray-500);">Est: Feb 10</div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="margin-top: var(--space-6); display: flex; gap: var(--space-3);">
                        <button style="flex: 1; background: var(--juribank-blue); color: white; padding: var(--space-3) var(--space-4); border-radius: 8px; border: none; font-weight: 600; cursor: pointer;">📞 Call Legal Team</button>
                        <button style="flex: 1; border: 2px solid var(--gray-300); color: var(--gray-700); padding: var(--space-3) var(--space-4); border-radius: 8px; background: white; font-weight: 600; cursor: pointer;">📄 View Documents</button>
                    </div>
                </div>
            </div>
        `;
    }

    createDemoIntakeForm() {
        return `
            <div class="demo-intake" style="background: white; border-radius: var(--card-radius); box-shadow: var(--card-shadow); overflow: hidden;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, var(--juribank-gold), #d97706); color: white; padding: var(--space-6);">
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: var(--space-2);">Submit Your Legal Claim</h3>
                    <p style="opacity: 0.9;">Step 1 of 6 - Case Type Selection</p>
                    <div style="background: rgba(255,255,255,0.2); border-radius: 4px; height: 6px; margin-top: var(--space-4);">
                        <div style="background: white; height: 6px; width: 16.67%; border-radius: 4px;"></div>
                    </div>
                </div>

                <!-- Form Content -->
                <div style="padding: var(--space-6);">
                    <h4 style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-4);">What type of legal issue do you need help with?</h4>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
                        <button class="case-type-btn" onclick="selectCaseType('contract')" style="padding: var(--space-4); border: 2px solid var(--gray-200); border-radius: 8px; background: white; text-align: left; cursor: pointer; transition: all 0.2s;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">📄</div>
                            <div style="font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-1);">Contract Disputes</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Breach of contract claims</div>
                        </button>

                        <button class="case-type-btn" onclick="selectCaseType('employment')" style="padding: var(--space-4); border: 2px solid var(--gray-200); border-radius: 8px; background: white; text-align: left; cursor: pointer; transition: all 0.2s;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">👥</div>
                            <div style="font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-1);">Employment Issues</div>
                            <div style="font-size: 0.75rem; color: var(--orange-600); font-weight: 600;">Usually urgent</div>
                        </button>

                        <button class="case-type-btn" onclick="selectCaseType('debt')" style="padding: var(--space-4); border: 2px solid var(--gray-200); border-radius: 8px; background: white; text-align: left; cursor: pointer; transition: all 0.2s;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">💷</div>
                            <div style="font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-1);">Debt Recovery</div>
                            <div style="font-size: 0.75rem; color: var(--orange-600); font-weight: 600;">Usually urgent</div>
                        </button>

                        <button class="case-type-btn" onclick="selectCaseType('consumer')" style="padding: var(--space-4); border: 2px solid var(--gray-200); border-radius: 8px; background: white; text-align: left; cursor: pointer; transition: all 0.2s;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🛡️</div>
                            <div style="font-weight: 600; color: var(--gray-900); margin-bottom: var(--space-1);">Consumer Rights</div>
                            <div style="font-size: 0.75rem; color: var(--gray-600);">Faulty goods, services</div>
                        </button>
                    </div>

                    <!-- Navigation -->
                    <div style="margin-top: var(--space-8); display: flex; justify-content: between; align-items: center;">
                        <div style="display: flex; gap: 4px;">
                            <div style="width: 8px; height: 8px; background: var(--juribank-blue); border-radius: 50%;"></div>
                            <div style="width: 8px; height: 8px; background: var(--gray-300); border-radius: 50%;"></div>
                            <div style="width: 8px; height: 8px; background: var(--gray-300); border-radius: 50%;"></div>
                            <div style="width: 8px; height: 8px; background: var(--gray-300); border-radius: 50%;"></div>
                            <div style="width: 8px; height: 8px; background: var(--gray-300); border-radius: 50%;"></div>
                            <div style="width: 8px; height: 8px; background: var(--gray-300); border-radius: 50%;"></div>
                        </div>
                        <button style="background: var(--juribank-blue); color: white; padding: var(--space-3) var(--space-6); border-radius: 8px; border: none; font-weight: 600; cursor: pointer;">Next →</button>
                    </div>
                </div>
            </div>
        `;
    }

    createDemoChat() {
        return `
            <div class="demo-chat" style="background: white; border-radius: var(--card-radius); box-shadow: var(--card-shadow); height: 400px; display: flex; flex-direction: column; overflow: hidden;">
                <!-- Chat Header -->
                <div style="background: linear-gradient(135deg, var(--purple-600), var(--purple-700)); color: white; padding: var(--space-4); display: flex; align-items: center; gap: var(--space-3);">
                    <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">🤖</div>
                    <div>
                        <h3 style="font-weight: 600; margin: 0;">AI Legal Assistant</h3>
                        <p style="font-size: 0.75rem; opacity: 0.8; margin: 0;">Online • Ready to help</p>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div style="flex: 1; padding: var(--space-4); overflow-y: auto; background: var(--gray-50);">
                    <div style="margin-bottom: var(--space-4);">
                        <div style="background: white; padding: var(--space-3); border-radius: 12px; margin-bottom: var(--space-2); box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                            <div style="font-size: 0.875rem; line-height: 1.4;">Hello! I'm your AI Legal Assistant. I can help explain your legal rights in plain English. What legal question can I help you with today?</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: var(--space-1);">2:30 PM</div>
                        </div>
                    </div>

                    <div style="text-align: right; margin-bottom: var(--space-4);">
                        <div style="background: var(--juribank-blue); color: white; padding: var(--space-3); border-radius: 12px; display: inline-block; margin-bottom: var(--space-2);">
                            <div style="font-size: 0.875rem;">What are my rights if I was dismissed unfairly?</div>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gray-500);">2:31 PM</div>
                    </div>

                    <div style="margin-bottom: var(--space-4);">
                        <div style="background: white; padding: var(--space-3); border-radius: 12px; margin-bottom: var(--space-2); box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                            <div style="font-size: 0.875rem; line-height: 1.4;">If you've been unfairly dismissed, you may be entitled to:<br><br><strong>• Compensation</strong> - Up to £105,707 or 52 weeks' pay<br><strong>• Reinstatement</strong> - Getting your job back<br><strong>• Re-engagement</strong> - Similar role with employer<br><br>You have 3 months from dismissal to claim. Most cases settle through ACAS.</div>
                            <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: var(--space-1);">2:32 PM</div>
                        </div>
                    </div>

                    <!-- Quick Suggestions -->
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4);">
                        <button style="background: var(--blue-50); color: var(--juribank-blue); padding: var(--space-2) var(--space-3); border-radius: 20px; border: none; font-size: 0.75rem; cursor: pointer;">How to calculate compensation?</button>
                        <button style="background: var(--blue-50); color: var(--juribank-blue); padding: var(--space-2) var(--space-3); border-radius: 20px; border: none; font-size: 0.75rem; cursor: pointer;">Start employment claim</button>
                    </div>
                </div>

                <!-- Chat Input -->
                <div style="padding: var(--space-4); background: white; border-top: 1px solid var(--gray-200);">
                    <div style="display: flex; gap: var(--space-2);">
                        <input type="text" placeholder="Ask about your legal rights..." style="flex: 1; padding: var(--space-2) var(--space-3); border: 1px solid var(--gray-300); border-radius: 20px; font-size: 0.875rem; outline: none;">
                        <button style="background: var(--juribank-blue); color: white; padding: var(--space-2) var(--space-4); border-radius: 20px; border: none; font-weight: 600; cursor: pointer;">Send</button>
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center; margin-top: var(--space-2); font-size: 0.75rem; color: var(--gray-500);">
                        <span>💡 I provide general guidance - not formal legal advice</span>
                        <button style="color: var(--juribank-blue); background: none; border: none; font-size: 0.75rem; cursor: pointer;">Book consultation →</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupScrollBehavior() {
        // Smooth scroll to portal when accessing directly
        if (window.location.hash === '#client-portal') {
            setTimeout(() => {
                document.getElementById('client-portal')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}

// Global functions for external access
// eslint-disable-next-line no-unused-vars
function showPortalTab(tabName) {
    if (window.clientPortal) {
        window.clientPortal.showTab(tabName);
        
        // Scroll to portal
        setTimeout(() => {
            document.getElementById('client-portal')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }
}

// eslint-disable-next-line no-unused-vars
function selectCaseType(_type) {
    // Handle case type selection in demo
    const CASE_TYPE_SELECTOR = '.case-type-btn';
    document.querySelectorAll(CASE_TYPE_SELECTOR).forEach(btn => {
        const btnElement = btn;
        btnElement.style.borderColor = 'var(--gray-200)';
        btnElement.style.background = 'white';
    });
    
    const targetButton = event.target.closest(CASE_TYPE_SELECTOR);
    targetButton.style.borderColor = 'var(--juribank-blue)';
    targetButton.style.background = 'var(--blue-50)';
}

// Add CSS animations
const portalStyles = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .portal-tab:hover {
        color: var(--juribank-blue) !important;
        border-bottom-color: var(--gray-300) !important;
    }
    
    .case-type-btn:hover {
        border-color: var(--juribank-blue) !important;
        background: var(--blue-50) !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(58, 134, 255, 0.15);
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = portalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.clientPortal = new ClientPortal();
    });
} else {
    window.clientPortal = new ClientPortal();
}