/**
 * Advanced Animations with GSAP
 * Handles all animations, scroll effects, and interactive elements
 * Uses GSAP for smooth, performant animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP is not loaded. Animations will be disabled.');
        return;
    }

    // Register GSAP plugins
    const plugins = [];
    
    try {
        // Try to register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            plugins.push('ScrollTrigger');
        }
        
        // Try to register TextPlugin if available
        if (typeof TextPlugin !== 'undefined') {
            gsap.registerPlugin(TextPlugin);
            plugins.push('TextPlugin');
        }
        
        console.log(`GSAP initialized with plugins: ${plugins.join(', ') || 'none'}`);
    } catch (error) {
        console.error('Error initializing GSAP plugins:', error);
    }

    // Initialize animations
    const animations = new AdvancedAnimations();
    
    // Add resize listener for responsive adjustments
    window.addEventListener('resize', debounce(() => {
        ScrollTrigger.refresh();
    }, 250));
});

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

class AdvancedAnimations {
    constructor() {
        // Animation timeline for sequenced animations
        this.masterTimeline = gsap.timeline({ paused: false });
        
        // Initialize all animations
        this.initializeAnimations();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.initializeParallax();
        this.initializePageTransitions();
        this.initializeLazyLoading();
        
        // Start the master timeline
        this.masterTimeline.play();
    }

    /**
     * Initialize core animations that run on page load
     */
    initializeAnimations() {
        // Animate hero section
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        // Hero text animation
        heroTl.from('.hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.2
        });

        // Add to master timeline
        this.masterTimeline.add(heroTl, 'hero');
        
        // Animate feature cards with staggered delay
        const featureCards = gsap.utils.toArray('.feature-card');
        featureCards.forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'back.out(1.4)'
            });
        });
    }

    setupScrollAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // Parallax effect for hero section
        gsap.to('.hero', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            yPercent: -10,
            ease: 'none'
        });
        
        // Animate sections on scroll
        const sections = document.querySelectorAll('.animate-on-scroll');
        sections.forEach((section, i) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none none',
                    markers: false, // Set to true for debugging
                    id: `section-${i}`
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: delay,
                ease: 'power3.out',
                onComplete: () => {
                    // Add subtle pulse animation when element comes into view
                    gsap.to(section, {
                        scale: 1.02,
                        duration: 0.5,
                        yoyo: true,
                        repeat: 1,
                        ease: 'sine.inOut'
                    });
                }
            });
        });
        
        // Animate progress bars on scroll
        this.animateProgressBars();
    }

    /**
     * Set up hover effects for interactive elements
     */
    setupHoverEffects() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.btn:not(.no-hover)');
        
        buttons.forEach(button => {
            // Skip if already has hover effect
            if (button.classList.contains('has-hover-effect')) return;
            
            button.classList.add('has-hover-effect');
            
            button.addEventListener('mouseenter', (e) => {
                this.animateButtonHover(e.currentTarget, true);
            });
            
            button.addEventListener('mouseleave', (e) => {
                this.animateButtonHover(e.currentTarget, false);
            });
        });
        
        // Card hover effects
        const cards = document.querySelectorAll('.card:not(.no-hover)');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateCardHover(card, true));
            card.addEventListener('mouseleave', () => this.animateCardHover(card, false));
        });
    }
    
    /**
     * Animate button hover state
     * @param {HTMLElement} button - The button element
     * @param {boolean} isHovering - Whether the button is being hovered
     */
    animateButtonHover(button, isHovering) {
        const tl = gsap.timeline({ defaults: { duration: 0.3, ease: 'power2.out' } });
        
        if (isHovering) {
            tl.to(button, {
                y: -2,
                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                scale: 1.02
            });
        } else {
            tl.to(button, {
                y: 0,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                scale: 1
            });
        }
    }
    
    /**
     * Animate card hover state
     * @param {HTMLElement} card - The card element
     * @param {boolean} isHovering - Whether the card is being hovered
     */
    animateCardHover(card, isHovering) {
        const content = card.querySelector('.card-body') || card;
        const tl = gsap.timeline({ defaults: { duration: 0.4, ease: 'power2.out' } });
        
        if (isHovering) {
            tl.to(card, {
                y: -5,
                boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                scale: 1.02
            })
            .to(content, { 
                y: -3 
            }, '<');
        } else {
            tl.to(card, {
                y: 0,
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                scale: 1
            })
            .to(content, { 
                y: 0 
            }, '<');
        }
    }

    /**
     * Initialize parallax effects
     */
    initializeParallax() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // Parallax for hero background
        const heroBg = document.querySelector('.parallax-bg');
        if (heroBg) {
            gsap.to(heroBg, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
        
        // Parallax for other elements
        document.querySelectorAll('.parallax-element').forEach((el, i) => {
            const depth = parseFloat(el.getAttribute('data-depth') || '0.2');
            gsap.to(el, {
                yPercent: 20 * depth,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('section') || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }
    
    /**
     * Initialize page transitions
     */
    initializePageTransitions() {
        // Add transition class to body after initial load
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
        
        // Handle link clicks for smooth transitions
        document.querySelectorAll('a[href^="/"], a[href^="."]').forEach(link => {
            if (link.host === window.location.host && !link.classList.contains('no-transition')) {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Don't intercept if it's a hash link or has a target
                    if (href.startsWith('#') || link.target || link.hasAttribute('download')) {
                        return;
                    }
                    
                    e.preventDefault();
                    
                    // Add transition out class
                    document.body.classList.add('page-transition-out');
                    
                    // Navigate after animation
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                });
            }
        });
    }
    
    /**
     * Initialize lazy loading for images and iframes
     */
    initializeLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback for browsers without native lazy loading
            this.initializeLazyLoadFallback();
        }
    }
    
    /**
     * Fallback for browsers without native lazy loading
     */
    initializeLazyLoadFallback() {
        const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.add('lazy-loaded');
                        lazyImageObserver.unobserve(lazyImage);
                        
                        // Fade in image when loaded
                        lazyImage.onload = () => {
                            gsap.to(lazyImage, {
                                opacity: 1,
                                duration: 0.5,
                                ease: 'power2.out'
                            });
                        };
                    }
                });
            });
            
            lazyImages.forEach(lazyImage => {
                lazyImageObserver.observe(lazyImage);
            });
        }
    }
    
    /**
     * Animate number counters
     */
    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || '0', 10);
            const duration = parseFloat(counter.getAttribute('data-duration') || '2');
            const delay = parseFloat(counter.getAttribute('data-delay') || '0');
            
            // Initialize counter at 0
            counter.textContent = '0';
            
            // Animate counter when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.to(counter, {
                            innerText: target,
                            duration: duration,
                            delay: delay,
                            ease: 'power1.out',
                            snap: { innerText: 1 },
                            onUpdate: function() {
                                counter.textContent = Math.ceil(counter.innerText).toLocaleString();
                            }
                        });
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }
    
    /**
     * Animate progress bars on scroll
     */
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        if (!progressBars.length || typeof ScrollTrigger === 'undefined') return;
        
        progressBars.forEach(bar => {
            const value = bar.getAttribute('aria-valuenow') || '0';
            
            gsap.fromTo(bar,
                { width: '0%' },
                {
                    width: `${value}%`,
                    duration: 1.5,
                    ease: 'sine.out',
                    scrollTrigger: {
                        trigger: bar.closest('.progress'),
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }
}

// Export for modular use
export default AdvancedAnimations;
