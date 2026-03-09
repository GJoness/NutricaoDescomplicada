// ===================================
// NUTRIÇÃO DESCOMPLICADA - JAVASCRIPT
// Funcionalidades e Interações
// ===================================

&nbsp;

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // HEADER STICKY FUNCTIONALITY
    // ===================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // COUNTDOWN TIMER
    // ===================================
    function initCountdown() {
        const countdownElement = document.getElementById('countdown');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (!countdownElement || !hoursElement || !minutesElement || !secondsElement) {
            return;
        }
        
        // Set countdown to 24 hours from now
        const now = new Date().getTime();
        const countdownTime = now + (24 * 60 * 60 * 1000);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownTime - now;
            
            if (distance < 0) {
                // Reset to 24 hours when countdown reaches zero
                const newCountdownTime = new Date().getTime() + (24 * 60 * 60 * 1000);
                updateCountdownDisplay(newCountdownTime - new Date().getTime());
                return;
            }
            
            updateCountdownDisplay(distance);
        }
        
        function updateCountdownDisplay(distance) {
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // ===================================
    // SCARCITY COUNTER
    // ===================================
    function initScarcityCounter() {
        const vagasElements = document.querySelectorAll('#vagas-restantes, #vagas-header, #vagas-counter');
        
        if (vagasElements.length === 0) {
            return;
        }
        
        // Get or set initial count
        let vagasCount = localStorage.getItem('vagasCount');
        if (!vagasCount || vagasCount < 1) {
            vagasCount = Math.floor(Math.random() * 15) + 25; // Random between 25-40
            localStorage.setItem('vagasCount', vagasCount);
        }
        
        // Update all elements with scarcity count
        vagasElements.forEach(element => {
            if (element) {
                element.textContent = vagasCount;
            }
        });
        
        // Decrease count occasionally
        setInterval(() => {
            if (Math.random() < 0.1 && vagasCount > 15) { // 10% chance every interval
                vagasCount--;
                localStorage.setItem('vagasCount', vagasCount);
                vagasElements.forEach(element => {
                    if (element) {
                        element.textContent = vagasCount;
                        // Add animation effect
                        element.style.transform = 'scale(1.1)';
                        element.style.color = '#e74c3c';
                        setTimeout(() => {
                            element.style.transform = 'scale(1)';
                            element.style.color = '';
                        }, 300);
                    }
                });
            }
        }, 30000); // Check every 30 seconds
    }
    
    // ===================================
    // FAQ ACCORDION
    // ===================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    // Close all FAQ items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ===================================
    // FLOATING CTA VISIBILITY
    // ===================================
    function initFloatingCTA() {
        const floatingCTA = document.getElementById('floating-cta');
        const offerSection = document.getElementById('oferta-final');
        
        if (!floatingCTA || !offerSection) {
            return;
        }
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            const offerPosition = offerSection.offsetTop;
            const windowHeight = window.innerHeight;
            
            // Show floating CTA when user scrolls past hero but before offer section
            if (scrollPosition > windowHeight && scrollPosition < offerPosition - 100) {
                floatingCTA.style.display = 'block';
                floatingCTA.style.opacity = '1';
            } else {
                floatingCTA.style.opacity = '0';
                setTimeout(() => {
                    if (floatingCTA.style.opacity === '0') {
                        floatingCTA.style.display = 'none';
                    }
                }, 300);
            }
        });
    }
    
    // ===================================
    // BUTTON CLICK TRACKING
    // ===================================
    function initButtonTracking() {
        const ctaButtons = document.querySelectorAll('#btn-checkout, #btn-checkout-final, .btn-purchase, .btn-primary');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Track button clicks (you can integrate with analytics here)
                console.log('CTA Button clicked:', this.textContent.trim());
                
                // For now, prevent default to avoid navigation
                // Remove this when you integrate with actual checkout
                e.preventDefault();
                
                // Show alert for demo purposes
                alert('Redirecionando para checkout... (Integração pendente)');
            });
        });
    }
    
    // ===================================
    // FORM VALIDATION (if needed)
    // ===================================
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#e74c3c';
                        
                        // Reset border color after 3 seconds
                        setTimeout(() => {
                            field.style.borderColor = '';
                        }, 3000);
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    alert('Por favor, preencha todos os campos obrigatórios.');
                }
            });
        });
    }
    
    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.problem-item, .benefit-item, .testimonial-card, .objection-item');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // ===================================
    // PERFORMANCE OPTIMIZATIONS
    // ===================================
    function initPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
        
        // Preload critical resources
        const criticalLinks = [
            '/styles.css',
            '/images/hero-mulher-cozinhando.jpg'
        ];
        
        criticalLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    // ===================================
    // ANALYTICS INTEGRATION
    // ===================================
    function initAnalytics() {
        // Track page view
        console.log('Page view tracked');
        
        // Track scroll depth
        let scrollDepths = [25, 50, 75, 90];
        let trackedDepths = [];
        
        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
                    trackedDepths.push(depth);
                    console.log(`Scroll depth: ${depth}%`);
                    // Here you can send data to your analytics service
                }
            });
        });
        
        // Track time on page
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', function() {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            console.log(`Time on page: ${timeOnPage} seconds`);
            // Here you can send data to your analytics service
        });
    }
    
    // ===================================
    // INITIALIZE ALL FUNCTIONS
    // ===================================
    function init() {
        try {
            initCountdown();
            initScarcityCounter();
            initFAQ();
            initFloatingCTA();
            initButtonTracking();
            initFormValidation();
            initScrollAnimations();
            initPerformanceOptimizations();
            initAnalytics();
            
            console.log('✅ Nutrição Descomplicada - All scripts loaded successfully!');
        } catch (error) {
            console.error('❌ Error initializing scripts:', error);
        }
    }
    
    // Start everything
    init();
    
    // ===================================
    // ERROR HANDLING
    // ===================================
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
    });
    
    // ===================================
    // MOBILE SPECIFIC OPTIMIZATIONS
    // ===================================
    if (window.innerWidth <= 768) {
        // Disable hover effects on mobile
        document.body.classList.add('mobile-device');
        
        // Optimize touch interactions
        document.addEventListener('touchstart', function() {}, { passive: true });
        
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });
    }
    
});

&nbsp;

// ===================================
// UTILITY FUNCTIONS
// ===================================

&nbsp;

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

&nbsp;

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(date);
}

&nbsp;

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

&nbsp;

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

&nbsp;

// ===================================
// END OF SCRIPT
// ===================================
