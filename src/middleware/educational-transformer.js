/**
 * JuriBank Educational Platform - Educational Content Transformer
 * Transforms raw API data into educational content with appropriate context
 * 
 * Features:
 * - Educational disclaimers and context
 * - Plain English explanations
 * - Learning objectives and outcomes
 * - Related topics and further reading
 * - Compliance with educational boundaries
 * - Accessibility improvements
 * - Learning level assessment
 */

class EducationalTransformer {
    constructor(config = {}, logger = console) {
        this.config = {
            // Educational settings
            education: {
                defaultLevel: 'intermediate',
                addDisclaimer: true,
                simplifyLanguage: true,
                addContext: true,
                addLearningObjectives: true,
                maxComplexityScore: 0.7
            },
            
            // Language simplification
            language: {
                maxSentenceLength: 25,
                preferCommonWords: true,
                explainTechnicalTerms: true,
                addGlossary: true,
                readingLevel: 'upper-secondary' // GCSE level
            },
            
            // Content structure
            structure: {
                addSummary: true,
                addKeyPoints: true,
                addExamples: true,
                addNextSteps: true,
                addRelatedTopics: true,
                maxSectionLength: 200
            },
            
            // Legal compliance
            legal: {
                addAdviceDisclaimer: true,
                addSourceAttribution: true,
                addLastUpdated: true,
                addProfessionalReferral: true,
                educationalPurposeOnly: true
            },
            
            ...config
        };

        this.logger = logger;
        
        // Educational glossary for financial/legal terms
        this.glossary = {
            'fca': 'Financial Conduct Authority - the UK financial services regulator',
            'hmrc': 'HM Revenue and Customs - the UK tax authority',
            'ombudsman': 'Financial Ombudsman Service - resolves disputes between consumers and financial businesses',
            'pra': 'Prudential Regulation Authority - regulates banks and insurers',
            'consumer_duty': 'Rules requiring financial firms to provide good outcomes for retail customers',
            'aml': 'Anti-Money Laundering - rules to prevent financial crime',
            'kyc': 'Know Your Customer - identity verification requirements',
            'gdpr': 'General Data Protection Regulation - EU data privacy law',
            'apr': 'Annual Percentage Rate - the yearly cost of borrowing money',
            'aer': 'Annual Equivalent Rate - the yearly rate earned on savings',
            'fscs': 'Financial Services Compensation Scheme - protects deposits up to £85,000',
            'statutory': 'Required by law',
            'fiduciary': 'Legal duty to act in someone else\'s best interests',
            'negligence': 'Failure to take reasonable care',
            'liability': 'Legal responsibility for something',
            'breach': 'Breaking a legal duty or contract',
            'remedies': 'Legal solutions available when something goes wrong',
            'jurisdiction': 'The area where laws apply',
            'precedent': 'Previous court decisions that guide future cases',
            'tort': 'A wrongful act that causes harm (not criminal or breach of contract)'
        };

        // Common financial/legal acronyms
        this.acronyms = {
            'PPI': 'Payment Protection Insurance',
            'APR': 'Annual Percentage Rate',
            'AER': 'Annual Equivalent Rate',
            'ISA': 'Individual Savings Account',
            'SIPP': 'Self-Invested Personal Pension',
            'SSAS': 'Small Self-Administered Scheme',
            'UTI': 'Unfair Terms in Consumer Contracts',
            'CCA': 'Consumer Credit Act',
            'FSMA': 'Financial Services and Markets Act',
            'TCF': 'Treating Customers Fairly'
        };

        // Learning levels
        this.learningLevels = {
            'beginner': {
                vocabulary: 'basic',
                sentenceLength: 20,
                conceptComplexity: 'simple',
                examples: 'everyday'
            },
            'intermediate': {
                vocabulary: 'mixed',
                sentenceLength: 25,
                conceptComplexity: 'moderate',
                examples: 'practical'
            },
            'advanced': {
                vocabulary: 'technical',
                sentenceLength: 30,
                conceptComplexity: 'complex',
                examples: 'case-studies'
            }
        };
    }

    /**
     * Main transformation method
     */
    async transform(data, context = {}) {
        try {
            if (!data) {
                return null;
            }

            // Determine content type and learning level
            const contentType = this.determineContentType(data, context);
            const learningLevel = context.learningLevel || this.config.education.defaultLevel;

            // Create educational wrapper
            const educational = {
                // Original data (sanitized)
                originalData: this.sanitizeData(data),
                
                // Educational metadata
                metadata: {
                    source: context.source || 'government-api',
                    contentType: contentType,
                    learningLevel: learningLevel,
                    lastUpdated: new Date().toISOString(),
                    educationalPurpose: true,
                    disclaimer: this.config.legal.addAdviceDisclaimer
                },
                
                // Transformed educational content
                educational: {}
            };

            // Apply transformations based on content type
            switch (contentType) {
                case 'regulatory-alert':
                    educational.educational = await this.transformRegulatoryAlert(data, learningLevel);
                    break;
                case 'tax-guidance':
                    educational.educational = await this.transformTaxGuidance(data, learningLevel);
                    break;
                case 'legal-guidance':
                    educational.educational = await this.transformLegalGuidance(data, learningLevel);
                    break;
                case 'statistics':
                    educational.educational = await this.transformStatistics(data, learningLevel);
                    break;
                case 'news-update':
                    educational.educational = await this.transformNewsUpdate(data, learningLevel);
                    break;
                default:
                    educational.educational = await this.transformGenericContent(data, learningLevel);
            }

            // Add common educational elements
            await this.addEducationalSupport(educational, context);

            return educational;

        } catch (error) {
            this.logger.error('Educational transformation error', {
                error: error.message,
                stack: error.stack,
                data: typeof data === 'object' ? Object.keys(data) : typeof data
            });
            
            // Return original data with basic educational wrapper
            return this.createFallbackEducational(data, context);
        }
    }

    /**
     * Determine content type from data structure
     */
    determineContentType(data, context) {
        if (context.method === 'getActiveAlerts' || data.type === 'alert') {
            return 'regulatory-alert';
        }
        if (context.source === 'hmrc' || data.taxBands) {
            return 'tax-guidance';
        }
        if (data.complaintStats || data.statistics) {
            return 'statistics';
        }
        if (data.news || data.publications) {
            return 'news-update';
        }
        if (data.guidance || context.method === 'getGuidance') {
            return 'legal-guidance';
        }
        
        return 'generic-content';
    }

    /**
     * Transform regulatory alerts for educational use
     */
    async transformRegulatoryAlert(data, learningLevel) {
        const alerts = Array.isArray(data) ? data : [data];
        
        return {
            summary: this.createAlertSummary(alerts),
            alerts: alerts.map(alert => this.transformSingleAlert(alert, learningLevel)),
            learningObjectives: [
                'Understand current financial risks and scams',
                'Recognize warning signs of fraudulent activity',
                'Know how to check if a company is authorized',
                'Learn where to report suspicious activity'
            ],
            keyTakeaways: this.extractAlertKeyTakeaways(alerts),
            nextSteps: this.getAlertNextSteps(),
            relatedTopics: ['consumer-protection', 'fraud-prevention', 'financial-regulation']
        };
    }

    /**
     * Transform single alert
     */
    transformSingleAlert(alert, learningLevel) {
        const level = this.learningLevels[learningLevel];
        
        return {
            title: this.simplifyText(alert.title, level),
            summary: this.createPlainEnglishSummary(alert.description, level),
            severity: {
                level: alert.severity,
                explanation: this.explainSeverity(alert.severity),
                action: this.recommendAction(alert.severity)
            },
            whatThisMeans: this.explainAlert(alert, level),
            whyItMatters: this.explainImportance(alert, level),
            whatYouCanDo: this.suggestActions(alert, level),
            technicalTerms: this.extractAndExplainTerms(alert.description),
            published: this.formatDate(alert.published_date),
            source: {
                name: alert.source,
                reliability: 'Official government source',
                link: alert.url
            }
        };
    }

    /**
     * Transform tax guidance for educational use
     */
    async transformTaxGuidance(data, learningLevel) {
        const level = this.learningLevels[learningLevel];
        
        return {
            overview: this.createTaxOverview(data, level),
            keyInformation: this.extractKeyTaxInfo(data, level),
            practicalExamples: this.createTaxExamples(data, level),
            commonQuestions: this.generateTaxFAQ(data, level),
            learningObjectives: [
                'Understand basic UK tax obligations',
                'Learn about tax rates and allowances',
                'Know important tax deadlines',
                'Understand when professional advice is needed'
            ],
            calculations: this.createEducationalCalculations(data, level),
            nextSteps: this.getTaxGuidanceNextSteps(data),
            professionalAdvice: this.getTaxAdviceGuidance(),
            relatedTopics: ['employment-rights', 'self-employment', 'benefits', 'savings']
        };
    }

    /**
     * Transform legal guidance for educational use
     */
    async transformLegalGuidance(data, learningLevel) {
        const level = this.learningLevels[learningLevel];
        
        return {
            summary: this.createLegalSummary(data, level),
            keyPrinciples: this.extractLegalPrinciples(data, level),
            realWorldApplication: this.createLegalExamples(data, level),
            yourRights: this.explainRights(data, level),
            commonMistakes: this.identifyCommonMistakes(data, level),
            learningObjectives: this.generateLegalLearningObjectives(data),
            caseStudies: this.createCaseStudies(data, level),
            nextSteps: this.getLegalNextSteps(data),
            whenToSeekHelp: this.getWhenToSeekHelp(),
            relatedTopics: this.findRelatedLegalTopics(data)
        };
    }

    /**
     * Transform statistics for educational use
     */
    async transformStatistics(data, learningLevel) {
        const level = this.learningLevels[learningLevel];
        
        return {
            overview: this.createStatsOverview(data, level),
            keyFindings: this.extractKeyFindings(data, level),
            trends: this.identifyTrends(data, level),
            whatThisShowsYou: this.interpretStats(data, level),
            limitations: this.explainStatsLimitations(data, level),
            learningObjectives: [
                'Understand how to read financial statistics',
                'Learn what the numbers mean for consumers',
                'Identify important trends and patterns',
                'Know the limitations of statistical data'
            ],
            methodology: this.explainMethodology(data, level),
            takeaways: this.createStatsTakeaways(data, level),
            relatedTopics: this.findRelatedStatsTopics(data)
        };
    }

    /**
     * Add common educational support elements
     */
    async addEducationalSupport(educational, context) {
        // Add disclaimer
        if (this.config.legal.addAdviceDisclaimer) {
            educational.disclaimer = this.createEducationalDisclaimer(context);
        }

        // Add glossary of terms
        if (this.config.language.addGlossary) {
            educational.glossary = this.createContextualGlossary(educational);
        }

        // Add learning progress tracking
        educational.learningSupport = {
            estimatedReadingTime: this.estimateReadingTime(educational),
            difficultyLevel: this.assessDifficulty(educational),
            prerequisites: this.identifyPrerequisites(educational, context),
            followUp: this.suggestFollowUp(educational, context)
        };

        // Add accessibility features
        educational.accessibility = {
            structure: 'Organized in clear sections',
            language: 'Plain English used where possible',
            glossary: 'Technical terms explained',
            navigation: 'Jump links to main sections available'
        };

        // Add source attribution
        if (this.config.legal.addSourceAttribution) {
            educational.sources = this.createSourceAttribution(educational, context);
        }
    }

    /**
     * Create educational disclaimer
     */
    createEducationalDisclaimer(context) {
        const baseDisclaimer = 'This information is provided for educational purposes only. ';
        
        const contextSpecific = {
            'fca': 'Always verify information with the FCA directly and seek professional advice for specific situations.',
            'hmrc': 'Tax situations can be complex. Consult HMRC directly or seek professional tax advice for your circumstances.',
            'govuk': 'Government guidance can change. Always check the latest official guidance and seek professional advice.',
            'ombudsman': 'Each complaint is unique. This information is general guidance only - seek specific advice for your situation.'
        };

        const specific = contextSpecific[context.source] || 
            'Always verify information with official sources and seek professional advice for your specific situation.';

        return {
            text: baseDisclaimer + specific,
            professionalAdvice: 'This platform provides educational information only. For specific legal or financial advice, consult qualified professionals.',
            liability: 'JuriBank Educational Platform accepts no liability for decisions made based on this educational content.',
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Simplify text for educational use
     */
    simplifyText(text, level) {
        if (!text || typeof text !== 'string') {
            return text;
        }

        let simplified = text;

        // Replace technical terms with explanations
        for (const [term, explanation] of Object.entries(this.glossary)) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            simplified = simplified.replace(regex, `${term} (${explanation})`);
        }

        // Expand acronyms on first use
        for (const [acronym, expansion] of Object.entries(this.acronyms)) {
            const regex = new RegExp(`\\b${acronym}\\b`, 'g');
            simplified = simplified.replace(regex, `${acronym} (${expansion})`);
        }

        // Break long sentences if needed
        if (level.sentenceLength && simplified.length > level.sentenceLength * 2) {
            simplified = this.breakLongSentences(simplified, level.sentenceLength);
        }

        return simplified;
    }

    /**
     * Create plain English summary
     */
    createPlainEnglishSummary(text, level) {
        if (!text) return '';

        // Extract key points
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const keyPoints = sentences.slice(0, 3).map(s => s.trim());

        return {
            brief: keyPoints[0] + '.',
            keyPoints: keyPoints,
            fullText: this.simplifyText(text, level),
            readingTime: Math.ceil(text.split(' ').length / 200) + ' minutes'
        };
    }

    /**
     * Extract and explain technical terms
     */
    extractAndExplainTerms(text) {
        const terms = {};
        
        if (!text) return terms;

        // Find terms in our glossary
        for (const [term, explanation] of Object.entries(this.glossary)) {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            if (regex.test(text)) {
                terms[term] = explanation;
            }
        }

        // Find acronyms
        for (const [acronym, expansion] of Object.entries(this.acronyms)) {
            const regex = new RegExp(`\\b${acronym}\\b`, 'g');
            if (regex.test(text)) {
                terms[acronym] = expansion;
            }
        }

        return terms;
    }

    /**
     * Create contextual glossary
     */
    createContextualGlossary(educational) {
        const allTerms = {};
        
        // Extract terms from all text content
        const extractTermsFromObject = (obj) => {
            if (typeof obj === 'string') {
                const terms = this.extractAndExplainTerms(obj);
                Object.assign(allTerms, terms);
            } else if (typeof obj === 'object' && obj !== null) {
                for (const value of Object.values(obj)) {
                    extractTermsFromObject(value);
                }
            }
        };

        extractTermsFromObject(educational);
        
        return allTerms;
    }

    /**
     * Estimate reading time
     */
    estimateReadingTime(educational) {
        const wordsPerMinute = 200; // Average reading speed
        let totalWords = 0;

        const countWords = (obj) => {
            if (typeof obj === 'string') {
                totalWords += obj.split(' ').length;
            } else if (typeof obj === 'object' && obj !== null) {
                for (const value of Object.values(obj)) {
                    countWords(value);
                }
            }
        };

        countWords(educational);
        
        const minutes = Math.ceil(totalWords / wordsPerMinute);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    /**
     * Assess content difficulty
     */
    assessDifficulty(educational) {
        // Simple algorithm based on various factors
        let complexityScore = 0;
        let factors = [];

        // Count technical terms
        const glossarySize = Object.keys(educational.glossary || {}).length;
        if (glossarySize > 10) {
            complexityScore += 0.3;
            factors.push('Many technical terms');
        } else if (glossarySize > 5) {
            complexityScore += 0.2;
            factors.push('Some technical terms');
        }

        // Check for legal/financial concepts
        const content = JSON.stringify(educational).toLowerCase();
        const complexConcepts = ['liability', 'statutory', 'fiduciary', 'precedent', 'jurisdiction'];
        const foundConcepts = complexConcepts.filter(concept => content.includes(concept));
        
        if (foundConcepts.length > 3) {
            complexityScore += 0.4;
            factors.push('Complex legal concepts');
        } else if (foundConcepts.length > 0) {
            complexityScore += 0.2;
            factors.push('Legal concepts present');
        }

        // Determine difficulty level
        let level = 'Beginner';
        if (complexityScore > 0.6) {
            level = 'Advanced';
        } else if (complexityScore > 0.3) {
            level = 'Intermediate';
        }

        return {
            level: level,
            score: Math.round(complexityScore * 100) / 100,
            factors: factors,
            recommendation: this.getDifficultyRecommendation(level)
        };
    }

    /**
     * Get difficulty recommendation
     */
    getDifficultyRecommendation(level) {
        const recommendations = {
            'Beginner': 'Great starting point! This content uses simple language and explains key concepts.',
            'Intermediate': 'Some prior knowledge helpful. Take your time with technical terms and concepts.',
            'Advanced': 'Complex content requiring good understanding of financial/legal basics. Consider reviewing fundamentals first.'
        };
        
        return recommendations[level] || recommendations['Beginner'];
    }

    /**
     * Sanitize data for educational use
     */
    sanitizeData(data) {
        // Remove sensitive information and clean up data
        if (typeof data !== 'object' || data === null) {
            return data;
        }

        const sanitized = JSON.parse(JSON.stringify(data));
        
        // Remove potentially sensitive fields
        const sensitiveFields = ['api_key', 'token', 'password', 'auth', 'secret'];
        
        const removeSensitive = (obj) => {
            if (typeof obj === 'object' && obj !== null) {
                for (const key of Object.keys(obj)) {
                    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                        delete obj[key];
                    } else if (typeof obj[key] === 'object') {
                        removeSensitive(obj[key]);
                    }
                }
            }
        };

        removeSensitive(sanitized);
        return sanitized;
    }

    /**
     * Create fallback educational wrapper
     */
    createFallbackEducational(data, context) {
        return {
            originalData: this.sanitizeData(data),
            metadata: {
                source: context.source || 'unknown',
                contentType: 'generic-content',
                learningLevel: 'intermediate',
                lastUpdated: new Date().toISOString(),
                educationalPurpose: true,
                transformationError: true
            },
            educational: {
                summary: 'Educational transformation encountered an error. Original data is available below.',
                disclaimer: this.createEducationalDisclaimer(context),
                note: 'This content could not be processed for educational presentation. Please review the original data carefully.'
            }
        };
    }

    /**
     * Helper methods for specific transformations
     */
    
    createAlertSummary(alerts) {
        const total = alerts.length;
        const critical = alerts.filter(a => a.severity === 'critical').length;
        const high = alerts.filter(a => a.severity === 'high').length;
        
        return `${total} current alert${total !== 1 ? 's' : ''} from financial regulators. ` +
               `${critical} critical and ${high} high priority alert${(critical + high) !== 1 ? 's' : ''} requiring immediate attention.`;
    }

    explainSeverity(severity) {
        const explanations = {
            critical: 'Immediate action required - this poses serious risks to consumers',
            high: 'Important alert - review this information carefully',
            medium: 'Notable update - good to be aware of',
            low: 'General information - useful background knowledge'
        };
        
        return explanations[severity] || 'Alert requiring attention';
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    breakLongSentences(text, maxLength) {
        const sentences = text.split(/[.!?]+/);
        const reformed = [];
        
        for (let sentence of sentences) {
            sentence = sentence.trim();
            if (sentence.length > maxLength * 2) {
                // Try to break at conjunctions
                const parts = sentence.split(/,|\band\b|\bbut\b|\bhowever\b/);
                reformed.push(...parts.map(p => p.trim()).filter(p => p.length > 0));
            } else {
                if (sentence.length > 0) {
                    reformed.push(sentence);
                }
            }
        }
        
        return reformed.join('. ') + '.';
    }

    // Additional helper methods would go here for specific content types
    // This is a foundation that can be extended based on specific needs
}

module.exports = EducationalTransformer;