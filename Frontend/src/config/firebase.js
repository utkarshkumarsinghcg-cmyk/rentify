import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAy7tJCjlAVCnC9gvrbnJAhrtT4TwEbPlw",
  authDomain: "rentify-44b99.firebaseapp.com",
  projectId: "rentify-44b99",
  storageBucket: "rentify-44b99.firebasestorage.app",
  messagingSenderId: "29813185887",
  appId: "1:29813185887:web:72f18f1700b013b20e6aea",
  measurementId: "G-L1ZVYGE925"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
