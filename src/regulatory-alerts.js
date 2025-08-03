// Regulatory Change Alerts System
// JuriBank - UK Banking Law Intelligence Platform

class RegulatoryAlertsSystem {
    constructor() {
        this.alertQueue = new Map();
        this.alertHistory = new Map();
        this.alertTemplates = new Map();
        this.escalationRules = new Map();
        this.distributionLists = new Map();
        this.alertMetrics = new Map();
        
        this.initializeAlertSystem();
    }

    // Initialize comprehensive alert system
    initializeAlertSystem() {
        console.log('🚨 Initializing JuriBank Regulatory Alerts System...');
        
        this.setupAlertTemplates();
        this.setupEscalationRules();
        this.setupDistributionLists();
        this.startAlertProcessor();
        
        console.log('✅ JuriBank regulatory alerts system initialized');
    }

    // Setup alert templates
    setupAlertTemplates() {
        // Critical Capital Requirements Alert
        this.addAlertTemplate({
            id: 'critical-capital-alert',
            name: 'Critical Capital Requirements Alert',
            priority: 'critical',
            template: `
                🚨 CRITICAL REGULATORY ALERT 🚨
                
                Subject: Urgent Action Required - {{regulator}} Capital Requirements Update
                
                Dear {{recipient_name}},
                
                A critical regulatory change has been detected that requires immediate attention:
                
                📋 CHANGE DETAILS:
                • Regulator: {{regulator}}
                • Type: {{change_type}}
                • Title: {{title}}
                • Impact Level: {{impact_level}}
                • Effective Date: {{effective_date}}
                
                📊 IMPACT ASSESSMENT:
                {{impact_assessment}}
                
                ⚡ IMMEDIATE ACTIONS REQUIRED:
                {{immediate_actions}}
                
                🔗 Source: {{source_url}}
                
                This alert was automatically generated based on your notification preferences.
                Please acknowledge receipt and take appropriate action immediately.
                
                Best regards,
                Banking Law Intelligence System
            `,
            channels: ['email', 'sms', 'in-app', 'webhook'],
            auto_escalate: true,
            escalation_time: 30, // minutes
            requires_acknowledgment: true
        });

        // High Priority Consumer Duty Alert
        this.addAlertTemplate({
            id: 'consumer-duty-alert',
            name: 'Consumer Duty Update Alert',
            priority: 'high',
            template: `
                ⚠️ HIGH PRIORITY ALERT ⚠️
                
                Subject: Consumer Duty Update - {{title}}
                
                Dear {{recipient_name}},
                
                An important Consumer Duty update has been published:
                
                📋 UPDATE DETAILS:
                • Regulator: {{regulator}}
                • Publication Date: {{publication_date}}
                • Effective Date: {{effective_date}}
                • Consultation Deadline: {{consultation_deadline}}
                
                📄 SUMMARY:
                {{summary}}
                
                🎯 AFFECTED AREAS:
                {{affected_areas}}
                
                📅 RECOMMENDED ACTIONS:
                {{recommended_actions}}
                
                🔗 Full Details: {{source_url}}
                
                Please review and assess the impact on your organization's Consumer Duty implementation.
                
                Banking Law Intelligence System
            `,
            channels: ['email', 'in-app'],
            auto_escalate: false,
            requires_acknowledgment: false
        });

        // AML/Financial Crime Alert
        this.addAlertTemplate({
            id: 'aml-alert',
            name: 'AML/Financial Crime Alert',
            priority: 'critical',
            template: `
                🛡️ FINANCIAL CRIME ALERT 🛡️
                
                Subject: Urgent - AML/Financial Crime Regulatory Update
                
                Dear {{recipient_name}},
                
                A critical AML/Financial Crime regulatory update requires your immediate attention:
                
                📋 ALERT DETAILS:
                • Regulator: {{regulator}}
                • Update Type: {{change_type}}
                • Title: {{title}}
                • Urgency: {{impact_level}}
                
                🔍 KEY CHANGES:
                {{key_changes}}
                
                ⚡ IMMEDIATE COMPLIANCE ACTIONS:
                {{compliance_actions}}
                
                📊 RISK ASSESSMENT:
                {{risk_assessment}}
                
                🔗 Official Source: {{source_url}}
                
                As the MLRO or designated AML officer, please review immediately and update relevant procedures.
                
                Banking Law Intelligence System
            `,
            channels: ['email', 'sms', 'in-app'],
            auto_escalate: true,
            escalation_time: 15, // minutes for AML
            requires_acknowledgment: true
        });

        // Standard Regulatory Update Alert
        this.addAlertTemplate({
            id: 'standard-update-alert',
            name: 'Standard Regulatory Update',
            priority: 'medium',
            template: `
                📢 REGULATORY UPDATE NOTIFICATION
                
                Subject: {{regulator}} Update - {{title}}
                
                Dear {{recipient_name}},
                
                A new regulatory update has been published:
                
                📋 UPDATE INFORMATION:
                • Regulator: {{regulator}}
                • Type: {{change_type}}
                • Publication Date: {{publication_date}}
                • Effective Date: {{effective_date}}
                
                📄 OVERVIEW:
                {{summary}}
                
                📈 BUSINESS IMPACT:
                {{business_impact}}
                
                📅 NEXT STEPS:
                {{next_steps}}
                
                🔗 Read More: {{source_url}}
                
                This update is part of your regulatory monitoring subscription.
                
                Banking Law Intelligence System
            `,
            channels: ['email', 'in-app'],
            auto_escalate: false,
            requires_acknowledgment: false
        });
    }

    // Add alert template
    addAlertTemplate(template) {
        this.alertTemplates.set(template.id, template);
    }

    // Setup escalation rules
    setupEscalationRules() {
        // Critical Alert Escalation
        this.addEscalationRule({
            id: 'critical-escalation',
            name: 'Critical Alert Escalation',
            triggers: {
                priority: 'critical',
                unacknowledged_time: 30, // minutes
                keywords: ['capital', 'solvency', 'license', 'criminal']
            },
            escalation_path: [
                { level: 1, roles: ['compliance-officer', 'risk-manager'], time: 15 },
                { level: 2, roles: ['cro', 'cco'], time: 30 },
                { level: 3, roles: ['ceo', 'board-members'], time: 60 }
            ],
            notification_frequency: 15, // minutes between escalation
            max_escalations: 3
        });

        // AML Escalation
        this.addEscalationRule({
            id: 'aml-escalation',
            name: 'AML/Financial Crime Escalation',
            triggers: {
                keywords: ['aml', 'money laundering', 'sanctions', 'financial crime'],
                unacknowledged_time: 15
            },
            escalation_path: [
                { level: 1, roles: ['mlro', 'aml-officer'], time: 5 },
                { level: 2, roles: ['cco', 'head-compliance'], time: 15 },
                { level: 3, roles: ['ceo', 'board-chair'], time: 30 }
            ],
            notification_frequency: 10,
            max_escalations: 3
        });

        // Consumer Duty Escalation
        this.addEscalationRule({
            id: 'consumer-duty-escalation',
            name: 'Consumer Duty Escalation',
            triggers: {
                keywords: ['consumer duty', 'customer outcomes', 'consumer protection'],
                unacknowledged_time: 60
            },
            escalation_path: [
                { level: 1, roles: ['customer-officer', 'compliance-officer'], time: 30 },
                { level: 2, roles: ['cco', 'customer-director'], time: 60 },
                { level: 3, roles: ['ceo'], time: 120 }
            ],
            notification_frequency: 30,
            max_escalations: 2
        });
    }

    // Add escalation rule
    addEscalationRule(rule) {
        this.escalationRules.set(rule.id, rule);
    }

    // Setup distribution lists
    setupDistributionLists() {
        // Senior Management Distribution
        this.addDistributionList({
            id: 'senior-management',
            name: 'Senior Management',
            members: [
                { role: 'ceo', email: 'ceo@bank.com', sms: '+44...', priority: 'all' },
                { role: 'cro', email: 'cro@bank.com', sms: '+44...', priority: 'high,critical' },
                { role: 'cco', email: 'cco@bank.com', sms: '+44...', priority: 'high,critical' },
                { role: 'cfo', email: 'cfo@bank.com', sms: '+44...', priority: 'medium,high,critical' }
            ],
            default_channels: ['email'],
            escalation_channels: ['email', 'sms']
        });

        // Compliance Team Distribution
        this.addDistributionList({
            id: 'compliance-team',
            name: 'Compliance Team',
            members: [
                { role: 'head-compliance', email: 'compliance-head@bank.com', priority: 'all' },
                { role: 'compliance-officer', email: 'compliance@bank.com', priority: 'all' },
                { role: 'mlro', email: 'mlro@bank.com', priority: 'all' },
                { role: 'regulatory-specialist', email: 'regulatory@bank.com', priority: 'medium,high,critical' }
            ],
            default_channels: ['email', 'in-app'],
            escalation_channels: ['email', 'sms']
        });

        // Risk Management Distribution
        this.addDistributionList({
            id: 'risk-management',
            name: 'Risk Management',
            members: [
                { role: 'head-risk', email: 'risk-head@bank.com', priority: 'high,critical' },
                { role: 'risk-manager', email: 'risk@bank.com', priority: 'all' },
                { role: 'operational-risk', email: 'op-risk@bank.com', priority: 'medium,high,critical' }
            ],
            default_channels: ['email', 'in-app'],
            escalation_channels: ['email']
        });

        // Board Members Distribution
        this.addDistributionList({
            id: 'board-members',
            name: 'Board Members',
            members: [
                { role: 'board-chair', email: 'chair@bank.com', priority: 'critical' },
                { role: 'independent-director', email: 'director1@bank.com', priority: 'critical' },
                { role: 'risk-committee-chair', email: 'risk-chair@bank.com', priority: 'critical' }
            ],
            default_channels: ['email'],
            escalation_channels: ['email', 'sms']
        });
    }

    // Add distribution list
    addDistributionList(list) {
        this.distributionLists.set(list.id, list);
    }

    // Start alert processor
    startAlertProcessor() {
        // Process alert queue every minute
        setInterval(() => {
            this.processAlertQueue();
        }, 60 * 1000);

        // Check for escalations every 5 minutes
        setInterval(() => {
            this.checkEscalations();
        }, 5 * 60 * 1000);

        console.log('🔄 Alert processor started');
    }

    // Create alert from regulatory change
    createAlert(regulatoryChange, severity = 'medium') {
        const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const alert = {
            id: alertId,
            type: 'regulatory_change',
            priority: severity,
            status: 'pending',
            created_at: new Date().toISOString(),
            regulatory_change: regulatoryChange,
            template_id: this.selectAlertTemplate(regulatoryChange, severity),
            distribution_lists: this.selectDistributionLists(regulatoryChange, severity),
            escalation_rules: this.selectEscalationRules(regulatoryChange, severity),
            acknowledgments: new Map(),
            escalation_level: 0,
            last_sent: null,
            metrics: {
                sent_count: 0,
                acknowledgment_rate: 0,
                average_response_time: 0
            }
        };

        // Add to queue
        this.alertQueue.set(alertId, alert);
        
        // Immediate processing for critical alerts
        if (severity === 'critical') {
            setTimeout(() => this.processAlert(alertId), 1000);
        }

        return alertId;
    }

    // Select appropriate alert template
    selectAlertTemplate(change, severity) {
        const keywords = change.keywords || [];
        
        if (keywords.some(k => ['capital', 'solvency', 'license'].includes(k))) {
            return 'critical-capital-alert';
        } else if (keywords.some(k => ['aml', 'money laundering', 'sanctions'].includes(k))) {
            return 'aml-alert';
        } else if (keywords.some(k => ['consumer duty', 'consumer protection'].includes(k))) {
            return 'consumer-duty-alert';
        } else {
            return 'standard-update-alert';
        }
    }

    // Select distribution lists based on change content
    selectDistributionLists(change, severity) {
        const lists = ['compliance-team'];
        
        if (severity === 'critical') {
            lists.push('senior-management');
        }
        
        const keywords = change.keywords || [];
        
        if (keywords.some(k => ['risk', 'operational', 'capital'].includes(k))) {
            lists.push('risk-management');
        }
        
        if (severity === 'critical' && keywords.some(k => ['license', 'criminal', 'enforcement'].includes(k))) {
            lists.push('board-members');
        }
        
        return lists;
    }

    // Select escalation rules
    selectEscalationRules(change, severity) {
        const rules = [];
        const keywords = change.keywords || [];
        
        if (severity === 'critical') {
            rules.push('critical-escalation');
        }
        
        if (keywords.some(k => ['aml', 'money laundering', 'sanctions'].includes(k))) {
            rules.push('aml-escalation');
        }
        
        if (keywords.some(k => ['consumer duty', 'consumer protection'].includes(k))) {
            rules.push('consumer-duty-escalation');
        }
        
        return rules;
    }

    // Process alert queue
    processAlertQueue() {
        this.alertQueue.forEach((alert, alertId) => {
            if (alert.status === 'pending') {
                this.processAlert(alertId);
            }
        });
    }

    // Process individual alert
    async processAlert(alertId) {
        const alert = this.alertQueue.get(alertId);
        if (!alert) return;

        try {
            console.log(`📨 Processing alert: ${alertId}`);
            
            // Generate alert content
            const content = await this.generateAlertContent(alert);
            
            // Send to distribution lists
            await this.sendToDistributionLists(alert, content);
            
            // Update alert status
            alert.status = 'sent';
            alert.last_sent = new Date().toISOString();
            alert.metrics.sent_count++;
            
            // Schedule escalation check if needed
            if (alert.escalation_rules.length > 0) {
                this.scheduleEscalationCheck(alertId);
            }
            
            // Move to history if not requiring acknowledgment
            const template = this.alertTemplates.get(alert.template_id);
            if (!template?.requires_acknowledgment) {
                this.moveToHistory(alertId);
            }
            
        } catch (error) {
            console.error(`❌ Error processing alert ${alertId}:`, error);
            alert.status = 'error';
            alert.error_message = error.message;
        }
    }

    // Generate alert content from template
    async generateAlertContent(alert) {
        const template = this.alertTemplates.get(alert.template_id);
        if (!template) throw new Error('Alert template not found');

        const change = alert.regulatory_change;
        
        // Prepare template variables
        const variables = {
            regulator: change.regulator,
            change_type: change.type,
            title: change.title,
            summary: change.summary,
            impact_level: change.impact,
            effective_date: this.formatDate(change.effective_date),
            consultation_deadline: this.formatDate(change.deadline),
            publication_date: this.formatDate(change.detected_at),
            source_url: change.url,
            affected_areas: change.impact_analysis?.business_impact?.affected_areas?.join(', ') || 'To be assessed',
            business_impact: change.impact_analysis?.business_impact?.description || 'Impact assessment pending',
            immediate_actions: await this.generateImmediateActions(change),
            recommended_actions: await this.generateRecommendedActions(change),
            compliance_actions: await this.generateComplianceActions(change),
            risk_assessment: await this.generateRiskAssessment(change),
            key_changes: await this.extractKeyChanges(change),
            next_steps: await this.generateNextSteps(change)
        };

        // Replace template variables
        let content = template.template;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value || '[To be determined]');
        }

        return content;
    }

    // Generate immediate actions
    async generateImmediateActions(change) {
        const actions = [];
        const keywords = change.keywords || [];
        
        if (keywords.includes('capital requirements')) {
            actions.push('• Review current capital ratios and buffers');
            actions.push('• Assess impact on capital planning');
            actions.push('• Prepare Board briefing');
        }
        
        if (keywords.includes('consumer duty')) {
            actions.push('• Review customer outcome metrics');
            actions.push('• Assess product and service implications');
            actions.push('• Update customer communications');
        }
        
        if (keywords.includes('aml') || keywords.includes('money laundering')) {
            actions.push('• Review AML policies and procedures');
            actions.push('• Update risk assessment');
            actions.push('• Brief relevant staff');
        }
        
        if (actions.length === 0) {
            actions.push('• Review regulatory change for applicability');
            actions.push('• Assess impact on current operations');
            actions.push('• Determine required actions');
        }
        
        return actions.join('\n');
    }

    // Send to distribution lists
    async sendToDistributionLists(alert, content) {
        for (const listId of alert.distribution_lists) {
            const list = this.distributionLists.get(listId);
            if (!list) continue;

            for (const member of list.members) {
                if (this.shouldSendToMember(member, alert.priority)) {
                    await this.sendToMember(member, alert, content, list.default_channels);
                }
            }
        }
    }

    // Check if should send to member based on priority
    shouldSendToMember(member, alertPriority) {
        if (member.priority === 'all') return true;
        
        const memberPriorities = member.priority.split(',');
        return memberPriorities.includes(alertPriority);
    }

    // Send alert to individual member
    async sendToMember(member, alert, content, channels) {
        for (const channel of channels) {
            try {
                await this.sendViaChannel(member, alert, content, channel);
                console.log(`📤 Sent ${alert.priority} alert to ${member.role} via ${channel}`);
            } catch (error) {
                console.error(`❌ Failed to send to ${member.role} via ${channel}:`, error);
            }
        }
    }

    // Send via specific channel
    async sendViaChannel(member, alert, content, channel) {
        const personalizedContent = content.replace('{{recipient_name}}', 
            member.name || this.formatRole(member.role));

        switch (channel) {
            case 'email':
                await this.sendEmail(member.email, alert, personalizedContent);
                break;
            case 'sms':
                await this.sendSMS(member.sms, alert, this.createSMSContent(alert));
                break;
            case 'in-app':
                await this.sendInAppNotification(member.role, alert, personalizedContent);
                break;
            case 'webhook':
                await this.sendWebhook(member.webhook_url, alert, personalizedContent);
                break;
        }
    }

    // Format role for display
    formatRole(role) {
        return role.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Create SMS content (shorter version)
    createSMSContent(alert) {
        return `URGENT: ${alert.regulatory_change.regulator} ${alert.regulatory_change.type} - ${alert.regulatory_change.title}. Check email for details. Ref: ${alert.id}`;
    }

    // Check for escalations
    checkEscalations() {
        this.alertQueue.forEach((alert, alertId) => {
            if (alert.status === 'sent' && alert.escalation_rules.length > 0) {
                this.evaluateEscalation(alertId);
            }
        });
    }

    // Evaluate if alert needs escalation
    evaluateEscalation(alertId) {
        const alert = this.alertQueue.get(alertId);
        if (!alert) return;

        const template = this.alertTemplates.get(alert.template_id);
        if (!template?.requires_acknowledgment) return;

        const timeSinceSent = Date.now() - new Date(alert.last_sent).getTime();
        const minutesSinceSent = timeSinceSent / (1000 * 60);

        // Check if escalation is needed
        for (const ruleId of alert.escalation_rules) {
            const rule = this.escalationRules.get(ruleId);
            if (!rule) continue;

            const shouldEscalate = this.shouldEscalate(alert, rule, minutesSinceSent);
            if (shouldEscalate) {
                this.executeEscalation(alertId, rule);
            }
        }
    }

    // Check if alert should be escalated
    shouldEscalate(alert, rule, minutesSinceSent) {
        // Check if unacknowledged for required time
        if (minutesSinceSent < rule.triggers.unacknowledged_time) return false;

        // Check if already at max escalation level
        if (alert.escalation_level >= rule.max_escalations) return false;

        // Check keyword triggers
        if (rule.triggers.keywords) {
            const changeKeywords = alert.regulatory_change.keywords || [];
            const hasMatchingKeyword = rule.triggers.keywords.some(keyword =>
                changeKeywords.includes(keyword)
            );
            if (!hasMatchingKeyword) return false;
        }

        return true;
    }

    // Execute escalation
    async executeEscalation(alertId, rule) {
        const alert = this.alertQueue.get(alertId);
        if (!alert) return;

        alert.escalation_level++;
        
        const escalationStep = rule.escalation_path[alert.escalation_level - 1];
        if (!escalationStep) return;

        console.log(`🚨 Escalating alert ${alertId} to level ${alert.escalation_level}`);

        // Send escalation notifications
        for (const role of escalationStep.roles) {
            await this.sendEscalationNotification(alert, role, escalationStep.level);
        }

        // Schedule next escalation check
        setTimeout(() => {
            this.evaluateEscalation(alertId);
        }, rule.notification_frequency * 60 * 1000);
    }

    // Acknowledge alert
    acknowledgeAlert(alertId, acknowledgedBy, comments = '') {
        const alert = this.alertQueue.get(alertId);
        if (!alert) return false;

        alert.acknowledgments.set(acknowledgedBy, {
            acknowledged_at: new Date().toISOString(),
            comments: comments
        });

        // Check if sufficient acknowledgments received
        const template = this.alertTemplates.get(alert.template_id);
        if (template?.requires_acknowledgment && alert.acknowledgments.size > 0) {
            alert.status = 'acknowledged';
            this.moveToHistory(alertId);
        }

        return true;
    }

    // Move alert to history
    moveToHistory(alertId) {
        const alert = this.alertQueue.get(alertId);
        if (!alert) return;

        alert.completed_at = new Date().toISOString();
        
        if (!this.alertHistory.has(alertId)) {
            this.alertHistory.set(alertId, alert);
        }
        
        this.alertQueue.delete(alertId);
        
        // Update metrics
        this.updateAlertMetrics(alert);
    }

    // Update alert metrics
    updateAlertMetrics(alert) {
        const date = new Date().toDateString();
        
        if (!this.alertMetrics.has(date)) {
            this.alertMetrics.set(date, {
                total_alerts: 0,
                by_priority: { critical: 0, high: 0, medium: 0, low: 0 },
                by_regulator: {},
                average_response_time: 0,
                acknowledgment_rate: 0
            });
        }
        
        const metrics = this.alertMetrics.get(date);
        metrics.total_alerts++;
        metrics.by_priority[alert.priority] = (metrics.by_priority[alert.priority] || 0) + 1;
        metrics.by_regulator[alert.regulatory_change.regulator] = 
            (metrics.by_regulator[alert.regulatory_change.regulator] || 0) + 1;
    }

    // Get active alerts
    getActiveAlerts() {
        return Array.from(this.alertQueue.values())
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Get alert history
    getAlertHistory(days = 30) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        
        return Array.from(this.alertHistory.values())
            .filter(alert => new Date(alert.created_at) >= cutoff)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Get alert metrics
    getAlertMetrics(period = 'week') {
        const now = new Date();
        const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 1;
        const metrics = {
            period: period,
            total_alerts: 0,
            by_priority: { critical: 0, high: 0, medium: 0, low: 0 },
            by_regulator: {},
            by_status: { sent: 0, acknowledged: 0, escalated: 0 },
            response_times: []
        };

        for (let i = 0; i < periodDays; i++) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toDateString();
            const dayMetrics = this.alertMetrics.get(date);
            
            if (dayMetrics) {
                metrics.total_alerts += dayMetrics.total_alerts;
                
                Object.keys(metrics.by_priority).forEach(priority => {
                    metrics.by_priority[priority] += dayMetrics.by_priority[priority] || 0;
                });
                
                Object.keys(dayMetrics.by_regulator).forEach(regulator => {
                    metrics.by_regulator[regulator] = 
                        (metrics.by_regulator[regulator] || 0) + dayMetrics.by_regulator[regulator];
                });
            }
        }

        return metrics;
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Simulate email sending
    async sendEmail(email, alert, content) {
        console.log(`📧 Email sent to ${email} - ${alert.priority} priority`);
        return Promise.resolve();
    }

    // Simulate SMS sending
    async sendSMS(phone, alert, content) {
        console.log(`📱 SMS sent to ${phone} - ${content.substring(0, 50)}...`);
        return Promise.resolve();
    }

    // Simulate in-app notification
    async sendInAppNotification(role, alert, content) {
        console.log(`📲 In-app notification sent to ${role}`);
        return Promise.resolve();
    }

    // Simulate webhook sending
    async sendWebhook(url, alert, content) {
        console.log(`🔗 Webhook sent to ${url}`);
        return Promise.resolve();
    }
}

// Export for use in main application
window.RegulatoryAlertsSystem = RegulatoryAlertsSystem;

// Initialize alerts system
const regulatoryAlerts = new RegulatoryAlertsSystem();

console.log('🚨 Regulatory Change Alerts System loaded');