// Smart Legal Templates System
// UK Banking Law Platform - AI-Powered Document Templates

class LegalTemplatesEngine {
    constructor() {
        this.templatesDatabase = new Map();
        this.templateCategories = new Map();
        this.userTemplates = new Map();
        this.fillHistory = new Map();
        
        this.initializeTemplates();
    }

    // Initialize comprehensive legal templates
    initializeTemplates() {
        console.log('📝 Initializing Smart Legal Templates System...');
        
        // Corporate Governance Templates
        this.addTemplate({
            id: 'board-resolution-template',
            title: 'Board Resolution - Banking Matters',
            category: 'Corporate Governance',
            subcategory: 'Board Resolutions',
            description: 'Standard board resolution template for UK banking institutions',
            fields: [
                {
                    id: 'company_name',
                    type: 'text',
                    label: 'Company Name',
                    required: true,
                    placeholder: 'Enter full legal name of the bank/institution'
                },
                {
                    id: 'company_number',
                    type: 'text',
                    label: 'Company Registration Number',
                    required: true,
                    placeholder: 'Companies House registration number'
                },
                {
                    id: 'meeting_date',
                    type: 'date',
                    label: 'Board Meeting Date',
                    required: true
                },
                {
                    id: 'resolution_type',
                    type: 'select',
                    label: 'Type of Resolution',
                    required: true,
                    options: [
                        'Capital Adequacy Matters',
                        'Regulatory Compliance',
                        'Risk Management Framework',
                        'Appointment of Officers',
                        'Audit Committee Matters',
                        'Customer Protection',
                        'Other Banking Matter'
                    ]
                },
                {
                    id: 'resolution_details',
                    type: 'textarea',
                    label: 'Resolution Details',
                    required: true,
                    placeholder: 'Detailed description of the resolution being passed',
                    ai_assistance: true
                }
            ],
            template_content: `
                BOARD RESOLUTION
                {{company_name}}
                (Company Number: {{company_number}})
                
                RESOLVED at a meeting of the Board of Directors held on {{meeting_date}}:
                
                RE: {{resolution_type}}
                
                WHEREAS the Board of Directors has considered the matter of {{resolution_type}};
                
                AND WHEREAS the Board recognizes its obligations under the Financial Services and Markets Act 2000, the PRA Rulebook, and FCA Handbook;
                
                NOW THEREFORE BE IT RESOLVED THAT:
                
                {{resolution_details}}
                
                This resolution is passed in compliance with:
                - The Company's Articles of Association
                - The Senior Managers & Certification Regime (SM&CR)
                - Applicable PRA and FCA rules and guidance
                - The UK Corporate Governance Code (where applicable)
                
                Signed by the Chairman:
                
                _________________________
                [Chairman Name]
                Chairman of the Board
                Date: {{meeting_date}}
                
                Company Secretary:
                
                _________________________
                [Secretary Name]
                Company Secretary
                Date: {{meeting_date}}
            `,
            ai_prompts: {
                resolution_details: `As a UK banking law expert, help draft a board resolution for {{resolution_type}}. 
                Consider regulatory requirements, best practices, and ensure compliance with PRA/FCA expectations. 
                The resolution should be specific, actionable, and include appropriate governance safeguards.`
            }
        });

        this.addTemplate({
            id: 'regulatory-breach-notification',
            title: 'Regulatory Breach Notification',
            category: 'Regulatory Compliance',
            subcategory: 'Incident Reporting',
            description: 'Template for notifying regulators of potential breaches',
            fields: [
                {
                    id: 'firm_name',
                    type: 'text',
                    label: 'Firm Name',
                    required: true
                },
                {
                    id: 'firm_reference',
                    type: 'text',
                    label: 'FCA/PRA Firm Reference Number',
                    required: true
                },
                {
                    id: 'incident_date',
                    type: 'date',
                    label: 'Date of Incident',
                    required: true
                },
                {
                    id: 'discovery_date',
                    type: 'date',
                    label: 'Date of Discovery',
                    required: true
                },
                {
                    id: 'regulator',
                    type: 'select',
                    label: 'Primary Regulator',
                    required: true,
                    options: ['FCA', 'PRA', 'Both FCA and PRA']
                },
                {
                    id: 'breach_type',
                    type: 'select',
                    label: 'Type of Breach',
                    required: true,
                    options: [
                        'Capital Requirements',
                        'Liquidity Requirements',
                        'Conduct of Business Rules',
                        'Market Abuse',
                        'Anti-Money Laundering',
                        'Data Protection',
                        'Consumer Duty',
                        'Operational Resilience',
                        'Other'
                    ]
                },
                {
                    id: 'incident_description',
                    type: 'textarea',
                    label: 'Incident Description',
                    required: true,
                    ai_assistance: true
                },
                {
                    id: 'impact_assessment',
                    type: 'textarea',
                    label: 'Impact Assessment',
                    required: true,
                    ai_assistance: true
                },
                {
                    id: 'corrective_actions',
                    type: 'textarea',
                    label: 'Corrective Actions Taken/Planned',
                    required: true,
                    ai_assistance: true
                }
            ],
            template_content: `
                REGULATORY INCIDENT NOTIFICATION
                
                To: {{regulator}} Supervision Team
                From: {{firm_name}} (FRN: {{firm_reference}})
                Date: {{current_date}}
                
                Subject: Notification of Potential Regulatory Breach
                
                1. INCIDENT SUMMARY
                Date of Incident: {{incident_date}}
                Date of Discovery: {{discovery_date}}
                Type of Breach: {{breach_type}}
                
                2. DETAILED DESCRIPTION
                {{incident_description}}
                
                3. IMPACT ASSESSMENT
                {{impact_assessment}}
                
                4. IMMEDIATE ACTIONS TAKEN
                {{corrective_actions}}
                
                5. REGULATORY NOTIFICATIONS
                This notification is being made in accordance with:
                - Principle 11 (Relations with regulators)
                - SUP 15.3 (General notification requirements)
                - [Relevant specific rulebook provisions]
                
                6. CONTACT INFORMATION
                Primary Contact: [Name, Title]
                Email: [Email address]
                Phone: [Phone number]
                
                We will provide further updates as our investigation progresses and remain available to discuss this matter at your convenience.
                
                Yours faithfully,
                
                [Name]
                [Title]
                {{firm_name}}
            `,
            ai_prompts: {
                incident_description: `Help draft a clear, factual description of a {{breach_type}} incident for regulatory notification. 
                Include key facts, timeline, and scope. Maintain professional tone and regulatory compliance focus.`,
                impact_assessment: `Assess the potential impact of this {{breach_type}} incident, considering customer impact, 
                financial implications, regulatory consequences, and reputational risks.`,
                corrective_actions: `Outline appropriate immediate and planned corrective actions for a {{breach_type}} incident, 
                including investigation steps, control enhancements, and prevention measures.`
            }
        });

        this.addTemplate({
            id: 'aml-sar-template',
            title: 'Suspicious Activity Report (SAR)',
            category: 'Financial Crime',
            subcategory: 'AML Reporting',
            description: 'Template for UK Suspicious Activity Reports to NCA',
            fields: [
                {
                    id: 'reporting_entity',
                    type: 'text',
                    label: 'Reporting Entity',
                    required: true
                },
                {
                    id: 'customer_name',
                    type: 'text',
                    label: 'Customer/Subject Name',
                    required: true
                },
                {
                    id: 'customer_dob',
                    type: 'date',
                    label: 'Customer Date of Birth'
                },
                {
                    id: 'customer_address',
                    type: 'textarea',
                    label: 'Customer Address',
                    required: true
                },
                {
                    id: 'activity_period',
                    type: 'text',
                    label: 'Suspicious Activity Period',
                    required: true,
                    placeholder: 'e.g., January 2024 - March 2024'
                },
                {
                    id: 'transaction_value',
                    type: 'text',
                    label: 'Total Value of Suspicious Transactions',
                    required: true,
                    placeholder: '£'
                },
                {
                    id: 'suspicion_grounds',
                    type: 'textarea',
                    label: 'Grounds for Suspicion',
                    required: true,
                    ai_assistance: true
                },
                {
                    id: 'supporting_evidence',
                    type: 'textarea',
                    label: 'Supporting Evidence',
                    required: true,
                    ai_assistance: true
                }
            ],
            template_content: `
                SUSPICIOUS ACTIVITY REPORT
                To: National Crime Agency
                
                REPORTING ENTITY DETAILS
                Institution: {{reporting_entity}}
                Report Date: {{current_date}}
                
                SUBJECT DETAILS
                Name: {{customer_name}}
                Date of Birth: {{customer_dob}}
                Address: {{customer_address}}
                
                SUSPICIOUS ACTIVITY SUMMARY
                Period of Activity: {{activity_period}}
                Total Value: {{transaction_value}}
                
                GROUNDS FOR SUSPICION
                {{suspicion_grounds}}
                
                SUPPORTING EVIDENCE
                {{supporting_evidence}}
                
                REPORTING OBLIGATIONS
                This report is made pursuant to:
                - Section 330 Proceeds of Crime Act 2002
                - Money Laundering Regulations 2017
                - [Institution's] AML policies and procedures
                
                The suspicious activity described above gives rise to suspicion of money laundering and/or terrorist financing.
                
                CONSENT REQUEST
                [If applicable] We request consent to continue with the following transactions:
                [Details of transactions requiring consent]
                
                Reported by: [Name, Position]
                Date: {{current_date}}
                Reference: [Internal reference number]
            `,
            ai_prompts: {
                suspicion_grounds: `Help articulate the grounds for suspicion based on the activity pattern. 
                Focus on objective facts and red flag indicators that suggest potential money laundering.`,
                supporting_evidence: `List and describe supporting evidence that reinforces the suspicion, 
                including transaction patterns, customer behavior, and relevant documentation.`
            }
        });

        this.addTemplate({
            id: 'consumer-duty-assessment',
            title: 'Consumer Duty Outcome Assessment',
            category: 'Consumer Protection',
            subcategory: 'Consumer Duty',
            description: 'Template for assessing Consumer Duty outcomes',
            fields: [
                {
                    id: 'product_service_name',
                    type: 'text',
                    label: 'Product/Service Name',
                    required: true
                },
                {
                    id: 'target_market',
                    type: 'textarea',
                    label: 'Target Market',
                    required: true
                },
                {
                    id: 'assessment_date',
                    type: 'date',
                    label: 'Assessment Date',
                    required: true
                },
                {
                    id: 'outcome_category',
                    type: 'select',
                    label: 'Consumer Duty Outcome',
                    required: true,
                    options: [
                        'Products and Services',
                        'Price and Value',
                        'Consumer Understanding',
                        'Consumer Support'
                    ]
                },
                {
                    id: 'outcome_analysis',
                    type: 'textarea',
                    label: 'Outcome Analysis',
                    required: true,
                    ai_assistance: true
                },
                {
                    id: 'evidence_good_outcomes',
                    type: 'textarea',
                    label: 'Evidence of Good Outcomes',
                    required: true,
                    ai_assistance: true
                },
                {
                    id: 'areas_improvement',
                    type: 'textarea',
                    label: 'Areas for Improvement',
                    ai_assistance: true
                }
            ],
            template_content: `
                CONSUMER DUTY OUTCOME ASSESSMENT
                
                PRODUCT/SERVICE: {{product_service_name}}
                ASSESSMENT DATE: {{assessment_date}}
                TARGET MARKET: {{target_market}}
                
                CONSUMER DUTY OUTCOME: {{outcome_category}}
                
                OUTCOME ANALYSIS
                {{outcome_analysis}}
                
                EVIDENCE OF GOOD OUTCOMES
                {{evidence_good_outcomes}}
                
                AREAS FOR IMPROVEMENT
                {{areas_improvement}}
                
                REGULATORY FRAMEWORK
                This assessment is conducted in accordance with:
                - FCA Consumer Duty (PRIN 2A)
                - Consumer Duty Guidance (FG22/5)
                - Relevant conduct of business rules
                
                CONCLUSION
                Based on this assessment, the product/service [does/does not] deliver good outcomes for customers in line with the Consumer Duty requirements.
                
                NEXT STEPS
                [Actions to be taken based on assessment findings]
                
                Assessed by: [Name, Position]
                Date: {{assessment_date}}
                Review Date: [Next review date]
            `,
            ai_prompts: {
                outcome_analysis: `Analyze how this product/service performs against the {{outcome_category}} outcome, 
                considering customer needs, market context, and regulatory expectations.`,
                evidence_good_outcomes: `Identify specific evidence demonstrating good customer outcomes for {{outcome_category}}, 
                including metrics, feedback, and performance indicators.`,
                areas_improvement: `Suggest practical improvements to enhance customer outcomes for {{outcome_category}}, 
                focusing on actionable steps and measurable improvements.`
            }
        });

        console.log('✅ Smart Legal Templates initialized with AI-powered assistance');
    }

    // Add template to database
    addTemplate(template) {
        template.created_date = new Date().toISOString();
        template.version = '1.0';
        this.templatesDatabase.set(template.id, template);
        
        // Update category index
        if (!this.templateCategories.has(template.category)) {
            this.templateCategories.set(template.category, []);
        }
        this.templateCategories.get(template.category).push(template.id);
    }

    // Get template by ID
    getTemplate(templateId) {
        return this.templatesDatabase.get(templateId);
    }

    // Get templates by category
    getTemplatesByCategory(category) {
        const templateIds = this.templateCategories.get(category) || [];
        return templateIds.map(id => this.templatesDatabase.get(id)).filter(Boolean);
    }

    // Get all categories
    getCategories() {
        return Array.from(this.templateCategories.keys());
    }

    // Search templates
    searchTemplates(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        this.templatesDatabase.forEach(template => {
            const searchText = `${template.title} ${template.description} ${template.category}`.toLowerCase();
            if (searchText.includes(lowerQuery)) {
                results.push({
                    ...template,
                    relevance: this.calculateRelevance(lowerQuery, searchText)
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    // Calculate search relevance
    calculateRelevance(query, text) {
        const titleMatch = text.includes(query) ? 10 : 0;
        const wordMatches = query.split(' ').filter(word => text.includes(word)).length;
        return titleMatch + wordMatches;
    }

    // Fill template with AI assistance
    async fillTemplate(templateId, fieldData, useAI = true) {
        const template = this.getTemplate(templateId);
        if (!template) return null;

        let filledContent = template.template_content;
        const aiEnhancedData = { ...fieldData };

        // Use AI to enhance specific fields if requested
        if (useAI && template.ai_prompts) {
            for (const [fieldId, prompt] of Object.entries(template.ai_prompts)) {
                if (fieldData[fieldId] && fieldData[fieldId].trim()) {
                    // In a real implementation, this would call Claude API
                    aiEnhancedData[fieldId] = await this.enhanceFieldWithAI(
                        prompt, 
                        fieldData, 
                        template
                    );
                }
            }
        }

        // Add current date
        aiEnhancedData.current_date = new Date().toLocaleDateString('en-GB');

        // Replace template variables
        for (const [key, value] of Object.entries(aiEnhancedData)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            filledContent = filledContent.replace(regex, value || `[${key}]`);
        }

        // Store fill history
        const fillRecord = {
            template_id: templateId,
            filled_date: new Date().toISOString(),
            field_data: fieldData,
            ai_enhanced: useAI,
            output_length: filledContent.length
        };

        if (!this.fillHistory.has(templateId)) {
            this.fillHistory.set(templateId, []);
        }
        this.fillHistory.get(templateId).push(fillRecord);

        return {
            template: template,
            filled_content: filledContent,
            field_data: aiEnhancedData,
            fill_record: fillRecord
        };
    }

    // Simulate AI enhancement (in real implementation, would call Claude API)
    async enhanceFieldWithAI(prompt, fieldData, template) {
        // This would make an actual API call to Claude
        // For now, returning enhanced placeholder text
        
        const enhancements = {
            'resolution_details': `
1. The Board approves the implementation of enhanced ${fieldData.resolution_type} procedures in line with current regulatory requirements.

2. The Chief Risk Officer is authorized to update relevant policies and procedures to ensure full compliance with PRA/FCA expectations.

3. Management shall report to the Board on implementation progress within 30 days of this resolution.

4. This resolution takes effect immediately and shall be reviewed at the next quarterly Board meeting.`,

            'incident_description': `
On ${fieldData.incident_date}, the firm identified a potential ${fieldData.breach_type} incident. Initial investigation indicates [specific details of the incident]. The incident was discovered during [routine monitoring/audit/customer complaint] and was promptly escalated to senior management and the compliance team.

The scope of the incident appears to be [limited/widespread] and affects [number/type] of customers/transactions. Immediate containment measures have been implemented to prevent further impact.`,

            'impact_assessment': `
Customer Impact: [Description of impact on customers]
Financial Impact: [Estimated financial implications]
Regulatory Risk: [Assessment of regulatory consequences]
Reputational Risk: [Potential reputational damage]
Operational Impact: [Effect on business operations]

The incident has been classified as [high/medium/low] severity based on our incident classification framework.`,

            'corrective_actions': `
Immediate Actions:
1. Incident response team activated
2. Affected systems/processes temporarily suspended
3. Customer notifications prepared (where required)
4. Senior management and Board notified

Investigation Actions:
1. Root cause analysis initiated
2. Independent review commissioned
3. All relevant records preserved
4. Timeline reconstruction underway

Remediation Actions:
1. Control enhancements identified
2. Staff retraining scheduled
3. System improvements planned
4. Monitoring procedures enhanced`
        };

        // Return appropriate enhancement based on the field
        const fieldId = Object.keys(template.ai_prompts).find(key => 
            template.ai_prompts[key] === prompt
        );

        return enhancements[fieldId] || fieldData[fieldId] || '[AI enhancement would appear here]';
    }

    // Validate template fields
    validateFields(templateId, fieldData) {
        const template = this.getTemplate(templateId);
        if (!template) return { valid: false, errors: ['Template not found'] };

        const errors = [];
        
        template.fields.forEach(field => {
            if (field.required && (!fieldData[field.id] || fieldData[field.id].trim() === '')) {
                errors.push(`${field.label} is required`);
            }
            
            if (field.type === 'email' && fieldData[field.id]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldData[field.id])) {
                    errors.push(`${field.label} must be a valid email address`);
                }
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Get template usage statistics
    getUsageStatistics() {
        const stats = {};
        
        this.fillHistory.forEach((records, templateId) => {
            const template = this.getTemplate(templateId);
            stats[templateId] = {
                template_title: template?.title,
                total_fills: records.length,
                ai_usage_rate: Math.round(
                    (records.filter(r => r.ai_enhanced).length / records.length) * 100
                ),
                last_used: records[records.length - 1]?.filled_date,
                avg_output_length: Math.round(
                    records.reduce((sum, r) => sum + r.output_length, 0) / records.length
                )
            };
        });

        return stats;
    }

    // Export template
    exportTemplate(templateId, format = 'json') {
        const template = this.getTemplate(templateId);
        if (!template) return null;

        switch (format) {
            case 'json':
                return JSON.stringify(template, null, 2);
            case 'yaml':
                return this.templateToYAML(template);
            default:
                return template;
        }
    }

    // Convert template to YAML format
    templateToYAML(template) {
        return `
name: "${template.title}"
category: "${template.category}"
description: "${template.description}"
version: "${template.version}"
fields:
${template.fields.map(field => `  - id: "${field.id}"
    type: "${field.type}"
    label: "${field.label}"
    required: ${field.required}
    ${field.placeholder ? `placeholder: "${field.placeholder}"` : ''}
    ${field.ai_assistance ? 'ai_assistance: true' : ''}`).join('\n')}
template: |
${template.template_content.split('\n').map(line => `  ${line}`).join('\n')}
`;
    }

    // Create custom template
    createCustomTemplate(templateData) {
        const templateId = `custom-${Date.now()}`;
        const template = {
            id: templateId,
            ...templateData,
            created_date: new Date().toISOString(),
            version: '1.0',
            custom: true
        };

        this.addTemplate(template);
        return templateId;
    }

    // Get popular templates
    getPopularTemplates(limit = 5) {
        const usage = this.getUsageStatistics();
        
        return Object.entries(usage)
            .sort((a, b) => b[1].total_fills - a[1].total_fills)
            .slice(0, limit)
            .map(([id, stats]) => ({
                template: this.getTemplate(id),
                usage: stats
            }));
    }

    // Get template recommendations
    getRecommendations(userHistory = []) {
        const recommendations = [];
        
        // Recommend based on category usage
        const categoryUsage = new Map();
        userHistory.forEach(templateId => {
            const template = this.getTemplate(templateId);
            if (template) {
                categoryUsage.set(template.category, 
                    (categoryUsage.get(template.category) || 0) + 1
                );
            }
        });

        // Find most used category and recommend other templates
        const topCategory = Array.from(categoryUsage.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        if (topCategory) {
            const categoryTemplates = this.getTemplatesByCategory(topCategory)
                .filter(t => !userHistory.includes(t.id))
                .slice(0, 3);
            
            recommendations.push(...categoryTemplates.map(t => ({
                template: t,
                reason: `Based on your use of ${topCategory} templates`
            })));
        }

        return recommendations;
    }
}

// Export for use in main application
window.LegalTemplatesEngine = LegalTemplatesEngine;

// Initialize templates engine
const legalTemplates = new LegalTemplatesEngine();

console.log('📝 Smart Legal Templates System loaded');