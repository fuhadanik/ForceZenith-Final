// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, setDoc, getDoc, deleteDoc, getDocs };
