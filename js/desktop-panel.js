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
    
    // Create custom content for menu items
    createCustomContent();
    
    // Setup accordion menu item clicks
    setupMenuClicks();
    
    // Show default content panel (first section)
    showDefaultContent();
    
    // Add resize observer to auto-scale content
    addResizeObserver();
    
    // Add zoom controls
    addZoomControls();
    
    // Add 3D carousel modal CSS
    addCarouselModalCSS();
});

/**
 * Add the 3D carousel modal CSS to the document
 */
function addCarouselModalCSS() {
    if (!document.querySelector('link[href="css/desktop/3d-carousel-modal.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/desktop/3d-carousel-modal.css';
        document.head.appendChild(link);
    }
}

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
 * Create custom content for each menu item
 */
function createCustomContent() {
    window.customContents = {};
    
    // Our Services - Our Mission
    window.customContents['services-mission'] = createServicesMissionContent();
    
    // Our Products
    window.customContents['products-gallery'] = createProductsGalleryContent();
    window.customContents['products-wedding-cakes'] = createProductWeddingCakesContent();
    window.customContents['products-cupcakes'] = createProductCupcakesContent();
    window.customContents['products-birthday-cakes'] = createProductBirthdayCakesContent();
    window.customContents['products-pastries'] = createProductPastriesContent();
    window.customContents['products-cookies'] = createProductCookiesContent();
    window.customContents['products-pies'] = createProductPiesContent();
    
    // Contact Us
    window.customContents['contact-location'] = createContactLocationContent();
    window.customContents['contact-phone'] = createContactPhoneContent();
    window.customContents['contact-form'] = createContactFormContent();
    
    // About Us
    window.customContents['footer-story'] = createAboutStoryContent();
    window.customContents['footer-team'] = createAboutTeamContent();
    window.customContents['footer-policies'] = createAboutPoliciesContent();
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
            
            // Get menu item text content
            const itemText = this.querySelector('span').textContent.trim();
            
            // Update active state
            menuItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
            
            // Set the panel title to menu item text
            panelTitle.textContent = itemText;
            
            // Clear current content
            scaleContent.innerHTML = '';
            
            // Reset zoom level
            scaleContent.style.transform = 'scale(1)';
            
            // Determine which content to show based on section and menu item text
            let contentToShow = null;
            
            // Create a key for custom content based on section name and menu item text
            const customKey = createCustomContentKey(sectionName, itemText);
            
            // Check if we have custom content for this specific menu item
            if (window.customContents && window.customContents[customKey]) {
                contentToShow = window.customContents[customKey];
            } else {
                // Fallback to section content
                contentToShow = window.sectionContents[sectionName];
            }
            
            // Insert the content
            if (contentToShow) {
                const contentClone = contentToShow.cloneNode(true);
                scaleContent.appendChild(contentClone);
                
                // Initialize any interactive elements in the cloned content
                initializeClonedContent(contentClone, sectionName, itemText);
                
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
function initializeClonedContent(contentElement, sectionName, menuItem) {
    // Check if this is the gallery product
    if (sectionName === 'products' && menuItem === 'Gallery') {
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
    if (sectionName === 'contact' && menuItem === 'Contact Form') {
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
 * Initialize the product carousel in the panel - UPDATED FUNCTION
 */
function initPanelProductCarousel() {
    const carousel = document.getElementById('panel-product-carousel');
    if (!carousel) {
        console.error('Panel carousel not found');
        return;
    }
    
    // Ensure proper positioning and styling
    carousel.style.position = 'relative';
    carousel.style.height = '400px';
    carousel.style.transform = 'translateZ(-400px)';
    carousel.style.transformStyle = 'preserve-3d';
    
    // Get carousel figures
    const figures = carousel.querySelectorAll('figure');
    if (!figures || figures.length === 0) {
        console.error('No figures found in panel carousel');
        return;
    }
    
    const angleStep = 360 / figures.length;
    console.log(`Positioning ${figures.length} figures with angle step ${angleStep}`);
    
    // Setup initial positioning
    figures.forEach((figure, index) => {
        const angle = angleStep * index;
        figure.style.transform = `rotateY(${angle}deg) translateZ(250px)`;
        figure.style.position = 'absolute';
        figure.style.width = '200px';
        figure.style.height = '200px';
        figure.style.left = '50%';
        figure.style.top = '50%';
        figure.style.marginLeft = '-100px';
        figure.style.marginTop = '-100px';
        figure.style.transformOrigin = 'center center';
        
        // Make product details visible
        const details = figure.querySelector('.product-details');
        if (details) {
            details.style.display = 'block';
        }
        
        // Set up click event
        figure.addEventListener('click', function() {
            // Toggle active state
            const isActive = this.classList.contains('active');
            
            // Remove active class from all figures
            figures.forEach(fig => fig.classList.remove('active'));
            
            // Toggle carousel animation
            if (!isActive) {
                this.classList.add('active');
                carousel.classList.add('paused');
            } else {
                carousel.classList.remove('paused');
            }
        });
    });
    
    // Add rotation animation
    carousel.style.animation = 'modalRotation 30s infinite linear';
    
    // Add controls for the carousel
    addCarouselControls(carousel);
}

/**
 * Add controls for the carousel
 */
function addCarouselControls(carousel) {
    const parentContainer = carousel.closest('.carousel-container');
    if (!parentContainer) return;
    
    // Create controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'carousel-controls';
    
    // Add rotate button
    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'carousel-btn rotate-btn';
    rotateBtn.innerHTML = '<i class="fas fa-pause"></i>';
    rotateBtn.title = 'Pause rotation';
    rotateBtn.addEventListener('click', function() {
        if (carousel.classList.contains('paused')) {
            carousel.classList.remove('paused');
            this.innerHTML = '<i class="fas fa-pause"></i>';
            this.title = 'Pause rotation';
        } else {
            carousel.classList.add('paused');
            this.innerHTML = '<i class="fas fa-play"></i>';
            this.title = 'Start rotation';
        }
    });
    
    // Add buttons to the container
    controlsContainer.appendChild(rotateBtn);
    
    // Add the container after the carousel
    parentContainer.parentNode.insertBefore(controlsContainer, parentContainer.nextSibling);
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
 * Create a key for custom content based on section name and menu item text
 */
function createCustomContentKey(section, menuItem) {
    // Normalize section name and menu item text
    section = section.toLowerCase();
    menuItem = menuItem.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    return `${section}-${menuItem}`;
}

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

/**
 * Content creation functions for different menu items
 */

// Our Services - Our Mission
function createServicesMissionContent() {
    const container = document.createElement('div');
    container.className = 'custom-content mission-content';
    
    container.innerHTML = `
        <h2 class="section-title">Our Mission</h2>
        <div class="mission-container">
            <div class="mission-text">
                <h3>The Cake Walk Promise</h3>
                <p>At Cake Walk Baking Co., our mission is to create exceptional baked goods that bring joy and sweetness to every celebration. We believe in:</p>
                <ul class="mission-list">
                    <li><i class="fas fa-check"></i> <strong>Quality Ingredients</strong> - We use only premium, locally-sourced ingredients whenever possible.</li>
                    <li><i class="fas fa-check"></i> <strong>Artisanal Approach</strong> - Every item is handcrafted with meticulous attention to detail.</li>
                    <li><i class="fas fa-check"></i> <strong>Custom Creations</strong> - We work closely with you to design the perfect treat for your occasion.</li>
                    <li><i class="fas fa-check"></i> <strong>Community Focus</strong> - We proudly support local suppliers and community events.</li>
                </ul>
                <p>Whether you're celebrating a wedding, birthday, anniversary, or simply enjoying a sweet treat, we pour our hearts into creating something special for you.</p>
            </div>
            <div class="mission-image">
                <img src="img/bakery.jpg" alt="Our Bakery">
                <div class="mission-overlay">
                    <p>"Creating sweet moments, one bite at a time."</p>
                </div>
            </div>
        </div>
        <div class="philosophy-section">
            <h3>Our Baking Philosophy</h3>
            <div class="philosophy-grid">
                <div class="philosophy-item">
                    <i class="fas fa-leaf"></i>
                    <h4>Sustainable Practices</h4>
                    <p>We use eco-friendly packaging and minimize waste in our baking process.</p>
                </div>
                <div class="philosophy-item">
                    <i class="fas fa-heart"></i>
                    <h4>Made with Love</h4>
                    <p>Every product is crafted with care, passion, and attention to detail.</p>
                </div>
                <div class="philosophy-item">
                    <i class="fas fa-utensils"></i>
                    <h4>Time-Tested Recipes</h4>
                    <p>Our recipes combine traditional methods with innovative techniques.</p>
                </div>
                <div class="philosophy-item">
                    <i class="fas fa-thumbs-up"></i>
                    <h4>Customer Satisfaction</h4>
                    <p>Your satisfaction is our top priority, and we stand behind every creation.</p>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Our Products - Gallery
function createProductsGalleryContent() {
    // Create custom gallery content with the 3D carousel
    const container = document.createElement('div');
    container.className = 'custom-content gallery-content';
    
    container.innerHTML = `
        <h2 class="section-title">Product Gallery</h2>
        <h3>Click on a product for more details</h3>
        
        <div class="carousel-container">
            <div id="panel-product-carousel">
                <figure data-product="Wedding Cakes" data-category="cakes">
                    <div class="product-card-inner">
                        <div class="product-card-front">
                            <img src="img/img1.png" alt="Wedding Cake">
                            <div class="product-overlay">
                                <span class="view-details">View Details</span>
                            </div>
                        </div>
                        <div class="product-details">
                            <h3>Wedding Cakes</h3>
                            <p>Custom-designed wedding cakes for your special day</p>
                        </div>
                    </div>
                </figure>
                <figure data-product="Cupcakes" data-category="cupcakes">
                    <div class="product-card-inner">
                        <div class="product-card-front">
                            <img src="img/img2.png" alt="Cupcakes">
                            <div class="product-overlay">
                                <span class="view-details">View Details</span>
                            </div>
                        </div>
                        <div class="product-details">
                            <h3>Cupcakes</h3>
                            <p>Variety of flavors and decorative designs</p>
                        </div>
                    </div>
                </figure>
                <figure data-product="Birthday Cakes" data-category="cakes">
                    <div class="product-card-inner">
                        <div class="product-card-front">
                            <img src="img/img3.png" alt="Birthday Cake">
                            <div class="product-overlay">
                                <span class="view-details">View Details</span>
                            </div>
                        </div>
                        <div class="product-details">
                            <h3>Birthday Cakes</h3>
                            <p>Personalized cakes for all ages</p>
                        </div>
                    </div>
                </figure>
                <figure data-product="Pastries" data-category="pastries">
                    <div class="product-card-inner">
                        <div class="product-card-front">
                            <img src="img/img4.png" alt="Pastries">
                            <div class="product-overlay">
                                <span class="view-details">View Details</span>
                            </div>
                        </div>
                        <div class="product-details">
                            <h3>Pastries</h3>
                            <p>Fresh-baked daily pastries and treats</p>
                        </div>
                    </div>
                </figure>
                <figure data-product="Cookies" data-category="pastries">
                    <div class="product-card-inner">
                        <div class="product-card-front">
                            <img src="img/img5.png" alt="Cookies">
                            <div class="product-overlay">
                                <span class="view-details">View Details</span>
                            </div>
                        </div>
                        <div class="product-details">
                            <h3>Cookies</h3>
                            <p>Classic and custom-designed cookies</p>
                        </div>
                    </div>
                </figure>
                <figure data-product="Pies" data-category="pies">
                    <div class="product-card-inner">
                        <div class="product-card-front">
                            <img src="img/img6.png" alt="Pies">
                            <div class="product-overlay">
                                <span class="view-details">View Details</span>
                            </div>
                        </div>
                        <div class="product-details">
                            <h3>Pies</h3>
                            <p>Delicious homemade pies for any occasion</p>
                        </div>
                    </div>
                </figure>
            </div>
        </div>
    `;
    
    return container;
}

// Our Products - Wedding Cakes
function createProductWeddingCakesContent() {
    const container = document.createElement('div');
    container.className = 'custom-content product-detail-content';
    
    container.innerHTML = `
        <h2 class="section-title">Wedding Cakes</h2>
        <div class="product-hero">
            <img src="img/img1.png" alt="Wedding Cake" class="product-hero-img">
        </div>
        <div class="product-details-container">
            <div class="product-info">
                <h3>Celebrate Your Special Day</h3>
                <p>Our wedding cakes are custom designed to match your vision and theme. Each cake is a unique creation that reflects your personal style and serves as a stunning centerpiece for your reception.</p>
                <h4>Features:</h4>
                <ul class="features-list">
                    <li><i class="fas fa-star"></i> Custom design consultations</li>
                    <li><i class="fas fa-star"></i> Premium ingredients</li>
                    <li><i class="fas fa-star"></i> Multiple flavor options</li>
                    <li><i class="fas fa-star"></i> Decorative elements like sugar flowers</li>
                    <li><i class="fas fa-star"></i> Delivery and setup available</li>
                </ul>
                <h4>Popular Flavors:</h4>
                <div class="flavor-grid">
                    <div class="flavor">Vanilla Bean</div>
                    <div class="flavor">Rich Chocolate</div>
                    <div class="flavor">Red Velvet</div>
                    <div class="flavor">Lemon</div>
                    <div class="flavor">Carrot</div>
                    <div class="flavor">Marble</div>
                </div>
            </div>
            <div class="product-ordering">
                <div class="order-info">
                    <h3>How to Order</h3>
                    <p>Wedding cakes require consultation and advance booking. Please contact us at least 3 months before your wedding date.</p>
                    <p class="price">Starting at $350</p>
                    <button class="cta-button">Schedule a Consultation</button>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Our Products - Cupcakes
function createProductCupcakesContent() {
    const container = document.createElement('div');
    container.className = 'custom-content product-detail-content';
    
    container.innerHTML = `
        <h2 class="section-title">Cupcakes</h2>
        <div class="product-hero">
            <img src="img/img2.png" alt="Cupcakes" class="product-hero-img">
        </div>
        <div class="product-details-container">
            <div class="product-info">
                <h3>Delightful Individual Treats</h3>
                <p>Our cupcakes are perfect for any occasion, from casual gatherings to elegant events. Each cupcake is topped with our signature frosting and decorated to match your theme.</p>
                <h4>Options:</h4>
                <ul class="features-list">
                    <li><i class="fas fa-star"></i> Standard size or mini cupcakes</li>
                    <li><i class="fas fa-star"></i> Various frosting styles</li>
                    <li><i class="fas fa-star"></i> Custom decorations and toppers</li>
                    <li><i class="fas fa-star"></i> Gift boxes and party platters</li>
                    <li><i class="fas fa-star"></i> Gluten-free and vegan options available</li>
                </ul>
                <h4>Popular Flavors:</h4>
                <div class="flavor-grid">
                    <div class="flavor">Classic Vanilla</div>
                    <div class="flavor">Double Chocolate</div>
                    <div class="flavor">Red Velvet</div>
                    <div class="flavor">Lemon Drop</div>
                    <div class="flavor">Strawberry</div>
                    <div class="flavor">Salted Caramel</div>
                </div>
            </div>
            <div class="product-ordering">
                <div class="order-info">
                    <h3>How to Order</h3>
                    <p>Cupcakes can be ordered individually or by the dozen. Please allow 48 hours for standard orders and 1 week for custom designs.</p>
                    <p class="price">$3.50 each | $36 per dozen</p>
                    <button class="cta-button">Place an Order</button>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Our Products - Birthday Cakes
function createProductBirthdayCakesContent() {
    const container = document.createElement('div');
    container.className = 'custom-content product-detail-content';
    
    container.innerHTML = `
        <h2 class="section-title">Birthday Cakes</h2>
        <div class="product-hero">
            <img src="img/img3.png" alt="Birthday Cake" class="product-hero-img">
        </div>
        <div class="product-details-container">
            <div class="product-info">
                <h3>Make Their Day Special</h3>
                <p>Our birthday cakes are designed to delight celebrants of all ages. From character cakes for children to sophisticated designs for adults, we create memorable centerpieces for your celebration.</p>
                <h4>Options:</h4>
                <ul class="features-list">
                    <li><i class="fas fa-star"></i> Round, square, or sheet cakes</li>
                    <li><i class="fas fa-star"></i> Character and themed designs</li>
                    <li><i class="fas fa-star"></i> Photo cakes available</li>
                    <li><i class="fas fa-star"></i> Custom message piping</li>
                    <li><i class="fas fa-star"></i> Candles and cake toppers available</li>
                </ul>
                <h4>Popular Flavors:</h4>
                <div class="flavor-grid">
                    <div class="flavor">Funfetti</div>
                    <div class="flavor">Chocolate Fudge</div>
                    <div class="flavor">Vanilla Bean</div>
                    <div class="flavor">Marble Swirl</div>
                    <div class="flavor">Cookies & Cream</div>
                    <div class="flavor">Ice Cream Cake</div>
                </div>
            </div>
            <div class="product-ordering">
                <div class="order-info">
                    <h3>How to Order</h3>
                    <p>Birthday cakes should be ordered at least 3 days in advance. Custom designs may require additional time.</p>
                    <p class="price">Starting at $45</p>
                    <button class="cta-button">Order a Birthday Cake</button>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Our Products - Pastries
function createProductPastriesContent() {
    const container = document.createElement('div');
    container.className = 'custom-content product-detail-content';
    
    container.innerHTML = `
        <h2 class="section-title">Pastries</h2>
        <div class="product-hero">
            <img src="img/img4.png" alt="Pastries" class="product-hero-img">
        </div>
        <div class="product-details-container">
            <div class="product-info">
                <h3>Artisanal Daily Delights</h3>
                <p>Our pastry selection features freshly baked items made daily in our kitchen. From flaky croissants to delicate Danish pastries, we offer a variety of treats perfect for breakfast, brunch, or an afternoon indulgence.</p>
                <h4>Available Options:</h4>
                <ul class="features-list">
                    <li><i class="fas fa-star"></i> Croissants (plain, chocolate, almond)</li>
                    <li><i class="fas fa-star"></i> Danish pastries (various fruit fillings)</li>
                    <li><i class="fas fa-star"></i> Cinnamon rolls & sticky buns</li>
                    <li><i class="fas fa-star"></i> Scones & muffins</li>
                    <li><i class="fas fa-star"></i> Eclairs & cream puffs</li>
                </ul>
                <div class="availability-note">
                    <i class="fas fa-clock"></i>
                    <p>Our pastry selection varies daily. For the best selection, visit us early or call ahead to reserve specific items.</p>
                </div>
            </div>
            <div class="product-ordering">
                <div class="order-info">
                    <h3>Available Daily</h3>
                    <p>Our pastries are freshly baked each morning. Large orders should be placed 24 hours in advance.</p>
                    <p class="price">$3.25 - $5.50 each</p>
                    <button class="cta-button">Check Today's Selection</button>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Our Products - Cookies
function createProductCookiesContent() {
    const container = document.createElement('div');
    container.className = 'custom-content product-detail-content';
    
    container.innerHTML = `
        <h2 class="section-title">Cookies</h2>
        <div class="product-hero">
            <img src="img/img5.png" alt="Cookies" class="product-hero-img">
        </div>
        <div class="product-details-container">
            <div class="product-info">
                <h3>Sweet, Satisfying Classics</h3>
                <p>Our cookies are made from scratch using premium ingredients for that perfect balance of chewiness and crunch. From classic chocolate chip to elaborately decorated sugar cookies, we have something for every cookie lover.</p>
                <h4>Cookie Types:</h4>
                <ul class="features-list">
                    <li><i class="fas fa-star"></i> Classic drop cookies (chocolate chip, oatmeal raisin)</li>
                    <li><i class="fas fa-star"></i> Decorated sugar cookies (custom shapes and designs)</li>
                    <li><i class="fas fa-star"></i> Sandwich cookies (various fillings)</li>
                    <li><i class="fas fa-star"></i> Thumbprint cookies (assorted jam flavors)</li>
                    <li><i class="fas fa-star"></i> Cookie platters and gift boxes</li>
                </ul>
                <h4>Popular Flavors:</h4>
                <div class="flavor-grid">
                    <div class="flavor">Chocolate Chip</div>
                    <div class="flavor">Snickerdoodle</div>
                    <div class="flavor">Oatmeal Raisin</div>
                    <div class="flavor">Peanut Butter</div>
                    <div class="flavor">Sugar Cookies</div>
                    <div class="flavor">Double Chocolate</div>
                </div>
            </div>
            <div class="product-ordering">
                <div class="order-info">
                    <h3>How to Order</h3>
                    <p>Classic cookies are available daily. Decorated and custom orders require 3-5 days notice.</p>
                    <p class="price">$2.25 each | $24 per dozen</p>
                    <button class="cta-button">Order Cookies</button>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Our Products - Pies
function createProductPiesContent() {
    const container = document.createElement('div');
    container.className = 'custom-content product-detail-content';
    
    container.innerHTML = `
        <h2 class="section-title">Pies</h2>
        <div class="product-hero">
            <img src="img/img6.png" alt="Pies" class="product-hero-img">
        </div>
        <div class="product-details-container">
            <div class="product-info">
                <h3>Homestyle Comfort in Every Slice</h3>
                <p>Our pies feature flaky, buttery crusts and delicious fillings made from seasonal fruits and premium ingredients. Perfect for holidays, special occasions, or just because!</p>
                <h4>Pie Options:</h4>
                <ul class="features-list">
                    <li><i class="fas fa-star"></i> Fruit pies (apple, cherry, blueberry, seasonal)</li>
                    <li><i class="fas fa-star"></i> Cream pies (chocolate, coconut, banana)</li>
                    <li><i class="fas fa-star"></i> Nut pies (pecan, walnut)</li>
                    <li><i class="fas fa-star"></i> Specialty pies (key lime, pumpkin, seasonal)</li>
                    <li><i class="fas fa-star"></i> Available in 6", 9", and 11" sizes</li>
                </ul>
                <div class="seasonal-note">
                    <i class="fas fa-leaf"></i>
                    <p>We use seasonal fruits for the freshest flavors. Check our seasonal specials for limited-time offerings!</p>
                </div>
            </div>
            <div class="product-ordering">
                <div class="order-info">
                    <h3>How to Order</h3>
                    <p>Select pies are available daily. Custom and holiday orders should be placed at least 48 hours in advance.</p>
                    <p class="price">$24 - $38 (depending on size and type)</p>
                    <button class="cta-button">Order a Pie</button>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Contact - Location
function createContactLocationContent() {
    const container = document.createElement('div');
    container.className = 'custom-content contact-location-content';
    
    container.innerHTML = `
        <h2 class="section-title">Visit Our Bakery</h2>
        <div class="location-container">
            <div class="location-details">
                <h3><i class="fas fa-map-marker-alt"></i> Our Address</h3>
                <p class="address">123 Baker Street<br>Sweetville, CA 90210</p>
                
                <h3><i class="far fa-clock"></i> Hours of Operation</h3>
                <ul class="hours-list">
                    <li><span>Monday - Friday:</span> 8:00 AM - 6:00 PM</li>
                    <li><span>Saturday:</span> 9:00 AM - 5:00 PM</li>
                    <li><span>Sunday:</span> Closed</li>
                </ul>
                
                <h3><i class="fas fa-car"></i> Parking Information</h3>
                <p>Free customer parking is available in our lot behind the bakery. Street parking is also available.</p>
                
                <h3><i class="fas fa-bus"></i> Public Transportation</h3>
                <p>We're conveniently located one block from the #42 bus route and a 10-minute walk from the Sweetville Metro Station.</p>
            </div>
            
            <div class="location-map">
                <iframe
                    width="100%"
                    height="100%"
                    frameborder="0"
                    style="border:0"
                    src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=123+Baker+Street,Sweetville+CA"
                    allowfullscreen>
                </iframe>
            </div>
        </div>
        <div class="location-gallery">
            <h3>Our Space</h3>
            <div class="gallery-images">
                <div class="gallery-image">
                    <img src="img/bakery.jpg" alt="Bakery Storefront">
                    <p>Our welcoming storefront</p>
                </div>
                <div class="gallery-image">
                    <img src="img/bakery.jpg" alt="Bakery Interior">
                    <p>Our cozy interior</p>
                </div>
                <div class="gallery-image">
                    <img src="img/bakery.jpg" alt="Bakery Counter">
                    <p>Our display counter</p>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Contact - Phone
function createContactPhoneContent() {
    const container = document.createElement('div');
    container.className = 'custom-content contact-phone-content';
    
    container.innerHTML = `
        <h2 class="section-title">Contact Information</h2>
        <div class="phone-container">
            <div class="contact-methods">
                <div class="contact-method">
                    <div class="contact-icon">
                        <i class="fas fa-phone"></i>
                    </div>
                    <div class="contact-details">
                        <h3>Phone</h3>
                        <p class="contact-value">(555) 123-4567</p>
                        <p class="contact-note">Available during business hours</p>
                    </div>
                </div>
                
                <div class="contact-method">
                    <div class="contact-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="contact-details">
                        <h3>Email</h3>
                        <p class="contact-value">info@cakewalkbakery.com</p>
                        <p class="contact-note">We respond within 24 hours</p>
                    </div>
                </div>
                
                <div class="contact-method">
                    <div class="contact-icon">
                        <i class="fas fa-comment"></i>
                    </div>
                    <div class="contact-details">
                        <h3>Text</h3>
                        <p class="contact-value">(555) 987-6543</p>
                        <p class="contact-note">For quick questions and order status</p>
                    </div>
                </div>
                
                <div class="contact-method">
                    <div class="contact-icon">
                        <i class="fab fa-instagram"></i>
                    </div>
                    <div class="contact-details">
                        <h3>Social Media</h3>
                        <p class="contact-value">@CakeWalkBakery</p>
                        <p class="contact-note">Follow us for updates and specials</p>
                    </div>
                </div>
            </div>
            
            <div class="contact-info-secondary">
                <h3>When to Contact Us</h3>
                <div class="contact-grid">
                    <div class="contact-reason">
                        <h4><i class="fas fa-calendar"></i> Placing Orders</h4>
                        <p>Call or email us at least 48 hours in advance for standard orders. Custom and wedding cakes require additional lead time.</p>
                    </div>
                    <div class="contact-reason">
                        <h4><i class="fas fa-question-circle"></i> Questions</h4>
                        <p>For questions about allergies, ingredients, or custom requests, please call us directly during business hours.</p>
                    </div>
                    <div class="contact-reason">
                        <h4><i class="fas fa-users"></i> Event Catering</h4>
                        <p>For catering inquiries, please email us with event details at least 2 weeks in advance.</p>
                    </div>
                    <div class="contact-reason">
                        <h4><i class="fas fa-comment-dots"></i> Feedback</h4>
                        <p>We value your feedback! Email us anytime with comments or suggestions about your experience.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// Contact - Form
function createContactFormContent() {
    const container = document.createElement('div');
    container.className = 'custom-content contact-form-content';
    
    container.innerHTML = `
        <h2 class="section-title">Send Us a Message</h2>
        <div class="form-container">
            <form id="desktopContactForm" class="contact-form">
                <div class="form-intro">
                    <p>Have a question or ready to place an order? Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>
                
                <div class="form-fields">
                    <div class="form-group">
                        <label for="desktop-name">Name:</label>
                        <input type="text" id="desktop-name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="desktop-email">Email:</label>
                        <input type="email" id="desktop-email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="desktop-phone">Phone:</label>
                        <input type="tel" id="desktop-phone" name="phone">
                    </div>
                    
                    <div class="form-group">
                        <label for="desktop-subject">Subject:</label>
                        <select id="desktop-subject" name="subject">
                            <option value="general">General Inquiry</option>
                            <option value="order">Place an Order</option>
                            <option value="custom">Custom Request</option>
                            <option value="feedback">Feedback</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="desktop-message">Message:</label>
                        <textarea id="desktop-message" name="message" rows="5" required></textarea>
                    </div>
                    
                    <div class="form-group preferences">
                        <label>Contact Preferences:</label>
                        <div class="checkbox-group">
                            <input type="checkbox" id="desktop-contact-email" name="contact-pref" value="email" checked>
                            <label for="desktop-contact-email">Email</label>
                            
                            <input type="checkbox" id="desktop-contact-phone" name="contact-pref" value="phone">
                            <label for="desktop-contact-phone">Phone</label>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="submit-btn">Send Message</button>
            </form>
            
            <div class="form-sidebar">
                <div class="contact-quick-info">
                    <h3>Quick Contact</h3>
                    <p><i class="fas fa-phone"></i> (555) 123-4567</p>
                    <p><i class="fas fa-envelope"></i> info@cakewalkbakery.com</p>
                </div>
                
                <div class="form-note">
                    <h4>Response Time</h4>
                    <p>We typically respond to inquiries within 24 hours during business days.</p>
                </div>
                
                <div class="form-faq">
                    <h4>Frequently Asked Questions</h4>
                    <ul>
                        <li>How far in advance should I order?</li>
                        <li>Do you accommodate dietary restrictions?</li>
                        <li>Do you deliver?</li>
                    </ul>
                    <a href="#" class="faq-link">See all FAQs</a>
                </div>
            </div>
        </div>
    `;
    
    // Add form submission handler
    const form = container.querySelector('#desktopContactForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.';
        form.appendChild(successMessage);
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            successMessage.remove();
        }, 3000);
    });
    
    return container;
}

// About Us - Our Story
function createAboutStoryContent() {
    const container = document.createElement('div');
    container.className = 'custom-content about-story-content';
    
    container.innerHTML = `
        <h2 class="section-title">Our Story</h2>
        <div class="story-container">
            <div class="story-main">
                <div class="story-image">
                    <img src="img/bakery.jpg" alt="Bakery History">
                    <div class="image-caption">Our bakery when we first opened in 2015</div>
                </div>
                <div class="story-text">
                    <h3>From Humble Beginnings</h3>
                    <p>Cake Walk Baking Co. was founded in 2015 by head pastry chef Elizabeth Chen, who dreamed of creating a bakery that combined traditional techniques with innovative flavors. What began as a small passion project in a tiny kitchen has grown into a beloved local institution.</p>
                    <p>Elizabeth's journey started in her grandmother's kitchen, where she learned the secrets of perfect pastry and the joy that comes from sharing homemade treats. After formal training at the Culinary Institute and years working in renowned bakeries across the country, she returned to her hometown to create something special.</p>
                    <p>In the early days, Cake Walk operated as a weekend pop-up, selling out of Elizabeth's signature cakes and pastries within hours. Word spread quickly about the exceptional quality and creative designs, leading to the opening of our permanent location in 2017.</p>
                    <p>Today, Cake Walk Baking Co. has grown to a team of talented bakers and decorators, but we maintain the same commitment to quality, creativity, and customer satisfaction that has been our foundation from day one.</p>
                </div>
            </div>
            
            <div class="story-milestones">
                <h3>Our Journey</h3>
                <div class="timeline">
                    <div class="milestone">
                        <div class="year">2015</div>
                        <div class="achievement">Founded as weekend pop-up bakery</div>
                    </div>
                    <div class="milestone">
                        <div class="year">2017</div>
                        <div class="achievement">Opened permanent location on Baker Street</div>
                    </div>
                    <div class="milestone">
                        <div class="year">2019</div>
                        <div class="achievement">Named "Best Bakery" in Sweetville</div>
                    </div>
                    <div class="milestone">
                        <div class="year">2021</div>
                        <div class="achievement">Expanded kitchen and added catering services</div>
                    </div>
                    <div class="milestone">
                        <div class="year">2023</div>
                        <div class="achievement">Celebrated baking our 10,000th cake</div>
                    </div>
                    <div class="milestone">
                        <div class="year">2025</div>
                        <div class="achievement">Continuing to serve our community with love</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return container;
}

// About Us - Our Team
function createAboutTeamContent() {
    const container = document.createElement('div');
    container.className = 'custom-content about-team-content';
    
    container.innerHTML = `
        <h2 class="section-title">Our Team</h2>
        <div class="team-intro">
            <p>The heart of Cake Walk Baking Co. is our talented team of passionate professionals who bring creativity and expertise to every creation. Meet the people who make the magic happen!</p>
        </div>
        <div class="team-grid">
            <div class="team-member">
                <div class="team-photo">
                    <img src="img/bakery.jpg" alt="Elizabeth Chen">
                </div>
                <div class="team-info">
                    <h3>Elizabeth Chen</h3>
                    <p class="team-title">Founder & Head Pastry Chef</p>
                    <p class="team-bio">With formal training from the Culinary Institute and over 15 years of experience, Elizabeth brings creativity and precision to every recipe. Her specialty is wedding cakes and sugar art.</p>
                </div>
            </div>
            
            <div class="team-member">
                <div class="team-photo">
                    <img src="img/bakery.jpg" alt="Miguel Rodriguez">
                </div>
                <div class="team-info">
                    <h3>Miguel Rodriguez</h3>
                    <p class="team-title">Senior Baker</p>
                    <p class="team-bio">Miguel has been with Cake Walk since 2017 and is the master behind our artisanal bread and pastries. He wakes up at 4am every day to ensure everything is fresh from the oven.</p>
                </div>
            </div>
            
            <div class="team-member">
                <div class="team-photo">
                    <img src="img/bakery.jpg" alt="Priya Patel">
                </div>
                <div class="team-info">
                    <h3>Priya Patel</h3>
                    <p class="team-title">Cake Designer</p>
                    <p class="team-bio">With a background in fine arts, Priya brings an artist's eye to our custom cake designs. Her intricate sugar flowers and hand-painted details are truly works of art.</p>
                </div>
            </div>
            
            <div class="team-member">
                <div class="team-photo">
                    <img src="img/bakery.jpg" alt="James Thompson">
                </div>
                <div class="team-info">
                    <h3>James Thompson</h3>
                    <p class="team-title">Customer Experience Manager</p>
                    <p class="team-bio">James ensures that every customer interaction is as delightful as our baked goods. He coordinates orders, consultations, and makes sure your experience is perfect.</p>
                </div>
            </div>
            
            <div class="team-member">
                <div class="team-photo">
                    <img src="img/bakery.jpg" alt="Sarah Johnson">
                </div>
                <div class="team-info">
                    <h3>Sarah Johnson</h3>
                    <p class="team-title">Pastry Chef</p>
                    <p class="team-bio">Specializing in French pastry techniques, Sarah creates our delicate croissants, éclairs, and other European-inspired treats with precision and flair.</p>
                </div>
            </div>
            
            <div class="team-member">
                <div class="team-photo">
                    <img src="img/bakery.jpg" alt="David Kim">
                </div>
                <div class="team-info">
                    <h3>David Kim</h3>
                    <p class="team-title">Cookie Specialist</p>
                    <p class="team-bio">David is the creative force behind our decorated cookies and innovative flavor combinations. His holiday cookie collections are customer favorites year after year.</p>
                </div>
            </div>
        </div>
        <div class="join-team">
            <h3>Join Our Team</h3>
            <p>Passionate about baking? We're always looking for talented individuals to join the Cake Walk family. Check our careers page for current openings.</p>
            <button class="cta-button">View Open Positions</button>
        </div>
    `;
    
    return container;
}

// About Us - Policies
function createAboutPoliciesContent() {
    const container = document.createElement('div');
    container.className = 'custom-content about-policies-content';
    
    container.innerHTML = `
        <h2 class="section-title">Our Policies</h2>
        <div class="policies-container">
            <div class="policies-intro">
                <p>At Cake Walk Baking Co., we strive to provide the best experience for our customers. Please review our policies to ensure a smooth ordering and delivery process.</p>
            </div>
            
            <div class="policy-section">
                <h3><i class="fas fa-calendar-alt"></i> Ordering & Advance Notice</h3>
                <ul class="policy-list">
                    <li><strong>Standard Items:</strong> 48 hours advance notice required</li>
                    <li><strong>Custom Cakes:</strong> 7-10 days advance notice</li>
                    <li><strong>Wedding Cakes:</strong> Minimum 3 months advance booking</li>
                    <li><strong>Large Orders:</strong> 7 days advance notice for orders serving 50+ people</li>
                    <li><strong>Holiday Orders:</strong> Special deadlines apply for major holidays - please inquire early</li>
                </ul>
            </div>
            
            <div class="policy-section">
                <h3><i class="fas fa-truck"></i> Delivery & Pickup</h3>
                <ul class="policy-list">
                    <li><strong>Store Pickup:</strong> Available during regular business hours</li>
                    <li><strong>Delivery:</strong> Available within a 25-mile radius for orders over $100</li>
                    <li><strong>Delivery Fee:</strong> Starting at $25, varies by distance</li>
                    <li><strong>Wedding Delivery:</strong> Special handling fees apply for wedding cakes</li>
                    <li><strong>Timing:</strong> Delivery window is typically 2 hours</li>
                </ul>
            </div>
            
            <div class="policy-section">
                <h3><i class="fas fa-credit-card"></i> Payment & Deposits</h3>
                <ul class="policy-list">
                    <li><strong>Standard Orders:</strong> Full payment due at time of order</li>
                    <li><strong>Custom Orders:</strong> 50% deposit required to secure your order</li>
                    <li><strong>Wedding Cakes:</strong> $100 non-refundable deposit, with 50% due 1 month before event</li>
                    <li><strong>Payment Methods:</strong> Cash, credit card, or bank transfer</li>
                    <li><strong>Invoicing:</strong> Available for corporate clients with approved accounts</li>
                </ul>
            </div>
            
            <div class="policy-section">
                <h3><i class="fas fa-exchange-alt"></i> Cancellations & Changes</h3>
                <ul class="policy-list">
                    <li><strong>Standard Orders:</strong> 48 hours notice for full refund</li>
                    <li><strong>Custom Orders:</strong> 5 days notice for partial refund (deposit non-refundable)</li>
                    <li><strong>Wedding Orders:</strong> 30 days notice for partial refund</li>
                    <li><strong>Order Changes:</strong> Subject to availability and timing</li>
                    <li><strong>Emergency Situations:</strong> Evaluated on a case-by-case basis</li>
                </ul>
            </div>
            
            <div class="policy-section">
                <h3><i class="fas fa-leaf"></i> Allergies & Dietary Restrictions</h3>
                <ul class="policy-list">
                    <li><strong>Allergen Information:</strong> Available for all products upon request</li>
                    <li><strong>Gluten-Free:</strong> Select items available (prepared in a facility that uses wheat)</li>
                    <li><strong>Vegan Options:</strong> Available with advance notice</li>
                    <li><strong>Nut-Free:</strong> We cannot guarantee a completely nut-free environment</li>
                    <li><strong>Special Diets:</strong> Please discuss your needs when ordering</li>
                </ul>
            </div>
            
            <div class="policy-contact">
                <p>Have questions about our policies? Please <a href="#">contact us</a> and we'll be happy to help!</p>
            </div>
        </div>
    `;
    
    return container;
}
/**
 * Add the 3D carousel modal CSS to the document
 */
function addCarouselModalCSS() {
    if (!document.querySelector('link[href="css/desktop/3d-carousel-modal.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/desktop/3d-carousel-modal.css';
        document.head.appendChild(link);
    }
}