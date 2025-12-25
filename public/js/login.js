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

// Check if user is already signed in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is already signed in, get token and verify session
        user.getIdToken().then(async (idToken) => {
            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idToken }),
                    credentials: 'include'
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    window.location.href = '/ai';
                } else {
                    console.error('Session verification failed:', data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Session verification error:', error);
            }
        });
    }
});