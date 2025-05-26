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

// Product card hover effect (preserved for possible use elsewhere)
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

// Swiper initialization for product carousel
document.addEventListener("DOMContentLoaded", function() {
    // Only init swiper if the element exists
    if (document.querySelector(".swiper.product-swiper")) {
        const swiper = new Swiper(".swiper.product-swiper", {
            slidesPerView: 5,
            spaceBetween: 0,
            centeredSlides: true,
            loop: true,
            simulateTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                1200: { slidesPerView: 5 },
                900:  { slidesPerView: 3 },
                600:  { slidesPerView: 1 }
            }
        });

        // Dynamically set slide heights to maintain aspect ratio
        const calculateHeight = () => {
            const swiperSlideElements = Array.from(document.querySelectorAll('.swiper.product-swiper .swiper-slide'))
            if (!swiperSlideElements.length) return
            const width = swiperSlideElements[0].getBoundingClientRect().width
            // 3:4 aspect ratio
            const height = Math.round(width / (3 / 4))
            swiperSlideElements.map(element => element.style.height = `${height}px`)
        };
        calculateHeight();
        window.addEventListener('resize', calculateHeight);
    }
});

// Modal functionality for product images and in-depth product info
function setupModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.getElementsByClassName('close')[0];
    // Now select product cards inside swiper
    const productCards = document.querySelectorAll('.swiper.product-swiper .product-card');

    // Product details map (updated images to match your imgX.png)
    const productDetails = {
        "Wedding Cakes": {
            img: "img/img1.png",
            alt: "Wedding Cake",
            title: "Wedding Cakes",
            short: "Custom-designed wedding cakes for your special day",
            long: "Our wedding cakes are crafted to be the centerpiece of your celebration. Choose from classic or modern designs, a wide variety of flavors, and elegant decorations such as sugar flowers and hand-piped details. Every cake is unique and tailored to your theme, size, and taste, ensuring your day is memorable and sweet."
        },
        "Cupcakes": {
            img: "img/img2.png",
            alt: "Cupcakes",
            title: "Cupcakes",
            short: "Variety of flavors and decorative designs",
            long: "Our cupcakes are perfect for any gathering, available in a wide range of flavors like classic chocolate, vanilla, red velvet, lemon, and more. Each cupcake is topped with our signature buttercream or cream cheese frosting and can be decorated to match your event’s colors and theme."
        },
        "Birthday Cakes": {
            img: "img/img3.png",
            alt: "Birthday Cake",
            title: "Birthday Cakes",
            short: "Personalized cakes for all ages",
            long: "Celebrate with a personalized birthday cake! We offer cakes for all ages, from playful designs for children to sophisticated cakes for adults. Select your favorite flavors, fillings, and decorations, and let us add a custom message and theme to make each birthday extra special."
        },
        "Pastries": {
            img: "img/img4.png",
            alt: "Pastries",
            title: "Pastries",
            short: "Fresh-baked daily pastries and treats",
            long: "Enjoy our selection of fresh-baked pastries, including croissants, danishes, turnovers, and more. Made with the finest ingredients, our pastries are perfect for breakfast, brunch, or a delightful snack any time of day. Try our seasonal flavors and classic favorites!"
        },
        "Cookies": {
            img: "img/img5.png",
            alt: "Cookies",
            title: "Cookies",
            short: "Classic and custom-designed cookies",
            long: "From classic chocolate chip to custom-designed iced sugar cookies, our cookies are baked fresh daily. We offer custom shapes, colors, and designs for holidays, parties, or corporate gifts. Each batch is made with care for great taste and perfect presentation."
        },
        "Special Occasions": {
            img: "img/img6.png",
            alt: "Special Occasions",
            title: "Special Occasions",
            short: "Custom desserts for any celebration",
            long: "From baby showers and anniversaries to graduations and retirements, we create custom treats for every milestone. Choose from cakes, cupcakes, pastries, and cookies, all tailored to your occasion’s theme. Let us make your celebration even sweeter with our creative desserts."
        }
    };

    productCards.forEach(card => {
        card.onclick = function(e) {
            e.stopPropagation();
            let productName = card.getAttribute('data-product');
            const info = productDetails[productName];
            if (info) {
                modalImg.src = info.img;
                modalImg.alt = info.alt;
                modalCaption.innerHTML = `
                    <h2 style="margin-bottom:0.5em">${info.title}</h2>
                    <p style="font-style:italic;margin-bottom:0.8em">${info.short}</p>
                    <div style="font-size:1rem;line-height:1.6;color:#222">${info.long}</div>
                `;
            } else {
                const img = card.querySelector("img");
                modalImg.src = img ? img.src : "";
                modalImg.alt = img ? img.alt : "";
                modalCaption.innerHTML = card.innerHTML;
            }
            modal.style.display = "block";
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

// Enhanced smooth scrolling with snap effect and animated logo
function setupScrolling() {
    const snapContainer = document.querySelector('.snap-container');
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    let lastScrollTop = 0;
    const scrollThreshold = 50; // Amount of scroll before animation triggers

    function smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Wheel event handler
    let isScrolling = false;
    let lastScrollTime = 0;
    const scrollCooldown = 1000;

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
                isScrolling = true;
                smoothScrollTo(sections[targetIndex]);
                setTimeout(() => {
                    isScrolling = false;
                }, scrollCooldown);
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
                isScrolling = true;
                smoothScrollTo(sections[targetIndex]);
                setTimeout(() => {
                    isScrolling = false;
                }, scrollCooldown);
            }
            touchStartY = touchCurrentY;
        }
    }, { passive: false });

    // Update scroll progress, logo, and header on scroll
    snapContainer.addEventListener('scroll', debounce(() => {
        const scrollTop = snapContainer.scrollTop;

        // Logo shrink/expand logic
        if (scrollTop > scrollThreshold && !header.classList.contains('shrink')) {
            header.classList.add('shrink');
            logo.classList.add('shrink');
        } else if (scrollTop <= scrollThreshold && header.classList.contains('shrink')) {
            header.classList.remove('shrink');
            logo.classList.remove('shrink');
        }

        // Update scroll progress
        const winScroll = snapContainer.scrollTop;
        const height = snapContainer.scrollHeight - snapContainer.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
        
        handleParallax();
        handleSectionVisibility();
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
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
// Dot navigation logic for snap sections
document.addEventListener("DOMContentLoaded", function () {
    // Dot navigation
    const dotBtns = document.querySelectorAll(".dot-nav-btn");
    const snapSections = document.querySelectorAll(".snap-section");
    const snapContainer = document.querySelector(".snap-container");

    function setActiveDotByIndex(index) {
        dotBtns.forEach((btn, i) => {
            btn.classList.toggle("active", i === index);
        });
    }

    // Scroll to section on dot click
    dotBtns.forEach((btn, i) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSelector = btn.getAttribute("data-target");
            const targetSection = document.querySelector(targetSelector);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveDotByIndex(i);
            }
        });
    });

    // Track scroll position to update dot nav
    function updateDotNavOnScroll() {
        let found = false;
        snapSections.forEach((section, i) => {
            const rect = section.getBoundingClientRect();
            // The section is considered "active" if its top is at or above 1/3 viewport and its bottom is at least 1/3 into viewport
            if (!found && rect.top <= window.innerHeight / 3 && rect.bottom >= window.innerHeight / 3) {
                setActiveDotByIndex(i);
                found = true;
            }
        });
    }

    snapContainer.addEventListener("scroll", updateDotNavOnScroll);
    window.addEventListener("resize", updateDotNavOnScroll);
    updateDotNavOnScroll();

    // Optionally, allow keyboard navigation with arrow keys
    snapContainer.addEventListener("keydown", function (e) {
        const activeIndex = Array.from(dotBtns).findIndex(btn => btn.classList.contains("active"));
        if (e.key === "ArrowDown" || e.key === "PageDown") {
            if (activeIndex < snapSections.length - 1) {
                snapSections[activeIndex + 1].scrollIntoView({ behavior: "smooth", block: "start" });
                dotBtns[activeIndex + 1].focus();
            }
            e.preventDefault();
        }
        if (e.key === "ArrowUp" || e.key === "PageUp") {
            if (activeIndex > 0) {
                snapSections[activeIndex - 1].scrollIntoView({ behavior: "smooth", block: "start" });
                dotBtns[activeIndex - 1].focus();
            }
            e.preventDefault();
        }
    });

    // Make snap sections focusable for accessibility
    snapSections.forEach(section => {
        section.setAttribute("tabindex", "0");
    });
});