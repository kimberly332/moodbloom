// Check your src/firebase/config.js file and make sure it looks like this:
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA_YYbhe13oShqlgeFwH_3hQiYVVBMuxIw",
    authDomain: "moodbloom2025.firebaseapp.com",
    projectId: "moodbloom2025",
    storageBucket: "moodbloom2025.firebasestorage.app",
    messagingSenderId: "368604057644",
    appId: "1:368604057644:web:793caaa732578eb8e04189",
    measurementId: "G-MNTJ63RKP6"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Only initialize analytics if in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;