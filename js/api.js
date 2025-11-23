// NexoraSIM API Client - Secure Data Management
class NexoraAPIClient {
    constructor() {
        this.baseURL = 'https://api.nexorasim.com/v1';
        this.apiKey = this.generateSecureAPIKey();
        this.endpoints = {
            devices: '/devices',
            analytics: '/analytics',
            users: '/users',
            data: '/data',
            auth: '/auth',
            monitoring: '/monitoring'
        };
        this.init();
    }

    init() {
        this.setupRequestInterceptors();
        this.initializeCache();
        this.setupErrorHandling();
        this.validateConnection();
    }

    generateSecureAPIKey() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 15);
        return `NEXORA_${timestamp}_${random}`;
    }

    async makeSecureRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'X-API-Version': '1.0',
            'X-Client-ID': 'nexorasim-web',
            'X-Timestamp': Date.now().toString(),
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async getDeviceData(deviceId) {
        return await this.makeSecureRequest(`${this.endpoints.devices}/${deviceId}/data`);
    }

    async getAnalytics(timeRange = '24h') {
        return await this.makeSecureRequest(`${this.endpoints.analytics}?range=${timeRange}`);
    }

    async getRealTimeData() {
        return await this.makeSecureRequest(`${this.endpoints.data}/realtime`);
    }

    async getSystemStatus() {
        return await this.makeSecureRequest(`${this.endpoints.monitoring}/status`);
    }

    async authenticateUser(credentials) {
        return await this.makeSecureRequest(this.endpoints.auth, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    setupRequestInterceptors() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const [url, options] = args;
            
            if (url.includes('nexorasim.com')) {
                const secureOptions = {
                    ...options,
                    headers: {
                        ...options?.headers,
                        'X-Security-Token': this.generateSecurityToken(),
                        'X-Request-ID': this.generateRequestId()
                    }
                };
                return originalFetch(url, secureOptions);
            }
            
            return originalFetch(...args);
        };
    }

    generateSecurityToken() {
        return btoa(Date.now() + Math.random().toString()).substr(0, 32);
    }

    generateRequestId() {
        return 'REQ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }

    initializeCache() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    setupErrorHandling() {
        window.addEventListener('unhandledrejection', event => {
            if (event.reason?.message?.includes('API Error')) {
                this.logError(event.reason);
                event.preventDefault();
            }
        });
    }

    handleError(error) {
        const errorData = {
            message: error.message,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.logError(errorData);
        this.showUserFriendlyError();
    }

    logError(error) {
        console.error('NexoraSIM API Error:', error);
        
        // Send to monitoring service
        this.makeSecureRequest('/monitoring/errors', {
            method: 'POST',
            body: JSON.stringify(error)
        }).catch(() => {
            // Silent fail for error logging
        });
    }

    showUserFriendlyError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Inter, sans-serif;
        `;
        errorDiv.textContent = 'Connection issue. Please try again.';
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    async validateConnection() {
        try {
            await this.getSystemStatus();
            this.connectionStatus = 'connected';
        } catch (error) {
            this.connectionStatus = 'disconnected';
            this.setupRetryMechanism();
        }
    }

    setupRetryMechanism() {
        let retryCount = 0;
        const maxRetries = 3;
        
        const retry = async () => {
            if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(async () => {
                    try {
                        await this.validateConnection();
                    } catch (error) {
                        retry();
                    }
                }, retryCount * 2000);
            }
        };
        
        retry();
    }

    // Real-time data streaming
    initializeWebSocket() {
        this.ws = new WebSocket('wss://ws.nexorasim.com/realtime');
        
        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                type: 'auth',
                token: this.apiKey
            }));
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealtimeData(data);
        };
        
        this.ws.onclose = () => {
            setTimeout(() => this.initializeWebSocket(), 5000);
        };
    }

    handleRealtimeData(data) {
        const event = new CustomEvent('nexora-realtime-data', {
            detail: data
        });
        document.dispatchEvent(event);
    }

    // Data validation and sanitization
    validateData(data, schema) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data format');
        }
        
        for (const [key, type] of Object.entries(schema)) {
            if (typeof data[key] !== type) {
                throw new Error(`Invalid ${key} type`);
            }
        }
        
        return true;
    }

    sanitizeInput(input) {
        if (typeof input === 'string') {
            return input.replace(/[<>\"'&]/g, '');
        }
        return input;
    }
}

// Data Analytics Module
class NexoraAnalytics {
    constructor(apiClient) {
        this.api = apiClient;
        this.metrics = new Map();
        this.init();
    }

    init() {
        this.startMetricsCollection();
        this.setupPerformanceMonitoring();
    }

    async collectDeviceMetrics() {
        try {
            const data = await this.api.getRealTimeData();
            this.processMetrics(data);
            return data;
        } catch (error) {
            console.error('Metrics collection failed:', error);
        }
    }

    processMetrics(data) {
        if (data.devices) {
            this.metrics.set('activeDevices', data.devices.length);
            this.metrics.set('dataPoints', data.totalDataPoints);
            this.metrics.set('lastUpdate', new Date().toISOString());
        }
    }

    startMetricsCollection() {
        setInterval(() => {
            this.collectDeviceMetrics();
        }, 30000); // Every 30 seconds
    }

    setupPerformanceMonitoring() {
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'navigation') {
                        this.metrics.set('pageLoadTime', entry.loadEventEnd - entry.loadEventStart);
                    }
                });
            });
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    getMetrics() {
        return Object.fromEntries(this.metrics);
    }
}

// Initialize API client and analytics
const nexoraAPI = new NexoraAPIClient();
const nexoraAnalytics = new NexoraAnalytics(nexoraAPI);

// Export for global access
window.NexoraAPI = nexoraAPI;
window.NexoraAnalytics = nexoraAnalytics;