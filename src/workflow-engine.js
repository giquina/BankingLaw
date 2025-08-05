/**
 * JuriBank Guided Workflow Engine v3.0
 * Comprehensive multi-path workflow system with state management
 * Educational platform - guides users through legal processes step-by-step
 */

class WorkflowEngine {
    constructor(options = {}) {
        this.sessionId = options.sessionId || this.generateSessionId();
        this.persistenceLayer = options.persistenceLayer || 'localStorage';
        this.currentWorkflow = null;
        this.currentStep = null;
        this.workflowState = {};
        this.eventListeners = {};
        this.analytics = new WorkflowAnalytics();
        
        // Initialize state management
        this.stateManager = new WorkflowStateManager({
            sessionId: this.sessionId,
            persistenceLayer: this.persistenceLayer,
            engine: this
        });
        
        this.init();
    }

    init() {
        this.loadWorkflowDefinitions();
        this.restoreSession();
        this.setupErrorHandling();
        this.setupPerformanceMonitoring();
    }

    /**
     * Load all workflow definitions from configuration
     */
    loadWorkflowDefinitions() {
        this.workflows = {
            'bank-charges': new BankChargesWorkflow(),
            'ppi-claims': new PPIClaimsWorkflow(),  
            'investment-issues': new InvestmentIssuesWorkflow(),
            'mortgage-problems': new MortgageProblemsWorkflow()
        };
    }

    /**
     * Start a new workflow journey
     */
    async startWorkflow(workflowType, initialData = {}) {
        try {
            if (!this.workflows[workflowType]) {
                throw new WorkflowError(`Unknown workflow type: ${workflowType}`);
            }

            this.currentWorkflow = this.workflows[workflowType];
            this.workflowState = {
                type: workflowType,
                startTime: new Date().toISOString(),
                currentStepId: null,
                stepHistory: [],
                userData: initialData,
                completedSteps: [],
                milestones: [],
                sessionId: this.sessionId
            };

            // Start with first step
            const firstStep = this.currentWorkflow.getFirstStep();
            await this.navigateToStep(firstStep.id);

            this.analytics.trackWorkflowStart(workflowType, this.sessionId);
            this.emit('workflowStarted', { workflowType, sessionId: this.sessionId });

            return {
                success: true,
                workflowType,
                sessionId: this.sessionId,
                currentStep: firstStep
            };
        } catch (error) {
            this.handleError('startWorkflow', error);
            throw error;
        }
    }

    /**
     * Navigate to a specific step in the workflow
     */
    async navigateToStep(stepId, data = {}) {
        try {
            if (!this.currentWorkflow) {
                throw new WorkflowError('No active workflow found');
            }

            const step = this.currentWorkflow.getStep(stepId);
            if (!step) {
                throw new WorkflowError(`Step not found: ${stepId}`);
            }

            // Validate step transition
            if (!this.canNavigateToStep(stepId)) {
                throw new WorkflowError(`Cannot navigate to step: ${stepId}`);
            }

            // Mark previous step as completed if transitioning forward
            if (this.currentStep && this.isForwardNavigation(stepId)) {
                this.markStepCompleted(this.currentStep.id, data);
            }

            // Update state
            const previousStepId = this.workflowState.currentStepId;
            this.workflowState.currentStepId = stepId;
            this.workflowState.stepHistory.push({
                stepId,
                timestamp: new Date().toISOString(),
                data: data
            });

            this.currentStep = step;

            // Handle conditional logic
            const conditionalStep = await this.evaluateConditionalLogic(step, data);
            if (conditionalStep && conditionalStep.id !== stepId) {
                return this.navigateToStep(conditionalStep.id, data);
            }

            // Save state
            await this.stateManager.saveState(this.workflowState);

            // Check for milestones
            this.checkMilestones();

            // Track analytics
            this.analytics.trackStepNavigation(
                this.workflowState.type, 
                stepId, 
                previousStepId,
                this.sessionId
            );

            this.emit('stepChanged', { 
                currentStep: step, 
                previousStepId, 
                workflowState: this.workflowState 
            });

            return {
                success: true,
                step: step,
                workflowState: this.workflowState
            };
        } catch (error) {
            this.handleError('navigateToStep', error);
            throw error;
        }
    }

    /**
     * Submit data for the current step and proceed
     */
    async submitStep(data) {
        try {
            if (!this.currentStep) {
                throw new WorkflowError('No current step to submit');
            }

            // Validate step data
            const validation = await this.currentStep.validate(data);
            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors,
                    step: this.currentStep
                };
            }

            // Process step data
            const processResult = await this.currentStep.process(data);
            
            // Update workflow state with processed data
            this.workflowState.userData = {
                ...this.workflowState.userData,
                [this.currentStep.id]: processResult
            };

            // Determine next step
            const nextStep = await this.currentWorkflow.getNextStep(
                this.currentStep.id, 
                this.workflowState.userData
            );

            if (nextStep) {
                return await this.navigateToStep(nextStep.id, data);
            } 
                // Workflow complete
                return await this.completeWorkflow();
            
        } catch (error) {
            this.handleError('submitStep', error);
            throw error;
        }
    }

    /**
     * Complete the current workflow
     */
    async completeWorkflow() {
        try {
            if (!this.currentWorkflow) {
                throw new WorkflowError('No active workflow to complete');
            }

            this.workflowState.completedAt = new Date().toISOString();
            this.workflowState.status = 'completed';

            // Generate workflow summary
            const summary = await this.currentWorkflow.generateSummary(this.workflowState);

            // Save final state
            await this.stateManager.saveState(this.workflowState);
            
            // Track completion
            this.analytics.trackWorkflowCompletion(
                this.workflowState.type,
                this.sessionId,
                this.workflowState.completedSteps.length
            );

            // Celebrate completion
            this.celebrateCompletion();

            this.emit('workflowCompleted', { 
                summary, 
                workflowState: this.workflowState 
            });

            return {
                success: true,
                status: 'completed',
                summary: summary,
                workflowState: this.workflowState
            };
        } catch (error) {
            this.handleError('completeWorkflow', error);
            throw error;
        }
    }

    /**
     * Pause current workflow and save state
     */
    async pauseWorkflow() {
        try {
            if (!this.currentWorkflow) {
                throw new WorkflowError('No active workflow to pause');
            }

            this.workflowState.status = 'paused';
            this.workflowState.pausedAt = new Date().toISOString();

            await this.stateManager.saveState(this.workflowState);

            this.emit('workflowPaused', { workflowState: this.workflowState });

            return {
                success: true,
                status: 'paused',
                sessionId: this.sessionId
            };
        } catch (error) {
            this.handleError('pauseWorkflow', error);
            throw error;
        }
    }

    /**
     * Resume a paused workflow
     */
    async resumeWorkflow(sessionId = null) {
        try {
            const targetSessionId = sessionId || this.sessionId;
            const savedState = await this.stateManager.loadState(targetSessionId);
            
            if (!savedState) {
                throw new WorkflowError('No saved workflow state found');
            }

            if (savedState.status === 'completed') {
                throw new WorkflowError('Cannot resume completed workflow');
            }

            // Restore workflow state
            this.workflowState = savedState;
            this.currentWorkflow = this.workflows[savedState.type];
            
            if (savedState.currentStepId) {
                this.currentStep = this.currentWorkflow.getStep(savedState.currentStepId);
            }

            this.workflowState.status = 'active';
            this.workflowState.resumedAt = new Date().toISOString();

            await this.stateManager.saveState(this.workflowState);

            this.emit('workflowResumed', { workflowState: this.workflowState });

            return {
                success: true,
                status: 'resumed',
                currentStep: this.currentStep,
                workflowState: this.workflowState
            };
        } catch (error) {
            this.handleError('resumeWorkflow', error);
            throw error;
        }
    }

    /**
     * Navigate backward to previous step
     */
    async goBack() {
        try {
            if (this.workflowState.stepHistory.length < 2) {
                throw new WorkflowError('Cannot go back further');
            }

            // Remove current step from history
            this.workflowState.stepHistory.pop();
            
            // Get previous step
            const previousEntry = this.workflowState.stepHistory[this.workflowState.stepHistory.length - 1];
            
            return await this.navigateToStep(previousEntry.stepId, previousEntry.data);
        } catch (error) {
            this.handleError('goBack', error);
            throw error;
        }
    }

    /**
     * Get workflow progress information
     */
    getProgress() {
        if (!this.currentWorkflow || !this.workflowState) {
            return { progress: 0, step: 0, total: 0 };
        }

        const totalSteps = this.currentWorkflow.getTotalSteps();
        const completedSteps = this.workflowState.completedSteps.length;
        const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

        return {
            progress: Math.round(progress),
            step: completedSteps + 1,
            total: totalSteps,
            milestones: this.workflowState.milestones,
            estimatedTimeRemaining: this.calculateEstimatedTime()
        };
    }

    /**
     * Evaluate conditional logic for step branching
     */
    async evaluateConditionalLogic(step, data) {
        if (!step.conditions || step.conditions.length === 0) {
            return null;
        }

        for (const condition of step.conditions) {
            const result = await condition.evaluate(this.workflowState.userData, data);
            if (result.matches) {
                const targetStep = this.currentWorkflow.getStep(result.targetStepId);
                if (targetStep) {
                    return targetStep;
                }
            }
        }

        return null;
    }

    /**
     * Check if user can navigate to specific step
     */
    canNavigateToStep(stepId) {
        if (!this.currentWorkflow) {return false;}
        
        const step = this.currentWorkflow.getStep(stepId);
        if (!step) {return false;}

        // Check prerequisites
        if (step.prerequisites) {
            return step.prerequisites.every(prereq => 
                this.workflowState.completedSteps.includes(prereq)
            );
        }

        return true;
    }

    /**
     * Check if navigation is forward
     */
    isForwardNavigation(stepId) {
        if (!this.currentStep) {return true;}
        
        const currentIndex = this.currentWorkflow.getStepIndex(this.currentStep.id);
        const targetIndex = this.currentWorkflow.getStepIndex(stepId);
        
        return targetIndex > currentIndex;
    }

    /**
     * Mark step as completed
     */
    markStepCompleted(stepId, data) {
        if (!this.workflowState.completedSteps.includes(stepId)) {
            this.workflowState.completedSteps.push(stepId);
            this.workflowState.stepCompletionData = {
                ...this.workflowState.stepCompletionData,
                [stepId]: {
                    completedAt: new Date().toISOString(),
                    data: data
                }
            };
        }
    }

    /**
     * Check for milestone achievements
     */
    checkMilestones() {
        const milestones = this.currentWorkflow.getMilestones();
        
        milestones.forEach(milestone => {
            if (!this.workflowState.milestones.find(m => m.id === milestone.id)) {
                if (milestone.condition(this.workflowState)) {
                    this.workflowState.milestones.push({
                        ...milestone,
                        achievedAt: new Date().toISOString()
                    });
                    this.celebrateMilestone(milestone);
                }
            }
        });
    }

    /**
     * Calculate estimated time remaining
     */
    calculateEstimatedTime() {
        if (!this.currentWorkflow) {return null;}
        
        const totalSteps = this.currentWorkflow.getTotalSteps();
        const completedSteps = this.workflowState.completedSteps.length;
        const remainingSteps = totalSteps - completedSteps;
        
        // Average time per step based on workflow type
        const avgTimePerStep = this.currentWorkflow.getAverageStepTime();
        
        return remainingSteps * avgTimePerStep;
    }

    /**
     * Celebrate milestone achievement
     */
    celebrateMilestone(milestone) {
        this.emit('milestoneAchieved', { milestone });
        
        // Visual celebration could be implemented here
        console.log(`🎉 Milestone achieved: ${milestone.title}`);
    }

    /**
     * Celebrate workflow completion
     */
    celebrateCompletion() {
        this.emit('celebrateCompletion', { workflowState: this.workflowState });
        
        // Confetti animation or similar could be triggered here
        console.log('🎊 Workflow completed! Congratulations!');
    }

    /**
     * Restore previous session
     */
    async restoreSession() {
        try {
            const savedState = await this.stateManager.loadState(this.sessionId);
            if (savedState && savedState.status !== 'completed') {
                await this.resumeWorkflow();
            }
        } catch (error) {
            console.warn('Could not restore previous session:', error.message);
        }
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError('globalError', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('unhandledRejection', event.reason);
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor step completion times
        this.on('stepChanged', (data) => {
            this.analytics.trackStepPerformance(
                this.workflowState.type,
                data.currentStep.id,
                performance.now()
            );
        });
    }

    /**
     * Handle errors with recovery strategies
     */
    handleError(context, error) {
        const errorInfo = {
            context,
            error: error.message || error,
            workflowType: this.workflowState?.type,
            stepId: this.currentStep?.id,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString()
        };

        console.error('Workflow Error:', errorInfo);
        
        // Track error in analytics
        this.analytics.trackError(errorInfo);

        // Emit error event for UI handling
        this.emit('error', errorInfo);

        // Attempt recovery based on error type
        this.attemptErrorRecovery(errorInfo);
    }

    /**
     * Attempt to recover from errors
     */
    async attemptErrorRecovery(errorInfo) {
        try {
            // Save current state before recovery attempt
            if (this.workflowState) {
                await this.stateManager.saveState(this.workflowState);
            }

            // Recovery strategies based on error context
            switch (errorInfo.context) {
                case 'navigateToStep':
                    // Try to reload current step
                    if (this.currentStep) {
                        this.emit('stepReload', { step: this.currentStep });
                    }
                    break;
                
                case 'submitStep':
                    // Keep user on current step with error message
                    this.emit('stepSubmissionError', { errors: [errorInfo.error] });
                    break;
                
                default:
                    // Generic recovery - try to restore last known good state
                    await this.restoreSession();
                    break;
            }
        } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
            this.emit('criticalError', { original: errorInfo, recovery: recoveryError });
        }
    }

    /**
     * Event system for workflow engine
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'workflow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get available workflows
     */
    getAvailableWorkflows() {
        return Object.keys(this.workflows).map(key => ({
            type: key,
            title: this.workflows[key].getTitle(),
            description: this.workflows[key].getDescription(),
            estimatedTime: this.workflows[key].getEstimatedTime(),
            difficulty: this.workflows[key].getDifficulty()
        }));
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.eventListeners = {};
        this.stateManager.destroy();
        this.analytics.destroy();
    }
}

/**
 * Custom error class for workflow-specific errors
 */
class WorkflowError extends Error {
    constructor(message, code = 'WORKFLOW_ERROR') {
        super(message);
        this.name = 'WorkflowError';
        this.code = code;
    }
}

// Export for use
window.WorkflowEngine = WorkflowEngine;
window.WorkflowError = WorkflowError;