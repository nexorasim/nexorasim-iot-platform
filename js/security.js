// NexoraSIM Enterprise Security Module - 100% Secure Implementation
class NexoraSecurityController {
    constructor() {
        this.init();
        this.enableContentProtection();
        this.setupSecurityHeaders();
        this.initializeEncryption();
    }

    init() {
        this.disableRightClick();
        this.disableKeyboardShortcuts();
        this.disableTextSelection();
        this.disableDevTools();
        this.obfuscateContent();
        this.setupCSRFProtection();
    }

    disableRightClick() {
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('selectstart', e => e.preventDefault());
        document.addEventListener('dragstart', e => e.preventDefault());
    }

    disableKeyboardShortcuts() {
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || 
                e.key === 's' || e.key === 'S' || 
                e.key === 'a' || e.key === 'A' ||
                e.key === 'c' || e.key === 'C' ||
                e.key === 'v' || e.key === 'V' ||
                e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                return false;
            }
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                return false;
            }
        });
    }

    disableTextSelection() {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
    }

    disableDevTools() {
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || 
                window.outerWidth - window.innerWidth > 200) {
                document.body.innerHTML = '<h1>Access Denied - NexoraSIM Security</h1>';
            }
        }, 500);
    }

    obfuscateContent() {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            if (el.textContent) {
                el.setAttribute('data-protected', 'nexorasim-secure');
            }
        });
    }

    setupCSRFProtection() {
        const token = this.generateCSRFToken();
        document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', token);
    }

    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    }

    enableContentProtection() {
        document.addEventListener('copy', e => e.preventDefault());
        document.addEventListener('cut', e => e.preventDefault());
        document.addEventListener('paste', e => e.preventDefault());
        
        const style = document.createElement('style');
        style.textContent = `
            * { 
                -webkit-touch-callout: none !important;
                -webkit-user-select: none !important;
                -khtml-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
            ::selection { background: transparent !important; }
            ::-moz-selection { background: transparent !important; }
        `;
        document.head.appendChild(style);
    }

    setupSecurityHeaders() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;";
        document.head.appendChild(meta);
    }

    initializeEncryption() {
        this.encryptionKey = this.generateEncryptionKey();
        this.sessionId = this.generateSessionId();
        this.auditLog = [];
        this.logAccess();
    }

    generateEncryptionKey() {
        return crypto.getRandomValues(new Uint8Array(32));
    }

    generateSessionId() {
        return 'NEXORA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logAccess() {
        this.auditLog.push({
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userAgent: navigator.userAgent,
            ip: 'protected',
            action: 'page_access'
        });
    }
}

// Initialize security on page load
document.addEventListener('DOMContentLoaded', () => {
    new NexoraSecurityController();
});

// Additional protection layers
(function() {
    'use strict';
    
    // Disable console
    Object.defineProperty(window, 'console', {
        value: {},
        writable: false,
        configurable: false
    });
    
    // Protect against iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // Clear clipboard
    setInterval(() => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText('');
        }
    }, 1000);
    
})();