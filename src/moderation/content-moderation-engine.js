/**
 * JuriBank Content Moderation Engine v3.0
 * Automated educational compliance and content filtering system
 * Ensuring discussions stay educational and privacy-protected
 */

const crypto = require('crypto');

class ContentModerationEngine {
    constructor() {
        this.initializeModeration();
        this.loadEducationalGuidelines();
        this.setupComplianceRules();
        this.initializeMLModels();
    }

    /**
     * Initialize moderation systems
     */
    initializeModeration() {
        // Content analysis patterns
        this.patterns = {
            // Personal information patterns (privacy protection)
            personalInfo: [
                {
                    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
                    type: 'card_number',
                    severity: 'high',
                    replacement: '[CARD NUMBER REMOVED FOR PRIVACY]'
                },
                {
                    pattern: /\b\d{2}[\s-]?\d{2}[\s-]?\d{2}\b/g,
                    type: 'sort_code',
                    severity: 'high',
                    replacement: '[SORT CODE REMOVED FOR PRIVACY]'
                },
                {
                    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
                    type: 'email',
                    severity: 'high',
                    replacement: '[EMAIL ADDRESS REMOVED FOR PRIVACY]'
                },
                {
                    pattern: /\b(?:0|\+44)\d{10,11}\b/g,
                    type: 'phone_uk',
                    severity: 'high',
                    replacement: '[PHONE NUMBER REMOVED FOR PRIVACY]'
                },
                {
                    pattern: /\b[A-Z]{2}\d{2}[\s]?\d{4}[\s]?\d{4}[\s]?\d{4}[\s]?\d{2}\b/gi,
                    type: 'iban',
                    severity: 'high',
                    replacement: '[IBAN REMOVED FOR PRIVACY]'
                },
                {
                    pattern: /\b(?:Mr|Mrs|Ms|Dr|Professor)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
                    type: 'full_name',
                    severity: 'medium',
                    replacement: '[NAME REMOVED FOR PRIVACY]'
                },
                {
                    pattern: /\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|Road|Lane|Avenue|Drive|Close|Way|Place)\b/gi,
                    type: 'address',
                    severity: 'high',
                    replacement: '[ADDRESS REMOVED FOR PRIVACY]'
                },
                {
                    pattern: /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/gi,
                    type: 'postcode_uk',
                    severity: 'medium',
                    replacement: '[POSTCODE REMOVED FOR PRIVACY]'
                }
            ],

            // Legal advice detection (educational compliance)
            legalAdvice: [
                {
                    pattern: /\b(?:you should|you must|definitely do|absolutely should|my advice is|i recommend you|you need to)\b/gi,
                    type: 'directive_advice',
                    severity: 'high',
                    educational: true
                },
                {
                    pattern: /\b(?:sue them|file a lawsuit|take legal action|go to court|hire a solicitor|get a lawyer)\b/gi,
                    type: 'legal_action_advice',
                    severity: 'high',
                    educational: true
                },
                {
                    pattern: /\b(?:guaranteed|certain to win|definite outcome|100% sure|definitely will win)\b/gi,
                    type: 'outcome_guarantee',
                    severity: 'high',
                    educational: true
                },
                {
                    pattern: /\b(?:legal advice|professional advice|as your solicitor|this is legal counsel)\b/gi,
                    type: 'professional_advice_claim',
                    severity: 'high',
                    educational: true
                }
            ],

            // Inappropriate content
            inappropriate: [
                {
                    pattern: /\b(?:fuck|shit|damn|bloody hell|bastard|bitch)\b/gi,
                    type: 'profanity',
                    severity: 'low',
                    replacement: '[INAPPROPRIATE LANGUAGE REMOVED]'
                },
                {
                    pattern: /\b(?:scam|fraud|criminal|illegal|money laundering)\b/gi,
                    type: 'serious_allegations',
                    severity: 'medium',
                    needsReview: true
                }
            ],

            // Spam and promotional content
            spam: [
                {
                    pattern: /\b(?:visit our website|click here|buy now|special offer|limited time)\b/gi,
                    type: 'promotional',
                    severity: 'medium'
                },
                {
                    pattern: /\b(?:www\.|http|https|\.com|\.co\.uk)\b/gi,
                    type: 'external_links',
                    severity: 'low',
                    needsReview: true
                }
            ]
        };

        // Educational keyword detection
        this.educationalKeywords = {
            positive: [
                'experience', 'learned', 'discovered', 'found out', 'my situation was',
                'what happened to me', 'sharing my story', 'educational purposes',
                'for information only', 'my understanding is', 'from what i learned'
            ],
            negative: [
                'what should i do', 'give me advice', 'tell me what to do', 
                'what would you do', 'help me decide', 'advise me',
                'what are my options', 'should i sue', 'can you help me'
            ]
        };

        // Moderation actions
        this.moderationActions = {
            APPROVE: 'approve',
            FLAG_FOR_REVIEW: 'flag',
            AUTO_EDIT: 'edit',
            REJECT: 'reject',
            EDUCATIONAL_WARNING: 'warn',
            PRIVACY_VIOLATION: 'privacy'
        };

        // Risk scoring
        this.riskThresholds = {
            LOW: 0.3,
            MEDIUM: 0.6,
            HIGH: 0.8,
            CRITICAL: 1.0
        };
    }

    /**
     * Load educational guidelines
     */
    loadEducationalGuidelines() {
        this.educationalGuidelines = {
            boundaries: {
                "We encourage sharing experiences but cannot provide specific legal advice": [
                    'legal advice', 'professional advice', 'what should i do', 'advise me'
                ],
                "Please share your experience rather than giving definitive guidance": [
                    'you must', 'definitely do', 'you should', 'my advice is'
                ],
                "For your privacy, avoid sharing personal information": [
                    'card number', 'email', 'phone', 'address', 'account number'
                ],
                "This is an educational platform - frame discussions as learning experiences": [
                    'guaranteed outcome', 'certain to win', 'definite result'
                ]
            },

            suggestions: {
                "Instead of 'You should sue them', try: 'In my experience, I found it helpful to...'": [
                    'you should sue', 'you must sue', 'definitely sue'
                ],
                "Instead of giving advice, share: 'What worked for me was...' or 'I learned that...'": [
                    'you should', 'you must', 'my advice'
                ],
                "Replace guarantees with experiences: 'In my case...' or 'I discovered that...'": [
                    'guaranteed', 'definitely will', 'certain outcome'
                ],
                "Share information, not directions: 'I found this information helpful...'": [
                    'you need to', 'you have to', 'definitely do'
                ]
            }
        };
    }

    /**
     * Setup compliance rules for educational platform
     */
    setupComplianceRules() {
        this.complianceRules = {
            // Educational compliance levels
            educationalCompliance: {
                FULLY_COMPLIANT: { score: 1.0, description: "Sharing experience/information" },
                MOSTLY_COMPLIANT: { score: 0.8, description: "Educational with minor advice language" },
                NEEDS_GUIDANCE: { score: 0.6, description: "Contains advice language, needs editing" },
                NON_COMPLIANT: { score: 0.3, description: "Direct advice or inappropriate content" },
                VIOLATION: { score: 0.0, description: "Privacy violation or serious non-compliance" }
            },

            // Privacy compliance
            privacyCompliance: {
                NO_PERSONAL_INFO: { score: 1.0, description: "No personal information detected" },
                MINOR_INFO: { score: 0.7, description: "Minor personal references" },
                MODERATE_INFO: { score: 0.4, description: "Some personal information present" },
                HIGH_RISK: { score: 0.1, description: "Significant personal information" },
                CRITICAL_VIOLATION: { score: 0.0, description: "Serious privacy violations" }
            },

            // Content quality
            contentQuality: {
                HIGH_QUALITY: { score: 1.0, description: "Helpful, well-structured content" },
                GOOD_QUALITY: { score: 0.8, description: "Generally helpful content" },
                AVERAGE_QUALITY: { score: 0.6, description: "Acceptable content quality" },
                POOR_QUALITY: { score: 0.4, description: "Low-quality or unclear content" },
                SPAM_OR_ABUSE: { score: 0.0, description: "Spam, abuse, or very poor quality" }
            }
        };
    }

    /**
     * Initialize ML models (mock implementation)
     */
    initializeMLModels() {
        // In production, this would load trained ML models
        this.mlModels = {
            sentimentAnalyzer: {
                enabled: true,
                confidence: 0.85
            },
            topicClassifier: {
                enabled: true,
                categories: ['banking', 'payments', 'ppi', 'investment', 'mortgage', 'success']
            },
            languageDetector: {
                enabled: true,
                supportedLanguages: ['en', 'cy'] // English and Welsh
            }
        };
    }

    /**
     * Main content moderation function
     */
    async moderateContent(content, contentType = 'post', metadata = {}) {
        try {
            const moderationResult = {
                approved: false,
                action: null,
                riskScore: 0,
                flags: [],
                suggestions: [],
                editedContent: content,
                educationalCompliance: null,
                privacyCompliance: null,
                contentQuality: null,
                needsReview: false,
                autoEdits: [],
                warnings: [],
                timestamp: new Date()
            };

            // 1. Privacy protection screening (highest priority)
            const privacyResult = await this.checkPrivacyViolations(content);
            moderationResult.privacyCompliance = privacyResult;
            
            if (privacyResult.score <= this.riskThresholds.HIGH) {
                moderationResult.approved = false;
                moderationResult.action = this.moderationActions.PRIVACY_VIOLATION;
                moderationResult.riskScore = 1.0;
                moderationResult.flags.push('privacy_violation');
                return moderationResult;
            }

            // Apply privacy auto-edits if any personal info detected
            if (privacyResult.autoEdits.length > 0) {
                moderationResult.editedContent = privacyResult.editedContent;
                moderationResult.autoEdits = privacyResult.autoEdits;
            }

            // 2. Educational compliance checking
            const educationalResult = await this.checkEducationalCompliance(moderationResult.editedContent);
            moderationResult.educationalCompliance = educationalResult;
            moderationResult.flags.push(...educationalResult.flags);
            moderationResult.suggestions.push(...educationalResult.suggestions);

            // 3. Content quality assessment
            const qualityResult = await this.assessContentQuality(moderationResult.editedContent, contentType);
            moderationResult.contentQuality = qualityResult;
            moderationResult.flags.push(...qualityResult.flags);

            // 4. Calculate overall risk score
            moderationResult.riskScore = this.calculateOverallRisk([
                privacyResult.score,
                educationalResult.score, 
                qualityResult.score
            ]);

            // 5. Determine moderation action
            moderationResult.action = this.determineAction(moderationResult);
            moderationResult.approved = moderationResult.action === this.moderationActions.APPROVE || 
                                      moderationResult.action === this.moderationActions.AUTO_EDIT;

            // 6. Generate educational warnings if needed
            if (educationalResult.needsWarning) {
                moderationResult.warnings.push(...this.generateEducationalWarnings(educationalResult));
            }

            // 7. Flag for manual review if necessary
            moderationResult.needsReview = this.needsManualReview(moderationResult);

            return moderationResult;

        } catch (error) {
            console.error('[Moderation Engine] Error moderating content:', error);
            return {
                approved: false,
                action: this.moderationActions.REJECT,
                riskScore: 1.0,
                flags: ['moderation_error'],
                error: error.message,
                timestamp: new Date()
            };
        }
    }

    /**
     * Check for privacy violations and personal information
     */
    async checkPrivacyViolations(content) {
        const result = {
            score: 1.0,
            violations: [],
            autoEdits: [],
            editedContent: content,
            flags: []
        };

        let editedContent = content;
        let violationScore = 0;

        // Check each privacy pattern
        this.patterns.personalInfo.forEach(pattern => {
            const matches = content.match(pattern.pattern);
            if (matches) {
                result.violations.push({
                    type: pattern.type,
                    count: matches.length,
                    severity: pattern.severity,
                    matches: matches
                });

                // Auto-replace sensitive information
                if (pattern.replacement) {
                    editedContent = editedContent.replace(pattern.pattern, pattern.replacement);
                    result.autoEdits.push({
                        type: pattern.type,
                        action: 'replaced',
                        count: matches.length
                    });
                }

                // Add to violation score based on severity
                switch (pattern.severity) {
                    case 'high':
                        violationScore += 0.4 * matches.length;
                        break;
                    case 'medium':
                        violationScore += 0.2 * matches.length;
                        break;
                    case 'low':
                        violationScore += 0.1 * matches.length;
                        break;
                }

                result.flags.push(`privacy_${pattern.type}`);
            }
        });

        result.editedContent = editedContent;
        result.score = Math.max(0, 1.0 - violationScore);

        return result;
    }

    /**
     * Check educational compliance
     */
    async checkEducationalCompliance(content) {
        const result = {
            score: 1.0,
            flags: [],
            suggestions: [],
            needsWarning: false,
            educationalLevel: 'unknown',
            violations: []
        };

        const contentLower = content.toLowerCase();
        let complianceScore = 1.0;

        // Check for directive advice language
        this.patterns.legalAdvice.forEach(pattern => {
            const matches = content.match(pattern.pattern);
            if (matches) {
                result.violations.push({
                    type: pattern.type,
                    count: matches.length,
                    severity: pattern.severity,
                    matches: matches
                });

                result.flags.push(`advice_${pattern.type}`);
                complianceScore -= 0.3 * matches.length;
                result.needsWarning = true;
            }
        });

        // Assess educational vs advice-seeking language
        const educationalScore = this.calculateEducationalScore(contentLower);
        result.educationalLevel = this.determineEducationalLevel(educationalScore);

        // Generate suggestions based on violations
        result.suggestions = this.generateEducationalSuggestions(result.violations);

        result.score = Math.max(0, complianceScore * educationalScore);

        return result;
    }

    /**
     * Assess content quality
     */
    async assessContentQuality(content, contentType) {
        const result = {
            score: 0.8, // Default good score
            flags: [],
            qualityLevel: 'good',
            issues: []
        };

        // Check content length
        if (content.length < 20) {
            result.score -= 0.3;
            result.flags.push('too_short');
            result.issues.push('Content is very short');
        }

        // Check for spam patterns
        this.patterns.spam.forEach(pattern => {
            const matches = content.match(pattern.pattern);
            if (matches) {
                result.score -= 0.2 * matches.length;
                result.flags.push(`spam_${pattern.type}`);
                result.issues.push(`Possible ${pattern.type} detected`);
            }
        });

        // Check for inappropriate content
        this.patterns.inappropriate.forEach(pattern => {
            const matches = content.match(pattern.pattern);
            if (matches) {
                result.score -= 0.1 * matches.length;
                result.flags.push(`inappropriate_${pattern.type}`);
                result.issues.push(`Inappropriate ${pattern.type} detected`);
            }
        });

        // Determine quality level
        if (result.score >= 0.8) result.qualityLevel = 'high';
        else if (result.score >= 0.6) result.qualityLevel = 'good';
        else if (result.score >= 0.4) result.qualityLevel = 'average';
        else if (result.score >= 0.2) result.qualityLevel = 'poor';
        else result.qualityLevel = 'very_poor';

        return result;
    }

    /**
     * Calculate educational score based on language patterns
     */
    calculateEducationalScore(contentLower) {
        let educationalWords = 0;
        let adviceWords = 0;

        // Count educational language
        this.educationalKeywords.positive.forEach(keyword => {
            if (contentLower.includes(keyword)) {
                educationalWords++;
            }
        });

        // Count advice-seeking language
        this.educationalKeywords.negative.forEach(keyword => {
            if (contentLower.includes(keyword)) {
                adviceWords++;
            }
        });

        // Calculate educational score (0-1)
        const totalWords = educationalWords + adviceWords;
        if (totalWords === 0) return 0.7; // Neutral default

        return (educationalWords / totalWords) * 0.6 + 0.4; // Weighted score
    }

    /**
     * Determine educational level
     */
    determineEducationalLevel(score) {
        if (score >= 0.8) return 'educational';
        if (score >= 0.6) return 'mixed';
        if (score >= 0.4) return 'advice_seeking';
        return 'non_educational';
    }

    /**
     * Calculate overall risk score
     */
    calculateOverallRisk(scores) {
        // Weighted average with privacy being most important
        const weights = [0.5, 0.3, 0.2]; // privacy, educational, quality
        const weightedSum = scores.reduce((sum, score, index) => sum + (score * weights[index]), 0);
        return 1.0 - weightedSum; // Convert to risk score (higher = more risky)
    }

    /**
     * Determine moderation action based on results
     */
    determineAction(result) {
        if (result.riskScore >= this.riskThresholds.CRITICAL) {
            return this.moderationActions.REJECT;
        }
        
        if (result.riskScore >= this.riskThresholds.HIGH) {
            return this.moderationActions.FLAG_FOR_REVIEW;
        }
        
        if (result.autoEdits.length > 0 || result.riskScore >= this.riskThresholds.MEDIUM) {
            return this.moderationActions.AUTO_EDIT;
        }
        
        if (result.educationalCompliance && result.educationalCompliance.needsWarning) {
            return this.moderationActions.EDUCATIONAL_WARNING;
        }
        
        return this.moderationActions.APPROVE;
    }

    /**
     * Generate educational suggestions
     */
    generateEducationalSuggestions(violations) {
        const suggestions = [];
        
        violations.forEach(violation => {
            switch (violation.type) {
                case 'directive_advice':
                    suggestions.push("Try sharing your experience instead: 'What worked for me was...' or 'I found that...'");
                    break;
                case 'legal_action_advice':
                    suggestions.push("Consider framing as: 'In my situation, I learned about...' rather than suggesting specific actions");
                    break;
                case 'outcome_guarantee':
                    suggestions.push("Share your experience without guaranteeing outcomes: 'In my case, the result was...'");
                    break;
                case 'professional_advice_claim':
                    suggestions.push("Remember: This is an educational platform. Frame content as information sharing, not professional advice");
                    break;
            }
        });

        return [...new Set(suggestions)]; // Remove duplicates
    }

    /**
     * Generate educational warnings
     */
    generateEducationalWarnings(educationalResult) {
        const warnings = [];

        if (educationalResult.violations.length > 0) {
            warnings.push({
                type: 'educational_compliance',
                message: "This content appears to give specific advice. Our platform is for sharing experiences and educational information only.",
                severity: 'medium',
                suggestions: educationalResult.suggestions
            });
        }

        if (educationalResult.educationalLevel === 'non_educational') {
            warnings.push({
                type: 'educational_framing',
                message: "Please frame your post as sharing an experience or asking for educational information rather than seeking specific guidance.",
                severity: 'low'
            });
        }

        return warnings;
    }

    /**
     * Determine if manual review is needed
     */
    needsManualReview(result) {
        return result.riskScore >= this.riskThresholds.MEDIUM ||
               result.flags.includes('serious_allegations') ||
               result.privacyCompliance.violations.some(v => v.severity === 'high') ||
               result.contentQuality.score <= 0.3;
    }

    /**
     * Batch moderation for multiple pieces of content
     */
    async moderateBatch(contentArray) {
        const results = [];
        
        for (const item of contentArray) {
            try {
                const result = await this.moderateContent(
                    item.content, 
                    item.type, 
                    item.metadata
                );
                results.push({
                    id: item.id,
                    ...result
                });
            } catch (error) {
                results.push({
                    id: item.id,
                    approved: false,
                    action: this.moderationActions.REJECT,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Get moderation statistics
     */
    getModerationStats() {
        return {
            patternsLoaded: {
                personalInfo: this.patterns.personalInfo.length,
                legalAdvice: this.patterns.legalAdvice.length,
                inappropriate: this.patterns.inappropriate.length,
                spam: this.patterns.spam.length
            },
            educationalKeywords: {
                positive: this.educationalKeywords.positive.length,
                negative: this.educationalKeywords.negative.length
            },
            complianceRules: Object.keys(this.complianceRules).length,
            mlModelsEnabled: Object.values(this.mlModels).filter(model => model.enabled).length
        };
    }

    /**
     * Update moderation rules (for dynamic updates)
     */
    updateModerationRules(newRules) {
        if (newRules.patterns) {
            this.patterns = { ...this.patterns, ...newRules.patterns };
        }
        
        if (newRules.educationalKeywords) {
            this.educationalKeywords = { ...this.educationalKeywords, ...newRules.educationalKeywords };
        }
        
        if (newRules.riskThresholds) {
            this.riskThresholds = { ...this.riskThresholds, ...newRules.riskThresholds };
        }

        console.log('[Moderation Engine] Rules updated successfully');
    }

    /**
     * Export moderation report for analysis
     */
    generateModerationReport(results) {
        const summary = {
            totalProcessed: results.length,
            approved: results.filter(r => r.approved).length,
            rejected: results.filter(r => !r.approved).length,
            autoEdited: results.filter(r => r.autoEdits && r.autoEdits.length > 0).length,
            needsReview: results.filter(r => r.needsReview).length,
            privacyViolations: results.filter(r => r.flags.includes('privacy_violation')).length,
            educationalWarnings: results.filter(r => r.warnings && r.warnings.length > 0).length,
            averageRiskScore: results.reduce((sum, r) => sum + r.riskScore, 0) / results.length
        };

        return {
            summary,
            timestamp: new Date(),
            version: '3.0.0'
        };
    }
}

module.exports = ContentModerationEngine;