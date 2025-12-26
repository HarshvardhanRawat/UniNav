// Authentication State Management

class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.loginBtn = document.getElementById('loginBtn');
        this.userIconBtn = document.getElementById('userIconBtn');
        
        this.init();
    }

    /**
     * Initialize the authentication manager
     */
    async init() {
        // Check authentication status on page load
        await this.checkAuthStatus();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    /**
     * Check authentication status from the server
     */
    async checkAuthStatus() {
        try {
            const response = await fetch('/auth/status', {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.authenticated) {
                this.isAuthenticated = true;
                this.user = data.user;
                this.updateUI('authenticated');
            } else {
                this.isAuthenticated = false;
                this.user = null;
                this.updateUI('unauthenticated');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            // Default to unauthenticated state on error
            this.isAuthenticated = false;
            this.user = null;
            this.updateUI('unauthenticated');
        }
    }

    /**
     * Update the UI based on authentication state
     * @param {string} state - 'authenticated' or 'unauthenticated'
     */
    updateUI(state) {
        if (state === 'authenticated') {
            // Hide login button, show user icon
            if (this.loginBtn) {
                this.loginBtn.style.display = 'none';
            }
            if (this.userIconBtn) {
                this.userIconBtn.style.display = 'block';
            }
        } else {
            // Show login button, hide user icon
            if (this.loginBtn) {
                this.loginBtn.style.display = 'block';
            }
            if (this.userIconBtn) {
                this.userIconBtn.style.display = 'none';
            }
        }
    }

    /**
     * Set up event listeners for login and logout
     */
    setupEventListeners() {
        // Login button click handler
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => {
                this.handleLogin();
            });
        }

        // User icon click handler
        if (this.userIconBtn) {
            this.userIconBtn.addEventListener('click', () => {
                this.handleLogoutClick();
            });
        }
    }

    /**
     * Handle login button click - redirect to login page
     */
    handleLogin() {
        window.location.href = '/login';
    }

    /**
     * Handle user icon click - show logout confirmation dialog
     */
    handleLogoutClick() {
        // Show confirmation dialog
        const confirmed = confirm('Do you want to log out?');
        
        if (confirmed) {
            this.handleLogout();
        }
    }

    /**
     * Handle logout - call logout endpoint and clear all auth state
     */
    async handleLogout() {
        try {
            // Clear server session
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update local state
                this.isAuthenticated = false;
                this.user = null;
                
                // Update UI
                this.updateUI('unauthenticated');
                
                // Redirect to login page to ensure Firebase auth is cleared
                // The login page will handle Firebase sign out if needed
                window.location.href = '/login?logout=true';
            } else {
                throw new Error(data.error || 'Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Failed to log out. Please try again.');
        }
    }

    /**
     * Get current authentication state
     * @returns {boolean} True if authenticated, false otherwise
     */
    getAuthState() {
        return this.isAuthenticated;
    }

    /**
     * Get current user information
     * @returns {object|null} User object or null
     */
    getUser() {
        return this.user;
    }
}

// Initialize auth manager when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.authManager = new AuthManager();
    });
} else {
    // DOM already loaded
    window.authManager = new AuthManager();
}

