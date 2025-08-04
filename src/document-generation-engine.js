// Automated Document Generation Engine
// JuriBank Educational Platform - Consumer Banking Documents

class AutomatedDocumentGenerator {
    constructor() {
        this.templates = new Map();
        this.jurisdictionTemplates = new Map();
        this.bankingInstitutions = new Map();
        this.regulatoryRequirements = new Map();
        this.calculationEngines = new Map();
        this.validationRules = new Map();
        this.plainEnglishDictionary = new Map();
        this.documentHistory = new Map();
        
        this.initializeConsumerBankingTemplates();
        this.initializeBankingInstitutions();
        this.initializeRegulatoryFramework();
        this.initializePlainEnglishDictionary();
    }

    // Initialize consumer banking document templates
    initializeConsumerBankingTemplates() {
        console.log('📄 Initializing JuriBank Consumer Banking Document Templates...');

        // Bank Complaint Letter - General Template
        this.addTemplate({
            id: 'bank-complaint-general',
            name: 'General Bank Complaint Letter',
            category: 'Bank Complaints',
            jurisdiction: 'UK',
            target_institutions: ['all'],
            description: 'Standard complaint letter template for UK banking issues',
            educational_notes: 'Use this template to formally document your complaint with your bank',
            legal_basis: [
                'Financial Services Act 2012',
                'Consumer Rights Act 2015',
                'FCA DISP Rules'
            ],
            fields: [
                {
                    id: 'customer_name',
                    type: 'text',
                    label: 'Your Full Name',
                    required: true,
                    placeholder: 'Enter your full legal name'
                },
                {
                    id: 'customer_address',
                    type: 'textarea',
                    label: 'Your Address',
                    required: true,
                    placeholder: 'Your full postal address'
                },
                {
                    id: 'customer_phone',
                    type: 'tel',
                    label: 'Contact Phone Number',
                    required: true
                },
                {
                    id: 'customer_email',
                    type: 'email',
                    label: 'Email Address',
                    required: true
                },
                {
                    id: 'account_number',
                    type: 'text',
                    label: 'Account Number',
                    required: true,
                    placeholder: 'Your account number (last 4 digits shown in documents)'
                },
                {
                    id: 'bank_name',
                    type: 'select',
                    label: 'Bank/Financial Institution',
                    required: true,
                    options: ['Barclays', 'HSBC', 'Lloyds Banking Group', 'NatWest Group', 'Santander UK', 'Other']
                },
                {
                    id: 'complaint_type',
                    type: 'select',
                    label: 'Type of Complaint',
                    required: true,
                    options: [
                        'Unauthorized transactions',
                        'Account closure',
                        'Charges and fees',
                        'Service quality',
                        'Data protection breach',
                        'Discrimination',
                        'Overdraft issues',
                        'Credit decisions',
                        'Other'
                    ]
                },
                {
                    id: 'incident_date',
                    type: 'date',
                    label: 'Date of Incident',
                    required: true
                },
                {
                    id: 'complaint_details',
                    type: 'textarea',
                    label: 'Detailed Description of Complaint',
                    required: true,
                    placeholder: 'Describe what happened, when, and how it affected you',
                    ai_assistance: true
                },
                {
                    id: 'financial_loss',
                    type: 'number',
                    label: 'Financial Loss (£)',
                    placeholder: '0.00',
                    step: '0.01'
                },
                {
                    id: 'desired_outcome',
                    type: 'textarea',
                    label: 'What resolution are you seeking?',
                    required: true,
                    placeholder: 'Specify what you want the bank to do to resolve this matter',
                    ai_assistance: true
                },
                {
                    id: 'previous_contact',
                    type: 'textarea',
                    label: 'Previous Contact with Bank',
                    placeholder: 'Describe any previous attempts to resolve this issue'
                }
            ],
            template_content: `
{{customer_name}}
{{customer_address}}

{{bank_name}}
Complaints Department
[Bank Address - Auto-populated]

Date: {{current_date}}

Dear Sir/Madam,

RE: FORMAL COMPLAINT - ACCOUNT NUMBER: {{account_number_masked}}

I am writing to formally complain about {{complaint_type_lowercase}} concerning my account with your institution.

COMPLAINT DETAILS
Incident Date: {{incident_date}}
Account Number: {{account_number_masked}}
Customer Reference: {{customer_reference}}

DESCRIPTION OF ISSUE
{{complaint_details}}

{{#if previous_contact}}
PREVIOUS CONTACT
{{previous_contact}}
{{/if}}

IMPACT AND LOSS
{{#if financial_loss}}
As a result of this issue, I have suffered financial loss totaling £{{financial_loss}}.
{{/if}}

This matter has caused me significant inconvenience and distress. I rely on your banking services for my daily financial needs, and this issue has disrupted my ability to manage my finances effectively.

RESOLUTION SOUGHT
{{desired_outcome}}

REGULATORY POSITION
Under the Financial Conduct Authority's dispute resolution rules (DISP), you are required to:
- Acknowledge this complaint within 5 business days
- Provide a final response within 8 weeks
- If you cannot resolve the complaint within 8 weeks, issue a final response explaining the delay

If I am not satisfied with your response, I have the right to refer this matter to the Financial Ombudsman Service free of charge.

SUPPORTING EVIDENCE
I have attached the following supporting documents:
- Account statements
- Previous correspondence
- [Other relevant evidence]

I trust you will investigate this matter thoroughly and provide a satisfactory resolution. I look forward to your acknowledgment within 5 business days and your final response within the regulatory timeframe.

Please contact me on {{customer_phone}} or {{customer_email}} if you require any additional information.

Yours faithfully,

{{customer_name}}
Date: {{current_date}}

Attachments: [List of attached documents]
            `,
            legal_requirements: [
                'Must include account details for identification',
                'Clear description of the complaint',
                'Specific resolution sought',
                'Reference to regulatory framework',
                'Contact details for response'
            ],
            educational_guidance: [
                'Keep copies of all correspondence',
                'Note down reference numbers provided by the bank',
                'Set calendar reminders for response deadlines',
                'Gather all relevant supporting evidence before sending'
            ]
        });

        // Subject Access Request Template
        this.addTemplate({
            id: 'gdpr-sar-template',
            name: 'GDPR Subject Access Request',
            category: 'Data Protection',
            jurisdiction: 'UK',
            description: 'Template for requesting personal data from financial institutions',
            educational_notes: 'Use this to request copies of all personal data held about you',
            legal_basis: [
                'UK GDPR Article 15',
                'Data Protection Act 2018',
                'ICO Guidance on SAR'
            ],
            fields: [
                {
                    id: 'data_subject_name',
                    type: 'text',
                    label: 'Your Full Name',
                    required: true
                },
                {
                    id: 'data_subject_address',
                    type: 'textarea',
                    label: 'Your Address',
                    required: true
                },
                {
                    id: 'data_subject_dob',
                    type: 'date',
                    label: 'Your Date of Birth',
                    required: true
                },
                {
                    id: 'relationship_with_org',
                    type: 'select',
                    label: 'Your Relationship with Organization',
                    required: true,
                    options: [
                        'Current customer',
                        'Former customer',
                        'Job applicant',
                        'Former employee',
                        'Other'
                    ]
                },
                {
                    id: 'account_details',
                    type: 'textarea',
                    label: 'Account/Reference Numbers',
                    placeholder: 'Any account numbers, reference numbers, or customer IDs'
                },
                {
                    id: 'data_categories',
                    type: 'checkbox',
                    label: 'Categories of Data Requested',
                    options: [
                        'All personal data held',
                        'Account transaction history',
                        'Credit assessments and scores',
                        'Marketing preferences',
                        'Complaint records',
                        'Call recordings',
                        'CCTV footage',
                        'Third party data sharing records'
                    ]
                },
                {
                    id: 'time_period',
                    type: 'select',
                    label: 'Time Period',
                    options: [
                        'All time periods',
                        'Last 12 months',
                        'Last 24 months',
                        'Custom date range'
                    ]
                },
                {
                    id: 'custom_date_from',
                    type: 'date',
                    label: 'From Date (if custom range)',
                    conditional: 'time_period==Custom date range'
                },
                {
                    id: 'custom_date_to',
                    type: 'date',
                    label: 'To Date (if custom range)',
                    conditional: 'time_period==Custom date range'
                }
            ],
            template_content: `
{{data_subject_name}}
{{data_subject_address}}

[Organization Name]
Data Protection Officer/Customer Services
[Organization Address]

Date: {{current_date}}

Dear Data Protection Officer,

RE: SUBJECT ACCESS REQUEST UNDER UK GDPR

I am writing to make a Subject Access Request under Article 15 of the UK General Data Protection Regulation and Section 45 of the Data Protection Act 2018.

PERSONAL DETAILS
Full Name: {{data_subject_name}}
Date of Birth: {{data_subject_dob}}
Address: {{data_subject_address}}
Relationship: {{relationship_with_org}}

{{#if account_details}}
ACCOUNT/REFERENCE DETAILS
{{account_details}}
{{/if}}

INFORMATION REQUESTED
I request access to the following categories of personal data:
{{#each data_categories}}
- {{this}}
{{/each}}

TIME PERIOD
{{#if time_period}}
{{#if custom_date_from}}
Date Range: {{custom_date_from}} to {{custom_date_to}}
{{else}}
Time Period: {{time_period}}
{{/if}}
{{/if}}

SPECIFIC REQUIREMENTS
Please provide the following information about my personal data:
1. What personal data you process about me
2. The purposes for which my data is processed
3. The categories of personal data concerned
4. The recipients or categories of recipients to whom my data has been disclosed
5. The retention period for my data
6. The source of my data (if not collected directly from me)
7. Details of any automated decision-making or profiling

FORMAT AND DELIVERY
Please provide this information in a commonly used electronic format. If the volume of information is substantial, please contact me to discuss the most appropriate method of delivery.

IDENTITY VERIFICATION
I understand you may require proof of identity. I am prepared to provide:
- Copy of photo ID (passport/driving licence)
- Proof of address
- [Other verification as reasonably required]

LEGAL OBLIGATIONS
Under UK GDPR, you must:
- Acknowledge this request promptly
- Provide the requested information within one month
- Provide information free of charge (unless manifestly unfounded or excessive)
- Inform me if you need to extend the response period

RIGHT TO COMPLAIN
If you fail to respond appropriately to this request, I have the right to complain to the Information Commissioner's Office.

Please acknowledge receipt of this request and advise of your reference number for tracking purposes.

I look forward to your response within the statutory timeframe.

Yours faithfully,

{{data_subject_name}}
Date: {{current_date}}

Enclosures: [Identity verification documents]
            `,
            legal_requirements: [
                'Clear identification of data subject',
                'Specific categories of data requested',
                'Reasonable timeframe specified',
                'Identity verification process',
                'Reference to legal basis'
            ],
            educational_guidance: [
                'You have the right to request this information free of charge',
                'Organizations must respond within one month',
                'Keep copies of your request and any responses',
                'You can complain to the ICO if your request is not handled properly'
            ]
        });

        // Financial Ombudsman Service Complaint Template
        this.addTemplate({
            id: 'fos-complaint-template',
            name: 'Financial Ombudsman Service Complaint',
            category: 'Ombudsman Complaints',
            jurisdiction: 'UK',
            description: 'Template for complaints to the Financial Ombudsman Service',
            educational_notes: 'Use this after exhausting the bank\'s internal complaints process',
            legal_basis: [
                'Financial Services and Markets Act 2000',
                'FOS Rules and Procedures',
                'DISP Rules'
            ],
            fields: [
                {
                    id: 'complainant_name',
                    type: 'text',
                    label: 'Your Full Name',
                    required: true
                },
                {
                    id: 'complainant_address',
                    type: 'textarea',
                    label: 'Your Address',
                    required: true
                },
                {
                    id: 'complainant_phone',
                    type: 'tel',
                    label: 'Phone Number',
                    required: true
                },
                {
                    id: 'complainant_email',
                    type: 'email',
                    label: 'Email Address',
                    required: true
                },
                {
                    id: 'business_name',
                    type: 'text',
                    label: 'Name of Financial Business',
                    required: true
                },
                {
                    id: 'product_service',
                    type: 'select',
                    label: 'Product/Service Type',
                    required: true,
                    options: [
                        'Current account',
                        'Savings account',
                        'Credit card',
                        'Personal loan',
                        'Mortgage',
                        'Insurance',
                        'Investment',
                        'Pension',
                        'Payment services',
                        'Other'
                    ]
                },
                {
                    id: 'complaint_nature',
                    type: 'textarea',
                    label: 'Nature of Complaint',
                    required: true,
                    placeholder: 'Briefly describe what went wrong',
                    ai_assistance: true
                },
                {
                    id: 'financial_loss_amount',
                    type: 'number',
                    label: 'Financial Loss Amount (£)',
                    step: '0.01',
                    placeholder: '0.00'
                },
                {
                    id: 'bank_final_response_date',
                    type: 'date',
                    label: 'Date of Bank\'s Final Response',
                    required: true
                },
                {
                    id: 'bank_response_satisfactory',
                    type: 'radio',
                    label: 'Was the bank\'s response satisfactory?',
                    required: true,
                    options: ['No', 'Partially', 'No response received']
                },
                {
                    id: 'resolution_sought',
                    type: 'textarea',
                    label: 'What resolution do you want?',
                    required: true,
                    ai_assistance: true
                },
                {
                    id: 'additional_info',
                    type: 'textarea',
                    label: 'Additional Information',
                    placeholder: 'Any other relevant details'
                }
            ],
            template_content: `
Financial Ombudsman Service
Exchange Tower
London E14 9SR

Date: {{current_date}}

Dear Financial Ombudsman Service,

RE: COMPLAINT AGAINST {{business_name}}

I am writing to lodge a formal complaint against {{business_name}} regarding {{product_service}} services.

COMPLAINANT DETAILS
Name: {{complainant_name}}
Address: {{complainant_address}}
Phone: {{complainant_phone}}
Email: {{complainant_email}}

BUSINESS DETAILS
Financial Business: {{business_name}}
Product/Service: {{product_service}}

COMPLAINT SUMMARY
{{complaint_nature}}

FINANCIAL IMPACT
{{#if financial_loss_amount}}
As a result of this issue, I have suffered financial loss of £{{financial_loss_amount}}.
{{else}}
While I have not suffered direct financial loss, this matter has caused significant inconvenience and distress.
{{/if}}

PREVIOUS COMPLAINT PROCESS
I initially complained to {{business_name}} and received their final response on {{bank_final_response_date}}.

Their response was {{bank_response_satisfactory_lowercase}} because:
[Explain why the bank's response was unsatisfactory]

RESOLUTION SOUGHT
{{resolution_sought}}

SUPPORTING EVIDENCE
I have enclosed the following supporting documents:
- Copy of original complaint to {{business_name}}
- Copy of {{business_name}}'s final response letter
- Relevant account statements
- Correspondence with {{business_name}}
- [Other supporting evidence]

{{#if additional_info}}
ADDITIONAL INFORMATION
{{additional_info}}
{{/if}}

DECLARATION
I confirm that:
- The information provided is true and accurate
- I have not referred this complaint to court
- I have not received a final response or eight weeks have passed since my complaint to {{business_name}}

I understand that the Financial Ombudsman Service will investigate this matter impartially and that their decision will be binding on {{business_name}} if I accept it.

I look forward to your acknowledgment and investigation of this complaint.

Yours faithfully,

{{complainant_name}}
Date: {{current_date}}

Enclosures: [List of supporting documents]
            `,
            legal_requirements: [
                'Must have received final response from business or 8 weeks passed',
                'Clear statement of complaint and resolution sought',
                'Supporting evidence must be provided',
                'Declaration of accuracy and court proceedings',
                'Complaint must be within FOS jurisdiction'
            ],
            educational_guidance: [
                'Free service - no charge for making a complaint',
                'Usually must complain to business first',
                'Time limit: normally 6 months from final response',
                'FOS decision is binding on the business if you accept it',
                'Keep copies of all documents sent'
            ]
        });

        console.log('✅ Consumer banking document templates initialized');
    }

    // Initialize banking institutions database
    initializeBankingInstitutions() {
        const institutions = [
            {
                name: 'Barclays',
                complaints_address: 'Barclays Bank UK PLC, Complaints Team, 1234 Pavilion Drive, Northampton NN4 7SG',
                complaints_phone: '0800 400 100',
                complaints_email: 'complaints@barclays.co.uk',
                fca_reference: '122702',
                ombudsman_eligible: true
            },
            {
                name: 'HSBC UK',
                complaints_address: 'HSBC UK Bank plc, Customer Relations, BX8 1HB',
                complaints_phone: '03457 404 404',
                complaints_email: 'customer.relations@hsbc.co.uk',
                fca_reference: '114216',
                ombudsman_eligible: true
            },
            {
                name: 'Lloyds Bank',
                complaints_address: 'Lloyds Bank plc, Complaints, BX1 1LT',
                complaints_phone: '0345 602 1997',
                complaints_email: 'customer.complaints@lloydsbank.co.uk',
                fca_reference: '119278',
                ombudsman_eligible: true
            },
            {
                name: 'NatWest',
                complaints_address: 'NatWest, Complaints Department, Freepost RRBS-GZBT-GCXL, BX8 7SB',
                complaints_phone: '0800 200 400',
                complaints_email: 'complaints@natwest.com',
                fca_reference: '114543',
                ombudsman_eligible: true
            },
            {
                name: 'Santander UK',
                complaints_address: 'Santander UK plc, Complaints Department, Bootle GIR 0AA',
                complaints_phone: '0800 9 123 123',
                complaints_email: 'complaints@santander.co.uk',
                fca_reference: '106054',
                ombudsman_eligible: true
            }
        ];

        institutions.forEach(institution => {
            this.bankingInstitutions.set(institution.name, institution);
        });

        console.log('🏦 Banking institutions database initialized');
    }

    // Initialize regulatory framework
    initializeRegulatoryFramework() {
        // FCA DISP Rules
        this.regulatoryRequirements.set('disp-complaint-handling', {
            rule_reference: 'DISP 1.4',
            description: 'Complaint handling procedures',
            requirements: [
                'Acknowledge complaint within 5 business days',
                'Provide final response within 8 weeks',
                'Include FOS referral rights in final response',
                'Keep records for 3 years'
            ],
            time_limits: {
                acknowledgment: 5, // business days
                final_response: 56 // calendar days (8 weeks)
            }
        });

        // Consumer Rights Act 2015
        this.regulatoryRequirements.set('consumer-rights', {
            rule_reference: 'Consumer Rights Act 2015',
            description: 'Consumer protection in financial services',
            requirements: [
                'Services must be performed with reasonable care and skill',
                'Services must be performed within reasonable time',
                'Right to repeat performance or price reduction',
                'Right to compensation for losses'
            ]
        });

        // UK GDPR Requirements
        this.regulatoryRequirements.set('uk-gdpr-sar', {
            rule_reference: 'UK GDPR Article 15',
            description: 'Subject Access Request requirements',
            requirements: [
                'Respond within one month',
                'Provide information free of charge',
                'Verify identity of data subject',
                'Provide information in accessible format'
            ],
            time_limits: {
                response: 30 // calendar days
            }
        });

        console.log('⚖️ Regulatory framework initialized');
    }

    // Initialize Plain English Dictionary
    initializePlainEnglishDictionary() {
        const legalTerms = [
            {
                legal_term: 'Final Response',
                plain_english: 'The bank\'s final decision on your complaint',
                context: 'banking complaints'
            },
            {
                legal_term: 'Subject Access Request',
                plain_english: 'A request to see what personal information an organization holds about you',
                context: 'data protection'
            },
            {
                legal_term: 'Regulatory breach',
                plain_english: 'When a financial institution breaks the rules set by regulators',
                context: 'compliance'
            },
            {
                legal_term: 'Redress',
                plain_english: 'Compensation or action to put things right',
                context: 'complaints'
            },
            {
                legal_term: 'Ombudsman',
                plain_english: 'An independent person who resolves disputes between customers and businesses',
                context: 'dispute resolution'
            }
        ];

        legalTerms.forEach(term => {
            this.plainEnglishDictionary.set(term.legal_term.toLowerCase(), {
                plain_english: term.plain_english,
                context: term.context
            });
        });

        console.log('📚 Plain English dictionary initialized');
    }

    // Add template to database
    addTemplate(template) {
        template.created_date = new Date().toISOString();
        template.version = '1.0';
        template.usage_count = 0;
        
        this.templates.set(template.id, template);
        
        // Index by jurisdiction
        if (!this.jurisdictionTemplates.has(template.jurisdiction)) {
            this.jurisdictionTemplates.set(template.jurisdiction, []);
        }
        this.jurisdictionTemplates.get(template.jurisdiction).push(template.id);
    }

    // Get templates by category and jurisdiction
    getTemplates(filters = {}) {
        let availableTemplates = Array.from(this.templates.values());

        if (filters.category) {
            availableTemplates = availableTemplates.filter(t => 
                t.category === filters.category
            );
        }

        if (filters.jurisdiction) {
            availableTemplates = availableTemplates.filter(t => 
                t.jurisdiction === filters.jurisdiction
            );
        }

        if (filters.institution) {
            availableTemplates = availableTemplates.filter(t => 
                !t.target_institutions || 
                t.target_institutions.includes('all') ||
                t.target_institutions.includes(filters.institution)
            );
        }

        return availableTemplates.sort((a, b) => b.usage_count - a.usage_count);
    }

    // Generate document from template
    async generateDocument(templateId, userData, options = {}) {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }

        // Validate required fields
        const validation = this.validateUserData(template, userData);
        if (!validation.valid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Increment usage count
        template.usage_count++;

        // Process template content
        let documentContent = template.template_content;
        const processedData = await this.processUserData(template, userData, options);

        // Replace template variables
        documentContent = this.replaceTemplateVariables(documentContent, processedData);

        // Apply plain English translations if requested
        if (options.plain_english) {
            documentContent = this.translateToPlainEnglish(documentContent);
        }

        // Generate document metadata
        const documentMetadata = {
            template_id: templateId,
            template_name: template.name,
            generated_date: new Date().toISOString(),
            document_type: template.category,
            jurisdiction: template.jurisdiction,
            version: template.version,
            user_data_hash: this.hashUserData(userData),
            legal_basis: template.legal_basis,
            educational_notes: template.educational_notes
        };

        // Store in document history
        const documentId = this.generateDocumentId();
        this.documentHistory.set(documentId, {
            ...documentMetadata,
            content: documentContent,
            original_data: userData
        });

        return {
            document_id: documentId,
            content: documentContent,
            metadata: documentMetadata,
            next_steps: this.getNextSteps(template),
            legal_requirements: template.legal_requirements,
            educational_guidance: template.educational_guidance
        };
    }

    // Validate user data against template requirements
    validateUserData(template, userData) {
        const errors = [];

        template.fields.forEach(field => {
            const value = userData[field.id];

            // Check required fields
            if (field.required && (!value || value.toString().trim() === '')) {
                errors.push(`${field.label} is required`);
            }

            // Validate field types
            if (value) {
                switch (field.type) {
                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            errors.push(`${field.label} must be a valid email address`);
                        }
                        break;
                    case 'tel':
                        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                        if (!phoneRegex.test(value)) {
                            errors.push(`${field.label} must be a valid phone number`);
                        }
                        break;
                    case 'date':
                        if (isNaN(Date.parse(value))) {
                            errors.push(`${field.label} must be a valid date`);
                        }
                        break;
                    case 'number':
                        if (isNaN(parseFloat(value))) {
                            errors.push(`${field.label} must be a valid number`);
                        }
                        break;
                }
            }

            // Check conditional fields
            if (field.conditional && value) {
                const [conditionField, conditionValue] = field.conditional.split('==');
                if (userData[conditionField] !== conditionValue) {
                    errors.push(`${field.label} should only be provided when ${conditionField} is ${conditionValue}`);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Process user data with enhancements
    async processUserData(template, userData, options) {
        const processed = { ...userData };

        // Add current date
        processed.current_date = new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Mask account numbers for security
        if (processed.account_number) {
            const account = processed.account_number.toString();
            processed.account_number_masked = account.replace(/(.{4})/g, '****').slice(-4);
            processed.customer_reference = `REF-${Date.now()}`;
        }

        // Format currency amounts
        Object.keys(processed).forEach(key => {
            if (key.includes('amount') || key.includes('loss') || key.includes('financial')) {
                const value = processed[key];
                if (value && !isNaN(value)) {
                    processed[key] = parseFloat(value).toFixed(2);
                }
            }
        });

        // Get institution-specific information
        if (processed.bank_name && this.bankingInstitutions.has(processed.bank_name)) {
            const institution = this.bankingInstitutions.get(processed.bank_name);
            processed.bank_address = institution.complaints_address;
            processed.bank_phone = institution.complaints_phone;
            processed.bank_email = institution.complaints_email;
        }

        // Transform select values to appropriate format
        Object.keys(processed).forEach(key => {
            const field = template.fields.find(f => f.id === key);
            if (field && field.type === 'select') {
                processed[key + '_lowercase'] = processed[key] ? processed[key].toLowerCase() : '';
            }
        });

        // Apply AI enhancements if template supports it
        if (options.ai_enhance && template.ai_prompts) {
            for (const [fieldId, prompt] of Object.entries(template.ai_prompts)) {
                if (processed[fieldId]) {
                    processed[fieldId] = await this.enhanceWithAI(prompt, processed, template);
                }
            }
        }

        return processed;
    }

    // Replace template variables with processed data
    replaceTemplateVariables(content, data) {
        let processed = content;

        // Handle simple variable replacement
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            processed = processed.replace(regex, data[key] || `[${key}]`);
        });

        // Handle conditional blocks
        processed = this.processConditionalBlocks(processed, data);

        // Handle loops
        processed = this.processLoops(processed, data);

        return processed;
    }

    // Process conditional template blocks
    processConditionalBlocks(content, data) {
        const conditionalRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
        
        return content.replace(conditionalRegex, (match, condition, block) => {
            const value = data[condition];
            return value && value.toString().trim() !== '' ? block : '';
        });
    }

    // Process loop blocks
    processLoops(content, data) {
        const loopRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
        
        return content.replace(loopRegex, (match, arrayName, template) => {
            const array = data[arrayName];
            if (!Array.isArray(array)) return '';
            
            return array.map(item => {
                let itemContent = template;
                if (typeof item === 'string') {
                    itemContent = itemContent.replace(/{{this}}/g, item);
                } else if (typeof item === 'object') {
                    Object.keys(item).forEach(key => {
                        const regex = new RegExp(`{{${key}}}`, 'g');
                        itemContent = itemContent.replace(regex, item[key]);
                    });
                }
                return itemContent;
            }).join('');
        });
    }

    // Translate legal terms to plain English
    translateToPlainEnglish(content) {
        let translated = content;

        this.plainEnglishDictionary.forEach((definition, term) => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            translated = translated.replace(regex, `${term} (${definition.plain_english})`);
        });

        return translated;
    }

    // Get next steps for document type
    getNextSteps(template) {
        const nextSteps = [];

        switch (template.category) {
            case 'Bank Complaints':
                nextSteps.push(
                    'Send the complaint letter via recorded delivery',
                    'Keep copies of all correspondence',
                    'Note the date you sent the complaint',
                    'Set a calendar reminder for 5 business days (acknowledgment)',
                    'Set a calendar reminder for 8 weeks (final response)',
                    'If unsatisfied with response, consider Financial Ombudsman Service'
                );
                break;

            case 'Data Protection':
                nextSteps.push(
                    'Send the request via recorded delivery or secure email',
                    'Include proof of identity as requested',
                    'Set a calendar reminder for 30 days',
                    'If no response, contact the ICO',
                    'Review the data provided carefully for accuracy'
                );
                break;

            case 'Ombudsman Complaints':
                nextSteps.push(
                    'Ensure you have tried to resolve with the business first',
                    'Submit within 6 months of the final response',
                    'Include all supporting documentation',
                    'Wait for FOS acknowledgment and case reference',
                    'Respond promptly to any FOS requests for information'
                );
                break;
        }

        return nextSteps;
    }

    // Generate unique document ID
    generateDocumentId() {
        return `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    // Hash user data for privacy
    hashUserData(userData) {
        const sensitiveFields = ['account_number', 'customer_phone', 'customer_email'];
        const hashableData = {};
        
        Object.keys(userData).forEach(key => {
            if (sensitiveFields.includes(key)) {
                hashableData[key] = '[REDACTED]';
            } else {
                hashableData[key] = userData[key];
            }
        });

        return btoa(JSON.stringify(hashableData)).substr(0, 16);
    }

    // Simulate AI enhancement (would integrate with actual AI API)
    async enhanceWithAI(prompt, userData, template) {
        // This would integrate with Claude API or similar
        // For now, return enhanced placeholder text
        
        const enhancements = {
            complaint_details: `
I am writing to express my serious concern about the ${userData.complaint_type} that occurred on ${userData.incident_date}. This incident has significantly impacted my ability to manage my finances and has caused considerable inconvenience.

The specific issue was [detailed description of what went wrong]. This has resulted in [specific impacts on the customer]. I have been a loyal customer for [duration] and have never experienced such issues before.

I expect this matter to be resolved promptly and fairly, in accordance with your published service standards and regulatory obligations.`,
            
            desired_outcome: `
I am seeking the following resolution:
1. A full investigation into how this incident occurred
2. ${userData.financial_loss ? `Compensation of £${userData.financial_loss} for my financial losses` : 'Acknowledgment of the service failure'}
3. Steps to prevent similar incidents in the future
4. An apology for the inconvenience caused
5. Assurance that my account will be monitored to prevent recurrence

I believe this resolution is fair and reasonable given the circumstances.`,

            complaint_nature: `
The issue relates to ${userData.product_service} services provided by ${userData.business_name}. The problem began on [date] when [description of initial issue]. Despite [attempts to resolve], the matter has not been satisfactorily addressed.

This has caused me [impact description] and I believe the business has not met its regulatory obligations under [relevant regulations].`,

            resolution_sought: `
I am seeking fair and appropriate redress for this matter, which should include:
- ${userData.financial_loss_amount ? `Financial compensation of £${userData.financial_loss_amount}` : 'Recognition of the service failure'}
- A clear explanation of what went wrong
- Steps to prevent similar issues in future
- An appropriate apology for the inconvenience caused

This resolution would be proportionate to the impact I have experienced and would restore my confidence in the business.`
        };

        return enhancements[Object.keys(template.ai_prompts || {}).find(key => 
            template.ai_prompts[key] === prompt
        )] || userData[Object.keys(template.ai_prompts || {}).find(key => 
            template.ai_prompts[key] === prompt
        )] || '[AI enhancement would appear here]';
    }

    // Export document in various formats
    exportDocument(documentId, format = 'txt') {
        const document = this.documentHistory.get(documentId);
        if (!document) {
            throw new Error('Document not found');
        }

        switch (format.toLowerCase()) {
            case 'txt':
                return document.content;
            
            case 'pdf':
                return this.generatePDF(document);
            
            case 'word':
                return this.generateWordDocument(document);
            
            case 'email':
                return this.formatForEmail(document);
            
            case 'json':
                return JSON.stringify(document, null, 2);
            
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    // Generate PDF (placeholder - would integrate with PDF library)
    generatePDF(document) {
        return {
            format: 'PDF',
            content: document.content,
            metadata: document.metadata,
            note: 'PDF generation would be implemented with jsPDF or similar library'
        };
    }

    // Generate Word document (placeholder - would integrate with docx library) 
    generateWordDocument(document) {
        return {
            format: 'Word Document',
            content: document.content,
            metadata: document.metadata,
            note: 'Word document generation would be implemented with docx.js or similar library'
        };
    }

    // Format for email
    formatForEmail(document) {
        const lines = document.content.split('\n');
        const recipientLine = lines.find(line => 
            line.includes('@') || 
            line.includes('Complaints Department') ||
            line.includes('Financial Ombudsman Service')
        );

        return {
            format: 'Email',
            to: recipientLine || 'recipient@example.com',
            subject: `${document.metadata.template_name} - ${document.metadata.generated_date}`,
            body: document.content,
            attachments: ['Supporting documents as referenced in letter']
        };
    }

    // Get document generation statistics
    getStatistics() {
        const stats = {
            total_documents: this.documentHistory.size,
            templates_used: {},
            categories: {},
            jurisdictions: {},
            recent_activity: []
        };

        this.documentHistory.forEach(doc => {
            // Template usage
            stats.templates_used[doc.template_name] = 
                (stats.templates_used[doc.template_name] || 0) + 1;

            // Categories
            stats.categories[doc.document_type] = 
                (stats.categories[doc.document_type] || 0) + 1;

            // Jurisdictions
            stats.jurisdictions[doc.jurisdiction] = 
                (stats.jurisdictions[doc.jurisdiction] || 0) + 1;

            // Recent activity (last 30 days)
            const docDate = new Date(doc.generated_date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            if (docDate >= thirtyDaysAgo) {
                stats.recent_activity.push({
                    date: doc.generated_date,
                    template: doc.template_name,
                    type: doc.document_type
                });
            }
        });

        stats.recent_activity.sort((a, b) => new Date(b.date) - new Date(a.date));

        return stats;
    }

    // Search document history
    searchDocuments(query) {
        const results = [];
        const searchTerm = query.toLowerCase();

        this.documentHistory.forEach((doc, id) => {
            if (
                doc.template_name.toLowerCase().includes(searchTerm) ||
                doc.document_type.toLowerCase().includes(searchTerm) ||
                doc.content.toLowerCase().includes(searchTerm)
            ) {
                results.push({
                    document_id: id,
                    template_name: doc.template_name,
                    document_type: doc.document_type,
                    generated_date: doc.generated_date,
                    relevance: this.calculateSearchRelevance(searchTerm, doc)
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    // Calculate search relevance
    calculateSearchRelevance(term, document) {
        let score = 0;
        
        if (document.template_name.toLowerCase().includes(term)) score += 10;
        if (document.document_type.toLowerCase().includes(term)) score += 8;
        if (document.content.toLowerCase().includes(term)) score += 5;
        
        return score;
    }
}

// Export for use in main application
window.AutomatedDocumentGenerator = AutomatedDocumentGenerator;

// Initialize document generator
const documentGenerator = new AutomatedDocumentGenerator();

console.log('📄 JuriBank Automated Document Generation Engine loaded');