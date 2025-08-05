/**
 * JuriBank Dynamic Form Engine v1.0
 * Advanced form system with adaptive behavior, progressive disclosure, and intelligent validation
 * 
 * Features:
 * - Adaptive forms that change based on user responses
 * - Progressive disclosure of relevant fields
 * - Smart defaults and pre-filling
 * - Real-time validation with instant feedback
 * - Cross-browser compatibility
 * - Performance-optimized rendering
 * - Mobile-first touch-friendly design
 * - Robust progress persistence
 * 
 * @author JuriBank Educational Initiative
 * @version 1.0.0
 */

class DynamicFormEngine {
    constructor(config) {
        this.config = {
            containerId: config.containerId,
            formSchema: config.formSchema,
            apiEndpoint: config.apiEndpoint || null,
            autoSave: config.autoSave !== false,
            autoSaveInterval: config.autoSaveInterval || 30000, // 30 seconds
            validationDelay: config.validationDelay || 300, // 300ms debounce
            animations: config.animations !== false,
            progressPersistence: config.progressPersistence !== false,
            crossBrowserPolyfills: config.crossBrowserPolyfills !== false,
            mobileOptimization: config.mobileOptimization !== false,
            performanceMode: config.performanceMode || 'balanced', // 'fast', 'balanced', 'comprehensive'
            ...config
        };

        // Core system properties
        this.container = null;
        this.currentStep = 1;
        this.totalSteps = 0;
        this.formData = {};
        this.validationErrors = {};
        this.conditionalLogic = {};
        this.smartDefaults = {};
        this.validationRules = {};
        this.uploadedFiles = [];
        
        // Performance optimization
        this.renderCache = new Map();
        this.validationCache = new Map();
        this.debounceTimers = new Map();
        
        // Progressive disclosure tracking
        this.visibleFields = new Set();
        this.hiddenFields = new Set();
        
        // Auto-save and persistence
        this.autoSaveTimer = null;
        this.lastSaveTime = null;
        this.isDirty = false;
        
        // Browser compatibility
        this.browserCapabilities = this.detectBrowserCapabilities();
        
        // Mobile optimization
        this.isMobile = this.detectMobileDevice();
        this.touchSupport = this.detectTouchSupport();
        
        // Initialize system
        this.init();
    }

    /**
     * Initialize the Dynamic Form Engine
     */
    async init() {
        try {
            // Validate configuration
            this.validateConfig();
            
            // Setup container
            this.setupContainer();
            
            // Load cross-browser polyfills if needed
            if (this.config.crossBrowserPolyfills) {
                await this.loadPolyfills();
            }
            
            // Parse form schema
            this.parseFormSchema();
            
            // Setup progressive disclosure logic
            this.setupProgressiveDisclosure();
            
            // Setup smart defaults
            this.setupSmartDefaults();
            
            // Setup validation rules
            this.setupValidationRules();
            
            // Load saved progress if available
            if (this.config.progressPersistence) {
                await this.loadSavedProgress();
            }
            
            // Initial render
            await this.render();
            
            // Attach event listeners
            this.attachEventListeners();
            
            // Start auto-save if enabled
            if (this.config.autoSave) {
                this.startAutoSave();
            }
            
            // Initialize mobile optimizations
            if (this.config.mobileOptimization && this.isMobile) {
                this.initializeMobileOptimizations();
            }
            
            // Performance monitoring
            this.initializePerformanceMonitoring();
            
            console.log('✅ JuriBank Dynamic Form Engine initialized successfully');
            
        } catch (error) {
            console.error('❌ Dynamic Form Engine initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Validate configuration parameters
     */
    validateConfig() {
        if (!this.config.containerId) {
            throw new Error('containerId is required');
        }
        
        if (!this.config.formSchema) {
            throw new Error('formSchema is required');
        }
        
        if (!document.getElementById(this.config.containerId)) {
            throw new Error(`Container element with ID '${this.config.containerId}' not found`);
        }
    }

    /**
     * Setup the form container
     */
    setupContainer() {
        this.container = document.getElementById(this.config.containerId);
        this.container.classList.add('dynamic-form-container');
        
        // Add responsive classes
        if (this.isMobile) {
            this.container.classList.add('mobile-optimized');
        }
        
        // Add performance mode class
        this.container.classList.add(`performance-${this.config.performanceMode}`);
    }

    /**
     * Load cross-browser polyfills
     */
    async loadPolyfills() {
        const polyfills = [];
        
        // Promise polyfill for older browsers
        if (!window.Promise) {
            polyfills.push(this.loadScript('https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js'));
        }
        
        // Fetch polyfill for older browsers
        if (!window.fetch) {
            polyfills.push(this.loadScript('https://cdn.jsdelivr.net/npm/whatwg-fetch@3/dist/fetch.umd.js'));
        }
        
        // IntersectionObserver polyfill for progressive loading
        if (!window.IntersectionObserver) {
            polyfills.push(this.loadScript('https://cdn.jsdelivr.net/npm/intersection-observer@0.12.0/intersection-observer.js'));
        }
        
        // Load all polyfills
        if (polyfills.length > 0) {
            await Promise.all(polyfills);
            console.log('✅ Browser polyfills loaded');
        }
    }

    /**
     * Load external script
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Parse form schema and extract configuration
     */
    parseFormSchema() {
        const schema = this.config.formSchema;
        
        // Extract steps
        this.totalSteps = schema.steps ? schema.steps.length : 1;
        
        // Extract conditional logic
        this.conditionalLogic = schema.conditionalLogic || {};
        
        // Extract smart defaults
        this.smartDefaults = schema.smartDefaults || {};
        
        // Extract validation rules
        this.validationRules = schema.validationRules || {};
        
        // Initialize visible fields for first step
        if (schema.steps && schema.steps[0]) {
            schema.steps[0].fields.forEach(field => {
                this.visibleFields.add(field.id);
            });
        }
    }

    /**
     * Setup progressive disclosure logic
     */
    setupProgressiveDisclosure() {
        // Process conditional logic rules
        Object.entries(this.conditionalLogic).forEach(([fieldId, conditions]) => {
            conditions.forEach(condition => {
                // Setup triggers for showing/hiding fields
                this.setupConditionalTrigger(fieldId, condition);
            });
        });
    }

    /**
     * Setup conditional trigger for progressive disclosure
     */
    setupConditionalTrigger(targetFieldId, condition) {
        const triggerField = condition.field;
        const operator = condition.operator; // 'equals', 'contains', 'greaterThan', etc.
        const value = condition.value;
        const action = condition.action; // 'show', 'hide', 'require', 'optional'
        
        // Store trigger mapping
        if (!this.progressiveDisclosureTriggers) {
            this.progressiveDisclosureTriggers = new Map();
        }
        
        if (!this.progressiveDisclosureTriggers.has(triggerField)) {
            this.progressiveDisclosureTriggers.set(triggerField, []);
        }
        
        this.progressiveDisclosureTriggers.get(triggerField).push({
            targetField: targetFieldId,
            operator,
            value,
            action
        });
    }

    /**
     * Setup smart defaults system
     */
    setupSmartDefaults() {
        // Process smart default configurations
        Object.entries(this.smartDefaults).forEach(([fieldId, defaultConfig]) => {
            this.setupSmartDefault(fieldId, defaultConfig);
        });
    }

    /**
     * Setup smart default for a specific field
     */
    setupSmartDefault(fieldId, config) {
        if (!this.smartDefaultsMap) {
            this.smartDefaultsMap = new Map();
        }
        
        this.smartDefaultsMap.set(fieldId, {
            type: config.type, // 'static', 'computed', 'api', 'historical'
            value: config.value,
            dependencies: config.dependencies || [],
            computeFunction: config.computeFunction,
            apiEndpoint: config.apiEndpoint,
            cacheTime: config.cacheTime || 300000 // 5 minutes default
        });
    }

    /**
     * Setup validation rules
     */
    setupValidationRules() {
        Object.entries(this.validationRules).forEach(([fieldId, rules]) => {
            this.setupFieldValidation(fieldId, rules);
        });
    }

    /**
     * Setup validation for a specific field
     */
    setupFieldValidation(fieldId, rules) {
        if (!this.fieldValidationRules) {
            this.fieldValidationRules = new Map();
        }
        
        this.fieldValidationRules.set(fieldId, {
            required: rules.required || false,
            minLength: rules.minLength,
            maxLength: rules.maxLength,
            pattern: rules.pattern,
            customValidator: rules.customValidator,
            realTimeValidation: rules.realTimeValidation !== false,
            validationDelay: rules.validationDelay || this.config.validationDelay
        });
    }

    /**
     * Load saved progress from storage
     */
    async loadSavedProgress() {
        if (!this.config.progressPersistence) {return;}
        
        try {
            const storageKey = `juribank-dynamic-form-${this.config.containerId}`;
            const savedData = localStorage.getItem(storageKey);
            
            if (savedData) {
                const parsed = JSON.parse(savedData);
                
                // Validate saved data integrity
                if (this.validateSavedData(parsed)) {
                    this.formData = parsed.formData || {};
                    this.currentStep = parsed.currentStep || 1;
                    this.uploadedFiles = parsed.uploadedFiles || [];
                    this.lastSaveTime = new Date(parsed.timestamp);
                    
                    console.log('✅ Progress restored from storage');
                    return true;
                }
            }
        } catch (error) {
            console.warn('⚠️ Failed to load saved progress:', error);
        }
        
        return false;
    }

    /**
     * Validate saved data integrity
     */
    validateSavedData(data) {
        // Check required properties
        if (!data.formData || !data.timestamp) {
            return false;
        }
        
        // Check if data is not too old (e.g., 7 days)
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const dataAge = Date.now() - new Date(data.timestamp).getTime();
        
        if (dataAge > maxAge) {
            console.log('🗑️ Saved data is too old, starting fresh');
            return false;
        }
        
        return true;
    }

    /**
     * Detect browser capabilities
     */
    detectBrowserCapabilities() {
        return {
            supportsES6: typeof Symbol !== 'undefined',
            supportsModules: 'noModule' in HTMLScriptElement.prototype,
            supportsIntersectionObserver: 'IntersectionObserver' in window,
            supportsResizeObserver: 'ResizeObserver' in window,
            supportsWebWorkers: typeof Worker !== 'undefined',
            supportsLocalStorage: this.testLocalStorage(),
            supportsSessionStorage: this.testSessionStorage(),
            supportsFetch: typeof fetch !== 'undefined',
            supportsPromises: typeof Promise !== 'undefined'
        };
    }

    /**
     * Test localStorage availability
     */
    testLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Test sessionStorage availability
     */
    testSessionStorage() {
        try {
            const test = '__sessionStorage_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Detect mobile device
     */
    detectMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    /**
     * Detect touch support
     */
    detectTouchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    /**
     * Render the current form step
     */
    async render() {
        const startTime = performance.now();
        
        try {
            // Check cache for performance optimization
            const cacheKey = `step-${this.currentStep}-${JSON.stringify(this.formData)}`;
            
            if (this.config.performanceMode === 'fast' && this.renderCache.has(cacheKey)) {
                this.container.innerHTML = this.renderCache.get(cacheKey);
                this.attachStepEventListeners();
                return;
            }
            
            // Generate HTML for current step
            const html = await this.generateStepHTML();
            
            // Update container
            if (this.config.animations) {
                await this.animatedRender(html);
            } else {
                this.container.innerHTML = html;
            }
            
            // Cache rendered HTML if performance mode allows
            if (this.config.performanceMode !== 'comprehensive') {
                this.renderCache.set(cacheKey, html);
            }
            
            // Attach step-specific event listeners
            this.attachStepEventListeners();
            
            // Apply progressive disclosure
            this.applyProgressiveDisclosure();
            
            // Apply smart defaults
            await this.applySmartDefaults();
            
            // Update progress indicator
            this.updateProgressIndicator();
            
            // Mark as clean after render
            this.isDirty = false;
            
            const renderTime = performance.now() - startTime;
            console.log(`✅ Step ${this.currentStep} rendered in ${renderTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('❌ Render failed:', error);
            this.handleRenderError(error);
        }
    }

    /**
     * Generate HTML for current step
     */
    async generateStepHTML() {
        const schema = this.config.formSchema;
        const currentStepSchema = schema.steps[this.currentStep - 1];
        
        if (!currentStepSchema) {
            throw new Error(`Step ${this.currentStep} not found in schema`);
        }
        
        return `
            <div class="dynamic-form-step" data-step="${this.currentStep}">
                <!-- Progress Bar -->
                ${this.generateProgressBar()}
                
                <!-- Step Header -->
                <div class="step-header">
                    <h2 class="step-title">${currentStepSchema.title}</h2>
                    ${currentStepSchema.description ? `<p class="step-description">${currentStepSchema.description}</p>` : ''}
                </div>
                
                <!-- Form Fields -->
                <form class="step-form" id="dynamic-form-step-${this.currentStep}">
                    ${await this.generateFieldsHTML(currentStepSchema.fields)}
                </form>
                
                <!-- Navigation -->
                ${this.generateNavigationHTML()}
                
                <!-- Auto-save indicator -->
                ${this.generateAutoSaveIndicator()}
            </div>
        `;
    }

    /**
     * Generate progress bar HTML
     */
    generateProgressBar() {
        const percentage = (this.currentStep / this.totalSteps) * 100;
        
        return `
            <div class="progress-container">
                <div class="progress-info">
                    <span class="step-counter">Step ${this.currentStep} of ${this.totalSteps}</span>
                    <span class="progress-percentage">${Math.round(percentage)}% Complete</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="step-indicators">
                    ${Array.from({length: this.totalSteps}, (_, i) => 
                        `<div class="step-indicator ${i + 1 <= this.currentStep ? 'completed' : ''}" data-step="${i + 1}">
                            ${i + 1 <= this.currentStep ? '✓' : i + 1}
                         </div>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate fields HTML for current step
     */
    async generateFieldsHTML(fields) {
        const fieldPromises = fields.map(field => this.generateFieldHTML(field));
        const fieldHTMLs = await Promise.all(fieldPromises);
        
        return `
            <div class="form-fields">
                ${fieldHTMLs.join('')}
            </div>
        `;
    }

    /**
     * Generate HTML for a single field
     */
    async generateFieldHTML(field) {
        const fieldId = field.id;
        const isVisible = this.visibleFields.has(fieldId);
        const isRequired = this.isFieldRequired(fieldId);
        const hasError = this.validationErrors[fieldId];
        const savedValue = this.formData[fieldId] || '';
        
        // Get smart default if available
        const smartDefault = await this.getSmartDefault(fieldId);
        const defaultValue = smartDefault || field.defaultValue || savedValue;
        
        const commonAttributes = `
            id="${fieldId}"
            name="${fieldId}"
            data-field-type="${field.type}"
            ${isRequired ? 'required' : ''}
            ${field.disabled ? 'disabled' : ''}
            class="form-field ${field.className || ''} ${hasError ? 'error' : ''}"
        `;
        
        let fieldHTML = '';
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'url':
                fieldHTML = `
                    <input type="${field.type}" 
                           ${commonAttributes}
                           value="${this.escapeHtml(defaultValue)}"
                           placeholder="${field.placeholder || ''}"
                           ${field.minLength ? `minlength="${field.minLength}"` : ''}
                           ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                           ${field.pattern ? `pattern="${field.pattern}"` : ''}
                           autocomplete="${field.autocomplete || 'off'}">
                `;
                break;
                
            case 'textarea':
                fieldHTML = `
                    <textarea ${commonAttributes}
                              placeholder="${field.placeholder || ''}"
                              rows="${field.rows || 4}"
                              ${field.minLength ? `minlength="${field.minLength}"` : ''}
                              ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}>${this.escapeHtml(defaultValue)}</textarea>
                `;
                break;
                
            case 'select':
                const options = field.options.map(option => 
                    `<option value="${option.value}" ${option.value === defaultValue ? 'selected' : ''}>
                        ${option.label}
                     </option>`
                ).join('');
                fieldHTML = `
                    <select ${commonAttributes}>
                        ${field.placeholder ? `<option value="">${field.placeholder}</option>` : ''}
                        ${options}
                    </select>
                `;
                break;
                
            case 'radio':
                fieldHTML = field.options.map(option => `
                    <label class="radio-option">
                        <input type="radio" 
                               name="${fieldId}" 
                               value="${option.value}"
                               ${option.value === defaultValue ? 'checked' : ''}
                               ${isRequired ? 'required' : ''}
                               class="radio-input">
                        <span class="radio-label">${option.label}</span>
                        ${option.description ? `<span class="radio-description">${option.description}</span>` : ''}
                    </label>
                `).join('');
                break;
                
            case 'checkbox':
                if (field.options) {
                    // Multiple checkboxes
                    const selectedValues = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
                    fieldHTML = field.options.map(option => `
                        <label class="checkbox-option">
                            <input type="checkbox" 
                                   name="${fieldId}[]" 
                                   value="${option.value}"
                                   ${selectedValues.includes(option.value) ? 'checked' : ''}
                                   class="checkbox-input">
                            <span class="checkbox-label">${option.label}</span>
                            ${option.description ? `<span class="checkbox-description">${option.description}</span>` : ''}
                        </label>
                    `).join('');
                } else {
                    // Single checkbox
                    fieldHTML = `
                        <label class="checkbox-single">
                            <input type="checkbox" 
                                   ${commonAttributes}
                                   ${defaultValue ? 'checked' : ''}>
                            <span class="checkbox-label">${field.label}</span>
                        </label>
                    `;
                }
                break;
                
            case 'file':
                fieldHTML = `
                    <div class="file-upload-container">
                        <input type="file" 
                               ${commonAttributes}
                               ${field.multiple ? 'multiple' : ''}
                               accept="${field.accept || '*'}"
                               class="file-input hidden">
                        <div class="file-upload-area" data-field-id="${fieldId}">
                            <div class="upload-icon">📁</div>
                            <div class="upload-text">
                                <p><strong>Click to upload</strong> or drag and drop</p>
                                <p class="upload-hint">${field.hint || 'Select files to upload'}</p>
                            </div>
                        </div>
                        <div class="uploaded-files" id="uploaded-files-${fieldId}"></div>
                    </div>
                `;
                break;
                
            default:
                fieldHTML = `<div class="unsupported-field">Unsupported field type: ${field.type}</div>`;
        }
        
        return `
            <div class="form-group ${isVisible ? 'visible' : 'hidden'}" data-field-id="${fieldId}">
                ${field.label ? `
                    <label class="field-label" for="${fieldId}">
                        ${field.label}
                        ${isRequired ? '<span class="required-indicator">*</span>' : ''}
                        ${field.tooltip ? `<span class="tooltip-trigger" data-tooltip="${field.tooltip}">ℹ️</span>` : ''}
                    </label>
                ` : ''}
                
                <div class="field-input-container">
                    ${fieldHTML}
                </div>
                
                ${hasError ? `<div class="field-error">${hasError}</div>` : ''}
                ${field.hint ? `<div class="field-hint">${field.hint}</div>` : ''}
            </div>
        `;
    }

    /**
     * Generate navigation HTML
     */
    generateNavigationHTML() {
        return `
            <div class="form-navigation">
                <div class="nav-left">
                    ${this.currentStep > 1 ? 
                        `<button type="button" class="btn btn-secondary" id="prev-step-btn">
                            ← Previous
                         </button>` : ''
                    }
                </div>
                
                <div class="nav-center">
                    ${this.config.autoSave ? 
                        `<button type="button" class="btn btn-ghost" id="save-draft-btn">
                            💾 Save Draft
                         </button>` : ''
                    }
                </div>
                
                <div class="nav-right">
                    <button type="button" class="btn btn-primary" id="next-step-btn">
                        ${this.currentStep === this.totalSteps ? 'Submit Form' : 'Continue →'}
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Generate auto-save indicator HTML
     */
    generateAutoSaveIndicator() {
        if (!this.config.autoSave) {return '';}
        
        return `
            <div class="auto-save-indicator" id="auto-save-indicator">
                <span class="auto-save-status">Draft saved</span>
                <span class="auto-save-time">${this.lastSaveTime ? this.formatTime(this.lastSaveTime) : ''}</span>
            </div>
        `;
    }

    /**
     * Continue with the rest of the implementation...
     * This is the first part of the Dynamic Form Engine.
     * The file will be continued with additional methods for:
     * - Event listeners
     * - Progressive disclosure logic
     * - Smart defaults implementation
     * - Real-time validation
     * - Performance optimization
     * - Mobile optimizations
     * - Cross-browser compatibility
     * - And more...
     */
}