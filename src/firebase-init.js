// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPs2SYjx5H5atfhm02yjD4l8hoG6D1pog",
  authDomain: "forcezenith-gatekeeper.firebaseapp.com",
  projectId: "forcezenith-gatekeeper",
  storageBucket: "forcezenith-gatekeeper.firebasestorage.app",
  messagingSenderId: "84008347400",
  appId: "1:84008347400:web:0a87b4da84ca2fb83e2ebd",
  measurementId: "G-FZ67T8NM0J"
};

// Initialize Firebase (Compat)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    window.db = db; // Expose to global scope
    console.log("Firebase initialized successfully");
} else {
    console.error("Firebase SDK not loaded!");
}
