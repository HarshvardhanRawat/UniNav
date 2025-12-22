/**
 * ============================================================================
 * CAMPUS NAVIGATION APP - UI INTERACTIONS
 * ============================================================================
 * Handles mobile menu toggle, smooth scrolling, and other UI interactions.
 * ============================================================================
 */

(function() {
    'use strict';

    /**
     * Mobile Menu Controller
     * Manages the hamburger menu toggle and slide-out navigation panel
     */
    const MobileMenuController = {
        // DOM element references
        menuToggle: null,
        navLinks: null,
        navLinkItems: null,
        overlay: null,
        
        // Configuration
        MOBILE_BREAKPOINT: 768,
        
        /**
         * Initialize the mobile menu functionality
         */
        init: function() {
            this.menuToggle = document.querySelector('.mobile-menu-toggle');
            this.navLinks = document.querySelector('.nav-links');
            this.navLinkItems = document.querySelectorAll('.nav-link');
            
            if (!this.menuToggle || !this.navLinks) {
                return; // Exit if elements don't exist
            }
            
            this.attachEventListeners();
        },
        
        /**
         * Create and configure the overlay element for mobile menu
         * @returns {HTMLElement} The overlay element
         */
        createOverlay: function() {
            if (!this.overlay) {
                this.overlay = document.createElement('div');
                this.overlay.className = 'menu-overlay';
                this.overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.6);
                    z-index: 998;
                    display: none;
                `;
                document.body.appendChild(this.overlay);
                
                // Close menu when overlay is clicked
                this.overlay.addEventListener('click', () => {
                    this.closeMenu();
                });
            }
            return this.overlay;
        },
        
        /**
         * Open the mobile menu
         */
        openMenu: function() {
            this.menuToggle.classList.add('active');
            this.navLinks.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
            
            const overlay = this.createOverlay();
            overlay.style.display = 'block';
        },
        
        /**
         * Close the mobile menu
         */
        closeMenu: function() {
            this.menuToggle.classList.remove('active');
            this.navLinks.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scroll
            
            if (this.overlay) {
                this.overlay.style.display = 'none';
            }
        },
        
        /**
         * Attach all event listeners for mobile menu
         */
        attachEventListeners: function() {
            const self = this;
            
            // Toggle menu on hamburger click
            this.menuToggle.addEventListener('click', function(event) {
                event.stopPropagation();
                if (self.navLinks.classList.contains('active')) {
                    self.closeMenu();
                } else {
                    self.openMenu();
                }
            });
            
            // Close menu when clicking on navigation links
            this.navLinkItems.forEach(function(link) {
                link.addEventListener('click', function() {
                    self.closeMenu();
                });
            });
            
            // Close menu when window is resized to desktop size
            window.addEventListener('resize', function() {
                if (window.innerWidth > self.MOBILE_BREAKPOINT && 
                    self.navLinks.classList.contains('active')) {
                    self.closeMenu();
                }
            });
        }
    };
    
    /**
     * Smooth Scrolling Controller
     * Handles smooth scrolling for anchor links
     */
    const SmoothScrollController = {
        /**
         * Initialize smooth scrolling for all anchor links
         */
        init: function() {
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            const navbarOffset = 80; // Account for navbar height
            
            anchorLinks.forEach(function(anchor) {
                anchor.addEventListener('click', function(event) {
                    const href = this.getAttribute('href');
                    
                    // Skip empty or invalid hrefs
                    if (href === '#' || href === '') {
                        return;
                    }
                    
                    event.preventDefault();
                    const targetElement = document.querySelector(href);
                    
                    if (targetElement) {
                        const targetPosition = targetElement.offsetTop - navbarOffset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };
    
    /**
     * Initialize all UI controllers when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        MobileMenuController.init();
        SmoothScrollController.init();
    });
    
})();
