/**
 * JuriBank Dynamic Form Engine - Core Implementation (Part 2)
 * Advanced form functionality continuation
 */

// Continuing the DynamicFormEngine class...

class DynamicFormEngineCore extends DynamicFormEngine {
    
    /**
     * Attach event listeners for the current step
     */
    attachStepEventListeners() {
        // Navigation buttons
        this.attachNavigationListeners();
        
        // Field change listeners for progressive disclosure
        this.attachProgressiveDisclosureListeners();
        
        // Real-time validation listeners
        this.attachValidationListeners();
        
        // File upload listeners
        this.attachFileUploadListeners();
        
        // Auto-save listeners
        this.attachAutoSaveListeners();
        
        // Mobile optimization listeners
        if (this.isMobile) {
            this.attachMobileListeners();
        }
        
        // Accessibility listeners
        this.attachAccessibilityListeners();
    }

    /**
     * Attach navigation event listeners
     */
    attachNavigationListeners() {
        const nextBtn = document.getElementById('next-step-btn');
        const prevBtn = document.getElementById('prev-step-btn');
        const saveDraftBtn = document.getElementById('save-draft-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => this.handleNextStep(e));
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => this.handlePrevStep(e));
        }
        
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', (e) => this.handleSaveDraft(e));
        }
    }

    /**
     * Attach progressive disclosure listeners
     */
    attachProgressiveDisclosureListeners() {
        if (!this.progressiveDisclosureTriggers) {return;}
        
        this.progressiveDisclosureTriggers.forEach((triggers, fieldId) => {
            const field = document.getElementById(fieldId);
            if (!field) {return;}
            
            const eventType = this.getFieldEventType(field);
            field.addEventListener(eventType, (e) => {
                this.handleProgressiveDisclosure(fieldId, e.target.value, triggers);
            });
        });
    }

    /**
     * Handle progressive disclosure logic
     */
    handleProgressiveDisclosure(triggerFieldId, value, triggers) {
        triggers.forEach(trigger => {
            const shouldShow = this.evaluateCondition(value, trigger.operator, trigger.value);
            const targetField = document.querySelector(`[data-field-id="${trigger.targetField}"]`);
            
            if (!targetField) {return;}
            
            if (shouldShow && trigger.action === 'show') {
                this.showField(trigger.targetField, targetField);
            } else if (!shouldShow && trigger.action === 'show') {
                this.hideField(trigger.targetField, targetField);
            } else if (shouldShow && trigger.action === 'hide') {
                this.hideField(trigger.targetField, targetField);
            } else if (!shouldShow && trigger.action === 'hide') {
                this.showField(trigger.targetField, targetField);
            }
            
            // Handle require/optional actions
            if (trigger.action === 'require' && shouldShow) {
                this.makeFieldRequired(trigger.targetField);
            } else if (trigger.action === 'optional' && shouldShow) {
                this.makeFieldOptional(trigger.targetField);
            }
        });
    }

    /**
     * Evaluate condition for progressive disclosure
     */
    evaluateCondition(fieldValue, operator, conditionValue) {
        switch (operator) {
            case 'equals':
                return fieldValue === conditionValue;
            case 'not_equals':
                return fieldValue !== conditionValue;
            case 'contains':
                return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
            case 'not_contains':
                return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
            case 'greater_than':
                return parseFloat(fieldValue) > parseFloat(conditionValue);
            case 'less_than':
                return parseFloat(fieldValue) < parseFloat(conditionValue);
            case 'greater_than_equal':
                return parseFloat(fieldValue) >= parseFloat(conditionValue);
            case 'less_than_equal':
                return parseFloat(fieldValue) <= parseFloat(conditionValue);
            case 'empty':
                return !fieldValue || fieldValue.trim() === '';
            case 'not_empty':
                return fieldValue && fieldValue.trim() !== '';
            case 'in_array':
                return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
            case 'not_in_array':
                return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
            default:
                console.warn(`Unknown operator: ${operator}`);
                return false;
        }
    }

    /**
     * Show a field with animation
     */
    async showField(fieldId, fieldElement) {
        if (this.visibleFields.has(fieldId)) {return;}
        
        this.visibleFields.add(fieldId);
        this.hiddenFields.delete(fieldId);
        
        fieldElement.classList.remove('hidden');
        
        if (this.config.animations) {
            fieldElement.style.opacity = '0';
            fieldElement.style.transform = 'translateY(-10px)';
            
            await this.animateElement(fieldElement, {
                opacity: '1',
                transform: 'translateY(0)'
            });
        }
        
        // Focus first input in shown field if appropriate
        const firstInput = fieldElement.querySelector('input, select, textarea');
        if (firstInput && this.shouldAutoFocus()) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * Hide a field with animation
     */
    async hideField(fieldId, fieldElement) {
        if (this.hiddenFields.has(fieldId)) {return;}
        
        this.hiddenFields.add(fieldId);
        this.visibleFields.delete(fieldId);
        
        if (this.config.animations) {
            await this.animateElement(fieldElement, {
                opacity: '0',
                transform: 'translateY(-10px)'
            });
        }
        
        fieldElement.classList.add('hidden');
        
        // Clear field value when hidden
        this.clearFieldValue(fieldId);
    }

    /**
     * Apply progressive disclosure to current step
     */
    applyProgressiveDisclosure() {
        // Evaluate all current conditions
        Object.entries(this.formData).forEach(([fieldId, value]) => {
            if (this.progressiveDisclosureTriggers?.has(fieldId)) {
                const triggers = this.progressiveDisclosureTriggers.get(fieldId);
                this.handleProgressiveDisclosure(fieldId, value, triggers);
            }
        });
    }

    /**
     * Apply smart defaults to current step
     */
    async applySmartDefaults() {
        if (!this.smartDefaultsMap) {return;}
        
        const currentStepFields = this.getCurrentStepFields();
        
        for (const field of currentStepFields) {
            const fieldId = field.id;
            
            if (this.smartDefaultsMap.has(fieldId) && !this.formData[fieldId]) {
                const defaultValue = await this.getSmartDefault(fieldId);
                if (defaultValue !== null && defaultValue !== undefined) {
                    this.setFieldValue(fieldId, defaultValue);
                }
            }
        }
    }

    /**
     * Get smart default value for a field
     */
    async getSmartDefault(fieldId) {
        if (!this.smartDefaultsMap?.has(fieldId)) {return null;}
        
        const config = this.smartDefaultsMap.get(fieldId);
        
        switch (config.type) {
            case 'static':
                return config.value;
                
            case 'computed':
                return this.computeSmartDefault(fieldId, config);
                
            case 'api':
                return await this.fetchSmartDefault(fieldId, config);
                
            case 'historical':
                return this.getHistoricalDefault(fieldId, config);
                
            default:
                return config.value;
        }
    }

    /**
     * Compute smart default based on other field values
     */
    computeSmartDefault(fieldId, config) {
        if (!config.computeFunction) {return null;}
        
        try {
            // Create context with current form data
            const context = {
                formData: this.formData,
                currentStep: this.currentStep,
                fieldId: fieldId
            };
            
            // Execute compute function
            if (typeof config.computeFunction === 'function') {
                return config.computeFunction(context);
            } else if (typeof config.computeFunction === 'string') {
                // Evaluate string-based function (be careful with security)
                return this.evaluateComputeFunction(config.computeFunction, context);
            }
        } catch (error) {
            console.warn(`Smart default computation failed for ${fieldId}:`, error);
            return null;
        }
    }

    /**
     * Fetch smart default from API
     */
    async fetchSmartDefault(fieldId, config) {
        if (!config.apiEndpoint) {return null;}
        
        try {
            // Check cache first
            const cacheKey = `smart-default-${fieldId}-${JSON.stringify(config.dependencies?.map(dep => this.formData[dep]))}`;
            const cached = this.getFromCache(cacheKey, config.cacheTime);
            
            if (cached !== null) {return cached;}
            
            // Prepare API request
            const requestData = {
                fieldId,
                formData: this.formData,
                dependencies: config.dependencies?.reduce((acc, dep) => {
                    acc[dep] = this.formData[dep];
                    return acc;
                }, {})
            };
            
            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {throw new Error(`API request failed: ${response.status}`);}
            
            const result = await response.json();
            const defaultValue = result.defaultValue;
            
            // Cache result
            this.setCache(cacheKey, defaultValue, config.cacheTime);
            
            return defaultValue;
            
        } catch (error) {
            console.warn(`API smart default failed for ${fieldId}:`, error);
            return null;
        }
    }

    /**
     * Get historical default based on previous submissions
     */
    getHistoricalDefault(fieldId, config) {
        try {
            const historyKey = `juribank-field-history-${fieldId}`;
            const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            
            if (history.length === 0) {return null;}
            
            // Get most recent or most common value based on config
            if (config.strategy === 'most_recent') {
                return history[history.length - 1].value;
            } else if (config.strategy === 'most_common') {
                return this.getMostCommonValue(history);
            }
            
            return history[history.length - 1].value; // Default to most recent
            
        } catch (error) {
            console.warn(`Historical default failed for ${fieldId}:`, error);
            return null;
        }
    }

    /**
     * Attach real-time validation listeners
     */
    attachValidationListeners() {
        const fields = this.container.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            const fieldId = field.id || field.name;
            const validationConfig = this.fieldValidationRules?.get(fieldId);
            
            if (!validationConfig?.realTimeValidation) {return;}
            
            const eventType = this.getFieldEventType(field);
            const delay = validationConfig.validationDelay || this.config.validationDelay;
            
            field.addEventListener(eventType, (e) => {
                this.debounceValidation(fieldId, field, delay);
            });
            
            // Also validate on blur for immediate feedback
            field.addEventListener('blur', (e) => {
                this.validateField(fieldId, field, true);
            });
        });
    }

    /**
     * Debounce validation to avoid excessive API calls
     */
    debounceValidation(fieldId, field, delay) {
        // Clear existing timer
        if (this.debounceTimers.has(fieldId)) {
            clearTimeout(this.debounceTimers.get(fieldId));
        }
        
        // Set new timer
        const timer = setTimeout(() => {
            this.validateField(fieldId, field);
            this.debounceTimers.delete(fieldId);
        }, delay);
        
        this.debounceTimers.set(fieldId, timer);
    }

    /**
     * Validate a single field
     */
    async validateField(fieldId, field, showSuccess = false) {
        const value = this.getFieldValue(field);
        const rules = this.fieldValidationRules?.get(fieldId);
        
        if (!rules) {return true;}
        
        const errors = [];
        
        // Required validation
        if (rules.required && this.isEmpty(value)) {
            errors.push('This field is required');
        }
        
        // Only validate format if field has a value
        if (!this.isEmpty(value)) {
            // Length validation
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`Minimum ${rules.minLength} characters required`);
            }
            
            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`Maximum ${rules.maxLength} characters allowed`);
            }
            
            // Pattern validation
            if (rules.pattern) {
                const regex = new RegExp(rules.pattern);
                if (!regex.test(value)) {
                    errors.push('Invalid format');
                }
            }
            
            // Custom validation
            if (rules.customValidator) {
                try {
                    const customResult = await this.runCustomValidator(fieldId, value, rules.customValidator);
                    if (customResult !== true) {
                        errors.push(customResult || 'Validation failed');
                    }
                } catch (error) {
                    console.warn(`Custom validation failed for ${fieldId}:`, error);
                    errors.push('Validation error occurred');
                }
            }
        }
        
        // Update validation state
        this.updateFieldValidationState(fieldId, field, errors, showSuccess);
        
        return errors.length === 0;
    }

    /**
     * Update field validation state
     */
    updateFieldValidationState(fieldId, field, errors, showSuccess = false) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup?.querySelector('.field-error');
        
        // Clear existing states
        field.classList.remove('valid', 'invalid');
        fieldGroup?.classList.remove('has-error', 'has-success');
        
        if (errors.length > 0) {
            // Show error state
            field.classList.add('invalid');
            fieldGroup?.classList.add('has-error');
            
            if (errorElement) {
                errorElement.textContent = errors[0]; // Show first error
                errorElement.style.display = 'block';
            }
            
            this.validationErrors[fieldId] = errors[0];
        } else {
            // Show success state if requested
            if (showSuccess && !this.isEmpty(this.getFieldValue(field))) {
                field.classList.add('valid');
                fieldGroup?.classList.add('has-success');
            }
            
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            
            delete this.validationErrors[fieldId];
        }
    }

    /**
     * Handle next step navigation
     */
    async handleNextStep(e) {
        e.preventDefault();
        
        const isValid = await this.validateCurrentStep();
        
        if (!isValid) {
            this.showValidationSummary();
            return;
        }
        
        // Save current step data
        this.saveCurrentStepData();
        
        if (this.currentStep < this.totalSteps) {
            // Move to next step
            this.currentStep++;
            await this.render();
            this.scrollToTop();
        } else {
            // Submit form
            await this.submitForm();
        }
    }

    /**
     * Handle previous step navigation
     */
    async handlePrevStep(e) {
        e.preventDefault();
        
        if (this.currentStep > 1) {
            // Save current step data (even if invalid)
            this.saveCurrentStepData();
            
            this.currentStep--;
            await this.render();
            this.scrollToTop();
        }
    }

    /**
     * Handle save draft
     */
    async handleSaveDraft(e) {
        e.preventDefault();
        
        this.saveCurrentStepData();
        await this.saveProgress();
        
        this.showSaveConfirmation();
    }

    /**
     * Validate current step
     */
    async validateCurrentStep() {
        const currentFields = this.getCurrentStepFields();
        const validationPromises = currentFields.map(field => {
            const fieldElement = document.getElementById(field.id);
            return fieldElement ? this.validateField(field.id, fieldElement, true) : Promise.resolve(true);
        });
        
        const results = await Promise.all(validationPromises);
        return results.every(result => result === true);
    }

    /**
     * Get current step fields from schema
     */
    getCurrentStepFields() {
        const schema = this.config.formSchema;
        const currentStepSchema = schema.steps[this.currentStep - 1];
        return currentStepSchema?.fields || [];
    }

    /**
     * Save current step data
     */
    saveCurrentStepData() {
        const form = document.getElementById(`dynamic-form-step-${this.currentStep}`);
        if (!form) {return;}
        
        const formData = new FormData(form);
        
        // Handle regular form fields
        for (let [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                // Handle checkbox arrays
                const arrayKey = key.slice(0, -2);
                if (!this.formData[arrayKey]) {
                    this.formData[arrayKey] = [];
                }
                this.formData[arrayKey].push(value);
            } else {
                this.formData[key] = value;
            }
        }
        
        // Handle unchecked checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked && !checkbox.name.endsWith('[]')) {
                this.formData[checkbox.name] = false;
            }
        });
        
        this.isDirty = true;
    }

    /**
     * Continue with utility methods, mobile optimizations, and performance features...
     */
}

// Export the extended class
window.DynamicFormEngine = DynamicFormEngineCore;