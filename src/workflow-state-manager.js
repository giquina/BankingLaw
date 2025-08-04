/**
 * JuriBank Workflow State Management System v3.0
 * Robust state persistence with backup strategies and session recovery
 * Educational platform - maintains workflow progress across browser sessions
 */

class WorkflowStateManager {
    constructor(options = {}) {
        this.sessionId = options.sessionId;
        this.persistenceLayer = options.persistenceLayer || 'localStorage';
        this.engine = options.engine;
        this.backupStrategies = ['localStorage', 'sessionStorage', 'indexedDB'];
        this.compressionEnabled = options.compression !== false;
        this.encryptionEnabled = options.encryption === true;
        
        this.init();
    }

    async init() {
        // Test storage availability
        this.availableStorage = await this.testStorageAvailability();
        
        // Setup automatic backups
        this.setupAutomaticBackups();
        
        // Setup storage event listeners
        this.setupStorageEventListeners();
        
        // Initialize IndexedDB if available
        if (this.availableStorage.indexedDB) {
            await this.initializeIndexedDB();
        }
    }

    /**
     * Save workflow state with backup strategies
     */
    async saveState(workflowState) {
        try {
            const stateData = this.prepareStateForStorage(workflowState);
            const savePromises = [];

            // Primary storage
            savePromises.push(this.saveToPrimaryStorage(stateData));

            // Backup to secondary storage methods
            if (this.availableStorage.sessionStorage && this.persistenceLayer !== 'sessionStorage') {
                savePromises.push(this.saveToSessionStorage(stateData));
            }
            
            if (this.availableStorage.indexedDB) {
                savePromises.push(this.saveToIndexedDB(stateData));
            }

            // Wait for all saves to complete
            const results = await Promise.allSettled(savePromises);
            
            // Check if at least one save succeeded
            const successfulSaves = results.filter(result => result.status === 'fulfilled');
            
            if (successfulSaves.length === 0) {
                throw new StateError('Failed to save state to any storage method');
            }

            // Log any backup failures
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.warn(`Backup save failed for method ${index}:`, result.reason);
                }
            });

            return {
                success: true,
                savedTo: successfulSaves.length,
                sessionId: this.sessionId
            };
        } catch (error) {
            console.error('State save failed:', error);
            throw new StateError(`Failed to save workflow state: ${error.message}`);
        }
    }

    /**
     * Load workflow state with fallback strategies
     */
    async loadState(sessionId = null) {
        const targetSessionId = sessionId || this.sessionId;
        
        try {
            // Try primary storage first
            let stateData = await this.loadFromPrimaryStorage(targetSessionId);
            
            if (!stateData) {
                // Try backup storage methods
                stateData = await this.loadFromBackupStorage(targetSessionId);
            }
            
            if (!stateData) {
                return null;
            }

            return this.parseStateFromStorage(stateData);
        } catch (error) {
            console.error('State load failed:', error);
            throw new StateError(`Failed to load workflow state: ${error.message}`);
        }
    }

    /**
     * Delete workflow state from all storage methods
     */
    async deleteState(sessionId = null) {
        const targetSessionId = sessionId || this.sessionId;
        const deletePromises = [];

        // Delete from all available storage methods
        if (this.availableStorage.localStorage) {
            deletePromises.push(this.deleteFromLocalStorage(targetSessionId));
        }
        
        if (this.availableStorage.sessionStorage) {
            deletePromises.push(this.deleteFromSessionStorage(targetSessionId));
        }
        
        if (this.availableStorage.indexedDB) {
            deletePromises.push(this.deleteFromIndexedDB(targetSessionId));
        }

        const results = await Promise.allSettled(deletePromises);
        
        return {
            success: true,
            deletedFrom: results.filter(r => r.status === 'fulfilled').length
        };
    }

    /**
     * Get all saved workflow sessions
     */
    async getAllSessions() {
        try {
            const sessions = [];
            
            // Get from localStorage
            if (this.availableStorage.localStorage) {
                const localSessions = this.getSessionsFromLocalStorage();
                sessions.push(...localSessions);
            }
            
            // Get from IndexedDB
            if (this.availableStorage.indexedDB) {
                const indexedSessions = await this.getSessionsFromIndexedDB();
                sessions.push(...indexedSessions);
            }
            
            // Deduplicate by sessionId
            const uniqueSessions = sessions.reduce((acc, session) => {
                if (!acc.find(s => s.sessionId === session.sessionId)) {
                    acc.push(session);
                }
                return acc;
            }, []);
            
            return uniqueSessions.sort((a, b) => 
                new Date(b.lastModified) - new Date(a.lastModified)
            );
        } catch (error) {
            console.error('Failed to get sessions:', error);
            return [];
        }
    }

    /**
     * Clean up old or expired sessions
     */
    async cleanupOldSessions(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days default
        try {
            const allSessions = await this.getAllSessions();
            const cutoffDate = new Date(Date.now() - maxAge);
            const expiredSessions = allSessions.filter(session => 
                new Date(session.lastModified) < cutoffDate
            );

            for (const session of expiredSessions) {
                await this.deleteState(session.sessionId);
            }

            return {
                success: true,
                cleanedUp: expiredSessions.length,
                remaining: allSessions.length - expiredSessions.length
            };
        } catch (error) {
            console.error('Cleanup failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Prepare state data for storage
     */
    prepareStateForStorage(workflowState) {
        let stateData = {
            ...workflowState,
            lastModified: new Date().toISOString(),
            version: '3.0'
        };

        // Compress if enabled
        if (this.compressionEnabled) {
            stateData = this.compressState(stateData);
        }

        // Encrypt if enabled
        if (this.encryptionEnabled) {
            stateData = this.encryptState(stateData);
        }

        return stateData;
    }

    /**
     * Parse state data from storage
     */
    parseStateFromStorage(stateData) {
        let parsedState = stateData;

        // Decrypt if needed
        if (this.encryptionEnabled && stateData.encrypted) {
            parsedState = this.decryptState(parsedState);
        }

        // Decompress if needed
        if (this.compressionEnabled && parsedState.compressed) {
            parsedState = this.decompressState(parsedState);
        }

        return parsedState;
    }

    /**
     * Save to primary storage
     */
    async saveToPrimaryStorage(stateData) {
        const key = this.getStorageKey(this.sessionId);
        
        switch (this.persistenceLayer) {
            case 'localStorage':
                return this.saveToLocalStorage(key, stateData);
            case 'sessionStorage':
                return this.saveToSessionStorage(key, stateData);
            case 'indexedDB':
                return this.saveToIndexedDB(stateData);
            default:
                throw new StateError(`Unknown persistence layer: ${this.persistenceLayer}`);
        }
    }

    /**
     * Load from primary storage
     */
    async loadFromPrimaryStorage(sessionId) {
        const key = this.getStorageKey(sessionId);
        
        switch (this.persistenceLayer) {
            case 'localStorage':
                return this.loadFromLocalStorage(key);
            case 'sessionStorage':
                return this.loadFromSessionStorage(key);
            case 'indexedDB':
                return this.loadFromIndexedDB(sessionId);
            default:
                return null;
        }
    }

    /**
     * Load from backup storage methods
     */
    async loadFromBackupStorage(sessionId) {
        const key = this.getStorageKey(sessionId);
        
        // Try each backup method
        for (const method of this.backupStrategies) {
            if (method === this.persistenceLayer) continue;
            
            try {
                let stateData = null;
                
                switch (method) {
                    case 'localStorage':
                        if (this.availableStorage.localStorage) {
                            stateData = this.loadFromLocalStorage(key);
                        }
                        break;
                    case 'sessionStorage':
                        if (this.availableStorage.sessionStorage) {
                            stateData = this.loadFromSessionStorage(key);
                        }
                        break;
                    case 'indexedDB':
                        if (this.availableStorage.indexedDB) {
                            stateData = await this.loadFromIndexedDB(sessionId);
                        }
                        break;
                }
                
                if (stateData) {
                    console.log(`State recovered from backup method: ${method}`);
                    return stateData;
                }
            } catch (error) {
                console.warn(`Backup load failed for ${method}:`, error);
            }
        }
        
        return null;
    }

    /**
     * LocalStorage operations
     */
    saveToLocalStorage(key, stateData) {
        if (!this.availableStorage.localStorage) {
            throw new StateError('localStorage not available');
        }
        
        localStorage.setItem(key, JSON.stringify(stateData));
        return Promise.resolve();
    }

    loadFromLocalStorage(key) {
        if (!this.availableStorage.localStorage) {
            return null;
        }
        
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    deleteFromLocalStorage(sessionId) {
        const key = this.getStorageKey(sessionId);
        localStorage.removeItem(key);
        return Promise.resolve();
    }

    getSessionsFromLocalStorage() {
        const sessions = [];
        const prefix = 'juribank_workflow_';
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    sessions.push({
                        sessionId: data.sessionId,
                        type: data.type,
                        lastModified: data.lastModified,
                        status: data.status
                    });
                } catch (error) {
                    console.warn(`Invalid session data in localStorage: ${key}`);
                }
            }
        }
        
        return sessions;
    }

    /**
     * SessionStorage operations
     */
    saveToSessionStorage(key, stateData) {
        if (!this.availableStorage.sessionStorage) {
            throw new StateError('sessionStorage not available');
        }
        
        sessionStorage.setItem(key, JSON.stringify(stateData));
        return Promise.resolve();
    }

    loadFromSessionStorage(key) {
        if (!this.availableStorage.sessionStorage) {
            return null;
        }
        
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    deleteFromSessionStorage(sessionId) {
        const key = this.getStorageKey(sessionId);
        sessionStorage.removeItem(key);
        return Promise.resolve();
    }

    /**
     * IndexedDB operations
     */
    async initializeIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('JuriBankWorkflows', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.indexedDB = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('workflows')) {
                    const store = db.createObjectStore('workflows', { keyPath: 'sessionId' });
                    store.createIndex('type', 'type', { unique: false });
                    store.createIndex('lastModified', 'lastModified', { unique: false });
                }
            };
        });
    }

    async saveToIndexedDB(stateData) {
        if (!this.indexedDB) {
            throw new StateError('IndexedDB not initialized');
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.indexedDB.transaction(['workflows'], 'readwrite');
            const store = transaction.objectStore('workflows');
            const request = store.put(stateData);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async loadFromIndexedDB(sessionId) {
        if (!this.indexedDB) {
            return null;
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.indexedDB.transaction(['workflows'], 'readonly');
            const store = transaction.objectStore('workflows');
            const request = store.get(sessionId);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFromIndexedDB(sessionId) {
        if (!this.indexedDB) {
            return;
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.indexedDB.transaction(['workflows'], 'readwrite');
            const store = transaction.objectStore('workflows');
            const request = store.delete(sessionId);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getSessionsFromIndexedDB() {
        if (!this.indexedDB) {
            return [];
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.indexedDB.transaction(['workflows'], 'readonly');
            const store = transaction.objectStore('workflows');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const sessions = request.result.map(session => ({
                    sessionId: session.sessionId,
                    type: session.type,
                    lastModified: session.lastModified,
                    status: session.status
                }));
                resolve(sessions);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Test storage availability
     */
    async testStorageAvailability() {
        const availability = {
            localStorage: false,
            sessionStorage: false,
            indexedDB: false
        };

        // Test localStorage
        try {
            const testKey = '__juribank_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            availability.localStorage = true;
        } catch (error) {
            console.warn('localStorage not available:', error.message);
        }

        // Test sessionStorage
        try {
            const testKey = '__juribank_test__';
            sessionStorage.setItem(testKey, 'test');
            sessionStorage.removeItem(testKey);
            availability.sessionStorage = true;
        } catch (error) {
            console.warn('sessionStorage not available:', error.message);
        }

        // Test IndexedDB
        try {
            if ('indexedDB' in window) {
                availability.indexedDB = true;
            }
        } catch (error) {
            console.warn('IndexedDB not available:', error.message);
        }

        return availability;
    }

    /**
     * Setup automatic backups
     */
    setupAutomaticBackups() {
        // Backup every 5 minutes for active workflows
        setInterval(async () => {
            if (this.engine && this.engine.workflowState && this.engine.workflowState.status === 'active') {
                try {
                    await this.saveState(this.engine.workflowState);
                } catch (error) {
                    console.warn('Automatic backup failed:', error);
                }
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    /**
     * Setup storage event listeners
     */
    setupStorageEventListeners() {
        // Listen for storage events (e.g., other tabs)
        window.addEventListener('storage', (event) => {
            if (event.key && event.key.startsWith('juribank_workflow_')) {
                this.handleStorageEvent(event);
            }
        });

        // Listen for before unload to save state
        window.addEventListener('beforeunload', async () => {
            if (this.engine && this.engine.workflowState) {
                try {
                    await this.saveState(this.engine.workflowState);
                } catch (error) {
                    console.warn('Failed to save state on page unload:', error);
                }
            }
        });
    }

    /**
     * Handle storage events from other tabs
     */
    handleStorageEvent(event) {
        // Could implement sync between tabs here
        console.log('Storage event detected:', event);
    }

    /**
     * Compress state data
     */
    compressState(stateData) {
        // Simple compression - in production you might use a library like pako
        const jsonString = JSON.stringify(stateData);
        return {
            compressed: true,
            data: btoa(jsonString), // Base64 encoding as simple compression
            originalSize: jsonString.length,
            compressedSize: jsonString.length * 1.33 // Base64 is ~33% larger
        };
    }

    /**
     * Decompress state data
     */
    decompressState(compressedData) {
        try {
            const decompressed = atob(compressedData.data);
            return JSON.parse(decompressed);
        } catch (error) {
            throw new StateError(`Failed to decompress state data: ${error.message}`);
        }
    }

    /**
     * Encrypt state data (simple implementation)
     */
    encryptState(stateData) {
        // In production, use proper encryption library
        const jsonString = JSON.stringify(stateData);
        return {
            encrypted: true,
            data: btoa(jsonString), // This is NOT real encryption!
            algorithm: 'base64' // Placeholder
        };
    }

    /**
     * Decrypt state data
     */
    decryptState(encryptedData) {
        try {
            const decrypted = atob(encryptedData.data);
            return JSON.parse(decrypted);
        } catch (error) {
            throw new StateError(`Failed to decrypt state data: ${error.message}`);
        }
    }

    /**
     * Get storage key for session
     */
    getStorageKey(sessionId) {
        return `juribank_workflow_${sessionId}`;
    }

    /**
     * Get storage usage statistics
     */
    getStorageStats() {
        const stats = {
            localStorage: { used: 0, available: false },
            sessionStorage: { used: 0, available: false },
            indexedDB: { available: false }
        };

        if (this.availableStorage.localStorage) {
            stats.localStorage.available = true;
            // Calculate localStorage usage for JuriBank data
            let used = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('juribank_')) {
                    used += localStorage.getItem(key).length;
                }
            }
            stats.localStorage.used = used;
        }

        if (this.availableStorage.sessionStorage) {
            stats.sessionStorage.available = true;
            // Calculate sessionStorage usage for JuriBank data
            let used = 0;
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith('juribank_')) {
                    used += sessionStorage.getItem(key).length;
                }
            }
            stats.sessionStorage.used = used;
        }

        if (this.availableStorage.indexedDB) {
            stats.indexedDB.available = true;
        }

        return stats;
    }

    /**
     * Destroy state manager and clean up
     */
    destroy() {
        if (this.indexedDB) {
            this.indexedDB.close();
        }
        
        // Remove event listeners
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);
        window.removeEventListener('storage', this.storageEventHandler);
    }
}

/**
 * Custom error class for state management errors
 */
class StateError extends Error {
    constructor(message, code = 'STATE_ERROR') {
        super(message);
        this.name = 'StateError';
        this.code = code;
    }
}

// Export for use
window.WorkflowStateManager = WorkflowStateManager;
window.StateError = StateError;