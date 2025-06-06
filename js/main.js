// Utility function for checking if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance optimization
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

// Parallax effect for background
function handleParallax() {
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
        const scrolled = window.pageYOffset;
        const scale = 1 + (scrolled * 0.0002);
        const yPos = -(scrolled * 0.5);
        parallaxBg.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
    }
}

// Section visibility and animations
function handleSectionVisibility() {
    document.querySelectorAll('.section-content').forEach(section => {
        const rect = section.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.75;

        if (rect.top < triggerPoint) {
            section.classList.add('visible');
        }
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.snap-section');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            navLinks.forEach(link => link.classList.remove('active'));
            // Find the link that matches this section's ID
            navLinks.forEach(link => {
                if (link.getAttribute('href') === '#' + section.id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Typing effect for welcome message
function typeWriter(element, text, speed = 50) {
    element.classList.add('typing');
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing');
        }
    }
    type();
}

// Product card hover effect (preserved for possible use elsewhere)
function setupProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// Modal functionality for product images and in-depth product info
function setupModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.getElementsByClassName('close')[0];
    
    // Modal close functionality - still needed for both implementations
    closeBtn.onclick = function() {
        closeModal();
    }

    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    function closeModal() {
        modal.classList.remove('modal-open');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === "block") {
            closeModal();
        }
    });
}

// Form validation and enhancement
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        if (input.value) {
            input.parentElement.classList.add('focused');
        }

        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        // Real-time validation
        input.addEventListener('input', debounce(() => {
            validateInput(input);
        }, 300));
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };

            // Show success message with animation
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            form.appendChild(successMessage);

            // Reset form after delay
            setTimeout(() => {
                form.reset();
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                successMessage.remove();
            }, 3000);
        }
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    const errorElement = input.parentElement.querySelector('.error-message') || 
                        document.createElement('div');
    
    errorElement.className = 'error-message';

    switch(input.id) {
        case 'name':
            isValid = value.length >= 2;
            errorElement.textContent = isValid ? '' : 'Name must be at least 2 characters';
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            errorElement.textContent = isValid ? '' : 'Please enter a valid email';
            break;
        case 'phone':
            if (value) {
                isValid = /^[\d\s-+()]{10,}$/.test(value);
                errorElement.textContent = isValid ? '' : 'Please enter a valid phone number';
            }
            break;
        case 'message':
            isValid = value.length >= 10;
            errorElement.textContent = isValid ? '' : 'Message must be at least 10 characters';
            break;
    }

    if (!input.parentElement.querySelector('.error-message')) {
        input.parentElement.appendChild(errorElement);
    }

    input.parentElement.classList.toggle('invalid', !isValid);
    return isValid;
}

// Enhanced smooth scrolling with snap effect and animated logo
function setupScrolling() {
    const snapContainer = document.querySelector('.snap-container');
    if (!snapContainer) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    let lastScrollTop = 0;
    const scrollThreshold = 50; // Amount of scroll before animation triggers

    function smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Wheel event handler
    let isScrolling = false;
    let lastScrollTime = 0;
    const scrollCooldown = 1000;

    snapContainer.addEventListener('wheel', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        const direction = e.deltaY > 0 ? 1 : -1;
        const sections = Array.from(document.querySelectorAll('.snap-section'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -100 && rect.top <= 100;
        });

        if (currentSection) {
            e.preventDefault();
            const currentIndex = sections.indexOf(currentSection);
            const targetIndex = currentIndex + direction;

            if (targetIndex >= 0 && targetIndex < sections.length) {
                isScrolling = true;
                smoothScrollTo(sections[targetIndex]);
                setTimeout(() => {
                    isScrolling = false;
                }, scrollCooldown);
            }
        }
    }, { passive: false });

    // Touch events for mobile
    let touchStartY = 0;
    snapContainer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    snapContainer.addEventListener('touchmove', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        const touchCurrentY = e.touches[0].clientY;
        const diff = touchStartY - touchCurrentY;
        const sections = Array.from(document.querySelectorAll('.snap-section'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -100 && rect.top <= 100;
        });

        if (currentSection && Math.abs(diff) > 50) {
            e.preventDefault();
            const currentIndex = sections.indexOf(currentSection);
            const targetIndex = currentIndex + (diff > 0 ? 1 : -1);

            if (targetIndex >= 0 && targetIndex < sections.length) {
                isScrolling = true;
                smoothScrollTo(sections[targetIndex]);
                setTimeout(() => {
                    isScrolling = false;
                }, scrollCooldown);
            }
            touchStartY = touchCurrentY;
        }
    }, { passive: false });

    // Update scroll progress, logo, and header on scroll
    snapContainer.addEventListener('scroll', debounce(() => {
        const scrollTop = snapContainer.scrollTop;

        // Logo shrink/expand logic
        if (scrollTop > scrollThreshold && !header.classList.contains('shrink')) {
            header.classList.add('shrink');
            if (logo) logo.classList.add('shrink');
        } else if (scrollTop <= scrollThreshold && header.classList.contains('shrink')) {
            header.classList.remove('shrink');
            if (logo) logo.classList.remove('shrink');
        }

        // Update scroll progress
        const winScroll = snapContainer.scrollTop;
        const height = snapContainer.scrollHeight - snapContainer.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
        
        handleParallax();
        handleSectionVisibility();
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    }, 10));

    // Navigation click handling
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.hasAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    smoothScrollTo(targetSection);
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // Setup back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            snapContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button based on scroll position
        snapContainer.addEventListener('scroll', debounce(() => {
            if (snapContainer.scrollTop > window.innerHeight / 2) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 150));
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    setupProductCards();
    setupModal();
    setupContactForm();
    setupScrolling();

    // Start welcome message animation
    const welcomeHeading = document.querySelector('.services-text h3');
    if (welcomeHeading) {
        const originalText = welcomeHeading.textContent;
        welcomeHeading.textContent = '';
        typeWriter(welcomeHeading, originalText);
    }

    // Initial section visibility check
    handleSectionVisibility();
    updateActiveNavLink();

    // Initialize first section as visible
    const firstSection = document.querySelector('.section-content');
    if (firstSection) {
        firstSection.classList.add('visible');
    }
});

// Dot navigation logic for snap sections
document.addEventListener("DOMContentLoaded", function () {
    // Dot navigation
    const dotBtns = document.querySelectorAll(".dot-nav-btn");
    const snapSections = document.querySelectorAll(".snap-section");
    const snapContainer = document.querySelector(".snap-container");
    
    if (!dotBtns.length || !snapContainer) return;

    function setActiveDotByIndex(index) {
        dotBtns.forEach((btn, i) => {
            btn.classList.toggle("active", i === index);
        });
    }

    // Scroll to section on dot click
    dotBtns.forEach((btn, i) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSelector = btn.getAttribute("data-target");
            const targetSection = document.querySelector(targetSelector);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveDotByIndex(i);
            }
        });
    });

    // Track scroll position to update dot nav
    function updateDotNavOnScroll() {
        let found = false;
        snapSections.forEach((section, i) => {
            const rect = section.getBoundingClientRect();
            // The section is considered "active" if its top is at or above 1/3 viewport and its bottom is at least 1/3 into viewport
            if (!found && rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
                setActiveDotByIndex(i);
                found = true;
            }
        });
    }

    snapContainer.addEventListener("scroll", updateDotNavOnScroll);
    window.addEventListener("resize", updateDotNavOnScroll);
    updateDotNavOnScroll();

    // Optionally, allow keyboard navigation with arrow keys
    snapContainer.addEventListener("keydown", function (e) {
        const activeIndex = Array.from(dotBtns).findIndex(btn => btn.classList.contains("active"));
        if (e.key === "ArrowDown" || e.key === "PageDown") {
            if (activeIndex < snapSections.length - 1) {
                snapSections[activeIndex + 1].scrollIntoView({ behavior: "smooth", block: "start" });
                dotBtns[activeIndex + 1].focus();
            }
            e.preventDefault();
        }
        if (e.key === "ArrowUp" || e.key === "PageUp") {
            if (activeIndex > 0) {
                snapSections[activeIndex - 1].scrollIntoView({ behavior: "smooth", block: "start" });
                dotBtns[activeIndex - 1].focus();
            }
            e.preventDefault();
        }
    });

    // Make snap sections focusable for accessibility
    snapSections.forEach(section => {
        section.setAttribute("tabindex", "0");
    });
});