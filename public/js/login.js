import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration from server
const firebaseConfig = {
    apiKey: "AIzaSyAq7W99zPt86yrMlXf9lHc2ZsJ7iJDtVCc",
    authDomain: "uninav-a8bec.firebaseapp.com",
    projectId: "uninav-a8bec",
    storageBucket: "uninav-a8bec.firebasestorage.app",
    messagingSenderId: "745452549104",
    appId: "1:745452549104:web:ad0a5728d730135f7f6335",
    measurementId: "G-7S2QGFWFK4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInBtn = document.getElementById('googleSignInBtn');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

signInBtn.addEventListener('click', async () => {
    try {
        // Show loading state
        signInBtn.disabled = true;
        loading.classList.add('show');
        errorMessage.classList.remove('show');

        // Sign in with Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Get the ID token
        const idToken = await user.getIdToken();

        // Send token to backend
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
            credentials: 'include' // Important: include cookies
        });

        const data = await response.json().catch(() => ({ error: 'Failed to parse response' }));

        if (response.ok) {
            // Redirect to AI page
            window.location.href = '/ai';
        } else {
            const errorMsg = data.error || `Failed to create session (${response.status})`;
            throw new Error(errorMsg);
        }
        } catch (error) {
        console.error('Sign-in error:', error);
        errorMessage.textContent = error.message || 'Failed to sign in. Please try again.';
        errorMessage.classList.add('show');
        signInBtn.disabled = false;
        loading.classList.remove('show');
        }
});

// Handle logout parameter - sign out from Firebase if redirected from logout
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('logout') === 'true') {
    // User was redirected here after logout, sign out from Firebase
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                await signOut(auth);
            } catch (error) {
                console.error('Error signing out from Firebase:', error);
            }
        }
    });
    // Clean up URL
    window.history.replaceState({}, document.title, '/login');
}

// Check if user is already signed in, but only auto-login if server session is valid
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Skip auto-login if we're handling a logout
        if (urlParams.get('logout') === 'true') {
            return;
        }
        
        // First check if there's a valid server session
        try {
            const statusResponse = await fetch('/auth/status', {
                method: 'GET',
                credentials: 'include'
            });
            
            const statusData = await statusResponse.json();
            
            // Only auto-login if server session is valid
            if (statusData.authenticated) {
                // Server session is valid, redirect to AI page
                window.location.href = '/ai';
                return;
            }
            
            // Server session is invalid, but Firebase user exists
            // This means user was logged out but Firebase session persists
            // Sign out from Firebase to clear the state
            const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await signOut(auth);
        } catch (error) {
            console.error('Error checking server session:', error);
            // On error, sign out from Firebase to be safe
            try {
                const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
                await signOut(auth);
            } catch (signOutError) {
                console.error('Error signing out from Firebase:', signOutError);
            }
        }
    }
});