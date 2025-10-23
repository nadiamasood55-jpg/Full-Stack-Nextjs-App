import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbV7lQIUSbqIGFv423RrLcb_AGRJmSG0E",
  authDomain: "nextjs-map-app-ba905.firebaseapp.com",
  projectId: "nextjs-map-app-ba905",
  storageBucket: "nextjs-map-app-ba905.firebasestorage.app",
  messagingSenderId: "50171430851",
  appId: "1:50171430851:web:95f3345469bdc1e9b01f76",
  measurementId: "G-ZDFKD28F11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize reCAPTCHA verifier
export const initializeRecaptcha = (elementId) => {
  if (typeof window !== 'undefined') {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      }
    });
  }
  return null;
};

export default app;

