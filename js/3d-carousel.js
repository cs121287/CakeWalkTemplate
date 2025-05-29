/**
 * 3D Carousel for Product Gallery
 * Implements a 3D spinning carousel with hover pause/resume functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    initProductCarousel();
    setupIntersectionObserver();
});

/**
 * Initialize the 3D Product Carousel
 */
function initProductCarousel() {
    const carousel = document.getElementById('product-carousel');
    if (!carousel) return;
    
    // Set initial rotation angle for each figure
    const figures = carousel.querySelectorAll('figure');
    const angleStep = 360 / figures.length;
    
    figures.forEach((figure, index) => {
        const angle = angleStep * index;
        figure.style.setProperty('--angle', angle);
    });
    
    // Setup product card click events for modal
    setupProductCardClicks(figures);
}

/**
 * Setup product card click events to open modal
 */
function setupProductCardClicks(figures) {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    figures.forEach(figure => {
        figure.addEventListener('click', function() {
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
                `;
            }
            
            // Show modal with animation
            modal.style.display = "block";
            
            // Apply entrance animations
            modalImg.animate(
                [
                    { opacity: 0, transform: 'scale(0.8)' },
                    { opacity: 1, transform: 'scale(1)' }
                ],
                { duration: 400, easing: 'ease-out', fill: 'forwards' }
            );
            
            modalCaption.animate(
                [
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                { duration: 400, delay: 200, easing: 'ease-out', fill: 'forwards' }
            );
            
            modal.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        });
    });
}

/**
 * Setup intersection observer for animation on section visibility
 */
function setupIntersectionObserver() {
    const productsSection = document.querySelector('#products .section-content');
    if (!productsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animations when the section becomes visible
                const title = productsSection.querySelector('.section-title');
                if (title) {
                    title.classList.add('animated-title');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
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