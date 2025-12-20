// CR NOVA Security Website - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link or logo
    const logoLink = document.querySelector('.logo-link');
    const allMenuLinks = document.querySelectorAll('.nav-link, .logo-link');
    
    allMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // File upload functionality for CV
    const fileUpload = document.getElementById('cv-upload');
    const fileUploadLabel = document.querySelector('.file-upload-label');
    
    if (fileUpload && fileUploadLabel) {
        fileUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2); // MB
                
                // Update label text to show selected file
                const span = fileUploadLabel.querySelector('span');
                span.textContent = `Archivo seleccionado: ${fileName} (${fileSize} MB)`;
                
                // Add visual feedback
                fileUploadLabel.classList.add('has-file');
                
                // Validate file type
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!allowedTypes.includes(this.files[0].type)) {
                    alert('Por favor, selecciona un archivo PDF, DOC o DOCX válido.');
                    this.value = '';
                    span.textContent = 'Subir CV (PDF, DOC, DOCX)';
                    fileUploadLabel.classList.remove('has-file');
                }
                
                // Validate file size (max 5MB)
                if (this.files[0].size > 5 * 1024 * 1024) {
                    alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
                    this.value = '';
                    span.textContent = 'Subir CV (PDF, DOC, DOCX)';
                    fileUploadLabel.classList.remove('has-file');
                }
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for internal links
    const allInternalLinks = document.querySelectorAll('a[href^="#"]');
    
    allInternalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (window.pageYOffset >= (sectionTop - headerHeight - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Header scroll effect
    function handleHeaderScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    }

    // Scroll event listeners
    window.addEventListener('scroll', function() {
        updateActiveNav();
        handleHeaderScroll();
    });

    // Form handling
    const contactForm = document.querySelector('.contact-form-fields');
    const careersForm = document.querySelector('.cv-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'contacto');
        });
    }

    if (careersForm) {
        careersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'bolsa de trabajo');
        });
    }

    function handleFormSubmission(form, formType) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            showNotification(`Formulario de ${formType} enviado exitosamente. Nos pondremos en contacto contigo pronto.`, 'success');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for cards
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('service-card') ||
                    entry.target.classList.contains('blog-card') ||
                    entry.target.classList.contains('award-item') ||
                    entry.target.classList.contains('cert-item')) {
                    
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.animationDelay = `${delay}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('section, .service-card, .blog-card, .award-item, .cert-item, .feature-card');
    animatedElements.forEach(el => observer.observe(el));

    // Parallax effect for hero section
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const wave = document.querySelector('.hero-wave');
        if (hero && wave) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
            wave.style.transform = `translateY(${scrolled * 0.3}px) rotate(-20deg)`; // Movimiento parallax para onda
        }
    }

    // Add parallax effect on scroll
    window.addEventListener('scroll', handleParallax);

    // Initialize tooltips for service features
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('.service-features li');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const text = this.textContent;
                showTooltip(this, text);
            });
            
            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }

    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--primary-blue);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 1000;
            white-space: nowrap;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Initialize tooltips
    initializeTooltips();

    // Counter animation for certifications
    function animateCounters() {
        const counters = document.querySelectorAll('.cert-item h4');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            if (target.includes('ISO') || target.includes('BASC')) {
                counter.style.opacity = '0';
                counter.style.transform = 'translateY(20px)';
                
                const observer = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            counter.style.transition = 'all 0.6s ease';
                            counter.style.opacity = '1';
                            counter.style.transform = 'translateY(0)';
                            observer.unobserve(counter);
                        }
                    });
                });
                
                observer.observe(counter);
            }
        });
    }

    // Initialize counter animations
    animateCounters();

    // Smooth reveal for service cards
    function revealServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Initialize service card animations when services section is visible
    const servicesSection = document.querySelector('.services');
    if (servicesSection) {
        const servicesObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealServiceCards();
                    servicesObserver.unobserve(entry.target);
                }
            });
        });
        
        servicesObserver.observe(servicesSection);
    }



    // Services Carousel functionality
    function initializeServicesCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.dot');
        
        if (!carouselTrack || !prevBtn || !nextBtn) return;
        
        let currentSlide = 0;
        const totalSlides = dots.length;
        
        function updateCarousel() {
            const translateX = -currentSlide * 100;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
            
            // Los botones nunca se deshabilitan porque el carrusel es infinito
            prevBtn.disabled = false;
            nextBtn.disabled = false;
        }
        
        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                // Regresar al primer slide cuando llegue al final
                currentSlide = 0;
            }
            updateCarousel();
        }
        
        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                // Ir al último slide cuando esté en el primero
                currentSlide = totalSlides - 1;
            }
            updateCarousel();
        }
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Auto-play carousel
        let autoPlayInterval = setInterval(nextSlide, 5000);
        
        // Pause auto-play on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                autoPlayInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Initialize first slide
        updateCarousel();
    }

    // Initialize carousel
    initializeServicesCarousel();

    // Add loading animation for images (placeholder for future real images)
    function initializeImagePlaceholders() {
        const placeholders = document.querySelectorAll('.hero-placeholder, .blog-image');
        
        placeholders.forEach(placeholder => {
            placeholder.addEventListener('click', function() {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    // Initialize image placeholders
    initializeImagePlaceholders();

    // Console welcome message
    console.log('%c🚀 ALFIL', 'color: #005CAB; font-size: 20px; font-weight: bold;');
    console.log('%cBienvenido al sitio web oficial de ALFIL', 'color: #0096D6; font-size: 14px;');
    console.log('%cSeguridad especializada para tu cadena logística', 'color: #54534A; font-size: 12px;');
});
