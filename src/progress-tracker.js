/**
 * Legal Task Progress Tracker Component
 * Visual progress tracking for banking disputes and regulatory applications
 */

class ProgressTracker {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.currentStep = options.currentStep || 1;
        this.caseType = options.caseType || 'banking-dispute';
        this.steps = this.getStepsForType(this.caseType);
        this.init();
    }

    getStepsForType(type) {
        const stepTemplates = {
            'banking-dispute': [
                {
                    id: 1,
                    title: 'Submitted',
                    description: 'Your case has been submitted to our system',
                    icon: '📝',
                    estimatedTime: '0 days',
                    details: 'Case details reviewed and assigned a reference number',
                    actions: ['View submission confirmation', 'Download receipt']
                },
                {
                    id: 2, 
                    title: 'Expert Review',
                    description: 'Law students are reviewing your case details',
                    icon: '👩‍🎓',
                    estimatedTime: '2-3 days',
                    details: 'Initial case assessment and legal pathway identification',
                    actions: ['View reviewer notes', 'Add additional documents']
                },
                {
                    id: 3,
                    title: 'In Progress',
                    description: 'Active work on your case documentation',
                    icon: '⚖️',
                    estimatedTime: '5-10 days',
                    details: 'Document preparation, evidence gathering, and legal research',
                    actions: ['Track document status', 'Schedule consultation', 'View progress updates']
                },
                {
                    id: 4,
                    title: 'External Review',
                    description: 'Pending with Financial Ombudsman or bank',
                    icon: '🏛️',
                    estimatedTime: '8-12 weeks',
                    details: 'Your case is with the relevant authority or institution',
                    actions: ['Check external status', 'View correspondence', 'Update contact details']
                },
                {
                    id: 5,
                    title: 'Resolved',
                    description: 'Case completed with outcome',
                    icon: '✅',
                    estimatedTime: 'Complete',
                    details: 'Final outcome received and documented',
                    actions: ['View final report', 'Download completion certificate', 'Provide feedback']
                }
            ]
        };
        
        return stepTemplates[type] || stepTemplates['banking-dispute'];
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const progressHTML = `
            <div class="progress-tracker-container">
                <div class="progress-header">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Case Progress Tracker</h3>
                    <p class="text-sm text-gray-600 mb-6">Track your legal case through each stage of the process</p>
                </div>
                
                <div class="progress-timeline">
                    ${this.steps.map((step, index) => this.renderStep(step, index)).join('')}
                </div>
                
                <div class="progress-info mt-6 p-4 bg-blue-50 rounded-lg">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="ml-3">
                            <h4 class="text-sm font-medium text-blue-800">Important Information</h4>
                            <p class="text-sm text-blue-700 mt-1">
                                This tracker shows educational guidance progress only. For legal advice about your specific situation, 
                                consult qualified solicitors. Times are estimates and may vary based on case complexity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = progressHTML;
    }

    renderStep(step, index) {
        const isActive = step.id === this.currentStep;
        const isCompleted = step.id < this.currentStep;
        const isPending = step.id > this.currentStep;
        
        let statusClass = 'pending';
        let statusIcon = '⏳';
        
        if (isCompleted) {
            statusClass = 'completed';
            statusIcon = '✓';
        } else if (isActive) {
            statusClass = 'active';
            statusIcon = '⚡';
        }

        return `
            <div class="progress-step ${statusClass}" data-step="${step.id}">
                <div class="step-indicator">
                    <div class="step-number">${step.icon}</div>
                    <div class="step-status">${statusIcon}</div>
                </div>
                
                <div class="step-content">
                    <div class="step-header">
                        <h4 class="step-title">${step.title}</h4>
                        <span class="step-time">${step.estimatedTime}</span>
                    </div>
                    
                    <p class="step-description">${step.description}</p>
                    
                    ${isActive ? `
                        <div class="step-details">
                            <p class="details-text">${step.details}</p>
                            <div class="step-actions">
                                ${step.actions.map(action => `
                                    <button class="action-button" data-action="${action}">
                                        ${action}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                ${index < this.steps.length - 1 ? '<div class="step-connector"></div>' : ''}
            </div>
        `;
    }

    attachEventListeners() {
        // Step click handlers
        this.container.querySelectorAll('.progress-step').forEach(step => {
            step.addEventListener('click', (e) => {
                const stepId = parseInt(e.currentTarget.dataset.step);
                this.showStepModal(stepId);
            });
        });

        // Action button handlers
        this.container.querySelectorAll('.action-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });
    }

    showStepModal(stepId) {
        const step = this.steps.find(s => s.id === stepId);
        if (!step) return;

        const modal = document.createElement('div');
        modal.className = 'step-modal-overlay';
        modal.innerHTML = `
            <div class="step-modal">
                <div class="modal-header">
                    <h3>${step.icon} ${step.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-content">
                    <p><strong>Description:</strong> ${step.description}</p>
                    <p><strong>Estimated Duration:</strong> ${step.estimatedTime}</p>
                    <p><strong>What happens:</strong> ${step.details}</p>
                    <div class="modal-actions">
                        <h4>Available Actions:</h4>
                        ${step.actions.map(action => `
                            <button class="modal-action-btn" data-action="${action}">
                                ${action}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    handleAction(action) {
        // Simulate action handling
        console.log(`Handling action: ${action}`);
        
        // You would implement actual functionality here
        const actionMap = {
            'View submission confirmation': () => this.showDocument('confirmation'),
            'Download receipt': () => this.downloadFile('receipt.pdf'),
            'View reviewer notes': () => this.showReviewerNotes(),
            'Add additional documents': () => this.openUploadDialog(),
            'Track document status': () => this.showDocumentStatus(),
            'Schedule consultation': () => this.openScheduler(),
            'View progress updates': () => this.showProgressLog(),
            'Check external status': () => this.checkExternalStatus(),
            'View correspondence': () => this.showCorrespondence(),
            'Update contact details': () => this.editContactInfo(),
            'View final report': () => this.showFinalReport(),
            'Download completion certificate': () => this.downloadCertificate(),
            'Provide feedback': () => this.openFeedbackForm()
        };

        const handler = actionMap[action];
        if (handler) {
            handler();
        }
    }

    // Utility methods for actions
    showDocument(type) {
        alert(`Opening ${type} document...`);
    }

    downloadFile(filename) {
        alert(`Downloading ${filename}...`);
    }

    showReviewerNotes() {
        alert('Opening reviewer notes...');
    }

    openUploadDialog() {
        alert('Opening document upload dialog...');
    }

    showDocumentStatus() {
        alert('Showing document preparation status...');
    }

    openScheduler() {
        alert('Opening consultation scheduler...');
    }

    showProgressLog() {
        alert('Showing detailed progress log...');
    }

    checkExternalStatus() {
        alert('Checking status with external authority...');
    }

    showCorrespondence() {
        alert('Opening correspondence history...');
    }

    editContactInfo() {
        alert('Opening contact information editor...');
    }

    showFinalReport() {
        alert('Opening final case report...');
    }

    downloadCertificate() {
        alert('Downloading completion certificate...');
    }

    openFeedbackForm() {
        alert('Opening feedback form...');
    }

    // Public method to update progress
    updateProgress(stepId) {
        this.currentStep = stepId;
        this.render();
        this.attachEventListeners();
    }
}

// CSS for the progress tracker
const progressTrackerCSS = `
<style>
.progress-tracker-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.progress-timeline {
    position: relative;
}

.progress-step {
    display: flex;
    margin-bottom: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 15px;
    border-radius: 8px;
}

.progress-step:hover {
    background-color: #f8fafc;
    transform: translateX(5px);
}

.progress-step.completed {
    opacity: 0.8;
}

.progress-step.active {
    background-color: #eff6ff;
    border: 2px solid #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.step-indicator {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-right: 20px;
    font-size: 24px;
    background: white;
    border: 3px solid #e5e7eb;
}

.progress-step.completed .step-indicator {
    border-color: #10b981;
    background-color: #ecfdf5;
}

.progress-step.active .step-indicator {
    border-color: #3b82f6;
    background-color: #dbeafe;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.step-status {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    border: 2px solid #e5e7eb;
}

.progress-step.completed .step-status {
    background-color: #10b981;
    color: white;
    border-color: #10b981;
}

.progress-step.active .step-status {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.step-content {
    flex-grow: 1;
}

.step-header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 8px;
}

.step-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-right: 10px;
}

.step-time {
    font-size: 12px;
    color: #6b7280;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.step-description {
    color: #6b7280;
    margin-bottom: 12px;
    line-height: 1.5;
}

.step-details {
    margin-top: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
}

.details-text {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 12px;
}

.step-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.action-button {
    padding: 6px 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.action-button:hover {
    background: #2563eb;
}

.step-connector {
    position: absolute;
    left: 29px;
    width: 2px;
    height: 40px;
    background: #e5e7eb;
    margin-top: -10px;
}

.progress-step.completed .step-connector {
    background: #10b981;
}

/* Modal Styles */
.step-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.step-modal {
    background: white;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
}

.close-modal {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
}

.modal-content {
    padding: 20px;
}

.modal-content p {
    margin-bottom: 12px;
    line-height: 1.6;
}

.modal-actions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
}

.modal-actions h4 {
    font-weight: 600;
    margin-bottom: 12px;
    color: #1f2937;
}

.modal-action-btn {
    display: block;
    width: 100%;
    padding: 8px 12px;
    margin-bottom: 8px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
}

.modal-action-btn:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
}

@media (max-width: 768px) {
    .progress-tracker-container {
        padding: 15px;
    }
    
    .step-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .step-time {
        margin-top: 4px;
    }
    
    .step-actions {
        flex-direction: column;
    }
    
    .action-button {
        width: 100%;
        text-align: center;
    }
}
</style>
`;

// Add CSS to page
document.head.insertAdjacentHTML('beforeend', progressTrackerCSS);

// Export for use
window.ProgressTracker = ProgressTracker;