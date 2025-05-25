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
            navLinks[index].classList.add('active');
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

// Product card hover effect
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

// Modal functionality for product images
function setupModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close')[0];
    const productCards = document.querySelectorAll('.product-card img');

    productCards.forEach(img => {
        img.onclick = function(e) {
            e.stopPropagation();
            modal.style.display = "block";
            modalImg.src = this.src;
            modal.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        }
    });

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

// Enhanced smooth scrolling with snap effect
function setupScrolling() {
    const snapContainer = document.querySelector('.snap-container');
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let isScrolling = false;
    let lastScrollTime = 0;
    const scrollCooldown = 1000; // ms between scroll actions

    function smoothScrollTo(element) {
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown) return;
        
        lastScrollTime = now;
        isScrolling = true;
        
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    }

    // Wheel event handler
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
                smoothScrollTo(sections[targetIndex]);
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
                smoothScrollTo(sections[targetIndex]);
            }
            touchStartY = touchCurrentY;
        }
    }, { passive: false });

    // Update scroll progress and handle animations
    snapContainer.addEventListener('scroll', debounce(() => {
        const winScroll = snapContainer.scrollTop;
        const height = snapContainer.scrollHeight - snapContainer.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
        
        handleParallax();
        handleSectionVisibility();
        updateActiveNavLink();
    }, 10));

    // Navigation click handling
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
                history.pushState(null, null, targetId);
            }
        });
    });
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