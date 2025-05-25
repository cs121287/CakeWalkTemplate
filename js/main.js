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

// Scroll Animation for sections
function handleScrollAnimations() {
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('animate');
        }
    });
}

// Parallax effect for services section
function handleParallax() {
    const servicesImage = document.querySelector('.services-image');
    if (servicesImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.1;
        servicesImage.style.transform = `translateY(${Math.min(rate, 100)}px)`;
    }
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
        // Add floating label effect
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

// Smooth scrolling with progress indicator
function setupScrolling() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', debounce(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, 10));

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });

            // Update URL without jump
            history.pushState(null, null, targetId);
        });
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('animate-on-scroll');
    });

    // Setup all features
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

    // Add scroll event listeners
    const handleScroll = debounce(() => {
        handleScrollAnimations();
        handleParallax();
    }, 10);

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check for elements in viewport
});