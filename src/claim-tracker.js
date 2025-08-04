/**
 * JuriBank Claim Tracker Component
 * Interactive financial dispute progress tracking system for educational purposes
 */

class ClaimTracker {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            claimId: options.claimId || 'JB-2024-001',
            claimType: options.claimType || 'Bank Complaint',
            currentStage: options.currentStage || 2,
            totalStages: options.totalStages || 6,
            ...options
        };
        
        this.stages = [
            {
                id: 1,
                title: 'Claim Submitted',
                description: 'Your banking dispute has been received and case file created',
                status: 'completed',
                date: '2024-01-15',
                icon: 'file-text'
            },
            {
                id: 2,
                title: 'Initial Assessment',
                description: 'Our LLB student guides are reviewing your case details for learning purposes',
                status: 'current',
                date: '2024-01-16',
                icon: 'search'
            },
            {
                id: 3,
                title: 'Bank Contact',
                description: 'Formal complaint letter sent to your bank',
                status: 'pending',
                estimatedDate: '2024-01-18',
                icon: 'send'
            },
            {
                id: 4,
                title: 'Bank Response',
                description: 'Awaiting bank\'s formal response (8 weeks maximum)',
                status: 'pending',
                estimatedDate: '2024-03-15',
                icon: 'mail'
            },
            {
                id: 5,
                title: 'Ombudsman Referral',
                description: 'If needed, escalation to Financial Ombudsman Service',
                status: 'pending',
                estimatedDate: '2024-03-22',
                icon: 'scale'
            },
            {
                id: 6,
                title: 'Resolution',
                description: 'Final outcome and compensation (if awarded)',
                status: 'pending',
                estimatedDate: '2024-04-30',
                icon: 'check-circle'
            }
        ];

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('ClaimTracker: Container not found');
            return;
        }

        this.render();
        this.attachEventListeners();
        this.updateProgress();
    }

    render() {
        this.container.innerHTML = `
            <div class="claim-tracker-container" style="
                background: white;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(18, 18, 18, 0.1);
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
            ">
                <!-- Header -->
                <div class="tracker-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #F4F4F4;
                ">
                    <div>
                        <h3 style="
                            color: #121212;
                            font-size: 1.5rem;
                            font-weight: 600;
                            margin: 0 0 0.5rem 0;
                        ">Claim Progress Tracker</h3>
                        <p style="
                            color: #2D3748;
                            margin: 0;
                            font-size: 0.9rem;
                        ">Case ID: ${this.options.claimId} • ${this.options.claimType}</p>
                    </div>
                    <div class="progress-circle" style="
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: conic-gradient(#3A86FF ${this.getProgressPercentage()}%, #F4F4F4 0%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                    ">
                        <div style="
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            background: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 600;
                            color: #121212;
                        ">${Math.round(this.getProgressPercentage())}%</div>
                    </div>
                </div>

                <!-- Progress Timeline -->
                <div class="timeline-container">
                    ${this.renderTimeline()}
                </div>

                <!-- Action Buttons -->
                <div class="tracker-actions" style="
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #E5E7EB;
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                ">
                    <button class="btn-secondary" onclick="claimTracker.uploadDocument()" style="
                        padding: 0.75rem 1.5rem;
                        border: 2px solid #3A86FF;
                        background: white;
                        color: #3A86FF;
                        border-radius: 8px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">Upload Documents</button>
                    <button class="btn-primary" onclick="claimTracker.contactLawyer()" style="
                        padding: 0.75rem 1.5rem;
                        background: #3A86FF;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">Contact Your Lawyer</button>
                </div>

                <!-- Case Updates -->
                <div class="case-updates" style="
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: #F9FAFB;
                    border-radius: 12px;
                ">
                    <h4 style="
                        color: #121212;
                        font-size: 1.1rem;
                        font-weight: 600;
                        margin: 0 0 1rem 0;
                    ">Recent Updates</h4>
                    <div class="update-list">
                        ${this.renderUpdates()}
                    </div>
                </div>
            </div>
        `;
    }

    renderTimeline() {
        return this.stages.map((stage, index) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';
            const isPending = stage.status === 'pending';
            
            return `
                <div class="timeline-item" style="
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    position: relative;
                ">
                    <!-- Timeline Line -->
                    ${index < this.stages.length - 1 ? `
                        <div style="
                            position: absolute;
                            left: 20px;
                            top: 45px;
                            width: 2px;
                            height: 60px;
                            background: ${isCompleted || isCurrent ? '#3A86FF' : '#E5E7EB'};
                        "></div>
                    ` : ''}
                    
                    <!-- Stage Icon -->
                    <div class="stage-icon" style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: ${isCompleted ? '#0B8B6E' : isCurrent ? '#3A86FF' : '#E5E7EB'};
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 1rem;
                        flex-shrink: 0;
                        z-index: 1;
                        position: relative;
                    ">
                        ${this.getStageIcon(stage.icon, isCompleted)}
                    </div>
                    
                    <!-- Stage Content -->
                    <div class="stage-content" style="flex: 1;">
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            margin-bottom: 0.5rem;
                        ">
                            <h4 style="
                                color: ${isCompleted || isCurrent ? '#121212' : '#6B7280'};
                                font-size: 1.1rem;
                                font-weight: 600;
                                margin: 0;
                            ">${stage.title}</h4>
                            <span style="
                                color: #6B7280;
                                font-size: 0.875rem;
                                font-weight: 500;
                            ">${stage.date || stage.estimatedDate || ''}</span>
                        </div>
                        <p style="
                            color: ${isCompleted || isCurrent ? '#2D3748' : '#9CA3AF'};
                            margin: 0;
                            font-size: 0.9rem;
                            line-height: 1.5;
                        ">${stage.description}</p>
                        
                        ${isCurrent ? `
                            <div style="
                                margin-top: 0.75rem;
                                padding: 0.5rem 1rem;
                                background: rgba(58, 134, 255, 0.1);
                                border-left: 3px solid #3A86FF;
                                border-radius: 4px;
                            ">
                                <p style="
                                    margin: 0;
                                    font-size: 0.875rem;
                                    color: #3A86FF;
                                    font-weight: 500;
                                ">Currently in progress - Expected completion within 48 hours</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderUpdates() {
        const updates = [
            {
                date: '2024-01-16 14:30',
                message: 'Case assigned to Sarah Mitchell, Senior LLB Student Guide',
                type: 'info'
            },
            {
                date: '2024-01-16 09:15',
                message: 'Initial case assessment completed - Strong merit identified',
                type: 'success'
            },
            {
                date: '2024-01-15 16:45',
                message: 'Your banking dispute claim has been successfully submitted',
                type: 'info'
            }
        ];

        return updates.map(update => `
            <div class="update-item" style="
                display: flex;
                align-items: flex-start;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #E5E7EB;
            ">
                <div class="update-icon" style="
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${update.type === 'success' ? '#0B8B6E' : '#3A86FF'};
                    margin-right: 1rem;
                    margin-top: 0.5rem;
                    flex-shrink: 0;
                "></div>
                <div>
                    <p style="
                        margin: 0 0 0.25rem 0;
                        color: #121212;
                        font-size: 0.9rem;
                        line-height: 1.4;
                    ">${update.message}</p>
                    <span style="
                        color: #6B7280;
                        font-size: 0.8rem;
                    ">${update.date}</span>
                </div>
            </div>
        `).join('');
    }

    getStageIcon(iconType, isCompleted) {
        if (isCompleted) {
            return '✓';
        }
        
        const icons = {
            'file-text': '📄',
            'search': '🔍',
            'send': '📤',
            'mail': '📧',
            'scale': '⚖️',
            'check-circle': '✅'
        };
        
        return icons[iconType] || '•';
    }

    getProgressPercentage() {
        const completedStages = this.stages.filter(stage => stage.status === 'completed').length;
        const currentStageProgress = this.stages.some(stage => stage.status === 'current') ? 0.5 : 0;
        return ((completedStages + currentStageProgress) / this.stages.length) * 100;
    }

    attachEventListeners() {
        // Add hover effects for buttons
        const buttons = this.container.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 12px rgba(58, 134, 255, 0.3)';
            });
            
            button.addEventListener('mouseout', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        });
    }

    updateProgress() {
        // Simulate real-time updates (in production, this would connect to your backend)
        const updateInterval = setInterval(() => {
            // This is where you'd fetch real updates from your API
            // For demo purposes, we'll just update timestamps
        }, 30000); // Check for updates every 30 seconds
    }

    // Public methods for button actions
    uploadDocument() {
        alert('Document upload feature - In production, this would open a secure file upload interface');
    }

    contactLawyer() {
        alert('Contact lawyer feature - In production, this would open a secure messaging interface or schedule a call');
    }

    // Method to update claim status (would be called from your backend)
    updateClaimStatus(newStage, message) {
        this.stages.forEach(stage => {
            if (stage.id < newStage) {
                stage.status = 'completed';
            } else if (stage.id === newStage) {
                stage.status = 'current';
            } else {
                stage.status = 'pending';
            }
        });
        
        this.render();
        
        // Show notification
        this.showNotification(message || 'Your claim status has been updated');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0B8B6E;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Global reference for button callbacks
let claimTracker;

// Initialize when DOM is ready
function initClaimTracker(containerId, options = {}) {
    claimTracker = new ClaimTracker(containerId, options);
    return claimTracker;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClaimTracker, initClaimTracker };
}