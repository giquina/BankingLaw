// Jurisdiction Mapping System
// JuriBank - UK Money and Finance Help Educational Platform

class JurisdictionMapper {
    constructor() {
        this.jurisdictionDatabase = new Map();
        this.conflictRules = new Map();
        this.brexitTransitions = new Map();
        this.equivalenceDecisions = new Map();
        
        this.initializeJurisdictionMaps();
    }

    // Initialize comprehensive UK vs EU jurisdiction mapping
    initializeJurisdictionMaps() {
        console.log('🗺️ Initializing JuriBank Jurisdiction Mapping...');
        
        // Core financial services regulations
        this.mapRegulation({
            id: 'mifid-ii',
            name: 'Markets in Financial Instruments Directive II',
            eu_regulation: {
                directive: '2014/65/EU',
                regulation: '600/2014',
                status: 'active',
                scope: 'EEA-wide',
                authority: 'ESMA'
            },
            uk_implementation: {
                status: 'retained_and_modified',
                source: 'Financial Services Act 2021',
                authority: 'FCA',
                modifications: [
                    'Removed passport rights',
                    'Modified third country provisions',
                    'Enhanced UK domestic market rules'
                ],
                divergence_date: '2021-01-01'
            },
            key_differences: [
                'UK firms cannot passport into EU',
                'Different third country access rules',
                'UK-specific conduct of business rules',
                'Modified research unbundling requirements'
            ],
            cross_border_implications: 'UK firms need separate EU authorization'
        });

        this.mapRegulation({
            id: 'crd-v-crr-ii',
            name: 'Capital Requirements Directive/Regulation',
            eu_regulation: {
                directive: '2019/878/EU',
                regulation: '2019/876/EU',
                status: 'active',
                scope: 'EEA-wide',
                authority: 'EBA'
            },
            uk_implementation: {
                status: 'retained_with_modifications',
                source: 'PRA Rulebook',
                authority: 'PRA',
                modifications: [
                    'UK-specific prudential requirements',
                    'Modified large exposures regime',
                    'Different supervisory review process'
                ],
                divergence_date: '2021-01-01'
            },
            key_differences: [
                'UK-specific capital buffers',
                'Different stress testing requirements',
                'Modified Pillar 2 framework',
                'UK-specific operational risk requirements'
            ]
        });

        this.mapRegulation({
            id: 'gdpr',
            name: 'General Data Protection Regulation',
            eu_regulation: {
                regulation: '2016/679',
                status: 'active',
                scope: 'EEA-wide',
                authority: 'EDPB'
            },
            uk_implementation: {
                status: 'replaced',
                source: 'UK GDPR + Data Protection Act 2018',
                authority: 'ICO',
                modifications: [
                    'UK-specific adequacy regime',
                    'Modified international transfer rules',
                    'Different representative requirements'
                ],
                divergence_date: '2021-01-01'
            },
            key_differences: [
                'UK adequacy decisions vs EU adequacy',
                'Different international transfer mechanisms',
                'UK-specific representative rules',
                'Different penalty calculation methods'
            ]
        });

        // Anti-Money Laundering
        this.mapRegulation({
            id: 'aml-directive',
            name: 'Anti-Money Laundering Directive',
            eu_regulation: {
                directive: '2018/843/EU (5AMLD)',
                status: 'active',
                scope: 'EEA-wide',
                authority: 'EBA'
            },
            uk_implementation: {
                status: 'retained_with_enhancements',
                source: 'Money Laundering Regulations 2017 (as amended)',
                authority: 'HM Treasury/FCA/HMRC',
                modifications: [
                    'Enhanced corporate criminal offences',
                    'Unexplained Wealth Orders',
                    'UK-specific trust registration'
                ],
                divergence_date: '2021-01-01'
            },
            key_differences: [
                'UK corporate criminal liability regime',
                'Different trust beneficial ownership rules',
                'Enhanced enforcement powers',
                'UK-specific sanctions integration'
            ]
        });

        // Market Abuse
        this.mapRegulation({
            id: 'market-abuse',
            name: 'Market Abuse Regulation',
            eu_regulation: {
                regulation: '596/2014',
                status: 'active',
                scope: 'EEA-wide',
                authority: 'ESMA'
            },
            uk_implementation: {
                status: 'retained_and_enhanced',
                source: 'Financial Services Act 2021',
                authority: 'FCA',
                modifications: [
                    'Enhanced criminal sanctions',
                    'Modified disclosure requirements',
                    'UK-specific market soundings rules'
                ],
                divergence_date: '2021-01-01'
            },
            key_differences: [
                'Enhanced criminal enforcement',
                'Different notification thresholds',
                'UK-specific safe harbours',
                'Modified research disclosure rules'
            ]
        });

        // Brexit transition mappings
        this.mapBrexitTransition({
            id: 'passporting-end',
            name: 'End of Passporting Rights',
            effective_date: '2021-01-01',
            impact: 'critical',
            affected_services: [
                'Investment services',
                'Banking services',
                'Insurance services',
                'Payment services'
            ],
            uk_replacements: [
                'Overseas Persons Exclusions',
                'Temporary Permissions Regime',
                'Financial Promotion Regime'
            ],
            eu_alternatives: [
                'Third country branches',
                'EU subsidiary establishment',
                'Reverse solicitation'
            ]
        });

        // Equivalence decisions
        this.mapEquivalenceDecision({
            id: 'uk-ccps',
            name: 'UK Central Counterparties',
            status: 'granted',
            granted_date: '2019-09-13',
            expiry_date: '2025-06-30',
            scope: 'Recognition of UK CCPs for EU firms',
            conditions: [
                'Continued supervisory cooperation',
                'Maintained regulatory standards',
                'Ongoing equivalence monitoring'
            ]
        });

        this.initializeConflictRules();
        
        console.log('✅ JuriBank jurisdiction mapping system initialized');
    }

    // Map individual regulation
    mapRegulation(mapping) {
        this.jurisdictionDatabase.set(mapping.id, mapping);
    }

    // Map Brexit transition
    mapBrexitTransition(transition) {
        this.brexitTransitions.set(transition.id, transition);
    }

    // Map equivalence decision
    mapEquivalenceDecision(decision) {
        this.equivalenceDecisions.set(decision.id, decision);
    }

    // Initialize conflict of laws rules
    initializeConflictRules() {
        // Contract governing law rules
        this.conflictRules.set('contract-law', {
            principle: 'Party autonomy',
            uk_rules: 'Rome I Regulation (retained)',
            eu_rules: 'Rome I Regulation',
            differences: [
                'UK third country recognition rules',
                'Modified escape clauses for financial services'
            ]
        });

        // Regulatory jurisdiction rules
        this.conflictRules.set('regulatory-jurisdiction', {
            principle: 'Location of activity',
            uk_rules: 'UK regulatory perimeter',
            eu_rules: 'EU regulatory perimeter',
            overlaps: [
                'Cross-border services',
                'Online financial services',
                'Marketing of financial instruments'
            ]
        });

        // Dispute resolution
        this.conflictRules.set('dispute-resolution', {
            principle: 'Forum selection',
            uk_courts: 'English courts jurisdiction',
            eu_courts: 'Brussels Ia Regulation',
            enforcement: [
                'UK: Hague Convention 2019',
                'EU: Brussels Ia automatic recognition'
            ]
        });
    }

    // Determine applicable jurisdiction
    determineJurisdiction(scenario) {
        const analysis = {
            scenario: scenario,
            applicable_jurisdictions: [],
            primary_jurisdiction: null,
            conflict_analysis: [],
            recommendations: []
        };

        // Analyze firm location
        if (scenario.firm_location) {
            if (scenario.firm_location === 'UK') {
                analysis.applicable_jurisdictions.push('UK');
                analysis.primary_jurisdiction = 'UK';
            } else if (this.isEUMemberState(scenario.firm_location)) {
                analysis.applicable_jurisdictions.push('EU');
                analysis.primary_jurisdiction = 'EU';
            }
        }

        // Analyze service location
        if (scenario.service_location) {
            if (scenario.service_location === 'UK') {
                analysis.applicable_jurisdictions.push('UK');
            } else if (this.isEUMemberState(scenario.service_location)) {
                analysis.applicable_jurisdictions.push('EU');
            }
        }

        // Analyze client location
        if (scenario.client_location) {
            if (scenario.client_location === 'UK') {
                analysis.applicable_jurisdictions.push('UK');
            } else if (this.isEUMemberState(scenario.client_location)) {
                analysis.applicable_jurisdictions.push('EU');
            }
        }

        // Check for conflicts
        if (analysis.applicable_jurisdictions.includes('UK') && 
            analysis.applicable_jurisdictions.includes('EU')) {
            analysis.conflict_analysis = this.analyzeJurisdictionConflict(scenario);
        }

        // Generate recommendations
        analysis.recommendations = this.generateJurisdictionRecommendations(analysis);

        return analysis;
    }

    // Check if country is EU member state
    isEUMemberState(country) {
        const euMembers = [
            'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
            'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
            'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
            'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
            'Slovenia', 'Spain', 'Sweden'
        ];
        return euMembers.includes(country);
    }

    // Analyze jurisdiction conflicts
    analyzeJurisdictionConflict(scenario) {
        const conflicts = [];

        // Check regulatory conflicts
        if (scenario.activity_type === 'investment_services') {
            conflicts.push({
                type: 'regulatory',
                issue: 'MiFID II application',
                uk_position: 'UK MiFID rules apply to UK activities',
                eu_position: 'EU MiFID rules apply to EU clients',
                resolution: 'Dual compliance may be required'
            });
        }

        // Check data protection conflicts
        if (scenario.involves_personal_data) {
            conflicts.push({
                type: 'data_protection',
                issue: 'GDPR vs UK GDPR application',
                uk_position: 'UK GDPR applies to UK processing',
                eu_position: 'EU GDPR applies to EU data subjects',
                resolution: 'Higher standard typically applies'
            });
        }

        return conflicts;
    }

    // Generate jurisdiction recommendations
    generateJurisdictionRecommendations(analysis) {
        const recommendations = [];

        if (analysis.conflict_analysis.length > 0) {
            recommendations.push({
                priority: 'high',
                type: 'legal_advice',
                recommendation: 'Seek specialist legal advice on jurisdiction conflicts'
            });

            recommendations.push({
                priority: 'medium',
                type: 'dual_compliance',
                recommendation: 'Consider dual compliance approach for cross-border activities'
            });
        }

        if (analysis.applicable_jurisdictions.includes('UK') && 
            analysis.applicable_jurisdictions.includes('EU')) {
            recommendations.push({
                priority: 'medium',
                type: 'regulatory_mapping',
                recommendation: 'Map regulatory requirements in both jurisdictions'
            });
        }

        return recommendations;
    }

    // Get regulatory differences
    getRegulatoryDifferences(regulation_id) {
        const mapping = this.jurisdictionDatabase.get(regulation_id);
        
        if (!mapping) {
            return null;
        }

        return {
            regulation: mapping.name,
            uk_status: mapping.uk_implementation.status,
            eu_status: mapping.eu_regulation.status,
            key_differences: mapping.key_differences,
            divergence_date: mapping.uk_implementation.divergence_date,
            cross_border_implications: mapping.cross_border_implications
        };
    }

    // Get Brexit impact analysis
    getBrexitImpact(service_type) {
        const impacts = [];

        this.brexitTransitions.forEach(transition => {
            if (transition.affected_services.includes(service_type)) {
                impacts.push({
                    transition: transition.name,
                    effective_date: transition.effective_date,
                    impact_level: transition.impact,
                    uk_alternatives: transition.uk_replacements,
                    eu_alternatives: transition.eu_alternatives
                });
            }
        });

        return impacts;
    }

    // Get equivalence status
    getEquivalenceStatus(regime) {
        const decisions = [];

        this.equivalenceDecisions.forEach(decision => {
            if (decision.scope.toLowerCase().includes(regime.toLowerCase())) {
                decisions.push({
                    regime: decision.name,
                    status: decision.status,
                    granted_date: decision.granted_date,
                    expiry_date: decision.expiry_date,
                    conditions: decision.conditions
                });
            }
        });

        return decisions;
    }

    // Generate jurisdiction report
    generateJurisdictionReport(query) {
        const report = {
            query: query,
            generated: new Date().toISOString(),
            jurisdiction_analysis: this.determineJurisdiction(query),
            regulatory_differences: {},
            brexit_impacts: [],
            equivalence_status: [],
            recommendations: []
        };

        // Get regulatory differences for relevant regulations
        if (query.regulations) {
            query.regulations.forEach(reg => {
                const differences = this.getRegulatoryDifferences(reg);
                if (differences) {
                    report.regulatory_differences[reg] = differences;
                }
            });
        }

        // Get Brexit impacts
        if (query.service_type) {
            report.brexit_impacts = this.getBrexitImpact(query.service_type);
        }

        // Get equivalence status
        if (query.equivalence_regimes) {
            query.equivalence_regimes.forEach(regime => {
                const status = this.getEquivalenceStatus(regime);
                report.equivalence_status.push(...status);
            });
        }

        return report;
    }

    // Search jurisdiction mappings
    searchMappings(searchTerm) {
        const results = [];
        const lowerTerm = searchTerm.toLowerCase();

        this.jurisdictionDatabase.forEach(mapping => {
            if (mapping.name.toLowerCase().includes(lowerTerm) ||
                mapping.key_differences.some(diff => diff.toLowerCase().includes(lowerTerm))) {
                
                results.push({
                    id: mapping.id,
                    name: mapping.name,
                    relevance: this.calculateRelevance(lowerTerm, mapping),
                    summary: `UK: ${mapping.uk_implementation.status}, EU: ${mapping.eu_regulation.status}`,
                    key_differences: mapping.key_differences.slice(0, 3)
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    // Calculate search relevance
    calculateRelevance(term, mapping) {
        let score = 0;
        
        if (mapping.name.toLowerCase().includes(term)) {score += 10;}
        if (mapping.key_differences.some(diff => diff.toLowerCase().includes(term))) {score += 5;}
        if (mapping.uk_implementation.modifications.some(mod => mod.toLowerCase().includes(term))) {score += 3;}
        
        return score;
    }

    // Get recent divergences
    getRecentDivergences(months = 12) {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - months);

        const divergences = [];

        this.jurisdictionDatabase.forEach(mapping => {
            const divergenceDate = new Date(mapping.uk_implementation.divergence_date);
            if (divergenceDate >= cutoff) {
                divergences.push({
                    regulation: mapping.name,
                    divergence_date: mapping.uk_implementation.divergence_date,
                    key_changes: mapping.uk_implementation.modifications,
                    impact: mapping.key_differences.length
                });
            }
        });

        return divergences.sort((a, b) => new Date(b.divergence_date) - new Date(a.divergence_date));
    }

    // Export jurisdiction data
    exportJurisdictionData(format = 'json') {
        const data = {
            regulations: Array.from(this.jurisdictionDatabase.values()),
            brexit_transitions: Array.from(this.brexitTransitions.values()),
            equivalence_decisions: Array.from(this.equivalenceDecisions.values()),
            conflict_rules: Array.from(this.conflictRules.entries()),
            generated: new Date().toISOString()
        };

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.jurisdictionToCSV(data);
            default:
                return data;
        }
    }

    // Convert to CSV format
    jurisdictionToCSV(data) {
        const rows = [];
        rows.push(['Type', 'Name', 'UK Status', 'EU Status', 'Divergence Date', 'Key Differences']);

        data.regulations.forEach(reg => {
            rows.push([
                'Regulation',
                reg.name,
                reg.uk_implementation.status,
                reg.eu_regulation.status,
                reg.uk_implementation.divergence_date,
                reg.key_differences.join('; ')
            ]);
        });

        return rows.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }
}

// Export for use in main application
window.JurisdictionMapper = JurisdictionMapper;

// Initialize jurisdiction mapper
const jurisdictionMapper = new JurisdictionMapper();

console.log('🗺️ UK vs EU Jurisdiction Mapping System loaded');