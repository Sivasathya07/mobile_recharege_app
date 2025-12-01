/**
 * Pharmacy Management System - Main JavaScript
 * A modern, interactive frontend with smooth animations and 3D elements
 */

// Main application class
class PharmacyApp {
    constructor() {
        // Initialize managers
        this.themeManager = new ThemeManager();
        this.animations = new Animations();
        
        // Initialize components
        this.isMobile = this.detectMobile();
        this.scrollPosition = 0;
        
        // Bind event handlers
        this.handleScroll = this.debounce(this.handleScroll.bind(this), 100);
        this.handleResize = this.debounce(this.handleResize.bind(this), 250);
        
        // Initialize the app
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
        
        // Initialize 3D pill viewer if on the homepage
        if (document.querySelector('.pill-viewer-container')) {
            this.initPillModelViewer();
        }
        
        // Initialize notifications
        this.initNotifications();
        
        // Initialize interactive elements
        this.initInteractiveElements();
        
        // Initialize animations
        this.animations.init();
        
        // Show that the app is ready
        console.log('Pharmacy Management System initialized');
        
        // Remove loading screen
        this.hideLoadingScreen();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize);
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.themeManager.toggleTheme());
        }
        
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.navbar-toggler');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                document.body.classList.toggle('mobile-menu-open');
            });
        }
    }
    
    /**
     * Handle scroll events
     */
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Update scroll position for parallax effects
        this.scrollPosition = currentScroll;
        
        // Toggle scroll-to-top button
        this.toggleScrollToTop();
        
        // Add/remove scroll class to body
        if (currentScroll > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    }
    
    /**
     * Handle resize events
     */
    handleResize() {
        // Update mobile detection
        this.isMobile = this.detectMobile();
        
        // Refresh animations and plugins
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        if (this.pillViewer) {
            this.pillViewer.handleResize();
        }
    }
    
    /**
     * Toggle scroll-to-top button
     */
    toggleScrollToTop() {
        const scrollToTop = document.getElementById('scrollToTop');
        if (!scrollToTop) return;
        
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('show');
        } else {
            scrollToTop.classList.remove('show');
        }
    }
    
    /**
     * Initialize 3D Pill Model Viewer
     */
    initPillModelViewer() {
        // Implementation of 3D viewer...
        console.log('Initializing 3D Pill Model Viewer');
        
        // This would be replaced with actual Three.js implementation
        this.pillViewer = {
            handleResize: () => {
                console.log('Resizing 3D viewer');
            }
        };
    }
    
    /**
     * Initialize real-time notifications
     */
    initNotifications() {
        // Implementation of notification system...
        console.log('Initializing notifications');
    }
    
    /**
     * Initialize interactive elements
     */
    initInteractiveElements() {
        // Implementation of interactive elements...
        console.log('Initializing interactive elements');
    }
    
    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }
    
    /**
     * Detect mobile devices
     * @returns {boolean} True if the device is a mobile device
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Debounce function to limit the rate at which a function can fire
     * @param {Function} func - The function to debounce
     * @param {number} wait - The time to wait in milliseconds
     * @returns {Function} - The debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, TextPlugin);
    }
    
    // Create global app instance
    window.app = new PharmacyApp();
    
    // Initialize any global functionality
    initGlobalFunctionality();
});

// Global functionality
function initGlobalFunctionality() {
    // Initialize tooltips
    if (typeof $ !== 'undefined') {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }
    
    // Initialize popovers
    if (typeof $ !== 'undefined') {
        $('[data-bs-toggle="popover"]').popover();
    }
    
    // Add any other global initialization code here
}

// Make the app available globally
window.PharmacyApp = PharmacyApp;

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const navbarHeight = 70;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > navbarHeight) {
            navbar.classList.add('navbar-scrolled', 'shadow-sm');
        } else {
            navbar.classList.remove('navbar-scrolled', 'shadow-sm');
        }
        
        // Show/hide back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initialize 3D Pill Model Viewer
    function initPillModelViewer() {
        const container = document.getElementById('pill-model-viewer');
        if (!container) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Add pill model (placeholder - in a real app, you would load a 3D model)
        const geometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        
        const pill = new THREE.Mesh(geometry, material);
        scene.add(pill);
        
        // Position camera
        camera.position.z = 5;
        
        // Add controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            pill.rotation.x += 0.005;
            pill.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        animate();
    }
    
    // Initialize real-time notifications
    function initNotifications() {
        // Simulate real-time notifications
        setInterval(() => {
            // In a real app, you would fetch notifications from the server
            const notifications = [
                { type: 'info', message: 'New order received #' + Math.floor(Math.random() * 1000) },
                { type: 'success', message: 'Inventory updated successfully' },
                { type: 'warning', message: 'Low stock alert: Paracetamol' }
            ];
            
            const notification = notifications[Math.floor(Math.random() * notifications.length)];
            showNotification(notification);
        }, 10000); // Show a notification every 10 seconds
    }
    
    function showNotification({ type = 'info', message = '' }) {
        const notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    function getNotificationIcon(type) {
        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    // Initialize interactive elements
    function initInteractiveElements() {
        // Interactive tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                trigger: 'hover',
                animation: true
            });
        });
        
        // Interactive popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl, {
                trigger: 'focus',
                animation: true
            });
        });
        
        // Form validation with advanced feedback
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            const inputs = contactForm.querySelectorAll('.form-control');
            
            inputs.forEach(input => {
                // Add input event listeners for real-time validation
                input.addEventListener('input', function() {
                    validateField(this);
                });
                
                // Add focus/blur effects
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('focused');
                    validateField(this);
                });
            });
            
            // Form submission with AJAX
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                let isValid = true;
                const formData = new FormData(contactForm);
                
                // Validate all fields
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });
                
                if (isValid) {
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitButton.innerHTML;
                    
                    // Show loading state
                    submitButton.disabled = true;
                    submitButton.innerHTML = `
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="ms-2">Sending...</span>
                    `;
                    
                    try {
                        // Make actual API call to the backend
                        const response = await fetch('/api/contact', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (!response.ok) {
                            throw new Error(result.message || 'Failed to send message');
                        }
                        
                        // Show success message from server response
                        showFormMessage(contactForm, 'success', result.message || 'Your message has been sent successfully!');
                        contactForm.reset();
                    } catch (error) {
                        // Show error message
                        showFormMessage(contactForm, 'error', 'An error occurred. Please try again later.');
                        console.error('Form submission error:', error);
                    } finally {
                        // Reset button state
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;
                    }
                }
            });
            
            // Field validation function
            function validateField(field) {
                let isValid = true;
                const value = field.value.trim();
                const fieldName = field.getAttribute('name');
                const errorElement = field.nextElementSibling;
                
                // Clear previous error
                field.classList.remove('is-invalid');
                if (errorElement && errorElement.classList.contains('invalid-feedback')) {
                    errorElement.textContent = '';
                }
                
                // Validation rules
                if (field.required && !value) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                } else if (field.type === 'email' && value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        showFieldError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                } else if (field.type === 'tel' && value) {
                    const phoneRegex = /^[0-9+\-\s()]+$/;
                    if (!phoneRegex.test(value)) {
                        showFieldError(field, 'Please enter a valid phone number');
                        isValid = false;
                    }
                }
                
                // Visual feedback
                if (isValid) {
                    field.classList.add('is-valid');
                } else {
                    field.classList.remove('is-valid');
                }
                
                return isValid;
            }
            
            function showFieldError(field, message) {
                field.classList.add('is-invalid');
                let errorElement = field.nextElementSibling;
                
                if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
                    errorElement = document.createElement('div');
                    errorElement.className = 'invalid-feedback';
                    field.parentNode.insertBefore(errorElement, field.nextSibling);
                }
                
                errorElement.textContent = message;
            }
            
            function showFormMessage(form, type, message) {
                // Remove any existing alerts
                const existingAlert = form.querySelector('.alert');
                if (existingAlert) {
                    existingAlert.remove();
                }
                
                // Create and show new alert
                const alertDiv = document.createElement('div');
                alertDiv.className = `alert alert-${type} mt-3`;
                alertDiv.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
                        <span>${message}</span>
                    </div>
                `;
                
                form.prepend(alertDiv);
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    alertDiv.classList.add('fade-out');
                    setTimeout(() => alertDiv.remove(), 300);
                }, 5000);
            }
        }
    }
    
    // Animate numbers in stats section
    const animateNumbers = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = (target / (duration / 16)); // 60fps
            let current = 0;
            
            const updateNumber = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            
            // Start animation when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateNumber();
                    observer.unobserve(stat);
                }
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    };
    
    // Initialize number animation
    if (document.querySelector('.stat-number')) {
        animateNumbers();
    }
    
    // Add loading animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loading);
    
    // Remove loading animation after page loads
    window.addEventListener('load', function() {
        loading.classList.add('fade-out');
        setTimeout(() => {
            loading.remove();
        }, 500);
    });
    
    // Tooltip initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Popover initialization
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    
    const animateOnScroll = () => {
        featureCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize feature card animations
    if (featureCards.length > 0) {
        // Set initial state
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
        
        // Animate on scroll
        window.addEventListener('scroll', animateOnScroll);
        
        // Initial check in case cards are already in viewport
        animateOnScroll();
    }
    
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarToggler.classList.toggle('active');
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
});

// Parallax effect for hero section
function parallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
}

window.addEventListener('scroll', parallax);
