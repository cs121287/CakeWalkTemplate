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
    
    // Add resize observer to auto-scale content
    addResizeObserver();
    
    // Add zoom controls
    addZoomControls();
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
    
    // Create auto-scaling container
    const autoScaleContainer = document.createElement('div');
    autoScaleContainer.className = 'auto-scale-container';
    autoScaleContainer.id = 'autoScaleContainer';
    
    // Create scale content container
    const scaleContent = document.createElement('div');
    scaleContent.className = 'scale-content';
    scaleContent.id = 'scaleContent';
    
    // Add zoom controls container
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.innerHTML = `
        <button class="zoom-btn zoom-in" aria-label="Zoom in">+</button>
        <button class="zoom-btn zoom-out" aria-label="Zoom out">-</button>
        <button class="zoom-btn zoom-reset" aria-label="Reset zoom">↺</button>
    `;
    
    // Assemble the panel
    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(closeButton);
    autoScaleContainer.appendChild(scaleContent);
    panelContent.appendChild(autoScaleContainer);
    contentPanel.appendChild(panelHeader);
    contentPanel.appendChild(panelContent);
    contentPanel.appendChild(zoomControls);
    
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
    const scaleContent = document.getElementById('scaleContent');
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
            scaleContent.innerHTML = '';
            
            // Reset zoom level
            scaleContent.style.transform = 'scale(1)';
            
            // Insert the correct section content
            if (window.sectionContents[sectionName]) {
                const contentClone = window.sectionContents[sectionName].cloneNode(true);
                scaleContent.appendChild(contentClone);
                
                // Initialize any interactive elements in the cloned content
                initializeClonedContent(contentClone, sectionName);
                
                // Auto-fit content if needed
                autoFitContent();
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
    if (sectionName === 'products') {
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
    } else {
        // Auto-fit content when resizing
        autoFitContent();
    }
});

/**
 * Add ResizeObserver to dynamically adjust content scale
 */
function addResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    
    const scaleContainer = document.getElementById('autoScaleContainer');
    const scaleContent = document.getElementById('scaleContent');
    
    if (!scaleContainer || !scaleContent) return;
    
    const observer = new ResizeObserver(entries => {
        autoFitContent();
    });
    
    // Observe both container and content
    observer.observe(scaleContainer);
    observer.observe(scaleContent);
}

/**
 * Auto-fit content to container
 */
function autoFitContent() {
    const container = document.getElementById('autoScaleContainer');
    const content = document.getElementById('scaleContent');
    
    if (!container || !content) return;
    
    // Get current actual dimensions
    const containerRect = container.getBoundingClientRect();
    
    // Reset scale to measure true size
    content.style.transform = 'scale(1)';
    const contentRect = content.getBoundingClientRect();
    
    // Calculate scale factors
    const scaleX = containerRect.width / contentRect.width;
    const scaleY = containerRect.height / contentRect.height;
    
    // Use the smaller scale factor to ensure content fits within container
    const scale = Math.min(scaleX, scaleY, 1);
    
    // Apply scale
    content.style.transform = `scale(${scale})`;
    
    // Store original scale for zoom controls
    content.setAttribute('data-original-scale', scale);
}

/**
 * Add zoom controls functionality
 */
function addZoomControls() {
    const contentPanel = document.getElementById('contentPanel');
    if (!contentPanel) return;
    
    const zoomIn = contentPanel.querySelector('.zoom-in');
    const zoomOut = contentPanel.querySelector('.zoom-out');
    const zoomReset = contentPanel.querySelector('.zoom-reset');
    const scaleContent = document.getElementById('scaleContent');
    
    if (!zoomIn || !zoomOut || !zoomReset || !scaleContent) return;
    
    // Zoom factors
    const zoomFactor = 0.1;
    let currentScale = 1;
    
    zoomIn.addEventListener('click', function() {
        currentScale += zoomFactor;
        applyZoom(currentScale);
    });
    
    zoomOut.addEventListener('click', function() {
        currentScale = Math.max(0.1, currentScale - zoomFactor);
        applyZoom(currentScale);
    });
    
    zoomReset.addEventListener('click', function() {
        currentScale = 1;
        autoFitContent();
    });
    
    function applyZoom(scale) {
        const origScale = parseFloat(scaleContent.getAttribute('data-original-scale') || '1');
        scaleContent.style.transform = `scale(${origScale * scale})`;
    }
    
    // Add mouse wheel zoom support
    scaleContent.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
                currentScale += zoomFactor;
            } else {
                currentScale = Math.max(0.1, currentScale - zoomFactor);
            }
            applyZoom(currentScale);
        }
    }, { passive: false });
}