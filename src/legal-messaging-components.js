/**
 * Enhanced Legal Messaging Components
 * Builds trust while maintaining clear boundaries about educational platform status
 */

class LegalMessagingSystem {
    constructor() {
        this.messages = {
            homepage: {
                primary: "Empowering Smart Legal Decisions",
                secondary: "Access financial legal pathways through our educational platform",
                detailed: `We believe everyone should have accessible ways to explore their legal options, especially in financial regulation, banking, fintech, and compliance. That's why we built this platform — to empower users with structured guidance, curated legal expertise, and automated assistance — even though we don't directly provide legal advice.`
            },
            
            trustBuilder: {
                title: "Why JuriBank Works",
                points: [
                    {
                        icon: "🎓",
                        title: "Educational Excellence", 
                        description: "Law students from top London universities provide structured guidance using current regulations and case law"
                    },
                    {
                        icon: "🔗",
                        title: "Professional Pathways",
                        description: "Clear connections to qualified solicitors when you need formal legal representation"
                    },
                    {
                        icon: "📊",
                        title: "Smart Navigation",
                        description: "Technology-driven tools help you understand your options and make informed decisions about next steps"
                    },
                    {
                        icon: "⚡",
                        title: "Faster Understanding",
                        description: "Get clarity on your legal position before investing in expensive professional consultations"
                    }
                ]
            },

            disclaimers: {
                concise: "Educational guidance platform • Not legal advice • Professional referrals available",
                
                professional: {
                    title: "Professional Platform Standards",
                    content: `JuriBank is a specialized educational technology platform that connects users with structured legal information and professional pathways. While we don't provide legal advice, we excel at helping users understand their options, prepare documentation, and connect with qualified professionals when needed.`,
                    badge: "🛡️ Professional Platform"
                },

                boundary: {
                    title: "What We Do vs. What Lawyers Do",
                    comparison: [
                        {
                            us: "Help you understand legal concepts and options",
                            lawyers: "Provide specific legal advice for your situation"
                        },
                        {
                            us: "Guide you through legal processes and documentation",
                            lawyers: "Represent you in formal legal proceedings"
                        },
                        {
                            us: "Connect you with qualified professionals",
                            lawyers: "Take responsibility for your legal representation"
                        },
                        {
                            us: "Provide educational resources and decision frameworks",
                            lawyers: "Make legal strategies and tactical decisions"
                        }
                    ]
                }
            }
        };
    }

    // Main homepage messaging component
    renderHomepageMessaging() {
        return `
            <div class="legal-messaging-hero">
                <div class="messaging-container">
                    <div class="primary-message">
                        <h2 class="hero-title">${this.messages.homepage.primary}</h2>
                        <p class="hero-subtitle">${this.messages.homepage.secondary}</p>
                    </div>
                    
                    <div class="detailed-explanation">
                        <p class="explanation-text">${this.messages.homepage.detailed}</p>
                    </div>
                    
                    <div class="trust-indicators">
                        <div class="indicator">
                            <span class="indicator-icon">✓</span>
                            <span>Educational Platform</span>
                        </div>
                        <div class="indicator">
                            <span class="indicator-icon">✓</span>
                            <span>Professional Connections</span>
                        </div>
                        <div class="indicator">
                            <span class="indicator-icon">✓</span>
                            <span>Current Legal Information</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Trust-building section
    renderTrustBuilder() {
        return `
            <div class="trust-builder-section">
                <h3 class="section-title">${this.messages.trustBuilder.title}</h3>
                <div class="trust-points-grid">
                    ${this.messages.trustBuilder.points.map(point => `
                        <div class="trust-point">
                            <div class="point-icon">${point.icon}</div>
                            <h4 class="point-title">${point.title}</h4>
                            <p class="point-description">${point.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Professional disclaimer badge
    renderProfessionalBadge() {
        return `
            <div class="professional-badge">
                <div class="badge-content">
                    <span class="badge-icon">${this.messages.disclaimers.professional.badge.split(' ')[0]}</span>
                    <div class="badge-text">
                        <div class="badge-title">${this.messages.disclaimers.professional.title}</div>
                        <div class="badge-subtitle">Law Student Led • Professional Standards</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Comparison table showing boundaries
    renderBoundaryComparison() {
        return `
            <div class="boundary-comparison">
                <h4 class="comparison-title">${this.messages.disclaimers.boundary.title}</h4>
                <div class="comparison-table">
                    <div class="comparison-header">
                        <div class="header-us">What JuriBank Does</div>
                        <div class="header-lawyers">What Lawyers Do</div>
                    </div>
                    ${this.messages.disclaimers.boundary.comparison.map(item => `
                        <div class="comparison-row">
                            <div class="comparison-us">
                                <span class="comparison-icon">🎓</span>
                                ${item.us}
                            </div>
                            <div class="comparison-lawyers">
                                <span class="comparison-icon">⚖️</span>
                                ${item.lawyers}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Floating disclaimer tooltip
    renderFloatingDisclaimer() {
        return `
            <div class="floating-disclaimer" id="floating-disclaimer">
                <div class="disclaimer-content">
                    <button class="disclaimer-toggle" onclick="this.parentElement.parentElement.classList.toggle('expanded')">
                        <span class="toggle-icon">💡</span>
                        <span class="toggle-text">Platform Info</span>
                    </button>
                    <div class="disclaimer-expanded">
                        <p class="disclaimer-text">${this.messages.disclaimers.concise}</p>
                        <div class="disclaimer-actions">
                            <button class="learn-more-btn" onclick="this.openLegalInfoModal()">Learn More</button>
                            <button class="find-lawyer-btn" onclick="this.openLawyerDirectory()">Find Qualified Lawyers</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Modal with detailed explanation
    renderLegalInfoModal() {
        return `
            <div class="legal-info-modal-overlay" id="legal-info-modal">
                <div class="legal-info-modal">
                    <div class="modal-header">
                        <h3>Understanding JuriBank's Role</h3>
                        <button class="close-modal" onclick="this.closeLegalInfoModal()">&times;</button>
                    </div>
                    
                    <div class="modal-content">
                        <div class="platform-explanation">
                            <h4>Our Educational Approach</h4>
                            <p>${this.messages.disclaimers.professional.content}</p>
                        </div>
                        
                        ${this.renderBoundaryComparison()}
                        
                        <div class="value-proposition">
                            <h4>Why Use JuriBank Before Seeing a Lawyer?</h4>
                            <ul class="value-list">
                                <li>Understand your legal position and options clearly</li>
                                <li>Prepare better questions and documentation</li>
                                <li>Make informed decisions about whether you need formal legal representation</li>
                                <li>Save time and money on initial consultations</li>
                                <li>Access immediate guidance while considering your next steps</li>
                            </ul>
                        </div>
                        
                        <div class="professional-pathway">
                            <h4>When You Need a Lawyer</h4>
                            <p>We'll help you identify when professional legal representation is necessary and connect you with qualified solicitors who specialize in your type of case.</p>
                            <button class="cta-button">Find Qualified Legal Professionals</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Visual presentation options
    getVisualPresentationOptions() {
        return {
            badge: {
                name: "Professional Badge",
                description: "Prominent badge in header/hero area establishing credibility",
                pros: ["Always visible", "Builds immediate trust", "Professional appearance"],
                cons: ["Takes up space", "Might feel promotional"],
                implementation: "Fixed position in site header"
            },
            
            tooltip: {
                name: "Smart Tooltip System", 
                description: "Context-sensitive tooltips that appear on key pages/actions",
                pros: ["Non-intrusive", "Contextual", "Interactive"],
                cons: ["Might be missed", "Requires user action"],
                implementation: "Floating widget with expand/collapse"
            },
            
            modal: {
                name: "Information Modal",
                description: "Detailed modal accessible from main navigation",
                pros: ["Comprehensive explanation", "Professional presentation", "Easy to find"],
                cons: ["Requires click to access", "Not always visible"],
                implementation: "Link in main nav + periodic reminders"
            },
            
            section: {
                name: "Dedicated Homepage Section",
                description: "Prominent section on homepage explaining platform value",
                pros: ["Detailed explanation", "Always visible to new users", "SEO benefits"],
                cons: ["Makes homepage longer", "Might seem defensive"],
                implementation: "After hero section, before features"
            },
            
            footer: {
                name: "Enhanced Footer Disclaimer",
                description: "Comprehensive footer with clear explanations and links",
                pros: ["Expected location", "Detailed space", "Always accessible"],
                cons: ["Often ignored", "Less prominent"],
                implementation: "Enhanced footer with multiple sections"
            },
            
            sidebar: {
                name: "Persistent Sidebar Widget",
                description: "Collapsible sidebar widget with platform information",
                pros: ["Always available", "Doesn't interrupt flow", "Can be dismissed"],
                cons: ["Mobile challenges", "Might feel cluttered"],
                implementation: "Fixed position sidebar with minimize option"
            }
        };
    }

    // Initialize all components
    init() {
        this.addCSS();
        this.addEventListeners();
    }

    addCSS() {
        const css = `
            <style>
            .legal-messaging-hero {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 60px 0;
                text-align: center;
            }

            .messaging-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 0 20px;
            }

            .hero-title {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
                line-height: 1.2;
            }

            .hero-subtitle {
                font-size: 1.25rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }

            .explanation-text {
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }

            .trust-indicators {
                display: flex;
                justify-content: center;
                gap: 2rem;
                flex-wrap: wrap;
            }

            .indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
            }

            .indicator-icon {
                color: #10b981;
                font-weight: bold;
            }

            .trust-builder-section {
                padding: 4rem 2rem;
                max-width: 1200px;
                margin: 0 auto;
            }

            .section-title {
                text-align: center;
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 3rem;
                color: #1f2937;
            }

            .trust-points-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
            }

            .trust-point {
                text-align: center;
                padding: 2rem;
                border-radius: 8px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
            }

            .point-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .point-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #1f2937;
            }

            .point-description {
                color: #6b7280;
                line-height: 1.6;
            }

            .professional-badge {
                background: white;
                border: 2px solid #3b82f6;
                border-radius: 8px;
                padding: 1rem;
                margin: 1rem 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .badge-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .badge-icon {
                font-size: 2rem;
            }

            .badge-title {
                font-weight: 600;
                color: #1f2937;
            }

            .badge-subtitle {
                font-size: 0.875rem;
                color: #6b7280;
            }

            .boundary-comparison {
                margin: 2rem 0;
            }

            .comparison-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #1f2937;
            }

            .comparison-table {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
            }

            .comparison-header {
                display: grid;
                grid-template-columns: 1fr 1fr;
                background: #f8fafc;
            }

            .header-us, .header-lawyers {
                padding: 1rem;
                font-weight: 600;
                text-align: center;
                color: #1f2937;
            }

            .header-us {
                border-right: 1px solid #e2e8f0;
                background: #eff6ff;
            }

            .comparison-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                border-top: 1px solid #e2e8f0;
            }

            .comparison-us, .comparison-lawyers {
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .comparison-us {
                border-right: 1px solid #e2e8f0;
                background: #f8fafc;
            }

            .comparison-icon {
                flex-shrink: 0;
            }

            .floating-disclaimer {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 300px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border: 1px solid #e2e8f0;
            }

            .disclaimer-toggle {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: none;
                border: none;
                cursor: pointer;
                width: 100%;
                text-align: left;
                font-weight: 500;
            }

            .disclaimer-expanded {
                display: none;
                padding: 0 1rem 1rem;
                border-top: 1px solid #e2e8f0;
            }

            .floating-disclaimer.expanded .disclaimer-expanded {
                display: block;
            }

            .disclaimer-text {
                font-size: 0.875rem;
                color: #6b7280;
                margin-bottom: 1rem;
                line-height: 1.5;
            }

            .disclaimer-actions {
                display: flex;
                gap: 0.5rem;
            }

            .learn-more-btn, .find-lawyer-btn {
                padding: 0.5rem 1rem;
                border: 1px solid #d1d5db;
                background: white;
                border-radius: 4px;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .learn-more-btn:hover, .find-lawyer-btn:hover {
                background: #f3f4f6;
            }

            .legal-info-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }

            .legal-info-modal {
                background: white;
                border-radius: 8px;
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e2e8f0;
            }

            .modal-header h3 {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1f2937;
            }

            .close-modal {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
            }

            .modal-content {
                padding: 1.5rem;
            }

            .modal-content h4 {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #1f2937;
            }

            .modal-content p {
                margin-bottom: 1rem;
                line-height: 1.6;
                color: #4b5563;
            }

            .value-list {
                list-style: none;
                padding: 0;
            }

            .value-list li {
                padding: 0.5rem 0;
                position: relative;
                padding-left: 2rem;
            }

            .value-list li:before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: bold;
            }

            .cta-button {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .cta-button:hover {
                background: #2563eb;
            }

            @media (max-width: 768px) {
                .hero-title {
                    font-size: 2rem;
                }
                
                .trust-indicators {
                    flex-direction: column;
                    align-items: center;
                }
                
                .comparison-header, .comparison-row {
                    grid-template-columns: 1fr;
                }
                
                .comparison-us {
                    border-right: none;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .floating-disclaimer {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', css);
    }

    addEventListeners() {
        // Add global methods for modal handling
        window.openLegalInfoModal = () => {
            document.getElementById('legal-info-modal').style.display = 'flex';
        };

        window.closeLegalInfoModal = () => {
            document.getElementById('legal-info-modal').style.display = 'none';
        };

        window.openLawyerDirectory = () => {
            // Implement lawyer directory
            alert('Opening qualified lawyer directory...');
        };
    }
}

// Initialize the messaging system
window.LegalMessaging = new LegalMessagingSystem();
window.LegalMessaging.init();

// Export components for use
window.LegalMessagingComponents = {
    renderHomepageMessaging: () => window.LegalMessaging.renderHomepageMessaging(),
    renderTrustBuilder: () => window.LegalMessaging.renderTrustBuilder(),
    renderProfessionalBadge: () => window.LegalMessaging.renderProfessionalBadge(),
    renderFloatingDisclaimer: () => window.LegalMessaging.renderFloatingDisclaimer(),
    renderLegalInfoModal: () => window.LegalMessaging.renderLegalInfoModal(),
    getVisualOptions: () => window.LegalMessaging.getVisualPresentationOptions()
};