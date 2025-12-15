if (getCookie("login")) window.location = "./home.html";

// DOM Elements
const loginForm = document.getElementById("loginform");
const authSection = document.getElementById("authSection");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const authStatus = document.getElementById("authStatus");

// Check for existing session
const savedEmail = localStorage.getItem('firebase_user_email');
if (savedEmail) {
    showLoginForm();
}

document.getElementById("login").onclick = () => {
    const formEl = document.forms.loginform;
    const formData = new FormData(formEl);
    login(formData)
}

// Google Login Logic
googleLoginBtn.onclick = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        authStatus.innerText = "Signing in...";
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        const email = user.email.toLowerCase();

        // 1. Domain Check
        if (!email.endsWith('@micronetbd.org')) {
            authStatus.innerText = "Access Denied: Only @micronetbd.org emails are allowed.";
            authStatus.className = "text-sm text-red-600";
            await firebase.auth().signOut();
            return;
        }

        // 2. Check Allowed List
        authStatus.innerText = "Verifying access...";
        const db = window.db;
        const docRef = db.collection("allowed_users").doc(email);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            // Success!
            localStorage.setItem('firebase_user_email', email);
            showLoginForm();
        } else {
            // Not allowed -> Add to pending
            await db.collection("pending_users").doc(email).set({
                email: email,
                requestedAt: new Date().toISOString(),
                status: "pending",
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL
            });
            
            authStatus.innerText = "Access Request Sent! Please wait for admin approval.";
            authStatus.className = "text-sm text-orange-600";
            await firebase.auth().signOut();
        }

    } catch (error) {
        console.error("Auth Error:", error);
        authStatus.innerText = "Error: " + error.message;
        authStatus.className = "text-sm text-red-600";
    }
}

function showLoginForm() {
    authSection.classList.add('hidden');
    loginForm.classList.remove('hidden');
}