/**
 * JuriBank Dynamic Form Schema Configuration
 * Comprehensive form schema with progressive disclosure, smart defaults, and validation
 */

const JuriBankFormSchema = {
    id: 'juribank-intake-form',
    title: 'JuriBank Educational Assessment Form',
    description: 'Help us understand your situation to provide appropriate educational resources',
    version: '1.0.0',
    
    // Global form settings
    settings: {
        progressPersistence: true,
        autoSave: true,
        autoSaveInterval: 30000,
        showProgressBar: true,
        allowStepNavigation: true,
        validateOnSubmit: true,
        animations: true,
        mobileOptimized: true
    },

    // Form steps configuration
    steps: [
        {
            id: 'personal-info',
            title: 'Personal Information',
            description: 'Basic information to personalize your learning experience',
            order: 1,
            fields: [
                {
                    id: 'full-name',
                    type: 'text',
                    label: 'Full Name',
                    placeholder: 'Enter your full name',
                    required: true,
                    validation: {
                        minLength: 2,
                        maxLength: 100,
                        pattern: '^[a-zA-Z\\s\\-\']+$'
                    },
                    autocomplete: 'name',
                    smartDefault: {
                        type: 'historical',
                        strategy: 'most_recent'
                    }
                },
                {
                    id: 'email',
                    type: 'email',
                    label: 'Email Address',
                    placeholder: 'your.email@example.com',
                    required: true,
                    validation: {
                        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
                    },
                    autocomplete: 'email',
                    smartDefault: {
                        type: 'historical',
                        strategy: 'most_recent'
                    }
                },
                {
                    id: 'phone',
                    type: 'tel',
                    label: 'Phone Number',
                    placeholder: '+44 20 1234 5678',
                    required: false,
                    validation: {
                        pattern: '^(\\+44|0)[0-9\\s\\-\\(\\)]{9,}$'
                    },
                    autocomplete: 'tel',
                    hint: 'UK phone number (optional)'
                },
                {
                    id: 'age-group',
                    type: 'select',
                    label: 'Age Group',
                    required: true,
                    placeholder: 'Select your age group',
                    options: [
                        { value: '16-24', label: '16-24 years' },
                        { value: '25-34', label: '25-34 years' },
                        { value: '35-44', label: '35-44 years' },
                        { value: '45-54', label: '45-54 years' },
                        { value: '55-64', label: '55-64 years' },
                        { value: '65+', label: '65+ years' }
                    ]
                },
                {
                    id: 'student-status',
                    type: 'radio',
                    label: 'Are you currently a student?',
                    required: true,
                    options: [
                        { 
                            value: 'yes', 
                            label: 'Yes, I am a student',
                            description: 'Currently enrolled in education'
                        },
                        { 
                            value: 'no', 
                            label: 'No, I am not a student',
                            description: 'Not currently studying'
                        }
                    ]
                },
                {
                    id: 'study-level',
                    type: 'select',
                    label: 'What level are you studying?',
                    required: true,
                    placeholder: 'Select your study level',
                    conditionalDisplay: {
                        field: 'student-status',
                        operator: 'equals',
                        value: 'yes',
                        action: 'show'
                    },
                    options: [
                        { value: 'gcse', label: 'GCSE / A-Levels' },
                        { value: 'undergraduate', label: 'Undergraduate' },
                        { value: 'postgraduate', label: 'Postgraduate' },
                        { value: 'professional', label: 'Professional Qualification' },
                        { value: 'other', label: 'Other' }
                    ]
                }
            ]
        },
        {
            id: 'situation-assessment',
            title: 'Situation Assessment',
            description: 'Help us understand your situation to provide relevant information',
            order: 2,
            fields: [
                {
                    id: 'issue-category',
                    type: 'radio',
                    label: 'What type of issue are you researching?',
                    required: true,
                    options: [
                        { 
                            value: 'banking-dispute', 
                            label: 'Banking Dispute',
                            description: 'Account issues, unauthorized transactions, service problems'
                        },
                        { 
                            value: 'loan-mortgage', 
                            label: 'Loan & Mortgage Issues',
                            description: 'Credit problems, mortgage disputes, loan terms'
                        },
                        { 
                            value: 'payment-issues', 
                            label: 'Payment Problems',
                            description: 'Failed payments, payment delays, card issues'
                        },
                        { 
                            value: 'financial-services', 
                            label: 'Financial Services',
                            description: 'Insurance, investments, financial advice'
                        },
                        { 
                            value: 'consumer-rights', 
                            label: 'Consumer Rights',
                            description: 'General consumer protection and rights'
                        },
                        { 
                            value: 'academic-research', 
                            label: 'Academic Research',
                            description: 'Research for coursework or dissertation'
                        }
                    ]
                },
                {
                    id: 'urgency-level',
                    type: 'radio',
                    label: 'How urgent is your need for information?',
                    required: true,
                    options: [
                        { 
                            value: 'immediate', 
                            label: 'Immediate (today)',
                            description: 'Need information right away'
                        },
                        { 
                            value: 'within-week', 
                            label: 'Within a week',
                            description: 'Need information soon'
                        },
                        { 
                            value: 'within-month', 
                            label: 'Within a month',
                            description: 'For upcoming project or decision'
                        },
                        { 
                            value: 'general-learning', 
                            label: 'General learning',
                            description: 'No specific deadline'
                        }
                    ]
                },
                {
                    id: 'financial-institution',
                    type: 'text',
                    label: 'Which financial institution is involved?',
                    placeholder: 'e.g., Barclays, HSBC, Lloyds, etc.',
                    required: false,
                    conditionalDisplay: {
                        field: 'issue-category',
                        operator: 'in_array',
                        value: ['banking-dispute', 'loan-mortgage', 'payment-issues'],
                        action: 'show'
                    },
                    smartDefault: {
                        type: 'api',
                        apiEndpoint: '/api/common-institutions',
                        dependencies: ['issue-category']
                    }
                },
                {
                    id: 'approximate-amount',
                    type: 'select',
                    label: 'Approximate amount involved (if applicable)',
                    placeholder: 'Select amount range',
                    required: false,
                    conditionalDisplay: {
                        field: 'issue-category',
                        operator: 'in_array',
                        value: ['banking-dispute', 'loan-mortgage', 'payment-issues'],
                        action: 'show'
                    },
                    options: [
                        { value: 'under-100', label: 'Under £100' },
                        { value: '100-500', label: '£100 - £500' },
                        { value: '500-1000', label: '£500 - £1,000' },
                        { value: '1000-5000', label: '£1,000 - £5,000' },
                        { value: '5000-25000', label: '£5,000 - £25,000' },
                        { value: '25000-plus', label: 'Over £25,000' },
                        { value: 'prefer-not-say', label: 'Prefer not to say' }
                    ]
                }
            ]
        },
        {
            id: 'detailed-information',
            title: 'Detailed Information',
            description: 'Provide more details to get the most relevant resources',
            order: 3,
            fields: [
                {
                    id: 'situation-description',
                    type: 'textarea',
                    label: 'Describe your situation or research question',
                    placeholder: 'Please provide details about what you need help understanding...',
                    required: true,
                    rows: 5,
                    validation: {
                        minLength: 20,
                        maxLength: 2000
                    },
                    hint: 'Minimum 20 characters required. This helps us provide better resources.'
                },
                {
                    id: 'previous-actions',
                    type: 'checkbox',
                    label: 'What steps have you already taken? (Select all that apply)',
                    required: false,
                    options: [
                        { value: 'contacted-institution', label: 'Contacted the financial institution' },
                        { value: 'filed-complaint', label: 'Filed a formal complaint' },
                        { value: 'contacted-ombudsman', label: 'Contacted Financial Ombudsman Service' },
                        { value: 'sought-advice', label: 'Sought professional advice' },
                        { value: 'researched-online', label: 'Researched online' },
                        { value: 'none', label: 'None of the above' }
                    ]
                },
                {
                    id: 'supporting-documents',
                    type: 'file',
                    label: 'Upload supporting documents (optional)',
                    multiple: true,
                    accept: '.pdf,.doc,.docx,.jpg,.png,.txt',
                    hint: 'PDF, DOC, DOCX, JPG, PNG, TXT files up to 10MB each',
                    maxFiles: 5,
                    maxSize: 10485760, // 10MB
                    required: false
                },
                {
                    id: 'timeline',
                    type: 'textarea',
                    label: 'Timeline of events (if applicable)',
                    placeholder: 'e.g., January 2024: Issue first occurred, February 2024: Contacted bank...',
                    required: false,
                    rows: 4,
                    conditionalDisplay: {
                        field: 'issue-category',
                        operator: 'not_equals',
                        value: 'academic-research',
                        action: 'show'
                    }
                }
            ]
        },
        {
            id: 'learning-preferences',
            title: 'Learning Preferences',
            description: 'Tell us how you prefer to learn and access information',
            order: 4,
            fields: [
                {
                    id: 'information-format',
                    type: 'checkbox',
                    label: 'What format of information do you prefer? (Select all that apply)',
                    required: true,
                    options: [
                        { value: 'written-guides', label: 'Written guides and articles' },
                        { value: 'video-tutorials', label: 'Video tutorials' },
                        { value: 'interactive-tools', label: 'Interactive tools and calculators' },
                        { value: 'case-studies', label: 'Real case studies and examples' },
                        { value: 'legal-documents', label: 'Template documents and forms' },
                        { value: 'community-discussion', label: 'Community discussion and peer support' }
                    ]
                },
                {
                    id: 'complexity-level',
                    type: 'radio',
                    label: 'What level of detail do you prefer?',
                    required: true,
                    options: [
                        { 
                            value: 'basic', 
                            label: 'Basic overview',
                            description: 'Simple explanations in plain English'
                        },
                        { 
                            value: 'intermediate', 
                            label: 'Intermediate detail',
                            description: 'Balanced explanation with key legal concepts'
                        },
                        { 
                            value: 'advanced', 
                            label: 'Advanced detail',
                            description: 'Comprehensive information including legal references'
                        }
                    ]
                },
                {
                    id: 'update-frequency',
                    type: 'radio',
                    label: 'How often would you like to receive updates?',
                    required: false,
                    options: [
                        { value: 'immediate', label: 'Immediate notifications' },
                        { value: 'daily', label: 'Daily digest' },
                        { value: 'weekly', label: 'Weekly summary' },
                        { value: 'monthly', label: 'Monthly updates' },
                        { value: 'none', label: 'No regular updates' }
                    ],
                    smartDefault: {
                        type: 'computed',
                        computeFunction: (context) => {
                            // Default based on urgency level
                            switch (context.formData['urgency-level']) {
                                case 'immediate': return 'immediate';
                                case 'within-week': return 'daily';
                                case 'within-month': return 'weekly';
                                default: return 'monthly';
                            }
                        },
                        dependencies: ['urgency-level']
                    }
                },
                {
                    id: 'accessibility-needs',
                    type: 'checkbox',
                    label: 'Do you have any accessibility requirements? (Select all that apply)',
                    required: false,
                    options: [
                        { value: 'large-text', label: 'Large text size' },
                        { value: 'high-contrast', label: 'High contrast colors' },
                        { value: 'screen-reader', label: 'Screen reader compatibility' },
                        { value: 'audio-content', label: 'Audio descriptions for content' },
                        { value: 'simple-language', label: 'Simplified language' },
                        { value: 'none', label: 'No special requirements' }
                    ]
                }
            ]
        }
    ],

    // Progressive disclosure rules
    conditionalLogic: {
        'study-level': [
            {
                field: 'student-status',
                operator: 'equals',
                value: 'yes',
                action: 'show'
            }
        ],
        'financial-institution': [
            {
                field: 'issue-category',
                operator: 'in_array',
                value: ['banking-dispute', 'loan-mortgage', 'payment-issues'],
                action: 'show'
            }
        ],
        'approximate-amount': [
            {
                field: 'issue-category',
                operator: 'in_array',
                value: ['banking-dispute', 'loan-mortgage', 'payment-issues'],
                action: 'show'
            }
        ],
        'timeline': [
            {
                field: 'issue-category',
                operator: 'not_equals',
                value: 'academic-research',
                action: 'show'
            }
        ]
    },

    // Smart defaults configuration
    smartDefaults: {
        'full-name': {
            type: 'historical',
            strategy: 'most_recent'
        },
        'email': {
            type: 'historical',
            strategy: 'most_recent'
        },
        'financial-institution': {
            type: 'api',
            apiEndpoint: '/api/common-institutions',
            dependencies: ['issue-category'],
            cacheTime: 3600000 // 1 hour
        },
        'update-frequency': {
            type: 'computed',
            computeFunction: `
                (context) => {
                    switch (context.formData['urgency-level']) {
                        case 'immediate': return 'immediate';
                        case 'within-week': return 'daily';
                        case 'within-month': return 'weekly';
                        default: return 'monthly';
                    }
                }
            `,
            dependencies: ['urgency-level']
        }
    },

    // Validation rules
    validationRules: {
        'full-name': {
            required: true,
            minLength: 2,
            maxLength: 100,
            pattern: '^[a-zA-Z\\s\\-\']+$',
            realTimeValidation: true,
            customValidator: {
                type: 'function',
                function: 'validatePersonName'
            }
        },
        'email': {
            required: true,
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
            realTimeValidation: true,
            customValidator: {
                type: 'api',
                endpoint: '/api/validate-email'
            }
        },
        'phone': {
            required: false,
            pattern: '^(\\+44|0)[0-9\\s\\-\\(\\)]{9,}$',
            realTimeValidation: true
        },
        'situation-description': {
            required: true,
            minLength: 20,
            maxLength: 2000,
            realTimeValidation: true,
            customValidator: {
                type: 'function',
                function: 'validateDescriptionQuality'
            }
        }
    },

    // Custom validation functions
    customValidators: {
        validatePersonName: (value) => {
            if (!value) {return 'Name is required';}
            
            const words = value.trim().split(/\s+/);
            if (words.length < 2) {
                return 'Please enter your full name (first and last name)';
            }
            
            const invalidChars = /[^a-zA-Z\s\-']/;
            if (invalidChars.test(value)) {
                return 'Name can only contain letters, spaces, hyphens, and apostrophes';
            }
            
            return true;
        },
        
        validateDescriptionQuality: (value) => {
            if (!value || value.length < 20) {
                return 'Please provide at least 20 characters of description';
            }
            
            // Check for meaningful content (not just repeated characters)
            const uniqueChars = new Set(value.toLowerCase().replace(/\s/g, '')).size;
            if (uniqueChars < 5) {
                return 'Please provide a more detailed description';
            }
            
            return true;
        }
    },

    // Submission configuration
    submission: {
        endpoint: '/api/educational-assessment',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        successRedirect: '/dashboard',
        errorHandling: {
            retryAttempts: 3,
            retryDelay: 1000,
            showUserFriendlyErrors: true
        }
    },

    // UI configuration
    ui: {
        theme: 'juribank',
        showStepNumbers: true,
        showProgressPercentage: true,
        animationDuration: 300,
        mobileBreakpoint: 768,
        touchFriendly: true,
        loadingSpinner: true
    }
};

// Export for use in applications
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankFormSchema;
} else {
    window.JuriBankFormSchema = JuriBankFormSchema;
}