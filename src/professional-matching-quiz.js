/**
 * Professional Matching Quiz
 * Intelligent solicitor matching based on claim type, location, and preferences
 */

class ProfessionalMatchingQuiz {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.currentStep = 1;
        this.totalSteps = 6;
        this.answers = {};
        this.matches = [];
        this.init();
    }

    init() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="matching-quiz-container">
                <div class="quiz-header">
                    <h2 class="quiz-title">Find Your Ideal Legal Professional</h2>
                    <p class="quiz-subtitle">Answer a few questions to get matched with specialist solicitors</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
                    </div>
                    <div class="step-indicator">Step ${this.currentStep} of ${this.totalSteps}</div>
                </div>
                
                <div class="quiz-content">
                    ${this.renderCurrentStep()}
                </div>
                
                <div class="quiz-navigation">
                    ${this.currentStep > 1 ? '<button class="btn-secondary" onclick="professionalQuiz.previousStep()">Previous</button>' : '<div></div>'}
                    <button class="btn-primary" onclick="professionalQuiz.nextStep()" id="next-btn">
                        ${this.currentStep === this.totalSteps ? 'Find My Matches' : 'Next'}
                    </button>
                </div>
            </div>
        `;
    }

    renderCurrentStep() {
        const steps = {
            1: this.renderClaimTypeStep(),
            2: this.renderClaimDetailsStep(),
            3: this.renderLocationStep(),
            4: this.renderBudgetStep(),
            5: this.renderPreferencesStep(),
            6: this.renderContactStep()
        };
        
        return steps[this.currentStep] || '';
    }

    renderClaimTypeStep() {
        return `
            <div class="step-content">
                <h3>What type of legal issue do you need help with?</h3>
                <p class="step-description">This helps us match you with solicitors who specialize in your specific area.</p>
                
                <div class="option-grid">
                    <label class="option-card" data-value="bank-charges">
                        <input type="radio" name="claim-type" value="bank-charges">
                        <div class="option-icon">💰</div>
                        <div class="option-content">
                            <h4>Bank Charges & Fees</h4>
                            <p>Unfair overdraft charges, account fees, penalty charges</p>
                        </div>
                    </label>
                    
                    <label class="option-card" data-value="ppi">
                        <input type="radio" name="claim-type" value="ppi">
                        <div class="option-icon">📋</div>
                        <div class="option-content">
                            <h4>PPI Claims</h4>
                            <p>Payment protection insurance mis-selling</p>
                        </div>
                    </label>
                    
                    <label class="option-card" data-value="investment">
                        <input type="radio" name="claim-type" value="investment">
                        <div class="option-icon">📊</div>
                        <div class="option-content">
                            <h4>Investment & Pension Advice</h4>
                            <p>Poor financial advice, unsuitable investments</p>
                        </div>
                    </label>
                    
                    <label class="option-card" data-value="mortgage">
                        <input type="radio" name="claim-type" value="mortgage">
                        <div class="option-icon">🏠</div>
                        <div class="option-content">
                            <h4>Mortgage Issues</h4>
                            <p>Mortgage mis-selling, repossession defense</p>
                        </div>
                    </label>
                    
                    <label class="option-card" data-value="insurance">
                        <input type="radio" name="claim-type" value="insurance">
                        <div class="option-icon">🛡️</div>
                        <div class="option-content">
                            <h4>Insurance Claims</h4>
                            <p>Declined claims, policy disputes</p>
                        </div>
                    </label>
                    
                    <label class="option-card" data-value="other">
                        <input type="radio" name="claim-type" value="other">
                        <div class="option-icon">❓</div>
                        <div class="option-content">
                            <h4>Other Financial Issue</h4>
                            <p>Consumer credit, debt problems, other disputes</p>
                        </div>
                    </label>
                </div>
            </div>
        `;
    }

    renderClaimDetailsStep() {
        return `
            <div class="step-content">
                <h3>Tell us more about your situation</h3>
                <p class="step-description">This helps us understand the complexity and urgency of your case.</p>
                
                <div class="form-section">
                    <label for="claim-value">Estimated value of your claim:</label>
                    <select id="claim-value" name="claim-value">
                        <option value="">Select range...</option>
                        <option value="under-500">Under £500</option>
                        <option value="500-2000">£500 - £2,000</option>
                        <option value="2000-10000">£2,000 - £10,000</option>
                        <option value="10000-50000">£10,000 - £50,000</option>
                        <option value="over-50000">Over £50,000</option>
                        <option value="unknown">I'm not sure</option>
                    </select>
                </div>
                
                <div class="form-section">
                    <label for="urgency">How urgent is your case?</label>
                    <select id="urgency" name="urgency">
                        <option value="">Select urgency...</option>
                        <option value="very-urgent">Very urgent (action needed within days)</option>
                        <option value="urgent">Urgent (action needed within weeks)</option>
                        <option value="moderate">Moderate (action needed within months)</option>
                        <option value="not-urgent">Not urgent (I want to explore options)</option>
                    </select>
                </div>
                
                <div class="form-section">
                    <label for="complexity">How complex is your case?</label>
                    <div class="checkbox-group">
                        <label class="checkbox-option">
                            <input type="checkbox" name="complexity" value="multiple-products">
                            Multiple financial products involved
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="complexity" value="large-amounts">
                            Large amounts of money involved
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="complexity" value="legal-proceedings">
                            Legal proceedings already started
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="complexity" value="multiple-parties">
                            Multiple parties involved
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="complexity" value="time-sensitive">
                            Time-sensitive deadlines
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderLocationStep() {
        return `
            <div class="step-content">
                <h3>Where are you located?</h3>
                <p class="step-description">We'll prioritize solicitors in your area for easier meetings and local court knowledge.</p>
                
                <div class="form-section">
                    <label for="region">Your region:</label>
                    <select id="region" name="region">
                        <option value="">Select your region...</option>
                        <option value="london">London</option>
                        <option value="south-east">South East</option>
                        <option value="south-west">South West</option>
                        <option value="midlands">Midlands</option>
                        <option value="north">North England</option>
                        <option value="scotland">Scotland</option>
                        <option value="wales">Wales</option>
                        <option value="northern-ireland">Northern Ireland</option>
                    </select>
                </div>
                
                <div class="form-section">
                    <label for="city">Nearest major city (optional):</label>
                    <input type="text" id="city" name="city" placeholder="e.g., Manchester, Birmingham, Bristol">
                </div>
                
                <div class="form-section">
                    <label class="checkbox-option">
                        <input type="checkbox" name="remote-ok" value="yes">
                        I'm happy to work with solicitors remotely (video calls, phone, email)
                    </label>
                </div>
            </div>
        `;
    }

    renderBudgetStep() {
        return `
            <div class="step-content">
                <h3>What's your budget for legal fees?</h3>
                <p class="step-description">This helps us match you with solicitors whose fees align with your expectations.</p>
                
                <div class="budget-options">
                    <label class="budget-card" data-value="no-win-no-fee">
                        <input type="radio" name="budget-type" value="no-win-no-fee">
                        <div class="budget-icon">🎯</div>
                        <div class="budget-content">
                            <h4>No Win, No Fee</h4>
                            <p>Only pay if your case is successful</p>
                            <div class="budget-details">Success fee: 25-35% of compensation</div>
                        </div>
                    </label>
                    
                    <label class="budget-card" data-value="hourly-rate">
                        <input type="radio" name="budget-type" value="hourly-rate">
                        <div class="budget-icon">⏰</div>
                        <div class="budget-content">
                            <h4>Hourly Rate</h4>
                            <p>Pay for time spent on your case</p>
                            <div class="budget-details">£200-£600 per hour</div>
                        </div>
                    </label>
                    
                    <label class="budget-card" data-value="fixed-fee">
                        <input type="radio" name="budget-type" value="fixed-fee">
                        <div class="budget-icon">💷</div>
                        <div class="budget-content">
                            <h4>Fixed Fee</h4>
                            <p>One price for the entire case</p>
                            <div class="budget-details">£1,000-£15,000+ depending on complexity</div>
                        </div>
                    </label>
                </div>
                
                <div class="form-section" id="hourly-budget" style="display: none;">
                    <label for="hourly-range">Preferred hourly rate range:</label>
                    <select id="hourly-range" name="hourly-range">
                        <option value="">Select range...</option>
                        <option value="200-300">£200-£300 per hour</option>
                        <option value="300-450">£300-£450 per hour</option>
                        <option value="450-600">£450-£600 per hour</option>
                        <option value="600-plus">£600+ per hour</option>
                    </select>
                </div>
                
                <div class="form-section" id="total-budget" style="display: none;">
                    <label for="total-range">Total budget for your case:</label>
                    <select id="total-range" name="total-range">
                        <option value="">Select range...</option>
                        <option value="under-2500">Under £2,500</option>
                        <option value="2500-7500">£2,500-£7,500</option>
                        <option value="7500-15000">£7,500-£15,000</option>
                        <option value="15000-plus">£15,000+</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderPreferencesStep() {
        return `
            <div class="step-content">
                <h3>Any specific preferences?</h3>
                <p class="step-description">Help us find solicitors that match your working style and communication preferences.</p>
                
                <div class="form-section">
                    <label>Firm size preference:</label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="firm-size" value="large">
                            Large firm (50+ solicitors) - More resources, specialized departments
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="firm-size" value="medium">
                            Medium firm (10-50 solicitors) - Good balance of expertise and personal service
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="firm-size" value="small">
                            Small firm/sole practitioner - Personal attention, lower overheads
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="firm-size" value="no-preference">
                            No preference
                        </label>
                    </div>
                </div>
                
                <div class="form-section">
                    <label>Communication preferences:</label>
                    <div class="checkbox-group">
                        <label class="checkbox-option">
                            <input type="checkbox" name="communication" value="email">
                            Prefers email communication
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="communication" value="phone">
                            Prefers phone calls
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="communication" value="video">
                            Happy with video calls
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="communication" value="face-to-face">
                            Wants face-to-face meetings
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="communication" value="regular-updates">
                            Wants regular progress updates
                        </label>
                    </div>
                </div>
                
                <div class="form-section">
                    <label>Important qualities (select up to 3):</label>
                    <div class="checkbox-group">
                        <label class="checkbox-option">
                            <input type="checkbox" name="qualities" value="experience">
                            Years of experience in this area
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="qualities" value="success-rate">
                            High success rate in similar cases
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="qualities" value="speed">
                            Quick response times
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="qualities" value="cost-effective">
                            Cost-effective fees
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="qualities" value="personal-service">
                            Personal, attentive service
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="qualities" value="aggressive">
                            Aggressive approach to negotiations
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderContactStep() {
        return `
            <div class="step-content">
                <h3>How should we contact you?</h3>
                <p class="step-description">We'll use this information to introduce you to matched solicitors.</p>
                
                <div class="form-section">
                    <label for="first-name">First name:</label>
                    <input type="text" id="first-name" name="first-name" required>
                </div>
                
                <div class="form-section">
                    <label for="last-name">Last name:</label>
                    <input type="text" id="last-name" name="last-name" required>
                </div>
                
                <div class="form-section">
                    <label for="email">Email address:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-section">
                    <label for="phone">Phone number (optional):</label>
                    <input type="tel" id="phone" name="phone">
                </div>
                
                <div class="form-section">
                    <label for="best-time">Best time to contact you:</label>
                    <select id="best-time" name="best-time">
                        <option value="morning">Morning (9am-12pm)</option>
                        <option value="afternoon">Afternoon (12pm-5pm)</option>
                        <option value="evening">Evening (5pm-8pm)</option>
                        <option value="anytime">Anytime</option>
                    </select>
                </div>
                
                <div class="form-section">
                    <label class="checkbox-option">
                        <input type="checkbox" name="consent" value="yes" required>
                        I consent to being contacted by matched solicitors about my legal matter
                    </label>
                </div>
                
                <div class="form-section">
                    <label class="checkbox-option">
                        <input type="checkbox" name="updates" value="yes">
                        I'd like to receive updates about legal changes relevant to my case
                    </label>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Handle budget type selection showing/hiding additional fields
        document.addEventListener('change', (e) => {
            if (e.target.name === 'budget-type') {
                const hourlyBudget = document.getElementById('hourly-budget');
                const totalBudget = document.getElementById('total-budget');
                
                if (hourlyBudget) {hourlyBudget.style.display = 'none';}
                if (totalBudget) {totalBudget.style.display = 'none';}
                
                if (e.target.value === 'hourly-rate' && hourlyBudget) {
                    hourlyBudget.style.display = 'block';
                } else if (e.target.value === 'fixed-fee' && totalBudget) {
                    totalBudget.style.display = 'block';
                }
            }
        });

        // Limit checkbox selections for qualities
        document.addEventListener('change', (e) => {
            if (e.target.name === 'qualities') {
                const checkedBoxes = document.querySelectorAll('input[name="qualities"]:checked');
                const allBoxes = document.querySelectorAll('input[name="qualities"]');
                
                if (checkedBoxes.length >= 3) {
                    allBoxes.forEach(box => {
                        if (!box.checked) {
                            box.disabled = true;
                        }
                    });
                } else {
                    allBoxes.forEach(box => {
                        box.disabled = false;
                    });
                }
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentAnswers();
            
            if (this.currentStep === this.totalSteps) {
                this.generateMatches();
            } else {
                this.currentStep++;
                this.render();
                this.addEventListeners();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
            this.addEventListeners();
        }
    }

    validateCurrentStep() {
        const step = this.currentStep;
        let isValid = true;
        let errorMessage = '';

        switch (step) {
            case 1:
                if (!document.querySelector('input[name="claim-type"]:checked')) {
                    isValid = false;
                    errorMessage = 'Please select your claim type.';
                }
                break;
            case 2:
                if (!document.getElementById('claim-value').value || !document.getElementById('urgency').value) {
                    isValid = false;
                    errorMessage = 'Please fill in all required fields.';
                }
                break;
            case 3:
                if (!document.getElementById('region').value) {
                    isValid = false;
                    errorMessage = 'Please select your region.';
                }
                break;
            case 4:
                if (!document.querySelector('input[name="budget-type"]:checked')) {
                    isValid = false;
                    errorMessage = 'Please select your budget preference.';
                }
                break;
            case 6:
                const requiredFields = ['first-name', 'last-name', 'email'];
                const missingFields = requiredFields.filter(field => {
                    const element = document.getElementById(field);
                    return !element || !element.value.trim();
                });
                
                if (missingFields.length > 0) {
                    isValid = false;
                    errorMessage = 'Please fill in all required fields.';
                }
                
                if (!document.querySelector('input[name="consent"]:checked')) {
                    isValid = false;
                    errorMessage = 'Please consent to being contacted by matched solicitors.';
                }
                break;
        }

        if (!isValid) {
            alert(errorMessage);
        }

        return isValid;
    }

    saveCurrentAnswers() {
        const step = this.currentStep;
        const stepData = {};

        // Collect all form data for current step
        const formElements = this.container.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            if (element.type === 'checkbox') {
                if (!stepData[element.name]) {stepData[element.name] = [];}
                if (element.checked) {
                    stepData[element.name].push(element.value);
                }
            } else if (element.type === 'radio') {
                if (element.checked) {
                    stepData[element.name] = element.value;
                }
            } else {
                stepData[element.name] = element.value;
            }
        });

        this.answers[`step${step}`] = stepData;
    }

    generateMatches() {
        // Show loading state
        this.container.innerHTML = `
            <div class="matching-results loading">
                <div class="loading-animation">
                    <div class="spinner"></div>
                    <h3>Finding Your Perfect Matches...</h3>
                    <p>Analyzing your requirements and searching our network of specialist solicitors</p>
                </div>
            </div>
        `;

        // Simulate matching process
        setTimeout(() => {
            this.matches = this.calculateMatches();
            this.showResults();
        }, 3000);
    }

    calculateMatches() {
        // This would normally connect to a backend API
        // For demo purposes, we'll return mock data based on answers
        
        const claimType = this.answers.step1['claim-type'];
        const region = this.answers.step3.region;
        const budgetType = this.answers.step4['budget-type'];

        // Mock solicitor data
        const mockSolicitors = [
            {
                name: "Sarah Mitchell",
                firm: "City Financial Law",
                specialties: ["bank-charges", "ppi"],
                location: "London",
                experience: "15 years",
                successRate: "89%",
                averageFee: "£350/hour",
                rating: 4.8,
                cases: 1200,
                bio: "Specializes in banking disputes and consumer finance law. Previously worked at major high street bank's legal department.",
                budgetOptions: ["hourly-rate", "no-win-no-fee"],
                matchScore: 95
            },
            {
                name: "David Thompson",
                firm: "Thompson & Associates",
                specialties: ["investment", "ppi", "mortgage"],
                location: "Manchester",
                experience: "12 years",
                successRate: "85%",
                averageFee: "£425/hour",
                rating: 4.6,
                cases: 890,
                bio: "Expert in investment mis-selling and pension transfer cases. Former FCA regulatory specialist.",
                budgetOptions: ["hourly-rate", "fixed-fee"],
                matchScore: 87
            },
            {
                name: "Emma Roberts",
                firm: "Roberts Financial Law",
                specialties: ["bank-charges", "insurance", "mortgage"],
                location: "Birmingham",
                experience: "8 years",
                successRate: "91%",
                averageFee: "£275/hour",
                rating: 4.9,
                cases: 650,
                bio: "Rising star in financial services law. Particular expertise in complex banking charge disputes.",
                budgetOptions: ["hourly-rate", "no-win-no-fee", "fixed-fee"],
                matchScore: 82
            }
        ];

        // Filter and score matches based on answers
        return mockSolicitors
            .filter(solicitor => {
                return solicitor.specialties.includes(claimType) &&
                       solicitor.budgetOptions.includes(budgetType);
            })
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 3);
    }

    showResults() {
        this.container.innerHTML = `
            <div class="matching-results">
                <div class="results-header">
                    <h2>Your Matched Legal Professionals</h2>
                    <p>We found ${this.matches.length} specialist solicitors perfect for your case</p>
                </div>
                
                <div class="matches-container">
                    ${this.matches.map((match, index) => this.renderMatch(match, index)).join('')}
                </div>
                
                <div class="results-footer">
                    <div class="next-steps">
                        <h3>What happens next?</h3>
                        <div class="steps-grid">
                            <div class="step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Choose Your Preferred Solicitors</h4>
                                    <p>Select 1-3 solicitors you'd like to speak with</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>We Make the Introduction</h4>
                                    <p>Your case details are sent to your chosen solicitors</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>Initial Consultations</h4>
                                    <p>Speak with each solicitor to find the best fit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="professionalQuiz.requestIntroductions()">
                            Request Introductions
                        </button>
                        <button class="btn-secondary" onclick="professionalQuiz.restart()">
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.addResultsEventListeners();
    }

    renderMatch(match, index) {
        return `
            <div class="match-card" data-solicitor="${index}">
                <div class="match-header">
                    <div class="solicitor-info">
                        <h3>${match.name}</h3>
                        <p class="firm-name">${match.firm}</p>
                        <div class="location">📍 ${match.location}</div>
                    </div>
                    <div class="match-score">
                        <div class="score-circle">${match.matchScore}%</div>
                        <div class="score-label">Match</div>
                    </div>
                </div>
                
                <div class="match-details">
                    <div class="stats-row">
                        <div class="stat">
                            <strong>${match.experience}</strong>
                            <span>Experience</span>
                        </div>
                        <div class="stat">
                            <strong>${match.successRate}</strong>
                            <span>Success Rate</span>
                        </div>
                        <div class="stat">
                            <strong>${match.cases}</strong>
                            <span>Cases</span>
                        </div>
                        <div class="stat">
                            <strong>${match.rating}★</strong>
                            <span>Rating</span>
                        </div>
                    </div>
                    
                    <p class="bio">${match.bio}</p>
                    
                    <div class="specialties">
                        <strong>Specialties:</strong>
                        ${match.specialties.map(specialty => `<span class="specialty-tag">${this.formatSpecialty(specialty)}</span>`).join('')}
                    </div>
                    
                    <div class="fee-info">
                        <strong>Fees:</strong> ${match.averageFee}
                        <span class="fee-options">• ${match.budgetOptions.map(opt => this.formatBudgetOption(opt)).join(' • ')}</span>
                    </div>
                </div>
                
                <div class="match-actions">
                    <label class="select-solicitor">
                        <input type="checkbox" name="selected-solicitors" value="${index}">
                        Select for introduction
                    </label>
                    <button class="btn-outline" onclick="professionalQuiz.viewProfile(${index})">
                        View Full Profile
                    </button>
                </div>
            </div>
        `;
    }

    formatSpecialty(specialty) {
        const specialtyMap = {
            'bank-charges': 'Bank Charges',
            'ppi': 'PPI Claims',
            'investment': 'Investment Advice',
            'mortgage': 'Mortgage Issues',
            'insurance': 'Insurance Claims'
        };
        return specialtyMap[specialty] || specialty;
    }

    formatBudgetOption(option) {
        const optionMap = {
            'hourly-rate': 'Hourly Rate',
            'no-win-no-fee': 'No Win No Fee',
            'fixed-fee': 'Fixed Fee'
        };
        return optionMap[option] || option;
    }

    addResultsEventListeners() {
        // Handle solicitor selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'selected-solicitors') {
                const selected = document.querySelectorAll('input[name="selected-solicitors"]:checked');
                const requestBtn = document.querySelector('.btn-primary');
                
                if (selected.length > 0) {
                    requestBtn.textContent = `Request Introductions (${selected.length} selected)`;
                    requestBtn.disabled = false;
                } else {
                    requestBtn.textContent = 'Request Introductions';
                    requestBtn.disabled = true;
                }
            }
        });
    }

    requestIntroductions() {
        const selected = document.querySelectorAll('input[name="selected-solicitors"]:checked');
        
        if (selected.length === 0) {
            alert('Please select at least one solicitor for introduction.');
            return;
        }

        // Show confirmation
        this.container.innerHTML = `
            <div class="confirmation-screen">
                <div class="confirmation-content">
                    <div class="success-icon">✅</div>
                    <h2>Introduction Requests Sent!</h2>
                    <p>We've sent your case details to ${selected.length} specialist solicitor${selected.length > 1 ? 's' : ''}.</p>
                    
                    <div class="what-next">
                        <h3>What happens next:</h3>
                        <ul>
                            <li>The selected solicitors will review your case details</li>
                            <li>They'll contact you within 24 hours to arrange initial consultations</li>
                            <li>You can speak with each one to find the best fit for your case</li>
                            <li>There's no obligation to proceed with any of them</li>
                        </ul>
                    </div>
                    
                    <div class="contact-info">
                        <p><strong>We'll send confirmations to:</strong> ${this.answers.step6.email}</p>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="window.location.href='index.html'">
                            Return to Homepage
                        </button>
                        <button class="btn-secondary" onclick="professionalQuiz.restart()">
                            Find More Matches
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    viewProfile(index) {
        const match = this.matches[index];
        // This would typically open a modal or navigate to a detailed profile page
        alert(`Viewing full profile for ${match.name} - This would open a detailed profile page.`);
    }

    restart() {
        this.currentStep = 1;
        this.answers = {};
        this.matches = [];
        this.render();
        this.addEventListeners();
    }
}

// CSS for the matching quiz
const matchingQuizCSS = `
<style>
.matching-quiz-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.quiz-header {
    text-align: center;
    margin-bottom: 40px;
}

.quiz-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 10px;
}

.quiz-subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin-bottom: 30px;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb 0%, #059669 100%);
    transition: width 0.3s ease;
}

.step-indicator {
    color: #6b7280;
    font-size: 0.875rem;
}

.step-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 10px;
}

.step-description {
    color: #6b7280;
    margin-bottom: 30px;
    line-height: 1.6;
}

.option-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.option-card {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.option-card:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.option-card input[type="radio"] {
    margin: 0;
}

.option-card input[type="radio"]:checked + .option-icon ~ .option-content {
    color: #2563eb;
}

.option-card:has(input[type="radio"]:checked) {
    border-color: #2563eb;
    background: #eff6ff;
}

.option-icon {
    font-size: 2rem;
    flex-shrink: 0;
}

.option-content h4 {
    font-weight: 600;
    margin-bottom: 5px;
    color: #1f2937;
}

.option-content p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
}

.form-section {
    margin-bottom: 25px;
}

.form-section label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.form-section input,
.form-section select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
}

.form-section input:focus,
.form-section select:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.checkbox-group,
.radio-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.checkbox-option,
.radio-option {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: normal;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.2s;
}

.checkbox-option:hover,
.radio-option:hover {
    background: #f9fafb;
}

.budget-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.budget-card {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: block;
}

.budget-card:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.budget-card:has(input[type="radio"]:checked) {
    border-color: #2563eb;
    background: #eff6ff;
}

.budget-card input[type="radio"] {
    display: none;
}

.budget-icon {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 15px;
}

.budget-content {
    text-align: center;
}

.budget-content h4 {
    font-weight: 600;
    margin-bottom: 8px;
    color: #1f2937;
}

.budget-content p {
    color: #6b7280;
    margin-bottom: 10px;
}

.budget-details {
    font-size: 0.875rem;
    color: #059669;
    font-weight: 500;
}

.quiz-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
}

.btn-primary,
.btn-secondary,
.btn-outline {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background: #e5e7eb;
}

.btn-outline {
    background: white;
    color: #2563eb;
    border: 1px solid #2563eb;
}

.btn-outline:hover {
    background: #eff6ff;
}

.matching-results.loading {
    text-align: center;
    padding: 60px 20px;
}

.loading-animation {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.results-header {
    text-align: center;
    margin-bottom: 40px;
}

.results-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 10px;
}

.matches-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-bottom: 40px;
}

.match-card {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 25px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.match-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.solicitor-info h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 5px 0;
}

.firm-name {
    color: #6b7280;
    margin: 0 0 8px 0;
}

.location {
    font-size: 0.875rem;
    color: #6b7280;
}

.match-score {
    text-align: center;
}

.score-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #10b981;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.125rem;
}

.score-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 5px;
}

.stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
    text-align: center;
}

.stat strong {
    display: block;
    font-weight: 600;
    color: #1f2937;
}

.stat span {
    font-size: 0.875rem;
    color: #6b7280;
}

.bio {
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 15px;
}

.specialties {
    margin-bottom: 15px;
}

.specialty-tag {
    display: inline-block;
    background: #eff6ff;
    color: #2563eb;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    margin: 0 5px 5px 0;
}

.fee-info {
    color: #4b5563;
    margin-bottom: 20px;
}

.fee-options {
    color: #6b7280;
    font-size: 0.875rem;
}

.match-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
}

.select-solicitor {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    cursor: pointer;
}

.next-steps {
    background: #f8fafc;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
}

.next-steps h3 {
    text-align: center;
    margin-bottom: 25px;
    color: #1f2937;
}

.steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.step {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #2563eb;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
}

.step-content h4 {
    font-weight: 600;
    margin-bottom: 5px;
    color: #1f2937;
}

.step-content p {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
}

.confirmation-screen {
    text-align: center;
    padding: 60px 20px;
}

.success-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.confirmation-content h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 15px;
}

.what-next {
    background: #f0fdf4;
    border-radius: 12px;
    padding: 25px;
    margin: 30px 0;
    text-align: left;
}

.what-next h3 {
    color: #166534;
    margin-bottom: 15px;
}

.what-next ul {
    color: #166534;
    line-height: 1.6;
}

.contact-info {
    margin: 20px 0;
    padding: 15px;
    background: #eff6ff;
    border-radius: 8px;
}

@media (max-width: 768px) {
    .option-grid {
        grid-template-columns: 1fr;
    }
    
    .budget-options {
        grid-template-columns: 1fr;
    }
    
    .stats-row {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .steps-grid {
        grid-template-columns: 1fr;
    }
    
    .match-actions {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }
    
    .action-buttons {
        flex-direction: column;
    }
}
</style>
`;

// Add CSS to document head
document.head.insertAdjacentHTML('beforeend', matchingQuizCSS);

// Global variable for quiz instance
window.professionalQuiz = null;

// Function to initialize the quiz
function initializeProfessionalMatchingQuiz(containerId) {
    window.professionalQuiz = new ProfessionalMatchingQuiz(containerId);
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfessionalMatchingQuiz;
}