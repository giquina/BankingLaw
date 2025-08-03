// Auto-Regulatory Monitoring System
// JuriBank - UK Banking Law Intelligence Platform

class AutoRegulatoryMonitoring {
    constructor() {
        this.monitoringSources = new Map();
        this.alertSubscribers = new Map();
        this.changeHistory = new Map();
        this.riskMatrix = new Map();
        this.automationRules = new Map();
        
        this.initializeMonitoringSources();
        this.setupAutomationRules();
    }

    // Initialize comprehensive monitoring sources
    initializeMonitoringSources() {
        console.log('🤖 Initializing JuriBank Auto-Regulatory Monitoring...');
        
        // PRA Monitoring Sources
        this.addMonitoringSource({
            id: 'pra-main',
            name: 'PRA Official Website',
            url: 'https://www.bankofengland.co.uk/prudential-regulation',
            type: 'regulatory_website',
            regulator: 'PRA',
            monitoring_frequency: 'hourly',
            selectors: {
                news: '.news-listing .news-item',
                consultations: '.consultation-listing .consultation-item',
                policy_statements: '.policy-listing .policy-item',
                rulebook_updates: '.rulebook-updates .update-item'
            },
            importance: 'critical',
            alert_threshold: 'immediate'
        });

        this.addMonitoringSource({
            id: 'pra-consultations',
            name: 'PRA Consultations',
            url: 'https://www.bankofengland.co.uk/prudential-regulation/publication',
            type: 'consultation_feed',
            regulator: 'PRA',
            monitoring_frequency: 'daily',
            importance: 'high',
            alert_threshold: 'same_day'
        });

        // FCA Monitoring Sources
        this.addMonitoringSource({
            id: 'fca-main',
            name: 'FCA Official Website',
            url: 'https://www.fca.org.uk',
            type: 'regulatory_website',
            regulator: 'FCA',
            monitoring_frequency: 'hourly',
            selectors: {
                news: '.news-updates .update-item',
                guidance: '.guidance-updates .guidance-item',
                consultations: '.consultation-papers .paper-item',
                policy_statements: '.policy-statements .statement-item'
            },
            importance: 'critical',
            alert_threshold: 'immediate'
        });

        this.addMonitoringSource({
            id: 'fca-handbook',
            name: 'FCA Handbook Updates',
            url: 'https://www.handbook.fca.org.uk/handbook/updates',
            type: 'handbook_updates',
            regulator: 'FCA',
            monitoring_frequency: 'hourly',
            importance: 'critical',
            alert_threshold: 'immediate'
        });

        // Bank of England Monitoring
        this.addMonitoringSource({
            id: 'boe-financial-stability',
            name: 'Bank of England Financial Stability',
            url: 'https://www.bankofengland.co.uk/financial-stability',
            type: 'stability_reports',
            regulator: 'BoE',
            monitoring_frequency: 'daily',
            importance: 'high',
            alert_threshold: 'same_day'
        });

        // Legislative Monitoring
        this.addMonitoringSource({
            id: 'uk-legislation',
            name: 'UK Legislation Updates',
            url: 'https://www.legislation.gov.uk/browse/uk-statutory-instruments/finance-and-tax',
            type: 'legislation_updates',
            regulator: 'Parliament',
            monitoring_frequency: 'daily',
            importance: 'high',
            alert_threshold: 'same_day'
        });

        // International Standards
        this.addMonitoringSource({
            id: 'basel-committee',
            name: 'Basel Committee Publications',
            url: 'https://www.bis.org/bcbs/publ/',
            type: 'international_standards',
            regulator: 'Basel Committee',
            monitoring_frequency: 'weekly',
            importance: 'medium',
            alert_threshold: 'weekly'
        });

        console.log('✅ Regulatory monitoring sources initialized');
    }

    // Add monitoring source
    addMonitoringSource(source) {
        source.last_checked = null;
        source.last_update = null;
        source.error_count = 0;
        source.status = 'active';
        
        this.monitoringSources.set(source.id, source);
    }

    // Setup automation rules
    setupAutomationRules() {
        console.log('⚙️ Setting up automation rules...');
        
        // High-priority immediate alerts
        this.addAutomationRule({
            id: 'capital-requirements-alert',
            name: 'Capital Requirements Changes',
            conditions: {
                keywords: ['capital requirements', 'CRR', 'CRD', 'basel', 'leverage ratio', 'buffer'],
                regulators: ['PRA', 'BoE'],
                importance: 'critical'
            },
            actions: {
                alert_level: 'critical',
                notification_delay: 0, // immediate
                escalation: ['senior_management', 'board'],
                auto_analysis: true
            }
        });

        this.addAutomationRule({
            id: 'consumer-duty-updates',
            name: 'Consumer Duty Updates',
            conditions: {
                keywords: ['consumer duty', 'consumer protection', 'treating customers fairly', 'product governance'],
                regulators: ['FCA'],
                importance: 'critical'
            },
            actions: {
                alert_level: 'high',
                notification_delay: 30, // 30 minutes
                escalation: ['compliance_team'],
                auto_analysis: true
            }
        });

        this.addAutomationRule({
            id: 'aml-regulation-changes',
            name: 'AML Regulation Changes',
            conditions: {
                keywords: ['money laundering', 'AML', 'suspicious activity', 'financial crime', 'sanctions'],
                regulators: ['FCA', 'HMRC', 'NCA'],
                importance: 'critical'
            },
            actions: {
                alert_level: 'critical',
                notification_delay: 0,
                escalation: ['mlro', 'compliance_team'],
                auto_analysis: true
            }
        });

        this.addAutomationRule({
            id: 'operational-resilience-updates',
            name: 'Operational Resilience Updates',
            conditions: {
                keywords: ['operational resilience', 'business continuity', 'outsourcing', 'third party', 'cyber'],
                regulators: ['PRA', 'FCA'],
                importance: 'high'
            },
            actions: {
                alert_level: 'medium',
                notification_delay: 60, // 1 hour
                escalation: ['risk_team'],
                auto_analysis: true
            }
        });

        console.log('✅ JuriBank automation rules configured');
    }

    // Add automation rule
    addAutomationRule(rule) {
        this.automationRules.set(rule.id, rule);
    }

    // Start monitoring process
    startMonitoring() {
        console.log('🚀 Starting auto-regulatory monitoring...');
        
        // Start monitoring each source based on its frequency
        this.monitoringSources.forEach(source => {
            this.scheduleSourceMonitoring(source);
        });
        
        // Start cleanup process (runs daily)
        this.scheduleCleanup();
        
        console.log('✅ Auto-monitoring started for all sources');
    }

    // Schedule monitoring for a specific source
    scheduleSourceMonitoring(source) {
        const intervals = {
            'hourly': 60 * 60 * 1000,      // 1 hour
            'daily': 24 * 60 * 60 * 1000,  // 24 hours
            'weekly': 7 * 24 * 60 * 60 * 1000 // 7 days
        };
        
        const interval = intervals[source.monitoring_frequency] || intervals['daily'];
        
        setInterval(() => {
            this.checkSource(source.id);
        }, interval);
        
        // Initial check
        setTimeout(() => {
            this.checkSource(source.id);
        }, 1000);
    }

    // Check specific monitoring source
    async checkSource(sourceId) {
        const source = this.monitoringSources.get(sourceId);
        if (!source || source.status !== 'active') return;

        try {
            console.log(`🔍 Checking ${source.name}...`);
            
            source.last_checked = new Date().toISOString();
            
            // In a real implementation, this would use web scraping or APIs
            const changes = await this.detectChanges(source);
            
            if (changes.length > 0) {
                console.log(`📢 Found ${changes.length} changes from ${source.name}`);
                await this.processChanges(source, changes);
                source.last_update = new Date().toISOString();
            }
            
            source.error_count = 0;
            
        } catch (error) {
            console.error(`❌ Error checking ${source.name}:`, error);
            source.error_count++;
            
            if (source.error_count >= 5) {
                source.status = 'error';
                this.notifyMonitoringError(source, error);
            }
        }
    }

    // Simulate change detection (in real implementation would scrape/API call)
    async detectChanges(source) {
        // Simulate finding regulatory changes
        const simulatedChanges = [];
        
        // Randomly simulate finding changes for demonstration
        if (Math.random() < 0.1) { // 10% chance of finding changes
            const changeTypes = [
                {
                    type: 'consultation',
                    title: 'PRA Consultation on Enhanced Capital Requirements',
                    url: `${source.url}/consultation-2024-01`,
                    summary: 'PRA proposes enhancements to capital requirements for systemic banks',
                    keywords: ['capital requirements', 'systemic banks', 'PRA'],
                    impact: 'high',
                    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    type: 'policy_statement',
                    title: 'FCA Policy Statement on Consumer Duty Implementation',
                    url: `${source.url}/policy-statement-2024-02`,
                    summary: 'Final guidance on Consumer Duty outcome measurement',
                    keywords: ['consumer duty', 'outcome measurement', 'FCA'],
                    impact: 'critical',
                    effective_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    type: 'rulebook_update',
                    title: 'Updates to PRA Rulebook Chapter on Operational Resilience',
                    url: `${source.url}/rulebook-update-2024-03`,
                    summary: 'Enhanced requirements for business continuity planning',
                    keywords: ['operational resilience', 'business continuity', 'PRA'],
                    impact: 'medium',
                    effective_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];
            
            // Return a random change
            simulatedChanges.push(changeTypes[Math.floor(Math.random() * changeTypes.length)]);
        }
        
        return simulatedChanges;
    }

    // Process detected changes
    async processChanges(source, changes) {
        for (const change of changes) {
            // Store change in history
            const changeRecord = {
                id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                source_id: source.id,
                source_name: source.name,
                regulator: source.regulator,
                detected_at: new Date().toISOString(),
                ...change
            };
            
            this.storeChange(changeRecord);
            
            // Check automation rules
            const triggeringRules = this.checkAutomationRules(changeRecord);
            
            // Execute triggered rules
            for (const rule of triggeringRules) {
                await this.executeAutomationRule(rule, changeRecord);
            }
            
            // Analyze impact
            const impactAnalysis = await this.analyzeImpact(changeRecord);
            changeRecord.impact_analysis = impactAnalysis;
            
            // Generate alerts
            await this.generateAlerts(changeRecord, triggeringRules);
        }
    }

    // Store change in history
    storeChange(changeRecord) {
        if (!this.changeHistory.has(changeRecord.source_id)) {
            this.changeHistory.set(changeRecord.source_id, []);
        }
        
        this.changeHistory.get(changeRecord.source_id).push(changeRecord);
        
        // Maintain history limit (keep last 1000 per source)
        const history = this.changeHistory.get(changeRecord.source_id);
        if (history.length > 1000) {
            history.splice(0, history.length - 1000);
        }
    }

    // Check which automation rules are triggered
    checkAutomationRules(changeRecord) {
        const triggeredRules = [];
        
        this.automationRules.forEach(rule => {
            let triggered = false;
            
            // Check keyword conditions
            if (rule.conditions.keywords) {
                const changeText = `${changeRecord.title} ${changeRecord.summary}`.toLowerCase();
                triggered = rule.conditions.keywords.some(keyword => 
                    changeText.includes(keyword.toLowerCase())
                );
            }
            
            // Check regulator conditions
            if (triggered && rule.conditions.regulators) {
                triggered = rule.conditions.regulators.includes(changeRecord.regulator);
            }
            
            // Check importance conditions
            if (triggered && rule.conditions.importance) {
                triggered = changeRecord.impact === rule.conditions.importance;
            }
            
            if (triggered) {
                triggeredRules.push(rule);
            }
        });
        
        return triggeredRules;
    }

    // Execute automation rule
    async executeAutomationRule(rule, changeRecord) {
        console.log(`⚡ Executing rule: ${rule.name} for change: ${changeRecord.title}`);
        
        // Apply notification delay
        if (rule.actions.notification_delay > 0) {
            setTimeout(() => {
                this.sendRuleNotifications(rule, changeRecord);
            }, rule.actions.notification_delay * 60 * 1000);
        } else {
            await this.sendRuleNotifications(rule, changeRecord);
        }
        
        // Trigger escalation if configured
        if (rule.actions.escalation) {
            await this.triggerEscalation(rule.actions.escalation, changeRecord);
        }
        
        // Perform auto-analysis if enabled
        if (rule.actions.auto_analysis) {
            await this.performAutoAnalysis(changeRecord);
        }
    }

    // Send rule-based notifications
    async sendRuleNotifications(rule, changeRecord) {
        const notification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'automation_rule',
            rule_name: rule.name,
            alert_level: rule.actions.alert_level,
            change: changeRecord,
            generated_at: new Date().toISOString()
        };
        
        // Send to all subscribers of this alert level
        this.notifySubscribers(notification);
    }

    // Analyze regulatory change impact
    async analyzeImpact(changeRecord) {
        // In real implementation, this would use AI/ML for impact analysis
        const analysis = {
            business_impact: this.assessBusinessImpact(changeRecord),
            compliance_impact: this.assessComplianceImpact(changeRecord),
            timeline: this.assessTimeline(changeRecord),
            cost_estimate: this.estimateCosts(changeRecord),
            recommended_actions: this.recommendActions(changeRecord)
        };
        
        return analysis;
    }

    // Assess business impact
    assessBusinessImpact(changeRecord) {
        const impactLevels = {
            'critical': 'High - Significant operational changes required',
            'high': 'Medium-High - Notable operational adjustments needed',
            'medium': 'Medium - Some operational modifications required',
            'low': 'Low - Minimal operational impact expected'
        };
        
        return {
            level: changeRecord.impact,
            description: impactLevels[changeRecord.impact] || 'Unknown impact level',
            affected_areas: this.identifyAffectedAreas(changeRecord),
            urgency: this.calculateUrgency(changeRecord)
        };
    }

    // Identify affected business areas
    identifyAffectedAreas(changeRecord) {
        const areas = [];
        const keywords = changeRecord.keywords || [];
        
        if (keywords.some(k => ['capital', 'leverage', 'buffer'].includes(k))) {
            areas.push('Capital Management', 'Finance', 'Risk Management');
        }
        
        if (keywords.some(k => ['consumer', 'customer', 'duty'].includes(k))) {
            areas.push('Customer Operations', 'Compliance', 'Product Development');
        }
        
        if (keywords.some(k => ['aml', 'laundering', 'sanctions'].includes(k))) {
            areas.push('AML/Financial Crime', 'Compliance', 'Operations');
        }
        
        if (keywords.some(k => ['operational', 'resilience', 'continuity'].includes(k))) {
            areas.push('IT Operations', 'Business Continuity', 'Risk Management');
        }
        
        return areas.length > 0 ? areas : ['General Compliance'];
    }

    // Generate alerts for changes
    async generateAlerts(changeRecord, triggeringRules) {
        const alert = {
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'regulatory_change',
            priority: this.calculateAlertPriority(changeRecord, triggeringRules),
            title: `New Regulatory Change: ${changeRecord.title}`,
            summary: changeRecord.summary,
            regulator: changeRecord.regulator,
            change_type: changeRecord.type,
            impact_level: changeRecord.impact,
            effective_date: changeRecord.effective_date,
            consultation_deadline: changeRecord.deadline,
            source_url: changeRecord.url,
            detected_at: changeRecord.detected_at,
            triggered_rules: triggeringRules.map(r => r.name),
            recommended_actions: changeRecord.impact_analysis?.recommended_actions || []
        };
        
        // Send alert to subscribers
        this.notifySubscribers(alert);
        
        return alert;
    }

    // Calculate alert priority
    calculateAlertPriority(changeRecord, triggeringRules) {
        if (triggeringRules.some(r => r.actions.alert_level === 'critical')) {
            return 'critical';
        } else if (triggeringRules.some(r => r.actions.alert_level === 'high')) {
            return 'high';
        } else if (changeRecord.impact === 'critical') {
            return 'high';
        } else if (changeRecord.impact === 'high') {
            return 'medium';
        } else {
            return 'low';
        }
    }

    // Subscribe to alerts
    subscribe(subscriberId, preferences) {
        this.alertSubscribers.set(subscriberId, {
            ...preferences,
            subscribed_at: new Date().toISOString(),
            last_notification: null
        });
    }

    // Notify subscribers
    notifySubscribers(alert) {
        this.alertSubscribers.forEach((preferences, subscriberId) => {
            // Check if subscriber wants this type of alert
            if (this.shouldNotifySubscriber(preferences, alert)) {
                this.sendNotification(subscriberId, alert, preferences);
            }
        });
    }

    // Check if subscriber should receive alert
    shouldNotifySubscriber(preferences, alert) {
        // Check priority threshold
        const priorityLevels = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
        const alertPriority = priorityLevels[alert.priority] || 1;
        const subscriberThreshold = priorityLevels[preferences.min_priority] || 1;
        
        if (alertPriority < subscriberThreshold) return false;
        
        // Check regulator filter
        if (preferences.regulators && !preferences.regulators.includes(alert.regulator)) {
            return false;
        }
        
        // Check topic filter
        if (preferences.topics) {
            const alertKeywords = alert.summary?.toLowerCase() || '';
            const hasMatchingTopic = preferences.topics.some(topic => 
                alertKeywords.includes(topic.toLowerCase())
            );
            if (!hasMatchingTopic) return false;
        }
        
        return true;
    }

    // Send notification to subscriber
    sendNotification(subscriberId, alert, preferences) {
        console.log(`📧 Sending ${alert.priority} alert to ${subscriberId}: ${alert.title}`);
        
        const notification = {
            subscriber_id: subscriberId,
            alert: alert,
            delivery_method: preferences.delivery_method || 'email',
            sent_at: new Date().toISOString()
        };
        
        // Update last notification time
        preferences.last_notification = notification.sent_at;
        
        // In real implementation, would send via email, SMS, webhook, etc.
        this.deliverNotification(notification);
    }

    // Deliver notification via specified method
    deliverNotification(notification) {
        switch (notification.delivery_method) {
            case 'email':
                this.sendEmailNotification(notification);
                break;
            case 'webhook':
                this.sendWebhookNotification(notification);
                break;
            case 'sms':
                this.sendSMSNotification(notification);
                break;
            default:
                console.log('📱 In-app notification:', notification.alert.title);
        }
    }

    // Get monitoring status
    getMonitoringStatus() {
        const status = {
            sources: Array.from(this.monitoringSources.values()).map(source => ({
                id: source.id,
                name: source.name,
                regulator: source.regulator,
                status: source.status,
                last_checked: source.last_checked,
                last_update: source.last_update,
                error_count: source.error_count
            })),
            subscribers: this.alertSubscribers.size,
            total_changes: Array.from(this.changeHistory.values())
                .reduce((total, history) => total + history.length, 0),
            active_rules: this.automationRules.size
        };
        
        return status;
    }

    // Get recent changes
    getRecentChanges(hours = 24) {
        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
        const recentChanges = [];
        
        this.changeHistory.forEach(history => {
            const recent = history.filter(change => 
                new Date(change.detected_at) >= cutoff
            );
            recentChanges.push(...recent);
        });
        
        return recentChanges.sort((a, b) => 
            new Date(b.detected_at) - new Date(a.detected_at)
        );
    }

    // Get monitoring analytics
    getAnalytics(period = 'week') {
        const periodMs = {
            'day': 24 * 60 * 60 * 1000,
            'week': 7 * 24 * 60 * 60 * 1000,
            'month': 30 * 24 * 60 * 60 * 1000
        };
        
        const cutoff = new Date(Date.now() - (periodMs[period] || periodMs['week']));
        const analytics = {
            period: period,
            changes_detected: 0,
            alerts_generated: 0,
            by_regulator: {},
            by_impact: {},
            by_type: {},
            top_keywords: new Map()
        };
        
        this.changeHistory.forEach(history => {
            history.forEach(change => {
                if (new Date(change.detected_at) >= cutoff) {
                    analytics.changes_detected++;
                    
                    // Count by regulator
                    analytics.by_regulator[change.regulator] = 
                        (analytics.by_regulator[change.regulator] || 0) + 1;
                    
                    // Count by impact
                    analytics.by_impact[change.impact] = 
                        (analytics.by_impact[change.impact] || 0) + 1;
                    
                    // Count by type
                    analytics.by_type[change.type] = 
                        (analytics.by_type[change.type] || 0) + 1;
                    
                    // Count keywords
                    change.keywords?.forEach(keyword => {
                        analytics.top_keywords.set(keyword, 
                            (analytics.top_keywords.get(keyword) || 0) + 1
                        );
                    });
                }
            });
        });
        
        // Convert top keywords to array
        analytics.top_keywords = Array.from(analytics.top_keywords.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        return analytics;
    }

    // Schedule cleanup of old data
    scheduleCleanup() {
        setInterval(() => {
            this.cleanupOldData();
        }, 24 * 60 * 60 * 1000); // Daily cleanup
    }

    // Cleanup old monitoring data
    cleanupOldData() {
        const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days
        
        this.changeHistory.forEach((history, sourceId) => {
            const filtered = history.filter(change => 
                new Date(change.detected_at) >= cutoff
            );
            this.changeHistory.set(sourceId, filtered);
        });
        
        console.log('🧹 Cleaned up old monitoring data');
    }
}

// Export for use in main application
window.AutoRegulatoryMonitoring = AutoRegulatoryMonitoring;

// Initialize auto-monitoring system
const autoMonitoring = new AutoRegulatoryMonitoring();

console.log('🤖 Auto-Regulatory Monitoring System loaded');