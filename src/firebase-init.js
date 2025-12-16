// Firebase initialization promise - will be resolved when Firebase is ready
window.firebaseReady = (async function initializeFirebase() {
    try {
        // Fetch config from backend endpoint
        const response = await fetch('/config/firebase');
        if (!response.ok) {
            throw new Error('Failed to fetch Firebase configuration');
        }
        
        const firebaseConfig = await response.json();
        
        // Validate that we have the required config
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
            throw new Error('Invalid Firebase configuration received');
        }
        
        // Initialize Firebase (Compat)
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();
            window.db = db; // Expose to global scope
            console.log("Firebase initialized successfully");
            return true;
        } else {
            throw new Error("Firebase SDK not loaded!");
        }
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        alert("Failed to initialize Firebase. Please refresh the page.");
        throw error;
    }
})();

