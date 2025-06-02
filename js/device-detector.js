/**
 * Device Detector for Cake Walk Baking Co. website
 * Determines if the user is on a mobile or desktop device
 * and loads the appropriate stylesheets
 */
(function() {
    // Configuration
    const mobileCssFiles = ['style.css', 'animations.css', '3d-carousel.css', 'modal.css'];
    const desktopCssFiles = ['style.css', 'animations.css', '3d-carousel.css', 'modal.css', 'accordion-nav.css'];
    const breakpoint = 768; // Width threshold between mobile and desktop
    const storageKey = 'cakeWalkDeviceType';
    const cacheDuration = 1000 * 60 * 60; // 1 hour cache for device type
    
    /**
     * Check if device type is stored in sessionStorage and still valid
     * @returns {string|null} - 'mobile', 'desktop' or null if not stored/expired
     */
    function getStoredDeviceType() {
        try {
            const deviceData = JSON.parse(sessionStorage.getItem(storageKey));
            if (deviceData && Date.now() - deviceData.timestamp < cacheDuration) {
                return deviceData.type;
            }
        } catch (e) {
            console.log('Error retrieving stored device type:', e);
        }
        return null;
    }
    
    /**
     * Store the device type in sessionStorage with timestamp
     * @param {string} deviceType - 'mobile' or 'desktop'
     */
    function storeDeviceType(deviceType) {
        try {
            const deviceData = {
                type: deviceType,
                timestamp: Date.now()
            };
            sessionStorage.setItem(storageKey, JSON.stringify(deviceData));
        } catch (e) {
            console.log('Error storing device type:', e);
        }
    }
    
    /**
     * Detect if user is on a mobile device
     * @returns {boolean} - true if mobile, false if desktop
     */
    function isMobile() {
        // First check cache to avoid recalculating on page refresh
        const storedType = getStoredDeviceType();
        if (storedType) {
            return storedType === 'mobile';
        }
        
        // Check screen width
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        
        // Check for touch capability as a secondary signal
        const hasTouchCapability = 'ontouchstart' in window || 
                                 navigator.maxTouchPoints > 0 || 
                                 navigator.msMaxTouchPoints > 0;

        // Also check for mobile user agent as a tertiary signal
        const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Primary decision based on screen width with additional signals for confidence
        let isMobileDevice = screenWidth < breakpoint;
        
        // If touch capability and user agent agree but contradict screen width, use their consensus
        if (hasTouchCapability === mobileUserAgent && hasTouchCapability !== isMobileDevice) {
            isMobileDevice = hasTouchCapability;
            console.log("Device signals contradicted screen width, using touch capability");
        }
        
        // Store the detection result to avoid recalculating
        storeDeviceType(isMobileDevice ? 'mobile' : 'desktop');
        
        return isMobileDevice;
    }
    
    /**
     * Preload stylesheets to prevent flicker
     * @param {string} deviceType - 'mobile' or 'desktop'
     * @param {Array} cssFiles - Array of CSS files to preload
     * @returns {Promise<void>} - Resolves when all stylesheets are loaded
     */
    function preloadStylesheets(deviceType, cssFiles) {
        return Promise.all(cssFiles.map(file => {
            return new Promise((resolve) => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = `css/${deviceType}/${file}`;
                link.as = 'style';
                link.onload = resolve;
                document.head.appendChild(link);
            });
        }));
    }
    
    /**
     * Load proper JavaScript files based on device type
     */
    function loadDeviceScripts(deviceType) {
        if (deviceType === 'desktop') {
            // Ensure desktop-panel.js is loaded
            if (!document.querySelector('script[src="js/desktop-panel.js"]')) {
                const script = document.createElement('script');
                script.src = 'js/desktop-panel.js';
                script.defer = true;
                document.head.appendChild(script);
            }
        }
    }
    
    /**
     * Load stylesheets for the appropriate device type
     */
    async function loadStylesheets() {
        const deviceType = isMobile() ? 'mobile' : 'desktop';
        const cssFiles = deviceType === 'mobile' ? mobileCssFiles : desktopCssFiles;
        console.log(`Loading ${deviceType} stylesheets`);
        
        // First load common styles
        const commonLink = document.createElement('link');
        commonLink.rel = 'stylesheet';
        commonLink.href = 'css/common.css';
        document.head.appendChild(commonLink);
        
        // Preload device-specific styles to prevent flicker
        await preloadStylesheets(deviceType, cssFiles);
        
        // Now apply them
        cssFiles.forEach(file => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `css/${deviceType}/${file}`;
            link.classList.add('device-specific-css');
            document.head.appendChild(link);
        });
        
        // Add a data attribute to the HTML element for potential JS usage
        document.documentElement.setAttribute('data-device', deviceType);
        document.documentElement.classList.add(deviceType);
        
        // Load device-specific scripts
        loadDeviceScripts(deviceType);
    }
    
    /**
     * Handle window resize events to potentially switch stylesheets
     */
    function handleResize() {
        const currentDeviceType = document.documentElement.getAttribute('data-device') || '';
        const newDeviceType = isMobile() ? 'mobile' : 'desktop';
        
        // Only reload if device type has changed
        if (currentDeviceType !== newDeviceType) {
            console.log(`Device type changed: ${currentDeviceType} -> ${newDeviceType}`);
            
            // Remove existing device-specific stylesheets
            const existingLinks = document.querySelectorAll('.device-specific-css');
            existingLinks.forEach(link => link.remove());
            
            // Update stored type
            storeDeviceType(newDeviceType);
            
            // Update HTML classes
            document.documentElement.classList.remove(currentDeviceType);
            document.documentElement.classList.add(newDeviceType);
            document.documentElement.setAttribute('data-device', newDeviceType);
            
            // Load new stylesheets
            const cssFiles = newDeviceType === 'mobile' ? mobileCssFiles : desktopCssFiles;
            cssFiles.forEach(file => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `css/${newDeviceType}/${file}`;
                link.classList.add('device-specific-css');
                document.head.appendChild(link);
            });
            
            // Load device-specific scripts
            loadDeviceScripts(newDeviceType);
            
            // Reload the page to ensure proper initialization
            if (currentDeviceType !== '') {
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        }
    }
    
    // Initial stylesheet loading
    loadStylesheets();
    
    // Setup resize handler with debounce for performance
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Also handle orientation changes explicitly for mobile devices
    window.addEventListener('orientationchange', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
})();