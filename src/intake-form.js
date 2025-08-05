/**
 * JuriBank Banking Law Intake Form Component
 * Professional multi-step form for banking law case intake
 * 
 * Features:
 * - Multi-step form with progress indicators
 * - Professional validation and error handling
 * - Secure document upload capability
 * - Mobile-responsive design with JuriBank branding
 * - Banking law terminology and tooltips
 * - Professional submission handling
 */

class JuriBankIntakeForm {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 1;
        this.totalSteps = 6;
        this.formData = {};
        this.uploadedFiles = [];
        this.validationErrors = {};
        
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.updateProgressBar();
    }

    render() {
        this.container.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white rounded-card shadow-card-lg p-8">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold text-juribank-charcoal mb-2">
                        Banking Law Case Intake
                    </h1>
                    <p class="text-gray-600">
                        Secure consultation request for banking law representation
                    </p>
                </div>

                <!-- Progress Bar -->
                <div class="mb-10">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-sm font-medium text-juribank-charcoal">
                            Step <span id="current-step">${this.currentStep}</span> of ${this.totalSteps}
                        </span>
                        <span class="text-sm font-medium text-gray-500">
                            <span id="progress-percentage">16</span>% Complete
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div id="progress-bar" class="bg-juribank-blue h-2 rounded-full transition-all duration-300 ease-out" 
                             style="width: 16.67%"></div>
                    </div>
                    
                    <!-- Step Labels -->
                    <div class="flex justify-between mt-4 text-xs text-gray-500">
                        <span class="step-label active">Client Info</span>
                        <span class="step-label">Issue Type</span>
                        <span class="step-label">Urgency</span>
                        <span class="step-label">Case Details</span>
                        <span class="step-label">Documents</span>
                        <span class="step-label">Preferences</span>
                    </div>
                </div>

                <!-- Form Steps -->
                <form id="intake-form" class="space-y-6">
                    ${this.renderCurrentStep()}
                </form>

                <!-- Navigation -->
                <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button type="button" id="prev-btn" 
                            class="px-6 py-3 border-2 border-juribank-charcoal text-juribank-charcoal rounded-juribank font-semibold hover:bg-juribank-charcoal hover:text-white transition-all duration-200 ${this.currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${this.currentStep === 1 ? 'disabled' : ''}>
                        Previous
                    </button>
                    
                    <div class="flex space-x-4">
                        <button type="button" id="save-draft-btn" 
                                class="px-6 py-3 text-gray-600 hover:text-juribank-charcoal transition-colors duration-200">
                            Save Draft
                        </button>
                        
                        <button type="button" id="next-btn" 
                                class="px-8 py-3 bg-juribank-blue text-white rounded-juribank font-semibold hover:bg-blue-dark transition-colors duration-200">
                            ${this.currentStep === this.totalSteps ? 'Submit Application' : 'Continue'}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Legal Terms Modal -->
            <div id="terms-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="bg-white rounded-card max-w-2xl w-full max-h-96 overflow-y-auto p-6">
                        <h3 class="text-xl font-semibold text-juribank-charcoal mb-4">Legal Term Definition</h3>
                        <div id="term-content" class="text-gray-700 mb-4"></div>
                        <button id="close-modal" class="px-4 py-2 bg-juribank-blue text-white rounded-lg hover:bg-blue-dark">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderCurrentStep() {
        const steps = {
            1: this.renderClientInfoStep(),
            2: this.renderIssueTypeStep(),
            3: this.renderUrgencyStep(),
            4: this.renderCaseDetailsStep(),
            5: this.renderDocumentStep(),
            6: this.renderPreferencesStep()
        };
        
        return steps[this.currentStep] || '';
    }

    renderClientInfoStep() {
        return `
            <div class="step-content animate-fade-in">
                <h2 class="text-2xl font-semibold text-juribank-charcoal mb-6">Client Information</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span class="text-juribank-alert">*</span>
                        </label>
                        <input type="text" id="full-name" name="fullName" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                               placeholder="Enter your full legal name">
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                    
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span class="text-juribank-alert">*</span>
                        </label>
                        <input type="email" id="email" name="email" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                               placeholder="your.email@example.com">
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                    
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span class="text-juribank-alert">*</span>
                        </label>
                        <input type="tel" id="phone" name="phone" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                               placeholder="+44 20 1234 5678">
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                    
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Contact Method <span class="text-juribank-alert">*</span>
                        </label>
                        <select id="contact-method" name="contactMethod" required
                                class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200">
                            <option value="">Select contact method</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="secure-portal">Secure Client Portal</option>
                            <option value="post">Post</option>
                        </select>
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                    
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <textarea id="address" name="address" rows="3"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                  placeholder="Enter your full address"></textarea>
                    </div>
                </div>
                
                <div class="mt-6 p-4 bg-gray-50 rounded-juribank">
                    <p class="text-sm text-gray-600">
                        <span class="font-medium">Confidentiality Notice:</span> 
                        All information provided is protected by solicitor-client privilege and will be handled in strict confidence.
                    </p>
                </div>
            </div>
        `;
    }

    renderIssueTypeStep() {
        return `
            <div class="step-content animate-fade-in">
                <h2 class="text-2xl font-semibold text-juribank-charcoal mb-6">Banking Issue Type</h2>
                
                <div class="space-y-4">
                    <p class="text-gray-600 mb-6">Please select the type of banking issue you're experiencing:</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="account-closure" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Account Closure</div>
                                <div class="text-sm text-gray-600">Unauthorised or disputed account closure</div>
                            </div>
                        </label>
                        
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="unauthorized-transactions" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Unauthorised Transactions</div>
                                <div class="text-sm text-gray-600">Disputed or fraudulent transactions</div>
                            </div>
                        </label>
                        
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="loan-disputes" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Loan Disputes</div>
                                <div class="text-sm text-gray-600">Mortgage, credit, or lending issues</div>
                            </div>
                        </label>
                        
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="payment-issues" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Payment Issues</div>
                                <div class="text-sm text-gray-600">Failed payments, delays, or disputes</div>
                            </div>
                        </label>
                        
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="regulatory-compliance" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Regulatory Compliance</div>
                                <div class="text-sm text-gray-600">
                                    <span class="tooltip-trigger text-juribank-blue cursor-help" data-term="pra-fca">PRA/FCA</span> 
                                    compliance matters
                                </div>
                            </div>
                        </label>
                        
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="data-protection" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Data Protection</div>
                                <div class="text-sm text-gray-600">GDPR breaches or data misuse</div>
                            </div>
                        </label>
                        
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="discrimination" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Discrimination</div>
                                <div class="text-sm text-gray-600">Financial discrimination or bias</div>
                            </div>
                        </label>
                        
                        <label class="issue-type-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                            <input type="radio" name="issueType" value="other" class="mt-1 mr-3">
                            <div>
                                <div class="font-semibold text-juribank-charcoal">Other Banking Issue</div>
                                <div class="text-sm text-gray-600">Please specify in case details</div>
                            </div>
                        </label>
                    </div>
                    
                    <div class="mt-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Bank/Financial Institution Involved <span class="text-juribank-alert">*</span>
                        </label>
                        <input type="text" id="bank-name" name="bankName" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                               placeholder="e.g., Barclays, HSBC, Lloyds Banking Group">
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                </div>
            </div>
        `;
    }

    renderUrgencyStep() {
        return `
            <div class="step-content animate-fade-in">
                <h2 class="text-2xl font-semibold text-juribank-charcoal mb-6">Urgency Assessment</h2>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-4">
                            How urgent is your matter? <span class="text-juribank-alert">*</span>
                        </label>
                        
                        <div class="space-y-3">
                            <label class="urgency-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-alert transition-all duration-200">
                                <input type="radio" name="urgency" value="immediate" class="mt-1 mr-3">
                                <div>
                                    <div class="font-semibold text-juribank-alert">Immediate (24-48 hours)</div>
                                    <div class="text-sm text-gray-600">Court deadlines, frozen accounts, or imminent legal action</div>
                                </div>
                            </label>
                            
                            <label class="urgency-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-orange-400 transition-all duration-200">
                                <input type="radio" name="urgency" value="high" class="mt-1 mr-3">
                                <div>
                                    <div class="font-semibold text-orange-600">High (1-2 weeks)</div>
                                    <div class="text-sm text-gray-600">Significant financial impact or approaching deadlines</div>
                                </div>
                            </label>
                            
                            <label class="urgency-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-yellow-400 transition-all duration-200">
                                <input type="radio" name="urgency" value="medium" class="mt-1 mr-3">
                                <div>
                                    <div class="font-semibold text-yellow-600">Medium (2-4 weeks)</div>
                                    <div class="text-sm text-gray-600">Important matter but no immediate deadlines</div>
                                </div>
                            </label>
                            
                            <label class="urgency-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-success transition-all duration-200">
                                <input type="radio" name="urgency" value="standard" class="mt-1 mr-3">
                                <div>
                                    <div class="font-semibold text-juribank-success">Standard (1-2 months)</div>
                                    <div class="text-sm text-gray-600">General consultation or advice</div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Financial Impact (GBP)
                        </label>
                        <select id="financial-impact" name="financialImpact"
                                class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200">
                            <option value="">Select approximate amount</option>
                            <option value="under-1000">Under £1,000</option>
                            <option value="1000-5000">£1,000 - £5,000</option>
                            <option value="5000-25000">£5,000 - £25,000</option>
                            <option value="25000-100000">£25,000 - £100,000</option>
                            <option value="100000-500000">£100,000 - £500,000</option>
                            <option value="over-500000">Over £500,000</option>
                            <option value="prefer-not-to-say">Prefer not to disclose</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Are there any specific deadlines or time constraints?
                        </label>
                        <textarea id="deadlines" name="deadlines" rows="3"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                  placeholder="e.g., Court hearing on [date], Response required by [date], etc."></textarea>
                    </div>
                    
                    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-juribank">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <h3 class="text-sm font-medium text-yellow-800">Important Notice</h3>
                                <p class="text-sm text-yellow-700 mt-1">
                                    If you have court deadlines or regulatory compliance issues, please contact us immediately by phone at 
                                    <span class="font-semibold">020 7946 0958</span> rather than completing this form.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCaseDetailsStep() {
        return `
            <div class="step-content animate-fade-in">
                <h2 class="text-2xl font-semibold text-juribank-charcoal mb-6">Case Details</h2>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Detailed Description of Your Issue <span class="text-juribank-alert">*</span>
                        </label>
                        <textarea id="case-description" name="caseDescription" rows="6" required
                                  class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                  placeholder="Please provide a detailed description of your banking issue, including what happened, when it occurred, and how it has affected you..."></textarea>
                        <div class="text-sm text-gray-500 mt-1">Minimum 50 characters required</div>
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Timeline of Events
                        </label>
                        <textarea id="timeline" name="timeline" rows="4"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                  placeholder="e.g., 
January 2024: Account opened
March 2024: First noticed unusual charges
April 2024: Contacted bank customer service
May 2024: Filed formal complaint..."></textarea>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Account Number(s) Involved
                            </label>
                            <input type="text" id="account-numbers" name="accountNumbers"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                   placeholder="Last 4 digits only for security">
                            <div class="text-xs text-gray-500 mt-1">For security, only provide last 4 digits</div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Approximate Amount in Dispute (GBP)
                            </label>
                            <input type="text" id="dispute-amount" name="disputeAmount"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                   placeholder="£0.00">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Previous Actions Taken
                        </label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" name="previousActions" value="contacted-bank" class="mr-2 rounded">
                                Contacted bank customer service
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="previousActions" value="formal-complaint" class="mr-2 rounded">
                                Filed formal complaint with bank
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="previousActions" value="ombudsman" class="mr-2 rounded">
                                Contacted 
                                <span class="tooltip-trigger text-juribank-blue cursor-help ml-1" data-term="financial-ombudsman">
                                    Financial Ombudsman Service
                                </span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="previousActions" value="legal-advice" class="mr-2 rounded">
                                Sought other legal advice
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="previousActions" value="regulatory-complaint" class="mr-2 rounded">
                                Filed regulatory complaint (FCA/PRA)
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="previousActions" value="none" class="mr-2 rounded">
                                None of the above
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Desired Outcome
                        </label>
                        <textarea id="desired-outcome" name="desiredOutcome" rows="3"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                  placeholder="What would you like to achieve? e.g., Refund of disputed charges, Account reinstatement, Compensation for damages, etc."></textarea>
                    </div>
                </div>
            </div>
        `;
    }

    renderDocumentStep() {
        return `
            <div class="step-content animate-fade-in">
                <h2 class="text-2xl font-semibold text-juribank-charcoal mb-6">Document Upload</h2>
                
                <div class="space-y-6">
                    <div class="p-4 bg-blue-50 border border-blue-200 rounded-juribank">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-juribank-blue mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <h3 class="text-sm font-medium text-juribank-blue">Secure Document Upload</h3>
                                <p class="text-sm text-blue-700 mt-1">
                                    All documents are encrypted and stored securely. Only authorised legal professionals will have access.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-4">
                            Upload Supporting Documents
                        </label>
                        
                        <div id="upload-area" class="border-2 border-dashed border-gray-300 rounded-juribank p-8 text-center hover:border-juribank-blue transition-colors duration-200 cursor-pointer">
                            <input type="file" id="file-upload" name="documents" multiple accept=".pdf,.doc,.docx,.jpg,.png,.txt" class="hidden">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <div class="mt-4">
                                <p class="text-sm text-gray-600">
                                    <span class="font-medium text-juribank-blue">Click to upload</span> or drag and drop
                                </p>
                                <p class="text-xs text-gray-500 mt-1">
                                    PDF, DOC, DOCX, JPG, PNG, TXT up to 10MB each
                                </p>
                            </div>
                        </div>
                        
                        <div id="uploaded-files" class="mt-4 space-y-2"></div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-medium text-juribank-charcoal mb-3">Recommended Documents</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 border border-gray-200 rounded-juribank">
                                <h4 class="font-medium text-gray-800 mb-2">Essential Documents</h4>
                                <ul class="text-sm text-gray-600 space-y-1">
                                    <li>• Bank statements (relevant period)</li>
                                    <li>• Account opening documentation</li>
                                    <li>• Correspondence with the bank</li>
                                    <li>• Transaction records/receipts</li>
                                </ul>
                            </div>
                            
                            <div class="p-4 border border-gray-200 rounded-juribank">
                                <h4 class="font-medium text-gray-800 mb-2">Additional Evidence</h4>
                                <ul class="text-sm text-gray-600 space-y-1">
                                    <li>• Email correspondence</li>
                                    <li>• Complaint reference numbers</li>
                                    <li>• Previous legal correspondence</li>
                                    <li>• Supporting witness statements</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-gray-50 rounded-juribank">
                        <label class="flex items-start">
                            <input type="checkbox" id="document-consent" name="documentConsent" required class="mt-1 mr-3">
                            <span class="text-sm text-gray-700">
                                I confirm that I have the right to share these documents and consent to their use for legal representation purposes. 
                                I understand that all documents will be handled in accordance with solicitor-client privilege and data protection regulations.
                                <span class="text-juribank-alert">*</span>
                            </span>
                        </label>
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPreferencesStep() {
        return `
            <div class="step-content animate-fade-in">
                <h2 class="text-2xl font-semibold text-juribank-charcoal mb-6">Legal Representation Preferences</h2>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-4">
                            Preferred Consultation Type <span class="text-juribank-alert">*</span>
                        </label>
                        
                        <div class="space-y-3">
                            <label class="consultation-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                                <input type="radio" name="consultationType" value="video-call" class="mt-1 mr-3" required>
                                <div class="flex-1">
                                    <div class="font-semibold text-juribank-charcoal">Video Consultation</div>
                                    <div class="text-sm text-gray-600">Secure video call via encrypted platform</div>
                                    <div class="text-xs text-juribank-blue mt-1">Most popular - allows document review</div>
                                </div>
                            </label>
                            
                            <label class="consultation-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                                <input type="radio" name="consultationType" value="phone-call" class="mt-1 mr-3">
                                <div class="flex-1">
                                    <div class="font-semibold text-juribank-charcoal">Phone Consultation</div>
                                    <div class="text-sm text-gray-600">Traditional phone call consultation</div>
                                </div>
                            </label>
                            
                            <label class="consultation-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                                <input type="radio" name="consultationType" value="in-person" class="mt-1 mr-3">
                                <div class="flex-1">
                                    <div class="font-semibold text-juribank-charcoal">In-Person Meeting</div>
                                    <div class="text-sm text-gray-600">Face-to-face meeting at our offices</div>
                                    <div class="text-xs text-gray-500 mt-1">Central London location</div>
                                </div>
                            </label>
                            
                            <label class="consultation-card flex items-start p-4 border-2 border-gray-200 rounded-juribank cursor-pointer hover:border-juribank-blue transition-all duration-200">
                                <input type="radio" name="consultationType" value="written-advice" class="mt-1 mr-3">
                                <div class="flex-1">
                                    <div class="font-semibold text-juribank-charcoal">Written Legal Opinion</div>
                                    <div class="text-sm text-gray-600">Detailed written analysis and advice</div>
                                </div>
                            </label>
                        </div>
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Time of Day
                            </label>
                            <select id="preferred-time" name="preferredTime"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200">
                                <option value="">No preference</option>
                                <option value="morning">Morning (9:00-12:00)</option>
                                <option value="afternoon">Afternoon (12:00-17:00)</option>
                                <option value="evening">Evening (17:00-20:00)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Language Preference
                            </label>
                            <select id="language" name="language"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200">
                                <option value="english">English</option>
                                <option value="welsh">Welsh</option>
                                <option value="interpretation-required">Interpretation Required</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Communication Preferences
                        </label>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" name="communicationPrefs" value="regular-updates" class="mr-2 rounded">
                                Regular case updates via email
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="communicationPrefs" value="sms-notifications" class="mr-2 rounded">
                                SMS notifications for urgent matters
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="communicationPrefs" value="secure-messages" class="mr-2 rounded">
                                Secure client portal messaging
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="communicationPrefs" value="document-portal" class="mr-2 rounded">
                                Electronic document sharing via secure portal
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Budget Considerations
                        </label>
                        <select id="budget" name="budget"
                                class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200">
                            <option value="">Please select</option>
                            <option value="consultation-only">Initial consultation only</option>
                            <option value="under-5000">Under £5,000</option>
                            <option value="5000-15000">£5,000 - £15,000</option>
                            <option value="15000-50000">£15,000 - £50,000</option>
                            <option value="over-50000">Over £50,000</option>
                            <option value="conditional-fee">Conditional Fee Arrangement (CFA) interest</option>
                            <option value="legal-aid">Legal aid eligibility query</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Additional Comments or Special Requirements
                        </label>
                        <textarea id="additional-comments" name="additionalComments" rows="4"
                                  class="w-full px-4 py-3 border border-gray-300 rounded-juribank focus:ring-2 focus:ring-juribank-blue focus:border-juribank-blue transition-all duration-200"
                                  placeholder="Any accessibility requirements, scheduling constraints, or other information we should know..."></textarea>
                    </div>
                    
                    <div class="p-6 bg-gray-50 rounded-juribank">
                        <h3 class="font-semibold text-juribank-charcoal mb-4">Terms and Consent</h3>
                        <div class="space-y-3">
                            <label class="flex items-start">
                                <input type="checkbox" id="privacy-consent" name="privacyConsent" required class="mt-1 mr-3">
                                <span class="text-sm text-gray-700">
                                    I have read and agree to the 
                                    <a href="#" class="text-juribank-blue hover:underline">Privacy Policy</a> and 
                                    <a href="#" class="text-juribank-blue hover:underline">Terms of Service</a>
                                    <span class="text-juribank-alert">*</span>
                                </span>
                            </label>
                            
                            <label class="flex items-start">
                                <input type="checkbox" id="marketing-consent" name="marketingConsent" class="mt-1 mr-3">
                                <span class="text-sm text-gray-700">
                                    I consent to receiving marketing communications about relevant legal services and updates
                                    (You can unsubscribe at any time)
                                </span>
                            </label>
                            
                            <label class="flex items-start">
                                <input type="checkbox" id="accuracy-declaration" name="accuracyDeclaration" required class="mt-1 mr-3">
                                <span class="text-sm text-gray-700">
                                    I declare that the information provided is true and accurate to the best of my knowledge
                                    <span class="text-juribank-alert">*</span>
                                </span>
                            </label>
                        </div>
                        <div class="error-message text-juribank-alert text-sm mt-1 hidden"></div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevStep());
        document.getElementById('save-draft-btn').addEventListener('click', () => this.saveDraft());
        
        // File upload
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-upload');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('border-juribank-blue', 'bg-blue-50');
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('border-juribank-blue', 'bg-blue-50');
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-juribank-blue', 'bg-blue-50');
                this.handleFileUpload(e.dataTransfer.files);
            });
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files));
        }
        
        // Issue type selection highlighting
        document.querySelectorAll('input[name="issueType"]').forEach(input => {
            input.addEventListener('change', (e) => {
                document.querySelectorAll('.issue-type-card').forEach(card => {
                    card.classList.remove('border-juribank-blue', 'bg-blue-50');
                });
                if (e.target.checked) {
                    e.target.closest('.issue-type-card').classList.add('border-juribank-blue', 'bg-blue-50');
                }
            });
        });
        
        // Urgency selection highlighting
        document.querySelectorAll('input[name="urgency"]').forEach(input => {
            input.addEventListener('change', (e) => {
                document.querySelectorAll('.urgency-card').forEach(card => {
                    card.classList.remove('border-juribank-blue', 'bg-blue-50');
                });
                if (e.target.checked) {
                    e.target.closest('.urgency-card').classList.add('border-juribank-blue', 'bg-blue-50');
                }
            });
        });
        
        // Consultation type selection highlighting
        document.querySelectorAll('input[name="consultationType"]').forEach(input => {
            input.addEventListener('change', (e) => {
                document.querySelectorAll('.consultation-card').forEach(card => {
                    card.classList.remove('border-juribank-blue', 'bg-blue-50');
                });
                if (e.target.checked) {
                    e.target.closest('.consultation-card').classList.add('border-juribank-blue', 'bg-blue-50');
                }
            });
        });
        
        // Tooltip functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tooltip-trigger')) {
                this.showTooltip(e.target.dataset.term);
            }
        });
        
        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.id === 'close-modal' || e.target.id === 'terms-modal') {
                document.getElementById('terms-modal').classList.add('hidden');
            }
        });
        
        // Real-time validation
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target);
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.render();
                this.attachEventListeners();
                this.updateProgressBar();
                this.scrollToTop();
            } else {
                this.submitForm();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.saveCurrentStepData();
            this.currentStep--;
            this.render();
            this.attachEventListeners();
            this.updateProgressBar();
            this.scrollToTop();
            this.populateFormData();
        }
    }

    validateCurrentStep() {
        const errors = {};
        let isValid = true;

        // Clear existing errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
        document.querySelectorAll('.border-juribank-alert').forEach(el => {
            el.classList.remove('border-juribank-alert');
        });

        switch (this.currentStep) {
            case 1:
                isValid = this.validateStep1(errors);
                break;
            case 2:
                isValid = this.validateStep2(errors);
                break;
            case 3:
                isValid = this.validateStep3(errors);
                break;
            case 4:
                isValid = this.validateStep4(errors);
                break;
            case 5:
                isValid = this.validateStep5(errors);
                break;
            case 6:
                isValid = this.validateStep6(errors);
                break;
        }

        // Display errors
        Object.keys(errors).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorDiv = field?.parentNode.querySelector('.error-message');
            if (field && errorDiv) {
                field.classList.add('border-juribank-alert');
                errorDiv.textContent = errors[fieldId];
                errorDiv.classList.remove('hidden');
            }
        });

        return isValid;
    }

    validateStep1(errors) {
        let isValid = true;
        
        const fullName = document.getElementById('full-name')?.value.trim();
        if (!fullName) {
            errors['full-name'] = 'Full name is required';
            isValid = false;
        } else if (fullName.length < 2) {
            errors['full-name'] = 'Please enter a valid full name';
            isValid = false;
        }
        
        const email = document.getElementById('email')?.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = 'Email address is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }
        
        const phone = document.getElementById('phone')?.value.trim();
        if (!phone) {
            errors.phone = 'Phone number is required';
            isValid = false;
        } else if (phone.length < 10) {
            errors.phone = 'Please enter a valid phone number';
            isValid = false;
        }
        
        const contactMethod = document.getElementById('contact-method')?.value;
        if (!contactMethod) {
            errors['contact-method'] = 'Please select a contact method';
            isValid = false;
        }
        
        return isValid;
    }

    validateStep2(errors) {
        let isValid = true;
        
        const issueType = document.querySelector('input[name="issueType"]:checked');
        if (!issueType) {
            errors['issue-type'] = 'Please select an issue type';
            isValid = false;
        }
        
        const bankName = document.getElementById('bank-name')?.value.trim();
        if (!bankName) {
            errors['bank-name'] = 'Bank name is required';
            isValid = false;
        }
        
        return isValid;
    }

    validateStep3(errors) {
        let isValid = true;
        
        const urgency = document.querySelector('input[name="urgency"]:checked');
        if (!urgency) {
            errors.urgency = 'Please select urgency level';
            isValid = false;
        }
        
        return isValid;
    }

    validateStep4(errors) {
        let isValid = true;
        
        const description = document.getElementById('case-description')?.value.trim();
        if (!description) {
            errors['case-description'] = 'Case description is required';
            isValid = false;
        } else if (description.length < 50) {
            errors['case-description'] = 'Please provide at least 50 characters of description';
            isValid = false;
        }
        
        return isValid;
    }

    validateStep5(errors) {
        let isValid = true;
        
        const documentConsent = document.getElementById('document-consent')?.checked;
        if (!documentConsent) {
            errors['document-consent'] = 'Document consent is required to proceed';
            isValid = false;
        }
        
        return isValid;
    }

    validateStep6(errors) {
        let isValid = true;
        
        const consultationType = document.querySelector('input[name="consultationType"]:checked');
        if (!consultationType) {
            errors['consultation-type'] = 'Please select a consultation type';
            isValid = false;
        }
        
        const privacyConsent = document.getElementById('privacy-consent')?.checked;
        if (!privacyConsent) {
            errors['privacy-consent'] = 'Privacy policy agreement is required';
            isValid = false;
        }
        
        const accuracyDeclaration = document.getElementById('accuracy-declaration')?.checked;
        if (!accuracyDeclaration) {
            errors['accuracy-declaration'] = 'Accuracy declaration is required';
            isValid = false;
        }
        
        return isValid;
    }

    validateField(field) {
        const errorDiv = field.parentNode.querySelector('.error-message');
        field.classList.remove('border-juribank-alert');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
        
        // Add specific field validation as needed
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value && !emailRegex.test(field.value)) {
                field.classList.add('border-juribank-alert');
                if (errorDiv) {
                    errorDiv.textContent = 'Please enter a valid email address';
                    errorDiv.classList.remove('hidden');
                }
            }
        }
    }

    saveCurrentStepData() {
        const formData = new FormData(document.getElementById('intake-form'));
        
        // Save all form data
        for (let [key, value] of formData.entries()) {
            if (this.formData[key] && Array.isArray(this.formData[key])) {
                if (!this.formData[key].includes(value)) {
                    this.formData[key].push(value);
                }
            } else if (this.formData[key]) {
                if (Array.isArray(this.formData[key])) {
                    this.formData[key].push(value);
                } else {
                    this.formData[key] = [this.formData[key], value];
                }
            } else {
                this.formData[key] = value;
            }
        }
        
        // Save checkboxes separately
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            if (!this.formData[checkbox.name]) {
                this.formData[checkbox.name] = [];
            }
            if (!this.formData[checkbox.name].includes(checkbox.value)) {
                this.formData[checkbox.name].push(checkbox.value);
            }
        });
    }

    populateFormData() {
        // Populate form fields with saved data
        Object.keys(this.formData).forEach(key => {
            const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    if (Array.isArray(this.formData[key])) {
                        field.checked = this.formData[key].includes(field.value);
                    } else {
                        field.checked = this.formData[key] === field.value;
                    }
                } else {
                    field.value = this.formData[key];
                }
            }
        });
    }

    handleFileUpload(files) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'text/plain'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        Array.from(files).forEach(file => {
            if (!allowedTypes.includes(file.type)) {
                this.showAlert('Invalid file type. Please upload PDF, DOC, DOCX, JPG, PNG, or TXT files only.', 'error');
                return;
            }
            
            if (file.size > maxSize) {
                this.showAlert('File size must be less than 10MB.', 'error');
                return;
            }
            
            this.uploadedFiles.push(file);
            this.displayUploadedFile(file);
        });
    }

    displayUploadedFile(file) {
        const uploadedFilesDiv = document.getElementById('uploaded-files');
        const fileDiv = document.createElement('div');
        fileDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg border';
        
        fileDiv.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 text-juribank-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
                <div>
                    <div class="text-sm font-medium text-gray-900">${file.name}</div>
                    <div class="text-xs text-gray-500">${this.formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" class="text-juribank-alert hover:text-red-700 p-1" onclick="this.parentNode.remove()">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        `;
        
        uploadedFilesDiv.appendChild(fileDiv);
    }

    formatFileSize(bytes) {
        if (bytes === 0) {return '0 Bytes';}
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showTooltip(term) {
        const definitions = {
            'pra-fca': 'The Prudential Regulation Authority (PRA) and Financial Conduct Authority (FCA) are the UK\'s primary banking regulators. The PRA focuses on the safety and soundness of banks, while the FCA oversees conduct and consumer protection.',
            'financial-ombudsman': 'The Financial Ombudsman Service is a free, independent service that helps resolve disputes between consumers and financial companies, including banks. They can make binding decisions and award compensation up to £350,000.'
        };
        
        const modal = document.getElementById('terms-modal');
        const content = document.getElementById('term-content');
        
        content.innerHTML = definitions[term] || 'Definition not available.';
        modal.classList.remove('hidden');
    }

    updateProgressBar() {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        document.getElementById('progress-bar').style.width = `${percentage}%`;
        document.getElementById('progress-percentage').textContent = Math.round(percentage);
        document.getElementById('current-step').textContent = this.currentStep;
        
        // Update step labels
        document.querySelectorAll('.step-label').forEach((label, index) => {
            label.classList.toggle('active', index + 1 <= this.currentStep);
        });
    }

    scrollToTop() {
        this.container.scrollIntoView({ behavior: 'smooth' });
    }

    saveDraft() {
        this.saveCurrentStepData();
        
        // Save to localStorage
        localStorage.setItem('juribank-intake-draft', JSON.stringify({
            formData: this.formData,
            currentStep: this.currentStep,
            timestamp: new Date().toISOString()
        }));
        
        this.showAlert('Draft saved successfully. You can return to complete this form later.', 'success');
    }

    loadDraft() {
        const draft = localStorage.getItem('juribank-intake-draft');
        if (draft) {
            const parsed = JSON.parse(draft);
            this.formData = parsed.formData;
            this.currentStep = parsed.currentStep;
            return true;
        }
        return false;
    }

    async submitForm() {
        this.saveCurrentStepData();
        
        // Show loading state
        const submitBtn = document.getElementById('next-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting Application...
        `;
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateSubmission();
            
            // Clear draft
            localStorage.removeItem('juribank-intake-draft');
            
            // Show success message
            this.showSuccessPage();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showAlert('There was an error submitting your application. Please try again or contact us directly.', 'error');
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async simulateSubmission() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showSuccessPage() {
        this.container.innerHTML = `
            <div class="max-w-2xl mx-auto text-center bg-white rounded-card shadow-card-lg p-12">
                <div class="mb-6">
                    <svg class="mx-auto h-16 w-16 text-juribank-success" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                
                <h1 class="text-3xl font-bold text-juribank-charcoal mb-4">
                    Application Submitted Successfully
                </h1>
                
                <p class="text-lg text-gray-600 mb-8">
                    Thank you for choosing JuriBank. Your case intake application has been received and will be reviewed by our legal team.
                </p>
                
                <div class="bg-blue-50 border border-blue-200 rounded-juribank p-6 mb-8">
                    <h3 class="font-semibold text-juribank-blue mb-2">What happens next?</h3>
                    <ul class="text-sm text-gray-700 space-y-2 text-left">
                        <li class="flex items-start">
                            <span class="text-juribank-blue mr-2">1.</span>
                            Our legal team will review your application within 24 hours
                        </li>
                        <li class="flex items-start">
                            <span class="text-juribank-blue mr-2">2.</span>
                            We'll contact you to discuss next steps and schedule a consultation
                        </li>
                        <li class="flex items-start">
                            <span class="text-juribank-blue mr-2">3.</span>
                            You'll receive a confirmation email with your case reference number
                        </li>
                        <li class="flex items-start">
                            <span class="text-juribank-blue mr-2">4.</span>
                            Access your secure client portal for case updates and documents
                        </li>
                    </ul>
                </div>
                
                <div class="text-center">
                    <p class="text-sm text-gray-600 mb-4">
                        <strong>Reference Number:</strong> JB-${Date.now().toString().slice(-8)}
                    </p>
                    
                    <div class="space-x-4">
                        <button onclick="window.location.reload()" 
                                class="px-6 py-3 border-2 border-juribank-charcoal text-juribank-charcoal rounded-juribank font-semibold hover:bg-juribank-charcoal hover:text-white transition-all duration-200">
                            Submit Another Application
                        </button>
                        
                        <button onclick="window.location.href='/'" 
                                class="px-6 py-3 bg-juribank-blue text-white rounded-juribank font-semibold hover:bg-blue-dark transition-colors duration-200">
                            Return to Homepage
                        </button>
                    </div>
                </div>
                
                <div class="mt-8 pt-6 border-t border-gray-200">
                    <p class="text-xs text-gray-500">
                        For urgent matters, please call us directly at 
                        <a href="tel:02079460958" class="text-juribank-blue hover:underline">020 7946 0958</a>
                    </p>
                </div>
            </div>
        `;
    }

    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 
                       type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                       'bg-blue-100 border-blue-400 text-blue-700';
        
        alertDiv.className = `fixed top-4 right-4 z-50 max-w-sm p-4 border rounded-lg shadow-lg ${bgColor}`;
        alertDiv.innerHTML = `
            <div class="flex items-start">
                <div class="flex-1">
                    <p class="text-sm">${message}</p>
                </div>
                <button onclick="this.parentNode.parentNode.remove()" class="ml-2 text-lg leading-none">&times;</button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// CSS Styles for the form component
const additionalStyles = `
<style>
.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.step-label {
    font-weight: 500;
    color: #9CA3AF;
    transition: color 0.2s ease;
}

.step-label.active {
    color: #3A86FF;
    font-weight: 600;
}

.issue-type-card:hover,
.urgency-card:hover,
.consultation-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tooltip-trigger {
    text-decoration: underline;
    text-decoration-style: dotted;
}

/* Custom radio and checkbox styling */
input[type="radio"]:checked,
input[type="checkbox"]:checked {
    background-color: #3A86FF;
    border-color: #3A86FF;
}

input[type="radio"]:focus,
input[type="checkbox"]:focus {
    ring-color: #3A86FF;
    border-color: #3A86FF;
}

/* File upload hover effects */
#upload-area:hover {
    background-color: #F8FAFC;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .grid-cols-2 {
        grid-template-columns: 1fr;
    }
    
    .space-x-4 > * + * {
        margin-left: 0;
        margin-top: 1rem;
    }
    
    .flex.justify-between {
        flex-direction: column;
        gap: 1rem;
    }
}

/* Professional form field focus states */
.form-input:focus,
.form-select:focus,
textarea:focus {
    outline: none;
    border-color: #3A86FF;
    box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.1);
}

/* Error state styling */
.border-juribank-alert {
    border-color: #E63946 !important;
    box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1) !important;
}

/* Button hover effects */
button:hover {
    transform: translateY(-1px);
}

button:active {
    transform: translateY(0);
}

/* Loading spinner animation */
@keyframes spin {
    to { transform: rotate(360deg); }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
`;

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add additional styles to head
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
    
    // Initialize form if container exists
    const container = document.getElementById('intake-form-container');
    if (container) {
        window.juriBankIntakeForm = new JuriBankIntakeForm('intake-form-container');
        
        // Check for saved draft
        if (window.juriBankIntakeForm.loadDraft()) {
            window.juriBankIntakeForm.render();
            window.juriBankIntakeForm.attachEventListeners();
            window.juriBankIntakeForm.updateProgressBar();
            window.juriBankIntakeForm.populateFormData();
        }
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankIntakeForm;
}