/**
 * JuriBank Interactive Tools
 * Embeddable components for eligibility assessment, refund calculator, and next steps guide
 * Educational platform for law students helping users understand their legal options
 */

class JuriBankTools {
    constructor() {
        this.assessmentData = {};
        this.currentStep = 1;
        this.calculatorData = {};
        this.modals = {};
        
        this.init();
    }

    init() {
        this.createModalContainer();
        this.bindEventListeners();
        this.loadStyles();
    }

    loadStyles() {
        const styles = `
            .juribank-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 1rem;
            }
            
            .juribank-modal-content {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .juribank-modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .juribank-modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .juribank-question-card {
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .juribank-question-card:hover {
                border-color: #3b82f6;
                background: #eff6ff;
            }
            
            .juribank-question-card.selected {
                border-color: #2563eb;
                background: #dbeafe;
            }
            
            .juribank-btn-primary {
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                border: none;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-family: inherit;
            }
            
            .juribank-btn-primary:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            }
            
            .juribank-btn-primary:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .juribank-btn-secondary {
                background: white;
                color: #2563eb;
                padding: 0.75rem 1.5rem;
                border: 2px solid #2563eb;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-family: inherit;
            }
            
            .juribank-btn-secondary:hover {
                background: #2563eb;
                color: white;
            }
            
            .juribank-step-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 2rem;
            }
            
            .juribank-step-dot {
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 0.5rem;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .juribank-step-dot.active {
                background: #2563eb;
                color: white;
            }
            
            .juribank-step-dot.completed {
                background: #059669;
                color: white;
            }
            
            .juribank-step-dot.pending {
                background: #e5e7eb;
                color: #6b7280;
            }
            
            .juribank-step-line {
                width: 2rem;
                height: 2px;
                background: #e5e7eb;
            }
            
            .juribank-result-card {
                background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
                border: 2px solid #22c55e;
                border-radius: 1rem;
                padding: 2rem;
                margin-top: 1.5rem;
            }
            
            .juribank-calculator-input {
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;
                font-size: 1.125rem;
                transition: all 0.3s ease;
                width: 100%;
                font-family: inherit;
            }
            
            .juribank-calculator-input:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            
            .juribank-estimate-display {
                background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
                color: white;
                padding: 1.5rem;
                border-radius: 1rem;
                text-align: center;
                margin: 1rem 0;
            }
            
            .juribank-fade-in {
                animation: juriBankFadeIn 0.5s ease-in;
            }
            
            @keyframes juriBankFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .juribank-hidden { display: none !important; }
            
            .juribank-grid {
                display: grid;
                gap: 1rem;
            }
            
            .juribank-grid-cols-2 {
                grid-template-columns: repeat(2, 1fr);
            }
            
            @media (max-width: 768px) {
                .juribank-grid-cols-2 {
                    grid-template-columns: 1fr;
                }
                
                .juribank-modal-content {
                    padding: 1rem;
                    margin: 0.5rem;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    createModalContainer() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'juribank-modal-container';
        document.body.appendChild(this.modalContainer);
    }

    bindEventListeners() {
        // Find and bind to existing tool buttons in the homepage
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) {return;}
            
            const buttonText = button.textContent.trim();
            
            if (buttonText.includes('Start Assessment') || buttonText.includes('Am I Eligible')) {
                e.preventDefault();
                this.openEligibilityTool();
            } else if (buttonText.includes('Calculate') || buttonText.includes('Refund Calculator')) {
                e.preventDefault();
                this.openCalculatorTool();
            } else if (buttonText.includes('Get My Plan') || buttonText.includes('Next Steps')) {
                e.preventDefault();
                this.openGuideTool();
            }
        });
    }

    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'juribank-modal';
        modal.innerHTML = `
            <div class="juribank-modal-content">
                <button class="juribank-modal-close">&times;</button>
                ${content}
            </div>
        `;
        
        // Close modal functionality
        modal.querySelector('.juribank-modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        return modal;
    }

    closeModal(modal) {
        modal.remove();
    }

    openEligibilityTool() {
        const content = `
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Am I Eligible for a Refund?</h2>
                <p class="text-gray-600">Quick assessment to check if you have a valid claim</p>
            </div>

            <div class="juribank-step-indicator">
                <div class="juribank-step-dot active" id="step-1-dot">1</div>
                <div class="juribank-step-line"></div>
                <div class="juribank-step-dot pending" id="step-2-dot">2</div>
                <div class="juribank-step-line"></div>
                <div class="juribank-step-dot pending" id="step-3-dot">3</div>
                <div class="juribank-step-line"></div>
                <div class="juribank-step-dot pending" id="step-4-dot">4</div>
            </div>

            <div id="assessment-content">
                ${this.getStepContent(1)}
            </div>
        `;
        
        const modal = this.createModal(content);
        this.modalContainer.appendChild(modal);
        
        // Reset assessment state
        this.assessmentData = {};
        this.currentStep = 1;
    }

    getStepContent(stepNumber) {
        switch (stepNumber) {
            case 1:
                return `
                    <div id="step-1">
                        <h3 class="text-xl font-semibold mb-4">What type of claim do you think you have?</h3>
                        <div class="juribank-grid juribank-grid-cols-2">
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('claimType', 'bankCharges')">
                                <h4 class="font-semibold mb-2">Bank Charges</h4>
                                <p class="text-gray-600 text-sm">Overdraft fees, late payment charges, admin fees</p>
                            </div>
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('claimType', 'ppi')">
                                <h4 class="font-semibold mb-2">Payment Protection Insurance (PPI)</h4>
                                <p class="text-gray-600 text-sm">Insurance sold with loans, credit cards, mortgages</p>
                            </div>
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('claimType', 'packagedAccount')">
                                <h4 class="font-semibold mb-2">Packaged Account Fees</h4>
                                <p class="text-gray-600 text-sm">Monthly fees for account benefits you didn't want</p>
                            </div>
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('claimType', 'investmentAdvice')">
                                <h4 class="font-semibold mb-2">Poor Investment Advice</h4>
                                <p class="text-gray-600 text-sm">Financial losses from unsuitable advice</p>
                            </div>
                        </div>
                        <div class="text-center mt-6">
                            <button class="juribank-btn-primary" onclick="juriBankTools.nextStep()" id="step-1-next" disabled>
                                Continue <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                `;
            
            case 2:
                return `
                    <div id="step-2">
                        <h3 class="text-xl font-semibold mb-4">When did this happen?</h3>
                        <div class="juribank-grid juribank-grid-cols-2">
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('timeline', 'recent')">
                                <h4 class="font-semibold mb-2">Within the last 6 years</h4>
                                <p class="text-gray-600 text-sm">Recent issues are often easier to claim</p>
                            </div>
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('timeline', 'older')">
                                <h4 class="font-semibold mb-2">More than 6 years ago</h4>
                                <p class="text-gray-600 text-sm">May still be claimable in some circumstances</p>
                            </div>
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('timeline', 'ongoing')">
                                <h4 class="font-semibold mb-2">Still happening now</h4>
                                <p class="text-gray-600 text-sm">Current issues should be addressed immediately</p>
                            </div>
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('timeline', 'unsure')">
                                <h4 class="font-semibold mb-2">I'm not sure</h4>
                                <p class="text-gray-600 text-sm">We can help you figure this out</p>
                            </div>
                        </div>
                        <div class="flex justify-between mt-6">
                            <button class="juribank-btn-secondary" onclick="juriBankTools.previousStep()">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button class="juribank-btn-primary" onclick="juriBankTools.nextStep()" id="step-2-next" disabled>
                                Continue <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                `;
            
            case 3:
                return `
                    <div id="step-3">
                        <h3 class="text-xl font-semibold mb-4">Do you have any of these documents?</h3>
                        <div class="space-y-3">
                            <label class="juribank-question-card flex items-center cursor-pointer">
                                <input type="checkbox" name="docs" value="statements" class="mr-3">
                                <div>
                                    <h4 class="font-semibold">Bank statements</h4>
                                    <p class="text-gray-600 text-sm">Showing charges or payments</p>
                                </div>
                            </label>
                            <label class="juribank-question-card flex items-center cursor-pointer">
                                <input type="checkbox" name="docs" value="contracts" class="mr-3">
                                <div>
                                    <h4 class="font-semibold">Original contracts or agreements</h4>
                                    <p class="text-gray-600 text-sm">Loan agreements, credit card terms, etc.</p>
                                </div>
                            </label>
                            <label class="juribank-question-card flex items-center cursor-pointer">
                                <input type="checkbox" name="docs" value="correspondence" class="mr-3">
                                <div>
                                    <h4 class="font-semibold">Letters or emails from the bank</h4>
                                    <p class="text-gray-600 text-sm">Any communication about the issue</p>
                                </div>
                            </label>
                            <label class="juribank-question-card flex items-center cursor-pointer">
                                <input type="checkbox" name="docs" value="none" class="mr-3">
                                <div>
                                    <h4 class="font-semibold">None of the above</h4>
                                    <p class="text-gray-600 text-sm">Don't worry - we can still help</p>
                                </div>
                            </label>
                        </div>
                        <div class="flex justify-between mt-6">
                            <button class="juribank-btn-secondary" onclick="juriBankTools.previousStep()">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button class="juribank-btn-primary" onclick="juriBankTools.nextStep()" id="step-3-next">
                                Continue <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                `;
                
            case 4:
                return `
                    <div id="step-4">
                        <h3 class="text-xl font-semibold mb-4">Have you already contacted your bank about this?</h3>
                        <div class="juribank-grid juribank-grid-cols-2">
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('contacted', 'yes')">
                                <h4 class="font-semibold mb-2">Yes, I have</h4>
                                <p class="text-gray-600 text-sm">You may be ready for the next step</p>
                            </div>
                            <div class="juribank-question-card" onclick="juriBankTools.selectOption('contacted', 'no')">
                                <h4 class="font-semibold mb-2">No, not yet</h4>
                                <p class="text-gray-600 text-sm">This is usually the first step</p>
                            </div>
                        </div>
                        <div class="flex justify-between mt-6">
                            <button class="juribank-btn-secondary" onclick="juriBankTools.previousStep()">
                                <i class="fas fa-arrow-left"></i> Previous
                            </button>
                            <button class="juribank-btn-primary" onclick="juriBankTools.showResults()" id="step-4-next" disabled>
                                Get My Results <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                `;
                
            default:
                return '';
        }
    }

    selectOption(category, value) {
        this.assessmentData[category] = value;
        
        // Update UI - remove selected class from all cards in current content
        const assessmentContent = document.getElementById('assessment-content');
        assessmentContent.querySelectorAll('.juribank-question-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to clicked card
        event.currentTarget.classList.add('selected');
        
        // Enable next button
        const nextButton = document.getElementById('step-' + this.currentStep + '-next');
        if (nextButton) {
            nextButton.disabled = false;
        }
    }

    nextStep() {
        // Update step indicator
        const currentDot = document.getElementById('step-' + this.currentStep + '-dot');
        currentDot.classList.remove('active');
        currentDot.classList.add('completed');
        
        // Move to next step
        this.currentStep++;
        
        // Update step indicator for next step
        const nextDot = document.getElementById('step-' + this.currentStep + '-dot');
        if (nextDot) {
            nextDot.classList.remove('pending');
            nextDot.classList.add('active');
        }
        
        // Update content
        const assessmentContent = document.getElementById('assessment-content');
        assessmentContent.innerHTML = this.getStepContent(this.currentStep);
        assessmentContent.classList.add('juribank-fade-in');
        
        // Bind checkbox events for step 3
        if (this.currentStep === 3) {
            this.bindCheckboxEvents();
        }
    }

    previousStep() {
        // Update step indicator
        const currentDot = document.getElementById('step-' + this.currentStep + '-dot');
        currentDot.classList.remove('active');
        currentDot.classList.add('pending');
        
        // Move to previous step
        this.currentStep--;
        
        // Update step indicator for previous step
        const prevDot = document.getElementById('step-' + this.currentStep + '-dot');
        prevDot.classList.remove('completed');
        prevDot.classList.add('active');
        
        // Update content
        const assessmentContent = document.getElementById('assessment-content');
        assessmentContent.innerHTML = this.getStepContent(this.currentStep);
    }

    bindCheckboxEvents() {
        const checkboxes = document.querySelectorAll('input[name="docs"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
                const nextButton = document.getElementById('step-3-next');
                nextButton.disabled = !anyChecked;
            });
        });
    }

    showResults() {
        const resultsContent = this.generateAssessmentResults();
        const assessmentContent = document.getElementById('assessment-content');
        assessmentContent.innerHTML = resultsContent;
        assessmentContent.classList.add('juribank-fade-in');
    }

    generateAssessmentResults() {
        const claimType = this.assessmentData.claimType;
        const timeline = this.assessmentData.timeline;
        const contacted = this.assessmentData.contacted;
        
        let eligibilityScore = 0;
        let resultTitle = "You May Be Eligible!";
        let resultSubtitle = "Based on your answers, you appear to have a valid claim";
        
        // Calculate eligibility score
        if (timeline === 'recent' || timeline === 'ongoing') {eligibilityScore += 3;}
        if (timeline === 'older') {eligibilityScore += 1;}
        if (contacted === 'no') {eligibilityScore += 2;}
        if (contacted === 'yes') {eligibilityScore += 1;}
        
        // Determine result based on score
        if (eligibilityScore >= 4) {
            resultTitle = "Strong Claim Likelihood!";
            resultSubtitle = "You have a strong case for a successful claim";
        } else if (eligibilityScore >= 2) {
            resultTitle = "You May Be Eligible!";
            resultSubtitle = "Based on your answers, you appear to have a valid claim";
        } else {
            resultTitle = "Claim Possible but Challenging";
            resultSubtitle = "Your claim may face some challenges but could still be worth pursuing";
        }
        
        const detailsHtml = this.getClaimTypeDetails(claimType, timeline, contacted);
        
        return `
            <div class="juribank-result-card">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-green-600 text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">${resultTitle}</h3>
                    <p class="text-gray-600">${resultSubtitle}</p>
                </div>
                
                ${detailsHtml}

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h4 class="font-semibold text-blue-900 mb-2">
                        <i class="fas fa-lightbulb mr-2"></i>
                        What happens next?
                    </h4>
                    <p class="text-blue-800 text-sm">
                        Use our refund calculator to estimate your potential refund, then get your personalized action plan.
                    </p>
                </div>

                <div class="text-center mt-6 space-x-4">
                    <button class="juribank-btn-primary" onclick="juriBankTools.closeCurrentModalAndOpen('calculator')">
                        <i class="fas fa-calculator"></i>
                        Calculate My Refund
                    </button>
                    <button class="juribank-btn-secondary" onclick="juriBankTools.resetAssessment()">
                        <i class="fas fa-redo"></i>
                        Start Again
                    </button>
                </div>
            </div>
        `;
    }

    getClaimTypeDetails(claimType, timeline, contacted) {
        const details = {
            'bankCharges': {
                title: 'Bank Charges Claim',
                description: 'Banks must treat customers fairly with charges. Excessive fees may be refundable.',
                successRate: '65%',
                averageRefund: '£800-£2,500',
                timeframe: '3-6 months'
            },
            'ppi': {
                title: 'PPI Claim',
                description: 'PPI was often mis-sold. If you didn\'t need it or weren\'t told about it properly, you can claim.',
                successRate: '78%',
                averageRefund: '£1,200-£4,500',
                timeframe: '4-8 months'
            },
            'packagedAccount': {
                title: 'Packaged Account Claim',
                description: 'If you paid for benefits you didn\'t want or use, you may be entitled to a refund.',
                successRate: '72%',
                averageRefund: '£600-£2,000',
                timeframe: '3-5 months'
            },
            'investmentAdvice': {
                title: 'Investment Advice Claim',
                description: 'If advice was unsuitable for your circumstances, you may be able to claim compensation.',
                successRate: '55%',
                averageRefund: '£3,000-£15,000',
                timeframe: '6-12 months'
            }
        };
        
        const detail = details[claimType];
        if (!detail) {return '<p>Please complete the assessment to see your results.</p>';}
        
        return `
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-semibold text-lg mb-2">${detail.title}</h4>
                <p class="text-gray-600 mb-4">${detail.description}</p>
                
                <div class="juribank-grid juribank-grid-cols-3 gap-4 text-center">
                    <div class="bg-blue-50 p-3 rounded">
                        <div class="text-2xl font-bold text-blue-600">${detail.successRate}</div>
                        <div class="text-sm text-blue-800">Success Rate</div>
                    </div>
                    <div class="bg-green-50 p-3 rounded">
                        <div class="text-lg font-bold text-green-600">${detail.averageRefund}</div>
                        <div class="text-sm text-green-800">Typical Refund</div>
                    </div>
                    <div class="bg-purple-50 p-3 rounded">
                        <div class="text-lg font-bold text-purple-600">${detail.timeframe}</div>
                        <div class="text-sm text-purple-800">Expected Time</div>
                    </div>
                </div>
            </div>
        `;
    }

    resetAssessment() {
        this.assessmentData = {};
        this.currentStep = 1;
        
        // Reset step indicators
        document.querySelectorAll('[id$="-dot"]').forEach((dot, index) => {
            dot.className = 'juribank-step-dot ' + (index === 0 ? 'active' : 'pending');
        });
        
        // Show step 1
        const assessmentContent = document.getElementById('assessment-content');
        assessmentContent.innerHTML = this.getStepContent(1);
    }

    closeCurrentModalAndOpen(toolType) {
        // Close current modal
        const currentModal = document.querySelector('.juribank-modal');
        if (currentModal) {
            this.closeModal(currentModal);
        }
        
        // Open new tool
        setTimeout(() => {
            if (toolType === 'calculator') {
                this.openCalculatorTool();
            } else if (toolType === 'guide') {
                this.openGuideTool();
            }
        }, 200);
    }

    openCalculatorTool() {
        const content = `
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Refund Calculator</h2>
                <p class="text-gray-600">Estimate your potential refund based on your specific situation</p>
            </div>

            <div class="juribank-grid juribank-grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-semibold mb-4">Tell us about your situation</h3>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Type of claim</label>
                        <select id="calc-claim-type" class="juribank-calculator-input" onchange="juriBankTools.updateCalculation()">
                            <option value="">Select claim type...</option>
                            <option value="bankCharges">Bank charges (overdrafts, fees)</option>
                            <option value="ppi">Payment Protection Insurance (PPI)</option>
                            <option value="packagedAccount">Packaged account fees</option>
                            <option value="investmentAdvice">Poor investment advice</option>
                        </select>
                    </div>

                    <div id="calculator-inputs">
                        <!-- Dynamic inputs will be inserted here -->
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg mt-4">
                        <h4 class="font-semibold mb-3">Additional factors</h4>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" id="factor-vulnerable" class="mr-2" onchange="juriBankTools.updateCalculation()">
                                <span class="text-sm">I was in a vulnerable situation</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="factor-missold" class="mr-2" onchange="juriBankTools.updateCalculation()">
                                <span class="text-sm">Product was clearly mis-sold</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-xl font-semibold mb-4">Your estimated refund</h3>
                    
                    <div class="juribank-estimate-display">
                        <div class="text-sm opacity-90 mb-1">Estimated refund range</div>
                        <div class="text-3xl font-bold" id="refund-estimate">£0 - £0</div>
                        <div class="text-sm opacity-90 mt-1" id="refund-confidence">Select your claim type to see estimate</div>
                    </div>

                    <div id="calculation-breakdown" class="space-y-3">
                        <!-- Breakdown will be populated by JavaScript -->
                    </div>

                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                        <h4 class="font-semibold text-yellow-800 mb-2">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            Important Notice
                        </h4>
                        <p class="text-yellow-700 text-sm">
                            This is an educational estimate only. Actual refunds depend on many factors and individual circumstances.
                        </p>
                    </div>

                    <div class="text-center mt-6">
                        <button class="juribank-btn-primary w-full" onclick="juriBankTools.closeCurrentModalAndOpen('guide')">
                            <i class="fas fa-route"></i>
                            Get My Action Plan
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = this.createModal(content);
        this.modalContainer.appendChild(modal);
    }

    updateCalculation() {
        const claimType = document.getElementById('calc-claim-type').value;
        const inputsContainer = document.getElementById('calculator-inputs');
        
        // Generate appropriate input fields
        if (claimType === 'bankCharges') {
            inputsContainer.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Average monthly charges (£)</label>
                        <input type="number" id="monthly-charges" class="juribank-calculator-input" placeholder="50" onchange="juriBankTools.calculateRefund()">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">How many months?</label>
                        <input type="number" id="charge-months" class="juribank-calculator-input" placeholder="24" onchange="juriBankTools.calculateRefund()">
                    </div>
                </div>
            `;
        } else if (claimType === 'ppi') {
            inputsContainer.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Monthly PPI premium (£)</label>
                        <input type="number" id="ppi-premium" class="juribank-calculator-input" placeholder="25" onchange="juriBankTools.calculateRefund()">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">How many months did you pay?</label>
                        <input type="number" id="ppi-months" class="juribank-calculator-input" placeholder="60" onchange="juriBankTools.calculateRefund()">
                    </div>
                </div>
            `;
        } else if (claimType === 'packagedAccount') {
            inputsContainer.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Monthly account fee (£)</label>
                        <input type="number" id="packaged-fee" class="juribank-calculator-input" placeholder="15" onchange="juriBankTools.calculateRefund()">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">How many months?</label>
                        <input type="number" id="packaged-months" class="juribank-calculator-input" placeholder="36" onchange="juriBankTools.calculateRefund()">
                    </div>
                </div>
            `;
        } else if (claimType === 'investmentAdvice') {
            inputsContainer.innerHTML = `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Amount invested (£)</label>
                        <input type="number" id="investment-amount" class="juribank-calculator-input" placeholder="20000" onchange="juriBankTools.calculateRefund()">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Current value (£)</label>
                        <input type="number" id="current-value" class="juribank-calculator-input" placeholder="15000" onchange="juriBankTools.calculateRefund()">
                    </div>
                </div>
            `;
        } else {
            inputsContainer.innerHTML = '';
        }
        
        this.calculateRefund();
    }

    calculateRefund() {
        const claimType = document.getElementById('calc-claim-type').value;
        if (!claimType) {
            document.getElementById('refund-estimate').textContent = '£0 - £0';
            document.getElementById('refund-confidence').textContent = 'Select your claim type to see estimate';
            document.getElementById('calculation-breakdown').innerHTML = '';
            return;
        }
        
        let minRefund = 0;
        let maxRefund = 0;
        let confidence = 'Medium';
        let breakdown = [];
        
        // Get additional factors
        const isVulnerable = document.getElementById('factor-vulnerable')?.checked || false;
        const wasMissold = document.getElementById('factor-missold')?.checked || false;
        
        let multiplier = 1;
        if (isVulnerable) {multiplier += 0.2;}
        if (wasMissold) {multiplier += 0.3;}
        
        switch (claimType) {
            case 'bankCharges':
                const monthlyCharges = parseFloat(document.getElementById('monthly-charges')?.value) || 0;
                const chargeMonths = parseFloat(document.getElementById('charge-months')?.value) || 0;
                
                if (monthlyCharges && chargeMonths) {
                    const totalCharges = monthlyCharges * chargeMonths;
                    minRefund = Math.round(totalCharges * 0.7 * multiplier);
                    maxRefund = Math.round(totalCharges * 1.2 * multiplier);
                    confidence = 'High';
                    
                    breakdown = [
                        { label: 'Total charges paid', value: `£${totalCharges.toLocaleString()}` },
                        { label: 'Potential refund (70-120%)', value: `£${minRefund.toLocaleString()} - £${maxRefund.toLocaleString()}` }
                    ];
                }
                break;
                
            case 'ppi':
                const ppiPremium = parseFloat(document.getElementById('ppi-premium')?.value) || 0;
                const ppiMonths = parseFloat(document.getElementById('ppi-months')?.value) || 0;
                
                if (ppiPremium && ppiMonths) {
                    const totalPremiums = ppiPremium * ppiMonths;
                    const interest = totalPremiums * 0.08 * (ppiMonths / 12);
                    minRefund = Math.round((totalPremiums + interest) * multiplier);
                    maxRefund = Math.round((totalPremiums + interest * 1.5) * multiplier);
                    confidence = 'High';
                    
                    breakdown = [
                        { label: 'Total PPI premiums', value: `£${totalPremiums.toLocaleString()}` },
                        { label: 'Plus interest (8%)', value: `£${Math.round(interest).toLocaleString()}` },
                        { label: 'Total potential refund', value: `£${minRefund.toLocaleString()} - £${maxRefund.toLocaleString()}` }
                    ];
                }
                break;
                
            case 'packagedAccount':
                const packagedFee = parseFloat(document.getElementById('packaged-fee')?.value) || 0;
                const packagedMonths = parseFloat(document.getElementById('packaged-months')?.value) || 0;
                
                if (packagedFee && packagedMonths) {
                    const totalFees = packagedFee * packagedMonths;
                    minRefund = Math.round(totalFees * 0.8 * multiplier);
                    maxRefund = Math.round(totalFees * 1.1 * multiplier);
                    confidence = 'Medium';
                    
                    breakdown = [
                        { label: 'Total fees paid', value: `£${totalFees.toLocaleString()}` },
                        { label: 'Potential refund', value: `£${minRefund.toLocaleString()} - £${maxRefund.toLocaleString()}` }
                    ];
                }
                break;
                
            case 'investmentAdvice':
                const investmentAmount = parseFloat(document.getElementById('investment-amount')?.value) || 0;
                const currentValue = parseFloat(document.getElementById('current-value')?.value) || 0;
                
                if (investmentAmount && currentValue) {
                    const actualLoss = Math.max(0, investmentAmount - currentValue);
                    minRefund = Math.round(actualLoss * 0.6 * multiplier);
                    maxRefund = Math.round(Number(actualLoss) * multiplier);
                    confidence = 'Medium';
                    
                    breakdown = [
                        { label: 'Investment loss', value: `£${actualLoss.toLocaleString()}` },
                        { label: 'Potential compensation', value: `£${minRefund.toLocaleString()} - £${maxRefund.toLocaleString()}` }
                    ];
                }
                break;
        }
        
        // Update display
        document.getElementById('refund-estimate').textContent = 
            `£${minRefund.toLocaleString()} - £${maxRefund.toLocaleString()}`;
        document.getElementById('refund-confidence').textContent = 
            `${confidence} confidence estimate`;
        
        // Display breakdown
        const breakdownContainer = document.getElementById('calculation-breakdown');
        breakdownContainer.innerHTML = breakdown.map(item => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="text-sm text-gray-600">${item.label}</span>
                <span class="font-semibold">${item.value}</span>
            </div>
        `).join('');
    }

    openGuideTool() {
        const content = `
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Your Personalized Action Plan</h2>
                <p class="text-gray-600">Step-by-step guidance tailored to your situation</p>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Where are you in the process?</label>
                <select id="guide-situation" class="juribank-calculator-input" onchange="juriBankTools.generateGuide()">
                    <option value="">Select your situation...</option>
                    <option value="just-discovered">I just discovered I might have a claim</option>
                    <option value="gathering-evidence">I'm gathering evidence</option>
                    <option value="ready-to-complain">I'm ready to make a complaint</option>
                    <option value="bank-rejected">My bank rejected my complaint</option>
                    <option value="ombudsman-stage">I'm considering the ombudsman</option>
                </select>
            </div>

            <div id="action-plan-content" class="juribank-hidden">
                <!-- Action plan will be generated here -->
            </div>
        `;
        
        const modal = this.createModal(content);
        this.modalContainer.appendChild(modal);
    }

    generateGuide() {
        const situation = document.getElementById('guide-situation').value;
        if (!situation) {return;}
        
        const actionPlanContent = document.getElementById('action-plan-content');
        actionPlanContent.classList.remove('juribank-hidden');
        
        const steps = this.getStepsForSituation(situation);
        const timeline = this.getTimelineForSituation(situation);
        
        actionPlanContent.innerHTML = `
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4">Your Journey Timeline</h3>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center justify-between text-sm mb-2">
                        <span class="font-medium">Start</span>
                        <span class="text-blue-600 font-medium">Expected: ${timeline.duration}</span>
                        <span class="font-medium">Resolution</span>
                    </div>
                    <div class="w-full bg-blue-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${timeline.progress}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4">Your Next Steps</h3>
                <div class="space-y-4">
                    ${steps.map((step, index) => `
                        <div class="flex items-start p-4 bg-gray-50 rounded-lg border-l-4 ${step.urgent ? 'border-red-500' : 'border-blue-500'}">
                            <div class="w-8 h-8 rounded-full ${step.urgent ? 'bg-red-500' : 'bg-blue-500'} text-white flex items-center justify-center mr-3 flex-shrink-0">
                                ${index + 1}
                            </div>
                            <div>
                                <h4 class="font-semibold mb-1">${step.title}</h4>
                                <p class="text-gray-600 text-sm">${step.description}</p>
                                ${step.urgent ? '<span class="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">Urgent</span>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 class="font-semibold text-green-800 mb-3">
                    <i class="fas fa-lightbulb mr-2"></i>
                    Key Success Tips
                </h4>
                <ul class="text-green-700 text-sm space-y-1">
                    <li>• Keep copies of all correspondence with your bank</li>
                    <li>• Always communicate in writing when possible</li>
                    <li>• Be persistent but polite in your communications</li>
                    <li>• Don't accept the first 'no' - banks often reject valid claims initially</li>
                    <li>• Consider the ombudsman if your bank rejects your complaint</li>
                </ul>
            </div>
        `;
    }

    getStepsForSituation(situation) {
        const stepsBySituation = {
            'just-discovered': [
                { title: 'Research Your Claim', description: 'Understand what type of claim you have and gather initial information', urgent: true },
                { title: 'Collect Documents', description: 'Gather bank statements, contracts, and correspondence', urgent: true },
                { title: 'Calculate Potential Refund', description: 'Use our calculator to estimate your compensation', urgent: false }
            ],
            'gathering-evidence': [
                { title: 'Complete Evidence Collection', description: 'Ensure you have all necessary documents', urgent: true },
                { title: 'Prepare Your Complaint', description: 'Draft a clear, detailed complaint letter', urgent: true },
                { title: 'Review Before Sending', description: 'Double-check all facts and supporting evidence', urgent: false }
            ],
            'ready-to-complain': [
                { title: 'Submit Your Complaint', description: 'Send your complaint to the bank\'s complaints department', urgent: true },
                { title: 'Track Response Time', description: 'Banks must respond within 8 weeks', urgent: false },
                { title: 'Follow Up if Needed', description: 'Contact the bank if you don\'t hear back', urgent: false }
            ],
            'bank-rejected': [
                { title: 'Review Bank\'s Response', description: 'Understand why your complaint was rejected', urgent: true },
                { title: 'Consider Ombudsman', description: 'You have the right to escalate to the Financial Ombudsman', urgent: true },
                { title: 'Prepare Ombudsman Case', description: 'Compile all evidence for ombudsman review', urgent: false }
            ],
            'ombudsman-stage': [
                { title: 'Submit to Ombudsman', description: 'Complete the ombudsman complaint form', urgent: true },
                { title: 'Respond to Queries', description: 'Answer any questions from the ombudsman', urgent: false },
                { title: 'Wait for Decision', description: 'The ombudsman will investigate and make a decision', urgent: false }
            ]
        };
        
        return stepsBySituation[situation] || [];
    }

    getTimelineForSituation(situation) {
        const timelines = {
            'just-discovered': { duration: '4-8 months', progress: 10 },
            'gathering-evidence': { duration: '3-6 months', progress: 25 },
            'ready-to-complain': { duration: '2-4 months', progress: 40 },
            'bank-rejected': { duration: '3-6 months', progress: 60 },
            'ombudsman-stage': { duration: '6-12 months', progress: 80 }
        };
        
        return timelines[situation] || { duration: '3-6 months', progress: 25 };
    }
}

// Initialize the tools when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.juriBankTools = new JuriBankTools();
});

// Expose the instance globally for onclick handlers
window.juriBankTools = null;