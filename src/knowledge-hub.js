/**
 * JuriBank Knowledge Hub Frontend Integration
 * Interactive educational content browser with real-time API integration
 */

class KnowledgeHubUI {
    constructor() {
        this.api = new KnowledgeHubAPI();
        this.currentCategory = 'all';
        this.currentFilters = {};
        this.searchTimeout = null;
        this.contentContainer = null;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.initializeContentGrid();
        this.loadInitialContent();
        this.setupProgressiveSearch();
        this.setupContentUpdateNotifications();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Category filtering
        document.querySelectorAll('[data-filter]').forEach(element => {
            element.addEventListener('click', (e) => this.handleCategoryFilter(e));
        });
        
        // Content type filters
        document.querySelectorAll('[data-type]').forEach(element => {
            element.addEventListener('click', (e) => this.handleTypeFilter(e));
        });
    }
    
    setupMobileMenu() {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (toggleBtn && mobileMenu) {
            toggleBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    initializeContentGrid() {
        // Create or find the main content container
        this.contentContainer = document.getElementById('knowledge-content') || this.createContentContainer();
        
        // Add loading states
        this.createLoadingIndicator();
    }
    
    createContentContainer() {
        const container = document.createElement('div');
        container.id = 'knowledge-content';
        container.className = 'lg:col-span-3';
        
        const mainSection = document.querySelector('.grid.lg\\:grid-cols-4');
        if (mainSection) {
            mainSection.appendChild(container);
        }
        
        return container;
    }
    
    createLoadingIndicator() {
        const loadingHTML = `
            <div id="loading-indicator" class="hidden">
                <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-student-blue mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading educational content...</p>
                </div>
            </div>
        `;
        
        if (this.contentContainer) {
            this.contentContainer.insertAdjacentHTML('beforebegin', loadingHTML);
        }
    }
    
    async loadInitialContent() {
        this.showLoading(true);
        
        try {
            const content = await this.api.aggregateContent('all', 30);
            this.renderContent(content);
            this.updateStats();
        } catch (error) {
            console.error('Error loading initial content:', error);
            this.showError('Unable to load content. Please try refreshing the page.');
        } finally {
            this.showLoading(false);
        }
    }
    
    async handleSearch(query) {
        // Debounce search requests
        clearTimeout(this.searchTimeout);
        
        if (query.length < 2) {
            this.loadInitialContent();
            return;
        }
        
        this.searchTimeout = setTimeout(async () => {
            this.showLoading(true);
            
            try {
                const results = await this.api.searchContent(query, this.currentCategory, this.currentFilters);
                this.renderContent(results, query);
                this.highlightSearchTerms(query);
            } catch (error) {
                console.error('Search error:', error);
                this.showError('Search failed. Please try again.');
            } finally {
                this.showLoading(false);
            }
        }, 300);
    }
    
    async handleCategoryFilter(event) {
        event.preventDefault();
        
        const category = event.currentTarget.dataset.filter;
        this.currentCategory = category;
        
        // Update filter UI
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('filter-active');
        });
        event.currentTarget.classList.add('filter-active');
        
        // Load filtered content
        this.showLoading(true);
        try {
            const content = await this.api.aggregateContent(category, 50);
            this.renderContent(content);
        } catch (error) {
            console.error('Filter error:', error);
            this.showError('Unable to filter content. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    
    handleTypeFilter(event) {
        event.preventDefault();
        
        const type = event.currentTarget.dataset.type;
        
        if (this.currentFilters.type === type) {
            delete this.currentFilters.type;
            event.currentTarget.classList.remove('filter-active');
        } else {
            this.currentFilters.type = type;
            
            // Update UI
            document.querySelectorAll('[data-type]').forEach(btn => {
                btn.classList.remove('filter-active');
            });
            event.currentTarget.classList.add('filter-active');
        }
        
        // Reload with filters
        this.reloadWithCurrentFilters();
    }
    
    async reloadWithCurrentFilters() {
        this.showLoading(true);
        try {
            const searchQuery = document.getElementById('search-input')?.value || '';
            const content = searchQuery 
                ? await this.api.searchContent(searchQuery, this.currentCategory, this.currentFilters)
                : await this.api.aggregateContent(this.currentCategory, 50);
            
            this.renderContent(content, searchQuery);
        } catch (error) {
            console.error('Reload error:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    renderContent(content, searchQuery = '') {
        if (!this.contentContainer) return;
        
        if (!content || content.length === 0) {
            this.renderEmptyState(searchQuery);
            return;
        }
        
        const contentHTML = `
            <div class="space-y-6">
                ${this.renderContentHeader(content, searchQuery)}
                ${this.renderContentGrid(content)}
                ${this.renderPagination()}
            </div>
        `;
        
        this.contentContainer.innerHTML = contentHTML;
        this.attachContentEventListeners();
    }
    
    renderContentHeader(content, searchQuery) {
        const totalCount = content.length;
        const searchText = searchQuery ? ` for "${searchQuery}"` : '';
        const categoryText = this.currentCategory !== 'all' ? ` in ${this.currentCategory}` : '';
        
        return `
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Educational Resources</h2>
                    <p class="text-gray-600">${totalCount} resources found${searchText}${categoryText}</p>
                </div>
                <div class="flex items-center space-x-4">
                    <select id="sort-select" class="px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="relevance">Sort by Relevance</option>
                        <option value="date">Sort by Date</option>
                        <option value="type">Sort by Type</option>
                        <option value="source">Sort by Source</option>
                    </select>
                    <button id="refresh-btn" class="bg-student-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                        <i class="fas fa-sync-alt mr-2"></i>Refresh
                    </button>
                </div>
            </div>
        `;
    }
    
    renderContentGrid(content) {
        return `
            <div class="grid gap-6">
                ${content.map(item => this.renderContentCard(item)).join('')}
            </div>
        `;
    }
    
    renderContentCard(item) {
        const sourceIcon = this.getSourceIcon(item.source);
        const typeColor = this.getTypeColor(item.type);
        const levelBadge = this.getLevelBadge(item.educationalLevel);
        
        return `
            <div class="bg-white rounded-2xl shadow-lg p-6 card-hover" data-content-id="${item.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 ${sourceIcon.color} rounded-lg flex items-center justify-center">
                            <i class="fas fa-${sourceIcon.icon} text-white"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">${item.source}</p>
                            <span class="inline-block px-2 py-1 ${typeColor} text-xs rounded-full font-medium">
                                ${item.type || 'Guide'}
                            </span>
                        </div>
                    </div>
                    ${levelBadge}
                </div>
                
                <h3 class="text-xl font-semibold text-gray-900 mb-3">${item.title}</h3>
                <p class="text-gray-600 mb-4 line-clamp-3">${item.description}</p>
                
                ${this.renderContentPreview(item.content)}
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <span class="flex items-center">
                            <i class="fas fa-calendar-alt mr-1"></i>
                            ${this.formatDate(item.lastUpdated || item.publishDate)}
                        </span>
                        <span class="flex items-center">
                            <i class="fas fa-tags mr-1"></i>
                            ${item.tags ? item.tags.slice(0, 2).join(', ') : 'General'}
                        </span>
                    </div>
                    <button class="text-student-blue font-medium hover:text-blue-700 flex items-center read-more-btn" data-content-id="${item.id}">
                        Learn More
                        <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    renderContentPreview(content) {
        if (!content) return '';
        
        if (typeof content === 'string') {
            return `<div class="text-sm text-gray-600">${content.substring(0, 200)}...</div>`;
        }
        
        if (content.keyPoints && content.keyPoints.length > 0) {
            return `
                <div class="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 class="font-medium text-blue-900 mb-2">Key Points:</h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        ${content.keyPoints.slice(0, 3).map(point => 
                            `<li class="flex items-start">
                                <i class="fas fa-check-circle text-blue-600 mt-0.5 mr-2 flex-shrink-0"></i>
                                ${point}
                            </li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (content.overview) {
            return `<div class="text-sm text-gray-600 italic">${content.overview}</div>`;
        }
        
        return '';
    }
    
    getSourceIcon(source) {
        const icons = {
            'Gov.UK': { icon: 'landmark', color: 'bg-green-500' },
            'FCA': { icon: 'shield-alt', color: 'bg-blue-500' },
            'Financial Ombudsman Service': { icon: 'balance-scale', color: 'bg-purple-500' },
            'HMRC': { icon: 'receipt', color: 'bg-orange-500' }
        };
        
        return icons[source] || { icon: 'book', color: 'bg-gray-500' };
    }
    
    getTypeColor(type) {
        const colors = {
            'guide': 'bg-blue-100 text-blue-800',
            'regulation': 'bg-red-100 text-red-800',
            'case-study': 'bg-green-100 text-green-800',
            'template': 'bg-yellow-100 text-yellow-800',
            'news': 'bg-purple-100 text-purple-800'
        };
        
        return colors[type] || 'bg-gray-100 text-gray-800';
    }
    
    getLevelBadge(level) {
        if (!level) return '';
        
        const badges = {
            'beginner': '<span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Beginner</span>',
            'intermediate': '<span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Intermediate</span>',
            'advanced': '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Advanced</span>'
        };
        
        return badges[level] || '';
    }
    
    renderEmptyState(searchQuery) {
        const message = searchQuery 
            ? `No educational resources found for "${searchQuery}". Try adjusting your search terms.`
            : 'No educational resources available at this time.';
            
        this.contentContainer.innerHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-search text-gray-400 text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-4">No Resources Found</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <div class="space-y-3">
                    <button onclick="knowledgeHub.clearFilters()" class="bg-student-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Clear All Filters
                    </button>
                    <div class="text-sm text-gray-500">
                        Try searching for terms like "banking", "complaints", "PPI", or "investment"
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        // Simplified pagination for now - can be enhanced
        return `
            <div class="flex justify-center pt-8">
                <div class="bg-white rounded-2xl shadow-lg p-4">
                    <div class="flex items-center space-x-4">
                        <button class="px-4 py-2 text-gray-500 hover:text-student-blue disabled:opacity-50" disabled>
                            <i class="fas fa-chevron-left mr-1"></i>Previous
                        </button>
                        <span class="px-4 py-2 bg-student-blue text-white rounded-lg">1</span>
                        <button class="px-4 py-2 text-gray-500 hover:text-student-blue">
                            Next<i class="fas fa-chevron-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachContentEventListeners() {
        // Read more buttons
        document.querySelectorAll('.read-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contentId = e.currentTarget.dataset.contentId;
                this.showContentDetail(contentId);
            });
        });
        
        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }
        
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshContent());
        }
    }
    
    async showContentDetail(contentId) {
        // Create modal for detailed content view
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Educational Content</h2>
                        <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modal-content">
                        <div class="animate-pulse">
                            <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div class="h-32 bg-gray-200 rounded mb-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Load detailed content (in a real app, this would fetch from API)
        setTimeout(() => {
            const modalContent = modal.querySelector('#modal-content');
            modalContent.innerHTML = this.renderDetailedContent(contentId);
        }, 500);
    }
    
    renderDetailedContent(contentId) {
        // Simulate detailed content rendering
        return `
            <div class="prose max-w-none">
                <div class="bg-blue-50 rounded-lg p-4 mb-6">
                    <div class="flex items-center mb-2">
                        <i class="fas fa-graduation-cap text-blue-600 mr-2"></i>
                        <h3 class="font-semibold text-blue-900">Educational Purpose</h3>
                    </div>
                    <p class="text-blue-800 text-sm">
                        This content is provided for educational purposes by law students. 
                        It helps you understand your rights and options but does not constitute legal advice.
                    </p>
                </div>
                
                <h3>Understanding Your Rights</h3>
                <p>UK banking and financial law provides comprehensive protection for consumers. This educational resource explains the key principles and how they apply to your situation.</p>
                
                <h3>Key Learning Points</h3>
                <ul>
                    <li>Banks must treat customers fairly under FCA rules</li>
                    <li>You have the right to complain if service standards aren't met</li>
                    <li>The Financial Ombudsman Service provides free dispute resolution</li>
                    <li>Compensation schemes protect your money if firms fail</li>
                </ul>
                
                <h3>Next Steps for Learning</h3>
                <p>To deepen your understanding:</p>
                <ol>
                    <li>Read the relevant FCA guidance documents</li>
                    <li>Review case studies from the Ombudsman Service</li>
                    <li>Consider the practical implications for your situation</li>
                    <li>Seek professional advice if you need specific legal guidance</li>
                </ol>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <h4 class="font-semibold text-yellow-900 mb-2">Remember</h4>
                    <p class="text-yellow-800 text-sm">
                        This is educational content operated by law students. 
                        For specific legal advice about your situation, consult with a qualified solicitor.
                    </p>
                </div>
            </div>
        `;
    }
    
    highlightSearchTerms(query) {
        if (!query) return;
        
        const terms = query.toLowerCase().split(' ');
        const contentCards = document.querySelectorAll('[data-content-id]');
        
        contentCards.forEach(card => {
            const textElements = card.querySelectorAll('h3, p');
            textElements.forEach(element => {
                let html = element.innerHTML;
                terms.forEach(term => {
                    const regex = new RegExp(`(${term})`, 'gi');
                    html = html.replace(regex, '<mark class="search-highlight">$1</mark>');
                });
                element.innerHTML = html;
            });
        });
    }
    
    setupProgressiveSearch() {
        // Implement search suggestions and auto-complete
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-xl shadow-lg z-50 hidden';
        suggestionsContainer.id = 'search-suggestions';
        
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(suggestionsContainer);
        
        searchInput.addEventListener('input', (e) => {
            this.updateSearchSuggestions(e.target.value);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#search-input') && !e.target.closest('#search-suggestions')) {
                suggestionsContainer.classList.add('hidden');
            }
        });
    }
    
    updateSearchSuggestions(query) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;
        
        if (query.length < 2) {
            suggestionsContainer.classList.add('hidden');
            return;
        }
        
        const suggestions = [
            'banking charges', 'PPI claims', 'investment complaints', 'mortgage guidance',
            'consumer rights', 'FCA regulations', 'ombudsman decisions', 'compensation schemes'
        ].filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase()) && suggestion !== query
        );
        
        if (suggestions.length === 0) {
            suggestionsContainer.classList.add('hidden');
            return;
        }
        
        suggestionsContainer.innerHTML = suggestions.map(suggestion => 
            `<button class="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0" 
                     onclick="knowledgeHub.selectSuggestion('${suggestion}')">
                <i class="fas fa-search text-gray-400 mr-2"></i>${suggestion}
             </button>`
        ).join('');
        
        suggestionsContainer.classList.remove('hidden');
    }
    
    selectSuggestion(suggestion) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = suggestion;
            this.handleSearch(suggestion);
        }
        
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.add('hidden');
        }
    }
    
    setupContentUpdateNotifications() {
        // Listen for content updates
        window.addEventListener('knowledgeHubUpdate', (event) => {
            this.showUpdateNotification(event.detail.message);
        });
    }
    
    showUpdateNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-student-blue text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-sync-alt mr-2"></i>
                <span>${message}</span>
                <button onclick="knowledgeHub.refreshContent(); this.parentElement.parentElement.remove();" 
                        class="ml-4 bg-white bg-opacity-20 px-2 py-1 rounded text-xs hover:bg-opacity-30">
                    Refresh
                </button>
                <button onclick="this.parentElement.parentElement.remove();" 
                        class="ml-2 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(full)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 10000);
    }
    
    async refreshContent() {
        this.showLoading(true);
        try {
            await this.api.refreshAllContent();
            await this.loadInitialContent();
            this.showSuccessMessage('Content updated successfully!');
        } catch (error) {
            console.error('Refresh error:', error);
            this.showError('Failed to refresh content. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    
    async updateStats() {
        try {
            const stats = this.api.getContentStatistics();
            
            // Update the stats in the header
            const statsElements = document.querySelectorAll('[data-stat]');
            statsElements.forEach(element => {
                const statType = element.dataset.stat;
                if (stats[statType]) {
                    element.textContent = stats[statType];
                }
            });
        } catch (error) {
            console.error('Stats update error:', error);
        }
    }
    
    clearFilters() {
        this.currentCategory = 'all';
        this.currentFilters = {};
        
        // Reset UI
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('filter-active');
        });
        
        document.querySelector('[data-filter="all"]')?.classList.add('filter-active');
        
        // Clear search
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        
        this.loadInitialContent();
    }
    
    handleSort(sortType) {
        // Re-render current content with new sort order
        // This would be implemented based on the current content state
        console.log('Sorting by:', sortType);
    }
    
    showLoading(show) {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.toggle('hidden', !show);
        }
        this.isLoading = show;
    }
    
    showError(message) {
        console.error(message);
        // Could implement toast notifications here
    }
    
    showSuccessMessage(message) {
        console.log(message);
        // Could implement success toast notifications here
    }
    
    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }
}

// Initialize when DOM is loaded
let knowledgeHub;

document.addEventListener('DOMContentLoaded', () => {
    knowledgeHub = new KnowledgeHubUI();
});

// Export for global access
if (typeof window !== 'undefined') {
    window.knowledgeHub = knowledgeHub;
}