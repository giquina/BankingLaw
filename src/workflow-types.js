/**
 * JuriBank Workflow Type Definitions v3.0
 * Educational platform - specific workflow implementations for different case types
 * Each workflow guides users through understanding their legal rights and options
 */

/**
 * Base Workflow Class - common functionality for all workflow types
 */
class BaseWorkflow {
    constructor() {
        this.steps = [];
        this.milestones = [];
        this.metadata = {};
    }

    getStep(stepId) {
        return this.steps.find(step => step.id === stepId);
    }

    getFirstStep() {
        return this.steps.find(step => step.isFirst === true) || this.steps[0];
    }

    getStepIndex(stepId) {
        return this.steps.findIndex(step => step.id === stepId);
    }

    getTotalSteps() {
        return this.steps.length;
    }

    getMilestones() {
        return this.milestones;
    }

    getTitle() {
        return this.metadata.title || 'Unknown Workflow';
    }

    getDescription() {
        return this.metadata.description || 'No description available';
    }

    getEstimatedTime() {
        return this.metadata.estimatedTime || '15-20 minutes';
    }

    getDifficulty() {
        return this.metadata.difficulty || 'medium';
    }

    getAverageStepTime() {
        return this.metadata.averageStepTime || 3; // minutes
    }

    async getNextStep(currentStepId, userData) {
        const currentIndex = this.getStepIndex(currentStepId);
        if (currentIndex === -1 || currentIndex === this.steps.length - 1) {
            return null; // Last step or step not found
        }

        const nextStep = this.steps[currentIndex + 1];
        
        // Check if next step has conditions
        if (nextStep.conditions && nextStep.conditions.length > 0) {
            for (const condition of nextStep.conditions) {
                const result = await condition.evaluate(userData);
                if (!result.matches) {
                    // Skip this step, try the next one
                    return this.getNextStep(nextStep.id, userData);
                }
            }
        }

        return nextStep;
    }

    async generateSummary(workflowState) {
        return {
            type: workflowState.type,
            completedSteps: workflowState.completedSteps.length,
            totalSteps: this.getTotalSteps(),
            timeSpent: this.calculateTimeSpent(workflowState),
            keyData: this.extractKeyData(workflowState),
            recommendations: await this.generateRecommendations(workflowState),
            nextSteps: await this.generateNextSteps(workflowState)
        };
    }

    calculateTimeSpent(workflowState) {
        const startTime = new Date(workflowState.startTime);
        const endTime = new Date(workflowState.completedAt);
        return Math.round((endTime - startTime) / (1000 * 60)); // minutes
    }

    extractKeyData(workflowState) {
        // Override in specific workflow implementations
        return {};
    }

    async generateRecommendations(workflowState) {
        // Override in specific workflow implementations
        return [];
    }

    async generateNextSteps(workflowState) {
        // Override in specific workflow implementations
        return [];
    }
}

/**
 * Bank Charges Workflow - Discovery → Calculation → Evidence → Letter → Submission
 */
class BankChargesWorkflow extends BaseWorkflow {
    constructor() {
        super();
        
        this.metadata = {
            title: 'Bank Charges Recovery',
            description: 'Understand and calculate potential bank charge refunds, gather evidence, and learn about the complaint process.',
            estimatedTime: '15-25 minutes',
            difficulty: 'easy',
            averageStepTime: 4,
            educationalFocus: 'Understanding your rights regarding unfair bank charges and the complaint process'
        };

        this.steps = [
            {
                id: 'discovery',
                title: 'Account Analysis',
                description: 'Help us understand your banking situation and identify potential unfair charges',
                isFirst: true,
                estimatedTime: 5,
                fields: [
                    {
                        id: 'bankName',
                        type: 'select',
                        label: 'Which bank charged you fees?',
                        required: true,
                        options: [
                            'Barclays', 'HSBC', 'Lloyds', 'NatWest', 'Santander', 
                            'TSB', 'First Direct', 'Halifax', 'Royal Bank of Scotland', 'Other'
                        ]
                    },
                    {
                        id: 'accountType',
                        type: 'select',
                        label: 'What type of account?',
                        required: true,
                        options: ['Current Account', 'Savings Account', 'Credit Card', 'Loan Account', 'Overdraft']
                    },
                    {
                        id: 'chargeTypes',
                        type: 'checkbox',
                        label: 'What types of charges did you incur? (Select all that apply)',
                        required: true,
                        options: [
                            'Overdraft fees',
                            'Returned payment fees',
                            'Late payment charges',
                            'Account maintenance fees',
                            'Transaction fees',
                            'Other charges'
                        ]
                    },
                    {
                        id: 'timeframe',
                        type: 'select',
                        label: 'Over what period did these charges occur?',
                        required: true,
                        options: ['Last 6 months', 'Last 1 year', '1-2 years ago', '2-3 years ago', 'More than 3 years ago']
                    }
                ],
                validate: async (data) => {
                    const errors = [];
                    if (!data.bankName) {errors.push('Please select your bank');}
                    if (!data.accountType) {errors.push('Please select account type');}
                    if (!data.chargeTypes || data.chargeTypes.length === 0) {
                        errors.push('Please select at least one charge type');
                    }
                    if (!data.timeframe) {errors.push('Please select timeframe');}
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        bankName: data.bankName,
                        accountType: data.accountType,
                        chargeTypes: data.chargeTypes,
                        timeframe: data.timeframe,
                        analysisNotes: 'Educational assessment completed - user understands charge types and timeframes'
                    };
                }
            },
            {
                id: 'calculation',
                title: 'Charge Calculation',
                description: 'Learn how to calculate your potential refund amount and understand bank charge regulations',
                estimatedTime: 6,
                fields: [
                    {
                        id: 'totalCharges',
                        type: 'number',
                        label: 'Approximate total amount of charges (£)',
                        required: true,
                        placeholder: 'Enter total amount in pounds'
                    },
                    {
                        id: 'monthlyAverage',
                        type: 'number',
                        label: 'Average monthly charges (£)',
                        required: false,
                        placeholder: 'Optional - helps with calculation'
                    },
                    {
                        id: 'hasStatements',
                        type: 'radio',
                        label: 'Do you have bank statements showing these charges?',
                        required: true,
                        options: [
                            { value: 'yes', label: 'Yes, I have statements' },
                            { value: 'some', label: 'I have some statements' },
                            { value: 'no', label: 'No, I need to request them' }
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Understanding Bank Charges',
                    content: [
                        'Banks must charge fees proportionate to their costs',
                        'Excessive charges may be considered unfair under consumer law',
                        'You have the right to request a breakdown of how charges are calculated',
                        'The Financial Ombudsman can review disputes about unfair charges'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.totalCharges || data.totalCharges <= 0) {
                        errors.push('Please enter a valid total charge amount');
                    }
                    if (!data.hasStatements) {
                        errors.push('Please indicate if you have bank statements');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    const calculation = {
                        totalCharges: parseFloat(data.totalCharges),
                        monthlyAverage: data.monthlyAverage ? parseFloat(data.monthlyAverage) : null,
                        hasEvidence: data.hasStatements,
                        potentialRefund: parseFloat(data.totalCharges) * 0.8 // Educational estimate
                    };
                    
                    return {
                        ...calculation,
                        educationalNote: 'This is an educational estimate. Actual refunds depend on individual circumstances and bank policies.'
                    };
                }
            },
            {
                id: 'evidence',
                title: 'Evidence Gathering',
                description: 'Learn what evidence you need and how to obtain it from your bank',
                estimatedTime: 4,
                fields: [
                    {
                        id: 'evidenceList',
                        type: 'checkbox',
                        label: 'What evidence do you currently have? (Select all that apply)',
                        required: true,
                        options: [
                            'Bank statements showing charges',
                            'Correspondence with bank about charges',
                            'Account terms and conditions',
                            'Payment history records',
                            'None of the above'
                        ]
                    },
                    {
                        id: 'requestHelp',
                        type: 'radio',
                        label: 'Do you need help requesting statements from your bank?',
                        required: true,
                        options: [
                            { value: 'yes', label: 'Yes, I need guidance on requesting statements' },
                            { value: 'no', label: 'No, I can request them myself' }
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Essential Evidence for Bank Charge Complaints',
                    content: [
                        'Bank statements are the most important evidence',
                        'You can request up to 6 years of statements from your bank',
                        'Banks must provide statements within a reasonable time',
                        'Keep records of all communication with your bank',
                        'Document the impact charges had on your finances'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.evidenceList || data.evidenceList.length === 0) {
                        errors.push('Please select what evidence you have');
                    }
                    if (!data.requestHelp) {
                        errors.push('Please indicate if you need help with statement requests');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        currentEvidence: data.evidenceList,
                        needsGuidance: data.requestHelp === 'yes',
                        evidenceScore: data.evidenceList.length > 1 ? 'strong' : 'needs-improvement',
                        nextSteps: data.requestHelp === 'yes' ? 
                            'Guidance on requesting bank statements will be provided' :
                            'User confident in obtaining evidence independently'
                    };
                }
            },
            {
                id: 'letter-preparation',
                title: 'Complaint Letter',
                description: 'Learn how to structure an effective complaint letter to your bank',
                estimatedTime: 5,
                fields: [
                    {
                        id: 'complaintReason',
                        type: 'textarea',
                        label: 'In your own words, explain why you believe the charges were unfair',
                        required: true,
                        placeholder: 'Describe your situation and why you think the charges were excessive or unfair...'
                    },
                    {
                        id: 'desiredOutcome',
                        type: 'select',
                        label: 'What outcome are you seeking?',
                        required: true,
                        options: [
                            'Full refund of all charges',
                            'Partial refund of excessive charges',
                            'Explanation of charge calculation',
                            'Future charge reduction',
                            'Other'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Writing an Effective Complaint Letter',
                    content: [
                        'Start with your account details and contact information',
                        'Clearly state the problem and dates involved',
                        'Explain why you believe charges were unfair',
                        'Include specific amounts and reference numbers',
                        'State what resolution you want',
                        'Keep tone professional and factual',
                        'Set a reasonable deadline for response (usually 8 weeks)'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.complaintReason || data.complaintReason.length < 50) {
                        errors.push('Please provide a detailed explanation (at least 50 characters)');
                    }
                    if (!data.desiredOutcome) {
                        errors.push('Please select your desired outcome');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        complaintReason: data.complaintReason,
                        desiredOutcome: data.desiredOutcome,
                        letterStructure: 'Professional complaint format recommended',
                        timelineGuidance: 'Banks have 8 weeks to provide final response'
                    };
                }
            },
            {
                id: 'submission-guidance',
                title: 'Submission Guidance',
                description: 'Learn about the complaint process and what to expect next',
                estimatedTime: 3,
                isLast: true,
                fields: [
                    {
                        id: 'submissionMethod',
                        type: 'radio',
                        label: 'How would you prefer to submit your complaint?',
                        required: true,
                        options: [
                            { value: 'online', label: 'Online banking or bank website' },
                            { value: 'email', label: 'Email to customer services' },
                            { value: 'post', label: 'Posted letter' },
                            { value: 'phone', label: 'Phone call followed by written confirmation' }
                        ]
                    },
                    {
                        id: 'followUpPlanning',
                        type: 'checkbox',
                        label: 'What follow-up actions do you want guidance on?',
                        required: false,
                        options: [
                            'Tracking complaint progress',
                            'What to do if bank rejects complaint',
                            'How to escalate to Financial Ombudsman',
                            'Understanding your rights during the process'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'The Complaint Process Timeline',
                    content: [
                        'Banks must acknowledge complaints within 5 business days',
                        'Final response required within 8 weeks maximum',
                        'If unsatisfied, you can escalate to Financial Ombudsman Service',
                        'Ombudsman service is free for consumers',
                        'Keep records of all communications',
                        'You have 6 months to escalate after final response'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.submissionMethod) {
                        errors.push('Please select your preferred submission method');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        submissionMethod: data.submissionMethod,
                        followUpGuidance: data.followUpPlanning || [],
                        processUnderstanding: 'User educated about complaint timeline and rights',
                        completionStatus: 'Educational journey completed successfully'
                    };
                }
            }
        ];

        this.milestones = [
            {
                id: 'analysis-complete',
                title: 'Situation Analysis Complete',
                description: 'You understand your charge situation and have identified potential issues',
                condition: (state) => state.completedSteps.includes('discovery')
            },
            {
                id: 'calculation-done',
                title: 'Charges Calculated',
                description: 'You have estimated your potential refund amount',
                condition: (state) => state.completedSteps.includes('calculation')
            },
            {
                id: 'evidence-planned',
                title: 'Evidence Strategy Ready',
                description: 'You know what evidence you need and how to get it',
                condition: (state) => state.completedSteps.includes('evidence')
            },
            {
                id: 'complaint-ready',
                title: 'Complaint Letter Prepared',
                description: 'You understand how to write an effective complaint',
                condition: (state) => state.completedSteps.includes('letter-preparation')
            },
            {
                id: 'process-complete',
                title: 'Educational Journey Complete',
                description: 'You have learned about the entire bank charge complaint process',
                condition: (state) => state.completedSteps.includes('submission-guidance')
            }
        ];
    }

    extractKeyData(workflowState) {
        const userData = workflowState.userData;
        return {
            bankName: userData.discovery?.bankName,
            totalCharges: userData.calculation?.totalCharges,
            potentialRefund: userData.calculation?.potentialRefund,
            evidenceScore: userData.evidence?.evidenceScore,
            submissionMethod: userData['submission-guidance']?.submissionMethod
        };
    }

    async generateRecommendations(workflowState) {
        const keyData = this.extractKeyData(workflowState);
        const recommendations = [];

        if (keyData.evidenceScore === 'needs-improvement') {
            recommendations.push({
                type: 'evidence',
                title: 'Strengthen Your Evidence',
                description: 'Request additional bank statements to support your complaint',
                priority: 'high'
            });
        }

        if (keyData.totalCharges > 500) {
            recommendations.push({
                type: 'professional',
                title: 'Consider Professional Advice',
                description: 'For large amounts, consider consulting with a qualified solicitor',
                priority: 'medium'
            });
        }

        recommendations.push({
            type: 'educational',
            title: 'Stay Informed',
            description: 'Keep track of FCA guidance on bank charges and consumer rights',
            priority: 'low'
        });

        return recommendations;
    }

    async generateNextSteps(workflowState) {
        return [
            'Gather all required evidence and documentation',
            'Draft your complaint letter using the guidance provided',
            'Submit complaint through your preferred method',
            'Track response timeline (8 weeks maximum)',
            'If unsatisfied with response, consider Financial Ombudsman Service',
            'Keep detailed records throughout the process'
        ];
    }
}

/**
 * PPI Claims Workflow - Search → Request → Analysis → Claim → Tracking
 */
class PPIClaimsWorkflow extends BaseWorkflow {
    constructor() {
        super();
        
        this.metadata = {
            title: 'PPI Information & Understanding',
            description: 'Learn about Payment Protection Insurance, how to check if you had it, and understand the complaint process.',
            estimatedTime: '12-18 minutes',
            difficulty: 'medium',
            averageStepTime: 4,
            educationalFocus: 'Understanding PPI policies and your rights regarding mis-sold insurance'
        };

        this.steps = [
            {
                id: 'ppi-search',
                title: 'PPI Policy Search',
                description: 'Learn how to identify if you had PPI on your financial products',
                isFirst: true,
                estimatedTime: 4,
                fields: [
                    {
                        id: 'productTypes',
                        type: 'checkbox',
                        label: 'What financial products did you have? (Select all that apply)',
                        required: true,
                        options: [
                            'Credit cards',
                            'Personal loans',
                            'Mortgages',
                            'Store cards',
                            'Car finance',
                            'Overdrafts'
                        ]
                    },
                    {
                        id: 'timeframe',
                        type: 'select',
                        label: 'When did you have these products?',
                        required: true,
                        options: [
                            'Before 2000',
                            '2000-2005',
                            '2005-2010',
                            '2010-2015',
                            'After 2015',
                            'Multiple periods'
                        ]
                    },
                    {
                        id: 'ppiKnowledge',
                        type: 'radio',
                        label: 'Were you aware you had PPI on any products?',
                        required: true,
                        options: [
                            { value: 'yes', label: 'Yes, I knew I had PPI' },
                            { value: 'no', label: 'No, I was not aware of PPI' },
                            { value: 'unsure', label: 'I am not sure' }
                        ]
                    }
                ],
                educationalContent: {
                    title: 'What is Payment Protection Insurance (PPI)?',
                    content: [
                        'PPI was designed to cover loan/credit payments if you could not pay',
                        'Many policies were mis-sold between 1990s and 2010',
                        'Common mis-selling included not explaining terms, adding without consent, or selling unsuitable policies',
                        'PPI deadline for new complaints was August 29, 2019',
                        'You can still complain about PPI sold after the deadline in some circumstances'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.productTypes || data.productTypes.length === 0) {
                        errors.push('Please select at least one financial product');
                    }
                    if (!data.timeframe) {errors.push('Please select timeframe');}
                    if (!data.ppiKnowledge) {errors.push('Please indicate your PPI awareness');}
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        productTypes: data.productTypes,
                        timeframe: data.timeframe,
                        ppiAwareness: data.ppiKnowledge,
                        searchCompleted: true,
                        educationalNote: 'User understands PPI basics and has identified potential products'
                    };
                }
            },
            {
                id: 'document-request',
                title: 'Documentation Request',
                description: 'Learn how to request information about your PPI policies from lenders',
                estimatedTime: 5,
                fields: [
                    {
                        id: 'lenders',
                        type: 'checkbox',
                        label: 'Which lenders did you have products with? (Select all that apply)',
                        required: true,
                        options: [
                            'Barclays',
                            'HSBC',
                            'Lloyds Banking Group',
                            'NatWest/RBS',
                            'Santander',
                            'TSB',
                            'Halifax',
                            'Nationwide',
                            'Other high street banks',
                            'Other lenders'
                        ]
                    },
                    {
                        id: 'documentAccess',
                        type: 'radio',
                        label: 'Do you have access to old statements or agreements?',
                        required: true,
                        options: [
                            { value: 'yes', label: 'Yes, I have some documentation' },
                            { value: 'no', label: 'No, I need to request everything' },
                            { value: 'partial', label: 'I have some but need more' }
                        ]
                    },
                    {
                        id: 'requestHelp',
                        type: 'checkbox',
                        label: 'What information do you need guidance on requesting?',
                        required: false,
                        options: [
                            'Credit agreements and terms',
                            'Payment history and statements',
                            'PPI policy documents',
                            'Original application forms',
                            'Sales call recordings (if available)'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Requesting PPI Information from Lenders',
                    content: [
                        'You have the right to request information about products you held',
                        'Lenders must provide available information within 40 days',
                        'Request should include: full name, address, account numbers, approximate dates',
                        'Some information may no longer be available due to retention policies',
                        'There may be a small fee for some document requests'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.lenders || data.lenders.length === 0) {
                        errors.push('Please select at least one lender');
                    }
                    if (!data.documentAccess) {
                        errors.push('Please indicate document availability');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        targetLenders: data.lenders,
                        documentStatus: data.documentAccess,
                        requestGuidance: data.requestHelp || [],
                        requestStrategy: 'User understands how to request PPI documentation',
                        nextAction: 'Prepare information requests for identified lenders'
                    };
                }
            },
            {
                id: 'policy-analysis',
                title: 'Policy Analysis',
                description: 'Learn how to review PPI policies and identify potential mis-selling',
                estimatedTime: 6,
                fields: [
                    {
                        id: 'eligibilityIssues',
                        type: 'checkbox',
                        label: 'Did any of these situations apply when you got PPI? (Select all that apply)',
                        required: false,
                        options: [
                            'Self-employed or in uncertain employment',
                            'Had pre-existing medical conditions',
                            'Was unemployed or retired',
                            'Already had adequate insurance cover',
                            'Could not claim due to age restrictions',
                            'None of these applied'
                        ]
                    },
                    {
                        id: 'salesProcess',
                        type: 'checkbox',
                        label: 'How was PPI presented to you? (Select all that apply)',
                        required: true,
                        options: [
                            'Told it was compulsory for the loan/credit',
                            'Added without clear explanation',
                            'Pressured to buy to get better rates',
                            'Not told about exclusions or limitations',
                            'Not given choice about buying it',
                            'Cannot remember the sales process'
                        ]
                    },
                    {
                        id: 'costAwareness',
                        type: 'radio',
                        label: 'Were you made aware of the PPI cost?',
                        required: true,
                        options: [
                            { value: 'yes', label: 'Yes, cost was clearly explained' },
                            { value: 'no', label: 'No, cost was not explained' },
                            { value: 'unclear', label: 'Cost was mentioned but not clear' }
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Common Signs of PPI Mis-selling',
                    content: [
                        'Told PPI was compulsory when it was optional',
                        'Not informed about exclusions that made you ineligible',
                        'Added without your knowledge or consent',
                        'Pressured to buy with threats about loan approval',
                        'Not suitable for your circumstances (employment, health, age)',
                        'Excessive cost not properly explained',
                        'No cooling-off period mentioned'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.salesProcess || data.salesProcess.length === 0) {
                        errors.push('Please select how PPI was presented to you');
                    }
                    if (!data.costAwareness) {
                        errors.push('Please indicate if you were aware of PPI costs');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    const missellingIndicators = [];
                    
                    if (data.salesProcess.includes('Told it was compulsory for the loan/credit')) {
                        missellingIndicators.push('Compulsory claim');
                    }
                    if (data.salesProcess.includes('Added without clear explanation')) {
                        missellingIndicators.push('Lack of disclosure');
                    }
                    if (data.eligibilityIssues && data.eligibilityIssues.length > 0 && 
                        !data.eligibilityIssues.includes('None of these applied')) {
                        missellingIndicators.push('Eligibility issues');
                    }
                    
                    return {
                        eligibilityIssues: data.eligibilityIssues,
                        salesProcess: data.salesProcess,
                        costAwareness: data.costAwareness,
                        missellingIndicators: missellingIndicators,
                        strength: missellingIndicators.length > 1 ? 'strong' : 
                                missellingIndicators.length === 1 ? 'moderate' : 'weak',
                        analysisComplete: true
                    };
                }
            },
            {
                id: 'complaint-preparation',
                title: 'Complaint Preparation',
                description: 'Learn how to structure your PPI complaint effectively',
                estimatedTime: 4,
                fields: [
                    {
                        id: 'primaryConcern',
                        type: 'select',
                        label: 'What is your main concern about the PPI sale?',
                        required: true,
                        options: [
                            'Was told it was compulsory',
                            'Was not suitable for my circumstances',
                            'Cost was not properly explained',
                            'Added without my knowledge',
                            'Exclusions were not explained',
                            'Was pressured into buying it'
                        ]
                    },
                    {
                        id: 'supportingEvidence',
                        type: 'checkbox',
                        label: 'What evidence do you have or can obtain?',
                        required: true,
                        options: [
                            'Original credit agreements',
                            'PPI policy documents',
                            'Payment records showing PPI premiums',
                            'Correspondence about the sale',
                            'Medical records (if health-related exclusions)',
                            'Employment records (if employment-related issues)'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Building a Strong PPI Complaint',
                    content: [
                        'Focus on specific mis-selling points rather than general dissatisfaction',
                        'Provide as much detail as possible about the sales process',
                        'Include dates, locations, and staff members if remembered',
                        'Explain why PPI was unsuitable for your circumstances',
                        'Request refund of premiums plus 8% simple interest',
                        'Also request refund of any loan interest paid on PPI premiums'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.primaryConcern) {
                        errors.push('Please select your main concern');
                    }
                    if (!data.supportingEvidence || data.supportingEvidence.length === 0) {
                        errors.push('Please select available evidence');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        primaryConcern: data.primaryConcern,
                        supportingEvidence: data.supportingEvidence,
                        complaintStrategy: 'Educational guidance provided for complaint structure',
                        evidenceStrength: data.supportingEvidence.length >= 3 ? 'strong' : 'adequate'
                    };
                }
            },
            {
                id: 'process-tracking',
                title: 'Process & Timeline',
                description: 'Understand the complaint process and what to expect',
                estimatedTime: 3,
                isLast: true,
                fields: [
                    {
                        id: 'timelineUnderstanding',
                        type: 'checkbox',
                        label: 'What aspects of the process do you want to understand better?',
                        required: false,
                        options: [
                            'How long the bank has to respond',
                            'What happens if the bank rejects my complaint',
                            'How the Financial Ombudsman Service works',
                            'What compensation I might be entitled to',
                            'How to track my complaint progress'
                        ]
                    },
                    {
                        id: 'supportNeeded',
                        type: 'radio',
                        label: 'Do you feel confident handling the complaint process?',
                        required: true,
                        options: [
                            { value: 'confident', label: 'Yes, I understand the process' },
                            { value: 'somewhat', label: 'Mostly, but may need some guidance' },
                            { value: 'unsure', label: 'No, I would benefit from professional help' }
                        ]
                    }
                ],
                educationalContent: {
                    title: 'PPI Complaint Process Timeline',
                    content: [
                        'Banks must acknowledge complaints within 5 business days',
                        'Final response required within 8 weeks',
                        'If rejected or unsatisfied, you can escalate to Financial Ombudsman',
                        'Ombudsman has 6 months from final response to accept complaints',
                        'Typical compensation includes: refunded premiums + 8% interest + consequential losses',
                        'Process is free for consumers - avoid paid claims companies if possible'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.supportNeeded) {
                        errors.push('Please indicate your confidence level');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        timelineInterests: data.timelineUnderstanding || [],
                        confidenceLevel: data.supportNeeded,
                        processUnderstanding: 'User educated about PPI complaint timeline and procedures',
                        educationalJourneyComplete: true
                    };
                }
            }
        ];

        this.milestones = [
            {
                id: 'ppi-identified',
                title: 'PPI Products Identified',
                description: 'You have identified which products may have had PPI',
                condition: (state) => state.completedSteps.includes('ppi-search')
            },
            {
                id: 'documentation-planned',
                title: 'Documentation Strategy Ready',
                description: 'You know what documents to request and from which lenders',
                condition: (state) => state.completedSteps.includes('document-request')
            },
            {
                id: 'misselling-assessed',
                title: 'Mis-selling Assessment Complete',
                description: 'You understand potential mis-selling indicators in your case',
                condition: (state) => state.completedSteps.includes('policy-analysis')
            },
            {
                id: 'complaint-structured',
                title: 'Complaint Strategy Prepared',
                description: 'You have a clear complaint structure and evidence plan',
                condition: (state) => state.completedSteps.includes('complaint-preparation')
            },
            {
                id: 'process-understood',
                title: 'PPI Process Mastered',
                description: 'You understand the complete PPI complaint process',
                condition: (state) => state.completedSteps.includes('process-tracking')
            }
        ];
    }

    extractKeyData(workflowState) {
        const userData = workflowState.userData;
        return {
            productTypes: userData['ppi-search']?.productTypes,
            lenderCount: userData['document-request']?.targetLenders?.length,
            missellingStrength: userData['policy-analysis']?.strength,
            primaryConcern: userData['complaint-preparation']?.primaryConcern,
            confidenceLevel: userData['process-tracking']?.confidenceLevel
        };
    }

    async generateRecommendations(workflowState) {
        const keyData = this.extractKeyData(workflowState);
        const recommendations = [];

        if (keyData.missellingStrength === 'strong') {
            recommendations.push({
                type: 'action',
                title: 'Strong Case - Proceed with Complaint',
                description: 'You have strong indicators of mis-selling. Consider proceeding with your complaint.',
                priority: 'high'
            });
        }

        if (keyData.confidenceLevel === 'unsure') {
            recommendations.push({
                type: 'support',
                title: 'Consider Professional Guidance',
                description: 'Given your confidence level, you might benefit from consulting with a qualified advisor.',
                priority: 'medium'
            });
        }

        recommendations.push({
            type: 'deadline',
            title: 'Act Within Time Limits',
            description: 'Remember complaint deadlines and ensure you act within required timeframes.',
            priority: 'high'
        });

        return recommendations;
    }

    async generateNextSteps(workflowState) {
        const keyData = this.extractKeyData(workflowState);
        const steps = [
            'Request documentation from identified lenders',
            'Review all received documents for PPI policies',
            'Prepare complaint focusing on main mis-selling concerns'
        ];

        if (keyData.confidenceLevel === 'confident') {
            steps.push('Submit complaint directly to lender(s)');
        } else {
            steps.push('Consider seeking guidance before submitting complaint');
        }

        steps.push(
            'Track complaint progress and response times',
            'If rejected, consider escalation to Financial Ombudsman Service'
        );

        return steps;
    }
}

/**
 * Investment Issues Workflow - Assessment → Evidence → Professional Matching
 */
class InvestmentIssuesWorkflow extends BaseWorkflow {
    constructor() {
        super();
        
        this.metadata = {
            title: 'Investment Problem Assessment',
            description: 'Understand investment issues, assess your situation, and learn about professional help options.',
            estimatedTime: '10-15 minutes',
            difficulty: 'hard',
            averageStepTime: 5,
            educationalFocus: 'Understanding investment problems and when professional advice is needed'
        };

        this.steps = [
            {
                id: 'investment-assessment',
                title: 'Investment Assessment',
                description: 'Help us understand your investment situation and identify potential issues',
                isFirst: true,
                estimatedTime: 6,
                fields: [
                    {
                        id: 'investmentTypes',
                        type: 'checkbox',
                        label: 'What types of investments are you concerned about? (Select all that apply)',
                        required: true,
                        options: [
                            'Stocks and shares ISAs',
                            'Pension investments',
                            'Unit trusts/mutual funds',
                            'Investment bonds',
                            'Structured products',
                            'Foreign exchange (Forex)',
                            'Cryptocurrency',
                            'Property investments',
                            'Other investments'
                        ]
                    },
                    {
                        id: 'problemType',
                        type: 'select',
                        label: 'What is the main issue with your investment?',
                        required: true,
                        options: [
                            'Unsuitable advice given',
                            'High fees not explained',
                            'Poor performance vs. expectations',
                            'Mis-sold investment product',
                            'Lack of risk explanation',
                            'Unauthorized transactions',
                            'Platform or provider issues',
                            'Transfer/pension problems'
                        ]
                    },
                    {
                        id: 'investmentValue',
                        type: 'select',
                        label: 'What is the approximate value of affected investments?',
                        required: true,
                        options: [
                            'Under £1,000',
                            '£1,000 - £5,000',
                            '£5,000 - £25,000',
                            '£25,000 - £100,000',
                            '£100,000 - £500,000',
                            'Over £500,000'
                        ]
                    },
                    {
                        id: 'timeframe',
                        type: 'select',
                        label: 'When did you make the investment or receive advice?',
                        required: true,
                        options: [
                            'Within last 6 months',
                            '6 months - 1 year ago',
                            '1-3 years ago',
                            '3-6 years ago',
                            'More than 6 years ago'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Common Investment Problems',
                    content: [
                        'Unsuitable advice - recommendations not matching risk tolerance or circumstances',
                        'Failure to explain risks - not understanding what you could lose',
                        'High fees - charges that significantly impact returns',
                        'Mis-selling - products sold inappropriately for your situation',
                        'Poor execution - trades not carried out properly',
                        'Platform failures - technical or service issues affecting your investments'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.investmentTypes || data.investmentTypes.length === 0) {
                        errors.push('Please select at least one investment type');
                    }
                    if (!data.problemType) {errors.push('Please select the main problem');}
                    if (!data.investmentValue) {errors.push('Please select investment value range');}
                    if (!data.timeframe) {errors.push('Please select timeframe');}
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    const riskLevel = this.assessRiskLevel(data);
                    return {
                        investmentTypes: data.investmentTypes,
                        problemType: data.problemType,
                        investmentValue: data.investmentValue,
                        timeframe: data.timeframe,
                        riskAssessment: riskLevel,
                        assessmentComplete: true
                    };
                }
            },
            {
                id: 'evidence-collection',
                title: 'Evidence & Documentation',
                description: 'Learn what evidence you need for investment complaints',
                estimatedTime: 4,
                fields: [
                    {
                        id: 'availableEvidence',
                        type: 'checkbox',
                        label: 'What documentation do you have? (Select all that apply)',
                        required: true,
                        options: [
                            'Original investment advice/recommendations',
                            'Investment platform statements',
                            'Correspondence with advisor/platform',
                            'Fact find or suitability report',
                            'Terms and conditions',
                            'Fee schedules or charges information',
                            'Performance reports',
                            'None of the above'
                        ]
                    },
                    {
                        id: 'adviceDetails',
                        type: 'radio',
                        label: 'Did you receive professional investment advice?',
                        required: true,
                        options: [
                            { value: 'independent', label: 'Yes, from an independent financial advisor' },
                            { value: 'restricted', label: 'Yes, from a bank or tied advisor' },
                            { value: 'execution', label: 'No, I made execution-only investments' },
                            { value: 'unsure', label: 'I am not sure what type of service I received' }
                        ]
                    },
                    {
                        id: 'recordKeeping',
                        type: 'checkbox',
                        label: 'What additional records do you need help obtaining?',
                        required: false,
                        options: [
                            'Meeting notes or call recordings',
                            'Original application forms',
                            'Risk assessment questionnaires',
                            'Product literature provided',
                            'Historical valuations',
                            'Transaction histories'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Essential Evidence for Investment Complaints',
                    content: [
                        'Advice records - notes or recordings of recommendations given',
                        'Suitability reports - formal documentation of advice rationale',
                        'Your circumstances - evidence of financial situation when advice given',
                        'Product information - what you were told vs. actual product features',
                        'Communications - emails, letters, or meeting notes',
                        'Financial impact - evidence of losses or unsuitable charges'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.availableEvidence || data.availableEvidence.length === 0) {
                        errors.push('Please select available evidence');
                    }
                    if (!data.adviceDetails) {
                        errors.push('Please indicate the type of investment service received');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    const evidenceStrength = this.assessEvidenceStrength(data.availableEvidence);
                    return {
                        availableEvidence: data.availableEvidence,
                        adviceType: data.adviceDetails,
                        additionalNeeds: data.recordKeeping || [],
                        evidenceStrength: evidenceStrength,
                        regulatoryProtection: this.determineRegulation(data.adviceDetails)
                    };
                }
            },
            {
                id: 'professional-matching',
                title: 'Professional Help Assessment',
                description: 'Understand when and what type of professional help might be beneficial',
                estimatedTime: 5,
                isLast: true,
                fields: [
                    {
                        id: 'complexityLevel',
                        type: 'radio',
                        label: 'How complex do you feel your investment issue is?',
                        required: true,
                        options: [
                            { value: 'simple', label: 'Simple - clear mis-selling or unsuitable advice' },
                            { value: 'moderate', label: 'Moderate - some technical aspects involved' },
                            { value: 'complex', label: 'Complex - multiple products, advice, or technical issues' }
                        ]
                    },
                    {
                        id: 'supportPreference',
                        type: 'select',
                        label: 'What type of support would you prefer?',
                        required: true,
                        options: [
                            'Handle complaint myself with guidance',
                            'Get initial advice then handle myself',
                            'Professional representation throughout',
                            'Not sure - need help deciding'
                        ]
                    },
                    {
                        id: 'professionalTypes',
                        type: 'checkbox',
                        label: 'What types of professional help interest you? (Select all that apply)',
                        required: false,
                        options: [
                            'Specialist investment complaint solicitors',
                            'Independent financial advisors for review',
                            'Claims management companies',
                            'Pro bono legal advice services',
                            'Citizens Advice or similar free services',
                            'Professional regulatory body guidance'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'When to Seek Professional Help with Investments',
                    content: [
                        'High value investments (£25,000+) - professional help often cost-effective',
                        'Complex products - structured products, SIPPs, or unusual investments',
                        'Multiple advisors or products - coordinated professional approach beneficial',
                        'Time limits approaching - professional help can expedite process',
                        'Regulatory complexity - understanding FSCS protection and FCA rules',
                        'Emotional stress - professional support reduces personal burden'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.complexityLevel) {
                        errors.push('Please assess the complexity level');
                    }
                    if (!data.supportPreference) {
                        errors.push('Please select your support preference');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    return {
                        complexityLevel: data.complexityLevel,
                        supportPreference: data.supportPreference,
                        professionalInterests: data.professionalTypes || [],
                        professionalRecommendation: this.generateProfessionalRecommendation(data),
                        educationalGuidanceComplete: true
                    };
                }
            }
        ];

        this.milestones = [
            {
                id: 'issue-identified',
                title: 'Investment Issue Identified',
                description: 'You have clearly identified your investment problem',
                condition: (state) => state.completedSteps.includes('investment-assessment')
            },
            {
                id: 'evidence-assessed',
                title: 'Evidence Assessment Complete',
                description: 'You understand what evidence you have and what you need',
                condition: (state) => state.completedSteps.includes('evidence-collection')
            },
            {
                id: 'support-strategy',
                title: 'Support Strategy Determined',
                description: 'You have a clear plan for the type of professional help you need',
                condition: (state) => state.completedSteps.includes('professional-matching')
            }
        ];
    }

    assessRiskLevel(data) {
        let riskScore = 0;
        
        // High-risk investment types
        if (data.investmentTypes.includes('Structured products') || 
            data.investmentTypes.includes('Foreign exchange (Forex)') ||
            data.investmentTypes.includes('Cryptocurrency')) {
            riskScore += 3;
        }
        
        // High-value investments
        if (data.investmentValue.includes('£100,000') || data.investmentValue.includes('Over £500,000')) {
            riskScore += 2;
        }
        
        // Serious problem types
        if (data.problemType === 'Unsuitable advice given' || 
            data.problemType === 'Mis-sold investment product') {
            riskScore += 2;
        }
        
        if (riskScore >= 5) {return 'high';}
        if (riskScore >= 3) {return 'medium';}
        return 'low';
    }

    assessEvidenceStrength(evidenceList) {
        if (evidenceList.includes('None of the above')) {return 'weak';}
        
        const strongEvidence = [
            'Original investment advice/recommendations',
            'Fact find or suitability report',
            'Correspondence with advisor/platform'
        ];
        
        const hasStrongEvidence = strongEvidence.some(item => evidenceList.includes(item));
        return hasStrongEvidence && evidenceList.length >= 3 ? 'strong' : 'moderate';
    }

    determineRegulation(adviceType) {
        switch (adviceType) {
            case 'independent':
            case 'restricted':
                return 'FCA regulated - full protection available';
            case 'execution':
                return 'Limited protection - execution-only service';
            default:
                return 'Unclear - needs investigation';
        }
    }

    generateProfessionalRecommendation(data) {
        if (data.complexityLevel === 'complex' || data.supportPreference === 'Professional representation throughout') {
            return 'Strongly recommend professional representation due to complexity';
        }
        
        if (data.complexityLevel === 'moderate') {
            return 'Consider initial professional consultation with option to proceed independently';
        }
        
        return 'May be suitable for self-handling with appropriate guidance and support';
    }

    extractKeyData(workflowState) {
        const userData = workflowState.userData;
        return {
            riskLevel: userData['investment-assessment']?.riskAssessment,
            investmentValue: userData['investment-assessment']?.investmentValue,
            evidenceStrength: userData['evidence-collection']?.evidenceStrength,
            complexityLevel: userData['professional-matching']?.complexityLevel,
            supportPreference: userData['professional-matching']?.supportPreference
        };
    }

    async generateRecommendations(workflowState) {
        const keyData = this.extractKeyData(workflowState);
        const recommendations = [];

        if (keyData.riskLevel === 'high') {
            recommendations.push({
                type: 'urgent',
                title: 'High-Risk Investment Issue',
                description: 'This appears to be a serious investment issue requiring urgent attention',
                priority: 'high'
            });
        }

        if (keyData.evidenceStrength === 'weak') {
            recommendations.push({
                type: 'evidence',
                title: 'Strengthen Your Evidence',
                description: 'Gather additional documentation before proceeding with complaint',
                priority: 'high'
            });
        }

        if (keyData.complexityLevel === 'complex') {
            recommendations.push({
                type: 'professional',
                title: 'Professional Help Recommended',
                description: 'Complex investment issues benefit from professional expertise',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    async generateNextSteps(workflowState) {
        const keyData = this.extractKeyData(workflowState);
        const steps = [];

        if (keyData.evidenceStrength === 'weak') {
            steps.push('Gather additional evidence and documentation');
        }

        steps.push('Research regulatory protection for your investment type');

        if (keyData.complexityLevel === 'complex' || keyData.supportPreference.includes('Professional')) {
            steps.push('Consult with qualified investment complaint specialist');
        } else {
            steps.push('Prepare complaint based on educational guidance provided');
        }

        steps.push('Check complaint time limits for your situation');
        steps.push('Consider Financial Ombudsman Service for regulated investments');

        return steps;
    }
}

/**
 * Mortgage Problems Workflow - Evaluation → Documentation → Resolution Path
 */
class MortgageProblemsWorkflow extends BaseWorkflow {
    constructor() {
        super();
        
        this.metadata = {
            title: 'Mortgage Problem Assessment',
            description: 'Understand mortgage issues, evaluate your situation, and learn about resolution options.',
            estimatedTime: '18-25 minutes',
            difficulty: 'hard',
            averageStepTime: 6,
            educationalFocus: 'Understanding mortgage problems and available support options'
        };

        this.steps = [
            {
                id: 'mortgage-evaluation',
                title: 'Mortgage Situation Evaluation',
                description: 'Help us understand your mortgage problem and current situation',
                isFirst: true,
                estimatedTime: 8,
                fields: [
                    {
                        id: 'problemType',
                        type: 'select',
                        label: 'What is the main issue with your mortgage?',
                        required: true,
                        options: [
                            'Payment difficulties/arrears',
                            'Interest rate or payment increases',
                            'Mortgage advice was unsuitable',
                            'Lender service problems',
                            'Repossession proceedings started',
                            'Endowment shortfall issues',
                            'Equity release concerns',
                            'Mortgage transfer/porting problems'
                        ]
                    },
                    {
                        id: 'mortgageValue',
                        type: 'select',
                        label: 'What is the approximate outstanding mortgage amount?',
                        required: true,
                        options: [
                            'Under £50,000',
                            '£50,000 - £100,000',
                            '£100,000 - £200,000',
                            '£200,000 - £400,000',
                            '£400,000 - £600,000',
                            'Over £600,000'
                        ]
                    },
                    {
                        id: 'lenderName',
                        type: 'select',
                        label: 'Who is your mortgage lender?',
                        required: true,
                        options: [
                            'Barclays',
                            'Halifax',
                            'HSBC',
                            'Lloyds Bank',
                            'Nationwide',
                            'NatWest',
                            'Royal Bank of Scotland',
                            'Santander',
                            'TSB',
                            'Yorkshire Building Society',
                            'Other building society',
                            'Other lender'
                        ]
                    },
                    {
                        id: 'timeframe',
                        type: 'select',
                        label: 'When did you take out this mortgage?',
                        required: true,
                        options: [
                            'Within last 2 years',
                            '2-5 years ago',
                            '5-10 years ago',
                            '10-15 years ago',
                            'More than 15 years ago'
                        ]
                    },
                    {
                        id: 'urgencyLevel',
                        type: 'radio',
                        label: 'How urgent is your situation?',
                        required: true,
                        options: [
                            { value: 'immediate', label: 'Immediate - repossession proceedings or court action' },
                            { value: 'urgent', label: 'Urgent - several missed payments or formal warnings' },
                            { value: 'concerning', label: 'Concerning - struggling but managing payments' },
                            { value: 'planning', label: 'Planning - anticipating future difficulties' }
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Common Mortgage Problems and Rights',
                    content: [
                        'Payment difficulties - lenders must treat customers fairly and consider alternatives',
                        'Interest rate disputes - understand your mortgage terms and rate change rights',
                        'Unsuitable advice - advisors must recommend appropriate mortgages for your circumstances',
                        'Service complaints - lenders must handle complaints promptly and fairly',
                        'Repossession - lenders must follow strict procedures and explore all alternatives first',
                        'You have rights under MCOB rules and FCA guidance for fair treatment'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.problemType) {errors.push('Please select the main problem');}
                    if (!data.mortgageValue) {errors.push('Please select mortgage value');}
                    if (!data.lenderName) {errors.push('Please select your lender');}
                    if (!data.timeframe) {errors.push('Please select when you took the mortgage');}
                    if (!data.urgencyLevel) {errors.push('Please select urgency level');}
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    const riskAssessment = this.assessMortgageRisk(data);
                    return {
                        problemType: data.problemType,
                        mortgageValue: data.mortgageValue,
                        lenderName: data.lenderName,
                        timeframe: data.timeframe,
                        urgencyLevel: data.urgencyLevel,
                        riskAssessment: riskAssessment,
                        evaluationComplete: true
                    };
                }
            },
            {
                id: 'documentation-review',
                title: 'Documentation & Evidence',
                description: 'Learn what documentation you need for mortgage complaints and support',
                estimatedTime: 6,
                fields: [
                    {
                        id: 'availableDocuments',
                        type: 'checkbox',
                        label: 'What mortgage-related documents do you have? (Select all that apply)',
                        required: true,
                        options: [
                            'Original mortgage offer/agreement',
                            'Recent mortgage statements',
                            'Payment history records',
                            'Correspondence with lender',
                            'Mortgage advice records',
                            'Income/affordability evidence from application',
                            'Property valuation reports',
                            'Insurance policies (building/life)',
                            'None of the above'
                        ]
                    },
                    {
                        id: 'paymentHistory',
                        type: 'radio',
                        label: 'What is your recent payment history?',
                        required: true,
                        options: [
                            { value: 'current', label: 'Up to date with all payments' },
                            { value: 'occasional', label: 'Occasional late payments' },
                            { value: 'arrears', label: 'Currently in arrears' },
                            { value: 'severe', label: 'Significant arrears or default notices' }
                        ]
                    },
                    {
                        id: 'communicationRecords',
                        type: 'checkbox',
                        label: 'What communication records do you have with your lender?',
                        required: false,
                        options: [
                            'Letters about payment problems',
                            'Email correspondence',
                            'Notes from phone conversations',
                            'Meeting records or agreements',
                            'Complaint correspondence',
                            'Legal notices or formal warnings'
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Essential Mortgage Documentation',
                    content: [
                        'Mortgage agreement - original terms and conditions of your loan',
                        'Payment records - evidence of payments made and any arrears',
                        'Correspondence - all communication with your lender about problems',
                        'Financial evidence - proof of income, expenses, and circumstances',
                        'Advice records - if you received mortgage advice, keep all documentation',
                        'Legal notices - any formal notices received about arrears or proceedings'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.availableDocuments || data.availableDocuments.length === 0) {
                        errors.push('Please select available documents');
                    }
                    if (!data.paymentHistory) {
                        errors.push('Please indicate your payment history');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    const documentationStrength = this.assessDocumentationStrength(data);
                    return {
                        availableDocuments: data.availableDocuments,
                        paymentHistory: data.paymentHistory,
                        communicationRecords: data.communicationRecords || [],
                        documentationStrength: documentationStrength,
                        evidenceGaps: this.identifyEvidenceGaps(data)
                    };
                }
            },
            {
                id: 'resolution-pathways',
                title: 'Resolution Options',
                description: 'Understand available options for resolving your mortgage problems',
                estimatedTime: 9,
                isLast: true,
                fields: [
                    {
                        id: 'preferredResolution',
                        type: 'select',
                        label: 'What would be your preferred resolution?',
                        required: true,
                        options: [
                            'Keep property - arrange manageable payments',
                            'Complaint resolution with compensation',
                            'Mortgage modification or restructuring',
                            'Transfer to new lender',
                            'Sell property and clear debt',
                            'Professional mediation/advice',
                            'Not sure - need guidance on options'
                        ]
                    },
                    {
                        id: 'supportSources',
                        type: 'checkbox',
                        label: 'What types of support interest you? (Select all that apply)',
                        required: true,
                        options: [
                            'Free debt advice (StepChange, Citizens Advice)',
                            'Housing charity support (Shelter, Crisis)',
                            'Specialist mortgage advice',
                            'Legal advice/representation',
                            'Financial Ombudsman Service',
                            'Local authority housing support',
                            'Professional mediation services'
                        ]
                    },
                    {
                        id: 'actionTimeline',
                        type: 'radio',
                        label: 'What is your preferred timeline for taking action?',
                        required: true,
                        options: [
                            { value: 'immediate', label: 'Immediate - I need help right away' },
                            { value: 'soon', label: 'Soon - within the next few weeks' },
                            { value: 'planned', label: 'Planned - within the next few months' },
                            { value: 'research', label: 'Research phase - gathering information first' }
                        ]
                    }
                ],
                educationalContent: {
                    title: 'Mortgage Problem Resolution Options',
                    content: [
                        'Payment arrangements - temporary or permanent payment reductions',
                        'Mortgage complaints - challenge unsuitable advice or poor service',
                        'Forbearance - lender agreements to suspend payments temporarily',
                        'Mortgage modification - changing terms to make payments manageable',
                        'Voluntary sale - selling before repossession proceedings',
                        'Professional support - free debt advice and housing charity help',
                        'Legal protection - understanding your rights and lender obligations'
                    ]
                },
                validate: async (data) => {
                    const errors = [];
                    if (!data.preferredResolution) {
                        errors.push('Please select preferred resolution');
                    }
                    if (!data.supportSources || data.supportSources.length === 0) {
                        errors.push('Please select types of support');
                    }
                    if (!data.actionTimeline) {
                        errors.push('Please select action timeline');
                    }
                    return { isValid: errors.length === 0, errors };
                },
                process: async (data) => {
                    const resolutionPlan = this.generateResolutionPlan(data);
                    return {
                        preferredResolution: data.preferredResolution,
                        supportSources: data.supportSources,
                        actionTimeline: data.actionTimeline,
                        resolutionPlan: resolutionPlan,
                        educationalJourneyComplete: true
                    };
                }
            }
        ];

        this.milestones = [
            {
                id: 'situation-assessed',
                title: 'Mortgage Situation Assessed',
                description: 'You have clearly identified your mortgage problem and urgency level',
                condition: (state) => state.completedSteps.includes('mortgage-evaluation')
            },
            {
                id: 'evidence-reviewed',
                title: 'Documentation Review Complete',
                description: 'You understand what evidence you have and what you need',
                condition: (state) => state.completedSteps.includes('documentation-review')
            },
            {
                id: 'resolution-planned',
                title: 'Resolution Strategy Developed',
                description: 'You have a clear plan for addressing your mortgage problems',
                condition: (state) => state.completedSteps.includes('resolution-pathways')
            }
        ];
    }

    assessMortgageRisk(data) {
        let riskScore = 0;
        
        if (data.urgencyLevel === 'immediate') {riskScore += 5;}
        else if (data.urgencyLevel === 'urgent') {riskScore += 3;}
        else if (data.urgencyLevel === 'concerning') {riskScore += 1;}
        
        if (data.problemType === 'Repossession proceedings started') {riskScore += 4;}
        else if (data.problemType === 'Payment difficulties/arrears') {riskScore += 2;}
        
        if (riskScore >= 6) {return 'critical';}
        if (riskScore >= 3) {return 'high';}
        if (riskScore >= 1) {return 'medium';}
        return 'low';
    }

    assessDocumentationStrength(data) {
        const hasNone = data.availableDocuments.includes('None of the above');
        if (hasNone) {return 'weak';}
        
        const strongDocs = [
            'Original mortgage offer/agreement',
            'Recent mortgage statements',
            'Correspondence with lender'
        ];
        
        const hasStrongDocs = strongDocs.some(doc => data.availableDocuments.includes(doc));
        const totalDocs = data.availableDocuments.length;
        
        if (hasStrongDocs && totalDocs >= 4) {return 'strong';}
        if (hasStrongDocs || totalDocs >= 3) {return 'moderate';}
        return 'weak';
    }

    identifyEvidenceGaps(data) {
        const gaps = [];
        
        if (!data.availableDocuments.includes('Original mortgage offer/agreement')) {
            gaps.push('Original mortgage agreement needed');
        }
        
        if (!data.availableDocuments.includes('Recent mortgage statements')) {
            gaps.push('Recent statements required');
        }
        
        if (!data.communicationRecords || data.communicationRecords.length === 0) {
            gaps.push('Communication records important for complaints');
        }
        
        return gaps;
    }

    generateResolutionPlan(data) {
        const plan = {
            immediateActions: [],
            mediumTermActions: [],
            supportContacts: []
        };
        
        if (data.actionTimeline === 'immediate') {
            plan.immediateActions.push('Contact lender immediately if in arrears');
            plan.immediateActions.push('Seek urgent debt advice from StepChange or Citizens Advice');
        }
        
        if (data.supportSources.includes('Free debt advice (StepChange, Citizens Advice)')) {
            plan.supportContacts.push('StepChange Debt Charity: 0800 138 1111');
            plan.supportContacts.push('Citizens Advice: 0800 144 8848');
        }
        
        if (data.supportSources.includes('Housing charity support (Shelter, Crisis)')) {
            plan.supportContacts.push('Shelter: 0808 800 4444');
        }
        
        plan.mediumTermActions.push('Review mortgage terms and payment options');
        plan.mediumTermActions.push('Consider formal complaint if service issues identified');
        
        return plan;
    }

    extractKeyData(workflowState) {
        const userData = workflowState.userData;
        return {
            riskLevel: userData['mortgage-evaluation']?.riskAssessment,
            urgencyLevel: userData['mortgage-evaluation']?.urgencyLevel,
            documentationStrength: userData['documentation-review']?.documentationStrength,
            preferredResolution: userData['resolution-pathways']?.preferredResolution,
            actionTimeline: userData['resolution-pathways']?.actionTimeline
        };
    }

    async generateRecommendations(workflowState) {
        const keyData = this.extractKeyData(workflowState);
        const recommendations = [];

        if (keyData.riskLevel === 'critical') {
            recommendations.push({
                type: 'urgent',
                title: 'Seek Immediate Help',
                description: 'Your situation requires immediate professional debt advice and legal support',
                priority: 'critical'
            });
        }

        if (keyData.urgencyLevel === 'immediate' || keyData.urgencyLevel === 'urgent') {
            recommendations.push({
                type: 'support',
                title: 'Contact Debt Charity Now',
                description: 'Free debt advice charities can provide immediate guidance and support',
                priority: 'high'
            });
        }

        if (keyData.documentationStrength === 'weak') {
            recommendations.push({
                type: 'evidence',
                title: 'Gather Essential Documents',
                description: 'Collect mortgage agreement and recent statements before taking action',
                priority: 'medium'
            });
        }

        return recommendations;
    }

    async generateNextSteps(workflowState) {
        const keyData = this.extractKeyData(workflowState);
        const steps = [];

        if (keyData.urgencyLevel === 'immediate') {
            steps.push('Contact lender immediately to discuss situation');
            steps.push('Call StepChange (0800 138 1111) or Citizens Advice (0800 144 8848) today');
        }

        steps.push('Gather all relevant mortgage documentation');
        steps.push('Review mortgage terms and understand your rights');

        if (keyData.actionTimeline === 'immediate' || keyData.actionTimeline === 'soon') {
            steps.push('Arrange debt advice appointment within 48 hours');
        }

        steps.push('Consider formal complaint if lender service issues identified');
        steps.push('Explore payment arrangement options with lender');
        steps.push('Keep detailed records of all communications');

        return steps;
    }
}

// Export workflow classes
window.BaseWorkflow = BaseWorkflow;
window.BankChargesWorkflow = BankChargesWorkflow;
window.PPIClaimsWorkflow = PPIClaimsWorkflow;
window.InvestmentIssuesWorkflow = InvestmentIssuesWorkflow;
window.MortgageProblemsWorkflow = MortgageProblemsWorkflow;