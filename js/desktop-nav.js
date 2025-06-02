/**
 * Desktop Accordion Navigation for Cake Walk Baking Co.
 * Handles the accordion menu navigation and section scrolling
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on desktop
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    // Setup accordion menu item clicks
    const menuItems = document.querySelectorAll('.accordion ul li');
    const sections = document.querySelectorAll('.snap-section');
    const snapContainer = document.querySelector('.snap-container');

    // Function to scroll to a section
    function scrollToSection(sectionId) {
        const targetSection = document.querySelector(sectionId);
        if (targetSection && snapContainer) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Add click handlers to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            if (targetId) {
                // Remove active class from all items
                menuItems.forEach(li => li.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Scroll to the target section
                scrollToSection(targetId);
            }
        });
    });

    // Update active menu item based on visible section
    function updateActiveMenuItem() {
        let found = false;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Section is considered visible if it's in the viewport
            if (rect.top <= 100 && rect.bottom >= 100) {
                const sectionId = '#' + section.id;
                
                // Find menu items that link to this section
                menuItems.forEach(item => {
                    const targetId = item.getAttribute('data-target');
                    if (targetId === sectionId) {
                        // Remove active class from all items
                        menuItems.forEach(li => li.classList.remove('active'));
                        
                        // Add active class to this item
                        item.classList.add('active');
                        
                        // Expand parent accordion section
                        const parentContent = item.closest('.content');
                        if (parentContent) {
                            const parentSection = parentContent.parentElement;
                            const radioInput = parentSection.querySelector('input[type="radio"]');
                            if (radioInput) {
                                radioInput.checked = true;
                            }
                        }
                        
                        found = true;
                    }
                });
            }
        });
        
        return found;
    }

    // Add scroll event listener to update active menu item
    if (snapContainer) {
        snapContainer.addEventListener('scroll', debounce(updateActiveMenuItem, 100));
    }

    // Initial update
    updateActiveMenuItem();

    // Expand first accordion section by default if none is active
    if (!document.querySelector('.accordion .section input[type="radio"]:checked')) {
        const firstRadio = document.querySelector('.accordion .section input[type="radio"]');
        if (firstRadio) {
            firstRadio.checked = true;
        }
    }

    // Debounce function to limit scroll event handling
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
});

// Add the script to the HTML document
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('script[src="js/desktop-nav.js"]')) {
        const script = document.createElement('script');
        script.src = 'js/desktop-nav.js';
        script.defer = true;
        document.head.appendChild(script);
    }
});