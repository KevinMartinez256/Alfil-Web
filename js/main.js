// ALFIL - Main JavaScript File

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
        
        // Si estamos en el top de la página, activar home
        if (window.pageYOffset < 100) {
            current = 'home';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const headerHeight = document.querySelector('.header').offsetHeight;
                
                if (window.pageYOffset >= (sectionTop - headerHeight - 200)) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Activar para enlaces internos (que empiezan con #)
            if (href && href.startsWith('#') && href === `#${current}`) {
                link.classList.add('active');
            }
            // También activar para enlaces externos que coincidan con la sección
            // Por ejemplo: about.html cuando estás en sección #about
            else if (href && href.includes('.html')) {
                const pageName = href.replace('.html', '');
                if (pageName === current) {
                    link.classList.add('active');
                }
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

    // ===== MANEJO DEL FORMULARIO DE CONTACTO =====
    const contactForm = document.querySelector('.contact-form-fields');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }

            const endpoint = contactForm.getAttribute('action') || 'send-contact.php';

            fetch(endpoint, {
                method: 'POST',
                body: formData
            })
            .then(r => r.json())
            .then(data => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                
                if (data.exito) {
                    mostrarAlerta(data.mensaje, 'success');
                    contactForm.reset();
                } else {
                    mostrarAlerta(data.mensaje || 'No se pudo enviar el mensaje.', 'error');
                }
            })
            .catch(err => {
                console.error('Error contacto:', err);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                mostrarAlerta('Error al enviar el formulario de contacto. Intenta nuevamente.', 'error');
            });
        });
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

    // ===== MANEJO DEL FORMULARIO DE CV =====
    const cvForm = document.querySelector('.cv-form');
    
    if (cvForm) {
        cvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Crear FormData para enviar archivos
            const formData = new FormData(this);
            
            // Obtener botón de submit
            const submitBtn = this.querySelector('button[type="submit"]');
            const textoBtnOriginal = submitBtn.textContent;
            
            // Mostrar estado de carga
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            const endpoint = cvForm.getAttribute('action') || 'send-cv.php';

            // Enviar formulario via AJAX
            fetch(endpoint, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = textoBtnOriginal;
                
                if (data.exito) {
                    // Mostrar mensaje de éxito
                    mostrarAlerta(data.mensaje, 'success');
                    
                    // Limpiar formulario
                    cvForm.reset();
                    
                    // Restaurar label del archivo
                    const fileLabel = cvForm.querySelector('.file-upload-label span');
                    if (fileLabel) {
                        fileLabel.textContent = 'Subir CV (PDF, DOC, DOCX)';
                    }
                    const fileUploadLabel = cvForm.querySelector('.file-upload-label');
                    if (fileUploadLabel) {
                        fileUploadLabel.classList.remove('has-file');
                    }
                } else {
                    // Mostrar mensaje de error
                    mostrarAlerta(data.mensaje, 'error');
                }
            })
            .catch(error => {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = textoBtnOriginal;
                
                console.error('Error:', error);
                mostrarAlerta('Error al enviar el formulario. Por favor, intenta de nuevo.', 'error');
            });
        });
    }
    
    // ===== FUNCIÓN PARA MOSTRAR ALERTAS =====
    function mostrarAlerta(mensaje, tipo) {
        // Crear elemento de alerta
        const alerta = document.createElement('div');
        alerta.className = `alerta alerta-${tipo}`;
        alerta.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        // Estilos según tipo
        if (tipo === 'success') {
            alerta.style.backgroundColor = '#4CAF50';
            alerta.style.color = 'white';
            alerta.style.borderLeft = '4px solid #45a049';
        } else if (tipo === 'error') {
            alerta.style.backgroundColor = '#f44336';
            alerta.style.color = 'white';
            alerta.style.borderLeft = '4px solid #da190b';
        }
        
        alerta.textContent = mensaje;
        document.body.appendChild(alerta);
        
        // Eliminar alerta después de 5 segundos
        setTimeout(() => {
            alerta.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                alerta.remove();
            }, 300);
        }, 5000);
    }
    
    // Agregar animaciones CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Ver más button functionality for blog articles
    const verMasBtn = document.querySelector('.ver-mas-btn');
    const hiddenArticles = document.querySelectorAll('.hidden-article');
    
    if (verMasBtn && hiddenArticles.length > 0) {
        verMasBtn.addEventListener('click', function() {
            hiddenArticles.forEach(article => {
                article.style.display = 'block';
                article.style.animation = 'fadeIn 0.5s ease-in';
            });
            verMasBtn.style.display = 'none';
        });
    }

    // Console welcome message
    console.log('%c🚀 ALFIL Website', 'color: #862588; font-size: 20px; font-weight: bold;');
    console.log('%cBienvenido al sitio web oficial de ALFIL', 'color: #b8409e; font-size: 14px;');
    console.log('%cSeguridad especializada para tu cadena logística', 'color: #54534A; font-size: 12px;');

    // ===== MANEJO DEL FORMULARIO DE SUSCRIPCIÓN AL BLOG =====
    document.addEventListener('submit', function(e) {
        if (!e.target.classList.contains('subscribe-form')) return;
        
        e.preventDefault();
        
        const subscribeForm = e.target;
        const formData = new FormData(subscribeForm);
        const submitBtn = subscribeForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Suscribiendo...';
        }

        const endpoint = subscribeForm.getAttribute('action') || 'send-subscribe.php';

        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(r => r.json())
        .then(data => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            
            if (data.exito) {
                mostrarAlerta(data.mensaje, 'success');
                subscribeForm.reset();
            } else {
                mostrarAlerta(data.mensaje || 'Error en la suscripción.', 'error');
            }
        })
        .catch(err => {
            console.error('Error suscripción:', err);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            mostrarAlerta('Error al procesar tu suscripción. Intenta de nuevo.', 'error');
        });
    });

    // Cookie Consent Banner functionality
    const cookieConsentBanner = document.getElementById('cookie-consent');
    const cookieApproveBtn = document.getElementById('cookie-approve-btn');
    
    if (cookieConsentBanner && cookieApproveBtn) {
        // Check if user has already accepted cookies
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (cookieConsent === 'accepted') {
            cookieConsentBanner.classList.add('hidden');
        }
        
        // Handle approve button click
        cookieApproveBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsentBanner.classList.add('hidden');
        });
    }

    // WhatsApp Floating Button - Dynamic Creation
    (function () {
        const num = "525579791597";
        const url = "https://wa.me/" + num;

        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "whatsapp-float";
        a.title = "Contáctanos por WhatsApp";

        const icon = document.createElement("i");
        icon.className = "fab fa-whatsapp";

        a.appendChild(icon);
        document.body.appendChild(a);
    })();
});
