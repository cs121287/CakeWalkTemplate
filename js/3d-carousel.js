/**
 * Mobile-optimized 3D Carousel for Product Gallery
 * Enhanced for touch devices with better interaction
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileProductCarousel();
    setupIntersectionObserver();
});

/**
 * Initialize the Product Carousel optimized for mobile touch
 */
function initMobileProductCarousel() {
    const carousel = document.getElementById('product-carousel');
    if (!carousel) return;
    
    // Get carousel figures
    const figures = carousel.querySelectorAll('figure');
    const angleStep = 360 / figures.length;
    
    // Add touch instruction text
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const instructions = document.createElement('div');
        instructions.className = 'carousel-touch-instructions';
        instructions.innerHTML = '<span class="touch-icon"><i class="fas fa-hand-pointer"></i></span> Tap to pause, swipe to rotate';
        if (carouselContainer.parentNode) {
            carouselContainer.parentNode.insertBefore(instructions, carouselContainer.nextSibling);
        }
    }
    
    // Setup initial positioning
    figures.forEach((figure, index) => {
        const angle = angleStep * index;
        figure.setAttribute('data-angle', angle);
        
        // Setup touch handling on mobile
        figure.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle active state on the figure
            const isActive = this.classList.contains('active');
            
            // First remove active class from all figures
            figures.forEach(fig => fig.classList.remove('active'));
            
            // Toggle carousel rotation
            if (isActive) {
                carousel.classList.remove('paused');
            } else {
                this.classList.add('active');
                carousel.classList.add('paused');
            }
        });
    });
    
    // Touch interactions for rotation
    let touchStartX = 0;
    let touchStartY = 0;
    let currentRotation = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        if (carousel.classList.contains('paused')) return;
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        
        // Save current rotation and pause animation
        const computedStyle = window.getComputedStyle(carousel);
        const transform = computedStyle.getPropertyValue('transform');
        const matrix = new DOMMatrix(transform);
        currentRotation = Math.atan2(matrix.m32, matrix.m33) * (180 / Math.PI);
        
        carousel.style.animation = 'none';
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
    });
    
    carousel.addEventListener('touchmove', function(e) {
        if (carousel.classList.contains('paused')) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        // Calculate distance moved
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        
        // Only rotate if horizontal movement is greater than vertical
        // (to avoid interfering with page scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            
            // Convert touch movement to rotation degrees (make it more sensitive)
            const newRotation = currentRotation + (deltaX * 0.5);
            carousel.style.transform = `rotateY(${newRotation}deg)`;
        }
    });
    
    carousel.addEventListener('touchend', function(e) {
        if (carousel.classList.contains('paused')) return;
        
        // Get final rotation
        const computedStyle = window.getComputedStyle(carousel);
        const transform = computedStyle.getPropertyValue('transform');
        const matrix = new DOMMatrix(transform);
        const finalRotation = Math.atan2(matrix.m32, matrix.m33) * (180 / Math.PI);
        
        // Resume animation from current position
        carousel.style.animation = 'none';
        carousel.style.transform = `rotateY(${finalRotation}deg)`;
        
        // Force reflow to ensure the animation restarts properly
        void carousel.offsetWidth;
        
        // Resume animation
        carousel.style.animation = `rotation 30s infinite linear`;
        carousel.style.animationDelay = `${-finalRotation/360*30}s`;
    });
    
    // Setup modal functionality
    setupProductCardClicks(figures);
}

/**
 * Setup product card clicks for modal with touch enhancements
 */
function setupProductCardClicks(figures) {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    figures.forEach(figure => {
        // Long press detection for touch devices
        let pressTimer;
        
        figure.addEventListener('touchstart', function(e) {
            // Only if the figure is active (carousel paused)
            if (this.classList.contains('active')) {
                pressTimer = setTimeout(() => {
                    openProductModal(this);
                }, 500);
            }
        });
        
        figure.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });
        
        figure.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });
        
        // Double tap detection
        let lastTap = 0;
        figure.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 300 && tapLength > 0 && this.classList.contains('active')) {
                e.preventDefault();
                openProductModal(this);
            }
            
            lastTap = currentTime;
        });
    });
    
    function openProductModal(figure) {
        const productName = figure.getAttribute('data-product');
        const img = figure.querySelector('img');
        
        // Prepare modal content
        if (img) {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
        }
        
        // Find product details
        const details = figure.querySelector('.product-details');
        if (details) {
            modalCaption.innerHTML = `
                <h2 class="modal-title">${productName}</h2>
                <div class="modal-description">${details.innerHTML}</div>
                <button class="modal-close-btn">Close</button>
            `;
        }
        
        // Show modal with animation
        modal.style.display = "block";
        
        // Mobile-friendly animations
        modalImg.animate(
            [
                { opacity: 0, transform: 'scale(0.8)' },
                { opacity: 1, transform: 'scale(1)' }
            ],
            { duration: 300, easing: 'ease-out', fill: 'forwards' }
        );
        
        modalCaption.animate(
            [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ],
            { duration: 300, easing: 'ease-out', fill: 'forwards' }
        );
        
        modal.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        // Add click handler for the new close button
        const closeBtn = modalCaption.querySelector('.modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
    }
    
    // Setup modal close functionality
    const closeBtn = modal.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('touchend', closeModal);
    }
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('modal-open');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Setup intersection observer for animation on section visibility
 */
function setupIntersectionObserver() {
    const productsSection = document.querySelector('#products .section-content');
    if (!productsSection) return;
    
    // Add animated-heading class to the title
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = productsSection.querySelector('.section-title');
                if (title) {
                    title.classList.add('animated-title');
                }
                
                // Auto-pause carousel when section comes into view for better performance
                const carousel = document.getElementById('product-carousel');
                if (carousel) {
                    setTimeout(() => {
                        carousel.classList.remove('paused');
                    }, 500);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(productsSection);
}

/**
 * Handle modal close events
 */
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.modal .close');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        modal.classList.remove('modal-open');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});