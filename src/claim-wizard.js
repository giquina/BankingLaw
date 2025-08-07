/**
 * JuriBank Educational Claim Wizard
 * Interactive step-by-step educational assessment tool
 * Helps users understand their legal options and next steps
 */

class ClaimWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.formData = {};
        this.uploadedFiles = [];
        this.validationRules = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^(\+44|0)[0-9]{10,11}$/,
            postcode: /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i
        };
        this.educationalContent = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupFileUpload();
        this.updateProgressIndicator();
        this.loadEducationalContent();
        this.setupMobileMenu();
        
        // Auto-save progress every 30 seconds
        setInterval(() => {
            this.saveProgress();
        }, 30000);
    }
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousStep());
        document.getElementById('submit-btn').addEventListener('click', (e) => this.submitForm(e));
        
        // Form validation on input
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        // Claim type selection
        document.querySelectorAll('.claim-type-option').forEach(option => {
            option.addEventListener('click', (e) => this.selectClaimType(e));
        });
        
        // Bank contact response visibility
        document.querySelectorAll('input[name="contactedBank"]').forEach(radio => {
            radio.addEventListener('change', () => this.toggleBankResponseSection());
        });
        
        // Real-time form summary updates
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('change', () => this.updateFormSummary());
        });
    }
    
    setupMobileMenu() {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (toggleBtn && mobileMenu) {
            toggleBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    loadEducationalContent() {
        this.educationalContent = {
            'bank-charges': {
                title: 'Understanding Bank Charges',
                description: 'Learn about unfair banking charges and your rights under UK banking regulations.',
                averageRefund: '£500 - £3,000',
                timeFrame: '2-4 months',
                successRate: '85%',
                nextSteps: [
                    'Review your bank statements for the past 6 years',
                    'Calculate total charges paid',
                    'Submit formal complaint to your bank',
                    'If rejected, escalate to Financial Ombudsman'
                ]
            },
            'ppi': {
                title: 'Payment Protection Insurance Claims',
                description: 'Understand PPI mis-selling and how to claim compensation.',
                averageRefund: '£2,750',
                timeFrame: '3-6 months',
                successRate: '73%',
                nextSteps: [
                    'Contact your lender directly',
                    'Request PPI information and refund',
                    'If declined, contact the Financial Ombudsman',
                    'Consider professional help if case is complex'
                ]
            },
            'packaged-accounts': {
                title: 'Packaged Account Refunds',
                description: 'Learn about packaged account fees and eligibility for refunds.',
                averageRefund: '£12-25 per month refunded',
                timeFrame: '2-3 months',
                successRate: '78%',
                nextSteps: [
                    'Review account benefits and usage',
                    'Calculate fees paid over time',
                    'Submit complaint about unsuitable sale',
                    'Request full refund of fees paid'
                ]
            }
        };
    }
    
    nextStep() {
        if (!this.validateCurrentStep()) {
            return;
        }
        
        this.saveStepData();
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressIndicator();
            this.updateNavigationButtons();
            
            // Add educational content for specific steps
            if (this.currentStep === 3) {
                this.showEducationalHint('bank-details');
            } else if (this.currentStep === 5) {
                this.showEducationalHint('documents');
            }
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgressIndicator();
            this.updateNavigationButtons();
        }
    }
    
    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.claim-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step with animation
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            setTimeout(() => {
                currentStepElement.classList.add('active');
            }, 100);
        }
        
        // Scroll to top of form
        document.querySelector('.bg-white.rounded-2xl').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
    
    updateProgressIndicator() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        // Update progress lines
        document.querySelectorAll('.progress-line').forEach((line, index) => {
            line.classList.remove('completed');
            if (index < this.currentStep - 1) {
                line.classList.add('completed');
            }
        });
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // Show/hide previous button
        if (this.currentStep === 1) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }
        
        // Show/hide next/submit button
        if (this.currentStep === this.totalSteps) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }
    
    validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Special validation for step 6 (consent checkboxes)
        if (this.currentStep === 6) {
            const requiredConsents = currentStepElement.querySelectorAll('input[name^="consent"][required]');
            let consentValid = true;
            
            requiredConsents.forEach(consent => {
                if (!consent.checked) {
                    consentValid = false;
                }
            });
            
            if (!consentValid) {
                this.showError('consent-error', 'Please tick all required consent boxes to continue.');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.required && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        
        // Specific field validations
        if (value) {
            switch (name) {
                case 'email':
                    if (!this.validationRules.email.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                    
                case 'phone':
                    if (!this.validationRules.phone.test(value.replace(/\s/g, ''))) {
                        errorMessage = 'Please enter a valid UK phone number';
                        isValid = false;
                    }
                    break;
                    
                case 'postcode':
                    if (!this.validationRules.postcode.test(value)) {
                        errorMessage = 'Please enter a valid UK postcode';
                        isValid = false;
                    }
                    break;
                    
                case 'estimatedAmount':
                    if (value && parseFloat(value) < 0) {
                        errorMessage = 'Amount cannot be negative';
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    selectClaimType(event) {
        const option = event.currentTarget;
        const radio = option.querySelector('input[type="radio"]');
        
        // Clear previous selections
        document.querySelectorAll('.claim-type-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select current option
        option.classList.add('selected');
        radio.checked = true;
        
        // Show educational content for this claim type
        const claimType = radio.value;
        this.showClaimTypeEducation(claimType);
    }
    
    showClaimTypeEducation(claimType) {
        const content = this.educationalContent[claimType];
        if (!content) return;
        
        // Create or update education panel
        let educationPanel = document.getElementById('claim-education-panel');
        if (!educationPanel) {
            educationPanel = document.createElement('div');
            educationPanel.id = 'claim-education-panel';
            educationPanel.className = 'mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6';
            
            const stepContainer = document.querySelector('[data-step="2"]');
            stepContainer.appendChild(educationPanel);
        }
        
        educationPanel.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-lightbulb text-blue-600"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-blue-900 mb-2">${content.title}</h4>
                    <p class="text-blue-800 text-sm mb-4">${content.description}</p>
                    
                    <div class="grid md:grid-cols-3 gap-4 mb-4">
                        <div class="bg-white bg-opacity-50 rounded-lg p-3 text-center">
                            <div class="text-lg font-bold text-blue-900">${content.averageRefund}</div>
                            <div class="text-xs text-blue-700">Average Refund</div>
                        </div>
                        <div class="bg-white bg-opacity-50 rounded-lg p-3 text-center">
                            <div class="text-lg font-bold text-blue-900">${content.timeFrame}</div>
                            <div class="text-xs text-blue-700">Typical Timeline</div>
                        </div>
                        <div class="bg-white bg-opacity-50 rounded-lg p-3 text-center">
                            <div class="text-lg font-bold text-blue-900">${content.successRate}</div>
                            <div class="text-xs text-blue-700">Success Rate</div>
                        </div>
                    </div>
                    
                    <div class="bg-white bg-opacity-70 rounded-lg p-4">
                        <h5 class="font-medium text-blue-900 mb-2">Educational Next Steps:</h5>
                        <ul class="text-sm text-blue-800 space-y-1">
                            ${content.nextSteps.map(step => `<li class="flex items-start"><i class="fas fa-check-circle text-green-600 mt-0.5 mr-2 flex-shrink-0"></i>${step}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Animate the panel appearance
        educationPanel.style.opacity = '0';
        educationPanel.style.transform = 'translateY(20px)';
        setTimeout(() => {
            educationPanel.style.transition = 'all 0.5s ease';
            educationPanel.style.opacity = '1';
            educationPanel.style.transform = 'translateY(0)';
        }, 100);
    }
    
    showEducationalHint(type) {
        let hint = '';
        switch (type) {
            case 'bank-details':
                hint = 'Understanding your bank relationship helps us provide more accurate guidance about your options.';
                break;
            case 'documents':
                hint = 'Documents help us understand your case better, but don\'t worry if you don\'t have everything - we can guide you on what to request from your bank.';
                break;
        }
        
        if (hint) {
            this.showNotification(hint, 'info');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' : 
            type === 'error' ? 'bg-red-100 border border-red-200 text-red-800' : 
            'bg-blue-100 border border-blue-200 text-blue-800'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} mt-0.5 mr-2"></i>
                <div class="flex-1">
                    <p class="text-sm">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    toggleBankResponseSection() {
        const contactedBank = document.querySelector('input[name="contactedBank"]:checked')?.value;
        const responseSection = document.getElementById('bank-response-section');
        
        if (contactedBank && contactedBank !== 'no') {
            responseSection.classList.remove('hidden');
        } else {
            responseSection.classList.add('hidden');
        }
    }
    
    setupFileUpload() {
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('file-upload-area');
        const uploadedFilesContainer = document.getElementById('uploaded-files');
        
        // File input change handler
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
        
        // Drag and drop handlers
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // Click to upload
        uploadArea.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                fileInput.click();
            }
        });
    }
    
    handleFiles(files) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 
                             'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        
        Array.from(files).forEach(file => {
            if (!allowedTypes.includes(file.type)) {
                this.showNotification(`File type not supported: ${file.name}`, 'error');
                return;
            }
            
            if (file.size > maxFileSize) {
                this.showNotification(`File too large: ${file.name} (max 10MB)`, 'error');
                return;
            }
            
            const fileId = Date.now() + Math.random();
            this.uploadedFiles.push({
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                type: file.type
            });
            
            this.displayUploadedFile({
                id: fileId,
                name: file.name,
                size: this.formatFileSize(file.size),
                type: file.type
            });
        });
        
        this.updateDocumentsSummary();
    }
    
    displayUploadedFile(fileData) {
        const uploadedFilesContainer = document.getElementById('uploaded-files');
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file flex items-center justify-between';
        fileElement.dataset.fileId = fileData.id;
        
        const fileIcon = this.getFileIcon(fileData.type);
        
        fileElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${fileIcon} text-blue-600 mr-3"></i>
                <div>
                    <div class="font-medium text-gray-900">${fileData.name}</div>
                    <div class="text-sm text-gray-500">${fileData.size}</div>
                </div>
            </div>
            <button type="button" class="text-red-500 hover:text-red-700 ml-4" onclick="claimWizard.removeFile(${fileData.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        uploadedFilesContainer.appendChild(fileElement);
    }
    
    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
        const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
        if (fileElement) {
            fileElement.remove();
        }
        this.updateDocumentsSummary();
    }
    
    getFileIcon(fileType) {
        if (fileType.includes('pdf')) return 'file-pdf';
        if (fileType.includes('word') || fileType.includes('document')) return 'file-word';
        if (fileType.includes('image')) return 'file-image';
        return 'file-alt';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    saveStepData() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        const formElements = currentStepElement.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
            if (element.type === 'radio' || element.type === 'checkbox') {
                if (element.checked) {
                    this.formData[element.name] = element.value;
                }
            } else {
                this.formData[element.name] = element.value;
            }
        });
    }
    
    saveProgress() {
        const progressData = {
            currentStep: this.currentStep,
            formData: this.formData,
            uploadedFiles: this.uploadedFiles.map(f => ({
                id: f.id,
                name: f.name,
                size: f.size,
                type: f.type
            })),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('claimWizardProgress', JSON.stringify(progressData));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('claimWizardProgress');
        if (saved) {
            try {
                const progressData = JSON.parse(saved);
                
                // Check if progress is less than 24 hours old
                const savedTime = new Date(progressData.timestamp);
                const now = new Date();
                const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    this.formData = progressData.formData || {};
                    this.restoreFormData();
                    
                    // Ask user if they want to continue from where they left off
                    if (progressData.currentStep > 1) {
                        this.showProgressResumeOption(progressData.currentStep);
                    }
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        }
    }
    
    showProgressResumeOption(savedStep) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Continue Your Assessment?</h3>
                <p class="text-gray-600 mb-6">We found a saved assessment in progress. Would you like to continue from step ${savedStep}?</p>
                <div class="flex space-x-3">
                    <button onclick="claimWizard.resumeProgress(${savedStep}); this.closest('.fixed').remove();" 
                            class="btn-claim-primary flex-1">
                        Continue
                    </button>
                    <button onclick="claimWizard.clearProgress(); this.closest('.fixed').remove();" 
                            class="btn-claim-secondary flex-1">
                        Start Fresh
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    resumeProgress(savedStep) {
        this.currentStep = savedStep;
        this.showStep(this.currentStep);
        this.updateProgressIndicator();
        this.updateNavigationButtons();
        this.updateFormSummary();
    }
    
    clearProgress() {
        localStorage.removeItem('claimWizardProgress');
        this.formData = {};
        this.uploadedFiles = [];
    }
    
    restoreFormData() {
        Object.keys(this.formData).forEach(name => {
            const elements = document.querySelectorAll(`[name="${name}"]`);
            elements.forEach(element => {
                if (element.type === 'radio' || element.type === 'checkbox') {
                    element.checked = element.value === this.formData[name];
                } else {
                    element.value = this.formData[name];
                }
            });
        });
    }
    
    updateFormSummary() {
        // Update summary in step 6
        document.getElementById('summary-name').textContent = 
            `${this.formData.firstName || ''} ${this.formData.lastName || ''}`.trim() || 'Not provided';
        document.getElementById('summary-email').textContent = this.formData.email || 'Not provided';
        document.getElementById('summary-phone').textContent = this.formData.phone || 'Not provided';
        document.getElementById('summary-postcode').textContent = this.formData.postcode || 'Not provided';
        
        // Claim details
        const claimTypeText = document.querySelector(`input[name="claimType"]:checked`)?.parentElement.querySelector('label')?.textContent || 'Not selected';
        document.getElementById('summary-claim-type').textContent = claimTypeText;
        
        const bankText = document.querySelector('select[name="primaryBank"]')?.selectedOptions[0]?.textContent || 'Not selected';
        document.getElementById('summary-bank').textContent = bankText;
        
        const accountTypeText = document.querySelector('select[name="accountType"]')?.selectedOptions[0]?.textContent || 'Not selected';
        document.getElementById('summary-account-type').textContent = accountTypeText;
        
        document.getElementById('summary-issue-date').textContent = this.formData.issueStartDate || 'Not provided';
        document.getElementById('summary-amount').textContent = this.formData.estimatedAmount || '0.00';
        
        this.updateDocumentsSummary();
    }
    
    updateDocumentsSummary() {
        const summaryElement = document.getElementById('summary-documents');
        if (this.uploadedFiles.length === 0) {
            summaryElement.innerHTML = '<span class="text-gray-500">No documents uploaded</span>';
        } else {
            const fileList = this.uploadedFiles.map(file => 
                `<div class="flex items-center text-sm text-gray-700 mb-1">
                    <i class="fas fa-${this.getFileIcon(file.type)} text-blue-600 mr-2"></i>
                    ${file.name}
                </div>`
            ).join('');
            summaryElement.innerHTML = fileList;
        }
    }
    
    async submitForm(event) {
        event.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Save final step data
        this.saveStepData();
        
        // Show loading state
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.processSubmission();
            
            // Show success message
            this.showSuccessMessage();
            
            // Clear saved progress
            this.clearProgress();
            
        } catch (error) {
            this.showNotification('There was an error submitting your assessment. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    async processSubmission() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate reference number
                const reference = 'JB-' + new Date().getFullYear() + '-' + 
                                 Math.random().toString(36).substr(2, 6).toUpperCase();
                
                this.submissionReference = reference;
                resolve();
            }, 2000);
        });
    }
    
    showSuccessMessage() {
        // Hide form
        document.getElementById('claim-wizard-form').parentElement.classList.add('hidden');
        
        // Show success message
        const successMessage = document.getElementById('success-message');
        successMessage.classList.remove('hidden');
        
        // Update reference number
        document.getElementById('reference-number').textContent = this.submissionReference;
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Send educational follow-up email simulation
        this.scheduleEducationalFollowup();
    }
    
    scheduleEducationalFollowup() {
        // In a real application, this would trigger backend processes
        console.log('Educational follow-up scheduled:', {
            email: this.formData.email,
            claimType: this.formData.claimType,
            reference: this.submissionReference,
            followupTime: '24 hours'
        });
    }
}

// Initialize the claim wizard when the page loads
let claimWizard;

document.addEventListener('DOMContentLoaded', () => {
    claimWizard = new ClaimWizard();
    
    // Load any saved progress
    claimWizard.loadProgress();
});

// Global functions for inline event handlers
window.nextStep = () => claimWizard.nextStep();
window.previousStep = () => claimWizard.previousStep();