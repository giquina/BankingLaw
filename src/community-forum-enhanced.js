/**
 * JuriBank Community Forum Enhanced Integration
 * Educational forum with real-time features, anonymous posting, and student moderation
 * Integrates with backend API and WebSocket for live updates
 */

class CommunityForumEnhanced {
    constructor() {
        this.apiEndpoint = '/api/community';
        this.wsEndpoint = window.location.protocol === 'https:' ? 'wss:' : 'ws:' + '//' + window.location.host + '/ws';
        this.socket = null;
        this.currentUser = null;
        this.currentCategory = 'all';
        this.posts = new Map();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        
        // Forum state management
        this.forumState = {
            activeUsers: 0,
            totalPosts: 0,
            categories: new Map(),
            moderation: {
                pendingPosts: 0,
                flaggedPosts: 0,
                activeWarnings: 0
            }
        };
        
        // Educational guidelines
        this.educationalGuidelines = {
            postLength: { min: 10, max: 5000 },
            dailyPostLimit: 10,
            contentTypes: ['question', 'experience-sharing', 'educational', 'resource-request'],
            forbiddenContent: ['specific-legal-advice', 'soliciting-clients', 'spam', 'off-topic'],
            moderationRules: {
                autoFlag: ['specific legal advice', 'solicitor recommendation', 'fee discussion'],
                requireReview: ['complex cases', 'multiple bank disputes', 'court proceedings']
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupWebSocket();
        this.setupEventListeners();
        this.loadUserProfile();
        this.loadForumContent();
        this.initializeRealTimeFeatures();
        this.setupContentFilters();
        this.setupModerationTools();
    }
    
    async setupWebSocket() {
        if (!WebSocket) {
            console.warn('WebSocket not supported, using fallback polling');
            this.setupPolling();
            return;
        }
        
        try {
            this.socket = new WebSocket(this.wsEndpoint);
            
            this.socket.onopen = () => {
                console.log('Forum WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.sendMessage('join_forum', { category: this.currentCategory });
                this.updateConnectionStatus(true);
            };
            
            this.socket.onmessage = (event) => {
                this.handleWebSocketMessage(JSON.parse(event.data));
            };
            
            this.socket.onclose = () => {
                console.log('Forum WebSocket disconnected');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            };
            
            this.socket.onerror = (error) => {
                console.error('Forum WebSocket error:', error);
                this.updateConnectionStatus(false);
            };
            
        } catch (error) {
            console.error('Failed to setup WebSocket:', error);
            this.setupPolling();
        }
    }
    
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'new_post':
                this.handleNewPost(data.payload);
                break;
            case 'post_update':
                this.handlePostUpdate(data.payload);
                break;
            case 'user_count':
                this.updateUserCount(data.payload.count);
                break;
            case 'moderation_alert':
                this.handleModerationAlert(data.payload);
                break;
            case 'forum_stats':
                this.updateForumStats(data.payload);
                break;
            case 'educational_tip':
                this.showEducationalTip(data.payload);
                break;
            default:
                console.log('Unknown WebSocket message:', data);
        }
    }
    
    sendMessage(type, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }));
        }
    }
    
    setupEventListeners() {
        // Post creation
        const newPostBtn = document.getElementById('new-post-btn');
        if (newPostBtn) {
            newPostBtn.addEventListener('click', () => this.showPostComposer());
        }
        
        // Category filtering
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchCategory(e.currentTarget.dataset.category));
        });
        
        // Search functionality
        const searchInput = document.getElementById('forum-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Real-time reactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-reaction]')) {
                this.handleReaction(e.target);
            }
        });
        
        // Moderation actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-moderate]')) {
                this.handleModeration(e.target);
            }
        });
        
        // Anonymous posting toggle
        const anonToggle = document.getElementById('anonymous-toggle');
        if (anonToggle) {
            anonToggle.addEventListener('change', (e) => this.toggleAnonymousMode(e.target.checked));
        }
    }
    
    async loadUserProfile() {
        try {
            // Check for existing anonymous session
            const sessionId = localStorage.getItem('forumSessionId');
            if (sessionId) {
                const response = await this.apiCall('/user/session', { sessionId });
                this.currentUser = response.user;
            } else {
                // Create anonymous session
                const response = await this.apiCall('/user/anonymous');
                this.currentUser = response.user;
                localStorage.setItem('forumSessionId', response.sessionId);
            }
            
            this.updateUserInterface();
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            this.createGuestSession();
        }
    }
    
    createGuestSession() {
        this.currentUser = {
            id: 'guest_' + Date.now(),
            isAnonymous: true,
            username: 'Anonymous',
            role: 'student',
            postCount: 0,
            reputation: 0,
            badges: []
        };
        this.updateUserInterface();
    }
    
    updateUserInterface() {
        // Update user info display
        const userInfo = document.getElementById('user-info');
        if (userInfo && this.currentUser) {
            userInfo.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-student-blue rounded-full flex items-center justify-center">
                        <i class="fas fa-user-secret text-white text-sm"></i>
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${this.currentUser.username}</p>
                        <p class="text-sm text-gray-500">${this.currentUser.role === 'moderator' ? 'Student Moderator' : 'Community Member'}</p>
                    </div>
                    ${this.currentUser.role === 'moderator' ? '<span class="moderator-badge text-white text-xs px-2 py-1 rounded-full">Moderator</span>' : ''}
                </div>
            `;
        }
        
        // Show/hide moderation tools
        const moderationTools = document.querySelectorAll('.moderation-tool');
        moderationTools.forEach(tool => {
            tool.style.display = this.currentUser?.role === 'moderator' ? 'block' : 'none';
        });
    }
    
    async loadForumContent() {
        try {
            const response = await this.apiCall(`/posts/${this.currentCategory}?limit=20`);
            this.renderPosts(response.posts);
            this.updateForumStats(response.stats);
        } catch (error) {
            console.error('Error loading forum content:', error);
            this.showError('Unable to load forum content');
        }
    }
    
    renderPosts(posts) {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;
        
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = this.renderEmptyState();
            return;
        }
        
        const postsHTML = posts.map(post => this.renderPostCard(post)).join('');
        postsContainer.innerHTML = postsHTML;
        
        // Store posts for reference
        posts.forEach(post => this.posts.set(post.id, post));
        
        // Setup post interactions
        this.setupPostInteractions();
    }
    
    renderPostCard(post) {
        const timeAgo = this.formatTimeAgo(post.createdAt);
        const authorDisplay = post.isAnonymous ? 'Anonymous Student' : (post.author?.username || 'Unknown');
        const categoryColor = this.getCategoryColor(post.category);
        
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 post-item" data-post-id="${post.id}">
                <!-- Post Header -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-${post.isAnonymous ? 'user-secret' : 'user'} text-gray-500"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <p class="font-medium text-gray-900">${authorDisplay}</p>
                                ${post.author?.role === 'moderator' ? '<span class="moderator-badge text-white text-xs px-2 py-1 rounded-full">Moderator</span>' : ''}
                                ${post.author?.verified ? '<i class="fas fa-check-circle text-blue-500 text-sm" title="Verified Student"></i>' : ''}
                            </div>
                            <div class="flex items-center space-x-2 text-sm text-gray-500">
                                <span>${timeAgo}</span>
                                <span>•</span>
                                <span class="inline-block px-2 py-1 ${categoryColor} text-xs rounded-full">
                                    ${this.formatCategoryName(post.category)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Post Actions -->
                    <div class="flex items-center space-x-2">
                        ${this.currentUser?.role === 'moderator' ? `
                            <button class="text-gray-400 hover:text-red-500 moderation-tool" data-moderate="flag" data-post-id="${post.id}" title="Flag post">
                                <i class="fas fa-flag text-sm"></i>
                            </button>
                        ` : ''}
                        <button class="text-gray-400 hover:text-gray-600" onclick="forumEnhanced.reportPost('${post.id}')" title="Report">
                            <i class="fas fa-exclamation-triangle text-sm"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Post Content -->
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">${post.title}</h3>
                    <div class="text-gray-700 post-content">
                        ${this.formatPostContent(post.content)}
                    </div>
                    
                    ${post.tags ? `
                        <div class="flex flex-wrap gap-2 mt-3">
                            ${post.tags.map(tag => `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <!-- Educational Notice (if needed) -->
                ${this.needsEducationalNotice(post) ? `
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div class="flex items-start">
                            <i class="fas fa-graduation-cap text-yellow-600 mr-2 mt-0.5"></i>
                            <div class="text-sm text-yellow-800">
                                <strong>Educational Reminder:</strong> This discussion is for learning purposes. 
                                For specific legal advice about your situation, please consult with a qualified solicitor.
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Post Footer -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center space-x-4">
                        <!-- Reactions -->
                        <button class="flex items-center space-x-1 text-gray-500 hover:text-green-600 reaction-btn" 
                                data-reaction="helpful" data-post-id="${post.id}">
                            <i class="fas fa-thumbs-up text-sm"></i>
                            <span class="text-sm">${post.reactions?.helpful || 0}</span>
                        </button>
                        
                        <button class="flex items-center space-x-1 text-gray-500 hover:text-blue-600 reaction-btn" 
                                data-reaction="insightful" data-post-id="${post.id}">
                            <i class="fas fa-lightbulb text-sm"></i>
                            <span class="text-sm">${post.reactions?.insightful || 0}</span>
                        </button>
                        
                        <!-- Reply Button -->
                        <button class="flex items-center space-x-1 text-gray-500 hover:text-student-blue" 
                                onclick="forumEnhanced.replyToPost('${post.id}')">
                            <i class="fas fa-reply text-sm"></i>
                            <span class="text-sm">Reply (${post.replyCount || 0})</span>
                        </button>
                    </div>
                    
                    <!-- Share -->
                    <button class="text-gray-400 hover:text-gray-600" onclick="forumEnhanced.sharePost('${post.id}')" title="Share">
                        <i class="fas fa-share text-sm"></i>
                    </button>
                </div>
                
                <!-- Replies Section (collapsed by default) -->
                <div class="replies-section mt-4 hidden" id="replies-${post.id}">
                    <div class="border-l-2 border-gray-200 pl-4 space-y-3">
                        <!-- Replies will be loaded here -->
                    </div>
                </div>
            </div>
        `;
    }
    
    formatPostContent(content) {
        // Educational content formatting with safety measures
        if (!content) return '';
        
        // Escape HTML but preserve formatting
        const escaped = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // Convert line breaks to paragraphs
        const paragraphed = escaped.split('\n\n').map(para => 
            para.trim() ? `<p class="mb-2">${para.replace(/\n/g, '<br>')}</p>` : ''
        ).join('');
        
        return paragraphed || '<p>No content</p>';
    }
    
    needsEducationalNotice(post) {
        const content = post.content?.toLowerCase() || '';
        const title = post.title?.toLowerCase() || '';
        
        // Check for content that might need educational reminder
        const triggers = [
            'should i', 'what should', 'legal advice', 'solicitor', 'lawyer',
            'sue', 'court', 'claim', 'compensation', 'what to do'
        ];
        
        return triggers.some(trigger => content.includes(trigger) || title.includes(trigger));
    }
    
    getCategoryColor(category) {
        const colors = {
            'banking-disputes': 'bg-blue-100 text-blue-800',
            'ppi-claims': 'bg-green-100 text-green-800',
            'investment-issues': 'bg-purple-100 text-purple-800',
            'general-questions': 'bg-gray-100 text-gray-800',
            'success-stories': 'bg-yellow-100 text-yellow-800',
            'educational-resources': 'bg-orange-100 text-orange-800'
        };
        
        return colors[category] || 'bg-gray-100 text-gray-800';
    }
    
    formatCategoryName(category) {
        const names = {
            'banking-disputes': 'Banking Disputes',
            'ppi-claims': 'PPI Claims',
            'investment-issues': 'Investment Issues',
            'general-questions': 'General Questions',
            'success-stories': 'Success Stories',
            'educational-resources': 'Educational Resources'
        };
        
        return names[category] || 'General';
    }
    
    showPostComposer() {
        // Create modal for post composition
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">New Forum Post</h2>
                        <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    ${this.renderPostComposer()}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.setupComposerEvents(modal);
    }
    
    renderPostComposer() {
        return `
            <form id="post-composer-form">
                <!-- Educational Guidelines -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 class="font-semibold text-blue-900 mb-2">Community Guidelines</h3>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>• Share experiences and ask educational questions</li>
                        <li>• Do not seek or provide specific legal advice</li>
                        <li>• Keep discussions respectful and educational</li>
                        <li>• Anonymous posting is available for privacy</li>
                    </ul>
                </div>
                
                <!-- Post Settings -->
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select name="category" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue">
                            <option value="">Select category...</option>
                            <option value="general-questions">General Questions</option>
                            <option value="banking-disputes">Banking Disputes</option>
                            <option value="ppi-claims">PPI Claims</option>
                            <option value="investment-issues">Investment Issues</option>
                            <option value="success-stories">Success Stories</option>
                            <option value="educational-resources">Educational Resources</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                        <div class="flex items-center space-x-4">
                            <label class="flex items-center">
                                <input type="radio" name="privacy" value="anonymous" checked class="mr-2">
                                <span class="text-sm">Anonymous</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="privacy" value="named" class="mr-2">
                                <span class="text-sm">Named</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Post Content -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input type="text" name="title" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue"
                           placeholder="Brief, descriptive title for your post...">
                    <div class="text-xs text-gray-500 mt-1">Avoid asking for specific legal advice in the title</div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea name="content" required rows="6"
                              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue"
                              placeholder="Share your experience, ask educational questions, or discuss general legal topics..."></textarea>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Focus on educational discussion rather than specific legal advice</span>
                        <span id="content-counter">0 / 5000</span>
                    </div>
                </div>
                
                <!-- Tags -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
                    <input type="text" name="tags" 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue"
                           placeholder="Enter tags separated by commas (e.g., bank-charges, overdraft, complaint)">
                    <div class="text-xs text-gray-500 mt-1">Tags help others find relevant discussions</div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Cancel
                    </button>
                    <button type="submit" class="px-6 py-2 bg-student-blue text-white rounded-lg hover:bg-blue-700 flex items-center">
                        <i class="fas fa-paper-plane mr-2"></i>
                        Post to Community
                    </button>
                </div>
            </form>
        `;
    }
    
    setupComposerEvents(modal) {
        const form = modal.querySelector('#post-composer-form');
        const contentTextarea = modal.querySelector('textarea[name="content"]');
        const counter = modal.querySelector('#content-counter');
        
        // Content counter
        if (contentTextarea && counter) {
            contentTextarea.addEventListener('input', (e) => {
                const length = e.target.value.length;
                counter.textContent = `${length} / 5000`;
                
                if (length > 5000) {
                    counter.style.color = 'red';
                } else if (length > 4500) {
                    counter.style.color = 'orange';
                } else {
                    counter.style.color = '';
                }
            });
        }
        
        // Form submission
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitPost(form, modal);
            });
        }
    }
    
    async submitPost(form, modal) {
        const formData = new FormData(form);
        const postData = {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            isAnonymous: formData.get('privacy') === 'anonymous',
            tags: formData.get('tags')?.split(',').map(tag => tag.trim()).filter(Boolean) || []
        };
        
        // Educational content validation
        const validation = this.validatePostContent(postData);
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }
        
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Posting...';
            submitBtn.disabled = true;
            
            const response = await this.apiCall('/posts', postData, 'POST');
            
            if (response.success) {
                modal.remove();
                this.showSuccessMessage('Post submitted successfully! It will appear after moderation review.');
                
                // Refresh posts
                this.loadForumContent();
                
                // Send real-time update if connected
                if (this.isConnected) {
                    this.sendMessage('new_post_notification', { postId: response.postId });
                }
            } else {
                throw new Error(response.message || 'Failed to submit post');
            }
            
        } catch (error) {
            console.error('Error submitting post:', error);
            this.showError(error.message || 'Failed to submit post. Please try again.');
        }
    }
    
    validatePostContent(postData) {
        const errors = [];
        
        // Check for forbidden content
        const content = (postData.title + ' ' + postData.content).toLowerCase();
        
        if (content.includes('legal advice') || content.includes('what should i do legally')) {
            errors.push('Posts requesting specific legal advice are not permitted. Consider rephrasing as a general educational question.');
        }
        
        if (content.includes('solicitor recommendation') || content.includes('which lawyer')) {
            errors.push('We cannot recommend specific solicitors. You can ask about general qualification criteria instead.');
        }
        
        if (content.includes('my case') && (content.includes('sue') || content.includes('court'))) {
            errors.push('Please avoid discussing specific legal cases. Focus on educational aspects instead.');
        }
        
        // Check content length
        if (postData.content.length < this.educationalGuidelines.postLength.min) {
            errors.push(`Posts must be at least ${this.educationalGuidelines.postLength.min} characters long.`);
        }
        
        if (postData.content.length > this.educationalGuidelines.postLength.max) {
            errors.push(`Posts must be no more than ${this.educationalGuidelines.postLength.max} characters long.`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    showValidationErrors(errors) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4';
        errorContainer.innerHTML = `
            <h4 class="font-semibold text-red-900 mb-2">Please Review Your Post</h4>
            <ul class="text-sm text-red-800 space-y-1">
                ${errors.map(error => `<li>• ${error}</li>`).join('')}
            </ul>
        `;
        
        const form = document.getElementById('post-composer-form');
        if (form) {
            // Remove any existing error containers
            form.querySelectorAll('.bg-red-50').forEach(el => el.remove());
            // Add new error container at the top
            form.insertBefore(errorContainer, form.firstChild);
        }
    }
    
    async handleReaction(target) {
        const reaction = target.dataset.reaction;
        const postId = target.dataset.postId;
        
        if (!reaction || !postId) return;
        
        try {
            const response = await this.apiCall(`/posts/${postId}/react`, { reaction }, 'POST');
            
            if (response.success) {
                // Update UI immediately
                const countSpan = target.querySelector('span');
                if (countSpan) {
                    countSpan.textContent = response.newCount;
                }
                
                // Add visual feedback
                target.classList.add('text-green-600');
                setTimeout(() => {
                    target.classList.remove('text-green-600');
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error submitting reaction:', error);
        }
    }
    
    async replyToPost(postId) {
        // Show inline reply composer
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        const repliesSection = document.getElementById(`replies-${postId}`);
        
        if (!repliesSection) return;
        
        // Toggle visibility
        repliesSection.classList.toggle('hidden');
        
        if (!repliesSection.classList.contains('hidden')) {
            // Load existing replies
            await this.loadReplies(postId);
            
            // Add reply composer if not already present
            if (!repliesSection.querySelector('.reply-composer')) {
                const composer = document.createElement('div');
                composer.className = 'reply-composer bg-gray-50 rounded-lg p-4 mt-3';
                composer.innerHTML = this.renderReplyComposer(postId);
                repliesSection.appendChild(composer);
                
                this.setupReplyComposerEvents(composer, postId);
            }
        }
    }
    
    renderReplyComposer(postId) {
        return `
            <div class="bg-blue-50 rounded-lg p-3 mb-3 text-sm text-blue-800">
                <i class="fas fa-info-circle mr-2"></i>
                Keep replies educational and supportive. Avoid giving specific legal advice.
            </div>
            <form class="reply-form">
                <textarea name="content" rows="3" required
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-student-blue focus:border-student-blue"
                          placeholder="Share your thoughts or educational perspective..."></textarea>
                <div class="flex justify-end items-center mt-3 space-x-2">
                    <label class="flex items-center text-sm">
                        <input type="checkbox" name="anonymous" class="mr-2">
                        <span>Reply anonymously</span>
                    </label>
                    <button type="submit" class="bg-student-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                        <i class="fas fa-reply mr-1"></i>Reply
                    </button>
                </div>
            </form>
        `;
    }
    
    setupReplyComposerEvents(composer, postId) {
        const form = composer.querySelector('.reply-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitReply(form, postId);
            });
        }
    }
    
    async submitReply(form, postId) {
        const formData = new FormData(form);
        const replyData = {
            content: formData.get('content'),
            isAnonymous: formData.get('anonymous') === 'on',
            parentPostId: postId
        };
        
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Replying...';
            submitBtn.disabled = true;
            
            const response = await this.apiCall(`/posts/${postId}/replies`, replyData, 'POST');
            
            if (response.success) {
                // Clear form
                form.reset();
                
                // Reload replies
                await this.loadReplies(postId);
                
                this.showSuccessMessage('Reply posted successfully!');
            }
            
        } catch (error) {
            console.error('Error submitting reply:', error);
            this.showError('Failed to post reply. Please try again.');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-reply mr-1"></i>Reply';
            submitBtn.disabled = false;
        }
    }
    
    async loadReplies(postId) {
        try {
            const response = await this.apiCall(`/posts/${postId}/replies`);
            const repliesContainer = document.querySelector(`#replies-${postId} > div`);
            
            if (repliesContainer && response.replies) {
                const repliesHTML = response.replies.map(reply => this.renderReply(reply)).join('');
                repliesContainer.innerHTML = repliesHTML + repliesContainer.querySelector('.reply-composer')?.outerHTML || '';
            }
            
        } catch (error) {
            console.error('Error loading replies:', error);
        }
    }
    
    renderReply(reply) {
        const timeAgo = this.formatTimeAgo(reply.createdAt);
        const authorDisplay = reply.isAnonymous ? 'Anonymous' : (reply.author?.username || 'Unknown');
        
        return `
            <div class="bg-white rounded-lg p-4 mb-3" data-reply-id="${reply.id}">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center space-x-2">
                        <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-${reply.isAnonymous ? 'user-secret' : 'user'} text-gray-500 text-xs"></i>
                        </div>
                        <span class="font-medium text-gray-900 text-sm">${authorDisplay}</span>
                        ${reply.author?.role === 'moderator' ? '<span class="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded">Mod</span>' : ''}
                        <span class="text-xs text-gray-500">${timeAgo}</span>
                    </div>
                </div>
                <div class="text-gray-700 text-sm">
                    ${this.formatPostContent(reply.content)}
                </div>
                <div class="flex items-center space-x-3 mt-2">
                    <button class="flex items-center space-x-1 text-gray-500 hover:text-green-600 text-xs reaction-btn" 
                            data-reaction="helpful" data-reply-id="${reply.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${reply.reactions?.helpful || 0}</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    // Additional utility methods for the community forum...
    
    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
    
    async apiCall(endpoint, data = null, method = 'GET') {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': localStorage.getItem('forumSessionId')
            }
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(this.apiEndpoint + endpoint, options);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    }
    
    showError(message) {
        console.error(message);
        // Implement toast notification
    }
    
    showSuccessMessage(message) {
        console.log(message);
        // Implement success toast notification
    }
    
    renderEmptyState() {
        return `
            <div class="text-center py-12">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-comments text-gray-400 text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No discussions yet</h3>
                <p class="text-gray-600 mb-6">Be the first to start an educational discussion in this category!</p>
                <button onclick="forumEnhanced.showPostComposer()" class="bg-student-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-plus mr-2"></i>Start Discussion
                </button>
            </div>
        `;
    }
    
    updateConnectionStatus(isConnected) {
        // Update UI to show connection status
        const statusIndicator = document.getElementById('connection-status');
        if (statusIndicator) {
            statusIndicator.className = isConnected 
                ? 'w-2 h-2 bg-green-400 rounded-full' 
                : 'w-2 h-2 bg-red-400 rounded-full';
            statusIndicator.title = isConnected ? 'Connected' : 'Disconnected';
        }
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.setupWebSocket();
            }, 2000 * this.reconnectAttempts); // Exponential backoff
        }
    }
    
    // ... Additional methods for search, moderation, etc.
}

// Initialize enhanced community forum
let forumEnhanced;

document.addEventListener('DOMContentLoaded', () => {
    forumEnhanced = new CommunityForumEnhanced();
});

// Export for global access
if (typeof window !== 'undefined') {
    window.forumEnhanced = forumEnhanced;
}