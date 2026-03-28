/* ============ MAIN JAVASCRIPT ============ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initScrollEffects();
    initCounterAnimation();
    initIntersectionObserver();
    initFormValidation();
    initLazyLoading();
});

// ============ NAVIGATION ============
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active link on scroll
    window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const { offsetTop, offsetHeight, id } = section;
        const link = document.querySelector(`.nav-link[href="#${id}"]`);

        if (!link) return;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// ============ THEME TOGGLE ============
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    if (isDark) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            updateThemeIcon(isDarkMode);
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
}

// ============ SCROLL EFFECTS ============
function initScrollEffects() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
}

// ============ COUNTER ANIMATION ============
function initCounterAnimation() {
    const statItems = document.querySelectorAll('.stat-item');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => observer.observe(item));
}

function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target')) || 0;
        const duration = 2000;
        const start = Date.now();
        
        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            const current = Math.floor(target * progress);
            
            const text = stat.innerHTML;
            const html = text.replace(/^\d+/, current);
            stat.innerHTML = html;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    });
}

// ============ INTERSECTION OBSERVER ============
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(
        '.fade-on-scroll, .expertise-card, .featured-card, ' +
        '.testimonial-card, .nav-card'
    ).forEach(el => observer.observe(el));
}

// ============ FORM VALIDATION ============
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Basic validation
    const email = formData.get('email');
    const name = formData.get('name');
    
    if (!email || !name) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission (replace with actual backend call)
    try {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============ LAZY LOADING ============
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============ UTILITY FUNCTIONS ============

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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other files
window.debounce = debounce;
window.throttle = throttle;