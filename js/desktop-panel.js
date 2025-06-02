/**
 * Desktop Panel Content Management
 * Handles displaying section content in the right-side panel
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on desktop
    if (window.innerWidth < 768) return;

    // Create the content panel structure
    createContentPanel();
    
    // Extract all section contents
    extractSectionContents();
    
    // Setup accordion menu item clicks
    setupMenuClicks();
    
    // Show default content panel (first section)
    showDefaultContent();
});

/**
 * Create the content panel structure in the DOM
 */
function createContentPanel() {
    // Create the main panel container
    const contentPanel = document.createElement('div');
    contentPanel.className = 'content-panel';
    contentPanel.id = 'contentPanel';
    
    // Create panel header
    const panelHeader = document.createElement('div');
    panelHeader.className = 'panel-header';
    
    // Create title element
    const panelTitle = document.createElement('h2');
    panelTitle.className = 'panel-title';
    panelTitle.id = 'panelTitle';
    panelTitle.textContent = 'Welcome';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'panel-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close panel');
    
    // Create panel content area
    const panelContent = document.createElement('div');
    panelContent.className = 'panel-content';
    panelContent.id = 'panelContent';
    
    // Assemble the panel
    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(closeButton);
    contentPanel.appendChild(panelHeader);
    contentPanel.appendChild(panelContent);
    
    // Add to the document
    document.body.appendChild(contentPanel);
    
    // Add close button functionality
    closeButton.addEventListener('click', function() {
        contentPanel.classList.remove('active');
        
        // Unselect all menu items
        const menuItems = document.querySelectorAll('.accordion ul li');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Collapse all accordion sections
        const radioInputs = document.querySelectorAll('.accordion .section input[type="radio"]');
        radioInputs.forEach(input => {
            input.checked = false;
        });
    });
}

/**
 * Extract all section contents and store them for display in the panel
 */
function extractSectionContents() {
    const sections = {
        'services': document.querySelector('#services .section-content'),
        'products': document.querySelector('#products .section-content'),
        'contact': document.querySelector('#contact .section-content'),
        'footer': document.querySelector('#footer .section-content')
    };
    
    // Clone the sections for use in the panel
    window.sectionContents = {};
    
    for (const [id, section] of Object.entries(sections)) {
        if (section) {
            // Create a container for this content
            const container = document.createElement('div');
            container.id = `${id}-content`;
            container.className = 'panel-section-content';
            
            // Clone the section content
            const clonedContent = section.cloneNode(true);
            container.appendChild(clonedContent);
            
            // Store for later use
            window.sectionContents[id] = container;
        }
    }
}

/**
 * Setup click handlers for accordion menu items
 */
function setupMenuClicks() {
    const menuItems = document.querySelectorAll('.accordion ul li');
    const contentPanel = document.getElementById('contentPanel');
    const panelContent = document.getElementById('panelContent');
    const panelTitle = document.getElementById('panelTitle');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get target section from data attribute
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;
            
            // Extract section name without the # symbol
            const sectionName = targetId.substring(1);
            
            // Update active state
            menuItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            
            // Set the panel title
            let title = 'Content';
            
            switch(sectionName) {
                case 'services':
                    title = 'Our Services';
                    break;
                case 'products':
                    title = 'Our Products';
                    break;
                case 'contact':
                    title = 'Contact Us';
                    break;
                case 'footer':
                    title = 'About Us';
                    break;
            }
            
            panelTitle.textContent = title;
            
            // Clear current content
            panelContent.innerHTML = '';
            
            // Insert the correct section content
            if (window.sectionContents[sectionName]) {
                const contentClone = window.sectionContents[sectionName].cloneNode(true);
                panelContent.appendChild(contentClone);
                
                // Initialize any interactive elements in the cloned content
                initializeClonedContent(contentClone, sectionName);
            }
            
            // Show the panel
            contentPanel.classList.add('active');
            
            // Handle parent accordion section
            const parentSection = this.closest('.section');
            if (parentSection) {
                const radioInput = parentSection.querySelector('input[type="radio"]');
                if (radioInput) {
                    radioInput.checked = true;
                }
            }
        });
    });
    
    // Make accordion section labels also toggle the panel
    const sectionLabels = document.querySelectorAll('.accordion .section label');
    
    sectionLabels.forEach(label => {
        label.addEventListener('click', function() {
            // Get the first menu item in this section
            const firstItem = this.nextElementSibling.querySelector('ul li');
            if (firstItem) {
                // Simulate a click on the first item
                setTimeout(() => {
                    firstItem.click();
                }, 100);
            }
        });
    });
}

/**
 * Initialize interactive elements in cloned content
 */
function initializeClonedContent(contentElement, sectionName) {
    // Handle 3D carousel in products section
    if (sectionName === 'products' && typeof initMobileProductCarousel === 'function') {
        // Fix IDs to avoid duplicate IDs in the document
        const carousel = contentElement.querySelector('#product-carousel');
        if (carousel) {
            carousel.id = 'panel-product-carousel';
            
            // Initialize the carousel
            setTimeout(() => {
                // Apply custom initialization for the panel carousel
                initPanelProductCarousel();
            }, 100);
        }
    }
    
    // Handle forms in the contact section
    if (sectionName === 'contact') {
        const form = contentElement.querySelector('#contactForm');
        if (form) {
            form.id = 'panelContactForm';
            
            // Set up form submission
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                form.appendChild(successMessage);
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    successMessage.remove();
                }, 3000);
            });
        }
    }
}

/**
 * Initialize the product carousel in the panel
 */
function initPanelProductCarousel() {
    const carousel = document.getElementById('panel-product-carousel');
    if (!carousel) return;
    
    // Get carousel figures
    const figures = carousel.querySelectorAll('figure');
    const angleStep = 360 / figures.length;
    
    // Setup initial positioning
    figures.forEach((figure, index) => {
        const angle = angleStep * index;
        figure.style.transform = `rotateY(${angle}deg) translateZ(250px)`;
        
        figure.addEventListener('click', function() {
            // Toggle active state
            const isActive = this.classList.contains('active');
            figures.forEach(fig => fig.classList.remove('active'));
            
            if (!isActive) {
                this.classList.add('active');
                carousel.classList.add('paused');
            } else {
                carousel.classList.remove('paused');
            }
        });
    });
    
    // Start rotation animation
    carousel.style.animation = 'rotation 30s infinite linear';
}

/**
 * Show default content when page loads
 */
function showDefaultContent() {
    // Click the first menu item
    setTimeout(() => {
        const firstItem = document.querySelector('.accordion ul li');
        if (firstItem) {
            firstItem.click();
        }
    }, 500);
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        // Hide the content panel when switching to mobile
        const contentPanel = document.getElementById('contentPanel');
        if (contentPanel) {
            contentPanel.classList.remove('active');
        }
    }
});