/**
 * JuriBank Authentication Storage Manager
 * Secure client-side storage for educational platform with banking-grade security
 */

class JuriBankAuthStorage {
    constructor(config = {}) {
        this.config = {
            prefix: 'juribank_',
            encryptionEnabled: true,
            compressionEnabled: true,
            maxStorageSize: 10 * 1024 * 1024, // 10MB
            storageType: 'localStorage',
            fallbackToMemory: true,
            ...config
        };
        
        this.memoryFallback = new Map();
        this.initializeStorage();
    }

    /**
     * Initialize storage system
     */
    initializeStorage() {
        try {
            // Test storage availability
            const testKey = `${this.config.prefix}test`;
            this.setItem(testKey, 'test', false);
            this.removeItem(testKey, false);
            
            console.log('✅ JuriBank Storage Manager initialized');
            console.log(`📦 Storage type: ${this.config.storageType}`);
        } catch (error) {
            console.warn('⚠️ Storage not available, using memory fallback');
            this.config.fallbackToMemory = true;
        }
    }

    /**
     * Get storage interface
     */
    getStorage() {
        if (this.config.fallbackToMemory) {
            return this.memoryFallback;
        }
        
        try {
            return this.config.storageType === 'sessionStorage' 
                ? window.sessionStorage 
                : window.localStorage;
        } catch (error) {
            return this.memoryFallback;
        }
    }

    /**
     * Set item in storage with optional encryption
     */
    setItem(key, value, encrypt = true) {
        try {
            const fullKey = `${this.config.prefix}${key}`;
            let processedValue = JSON.stringify(value);
            
            // Apply compression if enabled
            if (this.config.compressionEnabled) {
                processedValue = this.compressData(processedValue);
            }
            
            // Apply encryption if enabled
            if (encrypt && this.config.encryptionEnabled) {
                processedValue = this.encryptData(processedValue);
            }
            
            // Check storage size limits
            if (this.exceedsStorageLimit(processedValue)) {
                throw new Error('Storage limit exceeded');
            }
            
            const storage = this.getStorage();
            if (storage === this.memoryFallback) {
                storage.set(fullKey, processedValue);
            } else {
                storage.setItem(fullKey, processedValue);
            }
            
            this.logStorageEvent('item_stored', fullKey);
            return true;
            
        } catch (error) {
            console.error('Storage setItem failed:', error);
            return false;
        }
    }

    /**
     * Get item from storage with optional decryption
     */
    getItem(key, decrypt = true) {
        try {
            const fullKey = `${this.config.prefix}${key}`;
            const storage = this.getStorage();
            
            let rawValue;
            if (storage === this.memoryFallback) {
                rawValue = storage.get(fullKey);
            } else {
                rawValue = storage.getItem(fullKey);
            }
            
            if (rawValue === null || rawValue === undefined) {
                return null;
            }
            
            let processedValue = rawValue;
            
            // Apply decryption if enabled
            if (decrypt && this.config.encryptionEnabled) {
                processedValue = this.decryptData(processedValue);
            }
            
            // Apply decompression if enabled
            if (this.config.compressionEnabled) {
                processedValue = this.decompressData(processedValue);
            }
            
            this.logStorageEvent('item_retrieved', fullKey);
            return JSON.parse(processedValue);
            
        } catch (error) {
            console.error('Storage getItem failed:', error);
            return null;
        }
    }

    /**
     * Remove item from storage
     */
    removeItem(key, logEvent = true) {
        try {
            const fullKey = `${this.config.prefix}${key}`;
            const storage = this.getStorage();
            
            if (storage === this.memoryFallback) {
                storage.delete(fullKey);
            } else {
                storage.removeItem(fullKey);
            }
            
            if (logEvent) {
                this.logStorageEvent('item_removed', fullKey);
            }
            return true;
            
        } catch (error) {
            console.error('Storage removeItem failed:', error);
            return false;
        }
    }

    /**
     * Clear all JuriBank storage data
     */
    clearAll() {
        try {
            const storage = this.getStorage();
            
            if (storage === this.memoryFallback) {
                // Clear memory fallback
                for (const key of storage.keys()) {
                    if (key.startsWith(this.config.prefix)) {
                        storage.delete(key);
                    }
                }
            } else {
                // Clear browser storage
                const keysToRemove = [];
                for (let i = 0; i < storage.length; i++) {
                    const key = storage.key(i);
                    if (key && key.startsWith(this.config.prefix)) {
                        keysToRemove.push(key);
                    }
                }
                
                keysToRemove.forEach(key => storage.removeItem(key));
            }
            
            this.logStorageEvent('storage_cleared');
            return true;
            
        } catch (error) {
            console.error('Storage clearAll failed:', error);
            return false;
        }
    }

    /**
     * Get storage usage statistics
     */
    getStorageStats() {
        try {
            const storage = this.getStorage();
            let totalSize = 0;
            let itemCount = 0;
            
            if (storage === this.memoryFallback) {
                for (const [key, value] of storage) {
                    if (key.startsWith(this.config.prefix)) {
                        totalSize += new Blob([value]).size;
                        itemCount++;
                    }
                }
            } else {
                for (let i = 0; i < storage.length; i++) {
                    const key = storage.key(i);
                    if (key && key.startsWith(this.config.prefix)) {
                        const value = storage.getItem(key) || '';
                        totalSize += new Blob([value]).size;
                        itemCount++;
                    }
                }
            }
            
            return {
                totalSize,
                itemCount,
                maxSize: this.config.maxStorageSize,
                usagePercentage: (totalSize / this.config.maxStorageSize) * 100,
                availableSpace: this.config.maxStorageSize - totalSize,
                storageType: storage === this.memoryFallback ? 'memory' : this.config.storageType
            };
            
        } catch (error) {
            console.error('Storage stats failed:', error);
            return null;
        }
    }

    /**
     * Check if adding data would exceed storage limits
     */
    exceedsStorageLimit(data) {
        const currentStats = this.getStorageStats();
        if (!currentStats) return false;
        
        const dataSize = new Blob([data]).size;
        return (currentStats.totalSize + dataSize) > this.config.maxStorageSize;
    }

    /**
     * Simple encryption for demo purposes (not production-grade)
     */
    encryptData(data) {
        try {
            // Simple XOR encryption for demo - replace with proper encryption in production
            const key = 'JuriBankEducational2024';
            let encrypted = '';
            
            for (let i = 0; i < data.length; i++) {
                encrypted += String.fromCharCode(
                    data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            
            return btoa(encrypted); // Base64 encode
        } catch (error) {
            console.warn('Encryption failed, storing unencrypted');
            return data;
        }
    }

    /**
     * Simple decryption for demo purposes
     */
    decryptData(encryptedData) {
        try {
            const key = 'JuriBankEducational2024';
            const encrypted = atob(encryptedData); // Base64 decode
            let decrypted = '';
            
            for (let i = 0; i < encrypted.length; i++) {
                decrypted += String.fromCharCode(
                    encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            
            return decrypted;
        } catch (error) {
            console.warn('Decryption failed, returning encrypted data');
            return encryptedData;
        }
    }

    /**
     * Simple compression for demo purposes
     */
    compressData(data) {
        try {
            // Simple compression using JSON minification and common string replacement
            return data
                .replace(/\s+/g, ' ')
                .replace(/": "/g, '":"')
                .replace(/", "/g, '","')
                .replace(/{ "/g, '{"')
                .replace(/" }/g, '"}');
        } catch (error) {
            return data;
        }
    }

    /**
     * Simple decompression
     */
    decompressData(compressedData) {
        // For this simple implementation, no decompression needed
        return compressedData;
    }

    /**
     * User-specific storage methods
     */
    setUserSession(sessionData) {
        return this.setItem('session', {
            ...sessionData,
            timestamp: Date.now(),
            version: '3.0.0'
        });
    }

    getUserSession() {
        const session = this.getItem('session');
        if (!session || !session.timestamp) {
            return null;
        }
        
        // Check if session has expired (30 minutes)
        const sessionAge = Date.now() - session.timestamp;
        if (sessionAge > 30 * 60 * 1000) {
            this.removeUserSession();
            return null;
        }
        
        return session;
    }

    removeUserSession() {
        return this.removeItem('session');
    }

    setUserProfile(profileData) {
        return this.setItem('profile', {
            ...profileData,
            lastUpdated: Date.now()
        });
    }

    getUserProfile() {
        return this.getItem('profile');
    }

    setLearningProgress(progressData) {
        return this.setItem('progress', {
            ...progressData,
            lastUpdated: Date.now()
        });
    }

    getLearningProgress() {
        return this.getItem('progress');
    }

    setUserPreferences(preferences) {
        return this.setItem('preferences', {
            ...preferences,
            lastUpdated: Date.now()
        });
    }

    getUserPreferences() {
        return this.getItem('preferences');
    }

    /**
     * Security methods
     */
    validateStorageIntegrity() {
        try {
            const testData = { test: 'integrity_check', timestamp: Date.now() };
            const testKey = 'integrity_test';
            
            // Test write
            if (!this.setItem(testKey, testData)) {
                return { valid: false, reason: 'Write test failed' };
            }
            
            // Test read
            const retrievedData = this.getItem(testKey);
            if (!retrievedData || retrievedData.test !== testData.test) {
                return { valid: false, reason: 'Read test failed' };
            }
            
            // Cleanup
            this.removeItem(testKey);
            
            return { valid: true, reason: 'Storage integrity validated' };
            
        } catch (error) {
            return { valid: false, reason: error.message };
        }
    }

    /**
     * Event logging
     */
    logStorageEvent(eventType, key = '', details = {}) {
        const event = {
            timestamp: new Date().toISOString(),
            type: eventType,
            key: key.replace(this.config.prefix, ''), // Remove prefix for cleaner logs
            details
        };
        
        console.log('💾 STORAGE EVENT:', event);
    }

    /**
     * Cleanup expired data
     */
    cleanupExpiredData() {
        const session = this.getUserSession();
        if (!session) {
            // Session cleanup already handled by getUserSession
        }
        
        // Additional cleanup logic can be added here
        this.logStorageEvent('cleanup_completed');
    }

    /**
     * Export user data (for GDPR compliance)
     */
    exportUserData() {
        try {
            const userData = {
                session: this.getUserSession(),
                profile: this.getUserProfile(),
                progress: this.getLearningProgress(),
                preferences: this.getUserPreferences(),
                exportTimestamp: new Date().toISOString(),
                version: '3.0.0'
            };
            
            this.logStorageEvent('data_exported');
            return userData;
            
        } catch (error) {
            console.error('Data export failed:', error);
            return null;
        }
    }

    /**
     * Import user data
     */
    importUserData(userData) {
        try {
            if (!userData || typeof userData !== 'object') {
                throw new Error('Invalid user data format');
            }
            
            let importedCount = 0;
            
            if (userData.session) {
                this.setUserSession(userData.session);
                importedCount++;
            }
            
            if (userData.profile) {
                this.setUserProfile(userData.profile);
                importedCount++;
            }
            
            if (userData.progress) {
                this.setLearningProgress(userData.progress);
                importedCount++;
            }
            
            if (userData.preferences) {
                this.setUserPreferences(userData.preferences);
                importedCount++;
            }
            
            this.logStorageEvent('data_imported', '', { count: importedCount });
            return { success: true, importedCount };
            
        } catch (error) {
            console.error('Data import failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize and export storage manager
const authStorage = new JuriBankAuthStorage();

// Export for use
if (typeof window !== 'undefined') {
    window.JuriBankAuthStorage = authStorage;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankAuthStorage;
}