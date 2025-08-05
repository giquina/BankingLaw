/**
 * AI Legal Assistant Chatbot
 * Instant guidance chatbot for legal questions with pre-built knowledge base
 */

class AILegalAssistant {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.isOpen = false;
        this.conversationHistory = [];
        this.knowledgeBase = this.buildKnowledgeBase();
        this.init();
    }

    buildKnowledgeBase() {
        return {
            // Banking Issues
            'bank charges': {
                keywords: ['bank charges', 'overdraft', 'fees', 'unfair charges', 'excessive fees'],
                response: `**Bank Charges Assessment:**

🔍 **Common Unfair Charges:**
• Overdraft fees over £6/day
• Unpaid item fees over £12
• Account maintenance fees without clear benefit

📋 **Next Steps:**
1. Request 6 years of statements from your bank
2. Calculate total charges using our calculator
3. Submit formal complaint if charges exceed £100

⚖️ **Your Rights:** Banks must justify charges as reasonable. FCA rules limit overdraft costs.

Would you like me to help you calculate potential refunds or guide you through the complaint process?`,
                followUp: ['calculate refund', 'complaint process', 'bank statements']
            },

            'ppi': {
                keywords: ['ppi', 'payment protection', 'insurance', 'loan insurance', 'credit card insurance'],
                response: `**Payment Protection Insurance (PPI) Check:**

❓ **Were You Sold PPI?**
• Added to loans, credit cards, mortgages
• Monthly premiums for unemployment/sickness cover
• Often sold without clear explanation

💰 **Average Refunds:** £1,000-£3,000 including interest

📅 **Deadline:** No deadline for complaints (despite what banks say)

🎯 **High Success Rate:** 78% of PPI complaints succeed

Would you like help checking if you had PPI or guidance on making a claim?`,
                followUp: ['check ppi', 'make claim', 'success rates']
            },

            'complaint process': {
                keywords: ['complaint', 'how to complain', 'ombudsman', 'formal complaint'],
                response: `**Formal Complaint Process:**

📝 **Step 1: Complain to Bank (8 weeks)**
• Use our complaint letter template
• Include all evidence and calculations
• Request written response within 8 weeks

⚖️ **Step 2: Financial Ombudsman (If No Resolution)**
• Free service for consumers
• Independent review of your case
• Legally binding decisions

📊 **Success Rates by Claim Type:**
• Bank charges: 65%
• PPI: 78% 
• Packaged accounts: 70%

Would you like help writing your complaint letter or understanding ombudsman process?`,
                followUp: ['complaint letter', 'ombudsman process', 'evidence needed']
            },

            'packaged accounts': {
                keywords: ['packaged account', 'monthly fees', 'account benefits', 'premium account'],
                response: `**Packaged Account Assessment:**

💳 **What Are Packaged Accounts?**
• Monthly fee (typically £10-£25)
• Include insurance/benefits
• Often unnecessary for most people

🚩 **Red Flags for Claims:**
• Sold without explaining alternatives
• Benefits you couldn't use (e.g., travel insurance if you don't travel)
• Duplicate insurance you already had

💷 **Potential Refunds:** All monthly fees + 8% interest

📋 **Evidence Needed:**
• Bank statements showing monthly charges
• Original sales conversation records
• Proof of unused benefits

Would you like help calculating potential refunds or guidance on making a complaint?`,
                followUp: ['calculate refund', 'make complaint', 'evidence gathering']
            },

            'investment advice': {
                keywords: ['investment', 'pension advice', 'financial advice', 'portfolio', 'poor advice'],
                response: `**Investment/Pension Mis-selling Assessment:**

⚠️ **Common Issues:**
• High-risk investments for cautious investors
• Excessive fees not disclosed
• Unsuitable pension transfers
• Lack of regular reviews

💰 **Compensation:** Difference between current value and what you should have

📋 **Evidence Needed:**
• Original advice documents
• Risk assessments
• Portfolio statements
• Communication records

⏰ **Time Limits:** 6 years from advice or 3 years from when you knew of problem

This area requires specialist legal help. Would you like me to connect you with qualified investment law specialists?`,
                followUp: ['find specialist', 'evidence gathering', 'time limits']
            },

            'find specialist': {
                keywords: ['find lawyer', 'find solicitor', 'legal help', 'professional help'],
                response: `**Finding the Right Legal Professional:**

🎯 **Our Specialist Network:**
• SRA-regulated solicitors
• Specific expertise in your claim type
• Track record in financial services law

🔍 **Matching Process:**
1. Complete our professional matching quiz
2. We identify 2-3 suitable specialists
3. Warm introduction with your case details
4. Choose your preferred solicitor

💡 **Why This Works Better:**
• You arrive prepared, not starting from scratch
• Better initial consultations
• More accurate fee estimates

Would you like to start our professional matching quiz or learn more about our network?`,
                followUp: ['matching quiz', 'network info', 'consultation process']
            },

            'eligibility': {
                keywords: ['eligible', 'qualify', 'do i have a case', 'worth claiming'],
                response: `**Quick Eligibility Check:**

✅ **You May Have a Strong Case If:**
• Bank charges exceed £100 in total
• You had PPI on any credit product
• Monthly account fees for unused benefits
• Poor investment advice causing losses

⚡ **Quick Checks:**
• Bank charges: Look for overdraft/unpaid item fees
• PPI: Check old credit agreements for insurance
• Packaged accounts: Monthly fees on statements
• Investments: Losses from unsuitable advice

📊 **Success Indicators:**
• Clear paper trail of charges/advice
• Charges/losses over £500
• Within time limits (usually 6 years)

Would you like me to guide you through a detailed assessment for your specific situation?`,
                followUp: ['detailed assessment', 'calculate potential', 'time limits']
            },

            'time limits': {
                keywords: ['time limit', 'too late', 'deadline', 'statute of limitations', 'expired'],
                response: `**Time Limits for Financial Claims:**

⏰ **Good News - Most Claims Still Valid:**
• **Bank charges:** 6 years from when charged
• **PPI:** No deadline despite what banks say!
• **Investment advice:** 6 years from advice OR 3 years from when you knew of problem
• **Packaged accounts:** 6 years from when charged

📅 **Key Points:**
• Many people think it's "too late" but aren't
• Time limits can be extended in certain circumstances
• Deliberate concealment resets the clock

✅ **Check Your Dates:**
Even if you think you're too late, it's worth checking. We've helped people recover money on claims they thought were expired.

Would you like me to help you check if your specific claim is still valid?`,
                followUp: ['check eligibility', 'bank charges', 'ppi', 'investment advice']
            },

            'mortgage issues': {
                keywords: ['mortgage', 'home loan', 'repossession', 'mortgage broker', 'home finance'],
                response: `**Mortgage Issues Assessment:**

🏠 **Common Mortgage Problems:**
• Mis-sold mortgage products
• Poor advice from mortgage brokers
• Unfair charges and fees
• Repossession proceedings
• Interest rate mis-selling

💡 **Your Rights:**
• Brokers must give suitable advice
• Lenders must treat customers fairly
• Clear information about costs and risks
• Right to complain to ombudsman

📋 **Evidence Needed:**
• Original mortgage documents
• Advice records from broker
• Income/affordability assessments
• Communication records

This area often requires specialist legal help. Would you like me to connect you with mortgage law specialists?`,
                followUp: ['find specialist', 'complaint process', 'evidence gathering']
            },

            'evidence gathering': {
                keywords: ['evidence', 'documents', 'proof', 'statements', 'records'],
                response: `**Gathering Evidence for Your Claim:**

📂 **Essential Documents:**
• **Bank statements:** Last 6 years if possible
• **Original agreements:** Loan/credit card/insurance documents
• **Correspondence:** Letters, emails with bank/advisor
• **Advice records:** Notes from meetings, phone calls

📝 **How to Get Records:**
• **Subject Access Request:** Legal right to your data
• **Bank statements:** Usually £10 per year requested
• **Call recordings:** Banks keep these for compliance
• **Third-party records:** From brokers, advisors

🔍 **What to Look For:**
• Charges that seem excessive
• Insurance you didn't want/need
• Advice that doesn't match your situation
• Missing explanations or warnings

💡 **JuriBank Premium** includes document request templates and tracking tools.

Would you like help with subject access requests or organizing your evidence?`,
                followUp: ['subject access request', 'organize evidence', 'premium features']
            },

            'subject access request': {
                keywords: ['subject access', 'data request', 'sar', 'personal data'],
                response: `**Subject Access Request (SAR) Guide:**

📋 **What You Can Request:**
• All personal data they hold about you
• Call recordings of sales conversations
• Internal notes and assessments
• Decision-making records
• Communication logs

💷 **Cost:** Usually free (max £10 for complex requests)
⏰ **Response Time:** 30 days (they can extend to 60 days)

📝 **How to Request:**
1. Use our SAR template letter
2. Be specific about what you want
3. Include ID verification
4. Send by recorded delivery
5. Keep copies of everything

🔍 **What This Reveals:**
Often uncovers evidence banks didn't voluntarily provide, including proof of mis-selling or poor advice.

Would you like our SAR template letter and guidance on what to request?`,
                followUp: ['sar template', 'what to request', 'follow up sar']
            },

            'default': {
                response: `I'm here to help with UK banking and financial law questions! 

**I can help you with:**
🏦 **Banking Issues:** Unfair charges, overdraft fees, account problems
💳 **PPI Claims:** Payment protection insurance refunds  
📊 **Investment Issues:** Poor financial advice, pension transfers
🏠 **Mortgage Problems:** Mis-selling, unfair charges, broker issues
⚖️ **Complaint Process:** How to complain effectively to banks and ombudsman
🔍 **Professional Help:** Connect you with specialist solicitors
📂 **Evidence Gathering:** Documents, data requests, proof collection

**Quick help options:**
• "Bank charged me unfair fees"
• "Do I have PPI?"
• "Am I too late to claim?"
• "How to make a complaint"
• "Find me a specialist lawyer"

What would you like help with today?`,
                followUp: ['bank charges', 'ppi', 'time limits', 'complaint process', 'find specialist']
            }
        };
    }

    init() {
        this.createChatWidget();
        this.addEventListeners();
    }

    createChatWidget() {
        const widget = document.createElement('div');
        widget.className = 'ai-legal-assistant';
        widget.innerHTML = `
            <div class="chat-toggle" id="chat-toggle">
                <div class="toggle-content">
                    <i class="fas fa-robot"></i>
                    <span>AI Legal Help</span>
                </div>
                <div class="notification-badge" id="notification-badge">1</div>
            </div>
            
            <div class="chat-window" id="chat-window">
                <div class="chat-header">
                    <div class="assistant-info">
                        <div class="avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="info">
                            <h4>AI Legal Assistant</h4>
                            <span class="status">Online • Instant responses</span>
                        </div>
                    </div>
                    <button class="close-chat" id="close-chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chat-messages" id="chat-messages">
                    <div class="message assistant-message">
                        <div class="avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="content">
                            <p>👋 Hi! I'm your AI Legal Assistant. I can help you understand your rights and explore your options for banking disputes, PPI claims, and financial issues.</p>
                            <p><strong>What would you like help with today?</strong></p>
                            <div class="quick-buttons">
                                <button class="quick-btn" data-query="bank charges">💰 Bank charged me unfair fees</button>
                                <button class="quick-btn" data-query="ppi">📋 Do I have PPI?</button>
                                <button class="quick-btn" data-query="packaged accounts">💳 Monthly account fees</button>
                                <button class="quick-btn" data-query="investment advice">📊 Poor investment advice</button>
                                <button class="quick-btn" data-query="complaint process">⚖️ How to make a complaint</button>
                                <button class="quick-btn" data-query="find specialist">👨‍💼 Find a lawyer</button>
                                <button class="quick-btn" data-query="eligibility">❓ Am I eligible to claim?</button>
                                <button class="quick-btn" data-query="time limits">⏰ Am I too late to claim?</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <div class="typing-indicator" id="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="input-area">
                        <input type="text" id="chat-input" placeholder="Ask about bank charges, PPI, complaints..." />
                        <button id="send-message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="disclaimer">
                        <small>AI guidance • Not legal advice • <a href="#" onclick="window.openLegalInfoModal()">Learn more</a></small>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-legal-assistant {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .chat-toggle {
                position: relative;
                background: linear-gradient(135deg, #2563eb 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 25px;
                padding: 12px 20px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
            }

            .chat-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
            }

            .toggle-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .notification-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .chat-window {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 380px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            .chat-window.open {
                display: flex;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .chat-header {
                background: linear-gradient(135deg, #2563eb 0%, #059669 100%);
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .assistant-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .avatar {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            }

            .info h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .status {
                font-size: 12px;
                opacity: 0.9;
            }

            .close-chat {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
            }

            .close-chat:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .message {
                display: flex;
                gap: 10px;
                align-items: flex-start;
            }

            .assistant-message .avatar {
                background: #f3f4f6;
                color: #2563eb;
            }

            .user-message {
                flex-direction: row-reverse;
            }

            .user-message .content {
                background: #2563eb;
                color: white;
                border-radius: 18px 4px 18px 18px;
            }

            .assistant-message .content {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 4px 18px 18px 18px;
            }

            .content {
                padding: 12px 16px;
                max-width: 80%;
                word-wrap: break-word;
            }

            .content p {
                margin: 0 0 8px 0;
                line-height: 1.5;
            }

            .content p:last-child {
                margin-bottom: 0;
            }

            .quick-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 12px;
            }

            .quick-btn {
                background: #2563eb;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .quick-btn:hover {
                background: #1d4ed8;
            }

            .follow-up-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 12px;
            }

            .follow-up-btn {
                background: white;
                color: #2563eb;
                border: 1px solid #2563eb;
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .follow-up-btn:hover {
                background: #2563eb;
                color: white;
            }

            .chat-input-container {
                border-top: 1px solid #e2e8f0;
                padding: 12px 16px;
            }

            .typing-indicator {
                display: none;
                align-items: center;
                gap: 4px;
                margin-bottom: 8px;
                color: #6b7280;
                font-size: 14px;
            }

            .typing-indicator.show {
                display: flex;
            }

            .typing-indicator span {
                width: 6px;
                height: 6px;
                background: #6b7280;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

            @keyframes typing {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-10px); }
            }

            .input-area {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            #chat-input {
                flex: 1;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                outline: none;
            }

            #chat-input:focus {
                border-color: #2563eb;
            }

            #send-message {
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }

            #send-message:hover {
                background: #1d4ed8;
            }

            .disclaimer {
                margin-top: 8px;
                text-align: center;
                color: #6b7280;
            }

            .disclaimer a {
                color: #2563eb;
                text-decoration: none;
            }

            .disclaimer a:hover {
                text-decoration: underline;
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .ai-legal-assistant {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                }
                
                .chat-window {
                    width: 100%;
                    height: 70vh;
                    bottom: 60px;
                    left: 0;
                    right: 0;
                }
                
                .chat-toggle {
                    margin: 0 auto;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addEventListeners() {
        const toggle = document.getElementById('chat-toggle');
        const closeBtn = document.getElementById('close-chat');
        const sendBtn = document.getElementById('send-message');
        const input = document.getElementById('chat-input');

        toggle.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.closeChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {this.sendMessage();}
        });

        // Quick button handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn') || e.target.classList.contains('follow-up-btn')) {
                const query = e.target.dataset.query || e.target.textContent;
                this.processUserMessage(query);
            }
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const badge = document.getElementById('notification-badge');
        
        if (this.isOpen) {
            this.closeChat();
        } else {
            chatWindow.classList.add('open');
            badge.style.display = 'none';
            this.isOpen = true;
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.remove('open');
        this.isOpen = false;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            input.value = '';
            this.processUserMessage(message);
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message user-message';
        messageEl.innerHTML = `
            <div class="content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    addAssistantMessage(content, followUpButtons = []) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message assistant-message';
        
        let followUpHtml = '';
        if (followUpButtons.length > 0) {
            followUpHtml = `
                <div class="follow-up-buttons">
                    ${followUpButtons.map(btn => `
                        <button class="follow-up-btn" data-query="${btn}">${btn}</button>
                    `).join('')}
                </div>
            `;
        }
        
        messageEl.innerHTML = `
            <div class="avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="content">
                ${this.formatResponse(content)}
                ${followUpHtml}
            </div>
        `;
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    processUserMessage(message) {
        this.showTyping();
        
        // Simulate processing delay
        setTimeout(() => {
            this.hideTyping();
            const response = this.generateResponse(message);
            this.addAssistantMessage(response.text, response.followUp);
            
            // Add to conversation history
            this.conversationHistory.push({
                user: message,
                assistant: response.text,
                timestamp: new Date()
            });
        }, 1000 + Math.random() * 1000); // 1-2 second delay
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, data] of Object.entries(this.knowledgeBase)) {
            if (key !== 'default' && data.keywords.some(keyword => 
                lowerMessage.includes(keyword.toLowerCase())
            )) {
                return {
                    text: data.response,
                    followUp: data.followUp || []
                };
            }
        }
        
        // Context-aware responses based on conversation history
        if (this.conversationHistory.length > 0) {
            const lastResponse = this.conversationHistory[this.conversationHistory.length - 1];
            
            if (lowerMessage.includes('yes') || lowerMessage.includes('help')) {
                if (lastResponse.assistant.includes('Bank Charges')) {
                    return this.knowledgeBase['bank charges'];
                }
            }
        }
        
        // Default response
        return {
            text: this.knowledgeBase.default.response,
            followUp: this.knowledgeBase.default.followUp || []
        };
    }

    formatResponse(text) {
        // Convert markdown-style formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    showTyping() {
        document.getElementById('typing-indicator').classList.add('show');
    }

    hideTyping() {
        document.getElementById('typing-indicator').classList.remove('show');
    }

    scrollToBottom() {
        const container = document.getElementById('chat-messages');
        container.scrollTop = container.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public methods for integration
    openChat() {
        if (!this.isOpen) {
            this.toggleChat();
        }
    }

    sendPredefinedMessage(message) {
        this.openChat();
        setTimeout(() => {
            this.processUserMessage(message);
        }, 500);
    }
}

// Initialize the AI Legal Assistant
document.addEventListener('DOMContentLoaded', function() {
    window.aiLegalAssistant = new AILegalAssistant('ai-assistant-container');
    
    // Global function to open chat with specific message
    window.openAIChat = function(message = null) {
        if (message) {
            window.aiLegalAssistant.sendPredefinedMessage(message);
        } else {
            window.aiLegalAssistant.openChat();
        }
    };
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AILegalAssistant;
}