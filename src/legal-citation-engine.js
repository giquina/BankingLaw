// Educational Citation Engine
// JuriBank - UK Money and Finance Help Educational Platform

class LegalCitationEngine {
    constructor() {
        this.citationDatabase = new Map();
        this.caseDatabase = new Map();
        this.statuteDatabase = new Map();
        this.regulationDatabase = new Map();
        
        this.initializeDatabase();
    }

    // Initialize comprehensive UK legal citation database
    initializeDatabase() {
        console.log('📚 Initializing JuriBank Educational Citation Database...');
        
        // Key UK Banking Statutes
        this.addStatute({
            id: 'fsma-2000',
            title: 'Financial Services and Markets Act 2000',
            chapter: 'c. 8',
            year: 2000,
            citation: 'FSMA 2000',
            url: 'https://www.legislation.gov.uk/ukpga/2000/8',
            summary: 'Primary legislation governing financial services regulation in the UK',
            key_sections: {
                '19': 'General prohibition on carrying on regulated activities',
                '138': 'Rule-making powers of the FCA and PRA',
                '397': 'Misleading statements and practices'
            }
        });

        this.addStatute({
            id: 'ba-2009',
            title: 'Banking Act 2009',
            chapter: 'c. 1',
            year: 2009,
            citation: 'Banking Act 2009',
            url: 'https://www.legislation.gov.uk/ukpga/2009/1',
            summary: 'Legislation establishing bank resolution regime and special resolution framework',
            key_sections: {
                '1': 'Special resolution regime objectives',
                '11': 'Stabilisation powers',
                '142': 'Bank insolvency procedure'
            }
        });

        // UK Banking Regulations
        this.addRegulation({
            id: 'mlr-2017',
            title: 'Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017',
            si_number: 'SI 2017/692',
            citation: 'MLR 2017',
            url: 'https://www.legislation.gov.uk/uksi/2017/692',
            summary: 'UK anti-money laundering regulations implementing EU 4th AML Directive',
            key_provisions: {
                'reg_19': 'Customer due diligence requirements',
                'reg_28': 'Enhanced due diligence',
                'reg_86': 'Suspicious activity reporting'
            }
        });

        // Key Banking Law Cases
        this.addCase({
            id: 'hedley-byrne-1964',
            name: 'Hedley Byrne & Co Ltd v Heller & Partners Ltd',
            citation: '[1964] AC 465',
            court: 'House of Lords',
            year: 1964,
            summary: 'Established duty of care for financial advice and negligent misstatement',
            relevance: 'Foundation case for financial advisory liability',
            key_principle: 'Duty of care in negligent misstatement for financial advice'
        });

        this.addCase({
            id: 'barings-1999',
            name: 'Barings plc (in liquidation) v Coopers & Lybrand',
            citation: '[2003] EWHC 1319 (Ch)',
            court: 'High Court',
            year: 2003,
            summary: 'Auditor liability in banking supervision context',
            relevance: 'Professional negligence in banking regulation',
            key_principle: 'Standard of care for professional advisors to banks'
        });

        // FCA Handbook References
        this.addRegulation({
            id: 'fca-cobs',
            title: 'Conduct of Business Sourcebook (COBS)',
            citation: 'FCA COBS',
            url: 'https://www.handbook.fca.org.uk/handbook/COBS/',
            summary: 'FCA rules on conduct of business for investment firms',
            key_provisions: {
                'COBS_2.1': 'Client categorisation',
                'COBS_9.2': 'Suitability assessment',
                'COBS_11.2': 'Best execution'
            }
        });

        console.log('✅ JuriBank legal citation database initialized with comprehensive UK banking law references');
    }

    // Add statute to database
    addStatute(statute) {
        this.statuteDatabase.set(statute.id, statute);
        this.citationDatabase.set(statute.citation.toLowerCase(), {
            type: 'statute',
            data: statute
        });
    }

    // Add regulation to database
    addRegulation(regulation) {
        this.regulationDatabase.set(regulation.id, regulation);
        this.citationDatabase.set(regulation.citation.toLowerCase(), {
            type: 'regulation',
            data: regulation
        });
    }

    // Add case to database
    addCase(case_data) {
        this.caseDatabase.set(case_data.id, case_data);
        this.citationDatabase.set(case_data.citation.toLowerCase(), {
            type: 'case',
            data: case_data
        });
        
        // Also index by case name
        this.citationDatabase.set(case_data.name.toLowerCase(), {
            type: 'case',
            data: case_data
        });
    }

    // Search for legal citations in text
    findCitations(text) {
        const citations = [];
        const lowerText = text.toLowerCase();
        
        // Search for exact matches in citation database
        for (const [citation, data] of this.citationDatabase) {
            if (lowerText.includes(citation)) {
                citations.push({
                    found_text: citation,
                    type: data.type,
                    citation_data: data.data,
                    confidence: 1.0
                });
            }
        }

        // Search for pattern-based citations
        const patterns = [
            // Case citations: [2023] EWCA Civ 123
            /\[(\d{4})\]\s+([A-Z]+)\s+([A-Za-z]+)\s+(\d+)/g,
            // Statute citations: c. 8
            /\bc\.\s*(\d+)/g,
            // SI citations: SI 2017/692
            /SI\s+(\d{4})\/(\d+)/g,
            // Section references: s. 19 FSMA 2000
            /s\.\s*(\d+)\s+([A-Z]+\s*\d+)/g
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                citations.push({
                    found_text: match[0],
                    type: 'pattern_match',
                    pattern: pattern.source,
                    confidence: 0.8
                });
            }
        });

        return this.deduplicateCitations(citations);
    }

    // Remove duplicate citations
    deduplicateCitations(citations) {
        const unique = new Map();
        
        citations.forEach(citation => {
            const key = citation.found_text.toLowerCase();
            if (!unique.has(key) || unique.get(key).confidence < citation.confidence) {
                unique.set(key, citation);
            }
        });
        
        return Array.from(unique.values());
    }

    // Generate formatted citation
    formatCitation(citation_data, style = 'oscola') {
        switch (citation_data.type) {
            case 'statute':
                return this.formatStatuteCitation(citation_data.data, style);
            case 'case':
                return this.formatCaseCitation(citation_data.data, style);
            case 'regulation':
                return this.formatRegulationCitation(citation_data.data, style);
            default:
                return citation_data.found_text;
        }
    }

    // Format statute citation (OSCOLA style)
    formatStatuteCitation(statute, style) {
        switch (style) {
            case 'oscola':
                return `${statute.title} ${statute.year}, ${statute.chapter}`;
            case 'full':
                return `${statute.title} ${statute.year} ${statute.chapter} (UK)`;
            default:
                return statute.citation;
        }
    }

    // Format case citation (OSCOLA style)
    formatCaseCitation(case_data, style) {
        switch (style) {
            case 'oscola':
                return `${case_data.name} ${case_data.citation}`;
            case 'full':
                return `${case_data.name} ${case_data.citation} (${case_data.court})`;
            default:
                return `${case_data.name} ${case_data.citation}`;
        }
    }

    // Format regulation citation
    formatRegulationCitation(regulation, style) {
        switch (style) {
            case 'oscola':
                return regulation.si_number ? 
                    `${regulation.title} ${regulation.si_number}` : 
                    regulation.citation;
            case 'full':
                return `${regulation.title} (${regulation.citation})`;
            default:
                return regulation.citation;
        }
    }

    // Validate citation accuracy
    validateCitation(citation_text) {
        const found = this.citationDatabase.get(citation_text.toLowerCase());
        
        if (found) {
            return {
                valid: true,
                type: found.type,
                data: found.data,
                confidence: 1.0
            };
        }

        // Pattern validation for unknown citations
        const patterns = {
            case_citation: /\[(\d{4})\]\s+[A-Z]+/,
            statute_chapter: /c\.\s*\d+/,
            si_citation: /SI\s+\d{4}\/\d+/
        };

        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(citation_text)) {
                return {
                    valid: true,
                    type: 'pattern_valid',
                    pattern_type: type,
                    confidence: 0.7
                };
            }
        }

        return {
            valid: false,
            reason: 'Citation format not recognized',
            confidence: 0.0
        };
    }

    // Generate citation suggestions
    suggestCitations(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();
        
        // Search through all databases
        for (const [key, data] of this.citationDatabase) {
            if (key.includes(lowerQuery) || 
                data.data.title?.toLowerCase().includes(lowerQuery) ||
                data.data.summary?.toLowerCase().includes(lowerQuery)) {
                
                suggestions.push({
                    citation: this.formatCitation(data),
                    type: data.type,
                    relevance: this.calculateRelevance(lowerQuery, data.data),
                    data: data.data
                });
            }
        }

        // Sort by relevance
        return suggestions.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
    }

    // Calculate relevance score
    calculateRelevance(query, data) {
        let score = 0;
        
        const fields = [
            data.title?.toLowerCase() || '',
            data.summary?.toLowerCase() || '',
            data.name?.toLowerCase() || '',
            Object.values(data.key_sections || {}).join(' ').toLowerCase(),
            Object.values(data.key_provisions || {}).join(' ').toLowerCase()
        ];

        fields.forEach(field => {
            if (field.includes(query)) {
                score += query.length / field.length;
            }
        });

        return score;
    }

    // Generate bibliography
    generateBibliography(citations, style = 'oscola') {
        const bibliography = {
            cases: [],
            statutes: [],
            regulations: [],
            secondary: []
        };

        citations.forEach(citation => {
            if (citation.citation_data) {
                const formatted = this.formatCitation(citation, style);
                
                switch (citation.type) {
                    case 'case':
                        bibliography.cases.push(formatted);
                        break;
                    case 'statute':
                        bibliography.statutes.push(formatted);
                        break;
                    case 'regulation':
                        bibliography.regulations.push(formatted);
                        break;
                    default:
                        bibliography.secondary.push(formatted);
                }
            }
        });

        // Sort each section alphabetically
        Object.keys(bibliography).forEach(key => {
            bibliography[key].sort();
        });

        return bibliography;
    }

    // Export citation data
    exportCitations(format = 'json') {
        const data = {
            statutes: Array.from(this.statuteDatabase.values()),
            cases: Array.from(this.caseDatabase.values()),
            regulations: Array.from(this.regulationDatabase.values()),
            generated: new Date().toISOString()
        };

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.citationsToCSV(data);
            default:
                return data;
        }
    }

    // Convert citations to CSV
    citationsToCSV(data) {
        const rows = [];
        rows.push(['Type', 'Citation', 'Title', 'Year', 'URL', 'Summary']);

        data.statutes.forEach(statute => {
            rows.push(['Statute', statute.citation, statute.title, statute.year, statute.url, statute.summary]);
        });

        data.cases.forEach(case_data => {
            rows.push(['Case', case_data.citation, case_data.name, case_data.year, '', case_data.summary]);
        });

        data.regulations.forEach(regulation => {
            rows.push(['Regulation', regulation.citation, regulation.title, '', regulation.url, regulation.summary]);
        });

        return rows.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }
}

// Export for use in main application
window.LegalCitationEngine = LegalCitationEngine;

// Initialize citation engine
const citationEngine = new LegalCitationEngine();

console.log('⚖️ UK Legal Citation Engine loaded');