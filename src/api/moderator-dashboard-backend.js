/**
 * JuriBank Moderator Dashboard Backend v3.0
 * Student moderator and professional oversight system
 * Educational platform moderation with hierarchical review
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class ModeratorDashboardBackend {
    constructor(forumBackend, moderationEngine) {
        this.app = express();
        this.forumBackend = forumBackend;
        this.moderationEngine = moderationEngine;

        // Student moderators and professional oversight
        this.moderators = new Map();
        this.professionals = new Map();
        this.moderationQueue = new Map();
        this.moderationActions = new Map();
        this.moderationStats = new Map();

        // Active moderator sessions
        this.activeModerators = new Map();
        
        this.initializeModeratorSystem();
        this.setupRoutes();
        this.loadInitialData();
    }

    /**
     * Initialize moderator system
     */
    initializeModeratorSystem() {
        // Moderator role definitions
        this.roles = {
            STUDENT_MODERATOR: {
                level: 1,
                permissions: [
                    'view_queue',
                    'flag_content', 
                    'suggest_edits',
                    'approve_low_risk',
                    'add_educational_notes'
                ],
                maxRiskLevel: 0.6,
                requiresOversight: true
            },
            SENIOR_STUDENT_MODERATOR: {
                level: 2, 
                permissions: [
                    'view_queue',
                    'flag_content',
                    'suggest_edits',
                    'approve_medium_risk',
                    'add_educational_notes',
                    'mentor_junior_moderators'
                ],
                maxRiskLevel: 0.8,
                requiresOversight: false
            },
            PROFESSIONAL_OVERSIGHT: {
                level: 3,
                permissions: [
                    'view_all_content',
                    'override_decisions',
                    'approve_high_risk',
                    'manage_moderators',
                    'access_analytics',
                    'educational_policy'
                ],
                maxRiskLevel: 1.0,
                requiresOversight: false
            }
        };

        // Moderation workflows
        this.workflows = {
            STANDARD_REVIEW: {
                steps: [
                    'auto_moderation',
                    'student_review',
                    'professional_oversight'
                ],
                timeouts: {
                    student_review: 4 * 60 * 60 * 1000, // 4 hours
                    professional_oversight: 24 * 60 * 60 * 1000 // 24 hours
                }
            },
            EXPRESS_REVIEW: {
                steps: [
                    'auto_moderation',
                    'senior_student_review'
                ],
                timeouts: {
                    senior_student_review: 2 * 60 * 60 * 1000 // 2 hours
                }
            },
            URGENT_REVIEW: {
                steps: [
                    'immediate_professional_review'
                ],
                timeouts: {
                    immediate_professional_review: 30 * 60 * 1000 // 30 minutes
                }
            }
        };

        console.log('[Moderator Dashboard] System initialized');
    }

    /**
     * Setup API routes
     */
    setupRoutes() {
        const router = express.Router();

        // Authentication and session management
        router.post('/auth/login', this.authenticateModerator.bind(this));
        router.post('/auth/logout', this.logoutModerator.bind(this));
        router.get('/auth/session', this.validateModeratorSession.bind(this));

        // Moderation queue management
        router.get('/queue', this.getModerationQueue.bind(this));
        router.get('/queue/assigned', this.getAssignedItems.bind(this));
        router.post('/queue/:itemId/claim', this.claimModerationItem.bind(this));
        router.post('/queue/:itemId/release', this.releaseModerationItem.bind(this));

        // Content review actions
        router.post('/review/:itemId/approve', this.approveContent.bind(this));
        router.post('/review/:itemId/flag', this.flagContent.bind(this));
        router.post('/review/:itemId/edit', this.suggestEdit.bind(this));
        router.post('/review/:itemId/reject', this.rejectContent.bind(this));
        router.post('/review/:itemId/escalate', this.escalateToOversight.bind(this));

        // Educational guidance
        router.post('/guidance/:itemId/add-note', this.addEducationalNote.bind(this));
        router.get('/guidance/templates', this.getEducationalTemplates.bind(this));

        // Analytics and reporting
        router.get('/analytics/performance', this.getModeratorPerformance.bind(this));
        router.get('/analytics/queue-stats', this.getQueueStatistics.bind(this));
        router.get('/analytics/compliance', this.getComplianceMetrics.bind(this));

        // Professional oversight
        router.get('/oversight/decisions', this.getOversightDecisions.bind(this));
        router.post('/oversight/:itemId/override', this.overrideDecision.bind(this));
        router.get('/oversight/moderator-performance', this.getModeratorPerformanceReport.bind(this));

        // Moderator management
        router.get('/moderators', this.getModeratorList.bind(this));
        router.post('/moderators/:moderatorId/assign', this.assignModerator.bind(this));
        router.put('/moderators/:moderatorId/status', this.updateModeratorStatus.bind(this));

        this.app.use('/api/moderation', this.authenticateRequest.bind(this), router);
    }

    /**
     * Authentication middleware
     */
    async authenticateRequest(req, res, next) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'No authorization token provided' });
            }

            const decoded = jwt.verify(token, process.env.MODERATOR_JWT_SECRET || 'moderator-secret');
            const moderator = this.moderators.get(decoded.moderatorId) || this.professionals.get(decoded.moderatorId);
            
            if (!moderator || !moderator.isActive) {
                return res.status(401).json({ error: 'Invalid or inactive moderator' });
            }

            req.moderator = moderator;
            next();

        } catch (error) {
            res.status(401).json({ error: 'Invalid authorization token' });
        }
    }

    /**
     * Moderator authentication
     */
    async authenticateModerator(req, res) {
        try {
            const { username, password, type = 'student' } = req.body;

            // Mock authentication - in production, verify against database
            const moderator = this.findModeratorByUsername(username, type);
            if (!moderator || !this.verifyPassword(password, moderator.passwordHash)) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (!moderator.isActive || moderator.status === 'suspended') {
                return res.status(403).json({ error: 'Account is inactive or suspended' });
            }

            // Create session
            const sessionToken = jwt.sign(
                { moderatorId: moderator.id, type: moderator.type, role: moderator.role },
                process.env.MODERATOR_JWT_SECRET || 'moderator-secret',
                { expiresIn: '8h' }
            );

            // Track active session
            this.activeModerators.set(moderator.id, {
                sessionToken,
                loginTime: new Date(),
                lastActivity: new Date(),
                ipAddress: req.ip
            });

            // Update login statistics
            moderator.lastLogin = new Date();
            moderator.loginCount = (moderator.loginCount || 0) + 1;

            res.json({
                success: true,
                token: sessionToken,
                moderator: this.sanitizeModeratorInfo(moderator),
                permissions: this.roles[moderator.role].permissions,
                queueCount: await this.getModeratorQueueCount(moderator)
            });

        } catch (error) {
            res.status(500).json({ error: 'Authentication failed', message: error.message });
        }
    }

    /**
     * Get moderation queue
     */
    async getModerationQueue(req, res) {
        try {
            const { page = 1, limit = 20, priority, category, status } = req.query;
            const moderator = req.moderator;

            // Filter queue items based on moderator permissions
            let queueItems = Array.from(this.moderationQueue.values()).filter(item => {
                // Check if moderator can handle this risk level
                if (item.riskScore > this.roles[moderator.role].maxRiskLevel) {
                    return false;
                }

                // Apply filters
                if (priority && item.priority !== priority) return false;
                if (category && item.category !== category) return false;
                if (status && item.status !== status) return false;

                return true;
            });

            // Sort by priority and timestamp
            queueItems.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority; // Higher priority first
                }
                return new Date(a.createdAt) - new Date(b.createdAt); // Older first
            });

            // Pagination
            const startIndex = (page - 1) * limit;
            const paginatedItems = queueItems.slice(startIndex, startIndex + parseInt(limit));

            res.json({
                items: paginatedItems.map(item => this.sanitizeQueueItem(item)),
                total: queueItems.length,
                page: parseInt(page),
                totalPages: Math.ceil(queueItems.length / limit),
                statistics: {
                    pending: queueItems.filter(i => i.status === 'pending').length,
                    in_review: queueItems.filter(i => i.status === 'in_review').length,
                    escalated: queueItems.filter(i => i.status === 'escalated').length
                }
            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch moderation queue', message: error.message });
        }
    }

    /**
     * Claim moderation item for review
     */
    async claimModerationItem(req, res) {
        try {
            const { itemId } = req.params;
            const moderator = req.moderator;

            const item = this.moderationQueue.get(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Moderation item not found' });
            }

            if (item.assignedTo && item.assignedTo !== moderator.id) {
                return res.status(409).json({ error: 'Item already assigned to another moderator' });
            }

            if (item.riskScore > this.roles[moderator.role].maxRiskLevel) {
                return res.status(403).json({ error: 'Insufficient permissions for this item risk level' });
            }

            // Assign item to moderator
            item.assignedTo = moderator.id;
            item.assignedAt = new Date();
            item.status = 'in_review';
            item.claimedBy = {
                id: moderator.id,
                name: moderator.displayName,
                type: moderator.type
            };

            // Set timeout for review
            const timeout = this.getReviewTimeout(item.workflowType, moderator.role);
            item.reviewDeadline = new Date(Date.now() + timeout);

            res.json({
                success: true,
                item: this.sanitizeQueueItem(item),
                deadline: item.reviewDeadline
            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to claim item', message: error.message });
        }
    }

    /**
     * Approve content
     */
    async approveContent(req, res) {
        try {
            const { itemId } = req.params;
            const { notes, conditions } = req.body;
            const moderator = req.moderator;

            const item = this.moderationQueue.get(itemId);
            if (!item || item.assignedTo !== moderator.id) {
                return res.status(404).json({ error: 'Item not found or not assigned to you' });
            }

            // Create moderation action record
            const action = {
                id: this.generateId(),
                itemId: itemId,
                moderatorId: moderator.id,
                action: 'approve',
                notes: notes,
                conditions: conditions,
                timestamp: new Date(),
                riskLevel: item.riskScore
            };

            this.moderationActions.set(action.id, action);

            // Update item status
            item.status = 'approved';
            item.reviewedAt = new Date();
            item.reviewedBy = moderator.id;
            item.moderationResult = action;

            // If requires oversight, escalate for final approval
            if (this.roles[moderator.role].requiresOversight && item.riskScore > 0.4) {
                item.status = 'pending_oversight';
                await this.escalateToOversight(item, 'automatic_oversight_required');
            }

            // Update moderator statistics
            this.updateModeratorStats(moderator.id, 'approved', item.riskScore);

            res.json({
                success: true,
                action: action,
                nextStep: item.status === 'pending_oversight' ? 'awaiting_oversight' : 'approved'
            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to approve content', message: error.message });
        }
    }

    /**
     * Flag content for further review
     */
    async flagContent(req, res) {
        try {
            const { itemId } = req.params;
            const { reason, severity, notes } = req.body;
            const moderator = req.moderator;

            const item = this.moderationQueue.get(itemId);
            if (!item || item.assignedTo !== moderator.id) {
                return res.status(404).json({ error: 'Item not found or not assigned to you' });
            }

            const action = {
                id: this.generateId(),
                itemId: itemId,
                moderatorId: moderator.id,
                action: 'flag',
                reason: reason,
                severity: severity,
                notes: notes,
                timestamp: new Date()
            };

            this.moderationActions.set(action.id, action);

            // Update item
            item.status = 'flagged';
            item.flaggedReason = reason;
            item.flaggedSeverity = severity;
            item.reviewedAt = new Date();
            item.reviewedBy = moderator.id;

            // Auto-escalate high severity flags
            if (severity === 'high' || severity === 'critical') {
                await this.escalateToOversight(item, `high_severity_flag_${reason}`);
            }

            this.updateModeratorStats(moderator.id, 'flagged', item.riskScore);

            res.json({
                success: true,
                action: action,
                escalated: severity === 'high' || severity === 'critical'
            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to flag content', message: error.message });
        }
    }

    /**
     * Suggest edit for content
     */
    async suggestEdit(req, res) {
        try {
            const { itemId } = req.params;
            const { editedContent, editReason, educationalNotes } = req.body;
            const moderator = req.moderator;

            const item = this.moderationQueue.get(itemId);
            if (!item || item.assignedTo !== moderator.id) {
                return res.status(404).json({ error: 'Item not found or not assigned to you' });
            }

            const action = {
                id: this.generateId(),
                itemId: itemId,
                moderatorId: moderator.id,
                action: 'suggest_edit',
                originalContent: item.content,
                editedContent: editedContent,
                editReason: editReason,
                educationalNotes: educationalNotes,
                timestamp: new Date()
            };

            this.moderationActions.set(action.id, action);

            // Update item
            item.status = 'edit_suggested';
            item.suggestedEdit = {
                content: editedContent,
                reason: editReason,
                notes: educationalNotes,
                moderatorId: moderator.id
            };
            item.reviewedAt = new Date();
            item.reviewedBy = moderator.id;

            this.updateModeratorStats(moderator.id, 'edit_suggested', item.riskScore);

            res.json({
                success: true,
                action: action,
                message: 'Edit suggestion recorded'
            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to suggest edit', message: error.message });
        }
    }

    /**
     * Add educational note
     */
    async addEducationalNote(req, res) {
        try {
            const { itemId } = req.params;
            const { note, category, isPublic = false } = req.body;
            const moderator = req.moderator;

            const item = this.moderationQueue.get(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            const educationalNote = {
                id: this.generateId(),
                content: note,
                category: category,
                isPublic: isPublic,
                createdBy: {
                    id: moderator.id,
                    name: moderator.displayName,
                    type: moderator.type
                },
                createdAt: new Date()
            };

            if (!item.educationalNotes) {
                item.educationalNotes = [];
            }
            item.educationalNotes.push(educationalNote);

            res.json({
                success: true,
                note: educationalNote,
                message: 'Educational note added successfully'
            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to add educational note', message: error.message });
        }
    }

    /**
     * Escalate to professional oversight
     */
    async escalateToOversight(req, res) {
        try {
            const { itemId } = req.params;
            const { reason, urgency = 'normal' } = req.body;
            const moderator = req.moderator;

            const item = typeof req === 'string' ? this.moderationQueue.get(req) : this.moderationQueue.get(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }

            const escalation = {
                id: this.generateId(),
                itemId: item.id,
                escalatedBy: moderator.id,
                reason: typeof req === 'string' ? res : reason,
                urgency: urgency,
                escalatedAt: new Date(),
                status: 'pending_oversight'
            };

            // Update item status
            item.status = 'escalated';
            item.escalation = escalation;
            item.priority = urgency === 'urgent' ? 5 : item.priority + 1;

            // Notify professional oversight team
            await this.notifyOversightTeam(escalation);

            if (typeof res === 'object' && res.json) {
                res.json({
                    success: true,
                    escalation: escalation,
                    message: 'Item escalated to professional oversight'
                });
            }

        } catch (error) {
            if (typeof res === 'object' && res.status) {
                res.status(500).json({ error: 'Failed to escalate item', message: error.message });
            }
        }
    }

    /**
     * Get moderator performance analytics
     */
    async getModeratorPerformance(req, res) {
        try {
            const moderator = req.moderator;
            const { period = '30d' } = req.query;

            const stats = this.moderationStats.get(moderator.id) || {};
            const performance = this.calculateModeratorPerformance(moderator.id, period);

            res.json({
                moderator: this.sanitizeModeratorInfo(moderator),
                period: period,
                statistics: {
                    totalReviewed: stats.totalReviewed || 0,
                    approved: stats.approved || 0,
                    flagged: stats.flagged || 0,
                    editsSuggested: stats.editsSuggested || 0,
                    averageReviewTime: stats.averageReviewTime || 0,
                    accuracyScore: performance.accuracyScore,
                    responseTime: performance.averageResponseTime,
                    educationalValue: performance.educationalValueScore
                },
                recentActivity: this.getRecentModeratorActivity(moderator.id, 10)
            });

        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch performance data', message: error.message });
        }
    }

    /**
     * Utility methods
     */
    generateId() {
        return 'mod_' + crypto.randomBytes(8).toString('hex');
    }

    findModeratorByUsername(username, type) {
        const collection = type === 'professional' ? this.professionals : this.moderators;
        return Array.from(collection.values()).find(m => m.username === username);
    }

    verifyPassword(password, hash) {
        // Mock password verification - use proper bcrypt in production
        return crypto.createHash('sha256').update(password).digest('hex') === hash;
    }

    sanitizeModeratorInfo(moderator) {
        return {
            id: moderator.id,
            username: moderator.username,
            displayName: moderator.displayName,
            type: moderator.type,
            role: moderator.role,
            specializations: moderator.specializations,
            institution: moderator.institution,
            isActive: moderator.isActive,
            lastLogin: moderator.lastLogin,
            statistics: {
                totalReviewed: moderator.statistics?.totalReviewed || 0,
                averageRating: moderator.statistics?.averageRating || 0
            }
        };
    }

    sanitizeQueueItem(item) {
        return {
            id: item.id,
            contentId: item.contentId,
            contentType: item.contentType,
            category: item.category,
            riskScore: item.riskScore,
            priority: item.priority,
            status: item.status,
            createdAt: item.createdAt,
            assignedTo: item.assignedTo,
            assignedAt: item.assignedAt,
            reviewDeadline: item.reviewDeadline,
            title: item.title,
            contentPreview: item.content?.substring(0, 200) + (item.content?.length > 200 ? '...' : ''),
            flags: item.flags,
            educationalNotes: item.educationalNotes,
            workflowType: item.workflowType
        };
    }

    async getModeratorQueueCount(moderator) {
        return Array.from(this.moderationQueue.values()).filter(item => 
            item.assignedTo === moderator.id || 
            (item.status === 'pending' && item.riskScore <= this.roles[moderator.role].maxRiskLevel)
        ).length;
    }

    getReviewTimeout(workflowType, moderatorRole) {
        const workflow = this.workflows[workflowType] || this.workflows.STANDARD_REVIEW;
        
        switch (moderatorRole) {
            case 'STUDENT_MODERATOR':
                return workflow.timeouts.student_review;
            case 'SENIOR_STUDENT_MODERATOR':
                return workflow.timeouts.senior_student_review || workflow.timeouts.student_review;
            case 'PROFESSIONAL_OVERSIGHT':
                return workflow.timeouts.professional_oversight;
            default:
                return 4 * 60 * 60 * 1000; // 4 hours default
        }
    }

    updateModeratorStats(moderatorId, action, riskScore) {
        if (!this.moderationStats.has(moderatorId)) {
            this.moderationStats.set(moderatorId, {
                totalReviewed: 0,
                approved: 0,
                flagged: 0,
                editsSuggested: 0,
                averageRiskScore: 0
            });
        }

        const stats = this.moderationStats.get(moderatorId);
        stats.totalReviewed++;
        stats[action === 'approve' ? 'approved' : action === 'flag' ? 'flagged' : 'editsSuggested']++;
        stats.averageRiskScore = (stats.averageRiskScore * (stats.totalReviewed - 1) + riskScore) / stats.totalReviewed;
    }

    calculateModeratorPerformance(moderatorId, period) {
        // Mock performance calculation - implement proper analytics in production
        return {
            accuracyScore: 0.85 + Math.random() * 0.1,
            averageResponseTime: Math.floor(Math.random() * 120 + 30), // minutes
            educationalValueScore: 0.8 + Math.random() * 0.15
        };
    }

    getRecentModeratorActivity(moderatorId, limit) {
        return Array.from(this.moderationActions.values())
            .filter(action => action.moderatorId === moderatorId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    async notifyOversightTeam(escalation) {
        // Mock notification - implement real notifications in production
        console.log(`[Moderator Dashboard] Escalation created: ${escalation.id}`);
    }

    /**
     * Load initial test data
     */
    loadInitialData() {
        // Sample student moderators
        const studentMod1 = {
            id: 'mod_001',
            username: 'cambridge_llb_2024',
            displayName: 'LLB Student - Cambridge',
            passwordHash: crypto.createHash('sha256').update('student123').digest('hex'),
            type: 'student',
            role: 'STUDENT_MODERATOR',
            institution: 'University of Cambridge',
            degree: 'LLB',
            yearOfStudy: 2,
            specializations: ['banking', 'consumer'],
            isActive: true,
            verificationStatus: 'verified',
            createdAt: new Date(),
            statistics: { totalReviewed: 45, averageRating: 4.2 }
        };

        const studentMod2 = {
            id: 'mod_002',
            username: 'oxford_llb_2023',
            displayName: 'LLB Student - Oxford',
            passwordHash: crypto.createHash('sha256').update('student123').digest('hex'),
            type: 'student',
            role: 'SENIOR_STUDENT_MODERATOR',
            institution: 'University of Oxford',
            degree: 'LLB',
            yearOfStudy: 3,
            specializations: ['investment', 'ppi'],
            isActive: true,
            verificationStatus: 'verified',
            createdAt: new Date(),
            statistics: { totalReviewed: 89, averageRating: 4.5 }
        };

        this.moderators.set(studentMod1.id, studentMod1);
        this.moderators.set(studentMod2.id, studentMod2);

        // Sample professional oversight
        const professional = {
            id: 'prof_001',
            username: 'qualified_solicitor',
            displayName: 'Qualified Solicitor',
            passwordHash: crypto.createHash('sha256').update('professional123').digest('hex'),
            type: 'professional',
            role: 'PROFESSIONAL_OVERSIGHT',
            qualification: 'LLM, Solicitor (England & Wales)',
            registrationNumber: 'SRA123456',
            specializations: ['financial_services', 'consumer_protection'],
            isActive: true,
            verificationStatus: 'verified',
            createdAt: new Date(),
            statistics: { totalReviewed: 234, averageRating: 4.8 }
        };

        this.professionals.set(professional.id, professional);

        // Sample moderation queue items
        const queueItem = {
            id: 'queue_001',
            contentId: 'post_001',
            contentType: 'post',
            title: 'Bank charged me £200 for overdraft',
            content: 'I went £5 over my overdraft limit and was charged £200. What should I do?',
            category: 'banking',
            riskScore: 0.4,
            priority: 2,
            status: 'pending',
            createdAt: new Date(),
            flags: ['advice_seeking'],
            workflowType: 'STANDARD_REVIEW'
        };

        this.moderationQueue.set(queueItem.id, queueItem);

        console.log('[Moderator Dashboard] Initial data loaded');
    }
}

module.exports = ModeratorDashboardBackend;