// Compliance Calendar System
// JuriBank - UK Banking Law Intelligence Platform

class ComplianceCalendar {
    constructor() {
        this.deadlines = new Map();
        this.recurringDeadlines = new Map();
        this.subscribers = [];
        this.reminderSettings = {
            advance_notice: [30, 14, 7, 1], // days before deadline
            default_timezone: 'Europe/London'
        };
        
        this.initializeStandardDeadlines();
    }

    // Initialize standard UK banking regulatory deadlines
    initializeStandardDeadlines() {
        console.log('📅 Initializing JuriBank Compliance Calendar...');
        
        // Annual recurring deadlines
        this.addRecurringDeadline({
            id: 'icaap-submission',
            title: 'ICAAP Annual Submission',
            description: 'Internal Capital Adequacy Assessment Process submission to PRA',
            regulator: 'PRA',
            category: 'Capital Requirements',
            frequency: 'annual',
            month: 4, // April
            day: 30,
            advance_notice: [90, 60, 30, 14, 7],
            importance: 'critical',
            penalties: 'Regulatory action, potential capital add-on',
            guidance_url: 'https://www.bankofengland.co.uk/prudential-regulation/publication/2013/icaap-review-instructions'
        });

        this.addRecurringDeadline({
            id: 'ilaap-submission',
            title: 'ILAAP Annual Submission',
            description: 'Individual Liquidity Adequacy Assessment Process submission to PRA',
            regulator: 'PRA',
            category: 'Liquidity Requirements',
            frequency: 'annual',
            month: 4,
            day: 30,
            advance_notice: [90, 60, 30, 14, 7],
            importance: 'critical',
            penalties: 'Regulatory action, liquidity requirements increase'
        });

        this.addRecurringDeadline({
            id: 'corep-annual',
            title: 'COREP Annual Submission',
            description: 'Common Reporting (COREP) annual prudential returns',
            regulator: 'PRA',
            category: 'Prudential Reporting',
            frequency: 'annual',
            month: 5,
            day: 31,
            advance_notice: [45, 30, 14, 7],
            importance: 'high',
            penalties: 'Late submission penalties, regulatory scrutiny'
        });

        // Quarterly deadlines
        this.addRecurringDeadline({
            id: 'corep-quarterly',
            title: 'COREP Quarterly Submission',
            description: 'Quarterly prudential reporting to PRA',
            regulator: 'PRA',
            category: 'Prudential Reporting',
            frequency: 'quarterly',
            quarters: [1, 2, 3, 4],
            offset_days: 40, // 40 business days after quarter end
            advance_notice: [21, 14, 7, 3],
            importance: 'high',
            penalties: 'Late submission penalties'
        });

        this.addRecurringDeadline({
            id: 'finrep-quarterly',
            title: 'FINREP Quarterly Submission',
            description: 'Financial Reporting (FINREP) quarterly returns',
            regulator: 'PRA',
            category: 'Financial Reporting',
            frequency: 'quarterly',
            quarters: [1, 2, 3, 4],
            offset_days: 40,
            advance_notice: [21, 14, 7, 3],
            importance: 'high',
            penalties: 'Regulatory scrutiny, potential enforcement'
        });

        // Consumer Duty deadlines
        this.addRecurringDeadline({
            id: 'consumer-duty-board-report',
            title: 'Consumer Duty Board Report',
            description: 'Annual Consumer Duty outcomes report to Board',
            regulator: 'FCA',
            category: 'Consumer Protection',
            frequency: 'annual',
            month: 10,
            day: 31,
            advance_notice: [60, 30, 14, 7],
            importance: 'critical',
            penalties: 'Enforcement action, reputational damage'
        });

        // AML compliance deadlines
        this.addRecurringDeadline({
            id: 'aml-risk-assessment',
            title: 'AML Risk Assessment Update',
            description: 'Annual update of business-wide AML risk assessment',
            regulator: 'FCA/HMRC',
            category: 'AML Compliance',
            frequency: 'annual',
            month: 12,
            day: 31,
            advance_notice: [90, 60, 30, 14],
            importance: 'critical',
            penalties: 'Criminal sanctions, unlimited fines'
        });

        // Stress testing deadlines
        this.addRecurringDeadline({
            id: 'stress-test-submission',
            title: 'Annual Stress Test Submission',
            description: 'PRA/BoE annual stress testing exercise participation',
            regulator: 'PRA/BoE',
            category: 'Stress Testing',
            frequency: 'annual',
            month: 6,
            day: 30,
            advance_notice: [120, 90, 60, 30, 14],
            importance: 'critical',
            penalties: 'Capital add-ons, dividend restrictions'
        });

        // Generate deadlines for current and next year
        this.generateUpcomingDeadlines();
        
        console.log('✅ JuriBank compliance calendar initialized');
    }

    // Add recurring deadline template
    addRecurringDeadline(template) {
        this.recurringDeadlines.set(template.id, template);
    }

    // Generate upcoming deadlines from templates
    generateUpcomingDeadlines() {
        const currentYear = new Date().getFullYear();
        const years = [currentYear, currentYear + 1];
        
        this.recurringDeadlines.forEach(template => {
            years.forEach(year => {
                if (template.frequency === 'annual') {
                    this.generateAnnualDeadline(template, year);
                } else if (template.frequency === 'quarterly') {
                    this.generateQuarterlyDeadlines(template, year);
                }
            });
        });
    }

    // Generate annual deadline
    generateAnnualDeadline(template, year) {
        const deadline = new Date(year, template.month - 1, template.day);
        
        this.addDeadline({
            id: `${template.id}-${year}`,
            template_id: template.id,
            title: template.title,
            description: template.description,
            regulator: template.regulator,
            category: template.category,
            deadline: deadline,
            importance: template.importance,
            advance_notice: template.advance_notice || this.reminderSettings.advance_notice,
            penalties: template.penalties,
            guidance_url: template.guidance_url,
            status: 'pending'
        });
    }

    // Generate quarterly deadlines
    generateQuarterlyDeadlines(template, year) {
        template.quarters.forEach(quarter => {
            const quarterEndMonth = quarter * 3;
            const quarterEnd = new Date(year, quarterEndMonth, 0); // Last day of quarter
            
            // Add business days offset
            const deadline = this.addBusinessDays(quarterEnd, template.offset_days);
            
            this.addDeadline({
                id: `${template.id}-${year}-q${quarter}`,
                template_id: template.id,
                title: `${template.title} Q${quarter} ${year}`,
                description: template.description,
                regulator: template.regulator,
                category: template.category,
                deadline: deadline,
                importance: template.importance,
                advance_notice: template.advance_notice || this.reminderSettings.advance_notice,
                penalties: template.penalties,
                quarter: quarter,
                year: year,
                status: 'pending'
            });
        });
    }

    // Add individual deadline
    addDeadline(deadline) {
        // Generate reminder dates
        deadline.reminders = this.generateReminderDates(deadline.deadline, deadline.advance_notice);
        deadline.created = new Date();
        
        this.deadlines.set(deadline.id, deadline);
        
        // Schedule reminders
        this.scheduleReminders(deadline);
    }

    // Generate reminder dates
    generateReminderDates(deadline, advance_notice) {
        return advance_notice.map(days => {
            const reminderDate = new Date(deadline);
            reminderDate.setDate(reminderDate.getDate() - days);
            return {
                date: reminderDate,
                days_before: days,
                sent: false
            };
        });
    }

    // Schedule reminders
    scheduleReminders(deadline) {
        deadline.reminders.forEach(reminder => {
            const now = new Date();
            const timeUntilReminder = reminder.date.getTime() - now.getTime();
            
            if (timeUntilReminder > 0) {
                setTimeout(() => {
                    this.sendReminder(deadline, reminder);
                }, timeUntilReminder);
            }
        });
    }

    // Send reminder notification
    sendReminder(deadline, reminder) {
        const notification = {
            id: `reminder-${deadline.id}-${reminder.days_before}`,
            type: 'deadline_reminder',
            deadline: deadline,
            days_until: reminder.days_before,
            urgency: this.calculateUrgency(reminder.days_before, deadline.importance),
            message: this.generateReminderMessage(deadline, reminder.days_before),
            sent_at: new Date()
        };

        // Mark reminder as sent
        reminder.sent = true;

        // Notify subscribers
        this.notifySubscribers(notification);
        
        console.log(`📢 Reminder sent: ${deadline.title} (${reminder.days_before} days)`);
    }

    // Calculate urgency level
    calculateUrgency(days_before, importance) {
        if (importance === 'critical') {
            if (days_before <= 1) return 'critical';
            if (days_before <= 7) return 'high';
            if (days_before <= 14) return 'medium';
            return 'low';
        } else if (importance === 'high') {
            if (days_before <= 3) return 'high';
            if (days_before <= 14) return 'medium';
            return 'low';
        } else {
            if (days_before <= 7) return 'medium';
            return 'low';
        }
    }

    // Generate reminder message
    generateReminderMessage(deadline, days_before) {
        const urgencyEmoji = {
            'critical': '🚨',
            'high': '⚠️',
            'medium': '📅',
            'low': 'ℹ️'
        };

        const urgency = this.calculateUrgency(days_before, deadline.importance);
        const emoji = urgencyEmoji[urgency];

        if (days_before === 0) {
            return `${emoji} DEADLINE TODAY: ${deadline.title}`;
        } else if (days_before === 1) {
            return `${emoji} DEADLINE TOMORROW: ${deadline.title}`;
        } else {
            return `${emoji} ${days_before} days until: ${deadline.title}`;
        }
    }

    // Get upcoming deadlines
    getUpcomingDeadlines(days_ahead = 30) {
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + days_ahead);

        return Array.from(this.deadlines.values())
            .filter(deadline => 
                deadline.deadline >= now && 
                deadline.deadline <= cutoff &&
                deadline.status !== 'completed'
            )
            .sort((a, b) => a.deadline - b.deadline);
    }

    // Get overdue deadlines
    getOverdueDeadlines() {
        const now = new Date();
        
        return Array.from(this.deadlines.values())
            .filter(deadline => 
                deadline.deadline < now && 
                deadline.status !== 'completed'
            )
            .sort((a, b) => a.deadline - b.deadline);
    }

    // Get deadlines by category
    getDeadlinesByCategory(category) {
        return Array.from(this.deadlines.values())
            .filter(deadline => deadline.category === category)
            .sort((a, b) => a.deadline - b.deadline);
    }

    // Get deadlines by regulator
    getDeadlinesByRegulator(regulator) {
        return Array.from(this.deadlines.values())
            .filter(deadline => deadline.regulator === regulator)
            .sort((a, b) => a.deadline - b.deadline);
    }

    // Mark deadline as completed
    completeDeadline(deadline_id, completion_note = '') {
        const deadline = this.deadlines.get(deadline_id);
        if (deadline) {
            deadline.status = 'completed';
            deadline.completed_at = new Date();
            deadline.completion_note = completion_note;
            
            console.log(`✅ Deadline completed: ${deadline.title}`);
            return true;
        }
        return false;
    }

    // Add business days to date
    addBusinessDays(date, days) {
        const result = new Date(date);
        let addedDays = 0;
        
        while (addedDays < days) {
            result.setDate(result.getDate() + 1);
            // Skip weekends
            if (result.getDay() !== 0 && result.getDay() !== 6) {
                addedDays++;
            }
        }
        
        return result;
    }

    // Subscribe to calendar notifications
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    // Notify subscribers
    notifySubscribers(notification) {
        this.subscribers.forEach(callback => {
            try {
                callback(notification);
            } catch (error) {
                console.error('Error notifying calendar subscriber:', error);
            }
        });
    }

    // Export calendar data
    exportCalendar(format = 'ics') {
        switch (format) {
            case 'ics':
                return this.generateICSCalendar();
            case 'json':
                return JSON.stringify(Array.from(this.deadlines.values()), null, 2);
            case 'csv':
                return this.generateCSV();
            default:
                return Array.from(this.deadlines.values());
        }
    }

    // Generate ICS calendar file
    generateICSCalendar() {
        let ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//BankingLaw//Compliance Calendar//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        this.deadlines.forEach(deadline => {
            const event = [
                'BEGIN:VEVENT',
                `UID:${deadline.id}@bankinglaw.com`,
                `DTSTART:${this.formatICSDate(deadline.deadline)}`,
                `SUMMARY:${deadline.title}`,
                `DESCRIPTION:${deadline.description}\\n\\nRegulator: ${deadline.regulator}\\nCategory: ${deadline.category}\\nImportance: ${deadline.importance}`,
                `CATEGORIES:${deadline.category}`,
                `PRIORITY:${deadline.importance === 'critical' ? '1' : deadline.importance === 'high' ? '2' : '3'}`,
                'END:VEVENT'
            ];
            
            ics.push(...event);
        });

        ics.push('END:VCALENDAR');
        return ics.join('\r\n');
    }

    // Format date for ICS
    formatICSDate(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // Generate CSV export
    generateCSV() {
        const headers = ['Title', 'Description', 'Deadline', 'Regulator', 'Category', 'Importance', 'Status'];
        const rows = Array.from(this.deadlines.values()).map(deadline => [
            deadline.title,
            deadline.description,
            deadline.deadline.toISOString().split('T')[0],
            deadline.regulator,
            deadline.category,
            deadline.importance,
            deadline.status
        ]);

        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    // Get compliance dashboard data
    getDashboardData() {
        const now = new Date();
        const upcoming = this.getUpcomingDeadlines(30);
        const overdue = this.getOverdueDeadlines();
        
        return {
            summary: {
                total_deadlines: this.deadlines.size,
                upcoming_30_days: upcoming.length,
                overdue: overdue.length,
                critical_upcoming: upcoming.filter(d => d.importance === 'critical').length
            },
            upcoming_deadlines: upcoming.slice(0, 10),
            overdue_deadlines: overdue,
            categories: this.getCategoryBreakdown(),
            regulators: this.getRegulatorBreakdown()
        };
    }

    // Get category breakdown
    getCategoryBreakdown() {
        const breakdown = {};
        this.deadlines.forEach(deadline => {
            breakdown[deadline.category] = (breakdown[deadline.category] || 0) + 1;
        });
        return breakdown;
    }

    // Get regulator breakdown
    getRegulatorBreakdown() {
        const breakdown = {};
        this.deadlines.forEach(deadline => {
            breakdown[deadline.regulator] = (breakdown[deadline.regulator] || 0) + 1;
        });
        return breakdown;
    }
}

// Export for use in main application
window.ComplianceCalendar = ComplianceCalendar;

// Initialize compliance calendar
const complianceCalendar = new ComplianceCalendar();

console.log('📅 UK Compliance Calendar System loaded');