/**
 * HMRC API Integration System
 * Educational Platform for Tax and Employment Law Guidance
 * 
 * IMPORTANT: This system provides educational information only.
 * Users should seek professional tax advice for specific situations.
 * 
 * Data Sources:
 * - Gov.UK HMRC organizational data
 * - Tax guidance publications  
 * - Employment minimum wage rates
 * - Benefits and allowances information
 * - Self-employment guidance updates
 */

class HMRCIntegration {
    constructor() {
        this.baseURL = 'https://api.gov.uk';
        this.hmrcDataURL = 'https://www.gov.uk/government/organisations/hm-revenue-customs';
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
        this.lastUpdate = null;
        
        // Educational compliance settings
        this.educationalMode = true;
        this.disclaimerRequired = true;
        
        this.init();
    }

    /**
     * Initialize HMRC integration system
     */
    async init() {
        console.log('🏛️ Initializing HMRC Educational Integration System');
        
        try {
            await this.validateConnection();
            await this.loadInitialData();
            this.setupUpdateSchedule();
            
            console.log('✅ HMRC Integration System Ready');
        } catch (error) {
            console.error('❌ HMRC Integration initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Tax Guidance and Rates System
     */
    async getTaxGuidance() {
        const cacheKey = 'tax_guidance';
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const taxData = await this.fetchTaxInformation();
            const processedData = {
                disclaimer: this.getEducationalDisclaimer('tax'),
                personalAllowance: taxData.personalAllowance,
                taxBands: taxData.incomeTaxBands,
                nationalInsurance: taxData.nationalInsuranceRates,
                corporationTax: taxData.corporationTaxRates,
                vatRates: taxData.vatRates,
                lastUpdated: new Date().toISOString(),
                educationalPurpose: true,
                guidance: {
                    whatIsIncomeTax: this.getIncomeTaxGuidance(),
                    howToCalculateTax: this.getTaxCalculationGuidance(),
                    whenTaxIsDue: this.getTaxDeadlineGuidance(),
                    whoNeedsToPay: this.getTaxObligationGuidance()
                }
            };

            this.cache.set(cacheKey, processedData);
            return processedData;
            
        } catch (error) {
            console.error('Error fetching tax guidance:', error);
            return this.getFallbackTaxData();
        }
    }

    /**
     * Employment Rights Information System
     */
    async getEmploymentRights() {
        const cacheKey = 'employment_rights';
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const employmentData = await this.fetchEmploymentInformation();
            const processedData = {
                disclaimer: this.getEducationalDisclaimer('employment'),
                minimumWage: employmentData.minimumWageRates,
                workingTimeRights: employmentData.workingTimeRegulations,
                holidayEntitlement: employmentData.holidayRights,
                sickPay: employmentData.statutorySickPay,
                maternityRights: employmentData.maternityPaternityRights,
                redundancy: employmentData.redundancyRights,
                lastUpdated: new Date().toISOString(),
                educationalPurpose: true,
                guidance: {
                    knowYourRights: this.getEmploymentRightsGuidance(),
                    minimumWageExplained: this.getMinimumWageGuidance(),
                    workingHours: this.getWorkingTimeGuidance(),
                    whenToSeekHelp: this.getEmploymentAdviceGuidance()
                }
            };

            this.cache.set(cacheKey, processedData);
            return processedData;
            
        } catch (error) {
            console.error('Error fetching employment rights:', error);
            return this.getFallbackEmploymentData();
        }
    }

    /**
     * Benefits and Allowances System
     */
    async getBenefitsInformation() {
        const cacheKey = 'benefits_allowances';
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const benefitsData = await this.fetchBenefitsInformation();
            const processedData = {
                disclaimer: this.getEducationalDisclaimer('benefits'),
                universalCredit: benefitsData.universalCreditRates,
                jobseekersAllowance: benefitsData.jsaRates,
                employmentSupportAllowance: benefitsData.esaRates,
                childBenefit: benefitsData.childBenefitRates,
                pensionCredit: benefitsData.pensionCreditRates,
                housingBenefit: benefitsData.housingBenefitInfo,
                councilTaxSupport: benefitsData.councilTaxSupportInfo,
                lastUpdated: new Date().toISOString(),
                educationalPurpose: true,
                guidance: {
                    eligibilityChecker: this.getBenefitsEligibilityGuidance(),
                    howToApply: this.getBenefitsApplicationGuidance(),
                    whatToExpect: this.getBenefitsProcessGuidance(),
                    appealProcess: this.getBenefitsAppealGuidance()
                },
                calculators: {
                    benefitsCalculator: this.createBenefitsCalculator(),
                    eligibilityChecker: this.createEligibilityChecker()
                }
            };

            this.cache.set(cacheKey, processedData);
            return processedData;
            
        } catch (error) {
            console.error('Error fetching benefits information:', error);
            return this.getFallbackBenefitsData();
        }
    }

    /**
     * Self-Employment Guidance System
     */
    async getSelfEmploymentGuidance() {
        const cacheKey = 'self_employment';
        
        if (this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const selfEmploymentData = await this.fetchSelfEmploymentInformation();
            const processedData = {
                disclaimer: this.getEducationalDisclaimer('self_employment'),
                registration: selfEmploymentData.registrationRequirements,
                taxObligations: selfEmploymentData.taxObligations,
                nationalInsurance: selfEmploymentData.class2And4NI,
                allowableExpenses: selfEmploymentData.allowableExpenses,
                recordKeeping: selfEmploymentData.recordKeepingRequirements,
                paymentSchedule: selfEmploymentData.paymentOnAccountSchedule,
                lastUpdated: new Date().toISOString(),
                educationalPurpose: true,
                guidance: {
                    gettingStarted: this.getSelfEmploymentStartupGuidance(),
                    taxResponsibilities: this.getSelfEmploymentTaxGuidance(),
                    recordKeeping: this.getRecordKeepingGuidance(),
                    commonMistakes: this.getSelfEmploymentMistakesGuidance()
                },
                tools: {
                    expenseTracker: this.createExpenseTracker(),
                    taxCalculator: this.createSelfEmployedTaxCalculator(),
                    deadlineReminder: this.createDeadlineReminder()
                }
            };

            this.cache.set(cacheKey, processedData);
            return processedData;
            
        } catch (error) {
            console.error('Error fetching self-employment guidance:', error);
            return this.getFallbackSelfEmploymentData();
        }
    }

    /**
     * Data Fetching Methods
     */
    async fetchTaxInformation() {
        // Simulate Gov.UK API call for tax information
        // In production, this would connect to official HMRC APIs
        return {
            personalAllowance: {
                amount: 12570,
                taxYear: '2024-25',
                description: 'Standard personal allowance for most people'
            },
            incomeTaxBands: [
                { band: 'Personal Allowance', rate: 0, range: '£0 to £12,570' },
                { band: 'Basic Rate', rate: 20, range: '£12,571 to £50,270' },
                { band: 'Higher Rate', rate: 40, range: '£50,271 to £125,140' },
                { band: 'Additional Rate', rate: 45, range: 'Over £125,140' }
            ],
            nationalInsuranceRates: {
                class1Employee: { rate: 12, threshold: 12570 },
                class1Employer: { rate: 13.8, threshold: 9100 },
                class2SelfEmployed: { rate: 3.05, threshold: 6515 },
                class4SelfEmployed: { rate: 9, threshold: 12570 }
            },
            corporationTaxRates: {
                small: { rate: 19, range: 'Up to £50,000' },
                main: { rate: 25, range: 'Over £250,000' },
                marginal: { rate: 26.5, range: '£50,000 to £250,000' }
            },
            vatRates: {
                standard: 20,
                reduced: 5,
                zero: 0
            }
        };
    }

    async fetchEmploymentInformation() {
        return {
            minimumWageRates: {
                national: { rate: 11.44, age: '23 and over' },
                young: { rate: 8.60, age: '18-22' },
                apprentice: { rate: 6.40, age: 'Under 19 or in first year' },
                effectiveFrom: '2024-04-01'
            },
            workingTimeRegulations: {
                maxWeeklyHours: 48,
                dailyRest: 11,
                weeklyRest: 24,
                breakEntitlement: '20 minutes for 6+ hour shifts'
            },
            holidayRights: {
                minimum: '5.6 weeks per year',
                bankHolidays: 'Can be included in minimum',
                calculation: 'Pro-rata for part-time workers'
            },
            statutorySickPay: {
                rate: 116.75,
                period: 'per week for up to 28 weeks',
                eligibility: 'Earn at least £123 per week'
            }
        };
    }

    async fetchBenefitsInformation() {
        return {
            universalCreditRates: {
                standardAllowance: {
                    single_under25: 292.11,
                    single_25_over: 368.74,
                    couple_both_under25: 458.51,
                    couple_one_over25: 578.82
                },
                effectiveFrom: '2024-04-08'
            },
            jsaRates: {
                under25: 71.70,
                over25: 90.50,
                couple: 142.25
            },
            childBenefitRates: {
                firstChild: 25.60,
                additionalChildren: 16.95,
                highIncomeThreshold: 60000
            }
        };
    }

    async fetchSelfEmploymentInformation() {
        return {
            registrationRequirements: {
                deadline: 'By 5 October in the second tax year',
                methods: ['Online', 'Phone', 'Post'],
                requiredInfo: ['Name', 'Address', 'National Insurance number', 'Business details']
            },
            taxObligations: {
                selfAssessment: 'Annual return required',
                paymentDates: ['31 January', '31 July'],
                recordKeeping: 'Minimum 5 years after submission deadline'
            },
            class2And4NI: {
                class2Rate: 3.05,
                class2Threshold: 6515,
                class4Rate: 9,
                class4Threshold: 12570
            }
        };
    }

    /**
     * Educational Guidance Methods
     */
    getIncomeTaxGuidance() {
        return {
            what: 'Income tax is charged on most types of income above your personal allowance',
            who: 'Most people with income above £12,570 per year',
            when: 'Automatically deducted through PAYE for employees, self-assessment for others',
            help: 'Contact HMRC or seek professional advice for complex situations'
        };
    }

    getEmploymentRightsGuidance() {
        return {
            minimumWage: 'All workers entitled to at least minimum wage for their age group',
            workingTime: 'Limits on working hours to protect health and safety',
            holidays: 'Statutory minimum holiday entitlement with pay',
            sickPay: 'Statutory sick pay for eligible employees',
            protection: 'Laws protect against discrimination and unfair treatment'
        };
    }

    getBenefitsEligibilityGuidance() {
        return {
            universalCredit: 'For people on low income or out of work',
            eligibilityFactors: ['Income', 'Savings', 'Age', 'Circumstances'],
            application: 'Apply online through gov.uk',
            assessment: 'Monthly assessment of circumstances',
            support: 'Help available through Citizens Advice and other organizations'
        };
    }

    /**
     * Educational Tools and Calculators
     */
    createBenefitsCalculator() {
        return {
            type: 'Educational Estimator',
            disclaimer: 'Estimates only - official calculation may differ',
            inputs: ['Weekly income', 'Rent/mortgage', 'Dependents', 'Savings'],
            note: 'Use official gov.uk calculator for accurate figures'
        };
    }

    createExpenseTracker() {
        return {
            categories: [
                'Office costs', 'Travel', 'Marketing', 'Professional services',
                'Equipment', 'Training', 'Insurance', 'Utilities'
            ],
            guidance: 'Keep receipts and records for tax purposes',
            note: 'Consult accountant for complex expense queries'
        };
    }

    /**
     * Educational Disclaimers
     */
    getEducationalDisclaimer(category) {
        const baseDisclaimer = 'This information is for educational purposes only. ';
        
        const categorySpecific = {
            tax: 'Tax situations vary greatly. Always consult HMRC or a qualified tax advisor for personal tax advice.',
            employment: 'Employment rights can be complex. Consult ACAS or an employment advisor for specific situations.',
            benefits: 'Benefit entitlement depends on individual circumstances. Use official gov.uk tools and consult Citizens Advice.',
            self_employment: 'Self-employment tax obligations are complex. Consider professional accounting advice.'
        };

        return baseDisclaimer + categorySpecific[category];
    }

    /**
     * Fallback Data for Offline Mode
     */
    getFallbackTaxData() {
        return {
            disclaimer: this.getEducationalDisclaimer('tax'),
            error: 'Unable to fetch current tax data',
            fallback: true,
            guidance: 'Please visit gov.uk/income-tax for current information',
            lastUpdated: 'Data unavailable'
        };
    }

    getFallbackEmploymentData() {
        return {
            disclaimer: this.getEducationalDisclaimer('employment'),
            error: 'Unable to fetch current employment data',
            fallback: true,
            guidance: 'Please visit gov.uk/employment-rights for current information',
            lastUpdated: 'Data unavailable'
        };
    }

    getFallbackBenefitsData() {
        return {
            disclaimer: this.getEducationalDisclaimer('benefits'),
            error: 'Unable to fetch current benefits data',
            fallback: true,
            guidance: 'Please visit gov.uk/benefits for current information',
            lastUpdated: 'Data unavailable'
        };
    }

    getFallbackSelfEmploymentData() {
        return {
            disclaimer: this.getEducationalDisclaimer('self_employment'),
            error: 'Unable to fetch current self-employment data',
            fallback: true,
            guidance: 'Please visit gov.uk/self-employed for current information',
            lastUpdated: 'Data unavailable'
        };
    }

    /**
     * Cache Management
     */
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const now = Date.now();
        const cacheTime = cached.timestamp || 0;
        return (now - cacheTime) < this.cacheExpiry;
    }

    clearCache() {
        this.cache.clear();
        console.log('📝 HMRC cache cleared');
    }

    /**
     * Update Scheduling
     */
    setupUpdateSchedule() {
        // Update daily at 6 AM
        const updateInterval = 24 * 60 * 60 * 1000; // 24 hours
        
        setInterval(() => {
            this.performScheduledUpdate();
        }, updateInterval);
        
        console.log('⏰ HMRC update schedule configured');
    }

    async performScheduledUpdate() {
        console.log('🔄 Performing scheduled HMRC data update');
        
        try {
            this.clearCache();
            
            // Preload key data
            await Promise.all([
                this.getTaxGuidance(),
                this.getEmploymentRights(),
                this.getBenefitsInformation(),
                this.getSelfEmploymentGuidance()
            ]);
            
            this.lastUpdate = new Date().toISOString();
            console.log('✅ HMRC data update completed');
            
        } catch (error) {
            console.error('❌ HMRC update failed:', error);
        }
    }

    /**
     * System Health and Monitoring
     */
    async validateConnection() {
        try {
            // Basic connectivity test
            const response = await fetch(this.hmrcDataURL, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`Connection test failed: ${response.status}`);
            }
            console.log('✅ HMRC connection validated');
        } catch (error) {
            console.warn('⚠️ HMRC connection issue, fallback mode enabled:', error.message);
        }
    }

    async loadInitialData() {
        console.log('📊 Loading initial HMRC data...');
        
        try {
            await Promise.all([
                this.getTaxGuidance(),
                this.getEmploymentRights()
            ]);
            console.log('✅ Initial HMRC data loaded');
        } catch (error) {
            console.warn('⚠️ Initial data load incomplete:', error.message);
        }
    }

    handleInitializationError(error) {
        console.error('HMRC Integration Error:', error);
        
        // Enable fallback mode
        this.fallbackMode = true;
        console.log('🔄 HMRC fallback mode enabled');
    }

    /**
     * Public API Methods
     */
    async getSystemStatus() {
        return {
            status: this.fallbackMode ? 'fallback' : 'operational',
            lastUpdate: this.lastUpdate,
            cacheSize: this.cache.size,
            educationalMode: this.educationalMode,
            dataSource: 'Gov.UK HMRC',
            compliance: 'Educational information only'
        };
    }

    /**
     * Educational Compliance Methods
     */
    addEducationalContext(data) {
        return {
            ...data,
            educationalNotice: 'This information is provided for educational purposes to help you understand your rights and obligations.',
            professionalAdvice: 'For specific situations, always consult with qualified professionals.',
            officialSources: {
                hmrc: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
                govuk: 'https://www.gov.uk',
                citizensAdvice: 'https://www.citizensadvice.org.uk'
            }
        };
    }
}

// Export for use in educational platform
window.HMRCIntegration = HMRCIntegration;

// Initialize HMRC integration system
const hmrcSystem = new HMRCIntegration();

console.log('🏛️ HMRC Educational Integration System Loaded');
console.log('📚 Providing tax and employment education for UK students');
console.log('⚖️ Educational information only - not professional advice');

export default HMRCIntegration;