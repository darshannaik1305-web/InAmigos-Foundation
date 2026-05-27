/* ==========================================================================
   INTERACTIVE JS FUNCTIONS - INAMIGOS FOUNDATION
   Includes: Mobile Menu, Sticky Navbar, Scroll Reveal, Dynamic Stats Counter,
             and Gallery Lightbox.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. MOBILE MENU TOGGLE
       ---------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbarMenu = document.getElementById('navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu state on button click
    if (mobileMenuBtn && navbarMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navbarMenu.classList.contains('open');
            
            // Toggle classes
            navbarMenu.classList.toggle('open');
            mobileMenuBtn.classList.toggle('open');
            
            // Update ARIA attributes for accessibility
            mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
        });
    }

    // Close menu when clicking a nav link (mobile utility)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu && navbarMenu.classList.contains('open')) {
                navbarMenu.classList.remove('open');
                mobileMenuBtn.classList.remove('open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });


    /* ----------------------------------------------------------------------
       2. STICKY NAVBAR ON SCROLL
       ---------------------------------------------------------------------- */
    const mainNavbar = document.getElementById('main-navbar');

    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            mainNavbar.classList.add('sticky');
        } else {
            mainNavbar.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll);
    // Initial run in case the page is loaded halfway down
    handleNavbarScroll();


    /* ----------------------------------------------------------------------
       3. NAVIGATION ACTIVE LINK ACCORDING TO VIEWPORT SECTION
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // Viewport
        rootMargin: '-20% 0px -60% 0px', // Target middle of screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    // Match link href with current active section id
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));


    /* ----------------------------------------------------------------------
       4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ---------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element enters viewport
        threshold: 0.1 // 10% of element needs to be visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing after anim triggers once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));


    /* ----------------------------------------------------------------------
       5. DYNAMIC IMPACT NUMBERS (COUNT-UP ANIMATION)
       ---------------------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.impact-number');
    let hasCounted = false; // Flag to ensure animation runs only once

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const suffix = element.hasAttribute('data-suffix') ? element.getAttribute('data-suffix') : '+';
        const duration = 2000; // Total count animation duration in ms
        const stepTime = Math.max(Math.floor(duration / target), 15); // Adjust stepping
        let current = 0;
        
        // Calculate steps for larger numbers to run smoothly in 2 seconds
        const increment = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                element.textContent = current.toLocaleString() + suffix;
            }
        }, stepTime);
    };

    const statsSection = document.getElementById('impact');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    statNumbers.forEach(num => countUp(num));
                    hasCounted = true;
                    observer.unobserve(entry.target); // Stop observing
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }


    /* ----------------------------------------------------------------------
       6. GALLERY LIGHTBOX MODAL
       ---------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-description');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const titleText = item.querySelector('h4').textContent;
                const captionText = item.getAttribute('data-caption') || '';

                if (img) {
                    // Update content
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxTitle.textContent = titleText;
                    lightboxDesc.textContent = captionText;

                    // Open modal
                    lightbox.classList.add('open');
                    document.body.style.overflow = 'hidden'; // Lock background scrolling
                }
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = ''; // Unlock background scrolling
            // Clear content after animation
            setTimeout(() => {
                lightboxImg.src = '';
                lightboxImg.alt = '';
            }, 300);
        };

        // Close on X button click
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Close on clicking backdrop
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }

});
