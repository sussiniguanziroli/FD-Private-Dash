// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA0ayx2NFHsZxXauAnffz48prBLNcHAI50",
    authDomain: "facil-digital-3d08f.firebaseapp.com",
    projectId: "facil-digital-3d08f",
    storageBucket: "facil-digital-3d08f.appspot.com",
    messagingSenderId: "997531656416",
    appId: "1:997531656416:web:9de3351466e34dac1ff085",
    measurementId: "G-8ZS2BRNRVL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
