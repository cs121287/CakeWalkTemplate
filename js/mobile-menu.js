/**
 * Mobile menu functionality for Cake Walk Baking Co.
 * Handles the slide-in navigation and touch interactions
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileNav = document.getElementById('mobileNav');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.mobile-nav .nav-link');
    
    // Open menu
    menuToggle.addEventListener('click', function() {
        openNavMenu();
    });
    
    // Close menu
    closeMenu.addEventListener('click', function() {
        closeNavMenu();
    });
    
    // Close when clicking overlay
    navOverlay.addEventListener('click', function() {
        closeNavMenu();
    });
    
    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeNavMenu();
            
            // Add a small delay before scrolling to the section
            // This makes the navigation feel smoother
            setTimeout(() => {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    });
    
    function openNavMenu() {
        mobileNav.classList.add('open');
        navOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Add accessibility attributes
        mobileNav.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
    }
    
    function closeNavMenu() {
        mobileNav.classList.remove('open');
        navOverlay.classList.remove('open');
        document.body.style.overflow = '';
        
        // Update accessibility attributes
        mobileNav.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Handle swipe gesture to open/close menu
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const threshold = 100; // Minimum distance required for swipe
        
        // Detect right swipe near left edge to open menu
        if (touchStartX < 50 && swipeDistance > threshold) {
            openNavMenu();
        }
        
        // Detect left swipe to close menu when open
        if (mobileNav.classList.contains('open') && swipeDistance < -threshold) {
            closeNavMenu();
        }
    }
    
    // Set initial ARIA states
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
});