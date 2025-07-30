// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section, .hero');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

    // Navbar background on scroll
    function updateNavbarOnScroll() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    // Performance optimization: Debounce scroll events
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

    // Apply debouncing to scroll handlers
    const debouncedScrollHandler = debounce(function() {
        updateActiveNavLink();
        updateNavbarOnScroll();
    }, 10);

    // Scroll event listeners
    window.addEventListener('scroll', debouncedScrollHandler);

    // CTA Button smooth scroll
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = aboutSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Remove scroll animations - sections will be visible by default

    // Keyboard navigation support
    document.addEventListener('keydown', function(event) {
        // Escape key closes mobile menu
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Enter key on hamburger toggles menu
        if (event.key === 'Enter' && event.target === hamburger) {
            hamburger.click();
        }
    });

    // Make hamburger focusable and accessible
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('role', 'button');

    // All scroll animations and parallax effects removed for better section display

    // Gallery Filter Functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filterValue) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = [
        './attached_assets/1678933990177_1753168556296.jpg',
        './attached_assets/1678948016956_1753168556296.jpg',
        './attached_assets/1679155208895_1753168556296.jpg',
        './attached_assets/1699774657825_1753168556297.jpg',
        './attached_assets/1717500336872_1753168556297.jpg',
        './attached_assets/1733847407308_1753168556297.jpg',
        './attached_assets/1737475157036_1753168556297.jpg'
    ];
    
    const imageAlts = [
        'Abhishek at Restaurant',
        'Professional Portrait',
        'Casual Portrait', 
        'Formal Event',
        'Beach Photo',
        'Professional Setting',
        'Birthday Celebration'
    ];
    
    let currentImageIndex = 0;
    let currentScale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    // Open lightbox
    window.openLightbox = function(index) {
        currentImageIndex = index;
        lightboxImg.src = galleryImages[index];
        lightboxImg.alt = imageAlts[index];
        lightbox.style.display = 'block';
        resetZoom();
        document.body.style.overflow = 'hidden';
    };

    // Close lightbox
    window.closeLightbox = function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetZoom();
    };

    // Change slide
    window.changeSlide = function(direction) {
        currentImageIndex += direction;
        if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        }
        lightboxImg.src = galleryImages[currentImageIndex];
        lightboxImg.alt = imageAlts[currentImageIndex];
        resetZoom();
    };

    // Zoom functions
    window.zoomIn = function() {
        currentScale = Math.min(currentScale * 1.2, 3);
        updateImageTransform();
    };

    window.zoomOut = function() {
        currentScale = Math.max(currentScale / 1.2, 0.5);
        updateImageTransform();
    };

    window.resetZoom = function() {
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
    };

    function updateImageTransform() {
        lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }

    // Mouse drag functionality for zoomed images
    lightboxImg.addEventListener('mousedown', function(e) {
        if (currentScale > 1) {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            lightboxImg.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging && currentScale > 1) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform();
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        lightboxImg.style.cursor = currentScale > 1 ? 'grab' : 'default';
    });

    // Touch events for mobile
    let initialTouchDistance = 0;
    let initialScale = 1;

    lightboxImg.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            initialTouchDistance = getTouchDistance(e.touches);
            initialScale = currentScale;
        } else if (e.touches.length === 1 && currentScale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        }
    });

    lightboxImg.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (e.touches.length === 2) {
            const currentDistance = getTouchDistance(e.touches);
            currentScale = Math.min(Math.max(initialScale * (currentDistance / initialTouchDistance), 0.5), 3);
            updateImageTransform();
        } else if (e.touches.length === 1 && isDragging && currentScale > 1) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateImageTransform();
        }
    });

    lightboxImg.addEventListener('touchend', function() {
        isDragging = false;
    });

    function getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    changeSlide(-1);
                    break;
                case 'ArrowRight':
                    changeSlide(1);
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                    zoomOut();
                    break;
                case '0':
                    resetZoom();
                    break;
            }
        }
    });

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Contact Form Functionality
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple form validation
            if (name && email && message) {
                // Show success message
                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#4caf50';
                
                // Reset form
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '#2196f3';
                }, 3000);
            }
        });
    }

    // Initial calls
    updateActiveNavLink();
    updateNavbarOnScroll();

    // Profile image hover effect enhancement
    const profileImage = document.querySelector('.profile-image img');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        const heroElements = document.querySelectorAll('.hero-container > *, .hero-content > *');
        heroElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
            element.classList.add('animate-in');
        });
    });
});

// Utility function for smooth scrolling (fallback for older browsers)
function smoothScrollTo(target, duration = 800) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetElement.offsetTop - navbarHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Error handling for failed image loads
document.addEventListener('error', function(event) {
    if (event.target.tagName === 'IMG') {
        // Fallback for failed profile image
        event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwQzExNi41NjkgMTAwIDEzMCA4Ni41Njg1IDEzMCA3MEM1NyA3MCA3MCA1Ni40MzE1IDcwIDcwIDcwIDEwNy4yNSAxMDAgMTMwIDEwMCAxMDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNzAgMTcwQzE3MCAyNC4yNzk0IDEzMi43MjEgNTcgMTAwIDU3QzY3LjI3OTQgNTcgMzAgOTQuMjc5NCAzMCAxMjdDMzAgMTU5LjcyMSA2Ny4yNzk0IDE5NyAxMDAgMTk3QzEzMi43MjEgMTk3IDE3MCAyNDIuNzIxIDE3MCAyNzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
        event.target.alt = 'Profile Image';
    }
}, true);
