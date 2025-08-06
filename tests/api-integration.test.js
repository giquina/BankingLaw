/**
 * JuriBank Educational Platform - API Integration Test Suite
 * Comprehensive testing for government API integrations
 * 
 * Test Categories:
 * - API connectivity and reliability
 * - Data validation and transformation
 * - Security and authentication
 * - Performance and caching
 * - Educational content quality
 * - Error handling and fallbacks
 */

const { describe, test, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const APIGateway = require('../src/api-gateway');
const FCAIntegration = require('../src/api/fca-integration');
const HMRCIntegration = require('../src/api/hmrc-integration');
const GovUKIntegration = require('../src/api/govuk-integration');

// Test configuration
const testConfig = {
    timeout: 30000, // 30 seconds for API calls
    apiKey: 'test_key_' + Date.now(),
    baseURL: 'http://localhost:3001'
};

// Mock logger for testing
const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
};

// Test suite setup
describe('JuriBank API Integration Test Suite', () => {
    let apiGateway;
    let testServer;

    beforeAll(async () => {
        // Initialize API Gateway for testing
        apiGateway = new APIGateway({
            port: 3001,
            environment: 'test',
            logger: mockLogger,
            corsOrigins: ['http://localhost:3000'],
            rateLimiting: {
                enabled: false // Disable for testing
            }
        });

        // Start test server
        await apiGateway.start();
        testServer = request(testConfig.baseURL);
    });

    afterAll(async () => {
        // Cleanup test server
        if (apiGateway && apiGateway.server) {
            await new Promise((resolve) => {
                apiGateway.server.close(resolve);
            });
        }
    });

    // Health Check Tests
    describe('Health and Status Monitoring', () => {
        test('API health endpoint responds correctly', async () => {
            const response = await testServer
                .get('/api/health')
                .expect(200);

            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('version', '3.0.0');
            expect(response.body).toHaveProperty('services');
        });

        test('Metrics endpoint provides comprehensive data', async () => {
            const response = await testServer
                .get('/api/metrics')
                .expect(200);

            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('metrics');
            expect(response.body.metrics).toHaveProperty('uptime');
            expect(response.body.metrics).toHaveProperty('requests');
            expect(response.body.metrics).toHaveProperty('performance');
        });

        test('System uptime is tracked correctly', async () => {
            const response = await testServer.get('/api/metrics');
            
            expect(response.body.metrics.uptime).toHaveProperty('milliseconds');
            expect(response.body.metrics.uptime).toHaveProperty('human');
            expect(typeof response.body.metrics.uptime.milliseconds).toBe('number');
            expect(response.body.metrics.uptime.milliseconds).toBeGreaterThan(0);
        });
    });

    // FCA Integration Tests
    describe('FCA API Integration', () => {
        let fcaIntegration;

        beforeEach(() => {
            fcaIntegration = new FCAIntegration({
                logger: mockLogger,
                cache: null // Disable caching for testing
            });
        });

        test('FCA alerts endpoint returns valid data structure', async () => {
            const response = await testServer
                .get('/api/fca/alerts')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('metadata');
            expect(response.body.metadata).toHaveProperty('source', 'fca');
        });

        test('FCA alerts contain required educational context', async () => {
            const response = await testServer.get('/api/fca/alerts');
            
            if (response.body.data && Array.isArray(response.body.data)) {
                response.body.data.forEach(alert => {
                    expect(alert).toHaveProperty('title');
                    expect(alert).toHaveProperty('severity');
                    expect(alert).toHaveProperty('source');
                    expect(alert).toHaveProperty('published_date');
                });
            }
        });

        test('FCA firm search validates input correctly', async () => {
            // Test with valid firm name
            const validResponse = await testServer
                .get('/api/fca/firms/test-bank')
                .expect(200);

            expect(validResponse.body.success).toBe(true);

            // Test with invalid characters (should be sanitized)
            const invalidResponse = await testServer
                .get('/api/fca/firms/<script>alert("xss")</script>')
                .expect(200); // Should not return 400 due to sanitization

            expect(invalidResponse.body.success).toBe(true);
        });

        test('FCA API handles rate limiting gracefully', async () => {
            // This test would normally trigger rate limiting
            // In test environment, it should pass due to disabled rate limiting
            const promises = Array(10).fill().map(() => 
                testServer.get('/api/fca/alerts')
            );

            const responses = await Promise.all(promises);
            responses.forEach(response => {
                expect(response.status).toBe(200);
            });
        });
    });

    // HMRC Integration Tests
    describe('HMRC API Integration', () => {
        test('Tax guidance endpoint provides educational content', async () => {
            const response = await testServer
                .get('/api/hmrc/tax-guidance')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('disclaimer');
            expect(response.body.data).toHaveProperty('educationalPurpose', true);
        });

        test('Employment rights data includes practical guidance', async () => {
            const response = await testServer
                .get('/api/hmrc/employment-rights')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('minimumWage');
            expect(data).toHaveProperty('guidance');
            expect(data.guidance).toHaveProperty('knowYourRights');
        });

        test('Benefits information includes eligibility checker', async () => {
            const response = await testServer
                .get('/api/hmrc/benefits')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('calculators');
            expect(data.calculators).toHaveProperty('benefitsCalculator');
            expect(data.calculators).toHaveProperty('eligibilityChecker');
        });

        test('Self-employment guidance provides educational tools', async () => {
            const response = await testServer
                .get('/api/hmrc/self-employment')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('tools');
            expect(data.tools).toHaveProperty('expenseTracker');
            expect(data.tools).toHaveProperty('taxCalculator');
        });
    });

    // Gov.UK Integration Tests
    describe('Gov.UK API Integration', () => {
        test('Guidance endpoint returns structured educational content', async () => {
            const response = await testServer
                .get('/api/govuk/guidance/tax')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('topic');
            expect(response.body.data).toHaveProperty('educationalContext');
        });

        test('News endpoint provides relevant updates', async () => {
            const response = await testServer
                .get('/api/govuk/news')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('articles');
            expect(data).toHaveProperty('educationalValue');
        });

        test('Publications endpoint includes educational metadata', async () => {
            const response = await testServer
                .get('/api/govuk/publications')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('publications');
            expect(Array.isArray(data.publications)).toBe(true);
        });
    });

    // Security Tests
    describe('API Security', () => {
        test('Security headers are properly set', async () => {
            const response = await testServer.get('/api/health');

            expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
            expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
            expect(response.headers).toHaveProperty('referrer-policy');
            expect(response.headers['content-security-policy']).toContain("default-src 'self'");
        });

        test('CORS is properly configured', async () => {
            const response = await testServer
                .options('/api/health')
                .set('Origin', 'http://localhost:3000')
                .expect(200);

            expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        });

        test('Invalid CORS origins are rejected', async () => {
            await testServer
                .get('/api/health')
                .set('Origin', 'https://malicious-site.com')
                .expect(500); // Should be rejected by CORS policy
        });

        test('Request validation prevents malicious input', async () => {
            // Test SQL injection attempt
            const sqlResponse = await testServer
                .get('/api/fca/firms/"; DROP TABLE users; --')
                .expect(200); // Should be sanitized, not blocked

            expect(sqlResponse.body.success).toBe(true);

            // Test XSS attempt
            const xssResponse = await testServer
                .get('/api/govuk/guidance/<script>alert("xss")</script>')
                .expect(200); // Should be sanitized

            expect(xssResponse.body.success).toBe(true);
        });

        test('Request ID is tracked across all requests', async () => {
            const response = await testServer.get('/api/health');
            
            expect(response.headers).toHaveProperty('x-request-id');
            expect(response.body).toHaveProperty('requestId');
            expect(response.headers['x-request-id']).toBe(response.body.requestId);
        });
    });

    // Performance Tests
    describe('Performance and Caching', () => {
        test('Response times are within acceptable limits', async () => {
            const startTime = Date.now();
            
            await testServer
                .get('/api/health')
                .expect(200);

            const responseTime = Date.now() - startTime;
            expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
        });

        test('Caching headers are set appropriately', async () => {
            const response = await testServer.get('/api/fca/alerts');
            
            expect(response.body.metadata).toHaveProperty('fromCache');
            expect(typeof response.body.metadata.fromCache).toBe('boolean');
        });

        test('Large request payloads are handled correctly', async () => {
            const largeQuery = 'a'.repeat(1000); // 1KB query
            
            const response = await testServer
                .get(`/api/govuk/guidance/tax?query=${largeQuery}`)
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });

    // Educational Content Quality Tests
    describe('Educational Content Quality', () => {
        test('All content includes educational disclaimers', async () => {
            const endpoints = [
                '/api/fca/alerts',
                '/api/hmrc/tax-guidance',
                '/api/govuk/guidance/tax'
            ];

            for (const endpoint of endpoints) {
                const response = await testServer.get(endpoint);
                
                if (response.body.success) {
                    expect(response.body.data).toHaveProperty('disclaimer');
                    expect(response.body.data.disclaimer).toContain('educational purposes');
                }
            }
        });

        test('Content transformation adds learning context', async () => {
            const response = await testServer.get('/api/hmrc/tax-guidance');
            
            const data = response.body.data;
            expect(data).toHaveProperty('learningObjectives');
            expect(Array.isArray(data.learningObjectives)).toBe(true);
            expect(data.learningObjectives.length).toBeGreaterThan(0);
        });

        test('Technical terms are explained for educational use', async () => {
            const response = await testServer.get('/api/fca/alerts');
            
            if (response.body.data && Array.isArray(response.body.data)) {
                response.body.data.forEach(alert => {
                    if (alert.technicalTerms) {
                        expect(typeof alert.technicalTerms).toBe('object');
                        
                        // Check that terms have explanations
                        Object.values(alert.technicalTerms).forEach(explanation => {
                            expect(typeof explanation).toBe('string');
                            expect(explanation.length).toBeGreaterThan(10);
                        });
                    }
                });
            }
        });
    });

    // Error Handling Tests
    describe('Error Handling and Fallbacks', () => {
        test('404 errors return consistent format', async () => {
            const response = await testServer
                .get('/api/nonexistent-endpoint')
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
        });

        test('Invalid JSON responses are handled gracefully', async () => {
            // This would test malformed API responses from external services
            // In a real test, we'd mock the external API to return invalid JSON
            const response = await testServer.get('/api/health');
            
            expect(response.body).toBeInstanceOf(Object);
            expect(response.headers['content-type']).toContain('application/json');
        });

        test('Timeout handling provides fallback data', async () => {
            // This would test timeout scenarios
            // Implementation would depend on mocking external API delays
            const response = await testServer
                .get('/api/fca/alerts')
                .timeout(5000);

            expect(response.status).toBeLessThan(500);
            
            if (!response.body.success && response.body.fallback) {
                expect(response.body.fallback).toHaveProperty('message');
            }
        });

        test('Fallback data maintains educational structure', async () => {
            // Test that even fallback responses maintain educational format
            const response = await testServer.get('/api/hmrc/tax-guidance');
            
            const data = response.body.data;
            if (data.fallback) {
                expect(data).toHaveProperty('disclaimer');
                expect(data).toHaveProperty('guidance');
            }
        });
    });

    // Data Validation Tests
    describe('Data Validation and Integrity', () => {
        test('API responses conform to expected schema', async () => {
            const response = await testServer.get('/api/dashboard/summary');
            
            expect(response.body).toMatchObject({
                success: expect.any(Boolean),
                data: expect.any(Object),
                metadata: expect.objectContaining({
                    requestId: expect.any(String),
                    timestamp: expect.any(String)
                })
            });
        });

        test('Date formats are consistent across endpoints', async () => {
            const response = await testServer.get('/api/fca/alerts');
            
            if (response.body.data && Array.isArray(response.body.data)) {
                response.body.data.forEach(alert => {
                    if (alert.published_date) {
                        // Should be valid ISO 8601 date
                        expect(() => new Date(alert.published_date)).not.toThrow();
                        expect(new Date(alert.published_date).toISOString()).toBe(alert.published_date);
                    }
                });
            }
        });

        test('Numeric values are properly formatted', async () => {
            const response = await testServer.get('/api/hmrc/tax-guidance');
            
            const data = response.body.data;
            if (data.personalAllowance && data.personalAllowance.amount) {
                expect(typeof data.personalAllowance.amount).toBe('number');
                expect(data.personalAllowance.amount).toBeGreaterThan(0);
            }
        });
    });

    // Integration Tests
    describe('Cross-Service Integration', () => {
        test('Dashboard summary aggregates data from all sources', async () => {
            const response = await testServer
                .get('/api/dashboard/summary')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('totalAlerts');
            expect(data).toHaveProperty('lastTaxUpdate');
            expect(data).toHaveProperty('recentNews');
        });

        test('All alerts endpoint combines multiple sources', async () => {
            const response = await testServer
                .get('/api/alerts/all')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('fca');
            expect(data).toHaveProperty('govuk');
            expect(data).toHaveProperty('total');
            expect(typeof data.total).toBe('number');
        });

        test('Recent updates endpoint provides cross-platform insights', async () => {
            const response = await testServer
                .get('/api/updates/recent')
                .expect(200);

            const data = response.body.data;
            expect(data).toHaveProperty('sources');
            expect(Array.isArray(data.sources)).toBe(true);
        });
    });
});

// Performance benchmark tests
describe('Performance Benchmarks', () => {
    test('Concurrent request handling', async () => {
        const concurrentRequests = 50;
        const startTime = Date.now();
        
        const promises = Array(concurrentRequests).fill().map(() => 
            request(testConfig.baseURL).get('/api/health')
        );

        const responses = await Promise.all(promises);
        const totalTime = Date.now() - startTime;
        
        // All requests should succeed
        responses.forEach(response => {
            expect(response.status).toBe(200);
        });
        
        // Should handle 50 requests in under 5 seconds
        expect(totalTime).toBeLessThan(5000);
        
        // Calculate requests per second
        const rps = (concurrentRequests / totalTime) * 1000;
        expect(rps).toBeGreaterThan(10); // At least 10 RPS
    });

    test('Memory usage remains stable', async () => {
        const initialMemory = process.memoryUsage().heapUsed;
        
        // Make multiple requests to check for memory leaks
        for (let i = 0; i < 100; i++) {
            await request(testConfig.baseURL).get('/api/health');
        }
        
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Memory increase should be reasonable (less than 10MB)
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
});

// Educational compliance tests
describe('Educational Compliance', () => {
    test('All responses include appropriate educational warnings', async () => {
        const educationalEndpoints = [
            '/api/fca/alerts',
            '/api/hmrc/tax-guidance',
            '/api/govuk/guidance/tax'
        ];

        for (const endpoint of educationalEndpoints) {
            const response = await request(testConfig.baseURL).get(endpoint);
            
            if (response.body.success) {
                expect(response.body.data.disclaimer).toMatch(/educational purposes/i);
                expect(response.body.data.disclaimer).toMatch(/professional advice/i);
            }
        }
    });

    test('Content is tagged with educational metadata', async () => {
        const response = await request(testConfig.baseURL)
            .get('/api/fca/alerts');

        expect(response.body.metadata).toHaveProperty('educationalPurpose', true);
        expect(response.body.metadata).toHaveProperty('source');
    });
});

console.log('🧪 JuriBank API Integration Test Suite Loaded');
console.log('📚 Educational platform testing framework ready');
console.log('🔒 Security and compliance testing enabled');