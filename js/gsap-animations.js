// NexoraSIM GSAP Animation Controller - Premium Enterprise Effects
class NexoraGSAPController {
    constructor() {
        this.init();
        this.setupScrollTriggers();
        this.setupHeroAnimations();
        this.setupInteractiveAnimations();
        this.setupMorphingEffects();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger, TextPlugin, MorphSVGPlugin);
        gsap.config({ nullTargetWarn: false });
        
        // Set initial states
        gsap.set('[data-gsap]', { opacity: 0, y: 50 });
        gsap.set('.device-node', { scale: 0, rotation: 180 });
        gsap.set('.connection-line', { scaleX: 0 });
        gsap.set('.feature-card', { y: 100, opacity: 0, rotationX: 45 });
        gsap.set('.solution-card', { scale: 0.8, opacity: 0 });
    }

    setupHeroAnimations() {
        const tl = gsap.timeline({ delay: 0.5 });
        
        // Hero title with split text effect
        tl.to('[data-gsap="title"]', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        })
        .to('[data-gsap="subtitle"]', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.8')
        .to('[data-gsap="actions"]', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, '-=0.6')
        .to('[data-gsap="stats"] .stat', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.4');

        // IoT Network Animation
        this.animateIoTNetwork();
    }

    animateIoTNetwork() {
        const networkTl = gsap.timeline({ delay: 1 });
        
        // Central hub pulse
        networkTl.to('.central-hub', {
            scale: 1.2,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        })
        .to('.central-hub', {
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Device nodes appear with stagger
        networkTl.to('.device-node', {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        }, '-=0.6');

        // Connection lines draw
        networkTl.to('.connection-line', {
            scaleX: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power2.inOut'
        }, '-=0.4');

        // Continuous floating animation
        gsap.to('.device-node', {
            y: '-=10',
            duration: 2,
            stagger: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        // Data pulse animation
        gsap.to('.data-pulse', {
            scale: 1.5,
            opacity: 0,
            duration: 2,
            stagger: 0.5,
            repeat: -1,
            ease: 'power2.out'
        });
    }

    setupScrollTriggers() {
        // Features section
        ScrollTrigger.create({
            trigger: '[data-gsap="features"]',
            start: 'top 80%',
            onEnter: () => {
                gsap.to('.feature-card', {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.out'
                });
            }
        });

        // Solutions section with morphing
        ScrollTrigger.create({
            trigger: '[data-gsap="solutions"]',
            start: 'top 75%',
            onEnter: () => {
                gsap.to('.solution-card', {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'back.out(1.4)'
                });
            }
        });

        // Parallax effects
        gsap.to('[data-gsap="visual"]', {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Navigation background
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: { className: 'nav-scrolled', targets: '.nav' }
        });
    }

    setupInteractiveAnimations() {
        // Button hover effects
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    y: -3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Feature card interactions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -15,
                    rotationY: 5,
                    scale: 1.02,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    rotationY: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });

        // Solution card hover with 3D effect
        document.querySelectorAll('.solution-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    rotationX: -5,
                    rotationY: 5,
                    z: 50,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    z: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }

    setupMorphingEffects() {
        // Create SVG morphing shapes
        this.createMorphingSVG();
        
        // Animate stats numbers
        this.animateCounters();
        
        // Text scramble effect
        this.setupTextScramble();
    }

    createMorphingSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');
        svg.style.position = 'absolute';
        svg.style.top = '20px';
        svg.style.right = '20px';
        svg.style.opacity = '0.1';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M50,10 L90,90 L10,90 Z');
        path.setAttribute('fill', '#2e70e5');
        svg.appendChild(path);

        document.querySelector('.hero').appendChild(svg);

        // Morph animation
        gsap.to(path, {
            morphSVG: 'M50,10 C90,30 90,70 50,90 C10,70 10,30 50,10 Z',
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    animateCounters() {
        const counters = [
            { element: '.stat-number', endValue: 50, suffix: 'M+' },
            { element: '.stat-number', endValue: 99.9, suffix: '%' },
            { element: '.stat-number', endValue: 500, suffix: '+' }
        ];

        ScrollTrigger.create({
            trigger: '.hero-stats',
            start: 'top 80%',
            onEnter: () => {
                document.querySelectorAll('.stat-number').forEach((el, index) => {
                    const counter = counters[index];
                    if (counter) {
                        gsap.from({ value: 0 }, {
                            value: counter.endValue,
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: function() {
                                const val = this.targets()[0].value;
                                el.textContent = Math.round(val * 10) / 10 + counter.suffix;
                            }
                        });
                    }
                });
            }
        });
    }

    setupTextScramble() {
        const scrambleText = (element, finalText) => {
            const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            let iteration = 0;
            
            const interval = setInterval(() => {
                element.textContent = finalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return finalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
                
                if (iteration >= finalText.length) {
                    clearInterval(interval);
                }
                
                iteration += 1 / 3;
            }, 30);
        };

        // Apply scramble effect to title on load
        setTimeout(() => {
            const titleElement = document.querySelector('.gradient-text');
            if (titleElement) {
                scrambleText(titleElement, 'Intelligent Insights');
            }
        }, 2000);
    }

    // Advanced particle system
    createParticleSystem() {
        const particleCount = 50;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'gsap-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #2e70e5;
                border-radius: 50%;
                pointer-events: none;
            `;
            
            document.querySelector('.hero').appendChild(particle);
            particles.push(particle);

            // Animate particles
            gsap.set(particle, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random()
            });

            gsap.to(particle, {
                x: `+=${Math.random() * 200 - 100}`,
                y: `+=${Math.random() * 200 - 100}`,
                opacity: Math.random(),
                duration: Math.random() * 5 + 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    // Performance optimization
    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.globalTimeline.timeScale(0.5);
        }

        // Pause animations when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                gsap.globalTimeline.pause();
            } else {
                gsap.globalTimeline.resume();
            }
        });
    }
}

// Initialize GSAP animations
document.addEventListener('DOMContentLoaded', () => {
    const nexoraGSAP = new NexoraGSAPController();
    nexoraGSAP.createParticleSystem();
    nexoraGSAP.optimizeAnimations();
});

// Export for global access
window.NexoraGSAP = NexoraGSAPController;