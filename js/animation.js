// Enhanced 3D Animation Controller for IoT SaaS Landing Page
class IoTAnimationController {
    constructor() {
        this.init();
        this.setupScrollAnimations();
        this.setupInteractiveElements();
        this.setupParallaxEffects();
    }

    init() {
        // Initialize animation variables
        this.isAnimating = true;
        this.mousePosition = { x: 0, y: 0 };
        this.scrollPosition = 0;
        
        // Start animation loop
        this.animate();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mouse movement for parallax
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = (e.clientY / window.innerHeight) * 2 - 1;
        });

        // Scroll tracking
        window.addEventListener('scroll', () => {
            this.scrollPosition = window.pageYOffset;
        });

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.feature-card, .solution-card').forEach(el => {
            observer.observe(el);
        });
    }

    animate() {
        if (!this.isAnimating) return;

        // Update 3D network rotation based on mouse position
        const network = document.querySelector('.iot-network');
        if (network) {
            const rotationX = this.mousePosition.y * 10;
            const rotationY = this.mousePosition.x * 10;
            network.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        }

        // Update data pulses
        this.updateDataPulses();

        // Update parallax elements
        this.updateParallax();

        requestAnimationFrame(() => this.animate());
    }

    updateDataPulses() {
        const pulses = document.querySelectorAll('.data-pulse');
        const time = Date.now() * 0.001;

        pulses.forEach((pulse, index) => {
            const offset = index * 1.2;
            const scale = 0.5 + Math.sin(time + offset) * 0.3;
            const opacity = 0.3 + Math.sin(time + offset) * 0.4;
            
            pulse.style.transform = `scale(${scale})`;
            pulse.style.opacity = Math.max(0, opacity);
        });
    }

    updateParallax() {
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            const parallaxY = this.scrollPosition * 0.3;
            heroVisual.style.transform = `translateY(${parallaxY}px)`;
        }
    }

    setupScrollAnimations() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.nav');
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = 'none';
            }
        });
    }

    setupInteractiveElements() {
        // Enhanced button interactions
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            btn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(0) scale(0.98)';
            });

            btn.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
        });

        // Feature card interactions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) rotateX(5deg)';
                this.style.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateX(0deg)';
                this.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            });
        });

        // Solution card interactions
        document.querySelectorAll('.solution-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-16px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupParallaxEffects() {
        // Create floating particles
        this.createFloatingParticles();
        
        // Setup background animations
        this.setupBackgroundAnimations();
    }

    createFloatingParticles() {
        const hero = document.querySelector('.hero');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(46, 112, 229, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: 1;
            `;
            hero.appendChild(particle);
        }

        // Add floating animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
                25% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
                50% { transform: translateY(-40px) translateX(-5px); opacity: 0.2; }
                75% { transform: translateY(-20px) translateX(-10px); opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }

    setupBackgroundAnimations() {
        // Animated gradient background
        const hero = document.querySelector('.hero');
        let gradientAngle = 135;
        
        setInterval(() => {
            gradientAngle += 0.5;
            hero.style.background = `linear-gradient(${gradientAngle}deg, #ffffff 0%, #f9fafb 100%)`;
        }, 100);
    }

    // Performance optimization
    optimizePerformance() {
        // Reduce animations on mobile
        if (window.innerWidth < 768) {
            this.isAnimating = false;
            document.querySelector('.iot-network').style.animation = 'none';
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            this.isAnimating = !document.hidden;
        });
    }
}

// Advanced IoT Network Visualization
class IoTNetworkVisualizer {
    constructor() {
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.dataPackets = [];
        
        this.init();
        this.animate();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5;
        `;
        
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.appendChild(canvas);
        }
        
        return canvas;
    }

    init() {
        this.resizeCanvas();
        this.createNodes();
        this.createConnections();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createNodes() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 150;

        // Central hub
        this.nodes.push({
            x: centerX,
            y: centerY,
            radius: 20,
            type: 'hub',
            pulse: 0
        });

        // Surrounding nodes
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            this.nodes.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: 8,
                type: 'device',
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    createConnections() {
        const hub = this.nodes[0];
        for (let i = 1; i < this.nodes.length; i++) {
            this.connections.push({
                from: hub,
                to: this.nodes[i],
                strength: Math.random() * 0.5 + 0.5
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.drawNodes();
        this.updateDataPackets();
        this.drawDataPackets();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        this.ctx.strokeStyle = 'rgba(46, 112, 229, 0.3)';
        this.ctx.lineWidth = 2;

        this.connections.forEach(conn => {
            this.ctx.beginPath();
            this.ctx.moveTo(conn.from.x, conn.from.y);
            this.ctx.lineTo(conn.to.x, conn.to.y);
            this.ctx.stroke();
        });
    }

    drawNodes() {
        this.nodes.forEach(node => {
            const time = Date.now() * 0.003;
            node.pulse += 0.05;

            if (node.type === 'hub') {
                const pulseRadius = node.radius + Math.sin(node.pulse) * 5;
                
                // Outer glow
                const gradient = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, pulseRadius * 2
                );
                gradient.addColorStop(0, 'rgba(46, 112, 229, 0.8)');
                gradient.addColorStop(1, 'rgba(46, 112, 229, 0)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
                this.ctx.fill();

                // Core
                this.ctx.fillStyle = '#2e70e5';
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                const floatY = Math.sin(time + node.pulse) * 3;
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.strokeStyle = '#2e70e5';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y + floatY, node.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            }
        });
    }

    updateDataPackets() {
        // Create new data packets
        if (Math.random() < 0.1) {
            const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
            this.dataPackets.push({
                from: connection.from,
                to: connection.to,
                progress: 0,
                speed: 0.02 + Math.random() * 0.03
            });
        }

        // Update existing packets
        this.dataPackets = this.dataPackets.filter(packet => {
            packet.progress += packet.speed;
            return packet.progress <= 1;
        });
    }

    drawDataPackets() {
        this.ctx.fillStyle = '#2e70e5';
        
        this.dataPackets.forEach(packet => {
            const x = packet.from.x + (packet.to.x - packet.from.x) * packet.progress;
            const y = packet.from.y + (packet.to.y - packet.from.y) * packet.progress;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IoTAnimationController();
    new IoTNetworkVisualizer();
});

// Performance monitoring
const performanceMonitor = {
    fps: 0,
    lastTime: performance.now(),
    frameCount: 0,

    update() {
        const now = performance.now();
        this.frameCount++;
        
        if (now >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            
            // Optimize if FPS is too low
            if (this.fps < 30) {
                document.body.classList.add('low-performance');
            }
        }
        
        requestAnimationFrame(() => this.update());
    }
};

performanceMonitor.update();